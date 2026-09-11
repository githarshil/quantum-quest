import React from 'react';

export default function Tape({ 
  angle = '-rotate-2', 
  color = '#f5ea92', 
  className = '',
  width = 'w-24'
}) {
  return (
    <div 
      className={`absolute z-20 ${width} h-6 pointer-events-none select-none opacity-85 mix-blend-multiply backdrop-blur-[1px] ${angle} ${className}`}
      style={{
        backgroundColor: color,
        boxShadow: '0 1px 3px rgba(0,0,0,0.15), inset 0 0 2px rgba(255,255,255,0.4)',
        clipPath: 'polygon(0% 0%, 100% 2%, 98% 98%, 2% 100%, 0% 85%, 2% 70%, 0% 50%, 2% 30%)'
      }}
    />
  );
}
