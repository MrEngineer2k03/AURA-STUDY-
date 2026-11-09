/**
 * Head Contour, Neck, Ears & Cheek Blush
 */
export const CharacterHeadBaseLayer = ({ skinPalette }) => {
  return (
    <g id="layer-08-head-base" stroke="#181824" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {/* Neck & Collarbone Cast Shadow */}
      <rect x="182" y="162" width="36" height="44" rx="12" fill={skinPalette.base} />
      <path d="M182,174 C192,186 208,186 218,174 L218,164 L182,164 Z" fill={skinPalette.shadow} stroke="none" />

      {/* Ears */}
      <ellipse cx="136" cy="128" rx="12" ry="16" fill={skinPalette.base} />
      <path d="M133,122 C138,125 138,132 134,135" fill="none" stroke={skinPalette.shadow} strokeWidth="2.5" />
      <ellipse cx="264" cy="128" rx="12" ry="16" fill={skinPalette.base} />
      <path d="M267,122 C262,125 262,132 266,135" fill="none" stroke={skinPalette.shadow} strokeWidth="2.5" />

      {/* Main Anime/Student Head Contour */}
      <path
        d="M140,104 C140,62 260,62 260,104 C260,145 236,176 200,178 C164,176 140,145 140,104 Z"
        fill={skinPalette.base}
      />

      {/* Soft Cheek Blush */}
      <ellipse cx="162" cy="138" rx="10" ry="5" fill={skinPalette.blush} opacity="0.38" stroke="none" />
      <ellipse cx="238" cy="138" rx="10" ry="5" fill={skinPalette.blush} opacity="0.38" stroke="none" />
    </g>
  );
};

