import type { FC } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  FastForward,
  CheckCircle2,
  X,
} from "lucide-react";
import { useTwinStore } from "@/store/useTwinStore";

export const CameraControlsOverlay: FC = () => {
  const zoomIn = useTwinStore((s) => s.zoomIn);
  const zoomOut = useTwinStore((s) => s.zoomOut);
  const resetCamera = useTwinStore((s) => s.resetCamera);
  const isSimulating = useTwinStore((s) => s.isSimulating);
  const toggleSimulation = useTwinStore((s) => s.toggleSimulation);
  const simSpeed = useTwinStore((s) => s.simSpeed);
  const setSimSpeed = useTwinStore((s) => s.setSimSpeed);
  const toastMessage = useTwinStore((s) => s.toastMessage);
  const clearToast = useTwinStore((s) => s.clearToast);

  return (
    <>
      {/* Toast Notification at Top Center */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-lg w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className="p-3.5 rounded-2xl bg-neutral-900/95 backdrop-blur-xl text-white shadow-2xl border border-white/10 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="leading-snug">{toastMessage}</span>
            </div>
            <button
              onClick={clearToast}
              className="p-1 rounded-full text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Camera & Sim Controls (Center-Right or Center-Bottom) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-none">
        <div className="p-1.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl shadow-slate-200/50 flex flex-col gap-1 pointer-events-auto">
          {/* Zoom In */}
          <button
            onClick={zoomIn}
            className="p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer active:scale-95"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={zoomOut}
            className="p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer active:scale-95"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          {/* Reset / Home Camera */}
          <button
            onClick={resetCamera}
            className="p-2.5 rounded-xl hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer active:scale-95"
            title="Reset Sudut Pandang"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <div className="h-px bg-neutral-200 my-0.5" />

          {/* Play / Pause Simulation */}
          <button
            onClick={toggleSimulation}
            className={`p-2.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
              isSimulating
                ? "bg-blue-50 text-blue-600 font-bold"
                : "bg-amber-50 text-amber-700"
            }`}
            title={isSimulating ? "Jeda Simulasi" : "Lanjutkan Simulasi"}
          >
            {isSimulating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          {/* Speed Toggle: 1x, 2x, 5x */}
          <button
            onClick={() => {
              if (simSpeed === 1) setSimSpeed(2);
              else if (simSpeed === 2) setSimSpeed(5);
              else setSimSpeed(1);
            }}
            className="p-2 rounded-xl hover:bg-neutral-100 text-[11px] font-black font-mono text-neutral-700 transition-colors cursor-pointer active:scale-95 flex items-center justify-center gap-0.5"
            title="Kecepatan Simulasi"
          >
            <FastForward className="h-3 w-3 text-neutral-400" />
            <span>{simSpeed}x</span>
          </button>
        </div>
      </div>
    </>
  );
};
