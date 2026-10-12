/**
 * siteConfig.ts — Single Source of Truth for Supply Chain Diorama Layout
 * ======================================================================
 * Exports:
 * - ROAD: halfWidth 3, cornerRadius 12, rect dims, centerline parameters
 * - SITES: building positions, dimensions, setback depths
 * - FLEET_PLAN: deterministic vehicles (docked, parked, 2 active driving units)
 * - STAGING_SLOTS: cargo props per site with seeded jitter
 * - BAY_MARKERS: yellow parking-bay outlines (width 3.5, depth 6)
 */

export interface RoadConfig {
  halfWidth: number;
  width: number;
  cornerRadius: number;
  rectDims: {
    width: number;
    height: number;
    xMin: number;
    xMax: number;
    zMin: number;
    zMax: number;
  };
  straightX: [number, number]; // [-18, 18]
  straightZ: [number, number]; // [-8, 8]
  arcCenters: {
    NE: [number, number];
    SE: [number, number];
    SW: [number, number];
    NW: [number, number];
  };
  curbWidth: number;
  curbHeight: number;
  roadColor: string;
  curbColor: string;
  dashColor: string;
  bayOutlineColor: string;
}

export const ROAD: RoadConfig = {
  halfWidth: 3.0,
  width: 6.0,
  cornerRadius: 12.0, // Smooth continuous rounded-rectangle with R=12
  rectDims: {
    width: 60.0,
    height: 40.0,
    xMin: -30.0,
    xMax: 30.0,
    zMin: -20.0,
    zMax: 20.0,
  },
  straightX: [-18.0, 18.0],
  straightZ: [-8.0, 8.0],
  arcCenters: {
    NE: [18.0, -8.0],
    SE: [18.0, 8.0],
    SW: [-18.0, 8.0],
    NW: [-18.0, -8.0],
  },
  curbWidth: 0.4,
  curbHeight: 0.15,
  roadColor: "#3A3937",
  curbColor: "#6E6C66",
  dashColor: "#A3A199", // Warm-gray dashed centerlines
  bayOutlineColor: "#D9B44A", // Yellow/orange outline
};

export interface SiteConfigItem {
  id: string;
  name: string;
  type: "DC" | "Store";
  position: [number, number, number];
  boundsSize: [number, number, number];
  setbackDepth: number;
  frontOffsetRotY: number;
  modelUrl: string;
}

export const SITES: Record<string, SiteConfigItem> = {
  "DC-01": {
    id: "DC-01",
    name: "DC Pusat Jakarta",
    type: "DC",
    position: [0, 0, -27],
    boundsSize: [28, 8.0, 14],
    setbackDepth: 4.5,
    frontOffsetRotY: 0,
    modelUrl: "/models/twin/dc_warehouse.glb",
  },
  "STR-001": {
    id: "STR-001",
    name: "Cabang Sudirman",
    type: "Store",
    position: [38, 0, 0],
    boundsSize: [12, 4.4, 8],
    setbackDepth: 2.0,
    frontOffsetRotY: 0,
    modelUrl: "/models/twin/minimarket.glb",
  },
  "STR-002": {
    id: "STR-002",
    name: "Cabang Kampus",
    type: "Store",
    position: [0, 0, 27],
    boundsSize: [12, 4.4, 8],
    setbackDepth: 2.0,
    frontOffsetRotY: 0,
    modelUrl: "/models/twin/minimarket.glb",
  },
  "STR-003": {
    id: "STR-003",
    name: "Cabang Perumahan",
    type: "Store",
    position: [-38, 0, 0],
    boundsSize: [12, 4.4, 8],
    setbackDepth: 2.0,
    frontOffsetRotY: 0,
    modelUrl: "/models/twin/minimarket.glb",
  },
};

export type FleetState = "DOCKED" | "PARKED" | "DRIVING";

export interface FleetVehicle {
  id: string;
  label: string;
  state: FleetState;
  siteId?: string;
  bay?: string;
  position?: [number, number, number];
  rotY?: number;
  curveOffset?: number; // Normalized [0, 1] offset for driving trucks
  targetSiteId?: string;
  headlights: boolean;
  hasRouteLine: boolean;
  hasLogoDecal: boolean;
}

export const FLEET_PLAN: FleetVehicle[] = [
  {
    id: "TRK-2051",
    label: "TRK-2051",
    state: "DOCKED",
    siteId: "DC-01",
    bay: "DC Dock 2",
    position: [-4.0, 0, -23.5], // Backed squarely into DC Dock 2 (inactive, headlights off)
    rotY: 0, // Rear to dock, cab facing +Z towards road
    headlights: false,
    hasRouteLine: false,
    hasLogoDecal: true, // Monospace branding logo "AUTOREPLENISH.AI" flat on cargo side
  },
  {
    id: "TRK-2205",
    label: "TRK-2205",
    state: "DOCKED",
    siteId: "STR-001",
    bay: "Cabang Sudirman Dock",
    position: [33.5, 0, 0], // Docked squarely at Cabang Sudirman loading bay (inactive)
    rotY: -Math.PI / 2, // Facing -X towards road
    headlights: false,
    hasRouteLine: false,
    hasLogoDecal: false,
  },
  {
    id: "TRK-2307",
    label: "TRK-2307",
    state: "PARKED",
    siteId: "DC-01",
    bay: "DC Gate Waiting Area",
    position: [-16.0, 0, -24.5], // Parked parallel inside the DC gate wait area (facing forward)
    rotY: Math.PI / 2, // Facing +X exit forward
    headlights: false,
    hasRouteLine: false,
    hasLogoDecal: false,
  },
  {
    id: "TRK-2481",
    label: "TRK-2481",
    state: "PARKED",
    siteId: "STR-002",
    bay: "STR-002 Side Lot",
    position: [9.5, 0, 24.5], // Parked parallel inside STR-002 side lot
    rotY: Math.PI, // Facing -Z
    headlights: false,
    hasRouteLine: false,
    hasLogoDecal: false,
  },
  // Exactly 2 active moving trucks:
  {
    id: "TRK-2148",
    label: "TRK-2148",
    state: "DRIVING",
    targetSiteId: "STR-002",
    curveOffset: 0.12, // Headlights on, traveling to Cabang Kampus
    headlights: true,
    hasRouteLine: true,
    hasLogoDecal: false,
  },
  {
    id: "TRK-2603",
    label: "TRK-2603",
    state: "DRIVING",
    targetSiteId: "STR-003",
    curveOffset: 0.58, // Headlights on, traveling to Cabang Perumahan
    headlights: true,
    hasRouteLine: true,
    hasLogoDecal: false,
  },
];

export interface StagingSlot {
  prop: string;
  modelUrl: string;
  localPos: [number, number, number];
  localRotY?: number;
  rotJitterDeg?: number;
  scaleJitter?: number;
}

export const STAGING_SLOTS: Record<string, StagingSlot[]> = {
  "DC-01": [
    // cargo_row beside docks 1 and 4 on the staging apron
    {
      prop: "cargo_row_dock1",
      modelUrl: "/models/twin/cargo_row.glb",
      localPos: [-11.5, 0, -8.2],
      localRotY: 0,
      rotJitterDeg: 2.5,
      scaleJitter: 0.98,
    },
    {
      prop: "cargo_row_dock4",
      modelUrl: "/models/twin/cargo_row.glb",
      localPos: [11.5, 0, -8.2],
      localRotY: 0,
      rotJitterDeg: -3.0,
      scaleJitter: 1.02,
    },
    // Multiple cargo clusters along staging lane on apron platform
    {
      prop: "cargo_staging_1",
      modelUrl: "/models/twin/cargo_cluster_a.glb",
      localPos: [-13.5, 0, -8.0],
      localRotY: 0,
      rotJitterDeg: 3.5,
      scaleJitter: 0.96,
    },
    {
      prop: "cargo_staging_2",
      modelUrl: "/models/twin/cargo_cluster_b.glb",
      localPos: [13.5, 0, -8.0],
      localRotY: Math.PI / 2,
      rotJitterDeg: -2.5,
      scaleJitter: 1.04,
    },
    // rack_full against the side wall
    {
      prop: "rack_full_side",
      modelUrl: "/models/twin/rack_full.glb",
      localPos: [-15.6, 0, -4.5],
      localRotY: Math.PI / 2,
      rotJitterDeg: 0,
      scaleJitter: 1.0,
    },
  ],
  "STR-001": [
    {
      prop: "cluster_a_service",
      modelUrl: "/models/twin/cargo_cluster_a.glb",
      localPos: [3.8, 0, 5.2],
      localRotY: 0,
      rotJitterDeg: -3.0,
      scaleJitter: 0.97,
    },
    {
      prop: "cluster_b_service",
      modelUrl: "/models/twin/cargo_cluster_b.glb",
      localPos: [5.4, 0, 5.0],
      localRotY: Math.PI / 2,
      rotJitterDeg: 3.8,
      scaleJitter: 1.03,
    },
    {
      prop: "trolley_entrance",
      modelUrl: "/models/twin/trolley.glb",
      localPos: [-6.6, 0, -2.5],
      localRotY: -0.25,
      rotJitterDeg: 2.0,
      scaleJitter: 1.0,
    },
  ],
  "STR-002": [
    {
      prop: "cluster_a_service",
      modelUrl: "/models/twin/cargo_cluster_a.glb",
      localPos: [3.8, 0, 5.2],
      localRotY: 0,
      rotJitterDeg: 3.2,
      scaleJitter: 1.02,
    },
    {
      prop: "cluster_b_service",
      modelUrl: "/models/twin/cargo_cluster_b.glb",
      localPos: [5.4, 0, 5.0],
      localRotY: Math.PI / 2,
      rotJitterDeg: -2.8,
      scaleJitter: 0.98,
    },
    {
      prop: "trolley_entrance",
      modelUrl: "/models/twin/trolley.glb",
      localPos: [-6.6, 0, -2.5],
      localRotY: -0.25,
      rotJitterDeg: -2.0,
      scaleJitter: 1.01,
    },
  ],
  "STR-003": [
    {
      prop: "cluster_a_service",
      modelUrl: "/models/twin/cargo_cluster_a.glb",
      localPos: [3.8, 0, 5.2],
      localRotY: 0,
      rotJitterDeg: -2.5,
      scaleJitter: 0.99,
    },
    {
      prop: "cluster_b_service",
      modelUrl: "/models/twin/cargo_cluster_b.glb",
      localPos: [5.4, 0, 5.0],
      localRotY: Math.PI / 2,
      rotJitterDeg: 3.2,
      scaleJitter: 1.04,
    },
    {
      prop: "trolley_entrance",
      modelUrl: "/models/twin/trolley.glb",
      localPos: [-6.6, 0, -2.5],
      localRotY: -0.25,
      rotJitterDeg: 1.5,
      scaleJitter: 0.98,
    },
  ],
};

// Parking Bay Markings Quads [centerPos, size: [width 3.5, depth 6], rotY]
export interface BayMarker {
  id: string;
  position: [number, number, number];
  size: [number, number]; // [width 3.5, depth 6.0]
  rotY: number;
}

export const BAY_MARKERS: BayMarker[] = [
  // DC Docks 1 to 5 (width 3.5, depth 6.0)
  { id: "DC-DOCK-1", position: [-8.0, 0.025, -23.5], size: [3.5, 6.0], rotY: 0 },
  { id: "DC-DOCK-2", position: [-4.0, 0.025, -23.5], size: [3.5, 6.0], rotY: 0 },
  { id: "DC-DOCK-3", position: [0.0, 0.025, -23.5], size: [3.5, 6.0], rotY: 0 },
  { id: "DC-DOCK-4", position: [4.0, 0.025, -23.5], size: [3.5, 6.0], rotY: 0 },
  { id: "DC-DOCK-5", position: [8.0, 0.025, -23.5], size: [3.5, 6.0], rotY: 0 },
  // Bay P1 (DC Gate Waiting Area)
  { id: "BAY-P1", position: [-16.0, 0.025, -24.5], size: [3.5, 6.0], rotY: Math.PI / 2 },
  // Bay P2 (STR-002 Side Lot)
  { id: "BAY-P2", position: [9.5, 0.025, 24.5], size: [3.5, 6.0], rotY: Math.PI },
  // STR-001 Loading Bay
  { id: "STR-001-BAY", position: [33.5, 0.025, 0], size: [3.5, 6.0], rotY: -Math.PI / 2 },
];
