import { useMemo, type FC } from "react";
import { Instances, Instance } from "@react-three/drei";
import { MATERIALS } from "./Materials";

/**
 * Procedural Ground with soft concentric rings for depth reference
 */
export const ProceduralGround: FC<{ onPointerMissed?: () => void }> = ({ onPointerMissed }) => {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Main Ground Plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onPointerMissed?.();
        }}
      >
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color={MATERIALS.ground} roughness={0.95} />
      </mesh>

      {/* Soft concentric isometric reference rings */}
      {[25, 45, 65, 85].map((radius, i) => (
        <mesh key={`ring-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <ringGeometry args={[radius - 0.12, radius, 64]} />
          <meshBasicMaterial color={MATERIALS.groundGrid} opacity={0.65} transparent />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Procedural Road Network connecting all 4 sites in the 80x80 layout:
 * DC-01 [-24, 0, -14], STR-001 [14, 0, -14], STR-002 [14, 0, 14], STR-003 [-24, 0, 14]
 */
export const ProceduralRoads: FC = () => {
  // Road dashed lines coordinates
  const northDashes = useMemo(() => [-20, -14, -8, -2, 4, 10], []);
  const eastDashes = useMemo(() => [-10, -5, 0, 5, 10], []);
  const southDashes = useMemo(() => [-20, -14, -8, -2, 4, 10], []);
  const westDashes = useMemo(() => [-10, -5, 0, 5, 10], []);

  return (
    <group position={[0, 0, 0]}>
      {/* North Road (connects DC to STR-001 along Z = -5) */}
      <mesh position={[-5, 0.035, -5]} receiveShadow>
        <boxGeometry args={[44, 0.07, 4.2]} />
        <meshStandardMaterial color={MATERIALS.roadSurface} roughness={0.88} />
      </mesh>
      {northDashes.map((x, i) => (
        <mesh key={`nd-${i}`} position={[x, 0.075, -5]}>
          <boxGeometry args={[2.4, 0.015, 0.22]} />
          <meshBasicMaterial color={MATERIALS.roadDash} />
        </mesh>
      ))}

      {/* East Road (connects STR-001 to STR-002 along X = 12) */}
      <mesh position={[12, 0.035, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.07, 30]} />
        <meshStandardMaterial color={MATERIALS.roadSurface} roughness={0.88} />
      </mesh>
      {eastDashes.map((z, i) => (
        <mesh key={`ed-${i}`} position={[12, 0.075, z]}>
          <boxGeometry args={[0.22, 0.015, 2.4]} />
          <meshBasicMaterial color={MATERIALS.roadDash} />
        </mesh>
      ))}

      {/* South Road (connects STR-003 to STR-002 along Z = 10) */}
      <mesh position={[-5, 0.035, 10]} receiveShadow>
        <boxGeometry args={[44, 0.07, 4.2]} />
        <meshStandardMaterial color={MATERIALS.roadSurface} roughness={0.88} />
      </mesh>
      {southDashes.map((x, i) => (
        <mesh key={`sd-${i}`} position={[x, 0.075, 10]}>
          <boxGeometry args={[2.4, 0.015, 0.22]} />
          <meshBasicMaterial color={MATERIALS.roadDash} />
        </mesh>
      ))}

      {/* West Road (connects DC to STR-003 along X = -20) */}
      <mesh position={[-20, 0.035, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.07, 28]} />
        <meshStandardMaterial color={MATERIALS.roadSurface} roughness={0.88} />
      </mesh>
      {westDashes.map((z, i) => (
        <mesh key={`wd-${i}`} position={[-20, 0.075, z]}>
          <boxGeometry args={[0.22, 0.015, 2.4]} />
          <meshBasicMaterial color={MATERIALS.roadDash} />
        </mesh>
      ))}

      {/* Diagonal Central Connection */}
      <mesh position={[-4, 0.033, 2.5]} rotation={[0, -Math.PI / 4, 0]} receiveShadow>
        <boxGeometry args={[26, 0.065, 4.0]} />
        <meshStandardMaterial color={MATERIALS.roadSurface} roughness={0.88} />
      </mesh>
    </group>
  );
};

/**
 * Procedural DC Warehouse:
 * White box + blue roof slab + 5 dark dock-bay insets + canopy overhang
 */
export const ProceduralDCWarehouse: FC = () => {
  return (
    <group>
      {/* Main Warehouse Hall */}
      <mesh position={[0, 4.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[30, 8.0, 16]} />
        <meshStandardMaterial color={MATERIALS.buildingWall} roughness={0.8} />
      </mesh>

      {/* Blue Roof Slab */}
      <mesh position={[0, 8.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[31.2, 0.5, 17.2]} />
        <meshStandardMaterial color={MATERIALS.roofBlue} roughness={0.35} />
      </mesh>

      {/* 5 Dark Dock-Bay Insets on front (+Z side) */}
      {[-10, -5, 0, 5, 10].map((bayX, i) => (
        <group key={`bay-${i}`} position={[bayX, 1.6, 8.02]}>
          {/* Dock Inset */}
          <mesh>
            <boxGeometry args={[2.8, 3.2, 0.15]} />
            <meshStandardMaterial color={MATERIALS.dockBayInset} roughness={0.9} />
          </mesh>
          {/* Yellow Bay Number Strip */}
          <mesh position={[0, 1.8, 0.05]}>
            <boxGeometry args={[2.0, 0.25, 0.05]} />
            <meshStandardMaterial color={MATERIALS.bayOutline} />
          </mesh>
        </group>
      ))}

      {/* Protective Overhang Canopy above Docks */}
      <mesh position={[0, 3.8, 9.2]} castShadow>
        <boxGeometry args={[26, 0.3, 2.6]} />
        <meshStandardMaterial color={MATERIALS.roofBlue} roughness={0.4} />
      </mesh>
    </group>
  );
};

/**
 * Procedural Minimarket:
 * White box + blue roof overhang + light-blue glass front + signage strip
 */
export const ProceduralMinimarket: FC = () => {
  return (
    <group>
      {/* Main Store Building */}
      <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[12, 4.2, 8]} />
        <meshStandardMaterial color={MATERIALS.buildingWall} roughness={0.8} />
      </mesh>

      {/* Blue Roof Overhang */}
      <mesh position={[0, 4.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[12.8, 0.4, 8.8]} />
        <meshStandardMaterial color={MATERIALS.roofBlue} roughness={0.35} />
      </mesh>

      {/* Front Glass Storefront Window */}
      <mesh position={[0, 1.6, 4.02]}>
        <planeGeometry args={[8.8, 2.5]} />
        <meshStandardMaterial color={MATERIALS.glassFront} roughness={0.15} metalness={0.1} />
      </mesh>

      {/* Blue Signage Strip above Storefront */}
      <mesh position={[0, 3.4, 4.04]} castShadow>
        <boxGeometry args={[11.2, 0.7, 0.15]} />
        <meshStandardMaterial color={MATERIALS.signageBlue} roughness={0.35} />
      </mesh>
    </group>
  );
};

/**
 * Procedural Truck:
 * Cab box + cargo box + 6 cylinder wheels (blue cab / white cargo)
 */
export const ProceduralTruck: FC<{ variant?: "A" | "B" }> = ({ variant = "A" }) => {
  const cabColor = variant === "B" ? MATERIALS.truckCabPartner : MATERIALS.truckCabPrimary;

  return (
    <group>
      {/* Cargo Box */}
      <mesh position={[0, 1.8, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 2.3, 4.0]} />
        <meshStandardMaterial color={MATERIALS.truckCargoBox} roughness={0.5} />
      </mesh>

      {/* Cargo Bottom Blue Accent Stripe */}
      <mesh position={[0, 0.8, -0.9]}>
        <boxGeometry args={[2.42, 0.25, 4.02]} />
        <meshStandardMaterial color={MATERIALS.truckCargoStripe} roughness={0.4} />
      </mesh>

      {/* Cab Box */}
      <mesh position={[0, 1.45, 1.8]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.7, 1.9]} />
        <meshStandardMaterial color={cabColor} roughness={0.4} />
      </mesh>

      {/* Teal stripe for partner variant */}
      {variant === "B" && (
        <mesh position={[0, 1.25, 1.82]}>
          <boxGeometry args={[2.22, 0.22, 1.92]} />
          <meshStandardMaterial color={MATERIALS.truckTealStripe} />
        </mesh>
      )}

      {/* Cab Windshield Glass */}
      <mesh position={[0, 1.7, 2.76]} rotation={[0.1, 0, 0]}>
        <planeGeometry args={[1.9, 0.8]} />
        <meshStandardMaterial color={MATERIALS.glassFront} roughness={0.15} />
      </mesh>

      {/* Chassis Frame */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.5, 0.32, 5.8]} />
        <meshStandardMaterial color={MATERIALS.truckChassis} roughness={0.9} />
      </mesh>

      {/* 6 Cylinder Wheels */}
      {[
        [-1.0, 0.38, 2.0],
        [1.0, 0.38, 2.0],
        [-1.0, 0.38, -1.0],
        [1.0, 0.38, -1.0],
        [-1.0, 0.38, -2.1],
        [1.0, 0.38, -2.1],
      ].map(([wx, wy, wz], i) => (
        <mesh
          key={`wheel-${i}`}
          position={[wx, wy, wz]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.38, 0.38, 0.28, 16]} />
          <meshStandardMaterial color={MATERIALS.truckWheelTire} roughness={0.95} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Procedural Pallets & Containers
 */
export const ProceduralPallets: FC<{ variant?: "cards" | "blue" }> = ({ variant = "cards" }) => {
  if (variant === "blue") {
    return (
      <group>
        {/* Blue Container Stack */}
        <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.1, 1.2]} />
          <meshStandardMaterial color={MATERIALS.palletBlueContainer} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.8, 1.1]} />
          <meshStandardMaterial color={MATERIALS.palletBlueContainer} roughness={0.4} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {/* Brown Pallet Slab */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[1.2, 0.16, 1.0]} />
        <meshStandardMaterial color={MATERIALS.palletWood} roughness={0.85} />
      </mesh>
      {/* Cardboard Boxes */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.65, 0.85]} />
        <meshStandardMaterial color={MATERIALS.palletBoxCardboard} roughness={0.8} />
      </mesh>
    </group>
  );
};

/**
 * Procedural Instanced Trees:
 * High-performance batched rendering (<Instances>)
 * Icosphere canopy #86D9A5 + cylinder trunk #8B6F4E
 */
export interface TreeTransform {
  position: [number, number, number];
  scale?: number;
}

export const ProceduralTrees: FC<{ trees: TreeTransform[] }> = ({ trees }) => {
  return (
    <group>
      {/* Trunks Instance */}
      <Instances range={trees.length}>
        <cylinderGeometry args={[0.2, 0.26, 2.4, 8]} />
        <meshStandardMaterial color={MATERIALS.treeTrunk} roughness={0.85} />
        {trees.map((t, idx) => (
          <Instance
            key={`trunk-${idx}`}
            position={[t.position[0], t.position[1] + 1.2, t.position[2]]}
            scale={t.scale ?? 1}
          />
        ))}
      </Instances>

      {/* Canopy Icospheres Instance */}
      <Instances range={trees.length}>
        <icosahedronGeometry args={[1.3, 1]} />
        <meshStandardMaterial color={MATERIALS.treeCanopy} roughness={0.6} />
        {trees.map((t, idx) => (
          <Instance
            key={`canopy-${idx}`}
            position={[t.position[0], t.position[1] + 3.0, t.position[2]]}
            scale={t.scale ?? 1}
          />
        ))}
      </Instances>
    </group>
  );
};

/**
 * Procedural Map Pin:
 * Cone + sphere floating above sites with pending items or stockout risk
 */
export const ProceduralMapPin: FC<{ color?: string }> = ({ color = MATERIALS.pinNormal }) => {
  return (
    <group position={[0, 6.4, 0]}>
      {/* Inverted Cone pointing to site */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.5, 1.1, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Sphere head of pin */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <sphereGeometry args={[0.52, 16, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
      </mesh>
    </group>
  );
};
