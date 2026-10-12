import type { FC } from "react";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import {
  BrainCircuit,
  MessageSquare,
  Database,
  FileCheck2,
  TrendingDown,
  CloudSun,
  Calendar,
  Sparkles,
  CheckCircle,
  Truck,
  Zap,
  Droplets
} from "lucide-react";

export const BentoFeatures: FC = () => {
  return (
    <section id="fitur" className="py-24 relative overflow-hidden bg-[var(--bg)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] text-xs font-mono font-medium mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Katalog Solusi Pintar Minimarket</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text)] tracking-tight leading-tight">
            Semua yang Dibutuhkan untuk <br />
            <span className="text-[var(--accent)]">
              Operasional Ritel yang Lebih Efisien
            </span>
          </h2>
          <p className="mt-4 text-[var(--text-muted)] text-sm sm:text-base">
            Gantikan tebakan manual dengan kecerdasan buatan kontekstual. Dirancang khusus untuk mempermudah hidup Kepala Toko dan tim Supply Chain.
          </p>
        </div>

        {/* 3D Bento Grid layout */}
        <BentoGrid>
          {/* Card 1: Context-Aware Reasoning (colSpan 2) */}
          <BentoCard
            title="Prediksi Kebutuhan Berbasis Konteks Riil"
            description="Membaca cuaca lokal, promo akhir pekan, dan kalender libur agar rak tidak kosong mendadak."
            icon={<BrainCircuit className="h-5 w-5 text-[var(--accent)]" />}
            badge="Kontekstual"
            colSpan={2}
          >
            <div className="h-44 p-4 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)]">
                  <CloudSun className="h-5 w-5 text-[var(--accent)] mx-auto mb-1" />
                  <div className="text-xs font-bold text-[var(--text)]">Faktor Cuaca</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Suhu & Musim Hujan</div>
                </div>
                <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)]">
                  <Calendar className="h-5 w-5 text-[var(--link)] mx-auto mb-1" />
                  <div className="text-xs font-bold text-[var(--text)]">Event & Promo</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Lonjakan Promo JSM</div>
                </div>
                <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)]">
                  <Truck className="h-5 w-5 text-[var(--accent)] mx-auto mb-1" />
                  <div className="text-xs font-bold text-[var(--text)]">Jadwal Kirim DC</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Tiba Tepat Waktu</div>
                </div>
              </div>

              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text)] flex items-center justify-between font-mono">
                <span className="flex items-center gap-1.5">
                  <Droplets className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Aliran stok menyesuaikan lonjakan pembeli.</span>
                </span>
                <span className="text-[var(--accent)] font-bold">Akurasi 94%+</span>
              </div>
            </div>
          </BentoCard>

          {/* Card 2: Telegram Human-in-the-Loop */}
          <BentoCard
            title="Approval 1-Detik di Telegram"
            description="Kepala Toko tidak perlu membuka komputer atau aplikasi berat saat sibuk."
            icon={<MessageSquare className="h-5 w-5 text-[var(--link)]" />}
            badge="0 Hambatan"
          >
            <div className="h-44 p-4 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] flex flex-col justify-between">
              <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-xs space-y-1">
                <div className="text-[var(--text)] font-bold">📲 Notifikasi Bot Telegram</div>
                <div className="text-[var(--text-muted)] text-[11px]">Cukup tekan "Setujui", "Ubah", atau "Tolak".</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="py-2.5 px-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-[#161615] text-center text-xs font-bold shadow-sm">
                  ✅ 1-Klik Setuju
                </div>
                <div className="py-2.5 px-3 rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--text)] text-center text-xs font-medium border border-[var(--border)]">
                  ✏️ Edit Jumlah
                </div>
              </div>
            </div>
          </BentoCard>

          {/* Card 3: Direct SAP Sync */}
          <BentoCard
            title="Terkoneksi Otomatis ke SAP"
            description="Pesanan pembelian langsung terbit di sistem ERP tanpa perlu input manual dua kali."
            icon={<Database className="h-5 w-5 text-[var(--accent)]" />}
            badge="Mulus"
          >
            <div className="h-44 p-4 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] flex flex-col justify-between">
              <div className="space-y-1.5 text-xs">
                <div className="text-[var(--text)] font-bold flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-[var(--accent)]" />
                  <span>Purchase Requisition Otomatis</span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                  Tidak ada lagi selisih data stok fisik dan pencatatan sistem logistik pusat.
                </p>
              </div>

              <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--accent)] font-semibold flex items-center gap-2 font-mono">
                <Zap className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                <span>Zero Double Order • Aman & Cepat</span>
              </div>
            </div>
          </BentoCard>

          {/* Card 4: 100% Audit Trail & Explainability (colSpan 2) */}
          <BentoCard
            title="Keputusan Transparan & Mudah Diaudit"
            description="Setiap angka order disertai alasan jelas dalam bahasa sehari-hari yang mudah dipahami."
            icon={<FileCheck2 className="h-5 w-5 text-[var(--link)]" />}
            badge="Transparan"
            colSpan={2}
          >
            <div className="h-44 p-4 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] flex flex-col justify-between">
              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] space-y-1 text-xs">
                <div className="text-[var(--text-faint)] text-[11px] font-mono">Contoh Alasan yang Diberikan AI:</div>
                <div className="text-[var(--text)] text-[11px] leading-relaxed">
                  "Susu 1L tersisa 8 pcs. Rekomendasi order 45 pcs karena besok akhir pekan + promo diskon 15%, diproyeksikan habis dalam 24 jam sebelum truk berikutnya tiba."
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                <span>Riwayat persetujuan setiap cabang tercatat rapi.</span>
                <span className="text-[var(--accent)] font-bold">100% Dapat Diaudit</span>
              </div>
            </div>
          </BentoCard>

          {/* Card 5: Spoilage Reduction */}
          <BentoCard
            title="Cegah Barang Basi & Kadaluarsa"
            description="Pangkas kerugian produk susu, roti, dan makanan segar hingga separuh."
            icon={<TrendingDown className="h-5 w-5 text-rose-400" />}
            badge="-50% Spoilage"
          >
            <div className="h-44 p-4 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-muted)]">Produk Segar & Roti</span>
                  <span className="text-[var(--accent)] font-bold">-50% Biaya Buang</span>
                </div>
                <div className="w-full bg-[var(--surface)] h-2.5 rounded-full overflow-hidden border border-[var(--border)]">
                  <div className="bg-[var(--accent)] h-full w-[85%] rounded-full" />
                </div>
              </div>

              <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[11px] text-[var(--text-muted)]">
                🛡️ Kuota tidak berlebihan saat traffic toko diperkirakan melambat.
              </div>
            </div>
          </BentoCard>
        </BentoGrid>
      </div>
    </section>
  );
};
