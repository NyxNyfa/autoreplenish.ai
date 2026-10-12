import {
  X,
  Building2,
  Truck,
  Package,
  Sparkles,
  ArrowRight,
  Clock,
  Gauge,
  ShieldAlert,
} from "lucide-react";
import { useTwinStore } from "@/store/useTwinStore";
import type { StoreMetadata, TruckData, RecommendationData, SKUItem } from "@/data/mockPrd";

export const DetailPanel = () => {
  const selectedEntity = useTwinStore((s) => s.selectedEntity);
  const clearSelection = useTwinStore((s) => s.clearSelection);
  const stores = useTwinStore((s) => s.stores);
  const trucks = useTwinStore((s) => s.trucks);
  const recommendations = useTwinStore((s) => s.recommendations);
  const approveRecommendation = useTwinStore((s) => s.approveRecommendation);

  if (!selectedEntity) return null;

  return (
    <aside className="absolute top-20 right-4 bottom-24 w-80 lg:w-96 z-30 pointer-events-none flex flex-col justify-end lg:justify-start">
      <div className="w-full max-h-[85vh] overflow-y-auto p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-2xl border border-white/80 shadow-2xl shadow-slate-300/60 pointer-events-auto transition-all duration-300 animate-in fade-in slide-in-from-right-6">
        {/* Header with Title and Close button */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60">
              {selectedEntity.type}
            </span>
            <span className="text-xs font-semibold text-neutral-400">Detail Entitas</span>
          </div>
          <button
            onClick={clearSelection}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Tutup Panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content morphs by selected entity type */}
        {selectedEntity.type === "site" && renderSiteDetail(selectedEntity.id, stores)}
        {selectedEntity.type === "truck" && renderTruckDetail(selectedEntity.id, trucks)}
        {selectedEntity.type === "pallet" && renderPalletDetail(selectedEntity.id, stores)}
        {selectedEntity.type === "recommendation" &&
          renderRecommendationDetail(selectedEntity.id, recommendations, approveRecommendation)}
      </div>
    </aside>
  );
};

// ----------------------------------------------------------------------------
// Variant 1: SITE DETAIL
// ----------------------------------------------------------------------------
function renderSiteDetail(siteId: string, stores: StoreMetadata[]) {
  const store = stores.find((s: StoreMetadata) => s.id === siteId) || stores[0];
  const fillPct = Math.round((store.stockOnHandPallets / store.capacityPallets) * 100);
  const baysPct = Math.round((store.occupiedBays / store.totalBays) * 100);
  const hasRisk = store.inventory.some((i: SKUItem) => i.status === "STOCKOUT_RISK");

  return (
    <div className="space-y-4 pt-3 text-neutral-800">
      {/* Site Name & Status */}
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span>{store.name}</span>
          </h3>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              hasRisk
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}
          >
            {hasRisk ? "Restock Diperlukan" : "Operasional Normal"}
          </span>
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">
          {store.id} · Zona {store.areaType}
        </p>
      </div>

      {/* Capacity & Bays Progress Bars */}
      <div className="space-y-2.5 p-3 rounded-2xl bg-neutral-50/80 border border-neutral-100">
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-neutral-600">Kapasitas On-Hand</span>
            <span className="text-neutral-900 font-bold">
              {store.stockOnHandPallets} / {store.capacityPallets} pallets ({fillPct}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fillPct > 85 ? "bg-amber-500" : "bg-blue-600"
              }`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-neutral-600">Penggunaan Loading Bay</span>
            <span className="text-neutral-900 font-bold">
              {store.occupiedBays} / {store.totalBays} bay ({baysPct}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${baysPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Outbound & Put-away stats */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
          <div className="text-[10px] font-semibold text-neutral-500 uppercase">
            Outbound Hari Ini
          </div>
          <div className="text-lg font-black text-neutral-900 mt-0.5">
            {store.outboundToday} <span className="text-xs font-normal">pallets</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
          <div className="text-[10px] font-semibold text-neutral-500 uppercase">
            Put-Away Hari Ini
          </div>
          <div className="text-lg font-black text-neutral-900 mt-0.5">
            {store.putawayToday} <span className="text-xs font-normal">pallets</span>
          </div>
        </div>
      </div>

      {/* Inventory SKU List */}
      <div>
        <div className="text-xs font-bold text-neutral-900 mb-2 flex items-center justify-between">
          <span>Katalog SKU Kunci</span>
          <span className="text-[10px] text-neutral-400 font-normal">Auto-Evaluated</span>
        </div>
        <div className="space-y-1.5">
          {store.inventory.map((sku: SKUItem) => {
            const isRisk = sku.status === "STOCKOUT_RISK";
            const isLow = sku.status === "LOW_STOCK";
            return (
              <div
                key={sku.id}
                className={`p-2.5 rounded-xl border transition-all text-xs flex items-center justify-between ${
                  isRisk
                    ? "bg-rose-50/70 border-rose-200 text-rose-950"
                    : isLow
                    ? "bg-amber-50/70 border-amber-200 text-amber-950"
                    : "bg-white border-neutral-100 text-neutral-800"
                }`}
              >
                <div>
                  <div className="font-semibold text-neutral-900">{sku.name}</div>
                  <div className="text-[10px] text-neutral-400">
                    Sisa {sku.physicalStock} pcs · Threshold {sku.threshold}
                  </div>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isRisk
                      ? "bg-rose-500 text-white"
                      : isLow
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isRisk ? "Stockout Risk" : isLow ? "Low Stock" : "In Stock"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Variant 2: TRUCK DETAIL
// ----------------------------------------------------------------------------
function renderTruckDetail(truckId: string, trucks: TruckData[]) {
  const truck = trucks.find((t: TruckData) => t.id === truckId) || trucks[0];
  const progressPct = Math.round(truck.progress * 100);

  return (
    <div className="space-y-4 pt-3 text-neutral-800">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-600" />
            <span>{truck.id}</span>
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
            {truck.status}
          </span>
        </div>
        <p className="text-xs text-neutral-500 mt-0.5">
          Truk Box 6m · Varian {truck.modelVariant} ({truck.shipmentId})
        </p>
      </div>

      {/* Progress & ETA */}
      <div className="p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-100 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-neutral-600">Perjalanan ke Tujuan</span>
          <span className="text-blue-600 font-bold">{progressPct}%</span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-neutral-400" />
            ETA: <strong className="text-neutral-800">{truck.etaMinutes} menit</strong>
          </span>
          <span className="flex items-center gap-1">
            <Gauge className="h-3 w-3 text-neutral-400" />
            Kecepatan: <strong className="text-neutral-800">{truck.speedKmH} km/h</strong>
          </span>
        </div>
      </div>

      {/* Cargo Payload Info */}
      <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 space-y-2 text-xs">
        <div className="font-bold text-neutral-900 flex items-center justify-between border-b border-neutral-100 pb-1.5">
          <span>Manifes Muatan (Cargo)</span>
          <span className="text-[10px] text-blue-600 font-mono font-bold">
            {truck.cargo.prId}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Tujuan Toko:</span>
          <span className="font-semibold text-neutral-800">{truck.destinationName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Alokasi Bay:</span>
          <span className="font-semibold text-neutral-800">{truck.currentBay}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Komoditas:</span>
          <span className="font-semibold text-neutral-800">{truck.cargo.skuName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Volume:</span>
          <span className="font-bold text-blue-600">{truck.cargo.pallets} Pallets</span>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Variant 3: PALLET / SKU DETAIL
// ----------------------------------------------------------------------------
function renderPalletDetail(_skuId: string, stores: StoreMetadata[]) {
  // Find SKU across stores
  const store = stores[1];
  const sku = store.inventory[0];

  return (
    <div className="space-y-4 pt-3 text-neutral-800 text-xs">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-600" />
            <span>{sku.name}</span>
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase">
            {sku.category}
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 mt-0.5">{sku.id} · Lot {sku.lot}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
          <span className="text-[10px] text-neutral-400 uppercase font-semibold">Stok Fisik</span>
          <div className="text-lg font-black text-rose-600 mt-0.5">{sku.physicalStock} pcs</div>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
          <span className="text-[10px] text-neutral-400 uppercase font-semibold">Threshold</span>
          <div className="text-lg font-black text-neutral-800 mt-0.5">{sku.threshold} pcs</div>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
          <span className="text-[10px] text-neutral-400 uppercase font-semibold">Laju Burn Rate</span>
          <div className="text-sm font-bold text-neutral-800 mt-0.5">{sku.burnRate} pcs/hari</div>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
          <span className="text-[10px] text-neutral-400 uppercase font-semibold">Lead Time</span>
          <div className="text-sm font-bold text-neutral-800 mt-0.5">{sku.leadTimeDays} hari</div>
        </div>
      </div>

      <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 text-rose-900 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-rose-800">
          <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
          <span>Risiko Kedaluwarsa: {sku.expiryRisk}</span>
        </div>
        <p className="text-[11px] text-rose-700 leading-relaxed">
          Kategori perishable memiliki umur simpan pendek. Kuota reorder dipangkas otomatis jika cuaca buruk atau libur kantor.
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Variant 4: RECOMMENDATION DETAIL
// ----------------------------------------------------------------------------
function renderRecommendationDetail(
  recId: string,
  recommendations: RecommendationData[],
  onApprove: (id: string) => void
) {
  const rec = recommendations.find((r: RecommendationData) => r.id === recId) || recommendations[0];

  return (
    <div className="space-y-4 pt-3 text-neutral-800 text-xs">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span>Rekomendasi AI</span>
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {rec.status}
          </span>
        </div>
        <p className="text-[11px] text-neutral-500 mt-0.5 font-mono">{rec.id}</p>
      </div>

      {/* AI Reasoning Narrative Box */}
      <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Penalaran AWS Bedrock (Claude 3.5 Sonnet)</span>
        </div>
        <p className="text-xs text-blue-950 leading-relaxed italic">
          "{rec.reasoningNarrative}"
        </p>
      </div>

      {/* Confidence Score Bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span className="text-neutral-600">Skor Keyakinan (Confidence)</span>
          <span className="font-bold text-blue-600">
            {Math.round(rec.confidenceScore * 100)}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{ width: `${Math.round(rec.confidenceScore * 100)}%` }}
          />
        </div>
      </div>

      {/* Recommended vs Normal Qty */}
      <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-neutral-400 uppercase font-semibold">Normal Order</span>
          <div className="text-sm font-semibold text-neutral-500 line-through">
            {rec.normalQty} pcs
          </div>
        </div>
        <ArrowRight className="h-4 w-4 text-neutral-400" />
        <div className="text-right">
          <span className="text-[10px] text-blue-600 uppercase font-bold">Rekomendasi AI</span>
          <div className="text-base font-black text-blue-700">
            {rec.recommendedQty} pcs
          </div>
        </div>
      </div>

      {/* Key Factors Chips */}
      <div>
        <div className="text-[11px] font-bold text-neutral-600 mb-1.5">Faktor Penentu:</div>
        <div className="flex flex-wrap gap-1.5">
          {rec.keyFactors.map((f: string, i: number) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 font-mono"
            >
              #{f}
            </span>
          ))}
        </div>
      </div>

      {rec.status === "PENDING_APPROVAL" && (
        <button
          onClick={() => onApprove(rec.id)}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-95"
        >
          ✅ Setujui & Terbitkan ke SAP
        </button>
      )}
    </div>
  );
}
