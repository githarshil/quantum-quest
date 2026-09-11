import React from 'react';

export default function Stamp({ 
  text = 'VERIFIED', 
  color = 'green', 
  className = '',
  rotation = '-rotate-6',
  animate = true 
}) {
  const colorStyles = {
    green: 'border-emerald-700 text-emerald-800 bg-emerald-900/10 shadow-[0_0_0_1px_rgba(4,120,87,0.2)]',
    red: 'border-rose-700 text-rose-800 bg-rose-900/10 shadow-[0_0_0_1px_rgba(190,18,60,0.2)]',
    blue: 'border-blue-700 text-blue-800 bg-blue-900/10 shadow-[0_0_0_1px_rgba(29,78,216,0.2)]',
    purple: 'border-purple-700 text-purple-800 bg-purple-900/10 shadow-[0_0_0_1px_rgba(126,34,206,0.2)]',
  };

  const style = colorStyles[color] || colorStyles.green;
  const animationClass = animate ? 'animate-stamp' : '';

  return (
    <div className={`inline-block px-3.5 py-1 font-mono uppercase font-black tracking-widest text-xs border-2 border-dashed rounded-sm select-none ${style} ${rotation} ${animationClass} ${className}`}>
      {text}
    </div>
  );
}
