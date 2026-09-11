import React from 'react';

export default function CuttingMatBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#073b32]">
      {/* Precision Grid Pattern - Subdued and recessed into background */}
      <div 
        className="absolute inset-0 w-full h-full opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.14) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.14) 1px, transparent 1px),
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
        }}
      />

      {/* SVG Precision Guide Lines - Very subtle 0.08-0.10 opacity */}
      <svg className="absolute inset-0 w-full h-full stroke-white/10 fill-none" xmlns="http://www.w3.org/2000/svg">
        {/* Diagonal 45° line */}
        <line x1="0" y1="100%" x2="100%" y2="0" strokeWidth="1" stroke="rgba(255,255,255,0.12)" />
        <line x1="0" y1="600" x2="800" y2="0" strokeWidth="1" stroke="rgba(255,255,255,0.08)" />
        <line x1="200" y1="100%" x2="100%" y2="300" strokeWidth="1" stroke="rgba(255,255,255,0.08)" />
        
        {/* Diagonal 30° / 60° lines */}
        <line x1="300" y1="100%" x2="900" y2="0" strokeWidth="1" stroke="rgba(255,255,255,0.07)" />
        <line x1="0" y1="400" x2="1200" y2="100%" strokeWidth="1" stroke="rgba(255,255,255,0.07)" />
        <line x1="100" y1="0" x2="1000" y2="900" strokeWidth="1" strokeDasharray="6,4" stroke="rgba(255,255,255,0.09)" />

        {/* Concentric arcs */}
        <circle cx="100%" cy="100%" r="200" strokeWidth="1" stroke="rgba(255,255,255,0.08)" />
        <circle cx="100%" cy="100%" r="400" strokeWidth="1" stroke="rgba(255,255,255,0.08)" />
        <circle cx="100%" cy="100%" r="600" strokeWidth="1" stroke="rgba(255,255,255,0.05)" />
        <circle cx="0" cy="100%" r="250" strokeWidth="1" strokeDasharray="5,4" stroke="rgba(255,255,255,0.08)" />

        {/* Angle markers */}
        <text x="70" y="93%" fill="rgba(255,255,255,0.18)" fontSize="10" fontFamily="JetBrains Mono, monospace">45°</text>
        <text x="210" y="96%" fill="rgba(255,255,255,0.18)" fontSize="10" fontFamily="JetBrains Mono, monospace">60°</text>
        <text x="410" y="95%" fill="rgba(255,255,255,0.18)" fontSize="10" fontFamily="JetBrains Mono, monospace">30°</text>
      </svg>

      {/* Top Precision Ruler */}
      <div className="absolute top-0 inset-x-0 h-6 border-b border-white/15 bg-[#052b24]/40 flex items-end justify-between px-2 font-mono text-[9px] text-white/30 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <span className="leading-none pb-0.5">{String(i + 1).padStart(2, '0')}</span>
            <div className="w-[1px] h-1.5 bg-white/20" />
          </div>
        ))}
      </div>

      {/* Left Precision Ruler */}
      <div className="absolute left-0 inset-y-0 w-6 border-r border-white/15 bg-[#052b24]/40 flex flex-col justify-between py-8 font-mono text-[9px] text-white/30 overflow-hidden items-end pr-1">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="flex items-center gap-0.5">
            <span>{String(i + 1).padStart(2, '0')}</span>
            <div className="h-[1px] w-1.5 bg-white/20" />
          </div>
        ))}
      </div>

      {/* Bottom Precision Ruler */}
      <div className="absolute bottom-0 inset-x-0 h-6 border-t border-white/15 bg-[#052b24]/40 flex items-center justify-between px-6 font-mono text-[9px] text-white/30">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-[1px] h-1.5 bg-white/20 mb-0.5" />
            <span className="leading-none">{String(i * 2 + 1).padStart(2, '0')}</span>
          </div>
        ))}
      </div>

      {/* Radial depth gradient to focus attention on the foreground content */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(7, 59, 50, 0.2) 0%, rgba(4, 30, 25, 0.65) 100%)'
        }}
      />
    </div>
  );
}
