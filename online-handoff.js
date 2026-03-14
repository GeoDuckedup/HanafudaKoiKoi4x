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
      getOnlineSnapshotTurnIndex,
      buildOnlineRoomSummaryFromState,
      handleRtcReconnectRetry,
      encodeStateToCode,
      buildShareLinkFromCode,
      buildOnlineInviteLink,
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
        state.rtcTurnSaveInFlight = false;
        renderAll();
        return;
      }

      const rtc = getRtcBridge();
      if (!rtc || typeof rtc.writeSnapshot !== "function") {
        setFriendInterstitialStatus("Online transport unavailable. Return to menu and reconnect.", true);
        state.rtcWaiting = false;
        state.rtcTurnSaveInFlight = false;
        renderAll();
        return;
      }

      let code = "";
      try {
        code = encodeStateForOnline();
      } catch (err) {
        setFriendInterstitialStatus(`Could not send turn: ${err.message}`, true);
        state.rtcWaiting = false;
        state.rtcTurnSaveInFlight = false;
        renderAll();
        return;
      }
      state.rtcWaiting = false;
      state.rtcTurnSaveInFlight = true;
      setFriendInterstitialStatus("Saving turn...", false);
      renderAll();
      void Promise.resolve().then(async () => {
        const snapshotTurnIndex =
          typeof getOnlineSnapshotTurnIndex === "function" ? getOnlineSnapshotTurnIndex() : 0;
        const snapshotSummary =
          typeof buildOnlineRoomSummaryFromState === "function" ? buildOnlineRoomSummaryFromState() : null;
        const wroteSnapshot = await rtc.writeSnapshot(code, snapshotTurnIndex, snapshotSummary);
        if (!wroteSnapshot) {
          state.rtcWaiting = false;
          state.rtcTurnSaveInFlight = false;
          setFriendInterstitialStatus("Could not save turn. Retry in a moment.", true);
          renderAll();
          return;
        }
        state.rtcTurnSaveInFlight = false;
        state.rtcWaiting = true;
        if (state.rtcStatus === "connected" && typeof rtc.sendTurnCode === "function") {
          const sent = rtc.sendTurnCode(code);
          if (sent) {
            setFriendInterstitialStatus(`Turn sent automatically (room ${state.rtcRoomCode}).`, false);
          } else {
            setFriendInterstitialStatus("Turn saved. Opponent will receive it when they reconnect.", false);
          }
        } else {
          setFriendInterstitialStatus("Turn saved. Opponent will receive it when they reconnect.", false);
        }
        renderAll();
      }).catch((err) => {
        console.warn("online handoff send failed", err);
        state.rtcWaiting = false;
        state.rtcTurnSaveInFlight = false;
        setFriendInterstitialStatus("Could not save turn. Retry in a moment.", true);
        renderAll();
      });
    }

    async function onFriendInterstitialCopyCode() {
      if (!isFriendMode() || !state.interstitial?.open) return;
      let link = "";
      try {
        if (isOnlineFriendSessionActive()) {
          link = String(buildOnlineInviteLink?.(state.rtcRoomCode) || "").trim();
          if (!link) {
            throw new Error("Invite URL unavailable.");
          }
        } else {
          link = buildShareLinkFromCode(encodeStateToCode());
        }
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
        setFriendInterstitialStatus(isOnlineFriendSessionActive() ? "Game URL copied." : "Turn link copied.", false);
      } catch (err) {
        setFriendInterstitialStatus(`Copy failed: ${err.message}`, true);
      }
    }

    function onFriendInterstitialContinue() {
      if (!isFriendMode() || !state.interstitial?.open) return;
      if (state.rtcTurnSaveInFlight) return;
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
