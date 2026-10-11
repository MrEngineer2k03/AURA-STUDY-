import React from 'react';

/**
 * ReviewMistakes - Displays missed questions during study session
 *
 * @param {Object} props
 * @param {Array<Object>} props.mistakes - List of mistake objects:
 *   [{ question, selectedAnswer, correctAnswer, index }]
 * @param {Function} props.onBackToResults - Return to Results view
 * @param {Function} props.onBackToFolder - Return to Folder Overview
 */
export default function ReviewMistakes({
  mistakes = [],
  onBackToResults,
  onBackToFolder,
}) {
  return (
    <div className="mistakes-view-root" role="region" aria-label="Review Study Mistakes">
      <div className="mistakes-header">
        <div>
          <button
            type="button"
            className="review-back-btn"
            onClick={onBackToResults}
          >
            ← Back to Results
          </button>
          <h2 className="mistakes-title">REVIEW MISTAKES</h2>
          <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>
            Review the questions you missed to reinforce your memory and master the material.
          </p>
        </div>

        <button
          type="button"
          className="btn-result-back-folder"
          onClick={onBackToFolder}
        >
          Back to Folder
        </button>
      </div>

      {mistakes.length === 0 ? (
        <div className="flashcards-empty-state">
          <div className="empty-state-icon">⭐</div>
          <h3 className="empty-state-title">No Mistakes Recorded</h3>
          <p className="empty-state-text">
            You answered every question in this session correctly! Outstanding work.
          </p>
          <button
            type="button"
            className="btn-result-back-folder"
            onClick={onBackToFolder}
          >
            Back to Folder
          </button>
        </div>
      ) : (
        <div className="mistakes-list">
          {mistakes.map((mistake, idx) => (
            <div key={`mistake-${idx}`} className="mistake-card-item">
              <div className="mistake-question-label">
                MISTAKE #{idx + 1} · QUESTION {String(mistake.index + 1).padStart(2, '0')}
              </div>
              <h3 className="mistake-question-text">{mistake.question}</h3>

              <div className="mistake-answers-split">
                <div className="mistake-answer-box is-wrong">
                  <div className="mistake-box-title">✕ YOUR SELECTED ANSWER</div>
                  <p className="mistake-box-content">{mistake.selectedAnswer || 'None selected'}</p>
                </div>

                <div className="mistake-answer-box is-right">
                  <div className="mistake-box-title">✓ CORRECT ANSWER</div>
                  <p className="mistake-box-content">{mistake.correctAnswer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
