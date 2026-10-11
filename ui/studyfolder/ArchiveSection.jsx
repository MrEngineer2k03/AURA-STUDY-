import { useState, useMemo } from 'react';
import StudyFolderCard from './StudyFolderCard';

/**
 * ArchiveSection - Dedicated Archive Vault for AURA Study Platform
 * Displays archived study folders and archived lesson files with restoration and permanent delete options.
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
  const [sortBy, setSortBy] = useState('recent-archived'); // 'recent-archived' | 'alpha' | 'progress'

  const totalArchivedCount = archivedFolders.length + archivedFiles.length;

  const totalFlashcards = useMemo(() => {
    return archivedFolders.reduce((acc, f) => {
      const count = Array.isArray(f.flashcards) ? f.flashcards.length : 0;
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
        return new Date(b.archivedAt || b.createdAt || 0) - new Date(a.archivedAt || a.createdAt || 0);
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
        return new Date(b.archivedAt || b.createdAt || 0) - new Date(a.archivedAt || a.createdAt || 0);
      });
  }, [archivedFiles, searchQuery, sortBy]);

  const handleFolderAction = (actionType, folder) => {
    if (actionType === 'restore') {
      if (onRestoreFolder) onRestoreFolder(folder);
    } else if (actionType === 'delete') {
      if (window.confirm(`Permanently delete archived folder "${folder.title}"? This cannot be undone.`)) {
        if (onDeleteFolder) onDeleteFolder(folder.id);
      }
    } else if (actionType === 'open') {
      if (onOpenFolder) onOpenFolder(folder);
    } else if (actionType === 'inspectFiles') {
      if (onInspectFiles) onInspectFiles(folder);
    }
  };

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return 'Recently';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  // If nothing is archived at all
  if (totalArchivedCount === 0) {
    return (
      <div className="archive-section-stage">
        <div className="archive-empty-vault">
          <div className="archive-vault-hologram">
            <span className="vault-glow-ring" aria-hidden="true" />
            <span className="vault-icon-symbol">📦</span>
          </div>

          <h2 className="archive-empty-title">Archive Vault is Empty</h2>
          <p className="archive-empty-desc">
            No study folders or files have been archived yet. You can archive any study folder or uploaded lesson file from the active library using the options menu (•••).
          </p>

          <button
            type="button"
            className="btn-back-to-library-large"
            onClick={onBackToFolders}
          >
            <span className="btn-back-arrow">←</span> Return to My Folders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="archive-section-stage" role="region" aria-label="Archive Vault">
      {/* 1. OVERVIEW & STATS BAR */}
      <div className="archive-overview-banner">
        <div className="archive-banner-left">
          <div className="archive-shield-icon-box">
            <span className="archive-shield-icon">📦</span>
          </div>
          <div className="archive-banner-info">
            <div className="archive-banner-headline">
              STUDY ARCHIVE REPOSITORY
            </div>
            <p className="archive-banner-subtext">
              Archived items are preserved with complete study progress and flashcard sets intact.
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

      {/* 2. ARCHIVE TOOLBAR (SEARCH, SUB-TABS & SORT) */}
      <div className="archive-toolbar">
        {/* Search */}
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

        {/* Sub-Tabs: All | Folders | Files */}
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

        {/* Sort Select */}
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
            <span className="select-chevron-icon" aria-hidden="true">▾</span>
          </div>
        </div>
      </div>

      {/* 3. CONTENT AREA: FOLDERS AND/OR FILES */}

      {/* FOLDERS SECTION */}
      {(activeTab === 'all' || activeTab === 'folders') && (
        <section className="archive-content-block">
          <div className="archive-block-header">
            <div className="block-title-row">
              <span className="block-title-icon">📁</span>
              <h3 className="block-title">ARCHIVED FOLDERS</h3>
              <span className="block-count-badge">{filteredFolders.length}</span>
            </div>
            <span className="block-hint">Folders you can restore back into your main study grid</span>
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

      {/* FILES SECTION */}
      {(activeTab === 'all' || activeTab === 'files') && (
        <section className="archive-content-block">
          <div className="archive-block-header">
            <div className="block-title-row">
              <span className="block-title-icon">📄</span>
              <h3 className="block-title">ARCHIVED FILES & MATERIALS</h3>
              <span className="block-count-badge">{filteredFiles.length}</span>
            </div>
            <span className="block-hint">Individual lesson files and study documents that have been archived</span>
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
                      <div className={`file-badge file-badge-${(file.fileType || 'doc').toLowerCase()}`}>
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

                    <div className="file-cell-size">
                      {file.fileSize || '1.2 MB'}
                    </div>

                    <div className="file-cell-date">
                      {formatDate(file.archivedAt)}
                    </div>

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
  );
}
