import React from 'react';

/**
 * FlashcardStats - Compact row of RPG statistics cards for the flashcards folder
 * 
 * Computes:
 * - Total Cards: total number of flashcards in folder
 * - Studied: number of cards that have been reviewed (status !== 'new' or studyCount > 0)
 * - Mastered: number of cards marked as mastered
 * - Accuracy: % of correctly answered cards from actual study records
 *
 * @param {Object} props
 * @param {Array<Object>} props.cards - List of flashcards belonging to this folder
 */
export default function FlashcardStats({ cards = [] }) {
  const totalCards = cards.length;

  // Studied cards: cards with study interactions or status not 'new'
  const studiedCards = cards.filter(
    (c) => (c.status && c.status !== 'new') || (c.studyCount && c.studyCount > 0)
  ).length;

  // Mastered cards: cards marked as mastered
  const masteredCards = cards.filter((c) => c.status === 'mastered').length;

  // Accuracy: calculated strictly from actual study history
  let totalAttempts = 0;
  let totalCorrect = 0;

  cards.forEach((card) => {
    if (typeof card.studyCount === 'number' && card.studyCount > 0) {
      totalAttempts += card.studyCount;
    }
    if (typeof card.correctCount === 'number' && card.correctCount > 0) {
      totalCorrect += card.correctCount;
    }
  });

  const accuracyDisplay =
    totalAttempts > 0
      ? `${Math.round((totalCorrect / totalAttempts) * 100)}%`
      : '0%';

  const accuracyDetail =
    totalAttempts > 0
      ? `${totalCorrect} / ${totalAttempts} correct answers`
      : 'No study history yet';

  const studiedPercent =
    totalCards > 0 ? Math.round((studiedCards / totalCards) * 100) : 0;

  return (
    <div className="flashcard-stats-row" role="region" aria-label="Flashcard Statistics">
      {/* 1. TOTAL CARDS */}
      <div className="stat-card-item stat-theme-red">
        <div className="stat-icon-wrapper" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <div className="stat-info-wrap">
          <div className="stat-number-display">{totalCards}</div>
          <div className="stat-label-title">Total Cards</div>
          <div className="stat-subtext-detail">In this study folder</div>
        </div>
      </div>

      {/* 2. STUDIED */}
      <div className="stat-card-item stat-theme-blue">
        <div className="stat-icon-wrapper" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div className="stat-info-wrap">
          <div className="stat-number-display">{studiedCards}</div>
          <div className="stat-label-title">Studied</div>
          <div className="stat-subtext-detail">{studiedPercent}% of deck reviewed</div>
        </div>
      </div>

      {/* 3. MASTERED */}
      <div className="stat-card-item stat-theme-green">
        <div className="stat-icon-wrapper" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div className="stat-info-wrap">
          <div className="stat-number-display">{masteredCards}</div>
          <div className="stat-label-title">Mastered</div>
          <div className="stat-subtext-detail">Marked as mastered</div>
        </div>
      </div>

      {/* 4. ACCURACY */}
      <div className="stat-card-item stat-theme-gold">
        <div className="stat-icon-wrapper" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        </div>
        <div className="stat-info-wrap">
          <div className="stat-number-display">{accuracyDisplay}</div>
          <div className="stat-label-title">Accuracy</div>
          <div className="stat-subtext-detail">{accuracyDetail}</div>
        </div>
      </div>
    </div>
  );
}
