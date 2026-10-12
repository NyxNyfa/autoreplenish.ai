import { useMemo, type FC } from "react";
import { Line } from "@react-three/drei";
import { SCENE_PALETTE } from "@/config/scenePalette";
import { ROAD, SITES } from "@/config/siteConfig";
import { ROAD_CENTERLINE_CURVE, createRoadRibbonGeometry } from "./RoadRouter";
import { SiteGroup } from "./SiteGroup";
import { Fleet } from "./Fleet";

// Safe tree transforms strictly outside road loop and building footprints
const WORLD_TREES = [
  // Central Courtyard Park (inside road loop)
  { position: [0, 0, 0], scale: 1.25 },
  { position: [-8, 0, -3], scale: 1.1 },
  { position: [8, 0, 3], scale: 1.05 },
  { position: [-12, 0, 3], scale: 0.95 },
  { position: [12, 0, -3], scale: 1.15 },
  { position: [-5, 0, 5], scale: 0.9 },
  { position: [5, 0, -5], scale: 1.0 },

  // Outer Perimeter Clusters (kept safely clear of the phone on the right)
  { position: [-38, 0, -30], scale: 1.1 },
  { position: [-26, 0, -34], scale: 1.0 },
  { position: [18, 0, -32], scale: 1.05 },
  { position: [12, 0, -35], scale: 1.0 },
  { position: [-38, 0, 30], scale: 1.15 },
  { position: [-26, 0, 34], scale: 1.05 },
  { position: [18, 0, 30], scale: 1.1 },
  { position: [12, 0, 34], scale: 1.0 },
] as const;

/**
 * Procedural Ground Plane (Dark-warm, NO blue, no grid rings)
 */
const GroundPlane: FC = () => {
  return (
    <group position={[0, -0.01, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color={SCENE_PALETTE.ground} roughness={0.92} />
      </mesh>
    </group>
  );
};

/**
 * Continuous Rounded Road Loop (Corner Radius = 12 units) with 3D Curbs and Centerlines
 * Built using clean, strict ribbon quad-strip geometry with ZERO triangulation artifacts
 */
const RoundedRoadNetwork: FC = () => {
  // 1. Road Surface (Clean quad-strip ribbon)
  const roadGeometry = useMemo(() => {
    return createRoadRibbonGeometry(
      ROAD_CENTERLINE_CURVE,
      -ROAD.halfWidth,
      ROAD.halfWidth,
      0.03,
      180
    );
  }, []);

  // 2. Outer Raised Curb (0.12 high, 0.4 wide, #6E6C66)
  const outerCurbGeometry = useMemo(() => {
    return createRoadRibbonGeometry(
      ROAD_CENTERLINE_CURVE,
      ROAD.halfWidth,
      ROAD.halfWidth + ROAD.curbWidth,
      0.08,
      180
    );
  }, []);

  // 3. Inner Raised Curb (0.12 high, 0.4 wide, #6E6C66)
  const innerCurbGeometry = useMemo(() => {
    return createRoadRibbonGeometry(
      ROAD_CENTERLINE_CURVE,
      -ROAD.halfWidth - ROAD.curbWidth,
      -ROAD.halfWidth,
      0.08,
      180
    );
  }, []);

  // 4. Center Dashed Line points along rounded curve (R=12)
  const centerDashPoints = useMemo(() => {
    const pts = ROAD_CENTERLINE_CURVE.getSpacedPoints(180);
    return pts.map((p) => [p.x, 0.052, p.z] as [number, number, number]);
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* 4 Loading Aprons outside road edges */}
      {/* North Apron (DC-01) */}
      <mesh position={[0, 0.02, -25.5]} receiveShadow>
        <boxGeometry args={[44, 0.04, 5.0]} />
        <meshStandardMaterial color={SCENE_PALETTE.apron} roughness={0.92} />
      </mesh>
      {/* South Apron (STR-002) */}
      <mesh position={[0, 0.02, 25.5]} receiveShadow>
        <boxGeometry args={[44, 0.04, 5.0]} />
        <meshStandardMaterial color={SCENE_PALETTE.apron} roughness={0.92} />
      </mesh>
      {/* East Apron (STR-001) */}
      <mesh position={[35.5, 0.02, 0]} receiveShadow>
        <boxGeometry args={[5.0, 0.04, 28]} />
        <meshStandardMaterial color={SCENE_PALETTE.apron} roughness={0.92} />
      </mesh>
      {/* West Apron (STR-003) */}
      <mesh position={[-35.5, 0.02, 0]} receiveShadow>
        <boxGeometry args={[5.0, 0.04, 28]} />
        <meshStandardMaterial color={SCENE_PALETTE.apron} roughness={0.92} />
      </mesh>

      {/* Road Surface (Clean Quad-Strip Ribbon) */}
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial color={ROAD.roadColor} roughness={0.85} />
      </mesh>

      {/* Outer Raised Curb */}
      <mesh geometry={outerCurbGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={ROAD.curbColor} roughness={0.8} />
      </mesh>

      {/* Inner Raised Curb */}
      <mesh geometry={innerCurbGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={ROAD.curbColor} roughness={0.8} />
      </mesh>

      {/* Restored White/Grey Dashed Centerline */}
      <Line
        points={centerDashPoints}
        color={ROAD.dashColor}
        lineWidth={1.8}
        dashed
        dashScale={2.0}
        dashSize={1.4}
        gapSize={0.8}
      />
    </group>
  );
};

const DioramaTrees: FC = () => {
  return (
    <group>
      {WORLD_TREES.map((t, idx) => (
        <group key={`tree-${idx}`} position={[t.position[0], 0, t.position[2]]} scale={t.scale}>
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.3, 1.8, 8]} />
            <meshStandardMaterial color={SCENE_PALETTE.treesTrunk} roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow>
            <coneGeometry args={[1.5, 2.0, 8]} />
            <meshStandardMaterial color={SCENE_PALETTE.treesFoliage} roughness={0.85} />
          </mesh>
          <mesh position={[0, 3.4, 0]} castShadow>
            <coneGeometry args={[1.1, 1.6, 8]} />
            <meshStandardMaterial color={SCENE_PALETTE.treesFoliage} roughness={0.85} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

interface MapStageProps {
  position?: [number, number, number];
  phaseIndex?: number;
  truckProgress?: Record<string, number>;
  storeArrivals?: Record<string, boolean>;
  storeRefills?: Record<string, number>;
}

export const MapStage: FC<MapStageProps> = ({
  position = [-16, 0, 4],
  truckProgress = {},
  storeArrivals = {},
  storeRefills = {},
}) => {
  return (
    <group position={position}>
      {/* 1. Ground & Continuous Rounded Road Loop (R=12) */}
      <GroundPlane />
      <RoundedRoadNetwork />
      <DioramaTrees />

      {/* 2. Sites (DC-01 + 3 Minimarkets) with Auto-Orient & Cargo Props (ZERO blue) */}
      {Object.values(SITES).map((site) => {
        const hasArrived = storeArrivals[site.id] || false;
        const refill = storeRefills[site.id] || 0;
        const initialStock = site.id === "STR-001" ? 35 : 75;
        const currentStock = Math.min(
          100,
          Math.round(initialStock + refill * (100 - initialStock))
        );

        return (
          <SiteGroup
            key={site.id}
            site={site}
            hasArrived={hasArrived}
            stockPct={currentStock}
          />
        );
      })}

      {/* 3. Warehouse-to-Store Trucks */}
      <Fleet truckProgress={truckProgress} />
    </group>
  );
};
