import { type FC } from "react";
import { ScrollRig } from "./ScrollRig";
import { useTimeline } from "./useTimeline";
import { CinematicBackground } from "./CinematicBackground";
import { HeroOverlay } from "./HeroOverlay";

interface HeroSectionProps {
  onOpenDemo: () => void;
  onNavigateDemo: () => void;
}

export const HeroSection: FC<HeroSectionProps> = ({
  onOpenDemo,
  onNavigateDemo,
}) => {
  return (
    <ScrollRig>
      {({ scrollProgress, isScrollDriven, isInView }) => (
        <HeroInner
          scrollProgress={scrollProgress}
          isScrollDriven={isScrollDriven}
          isInView={isInView}
          onOpenDemo={onOpenDemo}
          onNavigateDemo={onNavigateDemo}
        />
      )}
    </ScrollRig>
  );
};

interface HeroInnerProps {
  scrollProgress: number;
  isScrollDriven: boolean;
  isInView: boolean;
  onOpenDemo: () => void;
  onNavigateDemo: () => void;
}

const HeroInner: FC<HeroInnerProps> = ({
  scrollProgress,
  isScrollDriven,
  isInView,
  onOpenDemo,
  onNavigateDemo,
}) => {
  const timeline = useTimeline({
    scrollProgress,
    isScrollDriven,
    autoPlay: isInView,
  });

  const handleScrollToCaraKerja = () => {
    const el = document.getElementById("cara-kerja") || document.getElementById("fitur");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div id="hero" className="relative w-full h-full overflow-hidden select-none">
      {/* 1. Full-Bleed 3D Background Canvas (z-0, pointer-events-none) */}
      <CinematicBackground
        phaseIndex={timeline.phaseIndex}
        phaseProgress={timeline.phaseProgress}
        isPlaying={isScrollDriven ? true : isInView}
        truckProgress={timeline.truckProgress}
        storeArrivals={timeline.storeArrivals}
        storeRefills={timeline.storeRefills}
      />

      {/* 2. Monospace DOM Content & Controls Overlay (z-10) */}
      <HeroOverlay
        phaseIndex={timeline.phaseIndex}
        totalProgress={timeline.totalProgress}
        scrollProgress={scrollProgress}
        isScrollDriven={isScrollDriven}
        activeCaption={timeline.activeCaption}
        storeArrivals={timeline.storeArrivals}
        storeRefills={timeline.storeRefills}
        onJumpToPhase={timeline.jumpToPhase}
        onOpenDemo={onOpenDemo}
        onNavigateDemo={onNavigateDemo}
        onScrollToFeatures={handleScrollToCaraKerja}
      />

      {/* 3. Soft reset fade-to-bg overlay (0.6s) during L5 (auto-play mode only) */}
      {!isScrollDriven &&
        timeline.phaseIndex === 5 &&
        timeline.phaseProgress >= 0.5 &&
        timeline.phaseProgress < 0.75 && (
          <div
            className="absolute inset-0 bg-[#161615] pointer-events-none transition-opacity duration-200 z-20"
            style={{
              opacity: Math.sin(Math.min(1.0, (timeline.phaseProgress - 0.5) / 0.25) * Math.PI) * 0.9,
            }}
          />
        )}
    </div>
  );
};
