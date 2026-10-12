import { useState, useMemo, type FC } from "react";
import { Scroll3DCard } from "@/components/ui/scroll-3d-card";
import { Calculator, TrendingUp, Sparkles, ArrowRight, ShieldAlert, Award } from "lucide-react";

export const RoiMetrics: FC<{ onOpenDemo: () => void }> = ({ onOpenDemo }) => {
  const [storeCount, setStoreCount] = useState<number>(100);
  const [dailySalesPerStore, setDailySalesPerStore] = useState<number>(20);

  const {
    monthlyRevenue,
    savedLostSales,
    savedSpoilage,
    savedManagerHours,
    workingCapitalFreed,
    totalBenefit,
  } = useMemo(() => {
    const monthlyRev = storeCount * dailySalesPerStore * 30; // dalam juta
    const currentStockoutLoss = monthlyRev * 0.04;
    const stockoutSaved = currentStockoutLoss * 0.38;
    const spoilageSaved = monthlyRev * 0.015 * 0.5;
    const hoursSaved = storeCount * 1.5 * 30;
    const capitalFreed = monthlyRev * 0.05 * 0.25;
    const total = stockoutSaved + spoilageSaved + capitalFreed;

    return {
      monthlyRevenue: monthlyRev,
      savedLostSales: stockoutSaved,
      savedSpoilage: spoilageSaved,
      savedManagerHours: hoursSaved,
      workingCapitalFreed: capitalFreed,
      totalBenefit: total,
    };
  }, [storeCount, dailySalesPerStore]);

  const presets = [
    { label: "pilot cluster", stores: 25, sales: 18 },
    { label: "regional ritel", stores: 100, sales: 22 },
    { label: "nasional scale", stores: 350, sales: 28 },
  ];

  return (
    <section id="roi" className="py-20 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <Scroll3DCard rotateDeg={8} scaleFrom={0.95}>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-12 space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-[640px]">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text-muted)] mb-3">
                  <Calculator className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>simulasi dampak finansial</span>
                </div>
                <h2 className="text-[20px] md:text-[24px] font-bold leading-[1.3] text-[var(--text)]">
                  kalkulator estimasi nilai tambah bisnis
                </h2>
                <p className="mt-2 text-[14px] leading-[1.7] text-[var(--text-muted)]">
                  sesuaikan jumlah gerai dan estimasi sales harian toko minimarketmu untuk melihat potensi pemulihan omzet dan efisiensi modal kerja.
                </p>
              </div>

              {/* Preset buttons */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="text-[12px] text-[var(--text-faint)]">preset:</span>
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setStoreCount(p.stores);
                      setDailySalesPerStore(p.sales);
                    }}
                    className={`px-2.5 py-1 rounded-[var(--radius-sm)] border text-[11px] font-medium cursor-pointer transition-colors ${
                      storeCount === p.stores && dailySalesPerStore === p.sales
                        ? "bg-[var(--accent)] text-[#161615] border-[var(--accent)]"
                        : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Interactive Range Sliders */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--text-muted)]">jumlah gerai aktif</span>
                    <span className="text-[15px] font-bold text-[var(--text)] font-mono">
                      {storeCount} toko
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={5}
                      value={storeCount}
                      onChange={(e) => setStoreCount(Number(e.target.value))}
                      className="w-full accent-[var(--accent)] cursor-pointer h-2 bg-[var(--surface-hover)] rounded-lg appearance-none"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[var(--text-faint)] font-mono">
                    <span>10 toko (pilot)</span>
                    <span>250 toko</span>
                    <span>500 toko</span>
                  </div>
                </div>

                <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[var(--text-muted)]">sales rata-rata / toko / hari</span>
                    <span className="text-[15px] font-bold text-[var(--text)] font-mono">
                      Rp {dailySalesPerStore} juta
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min={5}
                      max={50}
                      step={1}
                      value={dailySalesPerStore}
                      onChange={(e) => setDailySalesPerStore(Number(e.target.value))}
                      className="w-full accent-[var(--accent)] cursor-pointer h-2 bg-[var(--surface-hover)] rounded-lg appearance-none"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[var(--text-faint)] font-mono">
                    <span>Rp 5 jt</span>
                    <span>Rp 25 jt</span>
                    <span>Rp 50 jt</span>
                  </div>
                </div>

                <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between text-[13px]">
                  <span className="text-[var(--text-muted)]">omzet jaringan bulanan:</span>
                  <strong className="text-[var(--text)] font-mono">
                    Rp {(monthlyRevenue / 1000).toFixed(1)} Milyar
                  </strong>
                </div>

                {/* Liquid visual comparison bar */}
                <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] space-y-2.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[var(--text-faint)]">efisiensi proteksi omzet:</span>
                    <span className="text-[var(--accent)] font-bold font-mono">38% recovery</span>
                  </div>
                  <div className="h-3 w-full bg-[var(--surface)] rounded-full overflow-hidden flex p-0.5 border border-[var(--border)]">
                    <div
                      className="h-full bg-[var(--accent)] rounded-full transition-all duration-300 relative overflow-hidden"
                      style={{ width: `${Math.min(100, Math.max(20, (totalBenefit / (monthlyRevenue * 0.08)) * 100))}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-[var(--text-faint)]">
                    <span className="flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3 text-rose-400" />
                      <span>tanpa ai: lost sales tinggi</span>
                    </span>
                    <span className="flex items-center gap-1 text-[var(--accent)]">
                      <Award className="h-3 w-3" />
                      <span>dengan ai: optimal</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Key Financial Impact Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-[var(--text-faint)]">omzet terselamatkan</p>
                    <TrendingUp className="h-4 w-4 text-[var(--accent)]" />
                  </div>
                  <p className="text-[22px] font-bold text-[var(--text)] font-mono">
                    Rp {Math.round(savedLostSales).toLocaleString("id-ID")} jt
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] leading-[1.6]">
                    dari rak yang tidak lagi kosong saat rush hour pembeli.
                  </p>
                </div>

                <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-[var(--text-faint)]">hemat expired & basi</p>
                    <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                  </div>
                  <p className="text-[22px] font-bold text-[var(--text)] font-mono">
                    Rp {Math.round(savedSpoilage).toLocaleString("id-ID")} jt
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] leading-[1.6]">
                    pengurangan retur produk susu, roti, dan makanan segar.
                  </p>
                </div>

                <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-[var(--text-faint)]">waktu toko dihemat</p>
                    <span className="text-[11px] text-[var(--text-faint)]">~1.5 jam / hari</span>
                  </div>
                  <p className="text-[22px] font-bold text-[var(--text)] font-mono">
                    {Math.round(savedManagerHours).toLocaleString("id-ID")} jam
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] leading-[1.6]">
                    dari entri manual di kasir dialihkan melayani customer toko.
                  </p>
                </div>

                <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/40 transition-colors space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] text-[var(--text-faint)]">modal kerja cair (working capital)</p>
                    <span className="text-[11px] text-emerald-400">cashflow</span>
                  </div>
                  <p className="text-[22px] font-bold text-[var(--text)] font-mono">
                    Rp {Math.round(workingCapitalFreed).toLocaleString("id-ID")} jt
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] leading-[1.6]">
                    kas tidak tertimbun dalam buffer stock mati di gudang.
                  </p>
                </div>

                {/* Grand Total Action Banner */}
                <div className="sm:col-span-2 p-6 rounded-[var(--radius-lg)] bg-[var(--surface-hover)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="space-y-1">
                    <span className="text-[12px] text-[var(--accent)] font-semibold uppercase tracking-wider block">
                      estimasi total nilai tambah / bulan:
                    </span>
                    <div className="text-[26px] font-bold text-[var(--text)] font-mono">
                      ~ Rp {Math.round(totalBenefit).toLocaleString("id-ID")} juta{" "}
                      <span className="text-[13px] font-normal text-[var(--text-muted)]">/ bulan</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-faint)]">
                      berdasarkan parameter konservatif ritel minimarket Indonesia.
                    </p>
                  </div>

                  <button
                    onClick={onOpenDemo}
                    className="px-5 py-3 bg-[var(--btn-light-bg)] hover:bg-white text-[var(--btn-light-text)] font-bold text-[13px] rounded-[var(--radius-md)] cursor-pointer whitespace-nowrap transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <span>mulai pilot 30 hari</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Scroll3DCard>
      </div>
    </section>
  );
};

