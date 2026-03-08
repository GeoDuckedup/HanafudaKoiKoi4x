(function attachSaves() {
  // Device save-slot storage layer for V4 SavedMatch.
  // Phase 2B backend: localStorage-backed unified store for CPU + local multiplayer.
  // Phase 2C+ can layer autosave and UI wiring on top of this stable API.

  /** @typedef {'cpu'|'local'|'online'} SavedMatchMode */
  /** @typedef {'your-turn'|'waiting'|'pass-device'|'finished'} SavedMatchStatus */

  /**
   * @typedef {Object} SavedMatch
   * @property {string} id
   * @property {SavedMatchMode} mode
   * @property {string} title
   * @property {string[]} playerNames
   * @property {number} round
   * @property {{p0:number,p1:number}} scoreSnapshot
   * @property {0|1|null} turnOwner
   * @property {SavedMatchStatus} status
   * @property {number} updatedAt
   * @property {boolean} finished
   * @property {string} gameSnapshot
   */

  const VALID_MODES = new Set(["cpu", "local", "online"]);
  const VALID_STATUS = new Set(["your-turn", "waiting", "pass-device", "finished"]);
  const STORE_VERSION = 1;
  const STORE_KEY = "hkk_saved_matches_v1";

  function createEmptyStore() {
    return {
      version: STORE_VERSION,
      matches: {},
    };
  }

  function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  function normalizeString(value, label, { allowEmpty = false } = {}) {
    if (typeof value !== "string") {
      throw new Error(`${label} must be a string.`);
    }
    const normalized = value.trim();
    if (!allowEmpty && !normalized) {
      throw new Error(`${label} must be a non-empty string.`);
    }
    return normalized;
  }

  function normalizeId(id, label = "SavedMatch.id") {
    return normalizeString(id, label);
  }

  function normalizeSavedMatch(input, { requireAllFields = true } = {}) {
    if (!isPlainObject(input)) {
      throw new Error("SavedMatch must be an object.");
    }

    const has = (key) => Object.prototype.hasOwnProperty.call(input, key);
    const requireField = (key) => {
      if (requireAllFields && !has(key)) {
        throw new Error(`SavedMatch.${key} is required.`);
      }
    };

    requireField("id");
    requireField("mode");
    requireField("title");
    requireField("playerNames");
    requireField("round");
    requireField("scoreSnapshot");
    requireField("turnOwner");
    requireField("status");
    requireField("updatedAt");
    requireField("finished");
    requireField("gameSnapshot");

    const id = normalizeId(input.id);
    const mode = normalizeString(input.mode, "SavedMatch.mode");
    if (!VALID_MODES.has(mode)) {
      throw new Error("SavedMatch.mode must be cpu, local, or online.");
    }

    const title = normalizeString(input.title, "SavedMatch.title");

    if (!Array.isArray(input.playerNames)) {
      throw new Error("SavedMatch.playerNames must be an array.");
    }
    const playerNames = input.playerNames
      .map((name, index) => normalizeString(name, `SavedMatch.playerNames[${index}]`))
      .filter(Boolean);
    if (!playerNames.length) {
      throw new Error("SavedMatch.playerNames must include at least one name.");
    }

    const round = Number(input.round);
    if (!Number.isInteger(round) || round < 1) {
      throw new Error("SavedMatch.round must be an integer >= 1.");
    }

    if (!isPlainObject(input.scoreSnapshot)) {
      throw new Error("SavedMatch.scoreSnapshot must be an object.");
    }
    const p0 = Number(input.scoreSnapshot.p0);
    const p1 = Number(input.scoreSnapshot.p1);
    if (!Number.isFinite(p0) || !Number.isFinite(p1)) {
      throw new Error("SavedMatch.scoreSnapshot must contain numeric p0 and p1.");
    }

    const turnOwner = input.turnOwner;
    if (turnOwner !== 0 && turnOwner !== 1 && turnOwner !== null) {
      throw new Error("SavedMatch.turnOwner must be 0, 1, or null.");
    }

    const status = normalizeString(input.status, "SavedMatch.status");
    if (!VALID_STATUS.has(status)) {
      throw new Error("SavedMatch.status has an invalid value.");
    }

    const updatedAt = Number(input.updatedAt);
    if (!Number.isInteger(updatedAt) || updatedAt <= 0) {
      throw new Error("SavedMatch.updatedAt must be a positive integer timestamp.");
    }

    if (typeof input.finished !== "boolean") {
      throw new Error("SavedMatch.finished must be boolean.");
    }

    if (typeof input.gameSnapshot !== "string" || !input.gameSnapshot.trim()) {
      throw new Error("SavedMatch.gameSnapshot must be a non-empty string.");
    }
    const gameSnapshot = input.gameSnapshot;

    return {
      id,
      mode,
      title,
      playerNames,
      round,
      scoreSnapshot: {
        p0,
        p1,
      },
      turnOwner,
      status,
      updatedAt,
      finished: input.finished,
      gameSnapshot,
    };
  }

  function cloneSavedMatch(match) {
    return {
      ...match,
      playerNames: [...match.playerNames],
      scoreSnapshot: {
        p0: match.scoreSnapshot.p0,
        p1: match.scoreSnapshot.p1,
      },
    };
  }

  function getStorageOrThrow() {
    try {
      if (!window.localStorage) {
        throw new Error("localStorage unavailable");
      }
      return window.localStorage;
    } catch (_err) {
      throw new Error("HKKSaves localStorage is unavailable.");
    }
  }

  function readStoreSafe() {
    const storage = getStorageOrThrow();
    let raw = null;
    try {
      raw = storage.getItem(STORE_KEY);
    } catch (_err) {
      throw new Error("HKKSaves could not read from localStorage.");
    }
    if (!raw) {
      return createEmptyStore();
    }

    let parsed = null;
    try {
      parsed = JSON.parse(raw);
    } catch (_err) {
      console.warn("[HKKSaves] Ignoring malformed save store JSON.");
      return createEmptyStore();
    }

    if (!isPlainObject(parsed)) {
      console.warn("[HKKSaves] Ignoring malformed save store envelope.");
      return createEmptyStore();
    }

    if (parsed.version !== STORE_VERSION) {
      console.warn("[HKKSaves] Unsupported save store version. Using empty store.", parsed.version);
      return createEmptyStore();
    }

    if (!isPlainObject(parsed.matches)) {
      console.warn("[HKKSaves] Save store missing matches object. Using empty store.");
      return createEmptyStore();
    }

    const sanitizedMatches = {};
    for (const [id, rawMatch] of Object.entries(parsed.matches)) {
      try {
        const normalized = normalizeSavedMatch(rawMatch, { requireAllFields: true });
        sanitizedMatches[normalized.id] = normalized;
      } catch (err) {
        console.warn(`[HKKSaves] Dropping malformed SavedMatch '${id}':`, err);
      }
    }

    return {
      version: STORE_VERSION,
      matches: sanitizedMatches,
    };
  }

  function writeStoreSafe(store) {
    const storage = getStorageOrThrow();
    const envelope = createEmptyStore();
    if (isPlainObject(store) && isPlainObject(store.matches)) {
      for (const rawMatch of Object.values(store.matches)) {
        const normalized = normalizeSavedMatch(rawMatch, { requireAllFields: true });
        envelope.matches[normalized.id] = normalized;
      }
    }

    let serialized = "";
    try {
      serialized = JSON.stringify(envelope);
    } catch (_err) {
      throw new Error("HKKSaves could not serialize save store.");
    }

    try {
      storage.setItem(STORE_KEY, serialized);
    } catch (err) {
      throw new Error(`HKKSaves failed to persist device saves: ${err && err.message ? err.message : "localStorage write failed."}`);
    }

    return envelope;
  }

  function compareSavedMatches(a, b) {
    if (b.updatedAt !== a.updatedAt) return b.updatedAt - a.updatedAt;
    return a.id.localeCompare(b.id);
  }

  async function saveMatch(match) {
    const normalized = normalizeSavedMatch(match, { requireAllFields: true });
    const storedMatch = {
      ...normalized,
      updatedAt: Date.now(),
    };
    const store = readStoreSafe();
    store.matches[storedMatch.id] = storedMatch;
    writeStoreSafe(store);
    return cloneSavedMatch(storedMatch);
  }

  async function loadMatch(id) {
    const normalizedId = normalizeId(id, "loadMatch(id)");
    const store = readStoreSafe();
    const match = store.matches[normalizedId];
    return match ? cloneSavedMatch(match) : null;
  }

  async function listMatches() {
    const store = readStoreSafe();
    return Object.values(store.matches)
      .sort(compareSavedMatches)
      .map(cloneSavedMatch);
  }

  async function deleteMatch(id) {
    const normalizedId = normalizeId(id, "deleteMatch(id)");
    const store = readStoreSafe();
    if (!Object.prototype.hasOwnProperty.call(store.matches, normalizedId)) {
      return false;
    }
    delete store.matches[normalizedId];
    writeStoreSafe(store);
    return true;
  }

  window.HKKSaves = {
    saveMatch,
    loadMatch,
    listMatches,
    deleteMatch,
  };
})();
