import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class SceneErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[SceneErrorBoundary] Caught 3D Scene Runtime Error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-6 text-white select-text">
          <div className="max-w-xl w-full bg-slate-800 border border-red-500/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-2.5 bg-red-500/10 rounded-xl border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">
                  3D Digital Twin Error Terdeteksi
                </h2>
                <p className="text-xs text-red-300">
                  {this.props.fallbackMessage || "Gagal merender canvas WebGL atau memuat model 3D."}
                </p>
              </div>
            </div>

            <div className="bg-black/60 rounded-xl p-4 font-mono text-xs text-rose-200 overflow-x-auto max-h-48 border border-white/5 space-y-1">
              <div className="font-semibold text-white">
                {this.state.error?.name || "Error"}: {this.state.error?.message || "Unknown error"}
              </div>
              {this.state.error?.stack && (
                <div className="text-[11px] opacity-70 whitespace-pre leading-relaxed">
                  {this.state.error.stack.slice(0, 500)}...
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Coba buka dengan parameter <code className="text-blue-400">?debug=1</code> untuk melihat status WebGL.
              </span>
              <button
                onClick={this.handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Muat Ulang Canvas
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
