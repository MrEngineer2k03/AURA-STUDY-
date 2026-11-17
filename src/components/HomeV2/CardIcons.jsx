import React from 'react';

/**
 * Tactical Hexagonal & Diamond Badge Card Icons for UI 2.0
 * Directly inspired by the reference gacha/tactical dashboard design.
 */

// 1. STUDY FOLDERS: Tilted 3D Hexagon Plinth + Open Tome/Archive + Stylus (Emerald Theme)
export function StudyFoldersCardIcon({ className = '' }) {
  return (
    <svg
      className={`homev2-card-icon-art ${className}`}
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="foldPlinthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#065f46" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#022c22" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="foldBookGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6ee7b7" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="foldPageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#d1fae5" />
        </linearGradient>
        <radialGradient id="foldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Radial Glow */}
      <circle cx="65" cy="65" r="54" fill="url(#foldGlow)" />

      {/* 3D Tilted Isometric Hexagonal Plinth Base */}
      {/* Lower Shadow Facet */}
      <polygon
        points="22,78 65,104 108,78 108,86 65,112 22,86"
        fill="#064e3b"
        opacity="0.9"
      />
      {/* Top Hexagon Surface */}
      <polygon
        points="65,36 108,60 108,78 65,104 22,78 22,60"
        fill="url(#foldPlinthGrad)"
        stroke="#34d399"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Inner Tech Grid Lines */}
      <polyline
        points="65,40 65,100"
        stroke="#6ee7b7"
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.45"
      />
      <polyline
        points="26,62 104,76"
        stroke="#6ee7b7"
        strokeWidth="0.8"
        strokeDasharray="3 3"
        opacity="0.4"
      />

      {/* Holographic Open Book / Archive Folder */}
      <g transform="translate(36, 42)">
        {/* Left Page Book Cover */}
        <path
          d="M29 32 C18 27 6 29 2 33 L2 10 C6 6 18 4 29 9 Z"
          fill="url(#foldBookGrad)"
          stroke="#a7f3d0"
          strokeWidth="1.2"
        />
        {/* Right Page Book Cover */}
        <path
          d="M29 32 C40 27 52 29 56 33 L56 10 C52 6 40 4 29 9 Z"
          fill="url(#foldBookGrad)"
          stroke="#a7f3d0"
          strokeWidth="1.2"
        />
        {/* Inner Paper Pages Left */}
        <path
          d="M28 30 C18 25 7 27 4 30 L4 9 C7 6 18 4 28 8 Z"
          fill="url(#foldPageGrad)"
          opacity="0.95"
        />
        {/* Inner Paper Pages Right */}
        <path
          d="M30 30 C40 25 51 27 54 30 L54 9 C51 6 40 4 30 8 Z"
          fill="url(#foldPageGrad)"
          opacity="0.95"
        />
        {/* Spine Divider */}
        <line x1="29" y1="8" x2="29" y2="31" stroke="#047857" strokeWidth="1.6" />

        {/* Text Lines on Pages */}
        <line x1="8" y1="13" x2="24" y2="10" stroke="#6ee7b7" strokeWidth="1" strokeLinecap="round" />
        <line x1="8" y1="17" x2="23" y2="14" stroke="#6ee7b7" strokeWidth="1" strokeLinecap="round" />
        <line x1="8" y1="21" x2="20" y2="18" stroke="#6ee7b7" strokeWidth="1" strokeLinecap="round" />
        <line x1="35" y1="10" x2="50" y2="13" stroke="#6ee7b7" strokeWidth="1" strokeLinecap="round" />
        <line x1="35" y1="14" x2="50" y2="17" stroke="#6ee7b7" strokeWidth="1" strokeLinecap="round" />
        <line x1="35" y1="18" x2="47" y2="21" stroke="#6ee7b7" strokeWidth="1" strokeLinecap="round" />

        {/* Golden Silk Ribbon Bookmark */}
        <path d="M29 9 Q32 18 36 28 L32 26 L29 28 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.6" />

        {/* Floating Quill / Stylus Pen */}
        <g transform="translate(38, -6) rotate(32)">
          <path d="M0 0 L3 24 L0 28 L-3 24 Z" fill="#ffffff" stroke="#10b981" strokeWidth="0.8" />
          <path d="M0 28 L0 32" stroke="#fbbf24" strokeWidth="1" />
          <circle cx="0" cy="4" r="1.5" fill="#10b981" />
        </g>
      </g>

      {/* Tactical 4-Point Sparkle Stars */}
      <path
        d="M106 42 Q106 48 112 48 Q106 48 106 54 Q106 48 100 48 Q106 48 106 42 Z"
        fill="#fff"
        filter="drop-shadow(0 0 5px #10b981)"
      />
      <path
        d="M24 46 Q24 50 28 50 Q24 50 24 54 Q24 50 20 50 Q24 50 24 46 Z"
        fill="#a7f3d0"
        opacity="0.9"
      />
    </svg>
  );
}

// 2. EVENTS (Tall Card): Grand Glowing Beacon Trophy + Hexagon Plinth + Star Orbit (Ruby Crimson & Gold)
export function EventsCardIcon({ className = '' }) {
  return (
    <svg
      className={`homev2-card-icon-art ${className}`}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eventPlinthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#9f1239" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#2e050f" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="eventCrystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe4e6" />
          <stop offset="40%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#be123c" />
        </linearGradient>
        <linearGradient id="eventGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <radialGradient id="eventAuraGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#e11d48" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Large Radiant Aura Glow */}
      <circle cx="80" cy="80" r="70" fill="url(#eventAuraGlow)" />

      {/* Floating Holographic Compass Rings */}
      <ellipse
        cx="80"
        cy="78"
        rx="54"
        ry="22"
        stroke="#f43f5e"
        strokeWidth="1.2"
        strokeDasharray="6 6"
        opacity="0.6"
        transform="rotate(-15 80 78)"
      />
      <ellipse
        cx="80"
        cy="78"
        rx="42"
        ry="16"
        stroke="#fda4af"
        strokeWidth="1"
        opacity="0.75"
        transform="rotate(22 80 78)"
      />

      {/* 3D Hexagonal Base Plinth */}
      {/* Plinth Shadow */}
      <polygon
        points="32,108 80,134 128,108 128,118 80,144 32,118"
        fill="#2c0610"
        opacity="0.9"
      />
      {/* Plinth Top Surface */}
      <polygon
        points="80,72 128,96 128,108 80,134 32,108 32,96"
        fill="url(#eventPlinthGrad)"
        stroke="#f43f5e"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Cyber Circuit Inset on Plinth */}
      <polygon
        points="80,82 114,99 80,118 46,99"
        stroke="#fb7185"
        strokeWidth="1"
        strokeDasharray="4 3"
        fill="none"
        opacity="0.5"
      />

      {/* Majestic Floating Grand Event Crystal Beacon */}
      <g transform="translate(80, 68)">
        {/* Diamond Core */}
        <polygon
          points="0,-48 20,-16 0,20 -20,-16"
          fill="url(#eventCrystalGrad)"
          stroke="#ffe4e6"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {/* Facet Reflection Lines */}
        <polygon points="0,-48 0,20 20,-16" fill="#ffffff" opacity="0.35" />
        <line x1="0" y1="-48" x2="0" y2="20" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
        <line x1="-20" y1="-16" x2="20" y2="-16" stroke="#fecdd3" strokeWidth="1" opacity="0.6" />

        {/* Golden Trophy Laurel Ring */}
        <path
          d="M-28 -4 C-36 -20 -18 -38 -2 -34"
          stroke="url(#eventGoldGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M28 -4 C36 -20 18 -38 2 -34"
          stroke="url(#eventGoldGrad)"
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Floating Crown / Star Peak */}
        <path
          d="M0 -54 L4 -46 L12 -46 L6 -42 L8 -34 L0 -38 L-8 -34 L-6 -42 L-12 -46 L-4 -46 Z"
          fill="url(#eventGoldGrad)"
          stroke="#fff"
          strokeWidth="0.8"
        />
      </g>

      {/* Glistening 4-Point Tactical Stars */}
      <path
        d="M136 40 Q136 48 144 48 Q136 48 136 56 Q136 48 128 48 Q136 48 136 40 Z"
        fill="#ffffff"
        filter="drop-shadow(0 0 6px #f43f5e)"
      />
      <path
        d="M24 64 Q24 69 29 69 Q24 69 24 74 Q24 69 19 69 Q24 69 24 64 Z"
        fill="#fda4af"
        opacity="0.9"
      />
    </svg>
  );
}

// 3. BATTLES: Cyber Hexagon Plinth + Crossed Anime Duel Blades + Speedline Clash (Electric Neon Violet Theme)
export function BattlesCardIcon({ className = '' }) {
  return (
    <svg
      className={`homev2-card-icon-art ${className}`}
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="battlePlinthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.55" />
          <stop offset="50%" stopColor="#5b21b6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#1a0833" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="bladeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="bladeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="50%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#1e0a38" />
        </linearGradient>
        <radialGradient id="battleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#6d28d9" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Electric Violet Glow */}
      <circle cx="65" cy="65" r="54" fill="url(#battleGlow)" />

      {/* 3D Hexagon Base */}
      <polygon
        points="22,78 65,104 108,78 108,86 65,112 22,86"
        fill="#1e0b3d"
        opacity="0.9"
      />
      <polygon
        points="65,36 108,60 108,78 65,104 22,78 22,60"
        fill="url(#battlePlinthGrad)"
        stroke="#a855f7"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* Anime Rival Duel Speedline Slashes on Plinth */}
      <line x1="32" y1="62" x2="98" y2="76" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="5 3" opacity="0.6" />
      <line x1="28" y1="72" x2="102" y2="72" stroke="#e9d5ff" strokeWidth="0.8" opacity="0.4" />
      <line x1="65" y1="40" x2="65" y2="100" stroke="#a78bfa" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.45" />

      {/* Crossed Tactical Anime Swords */}
      {/* Sword 1: Electric Violet Blade (Left Rival) */}
      <g transform="translate(65, 62) rotate(42)">
        <path d="M-3 -38 L3 -38 L2 18 L-2 18 Z" fill="url(#bladeGrad1)" stroke="#fff" strokeWidth="0.8" />
        {/* Crossguard & Hilt */}
        <rect x="-9" y="18" width="18" height="3.5" rx="1" fill="#ede9fe" stroke="#6d28d9" strokeWidth="0.6" />
        <rect x="-2" y="21.5" width="4" height="10" rx="1" fill="#3b0764" />
        <circle cx="0" cy="33" r="2.5" fill="#facc15" stroke="#6d28d9" strokeWidth="0.6" />
      </g>

      {/* Sword 2: Electric Indigo Blade (Right Rival) */}
      <g transform="translate(65, 62) rotate(-42)">
        <path d="M-3 -38 L3 -38 L2 18 L-2 18 Z" fill="url(#bladeGrad2)" stroke="#fff" strokeWidth="0.8" />
        {/* Crossguard & Hilt */}
        <rect x="-9" y="18" width="18" height="3.5" rx="1" fill="#e0e7ff" stroke="#4338ca" strokeWidth="0.6" />
        <rect x="-2" y="21.5" width="4" height="10" rx="1" fill="#1e1b4b" />
        <circle cx="0" cy="33" r="2.5" fill="#facc15" stroke="#4338ca" strokeWidth="0.6" />
      </g>

      {/* Central Duel Crest Shield */}
      <g transform="translate(65, 60)">
        <path
          d="M0 -15 L14 -9 L12 8 L0 16 L-12 8 L-14 -9 Z"
          fill="url(#shieldGrad)"
          stroke="#c084fc"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Central Star in Shield */}
        <path
          d="M0 -7 L2 -1 L8 0 L3 4 L4 9 L0 6 L-4 9 L-3 4 L-8 0 L-2 -1 Z"
          fill="#facc15"
        />
      </g>

      {/* Clash Impact Sparkles */}
      <path
        d="M104 38 Q104 44 110 44 Q104 44 104 50 Q104 44 98 44 Q104 44 104 38 Z"
        fill="#facc15"
        filter="drop-shadow(0 0 5px #a855f7)"
      />
      <path
        d="M26 44 Q26 49 31 49 Q26 49 26 54 Q26 49 21 49 Q26 49 26 44 Z"
        fill="#ffffff"
        filter="drop-shadow(0 0 5px #c084fc)"
      />
      <path
        d="M65 30 Q65 33 68 33 Q65 33 65 36 Q65 33 62 33 Q65 33 65 30 Z"
        fill="#c4b5fd"
        filter="drop-shadow(0 0 3px #8b5cf6)"
      />
    </svg>
  );
}

// 4. REWARDS: Compact Diamond Badge + Gift Crate / Reward Pass Chest
export function RewardsCardIcon({ className = '' }) {
  return (
    <svg
      className={`homev2-card-icon-art ${className}`}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="rewPlinth" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#451a03" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="rewGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Hexagon/Diamond Plate */}
      <polygon
        points="40,8 68,24 68,56 40,72 12,56 12,24"
        fill="url(#rewPlinth)"
        stroke="#f59e0b"
        strokeWidth="1.4"
      />

      {/* Reward Pass Chest / Gift */}
      <g transform="translate(40, 42)">
        {/* Chest Box Base */}
        <rect x="-18" y="-6" width="36" height="20" rx="3" fill="#78350f" stroke="#fef08a" strokeWidth="1.2" />
        {/* Chest Lid */}
        <path d="M-19 -6 L-15 -17 L15 -17 L19 -6 Z" fill="#92400e" stroke="#fef08a" strokeWidth="1.2" />
        {/* Golden Ribbon Bands */}
        <rect x="-4" y="-17" width="8" height="31" fill="url(#rewGold)" />
        <rect x="-19" y="2" width="38" height="5" fill="url(#rewGold)" />
        {/* Center Glowing Lock Jewel */}
        <circle cx="0" cy="4" r="4.5" fill="#facc15" stroke="#fff" strokeWidth="1" />
        <circle cx="0" cy="4" r="2" fill="#ef4444" />
      </g>

      {/* Sparkles */}
      <path
        d="M62 20 Q62 24 66 24 Q62 24 62 28 Q62 24 58 24 Q62 24 62 20 Z"
        fill="#fde047"
        filter="drop-shadow(0 0 3px #f59e0b)"
      />
    </svg>
  );
}

// 5. STORE: Luxury Flagship Boutique & Backlit Display (Sleek White / Platinum Theme)
export function StoreCardIcon({ className = '' }) {
  return (
    <svg
      className={`homev2-card-icon-art ${className}`}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="storePlinth" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e242c" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#0f1318" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#06080a" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="storeChandelier" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <radialGradient id="storeWhiteGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#94a3b8" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="storePack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2b333e" />
          <stop offset="50%" stopColor="#181d24" />
          <stop offset="100%" stopColor="#0d1015" />
        </linearGradient>
        <linearGradient id="storeUnderglow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Luminous White Ambient Boutique Glow */}
      <circle cx="40" cy="42" r="34" fill="url(#storeWhiteGlow)" />

      {/* Hexagonal Display Showcase Base */}
      <polygon
        points="40,8 68,24 68,56 40,72 12,56 12,24"
        fill="url(#storePlinth)"
        stroke="url(#storeChandelier)"
        strokeWidth="1.4"
      />

      {/* Floor Ambient Lighting Guidelines */}
      <line x1="22" y1="64" x2="58" y2="64" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.4" />
      <line x1="40" y1="12" x2="40" y2="68" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

      {/* Suspended Overhead Rectangular Chandelier Fixture (Perspective View) */}
      <polygon
        points="26,14 54,14 62,20 18,20"
        stroke="url(#storeChandelier)"
        strokeWidth="1.5"
        fill="none"
        filter="drop-shadow(0 0 4px #ffffff)"
      />
      {/* Chandelier Suspension Wires */}
      <line x1="26" y1="10" x2="26" y2="14" stroke="#94a3b8" strokeWidth="0.8" opacity="0.8" />
      <line x1="54" y1="10" x2="54" y2="14" stroke="#94a3b8" strokeWidth="0.8" opacity="0.8" />
      <line x1="39" y1="14" x2="41" y2="20" stroke="#ffffff" strokeWidth="0.9" opacity="0.8" />

      {/* Illuminated Backlit Boutique Display Shelf */}
      <line
        x1="20"
        y1="51"
        x2="60"
        y2="51"
        stroke="#ffffff"
        strokeWidth="1.8"
        strokeLinecap="round"
        filter="drop-shadow(0 1px 5px #ffffff)"
      />
      {/* Crisp White Shelf Downlight Glow */}
      <polygon points="22,52 58,52 64,63 16,63" fill="url(#storeUnderglow)" />

      {/* Luxury Designer Backpack on Upper Display Shelf (Platinum / Carbon Edition) */}
      <g transform="translate(40, 39)">
        {/* Main Leather Body */}
        <path
          d="M-13 10 C-14 10 -15 8 -15 3 L-13 -10 C-13 -15 -8 -17 0 -17 C8 -17 13 -15 13 -10 L15 3 C15 8 14 10 13 10 Z"
          fill="url(#storePack)"
          stroke="#475569"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />

        {/* Top Flap with Platinum Trim */}
        <path
          d="M-11 -8 C-11 -13 -6 -15 0 -15 C6 -15 11 -13 11 -8 L9 -1 L-9 -1 Z"
          fill="#1e293b"
          stroke="#f8fafc"
          strokeWidth="0.8"
        />

        {/* Grab Handle */}
        <path
          d="M-4 -15 C-4 -18 4 -18 4 -15"
          stroke="#cbd5e1"
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />

        {/* Silver Straps & Polished Buckles */}
        <line x1="-5" y1="-10" x2="-5" y2="8" stroke="#f1f5f9" strokeWidth="1.2" />
        <line x1="5" y1="-10" x2="5" y2="8" stroke="#f1f5f9" strokeWidth="1.2" />
        <rect x="-6.5" y="-1" width="3" height="3" rx="0.5" fill="#ffffff" stroke="#475569" strokeWidth="0.4" />
        <rect x="3.5" y="-1" width="3" height="3" rx="0.5" fill="#ffffff" stroke="#475569" strokeWidth="0.4" />

        {/* Center Luxury Emblem / Crest */}
        <circle cx="0" cy="4" r="1.8" fill="#ffffff" filter="drop-shadow(0 0 3px #ffffff)" />
      </g>

      {/* Lower Shelf Display: Luxury Sneaker Silhouette with Backlit Glow */}
      <g transform="translate(40, 58)">
        {/* Sneaker Silhouette */}
        <path
          d="M-10 1 L-8 -2 L-3 -3 L1 -1 L8 -1 L10 1 Z"
          fill="#0f172a"
          stroke="#94a3b8"
          strokeWidth="0.7"
        />
        {/* Glowing Sneaker White Sole */}
        <line x1="-11" y1="2" x2="11" y2="2" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" />
        {/* Silver Sneaker Stripe */}
        <line x1="-3" y1="-1" x2="3" y2="0" stroke="#e2e8f0" strokeWidth="0.8" />
      </g>

      {/* Brilliant Diamond White Sparkles */}
      <path
        d="M62 20 Q62 24 66 24 Q62 24 62 28 Q62 24 58 24 Q62 24 62 20 Z"
        fill="#ffffff"
        filter="drop-shadow(0 0 3px #ffffff)"
      />
      <path
        d="M18 24 Q18 27 21 27 Q18 27 18 30 Q18 27 15 27 Q18 27 18 24 Z"
        fill="#f8fafc"
        opacity="0.9"
      />
    </svg>
  );
}

// 6. ACHIEVEMENTS: Grand Championship Trophy, Laurel Wreath & Halo Chandelier (Pure Championship Gold Theme)
export function AchievementsCardIcon({ className = '' }) {
  return (
    <svg
      className={`homev2-card-icon-art ${className}`}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="achPlinth" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2e1906" stopOpacity="0.88" />
          <stop offset="50%" stopColor="#1a0e03" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0a0501" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="achGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="25%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#facc15" />
          <stop offset="75%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="achGoldStem" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="achNeon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fef08a" />
          <stop offset="70%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <radialGradient id="achGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#facc15" stopOpacity="0.5" />
          <stop offset="55%" stopColor="#eab308" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="achSpotlight" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#facc15" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Championship Gold Ambient Glow */}
      <circle cx="40" cy="42" r="34" fill="url(#achGlow)" />

      {/* Hexagonal Hall of Fame Sanctuary Base */}
      <polygon
        points="40,8 68,24 68,56 40,72 12,56 12,24"
        fill="url(#achPlinth)"
        stroke="url(#achNeon)"
        strokeWidth="1.4"
      />

      {/* Floor Spotlight Reflection Lines */}
      <line x1="22" y1="64" x2="58" y2="64" stroke="#facc15" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
      <line x1="40" y1="12" x2="40" y2="68" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.3" />

      {/* Overhead Halo Chandelier (Perspective View Dual Rings in Gold) */}
      <ellipse
        cx="40"
        cy="14"
        rx="17"
        ry="5.5"
        stroke="url(#achNeon)"
        strokeWidth="1.4"
        fill="none"
        filter="drop-shadow(0 0 4px #facc15)"
      />
      <ellipse cx="40" cy="14" rx="11" ry="3.5" stroke="#fffbeb" strokeWidth="0.9" fill="none" opacity="0.85" />
      {/* Halo Suspension Cables */}
      <line x1="24" y1="9" x2="24" y2="14" stroke="#ca8a04" strokeWidth="0.8" opacity="0.7" />
      <line x1="56" y1="9" x2="56" y2="14" stroke="#ca8a04" strokeWidth="0.8" opacity="0.7" />

      {/* Central Golden Spotlight Beam */}
      <polygon points="35,16 45,16 53,52 27,52" fill="url(#achSpotlight)" />

      {/* Stepped Circular Neon Dais (Bottom Stage in Gold) */}
      <ellipse cx="40" cy="62" rx="22" ry="7" stroke="#ca8a04" strokeWidth="1.2" fill="#1f1003" opacity="0.9" />
      <ellipse
        cx="40"
        cy="58"
        rx="16"
        ry="5"
        stroke="#facc15"
        strokeWidth="1.4"
        fill="#2c1705"
        filter="drop-shadow(0 0 4px #facc15)"
      />

      {/* Polished Marble Trophy Pedestal */}
      <polygon points="33,51 47,51 49,55 31,55" fill="#1c0f03" stroke="#facc15" strokeWidth="0.8" />
      <rect x="34" y="46" width="12" height="5" rx="1" fill="#130a02" stroke="#fef08a" strokeWidth="0.8" />

      {/* Centerpiece: Grand Golden Championship Trophy & Laurel Wreath */}
      <g transform="translate(40, 35)">
        {/* Laurel Wreath Left */}
        <path
          d="M-5 5 C-15 3 -17 -9 -9 -16"
          stroke="url(#achGold)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Left Laurel Leaves */}
        <path d="M-9 -16 C-12 -16 -13 -13 -10 -13 Z" fill="url(#achGold)" />
        <path d="M-13 -9 C-16 -8 -16 -5 -13 -6 Z" fill="url(#achGold)" />
        <path d="M-14 -1 C-17 1 -16 4 -13 2 Z" fill="url(#achGold)" />
        <path d="M-11 5 C-13 8 -11 10 -9 8 Z" fill="url(#achGold)" />

        {/* Laurel Wreath Right */}
        <path
          d="M5 5 C15 3 17 -9 9 -16"
          stroke="url(#achGold)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Laurel Leaves */}
        <path d="M9 -16 C12 -16 13 -13 10 -13 Z" fill="url(#achGold)" />
        <path d="M13 -9 C16 -8 16 -5 13 -6 Z" fill="url(#achGold)" />
        <path d="M14 -1 C17 1 16 4 13 2 Z" fill="url(#achGold)" />
        <path d="M11 5 C13 8 11 10 9 8 Z" fill="url(#achGold)" />

        {/* Grand Championship Trophy Cup */}
        {/* Cup Bowl */}
        <path
          d="M-8 -11 L8 -11 C8 -2 5 3 0 5 C-5 3 -8 -2 -8 -11 Z"
          fill="url(#achGold)"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        {/* Cup Rim */}
        <ellipse cx="0" cy="-11" rx="8" ry="2" fill="#fffbeb" stroke="#ffffff" strokeWidth="0.6" />

        {/* Cup Left Handle */}
        <path
          d="M-7 -9 C-13 -9 -13 0 -5 1.5"
          stroke="url(#achGold)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
        {/* Cup Right Handle */}
        <path
          d="M7 -9 C13 -9 13 0 5 1.5"
          stroke="url(#achGold)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Trophy Stem & Golden Base */}
        <rect x="-2" y="5" width="4" height="4" fill="url(#achGoldStem)" stroke="#fef08a" strokeWidth="0.5" />
        <polygon points="-6,11 6,11 4,9 -4,9" fill="url(#achGold)" stroke="#ffffff" strokeWidth="0.5" />

        {/* Center Star Emblem on Trophy */}
        <path
          d="M0 -5.5 L1.2 -2 L4.8 -2 L2 0.3 L3.1 3.8 L0 1.9 L-3.1 3.8 L-2 0.3 L-4.8 -2 L-1.2 -2 Z"
          fill="#ffffff"
          filter="drop-shadow(0 0 3px #fff)"
        />
      </g>

      {/* Radiant Golden Flares & Sparkles */}
      <path
        d="M62 20 Q62 24 66 24 Q62 24 62 28 Q62 24 58 24 Q62 24 62 20 Z"
        fill="#fef08a"
        filter="drop-shadow(0 0 4px #facc15)"
      />
      <path
        d="M18 24 Q18 27 21 27 Q18 27 18 30 Q18 27 15 27 Q18 27 18 24 Z"
        fill="#fde047"
        opacity="0.9"
      />
      <circle cx="40" cy="30" r="1.5" fill="#ffffff" filter="drop-shadow(0 0 3px #fef08a)" />
    </svg>
  );
}

// 7. COSMETICS: Cyber Streetwear Wardrobe & Neon Showroom Plinth (Direct Match to Cyber Boutique Photo)
export function CosmeticsCardIcon({ className = '' }) {
  return (
    <svg
      className={`homev2-card-icon-art ${className}`}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cosPlinth" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#0f172a" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#020617" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="cosNeonLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="cosHoodie" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <radialGradient id="cosAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#818cf8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Cyber Showroom Aura Glow */}
      <circle cx="40" cy="42" r="34" fill="url(#cosAura)" />

      {/* Hexagonal Showroom Podium Base */}
      <polygon
        points="40,8 68,24 68,56 40,72 12,56 12,24"
        fill="url(#cosPlinth)"
        stroke="url(#cosNeonLine)"
        strokeWidth="1.4"
      />
      {/* Floor Spotlight Grid Lines */}
      <line x1="22" y1="46" x2="58" y2="46" stroke="#38bdf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />
      <line x1="40" y1="12" x2="40" y2="68" stroke="#818cf8" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.35" />

      {/* Overhead Suspended Neon Rectangular Ceiling Light (Perspective View) */}
      <polygon
        points="26,14 54,14 62,20 18,20"
        stroke="url(#cosNeonLine)"
        strokeWidth="1.4"
        fill="none"
        filter="drop-shadow(0 0 3px #38bdf8)"
      />

      {/* Tactical Streetwear Outfit & Titanium Hanger */}
      <g transform="translate(40, 44)">
        {/* Hanger Hook */}
        <path
          d="M0 -22 C-3 -22 -4 -19 -4 -17 C-4 -14 0 -13 0 -10 L0 -8"
          stroke="#e2e8f0"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Hanger Crossbar */}
        <line x1="-16" y1="-8" x2="16" y2="-8" stroke="#cbd5e1" strokeWidth="1.4" strokeLinecap="round" />

        {/* Streetwear Hoodie Silhouette */}
        <path
          d="M-15 -6 L-18 6 L-14 8 L-11 -1 L-11 16 L11 16 L11 -1 L14 8 L18 6 L15 -6 L8 -9 L0 -7 L-8 -9 Z"
          fill="url(#cosHoodie)"
          stroke="#64748b"
          strokeWidth="1"
          strokeLinejoin="round"
        />

        {/* Tactical High-Collar & Hood Line */}
        <path d="M-6 -8 C-4 -5 4 -5 6 -8" stroke="#38bdf8" strokeWidth="1" fill="none" />

        {/* Center Neon Cyan Zipper Stripe */}
        <line x1="0" y1="-6" x2="0" y2="16" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
        {/* Neon Zipper Pull Tag */}
        <rect x="-1.5" y="0" width="3" height="4" rx="1" fill="#facc15" />

        {/* Neon Violet Sleeve & Shoulder Accent Stripes */}
        <line x1="-16" y1="1" x2="-13" y2="7" stroke="#a855f7" strokeWidth="1.2" />
        <line x1="16" y1="1" x2="13" y2="7" stroke="#a855f7" strokeWidth="1.2" />
      </g>

      {/* Cyber Glint Sparkles */}
      <path
        d="M62 20 Q62 24 66 24 Q62 24 62 28 Q62 24 58 24 Q62 24 62 20 Z"
        fill="#ffffff"
        filter="drop-shadow(0 0 4px #38bdf8)"
      />
      <path
        d="M18 26 Q18 29 21 29 Q18 29 18 32 Q18 29 15 29 Q18 29 18 26 Z"
        fill="#a5b4fc"
        opacity="0.9"
      />
    </svg>
  );
}
