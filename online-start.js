(function attachOnlineStartController() {
  function createOnlineStartController(deps) {
    const {
      state,
      ui,
      getRtcBridge,
      setStartManualLoadVisible,
      setCodeStatus,
      resetRtcSession,
      debugOnlineInit,
      describeTurnOwnerForDebug,
      renderAll,
      beginOnlineFriendMatch,
      tryDecodeRtcSignal,
      handleIncomingRtcSignal,
      loadCodeIntoGame,
      setFriendInterstitialOpen,
      setFriendInterstitialStatus,
      isFriendMode,
      applyOnlineWaitingStateFromCurrentTurn,
      handleOnlineReconnect,
      persistOnlineSessionContext,
      readOnlineSessionContextFromUrl,
      readOnlineSessionContextFromStorage,
      clearOnlineSessionContext,
      onlineRoomCodeLength,
      onlineRoomCodeRegex,
      onlineAuthReadyTimeoutMs,
      onlineHostCreateMaxAttempts,
    } = deps;
    let hostCreateInFlight = false;
    let resumeCandidate = null;
    let resumeInFlight = false;
    let resumeRetryReady = false;
    let expiredRoomNotice = "";
    let bookmarkPromptVisible = false;
    let bookmarkPromptCopied = false;
    let bookmarkPromptTimer = null;

    function setOnlineAuthState(nextState, message = "") {
      const normalized = nextState === "ready" ? "ready" : nextState === "error" ? "error" : "pending";
      state.onlineAuthState = normalized;
      state.onlineAuthMessage = String(message || "");
      applyOnlineAuthUiState();
    }

    function clearBookmarkPromptTimer() {
      if (!bookmarkPromptTimer) return;
      clearTimeout(bookmarkPromptTimer);
      bookmarkPromptTimer = null;
    }

    function formatTimeAgo(timestamp) {
      const value = Number(timestamp || 0);
      if (!Number.isFinite(value) || value <= 0) return "just now";
      const elapsedMs = Math.max(0, Date.now() - value);
      if (elapsedMs < 60_000) return "just now";
      const minutes = Math.floor(elapsedMs / 60_000);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 48) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }

    function renderStartResumeCard() {
      if (!ui.startResumeCard) return;
      const startMenuVisible = Boolean(ui.startMenu && !ui.startMenu.hidden);
      const onlinePanelVisible = Boolean(ui.startOnlinePanel && !ui.startOnlinePanel.hidden);
      const canShow = startMenuVisible && !onlinePanelVisible && Boolean(resumeCandidate);
      ui.startResumeCard.hidden = !canShow;
      if (!canShow) return;
      const roomText = String(resumeCandidate.roomCode || "----------");
      const timeAgo = formatTimeAgo(resumeCandidate.lastActiveAt);
      if (ui.startResumeText) {
        ui.startResumeText.textContent = `Active game - Room ${roomText} - Last played ${timeAgo}`;
      }
      if (ui.startResumeBtn) {
        ui.startResumeBtn.disabled = resumeInFlight;
        ui.startResumeBtn.textContent = resumeInFlight ? "Resuming..." : resumeRetryReady ? "Try Again" : "Resume";
      }
      if (ui.startResumeLeaveBtn) {
        ui.startResumeLeaveBtn.disabled = resumeInFlight;
      }
    }

    function renderStartExpiredNote() {
      if (!ui.startExpiredNote) return;
      const show = Boolean(expiredRoomNotice);
      ui.startExpiredNote.hidden = !show;
      if (!show) return;
      if (ui.startExpiredNoteText) {
        ui.startExpiredNoteText.textContent = expiredRoomNotice;
      }
    }

    function renderBookmarkPrompt() {
      if (!ui.onlineBookmarkPrompt) return;
      const show =
        bookmarkPromptVisible &&
        Boolean(ui.startOnlinePanel && !ui.startOnlinePanel.hidden) &&
        Boolean(state.rtcRoomCode);
      ui.onlineBookmarkPrompt.hidden = !show;
      if (!show) return;
      if (ui.onlineBookmarkCopyBtn) {
        ui.onlineBookmarkCopyBtn.textContent = bookmarkPromptCopied ? "Copied!" : "Copy URL";
      }
    }

    function refreshStartMenuAsyncUx() {
      renderStartResumeCard();
      renderStartExpiredNote();
      renderBookmarkPrompt();
    }

    function setResumeCandidate(nextCandidate) {
      resumeCandidate = nextCandidate
        ? {
            roomCode: String(nextCandidate.roomCode || "")
              .trim()
              .toUpperCase(),
            role: nextCandidate.role === "host" || nextCandidate.role === "guest" ? nextCandidate.role : "host",
            lastActiveAt: Number(nextCandidate.lastActiveAt || 0) || Date.now(),
          }
        : null;
      if (resumeCandidate) {
        resumeRetryReady = false;
      }
      if (!resumeCandidate) {
        resumeInFlight = false;
        resumeRetryReady = false;
      }
      refreshStartMenuAsyncUx();
    }

    function setExpiredRoomNotice(message = "") {
      expiredRoomNotice = String(message || "");
      refreshStartMenuAsyncUx();
    }

    function setBookmarkPromptVisible(open) {
      bookmarkPromptVisible = Boolean(open);
      if (!bookmarkPromptVisible) {
        bookmarkPromptCopied = false;
        clearBookmarkPromptTimer();
      }
      refreshStartMenuAsyncUx();
    }

    function getOnlineAuthBlockingMessage() {
      if (state.onlineAuthState === "error") {
        if (state.onlineAuthMessage) return state.onlineAuthMessage;
        return "Online mode unavailable: anonymous sign-in failed.";
      }
      if (state.onlineAuthState === "pending") {
        return state.onlineAuthMessage || "Online mode is still signing in anonymously. Please wait.";
      }
      return "";
    }

    function isOnlineAuthReady() {
      return state.onlineAuthState === "ready";
    }

    function applyOnlineAuthUiState() {
      const ready = isOnlineAuthReady();
      if (ui.onlineHostBtn) ui.onlineHostBtn.disabled = !ready;
      if (ui.onlineJoinBtn) ui.onlineJoinBtn.disabled = !ready;
      if (ui.onlineRoomCodeInput) ui.onlineRoomCodeInput.disabled = !ready;
      if (ui.startOnlinePanel && !ui.startOnlinePanel.hidden && !ready) {
        setStartOnlineStatus(getOnlineAuthBlockingMessage(), state.onlineAuthState === "error");
      }
      refreshStartMenuAsyncUx();
    }

    function ensureOnlineAuthReadyForStart() {
      if (isOnlineAuthReady()) return true;
      setStartOnlineStatus(getOnlineAuthBlockingMessage(), state.onlineAuthState === "error");
      applyOnlineAuthUiState();
      return false;
    }

    function bindFirebaseOnlineAuth() {
      const auth = window._firebaseAuth;
      if (!auth || !window._firebaseDb) {
        setOnlineAuthState("error", "Online mode unavailable: Firebase initialization failed.");
        return;
      }
      if (auth.currentUser?.uid) {
        setOnlineAuthState("ready", "");
        return;
      }
      setOnlineAuthState("pending", "Online mode is signing in anonymously...");
      const readyPromise = window._firebaseAuthReady;
      if (!readyPromise || typeof readyPromise.then !== "function") {
        setOnlineAuthState("error", "Online mode unavailable: anonymous sign-in did not start.");
        return;
      }

      let settled = false;
      const finish = (nextState, message) => {
        if (settled) return;
        settled = true;
        setOnlineAuthState(nextState, message);
      };
      const timeoutId = setTimeout(() => {
        finish("error", "Online mode unavailable: anonymous auth timed out. Reload and try again.");
      }, onlineAuthReadyTimeoutMs);

      readyPromise
        .then(() => {
          if (settled) return;
          clearTimeout(timeoutId);
          if (auth.currentUser?.uid) {
            finish("ready", "");
            return;
          }
          const fallbackError = String(window._firebaseAuthError || "").trim();
          if (fallbackError) {
            finish("error", `Online mode unavailable: ${fallbackError}`);
            return;
          }
          finish(
            "error",
            "Online mode unavailable: anonymous sign-in failed. Enable Anonymous auth in Firebase Console."
          );
        })
        .catch((err) => {
          if (settled) return;
          clearTimeout(timeoutId);
          const message = String(err?.message || window._firebaseAuthError || "Anonymous auth failed.");
          finish("error", `Online mode unavailable: ${message}`);
        });
    }

    function normalizeRoomCodeInput(raw) {
      return String(raw || "")
        .trim()
        .toUpperCase()
        .replaceAll(/[^A-Z0-9]/g, "")
        .slice(0, onlineRoomCodeLength);
    }

    function isOnlineRoomCodeCollisionError(err) {
      const message = String(err?.message || err || "");
      return message.includes("Room code already in use");
    }

    function setStartOnlineStatus(message, isError) {
      const node = ui.startOnlineStatus;
      if (!node) return;
      node.textContent = message || "";
      node.classList.toggle("error", Boolean(message && isError));
      node.classList.toggle("success", Boolean(message && !isError));
    }

    function setStartOnlinePanelMode(mode) {
      const normalizedMode = mode === "join" ? "join" : "host";
      state.startOnlineMode = normalizedMode;
      const hostMode = normalizedMode === "host";
      if (ui.startOnlinePanel) {
        ui.startOnlinePanel.classList.toggle("is-host-mode", hostMode);
      }
      if (ui.onlineRoomCodeLabel) {
        ui.onlineRoomCodeLabel.hidden = hostMode;
      }
      if (ui.onlineRoomCodeInput) {
        ui.onlineRoomCodeInput.hidden = hostMode;
      }
      if (ui.onlineHostBtn) {
        ui.onlineHostBtn.classList.toggle("primary", hostMode);
      }
      if (ui.onlineJoinBtn) {
        ui.onlineJoinBtn.classList.toggle("primary", !hostMode);
      }
      setStartOnlineRoomDisplay(state.rtcRoomCode || "");
      applyOnlineAuthUiState();
    }

    function setStartOnlineRoomDisplay(roomCode) {
      const hostMode = state.startOnlineMode !== "join";
      if (ui.onlineRoomDisplay) {
        ui.onlineRoomDisplay.hidden = !hostMode;
      }
      if (ui.onlineRoomCodeText) {
        ui.onlineRoomCodeText.textContent = roomCode || "----------";
      }
    }

    function setStartOnlinePanelOpen(open) {
      const isOpen = Boolean(open);
      if (ui.startOnlinePanel) {
        ui.startOnlinePanel.hidden = !isOpen;
      }
      if (isOpen) {
        setStartManualLoadVisible(false);
        setCodeStatus("", false, "start");
      }
      if (ui.startModeCpuBtn) ui.startModeCpuBtn.hidden = isOpen;
      if (ui.startModeFriendBtn) ui.startModeFriendBtn.hidden = isOpen;
      if (ui.startModeOnlineBtn) ui.startModeOnlineBtn.hidden = isOpen;
      if (ui.startSubtitle) ui.startSubtitle.hidden = isOpen;
      if (ui.startLoadActions) ui.startLoadActions.hidden = isOpen;
      if (!isOpen) {
        setBookmarkPromptVisible(false);
        setStartOnlinePanelMode("host");
        setStartOnlineStatus("", false);
        setStartOnlineRoomDisplay("");
        if (ui.onlineRoomCodeInput) {
          ui.onlineRoomCodeInput.value = "";
        }
      }
      applyOnlineAuthUiState();
      refreshStartMenuAsyncUx();
    }

    function renderRtcStatusBadge() {
      if (!ui.rtcStatusBadge || !ui.rtcStatusText) return;
      const visible = Boolean(
        state.rtcRole ||
          state.rtcPendingStart ||
          state.rtcStatus === "connecting" ||
          state.rtcStatus === "connected" ||
          state.rtcStatus === "disconnected" ||
          state.rtcStatus === "error"
      );
      ui.rtcStatusBadge.hidden = !visible;
      if (!visible) return;
      const normalizedStatus =
        state.rtcStatus === "connecting" ||
        state.rtcStatus === "connected" ||
        state.rtcStatus === "disconnected" ||
        state.rtcStatus === "error"
          ? state.rtcStatus
          : "idle";
      const roleText = state.rtcRole === "host" ? "Host" : state.rtcRole === "guest" ? "Guest" : "Online";
      const statusText =
        normalizedStatus === "connected"
          ? "Connected"
          : normalizedStatus === "connecting"
            ? "Connecting"
            : normalizedStatus === "disconnected"
              ? "Disconnected"
              : normalizedStatus === "error"
                ? "Error"
                : "Offline";
      const roomText = state.rtcRoomCode ? ` (${state.rtcRoomCode})` : "";
      ui.rtcStatusText.textContent = `${roleText}: ${statusText}${roomText}`;
      ui.rtcStatusBadge.classList.remove("is-idle", "is-connecting", "is-connected", "is-disconnected", "is-error");
      ui.rtcStatusBadge.classList.add(`is-${normalizedStatus}`);
      ui.rtcStatusBadge.classList.toggle("pulse", Boolean(state.rtcHeartbeatPulse));
    }

    async function attemptOnlineResumeOnLoad() {
      const rtc = getRtcBridge();
      const fromUrl =
        typeof readOnlineSessionContextFromUrl === "function" ? readOnlineSessionContextFromUrl() : null;
      if (fromUrl && typeof handleOnlineReconnect === "function") {
        try {
          setResumeCandidate(null);
          setExpiredRoomNotice("");
          await handleOnlineReconnect(fromUrl.roomCode, fromUrl.role);
          return { resumed: true, notice: "" };
        } catch (err) {
          console.warn("online-start URL rejoin failed", err);
          const message = String(err?.message || "").toLowerCase();
          resetRtcSession({ closeConnection: true });
          if (typeof clearOnlineSessionContext === "function") {
            clearOnlineSessionContext();
          }
          if (message.includes("expired") || message.includes("not found") || message.includes("closed")) {
            setExpiredRoomNotice("This game has expired.");
            return { resumed: false, notice: "" };
          }
          setExpiredRoomNotice("");
          return { resumed: false, notice: "Could not rejoin that online game." };
        }
      }

      const fromStorage =
        typeof readOnlineSessionContextFromStorage === "function" ? readOnlineSessionContextFromStorage() : null;
      if (fromStorage && rtc && typeof rtc.readRoomLifecycleMetadata === "function") {
        try {
          const metadata = await rtc.readRoomLifecycleMetadata(fromStorage.roomCode);
          const expiresAt = Number(metadata?.expiresAt || 0);
          const abandoned = Boolean(metadata?.abandoned);
          if (!Number.isFinite(expiresAt) || expiresAt <= Date.now() || abandoned) {
            if (typeof clearOnlineSessionContext === "function") {
              clearOnlineSessionContext();
            }
            setResumeCandidate(null);
          } else {
            setResumeCandidate({
              roomCode: fromStorage.roomCode,
              role: fromStorage.role,
              lastActiveAt: Number(metadata?.lastActiveAt || metadata?.updatedAt || Date.now()),
            });
          }
        } catch (err) {
          console.warn("online-start storage lifecycle check failed", err);
          setResumeCandidate(null);
        }
      } else {
        setResumeCandidate(null);
      }
      return { resumed: false, notice: "" };
    }

    async function onStartModeOnlineFromMenu() {
      if (!state.ready) return;
      setStartOnlinePanelOpen(true);
      setStartOnlinePanelMode("host");
      const rtc = getRtcBridge();
      if (!rtc || typeof rtc.hostRoom !== "function" || typeof rtc.joinRoom !== "function") {
        setStartOnlineStatus("Online mode unavailable: RTC bridge not loaded.", true);
        return;
      }
      if (!ensureOnlineAuthReadyForStart()) return;
      setStartOnlineStatus(
        "Tap Host New Room to create and share a room code, or tap Join Room to switch to code entry.",
        false
      );
    }

    async function onOnlineHostFromMenu() {
      setStartOnlinePanelMode("host");
      const priorRoomCode = String(state.rtcRoomCode || "")
        .trim()
        .toUpperCase();
      if (priorRoomCode) {
        const rtc = getRtcBridge();
        if (rtc && typeof rtc.removeRoom === "function") {
          try {
            await rtc.removeRoom(priorRoomCode);
          } catch (err) {
            console.warn("online-start re-host cleanup failed", err);
          }
        }
      }
      await startOnlineSession("host");
    }

    async function onOnlineJoinFromMenu() {
      if (state.startOnlineMode !== "join") {
        resetRtcSession({ closeConnection: true });
        setStartOnlinePanelMode("join");
        setStartOnlineStatus("Enter your friend's room code, then tap Join Room again.", false);
        return;
      }
      await startOnlineSession("guest");
    }

    function onOnlineBackFromMenu() {
      resetRtcSession({ closeConnection: true });
      setStartOnlinePanelOpen(false);
    }

    async function onStartResumeFromCard() {
      if (!resumeCandidate || resumeInFlight) return;
      if (typeof handleOnlineReconnect !== "function") return;
      resumeInFlight = true;
      refreshStartMenuAsyncUx();
      setCodeStatus("Resuming online game...", false, "start");
      resumeRetryReady = false;
      try {
        await handleOnlineReconnect(resumeCandidate.roomCode, resumeCandidate.role);
        setResumeCandidate(null);
        setExpiredRoomNotice("");
      } catch (err) {
        console.warn("online-start resume from card failed", err);
        const message = String(err?.message || "").toLowerCase();
        if (message.includes("expired") || message.includes("not found") || message.includes("closed")) {
          setExpiredRoomNotice("This game has expired.");
          if (typeof clearOnlineSessionContext === "function") {
            clearOnlineSessionContext();
          }
          setResumeCandidate(null);
        }
        if (resumeCandidate) {
          resumeRetryReady = true;
        }
        setCodeStatus("Could not reconnect. Try again or return to menu.", true, "start");
      } finally {
        resumeInFlight = false;
        refreshStartMenuAsyncUx();
      }
    }

    async function onStartResumeLeaveFromCard() {
      if (!resumeCandidate || resumeInFlight) return;
      const confirmed = window.confirm(
        "Leave this online game and return to menu? Your opponent may be notified that you left."
      );
      if (!confirmed) return;
      resumeInFlight = true;
      resumeRetryReady = false;
      refreshStartMenuAsyncUx();
      try {
        const db = window._firebaseDb;
        const auth = window._firebaseAuth;
        const readyPromise = window._firebaseAuthReady;
        if (readyPromise && typeof readyPromise.then === "function") {
          await readyPromise.catch(() => null);
        }
        const uid = String(auth?.currentUser?.uid || "");
        const rtc = getRtcBridge();
        const metadata =
          rtc && typeof rtc.readRoomLifecycleMetadata === "function"
            ? await rtc.readRoomLifecycleMetadata(resumeCandidate.roomCode)
            : null;
        const expectedUid =
          resumeCandidate.role === "host" ? String(metadata?.hostUid || "") : String(metadata?.guestUid || "");
        if (db && uid && expectedUid && uid === expectedUid) {
          const nowMs = Date.now();
          await db.ref(`rooms/${resumeCandidate.roomCode}`).update({
            abandoned: true,
            abandonedBy: resumeCandidate.role,
            connected: false,
            lastActiveAt: nowMs,
            expiresAt: nowMs + 2_592_000_000,
            updatedAt: nowMs,
          });
        }
      } catch (err) {
        console.warn("online-start resume leave abandon failed", err);
      } finally {
        if (typeof clearOnlineSessionContext === "function") {
          clearOnlineSessionContext();
        }
        setResumeCandidate(null);
        setExpiredRoomNotice("");
        setCodeStatus("", false, "start");
        setStartOnlineStatus("", false);
        setStartOnlinePanelOpen(false);
        resumeInFlight = false;
        refreshStartMenuAsyncUx();
      }
    }

    function dismissStartExpiredNote() {
      setExpiredRoomNotice("");
    }

    async function onOnlineBookmarkCopyUrl() {
      if (!bookmarkPromptVisible) return;
      const url = String(window.location.href || "");
      if (!url) return;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(url);
        } else {
          const temp = document.createElement("textarea");
          temp.value = url;
          temp.setAttribute("readonly", "true");
          temp.style.position = "fixed";
          temp.style.opacity = "0";
          document.body.appendChild(temp);
          temp.focus();
          temp.select();
          document.execCommand("copy");
          temp.setSelectionRange(0, 0);
          document.body.removeChild(temp);
        }
        bookmarkPromptCopied = true;
        refreshStartMenuAsyncUx();
        clearBookmarkPromptTimer();
        bookmarkPromptTimer = setTimeout(() => {
          bookmarkPromptCopied = false;
          refreshStartMenuAsyncUx();
          bookmarkPromptTimer = null;
        }, 1200);
      } catch (err) {
        console.warn("online-start bookmark copy failed", err);
      }
    }

    function onOnlineBookmarkDismiss() {
      setBookmarkPromptVisible(false);
    }

    async function startOnlineSession(role) {
      const hostRequest = role === "host";
      const hostBtn = ui.onlineHostBtn || null;
      const hostBtnOriginalText = hostBtn ? hostBtn.textContent : "";
      if (hostRequest) {
        if (hostCreateInFlight) return;
        hostCreateInFlight = true;
        if (hostBtn) {
          hostBtn.disabled = true;
          hostBtn.classList.add("is-loading");
          hostBtn.textContent = "Creating...";
        }
      }
      try {
      const rtc = getRtcBridge();
      if (!rtc || typeof rtc.hostRoom !== "function" || typeof rtc.joinRoom !== "function") {
        setStartOnlineStatus("Online mode unavailable: RTC bridge not loaded.", true);
        return;
      }
      if (!ensureOnlineAuthReadyForStart()) return;
      const joinRoomCode = normalizeRoomCodeInput(ui.onlineRoomCodeInput?.value || "");
      setStartOnlinePanelMode(role === "host" ? "host" : "join");
      if (role === "guest" && ui.onlineRoomCodeInput) {
        ui.onlineRoomCodeInput.value = joinRoomCode;
      }
      if (role === "guest") {
        if (!joinRoomCode) {
          setStartOnlineStatus("Enter a room code to join.", true);
          return;
        }
        if (!onlineRoomCodeRegex.test(joinRoomCode)) {
          setStartOnlineStatus(`Room code must be exactly ${onlineRoomCodeLength} uppercase letters/numbers.`, true);
          return;
        }
      }

      const maxAttempts = role === "host" ? onlineHostCreateMaxAttempts : 1;
      let attempt = 0;
      let lastError = null;

      while (attempt < maxAttempts) {
        attempt += 1;
        const roomCode = role === "host" ? String(rtc.createRoomCode?.() || "") : joinRoomCode;
        if (!onlineRoomCodeRegex.test(roomCode)) {
          if (role === "host") {
            lastError = new Error("Could not create a valid room code. Try again.");
            continue;
          }
          setStartOnlineStatus(`Room code must be exactly ${onlineRoomCodeLength} uppercase letters/numbers.`, true);
          return;
        }

        setStartOnlinePanelOpen(true);
        setStartOnlineRoomDisplay(roomCode);
        setStartOnlineStatus(
          role === "host" ? `Creating room ${roomCode}...` : `Joining room ${roomCode}...`,
          false
        );

        try {
          debugOnlineInit("start-online-session-request", {
            requestedRole: role,
            currentTurnOwnerBeforeConnect: describeTurnOwnerForDebug(state.currentPlayer),
          });
          resetRtcSession({ closeConnection: true });
          state.rtcRole = role;
          state.rtcRoomCode = roomCode;
          state.rtcPendingStart = true;
          state.rtcWaiting = false;
          state.rtcInitSent = false;
          state.rtcInitApplied = false;
          debugOnlineInit("start-online-session-role-assigned", {
            requestedRole: role,
            currentTurnOwnerBeforeConnect: describeTurnOwnerForDebug(state.currentPlayer),
          });
          setStartOnlineRoomDisplay(roomCode);
          if (role === "host") {
            await rtc.hostRoom(roomCode, onRtcReceiveTurnCode);
          } else {
            await rtc.joinRoom(roomCode, onRtcReceiveTurnCode);
          }
          if (typeof persistOnlineSessionContext === "function") {
            persistOnlineSessionContext(roomCode, role);
          }
          state.rtcStatus = String(rtc.getStatus?.() || "connecting");
          setResumeCandidate({
            roomCode,
            role,
            lastActiveAt: Date.now(),
          });
          setExpiredRoomNotice("");
          setBookmarkPromptVisible(true);
          if (role === "host") {
            setStartOnlineStatus(`Room ${roomCode} ready. Waiting for your friend to connect...`, false);
            try {
              if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(roomCode);
              }
            } catch (_err) {
              // Best-effort copy only.
            }
          } else {
            setStartOnlineStatus(`Room ${roomCode} joined. Waiting for opponent...`, false);
          }
          renderAll();
          return;
        } catch (err) {
          lastError = err;
          if (role === "host" && isOnlineRoomCodeCollisionError(err) && attempt < maxAttempts) {
            continue;
          }
          break;
        }
      }

      resetRtcSession({ closeConnection: true });
      setStartOnlinePanelOpen(true);
      setBookmarkPromptVisible(false);
      if (role === "host" && isOnlineRoomCodeCollisionError(lastError)) {
        setStartOnlineStatus("Could not create a new online room right now. Please try again.", true);
        return;
      }
      setStartOnlineStatus(`Online setup failed: ${lastError?.message || "unknown error"}`, true);
      } finally {
        if (hostRequest) {
          hostCreateInFlight = false;
          if (hostBtn) {
            hostBtn.classList.remove("is-loading");
            hostBtn.textContent = hostBtnOriginalText;
          }
          applyOnlineAuthUiState();
        }
      }
    }

    function onRtcReceiveTurnCode(rawPayload) {
      if (state.rtcPendingStart) {
        beginOnlineFriendMatch();
      }
      let signal = null;
      try {
        signal = tryDecodeRtcSignal(rawPayload);
      } catch (err) {
        setFriendInterstitialOpen(true, state.currentPlayer);
        setFriendInterstitialStatus(`Incoming online signal failed: ${err.message}`, true);
        renderAll();
        return;
      }
      if (signal) {
        try {
          handleIncomingRtcSignal(signal);
        } catch (err) {
          setFriendInterstitialOpen(true, state.currentPlayer);
          setFriendInterstitialStatus(`Incoming online signal failed: ${err.message}`, true);
          renderAll();
        }
        return;
      }
      state.rtcWaiting = false;
      const loaded = loadCodeIntoGame(rawPayload, "friend", {
        allowNonCheckpointFriendImport: true,
        allowMissingDrawPile: true,
      });
      if (!loaded) {
        setFriendInterstitialOpen(true, state.currentPlayer);
        setFriendInterstitialStatus("Incoming online handoff failed. Please reconnect or retry room setup.", true);
        renderAll();
        return;
      }
      setFriendInterstitialStatus("", false);
      if (isFriendMode()) {
        applyOnlineWaitingStateFromCurrentTurn("raw-turn-code");
      }
    }

    return {
      setOnlineAuthState,
      getOnlineAuthBlockingMessage,
      isOnlineAuthReady,
      applyOnlineAuthUiState,
      ensureOnlineAuthReadyForStart,
      bindFirebaseOnlineAuth,
      normalizeRoomCodeInput,
      isOnlineRoomCodeCollisionError,
      refreshStartMenuAsyncUx,
      dismissStartExpiredNote,
      setStartOnlineStatus,
      setStartOnlinePanelMode,
      setStartOnlineRoomDisplay,
      setStartOnlinePanelOpen,
      renderRtcStatusBadge,
      attemptOnlineResumeOnLoad,
      onStartModeOnlineFromMenu,
      onOnlineHostFromMenu,
      onOnlineJoinFromMenu,
      onOnlineBackFromMenu,
      onStartResumeFromCard,
      onStartResumeLeaveFromCard,
      onOnlineBookmarkCopyUrl,
      onOnlineBookmarkDismiss,
      startOnlineSession,
      onRtcReceiveTurnCode,
    };
  }

  window.createOnlineStartController = createOnlineStartController;
})();
