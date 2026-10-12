export interface SKUItem {
  id: string;
  name: string;
  category: "Perishable" | "Staple" | "Dairy" | "Instant";
  physicalStock: number;
  threshold: number;
  burnRate: number; // units per day
  leadTimeDays: number;
  moq: number;
  packagingMultiple: number;
  status: "IN_STOCK" | "LOW_STOCK" | "STOCKOUT_RISK";
  lot: string;
  expiryRisk: "None" | "Moderate" | "High";
}

export interface StoreMetadata {
  id: string;
  name: string;
  areaType: "DC" | "Perkantoran" | "Kampus" | "Perumahan";
  position: [number, number, number];
  rotation: number;
  capacityPallets: number;
  stockOnHandPallets: number;
  totalBays: number;
  occupiedBays: number;
  outboundToday: number;
  putawayToday: number;
  inventory: SKUItem[];
}

export interface TruckData {
  id: string;
  modelVariant: "A" | "B";
  status: "IDLE" | "LOADING" | "EN_ROUTE" | "DOCKING" | "UNLOADING";
  progress: number; // 0 to 1 along curve
  speedKmH: number;
  etaMinutes: number;
  shipmentId: string;
  assignedStoreId: string;
  destinationName: string;
  currentBay: string;
  cargo: {
    skuName: string;
    pallets: number;
    prId: string;
  };
  pathIndex: number;
  position: [number, number, number];
  rotation: number;
}

export interface RecommendationData {
  id: string;
  runId: string;
  storeId: string;
  storeName: string;
  areaType: string;
  skuId: string;
  skuName: string;
  category: string;
  physicalStock: number;
  threshold: number;
  leadTime: string;
  weatherCondition: string;
  reasoningNarrative: string;
  recommendedQty: number;
  normalQty: number;
  packagingMultiple: number;
  confidenceScore: number;
  riskLevel: "low" | "medium" | "high";
  keyFactors: string[];
  status: "PENDING_APPROVAL" | "APPROVED" | "PR_CREATED" | "IN_TRANSIT" | "RESTOCKED" | "REJECTED";
  prId?: string;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  type: "BEDROCK_EVAL" | "TELEGRAM_APPROVAL" | "SAP_PR_CREATED" | "TRUCK_DISPATCHED" | "RESTOCK_COMPLETED" | "TELEGRAM_REJECTED" | "TELEGRAM_EDITED";
  title: string;
  details: string;
  actor: string;
}

export const INITIAL_STORES: StoreMetadata[] = [
  {
    id: "DC-01",
    name: "DC Pusat Jakarta",
    areaType: "DC",
    position: [0, 0, -27],
    rotation: 0,
    capacityPallets: 480,
    stockOnHandPallets: 382,
    totalBays: 5,
    occupiedBays: 3,
    outboundToday: 42,
    putawayToday: 58,
    inventory: [
      {
        id: "SKU-10023",
        name: "Roti Manis Cokelat 100g",
        category: "Perishable",
        physicalStock: 120,
        threshold: 60,
        burnRate: 85,
        leadTimeDays: 1,
        moq: 12,
        packagingMultiple: 12,
        status: "IN_STOCK",
        lot: "LOT-202610-09A",
        expiryRisk: "Low" as "None",
      },
      {
        id: "SKU-20045",
        name: "Air Mineral 24-pack",
        category: "Staple",
        physicalStock: 240,
        threshold: 80,
        burnRate: 110,
        leadTimeDays: 2,
        moq: 24,
        packagingMultiple: 24,
        status: "IN_STOCK",
        lot: "LOT-202610-01C",
        expiryRisk: "None",
      },
      {
        id: "SKU-30012",
        name: "Susu UHT 1L Full Cream",
        category: "Dairy",
        physicalStock: 95,
        threshold: 40,
        burnRate: 55,
        leadTimeDays: 2,
        moq: 12,
        packagingMultiple: 12,
        status: "IN_STOCK",
        lot: "LOT-202610-04D",
        expiryRisk: "Moderate",
      },
      {
        id: "SKU-40088",
        name: "Mi Instan Cup Kari Spesial",
        category: "Instant",
        physicalStock: 180,
        threshold: 50,
        burnRate: 70,
        leadTimeDays: 3,
        moq: 24,
        packagingMultiple: 24,
        status: "IN_STOCK",
        lot: "LOT-202610-08B",
        expiryRisk: "None",
      },
    ],
  },
  {
    id: "STR-001",
    name: "Cabang Sudirman",
    areaType: "Perkantoran",
    position: [38, 0, 0],
    rotation: -Math.PI / 2,
    capacityPallets: 45,
    stockOnHandPallets: 28,
    totalBays: 2,
    occupiedBays: 1,
    outboundToday: 18,
    putawayToday: 8,
    inventory: [
      {
        id: "SKU-10023",
        name: "Roti Manis Cokelat 100g",
        category: "Perishable",
        physicalStock: 12,
        threshold: 20,
        burnRate: 25,
        leadTimeDays: 2,
        moq: 12,
        packagingMultiple: 12,
        status: "STOCKOUT_RISK",
        lot: "LOT-202610-08A",
        expiryRisk: "High",
      },
      {
        id: "SKU-20045",
        name: "Air Mineral 24-pack",
        category: "Staple",
        physicalStock: 38,
        threshold: 25,
        burnRate: 15,
        leadTimeDays: 2,
        moq: 24,
        packagingMultiple: 24,
        status: "IN_STOCK",
        lot: "LOT-202610-03B",
        expiryRisk: "None",
      },
      {
        id: "SKU-30012",
        name: "Susu UHT 1L Full Cream",
        category: "Dairy",
        physicalStock: 16,
        threshold: 15,
        burnRate: 12,
        leadTimeDays: 2,
        moq: 12,
        packagingMultiple: 12,
        status: "LOW_STOCK",
        lot: "LOT-202610-05A",
        expiryRisk: "Moderate",
      },
      {
        id: "SKU-40088",
        name: "Mi Instan Cup Kari Spesial",
        category: "Instant",
        physicalStock: 42,
        threshold: 20,
        burnRate: 10,
        leadTimeDays: 3,
        moq: 24,
        packagingMultiple: 24,
        status: "IN_STOCK",
        lot: "LOT-202610-06C",
        expiryRisk: "None",
      },
    ],
  },
  {
    id: "STR-002",
    name: "Cabang Kampus",
    areaType: "Kampus",
    position: [0, 0, 27],
    rotation: Math.PI,
    capacityPallets: 40,
    stockOnHandPallets: 31,
    totalBays: 2,
    occupiedBays: 1,
    outboundToday: 22,
    putawayToday: 12,
    inventory: [
      {
        id: "SKU-10023",
        name: "Roti Manis Cokelat 100g",
        category: "Perishable",
        physicalStock: 24,
        threshold: 18,
        burnRate: 30,
        leadTimeDays: 2,
        moq: 12,
        packagingMultiple: 12,
        status: "IN_STOCK",
        lot: "LOT-202610-09B",
        expiryRisk: "Moderate",
      },
      {
        id: "SKU-20045",
        name: "Air Mineral 24-pack",
        category: "Staple",
        physicalStock: 48,
        threshold: 30,
        burnRate: 35,
        leadTimeDays: 2,
        moq: 24,
        packagingMultiple: 24,
        status: "IN_STOCK",
        lot: "LOT-202610-02A",
        expiryRisk: "None",
      },
      {
        id: "SKU-30012",
        name: "Susu UHT 1L Full Cream",
        category: "Dairy",
        physicalStock: 14,
        threshold: 20,
        burnRate: 18,
        leadTimeDays: 2,
        moq: 12,
        packagingMultiple: 12,
        status: "LOW_STOCK",
        lot: "LOT-202610-06A",
        expiryRisk: "Moderate",
      },
      {
        id: "SKU-40088",
        name: "Mi Instan Cup Kari Spesial",
        category: "Instant",
        physicalStock: 65,
        threshold: 25,
        burnRate: 40,
        leadTimeDays: 3,
        moq: 24,
        packagingMultiple: 24,
        status: "IN_STOCK",
        lot: "LOT-202610-08C",
        expiryRisk: "None",
      },
    ],
  },
  {
    id: "STR-003",
    name: "Cabang Perumahan",
    areaType: "Perumahan",
    position: [-38, 0, 0],
    rotation: Math.PI / 2,
    capacityPallets: 50,
    stockOnHandPallets: 39,
    totalBays: 2,
    occupiedBays: 0,
    outboundToday: 15,
    putawayToday: 14,
    inventory: [
      {
        id: "SKU-10023",
        name: "Roti Manis Cokelat 100g",
        category: "Perishable",
        physicalStock: 30,
        threshold: 20,
        burnRate: 18,
        leadTimeDays: 2,
        moq: 12,
        packagingMultiple: 12,
        status: "IN_STOCK",
        lot: "LOT-202610-09C",
        expiryRisk: "Moderate",
      },
      {
        id: "SKU-20045",
        name: "Air Mineral 24-pack",
        category: "Staple",
        physicalStock: 52,
        threshold: 30,
        burnRate: 28,
        leadTimeDays: 2,
        moq: 24,
        packagingMultiple: 24,
        status: "IN_STOCK",
        lot: "LOT-202610-01A",
        expiryRisk: "None",
      },
      {
        id: "SKU-30012",
        name: "Susu UHT 1L Full Cream",
        category: "Dairy",
        physicalStock: 28,
        threshold: 22,
        burnRate: 20,
        leadTimeDays: 2,
        moq: 12,
        packagingMultiple: 12,
        status: "IN_STOCK",
        lot: "LOT-202610-07A",
        expiryRisk: "Low" as "None",
      },
      {
        id: "SKU-40088",
        name: "Mi Instan Cup Kari Spesial",
        category: "Instant",
        physicalStock: 35,
        threshold: 20,
        burnRate: 16,
        leadTimeDays: 3,
        moq: 24,
        packagingMultiple: 24,
        status: "IN_STOCK",
        lot: "LOT-202610-07B",
        expiryRisk: "None",
      },
    ],
  },
];

// Waypoint paths connecting DC-01 [0, 0, -27] to Stores via road loop
export const TRUCK_ROUTES: Record<string, [number, number, number][]> = {
  // DC -> Cabang Sudirman [38, 0, 0] (clockwise shorter direction: 50 units)
  "DC_TO_STR-001": [
    [0, 0, -21.5],
    [-1.5, 0, -18.5],
    [28.5, 0, -18.5],
    [28.5, 0, 1.5],
    [33.5, 0, 0],
  ],
  // Cabang Sudirman -> DC (counter-clockwise shorter direction: 50 units)
  "STR-001_TO_DC": [
    [33.5, 0, 0],
    [28.5, 0, -1.5],
    [28.5, 0, -18.5],
    [-1.5, 0, -18.5],
    [0, 0, -21.5],
  ],
  // DC -> Cabang Kampus [0, 0, 27] (clockwise route: 100 units)
  "DC_TO_STR-002": [
    [0, 0, -21.5],
    [-1.5, 0, -18.5],
    [28.5, 0, -18.5],
    [28.5, 0, 18.5],
    [1.5, 0, 18.5],
    [0, 0, 21.5],
  ],
  // DC -> Cabang Perumahan [-38, 0, 0] (counter-clockwise shorter direction: 50 units)
  "DC_TO_STR-003": [
    [0, 0, -21.5],
    [1.5, 0, -21.5],
    [-31.5, 0, -21.5],
    [-31.5, 0, -1.5],
    [-33.5, 0, 0],
  ],
};

export const INITIAL_TRUCKS: TruckData[] = [
  {
    id: "TRK-2051",
    modelVariant: "A",
    status: "EN_ROUTE",
    progress: 0.45,
    speedKmH: 48,
    etaMinutes: 14,
    shipmentId: "SHP-9021",
    assignedStoreId: "STR-001",
    destinationName: "Cabang Sudirman",
    currentBay: "Bay 2",
    cargo: {
      skuName: "Roti Manis Cokelat 100g",
      pallets: 2,
      prId: "PR-4500011890",
    },
    pathIndex: 0,
    position: [21.5, 0, -18.5],
    rotation: Math.PI / 2,
  },
  {
    id: "TRK-2205",
    modelVariant: "B",
    status: "EN_ROUTE",
    progress: 0.72,
    speedKmH: 52,
    etaMinutes: 6,
    shipmentId: "SHP-9022",
    assignedStoreId: "STR-002",
    destinationName: "Cabang Kampus",
    currentBay: "Bay 1",
    cargo: {
      skuName: "Air Mineral 24-pack",
      pallets: 4,
      prId: "PR-4500011915",
    },
    pathIndex: 1,
    position: [28.5, 0, 14.5],
    rotation: Math.PI,
  },
  {
    id: "TRK-2307",
    modelVariant: "A",
    status: "DOCKING",
    progress: 1.0,
    speedKmH: 0,
    etaMinutes: 0,
    shipmentId: "SHP-9023",
    assignedStoreId: "STR-003",
    destinationName: "Cabang Perumahan",
    currentBay: "Bay 1",
    cargo: {
      skuName: "Susu UHT 1L Full Cream",
      pallets: 3,
      prId: "PR-4500011942",
    },
    pathIndex: 2,
    position: [-33.5, 0, 0],
    rotation: -Math.PI / 2,
  },
  {
    id: "TRK-2481",
    modelVariant: "B",
    status: "LOADING",
    progress: 0.0,
    speedKmH: 0,
    etaMinutes: 35,
    shipmentId: "SHP-9024",
    assignedStoreId: "STR-001",
    destinationName: "Cabang Sudirman",
    currentBay: "DC Bay 4",
    cargo: {
      skuName: "Mi Instan Cup Kari Spesial",
      pallets: 2,
      prId: "PR-4500012001",
    },
    pathIndex: 0,
    position: [0, 0, -21.5],
    rotation: Math.PI,
  },
];

// Sample PRD Recommendation (Section 27 & 28)
export const INITIAL_RECOMMENDATIONS: RecommendationData[] = [
  {
    id: "REQ-20260616-0001",
    runId: "RUN-20260616-0500",
    storeId: "STR-001",
    storeName: "Cabang Sudirman",
    areaType: "Perkantoran",
    skuId: "SKU-10023",
    skuName: "Roti Manis Cokelat 100g",
    category: "Perishable",
    physicalStock: 12,
    threshold: 20,
    leadTime: "2 Hari (tiba Minggu pagi)",
    weatherCondition: "Hujan deras (Sab–Min)",
    reasoningNarrative:
      "Stok di bawah threshold, namun area perkantoran sepi saat weekend dan hujan deras menurunkan kunjungan — kuota dipotong 70% untuk mencegah overstock & kedaluwarsa.",
    recommendedQty: 15,
    normalQty: 50,
    packagingMultiple: 12,
    confidenceScore: 0.87,
    riskLevel: "medium",
    keyFactors: [
      "below_threshold",
      "weekend_office_area_quiet",
      "heavy_rain",
      "perishable_sku",
      "moq_pack_12_applied",
    ],
    status: "PENDING_APPROVAL",
    timestamp: "Hari ini, 07:00 WIB",
  },
  {
    id: "REQ-20260616-0002",
    runId: "RUN-20260616-0500",
    storeId: "STR-002",
    storeName: "Cabang Kampus",
    areaType: "Kampus",
    skuId: "SKU-30012",
    skuName: "Susu UHT 1L Full Cream",
    category: "Dairy",
    physicalStock: 14,
    threshold: 20,
    leadTime: "2 Hari",
    weatherCondition: "Cerah berawan",
    reasoningNarrative:
      "Aktivitas kampus menjelang pekan ujian tinggi. Burn rate susu UHT meningkat 35%. Rekomendasi disesuaikan dengan kelipatan 12.",
    recommendedQty: 36,
    normalQty: 30,
    packagingMultiple: 12,
    confidenceScore: 0.92,
    riskLevel: "low",
    keyFactors: ["exam_week_demand_surge", "dairy_burnrate_up", "moq_12"],
    status: "PR_CREATED",
    prId: "PR-4500012350",
    timestamp: "Hari ini, 06:45 WIB",
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-001",
    timestamp: "06:45 WIB",
    type: "BEDROCK_EVAL",
    title: "AWS Bedrock Evaluated SKU-30012",
    details: "Confidence 0.92, Recommended 36 Pcs for Cabang Kampus.",
    actor: "Agentic AI Engine",
  },
  {
    id: "AUD-002",
    timestamp: "06:50 WIB",
    type: "TELEGRAM_APPROVAL",
    title: "Telegram Approval Received",
    details: "Kepala Toko Budi approved REQ-20260616-0002 via Telegram Bot.",
    actor: "Budi (Store Manager)",
  },
  {
    id: "AUD-003",
    timestamp: "06:51 WIB",
    type: "SAP_PR_CREATED",
    title: "Purchase Requisition Published",
    details: "SAP S/4HANA BAPI returned PR-4500012350.",
    actor: "SAP OData Connector",
  },
  {
    id: "AUD-004",
    timestamp: "07:00 WIB",
    type: "BEDROCK_EVAL",
    title: "AWS Bedrock Evaluated SKU-10023",
    details: "Stock below threshold (12 pcs). Weather: Hujan deras. Target: 15 pcs.",
    actor: "Agentic AI Engine",
  },
];
