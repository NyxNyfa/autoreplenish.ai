import { useState, type FC } from "react";

interface ArchNode {
  id: string;
  name: string;
  subtitle: string;
  benefit: string;
  guarantee: string;
}

const archNodes: ArchNode[] = [
  {
    id: "ai",
    name: "reasoning engine",
    subtitle: "bedrock · claude 3.5 sonnet",
    benefit:
      "membaca stok, promo, cuaca, dan kalender lalu menulis rekomendasi + alasan dalam bahasa indonesia.",
    guarantee: "data toko terisolasi. tidak dipakai melatih model publik.",
  },
  {
    id: "sap",
    name: "sap s/4hana",
    subtitle: "odata api · system of record",
    benefit:
      "baca stok dan lead time, tulis purchase requisition setelah ada approval yang valid.",
    guarantee: "koneksi terenkripsi. kredensial di secrets manager, bukan di kode.",
  },
  {
    id: "telegram",
    name: "telegram bot",
    subtitle: "human-in-the-loop",
    benefit:
      "kartu rekomendasi masuk ke hp kepala toko. approve, ubah, atau tolak dalam hitungan detik.",
    guarantee: "hanya akun toko terdaftar yang bisa konfirmasi. klik ganda tidak bikin PR ganda.",
  },
  {
    id: "scale",
    name: "scale + audit",
    subtitle: "dynamodb · eventbridge",
    benefit:
      "jalan terjadwal per batch. tiap request_id menyimpan input, output, keputusan, dan respons SAP.",
    guarantee: "pilot 3–5 toko sampai ratusan toko tanpa ubah alur inti.",
  },
];

export const ArchitectureSection: FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchNode>(archNodes[0]);

  return (
    <section id="arsitektur" className="py-16 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-[640px] mb-10">
          <p className="text-[12px] text-[var(--text-faint)] mb-2">arsitektur</p>
          <h2 className="text-[16px] font-bold leading-[1.4] text-[var(--text)]">
            empat bagian, tidak ada yang ajaib
          </h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)]">
            pilih satu untuk lihat apa yang dikerjakan dan apa jaminannya.
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-2">
            {archNodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`w-full p-4 rounded-[var(--radius-md)] border text-left cursor-pointer flex items-center justify-between ${
                  selectedNode.id === node.id
                    ? "bg-[var(--surface-active)] border-[var(--border)] text-[var(--text)]"
                    : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                <span>
                  <span className="block text-[14px] font-bold">{node.name}</span>
                  <span className="block text-[12px] text-[var(--text-faint)] mt-0.5">
                    {node.subtitle}
                  </span>
                </span>
                <span className="text-[var(--text-faint)]">→</span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 p-6 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)] space-y-5">
            <div className="border-b border-[var(--border)] pb-4">
              <p className="text-[12px] text-[var(--text-faint)]">
                {selectedNode.subtitle}
              </p>
              <h3 className="mt-1 text-[16px] font-bold text-[var(--text)]">
                {selectedNode.name}
              </h3>
            </div>

            <div>
              <p className="text-[12px] text-[var(--text-faint)] mb-1">kerja sistem</p>
              <p className="text-[14px] text-[var(--text-muted)] leading-[1.7]">
                {selectedNode.benefit}
              </p>
            </div>

            <div>
              <p className="text-[12px] text-[var(--text-faint)] mb-1">jaminan</p>
              <p className="text-[14px] text-[var(--text)] leading-[1.7] p-4 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)]">
                {selectedNode.guarantee}
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px] text-[var(--text-muted)]">
              <span>[ok] data terisolasi</span>
              <span>[ok] kompatibel SAP</span>
              <span>[ok] siap diaudit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
