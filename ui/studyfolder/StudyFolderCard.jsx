import React, { useState, useRef, useEffect } from 'react';

/**
 * StudyFolderCard - Modern Student-Friendly Folder Card
 * Matches exact layout from reference design (media_1793596234655_f4b8a921.jpg):
 * - Top row: Colored folder icon in rounded box, Status badge (• New, • In progress, • Completed, • Shared), Three-dot menu
 * - Title and Subtitle
 * - Progress stats: % on left, "X of Y lessons" on right, thin progress bar
 * - Meta info: Lessons count, Cards/Members count, Time ago
 * - Full-width bottom action button ("Start studying →", "Continue →", "Review →")
 */
export default function StudyFolderCard({
  folder,
  isCreateCard = false,
  onCreateFolder,
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

  if (isCreateCard) {
    const handleCreate = (e) => {
      e.stopPropagation();
      if (onCreateFolder) onCreateFolder();
      else if (onClick) onClick();
    };

    return (
      <button
        type="button"
        className={`student-create-folder-card ${className}`}
        onClick={handleCreate}
        aria-label="Create New Study Folder"
      >
        <div className="scfc-inner">
          <div className="scfc-plus-circle">
            <svg
              width="20"
              height="20"
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
          <h4 className="scfc-title">Create new folder</h4>
          <p className="scfc-subtitle">Add lessons and start studying</p>
        </div>
      </button>
    );
  }

  if (!folder) return null;

  const {
    id,
    title = 'Untitled Folder',
    subtitle = 'General Study Material',
    progress = 0,
    lessons = 0,
    completed = 0,
    completedLessons,
    members = 1,
    color = 'red',
    status = 'In progress',
    lastStudied = 'Just now',
    isShared = false,
    flashcards,
  } = folder;

  const cardCount = Array.isArray(flashcards) ? flashcards.length : (folder.cards || 1);

  const resolvedCompleted =
    typeof completedLessons === 'number'
      ? completedLessons
      : typeof completed === 'number'
      ? completed
      : Math.round((progress / 100) * (lessons || 1));

  // Determine status display and color badge
  const normStatus = (status || (progress >= 100 ? 'Completed' : progress === 0 ? 'New' : 'In progress')).toLowerCase();
  let statusBadgeType = 'in-progress';
  let statusLabel = 'In progress';

  if (normStatus.includes('new') || progress === 0) {
    statusBadgeType = 'new';
    statusLabel = 'New';
  } else if (normStatus.includes('completed') || progress >= 100) {
    statusBadgeType = 'completed';
    statusLabel = 'Completed';
  } else if (normStatus.includes('shared') || isShared) {
    statusBadgeType = 'shared';
    statusLabel = 'Shared';
  } else {
    statusBadgeType = 'in-progress';
    statusLabel = 'In progress';
  }

  // Normalized folder color theme
  const normColor = (color || 'red').toLowerCase();

  // Progress color & fill
  const colorHexMap = {
    red: '#ef4444',
    orange: '#f59e0b',
    gold: '#f59e0b',
    cyan: '#06b6d4',
    teal: '#06b6d4',
    green: '#10b981',
    blue: '#3b82f6',
    purple: '#a855f7',
  };

  const themeHex = colorHexMap[normColor] || '#ef4444';

  // Primary action button label and style
  let actionLabel = 'Continue →';
  let actionBtnClass = 'btn-folder-action-continue';

  if (statusBadgeType === 'new') {
    actionLabel = 'Start studying →';
    actionBtnClass = 'btn-folder-action-start'; // Solid red button
  } else if (statusBadgeType === 'completed') {
    actionLabel = 'Review →';
    actionBtnClass = 'btn-folder-action-review'; // Cyan accent button
  } else {
    actionLabel = 'Continue →';
    actionBtnClass = 'btn-folder-action-continue'; // Theme tinted button
  }

  const handleCardClick = () => {
    if (onClick) onClick(folder);
    else if (onOpen) onOpen(folder);
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    if (onStudy) onStudy(folder);
    else if (onOpen) onOpen(folder);
    else if (onClick) onClick(folder);
  };

  const handleMenuSelect = (actionType, e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onAction) onAction(actionType, folder);
  };

  return (
    <div
      className={`student-folder-card theme-${normColor} ${className}`}
      onClick={handleCardClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      aria-label={`${title} - ${subtitle} - ${progress}% complete`}
    >
      {/* 1. TOP ROW: FOLDER ICON, STATUS BADGE, THREE-DOTS MENU */}
      <div className="sfc-top-row">
        <div className="sfc-icon-status-group">
          {/* Colored Folder Icon Box */}
          <div
            className={`sfc-folder-icon-box box-${normColor}`}
            style={{ backgroundColor: `${themeHex}22` }}
            aria-hidden="true"
          >
            <svg
              className="sfc-folder-svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={themeHex}
            >
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          </div>

          {/* Status Badge with Dot */}
          <div className={`sfc-status-pill badge-${statusBadgeType}`}>
            <span className="sfc-status-dot" aria-hidden="true">•</span>
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* Three-dots menu */}
        <div className="sfc-menu-wrap" ref={menuRef}>
          <button
            type="button"
            className="sfc-dots-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="Folder actions menu"
            aria-expanded={menuOpen}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2.2" />
              <circle cx="12" cy="12" r="2.2" />
              <circle cx="19" cy="12" r="2.2" />
            </svg>
          </button>

          {menuOpen && (
            <div className="sfc-popover-menu" role="menu">
              <button
                type="button"
                className="sfc-menu-item"
                onClick={(e) => handleMenuSelect('open', e)}
                role="menuitem"
              >
                <span>📖 Open folder</span>
              </button>
              <button
                type="button"
                className="sfc-menu-item"
                onClick={(e) => handleMenuSelect('study', e)}
                role="menuitem"
              >
                <span>⚡ Study flashcards</span>
              </button>
              <button
                type="button"
                className="sfc-menu-item"
                onClick={(e) => handleMenuSelect('rename', e)}
                role="menuitem"
              >
                <span>✏️ Rename folder</span>
              </button>
              <button
                type="button"
                className="sfc-menu-item"
                onClick={(e) => handleMenuSelect('archive', e)}
                role="menuitem"
              >
                <span>📦 Archive folder</span>
              </button>
              <div className="sfc-menu-divider" />
              <button
                type="button"
                className="sfc-menu-item is-danger"
                onClick={(e) => handleMenuSelect('delete', e)}
                role="menuitem"
              >
                <span>🗑 Delete folder</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. TITLE & SUBTITLE */}
      <div className="sfc-content-group">
        <h3 className="sfc-title" title={title}>
          {title}
        </h3>
        <p className="sfc-subtitle" title={subtitle}>
          {subtitle}
        </p>
      </div>

      {/* 3. PROGRESS SECTION */}
      <div className="sfc-progress-group">
        <div className="sfc-progress-labels">
          <span className="sfc-pct-text">{progress}%</span>
          <span className="sfc-lessons-summary">
            {lessons === 0 ? 'No lessons yet' : `${resolvedCompleted} of ${lessons} lessons`}
          </span>
        </div>

        <div className="sfc-progress-track">
          <div
            className="sfc-progress-bar-fill"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              backgroundColor: themeHex,
            }}
          />
        </div>
      </div>

      {/* 4. METADATA ROW */}
      <div className="sfc-meta-row">
        <span className="sfc-meta-item" title={`${lessons} lessons`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
          </svg>
          <span>{lessons} lessons</span>
        </span>

        {/* Display members for Business Strategy, cards for others */}
        {normColor === 'orange' || folder.id === 'folder-biz' ? (
          <span className="sfc-meta-item" title={`${members} member`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{members} member</span>
          </span>
        ) : (
          <span className="sfc-meta-item" title={`${cardCount} card`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="6" y1="8" x2="10" y2="8" />
              <line x1="6" y1="12" x2="18" y2="12" />
            </svg>
            <span>{cardCount} {cardCount === 1 ? 'card' : 'cards'}</span>
          </span>
        )}

        <span className="sfc-meta-item meta-time" title={`Last studied: ${lastStudied}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>{lastStudied}</span>
        </span>
      </div>

      {/* 5. BOTTOM ACTION BUTTON */}
      <div className="sfc-bottom-action">
        <button
          type="button"
          className={`sfc-action-btn ${actionBtnClass}`}
          onClick={handleActionClick}
        >
          <span>{actionLabel}</span>
        </button>
      </div>
    </div>
  );
}
