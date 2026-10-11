import React from 'react';

/**
 * StudyResults - RPG Session Summary & Rewards
 *
 * @param {Object} props
 * @param {string} props.folderTitle - Folder title
 * @param {number} props.totalQuestions - Total questions in session
 * @param {number} props.correctAnswers - Count of correct answers
 * @param {number} props.incorrectAnswers - Count of wrong answers
 * @param {number} props.accuracy - Accuracy percentage (0-100)
 * @param {number} props.xpEarned - Total XP earned in session
 * @param {Function} props.onStudyAgain - Restart session handler
 * @param {Function} props.onReviewMistakes - Review mistakes handler
 * @param {Function} props.onBackToFolder - Return to folder overview
 */
export default function StudyResults({
  folderTitle = 'Physics Midterms',
  totalQuestions = 0,
  correctAnswers = 0,
  incorrectAnswers = 0,
  accuracy = 0,
  xpEarned = 0,
  onStudyAgain,
  onReviewMistakes,
  onBackToFolder,
}) {
  // Determine RPG Rank
  let rankLetter = 'S';
  let rankClass = 'is-rank-s';
  let rankTitle = 'PERFECT MASTERY';

  if (accuracy >= 100) {
    rankLetter = 'S';
    rankClass = 'is-rank-s';
    rankTitle = 'PERFECT MASTERY';
  } else if (accuracy >= 80) {
    rankLetter = 'A';
    rankClass = 'is-rank-a';
    rankTitle = 'EXCELLENT';
  } else if (accuracy >= 60) {
    rankLetter = 'B';
    rankClass = 'is-rank-b';
    rankTitle = 'GOOD EFFORT';
  } else {
    rankLetter = 'C';
    rankClass = 'is-rank-c';
    rankTitle = 'NEEDS REVIEW';
  }

  return (
    <div className="study-results-root" role="region" aria-label="Study Session Results">
      <div className="results-eyebrow-tag">✦ SESSION COMPLETE</div>
      <h1 className="results-headline">STUDY SESSION COMPLETE!</h1>
      <p className="results-subtext">
        Great work! You've finished your <strong>{folderTitle}</strong> flashcard session.
      </p>

      {/* RPG Rank Crest */}
      <div className={`results-rank-crest ${rankClass}`} aria-label={`Rank ${rankLetter}`}>
        <span className="rank-letter">{rankLetter}</span>
        <span className="rank-title">{rankTitle}</span>
      </div>

      {/* Metrics Grid */}
      <div className="results-metrics-grid">
        <div className="results-metric-card">
          <span className="metric-card-label">Total Questions</span>
          <span className="metric-card-val">{totalQuestions}</span>
        </div>

        <div className="results-metric-card">
          <span className="metric-card-label">Correct Answers</span>
          <span className="metric-card-val is-correct">{correctAnswers}</span>
        </div>

        <div className="results-metric-card">
          <span className="metric-card-label">Incorrect Answers</span>
          <span className="metric-card-val is-incorrect">{incorrectAnswers}</span>
        </div>

        <div className="results-metric-card">
          <span className="metric-card-label">Accuracy</span>
          <span className="metric-card-val">{accuracy}%</span>
        </div>
      </div>

      {/* XP Earned Banner */}
      <div
        style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '32px',
          color: '#fbbf24',
          fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
          fontWeight: 700,
          fontSize: '15px',
        }}
      >
        <span style={{ fontSize: '20px' }}>⚡</span>
        <span>Earned +{xpEarned} XP towards your character progression!</span>
      </div>

      {/* Three Action Buttons */}
      <div className="results-actions-row">
        <button
          type="button"
          className="btn-result-study-again"
          onClick={onStudyAgain}
        >
          <span>↻</span>
          <span>STUDY AGAIN</span>
        </button>

        <button
          type="button"
          className="btn-result-review-mistakes"
          onClick={onReviewMistakes}
          disabled={incorrectAnswers === 0}
          title={incorrectAnswers === 0 ? 'No mistakes to review! Perfect score.' : 'Review missed questions'}
        >
          <span>🔍</span>
          <span>REVIEW MISTAKES {incorrectAnswers > 0 ? `(${incorrectAnswers})` : ''}</span>
        </button>

        <button
          type="button"
          className="btn-result-back-folder"
          onClick={onBackToFolder}
        >
          <span>←</span>
          <span>BACK TO FOLDER</span>
        </button>
      </div>
    </div>
  );
}
