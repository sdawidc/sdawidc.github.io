export const projects = [
  {
    title: "Wild Wild Train",
    description: "Gra endless runner osadzona w klimacie Dzikiego Zachodu.",
    image: "./wild.gif",
    link: "https://framedropgames.itch.io/wild-wild-train",

    award: {
      icon: "🥉",
      text: "Trzecie miejsce na konkursie ZTGK (2026)",
      category: "Game Development",
    },

    technology: "C# + MonoGame + HLSL",
    membersAmount: 6,

    role: [
      "pomysł",
      "silnik ECS",
      "optymalizacja",
      "streaming mapy",
      "voxelizacja modeli",
      "voxel workflow",
      "...",
    ],
  },

  {
    title: "Consoul",
    description: "Gra wykorzystująca system interpretacji komend.",
    image: "./consoul.gif",
    link: "https://przemeoo.itch.io/consoul",

    award: null,

    technology: "Unity (C#)",
    membersAmount: 5,

    role: [
      "pomysł",
      "system interpretacji komend",
      "optymalizacja",
      "system interakcji komend ze światem",
      "Quality of Life",
      "...",
    ],
  },
];
