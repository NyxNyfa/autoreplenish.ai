import type { FC } from "react";
import { ArrowRight, ShieldCheck, Terminal, Heart } from "lucide-react";

export const Footer: FC<{ onOpenDemo: () => void }> = ({ onOpenDemo }) => {
  return (
    <footer className="bg-[var(--bg)] pt-20 pb-12 text-[14px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Glowing Pilot CTA Card */}
        <div className="relative mb-16 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 overflow-hidden shadow-xl">
          {/* Subtle warm ambient glow in top-right */}
          <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[var(--accent)]/10 blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-[640px] space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--accent)] font-mono">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-ping" />
                <span>PILOT POC PROGRAM · 10–25 GERAI</span>
              </div>
              <h3 className="text-[22px] md:text-[28px] font-bold text-[var(--text)] leading-[1.3]">
                uji coba di 10–25 toko minimarket anda terlebih dahulu.
              </h3>
              <p className="text-[var(--text-muted)] text-[14px] leading-[1.7]">
                kami siapkan integrasi sandbox SAP S/4HANA dan kluster bot Telegram dalam 2 minggu. Evaluasi akurasi reasoning dan penghematan sebelum scale-up nasional.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOpenDemo}
                className="px-6 py-3.5 bg-[var(--btn-light-bg)] hover:bg-white text-[var(--btn-light-text)] font-bold text-[14px] rounded-[var(--radius-md)] cursor-pointer whitespace-nowrap transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 font-mono"
              >
                <span>jadwalkan demo live</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[var(--border)]">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-[22px] leading-none text-[var(--accent)] font-bold">
                *
              </span>
              <span className="text-[15px] font-bold text-[var(--text)] tracking-tight">
                autoreplenish.ai
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-[13px] leading-[1.7]">
              agentic AI semi-otonom untuk replenishment minimarket Indonesia. Keputusan akhir mutlak tetap di tangan kepala toko.
            </p>
            <div className="flex items-center gap-2 text-[12px] text-[var(--text-faint)] font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>SOC2 Type II · SAP Certified</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--text-faint)] uppercase tracking-wider font-semibold font-mono">
              navigasi
            </p>
            <ul className="space-y-2 text-[13px] text-[var(--text-muted)]">
              <li>
                <a href="#fitur" className="hover:text-[var(--text)] transition-colors">
                  [*] fitur arsitektur
                </a>
              </li>
              <li>
                <a href="#simulasi" className="hover:text-[var(--text)] transition-colors">
                  [*] simulator reasoning
                </a>
              </li>
              <li>
                <a href="#telegram-bot" className="hover:text-[var(--text)] transition-colors">
                  [*] telegram bot HITL
                </a>
              </li>
              <li>
                <a href="#alur-kerja" className="hover:text-[var(--text)] transition-colors">
                  [*] alur eksekusi 5 tahap
                </a>
              </li>
              <li>
                <a href="#roi" className="hover:text-[var(--text)] transition-colors">
                  [*] kalkulator dampak bisnis
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--text-faint)] uppercase tracking-wider font-semibold font-mono">
              stack & integrasi
            </p>
            <ul className="space-y-2 text-[13px] text-[var(--text-muted)] font-mono">
              <li>AWS Bedrock · Claude 3.5 Sonnet</li>
              <li>SAP S/4HANA · OData API v4</li>
              <li>Telegram Bot API · HMAC SHA256</li>
              <li>DynamoDB + EventBridge</li>
              <li>
                <a href="#faq" className="hover:text-[var(--accent)] text-[var(--link)] transition-colors">
                  → baca tanya jawab (faq)
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--text-faint)] uppercase tracking-wider font-semibold font-mono">
              status sistem
            </p>
            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-2 text-[12px] font-mono">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ALL SYSTEMS NORMAL</span>
                </span>
                <span className="text-[var(--text-faint)]">99.98%</span>
              </div>
              <div className="text-[var(--text-faint)] text-[11px]">
                cluster: ap-southeast-3 (Jakarta)
              </div>
            </div>
            <p className="text-[12px] text-[var(--text-faint)] leading-[1.6]">
              dirancang khusus untuk kepatuhan tata kelola ERP ritel multi-cabang.
            </p>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-[var(--text-faint)] font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>© 2026 autoreplenish.ai · production spec v1.0</span>
          </div>
          <div className="flex items-center gap-1">
            <span>crafted with</span>
            <Heart className="h-3 w-3 text-[var(--accent)] fill-[var(--accent)]" />
            <span>for retail operators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

