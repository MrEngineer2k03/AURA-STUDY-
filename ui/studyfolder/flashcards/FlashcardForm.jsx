import { useState } from 'react';

/**
 * FlashcardForm - Manual flashcard creation form
 * 
 * @param {Object} props
 * @param {Function} props.onSave - (cardData) => void
 * @param {Function} props.onCancel - () => void
 */
export default function FlashcardForm({ onSave, onCancel }) {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    onSave({
      front: front.trim(),
      back: back.trim(),
      sourceType: 'manual',
    });

    setFront('');
    setBack('');
  };

  return (
    <div className="manual-flashcard-form-card">
      <div className="form-card-header">
        <span className="form-title-badge">
          <span className="badge-plus">+</span> NEW MANUAL FLASHCARD
        </span>
        <button
          type="button"
          className="form-close-x"
          onClick={onCancel}
          aria-label="Cancel"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="manual-card-form">
        <div className="form-field-group">
          <label className="form-field-label" htmlFor="manual-front-input">
            Front <span className="field-hint">(Question, Concept or Prompt)</span>
          </label>
          <textarea
            id="manual-front-input"
            className="form-textarea-input"
            placeholder="e.g. What is the process plants use to convert light energy into chemical energy?"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            rows={2}
            autoFocus
            required
          />
        </div>

        <div className="form-field-group">
          <label className="form-field-label" htmlFor="manual-back-input">
            Back <span className="field-hint">(Answer or Definition)</span>
          </label>
          <input
            id="manual-back-input"
            type="text"
            className="form-text-input"
            placeholder="e.g. Photosynthesis"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            required
          />
        </div>

        <div className="form-actions-row">
          <button
            type="button"
            className="btn-cancel-manual"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-save-manual"
            disabled={!front.trim() || !back.trim()}
          >
            <span>Save Flashcard</span>
            <span className="btn-arrow">✓</span>
          </button>
        </div>
      </form>
    </div>
  );
}
