import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReviewMode from './ReviewMode';
import StudyMode from './StudyMode';
import { FlipCardsStudy } from '../Flipcards';
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

  const DEFAULT_FOLDER_CARDS = [
    {
      id: 'fc-aura-01',
      question: 'Who is the prettiest woman in your life?',
      answer: 'Stepanie',
      status: 'learning',
    },
    {
      id: 'fc-aura-02',
      question: "Newton's first law",
      answer: 'An object stays at rest or in motion unless a net force acts on it.',
      status: 'learning',
    },
    {
      id: 'fc-aura-03',
      question: 'sin²θ + cos²θ',
      answer: '1',
      status: 'learning',
    },
    {
      id: 'fc-aura-04',
      question: 'Derivative of x²',
      answer: '2x',
      status: 'mastered',
    },
    {
      id: 'fc-aura-05',
      question: 'Unit of force',
      answer: 'Newton',
      status: 'learning',
    },
  ];

  // Helper to normalize card objects
  const normalizeCards = (rawList = []) => {
    const listToUse = rawList && rawList.length > 0 ? rawList : DEFAULT_FOLDER_CARDS;
    return listToUse.map((card, idx) => ({
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
  const [activeView, setActiveView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('study')) {
      return 'study';
    }
    return 'overview';
  });

  // Modals & Menu state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [previewingCardData, setPreviewingCardData] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Mobile-specific UI State (Redesigned Mobile Experience)
  const [isMobileFolderMenuOpen, setIsMobileFolderMenuOpen] = useState(false);
  const mobileFolderMenuRef = useRef(null);
  const [activeCardMenuId, setActiveCardMenuId] = useState(null);
  const [expandedCardIds, setExpandedCardIds] = useState(() => new Set());
  const [isFabOpen, setIsFabOpen] = useState(false);

  const toggleCardExpanded = (cardId) => {
    setExpandedCardIds((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  };

  // Close menus on outside click
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (mobileFolderMenuRef.current && !mobileFolderMenuRef.current.contains(e.target)) {
        setIsMobileFolderMenuOpen(false);
      }
      if (!e.target.closest('.mobile-card-dots-wrap')) {
        setActiveCardMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    document.addEventListener('touchstart', handleGlobalClick);
    return () => {
      document.removeEventListener('mousedown', handleGlobalClick);
      document.removeEventListener('touchstart', handleGlobalClick);
    };
  }, []);

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

      {/* VIEW 1: 3D FLIP CARD STUDY MODE (Dedicated interactive 3D learning session) */}
      {activeView === 'study' || activeView === 'flipcards' ? (
        <FlipCardsStudy
          cards={cards}
          folder={currentFolder}
          onClose={() => setActiveView('overview')}
          onRecordStudyResult={handleRecordStudyResult}
          onSwitchToQuiz={() => setActiveView('quiz')}
        />
      ) : activeView === 'quiz' ? (
        /* VIEW 1B: MULTIPLE-CHOICE QUIZ MODE */
        <StudyMode
          cards={cards}
          folder={currentFolder}
          onExit={() => setActiveView('overview')}
          onBackToFolders={onBackToFolders || (() => setActiveView('overview'))}
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
              DESKTOP VIEW (Visible on desktop screens, hidden on mobile)
              ======================================================== */}
          <div className="folder-desktop-view-wrap">
            {/* TOP BAR: Breadcrumbs (Left) + Coins & Notifications (Right) */}
            <div className="folder-web-top-bar">
              <nav className="folder-breadcrumbs-bar" aria-label="Breadcrumb">
                <button
                  type="button"
                  className="folder-breadcrumb-btn"
                  onClick={onBackToFolders}
                  title="Back to My Folders"
                >
                  <span className="folder-breadcrumb-back-icon" aria-hidden="true">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </span>
                  <span className="folder-breadcrumb-btn-label">My Folders</span>
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

            {/* MAIN GRID: Left Column (Folder & Stats) + Right Column (Deck) */}
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

                {/* 2. Progress & Stats Card */}
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

                {/* 3. Study Launcher */}
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
                        <span>Study Flip Cards</span>
                      </>
                    )}
                  </button>
                  {totalFlashcards > 0 && (
                    <button
                      type="button"
                      className="btn-folder-quiz-secondary"
                      onClick={() => setActiveView('quiz')}
                      title="Practice in timed Multiple-Choice Quiz mode"
                    >
                      <span>⏱ Practice Quiz</span>
                    </button>
                  )}
                  {totalFlashcards === 0 && (
                    <p className="folder-web-study-hint">Add a card to unlock studying.</p>
                  )}
                </div>
              </aside>

              {/* ---------------- RIGHT COLUMN ---------------- */}
              <main className="folder-web-right-col">
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

                <div className={`folder-web-deck-container ${totalFlashcards === 0 ? 'is-empty-deck' : 'is-active-deck'}`}>
                  {totalFlashcards === 0 ? (
                    <div className="folder-web-deck-empty">
                      <div className="folder-deck-empty-icon-box" aria-hidden="true">
                        <svg width="26" height="30" viewBox="0 0 24 28" fill="none">
                          <path d="M4 2H14L20 8V24C20 25.1046 19.1046 26 18 26H4C2.89543 26 2 25.1046 2 24V4C2 2.89543 2.89543 2 4 2Z" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round" />
                          <path d="M14 2V8H20" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round" />
                          <path d="M11 13V19M8 16H14" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
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
                    <div className="folder-deck-active-content">
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
          </div>

          {/* ========================================================
              MOBILE VIEW (Redesigned matching Image 2 & Image 3)
              ======================================================== */}
          <div className="folder-mobile-view-wrap">
            {/* 1. Header Row (Back, Title & Subtitle, 3-dots Menu) */}
            <header className="folder-mobile-header">
              <button
                type="button"
                className="folder-mobile-back-btn"
                onClick={onBackToFolders}
                aria-label="Back to My Folders"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="folder-mobile-title-box">
                <h1 className="folder-mobile-title">{folderTitle}</h1>
                <p className="folder-mobile-subtitle">Flashcards • {folderSubtitle}</p>
              </div>

              <div className="folder-mobile-menu-wrap" ref={mobileFolderMenuRef}>
                <button
                  type="button"
                  className="folder-mobile-dots-btn"
                  onClick={() => setIsMobileFolderMenuOpen((prev) => !prev)}
                  aria-label="Folder Options"
                  aria-expanded={isMobileFolderMenuOpen}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="5" cy="12" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="19" cy="12" r="2" />
                  </svg>
                </button>

                {isMobileFolderMenuOpen && (
                  <div className="folder-mobile-dropdown-menu" role="menu">
                    <button
                      type="button"
                      className="folder-dots-item"
                      onClick={() => {
                        setIsMobileFolderMenuOpen(false);
                        handleFolderAction('rename');
                      }}
                    >
                      <span>✏️</span>
                      <span>Rename Folder</span>
                    </button>
                    <button
                      type="button"
                      className="folder-dots-item"
                      onClick={() => {
                        setIsMobileFolderMenuOpen(false);
                        handleFolderAction('archive');
                      }}
                    >
                      <span>📦</span>
                      <span>Archive Folder</span>
                    </button>
                    <div className="folder-dots-divider" />
                    <button
                      type="button"
                      className="folder-dots-item is-danger"
                      onClick={() => {
                        setIsMobileFolderMenuOpen(false);
                        handleFolderAction('delete');
                      }}
                    >
                      <span>🗑️</span>
                      <span>Delete Folder</span>
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* 2. Hero Progress & Stats Card */}
            <section className="folder-mobile-hero-stats" aria-label="Progress & Statistics">
              <div className="mobile-hero-ring-box">
                <svg className="mobile-hero-ring-svg" width="70" height="70" viewBox="0 0 70 70">
                  <circle
                    cx="35"
                    cy="35"
                    r="28"
                    className="mobile-hero-ring-track"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="5.5"
                  />
                  <circle
                    cx="35"
                    cy="35"
                    r="28"
                    className="mobile-hero-ring-fill"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="5.5"
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * (1 - studyProgress / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 35 35)"
                  />
                </svg>
                <span className="mobile-hero-ring-pct">{studyProgress}%</span>
              </div>

              <div className="mobile-hero-meta">
                <h2 className="mobile-hero-headline">
                  {masteredCards} of {totalFlashcards} mastered
                </h2>
                <p className="mobile-hero-subheadline">
                  {totalFlashcards > 0 && totalFlashcards === masteredCards
                    ? 'All cards mastered. Outstanding job!'
                    : `${Math.max(0, totalFlashcards - masteredCards)} cards left to master. You've got this!`}
                </p>
                <div className="mobile-hero-stats-row">
                  <span className="mobile-hero-stat">
                    <strong>{totalFlashcards}</strong> Cards
                  </span>
                  <span className="mobile-hero-stat">
                    <strong>{learningCards}</strong> Learning
                  </span>
                  <span className="mobile-hero-stat">
                    <strong>{masteredCards}</strong> Mastered
                  </span>
                </div>
              </div>
            </section>

            {/* 3. Filter Pills & Search Bar */}
            <div className="mobile-controls-section">
              <div className="mobile-filter-pills" role="tablist">
                <button
                  type="button"
                  className={`mobile-filter-pill ${activeFilter === 'all' ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                  role="tab"
                  aria-selected={activeFilter === 'all'}
                >
                  <span>All</span> <span className="mobile-pill-badge">{totalFlashcards}</span>
                </button>
                <button
                  type="button"
                  className={`mobile-filter-pill is-learning ${activeFilter === 'learning' ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter('learning')}
                  role="tab"
                  aria-selected={activeFilter === 'learning'}
                >
                  <span>Learning</span> <span className="mobile-pill-badge">{learningCards}</span>
                </button>
                <button
                  type="button"
                  className={`mobile-filter-pill is-mastered ${activeFilter === 'mastered' ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter('mastered')}
                  role="tab"
                  aria-selected={activeFilter === 'mastered'}
                >
                  <span>Mastered</span> <span className="mobile-pill-badge">{masteredCards}</span>
                </button>
              </div>

              <div className="mobile-search-bar">
                <svg className="mobile-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="mobile-search-input"
                  placeholder="Search your cards"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search your cards"
                />
              </div>
            </div>

            {/* 4. Cards Stream */}
            <div className="mobile-cards-stream">
              {filteredCards.length === 0 ? (
                <div className="mobile-cards-empty">
                  <p className="mobile-empty-text">No cards match the current filter or search.</p>
                </div>
              ) : (
                filteredCards.map((card, idx) => {
                  const question = card.question || card.front || 'Untitled Question';
                  const answer = card.answer || card.back || 'No answer';
                  const status = (card.status || 'new').toLowerCase();
                  const isExpanded = expandedCardIds.has(card.id);
                  const isCardMenuOpen = activeCardMenuId === card.id;

                  return (
                    <div key={`mob-${card.id || idx}`} className={`mobile-card-card is-${status}`}>
                      {/* Left accent stripe */}
                      <div className={`mobile-card-stripe is-${status}`} aria-hidden="true" />

                      {/* Card Header: #idx, Status Pill, 3-dots */}
                      <div className="mobile-card-top-row">
                        <span className="mobile-card-index">#{idx + 1}</span>

                        <div className="mobile-card-top-actions">
                          <span className={`mobile-card-status-pill is-${status}`}>
                            {status === 'mastered' ? (
                              <>
                                <span className="pill-icon">✓</span>
                                <span>Mastered</span>
                              </>
                            ) : status === 'learning' ? (
                              <>
                                <span className="pill-icon">⚡</span>
                                <span>Learning</span>
                              </>
                            ) : (
                              <>
                                <span className="pill-icon">✦</span>
                                <span>New</span>
                              </>
                            )}
                          </span>

                          <div className="mobile-card-dots-wrap">
                            <button
                              type="button"
                              className="mobile-card-dots-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCardMenuId(isCardMenuOpen ? null : card.id);
                              }}
                              aria-label="Card Options"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="19" r="2" />
                              </svg>
                            </button>

                            {isCardMenuOpen && (
                              <div className="mobile-card-dropdown" role="menu">
                                <button
                                  type="button"
                                  className="mobile-dropdown-item"
                                  onClick={() => {
                                    setActiveCardMenuId(null);
                                    setPreviewingCardData({ card, idx });
                                  }}
                                >
                                  <span>👁</span>
                                  <span>Preview</span>
                                </button>
                                <button
                                  type="button"
                                  className="mobile-dropdown-item"
                                  onClick={() => {
                                    setActiveCardMenuId(null);
                                    setEditingCard(card);
                                  }}
                                >
                                  <span>✏️</span>
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  className="mobile-dropdown-item"
                                  onClick={() => {
                                    setActiveCardMenuId(null);
                                    handleDuplicateCard(card);
                                  }}
                                >
                                  <span>📋</span>
                                  <span>Duplicate</span>
                                </button>
                                <div className="mobile-dropdown-divider" />
                                <button
                                  type="button"
                                  className="mobile-dropdown-item is-danger"
                                  onClick={() => {
                                    setActiveCardMenuId(null);
                                    handleDeleteCard(card.id);
                                  }}
                                >
                                  <span>🗑️</span>
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Question Text */}
                      <h3 className="mobile-card-question">{question}</h3>

                      {/* Revealed Answer (when expanded) */}
                      {isExpanded && (
                        <div className="mobile-card-revealed-answer">
                          {answer}
                        </div>
                      )}

                      {/* Tap to see answer toggle button */}
                      <button
                        type="button"
                        className="mobile-card-answer-toggle"
                        onClick={() => toggleCardExpanded(card.id)}
                        aria-expanded={isExpanded}
                      >
                        <svg
                          className={`mobile-chevron-icon ${isExpanded ? 'is-expanded' : ''}`}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                        <span>{isExpanded ? 'Tap to hide answer' : 'Tap to see answer'}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* 5. Floating Action Button (FAB) & Menu */}
            <div className="folder-mobile-fab-wrap">
              {isFabOpen && (
                <div
                  className="mobile-fab-backdrop"
                  onClick={() => setIsFabOpen(false)}
                  aria-hidden="true"
                />
              )}

              {isFabOpen && (
                <div className="mobile-fab-menu" role="menu">
                  {/* Practice Quiz */}
                  <button
                    type="button"
                    className="mobile-fab-menu-item"
                    onClick={() => {
                      setIsFabOpen(false);
                      setActiveView('quiz');
                    }}
                  >
                    <div className="fab-item-icon-box is-quiz">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="3" />
                      </svg>
                    </div>
                    <div className="fab-item-text">
                      <span className="fab-item-title">Practice Quiz</span>
                      <span className="fab-item-desc">Test yourself with choices</span>
                    </div>
                  </button>

                  {/* Flip Card */}
                  <button
                    type="button"
                    className="mobile-fab-menu-item"
                    onClick={() => {
                      setIsFabOpen(false);
                      handleSelectStudy();
                    }}
                  >
                    <div className="fab-item-icon-box is-flip">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="23 4 23 10 17 10" />
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                      </svg>
                    </div>
                    <div className="fab-item-text">
                      <span className="fab-item-title">Flip Card</span>
                      <span className="fab-item-desc">Review by flipping cards</span>
                    </div>
                  </button>

                  {/* Add New Card */}
                  <button
                    type="button"
                    className="mobile-fab-menu-item"
                    onClick={() => {
                      setIsFabOpen(false);
                      setIsCreateModalOpen(true);
                    }}
                  >
                    <div className="fab-item-icon-box is-add">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <div className="fab-item-text">
                      <span className="fab-item-title">Add New Card</span>
                      <span className="fab-item-desc">Create a new flashcard</span>
                    </div>
                  </button>
                </div>
              )}

              <button
                type="button"
                className={`mobile-fab-btn ${isFabOpen ? 'is-open' : ''}`}
                onClick={() => setIsFabOpen((prev) => !prev)}
                aria-label={isFabOpen ? 'Close study menu' : 'Open study menu'}
                aria-expanded={isFabOpen}
              >
                {isFabOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="16" height="14" rx="3" />
                    <path d="M6 3h12a3 3 0 0 1 3 3v10" />
                  </svg>
                )}
              </button>
            </div>
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
