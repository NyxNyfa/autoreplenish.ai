import { useRef, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, type OrthographicCamera } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useTwinStore } from "@/store/useTwinStore";

export const CameraRig: FC = () => {
  const target = useTwinStore((s) => s.cameraTarget);
  const zoom = useTwinStore((s) => s.cameraZoom);

  // Isometric angle offset vector: [30, 30, 30]
  const isoOffset = useRef(new Vector3(30, 30, 30));
  const initialized = useRef(false);

  useFrame((state, delta) => {
    const orthoCam = state.camera as OrthographicCamera;
    const controls = state.controls as OrbitControlsImpl | undefined;

    if (!initialized.current) {
      initialized.current = true;
      orthoCam.position.set(target[0] + isoOffset.current.x, target[1] + isoOffset.current.y, target[2] + isoOffset.current.z);
      orthoCam.lookAt(target[0], target[1], target[2]);
      if (controls) {
        controls.target.set(target[0], target[1], target[2]);
        controls.update();
      }
    }

    // Damped lerp factor for butter-smooth camera glide (never teleport)
    const lerpFactor = Math.min(1.0, delta * 3.2);

    if (controls?.target) {
      // Lerp OrbitControls target smoothly to selected site/truck
      controls.target.x += (target[0] - controls.target.x) * lerpFactor;
      controls.target.y += (target[1] - controls.target.y) * lerpFactor;
      controls.target.z += (target[2] - controls.target.z) * lerpFactor;

      // Desired camera position = target + [30, 30, 30]
      const desiredX = controls.target.x + isoOffset.current.x;
      const desiredY = controls.target.y + isoOffset.current.y;
      const desiredZ = controls.target.z + isoOffset.current.z;

      orthoCam.position.x += (desiredX - orthoCam.position.x) * lerpFactor;
      orthoCam.position.y += (desiredY - orthoCam.position.y) * lerpFactor;
      orthoCam.position.z += (desiredZ - orthoCam.position.z) * lerpFactor;

      controls.update();
    } else {
      // Fallback if controls not ready
      orthoCam.lookAt(target[0], target[1], target[2]);
    }

    // Smoothly lerp zoom
    if (Math.abs(orthoCam.zoom - zoom) > 0.05) {
      orthoCam.zoom += (zoom - orthoCam.zoom) * lerpFactor;
      orthoCam.updateProjectionMatrix();
    }
  });

  return null;
};
