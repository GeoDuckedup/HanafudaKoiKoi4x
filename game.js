const CLASSIC_DECK_ID = "classic";
const RETRO8BIT_DECK_ID = "retro8bit";
const CLAY_DECK_ID = "clay";
const SELECTED_DECK_STORAGE_KEY = "hkk_selected_deck";
const CLASSIC_THEME_ID = "classicWarm";
const PAPER_THEME_ID = "paperLight";
const SELECTED_THEME_STORAGE_KEY = "hkk_selected_theme";
const MATCH_LENGTH_OPTIONS = Object.freeze([3, 6, 12]);

const CLASSIC_SHEET_PATHS = {
  jan: "assets/decks/classic/january.png",
  feb: "assets/decks/classic/february.png",
  mar: "assets/decks/classic/march.png",
  apr: "assets/decks/classic/april.png",
  may: "assets/decks/classic/may.png",
  jun: "assets/decks/classic/june.png",
  jul: "assets/decks/classic/july.png",
  aug: "assets/decks/classic/august.jpg",
  sep: "assets/decks/classic/september.png",
  oct: "assets/decks/classic/october.png",
  nov: "assets/decks/classic/november.png",
  dec: "assets/decks/classic/december.png",
};

const CLASSIC_MONTH_SPRITES = {
  1: [
    { sheet: "jan", x: 141, y: 14, w: 360, h: 487 },
    { sheet: "jan", x: 522, y: 14, w: 360, h: 487 },
    { sheet: "jan", x: 141, y: 521, w: 360, h: 484 },
    { sheet: "jan", x: 521, y: 521, w: 361, h: 484 },
  ],
  2: [
    { sheet: "feb", x: 521, y: 779, w: 408, h: 630 },
    { sheet: "feb", x: 94, y: 779, w: 407, h: 630 },
    { sheet: "feb", x: 95, y: 127, w: 407, h: 627 },
    { sheet: "feb", x: 521, y: 127, w: 408, h: 627 },
  ],
  3: [
    { sheet: "mar", x: 523, y: 14, w: 359, h: 487 },
    { sheet: "mar", x: 523, y: 522, w: 359, h: 483 },
    { sheet: "mar", x: 141, y: 14, w: 359, h: 487 },
    { sheet: "mar", x: 141, y: 522, w: 359, h: 483 },
  ],
  4: [
    { sheet: "apr", x: 94, y: 126, w: 409, h: 629 },
    { sheet: "apr", x: 94, y: 782, w: 408, h: 625 },
    { sheet: "apr", x: 520, y: 126, w: 409, h: 629 },
    { sheet: "apr", x: 520, y: 782, w: 409, h: 626 },
  ],
  5: [
    { sheet: "may", x: 94, y: 126, w: 407, h: 629 },
    { sheet: "may", x: 94, y: 781, w: 413, h: 636 },
    { sheet: "may", x: 520, y: 126, w: 410, h: 632 },
    { sheet: "may", x: 520, y: 780, w: 411, h: 636 },
  ],
  6: [
    { sheet: "jun", x: 145, y: 15, w: 360, h: 486 },
    { sheet: "jun", x: 144, y: 523, w: 359, h: 482 },
    { sheet: "jun", x: 526, y: 15, w: 360, h: 486 },
    { sheet: "jun", x: 524, y: 523, w: 361, h: 481 },
  ],
  7: [
    { sheet: "jul", x: 141, y: 15, w: 359, h: 486 },
    { sheet: "jul", x: 521, y: 15, w: 361, h: 486 },
    { sheet: "jul", x: 141, y: 521, w: 359, h: 483 },
    { sheet: "jul", x: 521, y: 521, w: 361, h: 483 },
  ],
  8: [
    { sheet: "aug", x: 140, y: 16, w: 361, h: 485 },
    { sheet: "aug", x: 521, y: 15, w: 361, h: 486 },
    { sheet: "aug", x: 138, y: 523, w: 363, h: 479 },
    { sheet: "aug", x: 521, y: 523, w: 362, h: 479 },
  ],
  9: [
    { sheet: "sep", x: 155, y: 15, w: 357, h: 485 },
    { sheet: "sep", x: 155, y: 521, w: 357, h: 482 },
    { sheet: "sep", x: 534, y: 15, w: 357, h: 485 },
    { sheet: "sep", x: 534, y: 521, w: 357, h: 482 },
  ],
  10: [
    { sheet: "oct", x: 425, y: 103, w: 333, h: 513 },
    { sheet: "oct", x: 79, y: 635, w: 331, h: 511 },
    { sheet: "oct", x: 80, y: 103, w: 330, h: 513 },
    { sheet: "oct", x: 425, y: 634, w: 333, h: 512 },
  ],
  11: [
    { sheet: "nov", x: 74, y: 63, w: 333, h: 550 },
    { sheet: "nov", x: 423, y: 63, w: 333, h: 550 },
    { sheet: "nov", x: 74, y: 631, w: 333, h: 559 },
    { sheet: "nov", x: 423, y: 631, w: 333, h: 559 },
  ],
  12: [
    { sheet: "dec", x: 520, y: 781, w: 409, h: 628 },
    { sheet: "dec", x: 95, y: 127, w: 409, h: 632 },
    { sheet: "dec", x: 520, y: 127, w: 409, h: 633 },
    { sheet: "dec", x: 94, y: 780, w: 407, h: 629 },
  ],
};

const ACTION_LOG_LIMIT = 180;
const aiBootstrap = window.HKKAI;
if (
  !aiBootstrap ||
  typeof aiBootstrap !== "object" ||
  !Array.isArray(aiBootstrap.AI_PROFILE_KEYS) ||
  !aiBootstrap.AI_PROFILES ||
  !aiBootstrap.CPU_PROFILE_META
) {
  throw new Error("AI bootstrap not loaded.");
}
const DEFAULT_AI_PROFILE = String(aiBootstrap.DEFAULT_AI_PROFILE || "balanced");
const AI_PROFILE_KEYS = aiBootstrap.AI_PROFILE_KEYS;
const AI_PROFILES = aiBootstrap.AI_PROFILES;
const CPU_PROFILE_META = aiBootstrap.CPU_PROFILE_META;

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

const CAPTURE_SUMMARY_TYPES = Object.freeze([
  { type: "light", label: "Bright" },
  { type: "seed", label: "Seed" },
  { type: "scroll", label: "Scroll" },
  { type: "basic", label: "Plain" },
]);

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

const RETRO8BIT_SHEET_PATHS = Object.freeze({
  jan: "assets/decks/retro8bit/january.png",
  feb: "assets/decks/retro8bit/February.png",
  mar: "assets/decks/retro8bit/March.png",
  apr: "assets/decks/retro8bit/April.png",
  may: "assets/decks/retro8bit/May.png",
  jun: "assets/decks/retro8bit/June.png",
  jul: "assets/decks/retro8bit/July.png",
  aug: "assets/decks/retro8bit/August.jpg",
  sep: "assets/decks/retro8bit/September.png",
  oct: "assets/decks/retro8bit/October.png",
  nov: "assets/decks/retro8bit/November.png",
  dec: "assets/decks/retro8bit/December.png",
});

const RETRO8BIT_MONTH_SHEETS = Object.freeze({
  1: "jan",
  2: "feb",
  3: "mar",
  4: "apr",
  5: "may",
  6: "jun",
  7: "jul",
  8: "aug",
  9: "sep",
  10: "oct",
  11: "nov",
  12: "dec",
});

const RETRO8BIT_MONTH_LABELS = Object.freeze({
  jan: "January",
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
  jul: "July",
  aug: "August",
  sep: "September",
  oct: "October",
  nov: "November",
  dec: "December",
});

const CLAY_SHEET_PATHS = Object.freeze({
  jan: "assets/decks/Clay/january.png",
  feb: "assets/decks/Clay/February.png",
  mar: "assets/decks/Clay/March.png",
  apr: "assets/decks/Clay/April.png",
  may: "assets/decks/Clay/May.png",
  jun: "assets/decks/Clay/June.png",
  jul: "assets/decks/Clay/July.png",
  aug: "assets/decks/Clay/August.jpg",
  sep: "assets/decks/Clay/September.png",
  oct: "assets/decks/Clay/October.png",
  nov: "assets/decks/Clay/November.png",
  dec: "assets/decks/Clay/December.png",
});

const CLAY_MONTH_SHEETS = Object.freeze({
  1: "jan",
  2: "feb",
  3: "mar",
  4: "apr",
  5: "may",
  6: "jun",
  7: "jul",
  8: "aug",
  9: "sep",
  10: "oct",
  11: "nov",
  12: "dec",
});

function buildDeckOverrideSpritesByCardId(baseMonthSprites, overrideMonthSheets) {
  const spritesByCardId = {};
  for (const [monthValue, sheetId] of Object.entries(overrideMonthSheets)) {
    const monthNumber = Number(monthValue);
    const monthSprites = baseMonthSprites[monthNumber];
    if (!Array.isArray(monthSprites)) continue;
    monthSprites.forEach((sprite, index) => {
      const cardCode = String.fromCharCode(97 + index);
      spritesByCardId[`${monthNumber}${cardCode}`] = { ...sprite, sheet: sheetId };
    });
  }
  return spritesByCardId;
}

const RETRO8BIT_SPRITES_BY_CARD_ID = Object.freeze(
  buildDeckOverrideSpritesByCardId(CLASSIC_MONTH_SPRITES, RETRO8BIT_MONTH_SHEETS)
);
const CLAY_SPRITES_BY_CARD_ID = Object.freeze(
  buildDeckOverrideSpritesByCardId(CLASSIC_MONTH_SPRITES, CLAY_MONTH_SHEETS)
);

const CLASSIC_SPRITES_BY_CARD_ID = Object.freeze(buildSpritesByCardId(CLASSIC_MONTH_SPRITES));
const DECK_DEFS = Object.freeze({
  [CLASSIC_DECK_ID]: Object.freeze({
    id: CLASSIC_DECK_ID,
    label: "Classic",
    shortLabel: "Classic",
    previewLabel: "Original 12-month art set",
    thumbPath: CLASSIC_SHEET_PATHS.jan,
    sheetPaths: Object.freeze({ ...CLASSIC_SHEET_PATHS }),
    spritesByCardId: CLASSIC_SPRITES_BY_CARD_ID,
  }),
  [RETRO8BIT_DECK_ID]: Object.freeze({
    id: RETRO8BIT_DECK_ID,
    label: "Retro 8-Bit",
    shortLabel: "8-Bit",
    previewLabel: `${Object.keys(RETRO8BIT_MONTH_SHEETS).length}-month classic-layout override set`,
    thumbPath: RETRO8BIT_SHEET_PATHS.jan,
    sheetPaths: Object.freeze({ ...RETRO8BIT_SHEET_PATHS }),
    spritesByCardId: RETRO8BIT_SPRITES_BY_CARD_ID,
  }),
  [CLAY_DECK_ID]: Object.freeze({
    id: CLAY_DECK_ID,
    label: "Clay",
    shortLabel: "Clay",
    previewLabel: `${Object.keys(CLAY_MONTH_SHEETS).length}-month classic-layout override set`,
    thumbPath: CLAY_SHEET_PATHS.jan,
    sheetPaths: Object.freeze({ ...CLAY_SHEET_PATHS }),
    spritesByCardId: CLAY_SPRITES_BY_CARD_ID,
  }),
});

const THEME_DEFS = Object.freeze({
  [CLASSIC_THEME_ID]: Object.freeze({
    id: CLASSIC_THEME_ID,
    label: "Classic Warm",
    shortLabel: "Warm",
    previewLabel: "Warm tabletop shell with the original parchment UI.",
    swatchClass: "theme-swatch-classicWarm",
  }),
  [PAPER_THEME_ID]: Object.freeze({
    id: PAPER_THEME_ID,
    label: "Paper Light",
    shortLabel: "Paper",
    previewLabel: "Off-paper white shell that makes the board and cards pop harder.",
    swatchClass: "theme-swatch-paperLight",
  }),
});

const CARD_DECK = buildDeck();
const CARD_BY_ID = new Map(CARD_DECK.map((card) => [card.id, card]));

const scoringRules = window.HKKScoringRules;
if (!scoringRules || !Array.isArray(scoringRules.fixedYakuRules) || !Array.isArray(scoringRules.incrementalYakuRules)) {
  throw new Error("Scoring rules bootstrap not loaded.");
}
const utils = window.HKKUtils;
if (!utils || typeof utils.computeCodeChecksum !== "function") {
  throw new Error("Utils bootstrap not loaded.");
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
const ONLINE_STORAGE_ROOM_KEY = "hkk_online_room";
const ONLINE_STORAGE_ROLE_KEY = "hkk_online_role";
const CPU_SAVE_TITLE = "vs CPU";
const LOCAL_SAVE_TITLE = "Local Match";
const DEV_DECK_MODE =
  window.location.protocol === "file:" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

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
    monthDef.cards.forEach((card) => {
      cards.push({
        id: `${monthDef.month}${card.code}`,
        month: monthDef.month,
        name: card.name,
        type: card.type,
        scrollKind: card.scrollKind || null,
        canAlsoBeBasic: Boolean(card.canAlsoBeBasic),
        isRainLight: Boolean(card.isRainLight),
      });
    });
  }
  return cards;
}

function buildSpritesByCardId(monthSprites) {
  const spritesByCardId = {};
  for (const monthDef of MONTH_CARD_DEFS) {
    const monthEntries = monthSprites[monthDef.month];
    if (!monthEntries || monthEntries.length !== monthDef.cards.length) {
      throw new Error(`Missing sprite mapping for month ${monthDef.month}`);
    }
    monthDef.cards.forEach((card, index) => {
      spritesByCardId[`${monthDef.month}${card.code}`] = Object.freeze({ ...monthEntries[index] });
    });
  }
  return spritesByCardId;
}

function init() {
  cacheUI();
  bindUI();
  bindRtcBridge();
  bindFirebaseOnlineAuth();
  state.selectedDeckId = readPersistedSelectedDeckId();
  state.selectedThemeId = readPersistedSelectedThemeId();
  applySelectedTheme();
  primeDeckThumbCache();
  validateDeckDefinitions();
  preloadSheets()
    .then(async () => {
      if (getSelectedDeckId() !== CLASSIC_DECK_ID) {
        await ensureDeckAssetsLoaded(getSelectedDeckId()).catch((err) => {
          console.warn(`[deck] Failed to preload ${getSelectedDeckId()} on boot. Falling back to classic.`, err);
          state.selectedDeckId = CLASSIC_DECK_ID;
          persistSelectedDeckId(CLASSIC_DECK_ID);
        });
      }
      state.ready = true;
      renderDeckUi();
      renderThemeUi();
      const reconnectResult = await attemptOnlineResumeOnLoad();
      if (!reconnectResult.resumed) {
        showStartMenu();
        if (reconnectResult.openOnlinePanel) {
          await getOnlineStartController().onStartModeOnlineFromMenu();
          if (reconnectResult.notice) {
            getOnlineStartController().setStartOnlineStatus(reconnectResult.notice, reconnectResult.noticeIsError !== false);
          }
        } else if (reconnectResult.openOnlineLoad) {
          setStartCurrentGamesPanelOpen(true, "online");
          if (!startModeLoadActive) {
            startModeLoadActive = true;
            updateStartModeButtonStates();
          }
          await refreshCurrentGamesPanel();
          if (reconnectResult.notice) {
            setStartCurrentGamesStatus(reconnectResult.notice, reconnectResult.noticeIsError === true);
          }
        } else if (reconnectResult.notice) {
          setCodeStatus(reconnectResult.notice, false, "start");
        }
        const loadedFromHash = tryLoadFromLocationHash();
        if (!loadedFromHash) {
          refreshCurrentGamesPanel();
        }
      }
    })
    .catch((err) => {
      addSystemLog(`Could not load card images: ${err.message}`);
      renderActionLog();
      setCodeStatus(`Asset load failed: ${err.message}`, true, "start");
      setDeckStatus(`Deck load failed: ${err.message}`, true);
    });

  window.render_game_to_text = renderGameToText;
  window.advanceTime = advanceTime;
  if (DEV_DECK_MODE) {
    installDevDebugHelpers();
  }
}

function getDeckDef(deckId) {
  return DECK_DEFS[normalizeDeckId(deckId)] || DECK_DEFS[CLASSIC_DECK_ID];
}

function normalizeDeckId(deckId) {
  const nextDeckId = String(deckId || "").trim();
  return DECK_DEFS[nextDeckId] ? nextDeckId : CLASSIC_DECK_ID;
}

function getSelectedDeckId() {
  return normalizeDeckId(state.selectedDeckId);
}

function getSelectedDeckDef() {
  return getDeckDef(getSelectedDeckId());
}

function getThemeDef(themeId) {
  return THEME_DEFS[normalizeThemeId(themeId)] || THEME_DEFS[CLASSIC_THEME_ID];
}

function normalizeThemeId(themeId) {
  const nextThemeId = String(themeId || "").trim();
  return THEME_DEFS[nextThemeId] ? nextThemeId : CLASSIC_THEME_ID;
}

function getSelectedThemeId() {
  return normalizeThemeId(state.selectedThemeId);
}

function getSelectedThemeDef() {
  return getThemeDef(getSelectedThemeId());
}

function readPersistedSelectedDeckId() {
  try {
    return normalizeDeckId(window.localStorage?.getItem(SELECTED_DECK_STORAGE_KEY) || CLASSIC_DECK_ID);
  } catch (_err) {
    return CLASSIC_DECK_ID;
  }
}

function persistSelectedDeckId(deckId) {
  const safeDeckId = normalizeDeckId(deckId);
  try {
    window.localStorage?.setItem(SELECTED_DECK_STORAGE_KEY, safeDeckId);
  } catch (_err) {
    // Ignore storage failures; deck choice is cosmetic only.
  }
}

function readPersistedSelectedThemeId() {
  try {
    return normalizeThemeId(window.localStorage?.getItem(SELECTED_THEME_STORAGE_KEY) || CLASSIC_THEME_ID);
  } catch (_err) {
    return CLASSIC_THEME_ID;
  }
}

function persistSelectedThemeId(themeId) {
  const safeThemeId = normalizeThemeId(themeId);
  try {
    window.localStorage?.setItem(SELECTED_THEME_STORAGE_KEY, safeThemeId);
  } catch (_err) {
    // Ignore storage failures; theme choice is cosmetic only.
  }
}

function applySelectedTheme() {
  document.body?.setAttribute("data-ui-theme", getSelectedThemeId());
}

function primeDeckThumbCache() {
  for (const deckDef of Object.values(DECK_DEFS)) {
    state.deckThumbs[deckDef.id] = deckDef.thumbPath;
  }
}

function setDeckStatus(message, isError) {
  state.deckStatusMessage = String(message || "");
  state.deckStatusError = Boolean(message && isError);
  renderDeckUi();
}

async function ensureDeckAssetsLoaded(deckId) {
  const safeDeckId = normalizeDeckId(deckId);
  const deckDef = getDeckDef(safeDeckId);
  state.deckSheets[safeDeckId] ??= {};
  state.deckOverrideDebugLoggedById ??= {};
  const sheetCache = state.deckSheets[safeDeckId];
  const tasks = Object.entries(deckDef.sheetPaths).map(([sheetId, assetPath]) => {
    if (sheetCache[sheetId]) {
      return Promise.resolve(sheetCache[sheetId]);
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        sheetCache[sheetId] = img;
        resolve(img);
      };
      img.onerror = () => reject(new Error(`missing ${assetPath}`));
      img.src = assetPath;
    });
  });
  await Promise.all(tasks);
  if (safeDeckId !== CLASSIC_DECK_ID && !state.deckOverrideDebugLoggedById[safeDeckId]) {
    let loggedSheet = false;
    for (const [sheetId, loadedSheet] of Object.entries(sheetCache)) {
      if (!loadedSheet) continue;
      const mappings = Object.fromEntries(
        Object.entries(deckDef.spritesByCardId)
          .filter(([, sprite]) => sprite.sheet === sheetId)
          .sort(([leftId], [rightId]) => leftId.localeCompare(rightId))
      );
      if (!Object.keys(mappings).length) continue;
      console.info(`[deck] ${deckDef.label} ${RETRO8BIT_MONTH_LABELS[sheetId] || sheetId} sheet loaded`, {
        width: loadedSheet.naturalWidth,
        height: loadedSheet.naturalHeight,
        cropSource: "classic-layout override",
        mappings,
      });
      loggedSheet = true;
    }
    if (loggedSheet) {
      state.deckOverrideDebugLoggedById[safeDeckId] = true;
    }
  }
  return sheetCache;
}

function getLoadedDeckSheet(deckId, sheetId) {
  return state.deckSheets?.[deckId]?.[sheetId] || null;
}

function resolveCardSprite(cardId, deckId = getSelectedDeckId()) {
  const safeDeckId = normalizeDeckId(deckId);
  const deckDef = getDeckDef(safeDeckId);
  const explicitSprite = deckDef.spritesByCardId[cardId];
  if (explicitSprite) {
    return { ...explicitSprite, deckId: safeDeckId };
  }
  const classicSprite = DECK_DEFS[CLASSIC_DECK_ID].spritesByCardId[cardId];
  return classicSprite ? { ...classicSprite, deckId: CLASSIC_DECK_ID } : null;
}

async function setSelectedDeck(deckId) {
  const safeDeckId = normalizeDeckId(deckId);
  try {
    await ensureDeckAssetsLoaded(safeDeckId);
    state.selectedDeckId = safeDeckId;
    persistSelectedDeckId(safeDeckId);
    setDeckStatus(`${getDeckDef(safeDeckId).label} ready.`, false);
  } catch (err) {
    console.warn(`[deck] Failed to load ${safeDeckId}. Falling back to classic.`, err);
    await ensureDeckAssetsLoaded(CLASSIC_DECK_ID);
    state.selectedDeckId = CLASSIC_DECK_ID;
    persistSelectedDeckId(CLASSIC_DECK_ID);
    setDeckStatus(`Could not load ${getDeckDef(safeDeckId).label}. Using Classic.`, true);
  }
  renderAll();
}

function validateDeckDefinitions() {
  if (state.deckValidationLogged) return;
  const cardIds = new Set(CARD_DECK.map((card) => card.id));
  const classicDeck = DECK_DEFS[CLASSIC_DECK_ID];
  const validationWarnings = [];

  for (const cardId of cardIds) {
    if (!classicDeck.spritesByCardId[cardId]) {
      throw new Error(`Classic deck is missing sprite mapping for ${cardId}`);
    }
  }

  for (const deckDef of Object.values(DECK_DEFS)) {
    const knownSheets = new Set(Object.keys(deckDef.sheetPaths));
    for (const [cardId, sprite] of Object.entries(deckDef.spritesByCardId)) {
      if (!cardIds.has(cardId)) {
        validationWarnings.push(`[deck] ${deckDef.id} maps unknown card id ${cardId}`);
      }
      if (!knownSheets.has(sprite.sheet)) {
        validationWarnings.push(`[deck] ${deckDef.id} sprite ${cardId} references unknown sheet ${sprite.sheet}`);
      }
    }
    for (const cardId of cardIds) {
      if (!resolveCardSprite(cardId, deckDef.id)) {
        validationWarnings.push(`[deck] ${deckDef.id} cannot resolve sprite for ${cardId}`);
      }
    }
  }

  if (validationWarnings.length) {
    const logger = DEV_DECK_MODE ? console.warn : console.info;
    validationWarnings.forEach((warning) => logger(warning));
  }
  state.deckValidationLogged = true;
}

function getDeckPickerMarkup() {
  const selectedDeckId = getSelectedDeckId();
  return Object.values(DECK_DEFS)
    .map((deckDef) => {
      const isSelected = deckDef.id === selectedDeckId;
      return `
        <button type="button" class="deck-picker-row${isSelected ? " is-selected" : ""}" data-deck-id="${deckDef.id}">
          <img class="deck-picker-thumb" src="${state.deckThumbs[deckDef.id] || deckDef.thumbPath}" alt="${deckDef.label} preview" loading="lazy" />
          <span class="deck-picker-copy">
            <span class="deck-picker-title">${deckDef.label}</span>
            <span class="deck-picker-subtitle">${deckDef.previewLabel || ""}</span>
          </span>
          <span class="deck-picker-check">${isSelected ? "SELECTED" : ""}</span>
        </button>
      `;
    })
    .join("");
}

function renderDeckUi() {
  const selectedDeck = getSelectedDeckDef();
  if (ui.startDeckBtn) {
    ui.startDeckBtn.textContent = `Choose Deck: ${selectedDeck.label}`;
    ui.startDeckBtn.classList.toggle("primary", Boolean(ui.startDeckPanel && !ui.startDeckPanel.hidden));
  }
  if (ui.deckToggle) {
    ui.deckToggle.textContent = `Deck: ${selectedDeck.shortLabel || selectedDeck.label}`;
    ui.deckToggle.classList.toggle("primary", Boolean(ui.deckPanel && !ui.deckPanel.hidden));
  }
  const markup = getDeckPickerMarkup();
  if (ui.startDeckList) {
    ui.startDeckList.innerHTML = markup;
  }
  if (ui.deckPanelList) {
    ui.deckPanelList.innerHTML = markup;
  }
  for (const node of [ui.startDeckStatus, ui.deckPanelStatus]) {
    if (!node) continue;
    node.textContent = state.deckStatusMessage || "";
    node.classList.toggle("error", Boolean(state.deckStatusMessage && state.deckStatusError));
    node.classList.toggle("success", Boolean(state.deckStatusMessage && !state.deckStatusError));
  }
}

function getThemePickerMarkup() {
  const selectedThemeId = getSelectedThemeId();
  return Object.values(THEME_DEFS)
    .map((themeDef) => {
      const isSelected = themeDef.id === selectedThemeId;
      return `
        <button type="button" class="theme-picker-row${isSelected ? " is-selected" : ""}" data-theme-id="${themeDef.id}">
          <span class="theme-swatch ${themeDef.swatchClass}" aria-hidden="true"></span>
          <span class="deck-picker-copy">
            <span class="deck-picker-title">${themeDef.label}</span>
            <span class="deck-picker-subtitle">${themeDef.previewLabel}</span>
          </span>
          <span class="deck-picker-check">${isSelected ? "SELECTED" : ""}</span>
        </button>
      `;
    })
    .join("");
}

function renderThemeUi() {
  const selectedTheme = getSelectedThemeDef();
  applySelectedTheme();
  if (ui.startThemeBtn) {
    ui.startThemeBtn.textContent = `Theme: ${selectedTheme.label}`;
    ui.startThemeBtn.classList.toggle("primary", Boolean(ui.startThemePanel && !ui.startThemePanel.hidden));
  }
  if (ui.themeToggle) {
    ui.themeToggle.textContent = `Theme: ${selectedTheme.shortLabel || selectedTheme.label}`;
    ui.themeToggle.classList.toggle("primary", Boolean(ui.themePanel && !ui.themePanel.hidden));
  }
  const markup = getThemePickerMarkup();
  if (ui.startThemeList) {
    ui.startThemeList.innerHTML = markup;
  }
  if (ui.themePanelList) {
    ui.themePanelList.innerHTML = markup;
  }
}

function setSelectedTheme(themeId) {
  const safeThemeId = normalizeThemeId(themeId);
  state.selectedThemeId = safeThemeId;
  persistSelectedThemeId(safeThemeId);
  applySelectedTheme();
  renderAll();
}

function getRtcBridge() {
  if (!window.rtcBridge) return null;
  return window.rtcBridge;
}

function normalizeOnlineRoleValue(rawRole) {
  return rawRole === "host" || rawRole === "guest" ? rawRole : null;
}

function normalizeOnlineInviteRoomId(rawRoomId) {
  return String(rawRoomId || "")
    .trim()
    .toUpperCase();
}

function writeOnlineInviteUrl(roomCode, options = {}) {
  const normalizedRoomCode = normalizeOnlineInviteRoomId(roomCode);
  if (!ONLINE_ROOM_CODE_REGEX.test(normalizedRoomCode)) return false;
  const replace = options.replace === true;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("join", normalizedRoomCode);
    url.searchParams.delete("room");
    url.searchParams.delete("role");
    const query = url.searchParams.toString();
    const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash || ""}`;
    if (replace) {
      window.history.replaceState({}, "", nextUrl);
    } else {
      window.history.pushState({}, "", nextUrl);
    }
    return true;
  } catch (_err) {
    return false;
  }
}

function buildOnlineInviteLink(roomCode) {
  const normalizedRoomCode = normalizeOnlineInviteRoomId(roomCode);
  if (!ONLINE_ROOM_CODE_REGEX.test(normalizedRoomCode)) return "";
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("join", normalizedRoomCode);
    url.searchParams.delete("room");
    url.searchParams.delete("role");
    url.hash = "";
    return url.toString();
  } catch (_err) {
    return "";
  }
}

function normalizeLegacyOnlineUrlToInvite(roomCode) {
  return writeOnlineInviteUrl(roomCode, { replace: true });
}

function readOnlineSessionContextFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const joinRoomCode = normalizeOnlineInviteRoomId(params.get("join"));
    if (ONLINE_ROOM_CODE_REGEX.test(joinRoomCode)) {
      return { roomCode: joinRoomCode, source: "join", legacyRole: null };
    }
    const legacyRoomCode = normalizeOnlineInviteRoomId(params.get("room"));
    if (ONLINE_ROOM_CODE_REGEX.test(legacyRoomCode)) {
      const legacyRole = normalizeOnlineRoleValue(String(params.get("role") || "").trim().toLowerCase());
      return { roomCode: legacyRoomCode, source: "legacy", legacyRole };
    }
    return null;
  } catch (_err) {
    return null;
  }
}

function readOnlineSessionContextFromStorage() {
  try {
    const roomCode = String(localStorage.getItem(ONLINE_STORAGE_ROOM_KEY) || "")
      .trim()
      .toUpperCase();
    const role = normalizeOnlineRoleValue(String(localStorage.getItem(ONLINE_STORAGE_ROLE_KEY) || "").trim().toLowerCase());
    if (!ONLINE_ROOM_CODE_REGEX.test(roomCode) || !role) {
      return null;
    }
    return { roomCode, role };
  } catch (_err) {
    return null;
  }
}

function persistOnlineSessionContext(roomCode, role) {
  const normalizedRoomCode = normalizeOnlineInviteRoomId(roomCode);
  const normalizedRole = normalizeOnlineRoleValue(String(role || "").trim().toLowerCase());
  if (!ONLINE_ROOM_CODE_REGEX.test(normalizedRoomCode) || !normalizedRole) return;
  try {
    localStorage.setItem(ONLINE_STORAGE_ROOM_KEY, normalizedRoomCode);
    localStorage.setItem(ONLINE_STORAGE_ROLE_KEY, normalizedRole);
  } catch (_err) {
    // Ignore storage failures.
  }
  writeOnlineInviteUrl(normalizedRoomCode);
}

function clearOnlineSessionContext() {
  try {
    localStorage.removeItem(ONLINE_STORAGE_ROOM_KEY);
    localStorage.removeItem(ONLINE_STORAGE_ROLE_KEY);
  } catch (_err) {
    // Ignore storage failures.
  }
  try {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("join") && !url.searchParams.has("room") && !url.searchParams.has("role")) {
      return;
    }
    url.searchParams.delete("join");
    url.searchParams.delete("room");
    url.searchParams.delete("role");
    const query = url.searchParams.toString();
    const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash || ""}`;
    window.history.replaceState({}, "", nextUrl);
  } catch (_err) {
    // Ignore URL cleanup failures.
  }
}

function bindRtcBridge() {
  return getOnlineRuntimeController().bindRtcBridge();
}

function setOnlineAuthState(nextState, message = "") {
  return getOnlineStartController().setOnlineAuthState(nextState, message);
}

function getOnlineAuthBlockingMessage() {
  return getOnlineStartController().getOnlineAuthBlockingMessage();
}

function isOnlineAuthReady() {
  return getOnlineStartController().isOnlineAuthReady();
}

function applyOnlineAuthUiState() {
  return getOnlineStartController().applyOnlineAuthUiState();
}

function ensureOnlineAuthReadyForStart() {
  return getOnlineStartController().ensureOnlineAuthReadyForStart();
}

function bindFirebaseOnlineAuth() {
  return getOnlineStartController().bindFirebaseOnlineAuth();
}

function normalizeRoomCodeInput(raw) {
  return getOnlineStartController().normalizeRoomCodeInput(raw);
}

function isOnlineRoomCodeCollisionError(err) {
  return getOnlineStartController().isOnlineRoomCodeCollisionError(err);
}

let onlineSessionController = null;
let onlineStartController = null;
let onlineRuntimeController = null;
let onlineHandoffController = null;
let codeIoController = null;
let snapshotCodec = null;
let aiController = null;
let cpuAutosaveMatchId = null;
let localAutosaveMatchId = null;
let currentGamesRefreshToken = 0;
let currentGamesResumeInFlight = false;
let currentGamesDeleteInFlight = false;
const currentGamesHandCountCache = new Map();
const currentGamesOnlineEntriesById = new Map();
const LOCAL_PASS_AND_PLAY_UI_ENABLED = false;
const LOCAL_PASS_AND_PLAY_AUTOSAVE_ENABLED = false;
let startModeMenuMode = null;
let startModeLoadActive = false;

function getSnapshotCodec() {
  if (snapshotCodec) return snapshotCodec;
  if (!window.HKKSnapshotCodec || typeof window.HKKSnapshotCodec.createSnapshotCodec !== "function") {
    throw new Error("Snapshot codec bootstrap not loaded.");
  }
  snapshotCodec = window.HKKSnapshotCodec.createSnapshotCodec({
    state,
    SAVE_CODE_PREFIX,
    SAVE_CODE_PREFIX_VERSION,
    SAVE_MIGRATIONS,
    SAVE_CODE_VERSION,
    SUPPORTED_SAVE_VERSIONS,
    ACTION_LOG_LIMIT,
    AI_PROFILES,
    DEFAULT_AI_PROFILE,
    CARD_BY_ID,
    CARD_DECK,
    encodeBase64UrlUtf8,
    decodeBase64UrlUtf8,
    computeCodeChecksum: utils.computeCodeChecksum,
    computeTurnCheckpointReady,
    createPlayer,
    sortByMonth,
    computeYaku,
    setFriendInterstitialOpen,
    renderAll,
    playTurnRecapForViewer,
    resumeLoadedStateFlow,
    clearRoundRuntimeTimers,
  });
  return snapshotCodec;
}

function getAIController() {
  if (aiController) return aiController;
  if (!window.HKKAI || typeof window.HKKAI.createAIController !== "function") {
    throw new Error("AI controller bootstrap not loaded.");
  }
  aiController = window.HKKAI.createAIController({
    state,
    getCpuPlayerIndex,
    getFieldMatches,
    describeMonth,
    addSystemLog,
    renderAll,
    executePlayFromHand,
    CARD_BY_ID,
    computeYaku,
    AI_STEP_THINK_MS,
    AI_STEP_CPU_PHASE1_PREVIEW_MS,
    AI_STEP_TARGET_MS,
  });
  return aiController;
}

function getOnlineSessionController() {
  if (onlineSessionController) return onlineSessionController;
  if (!window.createOnlineSessionController || typeof window.createOnlineSessionController !== "function") {
    throw new Error("Online session controller is not loaded.");
  }
  onlineSessionController = window.createOnlineSessionController({
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
  });
  return onlineSessionController;
}

function getOnlineStartController() {
  if (onlineStartController) return onlineStartController;
  if (!window.createOnlineStartController || typeof window.createOnlineStartController !== "function") {
    throw new Error("Online start controller is not loaded.");
  }
  onlineStartController = window.createOnlineStartController({
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
    startNewMatch,
    hideStartMenu,
    encodeStateForOnline,
    applyOnlineWaitingStateFromCurrentTurn,
    buildOnlineRoomSummaryFromState,
    applyOnlineSnapshotFromFirebase,
    beginOnlineFriendMatch,
    onPeerConnected,
    handleOnlineReconnect,
    persistOnlineSessionContext,
    buildOnlineInviteLink,
    normalizeLegacyOnlineUrlToInvite,
    readOnlineSessionContextFromUrl,
    readOnlineSessionContextFromStorage,
    onlineRoomCodeLength: ONLINE_ROOM_CODE_LENGTH,
    onlineRoomCodeRegex: ONLINE_ROOM_CODE_REGEX,
    onlineAuthReadyTimeoutMs: ONLINE_AUTH_READY_TIMEOUT_MS,
    onlineHostCreateMaxAttempts: ONLINE_HOST_CREATE_MAX_ATTEMPTS,
  });
  return onlineStartController;
}

function getOnlineRuntimeController() {
  if (onlineRuntimeController) return onlineRuntimeController;
  if (!window.createOnlineRuntimeController || typeof window.createOnlineRuntimeController !== "function") {
    throw new Error("Online runtime controller is not loaded.");
  }
  onlineRuntimeController = window.createOnlineRuntimeController({
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
  });
  return onlineRuntimeController;
}

function getOnlineHandoffController() {
  if (onlineHandoffController) return onlineHandoffController;
  if (!window.createOnlineHandoffController || typeof window.createOnlineHandoffController !== "function") {
    throw new Error("Online handoff controller is not loaded.");
  }
  onlineHandoffController = window.createOnlineHandoffController({
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
  });
  return onlineHandoffController;
}

function getCodeIoController() {
  if (codeIoController) return codeIoController;
  if (!window.createCodeIoController || typeof window.createCodeIoController !== "function") {
    throw new Error("Code IO controller is not loaded.");
  }
  codeIoController = window.createCodeIoController({
    state,
    ui,
    loadCodeIntoGame,
    setStartManualLoadVisible,
    setFriendManualLoadVisible,
    setCodeStatus,
  });
  return codeIoController;
}

function isOnlineFriendSessionActive() {
  return getOnlineSessionController().isOnlineFriendSessionActive();
}

function getOnlineLocalPlayerIndex() {
  return getOnlineSessionController().getOnlineLocalPlayerIndex();
}

function getOnlineRemoteRole() {
  return getOnlineSessionController().getOnlineRemoteRole();
}

function describeTurnOwnerForDebug(owner = state.currentPlayer) {
  return getOnlineSessionController().describeTurnOwnerForDebug(owner);
}

function debugOnlineInit(event, details = {}) {
  return getOnlineSessionController().debugOnlineInit(event, details);
}

function getOnlineRoleAssignmentDebug() {
  return getOnlineSessionController().getOnlineRoleAssignmentDebug();
}

function getOnlineStartupDebugState(extra = {}) {
  return getOnlineSessionController().getOnlineStartupDebugState(extra);
}

function warnOnlineStartupInvariant(message, reason) {
  return getOnlineSessionController().warnOnlineStartupInvariant(message, reason);
}

function assertOnlineRoleMapping(reason) {
  return getOnlineSessionController().assertOnlineRoleMapping(reason);
}

function enforceInitialOnlineStartupState(reason) {
  return getOnlineSessionController().enforceInitialOnlineStartupState(reason);
}

function applyOnlineWaitingStateFromCurrentTurn(reason) {
  return getOnlineSessionController().applyOnlineWaitingStateFromCurrentTurn(reason);
}

function syncOnlineMatchOverSnapshot() {
  return getOnlineSessionController().syncOnlineMatchOverSnapshot();
}

function sendHostSessionInitSignal() {
  return getOnlineSessionController().sendHostSessionInitSignal();
}

function encodeStateForOnline() {
  return getOnlineSessionController().encodeStateForOnline();
}

function encodeRtcSignal(payload) {
  return getOnlineSessionController().encodeRtcSignal(payload);
}

function tryDecodeRtcSignal(raw) {
  return getOnlineSessionController().tryDecodeRtcSignal(raw);
}

function sendRtcSignal(payload) {
  return getOnlineSessionController().sendRtcSignal(payload);
}

function sendOnlineTurnCodeWithSnapshot(stateCode, wirePayload, options = {}) {
  return getOnlineSessionController().sendOnlineTurnCodeWithSnapshot(stateCode, wirePayload, options);
}

function syncOnlineRoundTransitionSnapshot() {
  return getOnlineSessionController().syncOnlineRoundTransitionSnapshot();
}

function getOnlineSnapshotTurnIndex() {
  return getOnlineSessionController().getOnlineSnapshotTurnIndex();
}

function buildOnlineRoomSummaryFromState() {
  return getOnlineSessionController().buildOnlineRoomSummaryFromState();
}

function applyOnlineSnapshotFromFirebase(snapshot, reason = "firebase-snapshot") {
  return getOnlineSessionController().applyOnlineSnapshotFromFirebase(snapshot, reason);
}

function onPeerConnected() {
  return getOnlineSessionController().onPeerConnected();
}

function resetRtcSession(options = {}) {
  return getOnlineRuntimeController().resetRtcSession(options);
}

function triggerRtcHeartbeatPulse() {
  return getOnlineRuntimeController().triggerRtcHeartbeatPulse();
}

function setStartOnlineStatus(message, isError) {
  return getOnlineStartController().setStartOnlineStatus(message, isError);
}

function setStartOnlinePanelMode(mode) {
  return getOnlineStartController().setStartOnlinePanelMode(mode);
}

function setStartOnlineRoomDisplay(roomCode) {
  return getOnlineStartController().setStartOnlineRoomDisplay(roomCode);
}

function setStartOnlinePanelOpen(open) {
  return getOnlineStartController().setStartOnlinePanelOpen(open);
}

function beginOnlineFriendMatch() {
  return getOnlineSessionController().beginOnlineFriendMatch();
}

async function handleOnlineReconnect(roomCode, role) {
  return getOnlineSessionController().handleOnlineReconnect(roomCode, role);
}

async function handleRtcDisconnectAutoReconnect() {
  return getOnlineSessionController().handleRtcDisconnectAutoReconnect();
}

function clearOnlineRealtimeSubscriptions() {
  return getOnlineSessionController().clearOnlineRealtimeSubscriptions();
}

async function handleRtcReconnectRetry() {
  return getOnlineSessionController().handleRtcDisconnectAutoReconnect();
}

async function attemptOnlineResumeOnLoad() {
  return getOnlineStartController().attemptOnlineResumeOnLoad();
}

function refreshStartMenuAsyncUx() {
  return getOnlineStartController().refreshStartMenuAsyncUx();
}

function getSavesBridge() {
  const bridge = window.HKKSaves;
  if (!bridge) return null;
  if (
    typeof bridge.saveMatch !== "function" ||
    typeof bridge.loadMatch !== "function" ||
    typeof bridge.listMatches !== "function" ||
    typeof bridge.deleteMatch !== "function"
  ) {
    return null;
  }
  return bridge;
}

function isDeviceCurrentGamesMatch(entry) {
  if (!entry || typeof entry !== "object") return false;
  return entry.mode === "cpu" || entry.mode === "online";
}

function normalizeStartModeMenuMode(mode) {
  if (mode === "cpu" || mode === "online") return mode;
  return null;
}

function normalizeMatchLength(value) {
  const numeric = Number(value || 0);
  return MATCH_LENGTH_OPTIONS.includes(numeric) ? numeric : 12;
}

function getNextMatchLength(value) {
  const normalized = normalizeMatchLength(value);
  const currentIndex = MATCH_LENGTH_OPTIONS.indexOf(normalized);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % MATCH_LENGTH_OPTIONS.length : 0;
  return MATCH_LENGTH_OPTIONS[nextIndex];
}

function formatMatchLengthLabel(value) {
  const normalized = normalizeMatchLength(value);
  return `Match Length: ${normalized} Games`;
}

function getStartModeMenuTitle(mode) {
  if (mode === "cpu") return "Play CPU";
  if (mode === "local") return "Play Local";
  if (mode === "online") return "Play Online";
  return "Play Mode";
}

function getStartModeMenuButton(mode) {
  if (mode === "cpu") return ui.startModeCpuBtn || null;
  if (mode === "local") return ui.startModeFriendBtn || null;
  if (mode === "online") return ui.startModeOnlineBtn || null;
  return null;
}

function updateStartModeButtonStates() {
  const panelOpen = Boolean(ui.startCurrentGamesPanel && !ui.startCurrentGamesPanel.hidden);
  const activeMode = panelOpen ? normalizeStartModeMenuMode(startModeMenuMode) : null;
  if (ui.startModeCpuBtn) ui.startModeCpuBtn.classList.toggle("primary", activeMode === "cpu");
  if (ui.startModeFriendBtn) ui.startModeFriendBtn.classList.toggle("primary", activeMode === "local");
  if (ui.startModeOnlineBtn) ui.startModeOnlineBtn.classList.toggle("primary", activeMode === "online");
  if (ui.startModeNewBtn) ui.startModeNewBtn.classList.toggle("primary", panelOpen && !startModeLoadActive);
  if (ui.startModeLoadBtn) ui.startModeLoadBtn.classList.toggle("primary", panelOpen && startModeLoadActive);
  if (ui.startDeckBtn) ui.startDeckBtn.classList.toggle("primary", Boolean(ui.startDeckPanel && !ui.startDeckPanel.hidden));
  renderStartMatchLengthUi();
}

function renderStartMatchLengthUi() {
  const startMenuVisible = Boolean(ui.startMenu && !ui.startMenu.hidden);
  const currentGamesOpen = Boolean(ui.startCurrentGamesPanel && !ui.startCurrentGamesPanel.hidden);
  const onlinePanelOpen = Boolean(ui.startOnlinePanel && !ui.startOnlinePanel.hidden);
  const currentMode = currentGamesOpen ? normalizeStartModeMenuMode(startModeMenuMode) : null;
  const label = formatMatchLengthLabel(state.startMatchLength);

  if (ui.startMatchLengthBtn) {
    const showCpuLength = startMenuVisible && currentGamesOpen && currentMode === "cpu" && !startModeLoadActive;
    ui.startMatchLengthBtn.hidden = !showCpuLength;
    ui.startMatchLengthBtn.textContent = label;
  }
  if (ui.onlineMatchLengthBtn) {
    const showOnlineLength = startMenuVisible && onlinePanelOpen;
    ui.onlineMatchLengthBtn.hidden = !showOnlineLength;
    ui.onlineMatchLengthBtn.textContent = label;
  }
}

function onCycleStartMatchLength() {
  state.startMatchLength = getNextMatchLength(state.startMatchLength);
  renderStartMatchLengthUi();
}

function compareCurrentGamesMatches(a, b) {
  const statusRank = (entry) => {
    if (entry?.finished || entry?.status === "finished") return 3;
    if (entry?.status === "your-turn") return 0;
    if (entry?.status === "pass-device") return 1;
    if (entry?.status === "waiting") return 2;
    return 2;
  };
  const rankDiff = statusRank(a) - statusRank(b);
  if (rankDiff !== 0) return rankDiff;
  const aFinished = Boolean(a?.finished);
  const bFinished = Boolean(b?.finished);
  if (aFinished !== bFinished) {
    return aFinished ? 1 : -1;
  }
  const aUpdated = Number(a?.updatedAt || 0);
  const bUpdated = Number(b?.updatedAt || 0);
  if (bUpdated !== aUpdated) return bUpdated - aUpdated;
  const aId = String(a?.id || "");
  const bId = String(b?.id || "");
  return aId.localeCompare(bId);
}

function formatCurrentGamesUpdatedAt(timestamp) {
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

function formatCurrentGamesModeLabel(mode) {
  if (mode === "cpu") return "CPU";
  if (mode === "local") return "Local";
  if (mode === "online") return "Online";
  return "Other";
}

function formatCurrentGamesStatusLabel(status) {
  if (status === "your-turn") return "Your turn";
  if (status === "waiting") return "Waiting";
  if (status === "pass-device") return "Pass device";
  if (status === "finished") return "Finished";
  return "Unknown";
}

function buildCurrentGamesStatusMeta(savedMatch, p0Label, p1Label) {
  if (savedMatch?.mode === "online") {
    const onlineLabel = String(savedMatch?.onlineStatusLabel || "").trim();
    const onlineStatus = savedMatch?.status === "waiting" ? "Waiting on opponent" : formatCurrentGamesStatusLabel(savedMatch?.status);
    const className =
      savedMatch?.status === "your-turn"
        ? "is-your-turn"
        : savedMatch?.status === "waiting"
          ? "is-waiting"
          : savedMatch?.status === "finished"
            ? "is-finished"
            : "";
    return {
      text: onlineLabel || onlineStatus,
      className,
    };
  }
  if (savedMatch?.mode === "local" && savedMatch?.finished !== true) {
    if (savedMatch.turnOwner === 0) {
      return {
        text: `${p0Label} Turn`,
        className: "is-player-1-turn",
      };
    }
    if (savedMatch.turnOwner === 1) {
      return {
        text: `${p1Label} Turn`,
        className: "is-player-2-turn",
      };
    }
  }
  if (savedMatch?.mode === "cpu" && savedMatch?.status === "waiting") {
    return {
      text: "CPU turn",
      className: "is-waiting",
    };
  }
  return {
    text: formatCurrentGamesStatusLabel(savedMatch?.status),
    className:
      savedMatch?.status === "your-turn"
        ? "is-your-turn"
        : savedMatch?.status === "waiting"
          ? "is-waiting"
          : savedMatch?.status === "finished"
            ? "is-finished"
            : "",
  };
}

function getCurrentTurnHandCountFromSavedMatch(savedMatch) {
  if (savedMatch?.mode === "online") return null;
  const turnOwner = savedMatch?.turnOwner;
  if (turnOwner !== 0 && turnOwner !== 1) return null;
  const cacheKey = `${savedMatch.id}:${savedMatch.updatedAt}`;
  if (currentGamesHandCountCache.has(cacheKey)) {
    return currentGamesHandCountCache.get(cacheKey);
  }
  let handCount = null;
  try {
    const snapshot = decodeGameCode(savedMatch.gameSnapshot, { allowMissingDrawPile: true });
    const hand = snapshot?.players?.[turnOwner]?.hand;
    if (Array.isArray(hand)) {
      handCount = hand.length;
    }
  } catch (_err) {
    handCount = null;
  }
  currentGamesHandCountCache.set(cacheKey, handCount);
  return handCount;
}

function normalizeOnlineResumeRole(role) {
  return role === "host" || role === "guest" ? role : null;
}

function buildOnlineCurrentGamesEntryId(roomCode, role) {
  return `online-${roomCode}-${role}`;
}

function normalizeOnlineJoinState(rawState) {
  const stateValue = String(rawState || "").trim().toLowerCase();
  if (stateValue === "open" || stateValue === "full" || stateValue === "expired" || stateValue === "closed") {
    return stateValue;
  }
  return "expired";
}

function decodeOnlineSnapshotForCurrentGames(stateCode) {
  const normalizedStateCode = String(stateCode || "").trim();
  if (!normalizedStateCode) return null;
  try {
    return decodeGameCode(normalizedStateCode, { allowMissingDrawPile: true });
  } catch (_err) {
    return null;
  }
}

function normalizeOnlineRoomSummary(rawSummary) {
  if (!rawSummary || typeof rawSummary !== "object") return null;
  const hostName = String(rawSummary.hostName || "").trim() || "Player 1";
  const guestName = String(rawSummary.guestName || "").trim() || "Player 2";
  const hostScoreRaw = Number(rawSummary.hostScore ?? 0);
  const guestScoreRaw = Number(rawSummary.guestScore ?? 0);
  const roundRaw = Number(rawSummary.round ?? 1);
  const monthRaw = Number(rawSummary.month ?? roundRaw);
  const turnOwnerRaw = String(rawSummary.turnOwner || "").trim().toLowerCase();
  const statusRaw = String(rawSummary.status || "").trim().toLowerCase();
  const updatedAtRaw = Number(rawSummary.updatedAt ?? 0);

  const hostScore = Number.isFinite(hostScoreRaw) && hostScoreRaw >= 0 ? Math.floor(hostScoreRaw) : 0;
  const guestScore = Number.isFinite(guestScoreRaw) && guestScoreRaw >= 0 ? Math.floor(guestScoreRaw) : 0;
  const round = Number.isFinite(roundRaw) && roundRaw >= 1 ? Math.floor(roundRaw) : 1;
  const month = Number.isFinite(monthRaw) ? Math.max(1, Math.min(12, Math.floor(monthRaw))) : Math.max(1, Math.min(12, round));
  const turnOwner = turnOwnerRaw === "host" || turnOwnerRaw === "guest" || turnOwnerRaw === "none" ? turnOwnerRaw : "none";
  const status =
    statusRaw === "waiting" ||
    statusRaw === "active" ||
    statusRaw === "finished" ||
    statusRaw === "closed" ||
    statusRaw === "expired"
      ? statusRaw
      : "active";
  const finished = rawSummary.finished === true || status === "finished" || status === "closed" || status === "expired";
  const updatedAt = Number.isFinite(updatedAtRaw) && updatedAtRaw > 0 ? Math.floor(updatedAtRaw) : 0;

  return {
    hostName,
    guestName,
    hostScore,
    guestScore,
    round,
    month,
    turnOwner,
    status,
    finished,
    updatedAt,
  };
}

function isOnlineRoomSummaryComplete(roomSummary) {
  if (!roomSummary) return false;
  if (!roomSummary.hostName || !roomSummary.guestName) return false;
  if (!Number.isFinite(Number(roomSummary.round)) || Number(roomSummary.round) < 1) return false;
  if (!Number.isFinite(Number(roomSummary.month)) || Number(roomSummary.month) < 1 || Number(roomSummary.month) > 12) {
    return false;
  }
  if (!Number.isFinite(Number(roomSummary.hostScore)) || Number(roomSummary.hostScore) < 0) return false;
  if (!Number.isFinite(Number(roomSummary.guestScore)) || Number(roomSummary.guestScore) < 0) return false;
  if (!roomSummary.status) return false;
  return true;
}

function buildOnlineRoomSummaryFromSnapshotPayload(snapshotPayload) {
  const decodedSnapshot = decodeOnlineSnapshotForCurrentGames(snapshotPayload?.state || "");
  if (!decodedSnapshot) return null;
  const players = Array.isArray(decodedSnapshot.players) ? decodedSnapshot.players : [];
  const hostName = String(players?.[0]?.name || "Player 1").trim() || "Player 1";
  const guestName = String(players?.[1]?.name || "Player 2").trim() || "Player 2";
  const hostScoreRaw = Number(players?.[0]?.score || 0);
  const guestScoreRaw = Number(players?.[1]?.score || 0);
  const roundRaw = Number(decodedSnapshot.gameNumber || 1);
  const round = Number.isFinite(roundRaw) && roundRaw >= 1 ? Math.floor(roundRaw) : 1;
  const turnOwner = decodedSnapshot.currentPlayer === 0 ? "host" : decodedSnapshot.currentPlayer === 1 ? "guest" : "none";
  return normalizeOnlineRoomSummary({
    hostName,
    guestName,
    hostScore: Number.isFinite(hostScoreRaw) && hostScoreRaw >= 0 ? Math.floor(hostScoreRaw) : 0,
    guestScore: Number.isFinite(guestScoreRaw) && guestScoreRaw >= 0 ? Math.floor(guestScoreRaw) : 0,
    round,
    month: round,
    turnOwner: decodedSnapshot.matchOver === true ? "none" : turnOwner,
    status: decodedSnapshot.matchOver === true ? "finished" : "active",
    finished: decodedSnapshot.matchOver === true,
    updatedAt: Number(snapshotPayload?.updatedAt || 0) || Date.now(),
  });
}

function mergeOnlineRoomSummary(primarySummary, fallbackSummary) {
  const primary = normalizeOnlineRoomSummary(primarySummary);
  const fallback = normalizeOnlineRoomSummary(fallbackSummary);
  if (!primary) return fallback;
  if (!fallback) return primary;
  return normalizeOnlineRoomSummary({
    hostName: primary.hostName || fallback.hostName,
    guestName: primary.guestName || fallback.guestName,
    hostScore: Number.isFinite(primary.hostScore) ? primary.hostScore : fallback.hostScore,
    guestScore: Number.isFinite(primary.guestScore) ? primary.guestScore : fallback.guestScore,
    round: Number.isFinite(primary.round) && primary.round >= 1 ? primary.round : fallback.round,
    month: Number.isFinite(primary.month) && primary.month >= 1 && primary.month <= 12 ? primary.month : fallback.month,
    turnOwner: primary.turnOwner || fallback.turnOwner,
    status: primary.status || fallback.status,
    finished: primary.finished === true || fallback.finished === true,
    updatedAt: Number(primary.updatedAt || 0) > 0 ? Number(primary.updatedAt || 0) : Number(fallback.updatedAt || 0),
  });
}

function clearOnlineSessionContextForRoom(roomCode) {
  const normalizedRoomCode = normalizeOnlineInviteRoomId(roomCode);
  if (!ONLINE_ROOM_CODE_REGEX.test(normalizedRoomCode)) return;
  const existingContext = readOnlineSessionContextFromStorage();
  if (existingContext && existingContext.roomCode === normalizedRoomCode) {
    clearOnlineSessionContext();
  }
}

function buildOnlineCurrentGamesEntry(summary, roomSummary = null, snapshotPayload = null) {
  const normalizedRoomCode = normalizeOnlineInviteRoomId(summary?.roomCode);
  const normalizedRole = normalizeOnlineResumeRole(summary?.role) || "host";
  if (!ONLINE_ROOM_CODE_REGEX.test(normalizedRoomCode)) return null;
  const joinState = normalizeOnlineJoinState(summary?.joinState);
  const normalizedRoomSummary = normalizeOnlineRoomSummary(roomSummary);
  const localPlayerIndex = normalizedRole === "host" ? 0 : 1;
  const hostName = String(normalizedRoomSummary?.hostName || "Player 1").trim() || "Player 1";
  const guestName = String(normalizedRoomSummary?.guestName || "Player 2").trim() || "Player 2";
  const localName = localPlayerIndex === 0 ? hostName : guestName;
  const remoteName = localPlayerIndex === 0 ? guestName : hostName;
  const hostScore = Number(normalizedRoomSummary?.hostScore ?? 0);
  const guestScore = Number(normalizedRoomSummary?.guestScore ?? 0);
  const localScore = localPlayerIndex === 0 ? hostScore : guestScore;
  const remoteScore = localPlayerIndex === 0 ? guestScore : hostScore;
  const roundValue = Number(normalizedRoomSummary?.round || 1);
  const normalizedRound = Number.isFinite(roundValue) && roundValue >= 1 ? Math.floor(roundValue) : 1;
  const summaryTurnOwnerRole =
    normalizedRoomSummary?.turnOwner === "host" || normalizedRoomSummary?.turnOwner === "guest"
      ? normalizedRoomSummary.turnOwner
      : "none";

  let status = "waiting";
  let statusLabel = "Waiting on opponent";
  let finished = false;
  if (joinState === "expired" || joinState === "closed") {
    finished = true;
    status = "finished";
    statusLabel = "Expired / unavailable";
  } else if (normalizedRoomSummary?.status === "expired" || normalizedRoomSummary?.status === "closed") {
    finished = true;
    status = "finished";
    statusLabel = "Expired / unavailable";
  } else if (normalizedRoomSummary?.finished === true || normalizedRoomSummary?.status === "finished") {
    finished = true;
    status = "finished";
    statusLabel = "Finished";
  } else if (summaryTurnOwnerRole === normalizedRole) {
    status = "your-turn";
    statusLabel = "Your turn";
  } else if (summaryTurnOwnerRole === "host" || summaryTurnOwnerRole === "guest") {
    status = "waiting";
    statusLabel = "Waiting on opponent";
  } else if (normalizedRoomSummary?.status === "waiting" || normalizedRole === "host" || joinState === "open") {
    status = "waiting";
    statusLabel = "Waiting on opponent";
  }

  const roomSummaryUpdatedAt = Number(normalizedRoomSummary?.updatedAt || 0);
  const summaryUpdatedAt = Number(summary?.updatedAt || 0);
  const snapshotUpdatedAt = Number(snapshotPayload?.updatedAt || 0);
  const resolvedUpdatedAt =
    roomSummaryUpdatedAt > 0
      ? roomSummaryUpdatedAt
      : summaryUpdatedAt > 0
        ? summaryUpdatedAt
        : snapshotUpdatedAt > 0
          ? snapshotUpdatedAt
          : Date.now();
  const normalizedTurnOwner =
    summaryTurnOwnerRole === normalizedRole
      ? 0
      : summaryTurnOwnerRole === (normalizedRole === "host" ? "guest" : "host")
        ? 1
        : null;
  return {
    id: buildOnlineCurrentGamesEntryId(normalizedRoomCode, normalizedRole),
    mode: "online",
    title: `vs ${remoteName}`,
    playerNames: [localName, remoteName],
    round: normalizedRound,
    scoreSnapshot: {
      p0: Number.isFinite(localScore) ? localScore : 0,
      p1: Number.isFinite(remoteScore) ? remoteScore : 0,
    },
    turnOwner: normalizedTurnOwner,
    status,
    updatedAt: Number.isFinite(resolvedUpdatedAt) && resolvedUpdatedAt > 0 ? Math.floor(resolvedUpdatedAt) : Date.now(),
    finished,
    gameSnapshot: typeof snapshotPayload?.state === "string" ? snapshotPayload.state : "",
    roomCode: normalizedRoomCode,
    resumeRole: normalizedRole,
    onlineJoinState: joinState,
    onlineStatusLabel: statusLabel,
    onlineMonth: Number(normalizedRoomSummary?.month || normalizedRound),
  };
}

async function listOnlineCurrentGamesEntries() {
  currentGamesOnlineEntriesById.clear();
  const rtc = getRtcBridge();
  const entriesById = new Map();
  if (rtc && typeof rtc.listOwnRoomSummaries === "function") {
    let summaries = [];
    try {
      summaries = await rtc.listOwnRoomSummaries();
    } catch (err) {
      console.warn("[current-games] online room summary list failed", err);
      summaries = [];
    }
    await Promise.all(
      summaries.map(async (summary) => {
        const normalizedRole = normalizeOnlineResumeRole(summary?.role);
        const normalizedRoomCode = normalizeOnlineInviteRoomId(summary?.roomCode);
        if (!normalizedRole || !ONLINE_ROOM_CODE_REGEX.test(normalizedRoomCode)) return;
        let roomSummary = null;
        if (typeof rtc.readRoomSummaryByCode === "function") {
          try {
            roomSummary = await rtc.readRoomSummaryByCode(normalizedRoomCode);
          } catch (err) {
            console.warn("[current-games] online room summary read failed", { roomCode: normalizedRoomCode, err });
          }
        }
        let snapshotPayload = null;
        let snapshotSummary = null;
        const normalizedRoomSummary = normalizeOnlineRoomSummary(roomSummary);
        if (!isOnlineRoomSummaryComplete(normalizedRoomSummary) && typeof rtc.readRoomSnapshotByCode === "function") {
          try {
            snapshotPayload = await rtc.readRoomSnapshotByCode(normalizedRoomCode);
            snapshotSummary = buildOnlineRoomSummaryFromSnapshotPayload(snapshotPayload);
          } catch (err) {
            console.warn("[current-games] online snapshot fallback read failed", { roomCode: normalizedRoomCode, err });
          }
        }
        const effectiveRoomSummary = mergeOnlineRoomSummary(normalizedRoomSummary, snapshotSummary);
        if (
          effectiveRoomSummary &&
          snapshotSummary &&
          typeof rtc.writeRoomSummary === "function" &&
          !isOnlineRoomSummaryComplete(normalizedRoomSummary)
        ) {
          rtc.writeRoomSummary(normalizedRoomCode, effectiveRoomSummary).catch(() => {});
        }
        const entry = buildOnlineCurrentGamesEntry(
          {
            roomCode: normalizedRoomCode,
            role: normalizedRole,
            joinState: summary?.joinState,
            updatedAt: summary?.updatedAt,
          },
          effectiveRoomSummary,
          snapshotPayload
        );
        if (!entry) return;
        entriesById.set(entry.id, entry);
      })
    );
  }

  const storedContext = readOnlineSessionContextFromStorage();
  if (storedContext && entriesById.size === 0) {
    const fallbackRoomCode = normalizeOnlineInviteRoomId(storedContext.roomCode);
    let fallbackRole = normalizeOnlineResumeRole(storedContext.role);
    if (!ONLINE_ROOM_CODE_REGEX.test(fallbackRoomCode)) {
      clearOnlineSessionContext();
    } else {
      let fallbackSummary = {
        roomCode: fallbackRoomCode,
        role: fallbackRole || "host",
        joinState: "full",
        updatedAt: Date.now(),
      };
      if (rtc && typeof rtc.readRoomIndex === "function") {
        try {
          const roomIndex = await rtc.readRoomIndex(fallbackRoomCode);
          fallbackSummary.joinState = normalizeOnlineJoinState(roomIndex?.joinState);
          fallbackSummary.updatedAt = Number(roomIndex?.updatedAt || Date.now()) || Date.now();
          if (typeof rtc.readSelfMemberRole === "function") {
            try {
              const selfRole = await rtc.readSelfMemberRole(fallbackRoomCode);
              if (selfRole === "host" || selfRole === "guest") {
                fallbackRole = selfRole;
                fallbackSummary.role = selfRole;
              }
            } catch (err) {
              console.warn("[current-games] online fallback role read failed", { roomCode: fallbackRoomCode, err });
            }
          }
          if (fallbackSummary.joinState === "expired" || fallbackSummary.joinState === "closed") {
            clearOnlineSessionContext();
          } else if (fallbackRole) {
            if (storedContext.role !== fallbackRole) {
              persistOnlineSessionContext(fallbackRoomCode, fallbackRole);
            }
            if (typeof rtc.syncOwnRoomSummary === "function") {
              rtc.syncOwnRoomSummary(fallbackRoomCode, fallbackRole).catch(() => {});
            }
            let fallbackRoomSummary = null;
            if (typeof rtc.readRoomSummaryByCode === "function") {
              fallbackRoomSummary = await rtc.readRoomSummaryByCode(fallbackRoomCode).catch(() => null);
            }
            const normalizedFallbackRoomSummary = normalizeOnlineRoomSummary(fallbackRoomSummary);
            const fallbackSnapshot =
              !isOnlineRoomSummaryComplete(normalizedFallbackRoomSummary) &&
              rtc &&
              typeof rtc.readRoomSnapshotByCode === "function"
                ? await rtc.readRoomSnapshotByCode(fallbackRoomCode).catch(() => null)
                : null;
            const fallbackSnapshotSummary = buildOnlineRoomSummaryFromSnapshotPayload(fallbackSnapshot);
            const mergedFallbackSummary = mergeOnlineRoomSummary(normalizedFallbackRoomSummary, fallbackSnapshotSummary);
            if (
              mergedFallbackSummary &&
              fallbackSnapshotSummary &&
              typeof rtc.writeRoomSummary === "function" &&
              !isOnlineRoomSummaryComplete(normalizedFallbackRoomSummary)
            ) {
              rtc.writeRoomSummary(fallbackRoomCode, mergedFallbackSummary).catch(() => {});
            }
            const fallbackEntry = buildOnlineCurrentGamesEntry(fallbackSummary, mergedFallbackSummary, fallbackSnapshot);
            if (fallbackEntry) {
              entriesById.set(fallbackEntry.id, fallbackEntry);
            }
          }
        } catch (err) {
          console.warn("[current-games] online fallback room index read failed", { roomCode: fallbackRoomCode, err });
        }
      } else if (fallbackRole) {
        const fallbackEntry = buildOnlineCurrentGamesEntry(fallbackSummary, null);
        if (fallbackEntry) {
          entriesById.set(fallbackEntry.id, fallbackEntry);
        }
      }
    }
  }
  const entries = Array.from(entriesById.values()).sort(compareCurrentGamesMatches);
  for (const entry of entries) {
    currentGamesOnlineEntriesById.set(entry.id, entry);
  }
  return entries;
}

function setStartCurrentGamesStatus(message, isError = false) {
  const node = ui.startCurrentGamesStatus;
  if (!node) return;
  node.textContent = message || "";
  node.classList.toggle("error", Boolean(message && isError));
  node.classList.toggle("success", Boolean(message && !isError));
}

function setCurrentGamesCardsDisabled(disabled) {
  const listNode = ui.startCurrentGamesList;
  if (!listNode) return;
  const cards = listNode.querySelectorAll("button.current-games-card, button.current-games-delete");
  cards.forEach((card) => {
    card.disabled = Boolean(disabled);
  });
}

function buildCurrentGamesCard(savedMatch) {
  const row = document.createElement("div");
  row.className = "current-games-card-row";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "current-games-card";
  button.dataset.matchId = String(savedMatch.id || "");

  const head = document.createElement("div");
  head.className = "current-games-card-head";

  const chip = document.createElement("span");
  chip.className = "current-games-chip";
  chip.textContent = formatCurrentGamesModeLabel(savedMatch.mode);
  head.appendChild(chip);

  const updated = document.createElement("span");
  updated.className = "current-games-updated";
  updated.textContent = `Updated ${formatCurrentGamesUpdatedAt(savedMatch.updatedAt)}`;
  head.appendChild(updated);
  button.appendChild(head);

  const names = Array.isArray(savedMatch.playerNames) ? savedMatch.playerNames.filter(Boolean) : [];
  const title = String(savedMatch.title || (savedMatch.mode === "cpu" ? CPU_SAVE_TITLE : LOCAL_SAVE_TITLE)).trim();
  const isOnlineCard = savedMatch.mode === "online";
  const roundValue = Number(savedMatch.round || 1);
  const monthValue =
    isOnlineCard && Number.isFinite(Number(savedMatch.onlineMonth))
      ? Math.max(1, Math.min(12, Math.floor(Number(savedMatch.onlineMonth))))
      : roundValue;
  const monthName = describeMonthNameOnly(monthValue);
  const main = document.createElement("div");
  main.className = "current-games-main";
  if (savedMatch.mode === "cpu") {
    main.textContent = names.length > 0 ? `${title} - ${names.join(" vs ")}` : title;
  } else if (savedMatch.mode === "online") {
    main.textContent = title || "Online Match";
  } else {
    main.textContent = title || LOCAL_SAVE_TITLE;
  }
  button.appendChild(main);

  const roundMeta = document.createElement("div");
  roundMeta.className = "current-games-meta";
  roundMeta.textContent = `Round ${roundValue}`;
  button.appendChild(roundMeta);
  if (isOnlineCard) {
    const roomMeta = document.createElement("div");
    roomMeta.className = "current-games-meta current-games-meta-secondary";
    roomMeta.textContent = `Room ${String(savedMatch.roomCode || "----------")
      .trim()
      .toUpperCase()} | ${savedMatch.resumeRole === "host" ? "Host seat" : "Guest seat"}`;
    button.appendChild(roomMeta);
  }

  const p0 = Number(savedMatch.scoreSnapshot?.p0 || 0);
  const p1 = Number(savedMatch.scoreSnapshot?.p1 || 0);
  const p0Label = names[0] || "P1";
  const p1Label = names[1] || "P2";
  const scoreLine = document.createElement("div");
  scoreLine.className = "current-games-score-line";
  const p0Score = document.createElement("span");
  p0Score.className = "current-games-score-p1";
  p0Score.textContent = `${p0Label} Score ${p0}`;
  const divider = document.createElement("span");
  divider.className = "current-games-score-divider";
  divider.textContent = "|";
  const p1Score = document.createElement("span");
  p1Score.className = "current-games-score-p2";
  p1Score.textContent = `${p1Label} Score ${p1}`;
  scoreLine.appendChild(p0Score);
  scoreLine.appendChild(divider);
  scoreLine.appendChild(p1Score);
  button.appendChild(scoreLine);

  const turnHandCount = getCurrentTurnHandCountFromSavedMatch(savedMatch);

  const statusRow = document.createElement("div");
  statusRow.className = "current-games-status-row";
  const status = document.createElement("div");
  status.className = "current-games-status";
  const statusMeta = buildCurrentGamesStatusMeta(savedMatch, p0Label, p1Label);
  if (statusMeta.className) {
    status.classList.add(statusMeta.className);
  }
  status.textContent = statusMeta.text;
  statusRow.appendChild(status);
  const side = document.createElement("div");
  side.className = "current-games-side";
  const month = document.createElement("div");
  month.className = "current-games-month";
  month.textContent = monthName;
  side.appendChild(month);
  if (!isOnlineCard && turnHandCount !== null && savedMatch.status !== "finished") {
    const hand = document.createElement("div");
    hand.className = "current-games-hand";
    hand.textContent = `Hand ${turnHandCount}/8`;
    side.appendChild(hand);
  }
  statusRow.appendChild(side);
  button.appendChild(statusRow);

  row.appendChild(button);
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "current-games-delete";
  deleteBtn.dataset.matchId = String(savedMatch.id || "");
  deleteBtn.textContent = savedMatch.mode === "online" ? "Leave" : "Delete";
  row.appendChild(deleteBtn);

  return row;
}

function renderCurrentGamesList(matches) {
  if (!ui.startCurrentGamesList || !ui.startCurrentGamesEmpty) return;
  ui.startCurrentGamesList.textContent = "";
  const entries = Array.isArray(matches) ? matches : [];
  if (!entries.length) {
    ui.startCurrentGamesEmpty.hidden = false;
    ui.startCurrentGamesEmpty.textContent = "No saved games for this mode.";
    return;
  }
  ui.startCurrentGamesEmpty.hidden = true;
  for (const match of entries) {
    ui.startCurrentGamesList.appendChild(buildCurrentGamesCard(match));
  }
}

async function refreshCurrentGamesPanel() {
  const panelNode = ui.startCurrentGamesPanel;
  if (!panelNode) return;
  if (!startModeLoadActive) {
    currentGamesOnlineEntriesById.clear();
    if (ui.startCurrentGamesList) ui.startCurrentGamesList.textContent = "";
    if (ui.startCurrentGamesEmpty) {
      ui.startCurrentGamesEmpty.hidden = true;
      ui.startCurrentGamesEmpty.textContent = "";
    }
    setStartCurrentGamesStatus("", false);
    return;
  }
  const normalizedMode = normalizeStartModeMenuMode(startModeMenuMode);
  if (!normalizedMode) return;
  const token = ++currentGamesRefreshToken;
  if (normalizedMode === "online") {
    setStartCurrentGamesStatus("Loading...", false);
    try {
      const onlineMatches = await listOnlineCurrentGamesEntries();
      if (token !== currentGamesRefreshToken) return;
      renderCurrentGamesList(onlineMatches);
      setStartCurrentGamesStatus("", false);
    } catch (err) {
      if (token !== currentGamesRefreshToken) return;
      console.warn("[current-games] Failed to read online resume matches.", err);
      renderCurrentGamesList([]);
      setStartCurrentGamesStatus("Could not load online resumes. Try again.", true);
    }
    return;
  }
  const saves = getSavesBridge();
  if (!saves) {
    renderCurrentGamesList([]);
    setStartCurrentGamesStatus("Device saves are unavailable on this build.", true);
    return;
  }
  setStartCurrentGamesStatus("Loading...", false);
  try {
    const all = await saves.listMatches();
    if (token !== currentGamesRefreshToken) return;
    const deviceMatches = all
      .filter((entry) => isDeviceCurrentGamesMatch(entry) && entry.mode === normalizedMode)
      .sort(compareCurrentGamesMatches);
    renderCurrentGamesList(deviceMatches);
    setStartCurrentGamesStatus("", false);
  } catch (err) {
    if (token !== currentGamesRefreshToken) return;
    console.warn("[current-games] Failed to read saved matches.", err);
    renderCurrentGamesList([]);
    setStartCurrentGamesStatus("Could not load saved matches. Try again.", true);
  }
}

function setStartCurrentGamesPanelOpen(open, mode = null) {
  if (!ui.startCurrentGamesPanel) return;
  const shouldOpen = Boolean(open);
  const normalizedMode = normalizeStartModeMenuMode(mode);
  if (shouldOpen && normalizedMode) {
    startModeMenuMode = normalizedMode;
    startModeLoadActive = false;
  }
  if (!shouldOpen) {
    startModeMenuMode = null;
    startModeLoadActive = false;
  }
  ui.startCurrentGamesPanel.hidden = !shouldOpen;
  if (shouldOpen) {
    const anchorButton = getStartModeMenuButton(startModeMenuMode);
    if (anchorButton) {
      anchorButton.insertAdjacentElement("afterend", ui.startCurrentGamesPanel);
    } else if (ui.startModeActions) {
      ui.startModeActions.appendChild(ui.startCurrentGamesPanel);
    }
  }
  if (ui.startCurrentGamesTitle) {
    ui.startCurrentGamesTitle.textContent = getStartModeMenuTitle(startModeMenuMode);
  }
  if (ui.startModeNewBtn) ui.startModeNewBtn.disabled = !shouldOpen;
  if (ui.startModeLoadBtn) ui.startModeLoadBtn.disabled = !shouldOpen;
  updateStartModeButtonStates();
  if (!shouldOpen) {
    currentGamesOnlineEntriesById.clear();
    if (ui.startCurrentGamesList) ui.startCurrentGamesList.textContent = "";
    if (ui.startCurrentGamesEmpty) {
      ui.startCurrentGamesEmpty.hidden = true;
      ui.startCurrentGamesEmpty.textContent = "";
    }
    setStartCurrentGamesStatus("", false);
    setCurrentGamesCardsDisabled(false);
    return;
  }
  setStartDeckPanelOpen(false);
  setStartThemePanelOpen(false);
  setStartOnlinePanelOpen(false);
  setStartManualLoadVisible(false);
  if (ui.startCurrentGamesList) ui.startCurrentGamesList.textContent = "";
  if (ui.startCurrentGamesEmpty) {
    ui.startCurrentGamesEmpty.hidden = true;
    ui.startCurrentGamesEmpty.textContent = "";
  }
  setStartCurrentGamesStatus("", false);
}

function setStartDeckPanelOpen(open) {
  if (!ui.startDeckPanel) return;
  const shouldOpen = Boolean(open);
  ui.startDeckPanel.hidden = !shouldOpen;
  if (shouldOpen) {
    if (ui.startDeckBtn) {
      ui.startDeckBtn.insertAdjacentElement("afterend", ui.startDeckPanel);
    } else if (ui.startModeActions) {
      ui.startModeActions.appendChild(ui.startDeckPanel);
    }
    setStartCurrentGamesPanelOpen(false);
    setStartThemePanelOpen(false);
    setStartOnlinePanelOpen(false);
    setStartManualLoadVisible(false);
  }
  renderDeckUi();
}

function onStartDeckToggleFromMenu() {
  const nextOpen = ui.startDeckPanel?.hidden !== false;
  setStartDeckPanelOpen(nextOpen);
}

function setStartThemePanelOpen(open) {
  if (!ui.startThemePanel) return;
  const shouldOpen = Boolean(open);
  ui.startThemePanel.hidden = !shouldOpen;
  if (shouldOpen) {
    if (ui.startThemeBtn) {
      ui.startThemeBtn.insertAdjacentElement("afterend", ui.startThemePanel);
    } else if (ui.startModeActions) {
      ui.startModeActions.appendChild(ui.startThemePanel);
    }
    setStartCurrentGamesPanelOpen(false);
    setStartDeckPanelOpen(false);
    setStartOnlinePanelOpen(false);
    setStartManualLoadVisible(false);
  }
  renderThemeUi();
}

function onStartThemeToggleFromMenu() {
  const nextOpen = ui.startThemePanel?.hidden !== false;
  setStartThemePanelOpen(nextOpen);
}

function onStartModeNewGame() {
  if (!state.ready) return;
  const mode = normalizeStartModeMenuMode(startModeMenuMode);
  if (!mode) return;
  if (mode === "cpu") {
    resetRtcSession({ closeConnection: true });
    hideStartMenu();
    startNewMatch({ playMode: "cpu", maxGames: state.startMatchLength });
    return;
  }
  if (mode === "local") {
    resetRtcSession({ closeConnection: true });
    hideStartMenu();
    startNewMatch({ playMode: "friend", friendFlow: "hybrid" });
    return;
  }
  if (mode === "online") {
    setStartCurrentGamesPanelOpen(false);
    void getOnlineStartController().onStartModeOnlineFromMenu();
  }
}

function onStartModeLoadGame() {
  const mode = normalizeStartModeMenuMode(startModeMenuMode);
  if (!mode) return;
  startModeLoadActive = !startModeLoadActive;
  updateStartModeButtonStates();
  void refreshCurrentGamesPanel();
}

async function resumeSavedMatchFromCurrentGames(matchId) {
  const resumeId = String(matchId || "").trim();
  if (!resumeId || currentGamesResumeInFlight || currentGamesDeleteInFlight) return;
  const mode = normalizeStartModeMenuMode(startModeMenuMode);
  if (!mode) return;
  if (mode === "online") {
    const onlineEntry = currentGamesOnlineEntriesById.get(resumeId);
    if (!onlineEntry) {
      setStartCurrentGamesStatus("That online game is no longer available.", true);
      await refreshCurrentGamesPanel();
      return;
    }
    currentGamesResumeInFlight = true;
    setCurrentGamesCardsDisabled(true);
    setStartCurrentGamesStatus("Resuming...", false);
    try {
      await handleOnlineReconnect(onlineEntry.roomCode, onlineEntry.resumeRole);
      setStartCurrentGamesStatus("", false);
    } catch (err) {
      console.warn(`[current-games] Could not resume online match ${resumeId}.`, err);
      const message = String(err?.message || "").toLowerCase();
      if (
        message.includes("expired") ||
        message.includes("closed") ||
        message.includes("not found") ||
        message.includes("rejoin denied")
      ) {
        const rtc = getRtcBridge();
        if (rtc && typeof rtc.removeOwnRoomSummary === "function") {
          await rtc.removeOwnRoomSummary(onlineEntry.roomCode).catch(() => {});
        }
        clearOnlineSessionContextForRoom(onlineEntry.roomCode);
        setStartCurrentGamesStatus("This online game is no longer available.", true);
      } else {
        setStartCurrentGamesStatus("Could not resume online game. Try again.", true);
      }
      await refreshCurrentGamesPanel();
    } finally {
      currentGamesResumeInFlight = false;
      if (ui.startMenu && !ui.startMenu.hidden) {
        setCurrentGamesCardsDisabled(false);
      }
    }
    return;
  }
  const saves = getSavesBridge();
  if (!saves) {
    setStartCurrentGamesStatus("Device saves are unavailable on this build.", true);
    return;
  }
  currentGamesResumeInFlight = true;
  setCurrentGamesCardsDisabled(true);
  setStartCurrentGamesStatus("Resuming...", false);
  try {
    const savedMatch = await saves.loadMatch(resumeId);
    if (!savedMatch || !isDeviceCurrentGamesMatch(savedMatch) || savedMatch.mode !== mode) {
      setStartCurrentGamesStatus("That saved match is no longer available.", true);
      await refreshCurrentGamesPanel();
      return;
    }
    const resumed =
      savedMatch.mode === "cpu"
        ? await resumeCpuMatchFromSavedMatch(savedMatch)
        : await resumeLocalMatchFromSavedMatch(savedMatch);
    if (resumed) {
      setStartCurrentGamesStatus("", false);
      return;
    }
    try {
      await saves.deleteMatch(resumeId);
    } catch (deleteErr) {
      console.warn(`[current-games] Could not remove malformed save ${resumeId}.`, deleteErr);
    }
    setStartCurrentGamesStatus("Saved match could not be resumed and was removed.", true);
    await refreshCurrentGamesPanel();
  } catch (err) {
    console.warn(`[current-games] Could not resume saved match ${resumeId}.`, err);
    setStartCurrentGamesStatus("Could not resume saved match. Try again.", true);
    await refreshCurrentGamesPanel();
  } finally {
    currentGamesResumeInFlight = false;
    if (ui.startMenu && !ui.startMenu.hidden) {
      setCurrentGamesCardsDisabled(false);
    }
  }
}

async function deleteSavedMatchFromCurrentGames(matchId) {
  const deleteId = String(matchId || "").trim();
  if (!deleteId || currentGamesDeleteInFlight || currentGamesResumeInFlight) return;
  const mode = normalizeStartModeMenuMode(startModeMenuMode);
  if (!mode) return;
  if (mode === "online") {
    const onlineEntry = currentGamesOnlineEntriesById.get(deleteId);
    currentGamesDeleteInFlight = true;
    setCurrentGamesCardsDisabled(true);
    setStartCurrentGamesStatus("Deleting...", false);
    try {
      const rtc = getRtcBridge();
      if (!onlineEntry) {
        setStartCurrentGamesStatus("That online game is no longer available.", true);
        await refreshCurrentGamesPanel();
        return;
      }
      if (rtc && typeof rtc.writeAbandoned === "function") {
        try {
          await rtc.writeAbandoned(onlineEntry.resumeRole, onlineEntry.roomCode);
        } catch (err) {
          console.warn(`[current-games] Online abandon signal failed for ${onlineEntry.roomCode}.`, err);
        }
      }
      if (rtc && typeof rtc.removeOwnRoomSummary === "function") {
        await rtc.removeOwnRoomSummary(onlineEntry.roomCode).catch(() => {});
      }
      clearOnlineSessionContextForRoom(onlineEntry.roomCode);
      setStartCurrentGamesStatus("Online game removed.", false);
      await refreshCurrentGamesPanel();
    } catch (err) {
      console.warn(`[current-games] Could not delete online match ${deleteId}.`, err);
      setStartCurrentGamesStatus("Could not remove online game. Try again.", true);
      await refreshCurrentGamesPanel();
    } finally {
      currentGamesDeleteInFlight = false;
      if (ui.startMenu && !ui.startMenu.hidden) {
        setCurrentGamesCardsDisabled(false);
      }
    }
    return;
  }
  const saves = getSavesBridge();
  if (!saves) {
    setStartCurrentGamesStatus("Device saves are unavailable on this build.", true);
    return;
  }
  currentGamesDeleteInFlight = true;
  setCurrentGamesCardsDisabled(true);
  setStartCurrentGamesStatus("Deleting...", false);
  try {
    const deleted = await saves.deleteMatch(deleteId);
    if (deleted) {
      if (cpuAutosaveMatchId === deleteId) cpuAutosaveMatchId = null;
      if (localAutosaveMatchId === deleteId) localAutosaveMatchId = null;
      setStartCurrentGamesStatus("Saved game deleted.", false);
    } else {
      setStartCurrentGamesStatus("That saved game is no longer available.", true);
    }
    await refreshCurrentGamesPanel();
  } catch (err) {
    console.warn(`[current-games] Could not delete saved match ${deleteId}.`, err);
    setStartCurrentGamesStatus("Could not delete saved game. Try again.", true);
    await refreshCurrentGamesPanel();
  } finally {
    currentGamesDeleteInFlight = false;
    if (ui.startMenu && !ui.startMenu.hidden) {
      setCurrentGamesCardsDisabled(false);
    }
  }
}

function onStartCurrentGamesListClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const deleteBtn = target.closest("button.current-games-delete");
  if (deleteBtn && ui.startCurrentGamesList && ui.startCurrentGamesList.contains(deleteBtn)) {
    const deleteId = String(deleteBtn.dataset.matchId || "").trim();
    if (!deleteId) return;
    void deleteSavedMatchFromCurrentGames(deleteId);
    return;
  }
  const card = target.closest("button.current-games-card");
  if (!card || !ui.startCurrentGamesList || !ui.startCurrentGamesList.contains(card)) return;
  const matchId = String(card.dataset.matchId || "").trim();
  if (!matchId) return;
  void resumeSavedMatchFromCurrentGames(matchId);
}

function generateCpuSaveMatchId() {
  const now = Date.now().toString(36).toUpperCase();
  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(6);
    window.crypto.getRandomValues(bytes);
    const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
    return `cpu-${now}-${suffix}`;
  }
  return `cpu-${now}`;
}

function isCpuAutosaveSafeCheckpoint() {
  if (!state.ready) return false;
  if (state.playMode !== "cpu") return false;
  if (!Array.isArray(state.players) || state.players.length !== 2) return false;
  if (state.pendingSelection || state.awaitingDeckFlip || state.awaitingDecision) return false;
  if (state.aiPreview || state.cpuPhase1PreviewCardId) return false;
  if (state.turnReplay.active) return false;
  return true;
}

function computeCpuSavedMatchStatus() {
  if (state.matchOver) return "finished";
  if (state.currentPlayer === 0 || state.roundOver) return "your-turn";
  return "waiting";
}

function buildCpuSavedMatchFromState() {
  if (!cpuAutosaveMatchId) {
    cpuAutosaveMatchId = generateCpuSaveMatchId();
  }
  const playerName = String(state.players[0]?.name || "You").trim() || "You";
  const cpuName = String(state.players[1]?.name || "CPU").trim() || "CPU";
  return {
    id: cpuAutosaveMatchId,
    mode: "cpu",
    title: CPU_SAVE_TITLE,
    playerNames: [playerName, cpuName],
    round: Number(state.gameNumber) || 1,
    scoreSnapshot: {
      p0: Number(state.players[0]?.score || 0),
      p1: Number(state.players[1]?.score || 0),
    },
    turnOwner: state.currentPlayer === 0 || state.currentPlayer === 1 ? state.currentPlayer : null,
    status: computeCpuSavedMatchStatus(),
    updatedAt: Date.now(),
    finished: Boolean(state.matchOver),
    gameSnapshot: encodeStateToCode(),
  };
}

function normalizeCpuResumeStateForSafety() {
  if (state.playMode !== "cpu") return;
  const isInStableStateZones = (cardId) => {
    if (!cardId) return false;
    if (Array.isArray(state.field) && state.field.some((card) => card?.id === cardId)) return true;
    if (Array.isArray(state.drawPile) && state.drawPile.some((card) => card?.id === cardId)) return true;
    if (!Array.isArray(state.players)) return false;
    for (const player of state.players) {
      if (!player) continue;
      if (Array.isArray(player.hand) && player.hand.some((card) => card?.id === cardId)) return true;
      if (Array.isArray(player.captured) && player.captured.some((card) => card?.id === cardId)) return true;
    }
    return false;
  };
  const rehomeOrphanDrawCard = (card, sourceLabel) => {
    const cardId = String(card?.id || "");
    if (!cardId) return;
    if (isInStableStateZones(cardId)) return;
    const canonicalCard = CARD_BY_ID.get(cardId) || card;
    if (!canonicalCard) return;
    if (!Array.isArray(state.field)) state.field = [];
    state.field.push(canonicalCard);
    console.warn(`[cpu-save] Re-homed orphan draw-phase card ${cardId} from ${sourceLabel}.`);
  };

  const pending = state.pendingSelection;
  if (pending && (pending.type === "drawMatch" || pending.type === "drawPlace")) {
    rehomeOrphanDrawCard(pending.drawnCard, "pendingSelection");
  }
  if (state.awaitingDeckFlip) {
    rehomeOrphanDrawCard(state.awaitingDeckFlip.drawnCard, "awaitingDeckFlip");
  }

  const hadTransientState =
    Boolean(state.pendingSelection) ||
    Boolean(state.awaitingDeckFlip) ||
    Boolean(state.awaitingDecision) ||
    Boolean(state.aiPreview) ||
    Boolean(state.cpuPhase1PreviewCardId) ||
    Boolean(state.turnReplay.active);
  if (!hadTransientState) return;

  clearRoundRuntimeTimers({
    resetTurnReplayVisual: true,
    resetDrawPreviewFxState: true,
  });
  state.pendingSelection = null;
  state.awaitingDeckFlip = null;
  state.awaitingDecision = null;
  state.aiPreview = null;
  state.cpuPhase1PreviewCardId = null;
  state.drawPreview = {
    cardId: null,
    text: "Waiting for draw.",
  };
}

async function persistCpuAutosave(reason, options = {}) {
  const { force = false } = options;
  if (state.playMode !== "cpu") return false;
  if (state.matchOver) return false;
  if (!force && !isCpuAutosaveSafeCheckpoint()) return false;
  const saves = getSavesBridge();
  if (!saves) return false;

  let payload = null;
  try {
    payload = buildCpuSavedMatchFromState();
    const saved = await saves.saveMatch(payload);
    cpuAutosaveMatchId = saved.id;
    return true;
  } catch (err) {
    console.warn(`[cpu-save] Autosave failed (${reason || "unspecified"}).`, err);
    return false;
  }
}

function requestCpuAutosave(reason, options = {}) {
  void persistCpuAutosave(reason, options);
}

async function clearFinishedCpuAutosave(reason) {
  const saves = getSavesBridge();
  if (!saves) return false;
  const finishedId = cpuAutosaveMatchId;
  cpuAutosaveMatchId = null;
  if (!finishedId) return false;
  try {
    return await saves.deleteMatch(finishedId);
  } catch (err) {
    console.warn(`[cpu-save] Could not clear finished CPU save (${reason || "unspecified"}).`, err);
    return false;
  }
}

async function resumeCpuMatchFromSavedMatch(savedMatch) {
  if (!savedMatch || savedMatch.mode !== "cpu") return false;
  try {
    const snapshot = decodeGameCode(savedMatch.gameSnapshot);
    if (snapshot.playMode !== "cpu") {
      throw new Error("Saved snapshot mode is not CPU.");
    }
    applySnapshot(snapshot);
    normalizeCpuResumeStateForSafety();
    cpuAutosaveMatchId = savedMatch.id;
    state.rtcWaiting = false;
    hideStartMenu();
    setCodePanelOpen(false);
    renderAll();
    if (!state.roundOver && !state.matchOver && !state.players[state.currentPlayer]?.isHuman) {
      queueAITurn(420);
    }
    requestCpuAutosave("resume-normalized");
    return true;
  } catch (err) {
    console.warn(`[cpu-save] Failed to resume saved CPU match ${savedMatch.id}.`, err);
    return false;
  }
}

function isLocalPassAndPlayMode() {
  return isFriendMode() && !isOnlineFriendSessionActive();
}

function isLocalPassAndPlayUiEnabled() {
  return LOCAL_PASS_AND_PLAY_UI_ENABLED;
}

function isLocalPassAndPlayAutosaveEnabled() {
  return LOCAL_PASS_AND_PLAY_AUTOSAVE_ENABLED && isLocalPassAndPlayMode();
}

function generateLocalSaveMatchId() {
  const now = Date.now().toString(36).toUpperCase();
  if (window.crypto && typeof window.crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(6);
    window.crypto.getRandomValues(bytes);
    const suffix = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").toUpperCase();
    return `local-${now}-${suffix}`;
  }
  return `local-${now}`;
}

function isLocalAutosaveSafeCheckpoint() {
  if (!state.ready) return false;
  if (!isLocalPassAndPlayMode()) return false;
  if (!Array.isArray(state.players) || state.players.length !== 2) return false;
  if (state.pendingSelection || state.awaitingDeckFlip || state.awaitingDecision) return false;
  if (state.aiPreview || state.cpuPhase1PreviewCardId) return false;
  if (state.turnReplay.active) return false;
  return true;
}

function computeLocalSavedMatchStatus() {
  if (state.matchOver) return "finished";
  if (state.interstitial?.open) return "pass-device";
  return "your-turn";
}

function buildLocalSavedMatchFromState() {
  if (!localAutosaveMatchId) {
    localAutosaveMatchId = generateLocalSaveMatchId();
  }
  const p0Name = String(state.players[0]?.name || "Player 1").trim() || "Player 1";
  const p1Name = String(state.players[1]?.name || "Player 2").trim() || "Player 2";
  return {
    id: localAutosaveMatchId,
    mode: "local",
    title: LOCAL_SAVE_TITLE,
    playerNames: [p0Name, p1Name],
    round: Number(state.gameNumber) || 1,
    scoreSnapshot: {
      p0: Number(state.players[0]?.score || 0),
      p1: Number(state.players[1]?.score || 0),
    },
    turnOwner: state.currentPlayer === 0 || state.currentPlayer === 1 ? state.currentPlayer : null,
    status: computeLocalSavedMatchStatus(),
    updatedAt: Date.now(),
    finished: Boolean(state.matchOver),
    gameSnapshot: encodeStateToCode(),
  };
}

function normalizeLocalResumeStateForSafety() {
  if (!isFriendMode()) return;

  const isInStableStateZones = (cardId) => {
    if (!cardId) return false;
    if (Array.isArray(state.field) && state.field.some((card) => card?.id === cardId)) return true;
    if (Array.isArray(state.drawPile) && state.drawPile.some((card) => card?.id === cardId)) return true;
    if (!Array.isArray(state.players)) return false;
    for (const player of state.players) {
      if (!player) continue;
      if (Array.isArray(player.hand) && player.hand.some((card) => card?.id === cardId)) return true;
      if (Array.isArray(player.captured) && player.captured.some((card) => card?.id === cardId)) return true;
    }
    return false;
  };
  const rehomeOrphanDrawCard = (card, sourceLabel) => {
    const cardId = String(card?.id || "");
    if (!cardId) return;
    if (isInStableStateZones(cardId)) return;
    const canonicalCard = CARD_BY_ID.get(cardId) || card;
    if (!canonicalCard) return;
    if (!Array.isArray(state.field)) state.field = [];
    state.field.push(canonicalCard);
    console.warn(`[local-save] Re-homed orphan draw-phase card ${cardId} from ${sourceLabel}.`);
  };

  const pending = state.pendingSelection;
  if (pending && (pending.type === "drawMatch" || pending.type === "drawPlace")) {
    rehomeOrphanDrawCard(pending.drawnCard, "pendingSelection");
  }
  if (state.awaitingDeckFlip) {
    rehomeOrphanDrawCard(state.awaitingDeckFlip.drawnCard, "awaitingDeckFlip");
  }

  const hadTransientState =
    Boolean(state.pendingSelection) ||
    Boolean(state.awaitingDeckFlip) ||
    Boolean(state.awaitingDecision) ||
    Boolean(state.aiPreview) ||
    Boolean(state.cpuPhase1PreviewCardId) ||
    Boolean(state.turnReplay.active);

  if (hadTransientState) {
    clearRoundRuntimeTimers({
      resetTurnReplayVisual: true,
      resetDrawPreviewFxState: true,
    });
    state.pendingSelection = null;
    state.awaitingDeckFlip = null;
    state.awaitingDecision = null;
    state.aiPreview = null;
    state.cpuPhase1PreviewCardId = null;
    state.drawPreview = {
      cardId: null,
      text: "Waiting for draw.",
    };
  }

  if (!state.roundOver && !state.matchOver) {
    const nextPlayerIndex = state.currentPlayer === 0 || state.currentPlayer === 1 ? state.currentPlayer : 0;
    state.viewerPlayerIndex = nextPlayerIndex === 0 ? 1 : 0;
    setFriendInterstitialOpen(true, nextPlayerIndex);
  }
}

async function persistLocalAutosave(reason, options = {}) {
  const { force = false } = options;
  if (!isLocalPassAndPlayAutosaveEnabled()) return false;
  if (state.matchOver) return false;
  if (!force && !isLocalAutosaveSafeCheckpoint()) return false;
  const saves = getSavesBridge();
  if (!saves) return false;
  try {
    const payload = buildLocalSavedMatchFromState();
    const saved = await saves.saveMatch(payload);
    localAutosaveMatchId = saved.id;
    return true;
  } catch (err) {
    console.warn(`[local-save] Autosave failed (${reason || "unspecified"}).`, err);
    return false;
  }
}

function requestLocalAutosave(reason, options = {}) {
  void persistLocalAutosave(reason, options);
}

async function clearFinishedLocalAutosave(reason) {
  const saves = getSavesBridge();
  if (!saves) return false;
  const finishedId = localAutosaveMatchId;
  localAutosaveMatchId = null;
  if (!finishedId) return false;
  try {
    return await saves.deleteMatch(finishedId);
  } catch (err) {
    console.warn(`[local-save] Could not clear finished Local save (${reason || "unspecified"}).`, err);
    return false;
  }
}

async function resumeLocalMatchFromSavedMatch(savedMatch) {
  if (!savedMatch || savedMatch.mode !== "local") return false;
  if (savedMatch.finished) return false;
  try {
    resetRtcSession({ closeConnection: true });
    const snapshot = decodeGameCode(savedMatch.gameSnapshot);
    if (snapshot.playMode !== "friend") {
      throw new Error("Saved snapshot mode is not Local Multiplayer.");
    }
    applySnapshot(snapshot);
    // Local resume must not inherit stale online RTC metadata from snapshots.
    resetRtcSession({ closeConnection: true });
    cpuAutosaveMatchId = null;
    localAutosaveMatchId = savedMatch.id;
    state.rtcWaiting = false;
    hideStartMenu();
    normalizeLocalResumeStateForSafety();
    if (!state.roundOver && !state.matchOver) {
      const current = state.currentPlayer === 0 || state.currentPlayer === 1 ? state.currentPlayer : 0;
      if (!state.interstitial?.open) {
        state.viewerPlayerIndex = current;
      }
    }
    setCodePanelOpen(false);
    renderAll();
    requestLocalAutosave("resume-normalized");
    return true;
  } catch (err) {
    console.warn(`[local-save] Failed to resume saved Local match ${savedMatch.id}.`, err);
    return false;
  }
}

function renderRtcStatusBadge() {
  return getOnlineStartController().renderRtcStatusBadge();
}

function cacheUI() {
  ui.cpuScoreInline = document.getElementById("cpu-score-inline");
  ui.playerScoreInline = document.getElementById("player-score-inline");
  ui.turnMeta = document.getElementById("turn-meta");
  ui.rtcStatusBadge = document.getElementById("rtc-status-badge");
  ui.rtcStatusDot = document.getElementById("rtc-status-dot");
  ui.rtcStatusText = document.getElementById("rtc-status-text");
  ui.onlineRoomUrlBtn = document.getElementById("online-room-url-btn");
  ui.gameSummaryToggle = document.getElementById("game-summary-toggle");
  ui.mainMenuBtn = document.getElementById("main-menu-btn");
  ui.deckToggle = document.getElementById("deck-toggle");
  ui.themeToggle = document.getElementById("theme-toggle");
  ui.deckPanel = document.getElementById("deck-panel");
  ui.deckPanelStatus = document.getElementById("deck-panel-status");
  ui.deckPanelList = document.getElementById("deck-panel-list");
  ui.themePanel = document.getElementById("theme-panel");
  ui.themePanelList = document.getElementById("theme-panel-list");
  ui.gameSummaryPanel = document.getElementById("game-summary-panel");
  ui.roundSummaryBody = document.getElementById("round-summary-body");
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
  ui.capturedZone = document.getElementById("captured-zone");
  ui.handLockNote = document.getElementById("hand-lock-note");
  ui.cpuCaptured = document.getElementById("cpu-captured");
  ui.playerCaptured = document.getElementById("player-captured");
  ui.contextZone = document.getElementById("context-zone");
  ui.contextStatus = document.getElementById("context-status");
  ui.contextStatusTitle = document.getElementById("context-status-title");
  ui.contextStatusDetail = document.getElementById("context-status-detail");
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
  ui.startModeActions = document.getElementById("start-mode-actions");
  ui.startModeCpuBtn = document.getElementById("start-mode-cpu-btn");
  ui.startModeFriendBtn = document.getElementById("start-mode-friend-btn");
  ui.startModeOnlineBtn = document.getElementById("start-mode-online-btn");
  ui.startDeckBtn = document.getElementById("start-deck-btn");
  ui.startThemeBtn = document.getElementById("start-theme-btn");
  ui.startDeckPanel = document.getElementById("start-deck-panel");
  ui.startDeckStatus = document.getElementById("start-deck-status");
  ui.startDeckList = document.getElementById("start-deck-list");
  ui.startThemePanel = document.getElementById("start-theme-panel");
  ui.startThemeList = document.getElementById("start-theme-list");
  ui.startCurrentGamesPanel = document.getElementById("start-current-games-panel");
  ui.startCurrentGamesTitle = document.getElementById("start-current-games-title");
  ui.startMatchLengthBtn = document.getElementById("start-match-length-btn");
  ui.startModeNewBtn = document.getElementById("start-mode-new-btn");
  ui.startModeLoadBtn = document.getElementById("start-mode-load-btn");
  ui.startCurrentGamesStatus = document.getElementById("start-current-games-status");
  ui.startCurrentGamesEmpty = document.getElementById("start-current-games-empty");
  ui.startCurrentGamesList = document.getElementById("start-current-games-list");
  ui.startSubtitle = document.getElementById("start-subtitle");
  ui.startExpiredNote = document.getElementById("start-expired-note");
  ui.startExpiredNoteText = document.getElementById("start-expired-note-text");
  ui.startExpiredNoteClose = document.getElementById("start-expired-note-close");
  ui.startOnlinePanel = document.getElementById("start-online-panel");
  ui.onlineMatchLengthBtn = document.getElementById("online-match-length-btn");
  ui.onlineHostBtn = document.getElementById("online-host-btn");
  ui.onlineBackBtn = document.getElementById("online-back-btn");
  ui.onlineMoveOrder = document.getElementById("online-move-order");
  ui.onlineMoveFirstBtn = document.getElementById("online-move-first-btn");
  ui.onlineMoveSecondBtn = document.getElementById("online-move-second-btn");
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
  ui.matchRecap = document.getElementById("match-recap");
  ui.matchRecapTitle = document.getElementById("match-recap-title");
  ui.matchRecapScore = document.getElementById("match-recap-score");
  ui.matchRecapDetail = document.getElementById("match-recap-detail");
  ui.matchRecapColYou = document.getElementById("match-recap-col-you");
  ui.matchRecapColCpu = document.getElementById("match-recap-col-cpu");
  ui.matchRecapBody = document.getElementById("match-recap-body");
}

function bindUI() {
  ui.playerHand.addEventListener("click", onPlayerHandClick);
  ui.field.addEventListener("click", onFieldClick);
  ui.capturedZone?.addEventListener("click", onCapturedZoneToggle);
  ui.drawPreview?.addEventListener("click", onDrawPreviewClick);
  ui.contextZone.addEventListener("click", onContextActionClick);
  ui.gameSummaryToggle?.addEventListener("click", onToggleGameSummaryPanel);
  ui.mainMenuBtn?.addEventListener("click", onMainMenuFromHeader);
  ui.deckToggle?.addEventListener("click", onToggleDeckPanel);
  ui.themeToggle?.addEventListener("click", onToggleThemePanel);
  ui.deckPanelList?.addEventListener("click", onDeckPickerClick);
  ui.themePanelList?.addEventListener("click", onThemePickerClick);
  ui.onlineRoomUrlBtn?.addEventListener("click", onOnlineRoomUrlCopy);
  ui.logToggle?.addEventListener("click", onToggleLogPanel);
  ui.codeToggle?.addEventListener("click", onToggleCodePanel);
  ui.copyLinkBtn?.addEventListener("click", onCopyLink);
  ui.toggleAdvancedBtn?.addEventListener("click", onToggleCodeAdvanced);
  ui.refreshCodeBtn?.addEventListener("click", onRefreshCode);
  ui.copyCodeBtn?.addEventListener("click", onCopyCode);
  ui.loadCodeBtn?.addEventListener("click", onLoadCodeFromPanel);
  ui.closeCodeBtn?.addEventListener("click", () => {
    setCodePanelOpen(false);
  });
  ui.startModeCpuBtn?.addEventListener("click", onStartModeCpuFromMenu);
  ui.startModeFriendBtn?.addEventListener("click", onStartModeFriendFromMenu);
  ui.startModeOnlineBtn?.addEventListener("click", onStartModeOnlineFromMenu);
  ui.startDeckBtn?.addEventListener("click", onStartDeckToggleFromMenu);
  ui.startThemeBtn?.addEventListener("click", onStartThemeToggleFromMenu);
  ui.startDeckList?.addEventListener("click", onDeckPickerClick);
  ui.startThemeList?.addEventListener("click", onThemePickerClick);
  ui.startMatchLengthBtn?.addEventListener("click", onCycleStartMatchLength);
  ui.startModeNewBtn?.addEventListener("click", onStartModeNewGame);
  ui.startModeLoadBtn?.addEventListener("click", onStartModeLoadGame);
  ui.startCurrentGamesList?.addEventListener("click", onStartCurrentGamesListClick);
  ui.startExpiredNoteClose?.addEventListener("click", onStartExpiredNoteDismiss);
  ui.onlineHostBtn?.addEventListener("click", onOnlineHostFromMenu);
  ui.onlineMatchLengthBtn?.addEventListener("click", onCycleStartMatchLength);
  ui.onlineMoveFirstBtn?.addEventListener("click", () => {
    getOnlineStartController().setOnlineHostMovesFirst(true);
  });
  ui.onlineMoveSecondBtn?.addEventListener("click", () => {
    getOnlineStartController().setOnlineHostMovesFirst(false);
  });
  ui.onlineBackBtn?.addEventListener("click", onOnlineBackFromMenu);
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

function onCapturedZoneToggle() {
  if (!state.ready || !Array.isArray(state.players) || state.players.length < 2) return;
  if (ui.startMenu && !ui.startMenu.hidden) return;
  if (ui.friendInterstitial && !ui.friendInterstitial.hidden) return;
  toggleCaptureViewMode();
  renderAll();
}

function preloadSheets() {
  return ensureDeckAssetsLoaded(CLASSIC_DECK_ID).then((classicSheets) => {
    state.sprites = { ...classicSheets };
    return classicSheets;
  });
}

function showStartMenu() {
  state.startMatchLength = normalizeMatchLength(state.maxGames);
  if (state.playMode === "cpu" && Array.isArray(state.players) && state.players.length === 2) {
    requestCpuAutosave("show-start-menu");
  }
  if (isLocalPassAndPlayMode() && Array.isArray(state.players) && state.players.length === 2) {
    requestLocalAutosave("show-start-menu");
  }
  if (ui.startMenu) {
    ui.startMenu.hidden = false;
  }
  setStartOnlinePanelOpen(false);
  setStartManualLoadVisible(false);
  setFriendInterstitialOpen(false);
  setLogPanelOpen(false);
  setGameSummaryPanelOpen(false);
  setDeckPanelOpen(false);
  setThemePanelOpen(false);
  setCodePanelOpen(false);
  setStartDeckPanelOpen(false);
  setStartThemePanelOpen(false);
  setStartCurrentGamesPanelOpen(false);
  setCodeStatus("", false, "start");
  if (document.title !== "Koi-Koi") {
    document.title = "Koi-Koi";
  }
  renderDeckUi();
  renderThemeUi();
  renderStartMatchLengthUi();
  refreshStartMenuAsyncUx();
  refreshCurrentGamesPanel();
}

function hideStartMenu() {
  if (ui.startMenu) {
    ui.startMenu.hidden = true;
  }
  setStartDeckPanelOpen(false);
  setStartThemePanelOpen(false);
  setStartCurrentGamesPanelOpen(false);
  setStartOnlinePanelOpen(false);
  setStartManualLoadVisible(false);
  setFriendInterstitialOpen(false);
  renderStartMatchLengthUi();
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
  if (!ui.codePanel) return;
  ui.codePanel.hidden = !open;
  if (ui.codeToggle) {
    ui.codeToggle.textContent = open ? "Hide Code" : "Code";
  }
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
  if (nextOpen) {
    setDeckPanelOpen(false);
    setThemePanelOpen(false);
  }
  setGameSummaryPanelOpen(nextOpen);
}

function setDeckPanelOpen(open) {
  if (!ui.deckPanel) return;
  ui.deckPanel.hidden = !open;
  if (open) {
    setGameSummaryPanelOpen(false);
    setThemePanelOpen(false);
    setCodePanelOpen(false);
  }
  renderDeckUi();
}

function onToggleDeckPanel() {
  const nextOpen = ui.deckPanel?.hidden !== false;
  setDeckPanelOpen(nextOpen);
}

function onDeckPickerClick(event) {
  const button = event.target.closest("[data-deck-id]");
  if (!button) return;
  const deckId = button.dataset.deckId;
  if (!deckId) return;
  void setSelectedDeck(deckId);
}

function setThemePanelOpen(open) {
  if (!ui.themePanel) return;
  ui.themePanel.hidden = !open;
  if (open) {
    setDeckPanelOpen(false);
    setGameSummaryPanelOpen(false);
    setCodePanelOpen(false);
  }
  renderThemeUi();
}

function onToggleThemePanel() {
  const nextOpen = ui.themePanel?.hidden !== false;
  setThemePanelOpen(nextOpen);
}

function onThemePickerClick(event) {
  const button = event.target.closest("[data-theme-id]");
  if (!button) return;
  const themeId = button.dataset.themeId;
  if (!themeId) return;
  setSelectedTheme(themeId);
}

function onToggleCodePanel() {
  const nextOpen = ui.codePanel?.hidden !== false;
  if (nextOpen) {
    setDeckPanelOpen(false);
    setThemePanelOpen(false);
  }
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

function onMainMenuFromHeader() {
  showStartMenu();
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
  if (!ui.startCurrentGamesPanel?.hidden && startModeMenuMode === "cpu") {
    setStartCurrentGamesPanelOpen(false);
    return;
  }
  setStartCurrentGamesPanelOpen(true, "cpu");
}

function onStartModeFriendFromMenu() {
  if (!state.ready) return;
  if (!isLocalPassAndPlayUiEnabled()) {
    setStartCurrentGamesPanelOpen(false);
    setStartCurrentGamesStatus("", false);
    return;
  }
  if (!ui.startCurrentGamesPanel?.hidden && startModeMenuMode === "local") {
    setStartCurrentGamesPanelOpen(false);
    return;
  }
  setStartCurrentGamesPanelOpen(true, "local");
}

async function onStartModeOnlineFromMenu() {
  if (!state.ready) return;
  if (!ui.startCurrentGamesPanel?.hidden && startModeMenuMode === "online") {
    setStartCurrentGamesPanelOpen(false);
    return;
  }
  setStartCurrentGamesPanelOpen(true, "online");
}

async function onOnlineHostFromMenu() {
  return getOnlineStartController().onOnlineHostFromMenu();
}

function onOnlineBackFromMenu() {
  return getOnlineStartController().onOnlineBackFromMenu();
}

function onStartExpiredNoteDismiss() {
  return getOnlineStartController().dismissStartExpiredNote();
}

async function startOnlineSession(role) {
  return getOnlineStartController().startOnlineSession(role);
}

function onRtcReceiveTurnCode(rawPayload) {
  return getOnlineStartController().onRtcReceiveTurnCode(rawPayload);
}

async function onOnlineRoomUrlCopy() {
  const link = String(buildOnlineInviteLink(state.rtcRoomCode) || "").trim();
  if (!link) return;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(link);
      return;
    }
  } catch (_err) {
    // Fall back to execCommand path.
  }
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

function handleIncomingRtcSignal(signal) {
  return getOnlineSessionController().handleIncomingRtcSignal(signal);
}

function handleIncomingRtcPayload(rawPayload) {
  return getOnlineSessionController().handleIncomingRtcPayload(rawPayload);
}

function onStartLoadFromMenu() {
  setStartCurrentGamesPanelOpen(false);
  return getCodeIoController().onStartLoadFromMenu();
}

function setCodeStatus(message, isError, target = "panel") {
  const node = target === "start" ? ui.startMenuStatus : target === "friend" ? ui.friendInterstitialStatus : ui.codeStatus;
  if (!node) return;
  node.textContent = message || "";
  node.classList.toggle("error", Boolean(message && isError));
  node.classList.toggle("success", Boolean(message && !isError));
}

function setFriendInterstitialStatus(message, isError) {
  return getOnlineHandoffController().setFriendInterstitialStatus(message, isError);
}

function setFriendInterstitialOpen(open, nextPlayerIndex = null) {
  return getOnlineHandoffController().setFriendInterstitialOpen(open, nextPlayerIndex);
}

function onFriendInterstitialLoadCode() {
  return getOnlineHandoffController().onFriendInterstitialLoadCode();
}

async function readClipboardTextSafe() {
  return getCodeIoController().readClipboardTextSafe();
}

async function tryLoadFromClipboardOrManual(target) {
  return getCodeIoController().tryLoadFromClipboardOrManual(target);
}

function prepareFriendTurnHandoff(lastActorIndex, moveNumber, nextPlayerIndex) {
  return getOnlineHandoffController().prepareFriendTurnHandoff(lastActorIndex, moveNumber, nextPlayerIndex);
}

function dispatchFriendTurnHandoff(lastActorIndex, moveNumber, nextPlayerIndex) {
  return getOnlineHandoffController().dispatchFriendTurnHandoff(lastActorIndex, moveNumber, nextPlayerIndex);
}

async function onFriendInterstitialCopyCode() {
  return getOnlineHandoffController().onFriendInterstitialCopyCode();
}

function onFriendInterstitialContinue() {
  return getOnlineHandoffController().onFriendInterstitialContinue();
}

function onFriendBackToMenu() {
  return getOnlineHandoffController().onFriendBackToMenu();
}

function loadCodeIntoGame(rawInput, target = "panel", options = {}) {
  const allowNonCheckpointFriendImport = Boolean(options.allowNonCheckpointFriendImport);
  const allowMissingDrawPile = Boolean(options.allowMissingDrawPile);
  const normalized = extractCodeFromInput(rawInput);
  if (!normalized) {
    setCodeStatus("Paste a link or code first.", true, target);
    return false;
  }

  try {
    const snapshot = decodeGameCode(normalized, { allowMissingDrawPile });
    if (target === "friend" && snapshot.playMode !== "friend") {
      throw new Error("This is not a friend turn link");
    }
    if (target === "friend" && !allowNonCheckpointFriendImport) {
      validateFriendCodeSnapshotForImport(snapshot);
    }
    applySnapshot(snapshot, { allowMissingDrawPile });
    state.rtcWaiting = false;
    hideStartMenu();
    setCodePanelOpen(false);
    if (snapshot.playMode === "cpu") {
      if (!cpuAutosaveMatchId) {
        cpuAutosaveMatchId = generateCpuSaveMatchId();
      }
      requestCpuAutosave("manual-code-load");
    } else {
      cpuAutosaveMatchId = null;
    }
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

function createEmptyCapturedIdsByPlayer() {
  return [[], []];
}

function normalizeCapturedIdsByPlayer(source) {
  const safeSource = Array.isArray(source) && source.length === 2 ? source : createEmptyCapturedIdsByPlayer();
  return [0, 1].map((playerIndex) =>
    Array.isArray(safeSource[playerIndex]) ? safeSource[playerIndex].filter((cardId) => typeof cardId === "string") : []
  );
}

function normalizeRecentCapturedIdsByPlayer() {
  return normalizeCapturedIdsByPlayer(state.recentCapturedIdsByPlayer);
}

function normalizeTurnCapturedIdsByPlayer() {
  return normalizeCapturedIdsByPlayer(state.turnCapturedIdsByPlayer);
}

function clearRecentCapturedHighlights() {
  state.recentCapturedIdsByPlayer = createEmptyCapturedIdsByPlayer();
}

function clearTurnCapturedHighlights() {
  state.turnCapturedIdsByPlayer = createEmptyCapturedIdsByPlayer();
}

function clearCapturedHighlights() {
  clearRecentCapturedHighlights();
  clearTurnCapturedHighlights();
}

function addTurnCapturedHighlights(playerIndex, cards) {
  const next = normalizeTurnCapturedIdsByPlayer();
  const addedIds = Array.isArray(cards) ? cards.map((card) => card?.id).filter(Boolean) : [];
  next[playerIndex] = [...new Set([...next[playerIndex], ...addedIds])];
  state.turnCapturedIdsByPlayer = next;
}

function commitTurnCapturedHighlights(playerIndex) {
  const nextRecent = normalizeRecentCapturedIdsByPlayer();
  const nextTurn = normalizeTurnCapturedIdsByPlayer();
  nextRecent[playerIndex] = [...nextTurn[playerIndex]];
  nextTurn[playerIndex] = [];
  state.recentCapturedIdsByPlayer = nextRecent;
  state.turnCapturedIdsByPlayer = nextTurn;
}

function getHighlightedCapturedIds(playerIndex) {
  const turnGroups = normalizeTurnCapturedIdsByPlayer();
  if (turnGroups[playerIndex]?.length) {
    return turnGroups[playerIndex];
  }
  const recentGroups = normalizeRecentCapturedIdsByPlayer();
  return recentGroups[playerIndex] || [];
}

function getRecentCapturedIdSet(playerIndex) {
  return new Set(getHighlightedCapturedIds(playerIndex));
}

function getCaptureViewMode() {
  return state.captureViewMode === "collapsed" ? "collapsed" : "expanded";
}

function setCaptureViewMode(mode) {
  state.captureViewMode = mode === "collapsed" ? "collapsed" : "expanded";
}

function toggleCaptureViewMode() {
  setCaptureViewMode(getCaptureViewMode() === "collapsed" ? "expanded" : "collapsed");
}

function buildCaptureSummaryEntries(captured, highlightedIds = new Set()) {
  const entries = CAPTURE_SUMMARY_TYPES.map(({ type, label }) => ({
    type,
    label,
    count: 0,
    lastCardId: null,
    highlighted: false,
  }));
  const byType = new Map(entries.map((entry) => [entry.type, entry]));
  for (const card of Array.isArray(captured) ? captured : []) {
    const entry = byType.get(card?.type);
    if (!entry) continue;
    entry.count += 1;
    entry.lastCardId = card.id;
    if (highlightedIds.has(card.id)) {
      entry.highlighted = true;
    }
  }
  return entries;
}

function buildCaptureSummaryPayload(captured, highlightedIds = new Set()) {
  const summary = {};
  for (const entry of buildCaptureSummaryEntries(captured, highlightedIds)) {
    summary[entry.type] = {
      label: entry.label,
      count: entry.count,
      top_card: entry.lastCardId,
      highlighted: entry.highlighted,
    };
  }
  return summary;
}

function encodeStateToCode() {
  return getSnapshotCodec().encodeStateToCode();
}

function decodeGameCode(code, options = {}) {
  return getSnapshotCodec().decodeGameCode(code, options);
}

function migrateSnapshotToLatest(snapshot) {
  return getSnapshotCodec().migrateSnapshotToLatest(snapshot);
}

function migrateV2SnapshotToV3(snapshot) {
  return getSnapshotCodec().migrateV2SnapshotToV3(snapshot);
}

function buildSnapshot() {
  return getSnapshotCodec().buildSnapshot();
}

function validateSnapshot(snapshot, options = {}) {
  return getSnapshotCodec().validateSnapshot(snapshot, options);
}

function applySnapshot(snapshot, options = {}) {
  const result = getSnapshotCodec().applySnapshot(snapshot, options);
  setCaptureViewMode("expanded");
  clearCapturedHighlights();
  return result;
}

function hydratePendingSelection(pending) {
  return getSnapshotCodec().hydratePendingSelection(pending);
}

function hydrateAwaitingDeckFlip(flip) {
  return getSnapshotCodec().hydrateAwaitingDeckFlip(flip);
}

function hydrateAwaitingDecision(decision) {
  return getSnapshotCodec().hydrateAwaitingDecision(decision);
}

function hydrateAiPreview(aiPreview) {
  return getSnapshotCodec().hydrateAiPreview(aiPreview);
}

function normalizePlayMode(value) {
  return getSnapshotCodec().normalizePlayMode(value);
}

function normalizeFriendFlow(value) {
  return getSnapshotCodec().normalizeFriendFlow(value);
}

function normalizeInterstitial(interstitial) {
  return getSnapshotCodec().normalizeInterstitial(interstitial);
}

function createClosedRoundTransition() {
  return getSnapshotCodec().createClosedRoundTransition();
}

function normalizeRoundTransition(roundTransition, maxGames) {
  return getSnapshotCodec().normalizeRoundTransition(roundTransition, maxGames);
}

function normalizeLastExportMeta(meta) {
  return getSnapshotCodec().normalizeLastExportMeta(meta);
}

function normalizeTurnRecap(recap) {
  return getSnapshotCodec().normalizeTurnRecap(recap);
}

function validateRoundHistoryEntry(entry, idx, maxGames) {
  return getSnapshotCodec().validateRoundHistoryEntry(entry, idx, maxGames);
}

function normalizeRoundHistoryEntry(entry, idx, maxGames) {
  return getSnapshotCodec().normalizeRoundHistoryEntry(entry, idx, maxGames);
}

function validateHydratedStateCardOwnership() {
  return getSnapshotCodec().validateHydratedStateCardOwnership();
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
  return getSnapshotCodec().asInt(value, label);
}

function asPlayerIndex(value, label) {
  return getSnapshotCodec().asPlayerIndex(value, label);
}

function ensureNullablePlayerIndex(value, label) {
  return getSnapshotCodec().ensureNullablePlayerIndex(value, label);
}

function asNullablePlayerIndex(value, label) {
  return getSnapshotCodec().asNullablePlayerIndex(value, label);
}

function ensureCardId(id, label) {
  return getSnapshotCodec().ensureCardId(id, label);
}

function cardByIdOrThrow(id, label) {
  return getSnapshotCodec().cardByIdOrThrow(id, label);
}

function cardIdsToCards(ids, label) {
  return getSnapshotCodec().cardIdsToCards(ids, label);
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
  const resumeMatchId = typeof options.resumeMatchId === "string" ? options.resumeMatchId.trim() : "";
  const resumeLocalMatchId = typeof options.resumeLocalMatchId === "string" ? options.resumeLocalMatchId.trim() : "";
  const forcedDealer =
    options.forceDealerPlayerIndex === 0 || options.forceDealerPlayerIndex === 1 ? options.forceDealerPlayerIndex : null;
  const forcedCurrentPlayer =
    options.forceCurrentPlayerIndex === 0 || options.forceCurrentPlayerIndex === 1
      ? options.forceCurrentPlayerIndex
      : null;
  const maxGames = normalizeMatchLength(options.maxGames ?? state.startMatchLength ?? state.maxGames);
  clearRoundRuntimeTimers({
    resetTurnReplayVisual: true,
    resetDrawPreviewFxState: true,
  });
  setCaptureViewMode("expanded");
  state.playMode = playMode;
  state.friendFlow = friendFlow;
  state.maxGames = maxGames;
  state.startMatchLength = maxGames;
  const startingOnlineFriendSession = playMode === "friend" && Boolean(state.rtcRole && state.rtcRoomCode);
  cpuAutosaveMatchId = playMode === "cpu" ? (resumeMatchId || generateCpuSaveMatchId()) : null;
  localAutosaveMatchId =
    playMode === "friend" && !startingOnlineFriendSession
      ? (resumeLocalMatchId || generateLocalSaveMatchId())
      : null;
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
  clearCapturedHighlights();
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
  requestCpuAutosave("round-start");
  requestLocalAutosave("round-start");

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
  return isFriendMode() && !isOnlineFriendSessionActive();
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
  if (isOnlineFriendSessionActive() && (state.rtcStatus === "disconnected" || state.rtcStatus === "error")) return false;
  if (state.interstitial?.open && !isOnlineFriendSessionActive()) return false;
  if (isOnlineFriendSessionActive() && state.rtcWaiting) return true;
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
  addTurnCapturedHighlights(playerIndex, cards);
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
    commitTurnCapturedHighlights(playerIndex);
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
        commitTurnCapturedHighlights(playerIndex);
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
  return getAIController().getAIProfile();
}

function buildCapturedStats(captured, roundMonth) {
  return getAIController().buildCapturedStats(captured, roundMonth);
}

function estimateYakuThreatScore(captured, roundMonth) {
  return getAIController().estimateYakuThreatScore(captured, roundMonth);
}

function estimateCardThreatForPlayer(card, captured, roundMonth) {
  return getAIController().estimateCardThreatForPlayer(card, captured, roundMonth);
}

function estimatePlayerThreatIndex(playerIndex, game = state) {
  return getAIController().estimatePlayerThreatIndex(playerIndex, game);
}

function estimateHandOpportunity(playerIndex, game = state) {
  return getAIController().estimateHandOpportunity(playerIndex, game);
}

function chooseAIDecision(decision, game = state) {
  return getAIController().chooseAIDecision(decision, game);
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
    commitTurnCapturedHighlights(decision.playerIndex);
    resolveDeckExhaustion();
    return;
  }

  moveToNextPlayer();
}

function moveToNextPlayer() {
  const previousPlayerIndex = state.currentPlayer;
  const previousTurnNumber = state.moveCounts[previousPlayerIndex];
  commitTurnCapturedHighlights(previousPlayerIndex);
  commitTurnRecapForHandoff(previousPlayerIndex, previousTurnNumber);
  state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
  state.message = `${state.players[state.currentPlayer].name} to play. Table ${state.tableMultiplier}x.`;
  addSystemLog(state.message);
  if (isFriendMode()) {
    dispatchFriendTurnHandoff(previousPlayerIndex, previousTurnNumber, state.currentPlayer);
  } else {
    state.viewerPlayerIndex = 0;
  }
  requestCpuAutosave("turn-complete");
  requestLocalAutosave("turn-complete");
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

async function writeOnlineRoundTransitionSnapshot(context) {
  if (!isOnlineFriendSessionActive()) return true;
  const rtc = getRtcBridge();
  if (!rtc || typeof rtc.writeSnapshot !== "function") return false;
  let code = "";
  try {
    code = encodeStateForOnline();
  } catch (err) {
    console.warn(`[online] ${context}: snapshot encode failed`, err);
    return false;
  }
  try {
    const roomSummary = typeof buildOnlineRoomSummaryFromState === "function" ? buildOnlineRoomSummaryFromState() : null;
    const wroteSnapshot = await rtc.writeSnapshot(code, getOnlineSnapshotTurnIndex(), roomSummary);
    if (!wroteSnapshot) {
      console.warn(`[online] ${context}: snapshot write failed`);
    }
    return wroteSnapshot;
  } catch (err) {
    console.warn(`[online] ${context}: snapshot write threw`, err);
    return false;
  }
}

async function markRoundTransitionReady(playerIndex = null) {
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
  if (normalized === 0) state.roundTransition.acks.p0 = true;
  if (normalized === 1) state.roundTransition.acks.p1 = true;
  if (onlineLocalPlayerIndex !== null) {
    sendRtcSignal({
      type: "round-ready",
      playerIndex: normalized,
      gameNumber: state.gameNumber,
      nextGameNumber: state.roundTransition.nextGameNumber,
    });
    const savedReadySnapshot = await writeOnlineRoundTransitionSnapshot("round-ready-ack");
    if (!savedReadySnapshot) {
      if (normalized === 0) state.roundTransition.acks.p0 = false;
      if (normalized === 1) state.roundTransition.acks.p1 = false;
      setFriendInterstitialStatus("Could not save Ready state. Retry in a moment.", true);
      renderAll();
      return;
    }
  }
  if (isRoundTransitionReadyForAdvance()) {
    onNextGame();
    if (onlineLocalPlayerIndex !== null) {
      const savedNextRoundSnapshot = await writeOnlineRoundTransitionSnapshot("round-ready-advance");
      if (!savedNextRoundSnapshot) {
        setFriendInterstitialStatus("Next game started, but sync save failed. Reconnect if this persists.", true);
        renderAll();
      }
    }
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
    if (isOnlineFriendSessionActive()) {
      void Promise.resolve(syncOnlineMatchOverSnapshot())
        .then((synced) => {
          if (!synced) {
            addSystemLog("Final match sync failed online. Opponent may need to reconnect.");
          }
        })
        .catch(() => {
          addSystemLog("Final match sync failed online. Opponent may need to reconnect.");
        });
    }
  } else {
    openRoundTransition({
      winnerIndex: null,
      pointsAwarded: 0,
      noScore: true,
    });
    if (isOnlineFriendSessionActive()) {
      void Promise.resolve(syncOnlineRoundTransitionSnapshot())
        .then((synced) => {
          if (!synced) {
            addSystemLog("Round-end sync failed online. Waiting for automatic retry.");
          }
        })
        .catch(() => {
          addSystemLog("Round-end sync failed online. Waiting for automatic retry.");
        });
    }
    const nextMonth = describeMonthNameOnly(state.roundTransition.nextGameNumber);
    state.message = `Game End: No scorer. Next Game: ${nextMonth}.`;
    addSystemLog(state.message);
  }

  if (isOnlineFriendSessionActive() && state.roundTransition?.open && !state.matchOver) {
    applyOnlineWaitingStateFromCurrentTurn("round-transition-local");
  }

  renderAll();
  if (state.playMode === "cpu" && state.matchOver) {
    void clearFinishedCpuAutosave("match-over-draw");
  } else if (state.playMode === "cpu") {
    requestCpuAutosave("round-transition-draw");
  }
  if (isLocalPassAndPlayMode() && state.matchOver) {
    void clearFinishedLocalAutosave("match-over-draw");
  } else if (isLocalPassAndPlayMode()) {
    requestLocalAutosave("round-transition-draw");
  }
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
    if (isOnlineFriendSessionActive()) {
      void Promise.resolve(syncOnlineMatchOverSnapshot())
        .then((synced) => {
          if (!synced) {
            addSystemLog("Final match sync failed online. Opponent may need to reconnect.");
          }
        })
        .catch(() => {
          addSystemLog("Final match sync failed online. Opponent may need to reconnect.");
        });
    }
  } else {
    openRoundTransition({
      winnerIndex,
      pointsAwarded: scored,
      noScore: false,
    });
    if (isOnlineFriendSessionActive()) {
      void Promise.resolve(syncOnlineRoundTransitionSnapshot())
        .then((synced) => {
          if (!synced) {
            addSystemLog("Round-end sync failed online. Waiting for automatic retry.");
          }
        })
        .catch(() => {
          addSystemLog("Round-end sync failed online. Waiting for automatic retry.");
        });
    }
    const nextMonth = describeMonthNameOnly(state.roundTransition.nextGameNumber);
    state.message = `Game End: ${winner.name} wins ${scored}. Next Game: ${nextMonth}.`;
    addSystemLog(state.message);
  }

  if (isOnlineFriendSessionActive() && state.roundTransition?.open && !state.matchOver) {
    applyOnlineWaitingStateFromCurrentTurn("round-transition-local");
  }

  renderAll();
  if (state.playMode === "cpu" && state.matchOver) {
    void clearFinishedCpuAutosave("match-over-win");
  } else if (state.playMode === "cpu") {
    requestCpuAutosave("round-transition-win");
  }
  if (isLocalPassAndPlayMode() && state.matchOver) {
    void clearFinishedLocalAutosave("match-over-win");
  } else if (isLocalPassAndPlayMode()) {
    requestLocalAutosave("round-transition-win");
  }
}

function applyFinalMessage() {
  if (state.rtcRole && state.rtcRoomCode) {
    clearOnlineSessionContext();
  }
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
  return getAIController().queueAITurn(delayMs);
}

function performAITurn(playerIndex = getCpuPlayerIndex()) {
  return getAIController().performAITurn(playerIndex);
}

function scheduleAIStep(delayMs, task) {
  return getAIController().scheduleAIStep(delayMs, task);
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
  return getAIController().clearAITask();
}

function clearDrawRevealTask() {
  if (state.drawRevealTimer) {
    clearTimeout(state.drawRevealTimer);
  }
  state.drawRevealTimer = null;
}

function chooseAICard(playerIndex, game = state) {
  return getAIController().chooseAICard(playerIndex, game);
}

function evaluateAIMoveOption(playerIndex, card, fieldCard, profile, fieldCardsOverride = null, game = state) {
  return getAIController().evaluateAIMoveOption(playerIndex, card, fieldCard, profile, fieldCardsOverride, game);
}

function chooseBestMatchForAI(playerIndex, sourceCard, matches, game = state) {
  return getAIController().chooseBestMatchForAI(playerIndex, sourceCard, matches, game);
}

function typeValue(type) {
  return getAIController().typeValue(type);
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
  renderDocumentTitleAndOnlineRoomChip();
  renderRtcStatusBadge();
  renderDeckUi();
  renderThemeUi();
  renderStartMatchLengthUi();
  if (!Array.isArray(state.players) || state.players.length < 2 || !state.players[0] || !state.players[1]) {
    renderMatchRecap();
    state.autoFocusTargetKey = null;
    return;
  }
  renderTop();
  renderRoundSummary();
  renderMatchRecap();
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

function renderDocumentTitleAndOnlineRoomChip() {
  let nextTitle = "Koi-Koi";
  if (isOnlineFriendSessionActive()) {
    if (state.matchOver) {
      nextTitle = "Match Over - Koi-Koi";
    } else {
      const localPlayerIndex = getOnlineLocalPlayerIndex();
      const turnOwner = state.currentPlayer === 0 || state.currentPlayer === 1 ? state.currentPlayer : null;
      const waiting = state.rtcWaiting || localPlayerIndex === null || turnOwner === null || localPlayerIndex !== turnOwner;
      nextTitle = waiting ? "Waiting - Koi-Koi" : "Your turn - Koi-Koi";
    }
  }
  if (document.title !== nextTitle) {
    document.title = nextTitle;
  }
  if (!ui.onlineRoomUrlBtn) return;
  const showRoomUrl = isOnlineFriendSessionActive();
  const hasRoomCode = Boolean(String(state.rtcRoomCode || "").trim());
  ui.onlineRoomUrlBtn.hidden = !showRoomUrl;
  ui.onlineRoomUrlBtn.disabled = !showRoomUrl || !hasRoomCode;
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
  if (isFriendMode()) {
    if (isOnlineFriendSessionActive()) return Boolean(state.rtcWaiting);
    return Boolean(state.interstitial?.open);
  }
  return true;
}

function renderFriendInterstitial() {
  if (!ui.friendInterstitial) return;
  const savingOnlineTurn = isOnlineFriendSessionActive() && Boolean(state.rtcTurnSaveInFlight);
  const recoveryOnline =
    isOnlineFriendSessionActive() && (state.rtcStatus === "disconnected" || state.rtcStatus === "error");
  const onlineSessionActive = isOnlineFriendSessionActive();
  const open =
    isFriendMode() &&
    ((Boolean(state.interstitial?.open) && !onlineSessionActive) ||
      savingOnlineTurn ||
      recoveryOnline ||
      Boolean(state.rtcOpponentAbandoned));
  ui.friendInterstitial.hidden = !open;
  if (!open) return;

  const nextPlayerIndex =
    state.interstitial.nextPlayerIndex === null || state.interstitial.nextPlayerIndex === undefined
      ? state.currentPlayer
      : state.interstitial.nextPlayerIndex;
  const nextName = state.players[nextPlayerIndex]?.name || `Player ${nextPlayerIndex + 1}`;
  const previousPlayerIndex = nextPlayerIndex === 0 ? 1 : 0;
  const previousName = state.players[previousPlayerIndex]?.name || `Player ${previousPlayerIndex + 1}`;
  const previousHandCount = Array.isArray(state.players[previousPlayerIndex]?.hand)
    ? state.players[previousPlayerIndex].hand.length
    : null;
  const previousHandSummary =
    previousHandCount === null ? "" : ` (${previousName} ${Math.max(0, previousHandCount)}/8 cards left).`;
  if (ui.friendInterstitialTitle) {
    ui.friendInterstitialTitle.textContent = `Pass to ${nextName}`;
  }
  if (ui.friendInterstitialText) {
    const moveText = state.lastExportMeta
      ? ` (${previousName} move ${state.lastExportMeta.turnNumber})`
      : "";
    if (onlineSessionActive) {
      ui.friendInterstitialText.textContent = `${previousName}'s turn is complete${moveText}. Online sync is automatic.`;
    } else {
      ui.friendInterstitialText.textContent = `${previousName}'s turn is complete${previousHandSummary} Pass to ${nextName}.`;
    }
  }
  if (ui.friendContinueBtn) {
    ui.friendContinueBtn.hidden = false;
    ui.friendContinueBtn.disabled = false;
    ui.friendContinueBtn.textContent = `${nextName} Ready`;
  }
  if (ui.friendImportCode) {
    ui.friendImportCode.placeholder = onlineSessionActive
      ? "Online room sync is automatic."
      : "";
  }
  if (ui.friendCopyCodeBtn) {
    if (onlineSessionActive) {
      ui.friendCopyCodeBtn.hidden = false;
      ui.friendCopyCodeBtn.disabled = !String(state.rtcRoomCode || "").trim();
      ui.friendCopyCodeBtn.textContent = "Copy Game URL";
    } else {
      ui.friendCopyCodeBtn.hidden = !onlineSessionActive;
      ui.friendCopyCodeBtn.disabled = !onlineSessionActive || !isFriendTurnExportWindow();
      ui.friendCopyCodeBtn.textContent = "Copy Turn Link";
    }
  }
  if (ui.friendBackMenuBtn) {
    ui.friendBackMenuBtn.hidden = true;
    ui.friendBackMenuBtn.disabled = true;
  }
  if (ui.friendLoadCodeBtn) {
    ui.friendLoadCodeBtn.hidden = !onlineSessionActive;
    ui.friendLoadCodeBtn.disabled = !onlineSessionActive;
    ui.friendLoadCodeBtn.textContent = "Load Turn Link";
  }
  if (ui.friendManualLoadWrap) {
    ui.friendManualLoadWrap.hidden = !onlineSessionActive || !state.manualLoadFallback.friend;
  }
  if (state.rtcOpponentAbandoned) {
    if (ui.friendInterstitialTitle) {
      ui.friendInterstitialTitle.textContent = "Opponent Left";
    }
    if (ui.friendInterstitialText) {
      ui.friendInterstitialText.textContent = "Your opponent left this online game. Return to menu to host or join a new room.";
    }
    if (ui.friendContinueBtn) {
      ui.friendContinueBtn.hidden = true;
      ui.friendContinueBtn.disabled = true;
    }
    if (ui.friendLoadCodeBtn) {
      ui.friendLoadCodeBtn.hidden = true;
      ui.friendLoadCodeBtn.disabled = true;
    }
    if (ui.friendCopyCodeBtn) {
      ui.friendCopyCodeBtn.hidden = false;
      ui.friendCopyCodeBtn.disabled = !String(state.rtcRoomCode || "").trim();
      ui.friendCopyCodeBtn.textContent = "Copy Game URL";
    }
    if (ui.friendBackMenuBtn) {
      ui.friendBackMenuBtn.hidden = false;
      ui.friendBackMenuBtn.disabled = false;
      ui.friendBackMenuBtn.textContent = "Return to Menu";
    }
    return;
  }
  if (savingOnlineTurn) {
    if (ui.friendInterstitialTitle) {
      ui.friendInterstitialTitle.textContent = "Saving Turn";
    }
    if (ui.friendInterstitialText) {
      ui.friendInterstitialText.textContent = "Saving your turn to the room. Please wait...";
    }
    if (ui.friendContinueBtn) {
      ui.friendContinueBtn.hidden = true;
      ui.friendContinueBtn.disabled = true;
    }
    if (ui.friendLoadCodeBtn) {
      ui.friendLoadCodeBtn.hidden = true;
      ui.friendLoadCodeBtn.disabled = true;
    }
    if (ui.friendCopyCodeBtn) {
      ui.friendCopyCodeBtn.hidden = false;
      ui.friendCopyCodeBtn.disabled = !String(state.rtcRoomCode || "").trim();
      ui.friendCopyCodeBtn.textContent = "Copy Game URL";
    }
    if (ui.friendManualLoadWrap) ui.friendManualLoadWrap.hidden = true;
    if (ui.friendBackMenuBtn) {
      ui.friendBackMenuBtn.hidden = false;
      ui.friendBackMenuBtn.disabled = false;
      ui.friendBackMenuBtn.textContent = "Back to Menu";
    }
    return;
  }
  if (recoveryOnline) {
    const reconnecting = Boolean(state.rtcReconnectInFlight);
    const reconnectFailed = Boolean(state.rtcReconnectFailed);
    if (ui.friendInterstitialTitle) {
      ui.friendInterstitialTitle.textContent = reconnectFailed ? "Could Not Reconnect" : "Connection Lost";
    }
    if (ui.friendInterstitialText) {
      if (reconnecting) {
        ui.friendInterstitialText.textContent = "Connection lost. Reconnecting...";
      } else if (reconnectFailed) {
        ui.friendInterstitialText.textContent =
          "Could not reconnect automatically. Try reconnect or return to menu.";
      } else {
        ui.friendInterstitialText.textContent = "Online link dropped. Reconnect is in progress.";
      }
    }
    if (ui.friendContinueBtn) {
      ui.friendContinueBtn.hidden = true;
      ui.friendContinueBtn.disabled = true;
    }
    if (ui.friendLoadCodeBtn) {
      ui.friendLoadCodeBtn.hidden = !reconnectFailed;
      ui.friendLoadCodeBtn.disabled = reconnecting;
      ui.friendLoadCodeBtn.textContent = reconnecting ? "Reconnecting..." : "Try Reconnect";
    }
    if (ui.friendCopyCodeBtn) {
      ui.friendCopyCodeBtn.hidden = false;
      ui.friendCopyCodeBtn.disabled = !String(state.rtcRoomCode || "").trim();
      ui.friendCopyCodeBtn.textContent = "Copy Game URL";
    }
    if (ui.friendManualLoadWrap) ui.friendManualLoadWrap.hidden = true;
    if (ui.friendBackMenuBtn) {
      ui.friendBackMenuBtn.hidden = false;
      ui.friendBackMenuBtn.disabled = false;
      ui.friendBackMenuBtn.textContent = reconnectFailed ? "Return to Menu" : "Back to Menu";
    }
    return;
  }
  if (onlineSessionActive && !isFriendTurnExportWindow()) {
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
  ui.roundSummaryBody.innerHTML = buildRoundSummaryRowsHtml();
}

function buildRoundSummaryRowsHtml() {
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
  return rows.join("");
}

function getMatchRecapPayload() {
  if (!state.matchOver || !Array.isArray(state.players) || state.players.length < 2) {
    return {
      visible: false,
      title: "",
      scoreLine: "",
      detail: "",
    };
  }
  const p0 = Number(state.players[0]?.score || 0);
  const p1 = Number(state.players[1]?.score || 0);
  const localView = state.playMode === "cpu" || isOnlineFriendSessionActive();
  const viewerIndex = localView ? getViewerPlayerIndex() : null;
  const opponentIndex = viewerIndex === 0 ? 1 : 0;
  let title = "Draw";
  if (p0 !== p1) {
    if (localView && (viewerIndex === 0 || viewerIndex === 1)) {
      const viewerWon = (viewerIndex === 0 && p0 > p1) || (viewerIndex === 1 && p1 > p0);
      title = viewerWon ? "You Won" : "You Lost";
    } else {
      const winnerIndex = p0 > p1 ? 0 : 1;
      title = `${state.players[winnerIndex]?.name || `Player ${winnerIndex + 1}`} Won`;
    }
  }
  const scoreLine =
    localView && (viewerIndex === 0 || viewerIndex === 1)
      ? `${state.players[viewerIndex]?.score ?? 0} - ${state.players[opponentIndex]?.score ?? 0}`
      : `${p0} - ${p1}`;
  const detail =
    localView && (viewerIndex === 0 || viewerIndex === 1)
      ? `${state.players[viewerIndex]?.name || "You"} vs ${state.players[opponentIndex]?.name || "Opponent"}`
      : `${state.players[0]?.name || "Player 1"} vs ${state.players[1]?.name || "Player 2"}`;
  return {
    visible: true,
    title,
    scoreLine,
    detail,
  };
}

function renderMatchRecap() {
  const recap = getMatchRecapPayload();
  if (ui.capturedZone) ui.capturedZone.hidden = recap.visible;
  if (ui.fieldZone) ui.fieldZone.hidden = recap.visible;
  if (ui.playerZone) ui.playerZone.hidden = recap.visible;
  if (!ui.matchRecap) return;
  ui.matchRecap.hidden = !recap.visible;
  if (!recap.visible) return;
  if (ui.matchRecapTitle) ui.matchRecapTitle.textContent = recap.title;
  if (ui.matchRecapScore) ui.matchRecapScore.textContent = recap.scoreLine;
  if (ui.matchRecapDetail) ui.matchRecapDetail.textContent = recap.detail;
  if (ui.matchRecapColYou) ui.matchRecapColYou.textContent = getSummaryColumnLabel(0);
  if (ui.matchRecapColCpu) ui.matchRecapColCpu.textContent = getSummaryColumnLabel(1);
  if (ui.matchRecapBody) ui.matchRecapBody.innerHTML = buildRoundSummaryRowsHtml();
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

function installDevDebugHelpers() {
  window.debug_force_match_recap = (options = {}) => forceDebugMatchRecap(options);
}

function buildDebugRecapRoundHistory(maxGames, p0Score, p1Score) {
  const safeMaxGames = normalizeMatchLength(maxGames);
  const rows = [];
  let remainingP0 = Math.max(0, Number(p0Score) || 0);
  let remainingP1 = Math.max(0, Number(p1Score) || 0);
  for (let month = 1; month <= safeMaxGames; month += 1) {
    const monthsLeft = safeMaxGames - month + 1;
    const monthP0 = month === safeMaxGames ? remainingP0 : Math.min(remainingP0, Math.max(0, Math.ceil(remainingP0 / monthsLeft)));
    const monthP1 = month === safeMaxGames ? remainingP1 : Math.min(remainingP1, Math.max(0, Math.ceil(remainingP1 / monthsLeft)));
    remainingP0 -= monthP0;
    remainingP1 -= monthP1;
    const pointsAwarded = Math.max(monthP0, monthP1);
    const multiplier = pointsAwarded >= 12 ? 3 : pointsAwarded >= 6 ? 2 : pointsAwarded > 0 ? 1 : 1;
    rows.push({
      month,
      p0: monthP0,
      p1: monthP1,
      multiplier,
      noScore: monthP0 === 0 && monthP1 === 0,
    });
  }
  return rows;
}

function resolveDebugRecapScores(viewMode, result) {
  const normalizedView =
    viewMode === "online-host" || viewMode === "online-guest" || viewMode === "local" || viewMode === "cpu"
      ? viewMode
      : "cpu";
  const normalizedResult = result === "loss" || result === "draw" ? result : "win";
  if (normalizedResult === "draw") {
    return { p0: 12, p1: 12 };
  }
  if (normalizedView === "online-guest") {
    return normalizedResult === "win" ? { p0: 12, p1: 18 } : { p0: 18, p1: 12 };
  }
  return normalizedResult === "win" ? { p0: 18, p1: 12 } : { p0: 12, p1: 18 };
}

function forceDebugMatchRecap(options = {}) {
  const viewMode =
    options.view === "online-host" || options.view === "online-guest" || options.view === "local" || options.view === "cpu"
      ? options.view
      : "cpu";
  const result = options.result === "loss" || options.result === "draw" ? options.result : "win";
  const maxGames = normalizeMatchLength(options.maxGames);
  const names =
    options.names && typeof options.names === "object"
      ? options.names
      : {};
  const scores = resolveDebugRecapScores(viewMode, result);

  if (viewMode === "cpu") {
    state.playMode = "cpu";
    state.friendFlow = "hybrid";
    state.players = [
      createPlayer(String(names.you || "You"), true, "Player 1"),
      createPlayer(String(names.opponent || "CPU"), false, "CPU"),
    ];
    state.viewerPlayerIndex = 0;
    state.rtcRole = null;
    state.rtcRoomCode = "";
    state.rtcStatus = "idle";
  } else {
    state.playMode = "friend";
    state.friendFlow = "hybrid";
    state.players = [
      createPlayer(String(names.p1 || "Player 1"), true, "Player 1"),
      createPlayer(String(names.p2 || "Player 2"), true, "Player 2"),
    ];
    state.viewerPlayerIndex = viewMode === "online-guest" ? 1 : 0;
    if (viewMode === "local") {
      state.rtcRole = null;
      state.rtcRoomCode = "";
      state.rtcStatus = "idle";
    } else {
      state.rtcRole = viewMode === "online-guest" ? "guest" : "host";
      state.rtcRoomCode = "DEBUGMATCH";
      state.rtcStatus = "connected";
    }
  }

  state.ready = true;
  state.maxGames = maxGames;
  state.startMatchLength = maxGames;
  state.gameNumber = maxGames;
  state.matchOver = true;
  state.roundOver = true;
  state.roundTransition = createClosedRoundTransition();
  state.interstitial = { open: false, nextPlayerIndex: null };
  state.pendingSelection = null;
  state.awaitingDeckFlip = null;
  state.awaitingDecision = null;
  state.aiPreview = null;
  state.cpuPhase1PreviewCardId = null;
  state.turnReplay.active = false;
  state.drawPile = [];
  state.field = [];
  state.tableMultiplier = 1;
  state.lastKoiCaller = null;
  state.roundSpecialTwoXPlayer = null;
  state.nextRoundSpecialTwoXPlayer = null;
  state.rtcWaiting = false;
  state.rtcTurnSaveInFlight = false;
  state.rtcPendingStart = false;
  state.rtcReconnectInFlight = false;
  state.rtcReconnectFailed = false;
  state.rtcOpponentAbandoned = false;
  state.rtcOpponentAbandonedBy = "";
  state.players[0].score = scores.p0;
  state.players[1].score = scores.p1;
  state.players[0].hand = [];
  state.players[1].hand = [];
  state.players[0].captured = [];
  state.players[1].captured = [];
  state.players[0].yaku = { points: 0, names: [], triggerKeys: [] };
  state.players[1].yaku = { points: 0, names: [], triggerKeys: [] };
  state.roundHistory = buildDebugRecapRoundHistory(maxGames, scores.p0, scores.p1);
  clearCapturedHighlights();
  applyFinalMessage();
  renderAll();
  return {
    ok: true,
    view: viewMode,
    result,
    maxGames,
    recap: getMatchRecapPayload(),
  };
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
  const waitingOnlineView = isOnlineFriendSessionActive() && state.rtcWaiting && canRevealBottom;

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
  ui.playerHand.classList.toggle("waiting-view", waitingOnlineView);

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
  const waitingOnlineView = isOnlineFriendSessionActive() && state.rtcWaiting;
  if (ui.fieldZone) {
    ui.fieldZone.classList.toggle("waiting-view", waitingOnlineView);
  }
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

function paintCardFaceSprite(ctx, canvas, sheet, sprite) {
  if (!ctx || !canvas || !sheet || !sprite) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    sheet,
    sprite.x,
    sprite.y,
    sprite.w,
    sprite.h,
    0,
    0,
    canvas.width,
    canvas.height
  );
}

function paintPreviewFace(cardId, canvas) {
  const card = CARD_BY_ID.get(cardId);
  if (!card) return;
  const sprite = resolveCardSprite(card.id);
  if (!sprite) return;
  const sheet = getLoadedDeckSheet(sprite.deckId, sprite.sheet);
  const ctx = canvas.getContext("2d");
  if (!sheet || !ctx) return;
  paintCardFaceSprite(ctx, canvas, sheet, sprite);
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
      noteText =
        state.rtcRemotePresence === false
          ? "Waiting for opponent to reconnect. You can review the board, captures, and your hand."
          : "Waiting for opponent turn. You can review the board, captures, and your hand.";
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
  if (state.matchOver) {
    if (ui.capturedZone) ui.capturedZone.hidden = true;
    if (ui.cpuCaptured) ui.cpuCaptured.innerHTML = "";
    if (ui.playerCaptured) ui.playerCaptured.innerHTML = "";
    return;
  }
  const topPlayerIndex = getDisplayTopPlayerIndex();
  const bottomPlayerIndex = getDisplayBottomPlayerIndex();
  const cpuCaptured = getSortedCapturedForDisplay(state.players[topPlayerIndex].captured);
  const playerCaptured = getSortedCapturedForDisplay(state.players[bottomPlayerIndex].captured);
  const cpuRecentIds = getRecentCapturedIdSet(topPlayerIndex);
  const playerRecentIds = getRecentCapturedIdSet(bottomPlayerIndex);
  const captureViewMode = getCaptureViewMode();

  if (ui.capturedZone) {
    const collapsed = captureViewMode === "collapsed";
    ui.capturedZone.classList.toggle("is-collapsed", collapsed);
    ui.capturedZone.dataset.captureView = captureViewMode;
    ui.capturedZone.title = collapsed ? "Click to expand captures" : "Click to collapse captures";
  }

  const renderExpandedGrid = (cards, highlightedIds) =>
    cards
      .map(
        (card) =>
          `<div class="card mini badged${highlightedIds.has(card.id) ? " recent-capture" : ""}" data-card-type="${card.type}">${renderBadgedCardContent(card)}</div>`
      )
      .join("");

  const renderCollapsedGrid = (captured, highlightedIds) => {
    const entries = buildCaptureSummaryEntries(captured, highlightedIds);
    return `<div class="capture-summary-grid">${entries
      .map((entry) => {
        const lastCard = entry.lastCardId ? CARD_BY_ID.get(entry.lastCardId) : null;
        const preview = lastCard
          ? `<div class="card mini badged capture-summary-card${entry.highlighted ? " recent-capture" : ""}" data-card-type="${lastCard.type}">${renderBadgedCardContent(lastCard)}<span class="capture-summary-count">${entry.count}</span></div>`
          : `<div class="card mini capture-summary-card empty${entry.highlighted ? " recent-capture" : ""}" data-card-type="${entry.type}"><span class="capture-summary-empty" aria-hidden="true">${getCardTypeBadgeText(entry.type)}</span><span class="capture-summary-count">${entry.count}</span></div>`;
        return `<div class="capture-summary-tile${entry.highlighted ? " recent-capture" : ""}" data-card-type="${entry.type}"><div class="capture-summary-label">${entry.label}</div><div class="capture-summary-preview">${preview}</div></div>`;
      })
      .join("")}</div>`;
  };

  ui.cpuCaptured.innerHTML =
    captureViewMode === "collapsed"
      ? renderCollapsedGrid(state.players[topPlayerIndex].captured, cpuRecentIds)
      : renderExpandedGrid(cpuCaptured, cpuRecentIds);

  ui.playerCaptured.innerHTML =
    captureViewMode === "collapsed"
      ? renderCollapsedGrid(state.players[bottomPlayerIndex].captured, playerRecentIds)
      : renderExpandedGrid(playerCaptured, playerRecentIds);
}

function setContextButton(button, { text, action, disabled, primary = false }) {
  if (!button) return;
  button.textContent = text;
  button.dataset.action = action;
  button.disabled = Boolean(disabled);
  button.classList.toggle("primary", Boolean(primary));
}

function setContextStatus(title = "", detail = "") {
  if (!ui.contextStatus || !ui.contextStatusTitle || !ui.contextStatusDetail) return;
  const hasStatus = Boolean(title || detail);
  ui.contextStatus.hidden = !hasStatus;
  ui.contextStatusTitle.textContent = title;
  ui.contextStatusDetail.textContent = detail;
}

function renderContextBar() {
  if (!ui.contextLeftBtn || !ui.contextRightBtn) return;
  ui.contextZone.classList.remove("single-action", "is-waiting-online");
  ui.contextLeftBtn.hidden = false;
  ui.contextRightBtn.classList.remove("full");
  setContextStatus();

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

  if (state.rtcWaiting && isOnlineFriendSessionActive()) {
    const statusText =
      state.rtcStatus === "connected"
        ? "Connected"
        : state.rtcStatus === "connecting"
          ? "Connecting"
          : state.rtcStatus === "disconnected"
            ? "Disconnected"
            : state.rtcStatus === "error"
              ? "Connection error"
              : "Not connected";
    const detailParts = [statusText];
    if (state.rtcRoomCode) detailParts.push(`Room ${state.rtcRoomCode}`);
    detailParts.push(
      state.rtcRemotePresence === false ? "Opponent offline." : "Turn data updates automatically."
    );
    ui.contextZone.classList.add("is-waiting-online");
    setContextStatus("Waiting for opponent turn", detailParts.join(" • "));
    setContextButton(ui.contextLeftBtn, {
      text: "Copy URL",
      action: "wait-copy-url",
      disabled: !String(state.rtcRoomCode || "").trim(),
      primary: false,
    });
    setContextButton(ui.contextRightBtn, {
      text: "Leave Game",
      action: "wait-leave",
      disabled: false,
      primary: false,
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

  if (action === "wait-copy-url") {
    void onOnlineRoomUrlCopy();
    return;
  }

  if (action === "wait-leave") {
    onFriendBackToMenu();
    return;
  }

  if (action === "round-ready-p0") {
    void markRoundTransitionReady(0);
    return;
  }

  if (action === "round-ready-p1") {
    void markRoundTransitionReady(1);
    return;
  }

  if (action === "round-ready-local") {
    void markRoundTransitionReady();
    return;
  }

  if (action === "round-ready-online") {
    void markRoundTransitionReady();
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
    commitTurnCapturedHighlights(decision.playerIndex);
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
    const sprite = resolveCardSprite(card.id);
    const sheet = sprite ? getLoadedDeckSheet(sprite.deckId, sprite.sheet) : null;
    if (!sheet || !ctx) continue;
    paintCardFaceSprite(ctx, canvas, sheet, sprite);
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
      capture_view: getCaptureViewMode(),
      deck: {
        selected: getSelectedDeckId(),
        available: Object.keys(DECK_DEFS),
      },
      theme: {
        selected: getSelectedThemeId(),
        available: Object.keys(THEME_DEFS),
      },
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
    max_games: state.maxGames,
    deck: {
      selected: getSelectedDeckId(),
      available: Object.keys(DECK_DEFS),
    },
    theme: {
      selected: getSelectedThemeId(),
      available: Object.keys(THEME_DEFS),
    },
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
    capture_view: getCaptureViewMode(),
    match_recap: getMatchRecapPayload(),
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
      recent_captured: getHighlightedCapturedIds(bottomPlayerIndex),
      capture_summary: buildCaptureSummaryPayload(
        state.players[bottomPlayerIndex].captured,
        getRecentCapturedIdSet(bottomPlayerIndex)
      ),
      yaku_points: state.players[bottomPlayerIndex].yaku.points,
      yaku_names: state.players[bottomPlayerIndex].yaku.names,
    },
    cpu: {
      score: state.players[topPlayerIndex].score,
      hand_count: state.players[topPlayerIndex].hand.length,
      captured_count: state.players[topPlayerIndex].captured.length,
      recent_captured: getHighlightedCapturedIds(topPlayerIndex),
      capture_summary: buildCaptureSummaryPayload(
        state.players[topPlayerIndex].captured,
        getRecentCapturedIdSet(topPlayerIndex)
      ),
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
