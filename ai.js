(function attachAI() {
  // AI profiles, move scoring, decision policy, and AI step scheduling.

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

  function createAIController(deps) {
    const {
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
    } = deps;

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
function clearAITask() {
  if (state.aiTimer) {
    clearTimeout(state.aiTimer);
  }
  state.aiTimer = null;
  state.aiTask = null;
  state.aiPreview = null;
  state.cpuPhase1PreviewCardId = null;
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

    return {
      getAIProfile,
      buildCapturedStats,
      estimateYakuThreatScore,
      estimateCardThreatForPlayer,
      estimatePlayerThreatIndex,
      estimateHandOpportunity,
      chooseAIDecision,
      queueAITurn,
      performAITurn,
      scheduleAIStep,
      clearAITask,
      chooseAICard,
      evaluateAIMoveOption,
      chooseBestMatchForAI,
      typeValue,
    };
  }

  window.HKKAI = {
    DEFAULT_AI_PROFILE,
    AI_PROFILE_KEYS,
    AI_PROFILES,
    CPU_PROFILE_META,
    createAIController,
  };
})();
