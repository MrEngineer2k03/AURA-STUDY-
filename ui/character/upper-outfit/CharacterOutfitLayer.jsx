/**
 * Upper Body Clothing: distinct silhouettes, sleeves, collars, and emblems
 */
export const CharacterOutfitLayer = ({ outfitId }) => {
  switch (outfitId) {
    case 'top-basic-tee':
      return (
        <g id="layer-07-outfit-tee" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Short-Sleeve T-Shirt Silhouette */}
          <path
            d="M152,196 L124,228 L142,256 L154,242 L152,334 L248,334 L246,242 L258,256 L276,228 L248,196 Z"
            fill="#4F46E5"
          />
          {/* Ribbed Crewneck Collar */}
          <path d="M174,196 C182,216 218,216 226,196" fill="#312E81" stroke="#181824" strokeWidth="3" />
          {/* AURA Chest Emblem */}
          <circle cx="222" cy="242" r="9" fill="#818CF8" stroke="#181824" strokeWidth="2" />
          <path d="M219,245 L222,237 L225,245 Z" fill="#FFF" stroke="none" />
        </g>
      );

    case 'top-campus-polo':
      return (
        <g id="layer-07-outfit-polo" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Polo Body with Cuffed Short Sleeves */}
          <path
            d="M152,196 L125,230 L143,256 L154,242 L152,334 L248,334 L246,242 L257,256 L275,230 L248,196 Z"
            fill="#0F766E"
          />
          {/* Sleeve Cuffs */}
          <line x1="128" y1="226" x2="145" y2="251" stroke="#F8FAFC" strokeWidth="4" />
          <line x1="272" y1="226" x2="255" y2="251" stroke="#F8FAFC" strokeWidth="4" />
          {/* Button Placket */}
          <rect x="194" y="204" width="12" height="44" rx="3" fill="#115E59" />
          <circle cx="200" cy="218" r="2" fill="#F8FAFC" stroke="none" />
          <circle cx="200" cy="232" r="2" fill="#F8FAFC" stroke="none" />
          {/* Folded Polo Collar */}
          <polygon points="172,192 198,208 182,222 162,204" fill="#F8FAFC" />
          <polygon points="228,192 202,208 218,222 238,204" fill="#F8FAFC" />
        </g>
      );

    case 'top-engineering-uniform':
      return (
        <g id="layer-07-outfit-engineering" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Inner Dark Tech Undershirt */}
          <path d="M174,196 L226,196 L226,334 L174,334 Z" fill="#1E293B" />
          {/* Structured Long-Sleeve Crimson Engineering Field Jacket */}
          <path
            d="M148,196 L122,226 L126,322 L148,322 L154,244 L152,336 L194,336 L194,206 L168,192 Z"
            fill="#B91C1C"
          />
          <path
            d="M252,196 L278,226 L274,322 L252,322 L246,244 L248,336 L206,336 L206,206 L232,192 Z"
            fill="#B91C1C"
          />
          {/* Gold Engineering Shoulder Epaulettes & Piping */}
          <polygon points="146,196 170,192 168,204 142,208" fill="#FBBF24" />
          <polygon points="254,196 230,192 232,204 258,208" fill="#FBBF24" />
          {/* Utility Chest Pocket & Gear Emblem */}
          <rect x="160" y="236" width="24" height="26" rx="3" fill="#991B1B" />
          <rect x="216" y="236" width="24" height="26" rx="3" fill="#991B1B" />
          <circle cx="228" cy="249" r="6" fill="#FBBF24" />
          {/* High Standing Tech Collar */}
          <path d="M166,184 L192,206 L172,216 L158,198 Z" fill="#7F1D1D" />
          <path d="M234,184 L208,206 L228,216 L242,198 Z" fill="#7F1D1D" />
        </g>
      );

    case 'top-university-jacket':
      return (
        <g id="layer-07-outfit-unijacket" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Long-Sleeve Windbreaker */}
          <path
            d="M148,196 L122,226 L126,322 L148,322 L154,244 L152,336 L248,336 L246,244 L252,322 L274,322 L278,226 L252,196 Z"
            fill="#1E3A8A"
          />
          {/* White & Sky Chevron Chest Panel */}
          <polygon points="153,234 200,264 247,234 247,258 200,288 153,258" fill="#38BDF8" />
          {/* Center Zipper */}
          <line x1="200" y1="202" x2="200" y2="336" stroke="#F8FAFC" strokeWidth="3" />
          {/* Standing Collar */}
          <path d="M170,188 L200,206 L230,188 L238,202 L200,218 L162,202 Z" fill="#0F172A" />
        </g>
      );

    case 'top-varsity-jacket':
      return (
        <g id="layer-07-outfit-varsity" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Cream Leather Long Sleeves */}
          <path d="M152,198 L122,226 L126,322 L148,322 L156,244 Z" fill="#FEF3C7" />
          <path d="M248,198 L278,226 L274,322 L252,322 L244,244 Z" fill="#FEF3C7" />
          {/* Maroon Wool Torso */}
          <path d="M150,196 L250,196 L248,336 L152,336 Z" fill="#881337" />
          {/* Ribbed Striped Waistband & Cuffs */}
          <rect x="152" y="320" width="96" height="16" rx="4" fill="#F8FAFC" />
          <line x1="154" y1="328" x2="246" y2="328" stroke="#881337" strokeWidth="3" />
          <rect x="125" y="312" width="24" height="10" rx="2" fill="#F8FAFC" />
          <rect x="251" y="312" width="24" height="10" rx="2" fill="#F8FAFC" />
          {/* Snap Buttons */}
          {[222, 246, 270, 294, 312].map(y => (
            <circle key={y} cx="200" cy={y} r="3" fill="#F8FAFC" stroke="#181824" strokeWidth="1.5" />
          ))}
          {/* Chenille 'A' Patch */}
          <rect x="214" y="232" width="22" height="26" rx="4" fill="#FBBF24" />
          <text x="220" y="251" fill="#881337" fontSize="16" fontWeight="900" fontFamily="sans-serif">A</text>
        </g>
      );

    case 'top-data-hoodie':
      return (
        <g id="layer-07-outfit-hoodie" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Oversized Hoodie Body & Sleeves */}
          <path
            d="M144,194 L118,228 L124,324 L148,324 L154,248 L150,338 L250,338 L246,248 L252,324 L276,324 L282,228 L256,194 Z"
            fill="#0F172A"
          />
          {/* Bunched Hood Ring Around Neck */}
          <path
            d="M152,186 C146,208 176,220 200,220 C224,220 254,208 248,186 C234,196 166,196 152,186 Z"
            fill="#1E293B"
          />
          {/* Kangaroo Front Pocket */}
          <polygon points="164,282 236,282 244,328 156,328" fill="#1E293B" />
          {/* Glowing Cyan Circuit Traces & Drawstrings */}
          <path d="M188,214 L188,256 M212,214 L212,256" stroke="#22D3EE" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M130,260 L142,272 L142,305" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
          <path d="M270,260 L258,272 L258,305" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
        </g>
      );

    case 'top-formal-blazer':
      return (
        <g id="layer-07-outfit-blazer" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Crisp White Dress Shirt Center */}
          <polygon points="172,194 228,194 220,334 180,334" fill="#F8FAFC" />
          {/* Crimson Silk Necktie */}
          <polygon points="195,204 205,204 209,288 200,302 191,288" fill="#DC2626" />
          {/* Tailored Navy Academy Blazer */}
          <path
            d="M148,196 L122,226 L126,322 L148,322 L154,244 L152,336 L192,336 L192,265 L172,196 Z"
            fill="#1E293B"
          />
          <path
            d="M252,196 L278,226 L274,322 L252,322 L246,244 L248,336 L208,336 L208,265 L228,196 Z"
            fill="#1E293B"
          />
          {/* Blazer Lapels */}
          <polygon points="172,194 192,265 162,248" fill="#0F172A" />
          <polygon points="228,194 208,265 238,248" fill="#0F172A" />
          {/* Gold Academy Crest on Pocket */}
          <polygon points="220,245 236,245 236,260 228,268 220,260" fill="#FBBF24" />
        </g>
      );

    case 'top-archon-scholar':
      return (
        <g id="layer-07-outfit-archon" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Royal Astral Robe & Flared Lower Coat */}
          <path
            d="M144,194 L116,232 L120,326 L148,326 L154,248 L144,352 L256,352 L246,248 L252,326 L280,326 L284,232 L256,194 Z"
            fill="#311042"
          />
          {/* Inner Gold & Ivory Tabard */}
          <polygon points="180,200 220,200 228,352 172,352" fill="#FEF3C7" />
          <polygon points="192,208 208,208 212,342 188,342" fill="#F59E0B" />
          {/* Ornate Layered Shoulder Pauldrons / Capelet */}
          <path
            d="M132,212 C152,188 182,192 200,214 C218,192 248,188 268,212 L258,236 C236,226 214,228 200,240 C186,228 164,226 142,236 Z"
            fill="#FBBF24"
          />
          {/* Arcane Diamond Gem at Collar */}
          <polygon points="200,202 212,218 200,234 188,218" fill="#38BDF8" stroke="#181824" strokeWidth="2.5" />
        </g>
      );

    default:
      return null;
  }
};

