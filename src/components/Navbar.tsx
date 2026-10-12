import { useState, type FC } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenDemo: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onOpenDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "cara kerja", href: "#cara-kerja" },
    { name: "fitur", href: "#fitur" },
    { name: "simulasi", href: "#simulasi" },
    { name: "telegram", href: "#telegram-bot" },
    { name: "alur-kerja", href: "#alur-kerja" },
    { name: "kalkulator roi", href: "#roi" },
    { name: "arsitektur", href: "#arsitektur" },
    { name: "faq", href: "#faq" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#161615]/95 backdrop-blur-md border-b border-[#3D3C39] py-3.5 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-12">
          {/* Brand Logo - Logo image + Monospace font */}
          <a href="#" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="AUTO REPLENISH.AI Logo"
              className="h-8 w-8 object-contain rounded-[4px] p-0.5 bg-[#1F1E1D] border border-[#3D3C39]"
            />
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-[14px] font-bold text-[#FAF9F5] tracking-wider">
                AUTOREPLENISH.AI
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links - Monospace & Minimal */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-mono">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[#A3A199] hover:text-[#FAF9F5] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTA - "minta demo" only (demo 3d twin button removed) */}
          <div className="hidden sm:flex items-center gap-2 font-mono">
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-[500] text-[#161615] bg-[#F0EEEA] hover:bg-white rounded-[8px] cursor-pointer transition-colors active:scale-95 shadow-none"
            >
              <span>minta demo</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#A3A199] hover:text-[#FAF9F5] rounded-[6px] bg-[#1F1E1D] border border-[#3D3C39]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4 text-[#FAF9F5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161615] border-b border-[#3D3C39] px-4 pt-3 pb-6 mt-2 space-y-2 backdrop-blur-xl font-mono text-[13px]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-[#A3A199] hover:text-[#FAF9F5] hover:bg-[#1F1E1D] rounded-[6px]"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-[#3D3C39]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 text-center text-[13px] font-[500] text-[#161615] bg-[#F0EEEA] rounded-[8px]"
            >
              minta live demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
