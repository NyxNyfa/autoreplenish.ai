import { useState, type FC } from "react";

interface WorkflowStep {
  number: string;
  title: string;
  description: string;
  points: string[];
  meta: string;
}

const steps: WorkflowStep[] = [
  {
    number: "01",
    title: "deteksi pagi",
    description:
      "sistem cek inventaris tiap toko sebelum buka. yang mendekati batas aman masuk antrean evaluasi.",
    points: [
      "ratusan cabang dicek bersamaan",
      "yang laris dan cepat habis didahulukan",
      "tidak mengganggu kasir",
    ],
    meta: "05:00 tiap hari",
  },
  {
    number: "02",
    title: "kumpulkan konteks",
    description:
      "ambil cuaca wilayah toko, promo aktif, kalender, dan jadwal truk dari DC.",
    points: [
      "cuaca lokal + forecast singkat",
      "promo, libur, efek gajian",
      "lead time + jadwal kedatangan",
    ],
    meta: "real-time",
  },
  {
    number: "03",
    title: "hitung kuota",
    description:
      "model menghitung kebutuhan sampai pengiriman berikutnya, lalu tulis alasannya dalam bahasa indonesia.",
    points: [
      "cegah kosong tanpa menumpuk",
      "perishable dihitung konservatif",
      "alasan menyebut faktor utama",
    ],
    meta: "hitungan detik",
  },
  {
    number: "04",
    title: "kirim ke telegram",
    description:
      "kartu rekomendasi masuk ke hp kepala toko. tinggal baca ringkasannya dan putuskan.",
    points: ["setujui / ubah / tolak", "alasan kebaca", "selesai < 10 detik"],
    meta: "instan",
  },
  {
    number: "05",
    title: "terbitkan ke SAP",
    description:
      "yang disetujui diteruskan jadi purchase requisition. gudang bisa siapkan truk.",
    points: [
      "tidak ada input ulang",
      "stok fisik dan sistem cocok",
      "riwayat tercatat per request_id",
    ],
    meta: "otomatis",
  },
];

export const WorkflowSection: FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="alur-kerja" className="py-16 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-[640px] mb-10">
          <p className="text-[12px] text-[var(--text-faint)] mb-2">alur-kerja</p>
          <h2 className="text-[16px] font-bold leading-[1.4] text-[var(--text)]">
            5 langkah, dari deteksi sampai PR
          </h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)]">
            tidak ada yang disembunyikan. tiap langkah ada jejaknya.
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8 p-0.5 rounded-[var(--radius-md)] bg-[var(--surface-hover)] border border-[var(--border)]">
            {steps.map((s, idx) => (
              <button
                key={s.number}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-[var(--radius-sm)] border-0 text-left cursor-pointer ${
                  activeStep === idx
                    ? "bg-[var(--surface-active)] text-[var(--text)]"
                    : "bg-transparent text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                <span className="block text-[12px] text-[var(--text-faint)]">
                  {s.number} · {s.meta}
                </span>
                <span className="block text-[13px] font-medium mt-0.5">{s.title}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <p className="text-[12px] text-[var(--text-faint)]">
                langkah {steps[activeStep].number} · {steps[activeStep].meta}
              </p>
              <h3 className="mt-1 text-[16px] font-bold text-[var(--text)]">
                {steps[activeStep].title}
              </h3>
              <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)]">
                {steps[activeStep].description}
              </p>

              <ul className="mt-5 space-y-3">
                {steps[activeStep].points.map((item) => (
                  <li key={item} className="text-[14px] text-[var(--text-muted)]">
                    <span className="marker">[*]</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)]">
                <p className="text-[12px] text-[var(--text-faint)] border-b border-[var(--border)] pb-2">
                  ringkasan tahap ini
                </p>
                <p className="mt-3 text-[14px] font-bold text-[var(--text)]">
                  {steps[activeStep].title}
                </p>
                <p className="mt-1 text-[14px] text-[var(--text-muted)] leading-[1.7]">
                  {steps[activeStep].description}
                </p>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--border)]">
                  <button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                    className="px-4 py-2.5 rounded-[var(--radius-md)] border border-[var(--border)] text-[var(--text)] text-[13px] disabled:opacity-40 cursor-pointer hover:bg-[var(--surface-hover)]"
                  >
                    ← sebelum
                  </button>
                  <button
                    disabled={activeStep === steps.length - 1}
                    onClick={() =>
                      setActiveStep((p) => Math.min(steps.length - 1, p + 1))
                    }
                    className="px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--btn-light-bg)] text-[var(--btn-light-text)] text-[13px] font-medium disabled:opacity-40 cursor-pointer"
                  >
                    lanjut →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
