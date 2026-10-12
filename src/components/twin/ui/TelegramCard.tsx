import { useState, type FC } from "react";
import {
  CheckCircle2,
  Edit3,
  XCircle,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  X,
} from "lucide-react";
import { useTwinStore } from "@/store/useTwinStore";

export const TelegramCard: FC = () => {
  const activeRecommendationId = useTwinStore((s) => s.activeRecommendationId);
  const recommendations = useTwinStore((s) => s.recommendations);
  const approveRecommendation = useTwinStore((s) => s.approveRecommendation);
  const rejectRecommendation = useTwinStore((s) => s.rejectRecommendation);
  const editRecommendationQty = useTwinStore((s) => s.editRecommendationQty);
  const closeRecommendation = useTwinStore((s) => s.closeRecommendation);

  const [mode, setMode] = useState<"view" | "edit" | "reject">("view");
  const [customQty, setCustomQty] = useState<number>(24);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [editReason, setEditReason] = useState<string>("");
  const [qtyError, setQtyError] = useState<string | null>(null);

  const rec = recommendations.find((r) => r.id === activeRecommendationId);

  if (!rec || rec.status !== "PENDING_APPROVAL") return null;

  const handleQtyChange = (val: number) => {
    setCustomQty(val);
    if (val <= 0) {
      setQtyError("Jumlah harus lebih dari 0.");
    } else if (val % rec.packagingMultiple !== 0) {
      setQtyError(`Jumlah harus kelipatan kemasan (${rec.packagingMultiple} pcs per dus).`);
    } else {
      setQtyError(null);
    }
  };

  const handleConfirmEdit = () => {
    if (customQty <= 0 || customQty % rec.packagingMultiple !== 0) {
      setQtyError(`Wajib kelipatan ${rec.packagingMultiple} pcs.`);
      return;
    }
    editRecommendationQty(rec.id, customQty, editReason || "Kebutuhan display tambahan");
    setMode("view");
  };

  const handleConfirmReject = () => {
    rejectRecommendation(rec.id, rejectReason || "Stok di rak dinilai masih memadai.");
    setMode("view");
  };

  return (
    <div
      onClick={closeRecommendation}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[440px] bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden text-neutral-800 text-xs font-sans pointer-events-auto"
      >
        {/* Telegram Header Style Bar */}
        <div className="bg-[#242f3d] text-white p-3.5 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#2AABEE] to-[#229ED9] flex items-center justify-center font-bold text-xs shadow-sm">
              AR
            </div>
            <div>
              <div className="font-semibold text-xs flex items-center gap-1">
                <span>AutoReplenish Bot</span>
                <span className="text-[10px] px-1 rounded bg-[#2AABEE]/20 text-[#2AABEE]">Verified</span>
              </div>
              <div className="text-[10px] text-slate-300">Human-in-the-Loop Approval</div>
            </div>
          </div>
          <button
            onClick={closeRecommendation}
            className="text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Telegram Message Box replicating PRD Section 27 EXACTLY */}
        <div className="p-4 sm:p-5 space-y-3 bg-[#f3f4f8]">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-2.5">
            {/* PRD Message Title */}
            <div className="font-extrabold text-neutral-900 text-xs border-b border-neutral-100 pb-1.5 flex items-center gap-1.5">
              <span>📦 AUTOREPLENISH.AI — Rekomendasi Replenishment Stok</span>
            </div>

            {/* Store & SKU */}
            <div className="space-y-0.5 text-neutral-700">
              <div>
                <strong>Toko:</strong> {rec.storeName} ({rec.areaType})
              </div>
              <div>
                <strong>SKU:</strong> {rec.skuName} ({rec.category})
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 p-2 rounded-xl bg-neutral-50 text-[11px] text-neutral-700 border border-neutral-100">
              <div>
                Stok Fisik: <span className="font-bold text-rose-600">{rec.physicalStock} Pcs</span>
              </div>
              <div>
                Threshold: <span className="font-bold">{rec.threshold} Pcs</span>
              </div>
              <div>
                Lead Time: <span>{rec.leadTime}</span>
              </div>
              <div>
                Cuaca: <span>{rec.weatherCondition}</span>
              </div>
            </div>

            {/* 🧠 Analisis Agent (AWS Bedrock) */}
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/80 text-blue-950 space-y-1">
              <div className="font-bold flex items-center gap-1 text-[11px] text-blue-900">
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>🧠 Analisis Agent (AWS Bedrock):</span>
              </div>
              <p className="text-[11px] leading-relaxed italic">
                "{rec.reasoningNarrative}"
              </p>
            </div>

            {/* 💡 Rekomendasi vs Normal */}
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
              <div className="font-bold text-emerald-900">
                💡 Rekomendasi: <span className="text-emerald-700 font-black">{rec.recommendedQty} Pcs</span> ({Math.ceil(rec.recommendedQty / rec.packagingMultiple)} Dus)
              </div>
              <div className="text-[11px] text-neutral-400 line-through">
                Normal: {rec.normalQty} Pcs
              </div>
            </div>
          </div>

          {/* Action Modes */}
          {mode === "view" && (
            <div className="grid grid-cols-3 gap-2 pt-1 font-semibold">
              <button
                onClick={() => approveRecommendation(rec.id)}
                className="py-2.5 px-2 rounded-xl bg-[#2ea6ff] hover:bg-[#1e96ee] text-white text-[11px] font-bold shadow-md transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer text-center"
              >
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Approve & SAP</span>
              </button>

              <button
                onClick={() => {
                  setCustomQty(rec.recommendedQty);
                  setMode("edit");
                }}
                className="py-2.5 px-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-700 text-[11px] font-bold shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer text-center"
              >
                <Edit3 className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span>Ubah Jumlah</span>
              </button>

              <button
                onClick={() => setMode("reject")}
                className="py-2.5 px-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 text-rose-600 text-[11px] font-bold shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer text-center"
              >
                <XCircle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                <span>Tolak</span>
              </button>
            </div>
          )}

          {/* Mode: Ubah Jumlah with MOQ & packaging-multiple validation */}
          {mode === "edit" && (
            <div className="p-3.5 rounded-2xl bg-white border border-neutral-300 space-y-2.5 animate-in fade-in duration-150">
              <div className="font-bold text-neutral-900 flex items-center justify-between">
                <span>Ubah Jumlah Order ({rec.skuName})</span>
                <span className="text-[10px] text-neutral-500">
                  Kelipatan {rec.packagingMultiple} pcs
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step={rec.packagingMultiple}
                    min={rec.packagingMultiple}
                    value={customQty}
                    onChange={(e) => handleQtyChange(parseInt(e.target.value) || 0)}
                    className="w-24 px-3 py-1.5 rounded-xl border border-neutral-300 text-center font-bold text-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-neutral-600 text-xs">
                    Pcs ({Math.floor(customQty / rec.packagingMultiple)} dus)
                  </span>
                </div>

                {qtyError && (
                  <p className="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {qtyError}
                  </p>
                )}
                {customQty > rec.normalQty && (
                  <p className="text-[10px] text-amber-600 font-semibold mt-1">
                    ⚠️ Peringatan Overstock: Jumlah melebihi kuota normal ({rec.normalQty} pcs).
                  </p>
                )}
              </div>

              <input
                type="text"
                placeholder="Alasan perubahan (cth: rak display promo)..."
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleConfirmEdit}
                  disabled={!!qtyError}
                  className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Konfirmasi & Kirim ke SAP
                </button>
                <button
                  onClick={() => setMode("view")}
                  className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          )}

          {/* Mode: Tolak with inline reason input */}
          {mode === "reject" && (
            <div className="p-3.5 rounded-2xl bg-white border border-rose-200 space-y-2.5 animate-in fade-in duration-150">
              <div className="font-bold text-rose-900 flex items-center gap-1">
                <ShieldAlert className="h-4 w-4 text-rose-600" />
                <span>Alasan Penolakan Rekomendasi</span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Feedback Anda akan dimasukkan ke dataset penalaran model AWS Bedrock berikutnya.
              </p>
              <textarea
                rows={2}
                placeholder="Tulis alasan penolakan..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleConfirmReject}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  Kirim Feedback & Tolak
                </button>
                <button
                  onClick={() => setMode("view")}
                  className="px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
