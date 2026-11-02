import React from 'react';

/**
 * CreateFolderCard - Student-friendly "Create new folder" card
 * Matches Card 7 in reference design:
 * - Dashed border with subtle hover response
 * - Centered circular plus icon
 * - Title: "Create new folder"
 * - Subtitle: "Add lessons and start studying"
 *
 * @param {Object} props
 * @param {Function} props.onCreateFolder - Callback when card is clicked
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function CreateFolderCard({
  onCreateFolder,
  className = '',
  id = 'create-folder-card',
}) {
  return (
    <button
      id={id}
      type="button"
      className={`student-create-folder-card ${className}`}
      onClick={onCreateFolder}
      aria-label="Create new study folder"
    >
      <div className="scfc-inner">
        <div className="scfc-plus-circle" aria-hidden="true">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>

        <h3 className="scfc-title">Create new folder</h3>
        <p className="scfc-subtitle">Add lessons and start studying</p>
      </div>
    </button>
  );
}
