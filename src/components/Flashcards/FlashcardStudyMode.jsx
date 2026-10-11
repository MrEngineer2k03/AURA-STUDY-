import React, { useState, useEffect, useCallback } from 'react';

/**
 * FlashcardStudyMode - Dedicated interactive study interface
 *
 * Features:
 * - 1 card displayed at a time with 3D flip animation
 * - Front: Question / Back: Answer
 * - Response buttons: "Still Learning" & "I Know This"
 * - Card index indicator (e.g. 3 / 10)
 * - Study progress bar
 * - Previous and Next navigation controls
 * - Deck shuffle toggle
 * - Keyboard shortcuts (Space = flip, 1 = Still Learning, 2 = I Know This, Esc = exit)
 * - End of session summary card with options to review again or return to library
 * - Updates card study statistics & folder progression
 *
 * @param {Object} props
 * @param {Array<Object>} props.cards - Deck of flashcards to study
 * @param {Object} props.folder - The parent study folder
 * @param {Function} props.onClose - () => void
 * @param {Function} props.onRecordStudyResult - (cardId, isMastered) => void
 */
export default function FlashcardStudyMode({
  cards = [],
  folder,
  onClose,
  onRecordStudyResult,
}) {
  const [deck, setDeck] = useState(() => [...cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  // Session results tracker
  const [sessionResults, setSessionResults] = useState([]);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Sync deck when cards prop changes
  useEffect(() => {
    setDeck([...cards]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionResults([]);
    setIsSessionFinished(false);
  }, [cards]);

  // Handle deck shuffle
  const handleToggleShuffle = () => {
    if (!isShuffled) {
      // Shuffle deck
      const shuffled = [...deck].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setIsShuffled(true);
      setCurrentIndex(0);
      setIsFlipped(false);
    } else {
      // Reset to original order
      setDeck([...cards]);
      setIsShuffled(false);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  const currentCard = deck[currentIndex] || null;
  const totalInDeck = deck.length;

  // Flip Card Toggle
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Record Response: Still Learning
  const handleStillLearning = useCallback(() => {
    if (!currentCard) return;

    if (onRecordStudyResult) {
      onRecordStudyResult(currentCard.id, false);
    }

    setSessionResults((prev) => [
      ...prev,
      { cardId: currentCard.id, result: 'learning' },
    ]);

    // Advance
    if (currentIndex < totalInDeck - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  }, [currentCard, currentIndex, totalInDeck, onRecordStudyResult]);

  // Record Response: I Know This
  const handleKnowThis = useCallback(() => {
    if (!currentCard) return;

    if (onRecordStudyResult) {
      onRecordStudyResult(currentCard.id, true);
    }

    setSessionResults((prev) => [
      ...prev,
      { cardId: currentCard.id, result: 'mastered' },
    ]);

    // Advance
    if (currentIndex < totalInDeck - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  }, [currentCard, currentIndex, totalInDeck, onRecordStudyResult]);

  // Manual Previous Card Navigation
  const handlePrevCard = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Manual Next Card Navigation
  const handleNextCard = () => {
    if (currentIndex < totalInDeck - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    if (isSessionFinished) return;

    const handleKeyDown = (e) => {
      // Do not catch typing in input elements
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight' || e.key === '2') {
        if (isFlipped) {
          e.preventDefault();
          handleKnowThis();
        }
      } else if (e.key === 'ArrowLeft' || e.key === '1') {
        if (isFlipped) {
          e.preventDefault();
          handleStillLearning();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleKnowThis, handleStillLearning, isFlipped, isSessionFinished, onClose]);

  // Restart Study Session
  const handleRestartStudy = () => {
    setDeck([...cards]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionResults([]);
    setIsSessionFinished(false);
  };

  // Study Only Still Learning Cards
  const handleReviewLearningOnly = () => {
    const learningCardIds = sessionResults
      .filter((r) => r.result === 'learning')
      .map((r) => r.cardId);

    const filtered = cards.filter((c) => learningCardIds.includes(c.id));
    if (filtered.length > 0) {
      setDeck(filtered);
      setCurrentIndex(0);
      setIsFlipped(false);
      setSessionResults([]);
      setIsSessionFinished(false);
    } else {
      handleRestartStudy();
    }
  };

  // Calculate Progress Percent
  const progressPercent =
    totalInDeck > 0 ? Math.round(((currentIndex) / totalInDeck) * 100) : 0;

  // Session Summary Calculations
  const sessionMasteredCount = sessionResults.filter(
    (r) => r.result === 'mastered'
  ).length;
  const sessionLearningCount = sessionResults.filter(
    (r) => r.result === 'learning'
  ).length;
  const sessionAccuracy =
    sessionResults.length > 0
      ? Math.round((sessionMasteredCount / sessionResults.length) * 100)
      : 0;

  // Render Session Finished View
  if (isSessionFinished) {
    return (
      <div className="flashcards-study-mode-container" role="main" aria-label="Study Session Complete">
        <div className="study-finish-card">
          <div className="finish-trophy-orb" aria-hidden="true">
            <span>🏆</span>
          </div>

          <h2 className="finish-headline">Session Complete!</h2>
          <p className="finish-subtext">
            Excellent work! You reviewed all cards in <strong>{folder?.title || 'this folder'}</strong>.
          </p>

          <div className="finish-stats-grid">
            <div className="finish-stat-box">
              <span className="finish-stat-num">{sessionResults.length}</span>
              <span className="finish-stat-lbl">Cards Studied</span>
            </div>
            <div className="finish-stat-box">
              <span className="finish-stat-num is-mastered">+{sessionMasteredCount}</span>
              <span className="finish-stat-lbl">Mastered</span>
            </div>
            <div className="finish-stat-box">
              <span className="finish-stat-num is-learning">{sessionLearningCount}</span>
              <span className="finish-stat-lbl">Still Learning</span>
            </div>
          </div>

          <div className="finish-actions-row">
            <button
              type="button"
              className="btn-finish-study-again"
              onClick={handleRestartStudy}
            >
              <span>🔄</span>
              <span>Study Again</span>
            </button>

            {sessionLearningCount > 0 && (
              <button
                type="button"
                className="btn-finish-return"
                onClick={handleReviewLearningOnly}
              >
                <span>⚡</span>
                <span>Review Learning ({sessionLearningCount})</span>
              </button>
            )}

            <button
              type="button"
              className="btn-finish-return"
              onClick={onClose}
            >
              <span>← Back to Flashcards</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no cards in folder
  if (!currentCard) {
    return (
      <div className="flashcards-study-mode-container">
        <div className="study-finish-card">
          <h2 className="finish-headline">No Flashcards to Study</h2>
          <p className="finish-subtext">
            This folder does not contain any flashcards yet.
          </p>
          <button
            type="button"
            className="btn-finish-study-again"
            onClick={onClose}
          >
            ← Return to Flashcards
          </button>
        </div>
      </div>
    );
  }

  const questionText = currentCard.question || currentCard.front || '';
  const answerText = currentCard.answer || currentCard.back || '';
  const currentCardNumber = `${currentIndex + 1} / ${totalInDeck}`;

  return (
    <div
      className="flashcards-study-mode-container"
      role="region"
      aria-label="Flashcard Study Mode"
    >
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="study-mode-top-bar">
        <button
          type="button"
          className="btn-exit-study-mode"
          onClick={onClose}
          aria-label="Exit Study Mode and return to flashcards list"
        >
          <span>✕</span>
          <span>Exit Study Mode</span>
        </button>

        <div className="study-deck-meta-center">
          <span className="study-folder-title">{folder?.title || 'FLASHCARDS'}</span>
          <span className="study-card-counter">CARD {currentCardNumber}</span>
        </div>

        <div className="study-top-tools">
          <button
            type="button"
            className={`btn-shuffle-toggle ${isShuffled ? 'is-active' : ''}`}
            onClick={handleToggleShuffle}
            title={isShuffled ? 'Shuffled deck active' : 'Shuffle cards'}
          >
            <span>🔀</span>
            <span>{isShuffled ? 'Shuffled' : 'Shuffle'}</span>
          </button>
        </div>
      </div>

      {/* 2. PROGRESS BAR */}
      <div className="study-progress-container">
        <div className="study-progress-label-row">
          <span>PROGRESS</span>
          <span>{progressPercent}% COMPLETE</span>
        </div>
        <div className="study-progress-track">
          <div
            className="study-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3. 3D FLIP CARD STAGE */}
      <div
        className="study-flip-stage"
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        aria-label="Flashcard. Click or press Space to flip."
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleFlip();
          }
        }}
      >
        <div className={`study-flip-card ${isFlipped ? 'is-flipped' : ''}`}>
          {/* FRONT FACE (QUESTION) */}
          <div className="flip-card-face flip-card-front">
            <div className="flip-laser-accent" aria-hidden="true" />
            
            <div className="flip-face-header">
              <span className="flip-tag-badge">
                <span>✦</span> QUESTION · #{String(currentIndex + 1).padStart(2, '0')}
              </span>
              {currentCard.lessonTag && (
                <span className="card-tag-pill">{currentCard.lessonTag}</span>
              )}
            </div>

            <div className="flip-face-center">
              <h3 className="flip-prompt-headline">{questionText}</h3>
            </div>

            <div className="flip-face-footer">
              <span className="flip-hint-icon">↷</span>
              <span>Click card or press Space to reveal answer</span>
            </div>
          </div>

          {/* BACK FACE (ANSWER) */}
          <div className="flip-card-face flip-card-back">
            <div className="flip-laser-accent" aria-hidden="true" />

            <div className="flip-face-header">
              <span className="flip-tag-badge is-answer-tag">
                <span>✓</span> ANSWER
              </span>
              {currentCard.status && (
                <span className={`card-status-badge status-badge-${currentCard.status}`}>
                  {currentCard.status}
                </span>
              )}
            </div>

            <div className="flip-face-center">
              <p className="flip-prompt-headline">{answerText}</p>
            </div>

            <div className="flip-face-footer">
              <span className="flip-hint-icon">↶</span>
              <span>Click card or press Space to flip back</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. CONTROLS PANEL */}
      <div className="study-controls-panel">
        {/* Quick Flip Toggle Button */}
        <div className="study-flip-button-row">
          <button
            type="button"
            className="btn-trigger-flip"
            onClick={handleFlip}
          >
            <span>{isFlipped ? '↶ Flip to Question' : '↷ Flip to Answer'}</span>
            <span className="form-field-char-count">(Space)</span>
          </button>
        </div>

        {/* Response Buttons: Still Learning vs I Know This */}
        <div className="study-response-buttons-row">
          <button
            type="button"
            className="btn-still-learning"
            onClick={handleStillLearning}
            title="Mark as still learning and advance"
          >
            <span>⚡</span>
            <span>Still Learning</span>
            {isFlipped && <span className="form-field-char-count">[1]</span>}
          </button>

          <button
            type="button"
            className="btn-know-this"
            onClick={handleKnowThis}
            title="Mark as mastered and advance"
          >
            <span>✓</span>
            <span>I Know This</span>
            {isFlipped && <span className="form-field-char-count">[2]</span>}
          </button>
        </div>

        {/* Previous & Next Card Nav */}
        <div className="study-navigation-row">
          <button
            type="button"
            className="btn-nav-card"
            onClick={handlePrevCard}
            disabled={currentIndex === 0}
          >
            <span>←</span>
            <span>Previous</span>
          </button>

          <span className="stat-subtext-detail">
            Card {currentIndex + 1} of {totalInDeck}
          </span>

          <button
            type="button"
            className="btn-nav-card"
            onClick={handleNextCard}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
