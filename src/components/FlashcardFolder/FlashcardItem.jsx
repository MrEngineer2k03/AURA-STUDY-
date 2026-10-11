import React, { useState, useRef, useEffect } from 'react';

/**
 * FlashcardItem - Card representation in Review Mode list
 *
 * Displays:
 * - Card number (CARD 01)
 * - Status badge (New / Learning / Mastered)
 * - QUESTION block
 * - ANSWER block
 * - Three-dot menu: Edit, Delete, Duplicate, Preview
 *
 * @param {Object} props
 * @param {Object} props.card - Flashcard data
 * @param {number} props.index - 0-based card index
 * @param {Function} props.onEdit - (card) => void
 * @param {Function} props.onDelete - (cardId) => void
 * @param {Function} props.onDuplicate - (card) => void
 * @param {Function} props.onPreview - (card, index) => void
 */
export default function FlashcardItem({
  card,
  index = 0,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isMenuOpen]);

  const cardNumber = `CARD ${String(index + 1).padStart(2, '0')}`;
  const questionText = card.question || card.front || 'Untitled Question';
  const answerText = card.answer || card.back || 'No answer provided.';
  const status = (card.status || 'new').toLowerCase();

  return (
    <div className="review-card-item">
      {/* 1. TOP META ROW */}
      <div className="review-card-meta-row">
        <div className="review-card-meta-left">
          <span className="review-card-number">{cardNumber}</span>

          {status === 'mastered' && (
            <span className="review-status-tag is-mastered">✓ Mastered</span>
          )}
          {status === 'learning' && (
            <span className="review-status-tag is-learning">⚡ Learning</span>
          )}
          {status === 'new' && (
            <span className="review-status-tag is-new">✦ New</span>
          )}

          {card.lessonTag && (
            <span
              style={{
                fontSize: '11px',
                color: '#94a3b8',
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              {card.lessonTag}
            </span>
          )}
        </div>

        {/* 2. THREE-DOT ACTION MENU */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            type="button"
            className="review-card-menu-btn"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={`Options for ${cardNumber}`}
            aria-expanded={isMenuOpen}
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div className="review-card-dropdown" role="menu">
              <button
                type="button"
                className="review-dropdown-btn"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onPreview) onPreview(card, index);
                }}
                role="menuitem"
              >
                <span>👁️</span>
                <span>Preview</span>
              </button>

              <button
                type="button"
                className="review-dropdown-btn"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onEdit) onEdit(card);
                }}
                role="menuitem"
              >
                <span>✏️</span>
                <span>Edit</span>
              </button>

              <button
                type="button"
                className="review-dropdown-btn"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onDuplicate) onDuplicate(card);
                }}
                role="menuitem"
              >
                <span>📑</span>
                <span>Duplicate</span>
              </button>

              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 0' }} />

              <button
                type="button"
                className="review-dropdown-btn is-danger"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onDelete) onDelete(card.id);
                }}
                role="menuitem"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. QUESTION BLOCK */}
      <div className="review-card-block">
        <div className="review-card-label is-q">QUESTION:</div>
        <p className="review-card-text">{questionText}</p>
      </div>

      {/* 3. ANSWER BLOCK */}
      <div className="review-card-block" style={{ marginBottom: 0 }}>
        <div className="review-card-label is-a">ANSWER:</div>
        <p className="review-card-text is-answer-text">{answerText}</p>
      </div>
    </div>
  );
}
