import React from 'react';
import { Activity, Radio, Cpu, Terminal } from 'lucide-react';

export default function CRTMonitor({ 
  probabilities = { '00': 0.5, '11': 0.5 }, 
  counts = { '00': 500, '11': 500 }, 
  passed = false, 
  isRunning = false,
  statusText = "AWAITING CIRCUIT INPUT..."
}) {
  const states = ['00', '01', '10', '11'];

  return (
    <div className="relative rounded-2xl bg-[#1e293b] p-3 shadow-2xl border-4 border-[#334155] max-w-full">
      {/* Screw Heads in 4 corners */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-700 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-slate-400 rotate-45" />
      </div>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-700 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-slate-400 -rotate-45" />
      </div>
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-700 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-slate-400 -rotate-30" />
      </div>
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-slate-600 border border-slate-700 flex items-center justify-center">
        <div className="w-1.5 h-[1px] bg-slate-400 rotate-12" />
      </div>

      {/* Monitor Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-slate-900/80 rounded border border-slate-700 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider text-slate-200">OSCILLOSCOPE CRT-9000</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
            <span className="text-[10px] uppercase">{isRunning ? 'COMPUTING' : 'READY'}</span>
          </span>
          <span className="text-slate-500">| QISKIT AER</span>
        </div>
      </div>

      {/* CRT Curved Screen */}
      <div className="relative overflow-hidden rounded-xl bg-[#031508] border-2 border-[#166534] p-3 sm:p-3.5 min-h-[185px] shadow-inner crt-scanlines">
        {/* CRT Glass Reflection Glare */}
        <div className="absolute top-0 right-0 w-48 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full pointer-events-none" />

        {/* Screen Status Header */}
        <div className="flex justify-between items-center border-b border-emerald-900/60 pb-1.5 mb-2 text-[10px] sm:text-[11px] font-mono text-emerald-400">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="font-semibold">{statusText}</span>
          </div>
          <span className="text-emerald-500/80 font-mono text-[10px]">1000 SHOTS // BASIS Z</span>
        </div>

        {/* Waveform / Probability Chart */}
        <div className="grid grid-cols-4 gap-2.5 py-1.5">
          {states.map((state) => {
            const prob = probabilities[state] || 0;
            const pct = Math.round(prob * 100);
            const count = counts[state] || 0;
            const isHigh = pct > 20;

            return (
              <div key={state} className="flex flex-col items-center">
                <div className="w-full h-22 sm:h-24 bg-emerald-950/40 rounded border border-emerald-900/80 flex flex-col justify-end p-1 relative overflow-hidden">
                  {/* Grid Lines inside bar */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-25">
                    <div className="border-b border-emerald-600 border-dashed w-full h-[25%]" />
                    <div className="border-b border-emerald-600 border-dashed w-full h-[50%]" />
                    <div className="border-b border-emerald-600 border-dashed w-full h-[75%]" />
                  </div>

                  {/* Animated Bar fill */}
                  <div 
                    className={`w-full rounded-sm transition-all duration-700 relative ${
                      isHigh 
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.7)]' 
                        : 'bg-emerald-900/40'
                    }`}
                    style={{ height: `${Math.max(pct, 2)}%` }}
                  >
                    {isHigh && (
                      <div className="absolute top-0 inset-x-0 h-1 bg-white/70 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* State Label */}
                <div className="mt-1.5 text-center font-mono">
                  <div className={`text-xs font-bold ${isHigh ? 'text-emerald-300 crt-glow' : 'text-emerald-800'}`}>
                    |{state}⟩
                  </div>
                  <div className={`text-[10px] sm:text-[11px] ${isHigh ? 'text-emerald-400 font-semibold' : 'text-emerald-800'}`}>
                    {pct}%
                  </div>
                  <div className="text-[9px] text-emerald-600/70">
                    {count}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Screen Ticker */}
        <div className="mt-2 pt-1.5 border-t border-emerald-900/60 flex items-center justify-between text-[10px] font-mono text-emerald-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            <span>STATEVECTOR COLLAPSE DETECTED</span>
          </div>
          <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${passed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
            {passed ? 'ENTANGLED' : 'DISENTANGLED'}
          </div>
        </div>
      </div>

      {/* Hardware Control Knobs / Buttons on Bottom of Bezel */}
      <div className="flex items-center justify-between px-3 pt-2 text-slate-400 text-xs">
        <div className="flex gap-2 items-center">
          <div className="w-5 h-5 rounded-full bg-slate-700 border-2 border-slate-600 shadow flex items-center justify-center cursor-pointer hover:bg-slate-600">
            <div className="w-1 h-3 bg-slate-900 rounded-full" />
          </div>
          <span className="text-[9px] font-mono text-slate-400">GAIN</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-700">
          <Terminal className="w-3 h-3 text-emerald-400" />
          <span>PORT 8000: AER_SIMULATOR</span>
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-[9px] font-mono text-slate-400">SWEEP</span>
          <div className="w-5 h-5 rounded-full bg-slate-700 border-2 border-slate-600 shadow flex items-center justify-center cursor-pointer hover:bg-slate-600">
            <div className="w-1 h-3 bg-slate-900 rounded-full rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
}
