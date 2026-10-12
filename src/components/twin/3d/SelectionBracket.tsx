import { useRef, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group } from "three";

interface SelectionBracketProps {
  size: [number, number, number]; // width (X), height (Y), depth (Z)
  label: string;
  statusBadge?: string;
  badgeColor?: string;
}

export const SelectionBracket: FC<SelectionBracketProps> = ({
  size: [sx, _sy, sz],
  label: _label,
  statusBadge: _statusBadge,
  badgeColor = "#2563EB",
}) => {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating breathing effect
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = Math.sin(t * 3) * 0.08;
    }
  });

  const hx = sx / 2 + 0.3;
  const hz = sz / 2 + 0.3;
  const armLen = Math.min(1.2, Math.min(sx, sz) * 0.25);
  const stroke = 0.06;

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      {/* 4 Corner brackets on the ground */}
      {/* Corner 1: (+X, +Z) */}
      <group position={[hx, 0.04, hz]}>
        <mesh position={[-armLen / 2, 0, 0]}>
          <boxGeometry args={[armLen, stroke, stroke]} />
          <meshBasicMaterial color={badgeColor} />
        </mesh>
        <mesh position={[0, 0, -armLen / 2]}>
          <boxGeometry args={[stroke, stroke, armLen]} />
          <meshBasicMaterial color={badgeColor} />
        </mesh>
      </group>

      {/* Corner 2: (-X, +Z) */}
      <group position={[-hx, 0.04, hz]}>
        <mesh position={[armLen / 2, 0, 0]}>
          <boxGeometry args={[armLen, stroke, stroke]} />
          <meshBasicMaterial color={badgeColor} />
        </mesh>
        <mesh position={[0, 0, -armLen / 2]}>
          <boxGeometry args={[stroke, stroke, armLen]} />
          <meshBasicMaterial color={badgeColor} />
        </mesh>
      </group>

      {/* Corner 3: (+X, -Z) */}
      <group position={[hx, 0.04, -hz]}>
        <mesh position={[-armLen / 2, 0, 0]}>
          <boxGeometry args={[armLen, stroke, stroke]} />
          <meshBasicMaterial color={badgeColor} />
        </mesh>
        <mesh position={[0, 0, armLen / 2]}>
          <boxGeometry args={[stroke, stroke, armLen]} />
          <meshBasicMaterial color={badgeColor} />
        </mesh>
      </group>

      {/* Corner 4: (-X, -Z) */}
      <group position={[-hx, 0.04, -hz]}>
        <mesh position={[armLen / 2, 0, 0]}>
          <boxGeometry args={[armLen, stroke, stroke]} />
          <meshBasicMaterial color={badgeColor} />
        </mesh>
        <mesh position={[0, 0, armLen / 2]}>
          <boxGeometry args={[stroke, stroke, armLen]} />
          <meshBasicMaterial color={badgeColor} />
        </mesh>
      </group>
    </group>
  );
};
