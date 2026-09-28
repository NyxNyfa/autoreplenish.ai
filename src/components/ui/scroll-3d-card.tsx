import type { ReactNode } from "react";
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
}: Scroll3DCardProps) => {
  return (
    <div className={cn("w-full relative py-4", containerClassName)}>
      <div
        className={cn(
          "relative w-full rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
