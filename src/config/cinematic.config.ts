/**
 * ============================================================================
 * 🎬 CINEMATIC CONFIGURATION — SCROLL-DRIVEN & AUTO-LOOP TIMELINE
 * AutoReplenish.ai — "Cara Kerja AutoReplenish.ai"
 * ============================================================================
 */

export interface CameraKeyframe {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface CinematicPhaseConfig {
  id: "L0_IDLE" | "L1_MESSAGE" | "L2_APPROVE" | "L3_DISPATCH" | "L4_DELIVERY" | "L5_HOLD_RESET";
  name: string;
  scrollStart: number;
  scrollEnd: number;
  start: number;
  duration: number;
  caption: string | null;
}

export interface TruckDispatchConfig {
  id: string;
  targetStoreId: string;
  storeName: string;
  label: string;
  delay: number; // Stagger delay in seconds relative to L3 start (8.0s)
  travelDuration: number;
  dwellDuration: number; // Unloading time at store before returning to DC
  returnDuration: number; // Return trip duration from store back to DC dock
  variant: "A" | "B";
}

export const CINEMATIC_CONFIG = {
  // Primary mode: Continuous background animation loop (device-independent)
  // Can still be scrubbed interactively via phase controls or scroll hybrid
  scrollDriven: false,

  // Total timeline duration: 22 seconds round-trip loop / pure function basis
  totalDuration: 22.0,
  loop: true,

  // Section height and damping settings
  scrollSettings: {
    sectionHeightVh: 100, // 100vh viewport container so layout never shifts across devices
    lerpFactor: 0.08, // Smooth cinematic damping factor (~0.08)
    reducedMotionTime: 12.0, // Static frame reference
  },

  // Static Camera Configuration (Projecting map center LEFT of screen center)
  camera: {
    mapLeftShift: 9.0, // Scalar for camera lookAt target: [shift, 0, -shift] (default 9, range 0–16)
    position: [50.0, 67.5, 62.5] as [number, number, number],
    target: [9.0, 0.0, -9.0] as [number, number, number],
    fov: 32,
    near: 0.2,
    far: 450,
    idleBreathingAmplitude: 0.003, // ±0.3% subtle breathing
  },

  // 6 Sequential Timeline Phases (L0 - L5) mapped strictly to Scroll & Time
  phases: [
    {
      id: "L0_IDLE",
      name: "Idle Standby",
      scrollStart: 0.0,
      scrollEnd: 0.07,
      start: 0.0,
      duration: 1.5,
      caption: "🤖 AI memantau inventori seluruh cabang secara real-time",
    },
    {
      id: "L1_MESSAGE",
      name: "Telegram Anomali Alert",
      scrollStart: 0.07,
      scrollEnd: 0.25,
      start: 1.5,
      duration: 4.0,
      caption: "📲 Notifikasi risiko stockout dikirim ke Telegram Kepala Toko",
    },
    {
      id: "L2_APPROVE",
      name: "1-Click Approval ke SAP",
      scrollStart: 0.25,
      scrollEnd: 0.36,
      start: 5.5,
      duration: 2.5,
      caption: "🧾 PR otomatis terbentuk di SAP S/4HANA setelah approval 1-klik",
    },
    {
      id: "L3_DISPATCH",
      name: "Truk Berangkat dari DC",
      scrollStart: 0.36,
      scrollEnd: 0.55,
      start: 8.0,
      duration: 4.2,
      caption: "🚛 4 Armada logistik DC diberangkatkan menuju cabang minimarket",
    },
    {
      id: "L4_DELIVERY",
      name: "Pengiriman & Pengisian Stok",
      scrollStart: 0.55,
      scrollEnd: 0.75,
      start: 12.2,
      duration: 4.3,
      caption: "📦 Truk tiba di dock cabang, stok fisik terisi kembali 100%",
    },
    {
      id: "L5_HOLD_RESET",
      name: "Armada Kembali ke DC",
      scrollStart: 0.75,
      scrollEnd: 1.0,
      start: 16.5,
      duration: 5.5,
      caption: "✅ Pengiriman selesai, armada kembali ke DC Pusat Jakarta",
    },
  ] as const satisfies readonly CinematicPhaseConfig[],

  // Telegram Native Palette for Phone Screen ONLY
  telegramPalette: {
    chatBg: "#0e1621",
    header: "#17212b",
    botBubble: "#182533",
    dividers: "rgba(255, 255, 255, 0.06)",
    text: "#ffffff",
    muted: "#8b98a5",
    linkButtonBlue: "#2aabee",
    buttonHover: "#229ed9",
    onlineSuccessGreen: "#0ac630",
  },

  // Telegram Card Content (PRD Section 27 and 27.1)
  telegramCard: {
    botName: "AutoReplenish Bot",
    badge: "Verified",
    storeName: "Cabang Sudirman (Perkantoran)",
    storeId: "STR-001",
    skuName: "Roti Manis Cokelat 100g",
    category: "Perishable",
    physicalStock: 12,
    threshold: 20,
    leadTime: "2 Hari (tiba Minggu)",
    weather: "Hujan deras (Sab-Min)",
    agentAnalysis:
      "Stok di bawah threshold, namun area perkantoran sepi saat weekend dan hujan deras menurunkan kunjungan — kuota dipotong 70% untuk mencegah overstock & kedaluwarsa.",
    recommendation: "15 Pcs (1 Dus) — Normal: 50 Pcs",
    normalQuota: "50 Pcs",
    actionButtonLabel: "✅ Approve & Kirim ke SAP",
    secondaryButtons: ["✏️ Ubah Jumlah", "❌ Tolak"],
    // Success State per PRD Section 27.1
    successTitle: "✅ PR berhasil dibuat",
    prId: "PR-4500012345",
    approvedQty: "Qty 15 Pcs (1 Dus)",
    erpSyncStatus: "SAP S/4HANA: Status Confirmed",
  },

  // Logistics Fleet Convoy Configuration (4 Stores -> Round-Trip back to 4 DC Docks)
  trucks: [
    {
      id: "TRK-2051",
      targetStoreId: "STR-001",
      storeName: "Cabang Sudirman",
      label: "TRK-2051 -> Cabang Sudirman",
      delay: 0.0, // Departs at 8.0s, arrives 11.8s, returns 14.6s -> 18.4s
      travelDuration: 3.8,
      dwellDuration: 2.8,
      returnDuration: 3.8,
      variant: "A",
    },
    {
      id: "TRK-2409",
      targetStoreId: "STR-004",
      storeName: "Cabang Stasiun",
      label: "TRK-2409 -> Cabang Stasiun",
      delay: 0.6, // Departs at 8.6s, arrives 12.6s, returns 15.2s -> 19.2s
      travelDuration: 4.0,
      dwellDuration: 2.6,
      returnDuration: 4.0,
      variant: "B",
    },
    {
      id: "TRK-2205",
      targetStoreId: "STR-002",
      storeName: "Cabang Kampus",
      label: "TRK-2205 -> Cabang Kampus",
      delay: 1.2, // Departs at 9.2s, arrives 13.2s, returns 15.8s -> 19.8s
      travelDuration: 4.0,
      dwellDuration: 2.6,
      returnDuration: 4.0,
      variant: "B",
    },
    {
      id: "TRK-2307",
      targetStoreId: "STR-003",
      storeName: "Cabang Perumahan",
      label: "TRK-2307 -> Cabang Perumahan",
      delay: 1.8, // Departs at 9.8s, arrives 13.6s, returns 16.2s -> 20.0s
      travelDuration: 3.8,
      dwellDuration: 2.6,
      returnDuration: 3.8,
      variant: "A",
    },
  ] as const satisfies readonly TruckDispatchConfig[],
} as const;

export type CinematicConfigType = typeof CINEMATIC_CONFIG;

export const REF_VIEWPORT_WIDTH = 1920;
export const REF_VIEWPORT_HEIGHT = 980;
export const BASE_ORTHO_ZOOM = 15.675;

/**
 * Computes device-independent orthographic zoom so the visible 3D world frustum
 * (in meters) always matches the 1920x980 reference composition (HP Pavilion Gaming full view),
 * regardless of screen resolution or Windows DPI scaling (100%, 125%, 150%).
 */
export function getResponsiveOrthoZoom(width: number, height: number): number {
  const safeW = Math.max(width, 360);
  const safeH = Math.max(height, 360);
  const scaleX = safeW / REF_VIEWPORT_WIDTH;
  const scaleY = safeH / REF_VIEWPORT_HEIGHT;
  return BASE_ORTHO_ZOOM * Math.min(scaleX, scaleY);
}
