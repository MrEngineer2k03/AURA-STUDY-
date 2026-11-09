/**
 * Lower Body Clothing (Pants, Jeans, Joggers, Shorts, Slacks)
 */
export const CharacterPantsLayer = ({ pantsId }) => {
  switch (pantsId) {
    case 'Bottom-classic-jeans':
      return (
        <g id="layer-05-pants-jeans" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M154,328 L246,328 L244,454 L210,454 L204,368 L196,368 L190,454 L156,454 Z"
            fill="#2563EB"
          />
          {/* Denim Seam & Pockets */}
          <line x1="200" y1="328" x2="200" y2="368" stroke="#1D4ED8" strokeWidth="2.5" />
          <path d="M156,342 Q170,352 176,334" fill="none" stroke="#93C5FD" strokeWidth="2" />
          <path d="M244,342 Q230,352 224,334" fill="none" stroke="#93C5FD" strokeWidth="2" />
          {/* Rolled Denim Cuffs */}
          <rect x="154" y="442" width="38" height="12" rx="3" fill="#93C5FD" stroke="#181824" strokeWidth="2.5" />
          <rect x="208" y="442" width="38" height="12" rx="3" fill="#93C5FD" stroke="#181824" strokeWidth="2.5" />
        </g>
      );

    case 'Bottom-tech-joggers':
      return (
        <g id="layer-05-pants-joggers" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M154,328 L246,328 L248,395 L240,446 L212,446 L204,368 L196,368 L188,446 L160,446 L152,395 Z"
            fill="#334155"
          />
          {/* Cargo Side Pockets */}
          <rect x="148" y="366" width="14" height="32" rx="4" fill="#1E293B" />
          <rect x="238" y="366" width="14" height="32" rx="4" fill="#1E293B" />
          {/* Drawstrings */}
          <path d="M195,332 L192,352 M205,332 L208,352" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Ribbed Ankle Cuffs */}
          <rect x="160" y="438" width="28" height="14" rx="4" fill="#0F172A" />
          <rect x="212" y="438" width="28" height="14" rx="4" fill="#0F172A" />
        </g>
      );

    case 'Bottom-campus-shorts':
      return (
        <g id="layer-05-pants-shorts" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M154,328 L246,328 L248,392 L206,392 L202,364 L198,364 L194,392 L152,392 Z"
            fill="#D6B588"
          />
          <line x1="152" y1="384" x2="194" y2="384" stroke="#B89364" strokeWidth="2" />
          <line x1="206" y1="384" x2="248" y2="384" stroke="#B89364" strokeWidth="2" />
        </g>
      );

    case 'Bottom-formal-slacks':
      return (
        <g id="layer-05-pants-slacks" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M154,328 L246,328 L243,454 L210,454 L204,366 L196,366 L190,454 L157,454 Z"
            fill="#374151"
          />
          {/* Leather Belt & Brass Buckle */}
          <rect x="154" y="326" width="92" height="10" fill="#111827" />
          <rect x="192" y="325" width="16" height="12" rx="2" fill="#FBBF24" stroke="#181824" strokeWidth="2" />
          {/* Tailored Crease Lines */}
          <line x1="173" y1="345" x2="173" y2="450" stroke="#4B5563" strokeWidth="2" />
          <line x1="227" y1="345" x2="227" y2="450" stroke="#4B5563" strokeWidth="2" />
        </g>
      );

    case 'Bottom-black-trousers':
    default:
      return (
        <g id="layer-05-pants-black" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M154,328 L246,328 L243,454 L210,454 L204,366 L196,366 L190,454 L157,454 Z"
            fill="#1E293B"
          />
          <line x1="174" y1="350" x2="174" y2="448" stroke="#334155" strokeWidth="2" />
          <line x1="226" y1="350" x2="226" y2="448" stroke="#334155" strokeWidth="2" />
        </g>
      );
  }
};

