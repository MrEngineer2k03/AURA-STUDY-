import HbIcon from './HomeBottomIcons';
import HbSectionHeader from './HbSectionHeader';
import {
  accentStyle,
  getCompletedLessons,
  getFlashcardCount,
  getFolderActionLabel,
  getFolderStatus,
  pluralize,
} from './homeBottomUtils';

function FolderCard({ folder, onOpen }) {
  const progress = Math.min(100, Math.max(0, Math.round(folder.progress || 0)));
  const lessons = folder.lessons || 0;
  const completedLessons = Math.min(lessons, getCompletedLessons(folder));
  const flashcards = getFlashcardCount(folder);
  const status = getFolderStatus(folder);
  const actionLabel = getFolderActionLabel(folder);

  const handleKeyDown = (e) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(folder);
    }
  };

  return (
    <article
      className="hb-folder"
      style={accentStyle(folder.color)}
      onClick={() => onOpen(folder)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label={`${folder.title}, ${status.label}, ${progress}% complete`}
    >
      <div className="hb-folder-top">
        <span className="hb-folder-icon" aria-hidden="true">
          <HbIcon name="folder" size={14} />
        </span>
        <span className={`hb-status hb-status--${status.key}`}>
          <span className="hb-status-dot" aria-hidden="true" />
          {status.label}
        </span>
      </div>

      <div className="hb-folder-titles">
        <h3 className="hb-folder-title" title={folder.title}>{folder.title}</h3>
        <p className="hb-folder-sub" title={folder.subtitle}>
          {folder.subtitle || folder.description || 'General study material'}
        </p>
      </div>

      <div className="hb-folder-progress">
        <div className="hb-progress-meta">
          <span className="hb-folder-pct">{progress}%</span>
          <span className="hb-progress-count">
            {lessons === 0 ? 'No lessons' : `${completedLessons}/${lessons} done`}
          </span>
        </div>
        <div
          className="hb-bar"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${folder.title} progress`}
        >
          <span className="hb-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="hb-folder-stats">
        <span className="hb-meta" title={pluralize(lessons, 'lesson')}>
          <HbIcon name="lessons" size={12} />
          <span>{lessons}</span>
        </span>
        <span className="hb-meta" title={pluralize(flashcards, 'flashcard')}>
          <HbIcon name="layers" size={12} />
          <span>{flashcards}</span>
        </span>
        <span className="hb-meta hb-meta--time" title={`Last accessed: ${folder.lastStudied || '—'}`}>
          <HbIcon name="clock" size={12} />
          <span>{folder.lastStudied || '—'}</span>
        </span>
      </div>

      <button
        type="button"
        className="hb-btn hb-btn--soft hb-btn--block"
        onClick={(e) => {
          e.stopPropagation();
          onOpen(folder);
        }}
      >
        <span>{actionLabel}</span>
        <HbIcon name="arrow" size={12} strokeWidth={2.4} />
      </button>
    </article>
  );
}

function CreateFolderCard({ onCreate }) {
  return (
    <button type="button" className="hb-create" onClick={onCreate} aria-label="Create new folder">
      <span className="hb-create-plus" aria-hidden="true">
        <HbIcon name="plus" size={18} strokeWidth={2.4} />
      </span>
      <span className="hb-create-title">Create New Folder</span>
      <span className="hb-create-text">Organize your lessons and start learning.</span>
      <span className="hb-create-cta" aria-hidden="true">+ Create Folder</span>
    </button>
  );
}

/**
 * HomeFoldersPanel – "My Study Folders" quick-access section.
 *
 * @param {Array}    props.folders         Active folders (already sorted by recency)
 * @param {Function} props.onOpenFolder    Opens a folder's study materials
 * @param {Function} props.onCreateFolder  Triggers the existing create-folder flow
 * @param {Function} props.onViewAll       Navigates to the My Folders page
 */
export default function HomeFoldersPanel({ folders = [], onOpenFolder, onCreateFolder, onViewAll }) {
  return (
    <section className="hb-card hb-folders" aria-label="My study folders">
      <HbSectionHeader
        icon="folder"
        title="My Study Folders"
        description="Pick up where you left off."
        actionLabel="View all"
        actionAriaLabel="View all study folders"
        onAction={onViewAll}
      />

      <div className="hb-folder-track" role="list">
        {folders.map((folder) => (
          <div className="hb-folder-slot" role="listitem" key={folder.id}>
            <FolderCard folder={folder} onOpen={onOpenFolder} />
          </div>
        ))}
        <div className="hb-folder-slot" role="listitem">
          <CreateFolderCard onCreate={onCreateFolder} />
        </div>
      </div>
    </section>
  );
}

