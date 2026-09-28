import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BentoGridProps {
  className?: string;
  children?: ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl mx-auto",
        className
      )}
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
  return (
    <div
      className={cn(
        "w-full h-full",
        colSpan === 2 && "md:col-span-2",
        colSpan === 3 && "md:col-span-2 lg:col-span-3"
      )}
    >
      <div
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-6 h-full",
          className
        )}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface-hover)] text-[var(--text-muted)] border border-[var(--border)]">
                {icon}
              </div>
            )}
            <div>
              <h3 className="text-[16px] font-bold leading-[1.4] text-[var(--text)]">
                {title}
              </h3>
              <p className="text-[14px] leading-[1.7] text-[var(--text-muted)] mt-1">
                {description}
              </p>
            </div>
          </div>
          {badge && (
            <span className="shrink-0 inline-flex items-center rounded-[var(--radius-sm)] bg-[var(--surface-hover)] px-2 py-1 text-[12px] text-[var(--text-muted)] border border-[var(--border)]">
              {badge}
            </span>
          )}
        </div>

        <div className="relative flex-1 w-full rounded-[var(--radius-md)] overflow-hidden mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
