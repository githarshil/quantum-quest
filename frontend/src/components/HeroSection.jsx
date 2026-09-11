import React from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import Pushpin from './Pushpin';
import Tape from './Tape';
import Stamp from './Stamp';
import NovaMascot from './NovaMascot';

export default function HeroSection({ 
  onBeginJourney = () => {}, 
  onExploreUniverse = () => {} 
}) {
  return (
    <section className="relative w-full h-screen max-h-screen overflow-hidden flex items-center justify-center select-none text-slate-100">
      
      {/* ========================================================================= */}
      {/* SUBTLE CUTTING-MAT INTEGRATION: Faint Quantum Notebook Markings (No Blue) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft vignette to focus light onto the central scrapbook desk */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(3, 20, 16, 0.45) 100%)'
          }}
        />

        {/* Delicate low-contrast orbital lines & scientific crosshairs in cutting mat tone */}
        <svg 
          className="absolute inset-0 w-full h-full stroke-white/10 fill-none select-none pointer-events-none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Faint Quantum Orbital Rings */}
          <ellipse cx="74%" cy="48%" rx="380" ry="160" transform="rotate(-20 1000 420)" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="8,6" />
          <ellipse cx="74%" cy="48%" rx="300" ry="120" transform="rotate(16 1000 420)" stroke="rgba(74, 222, 128, 0.06)" strokeWidth="1" />
          
          {/* Notebook Coordinate Crosshairs */}
          <g stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1">
            <path d="M 80 90 L 96 90 M 88 82 L 88 98" />
            <path d="M 540 60 L 556 60 M 548 52 L 548 68" />
            <path d="M 1240 100 L 1256 100 M 1248 92 L 1248 108" />
          </g>

          {/* Faint Quantum Equations floating along margins */}
          <text x="3%" y="22%" fill="rgba(255, 255, 255, 0.07)" fontSize="11" fontFamily="JetBrains Mono, monospace" fontStyle="italic">
            iℏ ∂/∂t |ψ(t)⟩ = Ĥ |ψ(t)⟩
          </text>
          <text x="45%" y="96%" fill="rgba(255, 255, 255, 0.07)" fontSize="11" fontFamily="JetBrains Mono, monospace">
            |Φ⁺⟩ = 1/√2 (|00⟩ + |11⟩)
          </text>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* MAIN HERO TWO-COLUMN DESK (FIT VIEWPORT, ZERO OVERFLOW) */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-12 h-full flex items-center py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center w-full max-h-full">
          
          {/* =================================================================== */}
          {/* LEFT COLUMN: Content, Headline, Highlight Strip & Tactile CTAs */}
          {/* =================================================================== */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center space-y-4 sm:space-y-5 text-left">
            
            {/* Pinned Dossier Tag with Washi Tape */}
            <div className="inline-flex items-center self-start relative">
              <Tape angle="rotate-2" width="w-16" className="-top-3 left-5 opacity-80" />

              <div className="bg-[#faf7ed] text-slate-900 px-3 py-1 rounded-sm shadow-md border-b-2 border-r-2 border-stone-400/40 flex items-center gap-2 -rotate-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-800 uppercase">
                  EXPERIMENT LOG // DOSSIER #01
                </span>
                <span className="text-[10px] font-hand text-emerald-800 font-bold">
                  ● ACTIVE
                </span>
              </div>
            </div>

            {/* Primary Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] xl:text-[50px] font-extrabold tracking-tight text-slate-100 leading-[1.12]">
              <span>Master </span>
              {/* Scrapbook Highlight Treatment for "Quantum Computing" */}
              <span className="relative inline-block my-1">
                <span 
                  className="relative z-10 inline-block bg-[#faf7ed] text-slate-950 font-black px-3 py-1 -rotate-1 shadow-paper rounded-sm border-b-2 border-r-2 border-amber-900/20 transform hover:rotate-0 transition-transform duration-300"
                  style={{
                    boxShadow: '2px 4px 10px rgba(0,0,0,0.3), inset 0 0 8px rgba(216, 185, 143, 0.25)'
                  }}
                >
                  <span className="absolute inset-0 paper-grain pointer-events-none rounded-sm" />
                  Quantum Computing.
                </span>
                <span className="absolute -inset-1 bg-amber-400/20 rounded -rotate-2 -z-0 blur-[1px]" />
              </span>
              <br />
              <span className="text-slate-100">One Mission at a Time.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 leading-relaxed font-normal max-w-lg">
              Learn quantum computing through interactive missions, experiments, circuit building, real simulations, and AI-powered guidance.
            </p>

            {/* Tactile Feature Pills */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-400/30 text-xs font-mono text-emerald-300 shadow-sm">
                <span className="text-emerald-400 font-bold">|ψ⟩</span> IBM Qiskit Aer
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/60 border border-amber-400/30 text-xs font-mono text-amber-300 shadow-sm">
                <span className="text-amber-400 font-bold">⚡</span> Real-time Circuit Lab
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/60 border border-teal-400/30 text-xs font-mono text-teal-300 shadow-sm">
                <Sparkles className="w-3 h-3 text-teal-300" /> Nova AI Guide
              </span>
            </div>

            {/* CTA Button Area */}
            <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              
              {/* PRIMARY CTA: Tactile Emerald Paper Button */}
              <button
                onClick={onBeginJourney}
                id="hero-primary-cta"
                className="relative group overflow-hidden px-7 py-3.5 rounded-md bg-emerald-700 hover:bg-emerald-600 text-[#faf7ed] font-bold text-sm sm:text-base tracking-wider uppercase shadow-paper hover:shadow-paper-lift hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 border-2 border-emerald-500/50 flex items-center justify-center gap-3 select-none"
                style={{
                  boxShadow: '0 8px 18px -2px rgba(4, 47, 39, 0.7), 0 3px 6px -1px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.25)'
                }}
              >
                <div className="absolute inset-0 paper-grain opacity-60 pointer-events-none" />
                <div className="w-1.5 h-1.5 rounded-full bg-stone-900 border border-amber-300/60 absolute top-2 left-2 shadow-inner" />
                
                <span className="relative z-10 font-extrabold tracking-wide">
                  Begin Your Journey
                </span>
                <ArrowRight className="relative z-10 w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* SECONDARY CTA: Tactile Scrapbook Outlined Label */}
              <button
                onClick={onExploreUniverse}
                id="hero-secondary-cta"
                className="relative px-6 py-3.5 rounded-md bg-[#faf7ed]/10 hover:bg-[#faf7ed]/15 text-slate-100 font-semibold text-sm sm:text-base tracking-wide border border-white/20 hover:border-white/40 shadow-sm hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm group"
              >
                <Compass className="w-4 h-4 text-amber-300 group-hover:rotate-45 transition-transform duration-300" />
                <span>Explore the Universe</span>
              </button>

            </div>

            {/* Handwritten Footnote Note */}
            <div className="pt-1 flex items-center gap-2">
              <NovaMascot size="xs" state="idle" />
              <span className="text-xs font-hand text-emerald-200/90 tracking-wide">
                * Guided by NOVA AI. Pinned from active laboratory experiments.
              </span>
            </div>

          </div>

          {/* =================================================================== */}
          {/* RIGHT COLUMN: The PROVIDED SVG Centerpiece Inside Scrapbook Mount */}
          {/* =================================================================== */}
          <div className="lg:col-span-6 xl:col-span-7 relative flex items-center justify-center lg:justify-end lg:pr-2 xl:pr-6 w-full">
            
            {/* Centerpiece Container with narrower width and shifted slightly to the right */}
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[480px] xl:max-w-[500px] flex items-center justify-center animate-hero-float lg:translate-x-4 xl:translate-x-6">

              {/* LAYER 0: Understated Under-glow */}
              <div 
                className="absolute inset-3 sm:inset-5 rounded-2xl animate-quantum-glow pointer-events-none -z-10"
                style={{
                  background: 'radial-gradient(ellipse at 55% 50%, rgba(16, 185, 129, 0.22) 0%, rgba(20, 184, 166, 0.12) 45%, transparent 75%)',
                  filter: 'blur(28px)'
                }}
              />

              {/* LAYER 1: Underneath Torn Graph-Paper Laboratory Sheet */}
              <div 
                className="absolute -inset-2 sm:-inset-3 bg-graph-paper rounded-md shadow-2xl rotate-1 sm:rotate-1.5 border border-stone-300/80 torn-paper-bottom select-none pointer-events-none -z-10"
                style={{
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.75), 0 8px 16px -4px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="absolute top-2 left-3 font-mono text-[9px] text-cyan-900/60 font-bold uppercase tracking-wider">
                  LAB-ARCHIVE-SERIES // 042-B
                </div>
              </div>

              {/* LAYER 2: Primary Specimen Mount Card */}
              <div 
                className="relative z-10 w-full bg-[#faf7ed] bg-dot-paper p-2.5 sm:p-3.5 rounded shadow-paper border border-stone-300 -rotate-0.5 sm:-rotate-1 transition-transform duration-500 hover:rotate-0 group/artwork"
                style={{
                  boxShadow: '0 18px 36px -6px rgba(0, 0, 0, 0.6), 0 6px 14px -3px rgba(0, 0, 0, 0.35), inset 0 0 10px rgba(216, 185, 143, 0.3)'
                }}
              >
                <div className="absolute inset-0 paper-grain rounded pointer-events-none opacity-80" />

                {/* FASTENERS: Washi Tape & Pushpins */}
                <Tape 
                  angle="-rotate-12" 
                  color="#f3e69f" 
                  width="w-24 sm:w-28" 
                  className="-top-3 -left-6 z-30" 
                />

                <div className="absolute -top-3 -right-2 z-30">
                  <Pushpin color="red" />
                </div>

                <div className="absolute -bottom-2.5 -left-2 z-30">
                  <Pushpin color="gold" />
                </div>

                <Tape 
                  angle="rotate-6" 
                  color="#ece4ce" 
                  width="w-20 sm:w-24" 
                  className="-bottom-2.5 -right-3 z-30" 
                />

                {/* Top Specimen Header */}
                <div className="relative z-10 flex items-center justify-between pb-1.5 mb-1.5 border-b border-stone-200/80 font-mono text-[9px] sm:text-[10px] text-stone-600">
                  <span className="font-bold text-stone-800 tracking-wider">FIG 1.1: PRIMARY QUANTUM MATRIX</span>
                  <span className="text-[9px] text-stone-500">STATE: |ψ⟩ = 1/√2(|0⟩ + |1⟩)</span>
                </div>

                {/* THE PROVIDED SVG VISUAL (PRESERVED ARTWORK & PROPORTIONS, TIGHTLY FRAMED) */}
                <div className="relative z-10 w-full overflow-hidden rounded bg-[#2A384F] border border-stone-300/60 shadow-inner flex items-center justify-center aspect-[2186/1952]">
                  <img 
                    src="/quantum_quest_hero.svg" 
                    alt="Quantum Quest Primary Scientific Artifact" 
                    className="w-full h-full object-contain select-none pointer-events-auto filter drop-shadow-sm transition-transform duration-700 group-hover/artwork:scale-[1.01]"
                    loading="eager"
                  />

                  {/* Specimen Inspection Grid Overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-15"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
                      `,
                      backgroundSize: '36px 36px'
                    }}
                  />
                </div>

                {/* Specimen Card Footnote & Verified Stamp */}
                <div className="relative z-10 pt-2 flex flex-wrap items-center justify-between gap-1.5 border-t border-stone-200/80 mt-2">
                  <div className="flex flex-col text-left">
                    <span className="font-mono text-[9px] font-bold text-stone-800 tracking-wider">
                      SPECIMEN ARTIFACT: QQ-TOPOLOGY-01
                    </span>
                    <span className="font-hand text-[11px] text-stone-600 tracking-wide">
                      "Bloch coordinates calibrated for multi-qubit entanglement."
                    </span>
                  </div>

                  <div className="flex-shrink-0">
                    <Stamp 
                      text="VERIFIED ARTIFACT" 
                      color="red" 
                      rotation="rotate-2" 
                      className="text-[9px] py-0.5 px-2"
                      animate={true}
                    />
                  </div>
                </div>

              </div>

              {/* ============================================================= */}
              {/* SCRAPBOOK ANNOTATIONS & HAND-DRAWN ARROWS AROUND THE SVG */}
              {/* ============================================================= */}

              {/* Annotation 1: TOP-LEFT "SUPERPOSITION" */}
              <div className="absolute -top-6 -left-4 sm:-left-8 z-20 pointer-events-none select-none hidden sm:flex flex-col items-start -rotate-6">
                <div className="bg-[#faf7ed] text-slate-950 font-hand font-bold text-xs sm:text-sm px-2.5 py-0.5 rounded shadow-md border border-stone-300">
                  SUPERPOSITION
                </div>
                <div className="text-[10px] font-mono text-emerald-200 font-medium pl-1 drop-shadow">
                  H → |0⟩
                </div>
                <svg className="w-14 h-8 overflow-visible mt-0.5 -ml-1" viewBox="0 0 60 40">
                  <path 
                    d="M 12 4 Q 30 18 46 28" 
                    fill="none" 
                    stroke="#34d399" 
                    strokeWidth="1.8" 
                    strokeDasharray="4,2" 
                    markerEnd="url(#hand-arrow-green)"
                  />
                  <defs>
                    <marker id="hand-arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 2 L 8 5 L 0 8 z" fill="#34d399" />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* Annotation 2: TOP-RIGHT "ENTANGLEMENT?" Sticky Note */}
              <div className="absolute -top-7 -right-2 sm:-right-6 z-20 pointer-events-none select-none hidden sm:flex flex-col items-end rotate-6">
                <div className="relative bg-amber-100 text-stone-900 font-hand font-bold text-xs px-2.5 py-1 rounded-sm shadow-md border border-amber-200">
                  <Tape angle="-rotate-3" width="w-12" color="#f5ea92" className="-top-2 right-2" />
                  <div>ENTANGLEMENT?</div>
                  <div className="text-[9px] font-mono text-stone-700">|Φ⁺⟩ = 1/√2(|00⟩+|11⟩)</div>
                </div>
                <svg className="w-12 h-10 overflow-visible mr-2" viewBox="0 0 50 50">
                  <path 
                    d="M 36 6 Q 22 26 8 38" 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeWidth="1.8" 
                    strokeDasharray="3,2" 
                    markerEnd="url(#hand-arrow-amber)"
                  />
                  <defs>
                    <marker id="hand-arrow-amber" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 2 L 8 5 L 0 8 z" fill="#f59e0b" />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* Annotation 3: LEFT-SIDE "OBSERVE" */}
              <div className="absolute top-1/2 -left-6 sm:-left-10 z-20 pointer-events-none select-none hidden md:flex items-center gap-1.5 -rotate-3">
                <div className="bg-[#faf7ed] text-emerald-950 font-hand font-bold text-xs px-2 py-0.5 rounded shadow-sm border border-stone-300">
                  OBSERVE
                </div>
                <svg className="w-10 h-5 overflow-visible" viewBox="0 0 40 20">
                  <path 
                    d="M 4 10 Q 18 6 32 10" 
                    fill="none" 
                    stroke="#a7f3d0" 
                    strokeWidth="1.6" 
                    markerEnd="url(#hand-arrow-lightgreen)"
                  />
                  <defs>
                    <marker id="hand-arrow-lightgreen" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 2 L 8 5 L 0 8 z" fill="#a7f3d0" />
                    </marker>
                  </defs>
                </svg>
              </div>

              {/* Annotation 4: FLOATING BASIS NOTATIONS "0", "1", "ψ" */}
              <div className="absolute top-14 -left-2 sm:-left-3 z-20 pointer-events-none select-none font-mono text-[10px] font-bold text-emerald-200 bg-stone-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shadow">
                |0⟩
              </div>
              <div className="absolute bottom-20 -right-2 sm:-right-3 z-20 pointer-events-none select-none font-mono text-[10px] font-bold text-emerald-200 bg-stone-900/80 px-1.5 py-0.5 rounded border border-emerald-500/30 shadow">
                |1⟩
              </div>
              <div className="absolute -bottom-5 left-1/4 z-20 pointer-events-none select-none font-hand text-lg font-bold text-amber-300 drop-shadow">
                ψ(r, t)
              </div>

              {/* Annotation 5: BOTTOM "EXPERIMENT" */}
              <div className="absolute -bottom-7 right-8 sm:right-16 z-20 pointer-events-none select-none hidden sm:flex items-center gap-1.5 rotate-2">
                <svg className="w-8 h-8 overflow-visible" viewBox="0 0 40 40">
                  <path 
                    d="M 10 28 Q 20 18 26 8" 
                    fill="none" 
                    stroke="#f43f5e" 
                    strokeWidth="1.6" 
                    strokeDasharray="4,2" 
                    markerEnd="url(#hand-arrow-red)"
                  />
                  <defs>
                    <marker id="hand-arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 2 L 8 5 L 0 8 z" fill="#f43f5e" />
                    </marker>
                  </defs>
                </svg>
                <div className="bg-[#faf7ed] text-rose-950 font-hand font-bold text-xs px-2 py-0.5 rounded shadow border border-stone-300">
                  EXPERIMENT
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </section>
  );
}
