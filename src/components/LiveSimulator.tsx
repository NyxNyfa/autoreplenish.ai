import { useState, useMemo, type FC } from "react";
import { Scroll3DCard } from "@/components/ui/scroll-3d-card";
import {
  Brain,
  Sliders,
  CloudRain,
  Sun,
  Tag,
  AlertTriangle,
  Sparkles,
  Droplets
} from "lucide-react";

interface SKUOption {
  id: string;
  name: string;
  category: string;
  baseDemand: number;
  currentStock: number;
  minMaxThreshold: number;
  unitPrice: number;
  isPerishable: boolean;
}

const skuList: SKUOption[] = [
  {
    id: "SKU-001",
    name: "Susu UHT Full Cream 1000ml",
    category: "Produk Susu / Perishable",
    baseDemand: 14,
    currentStock: 10,
    minMaxThreshold: 20,
    unitPrice: 22000,
    isPerishable: true,
  },
  {
    id: "SKU-002",
    name: "Minyak Goreng Pouch 2L",
    category: "Kebutuhan Pokok / Cepat Habis",
    baseDemand: 35,
    currentStock: 25,
    minMaxThreshold: 40,
    unitPrice: 38000,
    isPerishable: false,
  },
  {
    id: "SKU-003",
    name: "Es Krim Cup Vanilla 110ml",
    category: "Sensitif Cuaca Panas",
    baseDemand: 22,
    currentStock: 16,
    minMaxThreshold: 30,
    unitPrice: 12000,
    isPerishable: true,
  },
];

export const LiveSimulator: FC = () => {
  const [selectedSkuId, setSelectedSkuId] = useState<string>("SKU-001");
  const [weather, setWeather] = useState<"hot" | "rain">("hot");
  const [promo, setPromo] = useState<"jsm" | "none">("jsm");
  const [dayType, setDayType] = useState<"weekend" | "weekday">("weekend");
  const [leadTime, setLeadTime] = useState<number>(2);

  const currentSku = useMemo(() => {
    return skuList.find((s) => s.id === selectedSkuId) || skuList[0];
  }, [selectedSkuId]);

  // Calculations
  const simulationResult = useMemo(() => {
    let weatherMultiplier = 1.0;
    if (currentSku.id === "SKU-003") {
      weatherMultiplier = weather === "hot" ? 1.8 : 0.4;
    } else if (currentSku.id === "SKU-001") {
      weatherMultiplier = weather === "rain" ? 1.15 : 1.0;
    }

    const promoMultiplier = promo === "jsm" ? 1.65 : 1.0;
    const dayMultiplier = dayType === "weekend" ? 1.45 : 0.95;

    const projectedDailyDemand = Math.round(
      currentSku.baseDemand * weatherMultiplier * promoMultiplier * dayMultiplier
    );

    const consumptionDuringLeadTime = projectedDailyDemand * leadTime;
    const safetyBuffer = currentSku.isPerishable
      ? Math.round(projectedDailyDemand * 0.4)
      : Math.round(projectedDailyDemand * 0.75);
    const grossNeed = consumptionDuringLeadTime + safetyBuffer;
    const aiRecommendation = Math.max(0, grossNeed - currentSku.currentStock);

    const staticMax = currentSku.minMaxThreshold * 2;
    const staticRecommendation = Math.max(0, staticMax - currentSku.currentStock);

    const totalNeededTillNextDrop = projectedDailyDemand * leadTime;
    const staticStockout = currentSku.currentStock + staticRecommendation < totalNeededTillNextDrop;
    const staticOverstock = currentSku.isPerishable && staticRecommendation > projectedDailyDemand * 2.5;

    let reasoning = `Penjelasan AI untuk Toko: `;
    if (dayType === "weekend") {
      reasoning += `Pola pembeli meningkat di akhir pekan (+45%). `;
    }
    if (promo === "jsm") {
      reasoning += `Promo JSM mendorong perputaran barang lebih cepat (+65%). `;
    }
    if (currentSku.id === "SKU-003" && weather === "hot") {
      reasoning += `Cuaca panas memicu penjualan es krim naik 80%. `;
    }
    reasoning += `Dengan sisa stok ${currentSku.currentStock} pcs dan jadwal kirim ${leadTime} hari lagi, jumlah reorder paling ideal adalah ${aiRecommendation} pcs agar rak tidak kosong.`;

    const potentialLostSales = staticStockout
      ? (totalNeededTillNextDrop - (currentSku.currentStock + staticRecommendation)) * currentSku.unitPrice
      : 0;

    return {
      projectedDailyDemand,
      aiRecommendation,
      staticRecommendation,
      staticStockout,
      staticOverstock,
      reasoning,
      potentialLostSales,
    };
  }, [currentSku, weather, promo, dayType, leadTime]);

  return (
    <section id="simulasi" className="py-24 relative bg-[var(--bg)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--surface)] border border-[var(--border)] text-[var(--accent)] text-xs font-mono font-medium mb-4">
            <Sliders className="h-3.5 w-3.5" />
            <span>Simulasi Reorder Interaktif</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text)] tracking-tight">
            Lihat Bagaimana AI <br />
            <span className="text-[var(--accent)]">
              Menghitung Kebutuhan Toko Anda
            </span>
          </h2>
          <p className="mt-4 text-[var(--text-muted)] text-sm sm:text-base">
            Ubah kondisi cuaca dan promo di bawah untuk melihat perbedaan kuota antara rumus konvensional dan AutoReplenish.ai.
          </p>
        </div>

        {/* 3D Scroll Perspective Container */}
        <Scroll3DCard rotateDeg={10} scaleFrom={0.94}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Easy Inputs (5 Cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-[var(--accent)]" />
                  <span>Kondisi Toko Hari Ini</span>
                </h3>
                <span className="text-xs text-[var(--text-faint)] font-mono">Pilih Parameter</span>
              </div>

              {/* 1. Pilih Produk */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-muted)]">Produk yang Dicek:</label>
                <div className="grid grid-cols-1 gap-2">
                  {skuList.map((sku) => (
                    <button
                      key={sku.id}
                      onClick={() => setSelectedSkuId(sku.id)}
                      className={`flex items-center justify-between p-3.5 rounded-[var(--radius-md)] border text-left transition-all cursor-pointer ${
                        selectedSkuId === sku.id
                          ? "bg-[var(--surface-active)] border-[var(--accent)] text-[var(--text)] shadow-sm"
                          : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-faint)] hover:text-[var(--text)]"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{sku.name}</div>
                        <div className="text-[11px] text-[var(--text-faint)] mt-0.5">
                          {sku.category} · Sisa: {sku.currentStock} pcs
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[var(--accent)]">
                        Rp {sku.unitPrice.toLocaleString("id-ID")}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Cuaca */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-muted)]">Cuaca Wilayah Toko:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setWeather("hot")}
                    className={`p-3 rounded-[var(--radius-md)] border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      weather === "hot"
                        ? "bg-[var(--surface-active)] border-[var(--accent)] text-[var(--accent)]"
                        : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-faint)]"
                    }`}
                  >
                    <Sun className="h-4 w-4 text-amber-400" />
                    <span>☀️ Panas Terik</span>
                  </button>
                  <button
                    onClick={() => setWeather("rain")}
                    className={`p-3 rounded-[var(--radius-md)] border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      weather === "rain"
                        ? "bg-[var(--surface-active)] border-[var(--accent)] text-[var(--link)]"
                        : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-faint)]"
                    }`}
                  >
                    <CloudRain className="h-4 w-4 text-[var(--link)]" />
                    <span>🌧️ Musim Hujan</span>
                  </button>
                </div>
              </div>

              {/* 3. Promo & Hari */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--text-muted)]">Status Promosi:</label>
                  <button
                    onClick={() => setPromo(promo === "jsm" ? "none" : "jsm")}
                    className={`w-full p-2.5 rounded-[var(--radius-md)] border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      promo === "jsm"
                        ? "bg-[var(--surface-active)] border-[var(--accent)] text-[var(--accent)]"
                        : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)]"
                    }`}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    <span>{promo === "jsm" ? "Promo JSM Aktif" : "Harga Normal"}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-[var(--text-muted)]">Waktu Toko:</label>
                  <button
                    onClick={() => setDayType(dayType === "weekend" ? "weekday" : "weekend")}
                    className={`w-full p-2.5 rounded-[var(--radius-md)] border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      dayType === "weekend"
                        ? "bg-[var(--surface-active)] border-[var(--accent)] text-[var(--accent)]"
                        : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)]"
                    }`}
                  >
                    <span>{dayType === "weekend" ? "Akhir Pekan" : "Hari Kerja"}</span>
                  </button>
                </div>
              </div>

              {/* 4. Jadwal Truk DC */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--text-muted)]">Jadwal Truk DC:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((days) => (
                    <button
                      key={days}
                      onClick={() => setLeadTime(days)}
                      className={`p-2.5 rounded-[var(--radius-md)] border text-xs font-bold text-center transition-all cursor-pointer ${
                        leadTime === days
                          ? "bg-[var(--surface-active)] border-[var(--accent)] text-[var(--accent)]"
                          : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-faint)]"
                      }`}
                    >
                      {days} Hari
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Comparison & Clear Impact (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                  <Brain className="h-4 w-4 text-[var(--accent)]" />
                  <span>Perbandingan Hasil Rekomendasi</span>
                </h3>
                <span className="text-xs font-mono text-[var(--accent)] font-semibold">Hasil Real-Time</span>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Metode Konvensional */}
                <div className="p-5 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-[var(--text-muted)] font-semibold uppercase">Rumus Lama</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface)] text-[var(--text-faint)] font-mono">
                        Statis
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--text)] font-mono">
                      {simulationResult.staticRecommendation}{" "}
                      <span className="text-sm font-normal text-[var(--text-muted)]">pcs</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-2">
                      Tidak menghitung lonjakan pembeli akhir pekan atau perubahan cuaca.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border)]">
                    {simulationResult.staticStockout && (
                      <div className="flex items-center gap-2 p-2.5 rounded-[var(--radius-sm)] bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                        <span>
                          <strong>Risiko Rak Kosong!</strong> Stok habis sebelum truk tiba.
                        </span>
                      </div>
                    )}
                    {simulationResult.staticOverstock && (
                      <div className="flex items-center gap-2 p-2.5 rounded-[var(--radius-sm)] bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                        <span>
                          <strong>Risiko Kadaluarsa!</strong> Barang menumpuk di gudang.
                        </span>
                      </div>
                    )}
                    {!simulationResult.staticStockout && !simulationResult.staticOverstock && (
                      <div className="text-xs text-[var(--text-faint)]">
                        Kuota pas-pasan, rentan kehabisan stok jika ada lonjakan mendadak.
                      </div>
                    )}
                  </div>
                </div>

                {/* AutoReplenish.ai */}
                <div className="p-5 rounded-[var(--radius-md)] bg-[var(--surface-hover)] border-2 border-[var(--accent)] shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-[var(--accent)] font-bold uppercase">AutoReplenish.ai</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-[var(--radius-sm)] bg-[var(--surface-active)] text-[var(--accent)] border border-[var(--border)] font-mono font-medium">
                        Ideal
                      </span>
                    </div>
                    <div className="text-3xl font-bold text-[var(--accent)] font-mono">
                      {simulationResult.aiRecommendation}{" "}
                      <span className="text-sm font-normal text-[var(--text-muted)]">pcs</span>
                    </div>
                    <p className="text-xs text-[var(--text)] mt-2">
                      Kebutuhan pas sesuai proyeksi belanja riil ({simulationResult.projectedDailyDemand} pcs/hari).
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 p-2.5 rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--accent)]/40 text-[var(--text)] text-xs font-semibold">
                      <Droplets className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <span>Aliran Pasokan Pas · 0% Risiko Kadaluarsa</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Natural Explanation */}
              <div className="p-4 rounded-[var(--radius-md)] bg-[var(--bg)] border border-[var(--border)] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--text)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>Pesan Penjelasan yang Diterima Kepala Toko di Telegram:</span>
                </div>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed bg-[var(--surface)] p-3.5 rounded-[var(--radius-sm)] border border-[var(--border)]">
                  "{simulationResult.reasoning}"
                </p>
              </div>
            </div>
          </div>
        </Scroll3DCard>
      </div>
    </section>
  );
};
