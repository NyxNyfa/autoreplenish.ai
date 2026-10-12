/**
 * ============================================================================
 * 🎨 3D SCENE PALETTE (Brighter Warm-Dark Ramp derived from design.md)
 * AutoReplenish.ai — Warm Neutrals & Single Clay Accent (#D97757)
 * ============================================================================
 */

export const SCENE_PALETTE = {
  // Core Page UI Tokens from design.md (Unchanged)
  bg: "#161615",
  surface: "#1F1E1D",
  surfaceHover: "#2A2927",
  surfaceActive: "#3A3937",
  border: "#3D3C39",
  text: "#FAF9F5",
  textMuted: "#A3A199",
  textFaint: "#6E6C66",
  accent: "#D97757", // Single Accent: Clay
  accentHover: "#E58A6B",
  link: "#7AA9EE",
  btnLightBg: "#F0EEEA",
  btnLightText: "#161615",

  // Environment & Fog
  fog: "#161615",
  ground: "#3A3937", // Lightened ground warm-dark tone
  groundGrid: "#4A4844",

  // Road Network & Aprons
  road: "#3A3937",
  roadDashes: "#6E6C66",
  roadBorder: "#4A4844",
  apron: "#3A3937", // Identical to ground so aprons blend invisibly

  // Architecture & Buildings
  buildingWalls: "#54524E", // Lightened stone walls tone
  roofs: "#2A2927",
  roofEdgeTrim: "#6E6C66", // Thin trim #6E6C66
  glassWindows: "#FAF9F5", // Faint warm emissive @0.25
  dockFrames: "#3D3C39",
  signage: "#A3A199",

  // Vegetation
  treesFoliage: "#5E6B52", // Desaturated foliage #5E6B52
  treesTrunk: "#4A4844",

  // Logistics Fleet (Trucks)
  truckCargo: "#F0EEEA", // Clean light contrast cargo box
  truckCab: "#4A4844",
  truckStripe: "#D97757", // Clay accent stripe
  truckChassis: "#2A2927",
  truckWheels: "#161615",

  // 3D Phone Chassis (stays #1F1E1D with #3D3C39 rim for separation)
  phoneBody: "#1F1E1D",
  phoneBezel: "#3D3C39",
  phoneSideButtons: "#4A4844",
  phoneShadow: "#161615",

  // 2D Telegram CanvasTexture Tokens
  chatBg: "#0e1621",
  header: "#17212b",
  botBubble: "#182533",
  dividers: "rgba(255, 255, 255, 0.06)",
  telegramText: "#ffffff",
  telegramMuted: "#8b98a5",
  telegramBlue: "#2aabee",
  telegramBlueHover: "#229ed9",
  telegramGreen: "#0ac630",
} as const;

export type ScenePaletteType = typeof SCENE_PALETTE;
