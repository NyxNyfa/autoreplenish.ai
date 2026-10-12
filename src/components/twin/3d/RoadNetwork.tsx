import { useRef, useMemo, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useTwinStore } from "@/store/useTwinStore";
import type { Line2 } from "three-stdlib";
import { MATERIALS } from "./Materials";
import { buildRoadRoute } from "./SiteConfig";

/**
 * DETERMINISTIC ROAD NETWORK & LOADING APRON STRIPS
 *
 * Road Loop:
 * - Centerline corners: (-30, -20), (30, -20), (30, 20), (-30, 20)
 * - Road width: 6 (half-width 3). Surface #DDE3F0 + white dashed centerlines.
 * - Loading Aprons: 5 units wide directly outside road edges (#EAEFF9).
 * - NO diagonal or stray road pieces.
 */
export const RoadNetwork: FC = () => {
  const lineRef = useRef<Line2>(null);
  const activeShipment = useTwinStore((s) => s.activeShipment);

  // Animate dashed route offset
  useFrame((state) => {
    if (lineRef.current?.material) {
      const mat = lineRef.current.material as unknown as { dashOffset: number };
      mat.dashOffset = -state.clock.getElapsedTime() * 4;
    }
  });

  // Calculate routed road polyline for active shipment (never a diagonal shortcut)
  const activeRoutePoints = useMemo(() => {
    const targetStoreId = activeShipment?.storeId || "STR-001";
    const route = buildRoadRoute("DC-01", targetStoreId);
    return route.routePoints.map(([x, y, z]) => [x, y + 0.08, z] as [number, number, number]);
  }, [activeShipment?.storeId]);

  // Centerline dashed markers along the 4 road corridors
  const horizDashes = useMemo(() => {
    const dashes: number[] = [];
    for (let x = -27; x <= 27; x += 4.5) {
      dashes.push(x);
    }
    return dashes;
  }, []);

  const vertDashes = useMemo(() => {
    const dashes: number[] = [];
    for (let z = -14; z <= 14; z += 4.5) {
      dashes.push(z);
    }
    return dashes;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* =================================================================== */}
      {/* 4 LOADING APRON STRIPS (5 units wide directly outside road edge)   */}
      {/* =================================================================== */}
      {/* North Apron (Z: [-28, -23], center Z=-25.5, in front of DC-01) */}
      <mesh position={[0, 0.035, -25.5]} receiveShadow>
        <boxGeometry args={[66, 0.06, 5.0]} />
        <meshStandardMaterial color={MATERIALS.apronSurface} roughness={0.88} />
      </mesh>

      {/* South Apron (Z: [23, 28], center Z=25.5, in front of STR-002) */}
      <mesh position={[0, 0.035, 25.5]} receiveShadow>
        <boxGeometry args={[66, 0.06, 5.0]} />
        <meshStandardMaterial color={MATERIALS.apronSurface} roughness={0.88} />
      </mesh>

      {/* East Apron (X: [33, 38], center X=35.5, in front of STR-001) */}
      <mesh position={[35.5, 0.035, 0]} receiveShadow>
        <boxGeometry args={[5.0, 0.06, 34]} />
        <meshStandardMaterial color={MATERIALS.apronSurface} roughness={0.88} />
      </mesh>

      {/* West Apron (X: [-38, -33], center X=-35.5, in front of STR-003) */}
      <mesh position={[-35.5, 0.035, 0]} receiveShadow>
        <boxGeometry args={[5.0, 0.06, 34]} />
        <meshStandardMaterial color={MATERIALS.apronSurface} roughness={0.88} />
      </mesh>

      {/* =================================================================== */}
      {/* RECTANGULAR ROAD NETWORK (Width 6, half-width 3)                     */}
      {/* =================================================================== */}

      {/* ---------------- North Segment (Z = -20, X from -33 to 33) ---------- */}
      <mesh position={[0, 0.05, -20]} receiveShadow castShadow>
        <boxGeometry args={[66, 0.08, 6.0]} />
        <meshStandardMaterial color={MATERIALS.roadSurface} roughness={0.85} />
      </mesh>
      {/* North Road Dashed Centerline */}
      {horizDashes.map((x, i) => (
        <mesh key={`nd-${i}`} position={[x, 0.095, -20]}>
          <boxGeometry args={[2.5, 0.015, 0.25]} />
          <meshBasicMaterial color={MATERIALS.roadDash} />
        </mesh>
      ))}

      {/* ---------------- South Segment (Z = 20, X from -33 to 33) ---------- */}
      <mesh position={[0, 0.05, 20]} receiveShadow castShadow>
        <boxGeometry args={[66, 0.08, 6.0]} />
        <meshStandardMaterial color={MATERIALS.roadSurface} roughness={0.85} />
      </mesh>
      {/* South Road Dashed Centerline */}
      {horizDashes.map((x, i) => (
        <mesh key={`sd-${i}`} position={[x, 0.095, 20]}>
          <boxGeometry args={[2.5, 0.015, 0.25]} />
          <meshBasicMaterial color={MATERIALS.roadDash} />
        </mesh>
      ))}

      {/* ---------------- East Segment (X = 30, Z from -17 to 17) ----------- */}
      <mesh position={[30, 0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.0, 0.08, 34]} />
        <meshStandardMaterial color={MATERIALS.roadSurface} roughness={0.85} />
      </mesh>
      {/* East Road Dashed Centerline */}
      {vertDashes.map((z, i) => (
        <mesh key={`ed-${i}`} position={[30, 0.095, z]}>
          <boxGeometry args={[0.25, 0.015, 2.5]} />
          <meshBasicMaterial color={MATERIALS.roadDash} />
        </mesh>
      ))}

      {/* ---------------- West Segment (X = -30, Z from -17 to 17) ---------- */}
      <mesh position={[-30, 0.05, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.0, 0.08, 34]} />
        <meshStandardMaterial color={MATERIALS.roadSurface} roughness={0.85} />
      </mesh>
      {/* West Road Dashed Centerline */}
      {vertDashes.map((z, i) => (
        <mesh key={`wd-${i}`} position={[-30, 0.095, z]}>
          <boxGeometry args={[0.25, 0.015, 2.5]} />
          <meshBasicMaterial color={MATERIALS.roadDash} />
        </mesh>
      ))}

      {/* =================================================================== */}
      {/* ROUTED TRUCK PATH LINE (Follows exact routed polyline)              */}
      {/* =================================================================== */}
      {activeRoutePoints.length > 1 && (
        <Line
          ref={lineRef}
          points={activeRoutePoints}
          color={MATERIALS.routeActive}
          lineWidth={4}
          dashed
          dashScale={0.8}
          dashSize={1.4}
          gapSize={0.8}
        />
      )}
    </group>
  );
};
