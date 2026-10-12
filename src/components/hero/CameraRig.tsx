/* oxlint-disable react/immutability */
import { useRef, type FC } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, type OrthographicCamera } from "three";

export const CameraRig: FC = () => {
  const { camera } = useThree();

  // Permanent camera target at [-12, 0, -2] focusing on the center-left road loop
  const targetVec = useRef(new Vector3(-12, 0, -2));
  const basePos = useRef(new Vector3(32, 40, 38));

  useFrame((state) => {
    if (!camera) return;

    // Subtle idle breathing motion (±0.3% position), no cuts or transitions
    const time = state.clock.getElapsedTime();
    const breath = Math.sin(time * 0.45) * 0.003;

    camera.position.x = basePos.current.x * (1 + breath);
    camera.position.y = basePos.current.y * (1 + breath * 0.7);
    camera.position.z = basePos.current.z * (1 + breath);

    const orthoCam = camera as OrthographicCamera;
    if (orthoCam.isOrthographicCamera) {
      orthoCam.zoom = 15.675;
      orthoCam.updateProjectionMatrix();
    }

    camera.lookAt(targetVec.current);
  });

  return null;
};
