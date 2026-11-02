import React, { useEffect, useState } from 'react';
import StudyFolderCard from './StudyFolderCard';
import CreateFolderCard from './CreateFolderCard';
import FolderListRow from './FolderListRow';
import MobileFolderCard from './MobileFolderCard';

const MOBILE_QUERY = '(max-width: 768px)';

/** Tracks whether the viewport is mobile-sized (matches the CSS mobile breakpoint). */
function useIsMobile() {
  const getMatch = () =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia(MOBILE_QUERY).matches
      : false;

  const [isMobile, setIsMobile] = useState(getMatch);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, []);

  return isMobile;
}

/**
 * FolderGrid - 4-Column Responsive Grid & List Container for My Folders
 * Matches reference design (media_1793596234655_f4b8a921.jpg)
 *
 * @param {Object} props
 * @param {Array<Object>} props.folders - List of folder objects
 * @param {string} [props.viewMode='grid'] - 'grid' | 'list'
 * @param {Function} props.onCreateFolder - Create folder trigger
 * @param {Function} props.onOpenFolder - Open folder trigger
 * @param {Function} props.onStudyFolder - Study folder trigger
 * @param {Function} props.onFolderAction - Action menu trigger
 */
export default function FolderGrid({
  folders = [],
  viewMode = 'grid',
  onCreateFolder,
  onOpenFolder,
  onStudyFolder,
  onFolderAction,
}) {
  const visibleFolders = folders.filter(
    (folder) => !folder.isArchived && folder.status?.toLowerCase() !== 'archived'
  );
  const hasFolders = visibleFolders.length > 0;
  const isMobile = useIsMobile();
  const isMobileGrid = isMobile && viewMode === 'grid';

  if (!hasFolders) {
    return (
      <div className="folders-empty-stage">
        <div className="empty-hologram-box">
          <svg
            className="empty-hologram-icon"
            width="44"
            height="44"
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

        <h3 className="empty-headline">No study folders found</h3>
        <p className="empty-description">
          Try adjusting your search or filters, or create a new folder.
        </p>

        <button
          type="button"
          className="btn-create-first-folder"
          onClick={onCreateFolder}
        >
          <span className="btn-plus-symbol">+</span> Create New Folder
        </button>
      </div>
    );
  }

  // MOBILE GRID VIEW – compact two-column folder library
  if (isMobileGrid) {
    return (
      <div className="mobile-folder-grid" role="region" aria-label="Study Folders Grid">
        {visibleFolders.map((folder, index) => (
          <div
            key={folder.id}
            className="mobile-folder-grid-item"
            style={{ animationDelay: `${index * 40}ms` }}
          >
            <MobileFolderCard
              folder={folder}
              onOpen={onOpenFolder}
              onStudy={onStudyFolder}
              onAction={onFolderAction}
            />
          </div>
        ))}

        <div className="mobile-folder-grid-item">
          <button
            type="button"
            className="mobile-create-folder-card"
            onClick={onCreateFolder}
            aria-label="Create new study folder"
          >
            <span className="mcfc-plus" aria-hidden="true">+</span>
            <span className="mcfc-title">New folder</span>
            <span className="mcfc-sub">Add lessons</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`student-folders-container layout-${viewMode}`}
      role="region"
      aria-label={viewMode === 'list' ? 'Study Folders List' : 'Study Folders Grid'}
    >
      {visibleFolders.map((folder, index) => (
        <div
          key={folder.id}
          className="student-grid-item"
          style={{ animationDelay: `${index * 40}ms` }}
        >
          {viewMode === 'list' ? (
            <FolderListRow
              folder={folder}
              onClick={onOpenFolder}
              onOpen={onOpenFolder}
              onStudy={onStudyFolder}
              onAction={onFolderAction}
            />
          ) : (
            <StudyFolderCard
              folder={folder}
              onClick={onOpenFolder}
              onOpen={onOpenFolder}
              onStudy={onStudyFolder}
              onAction={onFolderAction}
            />
          )}
        </div>
      ))}

      {/* Trailing Create Folder Card (shown in grid view) */}
      {viewMode === 'grid' && (
        <div
          id="create-folder-card-section"
          className="student-grid-item"
          style={{ animationDelay: `${visibleFolders.length * 40}ms` }}
        >
          <CreateFolderCard onCreateFolder={onCreateFolder} />
        </div>
      )}
    </div>
  );
}
