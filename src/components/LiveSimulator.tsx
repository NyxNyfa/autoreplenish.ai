import { useState, useMemo, type FC } from "react";

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
    name: "susu UHT full cream 1000ml",
    category: "perishable",
    baseDemand: 14,
    currentStock: 10,
    minMaxThreshold: 20,
    unitPrice: 22000,
    isPerishable: true,
  },
  {
    id: "SKU-002",
    name: "minyak goreng pouch 2L",
    category: "kebutuhan pokok",
    baseDemand: 35,
    currentStock: 25,
    minMaxThreshold: 40,
    unitPrice: 38000,
    isPerishable: false,
  },
  {
    id: "SKU-003",
    name: "es krim cup vanilla 110ml",
    category: "sensitif cuaca panas",
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
    const staticStockout =
      currentSku.currentStock + staticRecommendation < totalNeededTillNextDrop;
    const staticOverstock =
      currentSku.isPerishable &&
      staticRecommendation > projectedDailyDemand * 2.5;

    let reasoning = "";
    if (dayType === "weekend") {
      reasoning += "akhir pekan menaikkan traffic sekitar 45%. ";
    }
    if (promo === "jsm") {
      reasoning += "promo JSM menaikkan perputaran sekitar 65%. ";
    }
    if (currentSku.id === "SKU-003" && weather === "hot") {
      reasoning += "cuaca panas menaikkan penjualan es krim sekitar 80%. ";
    }
    reasoning += `sisa ${currentSku.currentStock} pcs, truk ${leadTime} hari lagi. saran ${aiRecommendation} pcs agar tidak kosong.`;

    const potentialLostSales = staticStockout
      ? (totalNeededTillNextDrop -
          (currentSku.currentStock + staticRecommendation)) *
        currentSku.unitPrice
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

  const toggleBtn = (active: boolean) =>
    active
      ? "bg-[var(--surface-active)] text-[var(--text)] border border-[var(--border)]"
      : "bg-transparent text-[var(--text-muted)] border border-[var(--border)] hover:bg-[var(--surface-hover)]";

  return (
    <section id="simulasi" className="py-16 border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="max-w-[640px] mb-10">
          <p className="text-[12px] text-[var(--text-faint)] mb-2">simulasi</p>
          <h2 className="text-[16px] font-bold leading-[1.4] text-[var(--text)]">
            ubah kondisinya, lihat bedanya
          </h2>
          <p className="mt-3 text-[14px] leading-[1.7] text-[var(--text-muted)]">
            rumus lama pakai angka statis. simulasi ini pakai konteks yang sama
            seperti di toko: cuaca, promo, hari, dan jadwal truk.
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-[14px] font-bold text-[var(--text)]">input</h3>
              <span className="text-[12px] text-[var(--text-faint)]">kondisi hari ini</span>
            </div>

            <div className="space-y-2">
              <p className="text-[12px] text-[var(--text-muted)]">produk</p>
              <div className="grid grid-cols-1 gap-2">
                {skuList.map((sku) => (
                  <button
                    key={sku.id}
                    onClick={() => setSelectedSkuId(sku.id)}
                    className={`flex items-center justify-between p-3 rounded-[var(--radius-md)] border text-left cursor-pointer ${
                      selectedSkuId === sku.id
                        ? "bg-[var(--surface-active)] border-[var(--border)] text-[var(--text)]"
                        : "bg-[var(--bg)] border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                    }`}
                  >
                    <span>
                      <span className="block text-[14px] font-bold">{sku.name}</span>
                      <span className="block text-[12px] text-[var(--text-faint)] mt-0.5">
                        {sku.category} · stok {sku.currentStock} pcs
                      </span>
                    </span>
                    <span className="text-[13px] text-[var(--text-muted)]">
                      Rp {sku.unitPrice.toLocaleString("id-ID")}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[12px] text-[var(--text-muted)]">cuaca</p>
              <div className="grid grid-cols-2 gap-2 p-0.5 rounded-[var(--radius-md)] bg-[var(--surface-hover)] border border-[var(--border)]">
                <button
                  onClick={() => setWeather("hot")}
                  className={`p-2.5 rounded-[var(--radius-sm)] text-[13px] font-medium cursor-pointer ${toggleBtn(
                    weather === "hot"
                  )}`}
                >
                  panas terik
                </button>
                <button
                  onClick={() => setWeather("rain")}
                  className={`p-2.5 rounded-[var(--radius-sm)] text-[13px] font-medium cursor-pointer ${toggleBtn(
                    weather === "rain"
                  )}`}
                >
                  hujan
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="text-[12px] text-[var(--text-muted)]">promo</p>
                <button
                  onClick={() => setPromo(promo === "jsm" ? "none" : "jsm")}
                  className={`w-full p-2.5 rounded-[var(--radius-md)] border text-[13px] font-medium cursor-pointer ${toggleBtn(
                    promo === "jsm"
                  )}`}
                >
                  {promo === "jsm" ? "JSM aktif" : "harga normal"}
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[12px] text-[var(--text-muted)]">hari</p>
                <button
                  onClick={() =>
                    setDayType(dayType === "weekend" ? "weekday" : "weekend")
                  }
                  className={`w-full p-2.5 rounded-[var(--radius-md)] border text-[13px] font-medium cursor-pointer ${toggleBtn(
                    dayType === "weekend"
                  )}`}
                >
                  {dayType === "weekend" ? "akhir pekan" : "hari kerja"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[12px] text-[var(--text-muted)]">truk berikutnya</p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((days) => (
                  <button
                    key={days}
                    onClick={() => setLeadTime(days)}
                    className={`p-2 rounded-[var(--radius-md)] border text-[13px] text-center cursor-pointer ${toggleBtn(
                      leadTime === days
                    )}`}
                  >
                    {days} hari
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-[14px] font-bold text-[var(--text)]">hasil</h3>
              <span className="text-[12px] text-[var(--text-faint)]">
                {simulationResult.projectedDailyDemand} pcs/hari
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)]">
                <p className="text-[12px] text-[var(--text-faint)]">rumus lama</p>
                <p className="mt-1 text-[32px] font-medium leading-[1.2] text-[var(--text-muted)]">
                  {simulationResult.staticRecommendation}
                  <span className="text-[14px] text-[var(--text-faint)]"> pcs</span>
                </p>
                <p className="mt-2 text-[14px] text-[var(--text-muted)] leading-[1.7]">
                  tidak membaca lonjakan akhir pekan atau cuaca.
                </p>

                <div className="mt-4 pt-3 border-t border-[var(--border)] text-[12px]">
                  {simulationResult.staticStockout && (
                    <p className="text-[var(--text-muted)]">
                      [--] risiko kosong sebelum truk tiba.
                    </p>
                  )}
                  {simulationResult.staticOverstock && (
                    <p className="text-[var(--text-muted)]">
                      [--] risiko menumpuk untuk perishable.
                    </p>
                  )}
                  {!simulationResult.staticStockout &&
                    !simulationResult.staticOverstock && (
                      <p className="text-[var(--text-faint)]">
                        pas-pasan. rawan habis kalau ada lonjakan.
                      </p>
                    )}
                </div>
              </div>

              <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)]">
                <p className="text-[12px] text-[var(--text-faint)]">autoreplenish.ai</p>
                <p className="mt-1 text-[32px] font-medium leading-[1.2] text-[var(--text)]">
                  {simulationResult.aiRecommendation}
                  <span className="text-[14px] text-[var(--text-muted)]"> pcs</span>
                </p>
                <p className="mt-2 text-[14px] text-[var(--text-muted)] leading-[1.7]">
                  proyeksi {simulationResult.projectedDailyDemand} pcs/hari sampai
                  truk berikutnya.
                </p>

                <div className="mt-4 pt-3 border-t border-[var(--border)] text-[12px] text-[var(--text-muted)]">
                  [ok] rak aman, risiko basi rendah.
                </div>
              </div>
            </div>

            <div className="p-4 rounded-[var(--radius-lg)] bg-[var(--bg)] border border-[var(--border)]">
              <p className="text-[12px] text-[var(--text-faint)] mb-2">
                pesan yang diterima kepala toko
              </p>
              <p className="text-[14px] text-[var(--text-muted)] leading-[1.7]">
                &quot;{simulationResult.reasoning}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
