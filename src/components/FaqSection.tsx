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
    question: "apakah autoreplenish menggantikan sistem SAP?",
    answer:
      "tidak. SAP S/4HANA atau ECC tetap sebagai Single System of Record. AutoReplenish bertindak sebagai reasoning agent di layer edge yang menghitung kebutuhan stok harian dan menerbitkan Purchase Requisition (BAPI/OData) resmi hanya setelah disetujui kepala toko.",
  },
  {
    category: "operasional",
    question: "bagaimana jika kepala toko sedang sibuk dan tidak membalas Telegram?",
    answer:
      "sistem akan mengirimkan 1 pengingat lembut 1 jam sebelum batas waktu (timeout window 4 jam). Apabila tetap tidak direspon hingga batas pengiriman truk DC, status otomatis 'TIMEOUT_ESCALATED' tanpa menerbitkan PR palsu. Daftar order yang terlewat akan muncul di monitoring dashboard tim Supply Chain pusat.",
  },
  {
    category: "keamanan",
    question: "apakah data penjualan dan inventaris minimarket aman di AI?",
    answer:
      "sangat aman. Arsitektur berjalan di atas AWS Bedrock privat dengan isolasi VPC penuh. Kebijakan AWS & Anthropic menjamin bahwa data transaksi pelanggan TIDAK PERNAH digunakan untuk melatih (retrain) model AI publik. Kredensial ERP disimpan terenkripsi di AWS Secrets Manager.",
  },
  {
    category: "operasional",
    question: "mengapa menggunakan Telegram, bukan membuat aplikasi mobile baru?",
    answer:
      "aplikasi baru membutuhkan onboarding, login berulang, izin MDM, dan sering diabaikan karyawan toko. Telegram sudah terpasang di hampir setiap smartphone kepala minimarket Indonesia, memiliki latensi sub-detik, sangat hemat kuota, dan keputusan bisa selesai dalam hitungan 10 detik tanpa hambatan teknis.",
  },
  {
    category: "operasional",
    question: "apakah kepala toko bisa mengubah jumlah pesanan atau menolak?",
    answer:
      "bisa, kontrol mutlak tetap di tangan manusia. Kepala toko dapat mengetuk 'Ubah Jumlah' jika ada kondisi fisik rak yang berbeda (misal: rak promo baru dipasang), atau 'Tolak' dengan memilih alasan singkat. Setiap perubahan dicatat di DynamoDB sebagai umpan balik untuk kalibrasi AI berikutnya.",
  },
  {
    category: "sap",
    question: "berapa lama waktu yang dibutuhkan untuk memulai pilot POC?",
    answer:
      "untuk kluster 10–25 toko pilot, setup sandbox biasanya selesai dalam 2–3 minggu. Tim kami hanya membutuhkan koneksi OData read/write sandbox SAP Anda serta daftar chat_id Telegram kepala toko peserta pilot.",
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
            <span>tanya jawab integrasi & operasional</span>
          </div>
          <h2 className="text-[20px] md:text-[24px] font-bold leading-[1.3] text-[var(--text)]">
            pertanyaan yang sering diajukan
          </h2>
          <p className="mt-2 text-[14px] leading-[1.7] text-[var(--text-muted)]">
            jawaban lugas seputar implementasi ritel. detail teknis arsitektur dapat dibahas saat sesi demo live.
          </p>

          {/* Category Filter Chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {(
              [
                { id: "semua", label: "semua (6)" },
                { id: "operasional", label: "operasional toko" },
                { id: "sap", label: "integrasi sap erp" },
                { id: "keamanan", label: "keamanan & data" },
              ] as const
            ).map((c) => (
              <button
                key={c.id}
                onClick={() => setFilter(c.id)}
                className={`px-3 py-1 rounded-[var(--radius-sm)] text-[12px] font-mono cursor-pointer transition-colors ${
                  filter === c.id
                    ? "bg-[var(--accent)] text-[#161615] font-semibold"
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

