(function attachOnlineRuntimeController() {
  function createOnlineRuntimeController(deps) {
    const {
      state,
      getRtcBridge,
      setStartOnlineStatus,
      setFriendInterstitialStatus,
      beginOnlineFriendMatch,
      onPeerConnected,
      handleRtcDisconnectAutoReconnect,
      renderAll,
      setStartOnlineRoomDisplay,
      applyOnlineAuthUiState,
      clearOnlineSessionContext,
      clearOnlineRealtimeSubscriptions,
    } = deps;

    function bindRtcBridge() {
      const rtc = getRtcBridge();
      if (!rtc || typeof rtc.onStatusChange !== "function") {
        state.rtcStatus = "idle";
        return;
      }
      rtc.onStatusChange((nextStatus) => {
        state.rtcStatus = String(nextStatus || "idle");
        if (state.rtcPendingStart) {
          if (state.rtcStatus === "connecting") {
            setStartOnlineStatus(`Connecting room ${state.rtcRoomCode}...`, false);
          } else if (state.rtcStatus === "disconnected" || state.rtcStatus === "error") {
            setStartOnlineStatus("Connection failed. Try hosting/joining again.", true);
          } else if (state.rtcStatus === "connected") {
            setStartOnlineStatus("Connected. Syncing latest game state...", false);
          }
        }
        if (state.rtcRole && state.rtcOpponentAbandoned) {
          setFriendInterstitialStatus("Your opponent left this online game. Return to menu to start a new room.", true);
          if (state.ready) {
            renderAll();
          }
          return;
        }
        if (state.rtcRole && !state.rtcPendingStart && state.rtcStatus === "disconnected") {
          setFriendInterstitialStatus("Connection lost. Reconnecting...", false);
          if (typeof handleRtcDisconnectAutoReconnect === "function") {
            void handleRtcDisconnectAutoReconnect();
          }
        } else if (state.rtcRole && !state.rtcPendingStart && state.rtcStatus === "error") {
          setFriendInterstitialStatus("Connection error. Reconnecting...", false);
          if (typeof handleRtcDisconnectAutoReconnect === "function") {
            void handleRtcDisconnectAutoReconnect();
          }
        } else if (state.rtcRole && state.rtcStatus === "connected" && state.rtcWaiting) {
          setFriendInterstitialStatus("Connected. Waiting for incoming handoff.", false);
        }
        if (state.rtcStatus === "connected" && state.rtcRole && !state.rtcPendingStart) {
          if (typeof onPeerConnected === "function") {
            onPeerConnected();
          }
        }
        if (state.rtcPendingStart && state.rtcStatus === "connected" && state.rtcRole === "guest") {
          beginOnlineFriendMatch();
        }
        if (state.ready) {
          renderAll();
        }
      });
      if (typeof rtc.onHeartbeat === "function") {
        rtc.onHeartbeat(() => {
          triggerRtcHeartbeatPulse();
        });
      }
      state.rtcStatus = String(rtc.getStatus?.() || "idle");
    }

    function resetRtcSession(options = {}) {
      const { closeConnection = false } = options;
      if (state.rtcPulseTimer) {
        clearTimeout(state.rtcPulseTimer);
      }
      if (typeof clearOnlineRealtimeSubscriptions === "function") {
        clearOnlineRealtimeSubscriptions();
      }
      state.rtcPulseTimer = null;
      state.rtcHeartbeatPulse = false;
      if (closeConnection) {
        const rtc = getRtcBridge();
        if (rtc && typeof rtc.closeRoom === "function") {
          rtc.closeRoom();
        }
        if (typeof clearOnlineSessionContext === "function") {
          clearOnlineSessionContext();
        }
      }
      state.rtcRole = null;
      state.rtcRoomCode = "";
      state.rtcWaiting = false;
      state.rtcPendingStart = false;
      state.rtcInitSent = false;
      state.rtcInitApplied = false;
      state.rtcReconnectInFlight = false;
      state.rtcReconnectFailed = false;
      state.rtcOpponentAbandoned = false;
      state.rtcOpponentAbandonedBy = "";
      state.rtcLastAppliedSnapshotKey = "";
      state.rtcLastAppliedSnapshotTurnIndex = -1;
      state.rtcLastAppliedSnapshotReason = "";
      state.rtcLastAppliedSnapshotAt = 0;
      const rtc = getRtcBridge();
      state.rtcStatus = String(rtc?.getStatus?.() || "idle");
      setStartOnlineStatus("", false);
      setStartOnlineRoomDisplay("");
      applyOnlineAuthUiState();
    }

    function triggerRtcHeartbeatPulse() {
      if (state.rtcPulseTimer) {
        clearTimeout(state.rtcPulseTimer);
      }
      state.rtcHeartbeatPulse = false;
      if (state.ready) renderAll();
      state.rtcHeartbeatPulse = true;
      state.rtcPulseTimer = setTimeout(() => {
        state.rtcPulseTimer = null;
        state.rtcHeartbeatPulse = false;
        if (state.ready) renderAll();
      }, 600);
      if (state.ready) renderAll();
    }

    return {
      bindRtcBridge,
      resetRtcSession,
      triggerRtcHeartbeatPulse,
    };
  }

  window.createOnlineRuntimeController = createOnlineRuntimeController;
})();
