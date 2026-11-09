/**
 * Rear Hair Layer: falls behind the shoulders/neck for longer styles
 */
export const CharacterRearHairLayer = ({ hairstyleId, hairPalette }) => {
  if (hairstyleId === 'hair-long-flowing') {
    return (
      <g id="layer-03-rear-hair" stroke="#14141F" strokeWidth="3" strokeLinejoin="round">
        <path
          d="M138,115 C120,155 112,225 118,282 C128,288 144,285 152,275 L156,185 L244,185 L248,275 C256,285 272,288 282,282 C288,225 280,155 262,115 Z"
          fill={hairPalette.secondary}
        />
        {/* Inner shadow strands */}
        <path d="M132,175 C126,215 128,252 134,276" fill="none" stroke={hairPalette.primary} strokeWidth="4" />
        <path d="M268,175 C274,215 272,252 266,276" fill="none" stroke={hairPalette.primary} strokeWidth="4" />
      </g>
    );
  }

  if (hairstyleId === 'hair-medium-layered') {
    return (
      <g id="layer-03-rear-hair-medium" stroke="#14141F" strokeWidth="3" strokeLinejoin="round">
        <path
          d="M140,128 C128,162 126,204 134,226 C144,230 156,225 162,216 L238,216 C244,225 256,230 266,226 C274,204 272,162 260,128 Z"
          fill={hairPalette.secondary}
        />
      </g>
    );
  }

  if (hairstyleId === 'hair-curly-volume') {
    return (
      <g id="layer-03-rear-hair-curly" stroke="#14141F" strokeWidth="3">
        <circle cx="136" cy="122" r="28" fill={hairPalette.secondary} />
        <circle cx="264" cy="122" r="28" fill={hairPalette.secondary} />
        <circle cx="142" cy="154" r="22" fill={hairPalette.secondary} />
        <circle cx="258" cy="154" r="22" fill={hairPalette.secondary} />
      </g>
    );
  }

  return null;
};

