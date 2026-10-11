import React from 'react';

/**
 * FlashcardFolderHeader - Breadcrumbs and Main Folder Information Hero Card
 * Designed based on the attached reference image with dark futuristic RPG visual identity
 *
 * @param {Object} props
 * @param {Object} props.folder - Folder data
 * @param {Array<Object>} props.cards - Current cards in folder
 * @param {Function} props.onBackToFolders - Return to My Folders grid
 */
export default function FlashcardFolderHeader({
  folder,
  cards = [],
  onBackToFolders,
}) {
  const folderTitle = (folder?.title || 'Physics Midterms').toUpperCase();
  const folderSubtitle = folder?.subtitle || folder?.description || 'Forces & Motion';

  // Calculate actual statistics from cards
  const totalFlashcards = cards.length;
  const studiedCards = totalFlashcards > 0
    ? cards.filter((c) => (c.status && c.status !== 'new') || (c.studyCount > 0)).length
    : 0;
  const masteredCards = totalFlashcards > 0
    ? cards.filter((c) => c.status === 'mastered').length
    : 0;

  // Study progress: percentage of mastered cards (STRICTLY 0% if totalFlashcards === 0)
  const studyProgress = totalFlashcards > 0
    ? Math.round((masteredCards / totalFlashcards) * 100)
    : 0;

  const lastStudied = totalFlashcards > 0
    ? (folder?.lastStudied || 'Recently')
    : 'Not studied yet';
  const statusLabel = totalFlashcards === 0
    ? 'EMPTY'
    : studyProgress >= 100
    ? 'COMPLETED'
    : studyProgress > 0
    ? 'IN PROGRESS'
    : 'NEW';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. BREADCRUMBS */}
      <nav className="folder-breadcrumbs-bar" aria-label="Breadcrumb">
        <button
          type="button"
          className="folder-breadcrumb-btn"
          onClick={onBackToFolders}
        >
          <span>📁</span>
          <span>My Folders</span>
        </button>
        <span className="folder-breadcrumb-sep">/</span>
        <span className="folder-breadcrumb-name">{folder?.title || 'Physics Midterms'}</span>
        <span className="folder-breadcrumb-sep">/</span>
        <span className="folder-breadcrumb-current" aria-current="page">
          Flashcards
        </span>
      </nav>

      {/* 2. MAIN FOLDER HERO CARD (Visual Design from Attached Reference Image) */}
      <div className="folder-hero-card" role="region" aria-label="Folder Overview">
        {/* Laser red top accent line */}
        <div className="folder-hero-laser-tab" aria-hidden="true" />

        {/* Top Row: Folder Icon Badge, Status Pill, Three-Dot Menu */}
        <div className="folder-hero-top-row">
          <div className="folder-hero-badge-group">
            <div className="folder-hero-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
              </svg>
            </div>
            <span className={`folder-hero-status-pill ${studyProgress >= 100 ? 'is-mastered' : ''}`}>
              {statusLabel}
            </span>
          </div>

          <button
            type="button"
            className="folder-hero-dots-btn"
            aria-label="Folder Options"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
        </div>

        {/* Main Title, Subtitle, and Study Type */}
        <div className="folder-hero-title-section">
          <h1 className="folder-hero-title">{folderTitle}</h1>
          <p className="folder-hero-subtitle">{folderSubtitle}</p>
          <div className="folder-hero-studytype-pill">
            <span>🗂</span>
            <span>FLASHCARDS</span>
          </div>
        </div>

        {/* Progress Bar Section */}
        <div className="folder-hero-progress-section">
          <div className="folder-hero-progress-header">
            <span className="folder-hero-progress-pct">{studyProgress}% Complete</span>
            <span className="folder-hero-progress-ratio">
              {totalFlashcards > 0
                ? `${masteredCards} / ${totalFlashcards} Mastered Cards`
                : '0 / 0 Mastered Cards'}
            </span>
          </div>
          <div className="folder-hero-progress-track">
            <div
              className="folder-hero-progress-fill"
              style={{ width: `${studyProgress}%` }}
            />
          </div>
        </div>

        {/* Stats Row (Bottom of reference card) */}
        <div className="folder-hero-stats-row">
          <div className="folder-hero-stats-left">
            {folder?.lessons ? (
              <div className="folder-stat-badge" title={`${folder.lessons} Lessons in this unit`}>
                <span className="folder-stat-badge-icon">📚</span>
                <span>{folder.lessons} Lessons</span>
              </div>
            ) : null}

            <div className="folder-stat-badge is-cards-highlight" title="Total flashcards in this deck">
              <span className="folder-stat-badge-icon">🗂</span>
              <span>Cards: {totalFlashcards}</span>
            </div>

            <div className="folder-stat-badge" title="Number of studied cards">
              <span className="folder-stat-badge-icon">⚡</span>
              <span>Studied: {studiedCards}</span>
            </div>

            <div className="folder-stat-badge is-mastered-highlight" title="Number of mastered cards">
              <span className="folder-stat-badge-icon">✓</span>
              <span>Mastered: {masteredCards}</span>
            </div>
          </div>

          <div className="folder-hero-last-studied" title={`Last studied: ${lastStudied}`}>
            <span>🕒</span>
            <span>{lastStudied}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
