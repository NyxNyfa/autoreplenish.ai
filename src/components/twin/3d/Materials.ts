/**
 * AutoReplenish.ai - 3D Digital Twin Material & Color Palette Tokens
 * Centralized constant to guarantee unified pastel isometric styling.
 * NEVER rely on unstyled default Three.js white materials.
 */

export const MATERIALS = {
  // Scene Environment
  background: "#EEF1FA",
  fog: "#EEF1FA",
  ground: "#E4E9F5",
  groundGrid: "#D5DDF0",

  // Road Network
  roadSurface: "#DDE3F0",
  roadDash: "#FFFFFF",
  roadBorder: "#CAD4E8",
  apronSurface: "#EAEFF9",
  routeActive: "#2563EB",

  // Architecture & Buildings
  buildingWall: "#FAFBFF",
  roofBlue: "#3B82F6",
  roofOverhang: "#2563EB",
  glassFront: "#BFD7F5",
  dockBayInset: "#1E293B",
  signageBlue: "#2563EB",

  // Logistics Fleet (Trucks)
  truckCabPrimary: "#2563EB",
  truckCabPartner: "#FAFBFF",
  truckTealStripe: "#2DD4BF",
  truckCargoBox: "#FAFBFF",
  truckCargoStripe: "#3B82F6",
  truckChassis: "#2A2F3A",
  truckWheelTire: "#1F242F",
  truckWheelRim: "#94A3B8",

  // Props & Staging
  palletWood: "#C89D66",
  palletBoxCardboard: "#D8B48E",
  palletTape: "#E8D3B8",
  palletBlueContainer: "#4A7DFC",
  rackSteel: "#4A7DFC",
  bayOutline: "#F2C94C",

  // Vegetation
  treeCanopy: "#86D9A5",
  treeTrunk: "#8B6F4E",

  // Map Pins & Status Badges
  pinNormal: "#4A7DFC",
  pinRisk: "#EF4444",
  pinPending: "#F59E0B",
  pinSuccess: "#10B981",

  // Selection Brackets
  selectionPrimary: "#2563EB",
  selectionRisk: "#EF4444",
} as const;

export type MaterialPalette = typeof MATERIALS;
