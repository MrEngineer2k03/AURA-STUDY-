import React, { useState, useEffect } from 'react';
import './Flashcards.css';

/**
 * EditFlashcardModal - Modal dialog for editing an existing flashcard
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether dialog is visible
 * @param {Object} props.card - The card data being edited
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onSave - (updatedCard) => void
 */
export default function EditFlashcardModal({
  isOpen,
  card,
  onClose,
  onSave,
}) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [lessonTag, setLessonTag] = useState('');
  const [status, setStatus] = useState('new');
  const [validationError, setValidationError] = useState('');

  // Populate form with card values when opened
  useEffect(() => {
    if (isOpen && card) {
      setQuestion(card.question || card.front || '');
      setAnswer(card.answer || card.back || '');
      setLessonTag(card.lessonTag || '');
      setStatus(card.status || 'new');
      setValidationError('');
    }
  }, [isOpen, card]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !card) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedQuestion = question.trim();
    const trimmedAnswer = answer.trim();

    if (!trimmedQuestion) {
      setValidationError('Question cannot be empty.');
      return;
    }

    if (!trimmedAnswer) {
      setValidationError('Answer cannot be empty.');
      return;
    }

    setValidationError('');
    onSave({
      ...card,
      question: trimmedQuestion,
      // keep front & back synced for backwards compatibility
      front: trimmedQuestion,
      answer: trimmedAnswer,
      back: trimmedAnswer,
      lessonTag: lessonTag.trim() || undefined,
      status,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div
      className="aura-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flashcard-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-flashcard-title"
      >
        <div className="modal-top-accent-laser" aria-hidden="true" />

        {/* Modal Header */}
        <div className="modal-header-section">
          <div className="modal-header-info">
            <div className="modal-eyebrow-tag">
              <span>/</span> MODIFY CARD
            </div>
            <h2 id="edit-flashcard-title" className="modal-headline-title">
              EDIT FLASHCARD
            </h2>
            <p className="modal-subtext">
              Update the question and answer for this flashcard.
            </p>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form-wrapper">
          <div className="modal-form-content">
            {validationError && (
              <div className="form-error-banner" role="alert">
                <span>⚠️</span>
                <span>{validationError}</span>
              </div>
            )}

            {/* Question Text Area */}
            <div className="form-field-item">
              <div className="form-field-label-row">
                <label htmlFor="edit-card-question" className="form-field-label">
                  Question <span className="form-field-required-star">*</span>
                </label>
                <span className="form-field-char-count">{question.length} chars</span>
              </div>
              <textarea
                id="edit-card-question"
                className="form-textarea"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  if (validationError) setValidationError('');
                }}
                rows={3}
                required
              />
            </div>

            {/* Answer Text Area */}
            <div className="form-field-item">
              <div className="form-field-label-row">
                <label htmlFor="edit-card-answer" className="form-field-label">
                  Answer <span className="form-field-required-star">*</span>
                </label>
                <span className="form-field-char-count">{answer.length} chars</span>
              </div>
              <textarea
                id="edit-card-answer"
                className="form-textarea"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  if (validationError) setValidationError('');
                }}
                rows={3}
                required
              />
            </div>

            {/* Status Level Selector */}
            <div className="form-field-item">
              <label className="form-field-label">Card Status</label>
              <div className="form-status-selector">
                <button
                  type="button"
                  className={`status-choice-btn ${status === 'new' ? 'is-selected' : ''}`}
                  onClick={() => setStatus('new')}
                >
                  ✦ New
                </button>
                <button
                  type="button"
                  className={`status-choice-btn ${status === 'learning' ? 'is-selected' : ''}`}
                  onClick={() => setStatus('learning')}
                >
                  ⚡ Learning
                </button>
                <button
                  type="button"
                  className={`status-choice-btn ${status === 'mastered' ? 'is-selected' : ''}`}
                  onClick={() => setStatus('mastered')}
                >
                  ✓ Mastered
                </button>
              </div>
            </div>

            {/* Lesson Tag / Topic */}
            <div className="form-field-item">
              <label htmlFor="edit-card-tag" className="form-field-label">
                Lesson / Topic Tag <span className="form-field-hint">(Optional)</span>
              </label>
              <input
                id="edit-card-tag"
                type="text"
                className="form-text-input"
                value={lessonTag}
                onChange={(e) => setLessonTag(e.target.value)}
                placeholder="e.g. Chapter 1, Key Concepts"
              />
            </div>
          </div>

          {/* Actions (Fixed at bottom of dialog) */}
          <div className="modal-actions-row">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={!question.trim() || !answer.trim()}
            >
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
