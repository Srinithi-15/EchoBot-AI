import React from 'react';

interface RobotVisualProps {
  status?: 'idle' | 'listening' | 'speaking' | 'processing';
  accentColor?: 'blue' | 'cyan' | 'purple';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function RobotVisual({
  status = 'idle',
  accentColor = 'cyan',
  size = 'md',
}: RobotVisualProps) {
  // Map size to dimension classes
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  }[size];

  // Map colors to hex codes and glowing colors
  const colorMap = {
    blue: {
      primary: '#3b82f6',
      glow: 'rgba(59, 130, 246, 0.7)',
      shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
      bgGlow: 'from-blue-500/20 to-blue-600/5',
      text: 'text-blue-400',
    },
    cyan: {
      primary: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.7)',
      shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.5)]',
      bgGlow: 'from-cyan-500/20 to-cyan-600/5',
      text: 'text-cyan-400',
    },
    purple: {
      primary: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.7)',
      shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.5)]',
      bgGlow: 'from-purple-500/20 to-purple-600/5',
      text: 'text-purple-400',
    },
  }[accentColor];

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Ambient background aura */}
      <div
        className={`absolute inset-0 rounded-full bg-radial blur-3xl opacity-40 transition-all duration-700 ${
          status === 'listening'
            ? 'scale-125 opacity-60'
            : status === 'speaking'
            ? 'scale-110 opacity-55'
            : status === 'processing'
            ? 'scale-105 opacity-50 animate-pulse'
            : 'scale-100 opacity-30'
        }`}
        style={{
          background: `radial-gradient(circle, ${colorMap.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Floating SVG Robot */}
      <div className={`${sizeClasses} relative z-10 select-none animate-float-slow`}>
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full filter drop-shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Defs for gradients */}
          <defs>
            <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="robotArmorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="neonGlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colorMap.primary} stopOpacity="1" />
              <stop offset="100%" stopColor={colorMap.primary} stopOpacity="0.2" />
            </linearGradient>
            <filter id="neonGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND ENERGY FIELD (Listening / Speaking) */}
          {(status === 'listening' || status === 'speaking') && (
            <g className="animate-pulse">
              <circle
                cx="100"
                cy="100"
                r="85"
                stroke={colorMap.primary}
                strokeWidth="1.5"
                strokeDasharray="4 8"
                opacity="0.3"
                className="origin-center animate-[spin_40s_linear_infinite]"
              />
              <circle
                cx="100"
                cy="100"
                r="75"
                stroke={colorMap.primary}
                strokeWidth="1"
                strokeDasharray="10 5"
                opacity="0.4"
                className="origin-center animate-[spin_20s_linear_infinite_reverse]"
              />
            </g>
          )}

          {/* ROBOT EARS / ANTENNAS */}
          <g>
            {/* Left ear */}
            <path
              d="M 55 80 L 40 75 L 45 65 Z"
              fill="url(#robotArmorGrad)"
              stroke={colorMap.primary}
              strokeWidth="1.5"
            />
            {/* Right ear */}
            <path
              d="M 145 80 L 160 75 L 155 65 Z"
              fill="url(#robotArmorGrad)"
              stroke={colorMap.primary}
              strokeWidth="1.5"
            />
            {/* Antenna connector & tip */}
            <line
              x1="100"
              y1="50"
              x2="100"
              y2="25"
              stroke={colorMap.primary}
              strokeWidth="2"
              className={status === 'processing' ? 'animate-pulse' : ''}
            />
            <circle
              cx="100"
              cy="22"
              r="6"
              fill={colorMap.primary}
              filter="url(#neonGlowFilter)"
              className={
                status === 'processing'
                  ? 'animate-ping'
                  : status === 'listening'
                  ? 'animate-pulse'
                  : ''
              }
            />
          </g>

          {/* HEAD BACK PLATE & MAIN SHELL */}
          <rect
            x="50"
            y="45"
            width="100"
            height="85"
            rx="25"
            fill="url(#robotBodyGrad)"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="2"
          />

          {/* GLASS FACE SHIELD */}
          <rect
            x="58"
            y="53"
            width="84"
            height="55"
            rx="15"
            fill="rgba(15, 23, 42, 0.85)"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
          />

          {/* NEON ACCENT LINES ON FACE */}
          <path
            d="M 68 58 L 132 58"
            stroke={colorMap.primary}
            strokeWidth="1"
            opacity="0.3"
          />
          <path
            d="M 68 100 L 132 100"
            stroke={colorMap.primary}
            strokeWidth="1"
            opacity="0.3"
          />

          {/* GLOWING BLUE ROBOT EYES */}
          <g className="animate-blink origin-center">
            {/* Left Eye Outer Glow */}
            <circle
              cx="80"
              cy="75"
              r="10"
              fill={colorMap.primary}
              fillOpacity="0.2"
              filter="url(#neonGlowFilter)"
            />
            {/* Left Eye Center */}
            <circle
              cx="80"
              cy="75"
              r="6"
              fill="#ffffff"
            />
            <circle
              cx="80"
              cy="75"
              r="4"
              fill={colorMap.primary}
            />

            {/* Right Eye Outer Glow */}
            <circle
              cx="120"
              cy="75"
              r="10"
              fill={colorMap.primary}
              fillOpacity="0.2"
              filter="url(#neonGlowFilter)"
            />
            {/* Right Eye Center */}
            <circle
              cx="120"
              cy="75"
              r="6"
              fill="#ffffff"
            />
            <circle
              cx="120"
              cy="75"
              r="4"
              fill={colorMap.primary}
            />
          </g>

          {/* MOUTH BAR / EQUALIZER (Reacts to speaking/listening) */}
          {status === 'speaking' ? (
            <g transform="translate(80, 91)">
              {/* Talking Animated bars */}
              <rect x="0" y="0" width="3" height="12" rx="1" fill={colorMap.primary} className="animate-soundwave origin-center" style={{ animationDelay: '0.1s' }} />
              <rect x="6" y="-3" width="3" height="18" rx="1" fill={colorMap.primary} className="animate-soundwave origin-center" style={{ animationDelay: '0.3s' }} />
              <rect x="12" y="-5" width="3" height="22" rx="1" fill={colorMap.primary} className="animate-soundwave origin-center" style={{ animationDelay: '0.5s' }} />
              <rect x="18" y="-5" width="3" height="22" rx="1" fill={colorMap.primary} className="animate-soundwave origin-center" style={{ animationDelay: '0.2s' }} />
              <rect x="24" y="-3" width="3" height="18" rx="1" fill={colorMap.primary} className="animate-soundwave origin-center" style={{ animationDelay: '0.4s' }} />
              <rect x="30" y="0" width="3" height="12" rx="1" fill={colorMap.primary} className="animate-soundwave origin-center" style={{ animationDelay: '0.6s' }} />
            </g>
          ) : status === 'listening' ? (
            <path
              d="M 80 97 C 88 103, 112 103, 120 97"
              stroke={colorMap.primary}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
              filter="url(#neonGlowFilter)"
            />
          ) : status === 'processing' ? (
            <g transform="translate(82, 95)" className="animate-pulse">
              {/* Rotating radar / scanner line */}
              <line x1="0" y1="0" x2="36" y2="0" stroke={colorMap.primary} strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (
            // Idle Friendly Smile
            <path
              d="M 82 95 C 90 100, 110 100, 118 95"
              stroke={colorMap.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />
          )}

          {/* CHEEK CIRCUITS */}
          <path
            d="M 60 88 L 68 88 L 68 93"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.2"
            fill="none"
          />
          <path
            d="M 140 88 L 132 88 L 132 93"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1.2"
            fill="none"
          />

          {/* NECK SYSTEM */}
          <rect
            x="85"
            y="130"
            width="30"
            height="18"
            rx="4"
            fill="url(#robotArmorGrad)"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
          {/* Neck rib lines */}
          <line x1="90" y1="135" x2="110" y2="135" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
          <line x1="90" y1="140" x2="110" y2="140" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />

          {/* TORSO / UPPER BODY */}
          <path
            d="M 65 148 L 135 148 C 150 148, 155 165, 155 185 L 45 185 C 45 165, 50 148, 65 148 Z"
            fill="url(#robotBodyGrad)"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="2"
          />

          {/* TORSO CORE ENERGY / EMBLEM */}
          <circle
            cx="100"
            cy="170"
            r="12"
            fill="rgba(15, 23, 42, 0.85)"
            stroke={colorMap.primary}
            strokeWidth="1.5"
          />
          <circle
            cx="100"
            cy="170"
            r="8"
            fill={colorMap.primary}
            filter="url(#neonGlowFilter)"
            className={
              status === 'listening'
                ? 'animate-ping'
                : status === 'speaking'
                ? 'animate-pulse'
                : ''
            }
          />
          <path
            d="M 80 158 Q 100 164, 120 158"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="2.5"
            fill="none"
          />
        </svg>

        {/* Outer Soundwaves when speaking or listening */}
        {status === 'speaking' && (
          <>
            <div className={`absolute -left-10 top-1/3 w-6 h-12 flex items-center justify-between gap-1 opacity-80 animate-pulse`}>
              <div className="w-[3px] bg-cyan-400 h-6 rounded-full animate-soundwave" style={{ animationDuration: '0.7s' }} />
              <div className="w-[3px] bg-blue-500 h-10 rounded-full animate-soundwave" style={{ animationDuration: '0.9s' }} />
              <div className="w-[3px] bg-purple-500 h-4 rounded-full animate-soundwave" style={{ animationDuration: '0.6s' }} />
            </div>
            <div className={`absolute -right-10 top-1/3 w-6 h-12 flex items-center justify-between gap-1 opacity-80 animate-pulse`}>
              <div className="w-[3px] bg-purple-500 h-4 rounded-full animate-soundwave" style={{ animationDuration: '0.6s' }} />
              <div className="w-[3px] bg-blue-500 h-10 rounded-full animate-soundwave" style={{ animationDuration: '0.9s' }} />
              <div className="w-[3px] bg-cyan-400 h-6 rounded-full animate-soundwave" style={{ animationDuration: '0.7s' }} />
            </div>
          </>
        )}

        {status === 'listening' && (
          <div className="absolute inset-0 border-2 border-dashed border-cyan-400/40 rounded-full scale-125 animate-[spin_12s_linear_infinite]" />
        )}
      </div>

      {/* Decorative subtitle when processing */}
      {status !== 'idle' && (
        <span
          className={`mt-4 font-mono text-xs tracking-widest uppercase transition-all duration-300 ${colorMap.text} neon-text-${accentColor}`}
        >
          {status === 'listening' && '🤖 LISTENING...'}
          {status === 'speaking' && '🤖 SPEAKING...'}
          {status === 'processing' && '🤖 SYNAPSE FIRING...'}
        </span>
      )}
    </div>
  );
}
