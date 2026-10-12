import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Error boundary khusus scene 3D. Kalau file GLB belum ada (belum di-generate
 * dari Blender) atau WebGL tidak didukung, landing page tetap aman dan
 * menampilkan placeholder, bukan blank screen.
 */
interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

export class ModelErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo): void {
    console.warn("[HeroScene] gagal memuat model 3D:", error.message);
  }

  render(): ReactNode {
    if (this.state.failed) {
      return (
        <div className="relative flex h-[340px] w-full items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--surface)] sm:h-[430px] lg:h-[520px]">
          {/* Poster fallback dari render Blender (scripts/blender/render_preview.py) */}
          <img
            src="/models/hero-preview.jpg"
            alt="Preview hero AutoReplenish.ai: truk pengiriman dan minimarket"
            className="h-full w-full object-cover opacity-70"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          <p className="absolute font-mono text-xs text-[var(--text-muted)]">
            Preview 3D tidak tersedia
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
