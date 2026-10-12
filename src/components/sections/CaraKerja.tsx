import { type FC } from "react";
import { Clock, AlertTriangle, Layers, Brain, CheckCheck, ArrowRight } from "lucide-react";

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Evaluasi Terjadwal",
    icon: Clock,
    badge: "EVENT-DRIVEN CRON",
    desc: "Telemetri inventori fisik seluruh cabang dimonitor secara terjadwal dan real-time dari sistem POS kasir tanpa beban kueri berlebih.",
    detail: "Interval: Setiap 30 menit / trigger stok menipis",
  },
  {
    step: "02",
    title: "Prioritas SKU & Anomali",
    icon: AlertTriangle,
    badge: "THRESHOLD ENGINE",
    desc: "Engine otomatis mendeteksi SKU perishable dengan stok di bawah threshold aman dan masa kedaluwarsa pendek yang berisiko stockout.",
    detail: "Target: Perishable food, roti, susu, & item perputaran cepat",
  },
  {
    step: "03",
    title: "Context Aggregation",
    icon: Layers,
    badge: "MULTI-MODAL DATA",
    desc: "Menggabungkan variabel eksternal: prakiraan cuaca hujan lebat, kalender perkantoran (sepi weekend), lead time vendor DC, dan kapasitas rak fisik.",
    detail: "Sumber: BMKG API, Traffic Pattern, & DC Fleet Status",
  },
  {
    step: "04",
    title: "Reasoning Bedrock",
    icon: Brain,
    badge: "AGENTIC REASONING",
    desc: "AI Agent (AWS Bedrock) melakukan komputasi penyesuaian kuota. Memotong kuota 70% saat weekend hujan untuk mencegah pemborosan pangan dan overstock.",
    detail: "LLM: Claude 3.5 Sonnet dengan output skema terstruktur",
  },
  {
    step: "05",
    title: "Approval Telegram → PR SAP",
    icon: CheckCheck,
    badge: "1-CLICK ERP SYNC",
    desc: "Rekomendasi instan dikirim ke Telegram Kepala Toko. Cukup 1 klik approve, Purchase Requisition langsung tercipta di SAP S/4HANA dan armada DC diberangkatkan.",
    detail: "SLA Response: < 3 menit | Sinkronisasi: SAP RFC / REST",
  },
] as const;

export const CaraKerja: FC = () => {
  return (
    <section
      id="cara-kerja"
      className="relative w-full py-20 px-6 sm:px-10 lg:px-16 bg-[#161615] border-b border-[#3D3C39] font-mono text-[#FAF9F5] select-none"
    >
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#1F1E1D] border border-[#3D3C39] text-[12px] text-[#FAF9F5]">
            <span className="text-[#D97757]">[*]</span>
            <span className="tracking-wider">END-TO-END PIPELINE</span>
          </div>

          <h2 className="text-[26px] sm:text-[34px] font-[500] tracking-[-0.02em] leading-tight text-[#FAF9F5]">
            Cara Kerja <span className="text-[#D97757]">AutoReplenish.ai</span>
          </h2>

          <p className="text-[13px] sm:text-[14px] text-[#A3A199] max-w-[680px] leading-relaxed">
            Alur otomatisasi 5 tahap otonom yang menghubungkan deteksi telemetri rak toko, pertimbangan konteks cuaca lokal, persetujuan via Telegram bot, hingga eksekusi PO ke SAP S/4HANA.
          </p>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PIPELINE_STEPS.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === PIPELINE_STEPS.length - 1;

            return (
              <div
                key={item.step}
                className={`relative flex flex-col justify-between p-6 rounded-[10px] bg-[#1F1E1D] border border-[#3D3C39] hover:border-[#6E6C66] transition-all duration-200 group ${
                  isLast ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <div className="space-y-4">
                  {/* Step Number & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#D97757]">
                      PHASE {item.step}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-[4px] bg-[#2A2927] border border-[#3D3C39] text-[#A3A199]">
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-[8px] bg-[#2A2927] border border-[#3D3C39] text-[#FAF9F5] group-hover:border-[#D97757] transition-colors">
                      <Icon className="w-5 h-5 text-[#D97757]" />
                    </div>
                    <h3 className="text-[16px] font-[500] text-[#FAF9F5] leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-[12px] sm:text-[13px] text-[#A3A199] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Sub-detail footer */}
                <div className="pt-5 mt-5 border-t border-[#3D3C39]/60 flex items-center justify-between text-[11px] text-[#6E6C66]">
                  <span>{item.detail}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#3D3C39] group-hover:text-[#D97757] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
