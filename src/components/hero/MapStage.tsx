import { useMemo, useRef, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { CanvasTexture, LinearFilter, type Group } from "three";
import { SCENE_PALETTE } from "@/config/scenePalette";
import { ROAD, SITES } from "@/config/siteConfig";
import {
  ROAD_CENTERLINE_CURVE,
  createRoadRibbonGeometry,
} from "./RoadRouter";
import { SiteGroup } from "./SiteGroup";
import { Fleet } from "./Fleet";

// Safe tree transforms strictly outside the central branding plaza and building footprints
const WORLD_TREES = [
  // 4 Inner Loop Corner Accent Trees (leaving central AUTOREPLENISH.AI plaza 100% clear)
  { position: [-19.5, 0, -10.2], scale: 1.05 },
  { position: [19.5, 0, -10.2], scale: 1.05 },
  { position: [-19.5, 0, 10.2], scale: 1.05 },
  { position: [19.5, 0, 10.2], scale: 1.05 },

  // Outer Perimeter Clusters (kept safely clear of DC, 4 Stores, and right-side Phone)
  { position: [-38, 0, -30], scale: 1.1 },
  { position: [-26, 0, -34], scale: 1.0 },
  { position: [22, 0, -32], scale: 1.05 },
  { position: [34, 0, -28], scale: 1.0 },
  { position: [-38, 0, 30], scale: 1.15 },
  { position: [-28, 0, 34], scale: 1.05 },
  { position: [28, 0, 32], scale: 1.1 },
  { position: [36, 0, 26], scale: 1.0 },
] as const;

// Streetlight transforms around the road loop corners and aprons
const STREET_LIGHTS: { pos: [number, number, number]; rotY: number }[] = [
  { pos: [-16, 0, -15.8], rotY: 0 },
  { pos: [16, 0, -15.8], rotY: 0 },
  { pos: [25.8, 0, -9], rotY: -Math.PI / 2 },
  { pos: [25.8, 0, 9], rotY: -Math.PI / 2 },
  { pos: [16, 0, 15.8], rotY: Math.PI },
  { pos: [-16, 0, 15.8], rotY: Math.PI },
  { pos: [-25.8, 0, 9], rotY: Math.PI / 2 },
  { pos: [-25.8, 0, -9], rotY: Math.PI / 2 },
];

/**
 * High-resolution procedural CanvasTexture for the central "AUTOREPLENISH.AI" road island branding
 */
function createCentralBrandTexture(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Dark warm architectural monument surface (#1F1E1D)
    ctx.fillStyle = "#1F1E1D";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer structural frame (#3D3C39)
    ctx.strokeStyle = "#3D3C39";
    ctx.lineWidth = 10;
    ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

    // Inner clay-orange accent hairline (#D97757)
    ctx.strokeStyle = "#D97757";
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

    // Corner technical registration ticks
    ctx.fillStyle = "#D97757";
    const tick = 24;
    ctx.fillRect(36, 36, tick, 8);
    ctx.fillRect(36, 36, 8, tick);
    ctx.fillRect(canvas.width - 36 - tick, 36, tick, 8);
    ctx.fillRect(canvas.width - 44, 36, 8, tick);
    ctx.fillRect(36, canvas.height - 44, tick, 8);
    ctx.fillRect(36, canvas.height - 36 - tick, 8, tick);
    ctx.fillRect(canvas.width - 36 - tick, canvas.height - 44, tick, 8);
    ctx.fillRect(canvas.width - 44, canvas.height - 36 - tick, 8, tick);

    // Main Brand Typography: AUTOREPLENISH.AI
    ctx.font = '700 156px "IBM Plex Mono", monospace';
    ctx.textBaseline = "middle";

    const mainText = "AUTOREPLENISH";
    const accentText = ".AI";
    const mainWidth = ctx.measureText(mainText).width;
    const accentWidth = ctx.measureText(accentText).width;
    const totalWidth = mainWidth + accentWidth;
    const startX = (canvas.width - totalWidth) / 2;
    const centerY = canvas.height / 2 + 4;

    ctx.fillStyle = "#FAF9F5";
    ctx.fillText(mainText, startX, centerY);

    ctx.fillStyle = "#D97757";
    ctx.fillText(accentText, startX + mainWidth, centerY);
  }

  const texture = new CanvasTexture(canvas);
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Central 3D Branding Plaza in the middle of the road loop ([0, 0, 0])
 */
const CentralBrandPlaza: FC = () => {
  const brandTexture = useMemo(() => createCentralBrandTexture(), []);

  return (
    <group position={[0, 0, 0]}>
      {/* 4 Inner Road Branch Connectors linking North/South/East/West road lanes to Central Plaza */}
      {/* North-South Central Boulevard Branch */}
      <mesh position={[0, 0.022, 0]} receiveShadow>
        <boxGeometry args={[6.4, 0.03, 33.6]} />
        <meshStandardMaterial color={ROAD.roadColor} roughness={0.86} />
      </mesh>
      {/* East-West Central Boulevard Branch */}
      <mesh position={[0, 0.022, 0]} receiveShadow>
        <boxGeometry args={[57.6, 0.03, 5.6]} />
        <meshStandardMaterial color={ROAD.roadColor} roughness={0.86} />
      </mesh>

      {/* Outer Plaza Architectural Island Curbs (#3D3C39) */}
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <boxGeometry args={[32.8, 0.18, 12.4]} />
        <meshStandardMaterial color="#3D3C39" roughness={0.8} />
      </mesh>

      {/* Inner Dark-Warm Plaza Deck (#1F1E1D) */}
      <mesh position={[0, 0.19, 0]} receiveShadow>
        <boxGeometry args={[31.8, 0.12, 11.4]} />
        <meshStandardMaterial color="#1F1E1D" roughness={0.88} />
      </mesh>

      {/* Clay-Orange Glowing Perimeter Accent Trim (#D97757) */}
      <mesh position={[0, 0.26, 0]}>
        <boxGeometry args={[29.8, 0.08, 9.2]} />
        <meshStandardMaterial
          color="#D97757"
          emissive="#D97757"
          emissiveIntensity={0.45}
          roughness={0.45}
        />
      </mesh>

      {/* Raised Monument Plinth Base */}
      <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[29.2, 0.16, 8.6]} />
        <meshStandardMaterial color="#161615" roughness={0.85} />
      </mesh>

      {/* Crisp "AUTOREPLENISH.AI" Branding Top Plate */}
      <mesh position={[0, 0.43, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[28.6, 7.8]} />
        <meshBasicMaterial map={brandTexture} toneMapped={false} />
      </mesh>
    </group>
  );
};

/**
 * Procedural Ground Plane (Brighter warm studio tone in Hero that blends seamlessly into the top of CaraKerja)
 */
const GroundPlane: FC = () => {
  return (
    <group position={[0, -0.01, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[1200, 1200]} />
        <meshStandardMaterial color="#1F1E1C" roughness={0.92} />
      </mesh>
      {/* Subtle inner courtyard ground pad inside the road loop */}
      <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[56, 32]} />
        <meshStandardMaterial color="#232220" roughness={0.95} />
      </mesh>
    </group>
  );
};

/**
 * Warm Industrial Streetlights along the road perimeter with soft ground light pools
 */
const RoadStreetLights: FC = () => {
  return (
    <group>
      {STREET_LIGHTS.map((lamp, idx) => (
        <group key={`lamp-${idx}`} position={lamp.pos} rotation={[0, lamp.rotY, 0]}>
          {/* Pole base */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.22, 0.4, 8]} />
            <meshStandardMaterial color="#2A2927" roughness={0.8} />
          </mesh>
          {/* Vertical mast */}
          <mesh position={[0, 2.2, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.09, 4.0, 8]} />
            <meshStandardMaterial color="#3D3C39" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Overhanging arm towards the road */}
          <mesh position={[0, 4.15, -0.55]} rotation={[0.15, 0, 0]} castShadow>
            <boxGeometry args={[0.1, 0.08, 1.2]} />
            <meshStandardMaterial color="#3D3C39" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Emissive Warm Lamp Head */}
          <mesh position={[0, 4.1, -1.05]}>
            <boxGeometry args={[0.32, 0.08, 0.48]} />
            <meshStandardMaterial
              color="#FAF9F5"
              emissive="#D97757"
              emissiveIntensity={1.6}
            />
          </mesh>
          {/* Soft warm light pool on road asphalt */}
          <mesh position={[0, 0.042, -1.35]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.6, 20]} />
            <meshBasicMaterial color="#D97757" opacity={0.09} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/**
 * Continuous Rounded Road Loop (Corner Radius = 12 units) with Sidewalk Shoulders,
 * 3D Curbs, Edge Lanes, Driveway Intersections for DC + 4 Minimarket Stores, Stop Lines & Crosswalks
 */
const RoundedRoadNetwork: FC = () => {
  // 0. Outer Sidewalk / Roadbed Base (#252422)
  const shoulderGeometry = useMemo(() => {
    return createRoadRibbonGeometry(
      ROAD_CENTERLINE_CURVE,
      -ROAD.halfWidth - 1.35,
      ROAD.halfWidth + 1.35,
      0.016,
      180
    );
  }, []);

  // 1. Road Asphalt Surface (Clean quad-strip ribbon)
  const roadGeometry = useMemo(() => {
    return createRoadRibbonGeometry(
      ROAD_CENTERLINE_CURVE,
      -ROAD.halfWidth,
      ROAD.halfWidth,
      0.03,
      180
    );
  }, []);

  // 2. Outer Raised Curb (0.12 high, 0.45 wide, #6E6C66)
  const outerCurbGeometry = useMemo(() => {
    return createRoadRibbonGeometry(
      ROAD_CENTERLINE_CURVE,
      ROAD.halfWidth,
      ROAD.halfWidth + ROAD.curbWidth,
      0.08,
      180
    );
  }, []);

  // 3. Inner Raised Curb (0.12 high, 0.45 wide, #6E6C66)
  const innerCurbGeometry = useMemo(() => {
    return createRoadRibbonGeometry(
      ROAD_CENTERLINE_CURVE,
      -ROAD.halfWidth - ROAD.curbWidth,
      -ROAD.halfWidth,
      0.08,
      180
    );
  }, []);

  // 4. Outer & Inner Edge Solid Lane Stripes
  const outerEdgeLaneGeometry = useMemo(() => {
    return createRoadRibbonGeometry(
      ROAD_CENTERLINE_CURVE,
      ROAD.halfWidth - 0.38,
      ROAD.halfWidth - 0.24,
      0.036,
      180
    );
  }, []);

  const innerEdgeLaneGeometry = useMemo(() => {
    return createRoadRibbonGeometry(
      ROAD_CENTERLINE_CURVE,
      -ROAD.halfWidth + 0.24,
      -ROAD.halfWidth + 0.38,
      0.036,
      180
    );
  }, []);

  // 5. Center Dashed Line points along rounded curve (R=12)
  const centerDashPoints = useMemo(() => {
    const pts = ROAD_CENTERLINE_CURVE.getSpacedPoints(180);
    return pts.map((p) => [p.x, 0.052, p.z] as [number, number, number]);
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Outer Roadbed / Sidewalk Shoulder */}
      <mesh geometry={shoulderGeometry} receiveShadow>
        <meshStandardMaterial color="#252422" roughness={0.94} />
      </mesh>

      {/* North Apron & Driveway Ramp (DC-01 Pusat Jakarta) */}
      <mesh position={[0, 0.02, -25.5]} receiveShadow>
        <boxGeometry args={[44, 0.04, 5.8]} />
        <meshStandardMaterial color={SCENE_PALETTE.apron} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.026, -21.8]} receiveShadow>
        <boxGeometry args={[24, 0.04, 3.6]} />
        <meshStandardMaterial color={ROAD.roadColor} roughness={0.85} />
      </mesh>
      {/* DC 4-Dock Driveway Stop Lines */}
      {[-7.5, -2.5, 2.5, 7.5].map((dx, i) => (
        <mesh key={`dc-stop-${i}`} position={[dx, 0.048, -22.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.8, 0.26]} />
          <meshBasicMaterial color="#A3A199" opacity={0.85} transparent />
        </mesh>
      ))}

      {/* South-West Apron & Driveway Ramp (STR-002 Cabang Kampus at X = -14) */}
      <mesh position={[-14.0, 0.02, 25.5]} receiveShadow>
        <boxGeometry args={[18, 0.04, 5.8]} />
        <meshStandardMaterial color={SCENE_PALETTE.apron} roughness={0.9} />
      </mesh>
      <mesh position={[-14.0, 0.026, 21.8]} receiveShadow>
        <boxGeometry args={[10, 0.04, 3.6]} />
        <meshStandardMaterial color={ROAD.roadColor} roughness={0.85} />
      </mesh>
      {[-3.2, -1.6, 0, 1.6, 3.2].map((zx, i) => (
        <mesh key={`sw-zebra-${i}`} position={[-14.0 + zx, 0.048, 22.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.75, 1.6]} />
          <meshBasicMaterial color="#A3A199" opacity={0.75} transparent />
        </mesh>
      ))}

      {/* South-East Apron & Driveway Ramp (STR-004 Cabang Stasiun at X = +14) */}
      <mesh position={[14.0, 0.02, 25.5]} receiveShadow>
        <boxGeometry args={[18, 0.04, 5.8]} />
        <meshStandardMaterial color={SCENE_PALETTE.apron} roughness={0.9} />
      </mesh>
      <mesh position={[14.0, 0.026, 21.8]} receiveShadow>
        <boxGeometry args={[10, 0.04, 3.6]} />
        <meshStandardMaterial color={ROAD.roadColor} roughness={0.85} />
      </mesh>
      {[-3.2, -1.6, 0, 1.6, 3.2].map((zx, i) => (
        <mesh key={`se-zebra-${i}`} position={[14.0 + zx, 0.048, 22.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.75, 1.6]} />
          <meshBasicMaterial color="#A3A199" opacity={0.75} transparent />
        </mesh>
      ))}

      {/* East Apron & Driveway Ramp (STR-001 Cabang Sudirman) */}
      <mesh position={[35.5, 0.02, 0]} receiveShadow>
        <boxGeometry args={[5.8, 0.04, 24]} />
        <meshStandardMaterial color={SCENE_PALETTE.apron} roughness={0.9} />
      </mesh>
      <mesh position={[31.8, 0.026, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.04, 11]} />
        <meshStandardMaterial color={ROAD.roadColor} roughness={0.85} />
      </mesh>
      {[-3.2, -1.6, 0, 1.6, 3.2].map((zz, i) => (
        <mesh key={`east-zebra-${i}`} position={[32.8, 0.048, zz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.75]} />
          <meshBasicMaterial color="#A3A199" opacity={0.75} transparent />
        </mesh>
      ))}

      {/* West Apron & Driveway Ramp (STR-003 Cabang Perumahan) */}
      <mesh position={[-35.5, 0.02, 0]} receiveShadow>
        <boxGeometry args={[5.8, 0.04, 24]} />
        <meshStandardMaterial color={SCENE_PALETTE.apron} roughness={0.9} />
      </mesh>
      <mesh position={[-31.8, 0.026, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.04, 11]} />
        <meshStandardMaterial color={ROAD.roadColor} roughness={0.85} />
      </mesh>
      {[-3.2, -1.6, 0, 1.6, 3.2].map((zz, i) => (
        <mesh key={`west-zebra-${i}`} position={[-32.8, 0.048, zz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 0.75]} />
          <meshBasicMaterial color="#A3A199" opacity={0.75} transparent />
        </mesh>
      ))}

      {/* Road Surface (Clean Quad-Strip Ribbon) */}
      <mesh geometry={roadGeometry} receiveShadow>
        <meshStandardMaterial color={ROAD.roadColor} roughness={0.84} />
      </mesh>

      {/* Outer & Inner Solid Edge Lane Stripes */}
      <mesh geometry={outerEdgeLaneGeometry}>
        <meshBasicMaterial color="#6E6C66" opacity={0.55} transparent />
      </mesh>
      <mesh geometry={innerEdgeLaneGeometry}>
        <meshBasicMaterial color="#6E6C66" opacity={0.55} transparent />
      </mesh>

      {/* Outer Raised Curb */}
      <mesh geometry={outerCurbGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={ROAD.curbColor} roughness={0.78} />
      </mesh>

      {/* Inner Raised Curb */}
      <mesh geometry={innerCurbGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={ROAD.curbColor} roughness={0.78} />
      </mesh>

      {/* White/Warm-Grey Dashed Centerline */}
      <Line
        points={centerDashPoints}
        color={ROAD.dashColor}
        lineWidth={1.8}
        dashed
        dashScale={2.0}
        dashSize={1.4}
        gapSize={0.8}
      />

      {/* Warm Streetlights along road loop */}
      <RoadStreetLights />
    </group>
  );
};

const DioramaTrees: FC = () => {
  const treesGroupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!treesGroupRef.current) return;
    const t = state.clock.getElapsedTime();
    treesGroupRef.current.children.forEach((child, idx) => {
      child.rotation.z = Math.sin(t * 1.2 + idx * 0.7) * 0.018;
    });
  });

  return (
    <group ref={treesGroupRef}>
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
  selectedStoreId?: string | null;
  onSelectStore?: (storeId: string) => void;
}

export const MapStage: FC<MapStageProps> = ({
  position = [-16, 0, 4],
  truckProgress = {},
  storeArrivals = {},
  storeRefills = {},
  selectedStoreId = null,
  onSelectStore,
}) => {
  return (
    <group position={position}>
      {/* 1. Ground, Central Branding Plaza ("AUTOREPLENISH.AI"), and Rounded Road Network */}
      <GroundPlane />
      <RoundedRoadNetwork />
      <CentralBrandPlaza />
      <DioramaTrees />

      {/* 2. Sites (DC-01 + 4 Minimarket Stores) with Enhanced Architecture & Cargo Props */}
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
            isSelected={selectedStoreId === site.id}
            onSelect={onSelectStore}
          />
        );
      })}

      {/* 3. Warehouse-to-Store Trucks + Continuous Road Patrol */}
      <Fleet truckProgress={truckProgress} />
    </group>
  );
};
