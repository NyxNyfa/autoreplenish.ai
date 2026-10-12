import { useState, type FC } from "react";
import { Scroll3DCard } from "@/components/ui/scroll-3d-card";
import {
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  CloudSun,
  Bot,
  Send,
  FileCheck,
  Terminal,
  Activity,
  Layers,
} from "lucide-react";

interface WorkflowStep {
  number: string;
  title: string;
  icon: typeof Database;
  description: string;
  points: string[];
  meta: string;
  telemetry: {
    event: string;
    target: string;
    latency: string;
    payload: Record<string, unknown>;
  };
}

const steps: WorkflowStep[] = [
  {
    number: "01",
    title: "deteksi pagi",
    icon: Database,
    description:
      "sistem memindai seluruh inventaris gerai sebelum jam buka toko. SKU yang mendekati batas aman atau bergerak cepat otomatis masuk antrean evaluasi.",
    points: [
      "ratusan gerai diperiksa serentak tanpa lag",
      "prioritas SKU fast-moving & perishable (susu, roti, fresh)",
      "beban query terdistribusi tanpa mengganggu mesin kasir POS",
    ],
    meta: "05:00 WIB tiap hari",
    telemetry: {
      event: "INVENTORY_THRESHOLD_SCAN",
      target: "pos_db_cluster_read",
      latency: "142ms",
      payload: {
        timestamp: "05:00:12Z",
        stores_scanned: 184,
        critical_skus_flagged: 12,
        batch_id: "scan-20260929-01",
        status: "EVALUATION_QUEUED",
      },
    },
  },
  {
    number: "02",
    title: "kumpulkan konteks",
    icon: CloudSun,
    description:
      "menggabungkan data kontekstual mikro: prakiraan cuaca lokal BMKG/OpenWeather, katalog promo aktif, kalender gajian/libur, dan jadwal truk DC.",
    points: [
      "cuaca lokal real-time: panas terik memicu lonjakan minuman dingin",
      "efek kalender: diskon akhir pekan + tanggal muda",
      "jadwal rute armada truk dari Distribution Center (DC)",
    ],
    meta: "real-time ingest",
    telemetry: {
      event: "CONTEXT_ENRICHMENT",
      target: "weather_and_campaign_bus",
      latency: "86ms",
      payload: {
        store_id: "TB-04",
        weather_condition: "HEATWAVE_34C",
        weekend_promo: "ACTIVE_20PCT_DISCOUNT",
        dc_truck_eta: "TODAY_16:00_WIB",
        historical_multiplier: "2.38x",
      },
    },
  },
  {
    number: "03",
    title: "reasoning engine",
    icon: Bot,
    description:
      "Claude 3.5 Sonnet di Amazon Bedrock menghitung kebutuhan stok presisi sampai ritel pengiriman berikutnya, lengkap dengan penalaran bahasa Indonesia.",
    points: [
      "mencegah rak kosong tanpa risiko dead-stock menumpuk",
      "logika konservatif untuk produk bertanggal kedaluwarsa pendek",
      "alasan natural yang mudah dipahami kepala toko dalam 5 detik",
    ],
    meta: "hitungan detik",
    telemetry: {
      event: "BEDROCK_REASONING_INFERENCE",
      target: "anthropic.claude-3-5-sonnet-v2",
      latency: "620ms",
      payload: {
        model: "bedrock-claude-3.5-sonnet",
        input_tokens: 412,
        output_tokens: 184,
        recommended_qty: 45,
        confidence_score: 0.984,
        rationale_summary: "Cuaca panas + promo akhir pekan menaikkan sales 2.4x.",
      },
    },
  },
  {
    number: "04",
    title: "kirim ke telegram",
    icon: Send,
    description:
      "kartu rekomendasi dikirim ke Telegram smartphone kepala toko. Cukup baca ringkasan konteks dan ketuk satu tombol untuk konfirmasi.",
    points: [
      "setujui 1-klik, ubah jumlah rak fisik, atau tolak dengan alasan",
      "anti-duplicate click & session token terenkripsi",
      "durasi keputusan rata-rata toko < 10 detik",
    ],
    meta: "instant delivery",
    telemetry: {
      event: "TELEGRAM_DISPATCH_HITL",
      target: "telegram_bot_gateway",
      latency: "94ms",
      payload: {
        chat_id: 884920194,
        recipient: "Kepala Toko - Tebet Barat",
        quick_action: "INLINE_APPROVAL_KEYBOARD",
        auto_timeout: "4h_remaining",
        delivery_status: "DELIVERED_READ",
      },
    },
  },
  {
    number: "05",
    title: "terbitkan ke SAP",
    icon: FileCheck,
    description:
      "setelah kepala toko menyetujui, sistem langsung mengeksekusi OData BAPI Purchase Requisition ke SAP S/4HANA tanpa re-entry manual.",
    points: [
      "PR otomatis terbit dengan nomor referensi SAP resmi",
      "stok sistem, purchase order, dan stok fisik di gerai selalu sinkron",
      "log audit lengkap tersimpan di DynamoDB untuk akuntabilitas",
    ],
    meta: "sap s/4hana sync",
    telemetry: {
      event: "SAP_PURCHASEREQ_CREATED",
      target: "sap_s4hana_odata_api",
      latency: "310ms",
      payload: {
        sap_endpoint: "/API_PURCHASEREQ_PROCESS_SRV",
        purchase_requisition_no: "PR-10048291",
        doc_type: "NB_STANDARD",
        item_qty: 45,
        status: "201_CREATED_APPROVED",
      },
    },
  },
];

export const WorkflowSection: FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const current = steps[activeStep];
  const StepIcon = current.icon;

  return (
    <section id="alur-kerja" className="py-20 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <Scroll3DCard rotateDeg={8} scaleFrom={0.95}>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-12 space-y-10">
            {/* Header */}
            <div className="max-w-[680px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text-muted)] mb-3">
                <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>alur eksekusi otonom terpandu</span>
              </div>
              <h2 className="text-[20px] md:text-[24px] font-bold leading-[1.3] text-[var(--text)]">
                5 langkah, dari deteksi hingga Purchase Requisition
              </h2>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--text-muted)]">
                tidak ada black-box. setiap detik pergerakan data dari rak minimarket ke SAP tercatat dan dapat diaudit secara transparan.
              </p>
            </div>

            {/* Interactive Pipeline Conduit Tabs */}
            <div className="relative">
              {/* Conduit connector line behind steps */}
              <div className="hidden md:block absolute top-1/2 left-8 right-8 h-[2px] bg-[var(--border)] -translate-y-1/2 z-0" />
              <div
                className="hidden md:block absolute top-1/2 left-8 h-[2px] bg-[var(--accent)] -translate-y-1/2 z-0 transition-all duration-300"
                style={{ width: `${(activeStep / (steps.length - 1)) * 92}%` }}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 relative z-10">
                {steps.map((s, idx) => {
                  const Icon = s.icon;
                  const isActive = activeStep === idx;
                  const isPassed = activeStep > idx;

                  return (
                    <button
                      key={s.number}
                      onClick={() => setActiveStep(idx)}
                      className={`p-3.5 rounded-[var(--radius-md)] border text-left cursor-pointer transition-all duration-200 ${
                        isActive
                          ? "bg-[var(--surface-active)] border-[var(--accent)] shadow-sm ring-1 ring-[var(--accent)]/30"
                          : isPassed
                          ? "bg-[var(--surface-hover)] border-[var(--border)] text-[var(--text-muted)]"
                          : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[12px] font-bold ${
                            isActive ? "text-[var(--accent)]" : "text-[var(--text-faint)]"
                          }`}
                        >
                          {s.number}
                        </span>
                        <div
                          className={`h-7 w-7 rounded-[var(--radius-sm)] flex items-center justify-center border ${
                            isActive
                              ? "bg-[var(--accent)] text-[#161615] border-[var(--accent)]"
                              : "bg-[var(--bg)] text-[var(--text-faint)] border-[var(--border)]"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      <div className="text-[13px] font-bold text-[var(--text)] truncate">
                        {s.title}
                      </div>
                      <div className="text-[11px] text-[var(--text-faint)] mt-0.5 truncate">
                        {s.meta}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Detail Content & Live Telemetry Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Detail */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-[var(--radius-sm)] bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                        <StepIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="text-[12px] text-[var(--text-faint)]">
                          tahap {current.number} / 05 · {current.meta}
                        </span>
                        <h3 className="text-[16px] font-bold text-[var(--text)]">
                          {current.title}
                        </h3>
                      </div>
                    </div>

                    <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-hover)] border border-[var(--border)] text-[12px] text-[var(--text-muted)]">
                      <Clock className="h-3 w-3 text-[var(--accent)]" />
                      <span>{current.telemetry.latency}</span>
                    </span>
                  </div>

                  <p className="text-[14px] leading-[1.7] text-[var(--text-muted)]">
                    {current.description}
                  </p>

                  <div className="pt-2">
                    <p className="text-[12px] text-[var(--text-faint)] mb-2 uppercase tracking-wider font-semibold">
                      poin operasional penting:
                    </p>
                    <ul className="space-y-2.5">
                      {current.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2.5 text-[13px] text-[var(--text)]"
                        >
                          <span className="text-[var(--accent)] font-bold shrink-0">[*]</span>
                          <span className="leading-[1.6] text-[var(--text-muted)]">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                    <button
                      disabled={activeStep === 0}
                      onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                      className="px-4 py-2 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--text)] text-[13px] disabled:opacity-30 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors"
                    >
                      ← tahap sebelumnya
                    </button>
                    <button
                      disabled={activeStep === steps.length - 1}
                      onClick={() => setActiveStep((p) => Math.min(steps.length - 1, p + 1))}
                      className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--btn-light-bg)] text-[var(--btn-light-text)] text-[13px] font-semibold disabled:opacity-30 cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-1.5"
                    >
                      <span>lanjut ke {steps[Math.min(steps.length - 1, activeStep + 1)].title}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Live Telemetry Inspector Terminal */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] shadow-md">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 mb-3">
                    <div className="flex items-center gap-2 text-[12px] text-[var(--text)]">
                      <Terminal className="h-3.5 w-3.5 text-[var(--accent)]" />
                      <span className="font-bold">event telemetry payload</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-faint)]">
                      <Activity className="h-3 w-3 text-emerald-400 animate-pulse" />
                      <span>live stream</span>
                    </div>
                  </div>

                  {/* Meta strip */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                    <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)]">
                      <span className="text-[var(--text-faint)] block">event_name:</span>
                      <span className="text-[var(--accent)] font-semibold truncate block">
                        {current.telemetry.event}
                      </span>
                    </div>
                    <div className="p-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)]">
                      <span className="text-[var(--text-faint)] block">target_service:</span>
                      <span className="text-[var(--text)] font-semibold truncate block">
                        {current.telemetry.target}
                      </span>
                    </div>
                  </div>

                  {/* Code Payload Window */}
                  <div className="bg-[#121211] p-3.5 rounded-[var(--radius-md)] border border-[var(--border)] text-[12px] font-mono overflow-x-auto leading-[1.6]">
                    <div className="text-[var(--text-faint)] select-none pb-1 border-b border-[#252523] mb-2 text-[10px] flex justify-between">
                      <span>json:event_bridge_packet</span>
                      <span className="text-emerald-400">status: OK (200)</span>
                    </div>
                    <pre className="text-slate-300">
                      <code>{JSON.stringify(current.telemetry.payload, null, 2)}</code>
                    </pre>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--text-faint)]">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-[var(--accent)]" />
                      <span>latency: {current.telemetry.latency}</span>
                    </span>
                    <span>iso 27001 encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scroll3DCard>
      </div>
    </section>
  );
};

