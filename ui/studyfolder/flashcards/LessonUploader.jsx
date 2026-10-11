import { useState, useRef } from 'react';

/**
 * LessonUploader - Upload lesson file workflow for Flashcard Editor
 *
 * Supports PDF, DOCX, TXT, PPTX
 * Displays uploaded file state, size, remove button, and preview.
 *
 * @param {Object} props
 * @param {Object} props.file - Uploaded file object { name, size, type, rawFile }
 * @param {Function} props.onFileUpload - (fileData) => void
 * @param {Function} props.onFileRemove - () => void
 * @param {Function} props.onExtractToTextEditor - (extractedContent, title) => void
 */
export default function LessonUploader({
  file,
  onFileUpload,
  onFileRemove,
  onExtractToTextEditor,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileProcess = (files) => {
    if (!files || files.length === 0) return;
    const rawFile = files[0];
    const ext = rawFile.name.split('.').pop().toLowerCase();
    const typeLabel = ['pdf', 'docx', 'txt', 'pptx'].includes(ext)
      ? ext.toUpperCase()
      : 'DOC';

    onFileUpload({
      name: rawFile.name,
      size: formatFileSize(rawFile.size),
      sizeBytes: rawFile.size,
      type: typeLabel,
      rawFile,
      uploadedAt: new Date().toISOString(),
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleFileProcess(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleConvertToText = () => {
    if (!file) return;
    const cleanTitle = file.name.replace(/\.[^/.]+$/, '');
    const sampleExtracted = `Photosynthesis is the process plants use to convert light energy into chemical energy. Cellular respiration is the biochemical pathway by which cells release energy stored in glucose molecules. Adenosine triphosphate (ATP) is the primary energy currency used by living organisms.`;
    if (onExtractToTextEditor) {
      onExtractToTextEditor(sampleExtracted, cleanTitle);
    }
  };

  return (
    <div className="lesson-uploader-container">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.pptx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.openxmlformats-officedocument.presentationml.presentation"
        style={{ display: 'none' }}
        onChange={(e) => handleFileProcess(e.target.files)}
      />

      {!file ? (
        <div
          className={`uploader-dropzone-large ${isDragging ? 'drag-active' : ''}`}
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
          <div className="dropzone-laser-notch" aria-hidden="true" />
          
          <div className="dropzone-center-elements">
            <div className="uploader-icon-halo">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 12 15 15" />
              </svg>
            </div>

            <h4 className="uploader-title">Upload a lesson file</h4>
            <p className="uploader-subtext">
              Drag & Drop file here, or click to browse
            </p>

            <button
              type="button"
              className="btn-browse-file"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Browse Files
            </button>

            <div className="supported-formats-pills">
              <span className="format-pill">PDF</span>
              <span className="format-pill">DOCX</span>
              <span className="format-pill">TXT</span>
              <span className="format-pill">PPTX</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="uploader-file-display-card">
          <div className="file-display-top">
            <div className="file-type-icon-box">
              <span className="file-badge-text">{file.type}</span>
            </div>

            <div className="file-text-meta">
              <h4 className="file-name-text" title={file.name}>
                {file.name}
              </h4>
              <div className="file-size-row">
                <span className="file-size-pill">{file.size}</span>
                <span className="file-status-pill">● Ready For Study</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-remove-uploaded-file"
              onClick={onFileRemove}
              title="Remove this lesson file"
              aria-label="Remove uploaded file"
            >
              ✕ Remove
            </button>
          </div>

          <div className="file-preview-strip">
            <span className="preview-label">PARSING STATUS:</span>
            <span className="preview-status">Architecture ready for AI extraction</span>
          </div>

          <div className="file-quick-action-box">
            <div className="quick-action-info">
              <span className="quick-action-title">Convert to Highlightable Text</span>
              <span className="quick-action-desc">
                Open document text in the text editor to start highlighting terms for flashcards.
              </span>
            </div>
            <button
              type="button"
              className="btn-convert-text"
              onClick={handleConvertToText}
            >
              Open in Text Editor →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
