import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Mesh, Object3D } from "three";
import { collectNodes, setEmissiveIntensity, setScale } from "./animations";
import type { FC } from "react";

export const MINIMARKET_MODEL_URL = "/models/minimarket.glb";

useGLTF.preload(MINIMARKET_MODEL_URL);

const FLOW_COUNT = 8;
const FLOW_NAMES = Array.from(
  { length: FLOW_COUNT },
  (_, i) => `DataFlow_${String(i).padStart(2, "0")}`
);

/** Posisi harus sinkron dengan TRUCK_POSITION di TruckModel + arc DataFlow. */
const STORE_POSITION: [number, number, number] = [3, 0, 0];

export const MinimarketModel: FC = () => {
  const { scene } = useGLTF(MINIMARKET_MODEL_URL);

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

  const sign = useMemo(
    (): Object3D | null => model.getObjectByName("Store_Sign") ?? null,
    [model]
  );
  const hub = useMemo(
    (): Object3D | null => model.getObjectByName("Store_Hub_Light") ?? null,
    [model]
  );
  const windows = useMemo(
    () => collectNodes(model, ["Store_WindowL", "Store_WindowR"]),
    [model]
  );
  const flowNodes = useMemo(() => collectNodes(model, FLOW_NAMES), [model]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Papan nama & hub "bernafas" — AI hub aktif
    setEmissiveIntensity(sign, 3.2 + Math.sin(t * 1.6) * 1.1);
    setEmissiveIntensity(hub, 3 + Math.sin(t * 2.2) * 1.5);

    // Jendela berkedip pelan, berurutan
    windows.forEach((node, i) => {
      setEmissiveIntensity(node, 1.6 + Math.sin(t * 1.4 + i * 0.9) * 0.6);
    });

    // Data flow: bola menyala berurutan dari truk ke toko (sinkronisasi stok)
    flowNodes.forEach((node, i) => {
      const pulse = Math.sin(t * 2.4 - i * 0.7) * 0.5 + 0.5;
      setScale(node, 0.65 + pulse * 0.7);
      setEmissiveIntensity(node, 2.5 + pulse * 4);
    });
  });

  return <primitive object={model} position={STORE_POSITION} />;
};
