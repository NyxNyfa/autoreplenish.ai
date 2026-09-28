import { useState, type FC } from "react";

export const TelegramSimulator: FC = () => {
  const [status, setStatus] = useState<"idle" | "approved" | "edited" | "rejected">("idle");
  const [customQty, setCustomQty] = useState<number>(50);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editReason, setEditReason] = useState<string>("display depan tambah satu rak promo.");

  const handleReset = () => {
    setStatus("idle");
    setIsEditing(false);
  };

  return (
    <section id="telegram-bot" className="py-16 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-6">
          <p className="text-[12px] text-[var(--text-faint)] mb-2">telegram</p>
          <h2 className="text-[16px] font-bold leading-[1.4] text-[var(--text)]">
            kepala toko cukup balas dari hp
          </h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)] max-w-[640px]">
            tidak ada aplikasi baru. tidak ada form ERP. notifikasi masuk,
            alasan kebaca, keputusan selesai dalam hitungan detik.
          </p>

          <ul className="mt-8 space-y-6 max-w-[640px]">
            <li className="text-[14px] leading-[1.7]">
              <span className="marker">[*]</span>{" "}
              <strong className="text-[var(--text)]">tanpa install</strong>{" "}
              <span className="text-[var(--text-muted)]">
                jalan di telegram yang sudah dipakai harian.
              </span>
            </li>
            <li className="text-[14px] leading-[1.7]">
              <span className="marker">[*]</span>{" "}
              <strong className="text-[var(--text)]">keputusan tetap di toko</strong>{" "}
              <span className="text-[var(--text-muted)]">
                setujui, ubah jumlah, atau tolak dengan alasan.
              </span>
            </li>
            <li className="text-[14px] leading-[1.7]">
              <span className="marker">[*]</span>{" "}
              <strong className="text-[var(--text)]">masuk SAP otomatis</strong>{" "}
              <span className="text-[var(--text-muted)]">
                sekali setuju, PR terbit. tidak ada input ulang.
              </span>
            </li>
          </ul>

          <p className="mt-8 text-[12px] text-[var(--text-faint)]">
            coba di mockup kanan: setujui, ubah, atau tolak.
          </p>
        </div>

        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[360px] bg-[var(--surface)] rounded-[var(--radius-lg)] p-3 border border-[var(--border)]">
            <div className="w-full bg-[var(--bg)] rounded-[var(--radius-md)] overflow-hidden flex flex-col h-[560px] border border-[var(--border)]">
              <div className="px-4 py-3 bg-[var(--surface)] flex items-center justify-between border-b border-[var(--border)]">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-[var(--surface-active)] flex items-center justify-center text-[12px] font-bold text-[var(--text)] border border-[var(--border)]">
                    AR
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[var(--text)]">
                      autoreplenish bot
                    </div>
                    <div className="text-[12px] text-[var(--text-faint)]">asisten toko</div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text)] px-2 py-1 border border-[var(--border)] rounded-[var(--radius-sm)] cursor-pointer"
                >
                  reset
                </button>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-3">
                <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-4 border border-[var(--border)] text-[14px] space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
                    <span className="font-bold text-[var(--text)] text-[12px]">
                      saran reorder hari ini
                    </span>
                    <span className="text-[12px] text-[var(--text-faint)]">07:00</span>
                  </div>

                  <div className="space-y-1 text-[14px] text-[var(--text-muted)]">
                    <div>
                      toko: <span className="text-[var(--text)]">tebet barat</span>
                    </div>
                    <div>
                      produk: <span className="text-[var(--text)]">ultra milk 1L</span>
                    </div>
                    <div>
                      sisa: <span className="text-[var(--text)]">8 pcs</span>
                    </div>
                    <div>
                      saran: <span className="text-[var(--text)]">45 pcs</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] text-[14px] text-[var(--text-muted)] leading-[1.7]">
                    cuaca panas + promo akhir pekan menaikkan penjualan sekitar
                    2.4x. 45 pcs menutup kebutuhan sebelum truk tiba.
                  </div>

                  {status === "idle" && !isEditing && (
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => setStatus("approved")}
                        className="w-full py-2.5 px-3 rounded-[var(--radius-md)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[#161615] font-medium text-[14px] cursor-pointer"
                      >
                        setujui 45 pcs
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="py-2 px-2.5 rounded-[var(--radius-md)] bg-transparent border border-[var(--border)] text-[var(--text)] text-[13px] cursor-pointer hover:bg-[var(--surface-hover)]"
                        >
                          ubah jumlah
                        </button>
                        <button
                          onClick={() => setStatus("rejected")}
                          className="py-2 px-2.5 rounded-[var(--radius-md)] bg-transparent border border-[var(--border)] text-[var(--text-muted)] text-[13px] cursor-pointer hover:bg-[var(--surface-hover)]"
                        >
                          tolak
                        </button>
                      </div>
                    </div>
                  )}

                  {isEditing && (
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] space-y-2.5">
                      <p className="text-[13px] font-bold text-[var(--text)]">
                        jumlah yang dimau:
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={customQty}
                          onChange={(e) => setCustomQty(Number(e.target.value))}
                          className="w-24 p-2 rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--text)] text-[14px] border border-[var(--border)]"
                        />
                        <span className="text-[12px] text-[var(--text-muted)]">pcs</span>
                      </div>
                      <input
                        type="text"
                        value={editReason}
                        onChange={(e) => setEditReason(e.target.value)}
                        placeholder="alasan perubahan..."
                        className="w-full p-2 rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--text)] text-[14px] border border-[var(--border)]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setStatus("edited");
                          }}
                          className="flex-1 py-2 bg-[var(--btn-light-bg)] text-[var(--btn-light-text)] font-medium text-[13px] rounded-[var(--radius-md)] cursor-pointer"
                        >
                          kirim ({customQty} pcs)
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-3 py-2 border border-[var(--border)] text-[var(--text-muted)] text-[13px] rounded-[var(--radius-md)] cursor-pointer"
                        >
                          batal
                        </button>
                      </div>
                    </div>
                  )}

                  {status === "approved" && (
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-[13px]">
                      disetujui. PR-10048291 diteruskan ke SAP.
                    </div>
                  )}

                  {status === "edited" && (
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] text-[13px] space-y-1">
                      <p className="text-[var(--text)]">
                        disetujui dengan penyesuaian ({customQty} pcs).
                      </p>
                      <p className="text-[var(--text-muted)]">
                        alasan: &quot;{editReason}&quot;
                      </p>
                    </div>
                  )}

                  {status === "rejected" && (
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] text-[13px]">
                      <p className="text-[var(--text)]">ditolak.</p>
                      <p className="text-[var(--text-muted)]">
                        tidak ada reorder untuk batch ini.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-[var(--surface)] border-t border-[var(--border)] flex items-center gap-2">
                <div className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-full px-4 py-2 text-[12px] text-[var(--text-faint)]">
                  ketik respon...
                </div>
                <div className="h-8 w-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[12px] text-[var(--text-muted)]">
                  →
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
