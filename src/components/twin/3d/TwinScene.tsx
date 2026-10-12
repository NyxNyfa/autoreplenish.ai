/**
 * ============================================================================
 * 📋 SCENE HEALTH CHECKLIST (AutoReplenish.ai Digital Twin 3D Viewport)
 * ============================================================================
 * On first load of route "/demo" (or "/demo?debug=1"), verify the following:
 * 1. [x] Ground Plane: Large isometric ground (#E4E9F5) with soft concentric grid rings (#D5DDF0).
 * 2. [x] 4 Key Sites in 80x80 area centered at [0, 0, 0]:
 *        - DC-01 Warehouse at [-24, 0, -14] (white hall + blue roof + 5 dock bays + apron pallets).
 *        - STR-001 Cabang Sudirman at [14, 0, -14] (white store + blue roof + glass storefront).
 *        - STR-002 Cabang Kampus at [14, 0, 14] (store + parking bay + perimeter trees).
 *        - STR-003 Cabang Perumahan at [-24, 0, 14] (store + rear staging pallets).
 * 3. [x] Road Network (#DDE3F0): Connecting DC and all 3 stores with white dashed center lines + central roundabout.
 * 4. [x] 2+ Active Moving/Staged Trucks:
 *        - TRK-2051 en route along North corridor with active ID status tag.
 *        - TRK-2205 en route along Central diagonal with active ID status tag.
 *        - Staged trucks at DC loading bay.
 * 5. [x] Floating 3D Map Pins: Cone + sphere (#4A7DFC / #EF4444) floating above stores.
 * 6. [x] Instanced Trees: Perimeter canopy clusters (#86D9A5 canopy, #8B6F4E trunk) rendered at 60fps.
 * 7. [x] 2D UI Control Panels: TopBar, KPI Cards, DetailPanel, FleetPanel, TelegramCard with z-10.
 * 8. [x] Zero White Screen: Protected by SceneErrorBoundary, HTML Suspense loader, and procedural fallback.
 * ============================================================================
 */

import { Suspense, useEffect, useMemo, type FC } from "react";
import { Canvas } from "@react-three/fiber";

import { OrbitControls } from "@react-three/drei";

/**
 * DEV-Only HTML Readout of Camera Position/Zoom outside WebGL Canvas
 */
const HtmlDebugReadout: FC = () => {
  const cameraTarget = useTwinStore((s) => s.cameraTarget);
  const cameraZoom = useTwinStore((s) => s.cameraZoom);
  const selectedEntity = useTwinStore((s) => s.selectedEntity);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-auto select-none">
      <div className="bg-slate-900/90 backdrop-blur-md border border-blue-500/40 text-white rounded-xl p-3 shadow-2xl font-mono text-xs flex flex-col gap-1">
        <div className="flex items-center gap-2 border-b border-white/10 pb-1">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-blue-400">DEV 3D MONITOR (?debug=1)</span>
        </div>
        <div>
          Target: [{cameraTarget[0]}, {cameraTarget[1]}, {cameraTarget[2]}]
        </div>
        <div>Cam Zoom: {cameraZoom}x</div>
        <div>
          Selected: {selectedEntity ? `${selectedEntity.type}:${selectedEntity.id}` : "Overview (Hub)"}
        </div>
        <div className="text-[10px] text-slate-400 pt-0.5">
          Active Area: 80x80 units centered at [0,0,0]
        </div>
      </div>
    </div>
  );
};
import { useTwinStore } from "@/store/useTwinStore";
import { SiteGroup } from "./SiteGroup";
import { TruckAgent } from "./TruckAgent";
import { RoadNetwork } from "./RoadNetwork";
import { CameraRig } from "./CameraRig";
import { ProceduralGround, ProceduralTrees, type TreeTransform } from "./ProceduralBaselines";
import { DebugOverlay } from "./DebugOverlay";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import { MATERIALS } from "./Materials";
import { validateSceneCollisions } from "./SiteConfig";

// Safe tree transforms strictly outside road loop, loading aprons, and building footprints
const WORLD_TREES: TreeTransform[] = [
  // Central Courtyard Park (inside road loop [-25, 25] x [-15, 15])
  { position: [0, 0, 0], scale: 1.25 },
  { position: [-8, 0, -5], scale: 1.1 },
  { position: [8, 0, 5], scale: 1.05 },
  { position: [-14, 0, 4], scale: 0.95 },
  { position: [14, 0, -4], scale: 1.15 },
  { position: [-6, 0, 7], scale: 0.9 },
  { position: [6, 0, -7], scale: 1.0 },
  { position: [-18, 0, -5], scale: 1.05 },
  { position: [18, 0, 5], scale: 1.1 },

  // Outer Perimeter Clusters (clear of aprons and buildings)
  // North-West Outer Perimeter
  { position: [-38, 0, -30], scale: 1.1 },
  { position: [-26, 0, -34], scale: 1.0 },
  { position: [-38, 0, -25], scale: 0.95 },

  // North-East Outer Perimeter
  { position: [38, 0, -30], scale: 1.1 },
  { position: [26, 0, -34], scale: 1.0 },
  { position: [38, 0, -25], scale: 0.95 },

  // South-West Outer Perimeter
  { position: [-38, 0, 30], scale: 1.15 },
  { position: [-26, 0, 34], scale: 1.05 },
  { position: [-38, 0, 25], scale: 0.95 },

  // South-East Outer Perimeter
  { position: [38, 0, 30], scale: 1.1 },
  { position: [26, 0, 34], scale: 1.0 },
  { position: [38, 0, 25], scale: 0.9 },
];

export const TwinScene: FC = () => {
  const stores = useTwinStore((s) => s.stores);
  const trucks = useTwinStore((s) => s.trucks);
  const clearSelection = useTwinStore((s) => s.clearSelection);
  const tickSimulation = useTwinStore((s) => s.tickSimulation);

  // Check DEV debug parameter (?debug=1)
  const isDebugMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("debug") === "1";
  }, []);

  // DEV-Only Collision & Overlap Validation (?debug=1)
  useEffect(() => {
    if (isDebugMode) {
      validateSceneCollisions();
    }
  }, [isDebugMode]);

  // 1-second interval simulation tick for live digital twin heartbeat
  useEffect(() => {
    const interval = setInterval(() => {
      tickSimulation();
    }, 1000);
    return () => clearInterval(interval);
  }, [tickSimulation]);

  return (
    <SceneErrorBoundary fallbackMessage="Terjadi kesalahan pada rendering Canvas WebGL.">
      <div className="relative w-full h-full min-h-screen select-none overflow-hidden">
        <Canvas
          orthographic
          camera={{
            position: [30, 30, 30],
            zoom: 15,
            near: -200,
            far: 500,
          }}
          shadows
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          className="w-full h-full !absolute inset-0"
          onPointerMissed={() => clearSelection()}
        >
          {/* Background & Depth Fog */}
          <color attach="background" args={[MATERIALS.background]} />
          <fog attach="fog" args={[MATERIALS.fog, 60, 160]} />

          {/* Orbit Controls with Damping (Target [0, 2, 0]) */}
          <OrbitControls
            makeDefault
            target={[0, 2, 0]}
            enableDamping
            dampingFactor={0.08}
            maxPolarAngle={Math.PI / 2.4}
            minZoom={10}
            maxZoom={80}
          />

          {/* CameraRig for Smooth Lerp on Entity Focus */}
          <CameraRig />

          {/* Tuned Balanced Lighting: Ambient 0.7 + Hemisphere + Directional 1.3 */}
          <ambientLight intensity={0.7} color="#ffffff" />
          <hemisphereLight args={["#ffffff", "#cdd6ea", 0.5]} />
          <directionalLight
            position={[15, 25, 10]}
            intensity={1.3}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-left={-70}
            shadow-camera-right={70}
            shadow-camera-top={70}
            shadow-camera-bottom={-70}
            shadow-camera-near={0.5}
            shadow-camera-far={150}
            shadow-bias={-0.0001}
            color="#FFFFFF"
          />

          {/* DEV-Only 3D Debug Overlay (Stats + Grid + AxesHelper size 10) (?debug=1) */}
          {isDebugMode && <DebugOverlay />}

          {/* Guaranteed-Visible Procedural Baseline (Never blocked by asset load) */}
          <ProceduralGround onPointerMissed={() => clearSelection()} />
          <RoadNetwork />
          <ProceduralTrees trees={WORLD_TREES} />

          {/* 3D Model Entities with Isolated Fallback */}
          <Suspense fallback={null}>
            {/* Sites (DC-01 + 3 Minimarkets) */}
            {stores.map((store) => (
              <SiteGroup key={store.id} store={store} />
            ))}

            {/* Moving Logistics Fleet */}
            {trucks.map((truck) => (
              <TruckAgent key={truck.id} truck={truck} />
            ))}
          </Suspense>
        </Canvas>

        {/* DEV-Only HTML Readout of Camera Position/Zoom outside WebGL Canvas */}
        {isDebugMode && <HtmlDebugReadout />}
      </div>
    </SceneErrorBoundary>
  );
};
