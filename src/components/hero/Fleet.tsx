import { useRef, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Vector3, type Group, type Mesh } from "three";
import { SCENE_PALETTE } from "@/config/scenePalette";
import {
  ROAD_CENTERLINE_CURVE,
  WAREHOUSE_TO_STORE_SPLINES,
  STORE_TO_WAREHOUSE_SPLINES,
} from "./RoadRouter";
import { brandDecalTexture } from "./brandDecal";

useGLTF.preload("/models/twin/truck_box.glb");

const WHEEL_POSITIONS: [number, number, number][] = [
  [-1.05, 0.45, 1.8],
  [1.05, 0.45, 1.8],
  [-1.05, 0.45, -1.2],
  [1.05, 0.45, -1.2],
  [-1.05, 0.45, -2.1],
  [1.05, 0.45, -2.1],
];

/**
 * Logistics Truck Mesh with dark-warm aesthetic, spinning wheels, beacon, and headlight beams
 */
const DarkTruckMesh: FC<{
  headlights: boolean;
  hasLogoDecal: boolean;
  isMoving?: boolean;
  accentColor?: string;
}> = ({
  headlights,
  hasLogoDecal,
  isMoving = false,
  accentColor = SCENE_PALETTE.truckStripe,
}) => {
  const bodyRef = useRef<Group>(null);
  const wheelRefs = useRef<(Mesh | null)[]>([]);
  const beaconRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (isMoving) {
      // Spin wheels
      for (const w of wheelRefs.current) {
        if (w) w.rotation.x += delta * 9.0;
      }
      // Subtle suspension vibration
      if (bodyRef.current) {
        bodyRef.current.position.y = Math.sin(t * 18.0) * 0.035;
      }
    } else if (bodyRef.current) {
      bodyRef.current.position.y = 0;
    }

    if (beaconRef.current) {
      const mat = beaconRef.current.material as { emissiveIntensity?: number };
      if (mat && typeof mat.emissiveIntensity === "number") {
        mat.emissiveIntensity = headlights ? 1.2 + Math.sin(t * 10.0) * 0.8 : 0.2;
      }
    }
  });

  return (
    <group>
      <group ref={bodyRef}>
        {/* Chassis */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[2.0, 0.35, 5.8]} />
          <meshStandardMaterial color={SCENE_PALETTE.truckChassis} roughness={0.8} />
        </mesh>
        {/* Cab */}
        <mesh position={[0, 1.45, 2.0]} castShadow>
          <boxGeometry args={[1.9, 1.6, 1.7]} />
          <meshStandardMaterial color={SCENE_PALETTE.truckCab} roughness={0.7} />
        </mesh>
        {/* Roof Telemetry Beacon */}
        <mesh ref={beaconRef} position={[0, 2.32, 2.1]}>
          <cylinderGeometry args={[0.16, 0.2, 0.14, 12]} />
          <meshStandardMaterial
            color="#D97757"
            emissive="#D97757"
            emissiveIntensity={headlights ? 1.5 : 0.2}
          />
        </mesh>
        {/* Windshield */}
        <mesh position={[0, 1.65, 2.86]}>
          <boxGeometry args={[1.7, 0.8, 0.05]} />
          <meshStandardMaterial
            color={SCENE_PALETTE.glassWindows}
            emissive={SCENE_PALETTE.glassWindows}
            emissiveIntensity={0.25}
          />
        </mesh>
        {/* Cargo Box */}
        <mesh position={[0, 1.8, -0.8]} castShadow>
          <boxGeometry args={[2.1, 2.3, 3.8]} />
          <meshStandardMaterial color={SCENE_PALETTE.truckCargo} roughness={0.4} />
        </mesh>
        {/* Clay Accent Stripe (--accent #D97757) */}
        <mesh position={[0, 1.25, -0.8]}>
          <boxGeometry args={[2.12, 0.28, 3.82]} />
          <meshStandardMaterial color={accentColor} roughness={0.5} />
        </mesh>

        {/* Rear Taillights */}
        <group position={[0, 0.72, -2.72]}>
          <mesh position={[-0.78, 0, 0]}>
            <boxGeometry args={[0.28, 0.14, 0.04]} />
            <meshStandardMaterial
              color="#D97757"
              emissive="#D97757"
              emissiveIntensity={headlights ? 1.6 : 0.4}
            />
          </mesh>
          <mesh position={[0.78, 0, 0]}>
            <boxGeometry args={[0.28, 0.14, 0.04]} />
            <meshStandardMaterial
              color="#D97757"
              emissive="#D97757"
              emissiveIntensity={headlights ? 1.6 : 0.4}
            />
          </mesh>
        </group>

        {/* Headlights + Warm Ground Light Cone when active */}
        {headlights && (
          <group position={[0, 0.9, 2.86]}>
            <mesh position={[-0.7, 0, 0]}>
              <circleGeometry args={[0.18, 16]} />
              <meshStandardMaterial
                color="#FFFDE6"
                emissive="#FFFDE6"
                emissiveIntensity={2.2}
              />
            </mesh>
            <mesh position={[0.7, 0, 0]}>
              <circleGeometry args={[0.18, 16]} />
              <meshStandardMaterial
                color="#FFFDE6"
                emissive="#FFFDE6"
                emissiveIntensity={2.2}
              />
            </mesh>
            {/* Soft headlight beam projection on asphalt */}
            <mesh position={[0, -0.84, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.2, 3.6]} />
              <meshBasicMaterial color="#FFFDE6" opacity={0.14} transparent />
            </mesh>
          </group>
        )}

        {/* Monospace Branding Logo on TRK-2051 side */}
        {hasLogoDecal && (
          <group position={[1.065, 1.85, -0.8]} rotation={[0, Math.PI / 2, 0]}>
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[2.8, 0.52]} />
              <meshBasicMaterial map={brandDecalTexture} toneMapped={false} />
            </mesh>
          </group>
        )}
      </group>

      {/* Wheels */}
      {WHEEL_POSITIONS.map(([wx, wy, wz], i) => (
        <mesh
          key={`wheel-${i}`}
          ref={(el) => {
            wheelRefs.current[i] = el;
          }}
          position={[wx, wy, wz]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.42, 0.42, 0.28, 16]} />
          <meshStandardMaterial color={SCENE_PALETTE.truckWheels} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

interface TruckEntityProps {
  id: string;
  label: string;
  targetStore: string;
  dockPos: [number, number, number];
  hasLogoDecal: boolean;
  progress: number;
}

const TruckEntity: FC<TruckEntityProps> = ({
  id,
  dockPos,
  hasLogoDecal,
  progress,
}) => {
  const groupRef = useRef<Group>(null);

  const outboundSpline =
    WAREHOUSE_TO_STORE_SPLINES[id as keyof typeof WAREHOUSE_TO_STORE_SPLINES];
  const returnSpline =
    STORE_TO_WAREHOUSE_SPLINES[id as keyof typeof STORE_TO_WAREHOUSE_SPLINES];

  const isOutboundDriving = progress > 0.001 && progress < 0.999;
  const isReturnDriving = progress > 1.001 && progress < 1.999;
  const isDriving = isOutboundDriving || isReturnDriving;
  const isDockedAtStore = progress >= 0.999 && progress <= 1.001;

  useFrame(() => {
    if (!groupRef.current) return;

    if (progress <= 0.001 || progress >= 1.999) {
      // Parked squarely at DC dock (both before departure and after return)
      groupRef.current.position.set(dockPos[0], dockPos[1], dockPos[2]);
      groupRef.current.rotation.y = 0; // Cab facing +Z towards the road
    } else if (isDockedAtStore && outboundSpline) {
      // Parked squarely in destination supermarket loading bay
      const endPt = outboundSpline.getPoint(1.0);
      groupRef.current.position.set(endPt.x, endPt.y, endPt.z);
      const endTangent = outboundSpline.getTangent(1.0);
      groupRef.current.rotation.y = Math.atan2(endTangent.x, endTangent.z);
    } else if (isOutboundDriving && outboundSpline) {
      // Smooth ease-in-out along outbound spline from DC Warehouse to Store
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const pt = outboundSpline.getPoint(eased);
      groupRef.current.position.set(pt.x, pt.y, pt.z);
      const tangent = outboundSpline.getTangent(eased);
      groupRef.current.rotation.y = Math.atan2(tangent.x, tangent.z);
    } else if (isReturnDriving && returnSpline) {
      // Smooth ease-in-out along return spline from Store back to DC Dock
      const r = progress - 1.0;
      const eased =
        r < 0.5 ? 2 * r * r : 1 - Math.pow(-2 * r + 2, 2) / 2;
      const pt = returnSpline.getPoint(eased);
      groupRef.current.position.set(pt.x, pt.y, pt.z);
      const tangent = returnSpline.getTangent(eased);
      const rawYaw = Math.atan2(tangent.x, tangent.z);
      // In final 18% of return path, smoothly align truck cab to face +Z (yaw = 0) at DC dock
      if (eased > 0.82) {
        const alignT = (eased - 0.82) / 0.18;
        groupRef.current.rotation.y = rawYaw * (1 - alignT);
      } else {
        groupRef.current.rotation.y = rawYaw;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <DarkTruckMesh
        headlights={isDriving || isDockedAtStore}
        hasLogoDecal={hasLogoDecal}
        isMoving={isDriving}
      />
    </group>
  );
};

/**
 * Continuous Ambient Supply Chain Patrol Van on the closed road loop
 * Keeps the road alive 100% of the time with smooth corner deceleration
 */
const AmbientRoadPatrol: FC<{
  initialU: number;
  speed: number;
  laneOffset: number;
  scale?: number;
}> = ({ initialU, speed, laneOffset, scale = 0.82 }) => {
  const groupRef = useRef<Group>(null);
  const uRef = useRef(initialU);
  const tempPos = useRef(new Vector3());
  const tempTan = useRef(new Vector3());

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const isCorner = ROAD_CENTERLINE_CURVE.isCornerSegment(uRef.current);
    const currentSpeed = isCorner ? speed * 0.78 : speed;
    uRef.current = (uRef.current + delta * currentSpeed) % 1.0;

    ROAD_CENTERLINE_CURVE.getPoint(uRef.current, tempPos.current);
    ROAD_CENTERLINE_CURVE.getTangent(uRef.current, tempTan.current);

    // Perpendicular lane offset so it stays neatly in its lane
    const nx = -tempTan.current.z;
    const nz = tempTan.current.x;

    groupRef.current.position.set(
      tempPos.current.x + nx * laneOffset,
      0,
      tempPos.current.z + nz * laneOffset
    );
    groupRef.current.rotation.y = Math.atan2(tempTan.current.x, tempTan.current.z);
  });

  return (
    <group ref={groupRef} scale={scale}>
      <DarkTruckMesh
        headlights={true}
        hasLogoDecal={false}
        isMoving={true}
        accentColor="#A3A199"
      />
    </group>
  );
};

const DOCK_MARKINGS = [
  // DC Warehouse 4 docks (North)
  { id: "DC-DOCK-1", position: [-7.5, 0.025, -23.5] as [number, number, number], rotY: 0 },
  { id: "DC-DOCK-2", position: [-2.5, 0.025, -23.5] as [number, number, number], rotY: 0 },
  { id: "DC-DOCK-3", position: [2.5, 0.025, -23.5] as [number, number, number], rotY: 0 },
  { id: "DC-DOCK-4", position: [7.5, 0.025, -23.5] as [number, number, number], rotY: 0 },
  // 4 Supermarket loading bays
  { id: "BAY-STR-001", position: [33.0, 0.025, 0] as [number, number, number], rotY: Math.PI / 2 },
  { id: "BAY-STR-004", position: [14.0, 0.025, 23.0] as [number, number, number], rotY: 0 },
  { id: "BAY-STR-002", position: [-14.0, 0.025, 23.0] as [number, number, number], rotY: 0 },
  { id: "BAY-STR-003", position: [-33.0, 0.025, 0] as [number, number, number], rotY: -Math.PI / 2 },
];

/**
 * Yellow/Orange Parking Bay Outlines (width 3.5, depth 6) in front of all docks & bays
 */
const ParkingBayMarkings: FC = () => {
  return (
    <group>
      {DOCK_MARKINGS.map((bay) => (
        <group
          key={bay.id}
          position={bay.position}
          rotation={[-Math.PI / 2, 0, bay.rotY]}
        >
          {/* Outer yellow line border */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[3.5, 6.0]} />
            <meshBasicMaterial color="#D9B44A" opacity={0.75} transparent />
          </mesh>
          {/* Inner cutout so only 0.14m border stripe remains */}
          <mesh position={[0, 0, 0.002]}>
            <planeGeometry args={[3.22, 5.72]} />
            <meshStandardMaterial color="#2A2927" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const TRUCK_FLEET = [
  {
    id: "TRK-2051",
    label: "TRK-2051 -> Sudirman",
    targetStore: "STR-001",
    dockPos: [-7.5, 0, -23.5] as [number, number, number],
    hasLogoDecal: false,
  },
  {
    id: "TRK-2409",
    label: "TRK-2409 -> Stasiun",
    targetStore: "STR-004",
    dockPos: [-2.5, 0, -23.5] as [number, number, number],
    hasLogoDecal: false,
  },
  {
    id: "TRK-2205",
    label: "TRK-2205 -> Kampus",
    targetStore: "STR-002",
    dockPos: [2.5, 0, -23.5] as [number, number, number],
    hasLogoDecal: false,
  },
  {
    id: "TRK-2307",
    label: "TRK-2307 -> Perumahan",
    targetStore: "STR-003",
    dockPos: [7.5, 0, -23.5] as [number, number, number],
    hasLogoDecal: false,
  },
];

interface FleetProps {
  truckProgress?: Record<string, number>;
}

export const Fleet: FC<FleetProps> = ({ truckProgress = {} }) => {
  return (
    <group>
      {/* 1. Yellow/Orange Parking Bay Outlines (width 3.5, depth 6) */}
      <ParkingBayMarkings />

      {/* 2. Continuous Ambient Logistics Patrol Vans on Road Loop */}
      <AmbientRoadPatrol initialU={0.18} speed={0.032} laneOffset={-1.35} scale={0.78} />
      <AmbientRoadPatrol initialU={0.68} speed={0.032} laneOffset={1.35} scale={0.78} />

      {/* 3. Warehouse-to-Store Replenishment Trucks */}
      {TRUCK_FLEET.map((vehicle) => (
        <TruckEntity
          key={vehicle.id}
          id={vehicle.id}
          label={vehicle.label}
          targetStore={vehicle.targetStore}
          dockPos={vehicle.dockPos}
          hasLogoDecal={vehicle.hasLogoDecal}
          progress={truckProgress[vehicle.id] || 0}
        />
      ))}
    </group>
  );
};
