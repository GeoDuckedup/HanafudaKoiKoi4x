(function attachOnlineSessionController() {
  let reconnectLockInFlight = false;

  function createOnlineSessionController(deps) {
    const {
      state,
      isFriendMode,
      getRtcBridge,
      setFriendInterstitialOpen,
      setFriendInterstitialStatus,
      encodeStateToCode,
      encodeBase64UrlUtf8,
      decodeBase64UrlUtf8,
      RTC_SIGNAL_PREFIX,
      startNewMatch,
      hideStartMenu,
      addSystemLog,
      renderAll,
      loadCodeIntoGame,
      asNullablePlayerIndex,
      asInt,
      isRoundTransitionReadyForAdvance,
      onNextGame,
      persistOnlineSessionContext,
      onRtcReceiveTurnCode,
    } = deps;
    const utils = window.HKKUtils;
    if (!utils || typeof utils.computeCodeChecksum !== "function") {
      throw new Error("Utils bootstrap not loaded.");
    }
    const onlineStateSyncBootstrap = window.HKKOnlineStateSync;
    if (!onlineStateSyncBootstrap || typeof onlineStateSyncBootstrap.createOnlineStateSync !== "function") {
      throw new Error("Online state-sync bootstrap not loaded.");
    }
    const PRESENCE_PATIENCE_MS = 5 * 60 * 1000;
    const RECONNECT_TIMEOUT_MS = 30_000;

    let remotePresenceRef = null;
    let remotePresenceListener = null;
    let remotePresenceTimeoutId = null;
    let remoteAbandonedRef = null;
    let remoteAbandonedListener = null;
    let remoteAbandonedByRef = null;
    let remoteAbandonedByListener = null;
    let remoteRoomAbandoned = false;
    let stateSync = null;

    function isOnlineFriendSessionActive() {
      return isFriendMode() && Boolean(state.rtcRole && state.rtcRoomCode);
    }

    function getOnlineLocalPlayerIndex() {
      if (!isOnlineFriendSessionActive()) return null;
      if (state.rtcRole === "host") return 0;
      if (state.rtcRole === "guest") return 1;
      return null;
    }

    function getOnlineRemoteRole() {
      if (state.rtcRole === "host") return "guest";
      if (state.rtcRole === "guest") return "host";
      return null;
    }

    function describeTurnOwnerForDebug(owner = state.currentPlayer) {
      if (owner !== 0 && owner !== 1) return "none";
      const playerName = state.players?.[owner]?.name || `P${owner + 1}`;
      return `${owner} (${playerName})`;
    }

    function debugOnlineInit(event, details = {}) {
      console.info("[online-init]", event, {
        localRole: state.rtcRole || "none",
        remoteRole: getOnlineRemoteRole() || "none",
        currentTurnOwner: describeTurnOwnerForDebug(),
        ...details,
      });
    }

    function getOnlineRoleAssignmentDebug() {
      return {
        hostPlayerIndex: 0,
        guestPlayerIndex: 1,
      };
    }

    function getOnlineStartupDebugState(extra = {}) {
      return {
        rtcRole: state.rtcRole || "none",
        dealer: state.dealer,
        currentPlayer: state.currentPlayer,
        viewerPlayerIndex: state.viewerPlayerIndex,
        ...getOnlineRoleAssignmentDebug(),
        ...extra,
      };
    }

    function warnOnlineStartupInvariant(message, reason) {
      console.warn("[online-startup]", message, getOnlineStartupDebugState({ reason }));
    }

    function assertOnlineRoleMapping(reason) {
      if (!isOnlineFriendSessionActive()) return;
      const localPlayerIndex = getOnlineLocalPlayerIndex();
      if (state.rtcRole === "host" && localPlayerIndex !== 0) {
        warnOnlineStartupInvariant("Host role mapped to non-zero local player index.", reason);
      }
      if (state.rtcRole === "guest" && localPlayerIndex !== 1) {
        warnOnlineStartupInvariant("Guest role mapped to non-one local player index.", reason);
      }
    }

    function enforceInitialOnlineStartupState(reason) {
      if (!isOnlineFriendSessionActive()) return;
      state.dealer = 0;
      state.currentPlayer = 0;
      state.viewerPlayerIndex = state.rtcRole === "guest" ? 1 : 0;
      assertOnlineRoleMapping(`${reason}-role-check`);
      debugOnlineInit("online-startup-state-forced", getOnlineStartupDebugState({ reason }));
    }

    function createOnlineStateSyncController() {
      return onlineStateSyncBootstrap.createOnlineStateSync({
        state,
        isOnlineFriendSessionActive,
        getOnlineLocalPlayerIndex,
        setFriendInterstitialOpen,
        setFriendInterstitialStatus,
        renderAll,
        loadCodeIntoGame,
      });
    }

    function applyOnlineWaitingStateFromCurrentTurn(reason) {
      if (!stateSync) return;
      stateSync.applyOnlineWaitingStateFromCurrentTurn(reason);
      debugOnlineInit("waiting-state", { active: !state.rtcWaiting, reason });
    }

    function clearPresencePatienceTimer() {
      if (remotePresenceTimeoutId) {
        clearTimeout(remotePresenceTimeoutId);
      }
      remotePresenceTimeoutId = null;
    }

    function clearRemotePresenceSubscription() {
      clearPresencePatienceTimer();
      if (remotePresenceRef && remotePresenceListener) {
        try {
          remotePresenceRef.off("value", remotePresenceListener);
        } catch (err) {
          console.warn("online presence unsubscribe failed", err);
        }
      }
      remotePresenceRef = null;
      remotePresenceListener = null;
    }

    function clearRemoteAbandonmentSubscription() {
      if (remoteAbandonedRef && remoteAbandonedListener) {
        try {
          remoteAbandonedRef.off("value", remoteAbandonedListener);
        } catch (err) {
          console.warn("online abandoned unsubscribe failed", err);
        }
      }
      if (remoteAbandonedByRef && remoteAbandonedByListener) {
        try {
          remoteAbandonedByRef.off("value", remoteAbandonedByListener);
        } catch (err) {
          console.warn("online abandonedBy unsubscribe failed", err);
        }
      }
      remoteAbandonedRef = null;
      remoteAbandonedListener = null;
      remoteAbandonedByRef = null;
      remoteAbandonedByListener = null;
      remoteRoomAbandoned = false;
    }

    function schedulePresencePatienceNotice() {
      clearPresencePatienceTimer();
      if (!state.rtcPresenceMissingSince) return;
      const elapsedMs = Date.now() - Number(state.rtcPresenceMissingSince || 0);
      const delayMs = Math.max(0, PRESENCE_PATIENCE_MS - elapsedMs);
      remotePresenceTimeoutId = setTimeout(() => {
        remotePresenceTimeoutId = null;
        if (state.rtcRemotePresence === true) return;
        state.rtcPresenceTimeoutShown = true;
        setFriendInterstitialStatus(
          "Opponent has been disconnected for 5+ minutes. You can try again or leave game.",
          true
        );
        if (state.ready) renderAll();
      }, delayMs);
    }

    function subscribeRemotePresence() {
      clearRemotePresenceSubscription();
      if (!isOnlineFriendSessionActive()) return;
      const db = window._firebaseDb;
      const remoteRole = getOnlineRemoteRole();
      if (!db || !state.rtcRoomCode || !remoteRole) return;
      remotePresenceRef = db.ref(`rooms/${state.rtcRoomCode}/presence/${remoteRole}`);
      remotePresenceListener = (snapshot) => {
        const remotePresent = snapshot?.val?.() === true;
        const previouslyMissing = Boolean(state.rtcPresenceMissingSince);
        state.rtcRemotePresence = remotePresent;
        if (remotePresent) {
          state.rtcPresenceMissingSince = 0;
          state.rtcPresenceTimeoutShown = false;
          clearPresencePatienceTimer();
          if (state.rtcWaiting && state.rtcStatus === "connected" && !state.rtcReconnectInFlight) {
            setFriendInterstitialStatus(previouslyMissing ? "Opponent reconnected!" : "Opponent connected.", false);
          }
          if (state.ready) renderAll();
          return;
        }

        if (!state.rtcPresenceMissingSince) {
          state.rtcPresenceMissingSince = Date.now();
        }
        if (state.rtcWaiting && !state.rtcReconnectInFlight) {
          setFriendInterstitialStatus("Waiting for opponent to reconnect...", false);
        }
        schedulePresencePatienceNotice();
        if (state.ready) renderAll();
      };
      remotePresenceRef.on("value", remotePresenceListener);
    }

    function applyRemoteAbandonmentState(reason) {
      if (!remoteRoomAbandoned) {
        state.rtcOpponentAbandoned = false;
        return;
      }
      const abandonedBy = String(state.rtcOpponentAbandonedBy || "");
      if (!abandonedBy || abandonedBy === state.rtcRole) return;
      state.rtcOpponentAbandoned = true;
      state.rtcWaiting = true;
      setFriendInterstitialOpen(true, state.currentPlayer);
      setFriendInterstitialStatus("Your opponent left this online game. Return to menu to start a new room.", true);
      console.info("[online-abandon]", {
        reason,
        rtcRole: state.rtcRole,
        abandonedBy,
      });
      if (state.ready) {
        renderAll();
      }
    }

    function subscribeRemoteAbandonment() {
      clearRemoteAbandonmentSubscription();
      if (!isOnlineFriendSessionActive()) return;
      const db = window._firebaseDb;
      if (!db || !state.rtcRoomCode) return;
      remoteAbandonedRef = db.ref(`rooms/${state.rtcRoomCode}/abandoned`);
      remoteAbandonedByRef = db.ref(`rooms/${state.rtcRoomCode}/abandonedBy`);
      remoteAbandonedByListener = (snapshot) => {
        const nextBy = String(snapshot?.val?.() || "");
        state.rtcOpponentAbandonedBy = nextBy;
        applyRemoteAbandonmentState("abandonedBy-update");
      };
      remoteAbandonedListener = (snapshot) => {
        remoteRoomAbandoned = snapshot?.val?.() === true;
        if (!remoteRoomAbandoned) {
          state.rtcOpponentAbandoned = false;
          state.rtcOpponentAbandonedBy = "";
          if (state.ready) renderAll();
          return;
        }
        applyRemoteAbandonmentState("abandoned-update");
      };
      remoteAbandonedByRef.on("value", remoteAbandonedByListener);
      remoteAbandonedRef.on("value", remoteAbandonedListener);
    }

    function clearOnlineRealtimeSubscriptions() {
      clearRemotePresenceSubscription();
      clearRemoteAbandonmentSubscription();
      state.rtcRemotePresence = null;
      state.rtcPresenceMissingSince = 0;
      state.rtcPresenceTimeoutShown = false;
      state.rtcReconnectInFlight = false;
      state.rtcReconnectFailed = false;
      state.rtcOpponentAbandoned = false;
      state.rtcOpponentAbandonedBy = "";
      if (stateSync && typeof stateSync.clearAppliedSnapshotMarkers === "function") {
        stateSync.clearAppliedSnapshotMarkers();
      } else {
        state.rtcLastAppliedSnapshotKey = "";
        state.rtcLastAppliedSnapshotTurnIndex = -1;
        state.rtcLastAppliedSnapshotReason = "";
        state.rtcLastAppliedSnapshotAt = 0;
      }
    }

    function getOnlineSnapshotTurnIndex() {
      const p0Moves = Number(state.moveCounts?.[0] || 0);
      const p1Moves = Number(state.moveCounts?.[1] || 0);
      return Math.max(0, Math.floor(p0Moves) + Math.floor(p1Moves));
    }

    function encodeRtcSignal(payload) {
      const json = JSON.stringify(payload || {});
      return `${RTC_SIGNAL_PREFIX}${encodeBase64UrlUtf8(json)}`;
    }

    function encodeStateForOnline() {
      const fullCode = String(encodeStateToCode() || "").trim();
      const parts = fullCode.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid state code format");
      }
      const [prefix, payload] = parts;
      const decoded = decodeBase64UrlUtf8(payload);
      const snapshot = JSON.parse(decoded);
      if (!snapshot || typeof snapshot !== "object") {
        throw new Error("Invalid state snapshot payload");
      }

      const trimmedSnapshot = { ...snapshot };
      delete trimmedSnapshot.actionLog;
      delete trimmedSnapshot.drawPreview;
      delete trimmedSnapshot.message;
      delete trimmedSnapshot.lastTurnRecap;
      delete trimmedSnapshot.aiProfile;
      delete trimmedSnapshot.cpuPhase1PreviewCardId;
      delete trimmedSnapshot.aiPreview;
      delete trimmedSnapshot.awaitingDeckFlip;

      const trimmedJson = JSON.stringify(trimmedSnapshot);
      const trimmedPayload = encodeBase64UrlUtf8(trimmedJson);
      const checksum = utils.computeCodeChecksum(trimmedPayload);
      return `${prefix}.${trimmedPayload}.${checksum}`;
    }

    function tryDecodeRtcSignal(raw) {
      const text = String(raw || "");
      if (!text.startsWith(RTC_SIGNAL_PREFIX)) return null;
      const encoded = text.slice(RTC_SIGNAL_PREFIX.length);
      if (!encoded) {
        throw new Error("RTC signal missing payload");
      }
      const decoded = decodeBase64UrlUtf8(encoded);
      const parsed = JSON.parse(decoded);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("RTC signal payload must be an object");
      }
      return parsed;
    }

    async function sendOnlineTurnCodeWithSnapshot(stateCode, wirePayload, options = {}) {
      const { context = "online-turn", onSnapshotWriteFailed = null, onSendFailed = null } = options;
      const rtc = getRtcBridge();
      if (!rtc || typeof rtc.sendTurnCode !== "function") return false;
      const normalizedStateCode = String(stateCode || "").trim();
      const normalizedWirePayload = String(wirePayload || "").trim();
      if (!normalizedStateCode || !normalizedWirePayload) return false;

      if (typeof rtc.writeSnapshot === "function") {
        const wroteSnapshot = await rtc.writeSnapshot(normalizedStateCode, getOnlineSnapshotTurnIndex());
        if (!wroteSnapshot) {
          console.warn(`[online] ${context}: snapshot write failed; skipping send.`);
          if (typeof onSnapshotWriteFailed === "function") {
            onSnapshotWriteFailed();
          }
          return false;
        }
      }

      try {
        const sent = rtc.sendTurnCode(normalizedWirePayload);
        if (!sent && typeof onSendFailed === "function") {
          onSendFailed();
        }
        return sent;
      } catch (err) {
        console.warn(`[online] ${context}: send failed`, err);
        if (typeof onSendFailed === "function") {
          onSendFailed();
        }
        return false;
      }
    }

    function sendRtcSignal(payload) {
      const rtc = getRtcBridge();
      if (!rtc || typeof rtc.sendTurnCode !== "function") return false;
      try {
        return rtc.sendTurnCode(encodeRtcSignal(payload));
      } catch (err) {
        console.warn("rtc signal send failed", err);
        return false;
      }
    }

    async function sendRtcSignalWithSnapshot(payload, options = {}) {
      const { snapshotCode = "", context = "rtc-signal", onSnapshotWriteFailed = null, onSendFailed = null } = options;
      const normalizedSnapshotCode = String(snapshotCode || "").trim();
      if (!normalizedSnapshotCode) return false;
      const encodedPayload = encodeRtcSignal(payload);
      return sendOnlineTurnCodeWithSnapshot(normalizedSnapshotCode, encodedPayload, {
        context,
        onSnapshotWriteFailed,
        onSendFailed,
      });
    }

    function sendHostSessionInitSignal() {
      if (state.rtcRole !== "host") return false;
      if (state.rtcStatus !== "connected") return false;
      if (state.rtcInitSent) return true;
      assertOnlineRoleMapping("host-init-send");
      if (state.dealer !== 0 || state.currentPlayer !== 0) {
        warnOnlineStartupInvariant("About to send brand-new session-init with non-zero dealer/currentPlayer.", "host-init-send");
      }
      enforceInitialOnlineStartupState("host-init-send");
      let code = "";
      try {
        code = encodeStateForOnline();
      } catch (err) {
        setFriendInterstitialStatus(`Could not build init state: ${err.message}`, true);
        debugOnlineInit("host-init-encode-failed", { reason: String(err?.message || err) });
        return false;
      }
      const payload = {
        type: "session-init",
        roleAssignments: {
          host: "player1",
          guest: "player2",
          hostPlayerIndex: 0,
          guestPlayerIndex: 1,
        },
        currentTurnOwner: state.currentPlayer,
        code,
      };
      void sendOnlineTurnCodeWithSnapshot(code, encodeRtcSignal(payload), {
        context: "session-init",
        onSnapshotWriteFailed: () => {
          setFriendInterstitialStatus("Could not save initial snapshot. Please retry host setup.", true);
          debugOnlineInit("host-init-snapshot-write-failed");
        },
        onSendFailed: () => {
          setFriendInterstitialStatus("Initial sync send failed. Retry room setup.", true);
          debugOnlineInit("host-init-send-failed");
        },
      }).then((sent) => {
        if (!sent) return;
        state.rtcInitSent = true;
        state.rtcInitApplied = true;
        debugOnlineInit(
          "host-init-sent",
          getOnlineStartupDebugState({ currentTurnOwnerAfterInit: describeTurnOwnerForDebug(state.currentPlayer) })
        );
      }).catch((err) => {
        console.warn("host init send pipeline failed", err);
        setFriendInterstitialStatus("Initial sync failed unexpectedly. Retry room setup.", true);
      });
      return true;
    }

    async function syncOnlineRoundTransitionSnapshot() {
      if (!isOnlineFriendSessionActive()) return true;
      if (state.rtcStatus !== "connected") return false;
      let code = "";
      try {
        code = encodeStateForOnline();
      } catch (err) {
        console.warn("round-end snapshot encode failed", err);
        return false;
      }
      return sendRtcSignalWithSnapshot(
        {
          type: "turn-code",
          reason: "round-end",
          gameNumber: state.gameNumber,
          code,
        },
        {
          snapshotCode: code,
          context: "round-end-sync",
          onSnapshotWriteFailed: () => {
            setFriendInterstitialStatus("Round snapshot save failed. Retry in a moment.", true);
          },
          onSendFailed: () => {
            setFriendInterstitialStatus("Round sync send failed. Waiting for reconnect.", true);
          },
        }
      );
    }

    function beginOnlineFriendMatch() {
      if (!state.rtcPendingStart) return;
      const turnOwnerBeforeConnect = describeTurnOwnerForDebug(state.currentPlayer);
      debugOnlineInit("begin-online-friend-match", { currentTurnOwnerBeforeConnect: turnOwnerBeforeConnect });
      state.rtcPendingStart = false;
      state.rtcReconnectInFlight = false;
      state.rtcReconnectFailed = false;
      state.rtcOpponentAbandoned = false;
      state.rtcOpponentAbandonedBy = "";
      if (typeof persistOnlineSessionContext === "function" && state.rtcRoomCode && state.rtcRole) {
        persistOnlineSessionContext(state.rtcRoomCode, state.rtcRole);
      }
      hideStartMenu();
      startNewMatch({
        playMode: "friend",
        friendFlow: "hybrid",
        forceDealerPlayerIndex: 0,
        forceCurrentPlayerIndex: 0,
      });
      if (stateSync && typeof stateSync.clearAppliedSnapshotMarkers === "function") {
        stateSync.clearAppliedSnapshotMarkers();
      }
      subscribeRemotePresence();
      subscribeRemoteAbandonment();
      enforceInitialOnlineStartupState("begin-online-friend-match");
      if (state.rtcRole === "guest") {
        state.rtcInitSent = false;
        state.rtcInitApplied = false;
        state.rtcWaiting = true;
        setFriendInterstitialOpen(true, state.currentPlayer);
        setFriendInterstitialStatus(`Connected to room ${state.rtcRoomCode}. Waiting for host initialization.`, false);
        debugOnlineInit("guest-awaiting-init", {
          currentTurnOwnerAfterLocalStart: describeTurnOwnerForDebug(state.currentPlayer),
        });
      } else {
        state.rtcInitSent = false;
        state.rtcInitApplied = true;
        const hostMessage = `Room ${state.rtcRoomCode} connected. Turn handoffs send automatically.`;
        state.message = hostMessage;
        addSystemLog(hostMessage);
        debugOnlineInit("host-authoritative-startup", {
          currentTurnOwnerAfterLocalStart: describeTurnOwnerForDebug(state.currentPlayer),
        });
        sendHostSessionInitSignal();
        applyOnlineWaitingStateFromCurrentTurn("host-local-authority");
      }
      renderAll();
    }

    async function handleOnlineReconnect(roomCode, role) {
      const rtc = getRtcBridge();
      if (!rtc || typeof rtc.rejoinRoom !== "function") {
        throw new Error("Online reconnect unavailable.");
      }
      const normalizedRoomCode = String(roomCode || "")
        .trim()
        .toUpperCase();
      const normalizedRole = role === "host" || role === "guest" ? role : null;
      if (!normalizedRoomCode) {
        throw new Error("Missing room code for reconnect.");
      }
      if (!normalizedRole) {
        throw new Error("Missing role for reconnect.");
      }
      state.rtcRole = normalizedRole;
      state.rtcRoomCode = normalizedRoomCode;
      state.rtcPendingStart = false;
      state.rtcWaiting = true;
      state.rtcInitSent = false;
      state.rtcInitApplied = false;
      state.rtcReconnectFailed = false;
      state.rtcOpponentAbandoned = false;
      state.rtcOpponentAbandonedBy = "";
      setFriendInterstitialOpen(true, state.currentPlayer);
      setFriendInterstitialStatus(`Rejoining room ${normalizedRoomCode}...`, false);

      try {
        const snapshot = await rtc.rejoinRoom(normalizedRoomCode, normalizedRole, onRtcReceiveTurnCode);
        state.rtcStatus = String(rtc.getStatus?.() || "connected");
        subscribeRemotePresence();
        subscribeRemoteAbandonment();
        if (typeof persistOnlineSessionContext === "function") {
          persistOnlineSessionContext(normalizedRoomCode, normalizedRole);
        }

        if (snapshot && typeof snapshot.state === "string" && snapshot.state.trim()) {
          if (!stateSync) {
            throw new Error("Online state-sync controller unavailable.");
          }
          const result = stateSync.applyReconnectSnapshot(snapshot, { reason: "reconnect" });
          if (result.duplicate) {
            debugOnlineInit("reconnect-snapshot-duplicate", {
              turnIndex: result.turnIndex,
              reason: "reconnect",
            });
            applyOnlineWaitingStateFromCurrentTurn("reconnect-duplicate");
            renderAll();
            return true;
          }
          debugOnlineInit("reconnect-snapshot-applied", {
            turnIndex: result.turnIndex,
            reason: "reconnect",
          });
          return true;
        }

        state.rtcPendingStart = true;
        if (state.rtcStatus === "connected") {
          beginOnlineFriendMatch();
        } else {
          renderAll();
        }
        return true;
      } catch (err) {
        try {
          rtc.closeRoom?.();
        } catch (_closeErr) {
          // Ignore reconnect close errors.
        }
        clearRemotePresenceSubscription();
        clearRemoteAbandonmentSubscription();
        state.rtcRemotePresence = null;
        state.rtcPresenceMissingSince = 0;
        state.rtcPresenceTimeoutShown = false;
        state.rtcOpponentAbandoned = false;
        state.rtcOpponentAbandonedBy = "";
        state.rtcWaiting = true;
        state.rtcPendingStart = false;
        state.rtcInitSent = false;
        state.rtcInitApplied = false;
        state.rtcStatus = "error";
        if (stateSync && typeof stateSync.clearAppliedSnapshotMarkers === "function") {
          stateSync.clearAppliedSnapshotMarkers();
        }
        throw err;
      }
    }

    async function handleRtcDisconnectAutoReconnect() {
      if (!isOnlineFriendSessionActive()) return false;
      if (state.rtcOpponentAbandoned) return false;
      if (reconnectLockInFlight) return false;
      if (!state.rtcRoomCode || !state.rtcRole) return false;
      reconnectLockInFlight = true;
      state.rtcReconnectInFlight = true;
      state.rtcReconnectFailed = false;
      setFriendInterstitialOpen(true, state.currentPlayer);
      setFriendInterstitialStatus("Connection lost. Reconnecting...", false);
      if (state.ready) renderAll();

      const reconnectPromise = handleOnlineReconnect(state.rtcRoomCode, state.rtcRole);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Reconnect timed out")), RECONNECT_TIMEOUT_MS);
      });
      try {
        await Promise.race([reconnectPromise, timeoutPromise]);
        state.rtcReconnectFailed = false;
        setFriendInterstitialStatus("Reconnected.", false);
        applyOnlineWaitingStateFromCurrentTurn("reconnected");
        if (state.ready) renderAll();
        return true;
      } catch (err) {
        console.warn("online reconnect failed", err);
        state.rtcReconnectFailed = true;
        state.rtcStatus = "error";
        setFriendInterstitialOpen(true, state.currentPlayer);
        setFriendInterstitialStatus("Could not reconnect. Try again or return to menu.", true);
        if (state.ready) renderAll();
        return false;
      } finally {
        reconnectLockInFlight = false;
        state.rtcReconnectInFlight = false;
      }
    }

    function handleIncomingRtcSignal(signal) {
      if (!signal || typeof signal !== "object") return;
      const type = String(signal.type || "");
      if (type === "session-init") {
        const code = typeof signal.code === "string" ? signal.code : "";
        if (!code) {
          throw new Error("session-init missing code payload");
        }
        debugOnlineInit("guest-session-init-received", {
          currentTurnOwnerBeforeInit: describeTurnOwnerForDebug(state.currentPlayer),
          payloadTurnOwner:
            signal.currentTurnOwner === 0 || signal.currentTurnOwner === 1
              ? describeTurnOwnerForDebug(signal.currentTurnOwner)
              : "unknown",
        });
        if (!stateSync) {
          throw new Error("Online state-sync controller unavailable.");
        }
        let result = null;
        try {
          result = stateSync.applyAuthoritativeSnapshot(code, {
            reason: "session-init",
            markInitApplied: true,
          });
        } catch (_err) {
          setFriendInterstitialOpen(true, state.currentPlayer);
          setFriendInterstitialStatus("Initial sync failed. Ask host to reconnect the room.", true);
          renderAll();
          return;
        }
        if (result.duplicate) {
          debugOnlineInit("guest-session-init-duplicate", {
            currentTurnOwnerAfterInit: describeTurnOwnerForDebug(state.currentPlayer),
          });
          return;
        }
        enforceInitialOnlineStartupState("guest-session-init-apply");
        debugOnlineInit(
          "guest-session-init-applied",
          getOnlineStartupDebugState({ currentTurnOwnerAfterInit: describeTurnOwnerForDebug(state.currentPlayer) })
        );
        return;
      }
      if (type === "turn-code") {
        const code = typeof signal.code === "string" ? signal.code : "";
        if (!stateSync) {
          throw new Error("Online state-sync controller unavailable.");
        }
        try {
          const result = stateSync.applyAuthoritativeSnapshot(code, {
            reason: "signal-turn-code",
            markInitApplied: true,
          });
          if (result.duplicate) {
            debugOnlineInit("signal-turn-code-duplicate", {
              currentTurnOwnerAfterApply: describeTurnOwnerForDebug(state.currentPlayer),
            });
            return;
          }
        } catch (_err) {
          setFriendInterstitialOpen(true, state.currentPlayer);
          setFriendInterstitialStatus("Incoming online turn sync failed. Wait for reconnect.", true);
          renderAll();
          return;
        }
        setFriendInterstitialStatus("", false);
        return;
      }
      if (type === "round-ready") {
        const playerIndex = asNullablePlayerIndex(signal.playerIndex, "rtc.round-ready.playerIndex");
        const gameNumber = signal.gameNumber === undefined ? null : asInt(signal.gameNumber, "rtc.round-ready.gameNumber");
        const nextGameNumber =
          signal.nextGameNumber === undefined || signal.nextGameNumber === null
            ? null
            : asInt(signal.nextGameNumber, "rtc.round-ready.nextGameNumber");
        if (!state.roundTransition?.open || !state.roundOver || state.matchOver) return;
        if (gameNumber !== null && gameNumber !== state.gameNumber) return;
        if (
          nextGameNumber !== null &&
          state.roundTransition.nextGameNumber !== null &&
          nextGameNumber !== state.roundTransition.nextGameNumber
        ) {
          return;
        }
        if (playerIndex === 0 || playerIndex === 1) {
          if (playerIndex === 0) state.roundTransition.acks.p0 = true;
          if (playerIndex === 1) state.roundTransition.acks.p1 = true;
          const readyName = state.players[playerIndex]?.name || `P${playerIndex + 1}`;
          setFriendInterstitialStatus(`${readyName} is ready for the next game.`, false);
        }
        if (isRoundTransitionReadyForAdvance()) {
          onNextGame();
          return;
        }
        renderAll();
      }
    }

    function handleIncomingRtcPayload(rawPayload) {
      if (state.rtcPendingStart) {
        beginOnlineFriendMatch();
      }
      let signal = null;
      try {
        signal = tryDecodeRtcSignal(rawPayload);
      } catch (err) {
        throw new Error(`Incoming online signal failed: ${err.message}`);
      }
      if (signal) {
        handleIncomingRtcSignal(signal);
        return true;
      }
      if (!stateSync) {
        throw new Error("Online state-sync controller unavailable.");
      }
      try {
        const result = stateSync.applyAuthoritativeSnapshot(rawPayload, {
          reason: "raw-turn-code",
          markInitApplied: true,
        });
        if (result.duplicate) {
          debugOnlineInit("raw-turn-code-duplicate", {
            currentTurnOwnerAfterApply: describeTurnOwnerForDebug(state.currentPlayer),
          });
          return true;
        }
      } catch (err) {
        throw new Error(`Incoming online turn sync failed: ${err.message}`);
      }
      setFriendInterstitialStatus("", false);
      return true;
    }

    stateSync = createOnlineStateSyncController();

    return {
      isOnlineFriendSessionActive,
      getOnlineLocalPlayerIndex,
      getOnlineRemoteRole,
      describeTurnOwnerForDebug,
      debugOnlineInit,
      getOnlineRoleAssignmentDebug,
      getOnlineStartupDebugState,
      warnOnlineStartupInvariant,
      assertOnlineRoleMapping,
      enforceInitialOnlineStartupState,
      applyOnlineWaitingStateFromCurrentTurn,
      sendHostSessionInitSignal,
      encodeStateForOnline,
      encodeRtcSignal,
      tryDecodeRtcSignal,
      sendRtcSignal,
      sendOnlineTurnCodeWithSnapshot,
      syncOnlineRoundTransitionSnapshot,
      beginOnlineFriendMatch,
      handleOnlineReconnect,
      handleRtcDisconnectAutoReconnect,
      clearOnlineRealtimeSubscriptions,
      handleIncomingRtcSignal,
      handleIncomingRtcPayload,
    };
  }

  window.createOnlineSessionController = createOnlineSessionController;
})();
