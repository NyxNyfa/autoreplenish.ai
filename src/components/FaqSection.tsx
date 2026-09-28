import { useState, type FC } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "apakah menggantikan SAP?",
    answer:
      "tidak. SAP tetap system of record. sistem ini hanya menghitung rekomendasi dan menerbitkan PR setelah kepala toko setuju.",
  },
  {
    question: "kalau kepala toko sibuk dan tidak balas?",
    answer:
      "ada pengingat sekali sebelum batas 4 jam. lewat itu status jadi timeout, tidak ada PR otomatis. yang belum ditangani muncul di dashboard.",
  },
  {
    question: "apakah data toko aman?",
    answer:
      "data transaksi terisolasi di infrastruktur privat. tidak dipakai untuk melatih model publik. kredensial disimpan di secrets manager.",
  },
  {
    question: "kenapa telegram, bukan aplikasi baru?",
    answer:
      "karena sudah dipakai harian, ringan, dan approval selesai dalam hitungan detik. tidak perlu training tambahan.",
  },
  {
    question: "bisa ubah atau tolak saran?",
    answer:
      "bisa. ubah jumlah tercatat sebagai edited, tolak wajib isi alasan dan tercatat sebagai feedback untuk evaluasi berikutnya.",
  },
  {
    question: "berapa lama pilot siap jalan?",
    answer:
      "kluster 10–25 toko biasanya 2–3 minggu, tergantung kesiapan akses SAP sandbox dan daftar chat_id toko.",
  },
];

export const FaqSection: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-[640px] mx-auto px-4 sm:px-6">
        <p className="text-[12px] text-[var(--text-faint)] mb-2 text-center">faq</p>
        <h2 className="text-[16px] font-bold leading-[1.4] text-[var(--text)] text-center">
          yang sering ditanyakan
        </h2>
        <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)] text-center">
          jawaban singkat. detail integrasi dibahas saat demo.
        </p>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] overflow-hidden"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-[14px] font-bold text-[var(--text)]">
                    <span className="marker">[*]</span> {faq.question}
                  </span>
                  <span className="text-[var(--text-faint)] text-[14px] shrink-0">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-3 text-[14px] text-[var(--text-muted)] leading-[1.7] border-t border-[var(--border)]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
