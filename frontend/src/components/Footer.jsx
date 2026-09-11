import React from 'react';
import { Atom, Cpu, Sparkles, ArrowUp, BookOpen, Shield } from 'lucide-react';

export default function Footer({
  onNavigate = () => {},
  onSelectLevel = () => {},
  levels = []
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#041d18]/95 border-t-2 border-emerald-500/25 text-slate-300 py-8 px-4 sm:px-6 lg:px-8 mt-16 z-20 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Col 1: Brand & Pedagogy */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2.5">
            <img 
              src="/favicon.svg" 
              alt="Quantum Quest" 
              className="w-7 h-7 rounded border border-emerald-400/40 object-contain"
            />
            <span className="font-extrabold text-sm tracking-wider text-slate-100 font-sans">
              QUANTUM QUEST // LABORATORY
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-md">
            An open educational workbench designed for intuitive mastery of quantum mechanics, quantum logic gates, and entangled multi-qubit states powered by authentic IBM Qiskit Aer simulations.
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry: Qiskit Aer Hypervisor Active // Live State Collapses</span>
          </div>
        </div>

        {/* Col 2: Curriculum Sectors */}
        <div>
          <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Curriculum Track</span>
          </div>
          <ul className="space-y-1.5 text-xs font-mono">
            {levels && levels.length > 0 ? (
              levels.slice(0, 4).map((lvl) => (
                <li key={lvl.id}>
                  <button
                    onClick={() => onSelectLevel(lvl)}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-emerald-500 font-bold">0{lvl.number}.</span>
                    <span className="truncate">{lvl.title}</span>
                  </button>
                </li>
              ))
            ) : (
              <>
                <li className="text-slate-400">01. Superposition</li>
                <li className="text-slate-400">02. Quantum Gates</li>
                <li className="text-slate-400">03. Bell States & Entanglement</li>
                <li className="text-slate-400">04. Teleportation</li>
              </>
            )}
          </ul>
        </div>

        {/* Col 3: Research Protocols */}
        <div>
          <div className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Workbench System</span>
          </div>
          <ul className="space-y-1 text-xs font-mono text-slate-400">
            <li>State Vector: <span className="text-slate-200">|ψ⟩ ∈ ℂ²ⁿ</span></li>
            <li>Circuit Shots: <span className="text-slate-200">1,000 runs</span></li>
            <li>AI Companion: <span className="text-emerald-300">Nova v2.4</span></li>
            <li className="pt-2">
              <button
                onClick={scrollToTop}
                className="btn-ghost-tactile text-[11px] px-2.5 py-1 rounded"
              >
                <ArrowUp className="w-3 h-3 text-amber-400" />
                <span>Return to Top</span>
              </button>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar with Precision Stamp */}
      <div className="max-w-7xl mx-auto pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
        <div>
          © {new Date().getFullYear()} Quantum Quest Educational Initiative. MIT Open Source.
        </div>
        <div className="flex items-center gap-3">
          <span className="text-emerald-400/80">Calibration: 45° Bloch Sphere</span>
          <span>•</span>
          <span className="text-amber-300/80">Laboratory Dossier Series 07</span>
        </div>
      </div>
    </footer>
  );
}
