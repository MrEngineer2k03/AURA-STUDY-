import React, { useState, useEffect, useRef, useMemo } from 'react';
import './StudyCompletionModal.css';

/**
 * Animated XP Number Hook
 * Smoothly interpolates from 0 to target value when modal opens
 */
function useAnimatedCounter(targetValue, isActive, duration = 800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCount(0);
      return;
    }

    if (!targetValue || targetValue <= 0) {
      setCount(0);
      return;
    }

    let startTime = null;
    let animId = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(easeOut * targetValue));

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [targetValue, isActive, duration]);

  return count;
}

/**
 * StudyCompletionModal - Interactive Study Session Completion Popup & Summary
 *
 * Implements:
 * 1. Scenario A: Congratulations Popup (All questions answered) matching Image 1
 *    - Trophy achievement icon with gold glow
 *    - Green and gold accent theme & ambient particles
 *    - Segmented mini-bar reflecting answer results
 *    - 2x2 statistics grid (Questions answered, Correct, Incorrect, XP earned)
 *    - Motivational message
 *    - Buttons: "View Results →", "Back to My Folders"
 * 2. Scenario B: Encouragement Popup (Incomplete answers)
 *    - Blue/purple accent theme with glowing study icon
 *    - Dynamic subtitle: "You answered X out of Y questions."
 *    - Segmented mini-bar with unanswered indicator
 *    - Summary cards (Answered, Unanswered, Correct, Incorrect, XP)
 *    - Encouraging growth-mindset message
 *    - Buttons: "View Results →", "Back to My Folders", "Study Again"
 * 3. Detailed Results View matching Image 2
 *    - Question-by-question breakdown with Correct / Incorrect / Unanswered status pills
 *    - "Your answer: ..." and "Correct: ..." details
 *    - Buttons: "Back to summary", "Back to My Folders"
 */
export default function StudyCompletionModal({
  isOpen = false,
  folderTitle = 'Flashcards',
  totalQuestions = 0,
  answeredQuestions = 0,
  unansweredQuestions = 0,
  correctAnswers = 0,
  incorrectAnswers = 0,
  xpEarned = 0,
  questionResults = [],
  onBackToFolders,
  onStudyAgain,
  onClose,
}) {
  // Modal View: 'summary' | 'results'
  const [activeView, setActiveView] = useState('summary');

  // Reset to summary view whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveView('summary');
    }
  }, [isOpen]);

  // Smoothly animated XP count
  const animatedXp = useAnimatedCounter(xpEarned, isOpen, 750);

  // Completion condition:
  // IF answeredQuestions === totalQuestions: display Congratulations popup.
  // ELSE: display Session Completed encouragement popup.
  const isAllAnswered = answeredQuestions === totalQuestions && totalQuestions > 0;

  // Safe question results list
  const resultsList = useMemo(() => {
    if (questionResults && questionResults.length > 0) {
      return questionResults;
    }
    // Fallback stub list if no detailed array is supplied
    return Array.from({ length: totalQuestions }).map((_, i) => ({
      questionIndex: i,
      question: `Question ${i + 1}`,
      selectedAnswer: i < correctAnswers ? 'Correct Choice' : 'Sample Choice',
      correctAnswer: 'Correct Choice',
      status: i < correctAnswers ? 'correct' : i < answeredQuestions ? 'incorrect' : 'unanswered',
    }));
  }, [questionResults, totalQuestions, correctAnswers, answeredQuestions]);

  // Close or navigate with keyboard
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeView === 'results') {
          setActiveView('summary');
        } else if (onBackToFolders) {
          onBackToFolders();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeView, onBackToFolders]);

  if (!isOpen) return null;

  return (
    <div
      className="aura-completion-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="completion-title"
    >
      <div
        className={`aura-completion-modal ${
          isAllAnswered ? 'theme-congrats' : 'theme-encouragement'
        }`}
      >
        {/* Ambient Top Glow */}
        <div className="aura-modal-ambient-glow" aria-hidden="true" />

        {/* Ambient Floating Confetti Particles (Scenario A Celebratory Effect) */}
        {isAllAnswered && activeView === 'summary' && (
          <div className="aura-celebration-particles" aria-hidden="true">
            <span className="celebration-sparkle sparkle-1" />
            <span className="celebration-sparkle sparkle-2" />
            <span className="celebration-sparkle sparkle-3" />
            <span className="celebration-sparkle sparkle-4" />
            <span className="celebration-sparkle sparkle-5" />
          </div>
        )}

        {/* ========================================================
            VIEW 1: COMPLETION POPUP SUMMARY (Scenario A or B)
            ======================================================== */}
        {activeView === 'summary' && (
          <div className="aura-modal-content">
            {/* Top Icon Box */}
            <div className="aura-completion-icon-box" aria-hidden="true">
              {isAllAnswered ? (
                /* Gold Trophy Icon (Image 1) */
                <svg
                  className="aura-completion-icon-svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FBBF24"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34" />
                  <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
                </svg>
              ) : (
                /* Friendly Glowing Lightbulb / Graduation Cap Icon (Scenario B) */
                <svg
                  className="aura-completion-icon-svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#A78BFA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                </svg>
              )}
            </div>

            {/* Title */}
            <h2 id="completion-title" className="aura-completion-title">
              {isAllAnswered ? 'Congratulations!' : 'Session Completed!'}
            </h2>

            {/* Subtitle */}
            <p className="aura-completion-subtitle">
              {isAllAnswered
                ? "You've successfully completed all the questions!"
                : `You answered ${answeredQuestions} out of ${totalQuestions} questions.`}
            </p>

            {/* Segmented Mini Progress Bar matching Image 1 */}
            <div
              className="aura-completion-mini-bar"
              aria-label="Question completion status bar"
            >
              {resultsList.map((item, idx) => {
                const segStatus =
                  item.status === 'correct'
                    ? 'is-correct'
                    : item.status === 'incorrect'
                    ? 'is-incorrect'
                    : 'is-unanswered';
                return (
                  <span
                    key={`seg-pill-${idx}`}
                    className={`completion-segment-pill ${segStatus}`}
                    title={`Question ${idx + 1}: ${
                      item.status === 'correct'
                        ? 'Correct'
                        : item.status === 'incorrect'
                        ? 'Incorrect'
                        : 'Unanswered'
                    }`}
                  />
                );
              })}
            </div>

            {/* Statistics Display */}
            {isAllAnswered ? (
              /* Scenario A: 2x2 Grid exactly matching Image 1 */
              <div className="aura-completion-stats-grid">
                <div className="aura-stat-summary-card">
                  <span className="aura-stat-card-value val-teal">
                    {answeredQuestions} / {totalQuestions}
                  </span>
                  <span className="aura-stat-card-label">Questions answered</span>
                </div>

                <div className="aura-stat-summary-card">
                  <span className="aura-stat-card-value val-teal">
                    {correctAnswers}
                  </span>
                  <span className="aura-stat-card-label">Correct answers</span>
                </div>

                <div className="aura-stat-summary-card">
                  <span className="aura-stat-card-value val-red">
                    {incorrectAnswers}
                  </span>
                  <span className="aura-stat-card-label">Incorrect answers</span>
                </div>

                <div className="aura-stat-summary-card">
                  <span className="aura-stat-card-value val-gold">
                    {animatedXp}
                  </span>
                  <span className="aura-stat-card-label">XP earned</span>
                </div>
              </div>
            ) : (
              /* Scenario B: Clear 5-Card Stats Grid (includes Unanswered count) */
              <div className="aura-completion-stats-grid-5">
                <div className="aura-stat-summary-card">
                  <span className="aura-stat-card-value val-blue">
                    {answeredQuestions} / {totalQuestions}
                  </span>
                  <span className="aura-stat-card-label">Questions answered</span>
                </div>

                <div className="aura-stat-summary-card">
                  <span className="aura-stat-card-value val-amber">
                    {unansweredQuestions}
                  </span>
                  <span className="aura-stat-card-label">Unanswered</span>
                </div>

                <div className="aura-stat-summary-card">
                  <span className="aura-stat-card-value val-teal">
                    {correctAnswers}
                  </span>
                  <span className="aura-stat-card-label">Correct answers</span>
                </div>

                <div className="aura-stat-summary-card">
                  <span className="aura-stat-card-value val-red">
                    {incorrectAnswers}
                  </span>
                  <span className="aura-stat-card-label">Incorrect answers</span>
                </div>

                <div className="aura-stat-summary-card stat-card-xp">
                  <span className="aura-stat-card-value val-gold">
                    ⚡ +{animatedXp} XP
                  </span>
                  <span className="aura-stat-card-label">Total XP earned</span>
                </div>
              </div>
            )}

            {/* Motivational / Encouraging Message */}
            <p className="aura-completion-message">
              {isAllAnswered
                ? 'Great job! Your dedication to learning is paying off. Keep building your knowledge!'
                : "You're making progress! Every question is an opportunity to learn. Keep studying and challenge yourself again!"}
            </p>

            {/* Action Buttons */}
            <div className="aura-completion-actions">
              <button
                type="button"
                className="btn-aura-primary-action"
                onClick={() => setActiveView('results')}
                autoFocus
              >
                <span>View Results</span>
                <span aria-hidden="true">→</span>
              </button>

              <button
                type="button"
                className="btn-aura-secondary-action"
                onClick={onBackToFolders}
              >
                <span>Back to My Folders</span>
              </button>

              {!isAllAnswered && onStudyAgain && (
                <button
                  type="button"
                  className="btn-aura-tertiary-action"
                  onClick={onStudyAgain}
                >
                  <span>↻ Study Again</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW 2: DETAILED SESSION RESULTS (Exact Match to Image 2)
            ======================================================== */}
        {activeView === 'results' && (
          <div className="aura-detailed-results-view">
            {/* Header */}
            <div className="results-view-header">
              <h2 className="results-view-title">Session results</h2>
              <p className="results-view-subtitle">
                {correctAnswers} correct, {incorrectAnswers} incorrect,{' '}
                {unansweredQuestions} unanswered, {xpEarned} XP
              </p>
            </div>

            {/* Questions List */}
            <div
              className="results-questions-list"
              role="list"
              aria-label="Detailed question results"
            >
              {resultsList.map((item, idx) => {
                const isCorrect = item.status === 'correct';
                const isIncorrect = item.status === 'incorrect';
                const isUnanswered = item.status === 'unanswered';

                return (
                  <div
                    key={`res-q-${idx}`}
                    className="results-question-card"
                    role="listitem"
                  >
                    <div className="results-q-top-row">
                      <div className="results-q-title-group">
                        <span className="results-q-index-badge">{idx + 1}</span>
                        <span className="results-q-prompt-text">{item.question}</span>
                      </div>

                      {/* Status Pill Badge */}
                      <span
                        className={`results-status-pill ${
                          isCorrect
                            ? 'is-correct'
                            : isIncorrect
                            ? 'is-incorrect'
                            : 'is-unanswered'
                        }`}
                      >
                        {isCorrect
                          ? 'Correct'
                          : isIncorrect
                          ? 'Incorrect'
                          : 'Unanswered'}
                      </span>
                    </div>

                    {/* Subtext: Your answer and Correct answer */}
                    <div className="results-q-subtext">
                      {isCorrect && (
                        <span>Your answer: {item.selectedAnswer}</span>
                      )}

                      {isIncorrect && (
                        <span>
                          Your answer: {item.selectedAnswer}
                          <span className="sep">|</span>
                          <span className="correct-part">
                            Correct: {item.correctAnswer}
                          </span>
                        </span>
                      )}

                      {isUnanswered && (
                        <span>
                          Your answer: <em>(No answer - Time expired)</em>
                          <span className="sep">|</span>
                          <span className="correct-part">
                            Correct: {item.correctAnswer}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="aura-completion-actions">
              <button
                type="button"
                className="btn-aura-primary-action"
                onClick={() => setActiveView('summary')}
                autoFocus
              >
                <span>Back to summary</span>
              </button>

              <button
                type="button"
                className="btn-aura-secondary-action"
                onClick={onBackToFolders}
              >
                <span>Back to My Folders</span>
              </button>

              {onStudyAgain && (
                <button
                  type="button"
                  className="btn-aura-tertiary-action"
                  onClick={onStudyAgain}
                >
                  <span>↻ Study Again</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

