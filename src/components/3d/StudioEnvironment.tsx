import { Environment, Lightformer } from "@react-three/drei";
import type { FC } from "react";

/**
 * Studio environment gelap custom (mengikuti setup Blender di
 * scripts/blender/generate_assets.py): key cyan dari belakang, rim amber dari
 * kiri, highlight putih dari depan. Tidak perlu download HDR eksternal,
 * jadi tetap jalan offline.
 */
export const StudioEnvironment: FC = () => (
  <Environment resolution={256} frames={1}>
    <color attach="background" args={["#0b0d10"]} />
    <Lightformer
      form="rect"
      intensity={3.4}
      color="#06b6d4"
      position={[0, 6, -9]}
      scale={[12, 6, 1]}
    />
    <Lightformer
      form="rect"
      intensity={2.2}
      color="#f59e0b"
      position={[-9, 3, 3]}
      rotation={[0, Math.PI / 2, 0]}
      scale={[10, 5, 1]}
    />
    <Lightformer
      form="rect"
      intensity={1.2}
      color="#93c5fd"
      position={[9, 4, 2]}
      rotation={[0, -Math.PI / 2, 0]}
      scale={[8, 4, 1]}
    />
    <Lightformer
      form="circle"
      intensity={1.5}
      color="#e2e8f0"
      position={[1, 8, 5]}
      scale={[6, 6, 1]}
    />
  </Environment>
);
