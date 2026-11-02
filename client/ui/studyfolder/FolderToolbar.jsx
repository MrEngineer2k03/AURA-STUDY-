import React from 'react';

/**
 * FolderToolbar - Modern Student-Friendly Search & Filter Toolbar
 * Matches reference design:
 * - Search input on left with magnifying glass icon
 * - Filter pills with live counts: All 6, In progress 3, Completed 1, Shared 1, New 1
 * - Sort dropdown on right: "Recently studied ⌵"
 * - View mode toggles: Grid & List
 *
 * @param {Object} props
 * @param {string} props.searchQuery - Current search text
 * @param {Function} props.onSearchChange - Change callback for search
 * @param {string} props.activeFilter - 'all' | 'in-progress' | 'completed' | 'shared' | 'new'
 * @param {Function} props.onFilterChange - Callback when filter pill changes
 * @param {Object} [props.filterCounts={ all: 6, inProgress: 3, completed: 1, shared: 1, new: 1 }]
 * @param {string} props.sortBy - 'recent-studied' | 'recent-created' | 'progress' | 'alpha'
 * @param {Function} props.onSortChange - Callback when sorting changes
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
  const filterTabs = [
    { id: 'all', label: 'All', count: filterCounts.all },
    { id: 'in-progress', label: 'In progress', count: filterCounts.inProgress },
    { id: 'completed', label: 'Completed', count: filterCounts.completed },
    { id: 'shared', label: 'Shared', count: filterCounts.shared },
    { id: 'new', label: 'New', count: filterCounts.new },
  ];

  return (
    <div className="folders-redesign-toolbar" role="toolbar" aria-label="Folder search and filters">
      {/* 1. SEARCH INPUT */}
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

      {/* 2. FILTER PILLS WITH COUNTS */}
      <div className="frt-filter-pills" role="tablist" aria-label="Filter folders by status">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`frt-pill-btn ${isActive ? 'is-active' : ''}`}
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

      {/* 3. CONTROLS ON RIGHT: SORT & VIEW TOGGLES */}
      <div className="frt-controls-right">
        {/* Sort Dropdown */}
        <div className="frt-sort-wrapper">
          <select
            className="frt-sort-select"
            value={sortBy}
            onChange={(e) => onSortChange && onSortChange(e.target.value)}
            aria-label="Sort folders"
          >
            <option value="recent-studied">Recently studied</option>
            <option value="recent-created">Recently created</option>
            <option value="progress">Progress</option>
            <option value="alpha">Alphabetical</option>
          </select>
          <span className="frt-sort-chevron" aria-hidden="true">⌵</span>
        </div>

        {/* View Mode Toggle (Grid vs List) */}
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
