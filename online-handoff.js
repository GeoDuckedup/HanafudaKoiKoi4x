(function attachOnlineHandoffController() {
  function createOnlineHandoffController(deps) {
    const {
      state,
      ui,
      setCodeStatus,
      setFriendManualLoadVisible,
      tryLoadFromClipboardOrManual,
      isFriendMode,
      asPlayerIndex,
      isOnlineFriendSessionActive,
      getRtcBridge,
      encodeStateForOnline,
      sendOnlineTurnCodeWithSnapshot,
      handleRtcReconnectRetry,
      encodeStateToCode,
      buildShareLinkFromCode,
      playTurnRecapForViewer,
      renderAll,
      resetRtcSession,
      showStartMenu,
    } = deps;

    function setFriendInterstitialStatus(message, isError) {
      setCodeStatus(message, isError, "friend");
    }

    function setFriendInterstitialOpen(open, nextPlayerIndex = null) {
      const shouldOpen = Boolean(open);
      const normalizedNext =
        shouldOpen && nextPlayerIndex !== null && nextPlayerIndex !== undefined
          ? asPlayerIndex(nextPlayerIndex, "interstitial.nextPlayerIndex")
          : null;
      state.interstitial = {
        open: shouldOpen,
        nextPlayerIndex: shouldOpen ? (normalizedNext === null ? state.currentPlayer : normalizedNext) : null,
      };
      if (!shouldOpen) {
        setFriendInterstitialStatus("", false);
        setFriendManualLoadVisible(false);
        if (ui.friendImportCode) ui.friendImportCode.value = "";
      }
    }

    function onFriendInterstitialLoadCode() {
      if (state.rtcReconnectInFlight) return;
      if (state.rtcReconnectFailed && typeof handleRtcReconnectRetry === "function") {
        void handleRtcReconnectRetry();
        return;
      }
      tryLoadFromClipboardOrManual("friend");
    }

    function prepareFriendTurnHandoff(lastActorIndex, moveNumber, nextPlayerIndex) {
      if (!isFriendMode()) return;
      if (Number.isFinite(lastActorIndex) && Number.isFinite(moveNumber)) {
        state.lastExportMeta = {
          turnNumber: Math.max(1, Number(moveNumber)),
          playerIndex: asPlayerIndex(lastActorIndex, "lastExportMeta.playerIndex"),
        };
      }
      setFriendInterstitialOpen(true, nextPlayerIndex);
    }

    function dispatchFriendTurnHandoff(lastActorIndex, moveNumber, nextPlayerIndex) {
      prepareFriendTurnHandoff(lastActorIndex, moveNumber, nextPlayerIndex);
      if (!isOnlineFriendSessionActive()) {
        state.rtcWaiting = false;
        renderAll();
        return;
      }

      const rtc = getRtcBridge();
      if (!rtc || typeof rtc.sendTurnCode !== "function") {
        setFriendInterstitialStatus("Online transport unavailable. Return to menu and reconnect.", true);
        state.rtcWaiting = false;
        renderAll();
        return;
      }

      if (state.rtcStatus !== "connected") {
        setFriendInterstitialStatus("Peer not connected yet. Wait for reconnect or return to menu.", true);
        state.rtcWaiting = false;
        renderAll();
        return;
      }

      let code = "";
      try {
        code = encodeStateForOnline();
      } catch (err) {
        setFriendInterstitialStatus(`Could not send turn: ${err.message}`, true);
        state.rtcWaiting = false;
        renderAll();
        return;
      }
      if (typeof sendOnlineTurnCodeWithSnapshot === "function") {
        state.rtcWaiting = false;
        setFriendInterstitialStatus("Saving turn snapshot...", false);
        renderAll();
        void Promise.resolve(
          sendOnlineTurnCodeWithSnapshot(code, code, {
            context: "turn-handoff",
            onSnapshotWriteFailed: () => {
              setFriendInterstitialStatus("Could not save turn snapshot. Retry in a moment.", true);
            },
            onSendFailed: () => {
              setFriendInterstitialStatus("Automatic send failed. Waiting for reconnect.", true);
            },
          })
        ).then((sent) => {
          if (!sent) {
            state.rtcWaiting = false;
            renderAll();
            return;
          }
          state.rtcWaiting = true;
          setFriendInterstitialStatus(`Turn sent automatically (room ${state.rtcRoomCode}).`, false);
          renderAll();
        }).catch((err) => {
          console.warn("online handoff send failed", err);
          state.rtcWaiting = false;
          setFriendInterstitialStatus("Automatic send failed. Waiting for reconnect.", true);
          renderAll();
        });
        return;
      }
      const sent = rtc.sendTurnCode(code);
      if (!sent) {
        setFriendInterstitialStatus("Automatic send failed. Waiting for reconnect.", true);
        state.rtcWaiting = false;
        renderAll();
        return;
      }
      state.rtcWaiting = true;
      setFriendInterstitialStatus(`Turn sent automatically (room ${state.rtcRoomCode}).`, false);
      renderAll();
    }

    async function onFriendInterstitialCopyCode() {
      if (!isFriendMode() || !state.interstitial?.open) return;
      let link = "";
      try {
        link = buildShareLinkFromCode(encodeStateToCode());
      } catch (err) {
        setFriendInterstitialStatus(`Could not generate link: ${err.message}`, true);
        return;
      }
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(link);
        } else {
          const temp = document.createElement("textarea");
          temp.value = link;
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
        setFriendInterstitialStatus("Turn link copied.", false);
      } catch (err) {
        setFriendInterstitialStatus(`Copy failed: ${err.message}`, true);
      }
    }

    function onFriendInterstitialContinue() {
      if (!isFriendMode() || !state.interstitial?.open) return;
      if (state.rtcWaiting) return;
      if (isOnlineFriendSessionActive() && (state.rtcStatus === "disconnected" || state.rtcStatus === "error")) return;
      const nextPlayerIndex =
        state.interstitial.nextPlayerIndex === null || state.interstitial.nextPlayerIndex === undefined
          ? state.currentPlayer
          : state.interstitial.nextPlayerIndex;
      state.viewerPlayerIndex = nextPlayerIndex;
      setFriendInterstitialOpen(false);
      playTurnRecapForViewer();
      renderAll();
    }

    function onFriendBackToMenu() {
      void (async () => {
        const onlineSessionActive = isOnlineFriendSessionActive();
        if (onlineSessionActive) {
          const confirmed = window.confirm(
            "Leave this online game and return to menu? The game stays active and you can resume from Load Game."
          );
          if (!confirmed) return;
        }
        resetRtcSession({ closeConnection: true });
        setFriendInterstitialOpen(false);
        showStartMenu();
      })();
    }

    return {
      setFriendInterstitialStatus,
      setFriendInterstitialOpen,
      onFriendInterstitialLoadCode,
      prepareFriendTurnHandoff,
      dispatchFriendTurnHandoff,
      onFriendInterstitialCopyCode,
      onFriendInterstitialContinue,
      onFriendBackToMenu,
    };
  }

  window.createOnlineHandoffController = createOnlineHandoffController;
})();
