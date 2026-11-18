import { type FC } from "react";
import { Play, Pause, Zap } from "lucide-react";
import { CINEMATIC_CONFIG } from "@/config/cinematic.config";

interface CinematicControlsProps {
  phaseIndex: number;
  totalProgress: number;
  scrollProgress?: number;
  isScrollDriven?: boolean;
  isPaused?: boolean;
  onTogglePause?: () => void;
  onJumpToPhase?: (phaseIdx: number) => void;
}

const SHORT_LABELS = ["Idle", "Alert", "PR SAP", "Dispatch", "Restock", "Aman"];

export const CinematicControls: FC<CinematicControlsProps> = ({
  phaseIndex,
  totalProgress,
  scrollProgress,
  isScrollDriven = CINEMATIC_CONFIG.scrollDriven,
  isPaused = false,
  onTogglePause,
  onJumpToPhase,
}) => {
  // Use scrollProgress in scroll-driven mode, fallback to totalProgress
  const displayProgress =
    isScrollDriven && scrollProgress !== undefined ? scrollProgress : totalProgress;

  return (
    <div className="pointer-events-auto flex flex-col items-start gap-2 select-none">
      {/* 1. Interactive Phase Dots + Play/Pause + Instant Dispatch Trigger */}
      <div className="flex flex-wrap items-center gap-1.5">
        {onTogglePause && (
          <button
            onClick={onTogglePause}
            className="inline-flex items-center justify-center w-6 h-6 rounded-[6px] bg-[#1F1E1D] hover:bg-[#2A2927] border border-[#3D3C39] text-[#FAF9F5] transition-colors cursor-pointer"
            title={isPaused ? "Lanjutkan Animasi Loop" : "Jeda Animasi"}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            {isPaused ? (
              <Play className="w-3 h-3 text-[#D97757]" />
            ) : (
              <Pause className="w-3 h-3 text-[#A3A199]" />
            )}
          </button>
        )}

        <div className="flex items-center gap-1 px-1.5 py-1 rounded-[6px] bg-[#1F1E1D]/90 border border-[#3D3C39]">
          {CINEMATIC_CONFIG.phases.map((p, idx) => {
            const isActive = phaseIndex === idx;
            const isPassed = phaseIndex > idx;
            return (
              <button
                key={p.id}
                onClick={() => onJumpToPhase?.(idx)}
                className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] text-[10px] transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#2A2927] text-[#FAF9F5] border border-[#D97757]/60"
                    : "text-[#A3A199] hover:text-[#FAF9F5] hover:bg-[#2A2927]/50"
                }`}
                title={`${p.name}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isActive
                      ? "bg-[#D97757]"
                      : isPassed
                      ? "bg-[#A3A199]"
                      : "bg-[#3D3C39]"
                  }`}
                />
                <span className="hidden md:inline">{SHORT_LABELS[idx]}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onJumpToPhase?.(2)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-[#1F1E1D] hover:bg-[#2A2927] border border-[#D97757]/60 text-[#D97757] text-[11px] font-medium transition-colors cursor-pointer"
          title="Simulasikan 1-Click Approve Telegram & Keberangkatan Truk DC"
        >
          <Zap className="w-3 h-3" />
          <span>Approve & Dispatch</span>
        </button>
      </div>

      {/* 2. Thin 1px-like progress line with clay --accent fill */}
      <div className="w-56 sm:w-72 h-[3px] bg-[#1F1E1D] border border-[#3D3C39] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#D97757] transition-all duration-75"
          style={{ width: `${Math.min(100, Math.max(0, displayProgress * 100))}%` }}
        />
      </div>
    </div>
  );
};
