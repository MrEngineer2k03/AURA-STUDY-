/**
 * FinishFlashcardsModal - Confirmation dialog when completing flashcard creation
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {string} props.folderTitle - Title of study folder
 * @param {number} props.cardCount - Total number of cards created
 * @param {Function} props.onContinueEditing - Callback to dismiss modal and keep editing
 * @param {Function} props.onFinishAndSave - Callback to save flashcard set and return to folders
 */
export default function FinishFlashcardsModal({
  isOpen,
  folderTitle = 'Untitled Folder',
  cardCount = 0,
  onContinueEditing,
  onFinishAndSave,
}) {
  if (!isOpen) return null;

  return (
    <div className="aura-modal-overlay" onClick={onContinueEditing} role="presentation">
      <div
        className="aura-modal-dialog finish-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="finish-modal-title"
      >
        <div className="modal-laser-notch" aria-hidden="true" />

        <div className="finish-modal-content">
          <div className="finish-icon-wrap">
            <span className="finish-icon">🎉</span>
          </div>

          <h2 id="finish-modal-title" className="finish-modal-title">
            Finish Flashcard Set?
          </h2>

          <p className="finish-modal-subtext">
            You can continue editing or adding more cards to this folder at any time.
          </p>

          <div className="finish-summary-card">
            <div className="summary-row">
              <span className="summary-label">Target Folder:</span>
              <span className="summary-value folder-name">{folderTitle}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Study Method:</span>
              <span className="summary-value study-method">🗂 Flashcards</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Flashcards Created:</span>
              <span className="summary-value card-count">{cardCount} Cards</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Status:</span>
              <span className="summary-value status-ready">Ready for Study (New)</span>
            </div>
          </div>

          <div className="finish-actions-row">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onContinueEditing}
            >
              Continue Editing
            </button>
            <button
              type="button"
              className="btn-modal-submit btn-finish-save"
              onClick={onFinishAndSave}
            >
              <span>Finish & Save</span>
              <span className="modal-submit-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
