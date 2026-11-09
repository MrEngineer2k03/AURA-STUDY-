/**
 * Environment & Aura Stage Backdrop
 */
export const CharacterEnvironmentLayer = ({ frameId }) => {
  const glowColor =
    frameId === 'frame-crimson-eng' ? '#EF4444' :
    frameId === 'frame-sql-champion' ? '#06B6D4' :
    frameId === 'frame-archon-mythic' ? '#F59E0B' : '#6366F1';

  return (
    <g id="layer-01-environment">
      <defs>
        <radialGradient id="auraStageGlow" cx="50%" cy="42%" r="52%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.28" />
          <stop offset="65%" stopColor="#1E1B4B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#090D16" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floorShadow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="50%" stopColor="#000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Ambient Backdrop Circle */}
      <circle cx="200" cy="220" r="175" fill="url(#auraStageGlow)" />
      {/* Subtle Grid Ring */}
      <circle cx="200" cy="195" r="138" fill="none" stroke={glowColor} strokeOpacity="0.16" strokeWidth="1.5" strokeDasharray="6 6" />
      {/* Ground Platform Shadow */}
      <ellipse cx="200" cy="492" rx="86" ry="14" fill="url(#floorShadow)" />
      <ellipse cx="200" cy="492" rx="64" ry="8" fill={glowColor} fillOpacity="0.15" />
    </g>
  );
};

