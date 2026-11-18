import { useState, type FC } from "react";
import { HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: "keamanan" | "sap" | "operasional";
}

const faqs: FaqItem[] = [
  {
    category: "sap",
    question: "Apakah AutoReplenish.ai menggantikan sistem SAP yang sudah ada?",
    answer:
      "Tidak. SAP S/4HANA atau SAP ECC tetap menjadi Single System of Record perusahaan Anda. AutoReplenish.ai bekerja sebagai lapisan kecerdasan otonom (Reasoning Layer) yang menghitung kebutuhan stok harian secara presisi dan menerbitkan Purchase Requisition (BAPI/OData) resmi setelah disetujui Kepala Toko.",
  },
  {
    category: "operasional",
    question: "Bagaimana jika Kepala Toko sedang sibuk dan belum membalas Telegram?",
    answer:
      "Sistem mengirimkan 1 pengingat otomatis sebelum batas waktu (timeout window 4 jam). Apabila tetap tidak direspons hingga jadwal keberangkatan truk DC, status ditandai 'TIMEOUT_ESCALATED' di dashboard tim Supply Chain pusat tanpa menerbitkan pesanan fiktif.",
  },
  {
    category: "keamanan",
    question: "Apakah data penjualan dan inventaris minimarket kami aman?",
    answer:
      "Sangat aman. Seluruh arsitektur berjalan di atas VPC privat AWS Bedrock (Region Jakarta). Data transaksi pelanggan dijamin tidak pernah digunakan untuk melatih model AI publik, dan kredensial ERP disimpan terenkripsi dengan AWS Secrets Manager.",
  },
  {
    category: "operasional",
    question: "Mengapa menggunakan Telegram dibanding membuat aplikasi mobile baru?",
    answer:
      "Aplikasi baru membutuhkan instalasi, pelatihan ulang, dan membebani memori HP karyawan toko. Telegram sudah familier, sangat ringan, memiliki latensi sub-detik, dan memungkinkan Kepala Toko menyelesaikan persetujuan stok hanya dalam 10 detik.",
  },
  {
    category: "operasional",
    question: "Apakah Kepala Toko bisa mengubah jumlah pesanan atau menolak rekomendasi AI?",
    answer:
      "Bisa, kendali penuh tetap di tangan Kepala Toko. Mereka dapat menekan 'Ubah Jumlah' jika kondisi fisik rak membutuhkan penyesuaian, atau 'Tolak' disertai alasan singkat. Seluruh interaksi terekam otomatis di DynamoDB sebagai jejak audit.",
  },
  {
    category: "sap",
    question: "Berapa lama waktu yang dibutuhkan untuk memulai program Pilot POC?",
    answer:
      "Untuk kluster 10–25 gerai pilot, integrasi sandbox SAP dan konfigurasi bot Telegram selesai dalam 14 hari kerja tanpa mengganggu operasional kasir.",
  },
];

export const FaqSection: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [filter, setFilter] = useState<"semua" | "keamanan" | "sap" | "operasional">("semua");

  const filteredFaqs = faqs.filter(
    (item) => filter === "semua" || item.category === filter
  );

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-[640px] mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[12px] text-[var(--text-muted)] mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>TANYA JAWAB INTEGRASI & OPERASIONAL</span>
          </div>
          <h2 className="text-[22px] md:text-[28px] font-bold leading-[1.3] text-[var(--text)]">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="mt-2 text-[14px] leading-[1.7] text-[var(--text-muted)]">
            Jawaban lugas seputar implementasi ritel, keamanan data ERP, dan operasional harian di toko.
          </p>

          {/* Category Filter Chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {(
              [
                { id: "semua", label: "Semua Topik (6)" },
                { id: "operasional", label: "Operasional Toko" },
                { id: "sap", label: "Integrasi SAP ERP" },
                { id: "keamanan", label: "Keamanan & Privasi" },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-[12px] font-mono cursor-pointer transition-colors ${
                  filter === c.id
                    ? "bg-[var(--accent)] text-[#161615] font-bold"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className={`rounded-[var(--radius-md)] border transition-colors ${
                  isOpen
                    ? "bg-[var(--surface-active)] border-[var(--accent)]/60"
                    : "bg-[var(--surface)] border-[var(--border)] hover:border-[var(--border)]"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                >
                  <span className="text-[14px] font-bold text-[var(--text)] flex items-start gap-2.5">
                    <span className="text-[var(--accent)] shrink-0 font-mono">[*]</span>
                    <span>{faq.question}</span>
                  </span>
                  <span
                    className={`h-6 w-6 rounded-[var(--radius-sm)] flex items-center justify-center border font-mono text-[13px] shrink-0 ${
                      isOpen
                        ? "bg-[var(--accent)] text-[#161615] border-[var(--accent)] font-bold"
                        : "bg-[var(--bg)] text-[var(--text-faint)] border-[var(--border)]"
                    }`}
                  >
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-[13px] text-[var(--text-muted)] leading-[1.7] border-t border-[var(--border)]/70">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-3 px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] text-[11px] text-[var(--text-faint)] font-mono">
                      topik: {faq.category}
                    </span>
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

