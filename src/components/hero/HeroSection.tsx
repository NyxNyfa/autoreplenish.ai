import { useState, type FC } from "react";
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
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

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

  const handleSelectStore = (siteId: string | null) => {
    if (siteId === "DC-01") {
      timeline.jumpToPhase(3);
      return;
    }
    setSelectedStoreId((prev) => (prev === siteId ? null : siteId));
  };

  return (
    <div id="hero" className="relative w-full h-full overflow-hidden select-none">
      {/* 1. Full-Bleed 3D Background Canvas (z-0, interactive) */}
      <CinematicBackground
        phaseIndex={timeline.phaseIndex}
        phaseProgress={timeline.phaseProgress}
        scrollProgress={scrollProgress}
        isPlaying={isScrollDriven ? true : isInView}
        truckProgress={timeline.truckProgress}
        storeArrivals={timeline.storeArrivals}
        storeRefills={timeline.storeRefills}
        selectedStoreId={selectedStoreId}
        onSelectStore={handleSelectStore}
        onTriggerApprove={() => timeline.jumpToPhase(2)}
      />

      {/* 2. Smooth Bottom Hand-off into #2A2825 (Top of CaraKerja) so Hero stays bright */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-36 z-[5] bg-gradient-to-t from-[#2A2825] via-[#2A2825]/60 to-transparent"
      />

      {/* 3. Monospace DOM Content & Controls Overlay (z-10) */}
      <HeroOverlay
        phaseIndex={timeline.phaseIndex}
        totalProgress={timeline.totalProgress}
        scrollProgress={scrollProgress}
        isScrollDriven={isScrollDriven}
        isPaused={timeline.isPaused}
        onTogglePause={timeline.togglePause}
        activeCaption={timeline.activeCaption}
        storeArrivals={timeline.storeArrivals}
        storeRefills={timeline.storeRefills}
        selectedStoreId={selectedStoreId}
        onSelectStore={handleSelectStore}
        onJumpToPhase={timeline.jumpToPhase}
        onOpenDemo={onOpenDemo}
        onNavigateDemo={onNavigateDemo}
        onScrollToFeatures={handleScrollToCaraKerja}
      />
    </div>
  );
};
