import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface Scroll3DCardProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  rotateDeg?: number;
  scaleFrom?: number;
}

export const Scroll3DCard = ({
  children,
  className,
  containerClassName,
  rotateDeg = 12,
  scaleFrom = 0.94,
}: Scroll3DCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const rotateX: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    [rotateDeg, 0]
  );
  const scale: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    [scaleFrom, 1]
  );
  const opacity: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    [0.75, 0.95, 1]
  );
  const translateY: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    [25, 0]
  );

  return (
    <div
      ref={ref}
      className={cn("w-full relative py-6", containerClassName)}
      style={{ perspective: "1200px" }}
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
          "relative w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8 backdrop-blur-xl transition-all duration-300",
          "hover:border-[var(--accent)] hover:shadow-[0_0_40px_-10px_rgba(217,119,87,0.22)]",
          "shadow-[0_15px_35px_-10px_rgba(0,0,0,0.5)]",
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
};
