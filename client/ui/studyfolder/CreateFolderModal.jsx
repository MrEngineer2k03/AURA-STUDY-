import { useState, useRef } from 'react';

/**
 * CreateFolderModal - Upgraded Study Creation Flow for AURA
 * 
 * Contains:
 * - Folder Name (required)
 * - Description
 * - Subject / Department dropdown
 * - Accent Color selector
 * - Lessons: ONLY [Upload File] supporting PDF, DOCX, TXT, PPTX
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onCreate - Form submission handler (folderData) => void
 */
export default function CreateFolderModal({ isOpen, onClose, onCreate }) {
  const [folderName, setFolderName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [accentColor, setAccentColor] = useState('red');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const departments = [
    'Engineering',
    'Computer Science',
    'Mathematics',
    'Physics',
    'Chemistry',
    'General Education',
  ];

  const colors = [
    { id: 'red', label: 'AURA Red', hex: '#ff2a44' },
    { id: 'blue', label: 'Cobalt Blue', hex: '#3b82f6' },
    { id: 'purple', label: 'Arcane Purple', hex: '#a855f7' },
    { id: 'cyan', label: 'Cyber Cyan', hex: '#06b6d4' },
    { id: 'orange', label: 'Solar Orange', hex: '#f97316' },
  ];

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileExtension = (name) => {
    if (!name) return 'FILE';
    const ext = name.split('.').pop();
    return ext ? ext.toUpperCase() : 'DOC';
  };

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const allowedExts = ['pdf', 'docx', 'txt', 'pptx'];
    const ext = file.name.split('.').pop().toLowerCase();
    
    // Support file even if extension is missing, but default check
    setUploadedFile({
      name: file.name,
      size: formatFileSize(file.size),
      sizeBytes: file.size,
      type: allowedExts.includes(ext) ? ext.toUpperCase() : 'DOC',
      rawFile: file,
      uploadedAt: new Date().toISOString(),
    });
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

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    const folderId = `folder-${Date.now()}`;
    const initialLessons = uploadedFile
      ? [
          {
            id: `lesson-${Date.now()}`,
            folderId: folderId,
            title: uploadedFile.name.replace(/\.[^/.]+$/, ''),
            sourceType: 'file',
            fileName: uploadedFile.name,
            fileSize: uploadedFile.size,
            fileType: uploadedFile.type,
            content: '',
            createdAt: new Date().toISOString(),
          },
        ]
      : [];

    const newFolder = {
      id: folderId,
      ownerId: 'user-carl',
      title: folderName.trim(),
      subtitle: description.trim() || `${department} Materials`,
      description: description.trim() || `${department} Study Materials`,
      subject: department,
      department: department,
      progress: 0,
      lessons: initialLessons.length,
      lessonItems: initialLessons,
      completed: 0,
      completedLessons: 0,
      members: 1,
      status: 'New',
      color: accentColor,
      studyType: null, // Will be chosen in Study Type Selection step
      flashcards: [],
      lastStudied: 'Just created',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreate(newFolder);
    // Reset form state
    setFolderName('');
    setDescription('');
    setUploadedFile(null);
    onClose();
  };

  return (
    <div className="aura-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="aura-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Top Laser Accent */}
        <div className="modal-laser-notch" aria-hidden="true" />

        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <div className="modal-badge-tag">
              <span className="red-slant-icon">/</span> STEP 1 · FOLDER INITIALIZATION
            </div>
            <h2 id="modal-title" className="modal-headline">
              Create New Study Folder
            </h2>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-form-body">
          {/* 1. Folder Name */}
          <div className="modal-field-group">
            <label className="modal-field-label" htmlFor="folder-name-input">
              Folder Name <span className="field-required">*</span>
            </label>
            <input
              id="folder-name-input"
              type="text"
              className="modal-text-input"
              placeholder="e.g. Physics Midterms"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              autoFocus
              required
            />
          </div>

          {/* 2. Description */}
          <div className="modal-field-group">
            <label className="modal-field-label" htmlFor="folder-desc-input">
              Description
            </label>
            <input
              id="folder-desc-input"
              type="text"
              className="modal-text-input"
              placeholder="e.g. Forces, Energy & Motion Study Unit"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* 3. Subject / Department & Color Swatches */}
          <div className="modal-form-row">
            <div className="modal-field-group flex-1">
              <label className="modal-field-label" htmlFor="folder-dept-select">
                Subject / Department
              </label>
              <div className="custom-select-box">
                <select
                  id="folder-dept-select"
                  className="modal-select-input"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <span className="select-chevron-icon" aria-hidden="true">▾</span>
              </div>
            </div>

            <div className="modal-field-group">
              <label className="modal-field-label">Accent Color</label>
              <div className="color-swatch-row">
                {colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`color-swatch-btn ${accentColor === c.id ? 'active' : ''}`}
                    style={{ background: c.hex }}
                    onClick={() => setAccentColor(c.id)}
                    title={c.label}
                    aria-label={`Select ${c.label}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 4. Lessons: Upload File ONLY */}
          <div className="modal-lessons-section">
            <div className="modal-lessons-label-row">
              <label className="modal-field-label">
                Lessons <span className="lessons-optional-tag">(Optional File Upload)</span>
              </label>
              <span className="supported-formats-hint">PDF · DOCX · TXT · PPTX</span>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files)}
            />

            {!uploadedFile ? (
              <div
                className={`lesson-dropzone ${isDragging ? 'is-dragging' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                <div className="dropzone-icon-circle">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="dropzone-text-group">
                  <span className="dropzone-primary-text">
                    <strong>Upload File</strong> or drag & drop here
                  </span>
                  <span className="dropzone-subtext">
                    Supported: PDF, DOCX, TXT, PPTX
                  </span>
                </div>
                <button
                  type="button"
                  className="dropzone-browse-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="uploaded-file-card">
                <div className="uploaded-file-icon-box">
                  <span className="file-ext-badge">{uploadedFile.type}</span>
                </div>
                <div className="uploaded-file-details">
                  <span className="uploaded-file-name" title={uploadedFile.name}>
                    {uploadedFile.name}
                  </span>
                  <span className="uploaded-file-meta">
                    {uploadedFile.size} · Ready for flashcard extraction
                  </span>
                </div>
                <button
                  type="button"
                  className="uploaded-file-remove-btn"
                  onClick={handleRemoveFile}
                  title="Remove file"
                  aria-label="Remove uploaded file"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-modal-submit"
              disabled={!folderName.trim()}
            >
              <span>Create Folder</span>
              <span className="modal-submit-arrow">→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
