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
      handleIncomingRtcPayload,
      setFriendInterstitialOpen,
      setFriendInterstitialStatus,
      persistOnlineSessionContext,
      buildOnlineInviteLink,
      normalizeLegacyOnlineUrlToInvite,
      readOnlineSessionContextFromUrl,
      readOnlineSessionContextFromStorage,
      onlineRoomCodeLength,
      onlineRoomCodeRegex,
      onlineAuthReadyTimeoutMs,
      onlineHostCreateMaxAttempts,
    } = deps;
    let hostCreateInFlight = false;
    let expiredRoomNotice = "";
    const ONLINE_AUTH_FAILURE_MESSAGE = "Online play is temporarily unavailable. Check your connection and reload.";
    const INVITE_FAILURE_MESSAGES = {
      invalid: "This invite link is not valid.",
      expired: "This game has ended. Ask your friend to create a new one.",
      full: "This game already has two players.",
      alreadyJoined: "You already joined this game on this device. Open Play Online, then Load Game to resume.",
    };

    function setOnlineAuthState(nextState, message = "") {
      const normalized = nextState === "ready" ? "ready" : nextState === "error" ? "error" : "pending";
      state.onlineAuthState = normalized;
      state.onlineAuthMessage = String(message || "");
      applyOnlineAuthUiState();
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

    function refreshStartMenuAsyncUx() {
      renderStartExpiredNote();
    }

    function setExpiredRoomNotice(message = "") {
      expiredRoomNotice = String(message || "");
      refreshStartMenuAsyncUx();
    }

    function getOnlineAuthBlockingMessage() {
      if (state.onlineAuthState === "error") {
        return state.onlineAuthMessage || ONLINE_AUTH_FAILURE_MESSAGE;
      }
      if (state.onlineAuthState === "pending") {
        return state.onlineAuthMessage || "Connecting to online services...";
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
        console.error("Firebase initialization missing for online auth");
        setOnlineAuthState("error", ONLINE_AUTH_FAILURE_MESSAGE);
        return;
      }
      if (auth.currentUser?.uid) {
        setOnlineAuthState("ready", "");
        return;
      }
      setOnlineAuthState("pending", "Connecting to online services...");
      const readyPromise = window._firebaseAuthReady;
      if (!readyPromise || typeof readyPromise.then !== "function") {
        console.error("Firebase anonymous auth did not start");
        setOnlineAuthState("error", ONLINE_AUTH_FAILURE_MESSAGE);
        return;
      }

      let settled = false;
      const finish = (nextState, message) => {
        if (settled) return;
        settled = true;
        setOnlineAuthState(nextState, message);
      };
      const timeoutId = setTimeout(() => {
        console.error("Firebase anonymous auth timed out");
        finish("error", ONLINE_AUTH_FAILURE_MESSAGE);
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
            console.error("Firebase anonymous auth failed", fallbackError);
            finish("error", ONLINE_AUTH_FAILURE_MESSAGE);
            return;
          }
          finish("error", ONLINE_AUTH_FAILURE_MESSAGE);
        })
        .catch((err) => {
          if (settled) return;
          clearTimeout(timeoutId);
          console.error("Firebase anonymous auth failed", err);
          finish("error", ONLINE_AUTH_FAILURE_MESSAGE);
        });
    }

    function normalizeRoomCodeInput(raw) {
      return String(raw || "")
        .trim()
        .toUpperCase()
        .replaceAll(/[^A-Z0-9]/g, "")
        .slice(0, onlineRoomCodeLength);
    }

    function isValidRoomCode(roomCode) {
      return onlineRoomCodeRegex.test(String(roomCode || "").trim().toUpperCase());
    }

    function getInviteFailureMessage(reason) {
      if (reason === "expired") return INVITE_FAILURE_MESSAGES.expired;
      if (reason === "full") return INVITE_FAILURE_MESSAGES.full;
      if (reason === "already-joined") return INVITE_FAILURE_MESSAGES.alreadyJoined;
      return INVITE_FAILURE_MESSAGES.invalid;
    }

    function classifyInviteFailureFromError(err) {
      const message = String(err?.message || err || "").toLowerCase();
      if (
        message.includes("not valid") ||
        message.includes("not found") ||
        message.includes("missing room code") ||
        message.includes("host room not found")
      ) {
        return "invalid";
      }
      if (message.includes("expired") || message.includes("closed") || message.includes("ended")) {
        return "expired";
      }
      if (message.includes("full") || message.includes("two players")) {
        return "full";
      }
      return null;
    }

    function classifyInviteFailureFromRoomIndex(roomIndex, selfRole) {
      if (selfRole === "host" || selfRole === "guest") {
        return "already-joined";
      }
      // Transitional compatibility: if roomIndex is missing/unreadable, attempt join once
      // and let join errors classify the failure. This keeps legacy/partial deployments usable.
      if (!roomIndex || roomIndex.exists !== true) {
        return null;
      }
      if (!roomIndex.hasHost) {
        return "invalid";
      }
      if (roomIndex.joinState === "expired" || roomIndex.joinState === "closed") {
        return "expired";
      }
      const expiresAt = Number(roomIndex.expiresAt || 0);
      if (Number.isFinite(expiresAt) && expiresAt > 0 && expiresAt <= Date.now()) {
        return "expired";
      }
      if (roomIndex.joinState === "full" || roomIndex.hasGuest) {
        return "full";
      }
      return null;
    }

    function getInviteLinkForRoom(roomCode) {
      if (typeof buildOnlineInviteLink !== "function") return "";
      const normalized = String(roomCode || "")
        .trim()
        .toUpperCase();
      if (!isValidRoomCode(normalized)) return "";
      return String(buildOnlineInviteLink(normalized) || "");
    }

    function setInviteActionsVisible(visible) {
      if (ui.onlineInviteActions) {
        ui.onlineInviteActions.hidden = !visible;
      }
      if (ui.onlineCopyInviteBtn) {
        ui.onlineCopyInviteBtn.disabled = !visible;
      }
      if (ui.onlineShareInviteBtn) {
        const shareSupported = typeof navigator.share === "function";
        ui.onlineShareInviteBtn.hidden = !shareSupported;
        ui.onlineShareInviteBtn.disabled = !visible || !shareSupported;
      }
    }

    function refreshInviteActions() {
      const hostMode = state.startOnlineMode !== "join";
      const link = getInviteLinkForRoom(state.rtcRoomCode);
      setInviteActionsVisible(hostMode && Boolean(link));
    }

    function isOnlineRoomCodeCollisionError(err) {
      const message = String(err?.message || err || "");
      return message.includes("Room code already in use");
    }

    function isOnlineAuthFailureError(err) {
      const message = String(err?.message || err || "").toLowerCase();
      return message.includes("anonymous auth") || message.includes("firebase auth");
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
      refreshInviteActions();
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
      refreshInviteActions();
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
      if (isOpen && ui.startCurrentGamesPanel) ui.startCurrentGamesPanel.hidden = true;
      if (ui.startSubtitle) ui.startSubtitle.hidden = isOpen;
      if (ui.startLoadActions) ui.startLoadActions.hidden = isOpen;
      if (!isOpen) {
        setStartOnlinePanelMode("host");
        setStartOnlineStatus("", false);
        setStartOnlineRoomDisplay("");
        if (ui.onlineRoomCodeInput) {
          ui.onlineRoomCodeInput.value = "";
        }
        setInviteActionsVisible(false);
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
      const fromUrl = typeof readOnlineSessionContextFromUrl === "function" ? readOnlineSessionContextFromUrl() : null;
      if (fromUrl) {
        const inviteRoomCode = String(fromUrl.roomCode || "")
          .trim()
          .toUpperCase();
        if (!isValidRoomCode(inviteRoomCode)) {
          return {
            resumed: false,
            notice: getInviteFailureMessage("invalid"),
            noticeIsError: true,
            openOnlinePanel: true,
          };
        }
        if (fromUrl.source === "legacy" && typeof normalizeLegacyOnlineUrlToInvite === "function") {
          normalizeLegacyOnlineUrlToInvite(inviteRoomCode);
        }
        setExpiredRoomNotice("");

        if (!rtc || typeof rtc.readRoomIndex !== "function" || typeof rtc.joinRoom !== "function") {
          return {
            resumed: false,
            notice: "Online mode unavailable: RTC bridge not loaded.",
            noticeIsError: true,
            openOnlinePanel: true,
          };
        }

        let roomIndex = null;
        let selfRole = null;
        try {
          roomIndex = await rtc.readRoomIndex(inviteRoomCode);
        } catch (err) {
          console.warn("online-start invite roomIndex read failed", err);
        }
        if (typeof rtc.readSelfMemberRole === "function") {
          try {
            selfRole = await rtc.readSelfMemberRole(inviteRoomCode);
          } catch (err) {
            console.warn("online-start invite member role read failed", err);
          }
        }
        if (selfRole !== "host" && selfRole !== "guest") {
          const existingStorage =
            typeof readOnlineSessionContextFromStorage === "function" ? readOnlineSessionContextFromStorage() : null;
          if (existingStorage && existingStorage.roomCode === inviteRoomCode && existingStorage.role) {
            selfRole = existingStorage.role;
          }
        }

        const inviteFailure = classifyInviteFailureFromRoomIndex(roomIndex, selfRole);
        if (inviteFailure === "already-joined") {
          if (selfRole === "host" || selfRole === "guest") {
            if (typeof persistOnlineSessionContext === "function") {
              persistOnlineSessionContext(inviteRoomCode, selfRole);
            }
          }
          return {
            resumed: false,
            notice: getInviteFailureMessage("already-joined"),
            noticeIsError: false,
            openOnlinePanel: false,
          };
        }
        if (inviteFailure) {
          return {
            resumed: false,
            notice: getInviteFailureMessage(inviteFailure),
            noticeIsError: true,
            openOnlinePanel: true,
          };
        }

        const joined = await startOnlineSession("guest", {
          roomCodeOverride: inviteRoomCode,
          source: "invite-link",
        });
        if (joined) {
          return { resumed: true, notice: "", noticeIsError: false, openOnlinePanel: false };
        }
        return {
          resumed: false,
          notice: ui.startOnlineStatus?.textContent || "Could not join that invite.",
          noticeIsError: true,
          openOnlinePanel: true,
        };
      }

      return { resumed: false, notice: "", noticeIsError: false, openOnlinePanel: false };
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
      setStartOnlineStatus("Create a room and share the invite link.", false);
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
        setStartOnlineStatus("Enter the invite room code, then tap Join by Code again.", false);
        return;
      }
      await startOnlineSession("guest");
    }

    async function onOnlineCopyInviteFromMenu() {
      const inviteLink = getInviteLinkForRoom(state.rtcRoomCode);
      if (!inviteLink) {
        setStartOnlineStatus("Create a room first to get an invite link.", true);
        return;
      }
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(inviteLink);
        } else if (document?.execCommand) {
          const ghostInput = document.createElement("textarea");
          ghostInput.value = inviteLink;
          ghostInput.setAttribute("readonly", "");
          ghostInput.style.position = "absolute";
          ghostInput.style.left = "-9999px";
          document.body.appendChild(ghostInput);
          ghostInput.select();
          document.execCommand("copy");
          document.body.removeChild(ghostInput);
        } else {
          throw new Error("Clipboard unavailable");
        }
        setStartOnlineStatus("Invite link copied.", false);
      } catch (err) {
        console.warn("online-start invite copy failed", err);
        setStartOnlineStatus("Could not copy invite link. Try again.", true);
      }
    }

    async function onOnlineShareInviteFromMenu() {
      const inviteLink = getInviteLinkForRoom(state.rtcRoomCode);
      if (!inviteLink) {
        setStartOnlineStatus("Create a room first to share an invite.", true);
        return;
      }
      if (typeof navigator.share !== "function") {
        setStartOnlineStatus("Share is not available on this device. Use Copy Invite Link.", true);
        return;
      }
      try {
        await navigator.share({
          title: "Join my Hanafuda Koi-Koi game",
          text: "Tap to join my online match.",
          url: inviteLink,
        });
      } catch (err) {
        if (err?.name === "AbortError") {
          return;
        }
        console.warn("online-start invite share failed", err);
        setStartOnlineStatus("Could not open share sheet. Use Copy Invite Link.", true);
      }
    }

    function onOnlineBackFromMenu() {
      resetRtcSession({ closeConnection: true });
      setStartOnlinePanelOpen(false);
    }

    function dismissStartExpiredNote() {
      setExpiredRoomNotice("");
    }

    async function startOnlineSession(role, options = {}) {
      const hostRequest = role === "host";
      const hostBtn = ui.onlineHostBtn || null;
      const hostBtnOriginalText = hostBtn ? hostBtn.textContent : "";
      const roomCodeOverride = normalizeRoomCodeInput(options.roomCodeOverride || "");
      const source = String(options.source || "").trim().toLowerCase();
      let hostLockAcquired = false;
      try {
        const rtc = getRtcBridge();
        if (!rtc || typeof rtc.hostRoom !== "function" || typeof rtc.joinRoom !== "function") {
          setStartOnlineStatus("Online mode unavailable: RTC bridge not loaded.", true);
          return false;
        }
        if (!ensureOnlineAuthReadyForStart()) return false;
        const joinRoomCode = roomCodeOverride || normalizeRoomCodeInput(ui.onlineRoomCodeInput?.value || "");
        setStartOnlinePanelMode(role === "host" ? "host" : "join");
        if (role === "guest" && ui.onlineRoomCodeInput) {
          ui.onlineRoomCodeInput.value = joinRoomCode;
        }
        if (role === "guest") {
          if (!joinRoomCode) {
            setStartOnlineStatus(source === "invite-link" ? getInviteFailureMessage("invalid") : "Enter a room code to join.", true);
            return false;
          }
          if (!onlineRoomCodeRegex.test(joinRoomCode)) {
            setStartOnlineStatus(
              source === "invite-link"
                ? getInviteFailureMessage("invalid")
                : `Room code must be exactly ${onlineRoomCodeLength} uppercase letters/numbers.`,
              true
            );
            return false;
          }
        }

        if (hostRequest) {
          if (hostCreateInFlight) return false;
          hostCreateInFlight = true;
          hostLockAcquired = true;
          if (hostBtn) {
            hostBtn.disabled = true;
            hostBtn.classList.add("is-loading");
            hostBtn.textContent = "Creating...";
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
            return false;
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
            setExpiredRoomNotice("");
            if (role === "host") {
              const inviteLink = getInviteLinkForRoom(roomCode);
              if (inviteLink) {
                setStartOnlineStatus("Invite link ready. Tap Copy Invite Link or Share Invite.", false);
              } else {
                setStartOnlineStatus(`Room ${roomCode} ready. Share invite link with your friend.`, false);
              }
            } else {
              setStartOnlineStatus(
                source === "invite-link" ? `Joined invite ${roomCode}. Waiting for opponent...` : `Room ${roomCode} joined.`,
                false
              );
            }
            renderAll();
            return true;
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
        if (role === "host" && isOnlineRoomCodeCollisionError(lastError)) {
          setStartOnlineStatus("Could not create a new online room right now. Please try again.", true);
          return false;
        }
        if (isOnlineAuthFailureError(lastError)) {
          setOnlineAuthState("error", ONLINE_AUTH_FAILURE_MESSAGE);
          setStartOnlineStatus(ONLINE_AUTH_FAILURE_MESSAGE, true);
          return false;
        }
        if (role === "guest") {
          const inviteFailure = classifyInviteFailureFromError(lastError);
          if (inviteFailure) {
            setStartOnlineStatus(getInviteFailureMessage(inviteFailure), true);
            return false;
          }
          setStartOnlineStatus("Could not join this room. Check the invite and try again.", true);
          return false;
        }
        setStartOnlineStatus("Online setup failed. Please try again.", true);
        return false;
      } finally {
        if (hostLockAcquired) {
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
      if (typeof handleIncomingRtcPayload !== "function") {
        setFriendInterstitialOpen(true, state.currentPlayer);
        setFriendInterstitialStatus("Incoming online payload handler is unavailable.", true);
        renderAll();
        return;
      }
      try {
        handleIncomingRtcPayload(rawPayload);
      } catch (err) {
        setFriendInterstitialOpen(true, state.currentPlayer);
        setFriendInterstitialStatus(String(err?.message || "Incoming online handoff failed."), true);
        renderAll();
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
      onOnlineCopyInviteFromMenu,
      onOnlineShareInviteFromMenu,
      onOnlineBackFromMenu,
      startOnlineSession,
      onRtcReceiveTurnCode,
    };
  }

  window.createOnlineStartController = createOnlineStartController;
})();
