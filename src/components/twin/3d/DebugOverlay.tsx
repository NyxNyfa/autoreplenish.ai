import { type FC } from "react";
import { Stats } from "@react-three/drei";

export const DebugOverlay: FC = () => {
  return (
    <group>
      {/* Three.js Stats FPS monitor */}
      <Stats className="!fixed !top-16 !left-4 z-50 pointer-events-auto" />

      {/* Grid Helper covering 80x80 isometric active area */}
      <gridHelper args={[100, 50, "#2563EB", "#94A3B8"]} position={[0, 0.08, 0]} />

      {/* 3D Origin Axes Helper (size 10 per Phase 1 #4) */}
      <axesHelper args={[10]} position={[0, 0.1, 0]} />
    </group>
  );
};
