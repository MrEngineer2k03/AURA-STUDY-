import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FlipCard from './FlipCard';
import './Flipcards.css';

/**
 * FlipCardsStudy - Full-Featured Interactive 3D Flip Card Study Session for AURA
 *
 * Implements:
 * 1. 3D Flip Flashcard stage with tap-to-reveal question/answer
 * 2. Navigation: Previous Card, Next Card, Flip Card, Shuffle Cards
 * 3. Progress tracking: Current card index, progress bar, % complete
 * 4. Self-evaluation: "Still Learning" vs "I Know This" (Mastered)
 * 5. Full keyboard support: Space (flip), Left Arrow (prev/learning), Right Arrow (next/mastered), Esc (exit)
 * 6. Completion summary screen with restart & review-learning-only options
 * 7. Mobile-responsive layout with accessible touch-friendly controls
 *
 * @param {Object} props
 * @param {Array<Object>} props.cards - Flashcard list
 * @param {Object} props.folder - Folder info object
 * @param {Function} props.onClose - Exit study session callback
 * @param {Function} [props.onRecordStudyResult] - (cardId, isMastered) => void
 * @param {Function} [props.onSwitchToQuiz] - Optional callback to switch to multiple-choice quiz
 */
export default function FlipCardsStudy({
  cards = [],
  folder,
  onClose,
  onRecordStudyResult,
  onSwitchToQuiz,
}) {
  const [deck, setDeck] = useState(() => [...cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);

  // Session results tracker: [{ cardId, result: 'mastered' | 'learning' }]
  const [sessionResults, setSessionResults] = useState([]);
  const [isSessionFinished, setIsSessionFinished] = useState(false);

  // Mobile drawer state for viewing all cards in the deck
  const [isDeckDrawerOpen, setIsDeckDrawerOpen] = useState(false);

  // Sync deck when cards prop changes
  useEffect(() => {
    setDeck([...cards]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionResults([]);
    setIsSessionFinished(false);
  }, [cards]);

  // Deck shuffle toggle
  const handleToggleShuffle = useCallback(() => {
    if (!isShuffled) {
      const shuffled = [...deck].sort(() => Math.random() - 0.5);
      setDeck(shuffled);
      setIsShuffled(true);
      setCurrentIndex(0);
      setIsFlipped(false);
    } else {
      setDeck([...cards]);
      setIsShuffled(false);
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [deck, isShuffled, cards]);

  const currentCard = deck[currentIndex] || null;
  const totalInDeck = deck.length;

  // Toggle card flip
  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Record response: Still Learning (needs review)
  const handleStillLearning = useCallback(() => {
    if (!currentCard) return;

    if (onRecordStudyResult) {
      onRecordStudyResult(currentCard.id, false);
    }

    setSessionResults((prev) => [
      ...prev.filter((r) => r.cardId !== currentCard.id),
      { cardId: currentCard.id, result: 'learning' },
    ]);

    // Advance to next card or finish session
    if (currentIndex < totalInDeck - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  }, [currentCard, currentIndex, totalInDeck, onRecordStudyResult]);

  // Record response: I Know This (Mastered)
  const handleKnowThis = useCallback(() => {
    if (!currentCard) return;

    if (onRecordStudyResult) {
      onRecordStudyResult(currentCard.id, true);
    }

    setSessionResults((prev) => [
      ...prev.filter((r) => r.cardId !== currentCard.id),
      { cardId: currentCard.id, result: 'mastered' },
    ]);

    // Advance to next card or finish session
    if (currentIndex < totalInDeck - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  }, [currentCard, currentIndex, totalInDeck, onRecordStudyResult]);

  // Manual Previous Card
  const handlePrevCard = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Manual Next Card
  const handleNextCard = useCallback(() => {
    if (currentIndex < totalInDeck - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSessionFinished(true);
    }
  }, [currentIndex, totalInDeck]);

  // Keyboard Navigation & Shortcuts
  useEffect(() => {
    if (isSessionFinished) return;

    const handleKeyDown = (e) => {
      // Guard: do not intercept typing in input fields
      const targetTag = e.target?.tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(targetTag) || e.target?.isContentEditable) {
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      } else if (e.key === '1') {
        e.preventDefault();
        handleStillLearning();
      } else if (e.key === '2') {
        e.preventDefault();
        handleKnowThis();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (onClose) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isSessionFinished,
    handleFlip,
    handleNextCard,
    handlePrevCard,
    handleKnowThis,
    handleStillLearning,
    isFlipped,
    onClose,
  ]);

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

  // Progress Calculations
  const progressPercent = totalInDeck > 0
    ? Math.round(((currentIndex + (isSessionFinished ? 1 : 0)) / totalInDeck) * 100)
    : 0;

  const sessionMasteredCount = useMemo(
    () => sessionResults.filter((r) => r.result === 'mastered').length,
    [sessionResults]
  );
  const sessionLearningCount = useMemo(
    () => sessionResults.filter((r) => r.result === 'learning').length,
    [sessionResults]
  );
  const sessionAccuracy = useMemo(
    () =>
      sessionResults.length > 0
        ? Math.round((sessionMasteredCount / sessionResults.length) * 100)
        : 0,
    [sessionResults, sessionMasteredCount]
  );

  // ========================================================
  // CASE 1: SESSION COMPLETE VIEW
  // ========================================================
  if (isSessionFinished) {
    return (
      <div className="aura-flip-study-root" role="main" aria-label="Study Session Complete">
        <div className="aura-study-finish-card">
          <div className="aura-finish-trophy" aria-hidden="true">
            <span>🏆</span>
          </div>

          <h2 className="aura-finish-headline">Session Complete!</h2>
          <p className="aura-finish-subtext">
            Great work! You reviewed all flashcards in <strong>{folder?.title || 'this folder'}</strong>.
          </p>

          <div className="aura-finish-stats-grid">
            <div className="aura-finish-stat-box">
              <span className="aura-finish-stat-num">{sessionResults.length}</span>
              <span className="aura-finish-stat-lbl">Cards Studied</span>
            </div>
            <div className="aura-finish-stat-box">
              <span className="aura-finish-stat-num is-mastered">+{sessionMasteredCount}</span>
              <span className="aura-finish-stat-lbl">Mastered</span>
            </div>
            <div className="aura-finish-stat-box">
              <span className="aura-finish-stat-num is-learning">{sessionLearningCount}</span>
              <span className="aura-finish-stat-lbl">Still Learning</span>
            </div>
            <div className="aura-finish-stat-box">
              <span className="aura-finish-stat-num">{sessionAccuracy}%</span>
              <span className="aura-finish-stat-lbl">Accuracy</span>
            </div>
          </div>

          <div className="aura-finish-actions-row">
            <button
              type="button"
              className="aura-btn-study-again"
              onClick={handleRestartStudy}
            >
              <span>🔄</span>
              <span>Study Again</span>
            </button>

            {sessionLearningCount > 0 && (
              <button
                type="button"
                className="aura-btn-review-learning"
                onClick={handleReviewLearningOnly}
              >
                <span>⚡</span>
                <span>Review Learning ({sessionLearningCount})</span>
              </button>
            )}

            <button
              type="button"
              className="aura-btn-finish-return"
              onClick={onClose}
            >
              <span>← Back to Flashcards</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // CASE 2: EMPTY DECK VIEW
  // ========================================================
  if (!currentCard) {
    return (
      <div className="aura-flip-study-root">
        <div className="aura-study-finish-card">
          <h2 className="aura-finish-headline">No Flashcards to Study</h2>
          <p className="aura-finish-subtext">
            This folder does not contain any flashcards yet. Add flashcards to start practicing.
          </p>
          <button
            type="button"
            className="aura-btn-finish-return"
            onClick={onClose}
          >
            ← Return to Flashcards
          </button>
        </div>
      </div>
    );
  }

  // ========================================================
  // CASE 3: ACTIVE 3D FLIP CARD STUDY EXPERIENCE
  // ========================================================
  return (
    <div
      className="aura-flip-study-root"
      role="region"
      aria-label="3D Flashcard Study Session"
    >
      {/* 1. TOP HEADER & NAVIGATION (Full available content width) */}
      <header className="aura-study-top-bar" aria-label="Study Session Header">
        <div className="aura-study-top-left">
          <button
            type="button"
            className="aura-btn-exit-study"
            onClick={onClose}
            aria-label="Exit Study Session"
          >
            {/* Mobile borderless back icon */}
            <svg
              className="aura-exit-back-icon mobile-only"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="aura-exit-cross desktop-only" aria-hidden="true">✕</span>
            <span className="desktop-only">Exit</span>
          </button>
        </div>

        <div className="aura-study-top-center">
          <h1 className="aura-study-folder-title">{folder?.title || 'FLASHCARDS'}</h1>
          <span className="aura-study-card-counter">
            Card {currentIndex + 1} of {totalInDeck}
          </span>
        </div>

        <div className="aura-study-top-right">
          {/* Desktop Tools: Quiz Mode & Shuffle */}
          <div className="desktop-study-tools">
            {onSwitchToQuiz && (
              <button
                type="button"
                className="aura-btn-tool-mode"
                onClick={onSwitchToQuiz}
                title="Switch to Multiple-Choice Quiz"
              >
                <span aria-hidden="true">⏱</span>
                <span className="aura-tool-label-text">Quiz Mode</span>
              </button>
            )}

            <button
              type="button"
              className={`aura-btn-tool-shuffle ${isShuffled ? 'is-active' : ''}`}
              onClick={handleToggleShuffle}
              title={isShuffled ? 'Shuffled deck active' : 'Shuffle deck cards'}
              aria-pressed={isShuffled}
            >
              <span aria-hidden="true">🔀</span>
              <span className="aura-tool-label-text">{isShuffled ? 'Shuffled' : 'Shuffle'}</span>
            </button>
          </div>

          {/* Mobile "Cards" button (replaces quiz & shuffle in header) */}
          <button
            type="button"
            className="mobile-btn-deck-toggle"
            onClick={() => setIsDeckDrawerOpen(true)}
            aria-label="View cards in this deck"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="14" height="14" rx="3" />
              <path d="M7 21h12a2 2 0 0 0 2-2V7" />
            </svg>
            <span>Cards</span>
          </button>
        </div>
      </header>

      {/* 2. STUDY PROGRESS WITH LIVE METRICS (Matches layout image) */}
      <section className="aura-study-progress-section" aria-label="Study Progress">
        <div className="aura-study-progress-meta-row">
          <div className="aura-study-progress-stats">
            <span className="aura-meta-stat">
              <span className="aura-meta-dot is-learning" aria-hidden="true">●</span>
              <span className="aura-meta-label">Learning</span>
              <span className="aura-meta-val">{sessionLearningCount}</span>
            </span>
            <span className="aura-meta-stat">
              <span className="aura-meta-dot is-mastered" aria-hidden="true">●</span>
              <span className="aura-meta-label">Mastered</span>
              <span className="aura-meta-val">{sessionMasteredCount}</span>
            </span>
            <span className="aura-meta-pct">{progressPercent}% complete</span>
          </div>
        </div>
        <div className="aura-study-progress-track">
          <div
            className="aura-study-progress-fill"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </section>

      {/* 3. MAIN STUDY AREA: 2-COLUMN WORKSPACE MATCHING SCREENSHOT */}
      <main className="aura-study-main-workspace">
        {/* LEFT COLUMN: FLASHCARD + ACTION BUTTONS ROW UNDERNEATH */}
        <section className="aura-study-left-col" aria-label="Active Flashcard Workspace">
          <div className="aura-study-card-container">
            <FlipCard
              card={currentCard}
              isFlipped={isFlipped}
              onFlip={(nextState) => setIsFlipped(nextState)}
              cardNumber={currentIndex + 1}
              totalCards={totalInDeck}
              showIndicators={true}
            />
          </div>

          {/* Action Row Underneath The Card: [←] [Skip] [I know this] [→] */}
          <div className="aura-study-card-actions-row">
            <button
              type="button"
              className="aura-btn-card-arrow"
              onClick={handlePrevCard}
              disabled={currentIndex === 0}
              aria-label="Previous card"
            >
              <span aria-hidden="true">←</span>
            </button>

            <button
              type="button"
              className="aura-btn-card-action is-learning"
              onClick={handleStillLearning}
              aria-label="Skip card"
            >
              <span className="aura-btn-card-icon desktop-only" aria-hidden="true">⚡</span>
              <div className="aura-btn-card-text">
                <span className="aura-btn-card-primary desktop-only">Still learning</span>
                <span className="aura-btn-card-primary mobile-only">Skip</span>
                <span className="aura-btn-card-secondary desktop-only">Review again</span>
              </div>
            </button>

            <button
              type="button"
              className="aura-btn-card-action is-mastered"
              onClick={handleKnowThis}
              aria-label="I know this card"
            >
              <span className="aura-btn-card-icon desktop-only" aria-hidden="true">✓</span>
              <div className="aura-btn-card-text">
                <span className="aura-btn-card-primary">I know this</span>
                <span className="aura-btn-card-secondary desktop-only">Mastered</span>
              </div>
            </button>

            <button
              type="button"
              className="aura-btn-card-arrow"
              onClick={handleNextCard}
              disabled={currentIndex === totalInDeck - 1}
              aria-label="Next card"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Mobile Bottom Utility Row: Quiz Mode and Shuffle */}
          <div className="mobile-study-bottom-tools">
            {onSwitchToQuiz && (
              <button
                type="button"
                className="mobile-btn-bottom-tool is-quiz"
                onClick={onSwitchToQuiz}
              >
                <span aria-hidden="true">⏱</span>
                <span>Quiz Mode</span>
              </button>
            )}

            <button
              type="button"
              className={`mobile-btn-bottom-tool is-shuffle ${isShuffled ? 'is-active' : ''}`}
              onClick={handleToggleShuffle}
              aria-pressed={isShuffled}
            >
              <span aria-hidden="true">🔀</span>
              <span>{isShuffled ? 'Shuffled' : 'Shuffle'}</span>
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: CARDS IN THIS DECK + KEYBOARD SHORTCUTS */}
        <aside className="aura-study-right-col" aria-label="Deck Overview and Shortcuts">
          <div className="aura-study-sidebar-panel">
            
            {/* Top: Cards in this deck list */}
            <div className="aura-deck-list-container">
              <div className="aura-deck-list-header">
                <span className="aura-deck-list-title">Cards in this deck</span>
                <span className="aura-deck-list-count">{sessionResults.length} / {totalInDeck} rated</span>
              </div>

              <div className="aura-deck-list-scroll">
                {deck.map((item, idx) => {
                  const isActive = idx === currentIndex;
                  const itemResult = sessionResults.find((r) => r.cardId === item.id)?.result;
                  const questionTitle = item.question || item.front || `Card ${idx + 1}`;

                  return (
                    <button
                      key={item.id || idx}
                      type="button"
                      className={`aura-deck-row-item ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setIsFlipped(false);
                      }}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <div className="aura-deck-row-left">
                        {!isActive && (
                          <span
                            className={`aura-deck-row-dot ${itemResult ? `is-${itemResult}` : 'is-unrated'}`}
                            aria-hidden="true"
                          >
                            ●
                          </span>
                        )}
                        <span className="aura-deck-row-text">{questionTitle}</span>
                      </div>
                      <span className="aura-deck-row-num">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom: Keyboard shortcuts */}
            <div className="aura-shortcuts-panel">
              <h3 className="aura-shortcuts-title">Keyboard shortcuts</h3>
              <div className="aura-shortcuts-grid-layout">
                <div className="aura-shortcut-pair">
                  <span className="aura-shortcut-label">Flip</span>
                  <kbd className="aura-keycap">Space</kbd>
                </div>
                <div className="aura-shortcut-pair">
                  <span className="aura-shortcut-label">Prev / Next</span>
                  <span className="aura-keycap-cluster">
                    <kbd className="aura-keycap">←</kbd>
                    <kbd className="aura-keycap">→</kbd>
                  </span>
                </div>
                <div className="aura-shortcut-pair">
                  <span className="aura-shortcut-label">Learning</span>
                  <kbd className="aura-keycap">1</kbd>
                </div>
                <div className="aura-shortcut-pair">
                  <span className="aura-shortcut-label">Mastered</span>
                  <kbd className="aura-keycap">2</kbd>
                </div>
                <div className="aura-shortcut-pair">
                  <span className="aura-shortcut-label">Exit</span>
                  <kbd className="aura-keycap">Esc</kbd>
                </div>
              </div>
            </div>

          </div>
        </aside>
      </main>

      {/* Mobile Bottom Drawer: Cards in this deck (view & jump to questions) */}
      {isDeckDrawerOpen && (
        <div
          className="mobile-deck-drawer-backdrop"
          onClick={() => setIsDeckDrawerOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Cards in this deck"
        >
          <div className="mobile-deck-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-deck-drawer-header">
              <div className="mobile-deck-drawer-title-wrap">
                <h3 className="mobile-deck-drawer-title">Cards in this deck</h3>
                <span className="mobile-deck-drawer-count">{sessionResults.length} / {totalInDeck} rated</span>
              </div>
              <button
                type="button"
                className="mobile-deck-drawer-close"
                onClick={() => setIsDeckDrawerOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mobile-deck-drawer-content">
              {deck.map((item, idx) => {
                const isActive = idx === currentIndex;
                const itemResult = sessionResults.find((r) => r.cardId === item.id)?.result;
                const questionTitle = item.question || item.front || `Card ${idx + 1}`;

                return (
                  <button
                    key={item.id || idx}
                    type="button"
                    className={`aura-deck-row-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsFlipped(false);
                      setIsDeckDrawerOpen(false);
                    }}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <div className="aura-deck-row-left">
                      {!isActive && (
                        <span
                          className={`aura-deck-row-dot ${itemResult ? `is-${itemResult}` : 'is-unrated'}`}
                          aria-hidden="true"
                        >
                          ●
                        </span>
                      )}
                      <span className="aura-deck-row-text">{questionTitle}</span>
                    </div>
                    <span className="aura-deck-row-num">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

