import { type FC } from "react";
import {
  Clock,
  AlertTriangle,
  Layers,
  Brain,
  CheckCheck,
  ArrowRight,
  Rocket,
  ShieldCheck,
} from "lucide-react";

const EXECUTIVE_METRICS = [
  {
    value: "99,2%",
    label: "On-Shelf Availability",
    sub: "Eliminasi kekosongan rak jam sibuk",
  },
  {
    value: "-50%",
    label: "Susut & Kadaluwarsa",
    sub: "Proteksi margin produk segar & roti",
  },
  {
    value: "< 10 dtk",
    label: "Keputusan Kepala Toko",
    sub: "1-klik approve langsung di Telegram",
  },
  {
    value: "100%",
    label: "Sinkronisasi SAP ERP",
    sub: "Zero re-entry, PR otomatis terbit",
  },
] as const;

const PIPELINE_STEPS = [
  {
    step: "01",
    title: "Evaluasi POS Terjadwal",
    icon: Clock,
    badge: "EVENT-DRIVEN CRON",
    desc: "Telemetri inventori fisik seluruh cabang dimonitor secara terjadwal dan real-time dari sistem POS kasir tanpa membebani database operasional.",
    detail: "Interval: Tiap 30 menit / trigger stok kritis",
  },
  {
    step: "02",
    title: "Prioritas SKU & Anomali",
    icon: AlertTriangle,
    badge: "THRESHOLD ENGINE",
    desc: "Engine otomatis mendeteksi SKU perishable dan fast-moving yang mendekati batas aman sebelum rak benar-benar kosong di jam sibuk.",
    detail: "Target: Produk segar, roti, susu, & FMCG utama",
  },
  {
    step: "03",
    title: "Agregasi Konteks Lokal",
    icon: Layers,
    badge: "MULTI-MODAL DATA",
    desc: "Menggabungkan variabel eksternal mikro: prakiraan cuaca BMKG, trafik komuter/kampus/perkantoran, promo akhir pekan, dan jadwal armada DC.",
    detail: "Sumber: BMKG API, Kalender Promo, & Status Truk DC",
  },
  {
    step: "04",
    title: "Reasoning AWS Bedrock",
    icon: Brain,
    badge: "CLAUDE 3.5 SONNET",
    desc: "AI Agent mengalkulasi kuota order presisi beserta alasan Bahasa Indonesia yang transparan — memangkas kuota saat hujan deras agar bebas basi.",
    detail: "Output: Rekomendasi terstruktur + jejak audit penuh",
  },
  {
    step: "05",
    title: "1-Klik Telegram → SAP PR",
    icon: CheckCheck,
    badge: "SAP S/4HANA SYNC",
    desc: "Rekomendasi masuk ke Telegram Kepala Toko. Cukup 1 klik Setuju, Purchase Requisition resmi terbit di SAP S/4HANA dan truk DC diberangkatkan.",
    detail: "SLA Respons: < 10 detik | Protokol: SAP OData / BAPI",
  },
] as const;

interface CaraKerjaProps {
  onOpenDemo?: () => void;
}

export const CaraKerja: FC<CaraKerjaProps> = ({ onOpenDemo }) => {
  return (
    <section
      id="cara-kerja"
      className="relative w-full py-20 px-4 sm:px-6 lg:px-12 bg-gradient-to-b from-[#2A2825] via-[#272522] to-[#242320] font-mono text-[#FAF9F5] select-none"
    >
      <div className="max-w-7xl mx-auto space-y-14">
        {/* 1. Executive Impact Metrics Bar (Immediate value right below the 3D Hero) */}
        <div className="rounded-[12px] bg-[#1F1E1D] border border-[#3D3C39] p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {EXECUTIVE_METRICS.map((m) => (
              <div
                key={m.label}
                className="space-y-1 border-l-2 border-[#D97757] pl-4"
              >
                <div className="text-[24px] sm:text-[30px] font-bold text-[#FAF9F5] tracking-tight leading-none">
                  {m.value}
                </div>
                <div className="text-[12px] sm:text-[13px] font-bold text-[#D97757] pt-1">
                  {m.label}
                </div>
                <div className="text-[11px] text-[#A3A199] leading-snug">
                  {m.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Enterprise Ecosystem Strip */}
          <div className="pt-5 border-t border-[#3D3C39] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#A3A199]">
            <span className="flex items-center gap-2 text-[#FAF9F5] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#D97757]" />
              <span>TERINTEGRASI STANDAR ENTERPRISE:</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                "SAP S/4HANA OData v4",
                "AWS Bedrock (Claude 3.5 Sonnet)",
                "Telegram Bot API (HITL)",
                "BMKG Weather Telemetry",
                "Amazon EventBridge + DynamoDB",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-[4px] bg-[#161615] border border-[#3D3C39] text-[#A3A199]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-[#1F1E1D] border border-[#3D3C39] text-[12px] text-[#FAF9F5]">
              <span className="text-[#D97757]">[*]</span>
              <span className="tracking-wider">ARSITEKTUR KERJA OTONOM</span>
            </div>

            <h2 className="text-[24px] sm:text-[32px] font-bold tracking-[-0.02em] leading-tight text-[#FAF9F5]">
              Cara Kerja <span className="text-[#D97757]">AutoReplenish.ai</span>
            </h2>

            <p className="text-[13px] sm:text-[14px] text-[#A3A199] max-w-[680px] leading-relaxed">
              Alur otomatisasi 5 tahap yang menghubungkan deteksi telemetri rak toko, penalaran konteks cuaca & trafik lokal, persetujuan 1-klik via Telegram, hingga penerbitan PR ke SAP S/4HANA.
            </p>
          </div>

          <a
            href="#alur-kerja"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] bg-[#1F1E1D] hover:bg-[#2A2927] border border-[#3D3C39] text-[12px] text-[#FAF9F5] transition-colors self-start md:self-auto"
          >
            <span>Inspeksi Payload EventBridge</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D97757]" />
          </a>
        </div>

        {/* 3. Balanced 6-Card Grid (5 Pipeline Steps + 1 Pilot Conversion Card) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PIPELINE_STEPS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="relative flex flex-col justify-between p-6 rounded-[10px] bg-[#1F1E1D] border border-[#3D3C39] hover:border-[#D97757] transition-all duration-200 group"
              >
                <div className="space-y-4">
                  {/* Step Number & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-bold text-[#D97757]">
                      TAHAP {item.step}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-[4px] bg-[#161615] border border-[#3D3C39] text-[#A3A199]">
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-[8px] bg-[#161615] border border-[#3D3C39] text-[#FAF9F5] group-hover:border-[#D97757] transition-colors">
                      <Icon className="w-5 h-5 text-[#D97757]" />
                    </div>
                    <h3 className="text-[16px] font-bold text-[#FAF9F5] leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-[12px] sm:text-[13px] text-[#A3A199] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Sub-detail footer */}
                <div className="pt-4 mt-5 border-t border-[#3D3C39] flex items-center justify-between text-[11px] text-[#6E6C66]">
                  <span>{item.detail}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#3D3C39] group-hover:text-[#D97757] transition-colors" />
                </div>
              </div>
            );
          })}

          {/* 6th Card: High-Converting Pilot Program CTA Card */}
          <div className="relative flex flex-col justify-between p-6 rounded-[10px] bg-[#2A2927] border border-[#D97757] transition-all duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[#D97757]">
                  READY FOR PILOT
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-[4px] bg-[#161615] border border-[#D97757]/50 text-[#FAF9F5]">
                  14 HARI ONBOARDING
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-[8px] bg-[#D97757] text-[#161615]">
                  <Rocket className="w-5 h-5" />
                </div>
                <h3 className="text-[16px] font-bold text-[#FAF9F5] leading-snug">
                  Uji Coba di 10–25 Cabang Anda
                </h3>
              </div>

              <p className="text-[12px] sm:text-[13px] text-[#FAF9F5]/90 leading-relaxed">
                Integrasi sandbox SAP S/4HANA dan bot Telegram siap dalam 2 minggu tanpa mengganggu operasional kasir yang berjalan.
              </p>
            </div>

            <div className="pt-4 mt-5 border-t border-[#3D3C39] flex items-center justify-between gap-2">
              {onOpenDemo ? (
                <button
                  type="button"
                  onClick={onOpenDemo}
                  className="w-full py-2.5 px-4 rounded-[8px] bg-[#D97757] hover:bg-[#E58A6B] text-[#161615] text-[12px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Jadwalkan Pilot POC</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <a
                  href="#roi"
                  className="w-full py-2.5 px-4 rounded-[8px] bg-[#D97757] hover:bg-[#E58A6B] text-[#161615] text-[12px] font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Hitung Estimasi ROI</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
