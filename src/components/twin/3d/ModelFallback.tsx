import type { FC } from "react";

interface FallbackProps {
  type: "dc" | "minimarket" | "truck" | "tree" | "pallet" | "rack" | "bay" | "road";
}

export const ModelFallback: FC<FallbackProps> = ({ type }) => {
  switch (type) {
    case "dc":
      return (
        <group>
          <mesh position={[0, 4, 0]} castShadow receiveShadow>
            <boxGeometry args={[28, 8, 14]} />
            <meshStandardMaterial color="#FAFBFF" roughness={0.8} />
          </mesh>
          <mesh position={[0, 8.2, 0]}>
            <boxGeometry args={[29, 0.4, 15]} />
            <meshStandardMaterial color="#3B82F6" roughness={0.35} />
          </mesh>
        </group>
      );
    case "minimarket":
      return (
        <group>
          <mesh position={[0, 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[12, 4, 8]} />
            <meshStandardMaterial color="#FAFBFF" roughness={0.8} />
          </mesh>
          <mesh position={[0, 4.15, 0]}>
            <boxGeometry args={[12.6, 0.3, 8.6]} />
            <meshStandardMaterial color="#3B82F6" roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.8, 4.02]}>
            <planeGeometry args={[9, 2.4]} />
            <meshStandardMaterial color="#BFD7F5" roughness={0.15} />
          </mesh>
        </group>
      );
    case "truck":
      return (
        <group>
          <mesh position={[0, 1.7, -1.2]} castShadow>
            <boxGeometry args={[2.2, 2.1, 3.6]} />
            <meshStandardMaterial color="#FAFBFF" roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.4, 1.6]} castShadow>
            <boxGeometry args={[2.1, 1.8, 1.8]} />
            <meshStandardMaterial color="#2563EB" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[1.4, 0.3, 5.2]} />
            <meshStandardMaterial color="#2A2F3A" roughness={0.9} />
          </mesh>
        </group>
      );
    case "tree":
      return (
        <group>
          <mesh position={[0, 1.1, 0]}>
            <cylinderGeometry args={[0.18, 0.22, 2.2, 8]} />
            <meshStandardMaterial color="#8B6F4E" roughness={0.85} />
          </mesh>
          <mesh position={[0, 2.8, 0]} castShadow>
            <icosahedronGeometry args={[1.2, 1]} />
            <meshStandardMaterial color="#86D9A5" roughness={0.6} />
          </mesh>
        </group>
      );
    case "pallet":
      return (
        <group>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[1.2, 0.16, 1.0]} />
            <meshStandardMaterial color="#C89D66" roughness={0.85} />
          </mesh>
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[1.0, 0.6, 0.8]} />
            <meshStandardMaterial color="#D8B48E" roughness={0.8} />
          </mesh>
        </group>
      );
    case "rack":
      return (
        <group>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[2.6, 3.0, 1.1]} />
            <meshStandardMaterial color="#4A7DFC" wireframe />
          </mesh>
        </group>
      );
    case "bay":
      return (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3.0, 6.0]} />
          <meshStandardMaterial color="#F2C94C" />
        </mesh>
      );
    default:
      return null;
  }
};
