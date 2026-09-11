import React from 'react';

export default function Pushpin({ color = 'red', className = '' }) {
  const colors = {
    red: 'from-rose-500 to-red-700 shadow-red-950/40',
    gold: 'from-amber-400 to-amber-600 shadow-amber-950/40',
    blue: 'from-sky-400 to-blue-600 shadow-blue-950/40',
    green: 'from-emerald-400 to-emerald-600 shadow-emerald-950/40',
    silver: 'from-slate-300 to-slate-500 shadow-slate-950/40',
  };

  const selectedColor = colors[color] || colors.red;

  return (
    <div className={`relative inline-flex items-center justify-center pointer-events-none select-none ${className}`}>
      {/* Pin Shadow */}
      <div className="absolute w-4 h-4 rounded-full bg-black/40 blur-[2px] translate-x-1 translate-y-1.5" />
      {/* Pin Head Rim */}
      <div className={`relative w-4 h-4 rounded-full bg-gradient-to-br ${selectedColor} border border-white/40 shadow-pin flex items-center justify-center`}>
        {/* Highlight Specular */}
        <div className="w-1.5 h-1.5 rounded-full bg-white/80 -translate-x-0.5 -translate-y-0.5" />
      </div>
    </div>
  );
}
