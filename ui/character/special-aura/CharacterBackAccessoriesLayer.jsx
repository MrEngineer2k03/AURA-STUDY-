/**
 * Back Accessories: floating SQL nodes, astral wings, and celestial halo
 */
export const CharacterBackAccessoriesLayer = ({ specialId }) => {
  if (specialId === 'special-sql-nodes') {
    return (
      <g id="layer-02-back-special" strokeLinecap="round" strokeLinejoin="round">
        {/* Orbiting SQL Telemetry Ring & Floating Schema Nodes */}
        <ellipse cx="200" cy="225" rx="145" ry="52" fill="none" stroke="#22D3EE" strokeWidth="2" strokeDasharray="8 6" opacity="0.65" transform="rotate(-14 200 225)" />
        {/* Left Floating DB Node */}
        <g transform="translate(56, 150)">
          <rect x="0" y="0" width="46" height="54" rx="8" fill="#083344" stroke="#22D3EE" strokeWidth="2.5" />
          <line x1="8" y1="16" x2="38" y2="16" stroke="#67E8F9" strokeWidth="2.5" />
          <line x1="8" y1="28" x2="30" y2="28" stroke="#22D3EE" strokeWidth="2" />
          <circle cx="35" cy="40" r="4" fill="#34D399" />
          <text x="8" y="43" fill="#A5F3FC" fontSize="9" fontWeight="bold" fontFamily="monospace">SQL</text>
        </g>
        {/* Right Floating DB Cylinder */}
        <g transform="translate(296, 130)">
          <path d="M4,12 C4,6 44,6 44,12 L44,44 C44,50 4,50 4,44 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
          <ellipse cx="24" cy="12" rx="20" ry="6" fill="#0284C7" stroke="#7DD3FC" strokeWidth="2" />
          <path d="M4,24 C4,30 44,30 44,24" fill="none" stroke="#38BDF8" strokeWidth="2" />
          <path d="M4,35 C4,41 44,41 44,35" fill="none" stroke="#38BDF8" strokeWidth="2" />
        </g>
      </g>
    );
  }

  if (specialId === 'special-archon-halo') {
    return (
      <g id="layer-02-back-archon">
        {/* Celestial Crown Halo Behind Head */}
        <circle cx="200" cy="115" r="76" fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.85" />
        <circle cx="200" cy="115" r="84" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="4 8" />
        {/* Radiant Star Points */}
        <polygon points="200,22 206,38 194,38" fill="#FBBF24" />
        <polygon points="108,115 124,109 124,121" fill="#FBBF24" />
        <polygon points="292,115 276,109 276,121" fill="#FBBF24" />
        {/* Astral Energy Wings Behind Torso */}
        <path
          d="M145,235 C95,205 60,160 48,115 C78,128 112,152 135,185 C98,175 68,162 55,148 C82,182 110,208 142,228 Z"
          fill="#F59E0B"
          fillOpacity="0.32"
          stroke="#FBBF24"
          strokeWidth="2.5"
        />
        <path
          d="M255,235 C305,205 340,160 352,115 C322,128 288,152 265,185 C302,175 332,162 345,148 C318,182 290,208 258,228 Z"
          fill="#F59E0B"
          fillOpacity="0.32"
          stroke="#FBBF24"
          strokeWidth="2.5"
        />
      </g>
    );
  }

  return null;
};

