import { useState, type FC } from "react";
import { Scroll3DCard } from "@/components/ui/scroll-3d-card";
import {
  Cpu,
  Layers,
  Shield,
  Server,
  Smartphone,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";

interface ArchNode {
  id: string;
  name: string;
  layer: string;
  subtitle: string;
  icon: typeof Cpu;
  protocol: string;
  latencyAvg: string;
  benefit: string;
  guarantee: string;
  securityBadges: string[];
}

const archNodes: ArchNode[] = [
  {
    id: "ai",
    name: "reasoning engine",
    layer: "Cognitive Intelligence Layer",
    subtitle: "AWS Bedrock · Claude 3.5 Sonnet",
    icon: Cpu,
    protocol: "HTTPS / SigV4 Signed Payload",
    latencyAvg: "620ms (P95)",
    benefit:
      "membaca konteks stok, cuaca lokal BMKG, katalog promo aktif, dan jadwal truk DC. Menghasilkan rekomendasi kuota presisi + penjelasan natural bahasa Indonesia.",
    guarantee: "data transaksi toko terisolasi di VPC privat. tidak pernah dipakai untuk melatih model publik.",
    securityBadges: ["Zero Data Retention", "SOC 2 Type II", "VPC Endpoint"],
  },
  {
    id: "sap",
    name: "sap s/4hana",
    layer: "Enterprise System of Record",
    subtitle: "OData API · SAP BAPI Bridge",
    icon: Server,
    protocol: "OData v4 / RFC / OAuth2.0",
    latencyAvg: "280ms",
    benefit:
      "menarik master data SKU, lead time distributor, dan menerbitkan Purchase Requisition resmi otomatis begitu kepala toko menyetujui di Telegram.",
    guarantee: "koneksi mTLS terenkripsi end-to-end. Kredensial ERP disimpan di AWS Secrets Manager, tidak ada di kode frontend.",
    securityBadges: ["SAP Certified API", "Audit Log 7 Tahun", "Role-based ACL"],
  },
  {
    id: "telegram",
    name: "telegram bot hitl",
    layer: "Human-In-The-Loop Interface",
    subtitle: "Bot API · Webhook Gateway",
    icon: Smartphone,
    protocol: "TLS 1.3 / HMAC Token Validation",
    latencyAvg: "92ms",
    benefit:
      "kartu rekomendasi masuk langsung ke smartphone kepala toko. Cukup setujui 1-klik, ubah jumlah rak fisik, atau tolak dengan alasan tanpa perlu buka laptop.",
    guarantee: "hanya akun Telegram resmi terverifikasi yang dapat mengonfirmasi. Dilengkapi token anti-double-click agar tidak terjadi PR ganda.",
    securityBadges: ["Tokenized Approval", "Auto-timeout 4 Jam", "Zero-install"],
  },
  {
    id: "scale",
    name: "event pipeline & audit",
    layer: "Event-Driven Orchestration",
    subtitle: "Amazon EventBridge + DynamoDB",
    icon: Layers,
    protocol: "EventBridge Bus / DynamoDB Streams",
    latencyAvg: "45ms",
    benefit:
      "menjadwalkan batch evaluasi pagi secara otomatis ke ratusan gerai. Setiap request_id merekam snapshot input, alasan AI, respon toko, dan nomor PR SAP.",
    guarantee: "arsitektur stateless serverless yang sanggup scaling dari 5 toko pilot hingga 5.000 gerai nasional tanpa mengubah satu baris pun kode inti.",
    securityBadges: ["Stateless Scale", "Point-in-Time Recovery", "Immutable Ledger"],
  },
];

export const ArchitectureSection: FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchNode>(archNodes[0]);
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  const handleTestPing = () => {
    setIsPinging(true);
    setPingSuccess(false);
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(true);
    }, 450);
  };

  const SelectedIcon = selectedNode.icon;

  return (
    <section id="arsitektur" className="py-20 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <Scroll3DCard rotateDeg={8} scaleFrom={0.95}>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-12 space-y-10">
            {/* Header */}
            <div className="max-w-[640px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text-muted)] mb-3">
                <Shield className="h-3.5 w-3.5 text-[var(--accent)]" />
                <span>infrastruktur enterprise aman</span>
              </div>
              <h2 className="text-[20px] md:text-[24px] font-bold leading-[1.3] text-[var(--text)]">
                arsitektur empat pilar tanpa black-box
              </h2>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--text-muted)]">
                setiap komponen terhubung dengan protokol standar industri. pilih pilar untuk melihat spesifikasi teknis dan jaminan keamanannya.
              </p>
            </div>

            {/* Visual Topology Conduit Flow Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {archNodes.map((node) => {
                const Icon = node.icon;
                const isSelected = selectedNode.id === node.id;
                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      setSelectedNode(node);
                      setPingSuccess(false);
                    }}
                    className={`p-4 rounded-[var(--radius-md)] border text-left cursor-pointer transition-all duration-200 relative ${
                      isSelected
                        ? "bg-[var(--surface-active)] border-[var(--accent)] ring-1 ring-[var(--accent)]/40 shadow-sm"
                        : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`h-8 w-8 rounded-[var(--radius-sm)] flex items-center justify-center border ${
                          isSelected
                            ? "bg-[var(--accent)] text-[#161615] border-[var(--accent)]"
                            : "bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={`text-[11px] font-mono ${
                          isSelected ? "text-[var(--accent)] font-bold" : "text-[var(--text-faint)]"
                        }`}
                      >
                        {node.latencyAvg}
                      </span>
                    </div>

                    <div className="text-[13px] font-bold text-[var(--text)]">{node.name}</div>
                    <div className="text-[11px] text-[var(--text-faint)] mt-0.5 truncate">
                      {node.subtitle}
                    </div>

                    {isSelected && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-8 bg-[var(--accent)] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Deep Node Details Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Spec Sheet */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-[var(--radius-sm)] bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)]">
                        <SelectedIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] text-[var(--text-faint)] uppercase tracking-wider block">
                          {selectedNode.layer}
                        </span>
                        <h3 className="text-[18px] font-bold text-[var(--text)]">
                          {selectedNode.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTestPing}
                        disabled={isPinging}
                        className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[12px] text-[var(--text)] font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Zap className={`h-3.5 w-3.5 text-[var(--accent)] ${isPinging ? "animate-spin" : ""}`} />
                        <span>{isPinging ? "pinging..." : "uji latensi"}</span>
                      </button>
                    </div>
                  </div>

                  {pingSuccess && (
                    <div className="p-2.5 rounded-[var(--radius-sm)] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[12px] flex items-center justify-between font-mono animate-fade-in">
                      <span>[ok] handshake respon: {selectedNode.latencyAvg}</span>
                      <span>status: 200 SUCCESS</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-[12px] text-[var(--text-faint)] uppercase tracking-wider font-semibold">
                      fungsi operasional:
                    </h4>
                    <p className="text-[14px] text-[var(--text-muted)] leading-[1.7]">
                      {selectedNode.benefit}
                    </p>
                  </div>

                  <div className="p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-2">
                    <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--text)]">
                      <Lock className="h-3.5 w-3.5 text-[var(--accent)]" />
                      <span>garansi keamanan & isolasi data:</span>
                    </div>
                    <p className="text-[13px] text-[var(--text-muted)] leading-[1.6]">
                      {selectedNode.guarantee}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedNode.securityBadges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-hover)] border border-[var(--border)] text-[11px] text-[var(--text-muted)] font-mono"
                      >
                        <CheckCircle2 className="h-3 w-3 text-[var(--accent)]" />
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Protocol Spec & Deployment Checklist */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] space-y-4">
                  <div className="text-[12px] font-bold text-[var(--text)] border-b border-[var(--border)] pb-2 flex items-center justify-between">
                    <span>spesifikasi protokol sistem</span>
                    <span className="text-[11px] text-[var(--accent)] font-mono">live config</span>
                  </div>

                  <div className="space-y-2.5 text-[12px] font-mono">
                    <div className="flex justify-between p-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)]">
                      <span className="text-[var(--text-faint)]">transport:</span>
                      <span className="text-[var(--text)]">{selectedNode.protocol}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)]">
                      <span className="text-[var(--text-faint)]">avg_latency:</span>
                      <span className="text-[var(--accent)]">{selectedNode.latencyAvg}</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)]">
                      <span className="text-[var(--text-faint)]">encryption:</span>
                      <span className="text-emerald-400">TLS 1.3 / AES-256</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)]">
                      <span className="text-[var(--text-faint)]">audit_trail:</span>
                      <span className="text-[var(--text)]">immutable_dynamo_db</span>
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--surface)] rounded-[var(--radius-sm)] border border-[var(--border)] text-[12px] text-[var(--text-muted)] leading-[1.6]">
                    <span className="text-[var(--text)] font-semibold block mb-0.5">
                      kesiapan integrasi enterprise:
                    </span>
                    arsitektur mendukung sandbox SAP S/4HANA & ECC 6.0 untuk uji coba 14 hari tanpa mengubah konfigurasi produksi yang ada.
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

