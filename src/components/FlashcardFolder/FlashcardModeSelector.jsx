import React, { useState, useMemo } from 'react';

/**
 * FlashcardModeSelector - Deck view and bottom actions matching Image 3 reference
 *
 * Implements:
 * 1. Main Deck Container:
 *    - Empty state (0 cards): Large dashed container with cyan document + icon,
 *      "No flashcards yet" headline, and subtitle.
 *    - Active state (> 0 cards): Sleek flashcard deck manager with status filter tabs,
 *      card items, quick flip preview, edit, duplicate, and delete actions.
 * 2. Bottom Action Bar:
 *    - Left Button: [ 🔒 Study ] (locked when 0 cards; unlocked and interactive when > 0 cards)
 *    - Right Button: [ + New flashcard ] (vibrant red primary action button)
 *
 * @param {Object} props
 * @param {Array<Object>} props.cards - List of cards in current folder
 * @param {number} props.cardCount - Total count of flashcards
 * @param {Function} props.onSelectReview - Trigger review workspace if needed
 * @param {Function} props.onSelectStudy - Trigger Study Mode
 * @param {Function} props.onCreateFirstCard - Open Create Flashcard modal
 * @param {Function} [props.onPreviewCard] - Open card preview modal
 * @param {Function} [props.onEditCard] - Open card edit modal
 * @param {Function} [props.onDeleteCard] - Delete a card
 * @param {Function} [props.onDuplicateCard] - Duplicate a card
 */
export default function FlashcardModeSelector({
  cards = [],
  cardCount = 0,
  onSelectReview,
  onSelectStudy,
  onCreateFirstCard,
  onPreviewCard,
  onEditCard,
  onDeleteCard,
  onDuplicateCard,
}) {
  const actualCount = cards.length || cardCount || 0;
  const hasFlashcards = actualCount > 0;

  // Active filter tab for non-empty deck: 'all' | 'learning' | 'mastered' | 'new'
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Counts for filters
  const counts = useMemo(() => {
    return {
      all: cards.length,
      learning: cards.filter((c) => c.status === 'learning').length,
      mastered: cards.filter((c) => c.status === 'mastered').length,
      new: cards.filter((c) => !c.status || c.status === 'new').length,
    };
  }, [cards]);

  // Filtered cards list
  const filteredCards = useMemo(() => {
    if (!hasFlashcards) return [];
    return cards.filter((card) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const questionMatch = (card.question || card.front || '').toLowerCase().includes(q);
        const answerMatch = (card.answer || card.back || '').toLowerCase().includes(q);
        if (!questionMatch && !answerMatch) return false;
      }
      if (activeFilter === 'learning') return card.status === 'learning';
      if (activeFilter === 'mastered') return card.status === 'mastered';
      if (activeFilter === 'new') return !card.status || card.status === 'new';
      return true;
    });
  }, [cards, hasFlashcards, activeFilter, searchQuery]);

  return (
    <div className="folder-deck-section-wrapper" role="region" aria-label="Deck Content and Actions">
      {/* ========================================================
          1. MAIN WORKSPACE / DECK AREA
          ======================================================== */}
      {!hasFlashcards ? (
        /* CASE A: EMPTY STATE MATCHING IMAGE 3 */
        <div
          className="folder-deck-empty-container"
          onClick={onCreateFirstCard}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onCreateFirstCard();
            }
          }}
          aria-label="No flashcards yet. Add your first question and answer to start building this deck."
        >
          {/* Centered Blue Icon Box with Sky-Blue Folded Page and Plus */}
          <div className="folder-deck-empty-icon-box" aria-hidden="true">
            <svg
              width="26"
              height="30"
              viewBox="0 0 24 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 2H14L20 8V24C20 25.1046 19.1046 26 18 26H4C2.89543 26 2 25.1046 2 24V4C2 2.89543 2.89543 2 4 2Z"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path
                d="M11 13V19M8 16H14"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h2 className="folder-deck-empty-title">No flashcards yet</h2>
          <p className="folder-deck-empty-desc">
            Add your first question and answer to start building this deck.
          </p>
        </div>
      ) : (
        /* CASE B: ACTIVE STATE WITH FLASHCARDS LIST */
        <div className="folder-deck-active-container">
          {/* Deck Filter Tabs & Search Header */}
          <div className="folder-deck-filter-bar">
            <div className="folder-deck-tabs-group" role="tablist">
              <button
                type="button"
                className={`folder-deck-tab-pill ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
                role="tab"
                aria-selected={activeFilter === 'all'}
              >
                All <span className="tab-pill-count">{counts.all}</span>
              </button>
              <button
                type="button"
                className={`folder-deck-tab-pill is-learning ${activeFilter === 'learning' ? 'active' : ''}`}
                onClick={() => setActiveFilter('learning')}
                role="tab"
                aria-selected={activeFilter === 'learning'}
              >
                Learning <span className="tab-pill-count">{counts.learning}</span>
              </button>
              <button
                type="button"
                className={`folder-deck-tab-pill is-mastered ${activeFilter === 'mastered' ? 'active' : ''}`}
                onClick={() => setActiveFilter('mastered')}
                role="tab"
                aria-selected={activeFilter === 'mastered'}
              >
                Mastered <span className="tab-pill-count">{counts.mastered}</span>
              </button>
            </div>

            {cards.length > 3 && (
              <div className="folder-deck-search-wrap">
                <input
                  type="text"
                  className="folder-deck-search-input"
                  placeholder="Search cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search flashcards"
                />
              </div>
            )}
          </div>

          {/* Cards Scrollable Stream */}
          <div className="folder-deck-cards-list">
            {filteredCards.map((card, idx) => {
              const question = card.question || card.front || 'Untitled Question';
              const answer = card.answer || card.back || 'No answer';
              const status = (card.status || 'new').toLowerCase();

              return (
                <div
                  key={card.id || `card-${idx}`}
                  className="folder-deck-card-item"
                  onClick={() => onPreviewCard && onPreviewCard(card, idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onPreviewCard && onPreviewCard(card, idx);
                    }
                  }}
                  aria-label={`Flashcard: ${question}`}
                >
                  <div className="folder-card-item-header">
                    <span className="folder-card-item-idx">#{idx + 1}</span>
                    <span className={`folder-card-status-chip is-${status}`}>
                      {status === 'mastered' ? '✓ Mastered' : status === 'learning' ? '⚡ Learning' : '✦ New'}
                    </span>
                  </div>

                  <div className="folder-card-item-q">{question}</div>
                  <div className="folder-card-item-a">{answer}</div>

                  <div className="folder-card-item-footer" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="folder-card-action-btn"
                      onClick={() => onPreviewCard && onPreviewCard(card, idx)}
                      title="Flip and preview card"
                    >
                      <span>👁 Preview</span>
                    </button>
                    {onEditCard && (
                      <button
                        type="button"
                        className="folder-card-action-btn"
                        onClick={() => onEditCard(card)}
                        title="Edit question & answer"
                      >
                        <span>✏️ Edit</span>
                      </button>
                    )}
                    {onDeleteCard && (
                      <button
                        type="button"
                        className="folder-card-action-btn is-delete"
                        onClick={() => onDeleteCard(card.id)}
                        title="Delete card"
                      >
                        <span>🗑️</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          2. BOTTOM ACTION BAR MATCHING IMAGE 3
          ======================================================== */}
      <div className="folder-deck-bottom-actions" role="toolbar" aria-label="Deck Actions">
        {/* Left Action: Study */}
        <button
          type="button"
          className={`btn-folder-study-action ${!hasFlashcards ? 'is-locked' : 'is-unlocked'}`}
          onClick={onSelectStudy}
          aria-label={!hasFlashcards ? 'Study deck locked - add flashcards first' : 'Start studying session'}
        >
          {!hasFlashcards ? (
            <>
              {/* Lock Icon */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Study</span>
            </>
          ) : (
            <>
              {/* Active Lightning / Flash Study Icon */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span>Study</span>
            </>
          )}
        </button>

        {/* Right Action: + New flashcard */}
        <button
          type="button"
          className="btn-folder-new-flashcard"
          onClick={onCreateFirstCard}
          aria-label="Add a new flashcard"
        >
          <span className="plus-sign" aria-hidden="true">+</span>
          <span>New flashcard</span>
        </button>
      </div>
    </div>
  );
}
