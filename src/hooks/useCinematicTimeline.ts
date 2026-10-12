import { useState, useEffect, useRef, useCallback } from "react";
import { CINEMATIC_CONFIG } from "@/config/cinematic.config";

export interface UseCinematicTimelineOptions {
  autoPlay?: boolean;
  loop?: boolean;
}

export function useCinematicTimeline(options: UseCinematicTimelineOptions = {}) {
  const { autoPlay = true, loop = true } = options;

  // Initialize with prefers-reduced-motion check
  const [currentTime, setCurrentTime] = useState<number>(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return 12.0; // Static mid-route frame for reduced motion
    }
    return 0;
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return autoPlay;
  });

  const isPlayingRef = useRef(isPlaying);
  const currentTimeRef = useRef(currentTime);
  const lastFrameTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Sync ref values
  useEffect(() => {
    isPlayingRef.current = isPlaying;
    currentTimeRef.current = currentTime;
  }, [isPlaying, currentTime]);

  // Handle visibility change (pause on background tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (isPlayingRef.current) {
          setIsPlaying(false);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Playback Loop
  useEffect(() => {
    if (!isPlaying) {
      lastFrameTimeRef.current = null;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    const loopFn = (timestamp: number) => {
      if (lastFrameTimeRef.current === null) {
        lastFrameTimeRef.current = timestamp;
      }

      // Delta time capped at 0.1s to avoid stutter jumps
      const dt = Math.min((timestamp - lastFrameTimeRef.current) / 1000, 0.1);
      lastFrameTimeRef.current = timestamp;

      let nextTime = currentTimeRef.current + dt;

      // Auto-loop handling at totalDuration (20s)
      if (nextTime >= CINEMATIC_CONFIG.totalDuration) {
        if (loop) {
          nextTime = nextTime % CINEMATIC_CONFIG.totalDuration;
        } else {
          nextTime = CINEMATIC_CONFIG.totalDuration;
          currentTimeRef.current = nextTime;
          setCurrentTime(nextTime);
          setIsPlaying(false);
          return;
        }
      }

      currentTimeRef.current = nextTime;
      setCurrentTime(nextTime);
      animFrameIdRef.current = requestAnimationFrame(loopFn);
    };

    animFrameIdRef.current = requestAnimationFrame(loopFn);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPlaying, loop]);

  // Determine current phase
  let currentPhaseIndex = 0;
  for (let i = 0; i < CINEMATIC_CONFIG.phases.length; i++) {
    const p = CINEMATIC_CONFIG.phases[i];
    if (currentTime >= p.start) {
      currentPhaseIndex = i;
    }
  }

  const currentPhaseConfig = CINEMATIC_CONFIG.phases[currentPhaseIndex];
  const phaseElapsed = Math.max(0, currentTime - currentPhaseConfig.start);
  const phaseProgress = Math.min(1.0, Math.max(0.0, phaseElapsed / currentPhaseConfig.duration));
  const totalProgress = Math.min(1.0, Math.max(0.0, currentTime / CINEMATIC_CONFIG.totalDuration));

  // Determine active caption
  const activeCaption = currentPhaseConfig.caption;

  // Calculate truck dispatch gating (ONLY moves from L3 = 9.0s onward)
  const truckProgress: Record<string, number> = {};
  const storeArrivals: Record<string, boolean> = {};
  const storeRefills: Record<string, number> = {};

  const isTruckActivePeriod = currentTime >= 9.0 && currentTime < 18.5;

  CINEMATIC_CONFIG.trucks.forEach((truck) => {
    if (!isTruckActivePeriod) {
      truckProgress[truck.id] = 0;
      storeArrivals[truck.targetStoreId] = false;
      storeRefills[truck.targetStoreId] = 0;
    } else {
      const dispatchTime = 9.0 + truck.delay;
      if (currentTime < dispatchTime) {
        truckProgress[truck.id] = 0;
        storeArrivals[truck.targetStoreId] = false;
        storeRefills[truck.targetStoreId] = 0;
      } else {
        const elapsed = currentTime - dispatchTime;
        const progress = Math.min(1.0, elapsed / truck.travelDuration);
        truckProgress[truck.id] = progress;
        const arrived = progress >= 0.999;
        storeArrivals[truck.targetStoreId] = arrived;

        if (arrived) {
          const timeSinceArrival = Math.max(0, elapsed - truck.travelDuration);
          storeRefills[truck.targetStoreId] = Math.min(1.0, timeSinceArrival / 1.0);
        } else {
          storeRefills[truck.targetStoreId] = 0;
        }
      }
    }
  });

  // Controls
  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      pause();
    } else {
      play();
    }
  }, [play, pause]);

  const replay = useCallback(() => {
    currentTimeRef.current = 0;
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  const skipToEnd = useCallback(() => {
    currentTimeRef.current = 17.0; // Jump to L5
    setCurrentTime(17.0);
  }, []);

  const jumpToPhase = useCallback((phaseIdx: number) => {
    const targetPhase = CINEMATIC_CONFIG.phases[phaseIdx];
    if (targetPhase) {
      currentTimeRef.current = targetPhase.start;
      setCurrentTime(targetPhase.start);
      setIsPlaying(true);
    }
  }, []);

  return {
    currentTime,
    totalDuration: CINEMATIC_CONFIG.totalDuration,
    phase: currentPhaseConfig.id,
    phaseIndex: currentPhaseIndex,
    phaseConfig: currentPhaseConfig,
    phaseProgress,
    totalProgress,
    isPlaying,
    isCompleted: currentTime >= CINEMATIC_CONFIG.totalDuration && !loop,
    activeCaption,
    truckProgress,
    storeArrivals,
    storeRefills,
    play,
    pause,
    togglePlay,
    replay,
    skipToEnd,
    jumpToPhase,
  };
}

export type UseCinematicTimelineReturn = ReturnType<typeof useCinematicTimeline>;
