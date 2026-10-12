import { useState, type FC } from "react";
import { Scroll3DCard } from "@/components/ui/scroll-3d-card";
import {
  Send,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Smartphone,
  Check,
  Pencil,
  Zap,
  Smile,
  Paperclip,
  CheckCheck,
  ShieldCheck,
} from "lucide-react";

export const TelegramSimulator: FC = () => {
  const [status, setStatus] = useState<"idle" | "approved" | "edited" | "rejected">("idle");
  const [customQty, setCustomQty] = useState<number>(50);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editReason, setEditReason] = useState<string>("display depan tambah 1 rak promo.");

  const handleReset = () => {
    setStatus("idle");
    setIsEditing(false);
  };

  return (
    <section id="telegram-bot" className="py-20 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <Scroll3DCard rotateDeg={10} scaleFrom={0.94}>
          <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: design.md theme */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text-muted)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  <Smartphone className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>human-in-the-loop · telegram native</span>
                </div>

                <div>
                  <h2 className="text-[20px] md:text-[24px] font-bold leading-[1.3] text-[var(--text)]">
                    kepala toko cukup balas dari telegram
                  </h2>
                  <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)]">
                    tanpa login erp rumit, tanpa aplikasi baru yang harus diinstall di ratusan gerai.
                    rekomendasi berbasis reasoning ai masuk tepat waktu, keputusan selesai dalam 10 detik.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5 p-3.5 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-hover)] text-[var(--accent)] border border-[var(--border)]">
                      <Check className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[var(--text)]">zero installation overhead</h4>
                      <p className="text-[13px] text-[var(--text-muted)] mt-0.5 leading-[1.6]">
                        berjalan langsung di telegram yang sudah aktif di hp tiap kepala toko minimarket.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-hover)] text-[var(--accent)] border border-[var(--border)]">
                      <Pencil className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[var(--text)]">kontrol penuh di tangan toko</h4>
                      <p className="text-[13px] text-[var(--text-muted)] mt-0.5 leading-[1.6]">
                        setujui 1-klik, ubah kuota sesuai kondisi fisik rak, atau tolak dengan alasan tercatat.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-hover)] text-[var(--accent)] border border-[var(--border)]">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-[var(--text)]">langsung terbit ke SAP S/4HANA</h4>
                      <p className="text-[13px] text-[var(--text-muted)] mt-0.5 leading-[1.6]">
                        otomatis trigger Purchase Requisition (BAPI/OData). tanpa human error entri ulang.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2 text-[12px] text-[var(--text-faint)]">
                  <span className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-hover)] border border-[var(--border)]">
                    [audit] request_id tracking
                  </span>
                  <span className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-hover)] border border-[var(--border)]">
                    [timeout] auto-escalate 4 jam
                  </span>
                  <span className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--surface-hover)] border border-[var(--border)]">
                    [anti-duplicate] tokenized
                  </span>
                </div>
              </div>

              {/* Right Column: Authentic Smartphone & Authentic Telegram App UI */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="relative w-full max-w-[370px]">
                  {/* Smartphone Bezel & Outer Frame */}
                  <div className="relative bg-[#111317] rounded-[44px] p-3 shadow-2xl border-2 border-neutral-700/80 ring-1 ring-white/10">
                    {/* Glass glare effect reflection */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 rounded-[44px] z-30" />

                    {/* Camera / Dynamic Island Pill */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
                      <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-800" />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-950/70" />
                    </div>

                    {/* Screen Container */}
                    <div className="w-full bg-[#17212b] rounded-[34px] overflow-hidden flex flex-col h-[570px] border border-neutral-800/80 relative z-10 font-sans">
                      {/* Telegram Authentic Header */}
                      <div className="pt-7 pb-3 px-4 bg-[#242f3d] flex items-center justify-between border-b border-[#1d2733] select-none">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#2AABEE] to-[#229ED9] flex items-center justify-center font-bold text-[13px] text-white shadow-md">
                              AR
                            </div>
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#242f3d]" />
                          </div>
                          <div>
                            <div className="text-[14px] font-semibold text-white flex items-center gap-1.5">
                              <span>AutoReplenish Bot</span>
                              <ShieldCheck className="h-3.5 w-3.5 text-[#2AABEE]" />
                            </div>
                            <div className="text-[11px] text-[#7ea3cc] font-medium tracking-wide">
                              bot · verified assistant
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={handleReset}
                          title="Reset simulasi"
                          className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Telegram Chat Body */}
                      <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#17212b] bg-[radial-gradient(#1f2d3d_1px,transparent_1px)] [background-size:20px_20px]">
                        {/* Date Divider */}
                        <div className="flex justify-center my-1">
                          <span className="px-3 py-0.5 rounded-full bg-[#1c2734] text-[11px] font-medium text-slate-400 select-none shadow-sm">
                            Hari ini, 07:00 WIB
                          </span>
                        </div>

                        {/* Incoming Bot Message */}
                        <div className="max-w-[96%] bg-[#242f3d] rounded-2xl rounded-tl-sm p-3.5 border border-[#2b3848] text-[13px] space-y-2.5 text-slate-100 shadow-sm">
                          <div className="flex items-center justify-between pb-1.5 border-b border-[#2e3d4e]">
                            <span className="font-bold text-[#2AABEE] text-[11px] tracking-wide uppercase flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#2AABEE]" />
                              Saran Reorder Harian
                            </span>
                            <span className="text-[11px] text-slate-400">07:00</span>
                          </div>

                          <div className="space-y-1.5 text-[13px] bg-[#1a232f] p-2.5 rounded-xl border border-[#263342]">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Gerai:</span>
                              <span className="text-white font-medium">Tebet Barat (TB-04)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Produk:</span>
                              <span className="text-white font-medium">Ultra Milk 1L Plain</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Sisa Fisik Rak:</span>
                              <span className="text-rose-400 font-bold">8 pcs (kritis)</span>
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-[#263342]">
                              <span className="text-slate-300 font-medium">Rekomendasi Reorder:</span>
                              <span className="text-[#2AABEE] font-bold text-[14px]">45 pcs</span>
                            </div>
                          </div>

                          {/* AI Contextual Explanation */}
                          <div className="p-2.5 rounded-xl bg-[#1e2a38] text-[12px] text-slate-300 leading-[1.6] border-l-2 border-[#2AABEE]">
                            <span className="text-white font-medium">Alasan AI: </span>
                            Prakiraan cuaca panas (34°C) + promo diskon akhir pekan. Estimasi penjualan naik 2.4x lipat. Kuota 45 pcs aman hingga truk DC berikutnya tiba besok sore.
                          </div>

                          {/* Telegram Bot Inline Actions */}
                          {status === "idle" && !isEditing && (
                            <div className="space-y-1.5 pt-1">
                              <button
                                onClick={() => setStatus("approved")}
                                className="w-full py-2.5 px-3 rounded-xl bg-[#2ea6ff] hover:bg-[#1e96ee] text-white font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.98] cursor-pointer"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>Setujui (45 pcs)</span>
                              </button>
                              <div className="grid grid-cols-2 gap-1.5">
                                <button
                                  onClick={() => setIsEditing(true)}
                                  className="py-2 px-2.5 rounded-xl bg-[#2e3c4e] hover:bg-[#394a60] text-slate-200 text-[12px] font-medium transition-all active:scale-[0.98] cursor-pointer"
                                >
                                  ✏️ Ubah Jumlah
                                </button>
                                <button
                                  onClick={() => setStatus("rejected")}
                                  className="py-2 px-2.5 rounded-xl bg-[#2e3c4e] hover:bg-[#394a60] text-rose-300 text-[12px] font-medium transition-all active:scale-[0.98] cursor-pointer"
                                >
                                  ❌ Tolak
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Inline Edit Form */}
                          {isEditing && (
                            <div className="p-3 rounded-xl bg-[#1a232f] border border-[#2AABEE]/60 space-y-2">
                              <div className="text-[12px] font-semibold text-[#2AABEE]">
                                Masukkan jumlah penyesuaian:
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={customQty}
                                  onChange={(e) => setCustomQty(Number(e.target.value))}
                                  className="w-24 p-1.5 rounded-lg bg-[#242f3d] text-white text-[13px] font-bold border border-slate-700 focus:outline-none focus:border-[#2AABEE]"
                                />
                                <span className="text-[12px] text-slate-400">pcs</span>
                              </div>
                              <input
                                type="text"
                                value={editReason}
                                onChange={(e) => setEditReason(e.target.value)}
                                placeholder="alasan perubahan..."
                                className="w-full p-1.5 rounded-lg bg-[#242f3d] text-white text-[12px] border border-slate-700 focus:outline-none focus:border-[#2AABEE]"
                              />
                              <div className="flex gap-1.5 pt-1">
                                <button
                                  onClick={() => {
                                    setIsEditing(false);
                                    setStatus("edited");
                                  }}
                                  className="flex-1 py-1.5 bg-[#2ea6ff] hover:bg-[#1e96ee] text-white font-medium text-[12px] rounded-lg cursor-pointer"
                                >
                                  Kirim ({customQty} pcs)
                                </button>
                                <button
                                  onClick={() => setIsEditing(false)}
                                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-[12px] rounded-lg cursor-pointer"
                                >
                                  Batal
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Outgoing User Confirmation Bubble (Authentic Telegram User Message) */}
                        {status === "approved" && (
                          <div className="flex justify-end">
                            <div className="max-w-[85%] bg-[#2b5278] rounded-2xl rounded-tr-sm p-3 text-[13px] text-white space-y-1 shadow-sm">
                              <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Setuju 45 pcs</span>
                              </div>
                              <p className="text-[11px] text-slate-300">Konfirmasi via Telegram Quick Action</p>
                              <div className="flex justify-end items-center gap-1 text-[10px] text-sky-200 pt-0.5">
                                <span>07:01</span>
                                <CheckCheck className="h-3.5 w-3.5 text-[#4faeef]" />
                              </div>
                            </div>
                          </div>
                        )}

                        {status === "edited" && (
                          <div className="flex justify-end">
                            <div className="max-w-[85%] bg-[#2b5278] rounded-2xl rounded-tr-sm p-3 text-[13px] text-white space-y-1 shadow-sm">
                              <div className="flex items-center gap-1.5 font-semibold text-[#4faeef]">
                                <Pencil className="h-3.5 w-3.5" />
                                <span>Ubah jumlah jadi {customQty} pcs</span>
                              </div>
                              <p className="text-[11px] text-slate-300">&quot;{editReason}&quot;</p>
                              <div className="flex justify-end items-center gap-1 text-[10px] text-sky-200 pt-0.5">
                                <span>07:01</span>
                                <CheckCheck className="h-3.5 w-3.5 text-[#4faeef]" />
                              </div>
                            </div>
                          </div>
                        )}

                        {status === "rejected" && (
                          <div className="flex justify-end">
                            <div className="max-w-[85%] bg-[#2b5278] rounded-2xl rounded-tr-sm p-3 text-[13px] text-white space-y-1 shadow-sm">
                              <div className="flex items-center gap-1.5 font-semibold text-rose-300">
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Tolak saran batch ini</span>
                              </div>
                              <div className="flex justify-end items-center gap-1 text-[10px] text-sky-200 pt-0.5">
                                <span>07:01</span>
                                <CheckCheck className="h-3.5 w-3.5 text-[#4faeef]" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Bot Reply Acknowledgment */}
                        {status !== "idle" && (
                          <div className="max-w-[90%] bg-[#242f3d] rounded-2xl rounded-tl-sm p-3 text-[12px] text-slate-200 space-y-1 border border-[#2c3949] shadow-sm">
                            <div className="flex items-center gap-1.5 font-semibold text-emerald-400 text-[12px]">
                              <CheckCheck className="h-4 w-4" />
                              <span>
                                {status === "rejected"
                                  ? "Dibatalkan. Alasan disimpan untuk kalibrasi AI."
                                  : "Sukses! PR-10048291 terbit di SAP S/4HANA."}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {status === "rejected"
                                ? "Tidak ada Purchase Requisition yang diterbitkan ke DC."
                                : "Gudang Distribution Center (DC) telah menerima order pengiriman besok pagi."}
                            </p>
                            <span className="block text-[10px] text-slate-500 text-right">07:01</span>
                          </div>
                        )}
                      </div>

                      {/* Telegram Authentic Input Bar */}
                      <div className="p-2.5 bg-[#242f3d] border-t border-[#1d2733] flex items-center gap-2 select-none">
                        <button className="text-slate-400 hover:text-slate-200 p-1">
                          <Paperclip className="h-4 w-4" />
                        </button>
                        <div className="flex-1 bg-[#17212b] rounded-full px-3.5 py-1.5 text-[12px] text-slate-400 flex items-center justify-between">
                          <span>Ketik pesan balasan...</span>
                          <Smile className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <button className="h-7 w-7 rounded-full bg-[#2AABEE] flex items-center justify-center text-white shadow-sm hover:opacity-90">
                          <Send className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scroll3DCard>
      </div>
    </section>
  );
};

