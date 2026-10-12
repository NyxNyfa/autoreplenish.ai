import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { Mesh } from "three";
import { collectNodes, setEmissiveIntensity, spinX } from "./animations";
import type { FC } from "react";

export const TRUCK_MODEL_URL = "/models/truck.glb";

useGLTF.preload(TRUCK_MODEL_URL);

/** Nama objek sesuai generate_assets.py */
const WHEEL_NAMES = [
  "Truck_Wheel_FL",
  "Truck_Wheel_FR",
  "Truck_Wheel_RL",
  "Truck_Wheel_RR",
];
const GLOW_NAMES = [
  "Truck_Beacon",
  "Truck_SyncPanel",
  "Truck_SyncPanel.B",
  "Truck_Headlights",
];

/** Posisi harus sinkron dengan ujung arc DataFlow di minimarket.glb. */
const TRUCK_POSITION: [number, number, number] = [-4.3, 0, 0];

export const TruckModel: FC = () => {
  const reduced = useReducedMotion();
  const { scene } = useGLTF(TRUCK_MODEL_URL);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((obj) => {
      if ((obj as Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  const wheels = useMemo(() => collectNodes(model, WHEEL_NAMES), [model]);
  const glows = useMemo(() => collectNodes(model, GLOW_NAMES), [model]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.05);
    if (!reduced) {
      for (const wheel of wheels) {
        spinX(wheel, d * 2.4);
      }
    }
    glows.forEach((node, i) => {
      setEmissiveIntensity(node, 2.4 + Math.sin(t * 2.6 + i * 1.3) * 1.4);
    });
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <primitive object={model} position={TRUCK_POSITION} />
    </Float>
  );
};
