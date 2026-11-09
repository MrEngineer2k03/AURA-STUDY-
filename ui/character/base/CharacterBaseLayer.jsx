/**
 * Base Body Geometry: Torso, Lower Legs, Crew Socks, Arms, Hands
 */
export const CharacterBaseLayer = ({ skinPalette }) => {
  return (
    <g id="layer-04-body-base" stroke="#181824" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {/* Left & Right Lower Legs (visible when wearing shorts) */}
      <rect x="160" y="340" width="28" height="118" rx="12" fill={skinPalette.base} />
      <rect x="212" y="340" width="28" height="118" rx="12" fill={skinPalette.base} />
      {/* Knee shading */}
      <path d="M167,395 Q174,400 181,395" fill="none" stroke={skinPalette.shadow} strokeWidth="2.5" />
      <path d="M219,395 Q226,400 233,395" fill="none" stroke={skinPalette.shadow} strokeWidth="2.5" />

      {/* White Crew Socks */}
      <rect x="160" y="432" width="28" height="28" fill="#F8FAFC" />
      <line x1="160" y1="440" x2="188" y2="440" stroke="#EF4444" strokeWidth="2.5" />
      <rect x="212" y="432" width="28" height="28" fill="#F8FAFC" />
      <line x1="212" y1="440" x2="240" y2="440" stroke="#EF4444" strokeWidth="2.5" />

      {/* Torso Under-Base */}
      <path
        d="M154,196 L246,196 L242,340 L158,340 Z"
        fill={skinPalette.base}
      />

      {/* Left Arm & Hand */}
      <path
        d="M148,204 C132,225 126,275 128,325 C128,336 146,336 148,325 L156,245 Z"
        fill={skinPalette.base}
      />
      <circle cx="137" cy="334" r="12" fill={skinPalette.base} />
      <path d="M142,331 C146,334 146,340 142,342" fill="none" stroke={skinPalette.shadow} strokeWidth="2" />

      {/* Right Arm & Hand */}
      <path
        d="M252,204 C268,225 274,275 272,325 C272,336 254,336 252,325 L244,245 Z"
        fill={skinPalette.base}
      />
      <circle cx="263" cy="334" r="12" fill={skinPalette.base} />
      <path d="M258,331 C254,334 254,340 258,342" fill="none" stroke={skinPalette.shadow} strokeWidth="2" />
    </g>
  );
};

