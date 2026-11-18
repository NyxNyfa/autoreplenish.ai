import { Suspense, type FC } from "react";
import { Canvas } from "@react-three/fiber";
import { getResponsiveOrthoZoom } from "@/config/cinematic.config";
import { SceneErrorBoundary } from "@/components/twin/3d/SceneErrorBoundary";
import { CameraRig } from "./CameraRig";
import { PhoneStage } from "./PhoneStage";
import { MapStage } from "./MapStage";

interface CinematicBackgroundProps {
  phaseIndex: number;
  phaseProgress: number;
  scrollProgress?: number;
  isPlaying: boolean;
  truckProgress: Record<string, number>;
  storeArrivals: Record<string, boolean>;
  storeRefills: Record<string, number>;
  selectedStoreId?: string | null;
  onSelectStore?: (storeId: string) => void;
  onTriggerApprove?: () => void;
}

export const CinematicBackground: FC<CinematicBackgroundProps> = ({
  phaseIndex,
  phaseProgress,
  scrollProgress = 0,
  isPlaying,
  truckProgress,
  storeArrivals,
  storeRefills,
  selectedStoreId = null,
  onSelectStore,
  onTriggerApprove,
}) => {
  const initialZoom =
    typeof window !== "undefined"
      ? getResponsiveOrthoZoom(window.innerWidth, window.innerHeight)
      : 15.675;

  return (
    <div className="absolute inset-0 w-full h-full select-none overflow-hidden z-0 bg-[#2C2A27]">
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
            gl.toneMappingExposure = 1.28;
          }}
          camera={{
            position: [32, 40, 38],
            zoom: initialZoom,
            near: 1,
            far: 500,
          }}
          className="w-full h-full !absolute inset-0"
        >
          {/* Brighter Warm Studio Hero Background & Fog */}
          <color attach="background" args={["#2C2A27"]} />
          <fog attach="fog" args={["#2C2A27", 120, 420]} />

          {/* Responsive Orthographic Camera Rig matching HP Pavilion 1920x980 framing */}
          <CameraRig scrollProgress={scrollProgress} />

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
              selectedStoreId={selectedStoreId}
              onSelectStore={onSelectStore}
            />
          </Suspense>

          {/* Phone Stage: Dynamically pinned to the right-most 20% viewport in front of camera */}
          <Suspense fallback={null}>
            <PhoneStage
              scale={1.92}
              phaseIndex={phaseIndex}
              phaseProgress={phaseProgress}
              onTriggerApprove={onTriggerApprove}
            />
          </Suspense>
        </Canvas>
      </SceneErrorBoundary>
    </div>
  );
};
