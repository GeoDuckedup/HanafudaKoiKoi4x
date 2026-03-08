(function attachRtcBridge() {
  const ROOM_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const ROOM_LENGTH = 10;
  const ROOM_CODE_REGEX = /^[A-Z0-9]{10}$/;
  const ROOM_TTL_MS = 2_592_000_000;
  const ROOM_ACTIVITY_TOUCH_MIN_MS = 45_000;
  const ROOM_CREATE_RATE_LIMIT_MS = 30_000;
  const KEEPALIVE_MS = 30_000;
  const AUTH_WAIT_TIMEOUT_MS = 60_000;
  const RTC_SIGNAL_PREFIX = "HKKSIG1.";
  const MAX_MESSAGE_PAYLOAD_LENGTH = 16_000;

  let role = null;
  let roomCode = "";
  let status = "idle";
  let onReceive = null;
  let keepaliveTimer = null;
  let connectedMarkerSent = false;
  let lastRoomActivityTouchAt = 0;
  let sessionStartMs = 0;
  let messageSeq = 0;
  let lastPongAt = 0;
  let presenceRef = null;
  let presenceOnDisconnect = null;

  const fbSubscriptions = [];
  const statusListeners = new Set();
  const heartbeatListeners = new Set();

  function getDbOrThrow() {
    if (!window._firebaseDb) {
      throw new Error("Firebase Realtime Database is not initialized");
    }
    return window._firebaseDb;
  }

  function getAuthOrThrow() {
    if (!window._firebaseAuth) {
      throw new Error("Firebase Auth is not initialized");
    }
    return window._firebaseAuth;
  }

  async function waitForAuthUser() {
    const auth = getAuthOrThrow();
    if (auth.currentUser) return auth.currentUser;
    if (window._firebaseAuthReady && typeof window._firebaseAuthReady.then === "function") {
      try {
        await window._firebaseAuthReady;
      } catch (_err) {
        // Fall through to direct wait.
      }
      if (auth.currentUser) return auth.currentUser;
      if (window._firebaseAuthError) {
        throw new Error(`Anonymous auth failed: ${window._firebaseAuthError}`);
      }
    }
    return new Promise((resolve, reject) => {
      let settled = false;
      const timeoutId = setTimeout(() => {
        if (settled) return;
        settled = true;
        unsubscribe?.();
        reject(new Error("Anonymous auth timed out"));
      }, AUTH_WAIT_TIMEOUT_MS);
      const unsubscribe = auth.onAuthStateChanged(
        (user) => {
          if (settled || !user) return;
          settled = true;
          clearTimeout(timeoutId);
          unsubscribe?.();
          resolve(user);
        },
        (err) => {
          if (settled) return;
          settled = true;
          clearTimeout(timeoutId);
          unsubscribe?.();
          reject(err || new Error("Anonymous auth failed"));
        }
      );
    });
  }

  function normalizeRoomCode(raw) {
    return String(raw || "")
      .trim()
      .toUpperCase()
      .replaceAll(/[^A-Z0-9]/g, "")
      .slice(0, ROOM_LENGTH);
  }

  function assertValidRoomCode(code) {
    if (!ROOM_CODE_REGEX.test(code)) {
      throw new Error(`Room code must be exactly ${ROOM_LENGTH} uppercase letters/numbers`);
    }
  }

  function buildRoomActivityUpdate(nowMs = Date.now()) {
    return {
      lastActiveAt: nowMs,
      expiresAt: nowMs + ROOM_TTL_MS,
      updatedAt: nowMs,
    };
  }

  function isRoomExpired(metadata, nowMs = Date.now()) {
    const expiresAt = Number(metadata?.expiresAt);
    if (!Number.isFinite(expiresAt) || expiresAt <= 0) return true;
    return expiresAt <= nowMs;
  }

  async function readRoomLifecycleMetadataInternal(db, code) {
    const targetCode = normalizeRoomCode(code);
    if (!targetCode) {
      return {
        hostUid: "",
        guestUid: "",
        createdAt: null,
        lastActiveAt: null,
        expiresAt: null,
        connected: false,
        abandoned: false,
        abandonedBy: "",
      };
    }
    const [
      hostUidSnap,
      guestUidSnap,
      createdAtSnap,
      lastActiveAtSnap,
      expiresAtSnap,
      connectedSnap,
      abandonedSnap,
      abandonedBySnap,
    ] = await Promise.all([
      db.ref(`rooms/${targetCode}/hostUid`).once("value"),
      db.ref(`rooms/${targetCode}/guestUid`).once("value"),
      db.ref(`rooms/${targetCode}/createdAt`).once("value"),
      db.ref(`rooms/${targetCode}/lastActiveAt`).once("value"),
      db.ref(`rooms/${targetCode}/expiresAt`).once("value"),
      db.ref(`rooms/${targetCode}/connected`).once("value"),
      db.ref(`rooms/${targetCode}/abandoned`).once("value"),
      db.ref(`rooms/${targetCode}/abandonedBy`).once("value"),
    ]);
    return {
      hostUid: String(hostUidSnap.val() || ""),
      guestUid: String(guestUidSnap.val() || ""),
      createdAt: Number(createdAtSnap.val() || 0) || null,
      lastActiveAt: Number(lastActiveAtSnap.val() || 0) || null,
      expiresAt: Number(expiresAtSnap.val() || 0) || null,
      connected: Boolean(connectedSnap.val()),
      abandoned: Boolean(abandonedSnap.val()),
      abandonedBy: String(abandonedBySnap.val() || ""),
    };
  }

  async function cleanupExpiredRoomIfNeeded(db, code) {
    const targetCode = normalizeRoomCode(code);
    if (!targetCode) return { expired: false, removed: false };
    const metadata = await readRoomLifecycleMetadataInternal(db, targetCode);
    if (!isRoomExpired(metadata)) {
      return { expired: false, removed: false, metadata };
    }
    try {
      await db.ref(`rooms/${targetCode}`).remove();
      return { expired: true, removed: true, metadata };
    } catch (err) {
      console.warn("rtc expired room cleanup failed", { roomCode: targetCode, err });
      return { expired: true, removed: false, metadata };
    }
  }

  async function initializeRoomMetadata(db, options = {}) {
    const { preserveCreatedAt = false } = options;
    if (!roomCode) return;
    const nowMs = Date.now();
    const payload = {
      connected: false,
      ...buildRoomActivityUpdate(nowMs),
    };
    if (!preserveCreatedAt) {
      payload.createdAt = nowMs;
    }
    await db.ref(`rooms/${roomCode}`).update(payload);
    lastRoomActivityTouchAt = nowMs;
  }

  function touchRoomActivity(db, options = {}) {
    const { force = false } = options;
    if (!roomCode) return Promise.resolve(false);
    const nowMs = Date.now();
    if (!force && nowMs - lastRoomActivityTouchAt < ROOM_ACTIVITY_TOUCH_MIN_MS) {
      return Promise.resolve(false);
    }
    lastRoomActivityTouchAt = nowMs;
    return db
      .ref(`rooms/${roomCode}`)
      .update(buildRoomActivityUpdate(nowMs))
      .then(() => true)
      .catch((err) => {
        console.warn("rtc room activity touch failed", err);
        return false;
      });
  }

  function touchRoomActivitySafely(options = {}) {
    if (!roomCode) return;
    try {
      const db = getDbOrThrow();
      touchRoomActivity(db, options).catch(() => {});
    } catch (err) {
      console.warn("rtc room activity touch unavailable", err);
    }
  }

  function markRoomConnected(db) {
    if (connectedMarkerSent || !roomCode) return;
    connectedMarkerSent = true;
    const nowMs = Date.now();
    const payload = {
      connected: true,
      ...buildRoomActivityUpdate(nowMs),
    };
    db
      .ref(`rooms/${roomCode}`)
      .update(payload)
      .then(() => {
        lastRoomActivityTouchAt = nowMs;
      })
      .catch((err) => {
        console.warn("rtc could not mark room connected", err);
      });
  }

  function roomPath(path) {
    return `rooms/${roomCode}/${path}`;
  }

  async function withDbStep(label, operation) {
    try {
      return await operation();
    } catch (err) {
      const reason = err?.message ? String(err.message) : String(err || "unknown error");
      throw new Error(`${label}: ${reason}`);
    }
  }

  function setStatus(next) {
    status = next;
    statusListeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.error("rtc status listener error", err);
      }
    });
  }

  function emitHeartbeat() {
    heartbeatListeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("rtc heartbeat listener error", err);
      }
    });
  }

  function clearKeepalive() {
    if (keepaliveTimer) {
      clearInterval(keepaliveTimer);
    }
    keepaliveTimer = null;
  }

  function getRemoteRole() {
    if (role === "host") return "guest";
    if (role === "guest") return "host";
    return "";
  }

  function decodeSignalTypeFromPayload(payload) {
    const text = String(payload || "");
    if (!text.startsWith(RTC_SIGNAL_PREFIX)) return null;
    const encoded = text.slice(RTC_SIGNAL_PREFIX.length);
    if (!encoded) return null;
    const padded = encoded.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    try {
      const decoded = atob(padded);
      const parsed = JSON.parse(decoded);
      const signalType = String(parsed?.type || "");
      if (signalType === "session-init" || signalType === "turn-code" || signalType === "round-ready") {
        return signalType;
      }
      return null;
    } catch (_err) {
      return null;
    }
  }

  function inferOutgoingMessageType(payload) {
    return decodeSignalTypeFromPayload(payload) || "turn-code";
  }

  function addSubscription(ref, event, callback) {
    ref.on(event, callback);
    fbSubscriptions.push({ ref, event, callback });
  }

  function cleanupSubscriptions() {
    while (fbSubscriptions.length) {
      const sub = fbSubscriptions.pop();
      try {
        sub.ref.off(sub.event, sub.callback);
      } catch (err) {
        console.warn("rtc subscription cleanup failed", err);
      }
    }
  }

  function clearPresenceOnDisconnect() {
    if (presenceOnDisconnect && typeof presenceOnDisconnect.cancel === "function") {
      presenceOnDisconnect.cancel().catch(() => {});
    }
    presenceOnDisconnect = null;
    presenceRef = null;
  }

  function closeSessionOnly() {
    clearKeepalive();
    cleanupSubscriptions();
    clearPresenceOnDisconnect();
    onReceive = null;
    connectedMarkerSent = false;
    messageSeq = 0;
    lastPongAt = 0;
    sessionStartMs = 0;
  }

  function writeRelayMessage(type, payload, options = {}) {
    if (!roomCode || !role) return false;
    const { allowWhileConnecting = false, touchActivity = true } = options;
    if (!allowWhileConnecting && status !== "connected") return false;

    const messagePayload = String(payload || "");
    if (messagePayload.length > MAX_MESSAGE_PAYLOAD_LENGTH) {
      console.warn("rtc relay message too large", { length: messagePayload.length });
      return false;
    }

    let db = null;
    try {
      db = getDbOrThrow();
    } catch (err) {
      console.warn("rtc relay send unavailable", err);
      return false;
    }

    messageSeq += 1;
    const serverTimestamp = window.firebase?.database?.ServerValue?.TIMESTAMP ?? Date.now();
    db.ref(roomPath("messages"))
      .push({
        from: role,
        type,
        payload: messagePayload,
        seq: messageSeq,
        ts: serverTimestamp,
      })
      .then(() => {
        if (touchActivity) {
          touchRoomActivity(db).catch(() => {});
        }
      })
      .catch((err) => {
        console.warn("rtc relay send failed", err);
        if (status === "connected") {
          setStatus("error");
        }
      });

    return true;
  }

  function markConnectedFromRemoteMessage(db) {
    lastPongAt = Date.now();
    if (status === "connected") return;
    setStatus("connected");
    markRoomConnected(db);
  }

  function handleIncomingRelayMessage(snapshot) {
    if (!snapshot || typeof snapshot.val !== "function") return;
    const message = snapshot.val();
    if (!message || typeof message !== "object") return;

    const from = String(message.from || "");
    if (!from || from !== getRemoteRole()) return;

    const type = String(message.type || "");
    const payload = typeof message.payload === "string" ? message.payload : "";

    let db = null;
    try {
      db = getDbOrThrow();
    } catch (_err) {
      db = null;
    }

    if (db) {
      markConnectedFromRemoteMessage(db);
      touchRoomActivity(db).catch(() => {});
    }

    if (type === "ping") {
      emitHeartbeat();
      writeRelayMessage("pong", "__pong", { allowWhileConnecting: true });
      return;
    }

    if (type === "pong") {
      emitHeartbeat();
      return;
    }

    if (onReceive) {
      onReceive(payload);
    }
  }

  function subscribeRelayListeners(db) {
    const messagesQuery = db.ref(roomPath("messages")).orderByChild("ts").startAt(sessionStartMs);
    addSubscription(messagesQuery, "child_added", handleIncomingRelayMessage);

    const connectedRef = db.ref(".info/connected");
    addSubscription(connectedRef, "value", (snapshot) => {
      if (!roomCode || !role) return;
      const connected = Boolean(snapshot.val());
      if (!connected && (status === "connecting" || status === "connected")) {
        setStatus("disconnected");
      }
    });
  }

  function startKeepalive() {
    clearKeepalive();
    keepaliveTimer = setInterval(() => {
      if (!roomCode || !role) return;
      const nowMs = Date.now();
      if (status === "connected" && lastPongAt > 0 && nowMs - lastPongAt > KEEPALIVE_MS * 2) {
        setStatus("disconnected");
      }
      writeRelayMessage("ping", "__ping", { allowWhileConnecting: true });
    }, KEEPALIVE_MS);
  }

  async function setupPresence(db) {
    if (!roomCode || !role) return;
    const nextPresenceRef = db.ref(roomPath(`presence/${role}`));
    await nextPresenceRef.set(true);
    presenceRef = nextPresenceRef;
    try {
      const disconnectHandle = nextPresenceRef.onDisconnect();
      await disconnectHandle.remove();
      presenceOnDisconnect = disconnectHandle;
    } catch (err) {
      console.warn("rtc presence onDisconnect setup failed", err);
    }
  }

  function beginSession(nextRole, normalizedRoomCode, onReceiveCallback) {
    closeSessionOnly();
    role = nextRole;
    roomCode = normalizedRoomCode;
    onReceive = onReceiveCallback;
    sessionStartMs = Date.now();
    messageSeq = 0;
    lastPongAt = Date.now();
    connectedMarkerSent = false;
    lastRoomActivityTouchAt = 0;
    setStatus("connecting");
  }

  async function hostRoom(inputRoomCode, onReceiveCallback) {
    const db = getDbOrThrow();
    const authUser = await waitForAuthUser();
    const normalized = normalizeRoomCode(inputRoomCode);
    assertValidRoomCode(normalized);

    await withDbStep("Cleanup expired room", () => cleanupExpiredRoomIfNeeded(db, normalized));
    const existingMetadata = await withDbStep("Read room metadata", () => readRoomLifecycleMetadataInternal(db, normalized));
    if (existingMetadata.hostUid && existingMetadata.hostUid !== authUser.uid) {
      throw new Error("Room code already in use. Try another room code.");
    }
    const rateLimitSnapshot = await withDbStep("Read host rate limit", () =>
      db.ref(`rateLimits/roomCreation/${authUser.uid}`).once("value")
    );
    const lastCreateAt = Number(rateLimitSnapshot?.val() || 0);
    const elapsedMs = Date.now() - lastCreateAt;
    if (lastCreateAt > 0 && elapsedMs < ROOM_CREATE_RATE_LIMIT_MS) {
      const waitSeconds = Math.max(1, Math.ceil((ROOM_CREATE_RATE_LIMIT_MS - elapsedMs) / 1000));
      throw new Error(`Please wait ${waitSeconds}s before creating another room.`);
    }

    beginSession("host", normalized, onReceiveCallback);

    try {
      await withDbStep("Set hostUid", () => db.ref(roomPath("hostUid")).set(authUser.uid));
      await withDbStep("Initialize room metadata", () =>
        initializeRoomMetadata(db, { preserveCreatedAt: Boolean(existingMetadata.createdAt) })
      );
      await withDbStep("Clear abandoned", () => db.ref(roomPath("abandoned")).remove());
      await withDbStep("Clear abandonedBy", () => db.ref(roomPath("abandonedBy")).remove());
      await withDbStep("Clear guestUid", () => db.ref(roomPath("guestUid")).remove());
      await withDbStep("Clear messages", () => db.ref(roomPath("messages")).remove());
      await withDbStep("Set connected false", () => db.ref(roomPath("connected")).set(false));
      await withDbStep("Refresh room activity", () => touchRoomActivity(db, { force: true }));
      await withDbStep("Set host presence", () => setupPresence(db));
      await withDbStep("Write room creation rate limit", () => {
        const serverTimestamp = window.firebase?.database?.ServerValue?.TIMESTAMP ?? Date.now();
        return db.ref(`rateLimits/roomCreation/${authUser.uid}`).set(serverTimestamp);
      });

      subscribeRelayListeners(db);
      startKeepalive();
      writeRelayMessage("ping", "__ping", { allowWhileConnecting: true });
      return true;
    } catch (err) {
      console.warn("rtc hostRoom failed", err);
      closeSessionOnly();
      role = null;
      roomCode = "";
      setStatus("error");
      throw err;
    }
  }

  async function joinRoom(inputRoomCode, onReceiveCallback) {
    const db = getDbOrThrow();
    const authUser = await waitForAuthUser();
    const normalized = normalizeRoomCode(inputRoomCode);
    assertValidRoomCode(normalized);

    const existingMetadata = await withDbStep("Read room metadata", () => readRoomLifecycleMetadataInternal(db, normalized));
    if (isRoomExpired(existingMetadata)) {
      await withDbStep("Cleanup expired room", () => cleanupExpiredRoomIfNeeded(db, normalized));
      throw new Error("Room has expired. Ask host to create a new room.");
    }
    const hostUid = String(existingMetadata.hostUid || "");
    if (!hostUid) {
      throw new Error("Host room not found. Ask host to create a new room.");
    }
    if (existingMetadata.abandoned) {
      const abandonedBy = String(existingMetadata.abandonedBy || "");
      if (abandonedBy === "host") {
        throw new Error("Host has left this room. Ask your friend to host a new room.");
      }
      throw new Error("This room was closed. Ask your friend to host a new room.");
    }
    if (hostUid === authUser.uid) {
      throw new Error(
        "This browser is already the host for that room. To test both players yourself, use a different browser or a private/incognito window."
      );
    }

    const guestUidRef = db.ref(`rooms/${normalized}/guestUid`);
    const guestUidResult = await withDbStep("Claim guestUid", () =>
      guestUidRef.transaction((current) => {
        if (current === null || current === authUser.uid) return authUser.uid;
        return current;
      })
    );
    if (!guestUidResult.committed || guestUidResult.snapshot.val() !== authUser.uid) {
      throw new Error("Room is full. Ask host to create a new room.");
    }

    beginSession("guest", normalized, onReceiveCallback);

    try {
      await withDbStep("Refresh room activity", () => touchRoomActivity(db, { force: true }));
      await withDbStep("Set guest presence", () => setupPresence(db));
      subscribeRelayListeners(db);
      startKeepalive();
      writeRelayMessage("ping", "__ping", { allowWhileConnecting: true });
      return true;
    } catch (err) {
      console.warn("rtc joinRoom failed", err);
      db.ref(`rooms/${normalized}/guestUid`).remove().catch(() => {});
      closeSessionOnly();
      role = null;
      roomCode = "";
      setStatus("error");
      throw err;
    }
  }

  function sendTurnCode(code) {
    const payload = String(code || "");
    if (!payload) return false;
    const type = inferOutgoingMessageType(payload);
    const sent = writeRelayMessage(type, payload, { allowWhileConnecting: false });
    if (sent) {
      touchRoomActivitySafely();
    }
    return sent;
  }

  async function writeSnapshot(stateString, turnIndex) {
    if (!roomCode) return false;
    const payload = String(stateString || "");
    if (!payload) {
      console.warn("rtc writeSnapshot skipped: empty state payload");
      return false;
    }
    const normalizedTurnIndex = Math.max(0, Math.floor(Number(turnIndex) || 0));
    let db = null;
    try {
      db = getDbOrThrow();
    } catch (err) {
      console.warn("rtc writeSnapshot unavailable", err);
      return false;
    }
    try {
      const serverTimestamp = window.firebase?.database?.ServerValue?.TIMESTAMP ?? Date.now();
      await db.ref(roomPath("snapshot")).set({
        state: payload,
        turnIndex: normalizedTurnIndex,
        updatedAt: serverTimestamp,
      });
      touchRoomActivity(db).catch(() => {});
      return true;
    } catch (err) {
      console.warn("rtc writeSnapshot failed", err);
      return false;
    }
  }

  async function readSnapshot() {
    if (!roomCode) return null;
    let db = null;
    try {
      db = getDbOrThrow();
    } catch (err) {
      console.warn("rtc readSnapshot unavailable", err);
      return null;
    }
    try {
      const snapshotNode = await db.ref(roomPath("snapshot")).once("value");
      const payload = snapshotNode?.val();
      if (!payload || typeof payload !== "object") return null;
      if (typeof payload.state !== "string" || !payload.state.trim()) return null;
      if (!Number.isFinite(Number(payload.turnIndex))) return null;
      return {
        state: payload.state,
        turnIndex: Math.max(0, Math.floor(Number(payload.turnIndex))),
      };
    } catch (err) {
      console.warn("rtc readSnapshot failed", err);
      return null;
    }
  }

  async function removeRoom(inputRoomCode) {
    const db = getDbOrThrow();
    await waitForAuthUser();
    const normalized = normalizeRoomCode(inputRoomCode);
    if (!normalized) return false;
    assertValidRoomCode(normalized);
    try {
      await db.ref(`rooms/${normalized}`).remove();
      return true;
    } catch (err) {
      console.warn("rtc removeRoom failed", err);
      return false;
    }
  }

  async function rejoinRoom(inputRoomCode, inputRole, onReceiveCallback) {
    const db = getDbOrThrow();
    const authUser = await waitForAuthUser();
    const normalized = normalizeRoomCode(inputRoomCode);
    const normalizedRole = inputRole === "host" || inputRole === "guest" ? inputRole : "";
    if (!normalizedRole) {
      throw new Error("Invalid role for rejoin. Expected host or guest.");
    }
    assertValidRoomCode(normalized);

    const existingMetadata = await withDbStep("Read room metadata", () => readRoomLifecycleMetadataInternal(db, normalized));
    if (isRoomExpired(existingMetadata)) {
      await withDbStep("Cleanup expired room", () => cleanupExpiredRoomIfNeeded(db, normalized));
      throw new Error("Room has expired.");
    }
    if (existingMetadata.abandoned) {
      const abandonedBy = String(existingMetadata.abandonedBy || "");
      if (abandonedBy === "host") {
        throw new Error("Room has been closed by host.");
      }
      if (abandonedBy === "guest") {
        throw new Error("Room has been closed by guest.");
      }
      throw new Error("Room has been closed.");
    }
    if (normalizedRole === "host") {
      if (!existingMetadata.hostUid || String(existingMetadata.hostUid) !== authUser.uid) {
        throw new Error("Rejoin denied for host role.");
      }
    } else if (!existingMetadata.guestUid || String(existingMetadata.guestUid) !== authUser.uid) {
      throw new Error("Rejoin denied for guest role.");
    }

    beginSession(normalizedRole, normalized, onReceiveCallback);

    try {
      await withDbStep("Clear messages", () => db.ref(roomPath("messages")).remove());
      await withDbStep("Refresh room activity", () => touchRoomActivity(db, { force: true }));
      await withDbStep("Set rejoin presence", () => setupPresence(db));
      subscribeRelayListeners(db);
      startKeepalive();
      setStatus("connected");
      markRoomConnected(db);
      writeRelayMessage("ping", "__ping", { allowWhileConnecting: true });
      const snapshot = await readSnapshot();
      return snapshot;
    } catch (err) {
      console.warn("rtc rejoinRoom failed", err);
      closeSessionOnly();
      role = null;
      roomCode = "";
      setStatus("error");
      throw err;
    }
  }

  function cleanupRoomDataOnClose(prevRole, prevRoomCode) {
    if (!prevRoomCode) return;
    try {
      const db = getDbOrThrow();
      if (prevRole === "host" || prevRole === "guest") {
        db.ref(`rooms/${prevRoomCode}/messages`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/connected`).set(false).catch(() => {});
        db.ref(`rooms/${prevRoomCode}/presence/${prevRole}`).remove().catch(() => {});
        const nowMs = Date.now();
        db.ref(`rooms/${prevRoomCode}/lastActiveAt`).set(nowMs).catch(() => {});
        db.ref(`rooms/${prevRoomCode}/expiresAt`).set(nowMs + ROOM_TTL_MS).catch(() => {});
        db.ref(`rooms/${prevRoomCode}/updatedAt`).set(nowMs).catch(() => {});
      }
    } catch (_err) {
      // Ignore cleanup errors on close.
    }
  }

  function closeRoom() {
    const prevRole = role;
    const prevRoomCode = roomCode;
    closeSessionOnly();
    cleanupRoomDataOnClose(prevRole, prevRoomCode);
    role = null;
    roomCode = "";
    sessionStartMs = 0;
    messageSeq = 0;
    lastPongAt = 0;
    lastRoomActivityTouchAt = 0;
    setStatus("idle");
  }

  async function writeAbandoned(nextRole = role, roomCodeOverride = "") {
    const db = getDbOrThrow();
    await waitForAuthUser();
    const normalizedRole = nextRole === "host" || nextRole === "guest" ? nextRole : role;
    const targetRoomCode = normalizeRoomCode(roomCodeOverride || roomCode);
    if (!targetRoomCode || !normalizedRole) return false;
    const nowMs = Date.now();
    const payload = {
      abandoned: true,
      abandonedBy: normalizedRole,
      connected: false,
      ...buildRoomActivityUpdate(nowMs),
    };
    try {
      await db.ref(`rooms/${targetRoomCode}`).update(payload);
      if (targetRoomCode === roomCode) {
        lastRoomActivityTouchAt = nowMs;
      }
      return true;
    } catch (err) {
      console.warn("rtc writeAbandoned failed", err);
      return false;
    }
  }

  function createRoomCode() {
    const cryptoApi = window.crypto || globalThis.crypto;
    if (!cryptoApi?.getRandomValues) {
      throw new Error("Secure random source unavailable");
    }
    const bytes = new Uint8Array(ROOM_LENGTH);
    cryptoApi.getRandomValues(bytes);
    let next = "";
    for (let i = 0; i < ROOM_LENGTH; i += 1) {
      next += ROOM_ALPHABET[bytes[i] % ROOM_ALPHABET.length];
    }
    return next;
  }

  function onStatusChange(listener) {
    if (typeof listener !== "function") {
      return () => {};
    }
    statusListeners.add(listener);
    listener(status);
    return () => {
      statusListeners.delete(listener);
    };
  }

  function onHeartbeat(listener) {
    if (typeof listener !== "function") {
      return () => {};
    }
    heartbeatListeners.add(listener);
    return () => {
      heartbeatListeners.delete(listener);
    };
  }

  window.rtcBridge = {
    createRoomCode,
    hostRoom,
    joinRoom,
    sendTurnCode,
    writeSnapshot,
    readSnapshot,
    closeRoom,
    writeAbandoned,
    removeRoom,
    rejoinRoom,
    async readRoomLifecycleMetadata(inputRoomCode) {
      const db = getDbOrThrow();
      await waitForAuthUser();
      const normalized = normalizeRoomCode(inputRoomCode);
      if (!normalized) return null;
      return readRoomLifecycleMetadataInternal(db, normalized);
    },
    onStatusChange,
    onHeartbeat,
    getStatus() {
      return status;
    },
    getRoomCode() {
      return roomCode;
    },
    getRole() {
      return role;
    },
  };
})();
