/**
 * FlashcardSourceSelector - Toggle between [Upload Lesson] and [Add Lesson Text]
 *
 * @param {Object} props
 * @param {string} props.activeSource - 'upload' | 'text'
 * @param {Function} props.onSelectSource - (sourceKey) => void
 */
export default function FlashcardSourceSelector({
  activeSource = 'text',
  onSelectSource,
}) {
  return (
    <div className="flashcard-source-selector">
      <div className="source-selector-label">
        <div className="source-eyebrow-row">
          <span className="source-step-prefix">SOURCE</span>
          <span className="source-material-chip">
            Material <span className="info-icon" title="Choose input material method">ℹ️</span>
          </span>
        </div>
        <span className="source-instruction">Create Flashcards From</span>
      </div>

      <div className="source-toggle-group">
        <button
          type="button"
          className={`source-toggle-btn ${activeSource === 'upload' ? 'is-active' : ''}`}
          onClick={() => onSelectSource('upload')}
        >
          <span className="toggle-icon">📄</span>
          <span className="toggle-label">Upload Lesson</span>
        </button>

        <button
          type="button"
          className={`source-toggle-btn ${activeSource === 'text' ? 'is-active' : ''}`}
          onClick={() => onSelectSource('text')}
        >
          <span className="toggle-icon">✨</span>
          <span className="toggle-label">Add Lesson Text</span>
        </button>
      </div>
    </div>
  );
}
