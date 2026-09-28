import { useState, useMemo, type FC } from "react";

export const RoiMetrics: FC<{ onOpenDemo: () => void }> = ({ onOpenDemo }) => {
  const [storeCount, setStoreCount] = useState<number>(100);
  const [dailySalesPerStore, setDailySalesPerStore] = useState<number>(20);

  const {
    monthlyRevenue,
    savedLostSales,
    savedSpoilage,
    savedManagerHours,
    workingCapitalFreed,
  } = useMemo(() => {
    const monthlyRev = storeCount * dailySalesPerStore * 30;
    const currentStockoutLoss = monthlyRev * 0.04;
    const stockoutSaved = currentStockoutLoss * 0.38;
    const spoilageSaved = monthlyRev * 0.015 * 0.5;
    const hoursSaved = storeCount * 1.5 * 30;
    const capitalFreed = monthlyRev * 0.05 * 0.25;

    return {
      monthlyRevenue: monthlyRev,
      savedLostSales: stockoutSaved,
      savedSpoilage: spoilageSaved,
      savedManagerHours: hoursSaved,
      workingCapitalFreed: capitalFreed,
    };
  }, [storeCount, dailySalesPerStore]);

  const results = [
    {
      label: "omzet terselamatkan / bulan",
      value: `Rp ${Math.round(savedLostSales).toLocaleString("id-ID")} jt`,
      note: "dari rak yang tidak kosong.",
    },
    {
      label: "hemat basi + expired / bulan",
      value: `Rp ${Math.round(savedSpoilage).toLocaleString("id-ID")} jt`,
      note: "susu, roti, buah.",
    },
    {
      label: "waktu toko dihemat / bulan",
      value: `${Math.round(savedManagerHours).toLocaleString("id-ID")} jam`,
      note: "dari pencatatan manual ke layanan pelanggan.",
    },
    {
      label: "modal kerja bebas / bulan",
      value: `Rp ${Math.round(workingCapitalFreed).toLocaleString("id-ID")} jt`,
      note: "kas tidak mengendap di gudang.",
    },
  ];

  return (
    <section id="roi" className="py-16 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-[640px] mb-10">
          <p className="text-[12px] text-[var(--text-faint)] mb-2">kalkulator</p>
          <h2 className="text-[16px] font-bold leading-[1.4] text-[var(--text)]">
            hitung angka tokomu sendiri
          </h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)]">
            geser jumlah cabang dan rata-rata sales. ini estimasi kasar, bukan
            janji. angka detail dibahas saat pilot.
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--text-muted)]">jumlah gerai</span>
                <span className="text-[14px] font-bold text-[var(--text)]">
                  {storeCount} toko
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={storeCount}
                onChange={(e) => setStoreCount(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[12px] text-[var(--text-faint)]">
                <span>10</span>
                <span>250</span>
                <span>500</span>
              </div>
            </div>

            <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--text-muted)]">sales / toko / hari</span>
                <span className="text-[14px] font-bold text-[var(--text)]">
                  Rp {dailySalesPerStore} jt
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={1}
                value={dailySalesPerStore}
                onChange={(e) => setDailySalesPerStore(Number(e.target.value))}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-[12px] text-[var(--text-faint)]">
                <span>5 jt</span>
                <span>25 jt</span>
                <span>50 jt</span>
              </div>
            </div>

            <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] text-[14px] text-[var(--text-muted)]">
              total omzet jaringan:{" "}
              <strong className="text-[var(--text)]">
                Rp {(monthlyRevenue / 1000).toFixed(1)} M / bulan
              </strong>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
            {results.map((r) => (
              <div
                key={r.label}
                className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)]"
              >
                <p className="text-[12px] text-[var(--text-faint)]">{r.label}</p>
                <p className="mt-1 text-[20px] font-medium text-[var(--text)]">{r.value}</p>
                <p className="mt-1 text-[12px] text-[var(--text-muted)]">{r.note}</p>
              </div>
            ))}

            <div className="sm:col-span-2 p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-[12px] text-[var(--text-faint)]">
                  total nilai tambah / bulan
                </p>
                <p className="text-[20px] font-medium text-[var(--text)]">
                  ~ Rp{" "}
                  {Math.round(
                    savedLostSales + savedSpoilage + workingCapitalFreed
                  ).toLocaleString("id-ID")}{" "}
                  jt
                </p>
              </div>

              <button
                onClick={onOpenDemo}
                className="px-4 py-2.5 bg-[var(--btn-light-bg)] text-[var(--btn-light-text)] font-medium text-[14px] rounded-[var(--radius-md)] cursor-pointer whitespace-nowrap"
              >
                mulai pilot 30 hari
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
