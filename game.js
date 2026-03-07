const SHEET_PATHS = {
  janCustom: "assets/custom/january.png",
  m02Custom: "assets/custom/february.png",
  m03Custom: "assets/custom/march.png",
  m04Custom: "assets/custom/april.png",
  m05Custom: "assets/custom/may.png",
  m06Custom: "assets/custom/june.png",
  m07Custom: "assets/custom/july.png",
  m08Custom: "assets/custom/august.jpg",
  m09Custom: "assets/custom/september.png",
  m10Custom: "assets/custom/october.png",
  m11Custom: "assets/custom/november.png",
  m12Custom: "assets/custom/december.png",
};

const MONTH_SPRITES = {
  1: [
    { sheet: "janCustom", x: 141, y: 14, w: 360, h: 487 },
    { sheet: "janCustom", x: 522, y: 14, w: 360, h: 487 },
    { sheet: "janCustom", x: 141, y: 521, w: 360, h: 484 },
    { sheet: "janCustom", x: 521, y: 521, w: 361, h: 484 },
  ],
  2: [
    { sheet: "m02Custom", x: 521, y: 779, w: 408, h: 630 },
    { sheet: "m02Custom", x: 94, y: 779, w: 407, h: 630 },
    { sheet: "m02Custom", x: 95, y: 127, w: 407, h: 627 },
    { sheet: "m02Custom", x: 521, y: 127, w: 408, h: 627 },
  ],
  3: [
    { sheet: "m03Custom", x: 523, y: 14, w: 359, h: 487 },
    { sheet: "m03Custom", x: 523, y: 522, w: 359, h: 483 },
    { sheet: "m03Custom", x: 141, y: 14, w: 359, h: 487 },
    { sheet: "m03Custom", x: 141, y: 522, w: 359, h: 483 },
  ],
  4: [
    { sheet: "m04Custom", x: 94, y: 126, w: 409, h: 629 },
    { sheet: "m04Custom", x: 94, y: 782, w: 408, h: 625 },
    { sheet: "m04Custom", x: 520, y: 126, w: 409, h: 629 },
    { sheet: "m04Custom", x: 520, y: 782, w: 409, h: 626 },
  ],
  5: [
    { sheet: "m05Custom", x: 94, y: 126, w: 407, h: 629 },
    { sheet: "m05Custom", x: 94, y: 781, w: 413, h: 636 },
    { sheet: "m05Custom", x: 520, y: 126, w: 410, h: 632 },
    { sheet: "m05Custom", x: 520, y: 780, w: 411, h: 636 },
  ],
  6: [
    { sheet: "m06Custom", x: 145, y: 15, w: 360, h: 486 },
    { sheet: "m06Custom", x: 144, y: 523, w: 359, h: 482 },
    { sheet: "m06Custom", x: 526, y: 15, w: 360, h: 486 },
    { sheet: "m06Custom", x: 524, y: 523, w: 361, h: 481 },
  ],
  7: [
    { sheet: "m07Custom", x: 141, y: 15, w: 359, h: 486 },
    { sheet: "m07Custom", x: 521, y: 15, w: 361, h: 486 },
    { sheet: "m07Custom", x: 141, y: 521, w: 359, h: 483 },
    { sheet: "m07Custom", x: 521, y: 521, w: 361, h: 483 },
  ],
  8: [
    { sheet: "m08Custom", x: 140, y: 16, w: 361, h: 485 },
    { sheet: "m08Custom", x: 521, y: 15, w: 361, h: 486 },
    { sheet: "m08Custom", x: 138, y: 523, w: 363, h: 479 },
    { sheet: "m08Custom", x: 521, y: 523, w: 362, h: 479 },
  ],
  9: [
    { sheet: "m09Custom", x: 155, y: 15, w: 357, h: 485 },
    { sheet: "m09Custom", x: 155, y: 521, w: 357, h: 482 },
    { sheet: "m09Custom", x: 534, y: 15, w: 357, h: 485 },
    { sheet: "m09Custom", x: 534, y: 521, w: 357, h: 482 },
  ],
  10: [
    { sheet: "m10Custom", x: 425, y: 103, w: 333, h: 513 },
    { sheet: "m10Custom", x: 79, y: 635, w: 331, h: 511 },
    { sheet: "m10Custom", x: 80, y: 103, w: 330, h: 513 },
    { sheet: "m10Custom", x: 425, y: 634, w: 333, h: 512 },
  ],
  11: [
    { sheet: "m11Custom", x: 74, y: 63, w: 333, h: 550 },
    { sheet: "m11Custom", x: 423, y: 63, w: 333, h: 550 },
    { sheet: "m11Custom", x: 74, y: 631, w: 333, h: 559 },
    { sheet: "m11Custom", x: 423, y: 631, w: 333, h: 559 },
  ],
  12: [
    { sheet: "m12Custom", x: 520, y: 781, w: 409, h: 628 },
    { sheet: "m12Custom", x: 95, y: 127, w: 409, h: 632 },
    { sheet: "m12Custom", x: 520, y: 127, w: 409, h: 633 },
    { sheet: "m12Custom", x: 94, y: 780, w: 407, h: 629 },
  ],
};

const ACTION_LOG_LIMIT = 180;
const DEFAULT_AI_PROFILE = "balanced";
const AI_PROFILE_KEYS = ["safe", "balanced", "gambler"];

const AI_PROFILES = {
  safe: {
    card: {
      immediate: 1.0,
      yakuGain: 5.8,
      comboGain: 1.6,
      denial: 2.3,
      month: 0.7,
      expose: 1.5,
      lightBonus: 1.0,
      jitter: 0.12,
    },
    decision: {
      passBase: 1.8,
      koiBase: -0.3,
      multiplierHunger: 0.6,
      futureGainWeight: 0.52,
      riskWeight: 0.72,
      leadLockWeight: 0.24,
      leadRiskAversion: 0.22,
      comebackWeight: 0.11,
      latePassWeight: 0.46,
      behindPassPenalty: 0.08,
      highMultPassBonus: 1.3,
      handPhaseKoiBonus: 0.18,
      autoPassAtPoints: 8,
      maxMultRiskGuard: 0.95,
      koiMargin: 0.26,
      coinFlipBand: 0.9,
      randomKoiChance: 0.32,
    },
  },
  balanced: {
    card: {
      immediate: 1.1,
      yakuGain: 5.2,
      comboGain: 1.9,
      denial: 1.7,
      month: 0.9,
      expose: 1.0,
      lightBonus: 1.2,
      jitter: 0.2,
    },
    decision: {
      passBase: 0.7,
      koiBase: 0.5,
      multiplierHunger: 0.95,
      futureGainWeight: 0.62,
      riskWeight: 0.58,
      leadLockWeight: 0.15,
      leadRiskAversion: 0.16,
      comebackWeight: 0.21,
      latePassWeight: 0.3,
      behindPassPenalty: 0.06,
      highMultPassBonus: 0.8,
      handPhaseKoiBonus: 0.5,
      autoPassAtPoints: 10,
      maxMultRiskGuard: 1.12,
      koiMargin: 0.16,
      coinFlipBand: 0.75,
      randomKoiChance: 0.57,
    },
  },
  gambler: {
    card: {
      immediate: 1.2,
      yakuGain: 4.7,
      comboGain: 2.3,
      denial: 1.1,
      month: 1.1,
      expose: 0.6,
      lightBonus: 1.5,
      jitter: 0.34,
    },
    decision: {
      passBase: -0.6,
      koiBase: 1.8,
      multiplierHunger: 1.28,
      futureGainWeight: 0.86,
      riskWeight: 0.42,
      leadLockWeight: 0.08,
      leadRiskAversion: 0.1,
      comebackWeight: 0.34,
      latePassWeight: 0.18,
      behindPassPenalty: 0.03,
      highMultPassBonus: 0.25,
      handPhaseKoiBonus: 0.92,
      autoPassAtPoints: 13,
      maxMultRiskGuard: 1.45,
      koiMargin: -0.08,
      coinFlipBand: 1.0,
      randomKoiChance: 0.74,
    },
  },
};

const CPU_PROFILE_META = {
  safe: {
    name: "The Timid",
    style: "Low Risk",
    avatar: "assets/avatars/the-timid.png",
  },
  balanced: {
    name: "The Monk",
    style: "Balanced",
    avatar: "assets/avatars/the-monk.png",
  },
  gambler: {
    name: "The Gambler",
    style: "High Risk",
    avatar: "assets/avatars/the-gambler.png",
  },
};

const MONTHS = [
  { id: 1, name: "January", flower: "Pine" },
  { id: 2, name: "February", flower: "Plum Blossom" },
  { id: 3, name: "March", flower: "Cherry Blossom" },
  { id: 4, name: "April", flower: "Wisteria" },
  { id: 5, name: "May", flower: "Iris" },
  { id: 6, name: "June", flower: "Peony" },
  { id: 7, name: "July", flower: "Bush Clover" },
  { id: 8, name: "August", flower: "Pampas Grass" },
  { id: 9, name: "September", flower: "Chrysanthemum" },
  { id: 10, name: "October", flower: "Maple" },
  { id: 11, name: "November", flower: "Willow" },
  { id: 12, name: "December", flower: "Paulownia" },
];

const CARD_TYPE_BADGE_TEXT = {
  light: "BRT",
  seed: "SED",
  scroll: "SCR",
  basic: "PLN",
};

const MONTH_CARD_DEFS = [
  {
    month: 1,
    cards: [
      { code: "a", name: "Crane Light", type: "light" },
      { code: "b", name: "Red Scroll (Text)", type: "scroll", scrollKind: "redText" },
      { code: "c", name: "Pine Plain A", type: "basic" },
      { code: "d", name: "Pine Plain B", type: "basic" },
    ],
  },
  {
    month: 2,
    cards: [
      { code: "a", name: "Plum Bush Warbler", type: "seed" },
      { code: "b", name: "Red Scroll (Text)", type: "scroll", scrollKind: "redText" },
      { code: "c", name: "Plum Plain A", type: "basic" },
      { code: "d", name: "Plum Plain B", type: "basic" },
    ],
  },
  {
    month: 3,
    cards: [
      { code: "a", name: "Cherry Curtain", type: "light" },
      { code: "b", name: "Red Scroll (Text)", type: "scroll", scrollKind: "redText" },
      { code: "c", name: "Cherry Plain A", type: "basic" },
      { code: "d", name: "Cherry Plain B", type: "basic" },
    ],
  },
  {
    month: 4,
    cards: [
      { code: "a", name: "Wisteria Cuckoo", type: "seed" },
      { code: "b", name: "Red Scroll", type: "scroll", scrollKind: "red" },
      { code: "c", name: "Wisteria Plain A", type: "basic" },
      { code: "d", name: "Wisteria Plain B", type: "basic" },
    ],
  },
  {
    month: 5,
    cards: [
      { code: "a", name: "Iris Bridge", type: "seed" },
      { code: "b", name: "Red Scroll", type: "scroll", scrollKind: "red" },
      { code: "c", name: "Iris Plain A", type: "basic" },
      { code: "d", name: "Iris Plain B", type: "basic" },
    ],
  },
  {
    month: 6,
    cards: [
      { code: "a", name: "Peony Butterfly", type: "seed" },
      { code: "b", name: "Blue Scroll", type: "scroll", scrollKind: "blue" },
      { code: "c", name: "Peony Plain A", type: "basic" },
      { code: "d", name: "Peony Plain B", type: "basic" },
    ],
  },
  {
    month: 7,
    cards: [
      { code: "a", name: "Clover Boar", type: "seed" },
      { code: "b", name: "Red Scroll", type: "scroll", scrollKind: "red" },
      { code: "c", name: "Bush Clover Plain A", type: "basic" },
      { code: "d", name: "Bush Clover Plain B", type: "basic" },
    ],
  },
  {
    month: 8,
    cards: [
      { code: "a", name: "Moon Light", type: "light" },
      { code: "b", name: "Pampas Geese", type: "seed" },
      { code: "c", name: "Pampas Plain A", type: "basic" },
      { code: "d", name: "Pampas Plain B", type: "basic" },
    ],
  },
  {
    month: 9,
    cards: [
      { code: "a", name: "Sake Cup", type: "seed" },
      { code: "b", name: "Blue Scroll", type: "scroll", scrollKind: "blue" },
      { code: "c", name: "Chrysanthemum Plain A", type: "basic" },
      { code: "d", name: "Chrysanthemum Plain B", type: "basic" },
    ],
  },
  {
    month: 10,
    cards: [
      { code: "a", name: "Maple Deer", type: "seed" },
      { code: "b", name: "Blue Scroll", type: "scroll", scrollKind: "blue" },
      { code: "c", name: "Maple Plain A", type: "basic" },
      { code: "d", name: "Maple Plain B", type: "basic" },
    ],
  },
  {
    month: 11,
    cards: [
      { code: "a", name: "Rain Light", type: "light", isRainLight: true },
      { code: "b", name: "Willow Swallow", type: "seed" },
      { code: "c", name: "Red Scroll", type: "scroll", scrollKind: "red" },
      { code: "d", name: "Willow Plain", type: "basic" },
    ],
  },
  {
    month: 12,
    cards: [
      { code: "a", name: "Phoenix Light", type: "light" },
      { code: "b", name: "Paulownia Plain A", type: "basic" },
      { code: "c", name: "Paulownia Plain B", type: "basic" },
      { code: "d", name: "Paulownia Plain C", type: "basic" },
    ],
  },
];

const CARD_DECK = buildDeck();
const CARD_BY_ID = new Map(CARD_DECK.map((card) => [card.id, card]));

const scoringRules = window.HKKScoringRules;
if (!scoringRules || !Array.isArray(scoringRules.fixedYakuRules) || !Array.isArray(scoringRules.incrementalYakuRules)) {
  throw new Error("Scoring rules bootstrap not loaded.");
}
const FIXED_YAKU_RULES = scoringRules.fixedYakuRules;
const INCREMENTAL_YAKU_RULES = scoringRules.incrementalYakuRules;

const DRAW_PREVIEW_FLIP_MS = 220;
const PLAYER_DRAW_REVEAL_LINGER_MS = 420;
const CPU_DECK_FLIP_DELAY_MS = 320;
const CPU_DRAW_REVEAL_LINGER_MS = 360;
const AI_STEP_THINK_MS = 300;
const AI_STEP_CPU_PHASE1_PREVIEW_MS = 520;
const AI_STEP_TARGET_MS = 340;
const AI_STEP_DRAW_RESOLVE_MS = 360;
const AI_STEP_DECISION_MS = 420;
const TURN_REPLAY_STEP_MS = 2600;
const TURN_REPLAY_TAP_GUARD_MS = 220;
const SAVE_CODE_PREFIX = "HKK3";
const SAVE_CODE_VERSION = 3;
const SAVE_CODE_PREFIX_VERSION = {
  HKK2: 2,
  HKK3: 3,
};
const SUPPORTED_SAVE_VERSIONS = new Set(Object.values(SAVE_CODE_PREFIX_VERSION));
const SAVE_MIGRATIONS = {
  2: migrateV2SnapshotToV3,
};
const RTC_SIGNAL_PREFIX = "HKKSIG1.";
const ONLINE_ROOM_CODE_LENGTH = 10;
const ONLINE_ROOM_CODE_REGEX = /^[A-Z0-9]{10}$/;
const ONLINE_AUTH_READY_TIMEOUT_MS = 70_000;
const ONLINE_HOST_CREATE_MAX_ATTEMPTS = 5;

const drawPreviewFx = {
  lastCardId: null,
  revealTimer: null,
};

const stateBootstrap = window.HKKStateBootstrap;
if (!stateBootstrap || typeof stateBootstrap.createState !== "function") {
  throw new Error("State bootstrap not loaded.");
}
const state = stateBootstrap.createState(DEFAULT_AI_PROFILE);

const ui = {};

document.addEventListener("DOMContentLoaded", init);

function buildDeck() {
  const cards = [];
  for (const monthDef of MONTH_CARD_DEFS) {
    const monthSprites = MONTH_SPRITES[monthDef.month];
    if (!monthSprites || monthSprites.length !== monthDef.cards.length) {
      throw new Error(`Missing custom sprite mapping for month ${monthDef.month}`);
    }
    monthDef.cards.forEach((card, index) => {
      const sprite = monthSprites[index];
      cards.push({
        id: `${monthDef.month}${card.code}`,
        month: monthDef.month,
        name: card.name,
        type: card.type,
        scrollKind: card.scrollKind || null,
        canAlsoBeBasic: Boolean(card.canAlsoBeBasic),
        isRainLight: Boolean(card.isRainLight),
        sprite,
      });
    });
  }
  return cards;
}

function init() {
  cacheUI();
  bindUI();
  bindRtcBridge();
  bindFirebaseOnlineAuth();
  preloadSheets()
    .then(() => {
      state.ready = true;
      showStartMenu();
      tryLoadFromLocationHash();
    })
    .catch((err) => {
      addSystemLog(`Could not load card images: ${err.message}`);
      renderActionLog();
      setCodeStatus(`Asset load failed: ${err.message}`, true, "start");
    });

  window.render_game_to_text = renderGameToText;
  window.advanceTime = advanceTime;
}

function getRtcBridge() {
  if (!window.rtcBridge) return null;
  return window.rtcBridge;
}

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
        setStartOnlineStatus("Connection established. Starting match...", false);
      }
    }
    if (state.rtcRole && state.rtcStatus === "disconnected") {
      setFriendInterstitialStatus("Connection lost. Use Copy Turn Link / Load Turn Link to continue.", true);
    } else if (state.rtcRole && state.rtcStatus === "error") {
      setFriendInterstitialStatus("Connection error. Use Copy Turn Link / Load Turn Link to continue.", true);
    } else if (state.rtcRole && state.rtcStatus === "connected" && state.rtcWaiting) {
      setFriendInterstitialStatus("Connected. Waiting for incoming handoff.", false);
    }
    if (state.rtcPendingStart && state.rtcStatus === "connected") {
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

function setOnlineAuthState(nextState, message = "") {
  const normalized = nextState === "ready" ? "ready" : nextState === "error" ? "error" : "pending";
  state.onlineAuthState = normalized;
  state.onlineAuthMessage = String(message || "");
  applyOnlineAuthUiState();
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
  }, ONLINE_AUTH_READY_TIMEOUT_MS);

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
    .slice(0, ONLINE_ROOM_CODE_LENGTH);
}

function isOnlineRoomCodeCollisionError(err) {
  const message = String(err?.message || err || "");
  return message.includes("Room code already in use");
}

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

function applyOnlineWaitingStateFromCurrentTurn(reason) {
  if (!isOnlineFriendSessionActive()) return;
  const localPlayerIndex = getOnlineLocalPlayerIndex();
  const turnOwner = state.currentPlayer === 0 || state.currentPlayer === 1 ? state.currentPlayer : null;
  const shouldWait = localPlayerIndex === null || turnOwner === null || localPlayerIndex !== turnOwner;
  state.rtcWaiting = shouldWait;
  if (shouldWait) {
    setFriendInterstitialOpen(true, turnOwner);
    const ownerName = turnOwner === null ? "opponent" : state.players?.[turnOwner]?.name || `P${turnOwner + 1}`;
    setFriendInterstitialStatus(`Waiting for ${ownerName}. (${reason})`, false);
    debugOnlineInit("waiting-state", { active: false, reason });
    return;
  }
  setFriendInterstitialOpen(false);
  setFriendInterstitialStatus("", false);
  debugOnlineInit("waiting-state", { active: true, reason });
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
    code = encodeStateToCode();
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
  const sent = sendRtcSignal(payload);
  if (!sent) {
    setFriendInterstitialStatus("Initial sync send failed. Use turn-link fallback.", true);
    debugOnlineInit("host-init-send-failed");
    return false;
  }
  state.rtcInitSent = true;
  state.rtcInitApplied = true;
  debugOnlineInit("host-init-sent", getOnlineStartupDebugState({ currentTurnOwnerAfterInit: describeTurnOwnerForDebug(state.currentPlayer) }));
  return true;
}

function encodeRtcSignal(payload) {
  const json = JSON.stringify(payload || {});
  return `${RTC_SIGNAL_PREFIX}${encodeBase64UrlUtf8(json)}`;
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

function syncOnlineRoundTransitionSnapshot() {
  if (!isOnlineFriendSessionActive()) return true;
  if (state.rtcStatus !== "connected") return false;
  let code = "";
  try {
    code = encodeStateToCode();
  } catch (err) {
    console.warn("round-end snapshot encode failed", err);
    return false;
  }
  return sendRtcSignal({
    type: "turn-code",
    reason: "round-end",
    gameNumber: state.gameNumber,
    code,
  });
}

function resetRtcSession(options = {}) {
  const { closeConnection = false } = options;
  if (state.rtcPulseTimer) {
    clearTimeout(state.rtcPulseTimer);
  }
  state.rtcPulseTimer = null;
  state.rtcHeartbeatPulse = false;
  if (closeConnection) {
    const rtc = getRtcBridge();
    if (rtc && typeof rtc.closeRoom === "function") {
      rtc.closeRoom();
    }
  }
  state.rtcRole = null;
  state.rtcRoomCode = "";
  state.rtcWaiting = false;
  state.rtcPendingStart = false;
  state.rtcInitSent = false;
  state.rtcInitApplied = false;
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
    setStartOnlinePanelMode("host");
    setStartOnlineStatus("", false);
    setStartOnlineRoomDisplay("");
    if (ui.onlineRoomCodeInput) {
      ui.onlineRoomCodeInput.value = "";
    }
  }
  applyOnlineAuthUiState();
}

function beginOnlineFriendMatch() {
  if (!state.rtcPendingStart) return;
  const turnOwnerBeforeConnect = describeTurnOwnerForDebug(state.currentPlayer);
  debugOnlineInit("begin-online-friend-match", { currentTurnOwnerBeforeConnect: turnOwnerBeforeConnect });
  state.rtcPendingStart = false;
  hideStartMenu();
  startNewMatch({
    playMode: "friend",
    friendFlow: "hybrid",
    forceDealerPlayerIndex: 0,
    forceCurrentPlayerIndex: 0,
  });
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

function cacheUI() {
  ui.cpuScoreInline = document.getElementById("cpu-score-inline");
  ui.playerScoreInline = document.getElementById("player-score-inline");
  ui.turnMeta = document.getElementById("turn-meta");
  ui.rtcStatusBadge = document.getElementById("rtc-status-badge");
  ui.rtcStatusDot = document.getElementById("rtc-status-dot");
  ui.rtcStatusText = document.getElementById("rtc-status-text");
  ui.gameSummaryToggle = document.getElementById("game-summary-toggle");
  ui.gameSummaryPanel = document.getElementById("game-summary-panel");
  ui.roundSummaryBody = document.getElementById("round-summary-body");
  ui.cpuHandCount = document.getElementById("cpu-hand-count");
  ui.deckCount = document.getElementById("deck-count");
  ui.cpuCapturedCount = document.getElementById("cpu-captured-count");
  ui.playerCapturedCount = document.getElementById("player-captured-count");
  ui.cpuCapturesLabel = document.getElementById("cpu-captures-label");
  ui.playerCapturesLabel = document.getElementById("player-captures-label");
  ui.cpuHandLabel = document.getElementById("cpu-hand-label");
  ui.playerHandLabel = document.getElementById("player-hand-label");
  ui.summaryColYou = document.getElementById("summary-col-you");
  ui.summaryColCpu = document.getElementById("summary-col-cpu");
  ui.cpuYaku = document.getElementById("cpu-yaku");
  ui.playerYaku = document.getElementById("player-yaku");
  ui.koiState = document.getElementById("koi-state");
  ui.logToggle = document.getElementById("log-toggle");
  ui.messageZone = document.getElementById("message-zone");
  ui.actionLog = document.getElementById("action-log");
  ui.logCount = document.getElementById("log-count");
  ui.cpuHand = document.getElementById("cpu-hand");
  ui.playerHand = document.getElementById("player-hand");
  ui.field = document.getElementById("field");
  ui.drawPreviewCanvas = document.getElementById("draw-preview-canvas");
  ui.drawPreviewText = document.getElementById("draw-preview-text");
  ui.drawPreviewLabel = document.getElementById("draw-preview-label");
  ui.drawPreview = document.getElementById("draw-preview");
  ui.playerZone = document.getElementById("player-zone");
  ui.fieldZone = document.getElementById("field-zone");
  ui.handLockNote = document.getElementById("hand-lock-note");
  ui.cpuCaptured = document.getElementById("cpu-captured");
  ui.playerCaptured = document.getElementById("player-captured");
  ui.contextZone = document.getElementById("context-zone");
  ui.contextLeftBtn = document.getElementById("context-left-btn");
  ui.contextRightBtn = document.getElementById("context-right-btn");
  ui.codeToggle = document.getElementById("code-toggle");
  ui.codePanel = document.getElementById("code-panel");
  ui.codePanelHead = document.getElementById("code-panel-head");
  ui.codeAdvanced = document.getElementById("code-advanced");
  ui.toggleAdvancedBtn = document.getElementById("toggle-advanced-btn");
  ui.copyLinkBtn = document.getElementById("copy-link-btn");
  ui.exportCodeLabel = document.getElementById("export-code-label");
  ui.exportCode = document.getElementById("export-code");
  ui.importCodeLabel = document.getElementById("import-code-label");
  ui.importCode = document.getElementById("import-code");
  ui.codeStatus = document.getElementById("code-status");
  ui.refreshCodeBtn = document.getElementById("refresh-code-btn");
  ui.copyCodeBtn = document.getElementById("copy-code-btn");
  ui.loadCodeBtn = document.getElementById("load-code-btn");
  ui.closeCodeBtn = document.getElementById("close-code-btn");
  ui.startMenu = document.getElementById("start-menu");
  ui.startModeCpuBtn = document.getElementById("start-mode-cpu-btn");
  ui.startModeFriendBtn = document.getElementById("start-mode-friend-btn");
  ui.startModeOnlineBtn = document.getElementById("start-mode-online-btn");
  ui.startSubtitle = document.getElementById("start-subtitle");
  ui.startOnlinePanel = document.getElementById("start-online-panel");
  ui.onlineHostBtn = document.getElementById("online-host-btn");
  ui.onlineJoinBtn = document.getElementById("online-join-btn");
  ui.onlineBackBtn = document.getElementById("online-back-btn");
  ui.onlineRoomCodeLabel = document.getElementById("online-room-code-label");
  ui.onlineRoomCodeInput = document.getElementById("online-room-code-input");
  ui.onlineRoomDisplay = document.getElementById("online-room-display");
  ui.onlineRoomCodeText = document.getElementById("online-room-code-text");
  ui.startOnlineStatus = document.getElementById("start-online-status");
  ui.startLoadActions = document.getElementById("start-load-actions");
  ui.startLoadBtn = document.getElementById("start-load-btn");
  ui.startLoadManualBtn = document.getElementById("start-load-manual-btn");
  ui.startManualLoadWrap = document.getElementById("start-manual-load-wrap");
  ui.startImportCode = document.getElementById("start-import-code");
  ui.startMenuStatus = document.getElementById("start-menu-status");
  ui.friendInterstitial = document.getElementById("friend-interstitial");
  ui.friendInterstitialTitle = document.getElementById("friend-interstitial-title");
  ui.friendInterstitialText = document.getElementById("friend-interstitial-text");
  ui.friendManualLoadWrap = document.getElementById("friend-manual-load-wrap");
  ui.friendImportCode = document.getElementById("friend-import-code");
  ui.friendLoadCodeBtn = document.getElementById("friend-load-code-btn");
  ui.friendLoadManualBtn = document.getElementById("friend-load-manual-btn");
  ui.friendCopyCodeBtn = document.getElementById("friend-copy-code-btn");
  ui.friendContinueBtn = document.getElementById("friend-continue-btn");
  ui.friendBackMenuBtn = document.getElementById("friend-back-menu-btn");
  ui.friendInterstitialStatus = document.getElementById("friend-interstitial-status");
  ui.rulesToggle = document.getElementById("rules-toggle");
  ui.rulesPanel = document.getElementById("rules-panel");
}

function bindUI() {
  ui.playerHand.addEventListener("click", onPlayerHandClick);
  ui.field.addEventListener("click", onFieldClick);
  ui.drawPreview?.addEventListener("click", onDrawPreviewClick);
  ui.contextZone.addEventListener("click", onContextActionClick);
  ui.gameSummaryToggle?.addEventListener("click", onToggleGameSummaryPanel);
  ui.logToggle?.addEventListener("click", onToggleLogPanel);
  ui.codeToggle?.addEventListener("click", onToggleCodePanel);
  ui.copyLinkBtn?.addEventListener("click", onCopyLink);
  ui.toggleAdvancedBtn?.addEventListener("click", onToggleCodeAdvanced);
  ui.refreshCodeBtn?.addEventListener("click", onRefreshCode);
  ui.copyCodeBtn?.addEventListener("click", onCopyCode);
  ui.loadCodeBtn?.addEventListener("click", onLoadCodeFromPanel);
  ui.closeCodeBtn?.addEventListener("click", () => {
    setCodePanelOpen(false);
    showStartMenu();
  });
  ui.startModeCpuBtn?.addEventListener("click", onStartModeCpuFromMenu);
  ui.startModeFriendBtn?.addEventListener("click", onStartModeFriendFromMenu);
  ui.startModeOnlineBtn?.addEventListener("click", onStartModeOnlineFromMenu);
  ui.onlineHostBtn?.addEventListener("click", onOnlineHostFromMenu);
  ui.onlineJoinBtn?.addEventListener("click", onOnlineJoinFromMenu);
  ui.onlineBackBtn?.addEventListener("click", onOnlineBackFromMenu);
  ui.onlineRoomCodeInput?.addEventListener("input", () => {
    if (!ui.onlineRoomCodeInput) return;
    ui.onlineRoomCodeInput.value = normalizeRoomCodeInput(ui.onlineRoomCodeInput.value);
  });
  ui.startLoadBtn?.addEventListener("click", onStartLoadFromMenu);
  ui.startLoadManualBtn?.addEventListener("click", onStartLoadFromMenu);
  ui.friendLoadCodeBtn?.addEventListener("click", onFriendInterstitialLoadCode);
  ui.friendLoadManualBtn?.addEventListener("click", onFriendInterstitialLoadCode);
  ui.friendCopyCodeBtn?.addEventListener("click", onFriendInterstitialCopyCode);
  ui.friendContinueBtn?.addEventListener("click", onFriendInterstitialContinue);
  ui.friendBackMenuBtn?.addEventListener("click", onFriendBackToMenu);
  ui.rulesToggle.addEventListener("click", () => {
    ui.rulesPanel.hidden = !ui.rulesPanel.hidden;
    ui.rulesToggle.textContent = ui.rulesPanel.hidden ? "Rules" : "Hide Rules";
  });
}

function preloadSheets() {
  const entries = Object.entries(SHEET_PATHS);
  const tasks = entries.map(([key, path]) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        state.sprites[key] = img;
        resolve();
      };
      img.onerror = () => reject(new Error(`missing ${path}`));
      img.src = path;
    });
  });
  return Promise.all(tasks);
}

function showStartMenu() {
  if (ui.startMenu) {
    ui.startMenu.hidden = false;
  }
  setStartOnlinePanelOpen(false);
  setStartManualLoadVisible(false);
  setFriendInterstitialOpen(false);
  setLogPanelOpen(false);
  setGameSummaryPanelOpen(false);
  setCodePanelOpen(false);
  setCodeStatus("", false, "start");
}

function hideStartMenu() {
  if (ui.startMenu) {
    ui.startMenu.hidden = true;
  }
  setStartOnlinePanelOpen(false);
  setStartManualLoadVisible(false);
  setFriendInterstitialOpen(false);
  setCodeStatus("", false, "start");
}

function setStartManualLoadVisible(open) {
  state.manualLoadFallback.start = Boolean(open);
  if (ui.startManualLoadWrap) {
    ui.startManualLoadWrap.hidden = !state.manualLoadFallback.start;
  }
}

function setFriendManualLoadVisible(open) {
  state.manualLoadFallback.friend = Boolean(open);
  if (ui.friendManualLoadWrap) {
    ui.friendManualLoadWrap.hidden = !state.manualLoadFallback.friend;
  }
}

function setCodePanelOpen(open) {
  if (!ui.codePanel || !ui.codeToggle) return;
  ui.codePanel.hidden = !open;
  ui.codeToggle.textContent = open ? "Hide Code" : "Code";
  if (!open && ui.codeAdvanced && ui.toggleAdvancedBtn) {
    ui.codeAdvanced.hidden = true;
    ui.toggleAdvancedBtn.textContent = "Advanced";
  }
}

function setLogPanelOpen(open) {
  if (!ui.messageZone || !ui.logToggle) return;
  ui.messageZone.hidden = !open;
  ui.logToggle.textContent = open ? "Hide Log" : "Action Log";
}

function onToggleLogPanel() {
  const nextOpen = ui.messageZone?.hidden !== false;
  setLogPanelOpen(nextOpen);
}

function setGameSummaryPanelOpen(open) {
  if (!ui.gameSummaryPanel || !ui.gameSummaryToggle) return;
  ui.gameSummaryPanel.hidden = !open;
}

function onToggleGameSummaryPanel() {
  const nextOpen = ui.gameSummaryPanel?.hidden !== false;
  setGameSummaryPanelOpen(nextOpen);
}

function onToggleCodePanel() {
  const nextOpen = ui.codePanel?.hidden !== false;
  setCodePanelOpen(nextOpen);
  if (nextOpen) {
    refreshExportCode();
    if (isFriendCodeMode() && !isFriendTurnExportWindow()) {
      setCodeStatus("Turn link unlocks after a full turn handoff.", false, "panel");
    } else {
      setCodeStatus("", false, "panel");
    }
  }
}

function onToggleCodeAdvanced() {
  if (!ui.codeAdvanced || !ui.toggleAdvancedBtn) return;
  const nextOpen = ui.codeAdvanced.hidden;
  ui.codeAdvanced.hidden = !nextOpen;
  ui.toggleAdvancedBtn.textContent = nextOpen ? "Hide Advanced" : "Advanced";
}

function onRefreshCode() {
  if (!state.ready || !state.players.length) return;
  if (isFriendCodeMode() && !isFriendTurnExportWindow()) {
    setCodeStatus("Turn code is available after a full turn handoff.", true, "panel");
    return;
  }
  refreshExportCode();
  if (isFriendCodeMode()) {
    setCodeStatus("Raw turn code refreshed.", false, "panel");
  } else {
    setCodeStatus("Raw save code refreshed.", false, "panel");
  }
}

function refreshExportCode() {
  if (!ui.exportCode || !state.players.length) return;
  try {
    const code = encodeStateToCode();
    ui.exportCode.value = code;
  } catch (err) {
    setCodeStatus(`Could not generate code: ${err.message}`, true, "panel");
  }
}

function buildShareLinkFromCode(code) {
  const url = new URL(window.location.href);
  url.hash = `t=${code}`;
  return url.toString();
}

function decodeURIComponentSafe(value) {
  try {
    return decodeURIComponent(value);
  } catch (_err) {
    return value;
  }
}

function extractCodeFromInput(rawInput) {
  const value = String(rawInput || "").trim();
  if (!value) return "";

  if (value.startsWith("#t=")) return decodeURIComponentSafe(value.slice(3).trim());
  if (value.startsWith("t=")) return decodeURIComponentSafe(value.slice(2).trim());
  if (value.startsWith("#HKK")) return decodeURIComponentSafe(value.slice(1).trim());
  if (value.startsWith("HKK")) return value;

  try {
    const parsed = new URL(value, window.location.href);
    const hash = parsed.hash.startsWith("#") ? parsed.hash.slice(1) : parsed.hash;
    if (hash.startsWith("t=")) {
      return decodeURIComponentSafe(hash.slice(2).trim());
    }
    if (hash.startsWith("HKK")) {
      return decodeURIComponentSafe(hash.trim());
    }
    const queryToken = parsed.searchParams.get("t");
    if (queryToken) {
      return decodeURIComponentSafe(queryToken.trim());
    }
  } catch (_err) {
    // fall through and treat as raw code
  }

  return value;
}

function clearShareHashFromLocation() {
  const url = new URL(window.location.href);
  if (!url.hash) return;
  url.hash = "";
  const nextUrl = `${url.pathname}${url.search}`;
  window.history.replaceState(null, document.title, nextUrl);
}

function tryLoadFromLocationHash() {
  const hash = window.location.hash || "";
  if (!hash) return false;
  const looksLikeShare = hash.startsWith("#t=") || hash.startsWith("#HKK");
  if (!looksLikeShare) return false;
  const loaded = loadCodeIntoGame(hash, "start");
  if (loaded) {
    clearShareHashFromLocation();
    return true;
  }
  return false;
}

async function onCopyLink() {
  if (!state.ready || !state.players.length) return;
  if (isFriendCodeMode() && !isFriendTurnExportWindow()) {
    setCodeStatus("Turn link can only be copied at turn handoff.", true, "panel");
    return;
  }
  let code = "";
  try {
    code = encodeStateToCode();
  } catch (err) {
    setCodeStatus(`Could not generate link: ${err.message}`, true, "panel");
    return;
  }
  const shareLink = buildShareLinkFromCode(code);
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareLink);
    } else if (ui.importCode) {
      ui.importCode.value = shareLink;
      ui.importCode.focus();
      ui.importCode.select();
      document.execCommand("copy");
      ui.importCode.setSelectionRange(0, 0);
    }
    if (isFriendMode()) {
      setCodeStatus("Turn link copied to clipboard.", false, "panel");
    } else {
      setCodeStatus("Save link copied to clipboard.", false, "panel");
    }
  } catch (err) {
    setCodeStatus(`Copy link failed: ${err.message}`, true, "panel");
  }
}

async function onCopyCode() {
  if (!ui.exportCode) return;
  if (isFriendCodeMode() && !isFriendTurnExportWindow()) {
    setCodeStatus("Turn code can only be copied at turn handoff.", true, "panel");
    return;
  }
  if (!ui.exportCode.value.trim()) {
    refreshExportCode();
  }
  const value = ui.exportCode.value.trim();
  if (!value) {
    setCodeStatus("No code available to copy.", true, "panel");
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      ui.exportCode.focus();
      ui.exportCode.select();
      document.execCommand("copy");
      ui.exportCode.setSelectionRange(0, 0);
    }
    if (isFriendCodeMode()) {
      setCodeStatus("Raw turn code copied.", false, "panel");
    } else {
      setCodeStatus("Raw save code copied.", false, "panel");
    }
  } catch (err) {
    setCodeStatus(`Copy failed: ${err.message}`, true, "panel");
  }
}

function onLoadCodeFromPanel() {
  const raw = ui.importCode?.value || "";
  loadCodeIntoGame(raw, "panel");
}

function onStartModeCpuFromMenu() {
  if (!state.ready) return;
  resetRtcSession({ closeConnection: true });
  hideStartMenu();
  startNewMatch({ playMode: "cpu" });
}

function onStartModeFriendFromMenu() {
  if (!state.ready) return;
  resetRtcSession({ closeConnection: true });
  hideStartMenu();
  startNewMatch({ playMode: "friend", friendFlow: "hybrid" });
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
  setStartOnlineStatus("Tap Host New Room to create and share a room code, or tap Join Room to switch to code entry.", false);
}

async function onOnlineHostFromMenu() {
  setStartOnlinePanelMode("host");
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

async function startOnlineSession(role) {
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
    if (!ONLINE_ROOM_CODE_REGEX.test(joinRoomCode)) {
      setStartOnlineStatus(`Room code must be exactly ${ONLINE_ROOM_CODE_LENGTH} uppercase letters/numbers.`, true);
      return;
    }
  }

  const maxAttempts = role === "host" ? ONLINE_HOST_CREATE_MAX_ATTEMPTS : 1;
  let attempt = 0;
  let lastError = null;

  while (attempt < maxAttempts) {
    attempt += 1;
    const roomCode = role === "host" ? String(rtc.createRoomCode?.() || "") : joinRoomCode;
    if (!ONLINE_ROOM_CODE_REGEX.test(roomCode)) {
      if (role === "host") {
        lastError = new Error("Could not create a valid room code. Try again.");
        continue;
      }
      setStartOnlineStatus(`Room code must be exactly ${ONLINE_ROOM_CODE_LENGTH} uppercase letters/numbers.`, true);
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
      state.rtcStatus = String(rtc.getStatus?.() || "connecting");
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
        setStartOnlineStatus(`Room ${roomCode} joined. Finalizing peer connection...`, false);
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
  if (role === "host" && isOnlineRoomCodeCollisionError(lastError)) {
    setStartOnlineStatus("Could not create a new online room right now. Please try again.", true);
    return;
  }
  setStartOnlineStatus(`Online setup failed: ${lastError?.message || "unknown error"}`, true);
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
  const loaded = loadCodeIntoGame(rawPayload, "friend", { allowNonCheckpointFriendImport: true });
  if (!loaded) {
    setFriendInterstitialOpen(true, state.currentPlayer);
    setFriendInterstitialStatus("Incoming online handoff failed. Ask your friend to share a turn link.", true);
    renderAll();
    return;
  }
  setFriendInterstitialStatus("", false);
  applyOnlineWaitingStateFromCurrentTurn("raw-turn-code");
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
    const loaded = loadCodeIntoGame(code, "friend", { allowNonCheckpointFriendImport: true });
    if (!loaded) {
      setFriendInterstitialOpen(true, state.currentPlayer);
      setFriendInterstitialStatus("Initial sync failed. Ask host to resend a turn link.", true);
      renderAll();
      return;
    }
    enforceInitialOnlineStartupState("guest-session-init-apply");
    state.rtcInitApplied = true;
    applyOnlineWaitingStateFromCurrentTurn("session-init");
    debugOnlineInit(
      "guest-session-init-applied",
      getOnlineStartupDebugState({ currentTurnOwnerAfterInit: describeTurnOwnerForDebug(state.currentPlayer) })
    );
    return;
  }
  if (type === "turn-code") {
    const code = typeof signal.code === "string" ? signal.code : "";
    const loaded = loadCodeIntoGame(code, "friend", { allowNonCheckpointFriendImport: true });
    if (!loaded) {
      setFriendInterstitialOpen(true, state.currentPlayer);
      setFriendInterstitialStatus("Incoming online turn sync failed. Ask your friend to share a turn link.", true);
      renderAll();
      return;
    }
    setFriendInterstitialStatus("", false);
    applyOnlineWaitingStateFromCurrentTurn("signal-turn-code");
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
    return;
  }
}

function onStartLoadFromMenu() {
  tryLoadFromClipboardOrManual("start");
}

function setCodeStatus(message, isError, target = "panel") {
  const node = target === "start" ? ui.startMenuStatus : target === "friend" ? ui.friendInterstitialStatus : ui.codeStatus;
  if (!node) return;
  node.textContent = message || "";
  node.classList.toggle("error", Boolean(message && isError));
  node.classList.toggle("success", Boolean(message && !isError));
}

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
  tryLoadFromClipboardOrManual("friend");
}

async function readClipboardTextSafe() {
  if (!navigator.clipboard?.readText) {
    throw new Error("Clipboard access unavailable");
  }
  const text = await navigator.clipboard.readText();
  return String(text || "").trim();
}

async function tryLoadFromClipboardOrManual(target) {
  const isStart = target === "start";
  const inputEl = isStart ? ui.startImportCode : ui.friendImportCode;
  const fallbackOpen = isStart ? state.manualLoadFallback.start : state.manualLoadFallback.friend;
  const manualRaw = String(inputEl?.value || "").trim();

  if (fallbackOpen && manualRaw) {
    loadCodeIntoGame(manualRaw, target);
    return;
  }

  try {
    const clipboardText = await readClipboardTextSafe();
    if (!clipboardText) {
      throw new Error("Clipboard is empty");
    }
    const loaded = loadCodeIntoGame(clipboardText, target);
    if (loaded) return;
    if (isStart) {
      setStartManualLoadVisible(true);
    } else {
      setFriendManualLoadVisible(true);
    }
    setCodeStatus("Clipboard content did not load. Paste a turn link or code below.", true, target);
  } catch (err) {
    if (isStart) {
      setStartManualLoadVisible(true);
    } else {
      setFriendManualLoadVisible(true);
    }
    const fallbackMessage =
      err && err.message === "Clipboard is empty"
        ? "No clipboard link found. Paste a turn link or code below."
        : "Clipboard unavailable. Paste a turn link or code below.";
    setCodeStatus(fallbackMessage, true, target);
  }
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
    return;
  }

  const rtc = getRtcBridge();
  if (!rtc || typeof rtc.sendTurnCode !== "function") {
    setFriendInterstitialStatus("Online transport unavailable. Use Copy Turn Link.", true);
    state.rtcWaiting = false;
    return;
  }

  if (state.rtcStatus !== "connected") {
    setFriendInterstitialStatus("Peer not connected yet. Use Copy Turn Link or wait.", true);
    state.rtcWaiting = false;
    return;
  }

  let code = "";
  try {
    code = encodeStateToCode();
  } catch (err) {
    setFriendInterstitialStatus(`Could not send turn: ${err.message}`, true);
    state.rtcWaiting = false;
    return;
  }
  const sent = rtc.sendTurnCode(code);
  if (!sent) {
    setFriendInterstitialStatus("Automatic send failed. Use Copy Turn Link.", true);
    state.rtcWaiting = false;
    return;
  }
  state.rtcWaiting = true;
  setFriendInterstitialStatus(`Turn sent automatically (room ${state.rtcRoomCode}).`, false);
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
  resetRtcSession({ closeConnection: true });
  setFriendInterstitialOpen(false);
  showStartMenu();
}

function loadCodeIntoGame(rawInput, target = "panel", options = {}) {
  const allowNonCheckpointFriendImport = Boolean(options.allowNonCheckpointFriendImport);
  const normalized = extractCodeFromInput(rawInput);
  if (!normalized) {
    setCodeStatus("Paste a link or code first.", true, target);
    return false;
  }

  try {
    const snapshot = decodeGameCode(normalized);
    if (target === "friend" && snapshot.playMode !== "friend") {
      throw new Error("This is not a friend turn link");
    }
    if (target === "friend" && !allowNonCheckpointFriendImport) {
      validateFriendCodeSnapshotForImport(snapshot);
    }
    applySnapshot(snapshot);
    state.rtcWaiting = false;
    hideStartMenu();
    setCodePanelOpen(false);
    if (snapshot.playMode === "friend" && snapshot.lastExportMeta) {
      const playerLabel = `Player ${snapshot.lastExportMeta.playerIndex + 1}`;
      setCodeStatus(`Turn link loaded (${playerLabel}, move ${snapshot.lastExportMeta.turnNumber}).`, false, target);
    } else {
      setCodeStatus("Link loaded successfully.", false, target);
    }
    if (target === "panel" && ui.importCode) {
      ui.importCode.value = "";
    }
    if (target === "start" && ui.startImportCode) {
      ui.startImportCode.value = "";
      setStartManualLoadVisible(false);
    }
    if (target === "friend" && ui.friendImportCode) {
      ui.friendImportCode.value = "";
      setFriendManualLoadVisible(false);
    }
    refreshExportCode();
    return true;
  } catch (err) {
    setCodeStatus(`Load failed: ${err.message}`, true, target);
    return false;
  }
}

function validateFriendCodeSnapshotForImport(snapshot) {
  if (!snapshot || snapshot.playMode !== "friend") return;
  if (snapshot.turnCheckpointReady !== true) {
    throw new Error("This turn code is not at a valid handoff checkpoint");
  }
  if (!snapshot.interstitial || snapshot.interstitial.open !== true) {
    throw new Error("Turn code is missing handoff state");
  }
  const nextPlayerIndex = snapshot.interstitial.nextPlayerIndex;
  if (nextPlayerIndex !== 0 && nextPlayerIndex !== 1) {
    throw new Error("Turn code is missing next player metadata");
  }
  if (snapshot.currentPlayer !== nextPlayerIndex) {
    throw new Error("Turn code turn-owner metadata is invalid");
  }
  if (!snapshot.lastExportMeta || typeof snapshot.lastExportMeta !== "object") {
    throw new Error("Turn code is missing export metadata");
  }
  const exporter = snapshot.lastExportMeta.playerIndex;
  if (exporter !== 0 && exporter !== 1) {
    throw new Error("Turn code exporter metadata is invalid");
  }
  if (exporter === nextPlayerIndex) {
    throw new Error("Turn code exporter and receiver cannot be the same player");
  }
  if (!Number.isFinite(snapshot.lastExportMeta.turnNumber) || snapshot.lastExportMeta.turnNumber < 1) {
    throw new Error("Turn code move metadata is invalid");
  }
}

function createPlayer(name, isHuman, roleLabel = name) {
  return {
    name,
    roleLabel,
    isHuman,
    score: 0,
    hand: [],
    captured: [],
    yaku: { points: 0, names: [], triggerKeys: [] },
    yakuSeen: new Set(),
  };
}

function encodeStateToCode() {
  const snapshot = buildSnapshot();
  const json = JSON.stringify(snapshot);
  const payload = encodeBase64UrlUtf8(json);
  const checksum = computeCodeChecksum(payload);
  return `${SAVE_CODE_PREFIX}.${payload}.${checksum}`;
}

function decodeGameCode(code) {
  const normalized = String(code || "").trim();
  const parts = normalized.split(".");
  if (parts.length !== 3) {
    throw new Error("Bad format. Expected prefix.payload.checksum");
  }
  const [prefix, payload, checksum] = parts;
  const expectedVersion = SAVE_CODE_PREFIX_VERSION[prefix];
  if (!expectedVersion) {
    throw new Error("Unknown code prefix");
  }
  const expected = computeCodeChecksum(payload);
  if (checksum.toUpperCase() !== expected) {
    throw new Error("Checksum mismatch");
  }

  let parsed;
  try {
    const json = decodeBase64UrlUtf8(payload);
    parsed = JSON.parse(json);
  } catch (err) {
    throw new Error(`Invalid payload: ${err.message}`);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid payload object");
  }
  if (parsed.v !== expectedVersion) {
    throw new Error(`Version mismatch for ${prefix}`);
  }

  const migrated = migrateSnapshotToLatest(parsed);
  validateSnapshot(migrated);
  return migrated;
}

function migrateSnapshotToLatest(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    throw new Error("Invalid payload object");
  }
  let migrated = { ...snapshot };
  while (SAVE_MIGRATIONS[migrated.v]) {
    migrated = SAVE_MIGRATIONS[migrated.v](migrated);
  }
  return migrated;
}

function migrateV2SnapshotToV3(snapshot) {
  const players = Array.isArray(snapshot.players) ? snapshot.players.map((player) => ({ ...player })) : [];
  return {
    ...snapshot,
    v: 3,
    playMode: snapshot.playMode === "friend" ? "friend" : "cpu",
    friendFlow:
      snapshot.friendFlow === "hotseat" || snapshot.friendFlow === "code" || snapshot.friendFlow === "hybrid"
        ? snapshot.friendFlow
        : "hybrid",
    viewerPlayerIndex:
      snapshot.viewerPlayerIndex === 0 || snapshot.viewerPlayerIndex === 1
        ? snapshot.viewerPlayerIndex
        : snapshot.currentPlayer === 0 || snapshot.currentPlayer === 1
          ? snapshot.currentPlayer
          : 0,
    interstitial: snapshot.interstitial && typeof snapshot.interstitial === "object"
      ? {
          open: Boolean(snapshot.interstitial.open),
          nextPlayerIndex:
            snapshot.interstitial.nextPlayerIndex === 0 || snapshot.interstitial.nextPlayerIndex === 1
              ? snapshot.interstitial.nextPlayerIndex
              : null,
        }
      : { open: false, nextPlayerIndex: null },
    roundTransition: createClosedRoundTransition(),
    turnCheckpointReady: Boolean(snapshot.turnCheckpointReady),
    lastExportMeta: null,
    lastTurnRecap: null,
    aiProfile: AI_PROFILES[snapshot.aiProfile] ? snapshot.aiProfile : DEFAULT_AI_PROFILE,
    firstYakuPlayer:
      snapshot.firstYakuPlayer === 0 || snapshot.firstYakuPlayer === 1 ? snapshot.firstYakuPlayer : null,
    lastKoiCaller: snapshot.lastKoiCaller === 0 || snapshot.lastKoiCaller === 1 ? snapshot.lastKoiCaller : null,
    roundSpecialTwoXPlayer:
      snapshot.roundSpecialTwoXPlayer === 0 || snapshot.roundSpecialTwoXPlayer === 1
        ? snapshot.roundSpecialTwoXPlayer
        : null,
    nextRoundSpecialTwoXPlayer:
      snapshot.nextRoundSpecialTwoXPlayer === 0 || snapshot.nextRoundSpecialTwoXPlayer === 1
        ? snapshot.nextRoundSpecialTwoXPlayer
        : null,
    roundLeaderAtStart:
      snapshot.roundLeaderAtStart === 0 || snapshot.roundLeaderAtStart === 1 ? snapshot.roundLeaderAtStart : null,
    previousRoundWinner:
      snapshot.previousRoundWinner === 0 || snapshot.previousRoundWinner === 1 ? snapshot.previousRoundWinner : null,
    previousRoundMultiplier: Number.isFinite(snapshot.previousRoundMultiplier) ? snapshot.previousRoundMultiplier : null,
    drawPreview:
      snapshot.drawPreview && typeof snapshot.drawPreview === "object"
        ? {
            cardId: snapshot.drawPreview.cardId || null,
            text: String(snapshot.drawPreview.text || ""),
          }
        : {
            cardId: null,
            text: "Waiting for draw.",
          },
    actionLog: Array.isArray(snapshot.actionLog) ? snapshot.actionLog.map((line) => String(line)) : [],
    moveCounts:
      Array.isArray(snapshot.moveCounts) && snapshot.moveCounts.length === 2
        ? [snapshot.moveCounts[0], snapshot.moveCounts[1]]
        : [0, 0],
    players,
    pendingSelection: snapshot.pendingSelection || null,
    awaitingDeckFlip: snapshot.awaitingDeckFlip || null,
    awaitingDecision: snapshot.awaitingDecision || null,
    aiPreview: snapshot.aiPreview || null,
    cpuPhase1PreviewCardId: snapshot.cpuPhase1PreviewCardId || null,
  };
}

function buildSnapshot() {
  const checkpointReady = computeTurnCheckpointReady();
  state.turnCheckpointReady = checkpointReady;
  return {
    v: SAVE_CODE_VERSION,
    playMode: state.playMode,
    friendFlow: state.friendFlow,
    viewerPlayerIndex: state.viewerPlayerIndex,
    interstitial: {
      open: Boolean(state.interstitial?.open),
      nextPlayerIndex:
        state.interstitial?.nextPlayerIndex === null || state.interstitial?.nextPlayerIndex === undefined
          ? null
          : state.interstitial.nextPlayerIndex,
    },
    roundTransition: serializeRoundTransition(state.roundTransition),
    turnCheckpointReady: checkpointReady,
    lastExportMeta: state.lastExportMeta
      ? {
          turnNumber: state.lastExportMeta.turnNumber,
          playerIndex: state.lastExportMeta.playerIndex,
        }
      : null,
    lastTurnRecap: state.lastTurnRecap ? { ...state.lastTurnRecap } : null,
    aiProfile: state.aiProfile,
    gameNumber: state.gameNumber,
    maxGames: state.maxGames,
    dealer: state.dealer,
    currentPlayer: state.currentPlayer,
    tableMultiplier: state.tableMultiplier,
    lastKoiCaller: state.lastKoiCaller,
    firstYakuPlayer: state.firstYakuPlayer,
    roundSpecialTwoXPlayer: state.roundSpecialTwoXPlayer,
    nextRoundSpecialTwoXPlayer: state.nextRoundSpecialTwoXPlayer,
    roundLeaderAtStart: state.roundLeaderAtStart,
    previousRoundWinner: state.previousRoundWinner,
    previousRoundMultiplier: state.previousRoundMultiplier,
    roundOver: state.roundOver,
    matchOver: state.matchOver,
    message: state.message,
    drawPreview: {
      cardId: state.drawPreview?.cardId || null,
      text: state.drawPreview?.text || "",
    },
    actionLog: [...state.actionLog],
    moveCounts: [...state.moveCounts],
    roundHistory: state.roundHistory.map((entry) => ({ ...entry })),
    field: state.field.map((card) => card.id),
    drawPile: state.drawPile.map((card) => card.id),
    players: state.players.map((player) => ({
      name: player.name,
      roleLabel: player.roleLabel,
      isHuman: player.isHuman,
      score: player.score,
      hand: player.hand.map((card) => card.id),
      captured: player.captured.map((card) => card.id),
      yakuSeen: [...player.yakuSeen],
    })),
    pendingSelection: serializePendingSelection(state.pendingSelection),
    awaitingDeckFlip: serializeAwaitingDeckFlip(state.awaitingDeckFlip),
    awaitingDecision: serializeAwaitingDecision(state.awaitingDecision),
    aiPreview: serializeAiPreview(state.aiPreview),
    cpuPhase1PreviewCardId: state.cpuPhase1PreviewCardId || null,
  };
}

function serializePendingSelection(pending) {
  if (!pending) return null;
  if (pending.type === "handMatch" || pending.type === "handPlace") {
    return {
      type: pending.type,
      playerIndex: pending.playerIndex,
      cardId: pending.cardId,
      options: [...pending.options],
    };
  }
  if (pending.type === "drawMatch" || pending.type === "drawPlace") {
    return {
      type: pending.type,
      playerIndex: pending.playerIndex,
      drawnCardId: pending.drawnCard?.id || null,
      moveNumber: pending.moveNumber,
      options: [...pending.options],
    };
  }
  return null;
}

function serializeAwaitingDeckFlip(flip) {
  if (!flip) return null;
  return {
    playerIndex: flip.playerIndex,
    moveNumber: flip.moveNumber,
    drawnCardId: flip.drawnCard?.id || null,
    revealed: Boolean(flip.revealed),
  };
}

function serializeAwaitingDecision(decision) {
  if (!decision) return null;
  return {
    ...decision,
  };
}

function serializeAiPreview(aiPreview) {
  if (!aiPreview) return null;
  return {
    options: [...(aiPreview.options || [])],
    prompt: String(aiPreview.prompt || ""),
  };
}

function serializeRoundTransition(roundTransition) {
  if (!roundTransition || typeof roundTransition !== "object") {
    return createClosedRoundTransition();
  }
  return {
    open: Boolean(roundTransition.open),
    winnerIndex:
      roundTransition.winnerIndex === null || roundTransition.winnerIndex === undefined ? null : roundTransition.winnerIndex,
    pointsAwarded: Math.max(0, Number(roundTransition.pointsAwarded) || 0),
    noScore: Boolean(roundTransition.noScore),
    nextGameNumber:
      roundTransition.nextGameNumber === null || roundTransition.nextGameNumber === undefined
        ? null
        : roundTransition.nextGameNumber,
    acks: {
      p0: Boolean(roundTransition.acks?.p0),
      p1: Boolean(roundTransition.acks?.p1),
      local: Boolean(roundTransition.acks?.local),
    },
  };
}

function validateSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== "object") {
    throw new Error("Snapshot must be an object");
  }
  const snapshotVersion = asInt(snapshot.v, "v");
  if (!SUPPORTED_SAVE_VERSIONS.has(snapshotVersion)) {
    throw new Error(`Unsupported version ${snapshotVersion}`);
  }
  if (snapshotVersion >= 3) {
    validatePlayMode(snapshot.playMode, "playMode");
    validateFriendFlow(snapshot.friendFlow, "friendFlow");
    ensureNullablePlayerIndex(snapshot.viewerPlayerIndex, "viewerPlayerIndex");
    validateInterstitialSnapshot(snapshot.interstitial);
    if (typeof snapshot.turnCheckpointReady !== "boolean") {
      throw new Error("turnCheckpointReady must be boolean");
    }
    if (snapshot.lastExportMeta !== null && snapshot.lastExportMeta !== undefined) {
      validateLastExportMetaSnapshot(snapshot.lastExportMeta);
    }
    if (snapshot.lastTurnRecap !== null && snapshot.lastTurnRecap !== undefined) {
      validateTurnRecapSnapshot(snapshot.lastTurnRecap);
    }
  }
  if (!Array.isArray(snapshot.players) || snapshot.players.length !== 2) {
    throw new Error("Snapshot must contain exactly two players");
  }
  if (!Array.isArray(snapshot.field) || !Array.isArray(snapshot.drawPile)) {
    throw new Error("Snapshot must include field and draw pile arrays");
  }
  if (!Array.isArray(snapshot.moveCounts) || snapshot.moveCounts.length !== 2) {
    throw new Error("Snapshot moveCounts must have two entries");
  }
  if (!Array.isArray(snapshot.roundHistory)) {
    throw new Error("Snapshot roundHistory must be an array");
  }

  const maxGames = asInt(snapshot.maxGames, "maxGames");
  const gameNumber = asInt(snapshot.gameNumber, "gameNumber");
  if (maxGames < 1 || maxGames > 24) {
    throw new Error("maxGames out of range");
  }
  if (gameNumber < 1 || gameNumber > maxGames) {
    throw new Error("gameNumber out of range");
  }

  const dealer = asPlayerIndex(snapshot.dealer, "dealer");
  const currentPlayer = asPlayerIndex(snapshot.currentPlayer, "currentPlayer");
  const tableMultiplier = asInt(snapshot.tableMultiplier, "tableMultiplier");
  if (tableMultiplier < 1 || tableMultiplier > 4) {
    throw new Error("tableMultiplier out of range");
  }

  ensureNullablePlayerIndex(snapshot.lastKoiCaller, "lastKoiCaller");
  ensureNullablePlayerIndex(snapshot.firstYakuPlayer, "firstYakuPlayer");
  ensureNullablePlayerIndex(snapshot.roundSpecialTwoXPlayer, "roundSpecialTwoXPlayer");
  ensureNullablePlayerIndex(snapshot.nextRoundSpecialTwoXPlayer, "nextRoundSpecialTwoXPlayer");
  ensureNullablePlayerIndex(snapshot.roundLeaderAtStart, "roundLeaderAtStart");
  ensureNullablePlayerIndex(snapshot.previousRoundWinner, "previousRoundWinner");
  snapshot.roundHistory.forEach((entry, idx) => validateRoundHistoryEntry(entry, idx, maxGames));
  if (snapshotVersion >= 3 && snapshot.roundTransition !== null && snapshot.roundTransition !== undefined) {
    validateRoundTransitionSnapshot(snapshot.roundTransition, maxGames);
  }

  // Force card-id validity here and duplicate checks in applySnapshot.
  snapshot.field.forEach((id, idx) => ensureCardId(id, `field[${idx}]`));
  snapshot.drawPile.forEach((id, idx) => ensureCardId(id, `drawPile[${idx}]`));
  snapshot.players.forEach((player, playerIndex) => {
    if (!player || typeof player !== "object") {
      throw new Error(`players[${playerIndex}] must be an object`);
    }
    if (player.name !== undefined && typeof player.name !== "string") {
      throw new Error(`players[${playerIndex}].name must be a string`);
    }
    if (player.roleLabel !== undefined && typeof player.roleLabel !== "string") {
      throw new Error(`players[${playerIndex}].roleLabel must be a string`);
    }
    if (player.isHuman !== undefined && typeof player.isHuman !== "boolean") {
      throw new Error(`players[${playerIndex}].isHuman must be boolean`);
    }
    asInt(player.score, `players[${playerIndex}].score`);
    if (!Array.isArray(player.hand) || !Array.isArray(player.captured)) {
      throw new Error(`players[${playerIndex}] hand/captured must be arrays`);
    }
    if (player.yakuSeen !== undefined && !Array.isArray(player.yakuSeen)) {
      throw new Error(`players[${playerIndex}].yakuSeen must be an array`);
    }
    player.hand.forEach((id, idx) => ensureCardId(id, `players[${playerIndex}].hand[${idx}]`));
    player.captured.forEach((id, idx) => ensureCardId(id, `players[${playerIndex}].captured[${idx}]`));
  });

  if (snapshot.pendingSelection !== null && snapshot.pendingSelection !== undefined) {
    validatePendingSelectionSnapshot(snapshot.pendingSelection);
  }
  if (snapshot.awaitingDeckFlip !== null && snapshot.awaitingDeckFlip !== undefined) {
    validateAwaitingDeckFlipSnapshot(snapshot.awaitingDeckFlip);
  }
  if (snapshot.awaitingDecision !== null && snapshot.awaitingDecision !== undefined) {
    validateAwaitingDecisionSnapshot(snapshot.awaitingDecision);
  }

  // Keep explicit references in case we later add stricter rules.
  void snapshotVersion;
  void dealer;
  void currentPlayer;
}

function validatePlayMode(value, label) {
  if (value !== "cpu" && value !== "friend") {
    throw new Error(`${label} must be cpu or friend`);
  }
}

function validateFriendFlow(value, label) {
  if (value !== "hotseat" && value !== "code" && value !== "hybrid") {
    throw new Error(`${label} must be hotseat, code, or hybrid`);
  }
}

function validateInterstitialSnapshot(interstitial) {
  if (!interstitial || typeof interstitial !== "object") {
    throw new Error("interstitial must be an object");
  }
  if (typeof interstitial.open !== "boolean") {
    throw new Error("interstitial.open must be boolean");
  }
  ensureNullablePlayerIndex(interstitial.nextPlayerIndex, "interstitial.nextPlayerIndex");
}

function validateRoundTransitionSnapshot(roundTransition, maxGames) {
  if (!roundTransition || typeof roundTransition !== "object") {
    throw new Error("roundTransition must be an object");
  }
  if (typeof roundTransition.open !== "boolean") {
    throw new Error("roundTransition.open must be boolean");
  }
  ensureNullablePlayerIndex(roundTransition.winnerIndex, "roundTransition.winnerIndex");
  if (roundTransition.pointsAwarded !== null && roundTransition.pointsAwarded !== undefined) {
    const points = asInt(roundTransition.pointsAwarded, "roundTransition.pointsAwarded");
    if (points < 0) throw new Error("roundTransition.pointsAwarded must be non-negative");
  }
  if (typeof roundTransition.noScore !== "boolean") {
    throw new Error("roundTransition.noScore must be boolean");
  }
  if (roundTransition.nextGameNumber !== null && roundTransition.nextGameNumber !== undefined) {
    const next = asInt(roundTransition.nextGameNumber, "roundTransition.nextGameNumber");
    if (next < 1 || next > maxGames) {
      throw new Error("roundTransition.nextGameNumber out of range");
    }
  }
  if (!roundTransition.acks || typeof roundTransition.acks !== "object") {
    throw new Error("roundTransition.acks must be an object");
  }
  if (typeof roundTransition.acks.p0 !== "boolean") {
    throw new Error("roundTransition.acks.p0 must be boolean");
  }
  if (typeof roundTransition.acks.p1 !== "boolean") {
    throw new Error("roundTransition.acks.p1 must be boolean");
  }
  if (typeof roundTransition.acks.local !== "boolean") {
    throw new Error("roundTransition.acks.local must be boolean");
  }
}

function validateLastExportMetaSnapshot(meta) {
  if (!meta || typeof meta !== "object") {
    throw new Error("lastExportMeta must be an object");
  }
  asInt(meta.turnNumber, "lastExportMeta.turnNumber");
  asPlayerIndex(meta.playerIndex, "lastExportMeta.playerIndex");
}

function validateTurnRecapSnapshot(recap) {
  if (!recap || typeof recap !== "object") {
    throw new Error("lastTurnRecap must be an object");
  }
  asPlayerIndex(recap.actorIndex, "lastTurnRecap.actorIndex");
  asInt(recap.moveNumber, "lastTurnRecap.moveNumber");
  asInt(recap.tableMultiplierStart, "lastTurnRecap.tableMultiplierStart");
  asInt(recap.tableMultiplierEnd, "lastTurnRecap.tableMultiplierEnd");
  ensureCardId(recap.playedCardId, "lastTurnRecap.playedCardId");
  if (recap.drawnCardId !== null && recap.drawnCardId !== undefined) {
    ensureCardId(recap.drawnCardId, "lastTurnRecap.drawnCardId");
  }
  if (recap.handAction && typeof recap.handAction !== "object") {
    throw new Error("lastTurnRecap.handAction must be an object");
  }
  if (recap.drawAction && typeof recap.drawAction !== "object") {
    throw new Error("lastTurnRecap.drawAction must be an object");
  }
  if (recap.decision && typeof recap.decision !== "object") {
    throw new Error("lastTurnRecap.decision must be an object");
  }
}

function validatePendingSelectionSnapshot(pending) {
  if (!pending || typeof pending !== "object") {
    throw new Error("pendingSelection must be an object");
  }
  if (pending.type === "handMatch" || pending.type === "handPlace") {
    asPlayerIndex(pending.playerIndex, "pendingSelection.playerIndex");
    ensureCardId(pending.cardId, "pendingSelection.cardId");
    if (!Array.isArray(pending.options)) {
      throw new Error("pendingSelection.options must be an array");
    }
    pending.options.forEach((id, idx) => ensureCardId(id, `pendingSelection.options[${idx}]`));
    return;
  }
  if (pending.type === "drawMatch" || pending.type === "drawPlace") {
    asPlayerIndex(pending.playerIndex, "pendingSelection.playerIndex");
    ensureCardId(pending.drawnCardId, "pendingSelection.drawnCardId");
    asInt(pending.moveNumber, "pendingSelection.moveNumber");
    if (!Array.isArray(pending.options)) {
      throw new Error("pendingSelection.options must be an array");
    }
    pending.options.forEach((id, idx) => ensureCardId(id, `pendingSelection.options[${idx}]`));
    return;
  }
  throw new Error("pendingSelection has an unknown type");
}

function validateAwaitingDeckFlipSnapshot(flip) {
  if (!flip || typeof flip !== "object") {
    throw new Error("awaitingDeckFlip must be an object");
  }
  asPlayerIndex(flip.playerIndex, "awaitingDeckFlip.playerIndex");
  asInt(flip.moveNumber, "awaitingDeckFlip.moveNumber");
  ensureCardId(flip.drawnCardId, "awaitingDeckFlip.drawnCardId");
}

function validateAwaitingDecisionSnapshot(decision) {
  if (!decision || typeof decision !== "object") {
    throw new Error("awaitingDecision must be an object");
  }
  if (decision.kind !== "stopOrKoi") {
    throw new Error("awaitingDecision.kind must be stopOrKoi");
  }
  asPlayerIndex(decision.playerIndex, "awaitingDecision.playerIndex");
  asInt(decision.moveNumber, "awaitingDecision.moveNumber");
  asInt(decision.points, "awaitingDecision.points");
  asInt(decision.passMultiplier, "awaitingDecision.passMultiplier");
  asInt(decision.koiMultiplier, "awaitingDecision.koiMultiplier");
}

function applySnapshot(snapshot) {
  clearRoundRuntimeTimers({
    resetTurnReplayVisual: false,
    resetDrawPreviewFxState: true,
  });

  state.playMode = normalizePlayMode(snapshot.playMode);
  state.friendFlow = normalizeFriendFlow(snapshot.friendFlow);
  state.aiProfile = AI_PROFILES[snapshot.aiProfile] ? snapshot.aiProfile : DEFAULT_AI_PROFILE;
  state.gameNumber = asInt(snapshot.gameNumber, "gameNumber");
  state.maxGames = asInt(snapshot.maxGames, "maxGames");
  state.dealer = asPlayerIndex(snapshot.dealer, "dealer");
  state.currentPlayer = asPlayerIndex(snapshot.currentPlayer, "currentPlayer");
  const viewerPlayer = asNullablePlayerIndex(snapshot.viewerPlayerIndex, "viewerPlayerIndex");
  state.viewerPlayerIndex = viewerPlayer === null ? (state.playMode === "friend" ? state.currentPlayer : 0) : viewerPlayer;
  state.interstitial = normalizeInterstitial(snapshot.interstitial);
  state.roundTransition = normalizeRoundTransition(snapshot.roundTransition, state.maxGames);
  state.turnCheckpointReady = Boolean(snapshot.turnCheckpointReady);
  state.lastExportMeta = normalizeLastExportMeta(snapshot.lastExportMeta);
  state.lastTurnRecap = normalizeTurnRecap(snapshot.lastTurnRecap);
  state.activeTurnRecap = null;
  state.tableMultiplier = asInt(snapshot.tableMultiplier, "tableMultiplier");
  state.lastKoiCaller = asNullablePlayerIndex(snapshot.lastKoiCaller, "lastKoiCaller");
  state.firstYakuPlayer = asNullablePlayerIndex(snapshot.firstYakuPlayer, "firstYakuPlayer");
  state.roundSpecialTwoXPlayer = asNullablePlayerIndex(
    snapshot.roundSpecialTwoXPlayer,
    "roundSpecialTwoXPlayer"
  );
  state.nextRoundSpecialTwoXPlayer = asNullablePlayerIndex(
    snapshot.nextRoundSpecialTwoXPlayer,
    "nextRoundSpecialTwoXPlayer"
  );
  state.roundLeaderAtStart = asNullablePlayerIndex(snapshot.roundLeaderAtStart, "roundLeaderAtStart");
  state.previousRoundWinner = asNullablePlayerIndex(snapshot.previousRoundWinner, "previousRoundWinner");
  state.previousRoundMultiplier =
    snapshot.previousRoundMultiplier === null || snapshot.previousRoundMultiplier === undefined
      ? null
      : asInt(snapshot.previousRoundMultiplier, "previousRoundMultiplier");
  state.roundOver = Boolean(snapshot.roundOver);
  state.matchOver = Boolean(snapshot.matchOver);
  state.message = String(snapshot.message || "");
  state.drawPreview = {
    cardId: snapshot.drawPreview?.cardId || null,
    text: String(snapshot.drawPreview?.text || "Waiting for draw."),
  };

  state.players = [createPlayer("You", true), createPlayer("CPU", false)];
  for (let i = 0; i < 2; i += 1) {
    const source = snapshot.players[i];
    const target = state.players[i];
    if (typeof source.name === "string" && source.name.trim()) {
      target.name = source.name;
    }
    if (typeof source.roleLabel === "string" && source.roleLabel.trim()) {
      target.roleLabel = source.roleLabel;
    } else {
      target.roleLabel = target.name;
    }
    if (typeof source.isHuman === "boolean") {
      target.isHuman = source.isHuman;
    }
    target.score = Math.max(0, asInt(source.score, `players[${i}].score`));
    target.hand = sortByMonth(cardIdsToCards(source.hand, `players[${i}].hand`));
    target.captured = cardIdsToCards(source.captured, `players[${i}].captured`);
    target.yakuSeen = new Set(Array.isArray(source.yakuSeen) ? source.yakuSeen.map(String) : []);
    target.yaku = computeYaku(target.captured, state.gameNumber);
    if (!target.yakuSeen.size) {
      target.yakuSeen = new Set(target.yaku.triggerKeys);
    }
  }

  if (state.playMode === "friend") {
    state.players[0].isHuman = true;
    state.players[1].isHuman = true;
  }

  state.field = cardIdsToCards(snapshot.field, "field");
  state.drawPile = cardIdsToCards(snapshot.drawPile, "drawPile");
  state.moveCounts = [
    Math.max(0, asInt(snapshot.moveCounts[0], "moveCounts[0]")),
    Math.max(0, asInt(snapshot.moveCounts[1], "moveCounts[1]")),
  ];
  state.actionLog = Array.isArray(snapshot.actionLog)
    ? snapshot.actionLog.map((line) => String(line)).slice(-ACTION_LOG_LIMIT)
    : [];
  state.roundHistory = snapshot.roundHistory.map((entry, idx) => normalizeRoundHistoryEntry(entry, idx, state.maxGames));

  state.pendingSelection = hydratePendingSelection(snapshot.pendingSelection);
  state.awaitingDeckFlip = hydrateAwaitingDeckFlip(snapshot.awaitingDeckFlip);
  state.awaitingDecision = hydrateAwaitingDecision(snapshot.awaitingDecision);
  state.aiPreview = hydrateAiPreview(snapshot.aiPreview);
  state.cpuPhase1PreviewCardId = snapshot.cpuPhase1PreviewCardId || null;

  let replayAfterImport = false;
  if (state.playMode === "friend" && state.interstitial.open) {
    const nextPlayerIndex =
      state.interstitial.nextPlayerIndex === null || state.interstitial.nextPlayerIndex === undefined
        ? state.currentPlayer
        : state.interstitial.nextPlayerIndex;
    state.viewerPlayerIndex = nextPlayerIndex;
    setFriendInterstitialOpen(false);
    replayAfterImport = true;
  }

  validateHydratedStateCardOwnership();
  state.autoFocusTargetKey = null;
  renderAll();
  if (replayAfterImport) {
    playTurnRecapForViewer();
  }
  resumeLoadedStateFlow();
}

function hydratePendingSelection(pending) {
  if (!pending) return null;
  if (pending.type === "handMatch" || pending.type === "handPlace") {
    return {
      type: pending.type,
      playerIndex: asPlayerIndex(pending.playerIndex, "pendingSelection.playerIndex"),
      cardId: String(pending.cardId),
      options: pending.options.map(String),
    };
  }
  if (pending.type === "drawMatch" || pending.type === "drawPlace") {
    return {
      type: pending.type,
      playerIndex: asPlayerIndex(pending.playerIndex, "pendingSelection.playerIndex"),
      drawnCard: cardByIdOrThrow(pending.drawnCardId, "pendingSelection.drawnCardId"),
      moveNumber: asInt(pending.moveNumber, "pendingSelection.moveNumber"),
      options: pending.options.map(String),
    };
  }
  return null;
}

function hydrateAwaitingDeckFlip(flip) {
  if (!flip) return null;
  return {
    playerIndex: asPlayerIndex(flip.playerIndex, "awaitingDeckFlip.playerIndex"),
    moveNumber: asInt(flip.moveNumber, "awaitingDeckFlip.moveNumber"),
    drawnCard: cardByIdOrThrow(flip.drawnCardId, "awaitingDeckFlip.drawnCardId"),
    revealed: Boolean(flip.revealed),
  };
}

function hydrateAwaitingDecision(decision) {
  if (!decision) return null;
  return {
    ...decision,
    kind: "stopOrKoi",
    playerIndex: asPlayerIndex(decision.playerIndex, "awaitingDecision.playerIndex"),
    moveNumber: asInt(decision.moveNumber, "awaitingDecision.moveNumber"),
    points: asInt(decision.points, "awaitingDecision.points"),
    passMultiplier: asInt(decision.passMultiplier, "awaitingDecision.passMultiplier"),
    koiMultiplier: asInt(decision.koiMultiplier, "awaitingDecision.koiMultiplier"),
    canPass: Boolean(decision.canPass),
    forcedByFinalRound: Boolean(decision.forcedByFinalRound),
    resumeDrawPhase: Boolean(decision.resumeDrawPhase),
    yakuText: String(decision.yakuText || ""),
    specialTwoXActive: Boolean(decision.specialTwoXActive),
    prompt: String(decision.prompt || ""),
  };
}

function hydrateAiPreview(aiPreview) {
  if (!aiPreview) return null;
  return {
    options: Array.isArray(aiPreview.options) ? aiPreview.options.map(String) : [],
    prompt: String(aiPreview.prompt || ""),
  };
}

function normalizePlayMode(value) {
  return value === "friend" ? "friend" : "cpu";
}

function normalizeFriendFlow(value) {
  if (value === "hotseat" || value === "code" || value === "hybrid") {
    return value;
  }
  return "hybrid";
}

function normalizeInterstitial(interstitial) {
  const open = Boolean(interstitial?.open);
  const nextPlayerIndex = asNullablePlayerIndex(interstitial?.nextPlayerIndex, "interstitial.nextPlayerIndex");
  return {
    open,
    nextPlayerIndex,
  };
}

function createClosedRoundTransition() {
  return {
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
  };
}

function normalizeRoundTransition(roundTransition, maxGames) {
  if (!roundTransition || typeof roundTransition !== "object") {
    return createClosedRoundTransition();
  }
  const open = Boolean(roundTransition.open);
  const winnerIndex = asNullablePlayerIndex(roundTransition.winnerIndex, "roundTransition.winnerIndex");
  const pointsAwardedRaw = roundTransition.pointsAwarded;
  const pointsAwarded =
    pointsAwardedRaw === null || pointsAwardedRaw === undefined ? 0 : Math.max(0, asInt(pointsAwardedRaw, "roundTransition.pointsAwarded"));
  const noScore = Boolean(roundTransition.noScore);
  const nextGameRaw = roundTransition.nextGameNumber;
  const nextGameNumber =
    nextGameRaw === null || nextGameRaw === undefined ? null : asInt(nextGameRaw, "roundTransition.nextGameNumber");
  if (nextGameNumber !== null && (nextGameNumber < 1 || nextGameNumber > maxGames)) {
    throw new Error("roundTransition.nextGameNumber out of range");
  }
  const acks = {
    p0: Boolean(roundTransition.acks?.p0),
    p1: Boolean(roundTransition.acks?.p1),
    local: Boolean(roundTransition.acks?.local),
  };
  return {
    open,
    winnerIndex,
    pointsAwarded,
    noScore,
    nextGameNumber,
    acks,
  };
}

function normalizeLastExportMeta(meta) {
  if (!meta || typeof meta !== "object") return null;
  return {
    turnNumber: asInt(meta.turnNumber, "lastExportMeta.turnNumber"),
    playerIndex: asPlayerIndex(meta.playerIndex, "lastExportMeta.playerIndex"),
  };
}

function normalizeTurnRecap(recap) {
  if (!recap || typeof recap !== "object") return null;
  return {
    actorIndex: asPlayerIndex(recap.actorIndex, "lastTurnRecap.actorIndex"),
    moveNumber: asInt(recap.moveNumber, "lastTurnRecap.moveNumber"),
    tableMultiplierStart: asInt(recap.tableMultiplierStart, "lastTurnRecap.tableMultiplierStart"),
    tableMultiplierEnd: asInt(recap.tableMultiplierEnd, "lastTurnRecap.tableMultiplierEnd"),
    playedCardId: String(recap.playedCardId),
    handAction: recap.handAction && typeof recap.handAction === "object" ? { ...recap.handAction } : null,
    drawnCardId: recap.drawnCardId ? String(recap.drawnCardId) : null,
    drawAction: recap.drawAction && typeof recap.drawAction === "object" ? { ...recap.drawAction } : null,
    decision: recap.decision && typeof recap.decision === "object" ? { ...recap.decision } : null,
  };
}

function validateRoundHistoryEntry(entry, idx, maxGames) {
  if (!entry || typeof entry !== "object") {
    throw new Error(`roundHistory[${idx}] must be an object`);
  }
  const month = asInt(entry.month, `roundHistory[${idx}].month`);
  if (month < 1 || month > maxGames) {
    throw new Error(`roundHistory[${idx}].month out of range`);
  }
  const p0 =
    entry.p0 === null || entry.p0 === undefined
      ? asInt(entry.you, `roundHistory[${idx}].you`)
      : asInt(entry.p0, `roundHistory[${idx}].p0`);
  const p1 =
    entry.p1 === null || entry.p1 === undefined
      ? asInt(entry.cpu, `roundHistory[${idx}].cpu`)
      : asInt(entry.p1, `roundHistory[${idx}].p1`);
  if (p0 < 0 || p1 < 0) {
    throw new Error(`roundHistory[${idx}] scores must be non-negative`);
  }
  const multiplier = asInt(entry.multiplier, `roundHistory[${idx}].multiplier`);
  if (multiplier < 1 || multiplier > 4) {
    throw new Error(`roundHistory[${idx}].multiplier out of range`);
  }
}

function normalizeRoundHistoryEntry(entry, idx, maxGames) {
  validateRoundHistoryEntry(entry, idx, maxGames);
  const p0 =
    entry.p0 === null || entry.p0 === undefined ? asInt(entry.you, `roundHistory[${idx}].you`) : asInt(entry.p0, `roundHistory[${idx}].p0`);
  const p1 =
    entry.p1 === null || entry.p1 === undefined ? asInt(entry.cpu, `roundHistory[${idx}].cpu`) : asInt(entry.p1, `roundHistory[${idx}].p1`);
  return {
    month: entry.month,
    p0,
    p1,
    multiplier: entry.multiplier,
    noScore: Boolean(entry.noScore),
  };
}

function validateHydratedStateCardOwnership() {
  const ownership = new Map();
  const claim = (id, bucket) => {
    if (ownership.has(id)) {
      throw new Error(`Card ${id} appears in both ${ownership.get(id)} and ${bucket}`);
    }
    ownership.set(id, bucket);
  };

  state.field.forEach((card) => claim(card.id, "field"));
  state.drawPile.forEach((card) => claim(card.id, "drawPile"));
  state.players.forEach((player, playerIndex) => {
    player.hand.forEach((card) => claim(card.id, `players[${playerIndex}].hand`));
    player.captured.forEach((card) => claim(card.id, `players[${playerIndex}].captured`));
  });
  if (state.pendingSelection?.type === "drawMatch" || state.pendingSelection?.type === "drawPlace") {
    claim(state.pendingSelection.drawnCard.id, "pendingSelection.drawnCard");
  }
  if (state.awaitingDeckFlip) {
    claim(state.awaitingDeckFlip.drawnCard.id, "awaitingDeckFlip.drawnCard");
  }

  if (ownership.size > CARD_DECK.length) {
    throw new Error("Snapshot references too many cards");
  }

  if (state.pendingSelection) {
    const optionSet = new Set(state.field.map((card) => card.id));
    if (state.pendingSelection.type === "drawPlace") {
      if (
        state.pendingSelection.options.length !== 1 ||
        state.pendingSelection.options[0] !== state.pendingSelection.drawnCard.id
      ) {
        throw new Error("drawPlace pendingSelection options must reference the drawn card preview");
      }
    } else {
      for (const optionId of state.pendingSelection.options) {
        if (!optionSet.has(optionId)) {
          throw new Error("pendingSelection references a field card that is not on the field");
        }
      }
    }
    if (state.pendingSelection.type === "handMatch" || state.pendingSelection.type === "handPlace") {
      const handSet = new Set(state.players[state.pendingSelection.playerIndex].hand.map((card) => card.id));
      if (!handSet.has(state.pendingSelection.cardId)) {
        throw new Error("pendingSelection hand card is missing");
      }
    }
  }
}

function resumeLoadedStateFlow() {
  if (state.roundOver || state.matchOver) return;
  const cpuPlayerIndex = getCpuPlayerIndex();
  if (cpuPlayerIndex < 0) return;

  if (state.awaitingDecision) {
    if (state.awaitingDecision.playerIndex === cpuPlayerIndex) {
      scheduleAIStep(AI_STEP_DECISION_MS, () => resolveCpuPendingDecision(cpuPlayerIndex));
    }
    return;
  }

  if (state.awaitingDeckFlip) {
    if (state.awaitingDeckFlip.playerIndex === cpuPlayerIndex) {
      resumeCpuDeckFlipFlow(state.awaitingDeckFlip, cpuPlayerIndex);
    }
    return;
  }

  if (state.currentPlayer === cpuPlayerIndex) {
    queueAITurn(420);
  }
}

function resolveCpuPendingDecision(cpuPlayerIndex = getCpuPlayerIndex()) {
  if (!state.awaitingDecision || state.awaitingDecision.kind !== "stopOrKoi") return;
  if (cpuPlayerIndex < 0) return;
  if (state.awaitingDecision.playerIndex !== cpuPlayerIndex) return;
  const decision = state.awaitingDecision;
  if (state.roundOver || state.currentPlayer !== decision.playerIndex) return;
  const action = chooseAIDecision(decision);
  if (action === "pass" && decision.canPass) {
    recordTurnRecapDecision("pass", state.tableMultiplier, decision.passMultiplier);
    logPlayerMove(
      decision.playerIndex,
      decision.moveNumber,
      `Pass at ${decision.passMultiplier}x with ${decision.yakuText}.`
    );
    endRoundWithWinner(decision.playerIndex, decision.points, decision.passMultiplier, "passed");
    return;
  }
  applyKoiAndContinue(decision);
}

function resumeCpuDeckFlipFlow(flip, cpuPlayerIndex = getCpuPlayerIndex()) {
  if (cpuPlayerIndex < 0) return;
  if (!flip || flip.playerIndex !== cpuPlayerIndex) return;
  const drawn = flip.drawnCard;
  if (!drawn) return;

  if (flip.revealed) {
    scheduleAIStep(CPU_DRAW_REVEAL_LINGER_MS, () => {
      if (!state.awaitingDeckFlip) return;
      if (state.awaitingDeckFlip.playerIndex !== cpuPlayerIndex || state.awaitingDeckFlip.drawnCard.id !== drawn.id) return;
      if (state.roundOver || state.currentPlayer !== cpuPlayerIndex || state.awaitingDecision || state.pendingSelection) return;
      const moveNumber = state.awaitingDeckFlip.moveNumber;
      state.awaitingDeckFlip = null;
      resolveRevealedDrawForCpu(cpuPlayerIndex, moveNumber, drawn);
    });
    return;
  }

  scheduleAIStep(CPU_DECK_FLIP_DELAY_MS, () => {
    if (!state.awaitingDeckFlip) return;
    if (state.awaitingDeckFlip.playerIndex !== cpuPlayerIndex || state.awaitingDeckFlip.drawnCard.id !== drawn.id) return;
    if (state.roundOver || state.currentPlayer !== cpuPlayerIndex) return;
    state.awaitingDeckFlip.revealed = true;
    state.drawPreview = {
      cardId: drawn.id,
      text: `Pulled ${drawn.name}.`,
    };
    renderAll();
    resumeCpuDeckFlipFlow(state.awaitingDeckFlip, cpuPlayerIndex);
  });
}

function asInt(value, label) {
  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer`);
  }
  return value;
}

function asPlayerIndex(value, label) {
  const parsed = asInt(value, label);
  if (parsed !== 0 && parsed !== 1) {
    throw new Error(`${label} must be 0 or 1`);
  }
  return parsed;
}

function ensureNullablePlayerIndex(value, label) {
  asNullablePlayerIndex(value, label);
}

function asNullablePlayerIndex(value, label) {
  if (value === null || value === undefined) return null;
  return asPlayerIndex(value, label);
}

function ensureCardId(id, label) {
  if (typeof id !== "string" || !CARD_BY_ID.has(id)) {
    throw new Error(`${label} contains unknown card id`);
  }
}

function cardByIdOrThrow(id, label) {
  ensureCardId(id, label);
  return CARD_BY_ID.get(id);
}

function cardIdsToCards(ids, label) {
  if (!Array.isArray(ids)) {
    throw new Error(`${label} must be an array`);
  }
  return ids.map((id, index) => cardByIdOrThrow(id, `${label}[${index}]`));
}

function encodeBase64UrlUtf8(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64UrlUtf8(value) {
  const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(normalized + padding);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function computeCodeChecksum(payload) {
  let hash = 2166136261;
  for (let i = 0; i < payload.length; i += 1) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).toUpperCase();
}

function nextMoveNumber(playerIndex) {
  state.moveCounts[playerIndex] += 1;
  return state.moveCounts[playerIndex];
}

function addSystemLog(text) {
  state.message = text;
  pushActionLog("SYS", text);
}

function logPlayerMove(playerIndex, moveNumber, text) {
  state.message = text;
  pushActionLog(`P${playerIndex + 1} move ${moveNumber}`, text);
}

function pushActionLog(prefix, text) {
  const line = `${prefix}: ${text}`;
  state.actionLog.push(line);
  if (state.actionLog.length > ACTION_LOG_LIMIT) {
    state.actionLog.splice(0, state.actionLog.length - ACTION_LOG_LIMIT);
  }
}

function startTurnRecap(playerIndex, moveNumber, playedCardId) {
  state.activeTurnRecap = {
    actorIndex: playerIndex,
    moveNumber,
    tableMultiplierStart: state.tableMultiplier,
    tableMultiplierEnd: state.tableMultiplier,
    playedCardId,
    handAction: null,
    drawnCardId: null,
    drawAction: null,
    decision: null,
  };
}

function recordTurnRecapHandAction(action) {
  if (!state.activeTurnRecap) return;
  state.activeTurnRecap.handAction = action ? { ...action } : null;
}

function recordTurnRecapDraw(drawnCardId, action) {
  if (!state.activeTurnRecap) return;
  state.activeTurnRecap.drawnCardId = drawnCardId || null;
  state.activeTurnRecap.drawAction = action ? { ...action } : null;
}

function recordTurnRecapDecision(kind, multiplierBefore, multiplierAfter) {
  if (!state.activeTurnRecap) return;
  state.activeTurnRecap.decision = {
    kind,
    multiplierBefore,
    multiplierAfter,
  };
  state.activeTurnRecap.tableMultiplierEnd = multiplierAfter;
}

function commitTurnRecapForHandoff(playerIndex, moveNumber) {
  const recap = state.activeTurnRecap;
  if (!recap) {
    state.lastTurnRecap = null;
    return;
  }
  if (recap.actorIndex !== playerIndex || recap.moveNumber !== moveNumber) {
    state.lastTurnRecap = null;
    state.activeTurnRecap = null;
    return;
  }
  recap.tableMultiplierEnd = state.tableMultiplier;
  state.lastTurnRecap = { ...recap };
  state.activeTurnRecap = null;
}

function clearTurnRecapState() {
  state.activeTurnRecap = null;
  state.lastTurnRecap = null;
  state.turnReplay.key = null;
}

function buildTurnRecapSteps(recap) {
  if (!recap) return [];
  const actorName = state.players[recap.actorIndex]?.name || `Player ${recap.actorIndex + 1}`;
  const played = recap.playedCardId ? CARD_BY_ID.get(recap.playedCardId) : null;
  const drawn = recap.drawnCardId ? CARD_BY_ID.get(recap.drawnCardId) : null;
  const steps = [];

  if (played) {
    steps.push({
      note: `${actorName} selected ${played.name} from hand.`,
      cardId: played.id,
    });

    if (recap.handAction?.kind === "capture") {
      const fieldCard = recap.handAction.fieldCardId ? CARD_BY_ID.get(recap.handAction.fieldCardId) : null;
      steps.push({
        note: fieldCard
          ? `${played.name} matched ${fieldCard.name}. Captured.`
          : `${played.name} matched and captured.`,
        cardId: fieldCard?.id || played.id,
      });
    } else if (recap.handAction?.kind === "sweep") {
      steps.push({
        note: `${played.name} completed a 4-card month sweep.`,
        cardId: played.id,
      });
    } else if (recap.handAction?.kind === "place") {
      steps.push({
        note: `${played.name} had no match and was placed on field.`,
        cardId: played.id,
      });
    }
  }

  if (drawn) {
    steps.push({
      note: `${actorName} drew ${drawn.name} from deck.`,
      cardId: drawn.id,
    });

    if (recap.drawAction?.kind === "capture") {
      const fieldCard = recap.drawAction.fieldCardId ? CARD_BY_ID.get(recap.drawAction.fieldCardId) : null;
      steps.push({
        note: fieldCard
          ? `${drawn.name} matched ${fieldCard.name}. Captured.`
          : `${drawn.name} matched and captured.`,
        cardId: fieldCard?.id || drawn.id,
      });
    } else if (recap.drawAction?.kind === "sweep") {
      steps.push({
        note: `${drawn.name} completed a 4-card month sweep.`,
        cardId: drawn.id,
      });
    } else if (recap.drawAction?.kind === "place") {
      steps.push({
        note: `${drawn.name} had no match and was placed on field.`,
        cardId: drawn.id,
      });
    } else if (recap.drawAction?.kind === "deck-empty") {
      steps.push({
        note: "Deck was empty on phase 2.",
        cardId: played?.id || null,
      });
    }
  } else if (recap.drawAction?.kind === "deck-empty") {
    steps.push({
      note: "Deck was empty on phase 2.",
      cardId: played?.id || null,
    });
  }

  if (recap.decision?.kind === "pass" || recap.decision?.kind === "koi") {
    const decisionCardId = drawn?.id || played?.id || null;
    if (recap.decision.kind === "pass") {
      steps.push({
        note: `${actorName} passed at ${recap.decision.multiplierAfter}x and ended the round.`,
        cardId: decisionCardId,
      });
    } else {
      steps.push({
        note: `${actorName} called Koi-Koi. Table advanced to ${recap.decision.multiplierAfter}x.`,
        cardId: decisionCardId,
      });
    }
  }

  steps.push({
    note: "Your turn.",
    cardId: null,
  });

  return steps;
}

function stopTurnReplay(resetVisual = true) {
  if (state.turnReplay.timer) {
    clearTimeout(state.turnReplay.timer);
  }
  state.turnReplay.timer = null;
  state.turnReplay.active = false;
  state.turnReplay.note = "";
  state.turnReplay.steps = [];
  state.turnReplay.index = 0;
  state.turnReplay.lastStepAt = 0;
  if (resetVisual) {
    state.drawPreview = {
      cardId: null,
      text: "Waiting for draw.",
    };
  }
}

function advanceTurnReplayStep(fromTap = false) {
  if (!state.turnReplay.active) return;
  const steps = state.turnReplay.steps || [];
  const idx = state.turnReplay.index || 0;
  const step = steps[idx];

  if (!step) {
    stopTurnReplay(true);
    renderAll();
    return;
  }

  const total = steps.length;
  const isFinal = idx === total - 1;
  const progressText = isFinal ? "Tap to start your turn." : `Tap to continue (${idx + 1}/${total}).`;
  const note = `${step.note} ${progressText}`.trim();

  state.turnReplay.note = note;
  state.drawPreview = {
    cardId: step.cardId,
    text: note,
  };
  state.turnReplay.index = idx + 1;
  state.turnReplay.lastStepAt = Date.now();
  renderAll();

  if (state.turnReplay.timer) {
    clearTimeout(state.turnReplay.timer);
  }
  if (isFinal && fromTap) {
    stopTurnReplay(true);
    renderAll();
    return;
  }
  state.turnReplay.timer = setTimeout(() => {
    advanceTurnReplayStep(false);
  }, TURN_REPLAY_STEP_MS);
}

function playTurnRecapForViewer() {
  if (!isFriendMode()) return;
  const recap = state.lastTurnRecap;
  if (!recap) return;
  const viewer = getViewerPlayerIndex();
  if (viewer === recap.actorIndex) return;
  const key = `${recap.actorIndex}:${recap.moveNumber}:${state.gameNumber}`;
  if (state.turnReplay.key === key) return;

  stopTurnReplay(false);
  state.turnReplay.key = key;
  state.turnReplay.active = true;

  const steps = buildTurnRecapSteps(recap);
  if (!steps.length) {
    stopTurnReplay(true);
    return;
  }
  state.turnReplay.steps = steps;
  state.turnReplay.index = 0;
  state.turnReplay.lastStepAt = 0;
  advanceTurnReplayStep(false);
}

function startNewMatch(options = {}) {
  hideStartMenu();
  setCodePanelOpen(false);
  setLogPanelOpen(false);
  setGameSummaryPanelOpen(false);
  setCodeStatus("", false, "panel");
  const playModeSource = options.playMode || state.playMode || "cpu";
  const friendFlowSource = options.friendFlow || state.friendFlow || "hybrid";
  const playMode = playModeSource === "friend" ? "friend" : "cpu";
  const friendFlow = normalizeFriendFlow(friendFlowSource);
  const forcedDealer =
    options.forceDealerPlayerIndex === 0 || options.forceDealerPlayerIndex === 1 ? options.forceDealerPlayerIndex : null;
  const forcedCurrentPlayer =
    options.forceCurrentPlayerIndex === 0 || options.forceCurrentPlayerIndex === 1
      ? options.forceCurrentPlayerIndex
      : null;
  clearRoundRuntimeTimers({
    resetTurnReplayVisual: true,
    resetDrawPreviewFxState: true,
  });
  state.playMode = playMode;
  state.friendFlow = friendFlow;
  if (playMode === "friend") {
    state.aiProfile = DEFAULT_AI_PROFILE;
    state.players = [
      createPlayer("Player 1", true, "Player 1"),
      createPlayer("Player 2", true, "Player 2"),
    ];
  } else {
    state.aiProfile = pickRandomAIProfile();
    state.players = [createPlayer("You", true, "Player 1"), createPlayer("CPU", false, "CPU")];
  }
  state.interstitial = {
    open: false,
    nextPlayerIndex: null,
  };
  state.roundTransition = createClosedRoundTransition();
  state.turnCheckpointReady = false;
  state.lastExportMeta = null;
  clearTurnRecapState();
  state.gameNumber = 1;
  state.dealer = forcedDealer === null ? (Math.random() < 0.5 ? 0 : 1) : forcedDealer;
  state.currentPlayer = forcedCurrentPlayer === null ? state.dealer : forcedCurrentPlayer;
  state.viewerPlayerIndex = playMode === "friend" ? state.currentPlayer : 0;
  state.roundSpecialTwoXPlayer = null;
  state.nextRoundSpecialTwoXPlayer = null;
  state.roundLeaderAtStart = null;
  state.previousRoundWinner = null;
  state.previousRoundMultiplier = null;
  state.roundHistory = [];
  state.actionLog = [];
  state.moveCounts = [0, 0];
  state.matchOver = false;
  state.rtcWaiting = false;
  state.rtcPendingStart = false;
  if (playMode !== "friend") {
    resetRtcSession({ closeConnection: true });
  } else if (!state.rtcRole) {
    state.rtcRoomCode = "";
    state.rtcStatus = String(getRtcBridge()?.getStatus?.() || "idle");
  }
  addSystemLog("New match started.");
  startRound();
  refreshExportCode();
}

function pickRandomAIProfile() {
  const idx = Math.floor(Math.random() * AI_PROFILE_KEYS.length);
  return AI_PROFILE_KEYS[idx];
}

function startRound() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  clearRoundRuntimeTimers({
    resetTurnReplayVisual: true,
    resetDrawPreviewFxState: true,
  });
  state.actionLog = [];
  state.moveCounts = [0, 0];
  state.roundOver = false;
  state.pendingSelection = null;
  state.awaitingDeckFlip = null;
  state.aiPreview = null;
  state.cpuPhase1PreviewCardId = null;
  state.awaitingDecision = null;
  state.firstYakuPlayer = null;
  state.lastKoiCaller = null;
  state.tableMultiplier = 1;
  state.roundSpecialTwoXPlayer = state.nextRoundSpecialTwoXPlayer;
  state.nextRoundSpecialTwoXPlayer = null;
  clearTurnRecapState();
  state.drawPreview = {
    cardId: null,
    text: "Waiting for draw.",
  };
  state.autoFocusTargetKey = null;
  state.autoFocusTargetKey = null;
  state.interstitial = {
    open: false,
    nextPlayerIndex: null,
  };
  state.roundTransition = createClosedRoundTransition();
  if (isFriendMode()) {
    state.viewerPlayerIndex = state.currentPlayer;
  }

  const p0 = state.players[0].score;
  const p1 = state.players[1].score;
  state.roundLeaderAtStart = null;
  if (state.gameNumber === state.maxGames) {
    if (p0 > p1) state.roundLeaderAtStart = 0;
    if (p1 > p0) state.roundLeaderAtStart = 1;
  }

  const hands = dealRound();
  state.players[0].hand = sortByMonth(hands.player);
  state.players[1].hand = sortByMonth(hands.cpu);
  state.players[0].captured = [];
  state.players[1].captured = [];
  state.players[0].yaku = { points: 0, names: [], triggerKeys: [] };
  state.players[1].yaku = { points: 0, names: [], triggerKeys: [] };
  state.players[0].yakuSeen = new Set();
  state.players[1].yakuSeen = new Set();
  state.field = hands.field;
  state.drawPile = hands.deck;
  state.currentPlayer = state.dealer;

  const lucky0 = detectLuckyHand(state.players[0].hand);
  const lucky1 = detectLuckyHand(state.players[1].hand);

  if (lucky0 && lucky1) {
    state.message = "Both players opened lucky hands. Draw game.";
    endRoundDraw();
    return;
  }

  if (lucky0) {
    state.message = `Lucky hand: ${state.players[0].name} (${lucky0}).`;
    endRoundWithWinner(0, 6, 1, "lucky hand");
    return;
  }

  if (lucky1) {
    state.message = `Lucky hand: ${state.players[1].name} (${lucky1}).`;
    endRoundWithWinner(1, 6, 1, "lucky hand");
    return;
  }

  if (isOnlineFriendSessionActive()) {
    const localPlayerIndex = getOnlineLocalPlayerIndex();
    if (localPlayerIndex === null) {
      state.rtcWaiting = false;
    } else {
      state.rtcWaiting = localPlayerIndex !== state.currentPlayer;
      if (!state.rtcWaiting) {
        setFriendInterstitialOpen(false);
      }
    }
  }

  state.message = `${state.players[state.currentPlayer].name} starts. Table 1x.`;
  if (state.roundSpecialTwoXPlayer !== null) {
    state.message += ` ${state.players[state.roundSpecialTwoXPlayer].name} has the first-yaku 2x privilege.`;
  }
  addSystemLog(state.message);

  renderAll();

  if (!state.players[state.currentPlayer].isHuman) {
    queueAITurn(420);
  }
}

function dealRound() {
  while (true) {
    const deck = shuffle([...CARD_DECK]);
    const player = deck.splice(0, 8);
    const cpu = deck.splice(0, 8);
    const field = deck.splice(0, 8);
    if (!hasMonthSetOfFour(field)) {
      return { player, cpu, field, deck };
    }
  }
}

function hasMonthSetOfFour(cards) {
  const counts = {};
  for (const card of cards) {
    counts[card.month] = (counts[card.month] || 0) + 1;
  }
  return Object.values(counts).some((count) => count >= 4);
}

function isFriendMode() {
  return state.playMode === "friend";
}

function getCpuPlayerIndex() {
  for (let i = 0; i < state.players.length; i += 1) {
    if (!state.players[i].isHuman) return i;
  }
  return -1;
}

function isFriendCodeMode() {
  return isFriendMode();
}

function isFriendTurnExportWindow() {
  return isFriendMode() && Boolean(state.interstitial?.open);
}

function getViewerPlayerIndex() {
  const parsed = asNullablePlayerIndex(state.viewerPlayerIndex, "state.viewerPlayerIndex");
  if (parsed === null) return 0;
  return parsed;
}

function getDisplayBottomPlayerIndex() {
  return isFriendMode() ? getViewerPlayerIndex() : 0;
}

function getDisplayTopPlayerIndex() {
  return getDisplayBottomPlayerIndex() === 0 ? 1 : 0;
}

function getSummaryColumnLabel(playerIndex) {
  const player = state.players[playerIndex];
  return player?.name || `P${playerIndex + 1}`;
}

function getLatestRoundOutcome() {
  if (!state.roundHistory.length) return null;
  const last = state.roundHistory[state.roundHistory.length - 1];
  if (!last || last.noScore) {
    return {
      noScore: true,
      winnerIndex: null,
      points: 0,
    };
  }
  const p0Points = Math.max(0, Number(last.p0 ?? last.you) || 0);
  const p1Points = Math.max(0, Number(last.p1 ?? last.cpu) || 0);
  if (p0Points === p1Points) {
    return {
      noScore: false,
      winnerIndex: null,
      points: p0Points,
    };
  }
  if (p0Points > p1Points) {
    return {
      noScore: false,
      winnerIndex: 0,
      points: p0Points,
    };
  }
  return {
    noScore: false,
    winnerIndex: 1,
    points: p1Points,
  };
}

function canRevealBottomHand() {
  if (!isFriendMode()) return true;
  if (state.rtcWaiting) return false;
  if (isOnlineFriendSessionActive() && (state.rtcStatus === "disconnected" || state.rtcStatus === "error")) return false;
  if (state.interstitial?.open) return false;
  return getViewerPlayerIndex() === state.currentPlayer;
}

function getInteractiveHumanPlayerIndex() {
  if (state.roundOver || state.matchOver) return null;
  if (state.turnReplay.active) return null;
  if (state.rtcWaiting) return null;
  if (isOnlineFriendSessionActive() && (state.rtcStatus === "disconnected" || state.rtcStatus === "error")) return null;
  if (state.interstitial?.open) return null;
  const current = state.players[state.currentPlayer];
  if (!current || !current.isHuman) return null;
  if (!isFriendMode()) {
    return state.currentPlayer === 0 ? 0 : null;
  }
  const viewerIndex = getViewerPlayerIndex();
  if (viewerIndex !== state.currentPlayer) return null;
  return viewerIndex;
}

function detectLuckyHand(hand) {
  const counts = {};
  for (const card of hand) {
    counts[card.month] = (counts[card.month] || 0) + 1;
  }
  if (Object.values(counts).some((count) => count === 4)) {
    return "Four of a Kind";
  }
  const values = Object.values(counts);
  if (values.length === 4 && values.every((count) => count === 2)) {
    return "Paired Months";
  }
  return null;
}

function onPlayerHandClick(event) {
  if (!state.ready || state.roundOver || state.awaitingDecision || state.awaitingDeckFlip) return;
  const interactivePlayerIndex = getInteractiveHumanPlayerIndex();
  if (interactivePlayerIndex === null) return;

  const pending = state.pendingSelection;
  const handPreviewPending =
    Boolean(pending) &&
    pending.playerIndex === interactivePlayerIndex &&
    (pending.type === "handMatch" || pending.type === "handPlace");

  const cardNode = event.target.closest("[data-card-id]");
  if (!cardNode) {
    if (handPreviewPending) {
      clearPlayerHandPreview(interactivePlayerIndex);
    }
    return;
  }

  const cardId = cardNode.dataset.cardId;
  const player = state.players[interactivePlayerIndex];
  const card = player.hand.find((entry) => entry.id === cardId);
  if (!card) return;

  if (pending) {
    if (pending.type === "drawMatch" || pending.type === "drawPlace") return;
    if (handPreviewPending) {
      if (pending.cardId === cardId) {
        if (pending.type === "handPlace" || pending.type === "handMatch") {
          clearPlayerHandPreview(interactivePlayerIndex);
        }
        return;
      }
      previewPlayerHandCard(cardId, interactivePlayerIndex);
      return;
    }
    return;
  }

  previewPlayerHandCard(cardId, interactivePlayerIndex);
}

function createHandMatchPendingSelection(playerIndex, cardId, matches) {
  return {
    type: "handMatch",
    playerIndex,
    cardId,
    options: matches.map((entry) => entry.id),
  };
}

function createHandPlacePendingSelection(playerIndex, cardId) {
  return {
    type: "handPlace",
    playerIndex,
    cardId,
    options: [cardId],
  };
}

function createDrawMatchPendingSelection(playerIndex, drawnCard, moveNumber, matches) {
  return {
    type: "drawMatch",
    playerIndex,
    drawnCard,
    moveNumber,
    options: matches.map((entry) => entry.id),
  };
}

function createDrawPlacePendingSelection(playerIndex, drawnCard, moveNumber) {
  return {
    type: "drawPlace",
    playerIndex,
    drawnCard,
    moveNumber,
    options: [drawnCard.id],
  };
}

function previewPlayerHandCard(cardId, playerIndex = getInteractiveHumanPlayerIndex()) {
  if (playerIndex === null || playerIndex === undefined) return;
  const player = state.players[playerIndex];
  const card = player.hand.find((entry) => entry.id === cardId);
  if (!card) return;

  const matches = getFieldMatches(card.month);
  if (matches.length > 0) {
    const prompt =
      matches.length === 1
        ? `Tap highlighted ${describeMonth(card.month)} field card to capture, or tap hand area to cancel.`
        : matches.length === 3
          ? `Tap highlighted ${describeMonth(card.month)} card to sweep all four, or tap hand area to cancel.`
          : `Choose highlighted ${describeMonth(card.month)} field card, or tap hand area to cancel.`;
    beginPendingSelection(createHandMatchPendingSelection(playerIndex, cardId, matches), prompt, { silent: true });
    return;
  }

  beginPendingSelection(
    createHandPlacePendingSelection(playerIndex, cardId),
    `No match for ${card.name}. Tap preview field card to place, or tap selected hand card to cancel.`,
    { silent: true }
  );
}

function clearPlayerHandPreview(playerIndex = getDisplayBottomPlayerIndex()) {
  const pending = state.pendingSelection;
  if (!pending) return;
  if (pending.playerIndex !== playerIndex) return;
  if (pending.type !== "handMatch" && pending.type !== "handPlace") return;
  state.pendingSelection = null;
  state.message = `${state.players[state.currentPlayer].name} to play. Table ${state.tableMultiplier}x.`;
  renderAll();
}

function onFieldClick(event) {
  if (state.awaitingDeckFlip) return;
  const interactivePlayerIndex = getInteractiveHumanPlayerIndex();
  if (interactivePlayerIndex === null) return;
  const cardNode = event.target.closest("[data-card-id]");
  if (!cardNode) return;

  const selectedId = cardNode.dataset.cardId;
  const pending = state.pendingSelection;
  if (pending?.playerIndex !== interactivePlayerIndex) return;
  if (!pending || !pending.options.includes(selectedId)) return;

  if (pending.type === "handPlace") {
    if (selectedId === pending.cardId) {
      executePlayFromHand(pending.playerIndex, pending.cardId, null);
    }
  } else if (pending.type === "handMatch") {
    executePlayFromHand(pending.playerIndex, pending.cardId, selectedId);
  } else if (pending.type === "drawMatch") {
    resolveDrawMatch(pending.playerIndex, pending.drawnCard, selectedId, pending.moveNumber);
  } else if (pending.type === "drawPlace") {
    if (selectedId === pending.drawnCard.id) {
      resolveDrawPlace(pending.playerIndex, pending.drawnCard, pending.moveNumber);
    }
  }
}

function onDrawPreviewClick() {
  if (state.turnReplay.active) {
    const now = Date.now();
    if (now - (state.turnReplay.lastStepAt || 0) < TURN_REPLAY_TAP_GUARD_MS) return;
    advanceTurnReplayStep(true);
    return;
  }

  const interactivePlayerIndex = getInteractiveHumanPlayerIndex();
  if (interactivePlayerIndex === null) return;
  const flip = state.awaitingDeckFlip;
  if (!flip) return;
  if (flip.playerIndex !== interactivePlayerIndex || state.currentPlayer !== interactivePlayerIndex) return;
  if (flip.revealed || state.roundOver || state.awaitingDecision || state.pendingSelection) return;

  flip.revealed = true;
  const drawn = flip.drawnCard;
  state.drawPreview = {
    cardId: drawn.id,
    text: `Pulled ${drawn.name}.`,
  };
  renderAll();

  clearDrawRevealTask();
  state.drawRevealTimer = setTimeout(() => {
    state.drawRevealTimer = null;
    if (state.roundOver || !state.awaitingDeckFlip || state.awaitingDeckFlip.drawnCard.id !== drawn.id) return;
    const { playerIndex, moveNumber } = state.awaitingDeckFlip;
    state.awaitingDeckFlip = null;
    resolveRevealedDrawForPlayer(playerIndex, moveNumber, drawn);
  }, PLAYER_DRAW_REVEAL_LINGER_MS);
}

function beginPendingSelection(pending, logMessage, options = {}) {
  state.pendingSelection = pending;
  state.message = logMessage;
  if (!options.silent) {
    addSystemLog(state.message);
  }
  renderAll();
}

function executePlayFromHand(playerIndex, cardId, forcedFieldId) {
  state.pendingSelection = null;
  state.aiPreview = null;
  if (playerIndex === getCpuPlayerIndex()) {
    state.cpuPhase1PreviewCardId = null;
  }
  const moveNumber = nextMoveNumber(playerIndex);
  startTurnRecap(playerIndex, moveNumber, cardId);

  const player = state.players[playerIndex];
  const cardIndex = player.hand.findIndex((card) => card.id === cardId);
  if (cardIndex === -1) return;
  const card = player.hand.splice(cardIndex, 1)[0];

  let captured = [];
  const matches = getFieldMatches(card.month);

  if (matches.length === 3) {
    captured = [card, ...takeAllMonthMatchesFromField(card.month)];
    recordTurnRecapHandAction({ kind: "sweep" });
    state.message = `${player.name} captured all four ${describeMonth(card.month)} cards.`;
  } else if (forcedFieldId) {
    const fieldIndex = state.field.findIndex((entry) => entry.id === forcedFieldId);
    if (fieldIndex !== -1) {
      const fieldCard = state.field.splice(fieldIndex, 1)[0];
      captured = [card, fieldCard];
      recordTurnRecapHandAction({ kind: "capture", fieldCardId: fieldCard.id });
      state.message = `${player.name} captured ${fieldCard.name}.`;
    } else {
      state.field.push(card);
      recordTurnRecapHandAction({ kind: "place" });
      state.message = `${player.name} placed ${card.name}.`;
    }
  } else if (matches.length === 1) {
    const fieldIndex = state.field.findIndex((entry) => entry.id === matches[0].id);
    const fieldCard = state.field.splice(fieldIndex, 1)[0];
    captured = [card, fieldCard];
    recordTurnRecapHandAction({ kind: "capture", fieldCardId: fieldCard.id });
    state.message = `${player.name} captured ${fieldCard.name}.`;
  } else {
    state.field.push(card);
    recordTurnRecapHandAction({ kind: "place" });
    state.message = `${player.name} placed ${card.name}.`;
  }

  if (captured.length) {
    addCapturedCards(playerIndex, captured);
  }

  const stoppedAtHandYaku = checkHandPhaseYaku(playerIndex, moveNumber);
  if (stoppedAtHandYaku) {
    return;
  }

  processDrawStep(playerIndex, moveNumber);
}

function processDrawStep(playerIndex, moveNumber) {
  if (state.drawPile.length === 0) {
    state.drawPreview = { cardId: null, text: "Deck is empty." };
    recordTurnRecapDraw(null, { kind: "deck-empty" });
    finalizeTurn(playerIndex, moveNumber);
    return;
  }

  const drawn = state.drawPile.shift();
  const matches = getFieldMatches(drawn.month);

  if (state.players[playerIndex].isHuman) {
    state.awaitingDeckFlip = {
      playerIndex,
      moveNumber,
      drawnCard: drawn,
      revealed: false,
    };
    state.drawPreview = {
      cardId: null,
      text: "Tap Recent Deck Pull to reveal.",
    };
    state.message += " Draw from deck ready.";
    addSystemLog("Tap Recent Deck Pull to reveal the drawn card.");
    renderAll();
    return;
  }
  state.awaitingDeckFlip = {
    playerIndex,
    moveNumber,
    drawnCard: drawn,
    revealed: false,
  };
  state.drawPreview = {
    cardId: null,
    text: "CPU is preparing deck reveal.",
  };
  addSystemLog("CPU draws from deck.");
  renderAll();

  scheduleAIStep(CPU_DECK_FLIP_DELAY_MS, () => {
    const flip = state.awaitingDeckFlip;
    if (!flip || flip.playerIndex !== playerIndex || state.roundOver || state.currentPlayer !== playerIndex) return;
    flip.revealed = true;
    state.drawPreview = {
      cardId: drawn.id,
      text: `Pulled ${drawn.name}.`,
    };
    renderAll();

    scheduleAIStep(CPU_DRAW_REVEAL_LINGER_MS, () => {
      const active = state.awaitingDeckFlip;
      if (!active || active.playerIndex !== playerIndex || active.drawnCard.id !== drawn.id) return;
      if (state.roundOver || state.currentPlayer !== playerIndex || state.awaitingDecision || state.pendingSelection) return;
      state.awaitingDeckFlip = null;
      resolveRevealedDrawForCpu(playerIndex, moveNumber, drawn);
    });
  });
}

function resolveRevealedDrawForPlayer(playerIndex, moveNumber, drawn) {
  const matches = getFieldMatches(drawn.month);

  if (matches.length === 0) {
    state.drawPreview = {
      cardId: drawn.id,
      text: `Pulled ${drawn.name}. Tap preview field card to place.`,
    };
    beginPendingSelection(
      createDrawPlacePendingSelection(playerIndex, drawn, moveNumber),
      `${state.message} Flip ${drawn.name}. Tap preview field card to place.`,
      { silent: true }
    );
    return;
  }

  const drawChoiceText =
    matches.length === 1
      ? `Pulled ${drawn.name}. Tap highlighted field card to capture.`
      : matches.length === 3
        ? `Pulled ${drawn.name}. Tap any highlighted field card to sweep all four.`
        : `Pulled ${drawn.name}. Choose a matching field card.`;
  state.drawPreview = {
    cardId: drawn.id,
    text: drawChoiceText,
  };
  const prompt =
    matches.length === 1
      ? `${state.message} Flip ${drawn.name}. Tap the highlighted field card to capture.`
      : matches.length === 3
        ? `${state.message} Flip ${drawn.name}. Tap any highlighted field card to capture all four.`
        : `${state.message} Flip ${drawn.name}. Choose the matching field card.`;
  beginPendingSelection(createDrawMatchPendingSelection(playerIndex, drawn, moveNumber, matches), prompt);
}

function resolveRevealedDrawForCpu(playerIndex, moveNumber, drawn) {
  const matches = getFieldMatches(drawn.month);
  if (matches.length === 0) {
    state.field.push(drawn);
    recordTurnRecapDraw(drawn.id, { kind: "place" });
    state.message += ` Flip ${drawn.name}, no match.`;
    state.drawPreview = {
      cardId: drawn.id,
      text: `Pulled ${drawn.name}. No match, landed on field.`,
    };
    scheduleCpuDrawFinalize(playerIndex, moveNumber);
    return;
  }

  previewAndResolveCpuDrawMatch(playerIndex, moveNumber, drawn, matches);
}

function resolveDrawMatch(playerIndex, drawnCard, fieldCardId, moveNumber) {
  state.pendingSelection = null;
  const matches = getFieldMatches(drawnCard.month);

  if (matches.length === 3) {
    const captured = [drawnCard, ...takeAllMonthMatchesFromField(drawnCard.month)];
    addCapturedCards(playerIndex, captured);
    recordTurnRecapDraw(drawnCard.id, { kind: "sweep" });
    state.message += ` Captured all four ${describeMonth(drawnCard.month)} cards.`;
    state.drawPreview = {
      cardId: drawnCard.id,
      text: `Pulled ${drawnCard.name}. Swept all four ${describeMonth(drawnCard.month)} cards.`,
    };
    finalizeTurn(playerIndex, moveNumber);
    return;
  }

  const fieldIndex = state.field.findIndex((entry) => entry.id === fieldCardId);
  if (fieldIndex !== -1) {
    const fieldCard = state.field.splice(fieldIndex, 1)[0];
    addCapturedCards(playerIndex, [drawnCard, fieldCard]);
    recordTurnRecapDraw(drawnCard.id, { kind: "capture", fieldCardId: fieldCard.id });
    state.message += ` Capture ${fieldCard.name}.`;
    state.drawPreview = {
      cardId: drawnCard.id,
      text: `Pulled ${drawnCard.name}. Matched ${fieldCard.name}.`,
    };
  } else {
    state.field.push(drawnCard);
    recordTurnRecapDraw(drawnCard.id, { kind: "place" });
    state.message += ` No capture.`;
    state.drawPreview = {
      cardId: drawnCard.id,
      text: `Pulled ${drawnCard.name}. No match, landed on field.`,
    };
  }

  finalizeTurn(playerIndex, moveNumber);
}

function resolveDrawPlace(playerIndex, drawnCard, moveNumber) {
  state.pendingSelection = null;
  state.field.push(drawnCard);
  recordTurnRecapDraw(drawnCard.id, { kind: "place" });
  state.message += ` Flip ${drawnCard.name}, no match.`;
  state.drawPreview = {
    cardId: drawnCard.id,
    text: `Pulled ${drawnCard.name}. No match, landed on field.`,
  };
  finalizeTurn(playerIndex, moveNumber);
}

function addCapturedCards(playerIndex, cards) {
  const player = state.players[playerIndex];
  for (const card of cards) {
    player.captured.push(card);
  }
}

function takeAllMonthMatchesFromField(month) {
  const matches = state.field.filter((card) => card.month === month);
  if (!matches.length) return [];
  const ids = new Set(matches.map((card) => card.id));
  state.field = state.field.filter((card) => !ids.has(card.id));
  return matches;
}

function scheduleCpuDrawFinalize(playerIndex, moveNumber) {
  renderAll();
  scheduleAIStep(AI_STEP_DRAW_RESOLVE_MS, () => {
    if (
      state.roundOver ||
      state.currentPlayer !== playerIndex ||
      state.awaitingDecision ||
      state.pendingSelection ||
      state.awaitingDeckFlip
    ) {
      return;
    }
    finalizeTurn(playerIndex, moveNumber);
  });
}

function previewAndResolveCpuDrawMatch(playerIndex, moveNumber, drawnCard, matches) {
  let options = [];
  let selectedId = null;
  let prompt = "";

  if (matches.length === 3) {
    options = matches.map((entry) => entry.id);
    selectedId = options[0] || null;
    prompt = `CPU prepares a ${describeMonth(drawnCard.month)} sweep from deck draw.`;
  } else if (matches.length === 2) {
    const chosen = chooseBestMatchForAI(playerIndex, drawnCard, matches);
    selectedId = chosen.id;
    options = [selectedId];
    prompt = `CPU picks ${chosen.name} for drawn ${drawnCard.name}.`;
  } else {
    selectedId = matches[0].id;
    options = [selectedId];
    prompt = `CPU picks ${matches[0].name} for drawn ${drawnCard.name}.`;
  }

  state.aiPreview = {
    options,
    prompt,
  };
  addSystemLog(prompt);
  renderAll();

  scheduleAIStep(AI_STEP_TARGET_MS, () => {
    if (state.roundOver || state.currentPlayer !== playerIndex || state.awaitingDecision || state.pendingSelection) {
      return;
    }
    state.aiPreview = null;

    if (matches.length === 3) {
      const captured = [drawnCard, ...takeAllMonthMatchesFromField(drawnCard.month)];
      addCapturedCards(playerIndex, captured);
      recordTurnRecapDraw(drawnCard.id, { kind: "sweep" });
      state.message += ` Flip ${drawnCard.name}, captured all four ${describeMonth(drawnCard.month)} cards.`;
      state.drawPreview = {
        cardId: drawnCard.id,
        text: `Pulled ${drawnCard.name}. Swept all four ${describeMonth(drawnCard.month)} cards.`,
      };
      scheduleCpuDrawFinalize(playerIndex, moveNumber);
      return;
    }

    const fieldIndex = state.field.findIndex((entry) => entry.id === selectedId);
    if (fieldIndex !== -1) {
      const fieldCard = state.field.splice(fieldIndex, 1)[0];
      addCapturedCards(playerIndex, [drawnCard, fieldCard]);
      recordTurnRecapDraw(drawnCard.id, { kind: "capture", fieldCardId: fieldCard.id });
      state.message += ` Flip ${drawnCard.name}, capture ${fieldCard.name}.`;
      state.drawPreview = {
        cardId: drawnCard.id,
        text: `Pulled ${drawnCard.name}. Matched ${fieldCard.name}.`,
      };
    } else {
      state.field.push(drawnCard);
      recordTurnRecapDraw(drawnCard.id, { kind: "place" });
      state.message += ` Flip ${drawnCard.name}, no match.`;
      state.drawPreview = {
        cardId: drawnCard.id,
        text: `Pulled ${drawnCard.name}. No match, landed on field.`,
      };
    }
    scheduleCpuDrawFinalize(playerIndex, moveNumber);
  });
}

function evaluateYakuProgress(playerIndex) {
  const player = state.players[playerIndex];
  const yakuEval = computeYaku(player.captured, state.gameNumber);
  const previousSeenCount = player.yakuSeen.size;
  const newKeys = [];

  for (const key of yakuEval.triggerKeys) {
    if (!player.yakuSeen.has(key)) {
      newKeys.push(key);
    }
  }

  player.yaku = yakuEval;
  return { player, previousSeenCount, newKeys };
}

function checkHandPhaseYaku(playerIndex, moveNumber) {
  const { player, previousSeenCount, newKeys } = evaluateYakuProgress(playerIndex);
  if (!newKeys.length) {
    return false;
  }

  const playerFirstYakuEvent = previousSeenCount === 0;
  const roundFirstYakuEvent = state.firstYakuPlayer === null;
  for (const key of newKeys) {
    player.yakuSeen.add(key);
  }
  handleNewYakuEvent(playerIndex, playerFirstYakuEvent, roundFirstYakuEvent, moveNumber, true);
  return true;
}

function finalizeTurn(playerIndex, moveNumber) {
  logPlayerMove(playerIndex, moveNumber, state.message);

  const { player, previousSeenCount, newKeys } = evaluateYakuProgress(playerIndex);

  if (newKeys.length > 0) {
    const playerFirstYakuEvent = previousSeenCount === 0;
    const roundFirstYakuEvent = state.firstYakuPlayer === null;
    for (const key of newKeys) {
      player.yakuSeen.add(key);
    }
    handleNewYakuEvent(playerIndex, playerFirstYakuEvent, roundFirstYakuEvent, moveNumber, false);
    return;
  }

  if (state.players[0].hand.length === 0 && state.players[1].hand.length === 0) {
    resolveDeckExhaustion();
    return;
  }

  moveToNextPlayer();
}

function handleNewYakuEvent(
  playerIndex,
  playerFirstYakuEvent,
  roundFirstYakuEvent,
  moveNumber,
  resumeDrawPhase
) {
  if (roundFirstYakuEvent) {
    state.firstYakuPlayer = playerIndex;
  }

  const decision = buildDecisionContext(
    playerIndex,
    playerFirstYakuEvent,
    roundFirstYakuEvent,
    moveNumber,
    resumeDrawPhase
  );

  if (!state.players[playerIndex].isHuman) {
    state.message = `${state.players[playerIndex].name} is deciding: Pass or Koi-Koi.`;
    addSystemLog(state.message);
    renderAll();
    scheduleAIStep(AI_STEP_DECISION_MS, () => {
      if (state.roundOver || state.currentPlayer !== playerIndex) return;
      const action = chooseAIDecision(decision);
      if (action === "pass" && decision.canPass) {
        logPlayerMove(
          playerIndex,
          decision.moveNumber,
          `Pass at ${decision.passMultiplier}x with ${decision.yakuText}.`
        );
        endRoundWithWinner(playerIndex, decision.points, decision.passMultiplier, "passed");
        return;
      }
      applyKoiAndContinue(decision);
    });
    return;
  }

  state.awaitingDecision = {
    ...decision,
    kind: "stopOrKoi",
    prompt: buildDecisionPrompt(decision),
  };
  renderAll();
}

function buildDecisionContext(
  playerIndex,
  playerFirstYakuEvent,
  roundFirstYakuEvent,
  moveNumber,
  resumeDrawPhase
) {
  const player = state.players[playerIndex];
  const points = player.yaku.points;
  const yakuText = player.yaku.names.join(", ") || `${points} points`;

  const specialTwoXActive =
    state.roundSpecialTwoXPlayer === playerIndex && playerFirstYakuEvent && state.tableMultiplier === 1;

  const passMultiplier = specialTwoXActive ? 2 : state.tableMultiplier;
  const koiMultiplier = specialTwoXActive ? 3 : Math.min(4, state.tableMultiplier + 1);

  let canPass = true;
  const forcedByFinalRound =
    state.gameNumber === state.maxGames &&
    state.roundLeaderAtStart === playerIndex &&
    roundFirstYakuEvent &&
    passMultiplier === 1;

  if (forcedByFinalRound) {
    canPass = false;
  }

  return {
    playerIndex,
    moveNumber,
    resumeDrawPhase,
    points,
    yakuText,
    specialTwoXActive,
    passMultiplier,
    koiMultiplier,
    canPass,
    forcedByFinalRound,
  };
}

function buildDecisionPrompt(decision) {
  const owner = state.players[decision.playerIndex].name;
  const base = `${owner} formed ${decision.yakuText}.`;
  const phaseText = decision.resumeDrawPhase ? " Decide before deck draw." : "";
  if (!decision.canPass) {
    return `${base} ${owner} is forced to Koi-Koi.${phaseText}`;
  }
  if (decision.specialTwoXActive) {
    return `${base} Pass for 2x, or Koi-Koi to jump table to 3x.${phaseText}`;
  }
  return `${base} Pass at ${decision.passMultiplier}x or Koi-Koi to ${decision.koiMultiplier}x.${phaseText}`;
}

function getAIProfile() {
  return AI_PROFILES[state.aiProfile] || AI_PROFILES[DEFAULT_AI_PROFILE];
}

function estimateCardsRemaining(game = state) {
  return game.drawPile.length + game.players[0].hand.length + game.players[1].hand.length;
}

function buildCapturedStats(captured, roundMonth) {
  const ids = new Set(captured.map((card) => card.id));
  const lights = captured.filter((card) => card.type === "light").length;
  const seeds = captured.filter((card) => card.type === "seed").length;
  const scrolls = captured.filter((card) => card.type === "scroll").length;
  const basics = captured.filter((card) => card.type === "basic").length;
  const roundMonthCount = captured.filter((card) => card.month === roundMonth).length;
  return { ids, lights, seeds, scrolls, basics, roundMonthCount };
}

function estimateNearSetThreat(stats, setIds, fullValue) {
  let present = 0;
  for (const id of setIds) {
    if (stats.ids.has(id)) present += 1;
  }
  const missing = setIds.length - present;
  if (missing <= 0) return fullValue * 0.25;
  if (missing === 1) return fullValue * 0.72;
  if (missing === 2) return fullValue * 0.34;
  return 0;
}

function estimateYakuThreatScore(captured, roundMonth) {
  const stats = buildCapturedStats(captured, roundMonth);
  const actual = computeYaku(captured, roundMonth).points;
  let threat = actual * 1.05;

  if (stats.lights >= 4) threat += 7.2;
  else if (stats.lights === 3) threat += 4.1;
  else if (stats.lights === 2) threat += 1.7;

  if (stats.seeds === 4) threat += 2.4;
  if (stats.seeds >= 5) threat += 2.2 + (stats.seeds - 5) * 0.7;
  if (stats.scrolls === 4) threat += 1.5;
  if (stats.scrolls >= 5) threat += 1.6 + (stats.scrolls - 5) * 0.55;
  if (stats.basics === 9) threat += 1.2;
  if (stats.basics >= 10) threat += 1.4 + (stats.basics - 10) * 0.45;
  if (stats.roundMonthCount === 3) threat += 3.4;

  threat += estimateNearSetThreat(stats, ["3a", "9a"], 5);
  threat += estimateNearSetThreat(stats, ["8a", "9a"], 5);
  threat += estimateNearSetThreat(stats, ["6a", "7a", "10a"], 5);
  threat += estimateNearSetThreat(stats, ["1b", "2b", "3b"], 5);
  threat += estimateNearSetThreat(stats, ["6b", "9b", "10b"], 5);

  return threat;
}

function estimateCardThreatForPlayer(card, captured, roundMonth) {
  const stats = buildCapturedStats(captured, roundMonth);
  let threat = typeValue(card.type) * 0.55;

  if (card.type === "light") threat += 2.1 + stats.lights * 0.35;
  if (card.type === "seed") {
    if (stats.seeds >= 4) threat += 2.2;
    else threat += stats.seeds * 0.3;
  }
  if (card.type === "scroll") {
    if (stats.scrolls >= 4) threat += 1.5;
    else threat += stats.scrolls * 0.18;
  }
  if (card.type === "basic" && stats.basics >= 9) {
    threat += 1.15;
  }

  if (card.month === roundMonth) {
    if (stats.roundMonthCount === 3) threat += 3.1;
    else if (stats.roundMonthCount === 2) threat += 1.4;
  }

  const ifHas = (id) => stats.ids.has(id);
  if ((card.id === "3a" && ifHas("9a")) || (card.id === "9a" && ifHas("3a"))) threat += 2.25;
  if ((card.id === "8a" && ifHas("9a")) || (card.id === "9a" && ifHas("8a"))) threat += 2.0;

  if (["6a", "7a", "10a"].includes(card.id)) {
    let present = 0;
    if (ifHas("6a")) present += 1;
    if (ifHas("7a")) present += 1;
    if (ifHas("10a")) present += 1;
    if (present >= 2) threat += 2.1;
    else if (present === 1) threat += 0.9;
  }

  if (["1b", "2b", "3b"].includes(card.id)) {
    let red = 0;
    if (ifHas("1b")) red += 1;
    if (ifHas("2b")) red += 1;
    if (ifHas("3b")) red += 1;
    if (red >= 2) threat += 1.9;
    else if (red === 1) threat += 0.55;
  }

  if (["6b", "9b", "10b"].includes(card.id)) {
    let blue = 0;
    if (ifHas("6b")) blue += 1;
    if (ifHas("9b")) blue += 1;
    if (ifHas("10b")) blue += 1;
    if (blue >= 2) threat += 1.9;
    else if (blue === 1) threat += 0.55;
  }

  return threat;
}

function estimatePlayerThreatIndex(playerIndex, game = state) {
  const player = game.players[playerIndex];
  const capturedThreat = estimateYakuThreatScore(player.captured, game.gameNumber);
  const fieldThreat = game.field.reduce(
    (sum, card) => sum + estimateCardThreatForPlayer(card, player.captured, game.gameNumber),
    0
  );
  return capturedThreat + fieldThreat * 0.22 + player.hand.length * 0.08;
}

function estimateHandOpportunity(playerIndex, game = state) {
  const player = game.players[playerIndex];
  let opportunity = 0;
  for (const card of player.hand) {
    const matches = getFieldMatches(card.month, game);
    if (!matches.length) continue;
    opportunity += typeValue(card.type) * 0.35 + 0.4;
    if (matches.some((entry) => entry.type === "light")) {
      opportunity += 0.75;
    }
  }
  return opportunity;
}

function chooseAIDecision(decision, game = state) {
  if (!decision.canPass) return "koi";
  const profile = getAIProfile();
  const weights = profile.decision;
  const playerIndex = decision.playerIndex;
  const opponentIndex = playerIndex === 0 ? 1 : 0;
  const player = game.players[playerIndex];
  const opponent = game.players[opponentIndex];
  const lead = player.score - opponent.score;
  const passScore = decision.points * decision.passMultiplier;

  if (passScore >= weights.autoPassAtPoints) {
    return "pass";
  }

  const cardsRemaining = estimateCardsRemaining(game);
  const progress = 1 - Math.min(cardsRemaining, 24) / 24;
  const ownThreat = estimatePlayerThreatIndex(playerIndex, game) + estimateHandOpportunity(playerIndex, game);
  const oppThreat = estimatePlayerThreatIndex(opponentIndex, game) + estimateHandOpportunity(opponentIndex, game);

  const passUtility =
    passScore +
    weights.passBase +
    Math.max(0, lead) * weights.leadLockWeight +
    (decision.passMultiplier >= 3 ? weights.highMultPassBonus : 0) +
    progress * weights.latePassWeight -
    Math.max(0, -lead) * weights.behindPassPenalty;

  let koiRisk = oppThreat * (weights.riskWeight + 0.08 * (decision.koiMultiplier - 1));
  if (decision.koiMultiplier >= 4 && oppThreat > ownThreat * weights.maxMultRiskGuard) {
    koiRisk += 2.3;
  }

  const koiUtility =
    weights.koiBase +
    decision.koiMultiplier * weights.multiplierHunger +
    ownThreat * weights.futureGainWeight +
    (decision.resumeDrawPhase ? weights.handPhaseKoiBonus : 0) +
    Math.max(0, -lead) * weights.comebackWeight -
    Math.max(0, lead) * weights.leadRiskAversion * (decision.koiMultiplier - 1) -
    koiRisk;

  const diff = koiUtility - passUtility;
  if (Math.abs(diff) <= weights.coinFlipBand) {
    return Math.random() < weights.randomKoiChance ? "koi" : "pass";
  }
  return diff > weights.koiMargin ? "koi" : "pass";
}

function applyKoiAndContinue(decision) {
  state.awaitingDecision = null;
  recordTurnRecapDecision("koi", state.tableMultiplier, decision.koiMultiplier);
  state.lastKoiCaller = decision.playerIndex;
  state.tableMultiplier = decision.koiMultiplier;

  const owner = state.players[decision.playerIndex].name;
  if (decision.specialTwoXActive) {
    state.message = `${owner} called Koi-Koi. Special jump to ${state.tableMultiplier}x.`;
  } else {
    state.message = `${owner} called Koi-Koi. Table is now ${state.tableMultiplier}x.`;
  }
  logPlayerMove(decision.playerIndex, decision.moveNumber, state.message);

  if (decision.resumeDrawPhase) {
    processDrawStep(decision.playerIndex, decision.moveNumber);
    return;
  }

  if (state.players[0].hand.length === 0 && state.players[1].hand.length === 0) {
    resolveDeckExhaustion();
    return;
  }

  moveToNextPlayer();
}

function moveToNextPlayer() {
  const previousPlayerIndex = state.currentPlayer;
  const previousTurnNumber = state.moveCounts[previousPlayerIndex];
  commitTurnRecapForHandoff(previousPlayerIndex, previousTurnNumber);
  state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
  state.message = `${state.players[state.currentPlayer].name} to play. Table ${state.tableMultiplier}x.`;
  addSystemLog(state.message);
  if (isFriendMode()) {
    dispatchFriendTurnHandoff(previousPlayerIndex, previousTurnNumber, state.currentPlayer);
  } else {
    state.viewerPlayerIndex = 0;
  }
  renderAll();
  if (!state.players[state.currentPlayer].isHuman) {
    queueAITurn(420);
  }
}

function resolveDeckExhaustion() {
  if (state.lastKoiCaller !== null) {
    const scorer = state.lastKoiCaller;
    const points = state.players[scorer].yaku.points;
    endRoundWithWinner(
      scorer,
      points,
      state.tableMultiplier,
      "last Koi-Koi caller at deck end"
    );
    return;
  }

  endRoundDraw();
}

function describeMonthNameOnly(monthNumber) {
  const found = MONTHS.find((month) => month.id === monthNumber);
  return found ? found.name : `Game ${monthNumber}`;
}

function openRoundTransition({ winnerIndex = null, pointsAwarded = 0, noScore = false }) {
  const nextGameNumber = state.gameNumber + 1;
  state.roundTransition = {
    open: true,
    winnerIndex: winnerIndex === 0 || winnerIndex === 1 ? winnerIndex : null,
    pointsAwarded: Math.max(0, Number(pointsAwarded) || 0),
    noScore: Boolean(noScore),
    nextGameNumber: nextGameNumber > state.maxGames ? null : nextGameNumber,
    acks: {
      p0: false,
      p1: false,
      local: false,
    },
  };
}

function isRoundTransitionReadyForAdvance() {
  if (!state.roundTransition?.open) return true;
  if (isFriendMode()) {
    return Boolean(state.roundTransition.acks?.p0 && state.roundTransition.acks?.p1);
  }
  return Boolean(state.roundTransition.acks?.local);
}

function markRoundTransitionReady(playerIndex = null) {
  if (!state.roundTransition?.open || state.matchOver || !state.roundOver) return;
  if (!isFriendMode()) {
    state.roundTransition.acks.local = true;
    onNextGame();
    return;
  }
  const onlineLocalPlayerIndex = getOnlineLocalPlayerIndex();
  let normalized = playerIndex === 0 || playerIndex === 1 ? playerIndex : null;
  if (onlineLocalPlayerIndex !== null) {
    normalized = onlineLocalPlayerIndex;
  }
  if (normalized === null) return;
  if (onlineLocalPlayerIndex !== null && playerIndex !== null && playerIndex !== onlineLocalPlayerIndex) return;
  if (onlineLocalPlayerIndex !== null) {
    const sent = sendRtcSignal({
      type: "round-ready",
      playerIndex: normalized,
      gameNumber: state.gameNumber,
      nextGameNumber: state.roundTransition.nextGameNumber,
    });
    if (!sent) {
      setFriendInterstitialStatus("Could not sync Ready signal. Use Copy Turn Link / Load Turn Link fallback.", true);
      renderAll();
      return;
    }
  }
  if (normalized === 0) state.roundTransition.acks.p0 = true;
  if (normalized === 1) state.roundTransition.acks.p1 = true;
  if (isRoundTransitionReadyForAdvance()) {
    onNextGame();
    return;
  }
  const readyName = state.players[normalized]?.name || `P${normalized + 1}`;
  const waitingFor = [];
  if (!state.roundTransition.acks.p0) waitingFor.push(state.players[0]?.name || "P1");
  if (!state.roundTransition.acks.p1) waitingFor.push(state.players[1]?.name || "P2");
  state.message = `${readyName} is ready. Waiting for ${waitingFor.join(" + ")}.`;
  addSystemLog(state.message);
  renderAll();
}

function endRoundDraw() {
  clearRoundRuntimeTimers({
    resetTurnReplayVisual: false,
    resetDrawPreviewFxState: true,
  });
  state.roundOver = true;
  state.pendingSelection = null;
  state.awaitingDeckFlip = null;
  state.awaitingDecision = null;
  state.lastKoiCaller = null;
  state.firstYakuPlayer = null;
  state.roundSpecialTwoXPlayer = null;
  state.nextRoundSpecialTwoXPlayer = null;
  state.previousRoundWinner = null;
  state.previousRoundMultiplier = null;
  state.activeTurnRecap = null;
  state.roundHistory.push({
    month: state.gameNumber,
    p0: 0,
    p1: 0,
    multiplier: state.tableMultiplier,
    noScore: true,
  });

  // Keep starter from the most recent scored-round outcome.
  // A no-scorer round does not flip who starts the next round.
  state.currentPlayer = state.dealer;
  state.message = "No scorer this round.";
  addSystemLog(state.message);

  if (state.gameNumber >= state.maxGames) {
    state.matchOver = true;
    state.roundTransition = createClosedRoundTransition();
    applyFinalMessage();
    addSystemLog(state.message);
  } else {
    openRoundTransition({
      winnerIndex: null,
      pointsAwarded: 0,
      noScore: true,
    });
    if (!syncOnlineRoundTransitionSnapshot() && isOnlineFriendSessionActive()) {
      addSystemLog("Round-end sync failed online. Share a turn link manually.");
    }
    const nextMonth = describeMonthNameOnly(state.roundTransition.nextGameNumber);
    state.message = `Game End: No scorer. Next Game: ${nextMonth}.`;
    addSystemLog(state.message);
  }

  renderAll();
}

function endRoundWithWinner(winnerIndex, basePoints, multiplierUsed, reason) {
  clearRoundRuntimeTimers({
    resetTurnReplayVisual: false,
    resetDrawPreviewFxState: true,
  });
  state.roundOver = true;
  state.pendingSelection = null;
  state.awaitingDeckFlip = null;
  state.awaitingDecision = null;
  state.lastKoiCaller = null;
  state.firstYakuPlayer = null;
  state.activeTurnRecap = null;

  const winner = state.players[winnerIndex];
  const loserIndex = winnerIndex === 0 ? 1 : 0;
  const scored = basePoints * multiplierUsed;
  winner.score += scored;
  state.roundHistory.push({
    month: state.gameNumber,
    p0: winnerIndex === 0 ? scored : 0,
    p1: winnerIndex === 1 ? scored : 0,
    multiplier: multiplierUsed,
    noScore: false,
  });

  state.previousRoundWinner = winnerIndex;
  state.previousRoundMultiplier = multiplierUsed;

  state.nextRoundSpecialTwoXPlayer = multiplierUsed === 1 ? loserIndex : null;
  if (multiplierUsed >= 3) {
    state.dealer = winnerIndex;
  } else {
    state.dealer = loserIndex;
  }
  state.currentPlayer = state.dealer;
  state.roundSpecialTwoXPlayer = null;

  const reasonText = reason ? ` (${reason})` : "";
  state.message = `${winner.name} scores ${basePoints} x ${multiplierUsed} = ${scored}${reasonText}.`;
  addSystemLog(state.message);

  if (state.gameNumber >= state.maxGames) {
    state.matchOver = true;
    state.roundTransition = createClosedRoundTransition();
    applyFinalMessage();
    addSystemLog(state.message);
  } else {
    openRoundTransition({
      winnerIndex,
      pointsAwarded: scored,
      noScore: false,
    });
    if (!syncOnlineRoundTransitionSnapshot() && isOnlineFriendSessionActive()) {
      addSystemLog("Round-end sync failed online. Share a turn link manually.");
    }
    const nextMonth = describeMonthNameOnly(state.roundTransition.nextGameNumber);
    state.message = `Game End: ${winner.name} wins ${scored}. Next Game: ${nextMonth}.`;
    addSystemLog(state.message);
  }

  renderAll();
}

function applyFinalMessage() {
  const p0 = state.players[0].score;
  const p1 = state.players[1].score;
  const p0Name = state.players[0].name;
  const p1Name = state.players[1].name;
  if (p0 > p1) {
    state.message = `Match complete. ${p0Name} wins (${p0} - ${p1}).`;
  } else if (p1 > p0) {
    state.message = `Match complete. ${p1Name} wins (${p1} - ${p0}).`;
  } else {
    state.message = `Match complete. Draw (${p0} - ${p1}).`;
  }
}

function onNextGame() {
  if (state.matchOver || !state.roundOver) return;
  if (!isRoundTransitionReadyForAdvance()) return;
  state.roundTransition = createClosedRoundTransition();
  state.gameNumber += 1;
  startRound();
}

function queueAITurn(delayMs) {
  const cpuPlayerIndex = getCpuPlayerIndex();
  if (cpuPlayerIndex < 0) return;
  clearAITask();
  scheduleAIStep(delayMs, () => {
    if (state.roundOver || state.currentPlayer !== cpuPlayerIndex || state.awaitingDecision) return;
    performAITurn(cpuPlayerIndex);
  });
}

function performAITurn(playerIndex = getCpuPlayerIndex()) {
  if (playerIndex < 0) return;
  const choice = chooseAICard(playerIndex);
  if (!choice || !choice.card) return;
  state.message = `${state.players[playerIndex].name} is choosing a card.`;
  addSystemLog(state.message);
  renderAll();

  scheduleAIStep(AI_STEP_THINK_MS, () => {
    if (state.roundOver || state.currentPlayer !== playerIndex || state.awaitingDecision) return;

    state.cpuPhase1PreviewCardId = choice.card.id;
    addSystemLog(`${state.players[playerIndex].name} selected ${choice.card.name}.`);
    renderAll();

    scheduleAIStep(AI_STEP_CPU_PHASE1_PREVIEW_MS, () => {
      if (state.roundOver || state.currentPlayer !== playerIndex || state.awaitingDecision) return;

      const matches = getFieldMatches(choice.card.month);
      if (matches.length > 0) {
        const targetOptions =
          matches.length === 3
            ? matches.map((entry) => entry.id)
            : matches.length === 2 && choice.targetFieldId
              ? [choice.targetFieldId]
              : [matches[0].id];
        const aiPrompt =
          matches.length === 3
            ? `CPU lines up a ${describeMonth(choice.card.month)} sweep.`
            : matches.length === 2 && choice.targetFieldId
              ? `CPU targets ${CARD_BY_ID.get(choice.targetFieldId)?.name || "a field card"}.`
              : `CPU targets ${matches[0].name}.`;
        state.aiPreview = {
          options: targetOptions,
          prompt: aiPrompt,
        };
        addSystemLog(aiPrompt);
        renderAll();
        scheduleAIStep(AI_STEP_TARGET_MS, () => {
          if (state.roundOver || state.currentPlayer !== playerIndex || state.awaitingDecision) return;
          state.aiPreview = null;
          executePlayFromHand(playerIndex, choice.card.id, choice.targetFieldId || null);
        });
        return;
      }

      executePlayFromHand(playerIndex, choice.card.id, null);
    });
  });
}

function scheduleAIStep(delayMs, task) {
  if (state.aiTimer) {
    clearTimeout(state.aiTimer);
  }
  state.aiTask = task;
  state.aiTimer = setTimeout(() => {
    const next = state.aiTask;
    state.aiTask = null;
    state.aiTimer = null;
    if (next) next();
  }, delayMs);
}

function clearRoundRuntimeTimers(options = {}) {
  const { resetTurnReplayVisual = false, resetDrawPreviewFxState = false } = options;
  clearAITask();
  clearDrawRevealTask();
  stopTurnReplay(resetTurnReplayVisual);
  if (resetDrawPreviewFxState) {
    resetDrawPreviewFx();
  }
}

function clearAITask() {
  if (state.aiTimer) {
    clearTimeout(state.aiTimer);
  }
  state.aiTimer = null;
  state.aiTask = null;
  state.aiPreview = null;
  state.cpuPhase1PreviewCardId = null;
}

function clearDrawRevealTask() {
  if (state.drawRevealTimer) {
    clearTimeout(state.drawRevealTimer);
  }
  state.drawRevealTimer = null;
}

function chooseAICard(playerIndex, game = state) {
  const profile = getAIProfile();
  const player = game.players[playerIndex];
  if (!player.hand.length) return null;

  let best = null;
  for (const card of player.hand) {
    const matches = getFieldMatches(card.month, game);
    if (!matches.length) {
      const score = evaluateAIMoveOption(playerIndex, card, null, profile, null, game);
      if (!best || score > best.score) {
        best = { card, targetFieldId: null, score };
      }
      continue;
    }

    if (matches.length === 3) {
      const score = evaluateAIMoveOption(playerIndex, card, null, profile, matches, game);
      if (!best || score > best.score) {
        best = { card, targetFieldId: null, score };
      }
      continue;
    }

    for (const fieldCard of matches) {
      const score = evaluateAIMoveOption(playerIndex, card, fieldCard, profile, null, game);
      if (!best || score > best.score) {
        best = { card, targetFieldId: fieldCard.id, score };
      }
    }
  }
  return best;
}

function evaluateAIMoveOption(playerIndex, card, fieldCard, profile, fieldCardsOverride = null, game = state) {
  const player = game.players[playerIndex];
  const opponentIndex = playerIndex === 0 ? 1 : 0;
  const opponent = game.players[opponentIndex];
  const weights = profile.card;
  const roundMonth = game.gameNumber;
  const fieldCards = fieldCardsOverride || (fieldCard ? [fieldCard] : null);

  const beforeYakuPoints = computeYaku(player.captured, roundMonth).points;
  const beforePotential = estimateYakuThreatScore(player.captured, roundMonth);

  const capturedAfter = fieldCards ? [...player.captured, card, ...fieldCards] : [...player.captured];
  const afterYakuPoints = computeYaku(capturedAfter, roundMonth).points;
  const afterPotential = estimateYakuThreatScore(capturedAfter, roundMonth);

  const capturedFieldValue = fieldCards
    ? fieldCards.reduce((sum, entry) => sum + typeValue(entry.type), 0)
    : 0;
  const immediate = fieldCards
    ? typeValue(card.type) +
      capturedFieldValue * 1.1 +
      (fieldCards.length >= 3 ? 2.2 : 0)
    : -weights.expose * (0.45 + typeValue(card.type) * 0.32);
  const yakuGain = Math.max(0, afterYakuPoints - beforeYakuPoints);
  const comboGain = afterPotential - beforePotential;

  const denial = fieldCards
    ? fieldCards.reduce(
        (sum, entry) => sum + estimateCardThreatForPlayer(entry, opponent.captured, roundMonth),
        0
      )
    : -estimateCardThreatForPlayer(card, opponent.captured, roundMonth) * 0.7;
  const monthBonus = card.month === roundMonth ? 1 : 0;
  const lightBonus = card.type === "light" ? weights.lightBonus : 0;
  const pressure = estimatePlayerThreatIndex(opponentIndex, game) - estimatePlayerThreatIndex(playerIndex, game);

  const jitter = (Math.random() - 0.5) * weights.jitter;
  return (
    immediate * weights.immediate +
    yakuGain * weights.yakuGain +
    comboGain * weights.comboGain +
    denial * weights.denial +
    monthBonus * weights.month +
    lightBonus +
    Math.max(0, pressure) * 0.08 +
    jitter
  );
}

function chooseBestMatchForAI(playerIndex, sourceCard, matches, game = state) {
  const profile = getAIProfile();
  let best = null;
  for (const fieldCard of matches) {
    const score = evaluateAIMoveOption(playerIndex, sourceCard, fieldCard, profile, null, game);
    if (!best || score > best.score) {
      best = { fieldCard, score };
    }
  }
  return best ? best.fieldCard : matches[0];
}

function typeValue(type) {
  if (type === "light") return 5;
  if (type === "seed") return 4;
  if (type === "scroll") return 3;
  return 1;
}

function capturedDisplayGroupRank(card) {
  if (card.type === "light") return 0;
  if (card.type === "seed") return 1;
  if (card.type === "scroll") {
    if (card.scrollKind === "redText") return 2;
    if (card.scrollKind === "blue") return 3;
    if (card.scrollKind === "red") return 4;
    return 5;
  }
  return 6;
}

function compareCapturedDisplayOrder(a, b) {
  const groupDiff = capturedDisplayGroupRank(a) - capturedDisplayGroupRank(b);
  if (groupDiff !== 0) return groupDiff;
  const monthDiff = a.month - b.month;
  if (monthDiff !== 0) return monthDiff;
  return a.id.localeCompare(b.id);
}

function getSortedCapturedForDisplay(cards) {
  return cards.slice().sort(compareCapturedDisplayOrder);
}

function getFieldMatches(month, game = state) {
  return game.field.filter((card) => card.month === month);
}

function computeYaku(captured, roundMonth) {
  const stats = buildCapturedStats(captured, roundMonth);
  let points = 0;
  const names = [];
  const triggerKeys = [];

  for (const rule of FIXED_YAKU_RULES) {
    if (!rule.applies(stats)) continue;
    points += rule.points;
    names.push(rule.label);
    triggerKeys.push(rule.id);
  }

  for (const rule of INCREMENTAL_YAKU_RULES) {
    const count = stats[rule.countKey];
    if (count < rule.threshold) continue;
    const incrementalPoints = rule.base + (count - rule.threshold);
    points += incrementalPoints;
    names.push(`${rule.label} ${incrementalPoints}`);
    triggerKeys.push(rule.id);
  }

  if (stats.roundMonthCount === 4) {
    points += 5;
    names.push("Round Month Sweep");
    triggerKeys.push("roundMonthSweep");
  }

  return { points, names, triggerKeys };
}

function renderAll() {
  state.turnCheckpointReady = computeTurnCheckpointReady();
  renderRtcStatusBadge();
  if (!Array.isArray(state.players) || state.players.length < 2 || !state.players[0] || !state.players[1]) {
    state.autoFocusTargetKey = null;
    return;
  }
  renderTop();
  renderRoundSummary();
  renderActionLog();
  renderChoiceMode();
  renderHands();
  renderField();
  renderDrawPreview();
  renderCaptured();
  renderContextBar();
  renderFriendInterstitial();
  renderCodePanel();
  paintAllCards();
  if (ui.codePanel && !ui.codePanel.hidden && state.players.length) {
    if (isFriendCodeMode() && !isFriendTurnExportWindow()) {
      ui.exportCode.value = "";
    } else {
      try {
        ui.exportCode.value = encodeStateToCode();
      } catch (_err) {
        // Leave last value if encoding fails during an in-flight transient state.
      }
    }
  }
  focusActiveActionTarget();
}

function renderCodePanel() {
  if (!ui.codePanel) return;
  const friendCodeMode = isFriendCodeMode();
  const handoffOpen = isFriendTurnExportWindow();

  if (ui.codePanelHead) {
    ui.codePanelHead.textContent = friendCodeMode ? "Turn Link" : "Save / Load";
  }
  if (ui.exportCodeLabel) {
    ui.exportCodeLabel.textContent = friendCodeMode ? "Current raw turn code" : "Current raw save code";
  }
  if (ui.importCodeLabel) {
    ui.importCodeLabel.textContent = friendCodeMode ? "Load from turn link or code" : "Load from link or code";
  }
  if (ui.copyLinkBtn) {
    ui.copyLinkBtn.textContent = friendCodeMode ? "Copy Turn Link" : "Copy Save Link";
    ui.copyLinkBtn.disabled = friendCodeMode && !handoffOpen;
  }
  if (ui.refreshCodeBtn) {
    ui.refreshCodeBtn.textContent = friendCodeMode ? "Refresh Raw Turn Code" : "Refresh Raw Save Code";
    ui.refreshCodeBtn.disabled = friendCodeMode && !handoffOpen;
  }
  if (ui.copyCodeBtn) {
    ui.copyCodeBtn.textContent = friendCodeMode ? "Copy Raw Turn Code" : "Copy Raw Save Code";
    ui.copyCodeBtn.disabled = friendCodeMode && !handoffOpen;
  }
  if (ui.importCode) {
    ui.importCode.placeholder = friendCodeMode ? "Paste turn link or code from other player" : "Paste a save link or code here";
  }
  if (ui.exportCode) {
    ui.exportCode.placeholder =
      friendCodeMode && !handoffOpen
        ? "Raw turn code appears after a full turn handoff."
        : "";
  }
}

function computeTurnCheckpointReady() {
  if (state.matchOver || state.roundOver) return false;
  if (state.pendingSelection || state.awaitingDeckFlip || state.awaitingDecision) return false;
  if (state.aiPreview || state.cpuPhase1PreviewCardId) return false;
  if (state.turnReplay.active) return false;
  if (isFriendMode()) return Boolean(state.interstitial?.open);
  return true;
}

function renderFriendInterstitial() {
  if (!ui.friendInterstitial) return;
  const waitingOnline = isFriendMode() && state.rtcWaiting;
  const recoveryOnline =
    isOnlineFriendSessionActive() && (state.rtcStatus === "disconnected" || state.rtcStatus === "error");
  const open = isFriendMode() && (Boolean(state.interstitial?.open) || waitingOnline || recoveryOnline);
  ui.friendInterstitial.hidden = !open;
  if (!open) return;

  const nextPlayerIndex =
    state.interstitial.nextPlayerIndex === null || state.interstitial.nextPlayerIndex === undefined
      ? state.currentPlayer
      : state.interstitial.nextPlayerIndex;
  const nextName = state.players[nextPlayerIndex]?.name || `Player ${nextPlayerIndex + 1}`;
  const previousPlayerIndex = nextPlayerIndex === 0 ? 1 : 0;
  const previousName = state.players[previousPlayerIndex]?.name || `Player ${previousPlayerIndex + 1}`;

  if (ui.friendInterstitialTitle) {
    ui.friendInterstitialTitle.textContent = `Pass to ${nextName}`;
  }
  if (ui.friendInterstitialText) {
    const moveText = state.lastExportMeta
      ? ` (${previousName} move ${state.lastExportMeta.turnNumber})`
      : "";
    ui.friendInterstitialText.textContent = `${previousName}'s turn is complete${moveText}. Pass the phone, or copy a turn link and continue asynchronously.`;
  }
  if (ui.friendContinueBtn) {
    ui.friendContinueBtn.hidden = false;
    ui.friendContinueBtn.disabled = false;
    ui.friendContinueBtn.textContent = `${nextName} Ready`;
  }
  if (ui.friendImportCode) {
    ui.friendImportCode.placeholder = "Paste turn link or code from other player";
  }
  if (ui.friendCopyCodeBtn) {
    ui.friendCopyCodeBtn.hidden = false;
    ui.friendCopyCodeBtn.disabled = !isFriendTurnExportWindow();
  }
  if (ui.friendBackMenuBtn) {
    ui.friendBackMenuBtn.hidden = true;
    ui.friendBackMenuBtn.disabled = true;
  }
  if (ui.friendLoadCodeBtn) {
    ui.friendLoadCodeBtn.hidden = false;
    ui.friendLoadCodeBtn.disabled = false;
    ui.friendLoadCodeBtn.textContent = "Load Turn Link";
  }
  if (ui.friendManualLoadWrap) {
    ui.friendManualLoadWrap.hidden = !state.manualLoadFallback.friend;
  }
  if (recoveryOnline) {
    const canCopyCheckpoint = isFriendTurnExportWindow();
    if (ui.friendInterstitialTitle) {
      ui.friendInterstitialTitle.textContent = "Connection Lost";
    }
    if (ui.friendInterstitialText) {
      ui.friendInterstitialText.textContent =
        "Online link dropped. Copy your checkpoint turn link or load your friend's turn link to continue.";
    }
    if (ui.friendContinueBtn) {
      ui.friendContinueBtn.hidden = true;
      ui.friendContinueBtn.disabled = true;
    }
    if (ui.friendLoadCodeBtn) {
      ui.friendLoadCodeBtn.hidden = false;
      ui.friendLoadCodeBtn.disabled = false;
      ui.friendLoadCodeBtn.textContent = "Load Their Code";
    }
    if (ui.friendCopyCodeBtn) {
      ui.friendCopyCodeBtn.hidden = false;
      ui.friendCopyCodeBtn.disabled = !canCopyCheckpoint;
      ui.friendCopyCodeBtn.textContent = "Copy My Turn Code";
    }
    if (ui.friendBackMenuBtn) {
      ui.friendBackMenuBtn.hidden = false;
      ui.friendBackMenuBtn.disabled = false;
      ui.friendBackMenuBtn.textContent = "Back to Menu";
    }
    return;
  }
  if (waitingOnline) {
    const rtcStatusText =
      state.rtcStatus === "connected"
        ? "Connected"
        : state.rtcStatus === "connecting"
          ? "Connecting"
          : state.rtcStatus === "disconnected"
            ? "Disconnected"
            : state.rtcStatus === "error"
              ? "Connection error"
              : "Not connected";
    if (ui.friendInterstitialTitle) {
      ui.friendInterstitialTitle.textContent = "Online Turn Handoff";
    }
    if (ui.friendInterstitialText) {
      const roomText = state.rtcRoomCode ? ` Room ${state.rtcRoomCode}.` : "";
      ui.friendInterstitialText.textContent = `${rtcStatusText}.${roomText} Waiting for opponent turn data.`;
    }
    if (ui.friendContinueBtn) {
      ui.friendContinueBtn.hidden = true;
      ui.friendContinueBtn.disabled = true;
    }
    if (ui.friendLoadCodeBtn) {
      ui.friendLoadCodeBtn.hidden = false;
      ui.friendLoadCodeBtn.disabled = false;
      ui.friendLoadCodeBtn.textContent = "Load Turn Link";
    }
    if (ui.friendCopyCodeBtn) {
      const canCopy = state.rtcRole === "host" && isFriendTurnExportWindow();
      ui.friendCopyCodeBtn.hidden = !canCopy;
      ui.friendCopyCodeBtn.disabled = !canCopy;
      ui.friendCopyCodeBtn.textContent = "Copy Turn Link";
    }
    if (ui.friendBackMenuBtn) {
      ui.friendBackMenuBtn.hidden = false;
      ui.friendBackMenuBtn.disabled = false;
      ui.friendBackMenuBtn.textContent = "Back to Menu";
    }
    return;
  }
  if (!isFriendTurnExportWindow()) {
    if (ui.friendCopyCodeBtn) {
      ui.friendCopyCodeBtn.disabled = true;
    }
    if (ui.friendInterstitialText) {
      ui.friendInterstitialText.textContent = "Waiting for a completed turn handoff.";
    }
  }
}

function getActiveActionFocusKey() {
  if (state.turnReplay.active) return "draw-preview";
  const interactivePlayerIndex = getInteractiveHumanPlayerIndex();
  const pending =
    state.pendingSelection && interactivePlayerIndex !== null && state.pendingSelection.playerIndex === interactivePlayerIndex
      ? state.pendingSelection
      : null;
  if (pending) return "field-zone";

  const awaitingFlip =
    state.awaitingDeckFlip &&
    interactivePlayerIndex !== null &&
    state.awaitingDeckFlip.playerIndex === interactivePlayerIndex
      ? state.awaitingDeckFlip
      : null;
  if (awaitingFlip) return "draw-preview";

  if (
    state.awaitingDecision &&
    state.awaitingDecision.kind === "stopOrKoi" &&
    interactivePlayerIndex !== null &&
    state.awaitingDecision.playerIndex === interactivePlayerIndex
  ) {
    return "context-zone";
  }

  if (state.roundOver || state.matchOver) {
    return "context-zone";
  }

  const canPickHandCard =
    interactivePlayerIndex !== null &&
    !state.roundOver &&
    !state.awaitingDecision &&
    !state.pendingSelection &&
    !state.awaitingDeckFlip &&
    state.players[interactivePlayerIndex].hand.length > 0;
  if (canPickHandCard) return "player-zone";

  const cpuPlaying =
    !state.players[state.currentPlayer].isHuman &&
    !state.roundOver &&
    !state.awaitingDecision;
  if (cpuPlaying) {
    if (state.awaitingDeckFlip) return "draw-preview";
    return "field-zone";
  }

  return null;
}

function focusActiveActionTarget() {
  const key = getActiveActionFocusKey();
  if (!key) {
    state.autoFocusTargetKey = null;
    return;
  }
  if (state.autoFocusTargetKey === key) return;
  state.autoFocusTargetKey = key;

  requestAnimationFrame(() => {
    let target = null;
    if (key === "field-zone") target = ui.fieldZone;
    if (key === "draw-preview") target = ui.drawPreview;
    if (key === "context-zone") target = ui.contextZone;
    if (key === "player-zone") target = ui.playerZone;
    if (!target) return;
    scrollTargetIntoViewSmart(target);
    if (typeof target.focus === "function") {
      target.focus({ preventScroll: true });
    }
  });
}

function scrollTargetIntoViewSmart(target) {
  if (!target || typeof target.getBoundingClientRect !== "function") return;
  const rect = target.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
  if (!viewportHeight) return;

  // Keep actionable targets visible with minimal movement, biased toward the bottom edge.
  const topBuffer = 10;
  const bottomBuffer = 14;
  const maxBottom = viewportHeight - bottomBuffer;
  const minTop = topBuffer;

  let deltaY = 0;
  if (rect.bottom > maxBottom) {
    deltaY = rect.bottom - maxBottom;
  } else if (rect.top < minTop) {
    deltaY = rect.top - minTop;
  } else {
    return;
  }

  window.scrollBy({
    top: deltaY,
    behavior: "smooth",
  });
}

function setHeaderLabelWithScore(labelEl, scoreEl, labelText, scoreValue) {
  if (!labelEl || !scoreEl) return;
  const labelPrefix = `${labelText} `;
  if (scoreEl.parentElement !== labelEl) {
    labelEl.textContent = "";
    labelEl.append(document.createTextNode(labelPrefix), scoreEl);
  } else if (labelEl.firstChild && labelEl.firstChild.nodeType === Node.TEXT_NODE) {
    labelEl.firstChild.nodeValue = labelPrefix;
  } else {
    labelEl.insertBefore(document.createTextNode(labelPrefix), scoreEl);
  }
  scoreEl.textContent = String(scoreValue);
}

function renderTop() {
  const topPlayerIndex = getDisplayTopPlayerIndex();
  const bottomPlayerIndex = getDisplayBottomPlayerIndex();
  const topName = state.players[topPlayerIndex]?.name || "Player";
  const bottomName = state.players[bottomPlayerIndex]?.name || "Player";
  const topHandText = isFriendMode() ? `${topName} Hand` : "CPU Hand";
  const bottomHandText = isFriendMode() ? `${bottomName} Hand` : "Your Hand";
  const topCapturesText = isFriendMode() ? `${topName} Captures` : "CPU Captures";
  const bottomCapturesText = isFriendMode() ? `${bottomName} Captures` : "Your Captures";
  setHeaderLabelWithScore(
    ui.cpuHandLabel,
    ui.cpuScoreInline,
    topHandText,
    state.players[topPlayerIndex].score
  );
  setHeaderLabelWithScore(
    ui.playerHandLabel,
    ui.playerScoreInline,
    bottomHandText,
    state.players[bottomPlayerIndex].score
  );
  if (ui.cpuCapturesLabel) ui.cpuCapturesLabel.textContent = topCapturesText;
  if (ui.playerCapturesLabel) ui.playerCapturesLabel.textContent = bottomCapturesText;
  if (ui.summaryColYou) ui.summaryColYou.textContent = getSummaryColumnLabel(0);
  if (ui.summaryColCpu) ui.summaryColCpu.textContent = getSummaryColumnLabel(1);
  if (ui.gameSummaryToggle) ui.gameSummaryToggle.textContent = `Game ${state.gameNumber} / ${state.maxGames}`;
  if (ui.turnMeta) {
    const turnText = state.roundOver ? "round ended" : state.players[state.currentPlayer].name;
    ui.turnMeta.textContent = `Starts: ${state.players[state.dealer].name} | Turn: ${turnText}`;
  }

  ui.cpuHandCount.textContent = `${state.players[topPlayerIndex].hand.length} cards`;
  ui.deckCount.textContent = `Deck: ${state.drawPile.length}`;

  ui.cpuCapturedCount.textContent = String(state.players[topPlayerIndex].captured.length);
  ui.playerCapturedCount.textContent = String(state.players[bottomPlayerIndex].captured.length);

  ui.cpuYaku.textContent = formatYakuLine(state.players[topPlayerIndex].yaku);
  ui.playerYaku.textContent = formatYakuLine(state.players[bottomPlayerIndex].yaku);

  const callerLabel = state.lastKoiCaller === null ? "none" : state.players[state.lastKoiCaller].name;
  ui.koiState.textContent = `Table ${state.tableMultiplier}x | Last Koi-Koi: ${callerLabel}`;
  const clampedMult = Math.max(1, Math.min(4, state.tableMultiplier));
  ui.koiState.classList.remove("mult-1", "mult-2", "mult-3", "mult-4");
  ui.koiState.classList.add(`mult-${clampedMult}`);
}

function renderRoundSummary() {
  if (!ui.roundSummaryBody) return;
  const playedByMonth = new Map();
  for (const entry of state.roundHistory) {
    if (!entry || typeof entry.month !== "number") continue;
    playedByMonth.set(entry.month, entry);
  }

  const rows = [];
  for (let month = 1; month <= state.maxGames; month += 1) {
    const monthName = MONTHS[month - 1]?.name || `Round ${month}`;
    const entry = playedByMonth.get(month);
    if (!entry) {
      rows.push(
        `<tr><td>${monthName}</td><td class=\"summary-empty\">-</td><td class=\"summary-empty\">-</td><td class=\"summary-empty\">-</td></tr>`
      );
      continue;
    }
    const multLabel = `${entry.multiplier}x`;
    const multClass = entry.noScore ? "summary-noscore" : "";
    const p0 = entry.p0 ?? entry.you ?? 0;
    const p1 = entry.p1 ?? entry.cpu ?? 0;
    rows.push(`<tr><td>${monthName}</td><td>${p0}</td><td>${p1}</td><td class=\"${multClass}\">${multLabel}</td></tr>`);
  }
  ui.roundSummaryBody.innerHTML = rows.join("");
}

function renderActionLog() {
  if (!ui.actionLog) return;
  if (!state.actionLog.length) {
    ui.actionLog.innerHTML = "<li>SYS: Waiting for first action...</li>";
    if (ui.logCount) ui.logCount.textContent = "0";
    return;
  }

  ui.actionLog.innerHTML = state.actionLog
    .map((entry) => `<li>${escapeHtml(entry)}</li>`)
    .join("");
  if (ui.logCount) {
    ui.logCount.textContent = String(state.actionLog.length);
  }
  ui.actionLog.scrollTop = ui.actionLog.scrollHeight;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatYakuLine(yaku) {
  if (!yaku || yaku.points === 0) return "No set";
  return `${yaku.points} pts: ${yaku.names.join(", ")}`;
}

function getCardTypeBadgeText(type) {
  return CARD_TYPE_BADGE_TEXT[type] || "PLN";
}

function renderBadgedCardContent(card) {
  const typeBadge = getCardTypeBadgeText(card.type);
  return `<span class="card-type-badge card-type-${card.type}" aria-hidden="true">${typeBadge}</span><span class="card-month-badge" aria-hidden="true">${card.month}</span><canvas width="138" height="170" data-card-id="${card.id}"></canvas>`;
}

function renderHands() {
  const topPlayerIndex = getDisplayTopPlayerIndex();
  const bottomPlayerIndex = getDisplayBottomPlayerIndex();
  const topHand = state.players[topPlayerIndex].hand;
  const canRevealBottom = canRevealBottomHand();
  const interactivePlayerIndex = getInteractiveHumanPlayerIndex();

  const previewId = !isFriendMode() && topPlayerIndex === 1 ? state.cpuPhase1PreviewCardId : null;
  let displayTopHand = topHand;
  if (previewId) {
    const previewIdx = topHand.findIndex((card) => card.id === previewId);
    if (previewIdx > 0) {
      const previewCard = topHand[previewIdx];
      displayTopHand = [previewCard, ...topHand.slice(0, previewIdx), ...topHand.slice(previewIdx + 1)];
    }
  }
  ui.cpuHand.innerHTML = Array.from({ length: 8 }, (_, i) => {
    if (i < displayTopHand.length) {
      const card = displayTopHand[i];
      const isRevealed = previewId === card.id;
      if (isRevealed) {
        return `<div class="card badged cpu-revealed" data-card-type="${card.type}">${renderBadgedCardContent(card)}</div>`;
      }
      return `<div class="card-back"></div>`;
    }
    return `<div class="card-back empty"></div>`;
  }).join("");

  const pending = state.pendingSelection;
  const pendingForBottom =
    Boolean(pending) &&
    pending.playerIndex === bottomPlayerIndex;
  const inChoiceMode = pendingForBottom;
  const handPreviewPending =
    pendingForBottom &&
    (pending.type === "handMatch" || pending.type === "handPlace");
  const waitingDeckFlip =
    Boolean(state.awaitingDeckFlip) &&
    state.awaitingDeckFlip.playerIndex === bottomPlayerIndex &&
    !state.awaitingDeckFlip.revealed;
  const inputLocked = !canRevealBottom || waitingDeckFlip || (inChoiceMode && !handPreviewPending);
  const selectable =
    canRevealBottom &&
    interactivePlayerIndex !== null &&
    interactivePlayerIndex === bottomPlayerIndex &&
    !state.roundOver &&
    !state.awaitingDecision &&
    !waitingDeckFlip &&
    (!pending || handPreviewPending);
  if (ui.playerZone) {
    ui.playerZone.classList.toggle("turn-ready", selectable);
  }
  ui.playerHand.classList.toggle("locked", inputLocked);

  const bottomHand = state.players[bottomPlayerIndex].hand;
  if (!canRevealBottom) {
    ui.playerHand.innerHTML = Array.from({ length: 8 }, (_, i) => {
      if (i < bottomHand.length) {
        return `<div class="card-back"></div>`;
      }
      return `<div class="card-back empty"></div>`;
    }).join("");
    return;
  }

  ui.playerHand.innerHTML = bottomHand
    .map((card) => {
      const isPending =
        pendingForBottom &&
        (pending.type === "handMatch" || pending.type === "handPlace") &&
        pending.cardId === card.id;
      const classes = ["card", "badged"];
      if (selectable) classes.push("selectable");
      if (isPending) classes.push("pending", "choice-source");
      const disabled = selectable ? "" : " disabled";
      return `<button type="button" class="${classes.join(" ")}" data-card-id="${card.id}" data-card-type="${card.type}"${disabled}>${renderBadgedCardContent(card)}</button>`;
    })
    .join("");
}

function renderField() {
  const interactivePlayerIndex = getInteractiveHumanPlayerIndex();
  const pending =
    state.pendingSelection && interactivePlayerIndex !== null && state.pendingSelection.playerIndex === interactivePlayerIndex
      ? state.pendingSelection
      : null;
  const aiPreview = !pending && state.aiPreview ? state.aiPreview : null;
  const activeOptions = pending ? pending.options : aiPreview ? aiPreview.options : null;
  const inChoiceMode = Boolean(activeOptions && activeOptions.length);
  const humanSelectable = Boolean(pending);
  const previewPlacementCard =
    pending && (pending.type === "handPlace" || pending.type === "drawPlace")
      ? pending.type === "handPlace"
        ? state.players[pending.playerIndex].hand.find((entry) => entry.id === pending.cardId) || CARD_BY_ID.get(pending.cardId) || null
        : pending.drawnCard || null
      : null;
  const fieldEntries = state.field.map((card) => ({ card, isPreviewPlacement: false }));
  if (previewPlacementCard) {
    fieldEntries.push({ card: previewPlacementCard, isPreviewPlacement: true });
  }
  ui.field.innerHTML = fieldEntries
    .map(({ card, isPreviewPlacement }) => {
      const highlighted = !isPreviewPlacement && inChoiceMode && activeOptions.includes(card.id);
      const classes = ["card", "badged"];
      if (isPreviewPlacement) {
        classes.push("preview-landing", "choice-target", "selectable");
      } else if (highlighted) {
        if (humanSelectable) {
          classes.push("selectable");
        }
        classes.push("choice-target");
      } else if (inChoiceMode) {
        classes.push("choice-muted");
      }
      const disabled = isPreviewPlacement ? "" : humanSelectable && highlighted ? "" : " disabled";
      return `<button type="button" class="${classes.join(" ")}" data-card-id="${card.id}" data-card-type="${card.type}"${disabled}>${renderBadgedCardContent(card)}</button>`;
    })
    .join("");
}

function renderDrawPreview() {
  if (!ui.drawPreviewCanvas || !ui.drawPreviewText) return;
  if (ui.drawPreview) {
    ui.drawPreview.classList.toggle("awaiting-flip", Boolean(state.awaitingDeckFlip && !state.awaitingDeckFlip.revealed));
    ui.drawPreview.classList.toggle("recap-active", Boolean(state.turnReplay.active));
  }
  if (ui.drawPreviewLabel) {
    if (state.turnReplay.active && state.lastTurnRecap) {
      ui.drawPreviewLabel.textContent = `Player ${state.lastTurnRecap.actorIndex + 1} Recap`;
    } else {
      ui.drawPreviewLabel.textContent = "Recent Deck Pull";
    }
  }
  ui.drawPreviewText.textContent = state.drawPreview.text;
  const ctx = ui.drawPreviewCanvas.getContext("2d");
  if (!ctx) return;

  if (!state.drawPreview.cardId) {
    resetDrawPreviewFx();
    delete ui.drawPreviewCanvas.dataset.cardId;
    if (state.awaitingDeckFlip && !state.awaitingDeckFlip.revealed) {
      paintPreviewBack(ctx, ui.drawPreviewCanvas.width, ui.drawPreviewCanvas.height);
    } else {
      ctx.clearRect(0, 0, ui.drawPreviewCanvas.width, ui.drawPreviewCanvas.height);
    }
    return;
  }

  const nextCardId = state.drawPreview.cardId;
  if (drawPreviewFx.lastCardId !== nextCardId) {
    drawPreviewFx.lastCardId = nextCardId;
    if (drawPreviewFx.revealTimer) {
      clearTimeout(drawPreviewFx.revealTimer);
      drawPreviewFx.revealTimer = null;
    }
    delete ui.drawPreviewCanvas.dataset.cardId;
    paintPreviewBack(ctx, ui.drawPreviewCanvas.width, ui.drawPreviewCanvas.height);
    drawPreviewFx.revealTimer = setTimeout(() => {
      drawPreviewFx.revealTimer = null;
      if (!ui.drawPreviewCanvas) return;
      if (state.drawPreview.cardId !== nextCardId) return;
      ui.drawPreviewCanvas.dataset.cardId = nextCardId;
      paintPreviewFace(nextCardId, ui.drawPreviewCanvas);
    }, DRAW_PREVIEW_FLIP_MS);
    return;
  }

  if (drawPreviewFx.revealTimer) {
    delete ui.drawPreviewCanvas.dataset.cardId;
    paintPreviewBack(ctx, ui.drawPreviewCanvas.width, ui.drawPreviewCanvas.height);
    return;
  }

  ui.drawPreviewCanvas.dataset.cardId = nextCardId;
}

function resetDrawPreviewFx() {
  if (drawPreviewFx.revealTimer) {
    clearTimeout(drawPreviewFx.revealTimer);
    drawPreviewFx.revealTimer = null;
  }
  drawPreviewFx.lastCardId = null;
}

function paintPreviewBack(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#1e2a37";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#0f171f";
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, width - 6, height - 6);

  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  const step = 10;
  for (let y = 6; y < height - 4; y += step) {
    const oddRow = Math.floor(y / step) % 2 === 1;
    for (let x = oddRow ? 9 : 4; x < width - 4; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, y + 1);
      ctx.lineTo(x + 4, y + 5);
      ctx.lineTo(x - 4, y + 5);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function paintPreviewFace(cardId, canvas) {
  const card = CARD_BY_ID.get(cardId);
  if (!card) return;
  const sheet = state.sprites[card.sprite.sheet];
  const ctx = canvas.getContext("2d");
  if (!sheet || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(
    sheet,
    card.sprite.x,
    card.sprite.y,
    card.sprite.w,
    card.sprite.h,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

function getChoicePromptText(pending) {
  if (!pending) return "";
  if (pending.type === "handMatch") {
    const card = CARD_BY_ID.get(pending.cardId);
    if (!card) {
      return "Tap highlighted field card to capture, or tap selected hand card to cancel.";
    }
    if (pending.options.length === 3) {
      return `Tap highlighted ${describeMonth(card.month)} field card to sweep all four, or tap selected hand card to cancel.`;
    }
    return `Tap highlighted field card to pair with ${card.name}, or tap selected hand card to cancel.`;
  }
  if (pending.type === "handPlace") {
    const card = CARD_BY_ID.get(pending.cardId);
    return card
      ? `No match for ${card.name}. Tap preview field card to place, or tap selected hand card to cancel.`
      : "No match. Tap preview field card to place, or tap selected hand card to cancel.";
  }
  if (pending.type === "drawMatch") {
    return `Select 1 highlighted field card to pair with drawn ${pending.drawnCard.name}.`;
  }
  if (pending.type === "drawPlace") {
    return `No match for drawn ${pending.drawnCard.name}. Tap preview field card to place.`;
  }
  return "Select 1 highlighted field card.";
}

function renderChoiceMode() {
  const interactivePlayerIndex = getInteractiveHumanPlayerIndex();
  const pending =
    state.pendingSelection &&
    interactivePlayerIndex !== null &&
    state.pendingSelection.playerIndex === interactivePlayerIndex
      ? state.pendingSelection
      : null;
  const aiPreview = !pending && state.aiPreview ? state.aiPreview : null;
  const waitingDeckFlip =
    Boolean(state.awaitingDeckFlip) &&
    interactivePlayerIndex !== null &&
    state.awaitingDeckFlip.playerIndex === interactivePlayerIndex &&
    !state.awaitingDeckFlip.revealed;
  const canPickHandCard =
    interactivePlayerIndex !== null &&
    !state.roundOver &&
    !state.awaitingDecision &&
    !state.pendingSelection &&
    !state.awaitingDeckFlip &&
    state.players[interactivePlayerIndex].hand.length > 0;
  const humanDecision =
    Boolean(state.awaitingDecision) &&
    state.awaitingDecision.kind === "stopOrKoi" &&
    interactivePlayerIndex !== null &&
    state.awaitingDecision.playerIndex === interactivePlayerIndex;
  const roundEndedWaitingNext = state.roundOver && !state.matchOver;
  const matchEndedWaitingNew = state.matchOver;
  const cpuPlaying =
    !state.players[state.currentPlayer].isHuman &&
    !state.roundOver &&
    !state.awaitingDecision;
  const active = Boolean(pending || aiPreview);
  if (ui.handLockNote) {
    let noteText = "";
    let activeNote = false;
    if (state.turnReplay.active) {
      noteText = state.turnReplay.note || "Replaying previous turn...";
      activeNote = true;
    } else if (state.rtcWaiting) {
      const statusText =
        state.rtcStatus === "connected"
          ? "Connected"
          : state.rtcStatus === "connecting"
            ? "Connecting"
            : state.rtcStatus === "disconnected"
              ? "Disconnected"
              : state.rtcStatus === "error"
                ? "Error"
                : "Idle";
      noteText = `Online waiting (${statusText})${state.rtcRoomCode ? ` room ${state.rtcRoomCode}` : ""}.`;
      activeNote = false;
    } else if (pending) {
      noteText = getChoicePromptText(pending);
      activeNote = true;
    } else if (waitingDeckFlip) {
      noteText = "Reveal the deck card above.";
      activeNote = true;
    } else if (humanDecision) {
      const decision = state.awaitingDecision;
      const increase = Math.max(0, decision.koiMultiplier - state.tableMultiplier);
      if (decision.canPass) {
        noteText = `Choose Pass, or Koi-Koi for +${increase}x (to ${decision.koiMultiplier}x).`;
      } else {
        noteText = `Pass disabled. Choose Koi-Koi for +${increase}x (to ${decision.koiMultiplier}x).`;
      }
      activeNote = true;
    } else if (roundEndedWaitingNext) {
      const transition = state.roundTransition?.open ? state.roundTransition : null;
      if (transition) {
        const winnerText =
          transition.noScore || transition.winnerIndex === null
            ? "No scorer."
            : `${state.players[transition.winnerIndex]?.name || `P${transition.winnerIndex + 1}`} wins ${transition.pointsAwarded}.`;
        const nextMonth = describeMonthNameOnly(transition.nextGameNumber);
        if (isFriendMode()) {
          const p0Name = state.players[0]?.name || "P1";
          const p1Name = state.players[1]?.name || "P2";
          const p0Ready = transition.acks?.p0 ? "Ready" : "Waiting";
          const p1Ready = transition.acks?.p1 ? "Ready" : "Waiting";
          noteText = `Game End: ${winnerText} Next Game: ${nextMonth}. ${p0Name}: ${p0Ready} | ${p1Name}: ${p1Ready}.`;
        } else {
          noteText = `Game End: ${winnerText} Next Game: ${nextMonth}.`;
        }
      } else {
        let winnerText = "Round over.";
        const outcome = getLatestRoundOutcome();
        if (outcome?.noScore) {
          winnerText = "No scorer this round.";
        } else if (outcome?.winnerIndex !== null) {
          const winnerName = state.players[outcome.winnerIndex]?.name || `P${outcome.winnerIndex + 1}`;
          winnerText = `${winnerName} wins ${outcome.points}.`;
        }
        noteText = `${winnerText} Click Next Game.`;
      }
      activeNote = true;
    } else if (matchEndedWaitingNew) {
      const p0 = state.players[0].score;
      const p1 = state.players[1].score;
      const p0Name = state.players[0]?.name || "P1";
      const p1Name = state.players[1]?.name || "P2";
      if (p0 > p1) {
        noteText = `${p0Name} wins ${p0}-${p1}. Click New Match.`;
      } else if (p1 > p0) {
        noteText = `${p1Name} wins ${p1}-${p0}. Click New Match.`;
      } else {
        noteText = `Draw ${p0}-${p1}. Click New Match.`;
      }
      activeNote = true;
    } else if (canPickHandCard) {
      noteText = "Pick a card from your hand to play.";
      activeNote = true;
    } else if (cpuPlaying) {
      noteText = `${state.players[state.currentPlayer].name} playing.`;
      activeNote = false;
    } else {
      noteText = "";
      activeNote = false;
    }
    ui.handLockNote.textContent = noteText;
    ui.handLockNote.classList.toggle("is-active", activeNote);
    ui.handLockNote.classList.toggle("is-muted", !activeNote);
  }
  if (ui.fieldZone) {
    ui.fieldZone.classList.toggle("choice-mode", active);
  }
}

function renderCaptured() {
  const topPlayerIndex = getDisplayTopPlayerIndex();
  const bottomPlayerIndex = getDisplayBottomPlayerIndex();
  const cpuCaptured = getSortedCapturedForDisplay(state.players[topPlayerIndex].captured);
  const playerCaptured = getSortedCapturedForDisplay(state.players[bottomPlayerIndex].captured);

  ui.cpuCaptured.innerHTML = cpuCaptured
    .map(
      (card) =>
        `<div class="card mini badged" data-card-type="${card.type}">${renderBadgedCardContent(card)}</div>`
    )
    .join("");

  ui.playerCaptured.innerHTML = playerCaptured
    .map(
      (card) =>
        `<div class="card mini badged" data-card-type="${card.type}">${renderBadgedCardContent(card)}</div>`
    )
    .join("");
}

function setContextButton(button, { text, action, disabled, primary = false }) {
  if (!button) return;
  button.textContent = text;
  button.dataset.action = action;
  button.disabled = Boolean(disabled);
  button.classList.toggle("primary", Boolean(primary));
}

function renderContextBar() {
  if (!ui.contextLeftBtn || !ui.contextRightBtn) return;
  ui.contextZone.classList.remove("single-action");
  ui.contextLeftBtn.hidden = false;
  ui.contextRightBtn.classList.remove("full");

  if (state.awaitingDecision && state.awaitingDecision.kind === "stopOrKoi") {
    const decision = state.awaitingDecision;
    setContextButton(ui.contextLeftBtn, {
      text: `Pass (${decision.passMultiplier}x)`,
      action: "pass",
      disabled: !decision.canPass,
      primary: decision.canPass,
    });
    setContextButton(ui.contextRightBtn, {
      text: `Koi-Koi (${decision.koiMultiplier}x)`,
      action: "koi",
      disabled: false,
      primary: true,
    });
    return;
  }

  if (state.roundOver && !state.matchOver) {
    const transition = state.roundTransition?.open ? state.roundTransition : null;
    if (transition && isFriendMode()) {
      const onlineLocalPlayerIndex = getOnlineLocalPlayerIndex();
      if (onlineLocalPlayerIndex !== null) {
        const localReady = onlineLocalPlayerIndex === 0 ? Boolean(transition.acks?.p0) : Boolean(transition.acks?.p1);
        const nextMonth =
          transition.nextGameNumber !== null ? describeMonthNameOnly(transition.nextGameNumber) : "Next";
        ui.contextZone.classList.add("single-action");
        ui.contextLeftBtn.hidden = true;
        ui.contextRightBtn.classList.add("full");
        setContextButton(ui.contextRightBtn, {
          text: localReady ? "Waiting For Opponent..." : `I'm Ready (${nextMonth})`,
          action: "round-ready-online",
          disabled: localReady,
          primary: !localReady,
        });
        return;
      }
      setContextButton(ui.contextLeftBtn, {
        text: `${state.players[0]?.name || "P1"} Ready`,
        action: "round-ready-p0",
        disabled: Boolean(transition.acks?.p0),
        primary: !transition.acks?.p0,
      });
      setContextButton(ui.contextRightBtn, {
        text: `${state.players[1]?.name || "P2"} Ready`,
        action: "round-ready-p1",
        disabled: Boolean(transition.acks?.p1),
        primary: !transition.acks?.p1,
      });
      return;
    }
    ui.contextZone.classList.add("single-action");
    ui.contextLeftBtn.hidden = true;
    ui.contextRightBtn.classList.add("full");
    const nextMonth =
      transition && transition.nextGameNumber ? describeMonthNameOnly(transition.nextGameNumber) : "Next";
    setContextButton(ui.contextRightBtn, {
      text: `Next Game: ${nextMonth}`,
      action: transition ? "round-ready-local" : "next-game",
      disabled: state.gameNumber >= state.maxGames,
      primary: true,
    });
    return;
  }

  if (state.matchOver) {
    ui.contextZone.classList.add("single-action");
    ui.contextLeftBtn.hidden = true;
    ui.contextRightBtn.classList.add("full");
    setContextButton(ui.contextRightBtn, {
      text: "New Match",
      action: "new-match",
      disabled: false,
      primary: true,
    });
    return;
  }

  setContextButton(ui.contextLeftBtn, {
    text: "Pass",
    action: "idle-pass",
    disabled: true,
    primary: false,
  });
  setContextButton(ui.contextRightBtn, {
    text: "Koi-Koi",
    action: "idle-koi",
    disabled: true,
    primary: false,
  });
}

function onContextActionClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button || button.disabled) return;
  const action = button.dataset.action;

  if (action === "round-ready-p0") {
    markRoundTransitionReady(0);
    return;
  }

  if (action === "round-ready-p1") {
    markRoundTransitionReady(1);
    return;
  }

  if (action === "round-ready-local") {
    markRoundTransitionReady();
    return;
  }

  if (action === "round-ready-online") {
    markRoundTransitionReady();
    return;
  }

  if (action === "next-game") {
    onNextGame();
    return;
  }

  if (action === "new-match") {
    startNewMatch();
    return;
  }

  if (!state.awaitingDecision || state.awaitingDecision.kind !== "stopOrKoi") {
    return;
  }

  const decision = state.awaitingDecision;
  if (action === "pass") {
    if (!decision.canPass) return;
    state.awaitingDecision = null;
    recordTurnRecapDecision("pass", state.tableMultiplier, decision.passMultiplier);
    logPlayerMove(
      decision.playerIndex,
      decision.moveNumber,
      `Pass at ${decision.passMultiplier}x with ${decision.yakuText}.`
    );
    endRoundWithWinner(decision.playerIndex, decision.points, decision.passMultiplier, "passed");
    return;
  }

  if (action === "koi") {
    applyKoiAndContinue(decision);
  }
}

function paintAllCards() {
  const canvases = document.querySelectorAll("canvas[data-card-id]");
  for (const canvas of canvases) {
    const card = CARD_BY_ID.get(canvas.dataset.cardId);
    if (!card) continue;
    const ctx = canvas.getContext("2d");
    const sheet = state.sprites[card.sprite.sheet];
    if (!sheet || !ctx) continue;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      sheet,
      card.sprite.x,
      card.sprite.y,
      card.sprite.w,
      card.sprite.h,
      0,
      0,
      canvas.width,
      canvas.height
    );
  }
}

function sortByMonth(cards) {
  return [...cards].sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    return a.id.localeCompare(b.id);
  });
}

function shuffle(cards) {
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

function describeMonth(monthNumber) {
  const found = MONTHS.find((month) => month.id === monthNumber);
  return found ? `${found.name} (${found.flower})` : "Unknown month";
}

function renderGameToText() {
  if (!Array.isArray(state.players) || state.players.length < 2 || !state.players[0] || !state.players[1]) {
    const startupPayload = {
      mode: "startup",
      play_mode: state.playMode,
      friend_flow: state.friendFlow,
      rtc: {
        role: state.rtcRole,
        status: state.rtcStatus,
        room_code: state.rtcRoomCode,
        waiting: state.rtcWaiting,
        pending_start: state.rtcPendingStart,
      },
      ready: state.ready,
      message: state.message,
    };
    return JSON.stringify(startupPayload);
  }
  const cpuProfile = CPU_PROFILE_META[state.aiProfile] || CPU_PROFILE_META[DEFAULT_AI_PROFILE];
  const context = {
    left: ui.contextLeftBtn
      ? { text: ui.contextLeftBtn.textContent, action: ui.contextLeftBtn.dataset.action, disabled: ui.contextLeftBtn.disabled }
      : null,
    right: ui.contextRightBtn
      ? {
          text: ui.contextRightBtn.textContent,
          action: ui.contextRightBtn.dataset.action,
          disabled: ui.contextRightBtn.disabled,
        }
      : null,
  };
  const viewerIndex = getViewerPlayerIndex();
  const topPlayerIndex = getDisplayTopPlayerIndex();
  const bottomPlayerIndex = getDisplayBottomPlayerIndex();
  const canRevealBottom = canRevealBottomHand();
  const bottomHandOut = canRevealBottom
    ? state.players[bottomPlayerIndex].hand.map((card) => card.id)
    : Array.from({ length: state.players[bottomPlayerIndex].hand.length }, () => "hidden");

  const payload = {
    mode: state.matchOver ? "match-over" : state.roundOver ? "round-over" : state.awaitingDecision ? "decision" : "playing",
    play_mode: state.playMode,
    friend_flow: state.friendFlow,
    rtc: {
      role: state.rtcRole,
      status: state.rtcStatus,
      room_code: state.rtcRoomCode,
      waiting: state.rtcWaiting,
      pending_start: state.rtcPendingStart,
    },
    round_transition: state.roundTransition?.open
      ? {
          open: true,
          winner_index: state.roundTransition.winnerIndex,
          points_awarded: state.roundTransition.pointsAwarded,
          no_score: state.roundTransition.noScore,
          next_game_number: state.roundTransition.nextGameNumber,
          next_month: state.roundTransition.nextGameNumber
            ? describeMonthNameOnly(state.roundTransition.nextGameNumber)
            : null,
          acks: {
            p0: Boolean(state.roundTransition.acks?.p0),
            p1: Boolean(state.roundTransition.acks?.p1),
            local: Boolean(state.roundTransition.acks?.local),
          },
        }
      : {
          open: false,
        },
    viewer_player_index: state.viewerPlayerIndex,
    turn_checkpoint_ready: state.turnCheckpointReady,
    coordinate_system: "Cards are listed left-to-right in each visible area.",
    game_number: state.gameNumber,
    round_month: describeMonth(state.gameNumber),
    starts: state.players[state.dealer].name,
    turn: state.players[state.currentPlayer].name,
    table_multiplier: state.tableMultiplier,
    last_koi_caller: state.lastKoiCaller === null ? null : state.players[state.lastKoiCaller].name,
    special_two_x_player: state.roundSpecialTwoXPlayer === null ? null : state.players[state.roundSpecialTwoXPlayer].name,
    round12_leader_at_start:
      state.roundLeaderAtStart === null ? null : state.players[state.roundLeaderAtStart].name,
    deck_count: state.drawPile.length,
    pending_selection:
      state.pendingSelection && state.pendingSelection.playerIndex === getDisplayBottomPlayerIndex()
        ? {
            type: state.pendingSelection.type,
            options: state.pendingSelection.options,
            prompt: getChoicePromptText(state.pendingSelection),
          }
        : null,
    awaiting_deck_flip:
      state.awaitingDeckFlip
        ? {
            player: state.players[state.awaitingDeckFlip.playerIndex].name,
            move_number: state.awaitingDeckFlip.moveNumber,
            revealed: state.awaitingDeckFlip.revealed,
            drawn_card: state.awaitingDeckFlip.drawnCard.id,
          }
        : null,
    ai_preview: state.aiPreview
      ? {
          options: state.aiPreview.options,
          prompt: state.aiPreview.prompt,
        }
      : null,
    cpu_phase1_preview: state.cpuPhase1PreviewCardId,
    field: state.field.map((card) => card.id),
    hand_visibility: {
      viewer_player_index: viewerIndex,
      top_player_index: topPlayerIndex,
      bottom_player_index: bottomPlayerIndex,
      bottom_visible: canRevealBottom,
    },
    player: {
      score: state.players[bottomPlayerIndex].score,
      hand: bottomHandOut,
      captured_count: state.players[bottomPlayerIndex].captured.length,
      yaku_points: state.players[bottomPlayerIndex].yaku.points,
      yaku_names: state.players[bottomPlayerIndex].yaku.names,
    },
    cpu: {
      score: state.players[topPlayerIndex].score,
      hand_count: state.players[topPlayerIndex].hand.length,
      captured_count: state.players[topPlayerIndex].captured.length,
      yaku_points: state.players[topPlayerIndex].yaku.points,
      yaku_names: state.players[topPlayerIndex].yaku.names,
      profile: cpuProfile.name,
    },
    context,
    draw_preview: state.drawPreview,
    round_history: state.roundHistory.map((entry) => ({ ...entry })),
    message: state.message,
    action_log_tail: state.actionLog.slice(-10),
  };
  return JSON.stringify(payload);
}

function advanceTime(ms) {
  if (!Number.isFinite(ms) || ms < 0) return;
  if (state.aiTask) {
    const task = state.aiTask;
    clearAITask();
    task();
  }
}
