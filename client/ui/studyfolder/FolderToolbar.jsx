/**
 * FolderToolbar - Search input, filter tabs (All, My Folders, Shared With Me), and sort dropdown
 *
 * @param {Object} props
 * @param {string} props.searchQuery - Current search string
 * @param {Function} props.onSearchChange - Search input change handler
 * @param {string} props.activeFilter - 'all' | 'my-folders' | 'shared'
 * @param {Function} props.onFilterChange - Filter change handler
 * @param {string} props.sortBy - 'recent-studied' | 'recent-created' | 'progress' | 'alpha'
 * @param {Function} props.onSortChange - Sort selection handler
 */
export default function FolderToolbar({
  searchQuery,
  onSearchChange,
  activeFilter = 'all',
  onFilterChange,
  sortBy = 'recent-studied',
  onSortChange,
  archivedCount = 0,
}) {
  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'my-folders', label: 'My Folders' },
    {
      id: 'shared',
      label: (
        <>
          <span className="tab-label-full">Shared With Me</span>
          <span className="tab-label-short">Shared</span>
        </>
      ),
    },
    {
      id: 'archived',
      label: (
        <span className="filter-archive-pill-content">
          <span>📦 Archived</span>
          {archivedCount > 0 && <span className="archive-pill-count">{archivedCount}</span>}
        </span>
      ),
    },
  ];

  const sortOptions = [
    { id: 'recent-studied', label: 'Recently Studied' },
    { id: 'recent-created', label: 'Recently Created' },
    { id: 'progress', label: 'Progress' },
    { id: 'alpha', label: 'Alphabetical' },
  ];

  return (
    <div className="folder-toolbar-container">
      {/* 1. SEARCH INPUT */}
      <div className="toolbar-search-box">
        <svg
          className="search-input-icon"
          width="16"
          height="16"
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
          className="toolbar-search-input"
          placeholder="Search folders..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search folders"
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. FILTER CONTROLS & SORT DROPDOWN */}
      <div className="toolbar-controls-right">
        {/* Filter Pills with Swipeable Carousel Wrapper & Subtle Fade */}
        <div className="toolbar-filter-tabs-wrapper">
          <div className="toolbar-filter-tabs" role="tablist" aria-label="Filter folders">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={activeFilter === opt.id}
                className={`filter-tab-pill ${activeFilter === opt.id ? 'active' : ''}`}
                onClick={(e) => {
                  onFilterChange(opt.id);
                  if (e.currentTarget) {
                    e.currentTarget.scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    });
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="filter-tabs-fade-right" aria-hidden="true" />
        </div>

        {/* Sort Select Dropdown */}
        <div className="toolbar-sort-wrapper">
          <span className="sort-label">
            <svg
              className="sort-label-icon"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M7 4v16M7 4l-4 4M7 4l4 4M17 20V4M17 20l-4-4M17 20l4-4" />
            </svg>
            <span>SORT:</span>
          </span>
          <div className="custom-select-box">
            <select
              className="toolbar-sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort folders by"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="select-chevron-icon" aria-hidden="true">▾</span>
          </div>
        </div>
      </div>
    </div>
  );
}
