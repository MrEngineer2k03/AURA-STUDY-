import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReviewMode from './ReviewMode';
import StudyMode from './StudyMode';
import CreateFlashcardModal from '../Flashcards/CreateFlashcardModal';
import EditFlashcardModal from '../Flashcards/EditFlashcardModal';
import FlashcardPreviewModal from './FlashcardPreviewModal';
import '../Flashcards/Flashcards.css';
import './FlashcardFolder.css';

/**
 * FlashcardFolder - Complete and Functional Flashcard Folder Experience for AURA
 *
 * Implements:
 * 1. Web View (2-Column Desktop Grid based on reference image):
 *    - Top bar: Breadcrumbs on left, Coins + Bell on right (no left sidebar)
 *    - Left Column:
 *        - Top Folder Card (Title, Subtitle, Folder icon, Options menu)
 *        - Progress & Stats Card (% complete, progress bar, 3 stat boxes, last studied)
 *        - Study Launcher ([ 🔒 Study ] button + "Add a card to unlock studying.")
 *    - Right Column:
 *        - Header row ("Flashcards" title + "+ New flashcard" button)
 *        - Main Deck Container (Empty state with "+ Create your first flashcard" or Active cards list)
 * 2. Mobile View:
 *    - Single-column responsive layout matching Image 3 with mobile bottom actions.
 * 3. Study Mode & Review Mode.
 *
 * @param {Object} props
 * @param {Object} props.folder - The study folder currently being viewed
 * @param {Function} props.onBackToFolders - Return to folders grid
 * @param {Function} props.onUpdateFolder - Sync updated folder to parent
 */
export default function FlashcardFolder({
  folder,
  onBackToFolders,
  onUpdateFolder,
}) {
  const currentFolder = folder || {
    id: 'folder-default',
    title: 'Test',
    subtitle: 'for test',
    flashcards: [],
  };

  // Helper to normalize card objects
  const normalizeCards = (rawList = []) => {
    return rawList.map((card, idx) => ({
      id: card.id || `card-${Date.now()}-${idx}`,
      folderId: currentFolder.id,
      question: card.question || card.front || 'Untitled Question',
      answer: card.answer || card.back || '',
      front: card.question || card.front || '',
      back: card.answer || card.back || '',
      status: card.status || 'new', // 'new' | 'learning' | 'mastered'
      createdAt: card.createdAt || new Date().toISOString(),
      studiedAt: card.studiedAt || null,
      studyCount: typeof card.studyCount === 'number' ? card.studyCount : (card.status && card.status !== 'new' ? 1 : 0),
      correctCount: typeof card.correctCount === 'number' ? card.correctCount : (card.status === 'mastered' ? 1 : 0),
      lessonTag: card.lessonTag || undefined,
    }));
  };

  const [cards, setCards] = useState(() => normalizeCards(currentFolder.flashcards || []));

  // Active view: 'overview' | 'review' | 'study'
  const [activeView, setActiveView] = useState('overview');

  // Modals & Menu state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [previewingCardData, setPreviewingCardData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Deck view search and filter state
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'learning' | 'mastered' | 'new'
  const [searchQuery, setSearchQuery] = useState('');

  // Subtle Toast Notification
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

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

  // Sync state if folder id or cards change
  useEffect(() => {
    if (currentFolder.flashcards) {
      setCards(normalizeCards(currentFolder.flashcards));
    }
  }, [currentFolder.id, currentFolder.flashcards]);

  // Statistics
  const totalFlashcards = cards.length;
  const studiedCards = totalFlashcards > 0
    ? cards.filter((c) => (c.status && c.status !== 'new') || (c.studyCount > 0)).length
    : 0;
  const masteredCards = totalFlashcards > 0
    ? cards.filter((c) => c.status === 'mastered').length
    : 0;
  const learningCards = totalFlashcards > 0
    ? cards.filter((c) => c.status === 'learning').length
    : 0;

  const studyProgress = totalFlashcards > 0
    ? Math.round((masteredCards / totalFlashcards) * 100)
    : 0;

  const folderTitle = currentFolder.title || 'Test';
  const folderSubtitle = currentFolder.subtitle || currentFolder.description || 'for test';

  // Sync updated cards with parent folder and storage
  const syncCardsWithFolder = (updatedCards) => {
    setCards(updatedCards);

    if (onUpdateFolder) {
      const mastered = updatedCards.filter((c) => c.status === 'mastered').length;
      const progress =
        updatedCards.length > 0
          ? Math.round((mastered / updatedCards.length) * 100)
          : 0;

      onUpdateFolder({
        ...currentFolder,
        flashcards: updatedCards,
        cards: updatedCards.length,
        progress,
        status: progress >= 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'New',
        lastStudied: 'Just now',
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // 1. Create Card Handler
  const handleCreateCard = (newCardData) => {
    const newCard = {
      id: `card-${Date.now()}`,
      folderId: currentFolder.id,
      question: newCardData.question,
      answer: newCardData.answer,
      front: newCardData.question,
      back: newCardData.answer,
      status: 'new',
      createdAt: new Date().toISOString(),
      studyCount: 0,
      correctCount: 0,
      lessonTag: newCardData.lessonTag,
    };

    const updated = [newCard, ...cards];
    syncCardsWithFolder(updated);
    showToast('Flashcard created successfully!');
  };

  // 2. Edit Card Handler
  const handleEditCard = (updatedCard) => {
    const updated = cards.map((c) => (c.id === updatedCard.id ? updatedCard : c));
    syncCardsWithFolder(updated);
    setEditingCard(null);
    showToast('Flashcard updated successfully!');
  };

  // 3. Delete Card Handler
  const handleDeleteCard = (cardId) => {
    const updated = cards.filter((c) => c.id !== cardId);
    syncCardsWithFolder(updated);
    showToast('Flashcard deleted.');
  };

  // 4. Duplicate Card Handler
  const handleDuplicateCard = (card) => {
    const duplicate = {
      ...card,
      id: `card-${Date.now()}`,
      question: `${card.question || card.front} (Copy)`,
      front: `${card.question || card.front} (Copy)`,
      status: 'new',
      createdAt: new Date().toISOString(),
      studyCount: 0,
      correctCount: 0,
    };
    const updated = [duplicate, ...cards];
    syncCardsWithFolder(updated);
    showToast('Flashcard duplicated!');
  };

  // 5. Record Study Result (Mastered vs Learning)
  const handleRecordStudyResult = (cardId, isCorrect) => {
    const updated = cards.map((c) => {
      if (c.id === cardId) {
        return {
          ...c,
          status: isCorrect ? 'mastered' : 'learning',
          studyCount: (c.studyCount || 0) + 1,
          correctCount: isCorrect ? (c.correctCount || 0) + 1 : (c.correctCount || 0),
          studiedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    syncCardsWithFolder(updated);
  };

  // 6. Study Session Complete Handler
  const handleSessionComplete = (summary) => {
    showToast(`Session complete! +${summary.xpEarned} XP earned.`);
  };

  // 7. Folder Options Menu Handler
  const handleFolderAction = (action) => {
    setIsMenuOpen(false);
    if (action === 'rename') {
      const newTitle = window.prompt('Rename folder:', folderTitle);
      if (newTitle && newTitle.trim()) {
        const updated = { ...currentFolder, title: newTitle.trim() };
        if (onUpdateFolder) onUpdateFolder(updated);
        showToast(`Folder renamed to "${newTitle.trim()}".`);
      }
    } else if (action === 'archive') {
      if (onUpdateFolder) {
        onUpdateFolder({ ...currentFolder, isArchived: true });
      }
      if (onBackToFolders) onBackToFolders();
      showToast(`Folder "${folderTitle}" moved to archive.`);
    } else if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete "${folderTitle}"?`)) {
        if (onBackToFolders) onBackToFolders();
        showToast(`Folder "${folderTitle}" deleted.`);
      }
    }
  };

  // 8. Study button click handler
  const handleSelectStudy = () => {
    if (totalFlashcards === 0) {
      showToast('Before you start studying, you need to create flashcards for this folder.');
      setIsCreateModalOpen(true);
    } else {
      setActiveView('study');
    }
  };

  // Filtered Cards for Active Deck View
  const filteredCards = useMemo(() => {
    if (totalFlashcards === 0) return [];
    return cards.filter((card) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const questionMatch = (card.question || card.front || '').toLowerCase().includes(q);
        const answerMatch = (card.answer || card.back || '').toLowerCase().includes(q);
        if (!questionMatch && !answerMatch) return false;
      }
      if (activeFilter === 'learning') return card.status === 'learning';
      if (activeFilter === 'mastered') return card.status === 'mastered';
      if (activeFilter === 'new') return !card.status || card.status === 'new';
      return true;
    });
  }, [cards, totalFlashcards, activeFilter, searchQuery]);

  return (
    <div className="flashcard-folder-root" role="region" aria-label="Flashcard Folder Experience">
      {/* Cyber ambient background lighting */}
      <div className="folder-view-ambient-glow" aria-hidden="true" />

      {/* VIEW 1: STUDY MODE (Dedicated focused quiz session) */}
      {activeView === 'study' ? (
        <StudyMode
          cards={cards}
          folder={currentFolder}
          onExit={() => setActiveView('overview')}
          onRecordStudyResult={handleRecordStudyResult}
          onSessionComplete={handleSessionComplete}
        />
      ) : activeView === 'review' ? (
        /* VIEW 2: REVIEW MODE (Full deck management workspace) */
        <ReviewMode
          cards={cards}
          folder={currentFolder}
          onBackToOverview={() => setActiveView('overview')}
          onCreateCard={handleCreateCard}
          onEditCard={handleEditCard}
          onDeleteCard={handleDeleteCard}
          onDuplicateCard={handleDuplicateCard}
        />
      ) : (
        /* VIEW 3: FLASHCARD FOLDER OVERVIEW (Responsive Web & Mobile Layout) */
        <div className="flashcard-overview-inner-stage">
          {/* ========================================================
              TOP BAR: Breadcrumbs (Left) + Coins & Notifications (Right)
              ======================================================== */}
          <div className="folder-web-top-bar">
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

            <div className="folder-web-top-right">
              <div className="coins-badge">
                <span>🪙</span>
                <span>2,450</span>
              </div>
              <button
                type="button"
                className="icon-btn-round"
                aria-label="Notifications"
              >
                🔔
              </button>
            </div>
          </div>

          {/* ========================================================
              MAIN GRID: Left Column (Folder & Stats) + Right Column (Deck)
              ======================================================== */}
          <div className="folder-web-main-grid">
            {/* ---------------- LEFT COLUMN ---------------- */}
            <aside className="folder-web-left-col">
              {/* 1. Top Folder Info Card */}
              <div className="folder-top-card">
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
                        onClick={() => handleFolderAction('rename')}
                      >
                        <span>✏️</span>
                        <span>Rename Folder</span>
                      </button>
                      <button
                        type="button"
                        className="folder-dots-item"
                        role="menuitem"
                        onClick={() => handleFolderAction('archive')}
                      >
                        <span>📦</span>
                        <span>Archive Folder</span>
                      </button>
                      <div className="folder-dots-divider" />
                      <button
                        type="button"
                        className="folder-dots-item is-danger"
                        role="menuitem"
                        onClick={() => handleFolderAction('delete')}
                      >
                        <span>🗑️</span>
                        <span>Delete Folder</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Progress & Stats Card (Matching Web Reference Image) */}
              <div className={`folder-web-stats-card ${totalFlashcards === 0 ? 'is-empty-deck' : ''}`}>
                <div className="folder-web-progress-header">
                  <span className="folder-web-progress-pct">{studyProgress}% complete</span>
                  <span className="folder-web-progress-ratio">
                    {totalFlashcards > 0 ? `${masteredCards} / ${totalFlashcards} mastered` : '0 / 0 mastered'}
                  </span>
                </div>

                <div className="folder-web-progress-track">
                  <div
                    className="folder-web-progress-fill"
                    style={{ width: `${studyProgress}%` }}
                  />
                </div>

                <div className="folder-web-stats-row">
                  <div className="folder-web-stat-box">
                    <span className="folder-web-stat-val is-cards">{totalFlashcards}</span>
                    <span className="folder-web-stat-label">Cards</span>
                  </div>
                  <div className="folder-web-stat-box">
                    <span className="folder-web-stat-val is-studied">{studiedCards}</span>
                    <span className="folder-web-stat-label">Studied</span>
                  </div>
                  <div className="folder-web-stat-box">
                    <span className="folder-web-stat-val is-mastered">{masteredCards}</span>
                    <span className="folder-web-stat-label">Mastered</span>
                  </div>
                </div>

                <div className="folder-web-last-studied">
                  {totalFlashcards > 0 ? (currentFolder.lastStudied || 'Recently') : 'Not studied yet'}
                </div>
              </div>

              {/* Mobile Divider Line between Stats and Deck Container */}
              <div className="folder-mobile-divider" aria-hidden="true" />

              {/* 3. Study Launcher (Bottom of Left Column) */}
              <div className="folder-web-study-launcher">
                <button
                  type="button"
                  className={`btn-folder-study-action ${totalFlashcards === 0 ? 'is-locked' : 'is-unlocked'}`}
                  onClick={handleSelectStudy}
                  aria-label={totalFlashcards === 0 ? 'Study deck locked' : 'Start study session'}
                >
                  {totalFlashcards === 0 ? (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span>Study</span>
                    </>
                  ) : (
                    <>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      <span>Study</span>
                    </>
                  )}
                </button>
                {totalFlashcards === 0 && (
                  <p className="folder-web-study-hint">Add a card to unlock studying.</p>
                )}
              </div>
            </aside>

            {/* ---------------- RIGHT COLUMN (MAIN WORKSPACE) ---------------- */}
            <main className="folder-web-right-col">
              {/* Header Row: Flashcards Title + New Flashcard Button */}
              <div className="folder-web-deck-header">
                <h2 className="folder-web-deck-title">Flashcards</h2>
                <button
                  type="button"
                  className="btn-web-new-flashcard"
                  onClick={() => setIsCreateModalOpen(true)}
                  aria-label="Add new flashcard"
                >
                  <span className="plus-sign" aria-hidden="true">+</span>
                  <span>New flashcard</span>
                </button>
              </div>

              {/* Main Deck Container */}
              <div className={`folder-web-deck-container ${totalFlashcards === 0 ? 'is-empty-deck' : 'is-active-deck'}`}>
                {totalFlashcards === 0 ? (
                  /* EMPTY STATE MATCHING REFERENCE IMAGE */
                  <div className="folder-web-deck-empty">
                    <div className="folder-deck-empty-icon-box" aria-hidden="true">
                      <svg
                        width="26"
                        height="30"
                        viewBox="0 0 24 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 2H14L20 8V24C20 25.1046 19.1046 26 18 26H4C2.89543 26 2 25.1046 2 24V4C2 2.89543 2.89543 2 4 2Z"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 2V8H20"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M11 13V19M8 16H14"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <h3 className="folder-deck-empty-title">No flashcards yet</h3>
                    <p className="folder-deck-empty-desc">
                      Add your first question and answer to start building this deck.
                    </p>

                    <button
                      type="button"
                      className="btn-create-first-card-center"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      <span className="plus-sign" aria-hidden="true">+</span>
                      <span>Create your first flashcard</span>
                    </button>
                  </div>
                ) : (
                  /* ACTIVE CARDS DECK VIEW */
                  <div className="folder-deck-active-content">
                    {/* Filter Tabs & Search Bar */}
                    <div className="folder-deck-filter-bar">
                      <div className="folder-deck-tabs-group" role="tablist">
                        <button
                          type="button"
                          className={`folder-deck-tab-pill ${activeFilter === 'all' ? 'active' : ''}`}
                          onClick={() => setActiveFilter('all')}
                          role="tab"
                          aria-selected={activeFilter === 'all'}
                        >
                          All <span className="tab-pill-count">{cards.length}</span>
                        </button>
                        <button
                          type="button"
                          className={`folder-deck-tab-pill is-learning ${activeFilter === 'learning' ? 'active' : ''}`}
                          onClick={() => setActiveFilter('learning')}
                          role="tab"
                          aria-selected={activeFilter === 'learning'}
                        >
                          Learning <span className="tab-pill-count">{learningCards}</span>
                        </button>
                        <button
                          type="button"
                          className={`folder-deck-tab-pill is-mastered ${activeFilter === 'mastered' ? 'active' : ''}`}
                          onClick={() => setActiveFilter('mastered')}
                          role="tab"
                          aria-selected={activeFilter === 'mastered'}
                        >
                          Mastered <span className="tab-pill-count">{masteredCards}</span>
                        </button>
                      </div>

                      <div className="folder-deck-search-wrap">
                        <input
                          type="text"
                          className="folder-deck-search-input"
                          placeholder="Search cards..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          aria-label="Search flashcards"
                        />
                      </div>
                    </div>

                    {/* Cards Scrollable Stream */}
                    <div className="folder-deck-cards-list">
                      {filteredCards.map((card, idx) => {
                        const question = card.question || card.front || 'Untitled Question';
                        const answer = card.answer || card.back || 'No answer';
                        const status = (card.status || 'new').toLowerCase();

                        return (
                          <div
                            key={card.id || `card-${idx}`}
                            className="folder-deck-card-item"
                            onClick={() => setPreviewingCardData({ card, idx })}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setPreviewingCardData({ card, idx });
                              }
                            }}
                            aria-label={`Flashcard: ${question}`}
                          >
                            <div className="folder-card-item-header">
                              <span className="folder-card-item-idx">#{idx + 1}</span>
                              <span className={`folder-card-status-chip is-${status}`}>
                                {status === 'mastered' ? '✓ Mastered' : status === 'learning' ? '⚡ Learning' : '✦ New'}
                              </span>
                            </div>

                            <div className="folder-card-item-q">{question}</div>
                            <div className="folder-card-item-a">{answer}</div>

                            <div className="folder-card-item-footer" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                className="folder-card-action-btn"
                                onClick={() => setPreviewingCardData({ card, idx })}
                                title="Flip and preview card"
                              >
                                <span>👁 Preview</span>
                              </button>
                              <button
                                type="button"
                                className="folder-card-action-btn"
                                onClick={() => setEditingCard(card)}
                                title="Edit question & answer"
                              >
                                <span>✏️ Edit</span>
                              </button>
                              <button
                                type="button"
                                className="folder-card-action-btn is-delete"
                                onClick={() => handleDeleteCard(card.id)}
                                title="Delete card"
                              >
                                <span>🗑️</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>

          {/* Mobile Bottom Action Bar (shown on mobile, hidden on desktop via CSS) */}
          <div className="folder-deck-bottom-actions mobile-only-bar">
            <button
              type="button"
              className={`btn-folder-study-action ${totalFlashcards === 0 ? 'is-locked' : 'is-unlocked'}`}
              onClick={handleSelectStudy}
              aria-label={totalFlashcards === 0 ? 'Study deck locked' : 'Start study session'}
            >
              {totalFlashcards === 0 ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span>Study</span>
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  <span>Study</span>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-folder-new-flashcard"
              onClick={() => setIsCreateModalOpen(true)}
              aria-label="Add a new flashcard"
            >
              <span className="plus-sign" aria-hidden="true">+</span>
              <span>New flashcard</span>
            </button>
          </div>

          {/* Create Flashcard Modal */}
          <CreateFlashcardModal
            isOpen={isCreateModalOpen}
            folderTitle={folderTitle}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={(newCardData) => {
              handleCreateCard(newCardData);
              setIsCreateModalOpen(false);
            }}
          />

          {/* Edit Flashcard Modal */}
          <EditFlashcardModal
            isOpen={Boolean(editingCard)}
            card={editingCard}
            onClose={() => setEditingCard(null)}
            onSave={(updatedCard) => handleEditCard(updatedCard)}
          />

          {/* Preview Flashcard Modal */}
          <FlashcardPreviewModal
            isOpen={Boolean(previewingCardData)}
            card={previewingCardData?.card}
            index={previewingCardData?.idx || 0}
            onClose={() => setPreviewingCardData(null)}
          />
        </div>
      )}

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div className="flashcards-toast" role="status">
          <span className="toast-sparkle-icon">✦</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
