import React from 'react';

/**
 * FolderHeader - Clean, student-friendly top header for My Folders
 * Matches reference design:
 * - Title: "My Folders"
 * - Subtitle: "[Count] folders. Last studied: [Last Studied Folder]."
 * - Top-right button: "+ New folder" (coral/red)
 *
 * @param {Object} props
 * @param {Function} props.onCreateFolder - Callback when "+ New folder" is clicked
 * @param {number} [props.folderCount=0] - Number of active folders
 * @param {string} [props.lastStudiedName='Business Strategy'] - Title of the last studied folder
 * @param {boolean} [props.isArchiveView=false] - Whether archive vault is active
 * @param {Function} [props.onToggleArchive] - Toggle archive view
 * @param {number} [props.archivedCount=0] - Number of archived folders
 * @param {Function} [props.onRestoreAll] - Callback to restore all archived folders
 */
export default function FolderHeader({
  onCreateFolder,
  folderCount = 6,
  lastStudiedName = 'Business Strategy',
  isArchiveView = false,
  onToggleArchive,
  archivedCount = 0,
  onRestoreAll,
}) {
  if (isArchiveView) {
    return (
      <div className="folders-page-header is-archive-header">
        <div className="fph-left">
          <div className="fph-eyebrow">
            <span className="gold-slant-icon">📦</span> ARCHIVE VAULT
            <span className="fph-count-chip is-archive-chip">
              {archivedCount} {archivedCount === 1 ? 'Folder' : 'Folders'} Archived
            </span>
          </div>
          <h1 className="fph-title">Archived Folders & Files</h1>
          <p className="fph-subtitle">
            Safely preserved study units and materials. Restore any item back to your active library at any time.
          </p>
        </div>

        <div className="fph-right">
          {archivedCount > 0 && onRestoreAll && (
            <button
              type="button"
              className="btn-restore-all-header"
              onClick={onRestoreAll}
              title="Restore all archived folders back to active library"
            >
              <span>♻️ Restore All</span>
            </button>
          )}

          <button
            type="button"
            className="btn-back-to-folders"
            onClick={onToggleArchive}
            aria-label="Return to Active Folders"
          >
            <span className="btn-back-arrow">←</span>
            <span>Back to My Folders</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="folders-redesign-header">
      <div className="frh-left">
        <h1 className="frh-title">My Folders</h1>
        <p className="frh-subtitle">
          {folderCount} {folderCount === 1 ? 'folder' : 'folders'}.
          {lastStudiedName ? ` Last studied: ${lastStudiedName}.` : ''}
        </p>
      </div>

      <div className="frh-right">
        <button
          type="button"
          className="btn-frh-new-folder"
          onClick={onCreateFolder}
          aria-label="Create new study folder"
        >
          <span className="frh-plus-icon" aria-hidden="true">+</span>
          <span>New folder</span>
        </button>
      </div>
    </div>
  );
}
