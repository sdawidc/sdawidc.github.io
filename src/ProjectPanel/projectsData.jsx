export const projects = [
  {
    title: "Wild Wild Train",
    description:
      "Voxelowy endless runner, w którym modyfikujesz świat w czasie rzeczywistym",
    image: "/wild.gif",
    video: "/wild.webm",
    link: "https://framedropgames.itch.io/wild-wild-train",

    award: {
      icon: "🥉",
      text: "Trzecie miejsce na konkursie ZTGK (2026)",
      category: "Game Development",
    },

    technology: "C# + MonoGame + HLSL",
    membersAmount: 6,

    role: [
      { text: "pomysł" },
      { text: "system interpretacji komend" },
      { text: "optymalizacja (~930 FPS dla ~420M voxeli)", pdf: "/poster.pdf" },
      { text: "system interakcji komend ze światem" },
      { text: "Quality of Life" },
      { text: "..." },
    ],
  },

  {
    title: "Consoul",
    description:
      "Pokonuj poziomy robotem przeprowadzając interakcje ze światem za pomocą wbudowanej konsoli",
    image: "/consoul.gif",
    link: "https://przemeoo.itch.io/consoul",
    video: "/consoul.webm",

    award: null,

    technology: "Unity (C#)",
    membersAmount: 5,

    role: [
      { text: "pomysł" },
      { text: "silnik ECS" },
      { text: "optymalizacja" },
      { text: "streaming mapy" },
      { text: "voxelizacja modeli" },
      { text: "voxel workflow" },
      { text: "..." },
    ],
  },
];
