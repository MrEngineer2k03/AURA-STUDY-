/**
 * CreateFolderCard - Dashed interactive card for creating a new study folder
 *
 * @param {Object} props
 * @param {Function} props.onCreateFolder - Callback when card is clicked
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function CreateFolderCard({ onCreateFolder, className = '', id = 'create-folder-card' }) {
  return (
    <button
      id={id}
      type="button"
      className={`create-folder-grid-card ${className}`}
      onClick={onCreateFolder}
      aria-label="Create New Study Folder"
    >
      <div className="cfg-cyber-bracket" aria-hidden="true" />
      <div className="cfg-inner-content">
        <div className="cfg-plus-circle" aria-hidden="true">
          <svg
            className="cfg-plus-svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <h3 className="cfg-title">Create New Folder</h3>
        <p className="cfg-description">Add lessons and start studying</p>
        <span className="cfg-action-tag">+ Add Deck</span>
      </div>
    </button>
  );
}
