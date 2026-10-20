import React, { useState, useRef, useEffect } from 'react';

/**
 * FlashcardFolderHeader - Sleek breadcrumbs, folder card, and stats row
 * Redesigned based on Image 3 reference with dark cyber RPG visual identity
 *
 * @param {Object} props
 * @param {Object} props.folder - Folder data
 * @param {Array<Object>} props.cards - Current cards in folder
 * @param {Function} props.onBackToFolders - Return to My Folders grid
 * @param {Function} [props.onFolderAction] - Callback for folder options (rename, archive, delete, inspect)
 */
export default function FlashcardFolderHeader({
  folder,
  cards = [],
  onBackToFolders,
  onFolderAction,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const folderTitle = folder?.title || 'Test';
  const folderSubtitle = folder?.subtitle || folder?.description || 'for test';

  // Calculate statistics from cards
  const totalFlashcards = cards.length;
  const studiedCards = totalFlashcards > 0
    ? cards.filter((c) => (c.status && c.status !== 'new') || (c.studyCount > 0)).length
    : 0;
  const masteredCards = totalFlashcards > 0
    ? cards.filter((c) => c.status === 'mastered').length
    : 0;

  return (
    <div className="folder-header-section-wrapper">
      {/* 1. BREADCRUMBS MATCHING IMAGE 3 */}
      <nav className="folder-breadcrumbs-bar" aria-label="Breadcrumb">
        <button
          type="button"
          className="folder-breadcrumb-btn"
          onClick={onBackToFolders}
        >
          My Folders
        </button>
        <span className="folder-breadcrumb-sep">/</span>
        <span className="folder-breadcrumb-name">{folderTitle}</span>
        <span className="folder-breadcrumb-sep">/</span>
        <span className="folder-breadcrumb-current" aria-current="page">
          Flashcards
        </span>
      </nav>

      {/* 2. TOP FOLDER CARD MATCHING IMAGE 3 */}
      <div className="folder-top-card" role="region" aria-label="Folder Information">
        <div className="folder-top-card-left">
          <div className="folder-red-icon-box" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ef4444">
              <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
            </svg>
          </div>
          <div className="folder-top-info">
            <h1 className="folder-top-title">{folderTitle}</h1>
            <p className="folder-top-subtitle">{folderSubtitle}</p>
          </div>
        </div>

        <div className="folder-dots-menu-wrap" ref={menuRef}>
          <button
            type="button"
            className="folder-dots-btn"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Folder Options"
            aria-expanded={isMenuOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="folder-dots-dropdown-menu" role="menu">
              <button
                type="button"
                className="folder-dots-item"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onFolderAction) onFolderAction('rename', folder);
                }}
              >
                <span>✏️</span>
                <span>Rename Folder</span>
              </button>
              <button
                type="button"
                className="folder-dots-item"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onFolderAction) onFolderAction('inspectFiles', folder);
                }}
              >
                <span>📁</span>
                <span>View Materials</span>
              </button>
              <button
                type="button"
                className="folder-dots-item"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onFolderAction) onFolderAction('archive', folder);
                }}
              >
                <span>📦</span>
                <span>Archive Folder</span>
              </button>
              <div className="folder-dots-divider" />
              <button
                type="button"
                className="folder-dots-item is-danger"
                role="menuitem"
                onClick={() => {
                  setIsMenuOpen(false);
                  if (onFolderAction) onFolderAction('delete', folder);
                }}
              >
                <span>🗑️</span>
                <span>Delete Folder</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. THREE STATS CARDS MATCHING IMAGE 3 */}
      <div className="folder-stats-grid-row" role="region" aria-label="Deck Statistics">
        <div className="folder-stat-box" title="Total flashcards in this deck">
          <span className="folder-stat-num is-cards">{totalFlashcards}</span>
          <span className="folder-stat-lbl">Cards</span>
        </div>
        <div className="folder-stat-box" title="Studied flashcards">
          <span className="folder-stat-num is-studied">{studiedCards}</span>
          <span className="folder-stat-lbl">Studied</span>
        </div>
        <div className="folder-stat-box" title="Mastered flashcards">
          <span className="folder-stat-num is-mastered">{masteredCards}</span>
          <span className="folder-stat-lbl">Mastered</span>
        </div>
      </div>

      {/* 4. DIVIDER LINE MATCHING IMAGE 3 */}
      <div className="folder-section-divider" aria-hidden="true" />
    </div>
  );
}
