import React from 'react';
import FlashcardItem from './FlashcardItem';

/**
 * FlashcardList - Displays all flashcards belonging to the current folder
 *
 * @param {Object} props
 * @param {Array<Object>} props.cards - List of cards to display
 * @param {Function} props.onEditCard - (card) => void
 * @param {Function} props.onDeleteCard - (cardId) => void
 * @param {Function} props.onDuplicateCard - (card) => void
 * @param {Function} props.onPreviewCard - (card, index) => void
 * @param {Function} props.onCreateCard - Callback to open create card modal
 */
export default function FlashcardList({
  cards = [],
  onEditCard,
  onDeleteCard,
  onDuplicateCard,
  onPreviewCard,
  onCreateCard,
}) {
  if (cards.length === 0) {
    return (
      <div className="flashcards-empty-state" role="status">
        <div className="empty-state-icon">🗂</div>
        <h3 className="empty-state-title">NO FLASHCARDS YET</h3>
        <p className="empty-state-text">
          Add your first flashcard to start building your study collection.
        </p>
        <button
          type="button"
          className="btn-add-flashcard-primary"
          onClick={onCreateCard}
        >
          <span style={{ fontSize: '16px', fontWeight: 900 }}>+</span>
          <span>Create Flashcard</span>
        </button>
      </div>
    );
  }

  return (
    <div className="review-cards-list" role="feed" aria-label="Flashcards List">
      {cards.map((card, idx) => (
        <FlashcardItem
          key={card.id || `card-${idx}`}
          card={card}
          index={idx}
          onEdit={onEditCard}
          onDelete={onDeleteCard}
          onDuplicate={onDuplicateCard}
          onPreview={onPreviewCard}
        />
      ))}
    </div>
  );
}
