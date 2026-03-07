(function attachRtcBridge() {
  const ROOM_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const ROOM_LENGTH = 10;
  const ROOM_CODE_REGEX = /^[A-Z0-9]{10}$/;
  const ROOM_TTL_MS = 60 * 60 * 1000;
  const ROOM_ACTIVITY_TOUCH_MIN_MS = 45_000;
  const KEEPALIVE_MS = 30_000;
  const AUTH_WAIT_TIMEOUT_MS = 60_000;
  const MAX_SDP_LENGTH = 200_000;
  const MAX_CANDIDATE_LENGTH = 8_000;
  const RTC_CONFIG = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  let peer = null;
  let channel = null;
  let role = null;
  let roomCode = "";
  let status = "idle";
  let onReceive = null;
  let keepaliveTimer = null;
  let connectedMarkerSent = false;
  let lastRoomActivityTouchAt = 0;
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

  async function readRoomLifecycleMetadata(db, code) {
    const targetCode = normalizeRoomCode(code);
    if (!targetCode) {
      return {
        hostUid: "",
        guestUid: "",
        createdAt: null,
        lastActiveAt: null,
        expiresAt: null,
        connected: false,
      };
    }
    const [hostUidSnap, guestUidSnap, createdAtSnap, lastActiveAtSnap, expiresAtSnap, connectedSnap] = await Promise.all([
      db.ref(`rooms/${targetCode}/hostUid`).once("value"),
      db.ref(`rooms/${targetCode}/guestUid`).once("value"),
      db.ref(`rooms/${targetCode}/createdAt`).once("value"),
      db.ref(`rooms/${targetCode}/lastActiveAt`).once("value"),
      db.ref(`rooms/${targetCode}/expiresAt`).once("value"),
      db.ref(`rooms/${targetCode}/connected`).once("value"),
    ]);
    return {
      hostUid: String(hostUidSnap.val() || ""),
      guestUid: String(guestUidSnap.val() || ""),
      createdAt: Number(createdAtSnap.val() || 0) || null,
      lastActiveAt: Number(lastActiveAtSnap.val() || 0) || null,
      expiresAt: Number(expiresAtSnap.val() || 0) || null,
      connected: Boolean(connectedSnap.val()),
    };
  }

  async function cleanupExpiredRoomIfNeeded(db, code) {
    const targetCode = normalizeRoomCode(code);
    if (!targetCode) return { expired: false, removed: false };
    const metadata = await readRoomLifecycleMetadata(db, targetCode);
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

  function normalizeSessionDescription(raw, expectedType) {
    if (!raw || typeof raw !== "object") return null;
    const type = String(raw.type || "");
    const sdp = typeof raw.sdp === "string" ? raw.sdp : "";
    if (type !== expectedType || !sdp || sdp.length > MAX_SDP_LENGTH) return null;
    return { type, sdp };
  }

  function normalizeIceCandidate(raw) {
    if (!raw || typeof raw !== "object") return null;
    const candidate = typeof raw.candidate === "string" ? raw.candidate.trim() : "";
    if (!candidate || candidate.length > MAX_CANDIDATE_LENGTH) return null;
    const next = { candidate };
    if (typeof raw.sdpMid === "string" && raw.sdpMid.length <= 64) {
      next.sdpMid = raw.sdpMid;
    }
    if (Number.isInteger(raw.sdpMLineIndex) && raw.sdpMLineIndex >= 0 && raw.sdpMLineIndex <= 64) {
      next.sdpMLineIndex = raw.sdpMLineIndex;
    }
    if (typeof raw.usernameFragment === "string" && raw.usernameFragment.length <= 128) {
      next.usernameFragment = raw.usernameFragment;
    }
    return next;
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

  function startKeepalive() {
    clearKeepalive();
    keepaliveTimer = setInterval(() => {
      if (channel && channel.readyState === "open") {
        try {
          channel.send("__ping");
          touchRoomActivitySafely();
        } catch (err) {
          console.warn("rtc keepalive send failed", err);
        }
      }
    }, KEEPALIVE_MS);
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

  function closePeerOnly() {
    clearKeepalive();
    cleanupSubscriptions();
    if (channel) {
      try {
        channel.onopen = null;
        channel.onclose = null;
        channel.onerror = null;
        channel.onmessage = null;
        channel.close();
      } catch (err) {
        console.warn("rtc channel close failed", err);
      }
    }
    channel = null;
    if (peer) {
      try {
        peer.onicecandidate = null;
        peer.ondatachannel = null;
        peer.onconnectionstatechange = null;
        peer.oniceconnectionstatechange = null;
        peer.close();
      } catch (err) {
        console.warn("rtc peer close failed", err);
      }
    }
    peer = null;
    onReceive = null;
    connectedMarkerSent = false;
  }

  function addSubscription(ref, event, callback) {
    ref.on(event, callback);
    fbSubscriptions.push({ ref, event, callback });
  }

  function addRemoteIceCandidate(snapshot) {
    const raw = snapshot && typeof snapshot.val === "function" ? snapshot.val() : snapshot;
    const candidate = normalizeIceCandidate(raw);
    if (!candidate || !peer) return;
    touchRoomActivitySafely();
    peer.addIceCandidate(new RTCIceCandidate(candidate)).catch((err) => {
      console.warn("rtc addIceCandidate failed", err);
    });
  }

  function wireChannel(nextChannel) {
    channel = nextChannel;
    channel.onopen = () => {
      setStatus("connected");
      try {
        const db = getDbOrThrow();
        markRoomConnected(db);
      } catch (err) {
        console.warn("rtc could not mark room connected", err);
      }
      startKeepalive();
    };
    channel.onclose = () => {
      clearKeepalive();
      setStatus("disconnected");
    };
    channel.onerror = () => {
      setStatus("error");
    };
    channel.onmessage = (event) => {
      const payload = String(event?.data || "");
      if (payload === "__ping") {
        emitHeartbeat();
        touchRoomActivitySafely();
        if (channel && channel.readyState === "open") {
          channel.send("__pong");
        }
        return;
      }
      if (payload === "__pong") {
        emitHeartbeat();
        touchRoomActivitySafely();
        return;
      }
      touchRoomActivitySafely();
      if (onReceive) {
        onReceive(payload);
      }
    };
  }

  function wirePeerBase(nextRole, room, onReceiveCallback) {
    closePeerOnly();
    role = nextRole;
    roomCode = room;
    onReceive = onReceiveCallback;
    setStatus("connecting");
    peer = new RTCPeerConnection(RTC_CONFIG);
    peer.onconnectionstatechange = () => {
      if (!peer) return;
      if (peer.connectionState === "failed") {
        setStatus("error");
      } else if (peer.connectionState === "disconnected" || peer.connectionState === "closed") {
        setStatus("disconnected");
      }
    };
    peer.oniceconnectionstatechange = () => {
      if (!peer) return;
      if (peer.iceConnectionState === "failed") {
        setStatus("error");
      }
    };
  }

  async function hostRoom(inputRoomCode, onReceiveCallback) {
    const db = getDbOrThrow();
    const authUser = await waitForAuthUser();
    const normalized = normalizeRoomCode(inputRoomCode);
    assertValidRoomCode(normalized);
    await withDbStep("Cleanup expired room", () => cleanupExpiredRoomIfNeeded(db, normalized));
    const existingMetadata = await withDbStep("Read room metadata", () => readRoomLifecycleMetadata(db, normalized));
    const existingHostUid = existingMetadata.hostUid;
    if (existingHostUid && existingHostUid !== authUser.uid) {
      throw new Error("Room code already in use. Try another room code.");
    }
    wirePeerBase("host", normalized, onReceiveCallback);
    lastRoomActivityTouchAt = 0;
    wireChannel(peer.createDataChannel("game"));
    peer.onicecandidate = (event) => {
      if (!event.candidate) return;
      const payload = normalizeIceCandidate(event.candidate.toJSON());
      if (!payload) return;
      db.ref(roomPath("ice-h"))
        .push(payload)
        .then(() => touchRoomActivity(db))
        .catch((err) => {
          console.warn("rtc host ICE push failed", err);
        });
    };

    await withDbStep("Set hostUid", () => db.ref(roomPath("hostUid")).set(authUser.uid));
    await withDbStep("Initialize room metadata", () =>
      initializeRoomMetadata(db, { preserveCreatedAt: Boolean(existingMetadata.createdAt) })
    );
    await withDbStep("Clear guestUid", () => db.ref(roomPath("guestUid")).remove());
    await withDbStep("Clear offer", () => db.ref(roomPath("offer")).remove());
    await withDbStep("Clear answer", () => db.ref(roomPath("answer")).remove());
    await withDbStep("Clear ice-h", () => db.ref(roomPath("ice-h")).remove());
    await withDbStep("Clear ice-g", () => db.ref(roomPath("ice-g")).remove());
    await withDbStep("Clear connected", () => db.ref(roomPath("connected")).set(false));
    await withDbStep("Refresh room activity", () => touchRoomActivity(db, { force: true }));

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const offerPayload = normalizeSessionDescription({ type: offer.type, sdp: offer.sdp }, "offer");
    if (!offerPayload) {
      throw new Error("Failed to create a valid SDP offer");
    }
    await withDbStep("Write offer", () => db.ref(roomPath("offer")).set(offerPayload));
    await withDbStep("Refresh room activity", () => touchRoomActivity(db, { force: true }));

    const answerRef = db.ref(roomPath("answer"));
    const answerListener = (snapshot) => {
      const answer = normalizeSessionDescription(snapshot.val(), "answer");
      if (!answer || !peer) return;
      if (peer.signalingState !== "have-local-offer") return;
      peer.setRemoteDescription(new RTCSessionDescription(answer)).catch((err) => {
        console.warn("rtc host setRemoteDescription failed", err);
      });
    };
    addSubscription(answerRef, "value", answerListener);

    const guestIceRef = db.ref(roomPath("ice-g"));
    addSubscription(guestIceRef, "child_added", addRemoteIceCandidate);
    return true;
  }

  async function joinRoom(inputRoomCode, onReceiveCallback) {
    const db = getDbOrThrow();
    const authUser = await waitForAuthUser();
    const normalized = normalizeRoomCode(inputRoomCode);
    assertValidRoomCode(normalized);
    const existingMetadata = await withDbStep("Read room metadata", () => readRoomLifecycleMetadata(db, normalized));
    if (isRoomExpired(existingMetadata)) {
      await withDbStep("Cleanup expired room", () => cleanupExpiredRoomIfNeeded(db, normalized));
      throw new Error("Room has expired. Ask host to create a new room.");
    }
    const hostUid = String(existingMetadata.hostUid || "");
    if (!hostUid) {
      throw new Error("Host room not found. Ask host to create a new room.");
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
    wirePeerBase("guest", normalized, onReceiveCallback);
    lastRoomActivityTouchAt = 0;
    await withDbStep("Refresh room activity", () => touchRoomActivity(db, { force: true }));
    peer.ondatachannel = (event) => {
      wireChannel(event.channel);
    };
    peer.onicecandidate = (event) => {
      if (!event.candidate) return;
      const payload = normalizeIceCandidate(event.candidate.toJSON());
      if (!payload) return;
      db.ref(roomPath("ice-g"))
        .push(payload)
        .then(() => touchRoomActivity(db))
        .catch((err) => {
          console.warn("rtc guest ICE push failed", err);
        });
    };

    const offerSnapshot = await withDbStep("Read offer", () => db.ref(roomPath("offer")).once("value"));
    const offer = normalizeSessionDescription(offerSnapshot.val(), "offer");
    if (!offer) {
      throw new Error("Host offer not found. Ask host to recreate the room.");
    }
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const answerPayload = normalizeSessionDescription({ type: answer.type, sdp: answer.sdp }, "answer");
    if (!answerPayload) {
      throw new Error("Failed to create a valid SDP answer");
    }
    await withDbStep("Write answer", () => db.ref(roomPath("answer")).set(answerPayload));
    await withDbStep("Refresh room activity", () => touchRoomActivity(db, { force: true }));

    const hostIceRef = db.ref(roomPath("ice-h"));
    addSubscription(hostIceRef, "child_added", addRemoteIceCandidate);
    return true;
  }

  function sendTurnCode(code) {
    if (!channel || channel.readyState !== "open") return false;
    try {
      channel.send(String(code || ""));
      touchRoomActivitySafely();
      return true;
    } catch (err) {
      console.warn("rtc send failed", err);
      return false;
    }
  }

  function cleanupRoomDataOnClose(prevRole, prevRoomCode) {
    if (!prevRoomCode) return;
    try {
      const db = getDbOrThrow();
      if (prevRole === "host") {
        db.ref(`rooms/${prevRoomCode}/offer`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/answer`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/ice-h`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/ice-g`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/connected`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/guestUid`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/hostUid`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/createdAt`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/lastActiveAt`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/expiresAt`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/updatedAt`).remove().catch(() => {});
        return;
      }
      if (prevRole === "guest") {
        db.ref(`rooms/${prevRoomCode}/answer`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/ice-g`).remove().catch(() => {});
        db.ref(`rooms/${prevRoomCode}/connected`).set(false).catch(() => {});
        db.ref(`rooms/${prevRoomCode}/guestUid`).remove().catch(() => {});
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
    closePeerOnly();
    cleanupRoomDataOnClose(prevRole, prevRoomCode);
    role = null;
    roomCode = "";
    lastRoomActivityTouchAt = 0;
    setStatus("idle");
  }

  function createRoomCode() {
    let next = "";
    for (let i = 0; i < ROOM_LENGTH; i += 1) {
      next += ROOM_ALPHABET[Math.floor(Math.random() * ROOM_ALPHABET.length)];
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
    closeRoom,
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
