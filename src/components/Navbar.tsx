import { useState, type FC } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenDemo: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onOpenDemo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Cara Kerja", href: "#cara-kerja" },
    { name: "Fitur", href: "#fitur" },
    { name: "Kalkulator ROI", href: "#roi" },
    { name: "Arsitektur", href: "#arsitektur" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#161615]/95 backdrop-blur-md border-b border-[#3D3C39] py-2.5 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-11">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="AUTOREPLENISH.AI Logo"
              className="h-8 w-8 object-contain rounded-[6px] p-0.5 bg-[#1F1E1D] border border-[#3D3C39] group-hover:border-[#D97757] transition-colors"
            />
            <div className="flex items-baseline font-mono">
              <span className="text-[14px] font-bold text-[#FAF9F5] tracking-wider">
                AUTOREPLENISH
              </span>
              <span className="text-[14px] font-bold text-[#D97757] tracking-wider">
                .AI
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[12px] font-mono">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[#A3A199] hover:text-[#FAF9F5] transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center gap-2.5 font-mono">
            <button
              type="button"
              onClick={onOpenDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[12px] font-bold text-[#161615] bg-[#D97757] hover:bg-[#E58A6B] rounded-[6px] cursor-pointer transition-colors"
            >
              <span>Jadwalkan Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#A3A199] hover:text-[#FAF9F5] rounded-[6px] bg-[#1F1E1D] border border-[#3D3C39]"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4 text-[#FAF9F5]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#161615] border-b border-[#3D3C39] px-4 pt-3 pb-6 mt-2 space-y-2 font-mono text-[13px]">
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
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 text-center text-[13px] font-bold text-[#161615] bg-[#D97757] rounded-[8px]"
            >
              Jadwalkan Live Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
