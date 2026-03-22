(function attachOnlineStateSync(globalScope) {
  /**
   * Online state-sync coordinator.
   * Responsible for authoritative snapshot import, dedupe, and wait/active posture derivation.
   */
  function createOnlineStateSync(deps) {
    const {
      state,
      isOnlineFriendSessionActive,
      getOnlineLocalPlayerIndex,
      setFriendInterstitialOpen,
      setFriendInterstitialStatus,
      renderAll,
      loadCodeIntoGame,
    } = deps;

    function computeSnapshotKey(rawStateCode) {
      const normalized = String(rawStateCode || "").trim();
      if (!normalized) return "";
      const parts = normalized.split(".");
      if (parts.length === 3) {
        return `${parts[0]}.${parts[2]}:${parts[1].length}`;
      }
      return normalized;
    }

    function clearAppliedSnapshotMarkers() {
      state.rtcLastAppliedSnapshotKey = "";
      state.rtcLastAppliedSnapshotTurnIndex = -1;
      state.rtcLastAppliedSnapshotReason = "";
      state.rtcLastAppliedSnapshotAt = 0;
    }

    function applyOnlineWaitingStateFromCurrentTurn(reason) {
      if (!isOnlineFriendSessionActive()) return;
      if (state.matchOver) {
        state.rtcWaiting = false;
        setFriendInterstitialOpen(false);
        setFriendInterstitialStatus("", false);
        return;
      }
      if (state.roundTransition?.open && state.roundOver && !state.matchOver) {
        state.rtcWaiting = false;
        setFriendInterstitialOpen(false);
        setFriendInterstitialStatus("", false);
        return;
      }
      const localPlayerIndex = getOnlineLocalPlayerIndex();
      const turnOwner = state.currentPlayer === 0 || state.currentPlayer === 1 ? state.currentPlayer : null;
      const shouldWait = localPlayerIndex === null || turnOwner === null || localPlayerIndex !== turnOwner;
      state.rtcWaiting = shouldWait;
      if (shouldWait) {
        setFriendInterstitialOpen(true, turnOwner);
        const ownerName = turnOwner === null ? "opponent" : state.players?.[turnOwner]?.name || `P${turnOwner + 1}`;
        setFriendInterstitialStatus(`Waiting for ${ownerName}. (${reason})`, false);
        return;
      }
      setFriendInterstitialOpen(false);
      setFriendInterstitialStatus("", false);
    }

    function applyAuthoritativeSnapshot(stateCode, options = {}) {
      const normalizedStateCode = String(stateCode || "").trim();
      if (!normalizedStateCode) {
        throw new Error("Missing online snapshot payload.");
      }
      const reason = String(options.reason || "remote-snapshot");
      const markInitApplied = options.markInitApplied !== false;
      const hasTurnIndex = Number.isFinite(Number(options.turnIndex));
      const normalizedTurnIndex = hasTurnIndex ? Math.max(0, Math.floor(Number(options.turnIndex))) : null;
      const allowSameTurnNewKey = options.allowSameTurnNewKey === true;
      const snapshotKey = computeSnapshotKey(normalizedStateCode);
      const priorKey = String(state.rtcLastAppliedSnapshotKey || "");
      const priorTurnIndex = Number(state.rtcLastAppliedSnapshotTurnIndex);
      const hasPriorTurnIndex = Number.isFinite(priorTurnIndex) && priorTurnIndex >= 0;
      const duplicateByKey = Boolean(snapshotKey) && snapshotKey === priorKey;
      const olderTurn = hasTurnIndex && hasPriorTurnIndex && normalizedTurnIndex < priorTurnIndex;
      const sameTurn = hasTurnIndex && hasPriorTurnIndex && normalizedTurnIndex === priorTurnIndex;
      const sameTurnDuplicate = sameTurn && (duplicateByKey || !allowSameTurnNewKey);
      if (duplicateByKey || olderTurn || sameTurnDuplicate) {
        return {
          applied: false,
          duplicate: true,
          key: snapshotKey,
          turnIndex: Number.isFinite(priorTurnIndex) ? priorTurnIndex : -1,
        };
      }

      const loaded = loadCodeIntoGame(normalizedStateCode, "friend", {
        allowNonCheckpointFriendImport: true,
        allowMissingDrawPile: true,
      });
      if (!loaded) {
        throw new Error("Could not load authoritative online snapshot.");
      }
      const localPlayerIndex = getOnlineLocalPlayerIndex();
      if (localPlayerIndex === 0 || localPlayerIndex === 1) {
        state.viewerPlayerIndex = localPlayerIndex;
      }
      state.rtcPendingStart = false;
      state.rtcReconnectFailed = false;
      state.rtcTurnSaveInFlight = false;
      if (markInitApplied) {
        state.rtcInitApplied = true;
      }
      state.rtcLastAppliedSnapshotKey = snapshotKey;
      if (hasTurnIndex) {
        state.rtcLastAppliedSnapshotTurnIndex = normalizedTurnIndex;
      }
      state.rtcLastAppliedSnapshotReason = reason;
      state.rtcLastAppliedSnapshotAt = Date.now();
      applyOnlineWaitingStateFromCurrentTurn(reason);
      if (state.ready) {
        renderAll();
      }
      return {
        applied: true,
        duplicate: false,
        key: snapshotKey,
        turnIndex: hasTurnIndex ? normalizedTurnIndex : state.rtcLastAppliedSnapshotTurnIndex,
      };
    }

    function applyReconnectSnapshot(snapshot, options = {}) {
      const payload = snapshot && typeof snapshot === "object" ? snapshot : null;
      if (!payload || typeof payload.state !== "string" || !payload.state.trim()) {
        throw new Error("Missing reconnect snapshot payload.");
      }
      const turnIndex = Number(payload.turnIndex);
      if (!Number.isFinite(turnIndex) || turnIndex < 0) {
        throw new Error("Reconnect snapshot missing turn index.");
      }
      return applyAuthoritativeSnapshot(payload.state, {
        reason: options.reason || "reconnect",
        turnIndex,
        allowSameTurnNewKey: true,
        markInitApplied: true,
      });
    }

    return {
      clearAppliedSnapshotMarkers,
      applyOnlineWaitingStateFromCurrentTurn,
      applyAuthoritativeSnapshot,
      applyReconnectSnapshot,
    };
  }

  const api = {
    createOnlineStateSync,
  };

  if (globalScope) {
    globalScope.HKKOnlineStateSync = api;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
