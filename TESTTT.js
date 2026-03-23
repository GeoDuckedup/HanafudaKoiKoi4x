(function attachScoringRules() {
  const fixedYakuRules = [
    {
      id: "light5",
      label: "Five Lights",
      points: 10,
      applies: (stats) => stats.lights === 5,
    },
    {
      id: "light4",
      label: "Four Lights",
      points: 8,
      applies: (stats) => stats.lights === 4 && !stats.ids.has("11a"),
    },
    {
      id: "light4rain",
      label: "Four Lights (Rain)",
      points: 7,
      applies: (stats) => stats.lights === 4 && stats.ids.has("11a"),
    },
    {
      id: "light3",
      label: "Three Lights",
      points: 5,
      applies: (stats) => stats.lights === 3 && !stats.ids.has("11a"),
    },
    {
      id: "blossom",
      label: "Blossom Viewing",
      points: 5,
      applies: (stats) => stats.ids.has("3a") && stats.ids.has("9a"),
    },
    {
      id: "moon",
      label: "Moon Viewing",
      points: 5,
      applies: (stats) => stats.ids.has("8a") && stats.ids.has("9a"),
    },
    {
      id: "animalTrio",
      label: "Animal Trio",
      points: 5,
      applies: (stats) => stats.ids.has("6a") && stats.ids.has("7a") && stats.ids.has("10a"),
    },
    {
      id: "redScrollSet",
      label: "Red Scrolls",
      points: 5,
      applies: (stats) => stats.ids.has("1b") && stats.ids.has("2b") && stats.ids.has("3b"),
    },
    {
      id: "blueScrollSet",
      label: "Blue Scrolls",
      points: 5,
      applies: (stats) => stats.ids.has("6b") && stats.ids.has("9b") && stats.ids.has("10b"),
    },
    {
      id: "redBlueScrollSet",
      label: "Red & Blue Scrolls",
      points: 10,
      applies: (stats) =>
        stats.ids.has("1b") &&
        stats.ids.has("2b") &&
        stats.ids.has("3b") &&
        stats.ids.has("6b") &&
        stats.ids.has("9b") &&
        stats.ids.has("10b"),
    },
  ];

  const incrementalYakuRules = [
    {
      id: "seedsBase",
      label: "Seeds",
      countKey: "seeds",
      threshold: 5,
      base: 3,
    },
    {
      id: "scrollsBase",
      label: "Scrolls",
      countKey: "scrolls",
      threshold: 5,
      base: 1,
    },
    {
      id: "basicBase",
      label: "Basic",
      countKey: "basics",
      threshold: 10,
      base: 1,
    },
  ];

  window.HKKScoringRules = {
    fixedYakuRules,
    incrementalYakuRules,
  };
})();
