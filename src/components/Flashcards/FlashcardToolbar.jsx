import React from 'react';

/**
 * FlashcardToolbar - Search, filter, and sort bar for the flashcards collection
 *
 * @param {Object} props
 * @param {string} props.searchQuery - Current search string
 * @param {Function} props.onSearchChange - (value) => void
 * @param {'all' | 'new' | 'learning' | 'mastered'} props.activeFilter - Current status filter
 * @param {Function} props.onFilterChange - (filterKey) => void
 * @param {'recent' | 'alphabetical'} props.sortBy - Current sort method
 * @param {Function} props.onSortChange - (sortKey) => void
 * @param {Object} props.counts - { all: number, new: number, learning: number, mastered: number }
 */
export default function FlashcardToolbar({
  searchQuery = '',
  onSearchChange,
  activeFilter = 'all',
  onFilterChange,
  sortBy = 'recent',
  onSortChange,
  counts = { all: 0, new: 0, learning: 0, mastered: 0 },
}) {
  const filterOptions = [
    { id: 'all', label: 'All Cards', count: counts.all },
    { id: 'new', label: 'New', count: counts.new },
    { id: 'learning', label: 'Learning', count: counts.learning },
    { id: 'mastered', label: 'Mastered', count: counts.mastered },
  ];

  return (
    <div className="flashcards-toolbar-container" role="toolbar" aria-label="Flashcards Toolbar">
      <div className="toolbar-left-group">
        {/* 1. SEARCH INPUT */}
        <div className="flashcards-search-box">
          <span className="search-input-icon" aria-hidden="true">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className="flashcards-search-input"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search questions"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* 2. FILTER PILLS */}
        <div className="flashcards-filter-pills" role="radiogroup" aria-label="Status Filters">
          {filterOptions.map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                className={`filter-pill-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onFilterChange(filter.id)}
                role="radio"
                aria-checked={isActive}
              >
                <span>{filter.label}</span>
                <span className="filter-pill-count">{filter.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. SORT SELECTOR */}
      <div className="toolbar-right-group">
        <label htmlFor="flashcard-sort-select" className="sort-label-text">
          Sort:
        </label>
        <select
          id="flashcard-sort-select"
          className="sort-select-dropdown"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="recent">Recently Created</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
    </div>
  );
}
