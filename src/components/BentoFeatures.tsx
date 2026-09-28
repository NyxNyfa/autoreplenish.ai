import type { FC } from "react";

const features = [
  {
    name: "context-aware reasoning",
    desc: "cuaca lokal, promo JSM, dan kalender libur dibaca sebelum kuota dihitung.",
  },
  {
    name: "approval via telegram",
    desc: "kepala toko setujui, ubah, atau tolak dari hp. tidak perlu buka laptop.",
  },
  {
    name: "langsung ke SAP",
    desc: "persetujuan yang valid diteruskan jadi purchase requisition. tidak ada input ulang.",
  },
  {
    name: "alasan yang bisa dibaca",
    desc: "setiap angka disertai narasi bahasa indonesia: faktor apa yang menaikkan atau menurunkan kuota.",
  },
  {
    name: "konservatif untuk perishable",
    desc: "susu, roti, dan makanan segar tidak dipaksa order besar saat traffic turun.",
  },
  {
    name: "audit trail penuh",
    desc: "input, prompt version, output, keputusan manusia, dan respons SAP tersimpan per request_id.",
  },
];

export const BentoFeatures: FC = () => {
  return (
    <section id="fitur" className="py-16 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-[640px] mb-12">
          <p className="text-[12px] text-[var(--text-faint)] mb-2">fitur</p>
          <h2 className="text-[16px] font-bold leading-[1.4] text-[var(--text)]">
            yang dikerjakan sistem, yang diputuskan manusia
          </h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)]">
            tidak ada tebakan manual. tidak ada dashboard yang harus dibuka tiap
            pagi. yang rutin diotomatisasi, yang penting tetap lewat kepala toko.
          </p>
        </div>

        <ul className="max-w-[640px] space-y-6">
          {features.map((f) => (
            <li
              key={f.name}
              className="text-[14px] leading-[1.7] border-b border-[var(--border)] pb-6 last:border-0"
            >
              <span className="marker">[*]</span>{" "}
              <strong className="text-[var(--text)]">{f.name}</strong>{" "}
              <span className="text-[var(--text-muted)]">{f.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
