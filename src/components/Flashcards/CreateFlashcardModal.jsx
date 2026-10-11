import React, { useState, useEffect, useRef } from 'react';
import './Flashcards.css';

/**
 * CreateFlashcardModal - Dialog for creating a new flashcard
 *
 * Supports two creation workflows:
 * 1. Direct Input: Manually type Question and Answer
 * 2. Paste & Highlight (Pen Tool): Paste a sentence or paragraph,
 *    and use the interactive Pen Tool to highlight the answer,
 *    automatically generating the fill-in-the-blank question and answer!
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether dialog is open
 * @param {string} props.folderTitle - Title of current study folder
 * @param {Function} props.onClose - Modal close handler
 * @param {Function} props.onCreate - (cardData) => void
 */
export default function CreateFlashcardModal({
  isOpen,
  folderTitle = 'Study Folder',
  onClose,
  onCreate,
}) {
  // Mode: 'manual' (Direct Input) | 'pen' (Paste & Highlight with Pen Tool)
  const [creationMode, setCreationMode] = useState('manual');

  // Manual Mode State
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [lessonTag, setLessonTag] = useState('');
  const [validationError, setValidationError] = useState('');

  // Pen Tool / Paste & Highlight State
  const [pastedText, setPastedText] = useState(
    'Photosynthesis is the process by which plants use sunlight to produce food from carbon dioxide and water.'
  );
  const [isPenActive, setIsPenActive] = useState(true);
  const [highlightedAnswer, setHighlightedAnswer] = useState('Photosynthesis');
  const [generatedQuestion, setGeneratedQuestion] = useState(
    '_____ is the process by which plants use sunlight to produce food from carbon dioxide and water.'
  );
  const [penSelectionMode, setPenSelectionMode] = useState('word'); // 'word' | 'drag'
  const [isEditingSourceText, setIsEditingSourceText] = useState(false);

  // Helper to parse text into structured word objects
  const parseWordsFromText = (text) => {
    if (!text) return [];
    const regex = /(\S+)(\s*)/g;
    const wordsList = [];
    let match;
    let index = 0;
    while ((match = regex.exec(text)) !== null) {
      const rawWord = match[1];
      const spaceAfter = match[2];
      const cleanWord = rawWord.replace(/^[“"'(\[\s]+|[.,!?;:”"')\]\s]+$/g, '');
      wordsList.push({
        index,
        rawWord,
        cleanWord: cleanWord || rawWord,
        spaceAfter,
        startChar: match.index,
        endChar: match.index + rawWord.length,
      });
      index++;
    }
    return wordsList;
  };

  // Words token list derived from pastedText
  const words = React.useMemo(() => parseWordsFromText(pastedText), [pastedText]);

  // Selected range of word indices: { start: number, end: number } | null
  // Defaults to highlighting only the first word (0, 0)
  const [selectedRange, setSelectedRange] = useState({ start: 0, end: 0 });
  const [isLongPressActive, setIsLongPressActive] = useState(false);

  // Mouse drag & long press tracking refs
  const isMouseDownRef = useRef(false);
  const dragStartIndexRef = useRef(null);
  const lastHoverIndexRef = useRef(null);
  const hasMovedDragRef = useRef(false);
  const justFinishedDragRef = useRef(false);
  const longPressTimerRef = useRef(null);

  const questionInputRef = useRef(null);
  const textContainerRef = useRef(null);

  // Auto-focus and reset fields when opened
  useEffect(() => {
    if (isOpen) {
      setValidationError('');
      if (creationMode === 'manual') {
        const timer = setTimeout(() => {
          if (questionInputRef.current) {
            questionInputRef.current.focus();
          }
        }, 80);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, creationMode]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Apply a word index range selection to generate answer and fill-in-the-blank question
  const applyRangeSelection = (startIdx, endIdx, wordList = words, fullText = pastedText) => {
    const list = wordList && wordList.length > 0 ? wordList : parseWordsFromText(fullText);
    if (!list || !list.length) return;
    const minIdx = Math.max(0, Math.min(startIdx, endIdx));
    const maxIdx = Math.min(list.length - 1, Math.max(startIdx, endIdx));

    setSelectedRange({ start: minIdx, end: maxIdx });

    // Extract exact words within the range
    const selectedSlice = list.slice(minIdx, maxIdx + 1);
    const rawPhrase = selectedSlice.map((w) => w.rawWord).join(' ');
    const cleanAnswer = rawPhrase.replace(/^[“"'(\[\s]+|[.,!?;:”"')\]\s]+$/g, '').trim();

    setHighlightedAnswer(cleanAnswer);

    // Exact character boundaries of selected words in the text
    const startChar = list[minIdx].startChar;
    const endChar = list[maxIdx].endChar;

    const beforeText = fullText.slice(0, startChar);
    const afterText = fullText.slice(endChar);

    // Find sentence boundaries around the selection
    const sentenceStarts = [...beforeText.matchAll(/[.!?]\s+/g)];
    const lastStartMatch = sentenceStarts.pop();
    const sentenceStartIndex = lastStartMatch ? lastStartMatch.index + lastStartMatch[0].length : 0;

    const sentenceEndMatch = afterText.match(/[.!?](\s+|$)/);
    const sentenceEndIndex = sentenceEndMatch ? endChar + sentenceEndMatch.index + 1 : fullText.length;

    const targetBefore = fullText.slice(sentenceStartIndex, startChar).trimStart();
    const targetAfter = fullText.slice(endChar, sentenceEndIndex).trimEnd();

    const generatedQ = `${targetBefore}_____${targetAfter}`.trim();
    setGeneratedQuestion(generatedQ);

    if (validationError) setValidationError('');
  };

  // Find word index range from a selected text string
  const findWordRangeForText = (wordList, targetText, fullText) => {
    if (!wordList.length || !targetText) return null;
    const cleanTarget = targetText.toLowerCase();

    // 1. Direct single-word match
    const singleIdx = wordList.findIndex((w) => w.cleanWord.toLowerCase() === cleanTarget);
    if (singleIdx !== -1) return { start: singleIdx, end: singleIdx };

    // 2. Multi-word phrase search in wordList
    const targetTokens = cleanTarget.split(/\s+/).filter(Boolean);
    if (targetTokens.length > 1) {
      for (let i = 0; i <= wordList.length - targetTokens.length; i++) {
        let allMatch = true;
        for (let j = 0; j < targetTokens.length; j++) {
          if (wordList[i + j].cleanWord.toLowerCase() !== targetTokens[j]) {
            allMatch = false;
            break;
          }
        }
        if (allMatch) {
          return { start: i, end: i + targetTokens.length - 1 };
        }
      }
    }

    // 3. Substring range in fullText
    const charIdx = fullText.toLowerCase().indexOf(cleanTarget);
    if (charIdx !== -1) {
      const endCharIdx = charIdx + cleanTarget.length;
      let startIdx = -1;
      let endIdx = -1;
      for (let i = 0; i < wordList.length; i++) {
        if (wordList[i].startChar <= charIdx && wordList[i].endChar >= charIdx) {
          startIdx = i;
        }
        if (wordList[i].startChar <= endCharIdx && wordList[i].endChar >= endCharIdx) {
          endIdx = i;
        }
      }
      if (startIdx !== -1 && endIdx !== -1) {
        return { start: startIdx, end: endIdx };
      }
    }

    return null;
  };

  // Global mouseup listener so dragging or releasing mouse anywhere finalizes selection
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isMouseDownRef.current) {
        if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
        setIsLongPressActive(false);
        isMouseDownRef.current = false;

        if (hasMovedDragRef.current && dragStartIndexRef.current !== null && lastHoverIndexRef.current !== null) {
          justFinishedDragRef.current = true;
          setTimeout(() => {
            justFinishedDragRef.current = false;
          }, 80);
          applyRangeSelection(dragStartIndexRef.current, lastHoverIndexRef.current, words, pastedText);
        }
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [words, pastedText]);

  // Click on single word token: instantly highlights only this single word
  const handleWordClick = (index) => {
    if (!isPenActive) setIsPenActive(true);
    if (justFinishedDragRef.current) {
      justFinishedDragRef.current = false;
      return;
    }

    applyRangeSelection(index, index, words, pastedText);
  };

  // Word token mouse down: sets up drag & long-press detection
  const handleWordMouseDown = (e, index) => {
    if (!isPenActive) return;

    isMouseDownRef.current = true;
    dragStartIndexRef.current = index;
    lastHoverIndexRef.current = index;
    hasMovedDragRef.current = false;

    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = setTimeout(() => {
      if (isMouseDownRef.current) {
        setIsLongPressActive(true);
      }
    }, 200);
  };

  // Word token mouse enter: expands range selection while dragging
  const handleWordMouseEnter = (index) => {
    if (!isPenActive || !isMouseDownRef.current) return;

    if (dragStartIndexRef.current !== null && dragStartIndexRef.current !== index) {
      hasMovedDragRef.current = true;
      lastHoverIndexRef.current = index;

      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
      setIsLongPressActive(true);

      const min = Math.min(dragStartIndexRef.current, index);
      const max = Math.max(dragStartIndexRef.current, index);
      setSelectedRange({ start: min, end: max });
    }
  };

  // Word token mouse up: commits dragged range if moved
  const handleWordMouseUp = (e, index) => {
    if (!isPenActive || !isMouseDownRef.current) return;

    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    setIsLongPressActive(false);
    isMouseDownRef.current = false;

    if (hasMovedDragRef.current && dragStartIndexRef.current !== null) {
      e.stopPropagation();
      justFinishedDragRef.current = true;
      setTimeout(() => {
        justFinishedDragRef.current = false;
      }, 80);

      const min = Math.min(dragStartIndexRef.current, index);
      const max = Math.max(dragStartIndexRef.current, index);
      applyRangeSelection(min, max, words, pastedText);
    }
  };

  // Native drag text selection fallback in container
  const handleContainerMouseUp = () => {
    if (!isPenActive) return;
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const selectedStr = sel.toString().trim();
      if (selectedStr.length > 0) {
        const cleanSel = selectedStr.replace(/^[“"'(\[\s]+|[.,!?;:”"')\]\s]+$/g, '');
        const match = findWordRangeForText(words, cleanSel, pastedText);
        if (match) {
          applyRangeSelection(match.start, match.end, words, pastedText);
          sel.removeAllRanges();
        }
      }
    }
  };

  // Quick Action: Paste from Clipboard
  const handlePasteClipboard = async () => {
    let text = '';
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        text = await navigator.clipboard.readText();
      }
    } catch {
      text = window.prompt('Paste your sentence or paragraph here:');
    }
    if (!text) {
      text = window.prompt('Paste your sentence or paragraph here:');
    }
    if (text && text.trim()) {
      const trimmed = text.trim();
      setPastedText(trimmed);
      setIsEditingSourceText(false);
      const parsed = parseWordsFromText(trimmed);
      if (parsed.length > 0) {
        applyRangeSelection(0, 0, parsed, trimmed);
      } else {
        handleClearHighlight();
      }
    }
  };

  // Quick Action: Insert Sample Sentence
  const handleInsertSample = (type = 'bio') => {
    let sample = '';
    let defWord = '';
    if (type === 'bio') {
      sample =
        'Photosynthesis is the process by which plants use sunlight to produce food from carbon dioxide and water.';
      defWord = 'Photosynthesis';
    } else if (type === 'phys') {
      sample =
        'Inertia is the property of an object to resist changes in its state of motion.';
      defWord = 'Inertia';
    } else {
      sample =
        'An algorithm is a step-by-step procedure for solving a problem or completing a task.';
      defWord = 'algorithm';
    }
    setPastedText(sample);
    setIsEditingSourceText(false);
    const parsed = parseWordsFromText(sample);
    const matchIdx = parsed.findIndex((w) => w.cleanWord.toLowerCase() === defWord.toLowerCase());
    if (matchIdx !== -1) {
      applyRangeSelection(matchIdx, matchIdx, parsed, sample);
    } else {
      handleClearHighlight();
    }
  };

  // Clear highlight
  const handleClearHighlight = () => {
    setSelectedRange(null);
    setHighlightedAnswer('');
    setGeneratedQuestion(pastedText);
  };

  if (!isOpen) return null;

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    let finalQuestion = '';
    let finalAnswer = '';

    if (creationMode === 'manual') {
      finalQuestion = question.trim();
      finalAnswer = answer.trim();
    } else {
      finalQuestion = generatedQuestion.trim();
      finalAnswer = highlightedAnswer.trim();
    }

    if (!finalQuestion) {
      setValidationError(
        creationMode === 'manual'
          ? 'Please enter a question for this flashcard.'
          : 'Please highlight an answer in the text above using the pen tool to generate a question.'
      );
      return;
    }

    if (!finalAnswer) {
      setValidationError(
        creationMode === 'manual'
          ? 'Please enter the answer for this flashcard.'
          : 'Please highlight a word or phrase with the Pen Tool to designate the answer.'
      );
      return;
    }

    setValidationError('');
    onCreate({
      question: finalQuestion,
      answer: finalAnswer,
      lessonTag: lessonTag.trim() || undefined,
    });
  };

  // Render clickable word tokens with exact single/group highlighting
  const renderInteractiveText = () => {
    if (!pastedText.trim() || words.length === 0) {
      return (
        <span style={{ color: '#64748b', fontStyle: 'italic' }}>
          Paste or type your sentence here, then click a word or long-press & drag to highlight...
        </span>
      );
    }

    const minSel = selectedRange !== null ? Math.min(selectedRange.start, selectedRange.end) : -1;
    const maxSel = selectedRange !== null ? Math.max(selectedRange.start, selectedRange.end) : -1;

    return words.map((w) => {
      const isSelected = selectedRange !== null && w.index >= minSel && w.index <= maxSel;
      const isFirst = isSelected && w.index === minSel;
      const isLast = isSelected && w.index === maxSel;
      const isSingle = isFirst && isLast;

      return (
        <React.Fragment key={w.index}>
          <span
            data-word-index={w.index}
            className={`aura-word-token ${
              isSelected
                ? `is-highlighted ${isSingle ? 'is-single' : ''} ${isFirst ? 'is-first' : ''} ${
                    isLast ? 'is-last' : ''
                  }`
                : 'is-unselected'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleWordClick(w.index);
            }}
            onMouseDown={(e) => handleWordMouseDown(e, w.index)}
            onMouseEnter={() => handleWordMouseEnter(w.index)}
            onMouseUp={(e) => handleWordMouseUp(e, w.index)}
            title={
              isSelected
                ? `Highlighted answer: "${w.cleanWord}" (Click to unselect)`
                : isPenActive
                ? `Click to highlight "${w.cleanWord}", or hold & drag across words to highlight a group`
                : undefined
            }
          >
            {w.rawWord}
          </span>
          {w.spaceAfter && (
            <span
              className={`aura-word-space ${
                isSelected && !isLast ? 'is-highlighted-space' : ''
              }`}
            >
              {w.spaceAfter}
            </span>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <div
      className="aura-modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flashcard-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-flashcard-title"
        style={{ maxWidth: creationMode === 'pen' ? '680px' : '580px' }}
      >
        <div className="modal-top-accent-laser" aria-hidden="true" />

        {/* Modal Header */}
        <div className="modal-header-section">
          <div className="modal-header-info">
            <div className="modal-eyebrow-tag">
              <span>/</span> NEW FLASHCARD
            </div>
            <h2 id="create-flashcard-title" className="modal-headline-title">
              CREATE FLASHCARD
            </h2>
            <p className="modal-subtext">
              Add a new card to <strong>{folderTitle}</strong>
            </p>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector Tabs (Direct Input vs Pen Tool Paste & Highlight) */}
        <div className="create-mode-tabs-row" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={creationMode === 'manual'}
            className={`create-mode-tab-btn ${creationMode === 'manual' ? 'is-active' : ''}`}
            onClick={() => {
              setCreationMode('manual');
              setValidationError('');
            }}
          >
            <span>✍️</span>
            <span>Direct Input</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={creationMode === 'pen'}
            className={`create-mode-tab-btn ${creationMode === 'pen' ? 'is-active' : ''}`}
            onClick={() => {
              setCreationMode('pen');
              setValidationError('');
              if (!highlightedAnswer && pastedText) {
                // Auto highlight first key word as demo
                const firstWord = pastedText.split(/\s+/)[0];
                if (firstWord) extractQuestionAndAnswer(pastedText, firstWord);
              }
            }}
          >
            <span>🖊️</span>
            <span>Paste & Highlight (Pen Tool)</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form-wrapper">
          <div className="modal-form-content">
            {validationError && (
              <div className="form-error-banner" role="alert">
                <span>⚠️</span>
                <span>{validationError}</span>
              </div>
            )}

            {/* =========================================================
                WORKFLOW 1: DIRECT INPUT
                ========================================================= */}
            {creationMode === 'manual' && (
              <>
                {/* Question Field */}
                <div className="form-field-item">
                  <div className="form-field-label-row">
                    <label htmlFor="create-card-question" className="form-field-label">
                      Question <span className="form-field-required-star">*</span>
                    </label>
                    <span className="form-field-char-count">{question.length} chars</span>
                  </div>
                  <textarea
                    id="create-card-question"
                    ref={questionInputRef}
                    className="form-textarea"
                    placeholder="Enter your question... (e.g., What is photosynthesis?)"
                    value={question}
                    onChange={(e) => {
                      setQuestion(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    rows={3}
                    required
                  />
                </div>

                {/* Answer Field */}
                <div className="form-field-item">
                  <div className="form-field-label-row">
                    <label htmlFor="create-card-answer" className="form-field-label">
                      Answer <span className="form-field-required-star">*</span>
                    </label>
                    <span className="form-field-char-count">{answer.length} chars</span>
                  </div>
                  <textarea
                    id="create-card-answer"
                    className="form-textarea"
                    placeholder="Enter the answer... (e.g., The process by which plants use sunlight to produce food)"
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    rows={3}
                    required
                  />
                </div>
              </>
            )}

            {/* =========================================================
                WORKFLOW 2: PASTE & HIGHLIGHT WITH PEN TOOL
                ========================================================= */}
            {creationMode === 'pen' && (
              <>
                {/* Pen Toolbar & Controls */}
                <div className="pen-tool-action-bar">
                  <div className="pen-tools-left">
                    <button
                      type="button"
                      className={`btn-pen-tool-toggle ${isPenActive ? 'is-pen-active' : ''}`}
                      onClick={() => setIsPenActive((prev) => !prev)}
                      title={isPenActive ? 'Pen tool is active' : 'Turn on Pen tool'}
                    >
                      <span>🖊️</span>
                      <span>{isPenActive ? 'Pen Tool Active' : 'Pen Tool Off'}</span>
                    </button>

                    <button
                      type="button"
                      className={`pen-mode-selector-btn ${penSelectionMode === 'word' ? 'is-active' : ''}`}
                      onClick={() => setPenSelectionMode('word')}
                      title="Click any word to highlight as answer"
                    >
                      <span>Click Word</span>
                    </button>

                    <button
                      type="button"
                      className={`pen-mode-selector-btn ${penSelectionMode === 'drag' ? 'is-active' : ''}`}
                      onClick={() => setPenSelectionMode('drag')}
                      title="Drag across words to highlight a full phrase"
                    >
                      <span>Drag Phrase</span>
                    </button>
                  </div>

                  <div className="pen-tools-right">
                    <button
                      type="button"
                      className="btn-paste-clipboard"
                      onClick={handlePasteClipboard}
                      title="Paste text from clipboard"
                    >
                      <span>📋</span>
                      <span>Paste</span>
                    </button>

                    <button
                      type="button"
                      className="btn-insert-sample"
                      onClick={() => handleInsertSample('bio')}
                      title="Insert sample text"
                    >
                      <span>✨</span>
                      <span>Sample</span>
                    </button>
                  </div>
                </div>

                {/* Guidance Banner */}
                <div className="pen-guidance-banner">
                  <div className="pen-banner-left">
                    <span className="pen-banner-badge">💡</span>
                    <span>
                      <strong>How it works:</strong> Click any word to highlight as answer, or{' '}
                      <strong>long press & drag</strong> with mouse to highlight a group of words.
                    </span>
                  </div>
                  {highlightedAnswer && (
                    <button
                      type="button"
                      className="preview-clear-btn"
                      onClick={handleClearHighlight}
                    >
                      ✕ Clear
                    </button>
                  )}
                </div>

                {/* Source Text / Interactive Pen Surface */}
                <div className="form-field-item">
                  <div className="form-field-label-row">
                    <label className="form-field-label">
                      Pasted Sentence or Passage <span className="form-field-required-star">*</span>
                    </label>
                    <button
                      type="button"
                      className="btn-toggle-edit-source"
                      onClick={() => setIsEditingSourceText((prev) => !prev)}
                      title={isEditingSourceText ? 'Switch to highlight mode' : 'Edit raw sentence text'}
                    >
                      {isEditingSourceText ? '✓ Highlight Mode' : '✏️ Edit Text'}
                    </button>
                  </div>

                  {isEditingSourceText ? (
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: '68px', fontSize: '13.5px' }}
                      placeholder="Type or paste your sentence here..."
                      value={pastedText}
                      autoFocus
                      onChange={(e) => {
                        const newTxt = e.target.value;
                        setPastedText(newTxt);
                        const parsed = parseWordsFromText(newTxt);
                        if (parsed.length > 0) {
                          applyRangeSelection(0, 0, parsed, newTxt);
                        } else {
                          handleClearHighlight();
                        }
                      }}
                      rows={3}
                    />
                  ) : (
                    <div className="pen-interactive-surface-box" ref={textContainerRef}>
                      <div
                        className={`pen-interactive-text-area ${isPenActive ? 'is-pen-tool-mode' : ''} ${
                          isLongPressActive ? 'is-dragging-selection' : ''
                        }`}
                        onMouseUp={handleContainerMouseUp}
                      >
                        {renderInteractiveText()}
                      </div>
                    </div>
                  )}

                  <span className="form-field-hint">
                    {isEditingSourceText
                      ? 'Editing raw text. Click "✓ Highlight Mode" when ready to select words.'
                      : isLongPressActive
                      ? '✨ Dragging group selection — release mouse to set answer.'
                      : 'Click any word to highlight it. Long press & drag across words to highlight a group.'}
                  </span>
                </div>

                {/* Generated Live Flashcard Preview Panel */}
                <div className="pen-generated-preview-panel">
                  <div className="preview-panel-header">
                    <span className="preview-header-tag">
                      <span>⚡</span> GENERATED FLASHCARD PREVIEW
                    </span>
                    {highlightedAnswer && (
                      <span style={{ fontSize: '11px', color: '#34d399', fontWeight: '700' }}>
                        ✓ Answer Highlighted
                      </span>
                    )}
                  </div>

                  {/* Generated Question */}
                  <div className="preview-field-box">
                    <label className="preview-field-title">
                      Question (Fill-in-the-blank)
                    </label>
                    <textarea
                      className="preview-editable-textarea"
                      value={generatedQuestion}
                      onChange={(e) => setGeneratedQuestion(e.target.value)}
                      placeholder="Highlight a word above or type question here..."
                      rows={2}
                      required
                    />
                  </div>

                  {/* Generated Answer */}
                  <div className="preview-field-box">
                    <label className="preview-field-title">
                      Answer (Highlighted Concept)
                    </label>
                    <input
                      type="text"
                      className="preview-answer-input"
                      value={highlightedAnswer}
                      onChange={(e) => setHighlightedAnswer(e.target.value)}
                      placeholder="Highlighted answer appears here..."
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Optional Lesson / Topic Tag (Shared) */}
            <div className="form-field-item">
              <div className="form-field-label-row">
                <label htmlFor="create-card-tag" className="form-field-label">
                  Lesson / Topic Tag <span className="form-field-hint">(Optional)</span>
                </label>
              </div>
              <input
                id="create-card-tag"
                type="text"
                className="form-text-input"
                placeholder="e.g. Chapter 1, Key Concepts, Terminology"
                value={lessonTag}
                onChange={(e) => setLessonTag(e.target.value)}
              />
            </div>
          </div>

          {/* Action Buttons (Fixed at bottom of dialog) */}
          <div className="modal-actions-row">
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
            >
              <span>+</span>
              <span>Create Flashcard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
