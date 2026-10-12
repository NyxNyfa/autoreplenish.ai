import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BentoGridProps {
  className?: string;
  children?: ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto",
        className
      )}
      style={{ perspective: "1200px" }}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  title,
  description,
  icon,
  badge,
  className,
  children,
  colSpan = 1,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
  badge?: string;
  className?: string;
  children?: ReactNode;
  colSpan?: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "center center"],
  });

  const rotateX: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [14, 0]);
  const scale: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [0.93, 1]);
  const opacity: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [0.75, 1]);
  const translateY: MotionValue<number> = useTransform(scrollYProgress, [0, 1], [25, 0]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "w-full h-full",
        colSpan === 2 && "md:col-span-2",
        colSpan === 3 && "md:col-span-2 lg:col-span-3"
      )}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          translateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{
          y: -4,
          transition: { duration: 0.2 },
        }}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 md:p-7 backdrop-blur-xl transition-all duration-300",
          "hover:border-[var(--accent)] hover:shadow-[0_0_40px_-10px_rgba(217,119,87,0.22)]",
          "shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)] h-full",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-hover)] text-[var(--accent)] border border-[var(--border)] group-hover:border-[var(--accent)] group-hover:scale-105 transition-all">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                {title}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
          {badge && (
            <span className="shrink-0 inline-flex items-center rounded-[var(--radius-sm)] bg-[var(--surface-active)] px-2.5 py-1 text-xs font-mono font-medium text-[var(--accent)] border border-[var(--border)]">
              {badge}
            </span>
          )}
        </div>

        <div className="relative flex-1 w-full rounded-[var(--radius-md)] overflow-hidden mt-2">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
