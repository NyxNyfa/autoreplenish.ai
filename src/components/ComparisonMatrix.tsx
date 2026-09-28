import type { FC } from "react";

interface MatrixRow {
  aspect: string;
  conventional: string;
  classicMl: string;
  autoReplenish: string;
}

const matrixData: MatrixRow[] = [
  {
    aspect: "baca cuaca + promo",
    conventional: "pola lama disalin. kaget kalau pembeli membludak.",
    classicMl: "perlu pipeline data yang lama disiapkan.",
    autoReplenish: "cuaca dan promo dibaca sebelum stok habis.",
  },
  {
    aspect: "kerja kepala toko",
    conventional: "input manual berjam-jam di komputer.",
    classicMl: "dashboard grafik yang jarang dibuka.",
    autoReplenish: "1-klik dari telegram.",
  },
  {
    aspect: "masuk ke SAP",
    conventional: "rekap nota / excel tiap malam.",
    classicMl: "terpisah dari sistem pusat.",
    autoReplenish: "PR terbit otomatis setelah disetujui.",
  },
  {
    aspect: "alasan angka",
    conventional: "hanya angka, tanpa penjelasan.",
    classicMl: "angka tanpa konteks yang kebaca.",
    autoReplenish: "alasan bahasa indonesia per rekomendasi.",
  },
  {
    aspect: "jadwal truk",
    conventional: "sering telat order sebelum truk berangkat.",
    classicMl: "sulit disesuaikan harian.",
    autoReplenish: "dihitung sampai kedatangan berikutnya.",
  },
];

export const ComparisonMatrix: FC = () => {
  return (
    <section className="py-16 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-[640px] mb-10">
          <p className="text-[12px] text-[var(--text-faint)] mb-2">perbandingan</p>
          <h2 className="text-[16px] font-bold leading-[1.4] text-[var(--text)]">
            cara lama vs autoreplenish.ai
          </h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)]">
            bedanya bukan di jargon. bedanya di siapa yang mengerjakan apa.
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-[12px] text-[var(--text-faint)]">
                <th className="py-4 px-6 font-normal w-1/4">aspek</th>
                <th className="py-4 px-6 font-normal w-1/4">rumus manual</th>
                <th className="py-4 px-6 font-normal w-1/4">software klasik</th>
                <th className="py-4 px-6 font-bold text-[var(--text)] w-1/4">
                  autoreplenish.ai
                </th>
              </tr>
            </thead>
            <tbody className="text-[14px] leading-[1.7]">
              {matrixData.map((row) => (
                <tr
                  key={row.aspect}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)]"
                >
                  <td className="py-5 px-6 font-bold text-[var(--text)] align-top">
                    {row.aspect}
                  </td>
                  <td className="py-5 px-6 text-[var(--text-muted)] align-top">
                    <span className="marker">[x]</span> {row.conventional}
                  </td>
                  <td className="py-5 px-6 text-[var(--text-muted)] align-top">
                    <span className="marker">[-]</span> {row.classicMl}
                  </td>
                  <td className="py-5 px-6 text-[var(--text)] align-top">
                    <span className="marker">[ok]</span> {row.autoReplenish}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
