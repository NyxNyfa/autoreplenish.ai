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
      className={cn("w-full relative py-2", containerClassName)}
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
        className={cn(
          "relative w-full transition-all duration-300",
          className
        )}
      >
        {children}
      </motion.div>
    </div>
  );
};
