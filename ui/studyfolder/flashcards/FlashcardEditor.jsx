import { useState } from 'react';
import FlashcardSourceSelector from './FlashcardSourceSelector';
import LessonUploader from './LessonUploader';
import LessonTextEditor from './LessonTextEditor';
import FlashcardList from './FlashcardList';
import FinishFlashcardsModal from './FinishFlashcardsModal';
import './FlashcardEditor.css';

/**
 * FlashcardEditor - Dedicated workspace for creating and managing flashcards
 *
 * Header:
 *   FLASHCARD EDITOR
 *   Folder: [folder.title]
 *   Study Method: Flashcards
 *   [ Save Progress ] [ Finish ]
 *
 * Layout:
 *   LEFT: Lesson / source material (50%)
 *   RIGHT: Flashcard collection (50%)
 *
 * @param {Object} props
 * @param {Object} props.folder - The study folder being worked on
 * @param {Function} props.onSaveProgress - (updatedFolder) => void
 * @param {Function} props.onFinish - (finalFolder) => void
 * @param {Function} props.onBack - () => void
 */
export default function FlashcardEditor({
  folder,
  onSaveProgress,
  onFinish,
  onBack,
}) {
  // Folder fallback
  const currentFolder = folder || {
    id: 'folder-demo',
    title: 'Physics Midterms',
    subtitle: 'Forces & Motion',
    department: 'Engineering',
    lessons: 1,
    flashcards: [],
  };

  // State
  const initialFile = currentFolder.lessonItems?.[0] || null;
  const [activeSource, setActiveSource] = useState(initialFile ? 'upload' : 'text');
  const [uploadedFile, setUploadedFile] = useState(initialFile);
  const [lessonTitle, setLessonTitle] = useState(
    initialFile ? initialFile.title : 'Food and Nutrition'
  );
  const [lessonContent, setLessonContent] = useState(
    'Food is what we consume everyday. It provides energy and nutrients needed by the human body.\n\nPhotosynthesis is the process plants use to convert light energy into chemical energy.'
  );

  // Cards array
  const [cards, setCards] = useState(
    currentFolder.flashcards && currentFolder.flashcards.length > 0
      ? currentFolder.flashcards
      : []
  );

  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(null);

  // Handlers for cards
  const handleAddCard = (newCardData) => {
    const newCard = {
      id: `card-${Date.now()}`,
      lessonId: `lesson-${Date.now()}`,
      front: newCardData.front,
      back: newCardData.back,
      sourceType: newCardData.sourceType || 'manual',
      selectedText: newCardData.selectedText || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCards((prev) => [newCard, ...prev]);
  };

  const handleEditCard = (updatedCard) => {
    setCards((prev) =>
      prev.map((c) => (c.id === updatedCard.id ? updatedCard : c))
    );
  };

  const handleDeleteCard = (cardId) => {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
  };

  // Extract from uploaded file into text editor
  const handleExtractToTextEditor = (extractedText, extractedTitle) => {
    if (extractedTitle) setLessonTitle(extractedTitle);
    if (extractedText) setLessonContent(extractedText);
    setActiveSource('text');
  };

  // Save Progress
  const handleSaveProgress = () => {
    const updated = {
      ...currentFolder,
      studyType: 'flashcards',
      flashcards: cards,
      lessons: Math.max(currentFolder.lessons || 1, uploadedFile ? 1 : 1),
      status: 'New',
      lastStudied: 'Just now',
      updatedAt: new Date().toISOString(),
    };
    if (onSaveProgress) onSaveProgress(updated);

    setSaveToast('Progress saved to folder state!');
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Finish and Save
  const handleFinishAndSave = () => {
    setIsFinishModalOpen(false);
    const updated = {
      ...currentFolder,
      studyType: 'flashcards',
      flashcards: cards,
      lessons: Math.max(currentFolder.lessons || 1, uploadedFile ? 1 : 1),
      status: 'New',
      progress: 0,
      lastStudied: 'Just now',
      updatedAt: new Date().toISOString(),
    };
    if (onFinish) onFinish(updated);
  };

  return (
    <div className="flashcard-editor-workspace">
      {/* Laser edge glow */}
      <div className="editor-top-glow" aria-hidden="true" />

      {/* 1. HEADER ROW */}
      <header className="flashcard-editor-header">
        <div className="header-left-col">
          <div className="editor-tag-row">
            <button
              type="button"
              className="btn-editor-back"
              onClick={onBack}
              title="Return to My Folders"
            >
              ← My Folders
            </button>
            <span className="editor-separator">/</span>
            <span className="editor-badge-tag">FLASHCARD EDITOR</span>
          </div>

          <div className="header-folder-meta">
            <div className="folder-meta-text">
              <span className="meta-folder-label">Folder</span>
              <span className="meta-folder-title">{currentFolder.title}</span>
            </div>
            <span className="meta-dot">·</span>
            <span className="meta-method-pill">
              <span className="method-pill-icon">📁</span> Flashcards <span className="pill-chevron">▾</span>
            </span>
          </div>
        </div>

        {/* Center Progress Counter */}
        <div className="header-center-col">
          <div className="editor-progress-pill">
            <span className="progress-label">FLASHCARDS CREATED:</span>
            <span className="progress-count">{cards.length} {cards.length === 1 ? 'Card' : 'Cards'}</span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="header-right-col">
          {saveToast && (
            <span className="save-toast-pill" role="status">
              ✓ {saveToast}
            </span>
          )}

          <button
            type="button"
            className="btn-editor-save-progress"
            onClick={handleSaveProgress}
          >
            <span className="btn-clock-icon">🕒</span>
            <span>Save Progress</span>
          </button>

          <button
            type="button"
            className="btn-editor-finish"
            onClick={() => setIsFinishModalOpen(true)}
          >
            <span>Finish</span>
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </header>

      {/* 2. TWO-COLUMN WORKSPACE STAGE */}
      <main className="flashcard-editor-body">
        {/* LEFT COLUMN: LESSON / SOURCE MATERIAL (50%) */}
        <section className="editor-column column-left">
          <div className="column-panel-card">
            {/* Source Options Toggle: Upload Lesson vs Add Lesson Text */}
            <FlashcardSourceSelector
              activeSource={activeSource}
              onSelectSource={setActiveSource}
            />

            <div className="source-content-viewport">
              {activeSource === 'upload' ? (
                <LessonUploader
                  file={uploadedFile}
                  onFileUpload={setUploadedFile}
                  onFileRemove={() => setUploadedFile(null)}
                  onExtractToTextEditor={handleExtractToTextEditor}
                />
              ) : (
                <LessonTextEditor
                  lessonTitle={lessonTitle}
                  onTitleChange={setLessonTitle}
                  lessonContent={lessonContent}
                  onContentChange={setLessonContent}
                  onCreateCardFromSelection={handleAddCard}
                />
              )}
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: FLASHCARD COLLECTION (50%) */}
        <section className="editor-column column-right">
          <div className="column-panel-card">
            <FlashcardList
              cards={cards}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              onAddCard={handleAddCard}
            />
          </div>
        </section>
      </main>

      {/* 3. FINISH CONFIRMATION MODAL */}
      <FinishFlashcardsModal
        isOpen={isFinishModalOpen}
        folderTitle={currentFolder.title}
        cardCount={cards.length}
        onContinueEditing={() => setIsFinishModalOpen(false)}
        onFinishAndSave={handleFinishAndSave}
      />
    </div>
  );
}
