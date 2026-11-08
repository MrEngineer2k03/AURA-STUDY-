import React, { useEffect } from 'react';
import { FlipCard } from '../Flipcards';

/**
 * FlashcardPreviewModal - Focused card preview dialog with Interactive 3D Flip Card
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

  return (
    <div className="aura-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="flashcard-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-card-title"
        style={{ maxWidth: '640px', padding: '0', background: 'transparent', border: 'none', boxShadow: 'none' }}
      >
        <div style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#ff8fa3', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              ✦ Interactive Preview · {cardNumber}
            </span>
          </div>
          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onClose}
            aria-label="Close Preview"
            style={{ width: '32px', height: '32px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '50%', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✕
          </button>
        </div>

        {/* Interactive 3D Flip Card */}
        <FlipCard
          card={card}
          cardNumber={index + 1}
          showIndicators={true}
        />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
            style={{ minWidth: '160px' }}
          >
            Done Previewing
          </button>
        </div>
      </div>
    </div>
  );
}
