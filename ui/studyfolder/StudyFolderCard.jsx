import { useState, useRef, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { getFolderThumbnail } from './folderThumbnails';

/**
 * StudyFolderCard - Rich RPG study progression card for AURA
 * Supports both detailed view (My Folders page) and compact view (Home section)
 *
 * @param {Object} props
 * @param {Object} props.folder - Folder data object
 * @param {'detailed' | 'compact'} [props.variant='detailed'] - Card layout variant
 * @param {boolean} [props.isCreateCard=false] - Whether this card acts as the "+ Create" placeholder
 * @param {Function} [props.onClick] - Card click handler
 * @param {Function} [props.onOpen] - "Open Folder" action handler
 * @param {Function} [props.onStudy] - Primary action ("Continue / Start / Review") handler
 * @param {Function} [props.onAction] - Action menu handler (actionType, folder)
 * @param {Function} [props.onCreateFolder] - Create folder trigger
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function StudyFolderCard({
  folder,
  variant = 'compact',
  isCreateCard = false,
  onClick,
  onOpen,
  onStudy,
  onAction,
  onCreateFolder,
  className = '',
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside
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

  // ==========================================
  // 1. CREATE NEW FOLDER CARD (Compact & Grid)
  // ==========================================
  if (isCreateCard) {
    const handleCreate = (e) => {
      e.stopPropagation();
      if (onCreateFolder) onCreateFolder();
      else if (onClick) onClick();
    };

    return (
      <button
        type="button"
        className={`study-folder-card is-create-card ${className}`}
        onClick={handleCreate}
        aria-label="Create New Study Folder"
      >
        <div className="create-card-corner-notch" aria-hidden="true" />
        <div className="create-card-inner">
          <div className="create-card-plus-circle">
            <svg
              className="create-plus-svg"
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
          <span className="create-card-label">Create New Folder</span>
          <span className="create-card-subtext">+ Add Reviewer</span>
        </div>
      </button>
    );
  }

  if (!folder) return null;

  const {
    title = 'Untitled Folder',
    subtitle = 'General Study Material',
    progress = 0,
    lessons = 0,
    completed = 0,
    completedLessons,
    members = 1,
    color = 'red',
    status = 'In Progress',
    lastStudied,
    battleReady,
    hasAiReviewer,
    studyType,
    flashcards,
  } = folder;

  const cardCount = Array.isArray(flashcards) ? flashcards.length : (folder.cards || 0);

  const resolvedCompleted =
    typeof completedLessons === 'number'
      ? completedLessons
      : typeof completed === 'number'
      ? completed
      : Math.round((progress / 100) * lessons);

  const colorClass = `theme-${(color || 'red').toLowerCase()}`;
  const isArchived = Boolean(folder.isArchived || folder.status?.toLowerCase() === 'archived');
  const thumbnailSrc = getFolderThumbnail(folder);

  // Primary action label determination
  let primaryActionLabel = 'Continue Studying →';
  if (isArchived) {
    primaryActionLabel = '♻️ Restore Folder';
  } else if (studyType === 'flashcards') {
    primaryActionLabel = progress > 0 ? 'Continue Flashcards →' : 'Start Studying →';
  } else if (progress >= 100 || status?.toLowerCase() === 'completed') {
    primaryActionLabel = 'Review Folder →';
  } else if (progress === 0 || status?.toLowerCase() === 'new') {
    primaryActionLabel = 'Start Studying →';
  }

  // Status badge styling
  const normalizedStatus = (status || (progress >= 100 ? 'Completed' : 'In Progress')).toUpperCase();
  let statusBadgeClass = 'status-in-progress';
  let displayStatus = normalizedStatus;
  if (isArchived) {
    statusBadgeClass = 'status-archived';
    displayStatus = 'ARCHIVED';
  } else if (normalizedStatus.includes('COMPLETED')) {
    statusBadgeClass = 'status-completed';
  } else if (normalizedStatus.includes('NEW')) {
    statusBadgeClass = 'status-new';
  } else if (normalizedStatus.includes('SHARED')) {
    statusBadgeClass = 'status-shared';
  }

  const handleCardClick = () => {
    if (onClick) onClick(folder);
    else if (onOpen) onOpen(folder);
  };

  const handlePrimaryAction = (e) => {
    e.stopPropagation();
    if (isArchived) {
      if (onAction) onAction('restore', folder);
      else if (onStudy) onStudy(folder);
    } else if (onStudy) {
      onStudy(folder);
    } else if (onClick) {
      onClick(folder);
    }
  };

  const handleSecondaryAction = (e) => {
    e.stopPropagation();
    if (onOpen) onOpen(folder);
    else if (onClick) onClick(folder);
  };

  const handleMenuSelect = (actionType, e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onAction) onAction(actionType, folder);
  };

  const renderDropdownMenu = () => (
    <div className="sfc-dropdown-menu" role="menu">
      {isArchived ? (
        <>
          <button
            type="button"
            className="sfc-menu-item text-success"
            onClick={(e) => handleMenuSelect('restore', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">♻️</span> Restore Folder
          </button>
          <button
            type="button"
            className="sfc-menu-item"
            onClick={(e) => handleMenuSelect('open', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">📖</span> View Materials
          </button>
          <button
            type="button"
            className="sfc-menu-item"
            onClick={(e) => handleMenuSelect('inspectFiles', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">📁</span> Files & Lessons
          </button>
          <div className="menu-divider" />
          <button
            type="button"
            className="sfc-menu-item text-danger"
            onClick={(e) => handleMenuSelect('delete', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">🗑️</span> Delete Permanently
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="sfc-menu-item"
            onClick={(e) => handleMenuSelect('open', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">📖</span> Open Folder
          </button>
          <button
            type="button"
            className="sfc-menu-item"
            onClick={(e) => handleMenuSelect('inspectFiles', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">📁</span> Files & Lessons
          </button>
          <button
            type="button"
            className="sfc-menu-item"
            onClick={(e) => handleMenuSelect('rename', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">✏️</span> Rename
          </button>
          <button
            type="button"
            className="sfc-menu-item"
            onClick={(e) => handleMenuSelect('share', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">🔗</span> Share with Friends
          </button>
          <button
            type="button"
            className="sfc-menu-item"
            onClick={(e) => handleMenuSelect('duplicate', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">📑</span> Duplicate
          </button>
          <div className="menu-divider" />
          <button
            type="button"
            className="sfc-menu-item text-warning"
            onClick={(e) => handleMenuSelect('archive', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">📦</span> Archive Folder
          </button>
          <button
            type="button"
            className="sfc-menu-item text-danger"
            onClick={(e) => handleMenuSelect('delete', e)}
            role="menuitem"
          >
            <span className="menu-item-icon">🗑️</span> Delete
          </button>
        </>
      )}
    </div>
  );

  // ==========================================
  // 2. COMPACT VARIANT (FOR HOMEPAGE SECTION)
  // ==========================================
  if (variant === 'compact') {
    return (
      <div
        className={`study-folder-card ${colorClass} ${isArchived ? 'is-archived-card' : ''} ${className}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
          }
        }}
        aria-label={`${title} - ${progress}% complete`}
      >
        <div className="card-cyber-accent" aria-hidden="true" />
        <div className="sfc-top-row">
          <div className="sfc-icon-badge" aria-hidden="true">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          </div>
          <div className="sfc-badge-group">
            {isArchived ? (
              <span className="sfc-pill-badge is-archived-pill" title="Archived">
                📦
              </span>
            ) : (
              <>
                {battleReady && (
                  <span className="sfc-pill-badge battle-ready" title="Battle Ready">
                    ⚔️
                  </span>
                )}
                {hasAiReviewer && (
                  <span className="sfc-pill-badge ai-active" title="AI Reviewer Active">
                    ⚡
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="sfc-middle-content">
          <h4 className="sfc-folder-title" title={title}>
            {title}
          </h4>
          <div className="sfc-pct-value">{progress}%</div>
          <div className="sfc-progressbar-container">
            <ProgressBar value={progress} color={isArchived ? 'gray' : color} height={5} />
          </div>
        </div>

        <div className="sfc-bottom-meta">
          <span className="sfc-meta-pct-mobile">{progress}% · </span>
          <span className="sfc-meta-item">
            {lessons} {lessons === 1 ? 'lesson' : 'lessons'}
          </span>
          <span className="sfc-meta-dot">·</span>
          <span className="sfc-meta-item">
            {members} {members === 1 ? 'member' : 'members'}
          </span>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. DETAILED VARIANT (FOR DEDICATED MY FOLDERS)
  // ==========================================
  return (
    <div
      className={`study-folder-card is-detailed-card ${colorClass} ${isArchived ? 'is-archived-card' : ''} ${className}`}
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
      {/* ------------------------------------------------------------------ */}
      {/* MOBILE HORIZONTAL CARD LAYOUT (Active on <= 768px screens)          */}
      {/* ------------------------------------------------------------------ */}
      <div className="sfc-mobile-card-inner">
        {/* Glowing Thumbnail */}
        <div className="sfc-mobile-thumb-container">
          <img src={thumbnailSrc} alt={title} className="sfc-mobile-thumb-img" />
        </div>

        {/* Content Column */}
        <div className="sfc-mobile-body">
          {/* Top Line: Badge (NEW, SHARED, ARCHIVED) + Dots Menu */}
          <div className="sfc-mobile-top">
            <div className="sfc-mobile-badge-wrap">
              {status?.toUpperCase() === 'NEW' && (
                <span className="sfc-mobile-badge badge-new">NEW</span>
              )}
              {(folder.isShared || status?.toUpperCase() === 'SHARED') && (
                <span className="sfc-mobile-badge badge-shared">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>SHARED</span>
                </span>
              )}
              {(isArchived || status?.toUpperCase() === 'ARCHIVED') && (
                <span className="sfc-mobile-badge badge-archived">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8v13H3V8" />
                    <path d="M1 3h22v5H1z" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                  </svg>
                  <span>ARCHIVED</span>
                </span>
              )}
            </div>

            <div className="sfc-mobile-menu-wrap" ref={menuRef}>
              <button
                type="button"
                className="sfc-mobile-dots-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((prev) => !prev);
                }}
                aria-label="Folder Options"
                aria-expanded={menuOpen}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="5" cy="12" r="2.2" />
                  <circle cx="12" cy="12" r="2.2" />
                  <circle cx="19" cy="12" r="2.2" />
                </svg>
              </button>
              {menuOpen && renderDropdownMenu()}
            </div>
          </div>

          {/* Folder Title */}
          <h3 className="sfc-mobile-title" title={title}>
            {title}
          </h3>

          {/* Subtitle */}
          <p className="sfc-mobile-subtitle" title={subtitle}>
            {subtitle}
          </p>

          {/* Progress Bar & Percentage */}
          <div className="sfc-mobile-progress-row">
            <div className="sfc-mobile-track">
              <div
                className={`sfc-mobile-fill theme-fill-${(color || 'red').toLowerCase()}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="sfc-mobile-pct">{progress}%</span>
          </div>

          {/* Bottom Meta Row */}
          <div className="sfc-mobile-meta-row">
            <div className="sfc-mobile-meta-item meta-lessons">
              <svg
                className={`meta-folder-icon icon-color-${(color || 'red').toLowerCase()}`}
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
              </svg>
              <span>{lessons} Lessons</span>
            </div>

            {folder.id === 'folder-prog' || folder.showCards ? (
              <div className="sfc-mobile-meta-item meta-cards">
                <svg
                  className="meta-cards-icon"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <line x1="6" y1="8" x2="10" y2="8" />
                  <line x1="6" y1="12" x2="18" y2="12" />
                  <line x1="6" y1="16" x2="14" y2="16" />
                </svg>
                <span>{folder.cards || cardCount || 4} Cards</span>
              </div>
            ) : (
              <div className="sfc-mobile-meta-item meta-members">
                <svg
                  className="meta-members-icon"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                <span>{members} {members === 1 ? 'Member' : 'Members'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* DESKTOP VIEW LAYOUT (Active on > 768px screens)                    */}
      {/* ------------------------------------------------------------------ */}
      <div className="sfc-desktop-wrapper">
        {/* Top Cyber Laser Notch on card */}
        <div className="sfc-laser-notch" aria-hidden="true" />
        <div className="card-cyber-accent" aria-hidden="true" />

        {/* TOP ROW: Colored Folder Icon Badge, Status Badge, Three-dot Menu */}
        <div className="sfc-top-row">
          <div className="sfc-icon-and-status">
            <div className="sfc-icon-badge" aria-hidden="true">
              <svg
                className="sfc-folder-svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
              </svg>
            </div>
            <span className={`sfc-status-badge ${statusBadgeClass}`}>
              {displayStatus}
            </span>
          </div>

          {/* Three-Dot Menu with Dropdown */}
          <div className="sfc-menu-container" ref={menuRef}>
            <button
              type="button"
              className="sfc-dots-btn"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((prev) => !prev);
              }}
              aria-label="Folder Options"
              aria-expanded={menuOpen}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2.2" />
                <circle cx="12" cy="12" r="2.2" />
                <circle cx="19" cy="12" r="2.2" />
              </svg>
            </button>
            {menuOpen && renderDropdownMenu()}
          </div>
        </div>

        {/* FOLDER INFORMATION: Title and Subtitle */}
        <div className="sfc-info-section">
          <h3 className="sfc-rich-title" title={title}>
            {title}
          </h3>
          <p className="sfc-rich-subtitle" title={subtitle}>
            {subtitle}
          </p>
          <div className="sfc-studytype-tag-row">
            {studyType && (
              <span className="sfc-studytype-pill">
                <span className="pill-method-icon">🗂</span> {studyType.toUpperCase()}
              </span>
            )}
            {isArchived && folder.archivedAt && (
              <span className="sfc-archived-stamp-pill" title={`Archived on ${folder.archivedAt}`}>
                <span className="stamp-icon">📦</span> Archived
              </span>
            )}
          </div>
        </div>

        {/* PROGRESS SECTION */}
        <div className="sfc-progress-section">
          <div className="sfc-progress-header-row">
            <span className="sfc-progress-pct-label">{progress}% Complete</span>
            <span className="sfc-lessons-ratio">
              {resolvedCompleted} / {lessons} Lessons
            </span>
          </div>

          <div className="sfc-progressbar-wrapper">
            <ProgressBar value={progress} color={isArchived ? 'gray' : color} height={6} />
          </div>
        </div>

        {/* METADATA: Lessons, Members, and Last Studied */}
        <div className="sfc-meta-row">
          <div className="sfc-meta-badges">
            <span className="sfc-meta-pill" title={`${lessons} lessons in this unit`}>
              <span className="meta-icon">📚</span> {lessons} Lessons
            </span>
            {cardCount > 0 ? (
              <span className="sfc-meta-pill is-flashcard-count" title={`${cardCount} flashcards in this deck`}>
                <span className="meta-icon">🗂</span> {cardCount} {cardCount === 1 ? 'Card' : 'Cards'}
              </span>
            ) : (
              <span className="sfc-meta-pill" title={`${members} study group members`}>
                <span className="meta-icon">👥</span> {members} {members === 1 ? 'Member' : 'Members'}
              </span>
            )}
          </div>
          {lastStudied && (
            <div className="sfc-last-studied-text" title={`Last studied: ${lastStudied}`}>
              <span className="clock-icon">🕒</span> {lastStudied}
            </div>
          )}
        </div>

        {/* CARD ACTION BUTTONS */}
        <div className="sfc-actions-footer">
          <button
            type="button"
            className={`btn-folder-primary ${isArchived ? 'btn-restore-action' : ''}`}
            onClick={handlePrimaryAction}
          >
            {primaryActionLabel}
          </button>
          <button
            type="button"
            className="btn-folder-secondary"
            onClick={handleSecondaryAction}
          >
            {isArchived ? 'View Folder' : 'Open Folder'}
          </button>
        </div>
      </div>
    </div>
  );
}
