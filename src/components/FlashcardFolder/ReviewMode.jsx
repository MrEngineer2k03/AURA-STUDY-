import React, { useState, useMemo } from 'react';
import FlashcardList from './FlashcardList';
import FlashcardPreviewModal from './FlashcardPreviewModal';
import CreateFlashcardModal from '../Flashcards/CreateFlashcardModal';
import EditFlashcardModal from '../Flashcards/EditFlashcardModal';
import '../Flashcards/Flashcards.css';

/**
 * ReviewMode - Dedicated flashcard management workspace
 *
 * @param {Object} props
 * @param {Array<Object>} props.cards - List of cards in current folder
 * @param {Object} props.folder - Folder data
 * @param {Function} props.onBackToOverview - Callback to return to folder overview
 * @param {Function} props.onCreateCard - (newCardData) => void
 * @param {Function} props.onEditCard - (updatedCard) => void
 * @param {Function} props.onDeleteCard - (cardId) => void
 * @param {Function} props.onDuplicateCard - (card) => void
 */
export default function ReviewMode({
  cards = [],
  folder,
  onBackToOverview,
  onCreateCard,
  onEditCard,
  onDeleteCard,
  onDuplicateCard,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'new' | 'learning' | 'mastered'

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [previewingCardData, setPreviewingCardData] = useState(null);
  const [deletingCardId, setDeletingCardId] = useState(null);

  // Counts for filters
  const counts = useMemo(() => {
    return {
      all: cards.length,
      new: cards.filter((c) => (c.status || 'new') === 'new').length,
      learning: cards.filter((c) => c.status === 'learning').length,
      mastered: cards.filter((c) => c.status === 'mastered').length,
    };
  }, [cards]);

  // Filtered Cards Pipeline
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const qMatch = (card.question || card.front || '').toLowerCase().includes(query);
        const aMatch = (card.answer || card.back || '').toLowerCase().includes(query);
        const tagMatch = (card.lessonTag || '').toLowerCase().includes(query);
        if (!qMatch && !aMatch && !tagMatch) return false;
      }

      // 2. Status Filter
      if (activeFilter === 'new') return (card.status || 'new') === 'new';
      if (activeFilter === 'learning') return card.status === 'learning';
      if (activeFilter === 'mastered') return card.status === 'mastered';

      return true;
    });
  }, [cards, searchQuery, activeFilter]);

  const handleConfirmDelete = () => {
    if (!deletingCardId) return;
    onDeleteCard(deletingCardId);
    setDeletingCardId(null);
  };

  return (
    <div className="review-mode-root" role="region" aria-label="Review Flashcards">
      {/* 1. PAGE HEADER */}
      <div className="review-header-container">
        <div className="review-header-left">
          <button
            type="button"
            className="review-back-btn"
            onClick={onBackToOverview}
          >
            ← Back to Folder Overview
          </button>
          <h1 className="review-header-title">REVIEW FLASHCARDS</h1>
          <p className="review-header-subtitle">
            Review, organize, and manage your study cards.
          </p>
        </div>

        <button
          type="button"
          className="btn-add-flashcard-primary"
          onClick={() => setIsCreateOpen(true)}
        >
          <span style={{ fontSize: '16px', fontWeight: 900 }}>+</span>
          <span>Add Flashcard</span>
        </button>
      </div>

      {/* 2. SEARCH & FILTER TOOLBAR */}
      <div className="review-toolbar-row">
        {/* Search Field */}
        <div className="review-search-box">
          <span className="review-search-icon" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="review-search-input"
            placeholder="Search flashcards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="review-filter-group" role="radiogroup" aria-label="Filters">
          <button
            type="button"
            className={`review-filter-pill ${activeFilter === 'all' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            <span>All Cards</span>
            <span className="review-filter-count">{counts.all}</span>
          </button>

          <button
            type="button"
            className={`review-filter-pill ${activeFilter === 'new' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('new')}
          >
            <span>New</span>
            <span className="review-filter-count">{counts.new}</span>
          </button>

          <button
            type="button"
            className={`review-filter-pill ${activeFilter === 'learning' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('learning')}
          >
            <span>Learning</span>
            <span className="review-filter-count">{counts.learning}</span>
          </button>

          <button
            type="button"
            className={`review-filter-pill ${activeFilter === 'mastered' ? 'is-active' : ''}`}
            onClick={() => setActiveFilter('mastered')}
          >
            <span>Mastered</span>
            <span className="review-filter-count">{counts.mastered}</span>
          </button>
        </div>
      </div>

      {/* 3. FLASHCARD LIST */}
      <FlashcardList
        cards={filteredCards}
        onEditCard={(card) => setEditingCard(card)}
        onDeleteCard={(cardId) => setDeletingCardId(cardId)}
        onDuplicateCard={onDuplicateCard}
        onPreviewCard={(card, idx) => setPreviewingCardData({ card, index: idx })}
        onCreateCard={() => setIsCreateOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Create Modal */}
      <CreateFlashcardModal
        isOpen={isCreateOpen}
        folderTitle={folder?.title || 'Study Folder'}
        onClose={() => setIsCreateOpen(false)}
        onCreate={(newCard) => {
          onCreateCard(newCard);
          setIsCreateOpen(false);
        }}
      />

      {/* 2. Edit Modal */}
      <EditFlashcardModal
        isOpen={Boolean(editingCard)}
        card={editingCard}
        onClose={() => setEditingCard(null)}
        onSave={(updatedCard) => {
          onEditCard(updatedCard);
          setEditingCard(null);
        }}
      />

      {/* 3. Preview Modal */}
      <FlashcardPreviewModal
        isOpen={Boolean(previewingCardData)}
        card={previewingCardData?.card}
        index={previewingCardData?.index}
        onClose={() => setPreviewingCardData(null)}
      />

      {/* 4. Delete Confirmation Dialog */}
      {deletingCardId && (
        <div className="aura-modal-overlay" onClick={() => setDeletingCardId(null)} role="presentation">
          <div
            className="flashcard-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-del-title"
          >
            <div className="modal-top-accent-laser" aria-hidden="true" />
            <div className="modal-header-section">
              <div className="modal-header-info">
                <div className="modal-eyebrow-tag">
                  <span>⚠️</span> CONFIRM DELETION
                </div>
                <h2 id="confirm-del-title" className="modal-headline-title">
                  DELETE FLASHCARD?
                </h2>
                <p className="modal-subtext">
                  Are you sure you want to delete this card? This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setDeletingCardId(null)}
              >
                ✕
              </button>
            </div>
            <div className="modal-actions-row" style={{ padding: '20px 28px' }}>
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setDeletingCardId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-submit"
                onClick={handleConfirmDelete}
                style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}
              >
                Delete Flashcard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
