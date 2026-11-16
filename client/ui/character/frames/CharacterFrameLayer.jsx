/**
 * Outer Frame Borders & Level Indicator Badges
 */
export const CharacterFrameLayer = ({ frameId, level = 24, cropMode = 'circle' }) => {
  const isCircle = true; // Frames are always circular profile frames

  if (frameId === 'frame-crimson-eng') {
    return (
      <g id="layer-14-frame-crimson">
        {/* Outer concentric tech border & crimson ring */}
        <circle cx="200" cy="155" r="149" fill="none" stroke="#FBBF24" strokeWidth="1.5" opacity="0.65" strokeDasharray="6 14" />
        <circle cx="200" cy="155" r="142" fill="none" stroke="#DC2626" strokeWidth="8" />
        <circle cx="200" cy="155" r="134" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeDasharray="16 8" />
        {/* Precision Rivets around the circle */}
        <circle cx="342" cy="155" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="58" cy="155" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="200" cy="13" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="300" cy="55" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="100" cy="55" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="100" cy="255" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="300" cy="255" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        {/* Level Pill */}
        <g transform="translate(200, 295)">
          <rect x="-46" y="-14" width="92" height="24" rx="12" fill="#991B1B" stroke="#FBBF24" strokeWidth="2.5" />
          <text x="0" y="2" textAnchor="middle" fill="#FEF2F2" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            ENG LVL {level}
          </text>
        </g>
      </g>
    );
  }

  if (frameId === 'frame-sql-champion') {
    return (
      <g id="layer-14-frame-sql">
        <circle cx="200" cy="155" r="150" fill="none" stroke="#22D3EE" strokeWidth="1.5" opacity="0.8" strokeDasharray="4 8" />
        <circle cx="200" cy="155" r="142" fill="none" stroke="#06B6D4" strokeWidth="8" strokeDasharray="24 6" />
        <circle cx="200" cy="155" r="134" fill="none" stroke="#083344" strokeWidth="3" />
        {/* Telemetry Nodes */}
        <circle cx="300" cy="55" r="4.5" fill="#22D3EE" />
        <circle cx="100" cy="55" r="4.5" fill="#22D3EE" />
        <circle cx="100" cy="255" r="4.5" fill="#22D3EE" />
        <circle cx="300" cy="255" r="4.5" fill="#22D3EE" />
        <g transform="translate(200, 295)">
          <rect x="-52" y="-14" width="104" height="24" rx="6" fill="#083344" stroke="#22D3EE" strokeWidth="2.5" />
          <text x="0" y="2" textAnchor="middle" fill="#67E8F9" fontSize="11" fontWeight="800" fontFamily="monospace">
            SQL::LVL_{level}
          </text>
        </g>
      </g>
    );
  }

  if (frameId === 'frame-archon-mythic') {
    return (
      <g id="layer-14-frame-archon">
        <circle cx="200" cy="155" r="150" fill="none" stroke="#FDE68A" strokeWidth="2" strokeDasharray="16 10" />
        <circle cx="200" cy="155" r="142" fill="none" stroke="#F59E0B" strokeWidth="9" />
        <circle cx="200" cy="155" r="133" fill="none" stroke="#78350F" strokeWidth="3" />
        {/* Sovereign star on top */}
        <polygon points="200,3 203,11 211,13 203,15 200,23 197,15 189,13 197,11" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
        <circle cx="300" cy="55" r="4.5" fill="#FDE68A" />
        <circle cx="100" cy="55" r="4.5" fill="#FDE68A" />
        <g transform="translate(200, 295)">
          <rect x="-56" y="-14" width="112" height="24" rx="12" fill="#451A03" stroke="#FBBF24" strokeWidth="2.5" />
          <text x="0" y="2" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            ★ ARCHON {level} ★
          </text>
        </g>
      </g>
    );
  }

  // Default AURA Frame
  return (
    <g id="layer-14-frame-default">
      <circle cx="200" cy="155" r="148" fill="none" stroke="#A5B4FC" strokeWidth="1.5" opacity="0.65" strokeDasharray="8 6" />
      <circle cx="200" cy="155" r="142" fill="none" stroke="#6366F1" strokeWidth="7" opacity="0.9" />
      <circle cx="200" cy="155" r="135" fill="none" stroke="#312E81" strokeWidth="2.5" />
      <g transform="translate(200, 295)">
        <rect x="-38" y="-14" width="76" height="24" rx="12" fill="#1E293B" stroke="#6366F1" strokeWidth="2" />
        <text x="0" y="2" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="800" fontFamily="sans-serif">
          LVL {level}
        </text>
      </g>
    </g>
  );
};

