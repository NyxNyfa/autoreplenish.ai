import { useRef, useEffect, useMemo, type FC } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { Vector3, type Group, type Mesh } from "three";
import { SCENE_PALETTE } from "@/config/scenePalette";
import { TelegramCanvasTextureManager } from "./TelegramCanvasTexture";

interface PhoneStageProps {
  position?: [number, number, number];
  scale?: number;
  pinToRightViewport?: boolean;
  phaseIndex: number;
  phaseProgress: number;
}

export const PhoneStage: FC<PhoneStageProps> = ({
  position,
  scale = 1.98,
  pinToRightViewport = true,
  phaseIndex,
  phaseProgress,
}) => {
  const phoneGroupRef = useRef<Group>(null);
  const screenMeshRef = useRef<Mesh>(null);
  const { camera, viewport } = useThree();

  const vRight = useMemo(() => new Vector3(), []);
  const vUp = useMemo(() => new Vector3(), []);
  const vFwd = useMemo(() => new Vector3(), []);
  const computedPos = useMemo(() => new Vector3(), []);

  // Initialize 1024x2048 CanvasTexture Manager
  const canvasManager = useMemo(() => new TelegramCanvasTextureManager(), []);

  useEffect(() => {
    return () => {
      canvasManager.dispose();
    };
  }, [canvasManager]);

  // Clean smartphone dimensions with 1:2 screen ratio
  const phoneHeight = 24.0;
  const screenHeight = phoneHeight * 0.95;
  const screenWidth = screenHeight * 0.5; // EXACT 1024:2048 aspect ratio
  const phoneWidth = screenWidth / 0.93;
  const phoneDepth = 0.85;

  // Orient phone to directly face the camera and pin to right-most 20% of viewport
  useFrame(() => {
    canvasManager.update(phaseIndex, phaseProgress);

    if (!phoneGroupRef.current || !camera) return;

    phoneGroupRef.current.quaternion.copy(camera.quaternion);
    phoneGroupRef.current.rotateY(-0.15);

    if (pinToRightViewport) {
      // Basis vectors of the camera in world space
      vRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
      vUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
      vFwd.set(0, 0, -1).applyQuaternion(camera.quaternion);

      // Pin center of phone to the right-most 20% of the viewport (around 87% width)
      // and keep a safe margin from the right edge
      const targetRightOffset = Math.max(
        viewport.width * 0.36,
        viewport.width / 2 - (phoneWidth * scale * 0.5 + 3.0)
      );

      // Distance 35 units along camera forward ray places the phone in the foreground,
      // physically closer to the camera lens than any diorama buildings/roads/trucks (depth 55-85)
      computedPos
        .copy(camera.position)
        .addScaledVector(vFwd, 35)
        .addScaledVector(vRight, targetRightOffset)
        .addScaledVector(vUp, -3.0);

      phoneGroupRef.current.position.copy(computedPos);
    }
  });

  return (
    <group
      ref={phoneGroupRef}
      position={position || [22, 0, 0]}
      scale={scale}
      renderOrder={999}
    >
      {/* Smartphone Chassis — Clean float, NO ground shadow, NO pedestals */}
      <RoundedBox
        args={[phoneWidth, phoneHeight, phoneDepth]}
        radius={phoneHeight * 0.045}
        smoothness={6}
      >
        <meshStandardMaterial
          color={SCENE_PALETTE.phoneBody}
          roughness={0.5}
          metalness={0.7}
        />
      </RoundedBox>

      {/* Outer Edge Trim Bezel */}
      <RoundedBox
        args={[phoneWidth * 1.01, phoneHeight * 1.005, phoneDepth * 0.9]}
        radius={phoneHeight * 0.048}
        smoothness={6}
      >
        <meshStandardMaterial
          color={SCENE_PALETTE.phoneBezel}
          roughness={0.4}
          metalness={0.8}
        />
      </RoundedBox>

      {/* Screen Plane displaying 1024x2048 CanvasTexture */}
      <mesh ref={screenMeshRef} position={[0, 0, phoneDepth * 0.505]}>
        <planeGeometry args={[screenWidth, screenHeight]} />
        <meshBasicMaterial
          map={canvasManager.texture}
          toneMapped={false}
        />
      </mesh>

      {/* Dynamic Island Capsule Cutout */}
      <mesh position={[0, phoneHeight * 0.44, phoneDepth * 0.51]}>
        <boxGeometry args={[phoneWidth * 0.24, phoneHeight * 0.028, 0.02]} />
        <meshBasicMaterial color="#070c12" />
      </mesh>

      {/* Side Volume Buttons */}
      <mesh position={[-phoneWidth * 0.508, phoneHeight * 0.16, 0]}>
        <boxGeometry args={[phoneDepth * 0.15, phoneHeight * 0.09, phoneDepth * 0.4]} />
        <meshStandardMaterial color={SCENE_PALETTE.phoneSideButtons} roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-phoneWidth * 0.508, phoneHeight * 0.05, 0]}>
        <boxGeometry args={[phoneDepth * 0.15, phoneHeight * 0.09, phoneDepth * 0.4]} />
        <meshStandardMaterial color={SCENE_PALETTE.phoneSideButtons} roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Side Power Button */}
      <mesh position={[phoneWidth * 0.508, phoneHeight * 0.12, 0]}>
        <boxGeometry args={[phoneDepth * 0.15, phoneHeight * 0.12, phoneDepth * 0.4]} />
        <meshStandardMaterial color={SCENE_PALETTE.phoneSideButtons} roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
};
