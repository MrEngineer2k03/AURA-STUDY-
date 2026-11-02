import React from 'react';
import './AnswerFeedbackNotification.css';

/**
 * AnswerFeedbackNotification - State-adaptive feedback notification for AURA Flashcard Studying
 * Supports three distinct feedback states:
 * 1. 'correct' - Emerald green (#00D69A)
 * 2. 'wrong'   - Vibrant red (#FF405C)
 * 3. 'timeout' - Amber orange (#FFAA32)
 *
 * @param {Object} props
 * @param {'correct' | 'wrong' | 'timeout'} props.feedbackState
 * @param {string} props.correctAnswerText - Text of the actual correct answer
 * @param {number} [props.xpEarned=10] - XP earned for correct answers
 * @param {boolean} [props.isLastQuestion=false] - Whether this is the final question
 * @param {Function} props.onNext - Callback to advance or view results
 */
export default function AnswerFeedbackNotification({
  feedbackState,
  correctAnswerText,
  xpEarned = 10,
  isLastQuestion = false,
  onNext,
}) {
  if (!feedbackState) return null;

  const isCorrect = feedbackState === 'correct';
  const isWrong = feedbackState === 'wrong';
  const isTimeout = feedbackState === 'timeout';

  const actionButtonText = isLastQuestion ? 'View Results' : 'Next Question';

  return (
    <div
      className={`aura-feedback-notification feedback-state-${feedbackState}`}
      role="alert"
      aria-live="polite"
    >
      {/* Background ambient lighting */}
      <div className="feedback-ambient-glow" aria-hidden="true" />

      {/* Subtle particle effect for Correct Answer state */}
      {isCorrect && (
        <div className="feedback-sparkles-container" aria-hidden="true">
          <span className="feedback-particle particle-1" />
          <span className="feedback-particle particle-2" />
          <span className="feedback-particle particle-3" />
          <span className="feedback-particle particle-4" />
          <span className="feedback-particle particle-5" />
          <span className="feedback-particle particle-6" />
        </div>
      )}

      {/* LEFT: Status Icon Container */}
      <div className="feedback-icon-box">
        {isCorrect && (
          <svg
            className="feedback-icon-svg icon-check"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#00D69A"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {isWrong && (
          <svg
            className="feedback-icon-svg icon-cross"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FF405C"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
        {isTimeout && (
          <svg
            className="feedback-icon-svg icon-clock"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFAA32"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        )}
      </div>

      {/* CENTER: Typography & Subtitle & Metadata Callouts */}
      <div className="feedback-content-col">
        <h3 className="feedback-title">
          {isCorrect && 'Correct Answer!'}
          {isWrong && 'Incorrect Answer'}
          {isTimeout && "Time's Up!"}
        </h3>

        <p className="feedback-subtitle">
          {isCorrect && 'Excellent work! Keep your streak going.'}
          {isWrong && "Not quite! Don't give up. Keep learning."}
          {isTimeout && 'The time ran out! Stay focused on the next question.'}
        </p>

        {/* State-specific Sub-Indicators */}
        <div className="feedback-meta-row">
          {isCorrect && (
            <div className="feedback-xp-pill" title={`+${xpEarned} XP awarded`}>
              <span className="feedback-bolt-icon" aria-hidden="true">⚡</span>
              <span className="feedback-xp-text">+{xpEarned} XP earned</span>
            </div>
          )}

          {(isWrong || isTimeout) && correctAnswerText && (
            <div className="feedback-correct-answer-pill" title="Actual correct answer">
              <span className="feedback-check-small" aria-hidden="true">✓</span>
              <span className="feedback-answer-label">Correct answer:</span>
              <span className="feedback-answer-value">{correctAnswerText}</span>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Primary Action Button */}
      <div className="feedback-action-col">
        <button
          type="button"
          className="btn-feedback-action"
          onClick={onNext}
          autoFocus
        >
          <span className="action-btn-text">{actionButtonText}</span>
          <span className="action-btn-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
