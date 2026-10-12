import { useState, useEffect, useRef, useCallback } from "react";
import { CINEMATIC_CONFIG } from "@/config/cinematic.config";

export interface TimelineState {
  currentTime: number;
  totalDuration: number;
  phase: "L0_IDLE" | "L1_MESSAGE" | "L2_APPROVE" | "L3_DISPATCH" | "L4_DELIVERY" | "L5_HOLD_RESET";
  phaseIndex: number;
  phaseConfig: (typeof CINEMATIC_CONFIG.phases)[number];
  phaseProgress: number;
  totalProgress: number;
  activeCaption: string | null;
  truckProgress: Record<string, number>;
  storeArrivals: Record<string, boolean>;
  storeRefills: Record<string, number>;
  discreteScreenState: string;
}

/**
 * PURE FUNCTION: Evaluates all cinematic elements strictly at time t in [0, totalDuration].
 * Enables bidirectional scrubbing with ZERO state accumulation or one-shot leaks.
 */
export function evaluateTimeline(rawTime: number): TimelineState {
  const TOTAL = CINEMATIC_CONFIG.totalDuration;
  const t = Math.max(0.0, Math.min(TOTAL, rawTime));

  // 1. Determine active phase
  let phaseIndex = 0;
  for (let i = 0; i < CINEMATIC_CONFIG.phases.length; i++) {
    const p = CINEMATIC_CONFIG.phases[i];
    if (t >= p.start) {
      phaseIndex = i;
    }
  }

  const phaseConfig = CINEMATIC_CONFIG.phases[phaseIndex];
  const phaseElapsed = Math.max(0.0, t - phaseConfig.start);
  const phaseProgress = Math.min(1.0, Math.max(0.0, phaseElapsed / phaseConfig.duration));
  const totalProgress = Math.min(1.0, Math.max(0.0, t / TOTAL));

  // 2. Derive truck fleet positions & store replenishment
  const truckProgress: Record<string, number> = {};
  const storeArrivals: Record<string, boolean> = {};
  const storeRefills: Record<string, number> = {};

  CINEMATIC_CONFIG.trucks.forEach((truck) => {
    // Trucks strictly depart starting at L3 (9.0s + stagger delay)
    const dispatchTime = 9.0 + truck.delay;

    if (t < dispatchTime) {
      truckProgress[truck.id] = 0.0;
      storeArrivals[truck.targetStoreId] = false;
      storeRefills[truck.targetStoreId] = 0.0;
    } else {
      const elapsed = t - dispatchTime;
      const progress = Math.min(1.0, Math.max(0.0, elapsed / truck.travelDuration));
      truckProgress[truck.id] = progress;
      const arrived = progress >= 0.999;
      storeArrivals[truck.targetStoreId] = arrived;

      if (arrived) {
        // Stock fills over 1.0 second after arrival
        const timeSinceArrival = Math.max(0.0, elapsed - truck.travelDuration);
        storeRefills[truck.targetStoreId] = Math.min(1.0, timeSinceArrival / 1.0);
      } else {
        storeRefills[truck.targetStoreId] = 0.0;
      }
    }
  });

  // 3. Compute discrete screen state index for CanvasTexture update gating
  const step =
    phaseIndex === 1
      ? Math.floor(phaseProgress * 20)
      : phaseIndex === 2
      ? Math.floor(phaseProgress * 12)
      : phaseIndex === 5
      ? Math.floor(phaseProgress * 12)
      : Math.floor(phaseProgress * 6);

  const discreteScreenState = `${phaseIndex}_${step}`;

  return {
    currentTime: t,
    totalDuration: TOTAL,
    phase: phaseConfig.id,
    phaseIndex,
    phaseConfig,
    phaseProgress,
    totalProgress,
    activeCaption: phaseConfig.caption,
    truckProgress,
    storeArrivals,
    storeRefills,
    discreteScreenState,
  };
}

export interface UseTimelineOptions {
  scrollProgress?: number;
  isScrollDriven?: boolean;
  autoPlay?: boolean;
}

/**
 * Hook providing damped timeline state with support for scroll-scrubbing and auto-play fallback.
 */
export function useTimeline(options: UseTimelineOptions = {}) {
  const {
    scrollProgress = 0,
    isScrollDriven = CINEMATIC_CONFIG.scrollDriven,
    autoPlay = true,
  } = options;

  const isReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Damped current time
  const [dampedTime, setDampedTime] = useState<number>(() => {
    if (isReducedMotion) return CINEMATIC_CONFIG.scrollSettings.reducedMotionTime;
    return 0.0;
  });

  const dampedTimeRef = useRef(dampedTime);
  const targetTimeRef = useRef(0.0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Sync ref
  useEffect(() => {
    dampedTimeRef.current = dampedTime;
  }, [dampedTime]);

  // Update target time when scrollProgress changes (Scroll-driven mode)
  useEffect(() => {
    if (isReducedMotion) return;
    if (isScrollDriven) {
      targetTimeRef.current = Math.max(
        0.0,
        Math.min(CINEMATIC_CONFIG.totalDuration, scrollProgress * CINEMATIC_CONFIG.totalDuration)
      );
    }
  }, [scrollProgress, isScrollDriven, isReducedMotion]);

  // Main animation / damping loop
  useEffect(() => {
    if (isReducedMotion) return;

    const lerp = CINEMATIC_CONFIG.scrollSettings.lerpFactor;

    const tick = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (isScrollDriven) {
        // Damping: smooth interpolation towards targetTimeRef
        const diff = targetTimeRef.current - dampedTimeRef.current;
        if (Math.abs(diff) > 0.0005) {
          const next = dampedTimeRef.current + diff * lerp;
          dampedTimeRef.current = next;
          setDampedTime(next);
        } else if (dampedTimeRef.current !== targetTimeRef.current) {
          dampedTimeRef.current = targetTimeRef.current;
          setDampedTime(targetTimeRef.current);
        }
      } else if (autoPlay) {
        // Auto-loop mode fallback
        let next = dampedTimeRef.current + dt;
        if (next >= CINEMATIC_CONFIG.totalDuration) {
          next = next % CINEMATIC_CONFIG.totalDuration;
        }
        dampedTimeRef.current = next;
        setDampedTime(next);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isScrollDriven, autoPlay, isReducedMotion]);

  // Jump to phase directly (for phase dots clicking)
  const jumpToPhase = useCallback((phaseIdx: number) => {
    const p = CINEMATIC_CONFIG.phases[phaseIdx];
    if (p) {
      targetTimeRef.current = p.start;
      dampedTimeRef.current = p.start;
      setDampedTime(p.start);
    }
  }, []);

  // Evaluate pure timeline at current damped time
  const timeline = evaluateTimeline(dampedTime);

  return {
    ...timeline,
    jumpToPhase,
    isScrollDriven,
  };
}
