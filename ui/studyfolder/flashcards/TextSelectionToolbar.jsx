/**
 * TextSelectionToolbar - Floating contextual action button when text is highlighted
 * 
 * Shows:
 * ┌───────────────────────────┐
 * │ ⚡ Create Flashcard       │
 * │ From Selection: "Food"    │
 * └───────────────────────────┘
 * 
 * @param {Object} props
 * @param {Object} props.position - { top, left } in pixels relative to viewport/container
 * @param {string} props.selectedText - Text highlighted by the user
 * @param {Function} props.onClick - Click handler to create the card
 * @param {boolean} [props.isSentence=false] - Whether selection is multi-word / sentence
 */
export default function TextSelectionToolbar({
  position,
  selectedText,
  onClick,
  isSentence = false,
}) {
  if (!position || !selectedText) return null;

  // Truncate preview if very long
  const displayPreview =
    selectedText.length > 26
      ? `${selectedText.substring(0, 26)}...`
      : selectedText;

  return (
    <div
      className="text-selection-toolbar"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: 'translate(-50%, -100%)',
        zIndex: 50,
      }}
      onMouseDown={(e) => {
        // Prevent selection from clearing before click fires
        e.preventDefault();
      }}
    >
      <button
        type="button"
        className="btn-create-selection-card"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        title={`Create fill-in-the-blank flashcard for "${selectedText}"`}
      >
        <span className="btn-lightning-icon">⚡</span>
        <div className="btn-text-lines">
          <div className="btn-primary-line-row">
            <span className="btn-primary-line">Create Flashcard</span>
            <span className="selection-type-pill">
              {isSentence ? 'Sentence' : 'Word'}
            </span>
          </div>
          <span className="btn-secondary-line">
            From Selection: <em>"{displayPreview}"</em>
          </span>
        </div>
        <span className="btn-pointer-arrow" aria-hidden="true" />
      </button>
    </div>
  );
}
