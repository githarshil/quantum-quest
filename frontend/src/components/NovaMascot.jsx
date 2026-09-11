import React from 'react';
import mascotPng from '../assets/mascot.png';

/**
 * NovaMascot: The Official Quantum Quest Mascot Component
 * 
 * Represents NOVA across the application using the official mascot PNG asset.
 * Preserves exact aspect ratio and artwork with responsive sizing and state animations.
 */
export default function NovaMascot({
  size = 'md',
  state = 'idle', // 'idle' | 'thinking' | 'listening' | 'speaking' | 'celebrating' | 'hint'
  mood = null,
  showBadge = false,
  className = '',
  alt = 'Quantum Quest mascot - NOVA AI Guide'
}) {
  // Dimension presets based on guidelines (aspect-[485/514])
  const sizeMap = {
    xs: 'w-6 h-[25.5px]',
    sm: 'w-8 h-[34px] sm:w-9 sm:h-[38px]',
    md: 'w-11 h-[46.5px] sm:w-12 sm:h-[51px]',
    lg: 'w-16 h-[68px] sm:w-20 sm:h-[85px]',
    xl: 'w-24 h-[102px] sm:w-28 sm:h-[119px]',
    '2xl': 'w-32 h-[136px] sm:w-36 sm:h-[153px]'
  };

  const sizeClass = sizeMap[size] || sizeMap.md;

  // Animation based on state or mood
  const activeState = state === 'idle' && mood ? (
    mood === 'celebrating' ? 'celebrating' :
    mood === 'thinking' ? 'thinking' :
    'idle'
  ) : state;

  let animationClass = '';
  if (activeState === 'thinking') {
    animationClass = 'animate-mascot-float';
  } else if (activeState === 'celebrating' || activeState === 'success') {
    animationClass = 'animate-mascot-celebrate';
  } else if (activeState === 'speaking') {
    animationClass = 'animate-mascot-speak';
  } else if (activeState === 'listening') {
    animationClass = 'animate-pulse';
  }

  const getMoodEmoji = (m) => {
    switch (m) {
      case 'celebrating': return '🎉';
      case 'thinking': return '🤔';
      case 'curious': return '🧐';
      case 'excited': return '⚡';
      default: return '✨';
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}>
      {/* State Glow Halos */}
      {activeState === 'listening' && (
        <span className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping scale-110 pointer-events-none" />
      )}
      {activeState === 'thinking' && (
        <span className="absolute inset-0 rounded-full bg-cyan-400/20 blur-sm animate-pulse pointer-events-none" />
      )}
      {activeState === 'speaking' && (
        <span className="absolute inset-0 rounded-full bg-purple-400/25 blur-sm animate-pulse pointer-events-none" />
      )}

      {/* Official Mascot PNG Visual */}
      <img
        src={mascotPng || "/mascot.png"}
        alt={alt}
        className={`${sizeClass} aspect-[485/514] object-contain filter drop-shadow-sm transition-transform duration-300 ${animationClass}`}
        loading="eager"
        draggable="false"
      />

      {/* Optional Mood / State Badge */}
      {showBadge && (mood || activeState) && (
        <span 
          className="absolute -bottom-1 -right-1 text-xs bg-white/90 rounded-full px-1 shadow-sm border border-amber-200 pointer-events-none"
          title={`Mood: ${mood || activeState}`}
        >
          {activeState === 'listening' ? '🎙️' : 
           activeState === 'speaking' ? '🔊' : 
           getMoodEmoji(mood)}
        </span>
      )}
    </div>
  );
}
