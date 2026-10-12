import { useRef, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { type Group } from "three";
import { SCENE_PALETTE } from "@/config/scenePalette";
import { WAREHOUSE_TO_STORE_SPLINES } from "./RoadRouter";
import { brandDecalTexture } from "./brandDecal";

useGLTF.preload("/models/twin/truck_box.glb");

/**
 * Logistics Truck Mesh with dark-warm aesthetic (NO blue allowed)
 */
const DarkTruckMesh: FC<{ headlights: boolean; hasLogoDecal: boolean }> = ({
  headlights,
  hasLogoDecal,
}) => {
  return (
    <group>
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
      {/* Windshield */}
      <mesh position={[0, 1.65, 2.86]}>
        <boxGeometry args={[1.7, 0.8, 0.05]} />
        <meshStandardMaterial
          color={SCENE_PALETTE.glassWindows}
          emissive={SCENE_PALETTE.glassWindows}
          emissiveIntensity={0.2}
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
        <meshStandardMaterial color={SCENE_PALETTE.truckStripe} roughness={0.5} />
      </mesh>
      {/* Wheels */}
      {[
        [-1.05, 0.45, 1.8],
        [1.05, 0.45, 1.8],
        [-1.05, 0.45, -1.2],
        [1.05, 0.45, -1.2],
        [-1.05, 0.45, -2.1],
        [1.05, 0.45, -2.1],
      ].map(([wx, wy, wz], i) => (
        <mesh key={`wheel-${i}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.42, 0.42, 0.28, 16]} />
          <meshStandardMaterial color={SCENE_PALETTE.truckWheels} roughness={0.9} />
        </mesh>
      ))}

      {/* Headlights (Warm emissive #FFFDE6 when active) */}
      {headlights && (
        <group position={[0, 0.9, 2.86]}>
          <mesh position={[-0.7, 0, 0]}>
            <circleGeometry args={[0.18, 16]} />
            <meshStandardMaterial
              color="#FFFDE6"
              emissive="#FFFDE6"
              emissiveIntensity={2.0}
            />
          </mesh>
          <mesh position={[0.7, 0, 0]}>
            <circleGeometry args={[0.18, 16]} />
            <meshStandardMaterial
              color="#FFFDE6"
              emissive="#FFFDE6"
              emissiveIntensity={2.0}
            />
          </mesh>
        </group>
      )}

      {/* Monospace Branding Logo on TRK-2051 side (Brand Decal #2 of 2) */}
      {hasLogoDecal && (
        <group position={[1.065, 1.85, -0.8]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[2.8, 0.52]} />
            <meshBasicMaterial map={brandDecalTexture} toneMapped={false} />
          </mesh>
        </group>
      )}
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

  const spline = WAREHOUSE_TO_STORE_SPLINES[id as keyof typeof WAREHOUSE_TO_STORE_SPLINES];
  const isDriving = progress > 0.001 && progress < 0.999;

  useFrame(() => {
    if (!groupRef.current) return;

    if (progress <= 0.001) {
      // Parked squarely at DC dock
      groupRef.current.position.set(dockPos[0], dockPos[1], dockPos[2]);
      groupRef.current.rotation.y = 0; // Cab facing +Z towards the road
    } else if (progress >= 0.999 && spline) {
      // Parked squarely in destination supermarket loading bay
      const endPt = spline.getPoint(1.0);
      groupRef.current.position.set(endPt.x, endPt.y, endPt.z);
      const endTangent = spline.getTangent(1.0);
      groupRef.current.rotation.y = Math.atan2(endTangent.x, endTangent.z);
    } else if (spline) {
      // Driving smoothly from DC Warehouse to Store along road loop
      const pt = spline.getPoint(progress);
      groupRef.current.position.set(pt.x, pt.y, pt.z);
      const tangent = spline.getTangent(progress);
      groupRef.current.rotation.y = Math.atan2(tangent.x, tangent.z);
    }
  });

  return (
    <group ref={groupRef}>
      <DarkTruckMesh
        headlights={isDriving}
        hasLogoDecal={hasLogoDecal}
      />
    </group>
  );
};

const DOCK_MARKINGS = [
  // DC Warehouse docks (North)
  { id: "DC-DOCK-1", position: [-6.0, 0.025, -23.5] as [number, number, number], rotY: 0 },
  { id: "DC-DOCK-2", position: [0.0, 0.025, -23.5] as [number, number, number], rotY: 0 },
  { id: "DC-DOCK-3", position: [6.0, 0.025, -23.5] as [number, number, number], rotY: 0 },
  // Supermarket loading bays
  { id: "BAY-STR-001", position: [33.0, 0.025, 0] as [number, number, number], rotY: Math.PI / 2 },
  { id: "BAY-STR-002", position: [0.0, 0.025, 23.0] as [number, number, number], rotY: 0 },
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
            <meshBasicMaterial color="#D9B44A" opacity={0.7} transparent />
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
    dockPos: [-6.0, 0, -23.5] as [number, number, number],
    hasLogoDecal: true,
  },
  {
    id: "TRK-2205",
    label: "TRK-2205 -> Kampus",
    targetStore: "STR-002",
    dockPos: [0.0, 0, -23.5] as [number, number, number],
    hasLogoDecal: false,
  },
  {
    id: "TRK-2307",
    label: "TRK-2307 -> Perumahan",
    targetStore: "STR-003",
    dockPos: [6.0, 0, -23.5] as [number, number, number],
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

      {/* 2. Warehouse-to-Store Trucks: spawn parked at DC, dispatch on approve, park at stores */}
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
