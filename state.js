(function attachStateBootstrap() {
  const GAME_PROXY_KEYS = [
    "players",
    "gameNumber",
    "maxGames",
    "dealer",
    "currentPlayer",
    "field",
    "drawPile",
    "tableMultiplier",
    "lastKoiCaller",
    "firstYakuPlayer",
    "roundSpecialTwoXPlayer",
    "nextRoundSpecialTwoXPlayer",
    "roundLeaderAtStart",
    "previousRoundWinner",
    "previousRoundMultiplier",
    "roundHistory",
    "moveCounts",
    "roundOver",
    "matchOver",
    "aiProfile",
    "playMode",
    "friendFlow",
    "viewerPlayerIndex",
    "interstitial",
    "roundTransition",
    "turnCheckpointReady",
    "lastExportMeta",
  ];

  const TURN_PROXY_KEYS = [
    "pendingSelection",
    "awaitingDeckFlip",
    "aiPreview",
    "cpuPhase1PreviewCardId",
    "awaitingDecision",
    "drawPreview",
    "actionLog",
    "message",
    "activeTurnRecap",
    "lastTurnRecap",
  ];

  const SESSION_PROXY_KEYS = [
    "ready",
    "sprites",
    "selectedDeckId",
    "selectedThemeId",
    "captureViewMode",
    "recentCapturedIdsByPlayer",
    "turnCapturedIdsByPlayer",
    "deckSheets",
    "deckThumbs",
    "deckStatusMessage",
    "deckStatusError",
    "deckValidationLogged",
    "deckOverrideDebugLoggedById",
    "aiTimer",
    "aiTask",
    "drawRevealTimer",
    "autoFocusTargetKey",
    "turnReplay",
    "manualLoadFallback",
    "rtcStatus",
    "rtcRoomCode",
    "rtcRole",
    "rtcWaiting",
    "rtcTurnSaveInFlight",
    "rtcPendingStart",
    "rtcInitSent",
    "rtcInitApplied",
    "rtcHeartbeatPulse",
    "rtcPulseTimer",
    "rtcRemotePresence",
    "rtcPresenceMissingSince",
    "rtcPresenceTimeoutShown",
    "rtcReconnectInFlight",
    "rtcReconnectFailed",
    "rtcOpponentAbandoned",
    "rtcOpponentAbandonedBy",
    "rtcLastAppliedSnapshotKey",
    "rtcLastAppliedSnapshotTurnIndex",
    "rtcLastAppliedSnapshotReason",
    "rtcLastAppliedSnapshotAt",
    "startOnlineMode",
    "onlineHostMovesFirst",
    "startMatchLength",
    "onlineAuthState",
    "onlineAuthMessage",
  ];

  function defineStateProxies(container, source, keys) {
    for (const key of keys) {
      Object.defineProperty(container, key, {
        enumerable: true,
        configurable: false,
        get() {
          return source[key];
        },
        set(value) {
          source[key] = value;
        },
      });
    }
  }

  function createGameState(defaultAiProfile) {
    return {
      players: [],
      gameNumber: 1,
      maxGames: 12,
      dealer: 0,
      currentPlayer: 0,
      field: [],
      drawPile: [],
      tableMultiplier: 1,
      lastKoiCaller: null,
      firstYakuPlayer: null,
      roundSpecialTwoXPlayer: null,
      nextRoundSpecialTwoXPlayer: null,
      roundLeaderAtStart: null,
      previousRoundWinner: null,
      previousRoundMultiplier: null,
      roundHistory: [],
      moveCounts: [0, 0],
      roundOver: false,
      matchOver: false,
      aiProfile: defaultAiProfile,
      playMode: "cpu",
      friendFlow: "hybrid",
      viewerPlayerIndex: 0,
      interstitial: {
        open: false,
        nextPlayerIndex: null,
      },
      roundTransition: {
        open: false,
        winnerIndex: null,
        pointsAwarded: 0,
        noScore: false,
        nextGameNumber: null,
        acks: {
          p0: false,
          p1: false,
          local: false,
        },
      },
      turnCheckpointReady: false,
      lastExportMeta: null,
    };
  }

  function createTurnState() {
    return {
      pendingSelection: null,
      awaitingDeckFlip: null,
      aiPreview: null,
      cpuPhase1PreviewCardId: null,
      awaitingDecision: null,
      drawPreview: {
        cardId: null,
        text: "Waiting for draw.",
      },
      actionLog: [],
      message: "",
      activeTurnRecap: null,
      lastTurnRecap: null,
    };
  }

  function createSessionState() {
    return {
      ready: false,
      sprites: {},
      selectedDeckId: "classic",
      selectedThemeId: "classicWarm",
      captureViewMode: "expanded",
      recentCapturedIdsByPlayer: [[], []],
      turnCapturedIdsByPlayer: [[], []],
      deckSheets: {},
      deckThumbs: {},
      deckStatusMessage: "",
      deckStatusError: false,
      deckValidationLogged: false,
      deckOverrideDebugLoggedById: {},
      aiTimer: null,
      aiTask: null,
      drawRevealTimer: null,
      autoFocusTargetKey: null,
      turnReplay: {
        active: false,
        note: "",
        timer: null,
        key: null,
        steps: [],
        index: 0,
        lastStepAt: 0,
      },
      manualLoadFallback: {
        start: false,
        friend: false,
      },
      rtcStatus: "idle",
      rtcRoomCode: "",
      rtcRole: null,
      rtcWaiting: false,
      rtcTurnSaveInFlight: false,
      rtcPendingStart: false,
      rtcInitSent: false,
      rtcInitApplied: false,
      rtcHeartbeatPulse: false,
      rtcPulseTimer: null,
      rtcRemotePresence: null,
      rtcPresenceMissingSince: 0,
      rtcPresenceTimeoutShown: false,
      rtcReconnectInFlight: false,
      rtcReconnectFailed: false,
      rtcOpponentAbandoned: false,
      rtcOpponentAbandonedBy: "",
      rtcLastAppliedSnapshotKey: "",
      rtcLastAppliedSnapshotTurnIndex: -1,
      rtcLastAppliedSnapshotReason: "",
      rtcLastAppliedSnapshotAt: 0,
      startOnlineMode: "host",
      onlineHostMovesFirst: true,
      startMatchLength: 12,
      onlineAuthState: "pending",
      onlineAuthMessage: "Online mode is signing in anonymously...",
    };
  }

  function createState(defaultAiProfile) {
    const gameState = createGameState(defaultAiProfile);
    const turnState = createTurnState();
    const sessionState = createSessionState();
    const state = {
      game: gameState,
      turn: turnState,
      session: sessionState,
    };
    defineStateProxies(state, gameState, GAME_PROXY_KEYS);
    defineStateProxies(state, turnState, TURN_PROXY_KEYS);
    defineStateProxies(state, sessionState, SESSION_PROXY_KEYS);
    return state;
  }

  window.HKKStateBootstrap = {
    createState,
  };
})();
