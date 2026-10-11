import { useState, useRef } from 'react';

/**
 * FolderFilesModal - Allows users to view files in a study folder and archive or restore individual files.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Object} props.folder - The folder whose files are being inspected
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onArchiveFile - (file, folderId) => void
 * @param {Function} props.onRestoreFile - (file, folderId) => void
 * @param {Function} props.onDeleteFile - (fileId, folderId) => void
 * @param {Function} props.onAddFile - (newFile, folderId) => void
 */
export default function FolderFilesModal({
  isOpen,
  folder,
  onClose,
  onArchiveFile,
  onRestoreFile,
  onDeleteFile,
  onAddFile,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen || !folder) return null;

  const files = folder.lessonItems || [];
  const activeFiles = files.filter((f) => !f.isArchived);
  const archivedFilesInFolder = files.filter((f) => f.isArchived);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileSelect = (uploadedList) => {
    if (!uploadedList || uploadedList.length === 0) return;
    const file = uploadedList[0];
    const allowedExts = ['pdf', 'docx', 'txt', 'pptx'];
    const ext = file.name.split('.').pop().toLowerCase();

    const newFile = {
      id: `file-${Date.now()}`,
      folderId: folder.id,
      folderTitle: folder.title,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileType: allowedExts.includes(ext) ? ext.toUpperCase() : 'DOC',
      isArchived: false,
      createdAt: new Date().toISOString(),
    };

    if (onAddFile) {
      onAddFile(newFile, folder.id);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="aura-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="aura-modal-dialog files-inspector-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="files-modal-title"
      >
        <div className="modal-laser-notch" aria-hidden="true" />

        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="modal-badge-tag">
              <span className="red-slant-icon">📁</span> FOLDER MATERIALS & FILES
            </div>
            <h2 id="files-modal-title" className="modal-headline">
              {folder.title}
            </h2>
            <p className="files-modal-subtext">
              {folder.subtitle || folder.department} · {activeFiles.length} active files, {archivedFilesInFolder.length} archived
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="files-modal-body">
          {/* Quick upload dropzone */}
          <div
            className={`file-upload-mini-dropzone ${isDragging ? 'is-dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <span className="mini-dropzone-icon">📤</span>
            <span className="mini-dropzone-text">
              <strong>Upload new file</strong> to this folder (PDF, DOCX, TXT, PPTX)
            </span>
            <button
              type="button"
              className="mini-dropzone-btn"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse
            </button>
          </div>

          {/* Files List */}
          <div className="files-inspector-list">
            <h4 className="inspector-section-heading">FOLDER FILES & MATERIALS</h4>

            {files.length === 0 ? (
              <div className="files-empty-notice">
                <p>No lesson files currently in this folder.</p>
                <span>Upload a PDF, DOCX, or PPTX to review and extract flashcards.</span>
              </div>
            ) : (
              <div className="files-list-scroll">
                {files.map((file) => {
                  const isFileArchived = Boolean(file.isArchived);
                  return (
                    <div
                      key={file.id}
                      className={`inspector-file-row ${isFileArchived ? 'is-file-archived' : ''}`}
                    >
                      <div className="inspector-file-main">
                        <div className={`file-badge file-badge-${(file.fileType || 'doc').toLowerCase()}`}>
                          {file.fileType || 'DOC'}
                        </div>
                        <div className="inspector-file-text">
                          <div className="inspector-file-title-line">
                            <span className="inspector-file-name" title={file.fileName}>
                              {file.fileName}
                            </span>
                            {isFileArchived ? (
                              <span className="file-status-badge is-archived">
                                📦 ARCHIVED
                              </span>
                            ) : (
                              <span className="file-status-badge is-active">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <span className="inspector-file-size">
                            {file.fileSize || '1.0 MB'} · {file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'Ready'}
                          </span>
                        </div>
                      </div>

                      <div className="inspector-file-actions">
                        {isFileArchived ? (
                          <button
                            type="button"
                            className="btn-file-action-restore"
                            onClick={() => onRestoreFile && onRestoreFile(file, folder.id)}
                            title="Restore this file back to active folder"
                          >
                            <span className="btn-icon">♻️</span> Restore
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn-file-action-archive"
                            onClick={() => onArchiveFile && onArchiveFile(file, folder.id)}
                            title="Archive this file into Archive Section"
                          >
                            <span className="btn-icon">📦</span> Archive File
                          </button>
                        )}

                        <button
                          type="button"
                          className="btn-file-action-delete"
                          onClick={() => {
                            if (window.confirm(`Delete file "${file.fileName}"?`)) {
                              if (onDeleteFile) onDeleteFile(file.id, folder.id);
                            }
                          }}
                          title="Delete file"
                          aria-label="Delete file"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-actions-footer">
          <button
            type="button"
            className="btn-modal-cancel"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
