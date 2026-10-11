import { useState, useRef } from 'react';

/**
 * StudyTypeModal - Step 2: "How do you want to study?"
 * 
 * Displays study type options for the newly created study folder.
 * Desktop: 3 equal, full-sized balanced cards.
 * Mobile: Horizontal swipeable cards carousel (no vertical scrolling needed to choose mode).
 * 1. FLASHCARDS (Active)
 * 2. AI REVIEWER (Upcoming)
 * 3. QUIZ BATTLE (Upcoming)
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is displayed
 * @param {Object} props.folder - The folder being set up
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onSelectType - Callback (studyType, folder) => void
 */
export default function StudyTypeModal({
  isOpen,
  folder,
  onClose,
  onSelectType,
}) {
  const [hoveredType, setHoveredType] = useState('flashcards');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const cardsGridRef = useRef(null);

  if (!isOpen || !folder) return null;

  const handleStartFlashcards = () => {
    onSelectType('flashcards', folder);
  };

  const handleCardsScroll = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    const cardEl = el.firstElementChild;
    const cardWidth = cardEl ? cardEl.offsetWidth + 12 : 260;
    const index = Math.round(el.scrollLeft / cardWidth);
    const clamped = Math.min(Math.max(index, 0), 2);
    if (clamped !== activeCardIndex) {
      setActiveCardIndex(clamped);
      if (clamped === 0) setHoveredType('flashcards');
      else if (clamped === 1) setHoveredType('ai');
      else if (clamped === 2) setHoveredType('quiz');
    }
  };

  const scrollToCard = (index) => {
    if (cardsGridRef.current) {
      const cards = cardsGridRef.current.children;
      if (cards[index]) {
        cards[index].scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
        setActiveCardIndex(index);
        if (index === 0) setHoveredType('flashcards');
        else if (index === 1) setHoveredType('ai');
        else if (index === 2) setHoveredType('quiz');
      }
    }
  };

  return (
    <div className="aura-modal-overlay study-type-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="aura-modal-dialog study-type-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="study-type-title"
      >
        {/* Top Laser Accent */}
        <div className="modal-laser-notch" aria-hidden="true" />

        {/* Modal Header */}
        <div className="modal-header study-type-header">
          <div>
            <div className="modal-badge-tag">
              <span className="red-slant-icon">/</span> STEP 2 · STUDY METHOD
            </div>
            <h2 id="study-type-title" className="modal-headline">
              How do you want to study?
            </h2>
            <p className="study-type-subtitle">
              Choose a study method to start learning this folder.
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Target Folder Context Bar */}
        <div className="study-type-target-folder">
          <span className="target-folder-icon">📁</span>
          <span className="target-folder-title">{folder.title}</span>
          <span className="target-folder-dot">·</span>
          <span className="target-folder-dept">{folder.department || 'General'}</span>
          {folder.lessons > 0 && (
            <>
              <span className="target-folder-dot">·</span>
              <span className="target-folder-lessons">{folder.lessons} Source File</span>
            </>
          )}
        </div>

        {/* STUDY TYPE CARDS CONTAINER (3 COLUMNS ON DESKTOP, HORIZONTAL SWIPEABLE CAROUSEL ON MOBILE) */}
        <div className="study-type-cards-wrapper">
          <div
            ref={cardsGridRef}
            className="study-type-cards-grid"
            onScroll={handleCardsScroll}
          >
            {/* 1. FLASHCARDS (ACTIVE & PROMINENT) */}
            <div
              className={`study-type-card active-method ${hoveredType === 'flashcards' || activeCardIndex === 0 ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredType('flashcards')}
              onClick={() => {
                scrollToCard(0);
                handleStartFlashcards();
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStartFlashcards();
                }
              }}
            >
              <div className="study-card-glow-halo glow-red" aria-hidden="true" />
              <div className="study-card-laser-notch notch-red" aria-hidden="true" />

              <div className="study-card-center-icon">
                <div className="large-icon-wrapper halo-red">
                  <span className="icon-emoji">🗂</span>
                  <span className="icon-sparkle">✦</span>
                </div>
              </div>

              <div className="study-card-info">
                <h3 className="study-card-title">FLASHCARDS</h3>
                <p className="study-card-desc">
                  Turn important concepts into quick review cards. Highlight key terms or build custom decks.
                </p>
              </div>

              <div className="study-card-action-wrap">
                <button
                  type="button"
                  className="study-card-start-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartFlashcards();
                  }}
                >
                  <span>Start</span>
                  <span className="btn-arrow-icon">→</span>
                </button>
              </div>
            </div>

            {/* 2. AI REVIEWER (BALANCED EQUAL SIZE) */}
            <div
              className={`study-type-card preview-method theme-ai ${hoveredType === 'ai' || activeCardIndex === 1 ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredType('ai')}
              onClick={() => scrollToCard(1)}
            >
              <div className="study-card-glow-halo glow-purple" aria-hidden="true" />
              <div className="study-card-laser-notch notch-purple" aria-hidden="true" />

              <div className="study-card-center-icon">
                <div className="large-icon-wrapper halo-purple">
                  <span className="icon-emoji">🤖</span>
                  <span className="icon-sparkle sparkle-purple">⚡</span>
                </div>
              </div>

              <div className="study-card-info">
                <h3 className="study-card-title">AI REVIEWER</h3>
                <p className="study-card-desc">
                  Automated comprehensive summary sheets, key equations, and generated study guides.
                </p>
              </div>

              <div className="study-card-action-wrap">
                <button
                  type="button"
                  className="study-card-locked-btn"
                  disabled
                >
                  <span>🔒 Level 15 Required</span>
                </button>
              </div>
            </div>

            {/* 3. QUIZ BATTLE (BALANCED EQUAL SIZE) */}
            <div
              className={`study-type-card preview-method theme-pvp ${hoveredType === 'quiz' || activeCardIndex === 2 ? 'is-hovered' : ''}`}
              onMouseEnter={() => setHoveredType('quiz')}
              onClick={() => scrollToCard(2)}
            >
              <div className="study-card-glow-halo glow-gold" aria-hidden="true" />
              <div className="study-card-laser-notch notch-gold" aria-hidden="true" />

              <div className="study-card-center-icon">
                <div className="large-icon-wrapper halo-gold">
                  <span className="icon-emoji">⚔️</span>
                  <span className="icon-sparkle sparkle-gold">🏆</span>
                </div>
              </div>

              <div className="study-card-info">
                <h3 className="study-card-title">QUIZ BATTLE</h3>
                <p className="study-card-desc">
                  Challenge friends to real-time duel quizzes generated from your uploaded lesson content.
                </p>
              </div>

              <div className="study-card-action-wrap">
                <button
                  type="button"
                  className="study-card-locked-btn"
                  disabled
                >
                  <span>🔒 Season 2 Module</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Edge Fade Cue for Mobile Swipeability */}
          <div
            className={`study-cards-fade-right ${activeCardIndex === 2 ? 'is-hidden' : ''}`}
            aria-hidden="true"
          />
        </div>

        {/* Mobile Swipe Pagination Indicator Dots */}
        <div className="study-type-carousel-dots" role="tablist" aria-label="Study modes pagination">
          <button
            type="button"
            role="tab"
            aria-selected={activeCardIndex === 0}
            className={`carousel-dot ${activeCardIndex === 0 ? 'active' : ''} dot-flashcards`}
            onClick={() => scrollToCard(0)}
            aria-label="Flashcards mode (Active)"
          />
          <button
            type="button"
            role="tab"
            aria-selected={activeCardIndex === 1}
            className={`carousel-dot ${activeCardIndex === 1 ? 'active' : ''} dot-ai`}
            onClick={() => scrollToCard(1)}
            aria-label="AI Reviewer mode"
          />
          <button
            type="button"
            role="tab"
            aria-selected={activeCardIndex === 2}
            className={`carousel-dot ${activeCardIndex === 2 ? 'active' : ''} dot-quiz`}
            onClick={() => scrollToCard(2)}
            aria-label="Quiz Battle mode"
          />
        </div>

        {/* Modal Bottom Actions */}
        <div className="modal-actions-footer study-type-footer">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
          >
            Decide Later
          </button>
          <button
            type="button"
            className="btn-modal-submit"
            onClick={handleStartFlashcards}
          >
            <span>Start with Flashcards</span>
            <span className="modal-submit-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
