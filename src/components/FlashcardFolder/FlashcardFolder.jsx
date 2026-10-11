import React, { useState, useEffect, useRef } from 'react';
import FlashcardFolderHeader from './FlashcardFolderHeader';
import FlashcardModeSelector from './FlashcardModeSelector';
import ReviewMode from './ReviewMode';
import StudyMode from './StudyMode';
import CreateFlashcardModal from '../Flashcards/CreateFlashcardModal';
import '../Flashcards/Flashcards.css';
import './FlashcardFolder.css';

/**
 * FlashcardFolder - Complete and Functional Flashcard Folder Experience for AURA
 *
 * Implements:
 * 1. Overview Page:
 *    - Breadcrumbs: My Folders / [Folder Title] / Flashcards
 *    - Folder Info Hero Card: Title, Subtitle, Progress Bar, Stats (Total, Studied, Mastered, Last Studied)
 *    - Two Large Interactive Options: [ REVIEW FLASHCARDS ] and [ START STUDYING ]
 *    - Empty State Detection: If 0 cards, shows attractive empty states with [+ CREATE YOUR FIRST FLASHCARD]
 * 2. Review Mode:
 *    - Full management workspace: Search, Filters (All/New/Learning/Mastered), Card List
 *    - Interactions: Edit, Delete, Duplicate, Preview, Add Flashcard
 * 3. Study Mode:
 *    - Focused distraction-free multiple-choice quiz session
 *    - Requires at least 1 card to study (cannot launch with 0 cards)
 *    - Instant validation, XP progression, option locking, distractor generation
 *    - Post-session Results & Review Mistakes
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
    title: 'Physics Midterms',
    subtitle: 'Forces & Motion',
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

  // Modal dialog for creating a card directly from Overview empty states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  // Sync state if folder id or cards change
  useEffect(() => {
    if (currentFolder.flashcards) {
      setCards(normalizeCards(currentFolder.flashcards));
    }
  }, [currentFolder.id, currentFolder.flashcards]);

  // Sync updated cards with parent folder and storage
  const syncCardsWithFolder = (updatedCards) => {
    setCards(updatedCards);

    if (onUpdateFolder) {
      const masteredCount = updatedCards.filter((c) => c.status === 'mastered').length;
      const progress =
        updatedCards.length > 0
          ? Math.round((masteredCount / updatedCards.length) * 100)
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

  return (
    <div className="flashcard-folder-root" role="region" aria-label="Flashcard Folder Experience">
      {/* Cyber ambient background lighting */}
      <div className="folder-view-ambient-glow" aria-hidden="true" />

      {/* VIEW 1: STUDY MODE (Dedicated focused interface) */}
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
        /* VIEW 3: FLASHCARD FOLDER OVERVIEW (Main landing page for folder) */
        <>
          {/* Header with Breadcrumbs & Hero Card */}
          <FlashcardFolderHeader
            folder={currentFolder}
            cards={cards}
            onBackToFolders={onBackToFolders}
          />

          {/* The Two Large Interactive Options */}
          <FlashcardModeSelector
            cardCount={cards.length}
            onSelectReview={() => setActiveView('review')}
            onSelectStudy={() => {
              if (cards.length === 0) {
                showToast('Before you start studying, you need to create flashcards for this folder.');
                setIsCreateModalOpen(true);
              } else {
                setActiveView('study');
              }
            }}
            onCreateFirstCard={() => setIsCreateModalOpen(true)}
          />

          {/* Modal for creating flashcard directly from Overview empty states */}
          <CreateFlashcardModal
            isOpen={isCreateModalOpen}
            folderTitle={currentFolder.title}
            onClose={() => setIsCreateModalOpen(false)}
            onCreate={(newCardData) => {
              handleCreateCard(newCardData);
              setIsCreateModalOpen(false);
            }}
          />
        </>
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
