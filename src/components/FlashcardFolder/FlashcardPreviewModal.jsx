import React, { useEffect } from 'react';

/**
 * FlashcardPreviewModal - Focused card preview dialog
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether dialog is open
 * @param {Object} props.card - Card data object
 * @param {number} props.index - Card index
 * @param {Function} props.onClose - Modal close handler
 */
export default function FlashcardPreviewModal({
  isOpen,
  card,
  index = 0,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  const cardNumber = `CARD ${String(index + 1).padStart(2, '0')}`;
  const questionText = card.question || card.front || 'Untitled Question';
  const answerText = card.answer || card.back || 'No answer provided.';
  const status = (card.status || 'new').toLowerCase();

  return (
    <div className="aura-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="flashcard-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-card-title"
        style={{ maxWidth: '640px' }}
      >
        <div className="modal-top-accent-laser" aria-hidden="true" />

        <div className="modal-header-section">
          <div className="modal-header-info">
            <div className="modal-eyebrow-tag">
              <span>👁</span> PREVIEW CARD
            </div>
            <h2 id="preview-card-title" className="modal-headline-title">
              {cardNumber}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onClose}
            aria-label="Close Preview"
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div className="review-card-label is-q">QUESTION</div>
            <p style={{ margin: '6px 0 0 0', fontSize: '18px', fontWeight: 600, color: '#ffffff', lineHeight: 1.45 }}>
              {questionText}
            </p>
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />

          <div>
            <div className="review-card-label is-a">ANSWER</div>
            <p style={{ margin: '6px 0 0 0', fontSize: '16px', color: '#cbd5e1', lineHeight: 1.5 }}>
              {answerText}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>Status:</span>
            <span className={`review-status-tag is-${status}`}>
              {status === 'mastered' ? '✓ Mastered' : status === 'learning' ? '⚡ Learning' : '✦ New'}
            </span>
            {card.lessonTag && (
              <span className="card-tag-pill" style={{ marginLeft: 'auto' }}>
                {card.lessonTag}
              </span>
            )}
          </div>
        </div>

        <div className="modal-actions-row" style={{ padding: '16px 28px' }}>
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
            style={{ width: '100%' }}
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
