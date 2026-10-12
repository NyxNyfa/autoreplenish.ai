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
  delay: number; // Stagger delay in seconds relative to L3 start (9.0s)
  travelDuration: number;
  variant: "A" | "B";
}

export const CINEMATIC_CONFIG = {
  // Primary mode: Scroll-driven scrubbing with sticky 420vh container
  // Set to false for pure auto-loop fallback with zero play/pause buttons
  scrollDriven: true,

  // Total timeline duration: 20 seconds loop / pure function basis
  totalDuration: 20.0,
  loop: true,

  // Section height and damping settings
  scrollSettings: {
    sectionHeightVh: 420, // 420vh sticky track
    lerpFactor: 0.08, // Smooth cinematic damping factor (~0.08)
    reducedMotionTime: 12.0, // Static frame at t=12s for reduced-motion
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
      scrollEnd: 0.08,
      start: 0.0,
      duration: 1.6,
      caption: "🤖 AI memantau inventori seluruh cabang secara real-time",
    },
    {
      id: "L1_MESSAGE",
      name: "Telegram Anomali Alert",
      scrollStart: 0.08,
      scrollEnd: 0.32,
      start: 1.6,
      duration: 4.8,
      caption: "📲 Notifikasi risiko stockout dikirim ke Telegram Kepala Toko",
    },
    {
      id: "L2_APPROVE",
      name: "1-Click Approval ke SAP",
      scrollStart: 0.32,
      scrollEnd: 0.45,
      start: 6.4,
      duration: 2.6,
      caption: "🧾 PR otomatis terbentuk di SAP S/4HANA setelah approval 1-klik",
    },
    {
      id: "L3_DISPATCH",
      name: "Truk Berangkat dari DC",
      scrollStart: 0.45,
      scrollEnd: 0.55,
      start: 9.0,
      duration: 2.0,
      caption: "🚛 Armada logistik DC diberangkatkan menuju masing-masing toko",
    },
    {
      id: "L4_DELIVERY",
      name: "Pengiriman & Pengisian Stok",
      scrollStart: 0.55,
      scrollEnd: 0.85,
      start: 11.0,
      duration: 6.0,
      caption: "📦 Truk tiba di dock, stok fisik cabang terisi kembali 100%",
    },
    {
      id: "L5_HOLD_RESET",
      name: "Hold & End Caption",
      scrollStart: 0.85,
      scrollEnd: 1.0,
      start: 17.0,
      duration: 3.0,
      caption: "✅ Stok aman, tanpa overstock & kedaluwarsa",
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

  // Logistics Fleet Convoy Configuration
  trucks: [
    {
      id: "TRK-2051",
      targetStoreId: "STR-001",
      storeName: "Cabang Sudirman",
      label: "TRK-2051 -> Cabang Sudirman",
      delay: 0.0, // Departs at 9.0s
      travelDuration: 5.8,
      variant: "A",
    },
    {
      id: "TRK-2205",
      targetStoreId: "STR-002",
      storeName: "Cabang Kampus",
      label: "TRK-2205 -> Cabang Kampus",
      delay: 2.5, // Departs at 11.5s (2.5s spacing)
      travelDuration: 5.0,
      variant: "B",
    },
    {
      id: "TRK-2307",
      targetStoreId: "STR-003",
      storeName: "Cabang Perumahan",
      label: "TRK-2307 -> Cabang Perumahan",
      delay: 4.8, // Departs at 13.8s (2.3s spacing)
      travelDuration: 3.8,
      variant: "A",
    },
  ] as const satisfies readonly TruckDispatchConfig[],
} as const;

export type CinematicConfigType = typeof CINEMATIC_CONFIG;
