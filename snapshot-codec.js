(function attachSnapshotCodec() {
  // Save-code snapshot serialization, migration, validation, and hydration.
  function createSnapshotCodec(deps) {
    const {
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
      computeCodeChecksum,
      computeTurnCheckpointReady,
      createPlayer,
      sortByMonth,
      computeYaku,
      setFriendInterstitialOpen,
      renderAll,
      playTurnRecapForViewer,
      resumeLoadedStateFlow,
      clearRoundRuntimeTimers,
    } = deps;

function encodeStateToCode() {
  const snapshot = buildSnapshot();
  const json = JSON.stringify(snapshot);
  const payload = encodeBase64UrlUtf8(json);
  const checksum = computeCodeChecksum(payload);
  return `${SAVE_CODE_PREFIX}.${payload}.${checksum}`;
}

function decodeGameCode(code, options = {}) {
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
  validateSnapshot(migrated, options);
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

function validateSnapshot(snapshot, options = {}) {
  const allowMissingDrawPile = Boolean(options.allowMissingDrawPile);
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
  if (!Array.isArray(snapshot.field)) {
    throw new Error("Snapshot must include a field array");
  }
  if (!allowMissingDrawPile && !Array.isArray(snapshot.drawPile)) {
    throw new Error("Snapshot must include a draw pile array");
  }
  if (allowMissingDrawPile && snapshot.drawPile !== undefined && snapshot.drawPile !== null && !Array.isArray(snapshot.drawPile)) {
    throw new Error("Snapshot draw pile must be an array when present");
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
  if (Array.isArray(snapshot.drawPile)) {
    snapshot.drawPile.forEach((id, idx) => ensureCardId(id, `drawPile[${idx}]`));
  }
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

function rebuildDrawPileFromPriorIds(previousDrawPileIds, snapshot) {
  const claimedIds = new Set();
  state.field.forEach((card) => claimedIds.add(card.id));
  state.players.forEach((player) => {
    player.hand.forEach((card) => claimedIds.add(card.id));
    player.captured.forEach((card) => claimedIds.add(card.id));
  });

  if (snapshot?.pendingSelection && typeof snapshot.pendingSelection === "object") {
    const pendingType = String(snapshot.pendingSelection.type || "");
    if ((pendingType === "drawMatch" || pendingType === "drawPlace") && snapshot.pendingSelection.drawnCardId) {
      claimedIds.add(String(snapshot.pendingSelection.drawnCardId));
    }
  }
  if (snapshot?.awaitingDeckFlip && typeof snapshot.awaitingDeckFlip === "object" && snapshot.awaitingDeckFlip.drawnCardId) {
    claimedIds.add(String(snapshot.awaitingDeckFlip.drawnCardId));
  }

  return previousDrawPileIds
    .filter((cardId) => !claimedIds.has(cardId))
    .map((cardId, index) => cardByIdOrThrow(cardId, `drawPile[reconstructed][${index}]`));
}

function applySnapshot(snapshot, options = {}) {
  const allowMissingDrawPile = Boolean(options.allowMissingDrawPile);
  const previousDrawPileIds = Array.isArray(state.drawPile) ? state.drawPile.map((card) => card.id) : [];
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
  if (Array.isArray(snapshot.drawPile)) {
    state.drawPile = cardIdsToCards(snapshot.drawPile, "drawPile");
  } else if (allowMissingDrawPile) {
    state.drawPile = rebuildDrawPileFromPriorIds(previousDrawPileIds, snapshot);
  } else {
    state.drawPile = cardIdsToCards(snapshot.drawPile, "drawPile");
  }
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
    return {
      encodeStateToCode,
      decodeGameCode,
      migrateSnapshotToLatest,
      migrateV2SnapshotToV3,
      buildSnapshot,
      validateSnapshot,
      applySnapshot,
      hydratePendingSelection,
      hydrateAwaitingDeckFlip,
      hydrateAwaitingDecision,
      hydrateAiPreview,
      normalizePlayMode,
      normalizeFriendFlow,
      normalizeInterstitial,
      createClosedRoundTransition,
      normalizeRoundTransition,
      normalizeLastExportMeta,
      normalizeTurnRecap,
      validateRoundHistoryEntry,
      normalizeRoundHistoryEntry,
      validateHydratedStateCardOwnership,
      asInt,
      asPlayerIndex,
      ensureNullablePlayerIndex,
      asNullablePlayerIndex,
      ensureCardId,
      cardByIdOrThrow,
      cardIdsToCards,
    };
  }

  window.HKKSnapshotCodec = {
    createSnapshotCodec,
  };
})();
