import React, { useState, useRef, useEffect } from 'react';

/**
 * FlashcardItem - Individual flashcard card component
 *
 * Supports:
 * - Card index badge (e.g. CARD 01)
 * - QUESTION label & natural wrapping question text
 * - Subtle divider
 * - Reveal Answer / Hide Answer accordion action
 * - Status indicator (New, Learning, Mastered)
 * - Three-dot action menu: Edit, Mark as Mastered, Delete
 *
 * @param {Object} props
 * @param {Object} props.card - Flashcard data object
 * @param {number} props.index - 0-based card index in deck
 * @param {Function} props.onEdit - (card) => void
 * @param {Function} props.onDelete - (cardId) => void
 * @param {Function} props.onToggleStatus - (card, newStatus) => void
 */
export default function FlashcardItem({
  card,
  index = 0,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close three-dot menu on click outside
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

  const handleEditClick = () => {
    setIsMenuOpen(false);
    if (onEdit) onEdit(card);
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    if (onDelete) onDelete(card.id);
  };

  const handleToggleMasteredClick = () => {
    setIsMenuOpen(false);
    if (onToggleStatus) {
      const nextStatus = status === 'mastered' ? 'learning' : 'mastered';
      onToggleStatus(card, nextStatus);
    }
  };

  return (
    <div className="flashcard-card-box">
      {/* Laser red top accent line */}
      <div className="flashcard-laser-line" aria-hidden="true" />

      {/* 1. TOP META ROW */}
      <div className="card-top-meta-row">
        <div className="card-meta-left-group">
          <span className="card-number-badge">{cardNumber}</span>

          {/* Status Badge */}
          {status === 'mastered' && (
            <span className="card-status-badge status-badge-mastered">
              ✓ Mastered
            </span>
          )}
          {status === 'learning' && (
            <span className="card-status-badge status-badge-learning">
              ⚡ Learning
            </span>
          )}
          {status === 'new' && (
            <span className="card-status-badge status-badge-new">
              ✦ New
            </span>
          )}

          {/* Optional Tag or Lesson Pill */}
          {card.lessonTag && (
            <span className="card-tag-pill" title={`Lesson: ${card.lessonTag}`}>
              {card.lessonTag}
            </span>
          )}
        </div>

        {/* Three-dot menu */}
        <div className="card-actions-wrapper" ref={menuRef}>
          <button
            type="button"
            className={`card-menu-trigger-btn ${isMenuOpen ? 'is-active' : ''}`}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label={`Actions for ${cardNumber}`}
            aria-haspopup="true"
            aria-expanded={isMenuOpen}
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div className="card-menu-dropdown" role="menu">
              <button
                type="button"
                className="dropdown-item-btn"
                onClick={handleEditClick}
                role="menuitem"
              >
                <span>✏️</span>
                <span>Edit</span>
              </button>
              <button
                type="button"
                className="dropdown-item-btn"
                onClick={handleToggleMasteredClick}
                role="menuitem"
              >
                <span>{status === 'mastered' ? '🔄' : '⭐'}</span>
                <span>{status === 'mastered' ? 'Mark as Learning' : 'Mark as Mastered'}</span>
              </button>
              <button
                type="button"
                className="dropdown-item-btn is-danger"
                onClick={handleDeleteClick}
                role="menuitem"
              >
                <span>🗑️</span>
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. QUESTION SECTION */}
      <div className="card-question-section">
        <div className="card-field-sublabel is-question">
          <span>QUESTION</span>
        </div>
        <p className="card-question-text">{questionText}</p>
      </div>

      {/* 3. VISUAL DIVIDER */}
      <div className="card-divider-line" aria-hidden="true" />

      {/* 4. ANSWER SECTION (COLLAPSIBLE / EXPANDABLE) */}
      <div className="card-answer-section">
        {!isAnswerRevealed ? (
          <button
            type="button"
            className="btn-reveal-answer"
            onClick={() => setIsAnswerRevealed(true)}
            aria-expanded="false"
          >
            <span>👁</span>
            <span>Reveal Answer</span>
          </button>
        ) : (
          <div className="card-revealed-answer-box">
            <div className="card-field-sublabel is-answer">
              <span>ANSWER</span>
            </div>
            <p className="card-answer-text">{answerText}</p>
            <button
              type="button"
              className="btn-hide-answer"
              onClick={() => setIsAnswerRevealed(false)}
              aria-expanded="true"
            >
              <span>✕</span>
              <span>Hide Answer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
