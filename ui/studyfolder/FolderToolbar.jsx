import React, { useState, useRef, useEffect } from 'react';

/**
 * FolderToolbar - Modern Student-Friendly Search & Filter Toolbar
 *
 * Mobile Design:
 * - Row 1: Search input on left + View mode toggle group on right (Grid/List icons preserved)
 * - Row 2: Sole "All" dropdown filter button (with live count, glowing dot indicator, and dropdown menu)
 *   Other pills are displayed on desktop only.
 *
 * @param {Object} props
 * @param {string} props.searchQuery - Current search text
 * @param {Function} props.onSearchChange - Change callback for search
 * @param {string} props.activeFilter - 'all' | 'in-progress' | 'completed' | 'shared' | 'new'
 * @param {Function} props.onFilterChange - Callback when filter changes
 * @param {Object} [props.filterCounts={ all: 6, inProgress: 3, completed: 1, shared: 1, new: 1 }]
 * @param {string} [props.sortBy='recent-studied']
 * @param {Function} [props.onSortChange]
 * @param {string} [props.viewMode='grid'] - 'grid' | 'list'
 * @param {Function} [props.onViewModeChange] - Callback to toggle grid vs list
 */
export default function FolderToolbar({
  searchQuery = '',
  onSearchChange,
  activeFilter = 'all',
  onFilterChange,
  filterCounts = { all: 6, inProgress: 3, completed: 1, shared: 1, new: 1 },
  sortBy = 'recent-studied',
  onSortChange,
  viewMode = 'grid',
  onViewModeChange,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside or Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const filterTabs = [
    { id: 'all', label: 'All', count: filterCounts.all, dotColor: null },
    { id: 'in-progress', label: 'In progress', count: filterCounts.inProgress, dotColor: '#3b82f6' },
    { id: 'new', label: 'Not started', count: filterCounts.new, dotColor: '#ff4d6d', isNew: true },
    { id: 'completed', label: 'Completed', count: filterCounts.completed, dotColor: '#10b981' },
    { id: 'shared', label: 'Shared', count: filterCounts.shared, dotColor: '#a855f7' },
  ];

  const activeTab = filterTabs.find((t) => t.id === activeFilter) || filterTabs[0];
  const hasNew = (filterCounts.new || 0) > 0;

  return (
    <div
      className={`folders-redesign-toolbar ${isDropdownOpen ? 'has-dropdown-open' : ''}`}
      role="toolbar"
      aria-label="Folder search and filters"
    >
      {/* ROW 1: SEARCH & MOBILE VIEW TOGGLE */}
      <div className="frt-top-row">
        {/* Search Input */}
        <div className="frt-search-wrapper">
          <svg
            className="frt-search-icon"
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            type="text"
            className="frt-search-input"
            placeholder="Search folders"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            aria-label="Search folders"
          />

          {searchQuery && (
            <button
              type="button"
              className="frt-search-clear"
              onClick={() => onSearchChange && onSearchChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Mode Toggle: displayed in top row on mobile */}
        <div className="frt-view-toggle-group frt-view-toggle-mobile" role="group" aria-label="View layout">
          <button
            type="button"
            className={`frt-view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
            onClick={() => onViewModeChange && onViewModeChange('grid')}
            title="Grid view"
            aria-label="Grid view"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </button>

          <button
            type="button"
            className={`frt-view-btn ${viewMode === 'list' ? 'is-active' : ''}`}
            onClick={() => onViewModeChange && onViewModeChange('list')}
            title="List view"
            aria-label="List view"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* ROW 2: FILTER DROPDOWN (Mobile sole filter) & DESKTOP PILLS */}
      <div className="frt-filter-pills" role="tablist" aria-label="Filter folders by status">
        {/* DROPDOWN FILTER BUTTON (Always visible; on mobile this is the sole filter control) */}
        <div className="frt-all-pill-container" ref={dropdownRef}>
          <button
            type="button"
            className={`frt-pill-btn frt-all-pill-btn ${activeFilter !== 'all' ? 'is-filtered' : 'is-active'} ${isDropdownOpen ? 'is-open' : ''}`}
            role="button"
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-label={`Filter folders. Current filter: ${activeTab.label}`}
          >
            <span>{activeTab.label}</span>
            {typeof activeTab.count === 'number' && (
              <span className="frt-pill-count">{activeTab.count}</span>
            )}
            {hasNew && (
              <span
                className="frt-new-indicator-dot"
                title={`${filterCounts.new} new folder${filterCounts.new > 1 ? 's' : ''} available`}
                aria-label="New folders available"
              />
            )}
            <svg
              className={`frt-pill-chevron ${isDropdownOpen ? 'is-rotated' : ''}`}
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* FLOATING DROPDOWN MENU */}
          {isDropdownOpen && (
            <div className="frt-mobile-filter-menu" role="listbox" aria-label="Filter folders by status">
              {filterTabs.map((tab) => {
                const isSelected = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`frt-filter-menu-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      onFilterChange && onFilterChange(tab.id);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="frt-item-left">
                      {tab.dotColor ? (
                        <span
                          className={`frt-status-dot ${tab.isNew ? 'is-new-dot' : ''}`}
                          style={{ backgroundColor: tab.dotColor }}
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="frt-status-dot frt-status-dot-all" aria-hidden="true" />
                      )}
                      <span className="frt-item-label">{tab.label}</span>
                      {tab.isNew && hasNew && (
                        <span className="frt-new-tag">NEW</span>
                      )}
                    </div>

                    <div className="frt-item-right">
                      {typeof tab.count === 'number' && (
                        <span className={`frt-item-count ${isSelected ? 'is-selected' : ''}`}>
                          {tab.count}
                        </span>
                      )}
                      {isSelected && (
                        <svg
                          className="frt-item-check"
                          width="13"
                          height="13"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* DESKTOP-ONLY PILLS (hidden on mobile) */}
        {filterTabs.slice(1).map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`frt-pill-btn frt-desktop-pill ${isActive ? 'is-active' : ''}`}
              role="tab"
              aria-selected={isActive}
              onClick={() => onFilterChange && onFilterChange(tab.id)}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className="frt-pill-count">{tab.count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* CONTROLS ON RIGHT (Desktop only) */}
      <div className="frt-controls-right frt-controls-desktop">
        <div className="frt-view-toggle-group" role="group" aria-label="View layout">
          <button
            type="button"
            className={`frt-view-btn ${viewMode === 'grid' ? 'is-active' : ''}`}
            onClick={() => onViewModeChange && onViewModeChange('grid')}
            title="Grid view"
            aria-label="Grid view"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
          </button>

          <button
            type="button"
            className={`frt-view-btn ${viewMode === 'list' ? 'is-active' : ''}`}
            onClick={() => onViewModeChange && onViewModeChange('list')}
            title="List view"
            aria-label="List view"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
