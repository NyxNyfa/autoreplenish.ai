import { useSyncExternalStore } from "react";
import {
  INITIAL_STORES,
  INITIAL_TRUCKS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_AUDIT_LOGS,
  type StoreMetadata,
  type TruckData,
  type RecommendationData,
  type AuditLogEntry,
} from "@/data/mockPrd";
import { buildRoadRoute } from "@/components/twin/3d/SiteConfig";

export interface ActiveShipment {
  id: string;
  truckId: string;
  storeId: string;
  storeName: string;
  prId: string;
  status: "In Transit" | "Arrived" | "Unloading";
  bay: string;
  minutesLeft: number;
}

export interface TwinState {
  stores: StoreMetadata[];
  trucks: TruckData[];
  recommendations: RecommendationData[];
  activeRecommendationId: string | null;
  selectedEntity: {
    type: "site" | "truck" | "pallet" | "recommendation";
    id: string;
  } | null;
  activeShipment: ActiveShipment | null;
  kpis: {
    onHandPallets: number;
    activeTrucks: number;
    onTimeDeliveryPct: number;
    onHandDelta: number;
    activeTrucksDelta: number;
    onTimeDelta: number;
  };
  stepperStage: number; // 0: AI Evaluation, 1: Telegram Approval, 2: PR SAP Created, 3: In Transit, 4: Restocked
  userRole: "kepala_toko" | "regional_manager";
  cameraTarget: [number, number, number];
  cameraZoom: number;
  isSimulating: boolean;
  simSpeed: number; // 1, 2, 5
  systemTime: string;
  auditLogs: AuditLogEntry[];
  toastMessage: string | null;

  // Actions
  selectEntity: (type: "site" | "truck" | "pallet" | "recommendation", id: string) => void;
  clearSelection: () => void;
  focusSite: (siteId: string) => void;
  approveRecommendation: (id: string) => void;
  rejectRecommendation: (id: string, reason: string) => void;
  editRecommendationQty: (id: string, newQty: number, reason: string) => void;
  triggerStockoutTest: () => void;
  tickSimulation: () => void;
  setUserRole: (role: "kepala_toko" | "regional_manager") => void;
  setSimSpeed: (speed: number) => void;
  toggleSimulation: () => void;
  resetCamera: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  openRecommendation: (id: string) => void;
  closeRecommendation: () => void;
  clearToast: () => void;
}

// ----------------------------------------------------------------------------
// Lightweight Reactive Store (built-in useSyncExternalStore)
// ----------------------------------------------------------------------------
type Listener = () => void;

class Store {
  private state: TwinState;
  private listeners = new Set<Listener>();

  constructor() {
    this.state = {
      stores: INITIAL_STORES,
      trucks: INITIAL_TRUCKS,
      recommendations: INITIAL_RECOMMENDATIONS,
      activeRecommendationId: null, // Initially closed so 3D digital twin is unobstructed
      selectedEntity: null,
      activeShipment: {
        id: "SHP-9021",
        truckId: "TRK-2051",
        storeId: "STR-001",
        storeName: "Cabang Sudirman",
        prId: "PR-4500011890",
        status: "In Transit",
        bay: "Bay 2",
        minutesLeft: 14,
      },
      kpis: {
        onHandPallets: 480,
        activeTrucks: 4,
        onTimeDeliveryPct: 98.4,
        onHandDelta: 5.2,
        activeTrucksDelta: 1,
        onTimeDelta: 0.8,
      },
      stepperStage: 1, // Telegram Approval pending
      userRole: "kepala_toko",
      cameraTarget: [0, 2, 0], // Overview centered at [0, 2, 0]
      cameraZoom: 15,
      isSimulating: true,
      simSpeed: 1,
      systemTime: "07:15:30 WIB",
      auditLogs: INITIAL_AUDIT_LOGS,
      toastMessage: null,

      selectEntity: (type, id) => this.selectEntity(type, id),
      clearSelection: () => this.setState({ selectedEntity: null }),
      focusSite: (siteId) => this.focusSite(siteId),
      approveRecommendation: (id) => this.approveRecommendation(id),
      rejectRecommendation: (id, reason) => this.rejectRecommendation(id, reason),
      editRecommendationQty: (id, newQty, reason) => this.editRecommendationQty(id, newQty, reason),
      openRecommendation: (id) => this.setState({ activeRecommendationId: id }),
      closeRecommendation: () => this.setState({ activeRecommendationId: null }),
      triggerStockoutTest: () => this.triggerStockoutTest(),
      tickSimulation: () => this.tickSimulation(),
      setUserRole: (role) => this.setState({ userRole: role }),
      setSimSpeed: (speed) => this.setState({ simSpeed: speed }),
      toggleSimulation: () => this.setState({ isSimulating: !this.state.isSimulating }),
      resetCamera: () => this.setState({ cameraTarget: [0, 2, 0], cameraZoom: 15, selectedEntity: null }),
      zoomIn: () => this.setState({ cameraZoom: Math.min(80, this.state.cameraZoom + 4) }),
      zoomOut: () => this.setState({ cameraZoom: Math.max(10, this.state.cameraZoom - 4) }),
      clearToast: () => this.setState({ toastMessage: null }),
    };
  }

  getState = () => this.state;

  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private setState(partial: Partial<TwinState>) {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((l) => l());
  }

  private selectEntity(type: "site" | "truck" | "pallet" | "recommendation", id: string) {
    let target = this.state.cameraTarget;
    if (type === "site") {
      const site = this.state.stores.find((s) => s.id === id);
      if (site) target = site.position;
    } else if (type === "truck") {
      const truck = this.state.trucks.find((t) => t.id === id);
      if (truck) target = truck.position;
    } else if (type === "recommendation") {
      const rec = this.state.recommendations.find((r) => r.id === id);
      if (rec) {
        const site = this.state.stores.find((s) => s.id === rec.storeId);
        if (site) target = site.position;
      }
    }
    this.setState({
      selectedEntity: { type, id },
      cameraTarget: target,
    });
  }

  private focusSite(siteId: string) {
    const site = this.state.stores.find((s) => s.id === siteId);
    if (site) {
      this.setState({
        selectedEntity: { type: "site", id: siteId },
        cameraTarget: site.position,
        cameraZoom: 26,
      });
    }
  }

  private approveRecommendation(id: string) {
    const rec = this.state.recommendations.find((r) => r.id === id);
    if (!rec) return;

    const prId = `PR-45000${Math.floor(10000 + Math.random() * 90000)}`;
    const updatedRecs = this.state.recommendations.map((r) =>
      r.id === id
        ? {
            ...r,
            status: "APPROVED" as const,
            prId,
          }
        : r
    );

    // Append audit record
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      type: "TELEGRAM_APPROVAL",
      title: `Rekomendasi Disetujui (${rec.skuName})`,
      details: `Disetujui oleh Kepala Toko. PR SAP diterbitkan: ${prId} (Qty: ${rec.recommendedQty} pcs).`,
      actor: "Kepala Toko (Telegram)",
    };

    // Dispatch nearest truck (TRK-2481 or first idle truck)
    const truckToDispatch = this.state.trucks.find((t) => t.status === "LOADING" || t.status === "IDLE") || this.state.trucks[0];
    const updatedTrucks = this.state.trucks.map((t) =>
      t.id === truckToDispatch.id
        ? {
            ...t,
            status: "EN_ROUTE" as const,
            progress: 0.1,
            etaMinutes: 18,
            destinationName: rec.storeName,
            assignedStoreId: rec.storeId,
            cargo: {
              skuName: rec.skuName,
              pallets: Math.ceil(rec.recommendedQty / 12),
              prId,
            },
          }
        : t
    );

    this.setState({
      recommendations: updatedRecs,
      trucks: updatedTrucks,
      activeRecommendationId: null, // close telegram card
      stepperStage: 2, // PR SAP Created
      activeShipment: {
        id: `SHP-${Math.floor(9100 + Math.random() * 800)}`,
        truckId: truckToDispatch.id,
        storeId: rec.storeId,
        storeName: rec.storeName,
        prId,
        status: "In Transit",
        bay: "Bay 1",
        minutesLeft: 18,
      },
      auditLogs: [newLog, ...this.state.auditLogs],
      toastMessage: `✅ Rekomendasi Disetujui! PR SAP diterbitkan: ${prId}. Truk ${truckToDispatch.id} meluncur ke ${rec.storeName}.`,
    });

    // Advance stepper to In Transit after brief delay
    setTimeout(() => {
      this.setState({ stepperStage: 3 });
    }, 1500);
  }

  private rejectRecommendation(id: string, reason: string) {
    const rec = this.state.recommendations.find((r) => r.id === id);
    if (!rec) return;

    const updatedRecs = this.state.recommendations.map((r) =>
      r.id === id ? { ...r, status: "REJECTED" as const } : r
    );

    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      type: "TELEGRAM_REJECTED",
      title: `Rekomendasi Ditolak (${rec.skuName})`,
      details: `Alasan: "${reason || "Kondisi fisik toko cukup"}". Disimpan ke feedback loop AWS Bedrock.`,
      actor: "Kepala Toko (Telegram)",
    };

    this.setState({
      recommendations: updatedRecs,
      activeRecommendationId: null,
      auditLogs: [newLog, ...this.state.auditLogs],
      toastMessage: `❌ Rekomendasi ditolak. Feedback tersimpan untuk model learning.`,
    });
  }

  private editRecommendationQty(id: string, newQty: number, reason: string) {
    const rec = this.state.recommendations.find((r) => r.id === id);
    if (!rec) return;

    const prId = `PR-45000${Math.floor(10000 + Math.random() * 90000)}`;
    const updatedRecs = this.state.recommendations.map((r) =>
      r.id === id
        ? {
            ...r,
            recommendedQty: newQty,
            status: "APPROVED" as const,
            prId,
          }
        : r
    );

    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
      type: "TELEGRAM_EDITED",
      title: `Jumlah Diubah & Disetujui (${rec.skuName})`,
      details: `Qty disesuaikan menjadi ${newQty} pcs (Alasan: "${reason || "Display tambahan"}"). PR SAP: ${prId}.`,
      actor: "Kepala Toko (Telegram)",
    };

    this.setState({
      recommendations: updatedRecs,
      activeRecommendationId: null,
      stepperStage: 2,
      auditLogs: [newLog, ...this.state.auditLogs],
      toastMessage: `✏️ Jumlah disesuaikan ke ${newQty} pcs. PR SAP ${prId} berhasil dibuat.`,
    });

    setTimeout(() => {
      this.setState({ stepperStage: 3 });
    }, 1500);
  }

  private triggerStockoutTest() {
    // Force stockout on STR-001 Roti Manis
    const updatedStores = this.state.stores.map((s) => {
      if (s.id === "STR-001") {
        return {
          ...s,
          inventory: s.inventory.map((item) =>
            item.id === "SKU-10023"
              ? { ...item, physicalStock: 6, status: "STOCKOUT_RISK" as const }
              : item
          ),
        };
      }
      return s;
    });

    const newReqId = `REQ-${Date.now().toString().slice(-8)}`;
    const newRec: RecommendationData = {
      id: newReqId,
      runId: `RUN-${Date.now().toString().slice(-6)}`,
      storeId: "STR-001",
      storeName: "Cabang Sudirman",
      areaType: "Perkantoran",
      skuId: "SKU-10023",
      skuName: "Roti Manis Cokelat 100g",
      category: "Perishable",
      physicalStock: 6,
      threshold: 20,
      leadTime: "2 Hari",
      weatherCondition: "Hujan lokal",
      reasoningNarrative:
        "Stok kritis (6 pcs, <50% threshold). Penjualan pagi tinggi. Order darurat 24 pcs (2 dus) dianjurkan agar rak tidak kosong sebelum siang.",
      recommendedQty: 24,
      normalQty: 40,
      packagingMultiple: 12,
      confidenceScore: 0.94,
      riskLevel: "high",
      keyFactors: ["critical_stockout_risk", "fast_morning_burn", "pack_12_moq"],
      status: "PENDING_APPROVAL",
      timestamp: "Baru saja",
    };

    this.setState({
      stores: updatedStores,
      recommendations: [newRec, ...this.state.recommendations],
      activeRecommendationId: newRec.id,
      selectedEntity: { type: "site", id: "STR-001" },
      stepperStage: 0,
      toastMessage: `⚠️ Alert Stockout: Sisa fisik Roti Manis di Cabang Sudirman sisa 6 pcs. Rekomendasi AI terbit!`,
    });

    setTimeout(() => {
      this.setState({ stepperStage: 1 });
    }, 1200);
  }

  private tickSimulation() {
    if (!this.state.isSimulating) return;

    // Advance clock
    const now = new Date();
    const systemTime = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " WIB";

    // Progress trucks
    let arrivedStoreId: string | null = null;
    const baseSpeedFactor = 0.008 * this.state.simSpeed;

    const updatedTrucks = this.state.trucks.map((truck) => {
      if (truck.status === "EN_ROUTE") {
        const route = buildRoadRoute("DC-01", truck.assignedStoreId);
        const inCorner = route.isCorner(truck.progress);
        const effectiveFactor = inCorner ? baseSpeedFactor * 0.4 : baseSpeedFactor;
        const nextProgress = truck.progress + effectiveFactor;

        if (nextProgress >= 1.0) {
          arrivedStoreId = truck.assignedStoreId;
          return {
            ...truck,
            progress: 1.0,
            status: "UNLOADING" as const,
            speedKmH: 0,
            etaMinutes: 0,
          };
        }
        return {
          ...truck,
          progress: nextProgress,
          speedKmH: inCorner ? 22 : 50,
          etaMinutes: Math.max(1, Math.round((1.0 - nextProgress) * 20)),
        };
      } else if (truck.status === "UNLOADING" || truck.status === "DOCKING") {
        return {
          ...truck,
          speedKmH: 0,
          etaMinutes: 0,
        };
      }
      return truck;
    });

    // If a truck arrived, restock store & complete stepper
    let updatedStores = this.state.stores;
    let stepperStage = this.state.stepperStage;
    let activeShipment = this.state.activeShipment;

    if (arrivedStoreId) {
      updatedStores = this.state.stores.map((s) => {
        if (s.id === arrivedStoreId) {
          return {
            ...s,
            stockOnHandPallets: Math.min(s.capacityPallets, s.stockOnHandPallets + 3),
            inventory: s.inventory.map((item) => ({
              ...item,
              physicalStock: item.physicalStock + 24,
              status: "IN_STOCK" as const,
            })),
          };
        }
        return s;
      });

      stepperStage = 4; // Restocked
      if (activeShipment) {
        activeShipment = { ...activeShipment, status: "Arrived", minutesLeft: 0 };
      }
    }

    this.setState({
      systemTime,
      trucks: updatedTrucks,
      stores: updatedStores,
      stepperStage,
      activeShipment,
    });
  }
}

export const twinStore = new Store();

export function useTwinStore<T = TwinState>(selector?: (state: TwinState) => T): T {
  const state = useSyncExternalStore(
    twinStore.subscribe,
    twinStore.getState,
    twinStore.getState
  );
  return selector ? selector(state) : (state as unknown as T);
}
