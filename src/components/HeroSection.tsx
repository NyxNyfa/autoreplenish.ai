import { useState, type FC } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

interface HeroSectionProps {
  onOpenDemo: () => void;
  onExploreSimulator: () => void;
}

export const HeroSection: FC<HeroSectionProps> = ({
  onOpenDemo,
  onExploreSimulator,
}) => {
  const [heroApproved, setHeroApproved] = useState(false);

  return (
    <section className="relative pt-32 pb-12 bg-[var(--bg)] border-b border-[var(--border)]">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center justify-center px-4 max-w-[640px] mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] text-[12px] mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span>agentic ai · minimarket replenishment</span>
            </div>

            <h1 className="flex items-start justify-center gap-3 text-center">
              <span aria-hidden className="text-[var(--accent)]">
                *
              </span>
              <span>
                stok toko dihitung dari konteks,
                <br />
                bukan dari tebakan.
              </span>
            </h1>

            <p className="mt-6 text-[14px] leading-[1.7] text-[var(--text-muted)] text-center">
              autoreplenish.ai menggabungkan sisa stok, cuaca, promo, dan jadwal
              truk. kepala toko terima ringkasannya di telegram, cek alasannya,
              lalu setujui kalau masuk akal.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 text-[14px] font-medium text-[var(--btn-light-text)] bg-[var(--btn-light-bg)] rounded-[var(--radius-md)] hover:opacity-90 cursor-pointer"
              >
                minta demo
              </button>

              <button
                onClick={onExploreSimulator}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 text-[14px] text-[var(--text)] bg-transparent border border-[var(--border)] rounded-[var(--radius-md)] hover:bg-[var(--surface-hover)] cursor-pointer"
              >
                coba simulasi
              </button>
            </div>

            <ul className="mt-10 w-full text-left space-y-3">
              <li className="text-[14px] leading-[1.7]">
                <span className="marker">[*]</span>{" "}
                <strong className="text-[var(--text)]">stockout turun 35–40%</strong>{" "}
                <span className="text-[var(--text-muted)]">
                  — kebutuhan sampai truk berikutnya dihitung dulu.
                </span>
              </li>
              <li className="text-[14px] leading-[1.7]">
                <span className="marker">[*]</span>{" "}
                <strong className="text-[var(--text)]">spoilage turun 50%</strong>{" "}
                <span className="text-[var(--text-muted)]">
                  — sku perishable tidak dipaksa order besar.
                </span>
              </li>
              <li className="text-[14px] leading-[1.7]">
                <span className="marker">[*]</span>{" "}
                <strong className="text-[var(--text)]">approval 1-klik</strong>{" "}
                <span className="text-[var(--text-muted)]">
                  — dari telegram, langsung jadi PR di SAP.
                </span>
              </li>
            </ul>

            <p className="mt-8 text-[12px] text-[var(--text-faint)]">
              scroll untuk lihat contoh rekomendasinya
            </p>
          </div>
        }
      >
        <div className="flex flex-col h-full bg-[var(--bg)] text-[var(--text)]">
          <div className="flex items-center justify-between px-6 py-4 bg-[var(--surface)] border-b border-[var(--border)]">
            <div>
              <h4 className="text-[14px] font-bold text-[var(--text)]">
                live store assistant
              </h4>
              <p className="text-[12px] text-[var(--text-muted)]">
                cabang tebet barat · gerai #104
              </p>
            </div>

            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[12px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              ai siap
            </span>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="text-[12px] text-[var(--text-faint)]">
                1. sinyal toko
              </div>

              <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] space-y-3 text-[14px]">
                <div>
                  <div className="font-bold text-[var(--text)]">34°C, panas</div>
                  <div className="text-[12px] text-[var(--text-muted)]">
                    minuman dingin jalan lebih cepat
                  </div>
                </div>
                <div className="border-t border-[var(--border)] pt-3">
                  <div className="font-bold text-[var(--text)]">promo JSM</div>
                  <div className="text-[12px] text-[var(--text-muted)]">
                    diskon 15% kategori susu
                  </div>
                </div>
                <div className="border-t border-[var(--border)] pt-3">
                  <div className="font-bold text-[var(--text)]">truk besok 06:00</div>
                  <div className="text-[12px] text-[var(--text-muted)]">
                    lead time 1 hari
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[12px] text-[var(--text-muted)]">
                  2. rekomendasi
                </span>
                <span className="text-[12px] text-[var(--text-muted)]">
                  stok menipis
                </span>
              </div>

              <div>
                <div className="text-[14px] font-bold text-[var(--text)]">
                  ultra milk full cream 1000ml
                </div>
                <div className="text-[12px] text-[var(--text-muted)] mt-1">
                  sisa 8 pcs · saran 45 pcs
                </div>
              </div>

              <p className="text-[14px] text-[var(--text-muted)] leading-[1.7] bg-[var(--bg)] p-3 rounded-[var(--radius-md)] border border-[var(--border)]">
                cuaca cerah + promo JSM menaikkan penjualan sekitar 2.4x.
                order 45 pcs menutup kebutuhan sampai pengiriman berikutnya.
              </p>

              {heroApproved ? (
                <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-hover)] border border-[var(--border)] text-[13px] text-[var(--text)]">
                  disetujui. PR-8849 diteruskan ke SAP.
                </div>
              ) : (
                <button
                  onClick={() => setHeroApproved(true)}
                  className="w-full py-2.5 px-4 rounded-[var(--radius-md)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[#161615] font-medium text-[14px] cursor-pointer"
                >
                  setujui 45 pcs
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div className="text-[12px] text-[var(--text-faint)]">
                3. dampak
              </div>

              <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--surface)] border border-[var(--border)] space-y-3 text-[14px]">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">omzet terselamatkan</span>
                  <span className="text-[var(--text)]">+ Rp 1,05 jt</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">risiko basi</span>
                  <span className="text-[var(--text)]">rendah</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">waktu kepala toko</span>
                  <span className="text-[var(--text)]">hemat 45 mnt</span>
                </div>

                <p className="pt-3 border-t border-[var(--border)] text-[12px] text-[var(--text-faint)] leading-[1.4]">
                  tidak perlu hitung manual. semua tercatat untuk laporan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
};
