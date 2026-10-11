import { useState } from 'react';
import StudyFolderCard from './StudyFolderCard';
import './StudyFolders.css';

/**
 * StudyFolders - Main "MY STUDY FOLDERS" section for the AURA Dashboard
 *
 * @param {Object} props
 * @param {Array<Object>} [props.folders] - Array of study folder objects
 * @param {Function} [props.onSelectFolder] - Callback when a folder card is clicked
 * @param {Function} [props.onCreateFolder] - Callback when "Create New Folder" is clicked
 * @param {Function} [props.onViewAll] - Callback when "View all →" is clicked
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function StudyFolders({
  folders: controlledFolders,
  onSelectFolder,
  onCreateFolder,
  onViewAll,
  className = '',
}) {
  // Default study folders matching requirements
  const defaultStudyFolders = [
    {
      id: 1,
      title: 'Physics Midterms',
      progress: 82,
      lessons: 5,
      members: 3,
      color: 'red',
      battleReady: true,
      hasAiReviewer: true,
      lastStudied: 'Today',
    },
    {
      id: 2,
      title: 'Calculus Finals',
      progress: 43,
      lessons: 8,
      members: 1,
      color: 'blue',
      battleReady: false,
      hasAiReviewer: true,
      lastStudied: 'Yesterday',
    },
    {
      id: 3,
      title: 'Programming Exam',
      progress: 67,
      lessons: 6,
      members: 4,
      color: 'purple',
      battleReady: true,
      hasAiReviewer: false,
      lastStudied: '3d ago',
    },
  ];

  // If parent controls folders, use controlled; otherwise support local state
  const [internalFolders, setInternalFolders] = useState(defaultStudyFolders);
  const folders = controlledFolders !== undefined ? controlledFolders : internalFolders;

  const handleCardClick = (folder) => {
    if (onSelectFolder) {
      onSelectFolder(folder);
    } else {
      console.log(`[AURA] Selected folder: ${folder.title} (ID: ${folder.id})`);
    }
  };

  const handleCreateFolder = () => {
    if (onCreateFolder) {
      onCreateFolder();
    } else {
      setInternalFolders((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: `Folder #${prev.length + 1}`,
          progress: 0,
          lessons: 1,
          members: 1,
          color: 'green',
        },
      ]);
    }
  };

  const handleViewAll = (e) => {
    if (onViewAll) {
      e.preventDefault();
      onViewAll();
    } else {
      console.log('[AURA] Navigating to My Folders page');
    }
  };

  const hasFolders = Array.isArray(folders) && folders.length > 0;

  return (
    <div className={`study-folders-panel ${className}`}>
      {/* Subtle Red AURA Laser Accent Line at Top Edge */}
      <div className="study-folders-red-accent" aria-hidden="true" />

      {/* Subtle Red Diagonal Corner Accent at Top-Right */}
      <div className="study-folders-corner-accent" aria-hidden="true" />

      {/* SECTION HEADER ROW */}
      <div className="study-folders-header">
        <div className="study-folders-title-wrap">
          {/* Small crisp folder icon badge */}
          <div className="study-folders-title-icon" aria-hidden="true">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          </div>
          <h3 className="study-folders-title-text">MY STUDY FOLDERS</h3>
        </div>

        {/* View All Interactive Link / Button */}
        <a
          href="#folders"
          className="study-folders-view-all"
          onClick={handleViewAll}
          role="button"
          aria-label="View all study folders"
        >
          <span>View all</span>
          <span className="view-all-arrow">→</span>
        </a>
      </div>

      {/* CONTENT AREA: FOLDER GRID OR EMPTY STATE */}
      {hasFolders ? (
        <div className="study-folders-grid">
          {folders.map((folder) => (
            <StudyFolderCard
              key={folder.id}
              folder={folder}
              variant="compact"
              onClick={handleCardClick}
            />
          ))}

          {/* 4th Card: Create New Folder */}
          <StudyFolderCard
            isCreateCard
            variant="compact"
            onCreateFolder={handleCreateFolder}
          />
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="study-folders-empty-state">
          <div className="empty-state-icon-box">
            <svg
              width="28"
              height="28"
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
          <div className="empty-state-text-block">
            <h4 className="empty-state-headline">No study folders yet</h4>
            <p className="empty-state-subtext">
              Create your first folder and start studying.
            </p>
          </div>
          <button
            type="button"
            className="empty-state-create-btn"
            onClick={handleCreateFolder}
          >
            <span className="empty-plus-icon">+</span> Create Study Folder
          </button>
        </div>
      )}
    </div>
  );
}
