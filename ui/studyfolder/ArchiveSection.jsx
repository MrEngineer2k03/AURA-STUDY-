import { useState, useMemo } from 'react';
import StudyFolderCard from './StudyFolderCard';

/**
 * ArchiveSection - Dedicated Archive Vault for AURA Study Platform
 * Mobile view perfectly matches the new layout specification:
 * - Header with back arrow, title "Archive", subtitle, and "Restore all" button
 * - 3 side-by-side stats cards (Folders, Files, Cards)
 * - Amber notice banner ("Archived items keep their study progress and flashcards.")
 * - Search bar ("Search archive")
 * - Filter tabs (All | Folders | Files) with active wine-red border/glow
 * - Section headers ("Folders (N)", "Files (N)") with trailing line
 * - Preserves the rich flashcard folder card design from Image 4
 * - Image 1 file card layout with PDF/DOC badge, metadata, trash delete, and Restore button
 * - Bottom sheet confirmation modal for "Restore everything?" (Image 3)
 *
 * @param {Object} props
 * @param {Array<Object>} props.archivedFolders - List of folders with isArchived: true
 * @param {Array<Object>} props.archivedFiles - List of individual files with isArchived: true
 * @param {Function} props.onRestoreFolder - (folder) => void
 * @param {Function} props.onDeleteFolder - (folderId) => void
 * @param {Function} props.onOpenFolder - (folder) => void
 * @param {Function} props.onInspectFiles - (folder) => void
 * @param {Function} props.onRestoreFile - (file, folderId) => void
 * @param {Function} props.onDeleteFile - (fileId, folderId) => void
 * @param {Function} props.onRestoreAll - () => void
 * @param {Function} props.onBackToFolders - () => void
 */
export default function ArchiveSection({
  archivedFolders = [],
  archivedFiles = [],
  onRestoreFolder,
  onDeleteFolder,
  onOpenFolder,
  onInspectFiles,
  onRestoreFile,
  onDeleteFile,
  onRestoreAll,
  onBackToFolders,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'folders' | 'files'
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent-archived'); // for desktop view
  const [isRestoreAllModalOpen, setIsRestoreAllModalOpen] = useState(false);

  const totalArchivedCount = archivedFolders.length + archivedFiles.length;

  const totalFlashcards = useMemo(() => {
    return archivedFolders.reduce((acc, f) => {
      const count = Array.isArray(f.flashcards)
        ? f.flashcards.length
        : typeof f.cards === 'number'
        ? f.cards
        : 0;
      return acc + count;
    }, 0);
  }, [archivedFolders]);

  // Filtered archived folders
  const filteredFolders = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return archivedFolders
      .filter((folder) => {
        if (!query) return true;
        return (
          folder.title.toLowerCase().includes(query) ||
          folder.subtitle?.toLowerCase().includes(query) ||
          folder.department?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'progress') return (b.progress || 0) - (a.progress || 0);
        if (sortBy === 'alpha') return a.title.localeCompare(b.title);
        // Default: recent-archived
        return (
          new Date(b.archivedAt || b.createdAt || 0) -
          new Date(a.archivedAt || a.createdAt || 0)
        );
      });
  }, [archivedFolders, searchQuery, sortBy]);

  // Filtered archived files
  const filteredFiles = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return archivedFiles
      .filter((file) => {
        if (!query) return true;
        return (
          file.fileName?.toLowerCase().includes(query) ||
          file.folderTitle?.toLowerCase().includes(query) ||
          file.fileType?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'alpha') return (a.fileName || '').localeCompare(b.fileName || '');
        return (
          new Date(b.archivedAt || b.createdAt || 0) -
          new Date(a.archivedAt || a.createdAt || 0)
        );
      });
  }, [archivedFiles, searchQuery, sortBy]);

  const handleFolderAction = (actionType, folder) => {
    if (actionType === 'restore') {
      if (onRestoreFolder) onRestoreFolder(folder);
    } else if (actionType === 'delete') {
      if (
        window.confirm(
          `Permanently delete archived folder "${folder.title}"? This cannot be undone.`
        )
      ) {
        if (onDeleteFolder) onDeleteFolder(folder.id);
      }
    } else if (actionType === 'open') {
      if (onOpenFolder) onOpenFolder(folder);
    } else if (actionType === 'inspectFiles') {
      if (onInspectFiles) onInspectFiles(folder);
    }
  };

  // Format date helper (used in desktop files table)
  const formatDate = (isoString) => {
    if (!isoString) return 'Recently';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="archive-section-stage" role="region" aria-label="Archive Vault">
      {/* ================================================================= */}
      {/* 1. MOBILE ARCHIVE LAYOUT (<= 768px screens - Image 1, 2, 3 Spec) */}
      {/* ================================================================= */}
      <div className="archive-mobile-view">
        {/* Header: Back arrow + Title & Subtitle + Restore All */}
        <div className="archive-mobile-header">
          <div className="archive-mobile-header-left">
            <button
              type="button"
              className="archive-mobile-back-btn"
              onClick={onBackToFolders}
              aria-label="Back to My Folders"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <div className="archive-mobile-title-group">
              <h1 className="archive-mobile-title">Archive</h1>
              <p className="archive-mobile-subtitle">Restore anything to your library</p>
            </div>
          </div>

          <button
            type="button"
            className="archive-mobile-restore-all-btn"
            onClick={() => {
              if (totalArchivedCount > 0) {
                setIsRestoreAllModalOpen(true);
              }
            }}
            disabled={totalArchivedCount === 0}
            title={totalArchivedCount === 0 ? 'No archived items' : 'Restore all items'}
          >
            <svg
              className="restore-all-icon"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            <span>Restore all</span>
          </button>
        </div>

        {/* 3 Stats Summary Cards (Folders, Files, Cards) */}
        <div className="archive-mobile-stats-grid">
          <div className="archive-mobile-stat-card">
            <div className="stat-card-value">{archivedFolders.length}</div>
            <div className="stat-card-label">Folders</div>
          </div>
          <div className="archive-mobile-stat-card">
            <div className="stat-card-value">{archivedFiles.length}</div>
            <div className="stat-card-label">Files</div>
          </div>
          <div className="archive-mobile-stat-card">
            <div className="stat-card-value">{totalFlashcards}</div>
            <div className="stat-card-label">Cards</div>
          </div>
        </div>

        {/* Amber Notice Banner */}
        <div className="archive-mobile-notice-banner">
          <span className="notice-banner-icon" aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 8v13H3V8" />
              <path d="M1 3h22v5H1z" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          </span>
          <span className="notice-banner-text">
            Archived items keep their study progress and flashcards.
          </span>
        </div>

        {/* Search Archive Input */}
        <div className="archive-mobile-search-bar">
          <svg
            className="search-bar-icon"
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
            className="search-bar-input"
            placeholder="Search archive"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search archive"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-bar-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Tabs: All | Folders | Files */}
        <div className="archive-mobile-tabs-row" role="tablist" aria-label="Archive filter tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            className={`archive-mobile-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'folders'}
            className={`archive-mobile-tab ${activeTab === 'folders' ? 'active' : ''}`}
            onClick={() => setActiveTab('folders')}
          >
            Folders
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'files'}
            className={`archive-mobile-tab ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            Files
          </button>
        </div>

        {/* FOLDERS SECTION (Mobile) - Preserves Image 4 flashcard folder card design */}
        {(activeTab === 'all' || activeTab === 'folders') && (
          <div className="archive-mobile-section">
            <div className="archive-mobile-section-header">
              <span className="section-header-title">Folders ({filteredFolders.length})</span>
              <div className="section-header-line" aria-hidden="true" />
            </div>

            {filteredFolders.length > 0 ? (
              <div className="archive-mobile-folders-list">
                {filteredFolders.map((folder) => (
                  <div key={folder.id} className="archive-folder-item-wrapper">
                    <StudyFolderCard
                      folder={folder}
                      variant="detailed"
                      onClick={onOpenFolder}
                      onOpen={onOpenFolder}
                      onStudy={() => onRestoreFolder && onRestoreFolder(folder)}
                      onAction={handleFolderAction}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="archive-mobile-empty-hint">
                <p>No archived folders found{searchQuery ? ` matching "${searchQuery}"` : ''}.</p>
              </div>
            )}
          </div>
        )}

        {/* FILES SECTION (Mobile) - Follows Image 1 File Card Layout */}
        {(activeTab === 'all' || activeTab === 'files') && (
          <div className="archive-mobile-section">
            <div className="archive-mobile-section-header">
              <span className="section-header-title">Files ({filteredFiles.length})</span>
              <div className="section-header-line" aria-hidden="true" />
            </div>

            {filteredFiles.length > 0 ? (
              <div className="archive-mobile-files-list">
                {filteredFiles.map((file) => (
                  <div key={file.id} className="archive-mobile-file-card">
                    {/* Top Row: File Badge + Info + Delete Trash Icon */}
                    <div className="file-card-top-row">
                      <div
                        className={`file-card-badge badge-${(
                          file.fileType || 'pdf'
                        ).toLowerCase()}`}
                      >
                        {file.fileType || 'PDF'}
                      </div>
                      <div className="file-card-info">
                        <h4 className="file-card-name" title={file.fileName}>
                          {file.fileName}
                        </h4>
                        <p className="file-card-origin">
                          From {file.folderTitle || 'Physics Review'}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="file-card-delete-btn"
                        onClick={() => {
                          if (
                            window.confirm(
                              `Permanently delete "${file.fileName}"? This cannot be undone.`
                            )
                          ) {
                            if (onDeleteFile) onDeleteFile(file.id, file.folderId);
                          }
                        }}
                        aria-label="Delete file permanently"
                        title="Delete permanently"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>

                    {/* Bottom Row: Document Type & Restore Button */}
                    <div className="file-card-bottom-row">
                      <span className="file-card-category">Study document</span>
                      <button
                        type="button"
                        className="file-card-restore-btn"
                        onClick={() => onRestoreFile && onRestoreFile(file, file.folderId)}
                        aria-label={`Restore ${file.fileName}`}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                        </svg>
                        <span>Restore</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="archive-mobile-empty-hint">
                <p>No archived files found{searchQuery ? ` matching "${searchQuery}"` : ''}.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================================================================= */}
      {/* 2. DESKTOP ARCHIVE LAYOUT (> 768px screens)                        */}
      {/* ================================================================= */}
      <div className="archive-desktop-view">
        {/* OVERVIEW & STATS BAR */}
        <div className="archive-overview-banner">
          <div className="archive-banner-left">
            <div className="archive-shield-icon-box">
              <span className="archive-shield-icon">📦</span>
            </div>
            <div className="archive-banner-info">
              <div className="archive-banner-headline">STUDY ARCHIVE REPOSITORY</div>
              <p className="archive-banner-subtext">
                Archived items are preserved with complete study progress and flashcard sets
                intact.
              </p>
            </div>
          </div>

          <div className="archive-banner-stats">
            <div className="archive-stat-box">
              <span className="stat-number">{archivedFolders.length}</span>
              <span className="stat-label">Folders</span>
            </div>
            <div className="stat-divider" />
            <div className="archive-stat-box">
              <span className="stat-number">{archivedFiles.length}</span>
              <span className="stat-label">Files</span>
            </div>
            <div className="stat-divider" />
            <div className="archive-stat-box">
              <span className="stat-number">{totalFlashcards}</span>
              <span className="stat-label">Cards</span>
            </div>
          </div>
        </div>

        {/* ARCHIVE TOOLBAR */}
        <div className="archive-toolbar">
          <div className="archive-search-box">
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
              className="archive-search-input"
              placeholder="Search archived folders or files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search archive"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="archive-sub-tabs" role="tablist" aria-label="Archive view filter">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'all'}
              className={`archive-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Items ({totalArchivedCount})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'folders'}
              className={`archive-tab-btn ${activeTab === 'folders' ? 'active' : ''}`}
              onClick={() => setActiveTab('folders')}
            >
              📁 Folders ({archivedFolders.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'files'}
              className={`archive-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
              onClick={() => setActiveTab('files')}
            >
              📄 Files ({archivedFiles.length})
            </button>
          </div>

          <div className="toolbar-sort-wrapper">
            <span className="sort-label">Sort:</span>
            <div className="custom-select-box">
              <select
                className="toolbar-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort archived items"
              >
                <option value="recent-archived">Recently Archived</option>
                <option value="alpha">Alphabetical</option>
                <option value="progress">Progress</option>
              </select>
              <span className="select-chevron-icon" aria-hidden="true">
                ▾
              </span>
            </div>
          </div>
        </div>

        {/* DESKTOP CONTENT AREA */}
        {(activeTab === 'all' || activeTab === 'folders') && (
          <section className="archive-content-block">
            <div className="archive-block-header">
              <div className="block-title-row">
                <span className="block-title-icon">📁</span>
                <h3 className="block-title">ARCHIVED FOLDERS</h3>
                <span className="block-count-badge">{filteredFolders.length}</span>
              </div>
              <span className="block-hint">
                Folders you can restore back into your main study grid
              </span>
            </div>

            {filteredFolders.length > 0 ? (
              <div className="my-folders-grid" role="region" aria-label="Archived Folders Grid">
                {filteredFolders.map((folder, index) => (
                  <div
                    key={folder.id}
                    className="folder-grid-item-wrap"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <StudyFolderCard
                      folder={folder}
                      variant="detailed"
                      onClick={onOpenFolder}
                      onOpen={onOpenFolder}
                      onStudy={() => onRestoreFolder && onRestoreFolder(folder)}
                      onAction={handleFolderAction}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="archive-empty-subblock">
                <p>No archived folders found matching your search.</p>
              </div>
            )}
          </section>
        )}

        {(activeTab === 'all' || activeTab === 'files') && (
          <section className="archive-content-block">
            <div className="archive-block-header">
              <div className="block-title-row">
                <span className="block-title-icon">📄</span>
                <h3 className="block-title">ARCHIVED FILES & MATERIALS</h3>
                <span className="block-count-badge">{filteredFiles.length}</span>
              </div>
              <span className="block-hint">
                Individual lesson files and study documents that have been archived
              </span>
            </div>

            {filteredFiles.length > 0 ? (
              <div className="archived-files-container">
                <div className="archived-files-table-header">
                  <span className="th-file-name">FILE NAME</span>
                  <span className="th-folder">ORIGIN FOLDER</span>
                  <span className="th-size">SIZE</span>
                  <span className="th-date">DATE ARCHIVED</span>
                  <span className="th-actions">ACTIONS</span>
                </div>

                <div className="archived-files-table-body">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="archived-file-row">
                      <div className="file-cell-main">
                        <div
                          className={`file-badge file-badge-${(
                            file.fileType || 'doc'
                          ).toLowerCase()}`}
                        >
                          {file.fileType || 'DOC'}
                        </div>
                        <div className="file-info-col">
                          <span className="file-display-name" title={file.fileName}>
                            {file.fileName}
                          </span>
                          <span className="file-format-sub">
                            {file.fileType || 'Document'} · Lesson Resource
                          </span>
                        </div>
                      </div>

                      <div className="file-cell-folder">
                        <span className="parent-folder-pill">
                          📁 {file.folderTitle || 'Study Folder'}
                        </span>
                      </div>

                      <div className="file-cell-size">{file.fileSize || '1.2 MB'}</div>

                      <div className="file-cell-date">{formatDate(file.archivedAt)}</div>

                      <div className="file-cell-actions">
                        <button
                          type="button"
                          className="btn-file-restore"
                          onClick={() => onRestoreFile && onRestoreFile(file, file.folderId)}
                          title="Restore file to parent folder"
                        >
                          <span className="btn-icon">♻️</span> Restore File
                        </button>

                        <button
                          type="button"
                          className="btn-file-delete-icon"
                          onClick={() => {
                            if (window.confirm(`Permanently delete "${file.fileName}"?`)) {
                              if (onDeleteFile) onDeleteFile(file.id, file.folderId);
                            }
                          }}
                          title="Delete file permanently"
                          aria-label="Delete file"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="archive-empty-subblock">
                <p>No archived files found matching your search.</p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* ================================================================= */}
      {/* 3. RESTORE EVERYTHING BOTTOM SHEET MODAL (Image 3 Specification)   */}
      {/* ================================================================= */}
      {isRestoreAllModalOpen && (
        <div
          className="archive-modal-backdrop"
          onClick={() => setIsRestoreAllModalOpen(false)}
        >
          <div
            className="archive-bottom-sheet-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="restore-modal-title"
          >
            <div className="bottom-sheet-accent-line" aria-hidden="true" />
            <h3 id="restore-modal-title" className="bottom-sheet-title">
              Restore everything?
            </h3>
            <p className="bottom-sheet-desc">
              All {totalArchivedCount} archived {totalArchivedCount === 1 ? 'item goes' : 'items go'} back to your active library with their progress.
            </p>
            <div className="bottom-sheet-actions">
              <button
                type="button"
                className="bottom-sheet-btn-cancel"
                onClick={() => setIsRestoreAllModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="bottom-sheet-btn-confirm"
                onClick={() => {
                  setIsRestoreAllModalOpen(false);
                  if (onRestoreAll) onRestoreAll();
                }}
              >
                Restore all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
