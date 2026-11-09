/**
 * Facial Features: Eyebrows, Anime Eyes with Specular Highlights, Nose & Smile
 */
export const CharacterFaceLayer = ({ eyePalette, hairPalette }) => {
  return (
    <g id="layer-09-face-eyes">
      {/* Eyebrows */}
      <path d="M158,104 Q172,98 184,103" fill="none" stroke={hairPalette.primary} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M216,103 Q228,98 242,104" fill="none" stroke={hairPalette.primary} strokeWidth="3.5" strokeLinecap="round" />

      {/* Left Eye */}
      <g>
        <rect x="160" y="110" width="22" height="22" rx="9" fill="#FFFFFF" stroke="#181824" strokeWidth="2.5" />
        <rect x="164" y="112" width="15" height="18" rx="7" fill={eyePalette.main} />
        <circle cx="171.5" cy="121" r="4.5" fill="#0F172A" />
        <circle cx="168" cy="116" r="3" fill="#FFFFFF" />
        <circle cx="175" cy="125" r="1.5" fill={eyePalette.light} />
        <path d="M158,112 Q171,106 184,112" fill="none" stroke="#181824" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Right Eye */}
      <g>
        <rect x="218" y="110" width="22" height="22" rx="9" fill="#FFFFFF" stroke="#181824" strokeWidth="2.5" />
        <rect x="221" y="112" width="15" height="18" rx="7" fill={eyePalette.main} />
        <circle cx="228.5" cy="121" r="4.5" fill="#0F172A" />
        <circle cx="225" cy="116" r="3" fill="#FFFFFF" />
        <circle cx="232" cy="125" r="1.5" fill={eyePalette.light} />
        <path d="M216,112 Q229,106 242,112" fill="none" stroke="#181824" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Nose */}
      <path d="M199,130 L197,139 L202,140" fill="none" stroke="#181824" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Confident Student Smile */}
      <path d="M188,151 Q200,159 212,151" fill="none" stroke="#181824" strokeWidth="2.8" strokeLinecap="round" />
    </g>
  );
};

