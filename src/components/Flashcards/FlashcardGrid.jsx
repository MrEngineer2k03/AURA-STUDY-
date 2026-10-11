import React from 'react';
import FlashcardItem from './FlashcardItem';

/**
 * FlashcardGrid - Responsive grid container for flashcard items with empty states
 *
 * @param {Object} props
 * @param {Array<Object>} props.cards - List of filtered & sorted cards to display
 * @param {number} props.totalFolderCards - Total cards in folder regardless of search/filter
 * @param {Function} props.onEditCard - (card) => void
 * @param {Function} props.onDeleteCard - (cardId) => void
 * @param {Function} props.onToggleStatus - (card, newStatus) => void
 * @param {Function} props.onCreateCard - () => void
 * @param {Function} props.onResetFilters - () => void
 */
export default function FlashcardGrid({
  cards = [],
  totalFolderCards = 0,
  onEditCard,
  onDeleteCard,
  onToggleStatus,
  onCreateCard,
  onResetFilters,
}) {
  const hasCards = cards.length > 0;
  const isCompletelyEmpty = totalFolderCards === 0;

  // Case 1: Folder has 0 cards created yet
  if (isCompletelyEmpty) {
    return (
      <div className="flashcards-list-section">
        <div className="flashcards-section-header">
          <div className="flashcards-section-title-wrap">
            <span className="section-icon-dot" aria-hidden="true" />
            <h3 className="flashcards-section-headline">YOUR FLASHCARDS</h3>
          </div>
          <span className="flashcards-section-count">0 Cards</span>
        </div>

        <div className="flashcards-empty-state-card">
          <div className="empty-state-orb" aria-hidden="true">
            <span>🗂</span>
          </div>
          <h4 className="empty-state-title">No flashcards yet</h4>
          <p className="empty-state-description">
            This study folder doesn't have any flashcards. Create your first flashcard with a question and answer to start studying.
          </p>
          <button
            type="button"
            className="btn-empty-state-create"
            onClick={onCreateCard}
          >
            <span>+</span>
            <span>Create Flashcard</span>
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Filter/Search returned 0 results
  if (!hasCards) {
    return (
      <div className="flashcards-list-section">
        <div className="flashcards-section-header">
          <div className="flashcards-section-title-wrap">
            <span className="section-icon-dot" aria-hidden="true" />
            <h3 className="flashcards-section-headline">YOUR FLASHCARDS</h3>
          </div>
          <span className="flashcards-section-count">0 of {totalFolderCards} Cards</span>
        </div>

        <div className="flashcards-empty-state-card">
          <div className="empty-state-orb" aria-hidden="true">
            <span>🔍</span>
          </div>
          <h4 className="empty-state-title">No matching flashcards</h4>
          <p className="empty-state-description">
            No cards found matching your search or active filter. Try resetting your filters to view all cards.
          </p>
          {onResetFilters && (
            <button
              type="button"
              className="btn-empty-state-create"
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    );
  }

  // Case 3: Display cards grid
  return (
    <div className="flashcards-list-section" role="region" aria-label="Your Flashcards">
      <div className="flashcards-section-header">
        <div className="flashcards-section-title-wrap">
          <span className="section-icon-dot" aria-hidden="true" />
          <h3 className="flashcards-section-headline">YOUR FLASHCARDS</h3>
        </div>
        <span className="flashcards-section-count">
          Showing {cards.length} of {totalFolderCards} {totalFolderCards === 1 ? 'Card' : 'Cards'}
        </span>
      </div>

      <div className="flashcards-grid">
        {cards.map((card, index) => (
          <FlashcardItem
            key={card.id || `card-${index}`}
            card={card}
            index={index}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onToggleStatus={onToggleStatus}
          />
        ))}

        {/* Trailing Add Card Grid Tile */}
        <button
          type="button"
          className="flashcard-create-placeholder-card"
          onClick={onCreateCard}
          aria-label="Add a new flashcard to this folder"
        >
          <div className="create-placeholder-plus-circle">
            <span>+</span>
          </div>
          <div className="create-placeholder-title">Create Flashcard</div>
          <div className="create-placeholder-sub">+ Add question & answer</div>
        </button>
      </div>
    </div>
  );
}
