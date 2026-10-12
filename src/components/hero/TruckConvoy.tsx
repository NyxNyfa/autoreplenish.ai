import { useRef, useMemo, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, Html } from "@react-three/drei";
import { Vector3, type Group } from "three";
import type { Line2 } from "three-stdlib";
import { SCENE_PALETTE } from "@/config/scenePalette";
import { CINEMATIC_CONFIG } from "@/config/cinematic.config";
import { buildRoadRoute } from "@/components/twin/3d/SiteConfig";

/**
 * Procedural Logistics Truck (Truck cargo #F0EEEA, Cab #3A3937, Clay Stripe #D97757, Wheels #161615)
 */
const DarkTruckModel: FC = () => {
  return (
    <group>
      {/* Chassis */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.0, 0.35, 5.8]} />
        <meshStandardMaterial color={SCENE_PALETTE.truckChassis} roughness={0.8} />
      </mesh>

      {/* Cab (#3A3937) */}
      <mesh position={[0, 1.45, 2.0]} castShadow>
        <boxGeometry args={[1.9, 1.6, 1.7]} />
        <meshStandardMaterial color={SCENE_PALETTE.truckCab} roughness={0.7} />
      </mesh>
      {/* Cab Windshield */}
      <mesh position={[0, 1.65, 2.86]}>
        <boxGeometry args={[1.7, 0.8, 0.05]} />
        <meshStandardMaterial
          color={SCENE_PALETTE.glassWindows}
          emissive={SCENE_PALETTE.glassWindows}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Cargo Box (#F0EEEA Light Contrast) */}
      <mesh position={[0, 1.8, -0.8]} castShadow>
        <boxGeometry args={[2.1, 2.3, 3.8]} />
        <meshStandardMaterial color={SCENE_PALETTE.truckCargo} roughness={0.4} />
      </mesh>

      {/* Clay Accent Stripe (--accent #D97757) */}
      <mesh position={[0, 1.25, -0.8]}>
        <boxGeometry args={[2.12, 0.28, 3.82]} />
        <meshStandardMaterial color={SCENE_PALETTE.truckStripe} roughness={0.5} />
      </mesh>

      {/* Wheels (#161615) */}
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
    </group>
  );
};

const SingleRoadTruck: FC<{
  targetStoreId: string;
  label: string;
  progress: number;
  hasArrived: boolean;
}> = ({ targetStoreId, label, progress, hasArrived }) => {
  const groupRef = useRef<Group>(null);
  const lineRef = useRef<Line2>(null);

  const route = useMemo(() => buildRoadRoute("DC-01", targetStoreId), [targetStoreId]);
  const curve = route.curvePath;
  const sampledPoints = route.routePoints;

  useFrame((state) => {
    if (lineRef.current?.material) {
      const mat = lineRef.current.material as unknown as { dashOffset: number };
      mat.dashOffset = -state.clock.getElapsedTime() * 5;
    }

    if (!groupRef.current) return;
    const u = Math.min(1.0, Math.max(0.001, progress));
    const pt = curve.getPointAt(u);
    groupRef.current.position.set(pt.x, 0, pt.z);

    const tangent = curve.getTangentAt(u);
    groupRef.current.rotation.y = Math.atan2(tangent.x, tangent.z);
  });

  const revealedPoints = useMemo(() => {
    if (progress <= 0.01) return sampledPoints.slice(0, 2);
    const sliceCount = Math.max(2, Math.floor(sampledPoints.length * Math.min(1.0, progress + 0.35)));
    return sampledPoints.slice(0, sliceCount);
  }, [progress, sampledPoints]);

  return (
    <group>
      {/* Data-flow Route Line in Clay Accent (--accent #D97757) on the map only */}
      {progress > 0 && progress < 1 && (
        <Line
          ref={lineRef}
          points={revealedPoints}
          color={SCENE_PALETTE.accent}
          lineWidth={2.2}
          dashed
          dashScale={2.0}
          dashSize={1.4}
          gapSize={0.8}
        />
      )}

      {/* Truck Agent */}
      <group ref={groupRef}>
        <DarkTruckModel />

        {/* DOM Monospace Label Chip: clamped to max 62% viewport so it never slides under the phone */}
        <Html
          position={[0, 3.4, 0]}
          center
          distanceFactor={30}
          zIndexRange={[50, 0]}
          calculatePosition={(el, camera, size) => {
            const v = new Vector3();
            el.getWorldPosition(v);
            v.project(camera);
            const widthHalf = size.width / 2;
            const heightHalf = size.height / 2;
            const rawX = v.x * widthHalf + widthHalf;
            const rawY = -v.y * heightHalf + heightHalf;
            // Clamp to max 60% of viewport width
            const clampedX = Math.min(rawX, size.width * 0.60);
            return [clampedX, rawY];
          }}
        >
          <div className="pointer-events-none select-none flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#1F1E1D] border border-[#3D3C39] text-[#FAF9F5] font-mono text-[11px] shadow-none whitespace-nowrap max-w-[min(200px,60vw)]">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                hasArrived ? "bg-[#D97757]" : "bg-[#D97757] animate-pulse"
              }`}
            />
            <span className="font-bold truncate">{label}</span>
          </div>
        </Html>
      </group>
    </group>
  );
};

interface TruckConvoyProps {
  truckProgress: Record<string, number>;
  storeArrivals: Record<string, boolean>;
}

export const TruckConvoy: FC<TruckConvoyProps> = ({
  truckProgress,
  storeArrivals,
}) => {
  return (
    <group>
      {CINEMATIC_CONFIG.trucks.map((truck) => (
        <SingleRoadTruck
          key={truck.id}
          targetStoreId={truck.targetStoreId}
          label={truck.label}
          progress={truckProgress[truck.id] || 0}
          hasArrived={storeArrivals[truck.targetStoreId] || false}
        />
      ))}
    </group>
  );
};
