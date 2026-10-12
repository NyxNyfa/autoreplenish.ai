import { useState, type FC } from "react";
import { Scroll3DCard } from "@/components/ui/scroll-3d-card";
import { Check, X, Minus, Sparkles, Scale } from "lucide-react";

interface MatrixRow {
  aspect: string;
  category: "kecepatan" | "akurasi" | "efisiensi";
  conventional: string;
  classicMl: string;
  autoReplenish: string;
  impactTag: string;
}

const matrixData: MatrixRow[] = [
  {
    aspect: "baca cuaca & kampanye promo",
    category: "akurasi",
    conventional: "pola minggu lalu disalin mentah-mentah. kaget saat rak ludes diserbu pembeli.",
    classicMl: "perlu data pipeline berbulan-bulan dan sulit tanggap cuaca ekstrem lokal harian.",
    autoReplenish: "prakiraan cuaca mikro & promo dibaca harian sebelum toko buka.",
    impactTag: "akurasi 98%",
  },
  {
    aspect: "beban kerja kepala toko",
    category: "kecepatan",
    conventional: "input manual di komputer kasir berjam-jam saat pergantian shift.",
    classicMl: "dashboard analitik kompleks di web browser yang jarang sempat dibuka toko.",
    autoReplenish: "1-klik konfirmasi dari Telegram mobile yang sudah aktif di genggaman.",
    impactTag: "< 10 detik",
  },
  {
    aspect: "sinkronisasi ke SAP ERP",
    category: "efisiensi",
    conventional: "rekap nota & ketik ulang dokumen ke SAP di malam hari (rawan human error).",
    classicMl: "terisolasi dari transaksi live, butuh ekspor-impor file CSV manual.",
    autoReplenish: "otomatis terbit jadi Purchase Requisition (BAPI/OData) begitu disetujui.",
    impactTag: "zero re-entry",
  },
  {
    aspect: "penjelasan angka (explainability)",
    category: "akurasi",
    conventional: "hanya angka firasat kepala toko tanpa kalkulasi ilmiah terdokumentasi.",
    classicMl: "skor prediksi probabilitas 'black-box' tanpa kalimat penjelasan yang masuk akal.",
    autoReplenish: "alasan bahasa Indonesia natural per SKU menjelaskan faktor pemicu kuota.",
    impactTag: "full audit trail",
  },
  {
    aspect: "penyesuaian ritme truk DC",
    category: "kecepatan",
    conventional: "sering terlambat order, truk berangkat sebelum kebutuhan toko terangkut.",
    classicMl: "batch statis mingguan yang kaku terhadap jadwal dinamis logistik armada.",
    autoReplenish: "kebutuhan dihitung presisi sampai jadwal kedatangan truk DC berikutnya.",
    impactTag: "on-time delivery",
  },
  {
    aspect: "penanganan barang mudah basi (perishable)",
    category: "efisiensi",
    conventional: "sering over-order susu & roti segar yang berujung retur basi terbuang.",
    classicMl: "memperlakukan susu sama seperti sabun cuci, mengabaikan shelf-life.",
    autoReplenish: "safety-stock dinamis konservatif khusus produk kedaluwarsa pendek.",
    impactTag: "hemat 40% retur",
  },
];

export const ComparisonMatrix: FC = () => {
  const [filter, setFilter] = useState<"semua" | "kecepatan" | "akurasi" | "efisiensi">("semua");

  const filteredData = matrixData.filter(
    (item) => filter === "semua" || item.category === filter
  );

  return (
    <section className="py-20 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <Scroll3DCard rotateDeg={8} scaleFrom={0.95}>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-12 space-y-8">
            {/* Header & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-[640px]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text-muted)] mb-3">
                  <Scale className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>evaluasi komparasi teknis</span>
                </div>
                <h2 className="text-[20px] md:text-[24px] font-bold leading-[1.3] text-[var(--text)]">
                  cara manual vs software klasik vs autoreplenish.ai
                </h2>
                <p className="mt-2 text-[14px] leading-[1.7] text-[var(--text-muted)]">
                  bukan sekadar perbedaan teknologi, melainkan siapa yang mengerjakan proses repetitif dan seberapa cepat keputusan diambil.
                </p>
              </div>

              {/* Filter segmented buttons */}
              <div className="inline-flex p-1 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] self-start md:self-auto">
                {(
                  [
                    { id: "semua", label: "semua aspek" },
                    { id: "kecepatan", label: "kecepatan toko" },
                    { id: "akurasi", label: "akurasi reasoning" },
                    { id: "efisiensi", label: "efisiensi sap" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-[12px] font-medium transition-colors cursor-pointer ${
                      filter === tab.id
                        ? "bg-[var(--surface-active)] text-[var(--text)]"
                        : "text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comparison Grid Table */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[12px] text-[var(--text-faint)] bg-[var(--surface)]">
                      <th className="py-4 px-6 font-semibold w-1/4">aspek operasional</th>
                      <th className="py-4 px-6 font-normal w-1/4">rumus manual kasir</th>
                      <th className="py-4 px-6 font-normal w-1/4">software forecast jadul</th>
                      <th className="py-4 px-6 font-bold text-[var(--accent)] w-1/4 bg-[var(--surface-hover)]/40 border-l border-r border-[var(--border)]">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                          <span>autoreplenish.ai</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[13px] leading-[1.6]">
                    {filteredData.map((row) => (
                      <tr
                        key={row.aspect}
                        className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)]/40 transition-colors"
                      >
                        <td className="py-4 px-6 font-bold text-[var(--text)] align-top">
                          <span className="block">{row.aspect}</span>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[11px] text-[var(--text-faint)]">
                            {row.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-[var(--text-muted)] align-top">
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                            <span>{row.conventional}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[var(--text-muted)] align-top">
                          <div className="flex items-start gap-2">
                            <Minus className="h-4 w-4 text-amber-400/80 shrink-0 mt-0.5" />
                            <span>{row.classicMl}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[var(--text)] align-top bg-[var(--surface-hover)]/20 border-l border-r border-[var(--border)]">
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                            <div>
                              <span>{row.autoReplenish}</span>
                              <span className="block mt-1 text-[11px] text-[var(--accent)] font-semibold">
                                [{row.impactTag}]
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Summary Strip */}
              <div className="p-4 bg-[var(--surface)] border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[var(--text-muted)]">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>hasil rata-rata: hemat 1.5 jam / toko / hari & potong 38% kerugian out-of-stock</span>
                </span>
                <span className="text-[var(--text-faint)]">siap diuji coba di 10–25 gerai minimarket</span>
              </div>
            </div>
          </div>
        </Scroll3DCard>
      </div>
    </section>
  );
};

