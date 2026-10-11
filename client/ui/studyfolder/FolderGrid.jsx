import StudyFolderCard from './StudyFolderCard';
import CreateFolderCard from './CreateFolderCard';

/**
 * FolderGrid - Responsive grid container for study folders with empty state handling
 *
 * @param {Object} props
 * @param {Array<Object>} props.folders - List of folder objects
 * @param {Function} props.onCreateFolder - Create folder trigger
 * @param {Function} props.onOpenFolder - Open folder trigger
 * @param {Function} props.onStudyFolder - Study folder trigger
 * @param {Function} props.onFolderAction - Three-dot menu action trigger
 */
export default function FolderGrid({
  folders = [],
  onCreateFolder,
  onOpenFolder,
  onStudyFolder,
  onFolderAction,
}) {
  const hasFolders = folders.length > 0;

  if (!hasFolders) {
    return (
      <div className="folders-empty-stage">
        <div className="empty-hologram-box">
          <div className="empty-hologram-glow" aria-hidden="true" />
          <svg
            className="empty-hologram-icon"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        </div>

        <h3 className="empty-headline">No study folders yet</h3>
        <p className="empty-description">
          Create your first study folder and start your AURA journey.
        </p>

        <button
          type="button"
          className="btn-create-first-folder"
          onClick={onCreateFolder}
        >
          <span className="btn-plus-symbol">+</span> Create Your First Folder
        </button>
      </div>
    );
  }

  return (
    <div className="my-folders-grid" role="region" aria-label="Study Folders Grid">
      {folders.map((folder, index) => (
        <div
          key={folder.id}
          className="folder-grid-item-wrap"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <StudyFolderCard
            folder={folder}
            variant="detailed"
            onClick={onOpenFolder}
            onOpen={onOpenFolder}
            onStudy={onStudyFolder}
            onAction={onFolderAction}
          />
        </div>
      ))}

      {/* Trailing Create Folder Card */}
      <div
        id="create-folder-card-section"
        className="folder-grid-item-wrap"
        style={{ animationDelay: `${folders.length * 60}ms` }}
      >
        <CreateFolderCard onCreateFolder={onCreateFolder} />
      </div>
    </div>
  );
}
