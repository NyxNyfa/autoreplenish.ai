import { type FC } from "react";
import { Html } from "@react-three/drei";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface MapPinProps {
  code: string;
  name: string;
  fillPct: number;
  hasRisk?: boolean;
  hasPendingReq?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export const MapPin: FC<MapPinProps> = ({
  code,
  name,
  fillPct,
  hasRisk = false,
  hasPendingReq = false,
  isSelected = false,
  onClick,
}) => {
  return (
    <Html position={[0, 6.2, 0]} center distanceFactor={32} zIndexRange={[50, 0]}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 shadow-md cursor-pointer select-none active:scale-95 ${
          isSelected
            ? "bg-blue-600 text-white ring-4 ring-blue-500/20 scale-105"
            : hasRisk || hasPendingReq
            ? "bg-white/95 backdrop-blur-md text-neutral-800 border border-rose-300 hover:border-rose-500 hover:shadow-lg"
            : "bg-white/90 backdrop-blur-md text-neutral-700 border border-neutral-200/80 hover:border-blue-400 hover:shadow-lg"
        }`}
      >
        {/* Status dot */}
        {hasRisk || hasPendingReq ? (
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
        ) : (
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        )}

        {/* Code & Name */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold tracking-tight">{code}</span>
            <span className="text-[10px] opacity-75 font-normal">({fillPct}%)</span>
          </div>
          <span className="text-[9px] opacity-60 leading-tight hidden group-hover:inline-block">
            {name}
          </span>
        </div>

        {/* Icons */}
        {hasPendingReq ? (
          <AlertCircle className={`h-3 w-3 ${isSelected ? "text-amber-200" : "text-amber-500"}`} />
        ) : (
          <CheckCircle2 className={`h-3 w-3 opacity-60 ${isSelected ? "text-white" : "text-emerald-500"}`} />
        )}
      </button>
    </Html>
  );
};
