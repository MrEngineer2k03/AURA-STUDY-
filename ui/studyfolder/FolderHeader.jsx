/**
 * FolderHeader - Large page header with title, subtitle, and "+ Create Folder"
 *
 * @param {Object} props
 * @param {Function} props.onCreateFolder - Callback when "+ Create Folder" is clicked
 * @param {number} [props.folderCount=0] - Number of folders in view
 * @param {boolean} [props.isArchiveView=false] - Whether archive section is active
 * @param {Function} [props.onToggleArchive] - Callback to return to active folders from archive view
 * @param {number} [props.archivedCount=0] - Number of archived folders
 * @param {Function} [props.onRestoreAll] - Callback to restore all archived folders
 */
export default function FolderHeader({
  onCreateFolder,
  folderCount = 0,
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
          <h1 className="fph-title">ARCHIVED FOLDERS & FILES</h1>
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
    <div className="folders-page-header">
      <div className="fph-left">
        <div className="fph-eyebrow">
          <span className="red-slant-icon">/</span> STUDY LIBRARY
          {typeof folderCount === 'number' && (
            <span className="fph-count-chip">
              {folderCount} {folderCount === 1 ? 'Folder' : 'Folders'}
            </span>
          )}
        </div>
        <h1 className="fph-title">MY FOLDERS</h1>
        <p className="fph-subtitle">
          Organize your lessons, study materials, and battles.
        </p>
      </div>

      <div className="fph-right">
        {/* Primary Create Folder Button */}
        <button
          type="button"
          className="btn-create-folder-primary"
          onClick={onCreateFolder}
          aria-label="Create New Study Folder"
        >
          <span className="btn-plus-icon">+</span>
          <span>Create Folder</span>
        </button>
      </div>
    </div>
  );
}

