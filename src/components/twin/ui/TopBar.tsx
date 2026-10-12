import { useState, type FC } from "react";
import {
  Layers,
  Search,
  ChevronDown,
  Clock,
  Bell,
  User,
  ArrowLeft,
  Building2,
  SlidersHorizontal,
} from "lucide-react";
import { useTwinStore } from "@/store/useTwinStore";

interface TopBarProps {
  onBackToLanding: () => void;
}

export const TopBar: FC<TopBarProps> = ({ onBackToLanding }) => {
  const stores = useTwinStore((s) => s.stores);
  const selectedEntity = useTwinStore((s) => s.selectedEntity);
  const focusSite = useTwinStore((s) => s.focusSite);
  const systemTime = useTwinStore((s) => s.systemTime);
  const userRole = useTwinStore((s) => s.userRole);
  const setUserRole = useTwinStore((s) => s.setUserRole);
  const recommendations = useTwinStore((s) => s.recommendations);
  const openRecommendation = useTwinStore((s) => s.openRecommendation);

  const [siteDropdownOpen, setSiteDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const pendingCount = recommendations.filter((r) => r.status === "PENDING_APPROVAL").length;

  const currentStoreId = selectedEntity?.type === "site" ? selectedEntity.id : "STR-001";
  const currentStore = stores.find((s) => s.id === currentStoreId) || stores[1];
  const fillPct = Math.round((currentStore.stockOnHandPallets / currentStore.capacityPallets) * 100);

  return (
    <header className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between gap-3 pointer-events-none">
      {/* Left: Brand Logo & Back Button */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 hover:bg-white backdrop-blur-md border border-neutral-200/80 shadow-md text-xs font-semibold text-neutral-700 hover:text-blue-600 transition-all cursor-pointer active:scale-95"
          title="Kembali ke Landing Page"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Landing Page</span>
        </button>

        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-md">
          <div className="h-7 w-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black tracking-tight text-neutral-900">
                AutoReplenish<span className="text-blue-600">.ai</span>
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 uppercase border border-blue-200">
                Twin
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-medium leading-none">
              Control Tower 3D
            </p>
          </div>
        </div>
      </div>

      {/* Center: Global Search & Site Selector Chip */}
      <div className="hidden md:flex items-center gap-2 pointer-events-auto">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari SKU, Truk, Cabang..."
            className="w-48 lg:w-60 pl-8 pr-3 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-neutral-200/80 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
          />
        </div>

        {/* Site Selector Chip */}
        <div className="relative">
          <button
            onClick={() => setSiteDropdownOpen(!siteDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-md hover:border-blue-400 text-xs text-neutral-800 transition-all cursor-pointer active:scale-95"
          >
            <Building2 className="h-3.5 w-3.5 text-blue-600" />
            <span className="font-bold text-blue-700">{currentStore.id}</span>
            <span className="text-neutral-600 font-medium hidden lg:inline">
              {currentStore.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-semibold">
              {fillPct}% fill
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
              {currentStore.occupiedBays}/{currentStore.totalBays} bay
            </span>
            <ChevronDown className="h-3 w-3 text-neutral-400" />
          </button>

          {/* Site Dropdown */}
          {siteDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white/98 backdrop-blur-xl border border-neutral-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1.5">
                Pilih Lokasi Jaringan
              </div>
              <div className="space-y-1">
                {stores.map((s) => {
                  const sFill = Math.round((s.stockOnHandPallets / s.capacityPallets) * 100);
                  const isCur = s.id === currentStore.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        focusSite(s.id);
                        setSiteDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                        isCur
                          ? "bg-blue-50 text-blue-900 border border-blue-200/80 font-bold"
                          : "hover:bg-neutral-50 text-neutral-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-bold text-blue-600">{s.id}</span>
                          <span>{s.name}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-normal">
                          Area {s.areaType}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold">{sFill}%</span>
                        <div className="text-[10px] text-neutral-400">
                          {s.occupiedBays} bay sibuk
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Live Clock, Notifications, User Role Switch */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Live Clock Chip */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md border border-neutral-200/80 shadow-md text-xs font-mono font-medium text-neutral-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Clock className="h-3.5 w-3.5 text-neutral-400" />
          <span>{systemTime}</span>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => {
            const pending = recommendations.find((r) => r.status === "PENDING_APPROVAL");
            if (pending) openRecommendation(pending.id);
          }}
          className="relative p-2.5 rounded-xl bg-white/90 hover:bg-white backdrop-blur-md border border-neutral-200/80 shadow-md text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer active:scale-95"
          title="Notifikasi Rekomendasi"
        >
          <Bell className="h-4 w-4" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              {pendingCount}
            </span>
          )}
        </button>

        {/* User Role Switch Chip */}
        <div className="relative">
          <button
            onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200/80 shadow-md hover:border-blue-400 text-xs text-neutral-800 transition-all cursor-pointer active:scale-95"
          >
            <div className="h-6 w-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold">
              {userRole === "kepala_toko" ? "KT" : "RM"}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-bold leading-none">
                {userRole === "kepala_toko" ? "Budi" : "Siti Rahma"}
              </div>
              <div className="text-[9px] text-neutral-500 capitalize">
                {userRole === "kepala_toko" ? "Kepala Toko" : "Regional Manager"}
              </div>
            </div>
            <SlidersHorizontal className="h-3 w-3 text-neutral-400" />
          </button>

          {roleDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white/98 backdrop-blur-xl border border-neutral-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1">
                Ganti Peran Pengguna
              </div>
              <button
                onClick={() => {
                  setUserRole("kepala_toko");
                  setRoleDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                  userRole === "kepala_toko"
                    ? "bg-blue-50 text-blue-900 font-bold"
                    : "hover:bg-neutral-50 text-neutral-700"
                }`}
              >
                <User className="h-4 w-4 text-blue-600" />
                <div>
                  <div>Kepala Toko</div>
                  <div className="text-[10px] text-neutral-400 font-normal">
                    Fokus approval cabang & reorder
                  </div>
                </div>
              </button>
              <button
                onClick={() => {
                  setUserRole("regional_manager");
                  setRoleDropdownOpen(false);
                }}
                className={`w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                  userRole === "regional_manager"
                    ? "bg-blue-50 text-blue-900 font-bold"
                    : "hover:bg-neutral-50 text-neutral-700"
                }`}
              >
                <User className="h-4 w-4 text-purple-600" />
                <div>
                  <div>Regional Manager</div>
                  <div className="text-[10px] text-neutral-400 font-normal">
                    Audit lintas toko & performa armada
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
