import { useState, useEffect, type FC } from "react";
import { Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenDemo: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onOpenDemo }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "fitur", href: "#fitur" },
    { name: "simulasi", href: "#simulasi" },
    { name: "alur-kerja", href: "#alur-kerja" },
    { name: "telegram", href: "#telegram-bot" },
    { name: "roi", href: "#roi" },
    { name: "arsitektur", href: "#arsitektur" },
    { name: "faq", href: "#faq" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-[var(--border)] bg-[var(--bg)] ${
        scrolled ? "bg-[var(--bg)]" : "bg-[var(--bg)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo — teks piksel + aksen */}
          <a href="#" className="flex items-center gap-2">
            <span aria-hidden className="text-[20px] leading-none text-[var(--accent)]">
              *
            </span>
            <span className="text-[14px] font-bold text-[var(--text)]">
              autoreplenish.ai
            </span>
          </a>

          {/* Navigasi tengah */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[14px] text-[var(--text)] hover:text-[var(--text-muted)] no-underline"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Aksi kanan */}
          <div className="hidden sm:flex items-center gap-3">
            <span className="hidden xl:inline-flex items-center gap-2 rounded-full bg-[var(--surface)] border border-[var(--border)] px-3 py-1 text-[12px] text-[var(--text-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              <span>bedrock + sap: connected</span>
            </span>

            <button
              onClick={onOpenDemo}
              className="inline-flex items-center justify-center px-4 py-2.5 text-[14px] font-medium text-[var(--btn-light-text)] bg-[var(--btn-light-bg)] rounded-[var(--radius-md)] hover:opacity-90 cursor-pointer"
            >
              minta demo
            </button>
          </div>

          {/* Mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenDemo}
              className="px-3 py-1.5 text-[13px] font-medium text-[var(--btn-light-text)] bg-[var(--btn-light-bg)] rounded-[var(--radius-sm)] cursor-pointer"
            >
              demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[var(--text-muted)] rounded-[var(--radius-sm)] bg-[var(--surface)] border border-[var(--border)] cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden bg-[var(--bg)] border-t border-[var(--border)] px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-2 py-2 text-[14px] text-[var(--text)] no-underline hover:bg-[var(--surface-hover)] rounded-[var(--radius-sm)]"
            >
              {link.name}
            </a>
          ))}
          <div className="pt-3 border-t border-[var(--border)]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 text-center text-[14px] font-medium text-[var(--btn-light-text)] bg-[var(--btn-light-bg)] rounded-[var(--radius-md)] cursor-pointer"
            >
              jadwalkan demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
