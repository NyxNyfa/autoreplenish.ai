import type { FC } from "react";
import { ArrowRight, ShieldCheck, Terminal, Heart } from "lucide-react";

export const Footer: FC<{ onOpenDemo: () => void }> = ({ onOpenDemo }) => {
  return (
    <footer className="bg-[var(--bg)] pt-20 pb-12 text-[14px] font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Pilot POC CTA Card */}
        <div className="relative mb-16 rounded-[var(--radius-lg)] border border-[#D97757] bg-[var(--surface)] p-8 sm:p-12 overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-[640px] space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--accent)] font-mono">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                <span>PILOT POC PROGRAM · 10–25 GERAI</span>
              </div>
              <h3 className="text-[22px] md:text-[28px] font-bold text-[var(--text)] leading-[1.3]">
                Uji Coba di 10–25 Toko Minimarket Anda Terlebih Dahulu.
              </h3>
              <p className="text-[var(--text-muted)] text-[14px] leading-[1.7]">
                Kami siapkan integrasi sandbox SAP S/4HANA dan kluster bot Telegram dalam 14 hari. Evaluasi akurasi reasoning dan penghematan riil sebelum ekspansi nasional.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onOpenDemo}
                className="px-6 py-3.5 bg-[#D97757] hover:bg-[#E58A6B] text-[#161615] font-bold text-[14px] rounded-[var(--radius-md)] cursor-pointer whitespace-nowrap transition-colors flex items-center justify-center gap-2 font-mono"
              >
                <span>Jadwalkan Demo Live</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[var(--border)]">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-[20px] leading-none text-[var(--accent)] font-bold">
                [*]
              </span>
              <span className="text-[15px] font-bold text-[var(--text)] tracking-tight">
                AUTOREPLENISH<span className="text-[var(--accent)]">.AI</span>
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-[13px] leading-[1.7]">
              Platform Agentic AI otonom untuk replenishment jaringan minimarket Indonesia. Keputusan akhir tetap terkendali di tangan Kepala Toko.
            </p>
            <div className="flex items-center gap-2 text-[12px] text-[var(--text-faint)] font-mono">
              <ShieldCheck className="h-4 w-4 text-[var(--accent)]" />
              <span>SOC 2 Type II · SAP Certified</span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--text-faint)] uppercase tracking-wider font-semibold font-mono">
              Navigasi Produk
            </p>
            <ul className="space-y-2 text-[13px] text-[var(--text-muted)]">
              <li>
                <a href="#cara-kerja" className="hover:text-[var(--text)] transition-colors">
                  [*] Cara Kerja 5 Tahap
                </a>
              </li>
              <li>
                <a href="#fitur" className="hover:text-[var(--text)] transition-colors">
                  [*] Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#alur-kerja" className="hover:text-[var(--text)] transition-colors">
                  [*] Inspektor Telemetri
                </a>
              </li>
              <li>
                <a href="#roi" className="hover:text-[var(--text)] transition-colors">
                  [*] Kalkulator ROI Bisnis
                </a>
              </li>
              <li>
                <a href="#arsitektur" className="hover:text-[var(--text)] transition-colors">
                  [*] Arsitektur Sistem
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--text-faint)] uppercase tracking-wider font-semibold font-mono">
              Stack & Integrasi
            </p>
            <ul className="space-y-2 text-[13px] text-[var(--text-muted)] font-mono">
              <li>AWS Bedrock · Claude 3.5 Sonnet</li>
              <li>SAP S/4HANA · OData API v4</li>
              <li>Telegram Bot API · HMAC SHA256</li>
              <li>Amazon EventBridge + DynamoDB</li>
              <li>
                <a href="#faq" className="hover:text-[var(--accent)] text-[var(--link)] transition-colors">
                  → Baca Tanya Jawab (FAQ)
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--text-faint)] uppercase tracking-wider font-semibold font-mono">
              Status Sistem
            </p>
            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] space-y-2 text-[12px] font-mono">
              <div className="flex items-center justify-between text-[var(--accent)]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                  <span>ALL SYSTEMS OPERATIONAL</span>
                </span>
                <span className="text-[var(--text)]">99,98%</span>
              </div>
              <div className="text-[var(--text-faint)] text-[11px]">
                Region: ap-southeast-3 (Jakarta)
              </div>
            </div>
            <p className="text-[12px] text-[var(--text-faint)] leading-[1.6]">
              Dirancang khusus untuk tata kelola ERP ritel multi-cabang di Indonesia.
            </p>
          </div>
        </div>

        {/* Bottom Credits Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-[var(--text-faint)] font-mono">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-[var(--accent)]" />
            <span>© 2026 AUTOREPLENISH.AI · Enterprise Retail Supply Chain AI</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Dirancang dengan</span>
            <Heart className="h-3 w-3 text-[var(--accent)] fill-[var(--accent)]" />
            <span>untuk ketahanan pangan & ritel Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

