import { useMemo, useEffect, useRef, Suspense, type FC } from "react";
import { useGLTF } from "@react-three/drei";
import { Vector3, Mesh, MeshStandardMaterial, type Group } from "three";
import { SCENE_PALETTE } from "@/config/scenePalette";
import {
  type SiteConfigItem,
  STAGING_SLOTS,
  ROAD,
} from "@/config/siteConfig";
import { computeBuildingOrientation } from "./RoadRouter";

// Preload GLB models
useGLTF.preload("/models/twin/dc_warehouse.glb");
useGLTF.preload("/models/twin/minimarket.glb");
useGLTF.preload("/models/twin/cargo_cluster_a.glb");
useGLTF.preload("/models/twin/cargo_cluster_b.glb");
useGLTF.preload("/models/twin/cargo_row.glb");
useGLTF.preload("/models/twin/rack_full.glb");
useGLTF.preload("/models/twin/trolley.glb");

/**
 * Architectural details to beautify the DC Warehouse:
 * - Strictly 4 Loading Dock Bays aligned with the 4 fleet trucks (x = -7.5, -2.5, 2.5, 7.5 in world space)
 * - Parapet crown, control-room ribbon window, rooftop skylights, warm LED dock canopy lighting, and safety bollards
 */
const DC_FOUR_DOCK_LOCAL_X = [-7.895, -2.632, 2.632, 7.895] as const;

const DCArchitecturalEnhancements: FC = () => {
  return (
    <group>
      {/* 4 Symmetrical Loading Dock Bays (replacing the 5 baked GLB doors to match the 4 trucks) */}
      {DC_FOUR_DOCK_LOCAL_X.map((dx, idx) => (
        <group key={`dc-dock-bay-${idx}`} position={[dx, 0, 0]}>
          {/* Projecting Clay-Orange Dock Shelter Frame (3.2m wide x 3.6m tall) */}
          <mesh position={[0, 2.25, -6.95]} castShadow receiveShadow>
            <boxGeometry args={[3.2, 3.6, 0.45]} />
            <meshStandardMaterial color="#D97757" roughness={0.5} />
          </mesh>
          {/* Recessed Dark Roll-Up Segmented Dock Door */}
          <mesh position={[0, 2.15, -7.12]} receiveShadow>
            <boxGeometry args={[2.6, 3.2, 0.16]} />
            <meshStandardMaterial color="#2A2927" roughness={0.75} />
          </mesh>
          {/* Horizontal Roll-Up Door Slat Lines */}
          {[0.9, 1.5, 2.1, 2.7, 3.3].map((sy, sIdx) => (
            <mesh key={`slat-${idx}-${sIdx}`} position={[0, sy, -7.21]}>
              <boxGeometry args={[2.52, 0.04, 0.04]} />
              <meshStandardMaterial color="#3D3C39" roughness={0.6} />
            </mesh>
          ))}
          {/* Dock Rubber Bumpers (Left & Right) */}
          <mesh position={[-1.42, 0.68, -7.18]} castShadow>
            <boxGeometry args={[0.22, 0.82, 0.24]} />
            <meshStandardMaterial color="#D9B44A" roughness={0.5} />
          </mesh>
          <mesh position={[1.42, 0.68, -7.18]} castShadow>
            <boxGeometry args={[0.22, 0.82, 0.24]} />
            <meshStandardMaterial color="#D9B44A" roughness={0.5} />
          </mesh>
          {/* Green/Warm Status Beacon Above Each Dock Bay */}
          <mesh position={[0, 4.25, -7.16]}>
            <boxGeometry args={[0.75, 0.28, 0.1]} />
            <meshStandardMaterial color="#1F1E1D" roughness={0.7} />
          </mesh>
          <mesh position={[0, 4.25, -7.22]}>
            <boxGeometry args={[0.48, 0.1, 0.04]} />
            <meshStandardMaterial
              color="#FAF9F5"
              emissive="#D97757"
              emissiveIntensity={1.5}
            />
          </mesh>
        </group>
      ))}

      {/* Wrap-around rooftop parapet trim in clay-orange (#D97757) */}
      <mesh position={[0, 7.12, 0]} castShadow>
        <boxGeometry args={[28.4, 0.24, 14.4]} />
        <meshStandardMaterial color="#D97757" roughness={0.5} />
      </mesh>
      <mesh position={[0, 7.28, 0]}>
        <boxGeometry args={[27.8, 0.14, 13.8]} />
        <meshStandardMaterial color="#2A2927" roughness={0.8} />
      </mesh>

      {/* 2nd-Floor Logistics Control Room Ribbon Window on Front Facade (z = -7.02) */}
      <mesh position={[0, 5.65, -7.02]}>
        <boxGeometry args={[19.4, 1.15, 0.14]} />
        <meshStandardMaterial color="#2A2927" roughness={0.6} />
      </mesh>
      <mesh position={[0, 5.65, -7.08]}>
        <boxGeometry args={[18.8, 0.85, 0.08]} />
        <meshStandardMaterial
          color="#FAF9F5"
          emissive="#FAF9F5"
          emissiveIntensity={0.45}
          roughness={0.15}
        />
      </mesh>
      {/* Window vertical mullions aligned with the 4 dock bays */}
      {[-5.26, 0, 5.26].map((mx, i) => (
        <mesh key={`dc-mullion-${i}`} position={[mx, 5.65, -7.12]}>
          <boxGeometry args={[0.16, 0.95, 0.08]} />
          <meshStandardMaterial color="#2A2927" roughness={0.7} />
        </mesh>
      ))}

      {/* Warm LED Dock Canopy Under-Light Strip */}
      <mesh position={[0, 3.92, -7.35]}>
        <boxGeometry args={[20.4, 0.08, 0.22]} />
        <meshStandardMaterial
          color="#FAF9F5"
          emissive="#D97757"
          emissiveIntensity={1.35}
        />
      </mesh>

      {/* 4 Industrial Rooftop Skylight Bays */}
      {[-8.5, -2.8, 2.8, 8.5].map((sx, i) => (
        <group key={`dc-skylight-${i}`} position={[sx, 7.35, 0.5]}>
          <mesh castShadow>
            <boxGeometry args={[3.6, 0.32, 6.4]} />
            <meshStandardMaterial color="#3D3C39" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <boxGeometry args={[3.1, 0.08, 5.9]} />
            <meshStandardMaterial
              color="#2A2927"
              emissive="#FAF9F5"
              emissiveIntensity={0.18}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* 5 Safety Bollards separating the 4 loading bays */}
      {[-10.6, -5.26, 0, 5.26, 10.6].map((bx, i) => (
        <mesh key={`dc-bollard-${i}`} position={[bx, 0.45, -7.8]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.9, 10]} />
          <meshStandardMaterial color="#D97757" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Architectural details to beautify each Minimarket Store (modern layered fascia,
 * warm LED storefront soffit, rooftop skylight & HVAC units, and entrance bollards)
 */
const StoreArchitecturalEnhancements: FC<{ isHighlighted?: boolean }> = ({
  isHighlighted = false,
}) => {
  return (
    <group>
      {/* Crisp warm-white accent stripe along the clay-orange roof fascia */}
      <mesh position={[0, 4.18, 0]}>
        <boxGeometry args={[10.52, 0.14, 8.52]} />
        <meshStandardMaterial
          color="#FAF9F5"
          emissive="#FAF9F5"
          emissiveIntensity={isHighlighted ? 0.55 : 0.25}
          roughness={0.3}
        />
      </mesh>

      {/* Architectural Dark Parapet Cap */}
      <mesh position={[0, 4.58, 0]} castShadow>
        <boxGeometry args={[10.2, 0.16, 8.2]} />
        <meshStandardMaterial color="#2A2927" roughness={0.75} />
      </mesh>

      {/* Warm LED Soffit Strip under the Front Storefront Canopy (z = -4.6) */}
      <mesh position={[0, 2.92, -4.65]}>
        <boxGeometry args={[8.4, 0.07, 0.18]} />
        <meshStandardMaterial
          color="#FAF9F5"
          emissive="#D97757"
          emissiveIntensity={isHighlighted ? 1.8 : 1.15}
        />
      </mesh>

      {/* Rooftop Skylight & Twin HVAC Units */}
      <group position={[-1.6, 4.68, 0.6]}>
        <mesh castShadow>
          <boxGeometry args={[3.4, 0.26, 2.6]} />
          <meshStandardMaterial color="#3D3C39" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[2.9, 0.06, 2.1]} />
          <meshStandardMaterial
            color="#2A2927"
            emissive="#FAF9F5"
            emissiveIntensity={0.22}
          />
        </mesh>
      </group>
      {[1.8, 3.1].map((hx, i) => (
        <mesh key={`hvac-${i}`} position={[hx, 4.82, 1.0]} castShadow>
          <boxGeometry args={[0.95, 0.55, 1.1]} />
          <meshStandardMaterial color="#3D3C39" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}

      {/* Storefront Safety Bollards along Front Walk */}
      {[-3.4, -1.8, 1.8, 3.4].map((bx, i) => (
        <mesh key={`store-bollard-${i}`} position={[bx, 0.38, -4.85]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.76, 8]} />
          <meshStandardMaterial color="#D97757" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Procedural Wooden Pallet with slatted look (#6E5A40)
 */
const ProceduralPallet: FC<{ position?: [number, number, number]; rotationY?: number; scale?: number }> = ({
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1.0,
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* 3 Runner blocks */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <mesh key={`runner-${i}`} position={[x, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 0.1, 1.2]} />
          <meshStandardMaterial color="#5C4B35" roughness={0.9} />
        </mesh>
      ))}
      {/* 5 Top deck boards (#6E5A40) */}
      {[-0.48, -0.24, 0, 0.24, 0.48].map((z, i) => (
        <mesh key={`deck-${i}`} position={[0, 0.12, z]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.04, 0.18]} />
          <meshStandardMaterial color="#6E5A40" roughness={0.88} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Procedural Cardboard Box Cluster on Pallet (#C9A87C and #6E5A40)
 */
const ProceduralBoxCluster: FC<{
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
  variant?: "small" | "medium" | "tall";
}> = ({ position, rotationY = 0, scale = 1.0, variant = "medium" }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <ProceduralPallet />
      {/* Base Layer: 4 cardboard boxes (#C9A87C, #BA9668, #D4B68E) */}
      <mesh position={[-0.26, 0.38, -0.26]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.46, 0.5]} />
        <meshStandardMaterial color="#C9A87C" roughness={0.82} />
      </mesh>
      <mesh position={[0.26, 0.38, -0.26]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.46, 0.48]} />
        <meshStandardMaterial color="#BA9668" roughness={0.82} />
      </mesh>
      <mesh position={[-0.26, 0.38, 0.26]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.46, 0.48]} />
        <meshStandardMaterial color="#D4B68E" roughness={0.82} />
      </mesh>
      <mesh position={[0.26, 0.38, 0.26]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.46, 0.5]} />
        <meshStandardMaterial color="#C9A87C" roughness={0.82} />
      </mesh>

      {/* Second Layer */}
      {variant !== "small" && (
        <>
          <mesh position={[-0.2, 0.82, 0.0]} rotation={[0, 0.06, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.42, 0.5]} />
            <meshStandardMaterial color="#C9A87C" roughness={0.82} />
          </mesh>
          <mesh position={[0.24, 0.82, -0.1]} rotation={[0, -0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.46, 0.42, 0.46]} />
            <meshStandardMaterial color="#BA9668" roughness={0.82} />
          </mesh>
        </>
      )}

      {/* Third Layer for tall variant */}
      {variant === "tall" && (
        <mesh position={[0.02, 1.22, -0.04]} rotation={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.44, 0.38, 0.44]} />
          <meshStandardMaterial color="#D4B68E" roughness={0.82} />
        </mesh>
      )}
    </group>
  );
};

/**
 * Procedural Industrial Warehouse Storage Rack with Shelves & Boxes
 */
const ProceduralStorageRack: FC<{
  position: [number, number, number];
  rotationY?: number;
  scale?: number;
}> = ({ position, rotationY = 0, scale = 1.0 }) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* 4 Upright steel pillars (#4A4844) */}
      {[
        [-0.9, -0.4],
        [0.9, -0.4],
        [-0.9, 0.4],
        [0.9, 0.4],
      ].map(([x, z], i) => (
        <mesh key={`post-${i}`} position={[x, 1.5, z]} castShadow>
          <boxGeometry args={[0.08, 3.0, 0.08]} />
          <meshStandardMaterial color="#4A4844" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* 3 Shelves with horizontal beams, wooden planks, and cardboard boxes */}
      {[0.3, 1.35, 2.4].map((y, i) => (
        <group key={`shelf-${i}`} position={[0, y, 0]}>
          <mesh position={[0, 0, -0.4]} castShadow>
            <boxGeometry args={[1.88, 0.08, 0.06]} />
            <meshStandardMaterial color="#3A3937" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0, 0.4]} castShadow>
            <boxGeometry args={[1.88, 0.08, 0.06]} />
            <meshStandardMaterial color="#3A3937" metalness={0.7} roughness={0.3} />
          </mesh>
          {/* Wooden shelf plank (#6E5A40) */}
          <mesh position={[0, 0.04, 0]} receiveShadow>
            <boxGeometry args={[1.84, 0.03, 0.76]} />
            <meshStandardMaterial color="#6E5A40" roughness={0.8} />
          </mesh>
          {/* Cardboard boxes on shelf (#C9A87C and #BA9668) */}
          {[-0.5, 0, 0.5].map((bx, j) => (
            <mesh key={`box-${i}-${j}`} position={[bx, 0.28, 0]} castShadow>
              <boxGeometry args={[0.46, 0.42, 0.58]} />
              <meshStandardMaterial color={j % 2 === 0 ? "#C9A87C" : "#BA9668"} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

/**
 * Generic Staging Prop with warm-dark material neutralization (NO blue) and seeded jitter
 */
const StagingProp: FC<{
  url: string;
  localPos: [number, number, number];
  localRotY?: number;
  rotJitterDeg?: number;
  scaleJitter?: number;
}> = ({ url, localPos, localRotY = 0, rotJitterDeg = 0, scaleJitter = 1.0 }) => {
  const { scene } = useGLTF(url);
  const clonedScene = useMemo(() => {
    const s = scene.clone(true);
    // Neutralize any blue container materials to dark-warm charcoal (#4A4844)
    s.traverse((obj) => {
      if ((obj as Mesh).isMesh) {
        const mesh = obj as Mesh;
        if (mesh.material) {
          const mat = (mesh.material as MeshStandardMaterial).clone();
          const name = (mat.name || "").toLowerCase();
          if (name.includes("container") || name.includes("blue")) {
            mat.color.set("#4A4844");
          }
          mesh.material = mat;
        }
      }
    });
    return s;
  }, [scene]);

  const finalRotY = localRotY + (rotJitterDeg * Math.PI) / 180;

  return (
    <group
      position={localPos}
      rotation={[0, finalRotY, 0]}
      scale={[scaleJitter, scaleJitter, scaleJitter]}
    >
      <primitive object={clonedScene} />
    </group>
  );
};

interface SiteGroupProps {
  site: SiteConfigItem;
  hasArrived?: boolean;
  stockPct?: number;
  isSelected?: boolean;
  onSelect?: (siteId: string) => void;
}

export const SiteGroup: FC<SiteGroupProps> = ({
  site,
  hasArrived = false,
  stockPct: _stockPct = 75,
  isSelected = false,
  onSelect,
}) => {
  const isDC = site.type === "DC";
  const groupRef = useRef<Group>(null);
  const orbRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  // Exact building orientations:
  // DC-01 (0,0,-27) -> rotY = 0 (docks face +Z towards road)
  // STR-001 (38,0,0) -> rotY = -PI/2 (storefront faces -X)
  // STR-002 (0,0,27) -> rotY = PI (storefront faces -Z)
  // STR-003 (-38,0,0) -> rotY = PI/2 (storefront faces +X)
  const { rotY } = useMemo(
    () => computeBuildingOrientation(site.position, site.id),
    [site.position, site.id]
  );

  // Load and sanitize building GLB to guarantee dark-warm aesthetic with ZERO blue
  const { scene: buildingScene } = useGLTF(site.modelUrl);
  const clonedBuilding = useMemo(() => {
    const b = buildingScene.clone(true);
    b.traverse((obj) => {
      if (
        isDC &&
        (obj.name.startsWith("DC_Dock") ||
          obj.name === "Signage" ||
          obj.name === "DC_SignBackplate")
      ) {
        obj.visible = false;
        return;
      }
      if ((obj as Mesh).isMesh) {
        const mesh = obj as Mesh;
        if (mesh.material) {
          const mat = (mesh.material as MeshStandardMaterial).clone();
          const name = (mat.name || "").toLowerCase();
          // Replace blue roofs, canopies, dock frames, and trims with dark-warm tokens
          const isBlue =
            (mat.color.b > 0.4 && mat.color.b > mat.color.r * 1.2) ||
            mat.color.b > 0.6;
          // Retail Theme (White & Orange):
          // - Supermarket Walls: clean, warm off-white (#F0EEEA)
          // - Supermarket Roofs / Canopies / Accents: clay/orange accent (#D97757)
          // - DC Warehouse: walls off-white (#F0EEEA) with orange (#D97757) dock frames/accents
          // - Emissive glass windows intact
          if (name.includes("wall") || name.includes("body")) {
            mat.color.set("#F0EEEA"); // Clean warm off-white walls
            mat.roughness = 0.82;
          } else if (
            name.includes("canopy") ||
            name.includes("awning") ||
            name.includes("dockframe") ||
            name.includes("sign") ||
            name.includes("accent") ||
            (!isDC && name.includes("roof"))
          ) {
            mat.color.set("#D97757"); // Brand clay/orange retail accent
            mat.roughness = 0.55;
          } else if (isDC && name.includes("roof")) {
            mat.color.set("#2A2927"); // DC main roof dark-warm
            mat.roughness = 0.85;
          } else if (name.includes("dockdoor") || name.includes("door")) {
            mat.color.set("#2A2927"); // Dark door trim contrasting with orange frame
            mat.roughness = 0.75;
          } else if (name.includes("glass") || name.includes("window")) {
            // Emissive glass storefront windows
            mat.color.set("#2A2927");
            mat.emissive.set("#FAF9F5");
            mat.emissiveIntensity = isDC ? 0.22 : 0.35;
            mat.roughness = 0.15;
          } else if (name.includes("base") || name.includes("foundation")) {
            mat.color.set(SCENE_PALETTE.ground); // Identical to ground so base slab is invisible
            mat.roughness = 0.92;
          } else if (name.includes("details") || name.includes("bumper")) {
            mat.color.set(isDC ? "#D97757" : "#3A3937");
            mat.roughness = 0.6;
          } else if (isBlue) {
            mat.color.set("#D97757");
            mat.roughness = 0.55;
          }
          mesh.material = mat;
        }
      }
    });
    return b;
  }, [buildingScene, isDC]);

  // Staging slots in site's LOCAL space
  const slots = useMemo(() => STAGING_SLOTS[site.id] || [], [site.id]);

  // Dev-only road intersection verification (accounting for MapStage offset [-14, 0, 0])
  useEffect(() => {
    if (!import.meta.env?.DEV || !groupRef.current) return;
    const timer = setTimeout(() => {
      if (!groupRef.current) return;
      const xOuter = ROAD.rectDims.xMax + ROAD.halfWidth;
      const xInner = ROAD.rectDims.xMax - ROAD.halfWidth;
      const zOuter = ROAD.rectDims.zMax + ROAD.halfWidth;
      const zInner = ROAD.rectDims.zMax - ROAD.halfWidth;

      groupRef.current.traverse((child) => {
        if (
          child.name.includes("Cargo") ||
          child.name.includes("Trolley") ||
          child.name.includes("Rack")
        ) {
          const childPos = new Vector3();
          child.getWorldPosition(childPos);
          // Road is centered at [-18.0, 0, 4.75] in world space
          const relX = childPos.x - -18.0;
          const relZ = childPos.z - 4.75;
          const inXCorridor =
            Math.abs(relX) <= xOuter &&
            Math.abs(relX) >= xInner &&
            Math.abs(relZ) <= zOuter;
          const inZCorridor =
            Math.abs(relZ) <= zOuter &&
            Math.abs(relZ) >= zInner &&
            Math.abs(relX) <= xOuter;
          if (inXCorridor || inZCorridor) {
            console.warn(
              `[OverlapCheck] Prop ${child.name} at (${childPos.x.toFixed(1)}, ${childPos.z.toFixed(1)}) intersects the road!`
            );
          }
        }
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [site.id]);

  return (
    <group
      ref={groupRef}
      position={site.position}
      rotation={[0, rotY + Math.PI, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(site.id);
      }}
    >
      {/* Main Building & Staging Props (-5% scale to fit diorama layout cleanly) */}
      <group position={[0, 0, site.setbackDepth]} scale={0.95}>
        <primitive object={clonedBuilding} />

        {/* Architectural Enhancements for DC Warehouse & Minimarket Stores */}
        {isDC ? (
          <DCArchitecturalEnhancements />
        ) : (
          <StoreArchitecturalEnhancements isHighlighted={hasArrived || isSelected} />
        )}

        {/* Interactive Ground Highlight Ring when store/DC is selected or replenished */}
        {(isSelected || hasArrived) && (
          <mesh
            ref={ringRef}
            position={[0, 0.04, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[isDC ? 14.5 : 7.0, isDC ? 15.1 : 7.45, 48]} />
            <meshBasicMaterial
              color={isSelected ? "#D97757" : "#FAF9F5"}
              opacity={isSelected ? 0.85 : 0.35}
              transparent
            />
          </mesh>
        )}

        {/* 1. Procedural Supply Chain Props (Stacked Boxes #C9A87C, Wooden Pallets #6E5A40, Storage Racks #4A4844) */}
        {isDC ? (
          <group>
            {/* DC Apron staging left of dock 1 */}
            <ProceduralBoxCluster position={[-10.2, 0, -8.2]} variant="tall" rotationY={0.08} />
            <ProceduralBoxCluster position={[-13.2, 0, -8.0]} variant="medium" rotationY={-0.12} />
            {/* DC Apron staging right of dock 3 */}
            <ProceduralBoxCluster position={[10.2, 0, -8.2]} variant="medium" rotationY={-0.05} />
            <ProceduralBoxCluster position={[13.2, 0, -8.0]} variant="tall" rotationY={0.15} />
            {/* DC Side staging racks and pallets */}
            <ProceduralStorageRack position={[-15.6, 0, -4.5]} rotationY={Math.PI / 2} />
            <ProceduralBoxCluster position={[-15.6, 0, -1.8]} variant="small" rotationY={0.1} />
            <ProceduralStorageRack position={[15.6, 0, -4.5]} rotationY={Math.PI / 2} />
            <ProceduralBoxCluster position={[15.6, 0, -1.8]} variant="small" rotationY={-0.1} />
          </group>
        ) : (
          <group>
            {/* Supermarket rear service loading area */}
            <ProceduralBoxCluster position={[3.8, 0, 5.2]} variant="medium" rotationY={-0.1} />
            <ProceduralBoxCluster position={[5.4, 0, 5.0]} variant="small" rotationY={0.2} />
            {/* Supermarket side inventory storage rack */}
            <ProceduralStorageRack position={[6.6, 0, 1.0]} rotationY={Math.PI / 2} />
            <ProceduralBoxCluster position={[6.6, 0, -2.0]} variant="small" rotationY={0.05} />
            {/* Entrance corner staging */}
            <ProceduralPallet position={[-6.2, 0, -3.8]} rotationY={-0.2} />
          </group>
        )}

        {/* 2. GLB Staging Props (Preloaded & Sanitized) */}
        <Suspense fallback={null}>
          {slots.map((slot, idx) => (
            <StagingProp
              key={`${site.id}-prop-${idx}`}
              url={slot.modelUrl}
              localPos={slot.localPos}
              localRotY={slot.localRotY}
              rotJitterDeg={slot.rotJitterDeg}
              scaleJitter={slot.scaleJitter}
            />
          ))}
        </Suspense>

        {/* 3. 3D Indicator Orb over Stores */}
        {!isDC && (
          <group position={[0, 5.8, 0]}>
            <mesh ref={orbRef} position={[0, 0.3, 0]}>
              <sphereGeometry args={[0.38, 16, 16]} />
              <meshStandardMaterial
                color={hasArrived || isSelected ? SCENE_PALETTE.accent : SCENE_PALETTE.dockFrames}
                emissive={hasArrived || isSelected ? SCENE_PALETTE.accent : "#D97757"}
                emissiveIntensity={hasArrived || isSelected ? 1.1 : 0.35}
              />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
