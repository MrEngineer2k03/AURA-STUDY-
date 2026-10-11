import React from 'react';

/**
 * StudyProgress - Horizontal progress indicator for study session
 *
 * @param {Object} props
 * @param {number} props.current - 1-based current card index
 * @param {number} props.total - Total number of cards
 */
export default function StudyProgress({ current, total }) {
  const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="study-progress-track" role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
      <div
        className="study-progress-fill"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
