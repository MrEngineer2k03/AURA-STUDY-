/**
 * Lanyard & Student ID Card: drapes naturally over the torso
 */
export const CharacterLanyardLayer = ({ lanyardId }) => {
  if (!lanyardId || lanyardId === 'lanyard-none') return null;

  const strapColor =
    lanyardId === 'lanyard-engineering-id' ? '#DC2626' :
    lanyardId === 'lanyard-cs-binary' ? '#06B6D4' : '#F59E0B';

  const cardAccent =
    lanyardId === 'lanyard-engineering-id' ? '#991B1B' :
    lanyardId === 'lanyard-cs-binary' ? '#0891B2' : '#B45309';

  return (
    <g id="layer-12-lanyard" stroke="#181824" strokeWidth="2.5" strokeLinejoin="round">
      {/* Woven Lanyard Strap Draping Over Collar */}
      <path
        d="M178,188 L196,258 L204,258 L222,188"
        fill="none"
        stroke="#181824"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M178,188 L196,258 L204,258 L222,188"
        fill="none"
        stroke={strapColor}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Metallic Clasp */}
      <rect x="196" y="256" width="8" height="10" rx="2" fill="#CBD5E1" />
      {/* Student ID Badge Holder */}
      <rect x="182" y="264" width="36" height="48" rx="5" fill="#F8FAFC" />
      <rect x="182" y="264" width="36" height="12" rx="3" fill={cardAccent} />
      {/* Mini Avatar Silhouette & Barcode on ID Card */}
      <circle cx="193" cy="286" r="5" fill="#64748B" stroke="none" />
      <line x1="202" y1="283" x2="213" y2="283" stroke="#334155" strokeWidth="2" />
      <line x1="202" y1="289" x2="210" y2="289" stroke="#94A3B8" strokeWidth="2" />
      <rect x="188" y="298" width="24" height="6" fill="#1E293B" stroke="none" />
    </g>
  );
};

