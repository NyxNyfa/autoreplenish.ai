import { useState, type FC } from "react";
import { Check, Clock, ChevronUp, ChevronDown, Truck, ArrowRight } from "lucide-react";
import { useTwinStore } from "@/store/useTwinStore";

const STAGES = [
  { label: "AI Evaluation", sub: "AWS Bedrock", time: "07:00" },
  { label: "Telegram Approval", sub: "Kepala Toko", time: "07:02" },
  { label: "PR SAP Created", sub: "S/4HANA OData", time: "07:03" },
  { label: "In Transit", sub: "DC to Store", time: "07:15" },
  { label: "Restocked", sub: "Store Staging", time: "Est 07:35" },
];

export const TrackingStepper: FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const stepperStage = useTwinStore((s) => s.stepperStage);
  const activeShipment = useTwinStore((s) => s.activeShipment);
  const selectEntity = useTwinStore((s) => s.selectEntity);

  return (
    <div className="absolute bottom-4 left-4 z-30 pointer-events-none max-w-sm sm:max-w-md w-full">
      <div className="p-3.5 sm:p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-200/60 pointer-events-auto transition-all duration-300">
        {/* Header with collapse toggle */}
        <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <h4 className="text-xs font-bold text-neutral-900">
              Pelacakan Replenishment Otomatis
            </h4>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {!collapsed && (
          <div className="pt-3 space-y-3 animate-in fade-in duration-200">
            {/* 5-Step Stepper */}
            <div className="flex items-center justify-between relative px-1">
              {/* Connecting line behind icons */}
              <div className="absolute top-3 left-4 right-4 h-0.5 bg-neutral-200 -z-0" />
              <div
                className="absolute top-3 left-4 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
                style={{
                  width: `${(Math.min(stepperStage, 4) / 4) * 88}%`,
                }}
              />

              {STAGES.map((st, idx) => {
                const isPassed = idx < stepperStage;
                const isCurrent = idx === stepperStage;

                return (
                  <div key={idx} className="flex flex-col items-center relative z-10 text-center">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                        isPassed
                          ? "bg-blue-600 text-white shadow-sm ring-2 ring-blue-100"
                          : isCurrent
                          ? "bg-white text-blue-600 border-2 border-blue-600 shadow-md ring-2 ring-blue-100 scale-110"
                          : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                      }`}
                    >
                      {isPassed ? <Check className="h-3 w-3 stroke-[3]" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[9px] font-bold mt-1.5 leading-tight max-w-[54px] truncate ${
                        isCurrent ? "text-blue-700 font-extrabold" : isPassed ? "text-neutral-800" : "text-neutral-400"
                      }`}
                    >
                      {st.label}
                    </span>
                    <span className="text-[8px] text-neutral-400 font-mono mt-0.5 hidden sm:inline">
                      {st.time}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Active Shipment Card */}
            {activeShipment && (
              <div
                onClick={() => selectEntity("truck", activeShipment.truckId)}
                className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/60 flex items-center justify-between text-xs cursor-pointer hover:border-blue-400 transition-all shadow-sm group active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
                    <Truck className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                      <span>{activeShipment.id}</span>
                      <ArrowRight className="h-3 w-3 text-neutral-400" />
                      <span className="text-blue-700">{activeShipment.storeName}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <span>{activeShipment.bay}</span>
                      <span>·</span>
                      <span className="font-mono text-blue-600 font-semibold">{activeShipment.prId}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-xs">
                    {activeShipment.status}
                  </span>
                  <div className="text-[10px] text-neutral-500 font-medium mt-1 flex items-center justify-end gap-0.5">
                    <Clock className="h-2.5 w-2.5 text-neutral-400" />
                    <span>{activeShipment.minutesLeft} m tersisa</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
