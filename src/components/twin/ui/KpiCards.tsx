import type { FC } from "react";
import { Package, Truck, CheckCircle, TrendingUp, Zap } from "lucide-react";
import { useTwinStore } from "@/store/useTwinStore";

export const KpiCards: FC = () => {
  const kpis = useTwinStore((s) => s.kpis);
  const triggerStockoutTest = useTwinStore((s) => s.triggerStockoutTest);

  return (
    <div className="absolute top-20 left-4 z-30 flex flex-col gap-2.5 pointer-events-none">
      {/* KPI 1: Stok On-Hand (pallets) */}
      <div className="w-56 sm:w-60 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-200/50 pointer-events-auto transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-center justify-between text-neutral-500 mb-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600">
            <Package className="h-3.5 w-3.5 text-blue-600" />
            <span>Stok On-Hand</span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <TrendingUp className="h-2.5 w-2.5" />
            +{kpis.onHandDelta}%
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            {kpis.onHandPallets}{" "}
            <span className="text-xs font-semibold text-neutral-400">pallets</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">4 lokasi aktif</span>
        </div>
      </div>

      {/* KPI 2: Truk Aktif */}
      <div className="w-56 sm:w-60 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-200/50 pointer-events-auto transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-center justify-between text-neutral-500 mb-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600">
            <Truck className="h-3.5 w-3.5 text-blue-600" />
            <span>Truk Aktif</span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60">
            +{kpis.activeTrucksDelta} armada
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            {kpis.activeTrucks}{" "}
            <span className="text-xs font-semibold text-neutral-400">unit</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">100% online</span>
        </div>
      </div>

      {/* KPI 3: On-Time Delivery % */}
      <div className="w-56 sm:w-60 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-200/50 pointer-events-auto transition-transform hover:-translate-y-0.5 duration-200">
        <div className="flex items-center justify-between text-neutral-500 mb-1">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-600">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>On-Time Delivery</span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            +{kpis.onTimeDelta}%
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
            {kpis.onTimeDeliveryPct}%
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">Target &gt;95%</span>
        </div>
      </div>

      {/* Quick Action: Trigger Stockout Test */}
      <div className="pointer-events-auto">
        <button
          onClick={triggerStockoutTest}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-300 shadow-sm text-xs font-bold transition-all cursor-pointer active:scale-95"
          title="Simulasikan stok kritis untuk memicu kartu Telegram AI"
        >
          <Zap className="h-3.5 w-3.5 text-amber-600 fill-amber-500" />
          <span>Simulasi Stockout Darurat</span>
        </button>
      </div>
    </div>
  );
};
