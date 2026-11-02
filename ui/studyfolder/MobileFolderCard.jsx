import React, { useState, useRef, useEffect } from 'react';

/**
 * MobileFolderCard - Clean, simple, user-friendly folder card for the MOBILE Grid View.
 *
 * Matches the mobile grid reference design:
 * 1. Top Row:      Tinted squircle with outlined folder icon (left) · Three-dot menu (right)
 * 2. Title:        Bold white folder title (single-line with ellipsis)
 * 3. Progress:     Slim progress bar on top · "X of Y lessons" (left) & "X%" (right) below
 * 4. Divider:      Subtle 1px horizontal divider
 * 5. Bottom Row:   Status indicator (• New / • In progress / ✓ Completed) on left ·
 *                  Shared members icon + count on right (when applicable)
 *
 * Entire card is clickable to start/continue/review studying.
 */

const ICON_THEMES = {
  red: { fg: '#f43f5e', bg: 'rgba(244, 63, 94, 0.16)' },
  orange: { fg: '#f59e0b', bg: 'rgba(245, 158, 11, 0.16)' },
  gold: { fg: '#f59e0b', bg: 'rgba(245, 158, 11, 0.16)' },
  amber: { fg: '#f59e0b', bg: 'rgba(245, 158, 11, 0.16)' },
  green: { fg: '#22c55e', bg: 'rgba(34, 197, 94, 0.16)' },
  cyan: { fg: '#06b6d4', bg: 'rgba(6, 182, 212, 0.16)' },
  teal: { fg: '#14b8a6', bg: 'rgba(20, 184, 166, 0.16)' },
  blue: { fg: '#3b82f6', bg: 'rgba(59, 130, 246, 0.16)' },
  purple: { fg: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.16)' },
};

function resolveStatus(status, progress, lessons) {
  const norm = (status || '').toLowerCase();
  if (norm.includes('complete') || progress >= 100) {
    return { key: 'completed', label: 'Completed' };
  }
  if (norm.includes('new') || (progress === 0 && lessons === 0)) {
    return { key: 'new', label: 'New' };
  }
  return { key: 'in-progress', label: 'In progress' };
}

export default function MobileFolderCard({ folder, onOpen, onStudy, onAction }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the three-dot menu on outside tap / click
  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [menuOpen]);

  if (!folder) return null;

  const {
    title = 'Untitled Folder',
    progress = 0,
    lessons = 0,
    completed,
    completedLessons,
    members = 1,
    color = 'red',
    status,
    isShared = false,
  } = folder;

  const safeProgress = Math.min(100, Math.max(0, Number(progress) || 0));
  const resolvedCompleted =
    typeof completedLessons === 'number'
      ? completedLessons
      : typeof completed === 'number'
      ? completed
      : Math.round((safeProgress / 100) * (lessons || 0));

  const { key: statusKey, label: statusLabel } = resolveStatus(status, safeProgress, lessons);
  const normColor = (color || 'red').toLowerCase();
  const iconTheme = ICON_THEMES[normColor] || ICON_THEMES.red;

  // Progress bar color: green when completed, blue when in-progress
  const barColor = statusKey === 'completed' ? '#22c55e' : '#3b82f6';

  const lessonsText =
    lessons === 0 ? 'No lessons yet' : `${resolvedCompleted} of ${lessons} ${lessons === 1 ? 'lesson' : 'lessons'}`;

  const showMembers = members > 1 || isShared;
  const displayMembers = members > 1 ? members : 2;

  const handleCardActivate = () => {
    if (onStudy) onStudy(folder);
    else if (onOpen) onOpen(folder);
  };

  const handleMenuSelect = (actionType, e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onAction) onAction(actionType, folder);
  };

  return (
    <div
      className={`mobile-folder-card theme-${normColor} status-${statusKey} ${menuOpen ? 'is-menu-open' : ''}`}
      onClick={handleCardActivate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardActivate();
        }
      }}
      aria-label={`${title} – ${lessonsText} – ${safeProgress}% – ${statusLabel}`}
    >
      {/* 1. TOP ROW: Tinted folder icon squircle + Three-dot menu */}
      <div className="mfc-top">
        <div
          className="mfc-icon-box"
          style={{
            backgroundColor: iconTheme.bg,
            color: iconTheme.fg,
          }}
          aria-hidden="true"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
          </svg>
        </div>

        <div
          className="mfc-menu-wrap"
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="mfc-dots-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label={`Actions for ${title}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <circle cx="5" cy="12" r="1.8" />
              <circle cx="12" cy="12" r="1.8" />
              <circle cx="19" cy="12" r="1.8" />
            </svg>
          </button>

          {menuOpen && (
            <div className="mfc-popover" role="menu">
              <button type="button" className="mfc-menu-item" role="menuitem" onClick={(e) => handleMenuSelect('open', e)}>
                📖 Open folder
              </button>
              <button type="button" className="mfc-menu-item" role="menuitem" onClick={(e) => handleMenuSelect('study', e)}>
                ⚡ Study flashcards
              </button>
              <button type="button" className="mfc-menu-item" role="menuitem" onClick={(e) => handleMenuSelect('rename', e)}>
                ✏️ Rename folder
              </button>
              <button type="button" className="mfc-menu-item" role="menuitem" onClick={(e) => handleMenuSelect('archive', e)}>
                📦 Archive folder
              </button>
              <div className="mfc-menu-divider" />
              <button type="button" className="mfc-menu-item is-danger" role="menuitem" onClick={(e) => handleMenuSelect('delete', e)}>
                🗑 Delete folder
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. TITLE */}
      <h3 className="mfc-title" title={title}>
        {title}
      </h3>

      {/* 3. PROGRESS BAR + LESSONS & PERCENTAGE */}
      <div className="mfc-progress-section">
        <div
          className="mfc-track"
          role="progressbar"
          aria-valuenow={safeProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${title} progress`}
        >
          <div
            className="mfc-fill"
            style={{
              width: `${safeProgress}%`,
              backgroundColor: barColor,
            }}
          />
        </div>

        <div className="mfc-progress-meta">
          <span className="mfc-lessons-text" title={lessonsText}>
            {lessonsText}
          </span>
          <span className="mfc-pct-text">{safeProgress}%</span>
        </div>
      </div>

      {/* 4. FOOTER: Status on left · Shared members on right */}
      <div className="mfc-footer">
        <span className={`mfc-status-text status-${statusKey}`}>
          {statusKey === 'completed' ? (
            <svg
              className="mfc-check-icon"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <polyline points="8.5 12.2 11 14.7 15.5 9.8" />
            </svg>
          ) : (
            <span className="mfc-status-dot" aria-hidden="true" />
          )}
          <span>{statusLabel}</span>
        </span>

        {showMembers && (
          <span className="mfc-members" title={`${displayMembers} shared members`}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{displayMembers}</span>
          </span>
        )}
      </div>
    </div>
  );
}
