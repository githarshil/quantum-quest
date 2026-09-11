import React from 'react';
import Pushpin from './Pushpin';
import Tape from './Tape';
import Stamp from './Stamp';
import { RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-cream rounded-2xl p-8 shadow-paper-lift border-2 border-rose-400 text-slate-800">
            <Pushpin color="red" className="absolute -top-3 left-10" />
            <Pushpin color="gold" className="absolute -top-3 right-10" />
            <Tape position="top" angle="-rotate-2" color="#fca5a5" className="-top-3 left-1/3 w-32" />

            <div className="flex justify-between items-start mb-4 border-b border-rose-200 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span className="font-mono text-xs font-bold text-rose-900 uppercase tracking-wider">
                  TELEMETRY INTERRUPT
                </span>
              </div>
              <Stamp text="ERROR LOG" color="red" />
            </div>

            <h2 className="text-2xl font-black text-slate-950 font-sans mb-2">
              Your quantum journal could not be loaded.
            </h2>

            <p className="text-sm font-hand text-amber-900 text-base mb-6">
              A temporary decoherence occurred while parsing explorer records. Your expedition data is preserved.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={this.handleRetry}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>

              <button
                onClick={() => {
                  window.location.hash = '#dashboard';
                  window.location.reload();
                }}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-semibold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400" />
                <span>Return to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
