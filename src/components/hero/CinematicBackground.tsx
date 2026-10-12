import { Suspense, type FC } from "react";
import { Canvas } from "@react-three/fiber";
import { SCENE_PALETTE } from "@/config/scenePalette";
import { SceneErrorBoundary } from "@/components/twin/3d/SceneErrorBoundary";
import { CameraRig } from "./CameraRig";
import { PhoneStage } from "./PhoneStage";
import { MapStage } from "./MapStage";

interface CinematicBackgroundProps {
  phaseIndex: number;
  phaseProgress: number;
  isPlaying: boolean;
  truckProgress: Record<string, number>;
  storeArrivals: Record<string, boolean>;
  storeRefills: Record<string, number>;
}

export const CinematicBackground: FC<CinematicBackgroundProps> = ({
  phaseIndex,
  phaseProgress,
  isPlaying,
  truckProgress,
  storeArrivals,
  storeRefills,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden z-0 bg-[#161615]">
      <SceneErrorBoundary fallbackMessage="WebGL background encountered an error.">
        <Canvas
          orthographic
          dpr={[1, 1.5]}
          frameloop={isPlaying ? "always" : "demand"}
          shadows
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.toneMappingExposure = 1.25;
          }}
          camera={{
            position: [32, 40, 38],
            zoom: 15.675,
            near: 1,
            far: 500,
          }}
          className="w-full h-full !absolute inset-0 pointer-events-none"
        >
          {/* Background and Depth Fog strictly #161615 */}
          <color attach="background" args={[SCENE_PALETTE.bg]} />
          <fog attach="fog" args={[SCENE_PALETTE.fog, 100, 400]} />

          {/* Static Orthographic Camera Rig [32,40,38], zoom 15.675, lookAt [-12, 0, -2] */}
          <CameraRig />

          {/* Brighter Warm-Dark Studio Lighting */}
          <ambientLight intensity={1.2} color="#FAF9F5" />
          <hemisphereLight args={["#FAF9F5", "#2A2927", 0.75]} />
          <directionalLight
            position={[30, 45, 15]}
            intensity={1.9}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-left={-80}
            shadow-camera-right={80}
            shadow-camera-top={80}
            shadow-camera-bottom={-80}
            shadow-camera-near={0.5}
            shadow-camera-far={200}
            shadow-bias={-0.0001}
            color="#FAF9F5"
          />

          {/* Map Stage: Centered on the center-left space clearing the phone entirely */}
          <Suspense fallback={null}>
            <MapStage
              position={[-18.0, -7, 4.75]}
              phaseIndex={phaseIndex}
              truckProgress={truckProgress}
              storeArrivals={storeArrivals}
              storeRefills={storeRefills}
            />
          </Suspense>

          {/* Phone Stage: Dynamically pinned to the right-most 20% viewport in front of camera */}
          <Suspense fallback={null}>
            <PhoneStage
              scale={1.98}
              phaseIndex={phaseIndex}
              phaseProgress={phaseProgress}
            />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
};
