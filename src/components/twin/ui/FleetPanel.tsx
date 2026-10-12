import { useState, type FC } from "react";
import {
  Building2,
  Truck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
} from "lucide-react";
import { useTwinStore } from "@/store/useTwinStore";

type TabType = "stores" | "trucks" | "recommendations";

export const FleetPanel: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("trucks");
  const [collapsed, setCollapsed] = useState(false);

  const stores = useTwinStore((s) => s.stores);
  const trucks = useTwinStore((s) => s.trucks);
  const recommendations = useTwinStore((s) => s.recommendations);
  const selectedEntity = useTwinStore((s) => s.selectedEntity);
  const selectEntity = useTwinStore((s) => s.selectEntity);

  return (
    <div className="absolute bottom-4 right-4 z-30 pointer-events-none max-w-sm sm:max-w-md w-full">
      <div className="p-3.5 sm:p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-200/60 pointer-events-auto transition-all duration-300">
        {/* Header with Tabs & Collapse Button */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <div className="flex items-center gap-1 bg-neutral-100/80 p-0.5 rounded-xl">
            <button
              onClick={() => setActiveTab("stores")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "stores"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Building2 className="h-3 w-3" />
              <span>Toko ({stores.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("trucks")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "trucks"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Truck className="h-3 w-3" />
              <span>Armada ({trucks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("recommendations")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "recommendations"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-800"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              <span>AI ({recommendations.length})</span>
            </button>
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* List Content */}
        {!collapsed && (
          <div className="pt-2.5 space-y-1.5 max-h-48 overflow-y-auto animate-in fade-in duration-200">
            {/* Stores Tab */}
            {activeTab === "stores" &&
              stores.map((s) => {
                const isSelected = selectedEntity?.type === "site" && selectedEntity.id === s.id;
                const fillPct = Math.round((s.stockOnHandPallets / s.capacityPallets) * 100);
                const hasRisk = s.inventory.some((i) => i.status === "STOCKOUT_RISK");

                return (
                  <div
                    key={s.id}
                    onClick={() => selectEntity("site", s.id)}
                    className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-400 font-semibold"
                        : "bg-white/80 hover:bg-neutral-50 border-neutral-100 text-neutral-800"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-neutral-900">{s.id}</span>
                        <span>{s.name}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {s.occupiedBays}/{s.totalBays} bay · {fillPct}% kapasitas
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          hasRisk
                            ? "bg-rose-100 text-rose-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {hasRisk ? "Restock" : "Normal"}
                      </span>
                      <ArrowUpRight className="h-3 w-3 text-neutral-400" />
                    </div>
                  </div>
                );
              })}

            {/* Trucks Tab */}
            {activeTab === "trucks" &&
              trucks.map((t) => {
                const isSelected = selectedEntity?.type === "truck" && selectedEntity.id === t.id;
                const progressPct = Math.round(t.progress * 100);

                return (
                  <div
                    key={t.id}
                    onClick={() => selectEntity("truck", t.id)}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-400"
                        : "bg-white/80 hover:bg-neutral-50 border-neutral-100 text-neutral-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                        <span>{t.id}</span>
                        <span className="text-[10px] text-neutral-500 font-normal">
                          → {t.destinationName}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 uppercase">
                        {t.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-1.5 flex-1 rounded-full bg-neutral-100 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {progressPct}% ({t.etaMinutes}m)
                      </span>
                    </div>
                  </div>
                );
              })}

            {/* Recommendations Tab */}
            {activeTab === "recommendations" &&
              recommendations.map((r) => {
                const isSelected = selectedEntity?.type === "recommendation" && selectedEntity.id === r.id;

                return (
                  <div
                    key={r.id}
                    onClick={() => selectEntity("recommendation", r.id)}
                    className={`p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/90 border-blue-400"
                        : "bg-white/80 hover:bg-neutral-50 border-neutral-100 text-neutral-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-neutral-900 truncate max-w-[170px]">
                        {r.skuName}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          r.status === "PENDING_APPROVAL"
                            ? "bg-amber-100 text-amber-800 animate-pulse"
                            : r.status === "APPROVED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {r.status === "PENDING_APPROVAL" ? "Pending" : r.status}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 flex justify-between">
                      <span>{r.storeName}</span>
                      <span className="text-blue-600 font-semibold font-mono">
                        Target: {r.recommendedQty} pcs
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};
