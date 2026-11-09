/**
 * Footwear (Sneakers, Runners, High-Tops, Oxfords, Cyber Kicks)
 */
export const CharacterShoesLayer = ({ shoesId }) => {
  switch (shoesId) {
    case 'shoes-running':
      return (
        <g id="layer-06-shoes-running" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Left Runner */}
          <path d="M158,454 L190,454 L194,486 L142,486 C140,472 148,462 158,454 Z" fill="#0284C7" />
          <path d="M140,482 L195,482 L193,492 L142,492 Z" fill="#A3E635" />
          <path d="M162,468 L182,462" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          {/* Right Runner */}
          <path d="M210,454 L242,454 C252,462 260,472 258,486 L206,486 Z" fill="#0284C7" />
          <path d="M205,482 L260,482 L258,492 L207,492 Z" fill="#A3E635" />
          <path d="M238,468 L218,462" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'shoes-high-tops':
      return (
        <g id="layer-06-shoes-hightops" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Left Crimson High-Top */}
          <path d="M156,442 L190,442 L192,486 L142,486 C142,468 152,458 156,442 Z" fill="#DC2626" />
          <rect x="155" y="446" width="35" height="8" fill="#181824" />
          <rect x="142" y="482" width="50" height="9" rx="3" fill="#F8FAFC" />
          <line x1="158" y1="460" x2="176" y2="460" stroke="#F8FAFC" strokeWidth="2.5" />
          <line x1="156" y1="467" x2="174" y2="467" stroke="#F8FAFC" strokeWidth="2.5" />
          {/* Right Crimson High-Top */}
          <path d="M210,442 L244,442 C248,458 258,468 258,486 L208,486 Z" fill="#DC2626" />
          <rect x="210" y="446" width="35" height="8" fill="#181824" />
          <rect x="208" y="482" width="50" height="9" rx="3" fill="#F8FAFC" />
          <line x1="224" y1="460" x2="242" y2="460" stroke="#F8FAFC" strokeWidth="2.5" />
          <line x1="226" y1="467" x2="244" y2="467" stroke="#F8FAFC" strokeWidth="2.5" />
        </g>
      );

    case 'shoes-formal-oxford':
      return (
        <g id="layer-06-shoes-formal" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path d="M158,456 L190,456 L192,486 L144,486 C144,472 152,464 158,456 Z" fill="#451A03" />
          <rect x="144" y="483" width="48" height="7" fill="#1C1917" />
          <path d="M210,456 L242,456 C248,464 256,472 256,486 L208,486 Z" fill="#451A03" />
          <rect x="208" y="483" width="48" height="7" fill="#1C1917" />
        </g>
      );

    case 'shoes-cyber-kicks':
      return (
        <g id="layer-06-shoes-cyber" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Left Cyber Kick */}
          <path d="M154,438 L190,438 L193,486 L140,486 C140,466 150,455 154,438 Z" fill="#0F172A" />
          <rect x="140" y="480" width="53" height="11" rx="4" fill="#06B6D4" />
          <circle cx="156" cy="485" r="2.5" fill="#ECFEFF" stroke="none" />
          <circle cx="176" cy="485" r="2.5" fill="#ECFEFF" stroke="none" />
          <path d="M156,452 L186,452" stroke="#22D3EE" strokeWidth="3" />
          {/* Right Cyber Kick */}
          <path d="M210,438 L246,438 C250,455 260,466 260,486 L207,486 Z" fill="#0F172A" />
          <rect x="207" y="480" width="53" height="11" rx="4" fill="#06B6D4" />
          <circle cx="224" cy="485" r="2.5" fill="#ECFEFF" stroke="none" />
          <circle cx="244" cy="485" r="2.5" fill="#ECFEFF" stroke="none" />
          <path d="M214,452 L244,452" stroke="#22D3EE" strokeWidth="3" />
        </g>
      );

    case 'shoes-basic-sneakers':
    default:
      return (
        <g id="layer-06-shoes-basic" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path d="M158,456 L190,456 L192,486 L144,486 C144,470 152,462 158,456 Z" fill="#F8FAFC" />
          <rect x="144" y="482" width="48" height="8" rx="3" fill="#CBD5E1" />
          <path d="M164,468 L184,474" stroke="#475569" strokeWidth="3" />
          <path d="M210,456 L242,456 C248,462 256,470 256,486 L208,486 Z" fill="#F8FAFC" />
          <rect x="208" y="482" width="48" height="8" rx="3" fill="#CBD5E1" />
          <path d="M236,468 L216,474" stroke="#475569" strokeWidth="3" />
        </g>
      );
  }
};

