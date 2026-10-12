import { Truck } from "lucide-react";
import type { FC } from "react";

/** Spinner ringan untuk fallback <Suspense> di dalam Canvas. */
export const Loader3D: FC = () => (
  <div className="flex flex-col items-center gap-3 text-[var(--text-muted)]">
    <Truck className="h-6 w-6 animate-bounce text-[#06b6d4]" />
    <p className="font-mono text-xs uppercase tracking-wider">memuat aset 3D…</p>
  </div>
);
