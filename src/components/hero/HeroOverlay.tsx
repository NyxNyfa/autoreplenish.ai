import { useState, useEffect, type FC } from "react";
import * as THREE from "three";
import { X, Zap } from "lucide-react";
import { getResponsiveOrthoZoom } from "@/config/cinematic.config";

interface HeroOverlayProps {
  phaseIndex: number;
  totalProgress: number;
  scrollProgress?: number;
  isScrollDriven?: boolean;
  isPaused?: boolean;
  onTogglePause?: () => void;
  activeCaption: string | null;
  storeArrivals?: Record<string, boolean>;
  storeRefills?: Record<string, number>;
  selectedStoreId?: string | null;
  onSelectStore?: (storeId: string | null) => void;
  onJumpToPhase?: (phaseIdx: number) => void;
  onOpenDemo?: () => void;
  onNavigateDemo?: () => void;
  onScrollToFeatures?: () => void;
}

interface StorePrdTelemetry {
  id: string;
  name: string;
  zone: string;
  isDC?: boolean;
  worldPos: [number, number, number];
  initialStock: number;
  sku: string;
  stockLabel: string;
  weatherSignal: string;
  bedrockReasoning: string;
  recommendedQuota: string;
  sapPrId: string;
  truckId: string;
}

/**
 * Exact 3D Roof World Coordinates (accounting for MapStage offset [-18.0, -7.0, 4.75]):
 * - DC-01 (local [0, 7.4, -30])      -> world [-18.0, 0.4, -25.25]
 * - STR-001 (local [40, 5.5, 0])     -> world [22.0, -1.5, 4.75]
 * - STR-004 (local [14, 5.5, 29])    -> world [-4.0, -1.5, 33.75]
 * - STR-002 (local [-14, 5.5, 29])   -> world [-32.0, -1.5, 33.75]
 * - STR-003 (local [-40, 5.5, 0])    -> world [-58.0, -1.5, 4.75]
 */
const STORE_CONFIG: StorePrdTelemetry[] = [
  {
    id: "DC-01",
    name: "DC Pusat Jakarta",
    zone: "DC Pusat Jakarta · Hub Distribusi",
    isDC: true,
    worldPos: [-18.0, 0.4, -25.25],
    initialStock: 100,
    sku: "Multi-SKU FMCG & Perishable (4 Dock Aktif)",
    stockLabel: "4 Armada Siap",
    weatherSignal: "Sinkronisasi SAP S/4HANA Aktif",
    bedrockReasoning:
      "Pusat distribusi utama menyuplai 4 cabang minimarket secara otonom berdasarkan sinyal POS & cuaca real-time.",
    recommendedQuota: "4 Rute Aktif · Fill Rate 99,2%",
    sapPrId: "SAP-MM-DC01",
    truckId: "TRK-2051",
  },
  {
    id: "STR-001",
    name: "Cabang Sudirman",
    zone: "Cabang Sudirman · Perkantoran",
    worldPos: [22.0, -1.5, 4.75],
    initialStock: 35,
    sku: "Roti Manis Cokelat 100g (Perishable)",
    stockLabel: "Stok 12/20 Pcs",
    weatherSignal: "Hujan Deras 🌧️ · Akhir Pekan",
    bedrockReasoning:
      "Area perkantoran sepi saat weekend & hujan deras menurunkan trafik — kuota dipotong 70% mencegah kadaluwarsa.",
    recommendedQuota: "15 Pcs (1 Dus) · Normal: 50 Pcs",
    sapPrId: "PR-4500012345",
    truckId: "TRK-2051",
  },
  {
    id: "STR-004",
    name: "Cabang Stasiun",
    zone: "Cabang Stasiun · Transit Komuter",
    worldPos: [-4.0, -1.5, 33.75],
    initialStock: 60,
    sku: "Kopi Siap Minum 240ml & Roti Lapis",
    stockLabel: "Stok 14/30 Pcs",
    weatherSignal: "Jam Sibuk Komuter 🚆 · Sore",
    bedrockReasoning:
      "Lonjakan penumpang komuter sore hari meningkatkan transaksi grab-and-go +45% — percepat pengiriman sore.",
    recommendedQuota: "48 Pcs (2 Karton) · Normal: 30 Pcs",
    sapPrId: "PR-4500012348",
    truckId: "TRK-2409",
  },
  {
    id: "STR-002",
    name: "Cabang Kampus",
    zone: "Cabang Kampus · Pendidikan",
    worldPos: [-32.0, -1.5, 33.75],
    initialStock: 75,
    sku: "Susu UHT Full Cream 250ml",
    stockLabel: "Stok 18/25 Pcs",
    weatherSignal: "Cerah Berawan ⛅ · Pekan Ujian",
    bedrockReasoning:
      "Lonjakan trafik mahasiswa +35% saat pekan ujian & promo bundle sarapan — tambah safety buffer +25%.",
    recommendedQuota: "40 Pcs (2 Dus) · Normal: 32 Pcs",
    sapPrId: "PR-4500012346",
    truckId: "TRK-2205",
  },
  {
    id: "STR-003",
    name: "Cabang Perumahan",
    zone: "Cabang Perumahan · Residensial",
    worldPos: [-58.0, -1.5, 4.75],
    initialStock: 75,
    sku: "Mie Instan Goreng 85g",
    stockLabel: "Stok 15/30 Pcs",
    weatherSignal: "Hujan Ringan 🌦️ · Siklus Payday",
    bedrockReasoning:
      "Siklus belanja bulanan keluarga (payday) + cuaca hujan meningkatkan konsumsi rumahan — kuota +40%.",
    recommendedQuota: "60 Pcs (2 Karton) · Normal: 42 Pcs",
    sapPrId: "PR-4500012347",
    truckId: "TRK-2307",
  },
];

/**
 * Responsive Diorama Store & DC Badges projected using device-independent orthographic zoom
 */
const ClampedStoreBadges: FC<{
  storeArrivals: Record<string, boolean>;
  storeRefills: Record<string, number>;
  selectedStoreId?: string | null;
  onSelectStore?: (storeId: string | null) => void;
}> = ({ storeArrivals, storeRefills, selectedStoreId, onSelectStore }) => {
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

  // Compute 2D projected coordinates with responsive orthographic zoom matching CameraRig
  const camera = new THREE.OrthographicCamera(
    -viewport.width / 2,
    viewport.width / 2,
    viewport.height / 2,
    -viewport.height / 2,
    1,
    500
  );
  camera.zoom = getResponsiveOrthoZoom(viewport.width, viewport.height);
  camera.position.set(32, 40, 38);
  camera.lookAt(-12, 0, -2);
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();

  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden md:block overflow-hidden">
      {STORE_CONFIG.map((store) => {
        const hasArrived = store.isDC ? true : storeArrivals[store.id] || false;
        const refill = storeRefills[store.id] || 0;
        const stockPct = store.isDC
          ? 100
          : Math.min(
              100,
              Math.round(
                store.initialStock + refill * (100 - store.initialStock)
              )
            );
        const isSelected = selectedStoreId === store.id;

        const v = new THREE.Vector3(...store.worldPos);
        v.project(camera);
        const rawX = ((v.x + 1) / 2) * viewport.width;
        const rawY = ((-v.y + 1) / 2) * viewport.height;

        // Safe viewport clamp keeping badges directly above their 3D buildings with zero overlap
        const clampedX = Math.max(92, Math.min(rawX, viewport.width * 0.64));
        const clampedY = Math.max(78, Math.min(rawY, viewport.height - 64));

        return (
          <button
            key={store.id}
            type="button"
            onClick={() => onSelectStore?.(isSelected ? null : store.id)}
            style={{
              position: "absolute",
              left: `${clampedX}px`,
              top: `${clampedY}px`,
              transform: "translate(-50%, -100%)",
            }}
            className={`flex flex-col items-center gap-1 min-w-[144px] max-w-[184px] px-2.5 py-1.5 rounded-[8px] bg-[#1F1E1D]/95 border font-mono text-[11px] text-[#FAF9F5] transition-all duration-200 pointer-events-auto cursor-pointer ${
              isSelected
                ? "border-[#D97757] bg-[#2A2927]"
                : "border-[#3D3C39] hover:border-[#6E6C66]"
            }`}
            title={`Klik untuk melihat detail ${store.zone}`}
          >
            <div className="flex items-center justify-between w-full font-bold gap-2">
              <span className="flex items-center gap-1.5 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97757] shrink-0" />
                <span className="truncate">{store.name}</span>
              </span>
              {!store.isDC && (
                <span
                  className={
                    hasArrived ? "text-[#D97757]" : "text-[#A3A199]"
                  }
                >
                  {stockPct}%
                </span>
              )}
            </div>
            <div className="w-full h-1 bg-[#161615] rounded-full overflow-hidden border border-[#3D3C39]">
              <div
                className={`h-full transition-all duration-300 ${
                  hasArrived ? "bg-[#D97757]" : "bg-[#A3A199]"
                }`}
                style={{ width: `${stockPct}%` }}
              />
            </div>
            <div className="text-[9px] text-[#A3A199] flex items-center justify-between w-full">
              <span>
                {store.isDC
                  ? store.stockLabel
                  : hasArrived
                    ? "[*] Stok Aman"
                    : store.stockLabel}
              </span>
              <span className="text-[#D97757] text-[8px]">[Detail]</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export const HeroOverlay: FC<HeroOverlayProps> = ({
  storeArrivals = {},
  storeRefills = {},
  selectedStoreId = null,
  onSelectStore,
  onJumpToPhase,
}) => {
  const selectedStore =
    STORE_CONFIG.find((s) => s.id === selectedStoreId) || null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 font-mono select-none">
      {/* 1. Responsive Store & DC Badges directly over their 3D buildings */}
      <ClampedStoreBadges
        storeArrivals={storeArrivals}
        storeRefills={storeRefills}
        selectedStoreId={selectedStoreId}
        onSelectStore={onSelectStore}
      />

      {/* 2. Bottom-Left Open Space: Brand Slogan + One-Liner (No CTA buttons in Hero) */}
      {selectedStore ? (
        <div className="pointer-events-auto absolute bottom-7 left-5 sm:left-10 p-3.5 rounded-[10px] bg-[#1F1E1D]/95 border border-[#D97757] text-[12px] text-[#FAF9F5] space-y-2 max-w-[395px] z-20">
          <div className="flex items-center justify-between border-b border-[#3D3C39] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[#D97757] font-bold">[*]</span>
              <span className="font-bold text-[#FAF9F5]">
                {selectedStore.zone}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onSelectStore?.(null)}
              className="text-[#A3A199] hover:text-[#FAF9F5] p-0.5 cursor-pointer"
              aria-label="Tutup detail toko"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[#6E6C66] block">SKU Prioritas:</span>
              <span className="text-[#FAF9F5]">{selectedStore.sku}</span>
            </div>
            <div>
              <span className="text-[#6E6C66] block">Sinyal Konteks:</span>
              <span className="text-[#D97757]">
                {selectedStore.weatherSignal}
              </span>
            </div>
          </div>

          <div className="p-2 rounded-[6px] bg-[#161615] border border-[#3D3C39] text-[11px] text-[#A3A199] leading-relaxed">
            <span className="text-[#FAF9F5] font-bold block mb-0.5">
              AWS Bedrock (Claude 3.5 Sonnet):
            </span>
            {selectedStore.bedrockReasoning}
          </div>

          <div className="flex items-center justify-between pt-1 gap-2">
            <div className="text-[11px]">
              <span className="text-[#6E6C66]">Order: </span>
              <span className="text-[#D97757] font-bold">
                {selectedStore.recommendedQuota}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onJumpToPhase?.(3)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-[#D97757] hover:bg-[#E58A6B] text-[#161615] text-[11px] font-bold transition-colors cursor-pointer"
            >
              <Zap className="w-3 h-3" />
              <span>Dispatch {selectedStore.truckId}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="pointer-events-none absolute bottom-7 left-5 sm:left-10 max-w-[360px] sm:max-w-[415px] space-y-2 z-20">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#1F1E1D]/90 border border-[#3D3C39] text-[10px] sm:text-[11px] text-[#FAF9F5]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D97757]" />
            <span className="tracking-wider text-[#D97757] font-bold">
              AUTONOMOUS RETAIL AI
            </span>
            <span className="text-[#6E6C66]">|</span>
            <span className="text-[#A3A199]">SAP S/4HANA SYNC</span>
          </div>

          <h1 className="text-[19px] sm:text-[23px] font-bold text-[#FAF9F5] tracking-[-0.02em] leading-[1.24] [text-shadow:0_2px_12px_rgba(22,22,21,0.95)]">
            Stok Presisi di Setiap Rak.{" "}
            <span className="text-[#D97757]">
              Nol Drama, Otomatis ke SAP.
            </span>
          </h1>

          <p className="text-[11px] sm:text-[12px] text-[#A3A199] leading-[1.6] [text-shadow:0_1px_10px_rgba(22,22,21,0.95)]">
            AI otonom yang membaca cuaca, trafik lokal, & POS kasir real-time — cukup 1-klik approve di Telegram, armada DC langsung bergerak.
          </p>
        </div>
      )}
    </div>
  );
};
