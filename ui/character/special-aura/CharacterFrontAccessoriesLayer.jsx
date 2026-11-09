/**
 * Front Accessories: Department Pin, Study Chrono Watch, Owl Companion
 */
export const CharacterFrontAccessoriesLayer = ({ specialId }) => {
  if (specialId === 'special-dept-pin') {
    return (
      <g id="layer-13-front-pin-watch" stroke="#181824" strokeWidth="2">
        {/* Smart Study Chrono Watch on Left Wrist */}
        <rect x="125" y="314" width="24" height="10" rx="3" fill="#0F172A" />
        <circle cx="137" cy="319" r="6" fill="#38BDF8" />
        {/* Golden Department Gear Pin on Left Lapel */}
        <circle cx="172" cy="232" r="8" fill="#FBBF24" />
        <circle cx="172" cy="232" r="3.5" fill="#B91C1C" />
      </g>
    );
  }

  if (specialId === 'special-archon-halo') {
    return (
      <g id="layer-13-front-owl" stroke="#181824" strokeWidth="2.5" strokeLinejoin="round">
        {/* Mini Astral Owl Companion Perched on Right Shoulder */}
        <g transform="translate(248, 152)">
          <ellipse cx="18" cy="24" rx="14" ry="16" fill="#FEF3C7" />
          <path d="M6,12 L12,18 L24,18 L30,12 L26,26 L10,26 Z" fill="#F59E0B" />
          <circle cx="13" cy="20" r="3.5" fill="#38BDF8" />
          <circle cx="23" cy="20" r="3.5" fill="#38BDF8" />
          <polygon points="18,22 15,26 21,26" fill="#D97706" />
        </g>
      </g>
    );
  }

  return null;
};

