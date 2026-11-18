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
    // Trucks depart starting at L3 (8.0s + stagger delay)
    const dispatchTime = 8.0 + truck.delay;
    const arriveStoreTime = dispatchTime + truck.travelDuration;
    const departStoreTime = arriveStoreTime + truck.dwellDuration;
    const returnDcTime = departStoreTime + truck.returnDuration;

    if (t < dispatchTime) {
      truckProgress[truck.id] = 0.0;
      storeArrivals[truck.targetStoreId] = false;
      storeRefills[truck.targetStoreId] = 0.0;
    } else if (t < arriveStoreTime) {
      // Outbound from DC dock to store loading bay (0.0 -> 1.0)
      const outboundElapsed = t - dispatchTime;
      truckProgress[truck.id] = Math.min(
        0.999,
        Math.max(0.0, outboundElapsed / truck.travelDuration)
      );
      storeArrivals[truck.targetStoreId] = false;
      storeRefills[truck.targetStoreId] = 0.0;
    } else if (t < departStoreTime) {
      // Docked at store unloading cargo (progress = 1.0)
      truckProgress[truck.id] = 1.0;
      storeArrivals[truck.targetStoreId] = true;
      const timeSinceArrival = Math.max(0.0, t - arriveStoreTime);
      storeRefills[truck.targetStoreId] = Math.min(1.0, timeSinceArrival / 1.0);
    } else if (t < returnDcTime) {
      // Returning from store back to DC dock (1.0 -> 2.0)
      const returnElapsed = t - departStoreTime;
      const returnFrac = Math.min(
        1.0,
        Math.max(0.0, returnElapsed / truck.returnDuration)
      );
      truckProgress[truck.id] = 1.0 + returnFrac;
      storeArrivals[truck.targetStoreId] = true;
      storeRefills[truck.targetStoreId] = 1.0;
    } else {
      // Returned and parked squarely back at DC dock (2.0 -> seamless with 0.0)
      truckProgress[truck.id] = 2.0;
      storeArrivals[truck.targetStoreId] = true;
      storeRefills[truck.targetStoreId] = 1.0;
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

  // Damped current time (start at 1.8s so Telegram card immediately animates in on load)
  const [dampedTime, setDampedTime] = useState<number>(1.8);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const dampedTimeRef = useRef(dampedTime);
  const targetTimeRef = useRef(1.8);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Sync ref
  useEffect(() => {
    dampedTimeRef.current = dampedTime;
  }, [dampedTime]);

  // Update target time when scrollProgress changes (Scroll-driven mode)
  useEffect(() => {
    if (isScrollDriven) {
      targetTimeRef.current = Math.max(
        0.0,
        Math.min(CINEMATIC_CONFIG.totalDuration, scrollProgress * CINEMATIC_CONFIG.totalDuration)
      );
    }
  }, [scrollProgress, isScrollDriven]);

  // Main animation / damping loop (runs continuously regardless of OS reduced-motion setting)
  useEffect(() => {
    const lerp = CINEMATIC_CONFIG.scrollSettings.lerpFactor;

    const tick = (timestamp: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = timestamp;

      if (isScrollDriven) {
        const diff = targetTimeRef.current - dampedTimeRef.current;
        if (Math.abs(diff) > 0.0005) {
          const next = dampedTimeRef.current + diff * lerp;
          dampedTimeRef.current = next;
          setDampedTime(next);
        } else if (dampedTimeRef.current !== targetTimeRef.current) {
          dampedTimeRef.current = targetTimeRef.current;
          setDampedTime(targetTimeRef.current);
        }
      } else if (autoPlay && !isPaused) {
        let next = dampedTimeRef.current + dt;
        if (next >= CINEMATIC_CONFIG.totalDuration) {
          next = next % CINEMATIC_CONFIG.totalDuration;
        }
        dampedTimeRef.current = next;
        targetTimeRef.current = next;
        setDampedTime(next);
      }

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [isScrollDriven, autoPlay, isPaused]);

  // Jump to phase directly (for phase dots & interactive triggers)
  const jumpToPhase = useCallback((phaseIdx: number) => {
    const p = CINEMATIC_CONFIG.phases[phaseIdx];
    if (p) {
      const target = p.start + 0.05;
      targetTimeRef.current = target;
      dampedTimeRef.current = target;
      setDampedTime(target);
    }
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Evaluate pure timeline at current damped time
  const timeline = evaluateTimeline(dampedTime);

  return {
    ...timeline,
    jumpToPhase,
    isPaused,
    togglePause,
    isScrollDriven,
  };
}
