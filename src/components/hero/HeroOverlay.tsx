import { useState, useEffect, type FC } from "react";
import * as THREE from "three";
import { ArrowRight } from "lucide-react";
import { CinematicControls } from "./CinematicControls";

interface HeroOverlayProps {
  phaseIndex: number;
  totalProgress: number;
  scrollProgress?: number;
  isScrollDriven?: boolean;
  activeCaption: string | null;
  storeArrivals?: Record<string, boolean>;
  storeRefills?: Record<string, number>;
  onJumpToPhase?: (phaseIdx: number) => void;
  onOpenDemo: () => void;
  onNavigateDemo: () => void;
  onScrollToFeatures: () => void;
}

const STORE_CONFIG = [
  { id: "STR-001", name: "Sudirman", worldPos: [20.0, 1.0, 4.75] as [number, number, number], initialStock: 35 },
  { id: "STR-002", name: "Kampus", worldPos: [-18.0, 1.0, 31.75] as [number, number, number], initialStock: 75 },
  { id: "STR-003", name: "Perumahan", worldPos: [-56.0, 1.0, 4.75] as [number, number, number], initialStock: 75 },
];

/**
 * Three Clamped Diorama Labels strictly validated to max screen x = 58%
 */
const ClampedStoreBadges: FC<{
  storeArrivals: Record<string, boolean>;
  storeRefills: Record<string, number>;
}> = ({ storeArrivals, storeRefills }) => {
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute 2D projected coordinates with static orthographic camera (zoom 15.675)
  const camera = new THREE.OrthographicCamera(
    -viewport.width / 2,
    viewport.width / 2,
    viewport.height / 2,
    -viewport.height / 2,
    1,
    500
  );
  camera.zoom = 15.675;
  camera.position.set(32, 40, 38);
  camera.lookAt(-12, 0, -2);
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();

  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden md:block overflow-hidden">
      {STORE_CONFIG.map((store) => {
        const hasArrived = storeArrivals[store.id] || false;
        const refill = storeRefills[store.id] || 0;
        const stockPct = Math.min(
          100,
          Math.round(store.initialStock + refill * (100 - store.initialStock))
        );

        const v = new THREE.Vector3(...store.worldPos);
        v.project(camera);
        const rawX = ((v.x + 1) / 2) * viewport.width;
        const rawY = ((-v.y + 1) / 2) * viewport.height;

        // Strict validation: clamp to max 58% of viewport width
        const clampedX = Math.min(rawX, viewport.width * 0.58);
        const clampedY = Math.max(90, Math.min(rawY, viewport.height - 110));

        return (
          <div
            key={store.id}
            style={{
              position: "absolute",
              left: `${clampedX}px`,
              top: `${clampedY}px`,
              transform: "translate(-50%, -100%)",
            }}
            className="flex flex-col items-center gap-1 min-w-[120px] max-w-[160px] p-2 rounded-[8px] bg-[#1F1E1D] border border-[#3D3C39] font-mono text-[11px] text-[#FAF9F5] shadow-lg transition-all duration-300 pointer-events-auto"
          >
            <div className="flex items-center justify-between w-full font-bold">
              <span>{store.name}</span>
              <span className={hasArrived ? "text-[#D97757]" : "text-[#A3A199]"}>
                {stockPct}%
              </span>
            </div>
            <div className="w-full h-1 bg-[#161615] rounded-full overflow-hidden border border-[#3D3C39]">
              <div
                className={`h-full transition-all duration-300 ${
                  hasArrived ? "bg-[#D97757]" : "bg-[#A3A199]"
                }`}
                style={{ width: `${stockPct}%` }}
              />
            </div>
            <div className="text-[9px] text-[#6E6C66]">
              {hasArrived ? "[*] Stok Aman" : "Stok 12/20 Pcs"}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const HeroOverlay: FC<HeroOverlayProps> = ({
  phaseIndex,
  totalProgress,
  scrollProgress,
  isScrollDriven,
  activeCaption,
  storeArrivals = {},
  storeRefills = {},
  onJumpToPhase,
  onOpenDemo,
  onScrollToFeatures,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-6 sm:p-10 font-mono select-none">
      {/* 0. Three Clamped Store Status Labels (strictly validated to max screen x = 58%) */}
      <ClampedStoreBadges
        storeArrivals={storeArrivals}
        storeRefills={storeRefills}
      />

      {/* =================================================================== */}
      {/* 1. TOP BAR ROW: Eyebrow (Left), Top-Right left EMPTY for Phone      */}
      {/* =================================================================== */}
      <div className="flex items-start justify-between w-full pt-16 sm:pt-14">
        {/* Top-Left: Monospace Eyebrow Chip */}
        <div className="pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#1F1E1D] border border-[#3D3C39] text-[#FAF9F5] text-[12px] font-medium leading-none">
          <span className="text-[#6E6C66]">[*]</span>
          <span className="tracking-wide">AGENTIC AI REPLENISHMENT</span>
        </div>

        {/* Top-Right: Kept completely empty so the 3D phone has unobstructed space */}
        <div className="hidden sm:block" />
      </div>

      {/* =================================================================== */}
      {/* 2. CENTER CONTENT BLOCK: Headline, Sub, and CTA Row (Left Column)  */}
      {/* =================================================================== */}
      <div className="max-w-[620px] space-y-4 my-auto pt-4 sm:pt-6">
        {/* Headline (32px/500, letter-spacing -0.02em) */}
        <h1 className="text-[26px] sm:text-[32px] font-[500] text-[#FAF9F5] tracking-[-0.02em] leading-[1.2] [text-shadow:0_2px_12px_rgba(22,22,21,0.85)]">
          Stok tepat waktu.
          <br />
          <span className="text-[#D97757]">Cegah rak kosong, otomatis.</span>
        </h1>

        {/* Subtitle: bright #FAF9F5 with soft dark shadow for legibility over the 3D scene */}
        <p className="text-[13px] sm:text-[14px] font-[400] text-[#FAF9F5] leading-[1.7] max-w-[580px] [text-shadow:0_1px_10px_rgba(22,22,21,0.95)]">
          Platform replenishment multi-cabang otonom berbasis Agentic AI dan context-aware reasoning untuk mengeliminasi kekosongan rak, memitigasi overstock pangan, dan otomatisasi PO ke SAP S/4HANA via Telegram.
        </p>

        {/* CTA Button Row */}
        <div className="pt-2 flex flex-wrap items-center gap-3.5 pointer-events-auto">
          {/* Primary CTA: accent-filled, larger */}
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[8px] bg-[#D97757] text-[#161615] hover:bg-[#E58A6B] text-[15px] font-[600] leading-none shadow-lg transition-colors cursor-pointer"
          >
            <span>Mulai Pilot Project</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Transparent 1px --border */}
          <button
            onClick={onScrollToFeatures}
            className="inline-flex items-center px-4 py-2.5 rounded-[8px] bg-[#161615]/60 hover:bg-[#1F1E1D] border border-[#3D3C39] text-[#FAF9F5] text-[14px] font-[500] leading-none transition-colors cursor-pointer"
          >
            <span>Lihat Cara Kerja</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. BOTTOM ROW: Caption Chip & Controls at Bottom-Left (Clean Right) */}
      {/* =================================================================== */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-start gap-6 pb-2">
        {/* Bottom-Left Group: Caption Chip + Phase Dots & Progress Line */}
        <div className="pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Caption Chip */}
          {phaseIndex >= 1 && activeCaption ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#1F1E1D] border border-[#3D3C39] text-[#FAF9F5] text-[12px] font-[400] leading-none">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D97757]" />
              <span>{activeCaption}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-[#1F1E1D] border border-[#3D3C39] text-[#6E6C66] text-[12px]">
              <span>[*] Menyiapkan telemetri toko...</span>
            </div>
          )}

          {/* Phase Dots & 1px Accent Progress Line (bottom-left, far from the phone) */}
          <CinematicControls
            phaseIndex={phaseIndex}
            totalProgress={totalProgress}
            scrollProgress={scrollProgress}
            isScrollDriven={isScrollDriven}
            onJumpToPhase={onJumpToPhase}
          />
        </div>
      </div>
    </div>
  );
};
