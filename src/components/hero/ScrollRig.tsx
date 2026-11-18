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

  const isScrollDriven = CINEMATIC_CONFIG.scrollDriven;

  // Passive scroll listener + rAF (tracks both scrollDriven track or 100vh hero parallax)
  useEffect(() => {
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
          const totalScrollable = Math.max(
            el.offsetHeight - window.innerHeight,
            window.innerHeight * 0.85
          );

          const currentScroll = -rect.top;
          const progress = Math.max(0.0, Math.min(1.0, currentScroll / totalScrollable));
          setScrollProgress(progress);

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
  }, []);

  // IntersectionObserver for off-screen auto-pause to save GPU when scrolled far down
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const trackHeight = isScrollDriven ? "420vh" : "100dvh";

  return (
    <div
      ref={containerRef}
      id="hero-scroll-rig"
      className="relative w-full"
      style={{ height: trackHeight, minHeight: "640px" }}
    >
      {/* Sticky viewport container */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] min-h-[640px] overflow-hidden select-none bg-[#2C2A27]">
        {children({
          scrollProgress,
          isScrollDriven,
          isInView,
        })}
      </div>
    </div>
  );
};
