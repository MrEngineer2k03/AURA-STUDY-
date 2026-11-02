import React, { useState, useRef, useEffect } from 'react';

/**
 * FolderListRow - Compact Modern List View Row for My Folders
 *
 * Implements a structured 5-column layout:
 * - Column 1: Folder Information (Icon, Title, Description, Badges: Status + Study Type)
 * - Column 2: Study Progress (% Complete, Progress Bar, Completed / Total Lessons)
 * - Column 3: Study Materials (Lessons count, Flashcards count, Members count)
 * - Column 4: Last Studied (Last accessed relative timestamp)
 * - Column 5: Actions (Primary button: "Continue →" / "Start Studying →" / "Review Again →" + 3-dot menu)
 */
export default function FolderListRow({
  folder,
  onClick,
  onOpen,
  onStudy,
  onAction,
  className = '',
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  if (!folder) return null;

  const {
    id,
    title = 'Untitled Folder',
    subtitle = 'General Study Material',
    description,
    progress = 0,
    lessons = 0,
    completed = 0,
    completedLessons,
    members = 1,
    color = 'red',
    status = 'In progress',
    lastStudied = 'Just now',
    isShared = false,
    studyType = 'flashcards',
    flashcards,
  } = folder;

  const cardCount = Array.isArray(flashcards) ? flashcards.length : (folder.cards || 1);

  const resolvedCompleted =
    typeof completedLessons === 'number'
      ? completedLessons
      : typeof completed === 'number'
      ? completed
      : Math.round((progress / 100) * (lessons || 1));

  // Accent Colors dictionary
  const accentColors = {
    red: '#ff2a44',
    blue: '#3b82f6',
    purple: '#a855f7',
    green: '#10b981',
    cyan: '#06b6d4',
    orange: '#f97316',
  };

  const normColor = (color || 'red').toLowerCase();
  const themeHex = accentColors[normColor] || '#ff2a44';

  // Normalize status key
  const normStatus = (status || '').toLowerCase();
  let statusKey = 'in-progress';
  let statusLabel = 'In progress';

  if (normStatus.includes('new') || progress === 0) {
    statusKey = 'new';
    statusLabel = 'New';
  } else if (normStatus.includes('complete') || progress >= 100) {
    statusKey = 'completed';
    statusLabel = 'Completed';
  } else if (normStatus.includes('share') || isShared) {
    statusKey = 'shared';
    statusLabel = 'Shared';
  }

  // Progress Bar Fill Color based on state:
  // - New: Neutral gray
  // - In Progress: Blue accent
  // - Completed: Green accent
  let progressBarColor = '#3b82f6';
  if (statusKey === 'new') {
    progressBarColor = '#64748b';
  } else if (statusKey === 'completed') {
    progressBarColor = '#10b981';
  } else if (statusKey === 'shared') {
    progressBarColor = '#a855f7';
  }

  // Primary action button label
  let primaryActionLabel = 'Continue →';
  if (statusKey === 'new') {
    primaryActionLabel = 'Start Studying →';
  } else if (statusKey === 'completed') {
    primaryActionLabel = 'Review Again →';
  }

  const handleRowClick = () => {
    if (onOpen) onOpen(folder);
    else if (onClick) onClick(folder);
  };

  const handlePrimaryStudy = (e) => {
    e.stopPropagation();
    if (onStudy) onStudy(folder);
    else if (onOpen) onOpen(folder);
  };

  const handleMenuSelect = (actionType, e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onAction) onAction(actionType, folder);
  };

  const folderDescription = subtitle || description || 'General Study Material';

  return (
    <div
      className={`folder-list-row theme-${normColor} status-${statusKey} ${className}`}
      onClick={handleRowClick}
      role="row"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleRowClick();
        }
      }}
      aria-label={`${title} – ${folderDescription} – ${progress}% complete`}
    >
      {/* Subtle top laser accent line */}
      <div className="flr-laser-notch" style={{ backgroundColor: themeHex }} aria-hidden="true" />

      {/* ========================================================
          COLUMN 1: FOLDER INFORMATION
          ======================================================== */}
      <div className="flr-col flr-col-info">
        {/* Subject-tinted folder icon */}
        <div
          className="flr-icon-box"
          style={{
            backgroundColor: `${themeHex}20`,
            borderColor: `${themeHex}40`,
            color: themeHex,
          }}
          aria-hidden="true"
        >
          <svg
            className="flr-folder-svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
          </svg>
        </div>

        {/* Text information & badges */}
        <div className="flr-info-text">
          <div className="flr-title-row">
            <h3 className="flr-title" title={title}>
              {title}
            </h3>
            {/* Status Badge */}
            <span className={`flr-status-badge badge-${statusKey}`}>
              <span className="flr-status-dot" aria-hidden="true">•</span>
              <span>{statusLabel}</span>
            </span>
          </div>

          <p className="flr-subtitle" title={folderDescription}>
            {folderDescription}
          </p>
        </div>
      </div>

      {/* ========================================================
          COLUMN 2: STUDY PROGRESS
          ======================================================== */}
      <div className="flr-col flr-col-progress">
        <div className="flr-progress-header">
          <span className="flr-progress-pct">{progress}% Complete</span>
          <span className="flr-progress-ratio" title={lessons === 0 ? 'No lessons' : `${resolvedCompleted} of ${lessons} lessons`}>
            {lessons === 0 ? 'No lessons' : `${resolvedCompleted} of ${lessons} lessons`}
          </span>
        </div>

        <div
          className="flr-progress-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title} progress: ${progress}%`}
        >
          <div
            className="flr-progress-fill"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              backgroundColor: progressBarColor,
              boxShadow: `0 0 8px ${progressBarColor}66`,
            }}
          />
        </div>
      </div>

      {/* ========================================================
          COLUMN 3: STUDY MATERIALS
          ======================================================== */}
      <div className="flr-col flr-col-materials">
        <div className="flr-material-item" title={`${lessons} lessons`}>
          <svg className="flr-material-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className="flr-material-val">{lessons} {lessons === 1 ? 'lesson' : 'lessons'}</span>
        </div>

        <div className="flr-material-item" title={`${cardCount} flashcards`}>
          <svg className="flr-material-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <line x1="6" y1="8" x2="10" y2="8" />
            <line x1="6" y1="12" x2="18" y2="12" />
          </svg>
          <span className="flr-material-val">{cardCount} {cardCount === 1 ? 'flashcard' : 'flashcards'}</span>
        </div>

        {(members > 1 || isShared) ? (
          <div className="flr-material-item flr-member-item" title={`${members} shared members`}>
            <svg className="flr-material-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="flr-material-val">{members} {members === 1 ? 'member' : 'members'}</span>
          </div>
        ) : (
          <div className="flr-material-item flr-material-placeholder" aria-hidden="true" />
        )}
      </div>

      {/* ========================================================
          COLUMN 4: LAST STUDIED
          ======================================================== */}
      <div className="flr-col flr-col-time">
        <div className="flr-time-wrapper" title={`Last studied: ${lastStudied}`}>
          <svg className="flr-time-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <div className="flr-time-content">
            <span className="flr-time-label">LAST STUDIED</span>
            <span className="flr-time-value" title={lastStudied}>{lastStudied}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          COLUMN 5: ACTIONS
          ======================================================== */}
      <div className="flr-col flr-col-actions" onClick={(e) => e.stopPropagation()}>
        {/* Primary Action Button */}
        <button
          type="button"
          className="flr-primary-btn"
          onClick={handlePrimaryStudy}
          aria-label={`${primaryActionLabel} for ${title}`}
        >
          <span>{primaryActionLabel}</span>
        </button>

        {/* Three-Dot Menu */}
        <div className="flr-menu-wrapper" ref={menuRef}>
          <button
            type="button"
            className="flr-dots-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="Folder actions"
            aria-expanded={menuOpen}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2.2" />
              <circle cx="12" cy="12" r="2.2" />
              <circle cx="19" cy="12" r="2.2" />
            </svg>
          </button>

          {menuOpen && (
            <div className="flr-popover-menu" role="menu">
              <button
                type="button"
                className="flr-menu-item"
                onClick={(e) => handleMenuSelect('rename', e)}
                role="menuitem"
              >
                <span className="flr-menu-icon" aria-hidden="true">✏️</span>
                <span>Rename Folder</span>
              </button>

              <button
                type="button"
                className="flr-menu-item"
                onClick={(e) => handleMenuSelect('inspectFiles', e)}
                role="menuitem"
              >
                <span className="flr-menu-icon" aria-hidden="true">📁</span>
                <span>Edit Folder</span>
              </button>

              <button
                type="button"
                className="flr-menu-item"
                onClick={(e) => handleMenuSelect('share', e)}
                role="menuitem"
              >
                <span className="flr-menu-icon" aria-hidden="true">🔗</span>
                <span>Share Folder</span>
              </button>

              <div className="flr-menu-divider" />

              <button
                type="button"
                className="flr-menu-item is-danger"
                onClick={(e) => handleMenuSelect('delete', e)}
                role="menuitem"
              >
                <span className="flr-menu-icon" aria-hidden="true">🗑️</span>
                <span>Delete Folder</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

