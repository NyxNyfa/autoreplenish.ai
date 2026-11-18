/* oxlint-disable react/immutability */
import { useRef, useEffect, type FC } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, type OrthographicCamera } from "three";
import { getResponsiveOrthoZoom } from "@/config/cinematic.config";

interface CameraRigProps {
  scrollProgress?: number;
}

export const CameraRig: FC<CameraRigProps> = ({ scrollProgress = 0 }) => {
  const { camera, size } = useThree();

  // Permanent camera target at [-12, 0, -2] focusing on the center-left road loop
  const targetVec = useRef(new Vector3(-12, 0, -2));
  const basePos = useRef(new Vector3(32, 40, 38));
  const pointerRef = useRef({ x: 0, y: 0 });
  const smoothPointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      const ny = (e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1;
      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!camera) return;

    // Smooth pointer damping for interactive 3D depth feel
    smoothPointerRef.current.x += (pointerRef.current.x - smoothPointerRef.current.x) * 0.06;
    smoothPointerRef.current.y += (pointerRef.current.y - smoothPointerRef.current.y) * 0.06;

    // Subtle idle breathing motion + gentle interactive cursor/scroll parallax
    const time = state.clock.getElapsedTime();
    const breath = Math.sin(time * 0.55) * 0.004;
    const parallaxX = smoothPointerRef.current.x * 1.15;
    const parallaxY = -smoothPointerRef.current.y * 0.85 + scrollProgress * 1.5;

    camera.position.x = basePos.current.x * (1 + breath) + parallaxX;
    camera.position.y = basePos.current.y * (1 + breath * 0.7) + parallaxY;
    camera.position.z = basePos.current.z * (1 + breath) - parallaxX * 0.6;

    const orthoCam = camera as OrthographicCamera;
    if (orthoCam.isOrthographicCamera) {
      const targetZoom = getResponsiveOrthoZoom(size.width, size.height);
      if (Math.abs(orthoCam.zoom - targetZoom) > 0.001) {
        orthoCam.zoom = targetZoom;
        orthoCam.updateProjectionMatrix();
      }
    }

    camera.lookAt(targetVec.current);
  });

  return null;
};
