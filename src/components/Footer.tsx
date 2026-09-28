import type { FC } from "react";

export const Footer: FC<{ onOpenDemo: () => void }> = ({ onOpenDemo }) => {
  return (
    <footer className="bg-[var(--bg)] pt-16 pb-12 text-[14px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-12 p-6 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-[640px]">
            <h3 className="text-[16px] font-bold text-[var(--text)]">
              coba di 10–25 toko dulu.
            </h3>
            <p className="mt-2 text-[var(--text-muted)] leading-[1.7]">
              pilot 14–30 hari dengan SAP sandbox. kalau angkanya masuk akal,
              baru diperluas.
            </p>
          </div>
          <button
            onClick={onOpenDemo}
            className="px-4 py-2.5 bg-[var(--btn-light-bg)] text-[var(--btn-light-text)] font-medium text-[14px] rounded-[var(--radius-md)] cursor-pointer whitespace-nowrap"
          >
            hubungi tim enterprise
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[var(--border)]">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span aria-hidden className="text-[20px] leading-none text-[var(--accent)]">
                *
              </span>
              <span className="text-[14px] font-bold text-[var(--text)]">
                autoreplenish.ai
              </span>
            </div>
            <p className="text-[var(--text-muted)] text-[14px] leading-[1.7]">
              agentic AI semi-otonom untuk replenishment minimarket. manusia
              tetap yang memutuskan.
            </p>
            <p className="text-[12px] text-[var(--text-faint)]">PRD v1.0 · production spec</p>
          </div>

          <div className="space-y-2">
            <p className="text-[12px] text-[var(--text-faint)]">navigasi</p>
            <ul className="space-y-1.5 text-[var(--text-muted)]">
              <li>
                <a href="#fitur" className="hover:text-[var(--text)] no-underline hover:underline">
                  fitur
                </a>
              </li>
              <li>
                <a href="#simulasi" className="hover:text-[var(--text)] no-underline hover:underline">
                  simulasi
                </a>
              </li>
              <li>
                <a href="#telegram-bot" className="hover:text-[var(--text)] no-underline hover:underline">
                  telegram
                </a>
              </li>
              <li>
                <a href="#alur-kerja" className="hover:text-[var(--text)] no-underline hover:underline">
                  alur-kerja
                </a>
              </li>
              <li>
                <a href="#roi" className="hover:text-[var(--text)] no-underline hover:underline">
                  roi
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[12px] text-[var(--text-faint)]">integrasi</p>
            <ul className="space-y-1.5 text-[var(--text-muted)]">
              <li>bedrock · claude 3.5 sonnet</li>
              <li>SAP s/4hana · odata api</li>
              <li>dynamodb + eventbridge</li>
              <li>openweathermap api</li>
              <li>
                <a href="#faq" className="hover:text-[var(--text)] no-underline hover:underline">
                  faq
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[12px] text-[var(--text-faint)]">catatan</p>
            <p className="text-[var(--text-muted)] text-[14px] leading-[1.7]">
              dirancang sesuai standar integrasi ERP ritel. tidak ada secret di
              frontend, tidak ada PR tanpa approval.
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              {["bedrock SLA", "SAP odata", "no-retrain"].map((b) => (
                <span
                  key={b}
                  className="px-2 py-1 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] text-[12px] text-[var(--text-muted)]"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[12px] text-[var(--text-faint)]">
          <span>© 2026 autoreplenish.ai · PRD v1.0</span>
          <span>dibangun di atas eventbridge + lambda + bedrock</span>
        </div>
      </div>
    </footer>
  );
};
