/**
 * Front Hair Layer: frames the forehead without obscuring the eyes
 */
export const CharacterFrontHairLayer = ({ hairstyleId, hairPalette }) => {
  switch (hairstyleId) {
    case 'hair-medium-layered':
      return (
        <g id="layer-10-hair-medium" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M134,116 C130,62 168,44 200,44 C232,44 270,62 266,116 C262,145 256,174 248,190 C246,162 248,125 242,102 L222,94 L206,104 L196,90 L176,105 L158,96 C152,125 154,162 152,190 C144,174 138,145 134,116 Z"
            fill={hairPalette.primary}
          />
          <path d="M162,68 Q200,56 238,68" fill="none" stroke={hairPalette.highlight} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
        </g>
      );

    case 'hair-long-flowing':
      return (
        <g id="layer-10-hair-long" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M134,116 C132,58 166,42 200,42 C234,42 268,58 266,116 C264,165 258,218 250,248 C244,218 246,142 242,102 C226,100 214,92 200,82 C186,92 174,100 158,102 C154,142 156,218 150,248 C142,218 136,165 134,116 Z"
            fill={hairPalette.primary}
          />
          <path d="M168,66 Q200,54 232,66" fill="none" stroke={hairPalette.highlight} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        </g>
      );

    case 'hair-curly-volume':
      return (
        <g id="layer-10-hair-curly" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M132,112 C122,94 130,68 148,60 C156,42 180,36 200,40 C220,36 244,42 252,60 C270,68 278,94 268,112 C258,102 248,96 236,98 C224,86 210,88 200,98 C190,88 176,86 164,98 C152,96 142,102 132,112 Z"
            fill={hairPalette.primary}
          />
          <circle cx="164" cy="64" r="14" fill={hairPalette.primary} />
          <circle cx="200" cy="56" r="16" fill={hairPalette.primary} />
          <circle cx="236" cy="64" r="14" fill={hairPalette.primary} />
          <path d="M188,52 A10,10 0 0,1 210,52" fill="none" stroke={hairPalette.highlight} strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'hair-side-part':
      return (
        <g id="layer-10-hair-sidepart" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M136,114 C132,68 164,46 204,46 C240,46 266,68 264,114 L256,96 C236,96 202,94 172,78 C164,92 154,100 144,102 Z"
            fill={hairPalette.primary}
          />
          <line x1="172" y1="56" x2="172" y2="78" stroke={hairPalette.secondary} strokeWidth="3" />
          <path d="M184,64 Q218,58 244,72" fill="none" stroke={hairPalette.highlight} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        </g>
      );

    case 'hair-modern-twoblock':
      return (
        <g id="layer-10-hair-twoblock" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path d="M138,114 L144,86 L256,86 L262,114 Z" fill={hairPalette.secondary} />
          <path
            d="M136,98 C134,56 168,42 200,44 C232,42 266,56 264,98 C250,106 236,104 224,94 L200,76 L176,94 C164,104 150,106 136,98 Z"
            fill={hairPalette.primary}
          />
          <path d="M158,68 Q178,56 196,68 M204,68 Q222,56 242,68" fill="none" stroke={hairPalette.highlight} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
        </g>
      );

    case 'hair-short-messy':
    default:
      return (
        <g id="layer-10-hair-short" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M136,114 C130,74 156,46 184,46 L192,36 L208,44 L226,38 L234,48 C258,56 268,82 264,114 L254,96 L238,102 L226,88 L208,104 L194,88 L178,104 L162,90 L146,102 Z"
            fill={hairPalette.primary}
          />
          <path d="M164,66 Q200,54 236,66" fill="none" stroke={hairPalette.highlight} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
        </g>
      );
  }
};

