import { type FC } from "react";
import { CINEMATIC_CONFIG } from "@/config/cinematic.config";

interface CinematicControlsProps {
  phaseIndex: number;
  totalProgress: number;
  scrollProgress?: number;
  isScrollDriven?: boolean;
  onJumpToPhase?: (phaseIdx: number) => void;
}

export const CinematicControls: FC<CinematicControlsProps> = ({
  phaseIndex,
  totalProgress,
  scrollProgress,
  isScrollDriven = CINEMATIC_CONFIG.scrollDriven,
  onJumpToPhase,
}) => {
  // Use scrollProgress in scroll-driven mode, fallback to totalProgress
  const displayProgress =
    isScrollDriven && scrollProgress !== undefined ? scrollProgress : totalProgress;

  return (
    <div className="pointer-events-auto flex flex-col items-start gap-2.5 select-none">
      {/* 1. Phase Dots (L0 - L5) */}
      <div className="flex items-center gap-2 px-1">
        {CINEMATIC_CONFIG.phases.map((p, idx) => {
          const isActive = phaseIndex === idx;
          const isPassed = phaseIndex > idx;
          return (
            <button
              key={p.id}
              onClick={() => onJumpToPhase?.(idx)}
              className="p-1 cursor-pointer group"
              title={`${p.name} (${p.start}s)`}
              aria-label={p.name}
            >
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  isActive
                    ? "bg-[#D97757] ring-2 ring-[#D97757]/40"
                    : isPassed
                    ? "bg-[#A3A199]"
                    : "bg-[#3D3C39] hover:bg-[#6E6C66]"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* 2. Thin 1px-like progress line with clay --accent fill */}
      <div className="w-44 sm:w-56 h-[3px] bg-[#1F1E1D] border border-[#3D3C39] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#D97757] transition-all duration-75"
          style={{ width: `${Math.min(100, Math.max(0, displayProgress * 100))}%` }}
        />
      </div>
    </div>
  );
};
