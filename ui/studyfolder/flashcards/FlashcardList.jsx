import { useState } from 'react';
import FlashcardItem from './FlashcardItem';
import FlashcardForm from './FlashcardForm';

/**
 * FlashcardList - Collection list of created flashcards
 *
 * @param {Object} props
 * @param {Array} props.cards - List of flashcard objects
 * @param {Function} props.onEditCard - (updatedCard) => void
 * @param {Function} props.onDeleteCard - (cardId) => void
 * @param {Function} props.onAddCard - (cardData) => void
 */
export default function FlashcardList({
  cards = [],
  onEditCard,
  onDeleteCard,
  onAddCard,
}) {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSaveNewCard = (cardData) => {
    onAddCard(cardData);
    setShowAddForm(false);
  };

  return (
    <div className="flashcard-list-container">
      {/* Top Header Row of Collection */}
      <div className="flashcard-list-header">
        <div className="list-title-wrap">
          <span className="list-icon">📁</span>
          <h3 className="list-title-text">FLASHCARDS</h3>
          <span className="card-count-pill">{cards.length} {cards.length === 1 ? 'Card' : 'Cards'}</span>
        </div>

        {!showAddForm && (
          <button
            type="button"
            className="btn-open-add-card"
            onClick={() => setShowAddForm(true)}
          >
            <span className="plus-symbol">+</span> Add Flashcard
          </button>
        )}
      </div>

      {/* Manual Card Form (If opened) */}
      {showAddForm && (
        <FlashcardForm
          onSave={handleSaveNewCard}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Cards List or Empty State */}
      {cards.length > 0 ? (
        <div className="flashcard-scroll-list">
          {cards.map((card, idx) => (
            <FlashcardItem
              key={card.id || `card-${idx}`}
              card={card}
              index={idx}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
            />
          ))}
        </div>
      ) : (
        <div className="flashcards-empty-card">
          <div className="empty-pulse-orb">
            <span className="empty-orb-icon">✦</span>
          </div>
          <h4 className="empty-state-title">No flashcards yet</h4>
          <p className="empty-state-guide">
            Highlight any word or phrase from the lesson above to generate fill-in-the-blank cards, or click <strong>+ Add Flashcard</strong> to create one manually.
          </p>
        </div>
      )}
    </div>
  );
}
