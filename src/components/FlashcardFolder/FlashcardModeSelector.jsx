import React from 'react';

/**
 * FlashcardModeSelector - The two large interactive options:
 *
 * When cards exist (cardCount > 0):
 * 1. [ REVIEW FLASHCARDS ] - Manage deck
 * 2. [ START STUDYING ] - Primary action in AURA red
 *
 * When folder has no flashcards (cardCount === 0):
 * 1. [ NO FLASHCARDS YET ] - Empty state with illustration and [+ CREATE YOUR FIRST FLASHCARD]
 * 2. [ YOUR STUDY DECK IS EMPTY ] - Locked study deck with illustration and [CREATE FLASHCARDS FIRST →]
 *
 * @param {Object} props
 * @param {number} props.cardCount - Total count of flashcards
 * @param {Function} props.onSelectReview - Trigger Review Mode
 * @param {Function} props.onSelectStudy - Trigger Study Mode
 * @param {Function} props.onCreateFirstCard - Open Create Flashcard interface
 */
export default function FlashcardModeSelector({
  cardCount = 0,
  onSelectReview,
  onSelectStudy,
  onCreateFirstCard,
}) {
  const hasFlashcards = cardCount > 0;

  // ==========================================
  // CASE 1: EMPTY STATE (cardCount === 0)
  // ==========================================
  if (!hasFlashcards) {
    return (
      <div className="folder-mode-options-grid" role="region" aria-label="Flashcard Actions - Empty State">
        {/* CARD 1: REVIEW FLASHCARDS – EMPTY STATE */}
        <div
          className="mode-option-card is-review is-empty-state"
          onClick={onCreateFirstCard}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (onCreateFirstCard) onCreateFirstCard();
            }
          }}
          aria-label="No flashcards yet. Create your first flashcard."
        >
          <div className="mode-option-card-accent" aria-hidden="true" />

          <div className="mode-option-top">
            <div className="mode-option-icon-box is-review" aria-hidden="true">
              {/* Folder document icon */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
              </svg>
            </div>
            <span className="mode-option-tag">EMPTY COLLECTION</span>
          </div>

          {/* Large visual illustration for empty flashcard collection */}
          <div className="mode-option-illustration-box" aria-hidden="true">
            <svg className="mode-empty-svg" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="32" fill="rgba(59, 130, 246, 0.08)" />
              {/* Background dashed silhouette */}
              <rect
                x="22"
                y="16"
                width="40"
                height="48"
                rx="8"
                stroke="rgba(96, 165, 250, 0.3)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                fill="rgba(14, 20, 36, 0.6)"
              />
              {/* Foreground card */}
              <rect
                x="18"
                y="20"
                width="44"
                height="48"
                rx="8"
                stroke="#60a5fa"
                strokeWidth="1.8"
                fill="#0d1424"
              />
              {/* Simulated lines on card */}
              <line x1="26" y1="30" x2="44" y2="30" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="2" strokeLinecap="round" />
              <line x1="26" y1="38" x2="54" y2="38" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="26" y1="44" x2="48" y2="44" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.8" strokeLinecap="round" />
              {/* Floating plus badge */}
              <circle cx="50" cy="54" r="10" fill="#2563eb" />
              <path d="M50 49v10M45 54h10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="mode-option-body">
            <h2 className="mode-option-title">NO FLASHCARDS YET</h2>
            <p className="mode-option-desc">
              You haven't created any flashcards in this folder. Start building your study collection by adding your first question and answer.
            </p>
          </div>

          <button
            type="button"
            className="btn-create-first-card-primary"
            onClick={(e) => {
              e.stopPropagation();
              if (onCreateFirstCard) onCreateFirstCard();
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 900 }}>+</span>
            <span>CREATE YOUR FIRST FLASHCARD</span>
          </button>
        </div>

        {/* CARD 2: START STUDYING – EMPTY STATE */}
        <div
          className="mode-option-card is-study is-empty-state"
          onClick={onCreateFirstCard}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (onCreateFirstCard) onCreateFirstCard();
            }
          }}
          aria-label="Your study deck is empty. Create flashcards first."
        >
          <div className="mode-option-card-accent" aria-hidden="true" />

          <div className="mode-option-top">
            <div className="mode-option-icon-box is-study" aria-hidden="true">
              {/* Graduation Cap / Deck icon */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
              </svg>
            </div>
            <span className="mode-option-tag">DECK LOCKED</span>
          </div>

          {/* Subtle empty deck illustration / stack of empty cards */}
          <div className="mode-option-illustration-box" aria-hidden="true">
            <svg className="mode-empty-svg" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="32" fill="rgba(255, 42, 68, 0.08)" />
              {/* Layer 3 - Back card angled */}
              <rect
                x="18"
                y="14"
                width="44"
                height="44"
                rx="8"
                stroke="rgba(255, 42, 68, 0.2)"
                strokeWidth="1.4"
                strokeDasharray="3 3"
                fill="rgba(20, 15, 24, 0.5)"
                transform="rotate(-6 40 36)"
              />
              {/* Layer 2 - Middle card angled */}
              <rect
                x="18"
                y="16"
                width="44"
                height="44"
                rx="8"
                stroke="rgba(255, 42, 68, 0.35)"
                strokeWidth="1.6"
                strokeDasharray="3 3"
                fill="rgba(20, 15, 24, 0.7)"
                transform="rotate(4 40 38)"
              />
              {/* Layer 1 - Front card */}
              <rect
                x="18"
                y="20"
                width="44"
                height="46"
                rx="8"
                stroke="#ff4d64"
                strokeWidth="1.8"
                fill="#120e18"
              />
              {/* Padlock / Locked symbol badge */}
              <circle cx="40" cy="43" r="11" fill="rgba(255, 42, 68, 0.16)" stroke="#ff4d64" strokeWidth="1.4" />
              <rect x="36" y="42" width="8" height="6" rx="1.5" fill="#ff4d64" />
              <path d="M37.5 42v-2a2.5 2.5 0 0 1 5 0v2" stroke="#ff4d64" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="mode-option-body">
            <h2 className="mode-option-title">YOUR STUDY DECK IS EMPTY</h2>
            <p className="mode-option-desc">
              Before you start studying, you need to create flashcards for this folder.
            </p>
          </div>

          <button
            type="button"
            className="btn-create-deck-first"
            onClick={(e) => {
              e.stopPropagation();
              if (onCreateFirstCard) onCreateFirstCard();
            }}
          >
            <span>CREATE FLASHCARDS FIRST</span>
            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // CASE 2: ACTIVE STATE (cardCount > 0)
  // ==========================================
  return (
    <div className="folder-mode-options-grid" role="region" aria-label="Flashcard Actions">
      {/* 1. REVIEW FLASHCARDS OPTION */}
      <div
        className="mode-option-card is-review"
        onClick={onSelectReview}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectReview();
          }
        }}
        aria-label="Review Flashcards - Manage your questions, edit answers, and add new flashcards"
      >
        <div className="mode-option-card-accent" aria-hidden="true" />

        <div className="mode-option-top">
          <div className="mode-option-icon-box is-review" aria-hidden="true">
            {/* Folder / Document icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          </div>
          <span className="mode-option-tag">DECK WORKSPACE</span>
        </div>

        <div className="mode-option-body">
          <h2 className="mode-option-title">REVIEW FLASHCARDS</h2>
          <p className="mode-option-desc">
            Manage your questions, edit answers, and add new flashcards.
          </p>
        </div>

        <div className="mode-option-action-btn">
          <span>Manage Flashcards</span>
          <span>→</span>
        </div>
      </div>

      {/* 2. START STUDYING OPTION (Primary action, AURA red) */}
      <div
        className="mode-option-card is-study"
        onClick={onSelectStudy}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectStudy();
          }
        }}
        aria-label="Start Studying - Test your knowledge and master your flashcards"
      >
        <div className="mode-option-card-accent" aria-hidden="true" />

        <div className="mode-option-top">
          <div className="mode-option-icon-box is-study" aria-hidden="true">
            {/* Graduation Cap / Book study icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
          <span className="mode-option-tag">AI QUIZ SESSION</span>
        </div>

        <div className="mode-option-body">
          <h2 className="mode-option-title">START STUDYING</h2>
          <p className="mode-option-desc">
            Test your knowledge and master your flashcards.
          </p>
        </div>

        <div className="mode-option-action-btn">
          <span>Start Studying Session</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}
