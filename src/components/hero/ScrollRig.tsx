import { useRef, useState, useEffect, type FC, type ReactNode } from "react";
import { CINEMATIC_CONFIG } from "@/config/cinematic.config";

interface ScrollRigProps {
  children: (props: {
    scrollProgress: number;
    isScrollDriven: boolean;
    isInView: boolean;
  }) => ReactNode;
}

export const ScrollRig: FC<ScrollRigProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInView, setIsInView] = useState(true);

  const isReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const isScrollDriven = CINEMATIC_CONFIG.scrollDriven && !isReducedMotion;

  // Passive scroll listener + rAF
  useEffect(() => {
    if (!isScrollDriven) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const el = containerRef.current;
          if (!el) {
            ticking = false;
            return;
          }

          const rect = el.getBoundingClientRect();
          const totalScrollable = el.offsetHeight - window.innerHeight;

          if (totalScrollable <= 0) {
            setScrollProgress(0);
          } else {
            // How far down the top of container has scrolled past viewport top
            const currentScroll = -rect.top;
            const progress = Math.max(0.0, Math.min(1.0, currentScroll / totalScrollable));
            setScrollProgress(progress);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrollDriven]);

  // IntersectionObserver for off-screen auto-pause in fallback mode
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // In scroll mode: 420vh track; in fallback/reduced-motion: 100vh
  const trackHeight = isScrollDriven ? "420vh" : "100vh";

  return (
    <div
      ref={containerRef}
      id="hero-scroll-rig"
      className="relative w-full"
      style={{ height: trackHeight }}
    >
      {/* Sticky viewport container (100dvh on mobile, h-screen on desktop) */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden select-none bg-[#161615] border-b border-[#3D3C39]">
        {children({
          scrollProgress,
          isScrollDriven,
          isInView,
        })}
      </div>
    </div>
  );
};
