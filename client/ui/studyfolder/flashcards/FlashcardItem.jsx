import { useState } from 'react';

/**
 * FlashcardItem - Individual reusable flashcard card in the Flashcard Editor
 *
 * @param {Object} props
 * @param {Object} props.card - { id, front, back, sourceType, selectedText }
 * @param {number} props.index - 0-based index
 * @param {Function} props.onEdit - (updatedCard) => void
 * @param {Function} props.onDelete - (cardId) => void
 */
export default function FlashcardItem({ card, index, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editFront, setEditFront] = useState(card.front);
  const [editBack, setEditBack] = useState(card.back);

  const cardNumber = String(index + 1).padStart(2, '0');
  const isHighlightSource = card.sourceType === 'highlight';

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editFront.trim() || !editBack.trim()) return;

    onEdit({
      ...card,
      front: editFront.trim(),
      back: editBack.trim(),
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditFront(card.front);
    setEditBack(card.back);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flashcard-item-box is-editing-mode">
        <div className="card-item-top">
          <span className="card-index-label">EDITING CARD #{cardNumber}</span>
        </div>
        <form onSubmit={handleSaveEdit} className="card-inline-edit-form">
          <div className="card-field-block">
            <label className="card-input-sublabel">Front (Question / Prompt)</label>
            <textarea
              className="card-edit-textarea"
              value={editFront}
              onChange={(e) => setEditFront(e.target.value)}
              rows={2}
              required
            />
          </div>
          <div className="card-field-block">
            <label className="card-input-sublabel">Back (Answer)</label>
            <input
              type="text"
              className="card-edit-input"
              value={editBack}
              onChange={(e) => setEditBack(e.target.value)}
              required
            />
          </div>
          <div className="card-edit-actions">
            <button
              type="button"
              className="btn-card-cancel"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-card-save"
            >
              Save Card
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flashcard-item-box">
      <div className="card-laser-accent" aria-hidden="true" />
      
      {/* Top Header of Card */}
      <div className="card-item-top">
        <div className="card-meta-left">
          <span className="card-index-label">CARD #{cardNumber}</span>
          <span className={`card-source-badge ${isHighlightSource ? 'is-highlight' : 'is-manual'}`}>
            {isHighlightSource ? '⚡ Text Highlight' : '✍️ Manual'}
          </span>
        </div>

        <div className="card-item-actions">
          <button
            type="button"
            className="card-btn-action"
            onClick={() => setIsEditing(true)}
            title="Edit Flashcard"
            aria-label={`Edit Card #${cardNumber}`}
          >
            <span className="action-icon">✏️</span> Edit
          </button>
          <button
            type="button"
            className="card-btn-action is-delete"
            onClick={() => onDelete(card.id)}
            title="Delete Flashcard"
            aria-label={`Delete Card #${cardNumber}`}
          >
            <span className="action-icon">🗑️</span> Delete
          </button>
        </div>
      </div>

      {/* Card Front Content */}
      <div className="card-front-display">
        <p className="card-prompt-text">{card.front}</p>
      </div>

      {/* Card Back / Hidden Answer */}
      <div className="card-back-display">
        <span className="answer-prefix">Answer:</span>
        <span className="answer-value-badge">{card.back}</span>
      </div>
    </div>
  );
}
