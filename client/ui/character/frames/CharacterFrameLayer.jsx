/**
 * Outer Frame Borders & Level Indicator Badges
 */
export const CharacterFrameLayer = ({ frameId, level = 24, cropMode = 'full' }) => {
  const isCircle = cropMode === 'circle';

  if (frameId === 'frame-crimson-eng') {
    return (
      <g id="layer-14-frame-crimson">
        {isCircle ? (
          <circle cx="200" cy="155" r="142" fill="none" stroke="#DC2626" strokeWidth="8" />
        ) : (
          <rect x="16" y="14" width="368" height="492" rx="28" fill="none" stroke="#DC2626" strokeWidth="6" />
        )}
        {/* Corner Rivets */}
        {!isCircle && (
          <>
            <circle cx="32" cy="30" r="5" fill="#FBBF24" stroke="#181824" strokeWidth="2" />
            <circle cx="368" cy="30" r="5" fill="#FBBF24" stroke="#181824" strokeWidth="2" />
            <circle cx="32" cy="490" r="5" fill="#FBBF24" stroke="#181824" strokeWidth="2" />
            <circle cx="368" cy="490" r="5" fill="#FBBF24" stroke="#181824" strokeWidth="2" />
          </>
        )}
        {/* Level Pill */}
        <g transform={`translate(200, ${isCircle ? 295 : 500})`}>
          <rect x="-46" y="-14" width="92" height="24" rx="12" fill="#991B1B" stroke="#FBBF24" strokeWidth="2.5" />
          <text x="0" y="2" textAnchor="middle" fill="#FEF2F2" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            ENG LVL {level}
          </text>
        </g>
      </g>
    );
  }

  if (frameId === 'frame-sql-champion') {
    return (
      <g id="layer-14-frame-sql">
        {isCircle ? (
          <circle cx="200" cy="155" r="142" fill="none" stroke="#06B6D4" strokeWidth="8" strokeDasharray="24 6" />
        ) : (
          <rect x="16" y="14" width="368" height="492" rx="28" fill="none" stroke="#06B6D4" strokeWidth="6" />
        )}
        <g transform={`translate(200, ${isCircle ? 295 : 500})`}>
          <rect x="-52" y="-14" width="104" height="24" rx="6" fill="#083344" stroke="#22D3EE" strokeWidth="2.5" />
          <text x="0" y="2" textAnchor="middle" fill="#67E8F9" fontSize="11" fontWeight="800" fontFamily="monospace">
            SQL::LVL_{level}
          </text>
        </g>
      </g>
    );
  }

  if (frameId === 'frame-archon-mythic') {
    return (
      <g id="layer-14-frame-archon">
        {isCircle ? (
          <circle cx="200" cy="155" r="142" fill="none" stroke="#F59E0B" strokeWidth="9" />
        ) : (
          <rect x="16" y="14" width="368" height="492" rx="28" fill="none" stroke="#F59E0B" strokeWidth="7" />
        )}
        <g transform={`translate(200, ${isCircle ? 295 : 500})`}>
          <rect x="-56" y="-14" width="112" height="24" rx="12" fill="#451A03" stroke="#FBBF24" strokeWidth="2.5" />
          <text x="0" y="2" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            ★ ARCHON {level} ★
          </text>
        </g>
      </g>
    );
  }

  // Default AURA Frame
  return (
    <g id="layer-14-frame-default">
      {isCircle ? (
        <circle cx="200" cy="155" r="142" fill="none" stroke="#4F46E5" strokeWidth="6" opacity="0.7" />
      ) : (
        <rect x="16" y="14" width="368" height="492" rx="28" fill="none" stroke="#334155" strokeWidth="4" />
      )}
      <g transform={`translate(200, ${isCircle ? 295 : 500})`}>
        <rect x="-38" y="-14" width="76" height="24" rx="12" fill="#1E293B" stroke="#6366F1" strokeWidth="2" />
        <text x="0" y="2" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="800" fontFamily="sans-serif">
          LVL {level}
        </text>
      </g>
    </g>
  );
};

