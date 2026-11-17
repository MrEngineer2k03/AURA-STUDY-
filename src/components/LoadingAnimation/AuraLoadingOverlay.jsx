import React, { useMemo } from 'react';
import './AuraLoadingOverlay.css';

export const AURA_ROUTES = {
  HOME: {
    id: 'home',
    path: '/',
    label: 'Home',
    code: 'SYS // NEXUS-01',
    subtitle: 'PREPARING YOUR EXPERIENCE...',
    telemetry: 'CORE_SYNC // 99.98% STABLE',
    accentPrimary: '#FF1E56',
    accentSecondary: '#E11D48',
    badge: 'COMMAND NEXUS',
  },
  'MY FOLDERS': {
    id: 'folders',
    path: '/folders',
    label: 'My Folders',
    code: 'ARC // VAULT-02',
    subtitle: 'SYNCING KNOWLEDGE ARCHIVES...',
    telemetry: 'INDEX_NODES // 128 SHARDS',
    accentPrimary: '#FF1E56',
    accentSecondary: '#FB7185',
    badge: 'DATA ARCHIVES',
  },
  FRIENDS: {
    id: 'friends',
    path: '/friends',
    label: 'Friends',
    code: 'NET // SQUAD-03',
    subtitle: 'ESTABLISHING NEURAL LINKS...',
    telemetry: 'PARTY_MESH // 14 ONLINE',
    accentPrimary: '#FF1E56',
    accentSecondary: '#38BDF8',
    badge: 'NEURAL NETWORK',
  },
  BATTLES: {
    id: 'battles',
    path: '/battles',
    label: 'Battles',
    code: 'CMB // ARENA-04',
    subtitle: 'INITIALIZING COMBAT ARENA...',
    telemetry: 'VOLTAGE_ARC // OVERDRIVE',
    accentPrimary: '#FF1E56',
    accentSecondary: '#9333EA',
    badge: 'RANKED ARENA',
  },
  EVENTS: {
    id: 'events',
    path: '/events',
    label: 'Events',
    code: 'EVT // CHRONO-05',
    subtitle: 'CALIBRATING TEMPORAL RIFTS...',
    telemetry: 'SEASON_04 // BLOOD MOON',
    accentPrimary: '#FF1E56',
    accentSecondary: '#F43F5E',
    badge: 'LIVE PROTOCOL',
  },
  ACHIEVEMENTS: {
    id: 'achievements',
    path: '/achievements',
    label: 'Achievements',
    code: 'HNR // CREST-06',
    subtitle: 'UNLOCKING LEGACY RECORDS...',
    telemetry: 'PRESTIGE_TIER // GRANDMASTER',
    accentPrimary: '#F59E0B',
    accentSecondary: '#FF1E56',
    badge: 'HALL OF VALOR',
  },
  STORE: {
    id: 'store',
    path: '/store',
    label: 'Store',
    code: 'MKT // VAULT-07',
    subtitle: 'AUTHENTICATING BLACK MARKET...',
    telemetry: 'AURA_CREDITS // ENCRYPTED',
    accentPrimary: '#FF1E56',
    accentSecondary: '#FBBF24',
    badge: 'ARMORY & RELICS',
  },
  COSMETICS: {
    id: 'store',
    path: '/customize',
    label: 'Cosmetics',
    code: 'CSM // WARDROBE-09',
    subtitle: 'CUSTOMIZING ATTIRE & RIGS...',
    telemetry: 'TEXTURE_STREAM // 100%',
    accentPrimary: '#06B6D4',
    accentSecondary: '#3B82F6',
    badge: 'WARDROBE & STYLES',
  },
  PROFILE: {
    id: 'profile',
    path: '/profile',
    label: 'Profile & Gear',
    code: 'USR // AVATAR-08',
    subtitle: 'LOADING OPERATOR DATA...',
    telemetry: 'GEAR_SYNC // SYNCHRONIZED',
    accentPrimary: '#9333EA',
    accentSecondary: '#FF1E56',
    badge: 'OPERATOR PROFILE',
  },
};

// Generates 18 ambient floating particles with fixed deterministic distribution
const PARTICLE_SEEDS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 19 + 7) % 94}%`,
  top: `${(i * 29 + 11) % 88}%`,
  size: (i % 3) + 2,
  delay: (i % 5) * 0.22,
  duration: 2.2 + (i % 4) * 0.45,
}));

// Route Centerpieces (Folders, Friends, Battles, Events, Achievements, Store, Home)
const RouteCenterpiece = React.memo(({ routeId, accentPrimary, accentSecondary }) => {
  switch (routeId) {
    case 'folders':
      return (
        <div className="aura-cp-folders">
          <div className="aura-cp-folder-shard shard-0">
            <div style={{ width: '20px', height: '5px', background: 'rgba(255,30,86,0.8)', borderRadius: '2px 2px 0 0', marginTop: '-5px', marginLeft: '8px' }} />
          </div>
          <div className="aura-cp-folder-shard shard-1" />
          <div className="aura-cp-folder-shard shard-2" />
          <div className="aura-cp-folder-content">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 12px #ff1e56)' }}>
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              <path d="M2 10h20" />
            </svg>
            <span className="aura-cp-folder-indexing">INDEXING</span>
          </div>
        </div>
      );

    case 'friends':
      return (
        <div className="aura-cp-friends">
          <svg className="aura-cp-friends-net" viewBox="0 0 140 140">
            <line x1="70" y1="70" x2="30" y2="34" stroke="#FF1E56" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="70" y1="70" x2="112" y2="38" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="70" y1="70" x2="28" y2="104" stroke="#FF1E56" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="70" y1="70" x2="110" y2="106" stroke="#FB7185" strokeWidth="1.5" strokeDasharray="4 3" />
            {[
              { cx: 30, cy: 34, c: '#FF1E56' },
              { cx: 112, cy: 38, c: '#38BDF8' },
              { cx: 28, cy: 104, c: '#FB7185' },
              { cx: 110, cy: 106, c: '#FF1E56' },
            ].map((node, idx) => (
              <g key={idx}>
                <circle cx={node.cx} cy={node.cy} r="6" fill="#090912" stroke={node.c} strokeWidth="1.5" />
                <circle cx={node.cx} cy={node.cy} r="2.5" fill={node.c} />
              </g>
            ))}
          </svg>
          <div className="aura-cp-friends-hub">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffe4e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>
      );

    case 'battles':
      return (
        <div className="aura-cp-battles">
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 140 140">
            <path d="M 22 70 Q 48 30, 70 70 T 118 70" fill="none" stroke="#FF1E56" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 70 22 Q 110 48, 70 70 T 70 118" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <div className="aura-cp-battles-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px #a855f7)' }}>
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
              <line x1="13" y1="19" x2="19" y2="13" />
              <line x1="16" y1="16" x2="20" y2="20" />
              <line x1="19" y1="21" x2="21" y2="19" />
              <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
              <line x1="5" y1="14" x2="9" y2="18" />
              <line x1="7" y1="17" x2="4" y2="20" />
              <line x1="3" y1="19" x2="5" y2="21" />
            </svg>
          </div>
        </div>
      );

    case 'events':
      return (
        <div className="aura-cp-events">
          <div className="aura-events-geom-outer" />
          <div className="aura-events-geom-inner" />
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 10, filter: 'drop-shadow(0 0 14px #ff1e56)' }}>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
            <circle cx="8" cy="15" r="1" fill="#fda4af" />
            <circle cx="12" cy="15" r="1" fill="#fda4af" />
            <circle cx="16" cy="15" r="1" fill="#fda4af" />
          </svg>
        </div>
      );

    case 'achievements':
      return (
        <div className="aura-cp-achievements">
          <div className="aura-achieve-aura-blur" />
          <div className="aura-achieve-crest">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 12px #f59e0b)' }}>
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <span className="aura-achieve-rank-tag">RANK S+</span>
          </div>
        </div>
      );

    case 'store':
      return (
        <div className="aura-cp-store">
          <div className="aura-store-coin coin-left">
            <div className="aura-store-coin-diamond" />
          </div>
          <div className="aura-store-coin coin-mid">
            <div className="aura-store-coin-diamond" />
          </div>
          <div className="aura-store-coin coin-right">
            <div className="aura-store-coin-diamond" />
          </div>
          <div className="aura-store-bag-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px #ff1e56)' }}>
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
        </div>
      );

    case 'profile':
      return (
        <div className="aura-cp-battles">
          <div className="aura-achieve-aura-blur" style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(255, 30, 86, 0.25) 50%, transparent 75%)' }} />
          <div className="aura-cp-battles-badge" style={{ borderColor: 'rgba(168, 85, 247, 0.85)', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.4) 0%, rgba(225, 29, 72, 0.4) 100%)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 10px #a855f7)' }}>
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      );

    case 'home':
    default:
      return (
        <div className="aura-cp-home">
          <div className="aura-home-pulse-ring-1" />
          <div className="aura-home-pulse-ring-2" />
          <div className="aura-home-core-badge">
            <div className="aura-home-emblem-box">
              <svg viewBox="0 0 40 40" className="aura-home-emblem-svg">
                <polygon points="20,4 35,34 27,34 20,18 13,34 5,34" fill="#FF1E56" />
                <polygon points="20,13 25,25 15,25" fill="#FFF" />
              </svg>
            </div>
            <span className="aura-home-core-label">AURA</span>
          </div>
        </div>
      );
  }
});

export default function AuraLoadingOverlay({
  isVisible = false,
  targetRoute = 'HOME',
  progress = 0,
}) {
  // Map targetRoute to configured metadata
  const routeMeta = useMemo(() => {
    if (!targetRoute) return AURA_ROUTES.HOME;
    const cleanKey = String(targetRoute).trim().toUpperCase();
    if (AURA_ROUTES[cleanKey]) return AURA_ROUTES[cleanKey];

    // Check by path or partial match
    if (cleanKey.includes('FOLDER')) return AURA_ROUTES['MY FOLDERS'];
    if (cleanKey.includes('FRIEND')) return AURA_ROUTES.FRIENDS;
    if (cleanKey.includes('BATTLE')) return AURA_ROUTES.BATTLES;
    if (cleanKey.includes('EVENT')) return AURA_ROUTES.EVENTS;
    if (cleanKey.includes('ACHIEVE')) return AURA_ROUTES.ACHIEVEMENTS;
    if (cleanKey.includes('STORE')) return AURA_ROUTES.STORE;
    if (cleanKey.includes('COSMETIC') || cleanKey.includes('CUSTOMIZE')) return AURA_ROUTES.COSMETICS;
    if (cleanKey.includes('PROFILE')) return AURA_ROUTES.PROFILE;
    return AURA_ROUTES.HOME;
  }, [targetRoute]);

  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  // SVG circular progress calculation
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (roundedProgress / 100) * circumference;

  if (!isVisible && progress === 0) {
    return null;
  }

  return (
    <aside
      className={`aura-loading-overlay-root ${isVisible ? 'is-visible' : 'is-exiting'}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${routeMeta.label}`}
    >
      {/* Background Neon Flowing Energy Waves */}
      <svg
        className="aura-loading-energy-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="auraEnergyGradMain" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor={routeMeta.accentPrimary} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M -200 220 C 320 120, 820 340, 1640 180"
          stroke="url(#auraEnergyGradMain)"
          strokeWidth="2.5"
          fill="none"
          className="aura-energy-path-top"
        />
        <path
          d="M -200 680 C 480 780, 960 560, 1640 700"
          stroke="url(#auraEnergyGradMain)"
          strokeWidth="2"
          fill="none"
          className="aura-energy-path-bottom"
        />
      </svg>

      {/* Floating Glowing Cyber Particles */}
      <div className="aura-loading-particles-canvas" aria-hidden="true">
        {PARTICLE_SEEDS.map((p) => (
          <div
            key={p.id}
            className="aura-loading-particle"
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.id % 2 === 0 ? routeMeta.accentPrimary : routeMeta.accentSecondary,
              boxShadow: `0 0 10px ${routeMeta.accentPrimary}`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Futuristic Corner Telemetry HUD Brackets */}
      <div className="aura-loading-hud-corners" aria-hidden="true">
        <div className="aura-hud-corner-row">
          <div className="aura-hud-bracket top-left">
            <span>{routeMeta.code}</span>
          </div>
          <div className="aura-hud-bracket top-right">
            <span>AURA // OS v4.2</span>
          </div>
        </div>
        <div className="aura-hud-corner-row bottom">
          <div className="aura-hud-bracket bottom-left">
            <span>LATENCY: 4.2ms</span>
          </div>
          <div className="aura-hud-bracket bottom-right">
            <span>{routeMeta.telemetry}</span>
          </div>
        </div>
      </div>

      {/* Center Tactical HUD Stage */}
      <div className="aura-loading-central-stage">
        {/* Route Badge Pill */}
        <div className="aura-loading-route-pill">
          <span className="aura-loading-pulse-dot" />
          <span className="aura-loading-pill-text">
            {routeMeta.badge} // {routeMeta.label}
          </span>
        </div>

        {/* Dual Rotating Tactical HUD Rings + Centerpiece */}
        <div className="aura-loading-ring-wrap">
          {/* Outer Counter-Rotating Dashed Tactical Ring */}
          <svg className="aura-ring-outer-svg" viewBox="0 0 220 220">
            <circle
              cx="110"
              cy="110"
              r="102"
              fill="none"
              stroke="rgba(255, 30, 86, 0.25)"
              strokeWidth="1.5"
              strokeDasharray="6 10 22 10"
            />
          </svg>

          {/* Primary Progress Ring with Neon Drop Shadow */}
          <svg className="aura-ring-progress-svg" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r={radius} className="aura-progress-circle-bg" />
            <circle
              cx="110"
              cy="110"
              r={radius}
              className="aura-progress-circle-fill"
              stroke={routeMeta.accentPrimary}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter: `drop-shadow(0 0 10px ${routeMeta.accentPrimary})`,
              }}
            />
          </svg>

          {/* Inner Rotating Orbit Ring */}
          <svg className="aura-ring-inner-svg" viewBox="0 0 220 220">
            <circle
              cx="110"
              cy="110"
              r="74"
              fill="none"
              stroke={routeMeta.accentSecondary}
              strokeOpacity="0.45"
              strokeWidth="1.5"
              strokeDasharray="35 140"
              strokeLinecap="round"
            />
          </svg>

          {/* Dynamic Centerpiece Component */}
          <div className="aura-centerpiece-container">
            <RouteCenterpiece
              routeId={routeMeta.id}
              accentPrimary={routeMeta.accentPrimary}
              accentSecondary={routeMeta.accentSecondary}
            />
          </div>
        </div>

        {/* Loading Progress Info & Dynamic Percent */}
        <div className="aura-loading-readout-wrap">
          <div className="aura-loading-info-row">
            <span className="aura-loading-subtitle">{routeMeta.subtitle}</span>
            <span className="aura-loading-percentage">{roundedProgress}%</span>
          </div>

          {/* Glowing Animated Progress Bar */}
          <div className="aura-loading-bar-track">
            <div
              className="aura-loading-bar-fill"
              style={{
                width: `${roundedProgress}%`,
                background: `linear-gradient(90deg, #9F1239 0%, ${routeMeta.accentPrimary} 60%, #FFF 100%)`,
                boxShadow: `0 0 16px ${routeMeta.accentPrimary}`,
              }}
            />
          </div>

          {/* Sub-telemetry status line */}
          <div className="aura-loading-telemetry-row">
            <span>ROUTE // {routeMeta.path.toUpperCase()}</span>
            <span className="aura-telemetry-engine">AURA QUANTUM ENGINE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
