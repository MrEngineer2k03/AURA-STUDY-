/**
 * Face Accessories, Eyewear & Audio Equipment
 */
export const CharacterAccessoriesLayer = ({ accessoryId }) => {
  switch (accessoryId) {
    case 'acc-blue-light-glasses':
      return (
        <g id="layer-11-acc-glasses" stroke="#1E293B" strokeWidth="2.8" strokeLinejoin="round">
          {/* Left & Right Rectangular Study Frames */}
          <rect x="153" y="106" width="36" height="26" rx="6" fill="#38BDF8" fillOpacity="0.16" />
          <rect x="211" y="106" width="36" height="26" rx="6" fill="#38BDF8" fillOpacity="0.16" />
          {/* Bridge & Temples */}
          <path d="M189,116 Q200,112 211,116" fill="none" />
          <line x1="140" y1="116" x2="153" y2="116" />
          <line x1="247" y1="116" x2="260" y2="116" />
          {/* Anti-Glare Glint */}
          <line x1="159" y1="112" x2="166" y2="126" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="217" y1="112" x2="224" y2="126" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'acc-retro-sunglasses':
      return (
        <g id="layer-11-acc-sunglasses" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <polygon points="150,106 192,108 188,132 154,130" fill="#0F172A" />
          <polygon points="208,108 250,106 246,130 212,132" fill="#0F172A" />
          <line x1="192" y1="112" x2="208" y2="112" stroke="#FBBF24" strokeWidth="3" />
          <line x1="138" y1="114" x2="150" y2="112" stroke="#FBBF24" strokeWidth="2.5" />
          <line x1="250" y1="112" x2="262" y2="114" stroke="#FBBF24" strokeWidth="2.5" />
          <line x1="158" y1="112" x2="170" y2="126" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="216" y1="112" x2="228" y2="126" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );

    case 'acc-studio-headphones':
      return (
        <g id="layer-11-acc-headphones" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Over-Head Arch Band */}
          <path
            d="M128,122 C122,42 278,42 272,122"
            fill="none"
            stroke="#334155"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M128,122 C122,42 278,42 272,122"
            fill="none"
            stroke="#181824"
            strokeWidth="3"
          />
          {/* Left & Right Ear Cups */}
          <rect x="118" y="106" width="20" height="40" rx="10" fill="#1E293B" />
          <ellipse cx="126" cy="126" rx="4" ry="11" fill="#38BDF8" stroke="none" />
          <rect x="262" y="106" width="20" height="40" rx="10" fill="#1E293B" />
          <ellipse cx="274" cy="126" rx="4" ry="11" fill="#38BDF8" stroke="none" />
        </g>
      );

    case 'acc-wireless-earbuds':
      return (
        <g id="layer-11-acc-earbuds" stroke="#181824" strokeWidth="2">
          <rect x="132" y="128" width="7" height="18" rx="3.5" fill="#F8FAFC" transform="rotate(-12 135 135)" />
          <rect x="261" y="128" width="7" height="18" rx="3.5" fill="#F8FAFC" transform="rotate(12 265 135)" />
        </g>
      );

    case 'acc-none':
    default:
      return null;
  }
};

