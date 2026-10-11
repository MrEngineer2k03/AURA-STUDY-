import { useState, useRef, useEffect, useCallback } from 'react';
import TextSelectionToolbar from './TextSelectionToolbar';

/**
 * Safely finds the single word and its DOM range at the clicked coordinates.
 * Handles punctuation, line breaks, parentheticals, and quotation marks.
 *
 * @param {number} x - Client X coordinate
 * @param {number} y - Client Y coordinate
 * @param {HTMLElement} rootContainer - The container holding the text
 * @returns {Object|null} { word, range, node, start, end }
 */
function getWordAtPoint(x, y, rootContainer) {
  let range = null;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
  } else if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(x, y);
    if (pos && pos.offsetNode) {
      range = document.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }
  }

  if (!range) return null;

  let node = range.startContainer;
  let offset = range.startOffset;

  // Resolve to a TextNode if range lands on an Element container
  if (node.nodeType !== Node.TEXT_NODE) {
    if (node.childNodes && node.childNodes.length > 0) {
      const child = node.childNodes[Math.min(offset, node.childNodes.length - 1)];
      if (child && child.nodeType === Node.TEXT_NODE) {
        node = child;
        offset = 0;
      } else if (child) {
        const walker = document.createTreeWalker(child, NodeFilter.SHOW_TEXT);
        const textNode = walker.nextNode();
        if (textNode) {
          node = textNode;
          offset = 0;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  if (!rootContainer || !rootContainer.contains(node)) return null;

  const text = node.textContent;
  if (!text || text.length === 0) return null;

  // Delimiters that separate individual words:
  // whitespace, punctuation, brackets, quotes, slashes, mathematical and symbols
  const isDelimiter = (ch) => {
    if (!ch) return true;
    return /[\s.,!?;:()\[\]{}"'“”‘’\\\/<>=+*^%$#@~`|]/.test(ch);
  };

  let targetOffset = offset;
  if (targetOffset >= text.length && targetOffset > 0) {
    targetOffset = text.length - 1;
  }

  // If clicked directly after a word character (e.g. cursor at boundary)
  if (isDelimiter(text[targetOffset]) && targetOffset > 0 && !isDelimiter(text[targetOffset - 1])) {
    targetOffset = targetOffset - 1;
  }

  // If clicked on delimiter/space between words, do not select
  if (isDelimiter(text[targetOffset])) {
    return null;
  }

  // Scan backwards to find the word start
  let start = targetOffset;
  while (start > 0 && !isDelimiter(text[start - 1])) {
    start--;
  }

  // Scan forwards to find the word end
  let end = targetOffset;
  while (end < text.length && !isDelimiter(text[end])) {
    end++;
  }

  let rawWord = text.slice(start, end);
  if (!rawWord || rawWord.trim().length === 0) return null;

  // Clean leading or trailing dashes/apostrophes if any
  while (rawWord.length > 0 && /^[-']/.test(rawWord)) {
    rawWord = rawWord.slice(1);
    start++;
  }
  while (rawWord.length > 0 && /[-']$/.test(rawWord)) {
    rawWord = rawWord.slice(0, -1);
    end--;
  }

  if (!rawWord || rawWord.trim().length === 0) return null;

  const wordRange = document.createRange();
  wordRange.setStart(node, start);
  wordRange.setEnd(node, end);

  return {
    word: rawWord,
    range: wordRange,
    node,
    start,
    end,
  };
}

/**
 * Snaps a DOM Range to full word boundaries.
 * If the user highlighted a word partially (e.g. "od" instead of "Food"),
 * it automatically expands the start to the beginning of the word.
 * If the user stopped highlighting mid-word, it expands the end to the end of the word.
 *
 * @param {Range} range - Active DOM Range
 * @param {HTMLElement} rootContainer - The container holding the text
 * @returns {Range} Expanded range snapped to word boundaries
 */
function snapRangeToWordBoundaries(range, rootContainer) {
  if (!range || !rootContainer) return range;

  const isDelimiter = (ch) => {
    if (!ch) return true;
    return /[\s.,!?;:()\[\]{}"'“”‘’\\\/<>=+*^%$#@~`|]/.test(ch);
  };

  let startNode = range.startContainer;
  let startOffset = range.startOffset;
  let endNode = range.endContainer;
  let endOffset = range.endOffset;

  // Resolve start node if it's an element container
  if (startNode.nodeType !== Node.TEXT_NODE) {
    if (startNode.childNodes && startNode.childNodes.length > 0) {
      const child = startNode.childNodes[Math.min(startOffset, startNode.childNodes.length - 1)];
      if (child && child.nodeType === Node.TEXT_NODE) {
        startNode = child;
        startOffset = 0;
      }
    }
  }

  // Resolve end node if it's an element container
  if (endNode.nodeType !== Node.TEXT_NODE) {
    if (endNode.childNodes && endNode.childNodes.length > 0) {
      const child = endNode.childNodes[Math.min(endOffset, endNode.childNodes.length - 1)];
      if (child && child.nodeType === Node.TEXT_NODE) {
        endNode = child;
        endOffset = child.textContent.length;
      }
    }
  }

  // Snap start boundary: If startOffset is inside a word, scan backwards to word start
  if (startNode.nodeType === Node.TEXT_NODE) {
    const text = startNode.textContent || '';
    let newStart = startOffset;

    // Check if start is inside a word (preceded by a non-delimiter character)
    if (newStart > 0 && !isDelimiter(text[newStart - 1])) {
      while (newStart > 0 && !isDelimiter(text[newStart - 1])) {
        newStart--;
      }
    } else if (newStart < text.length && /\s/.test(text[newStart])) {
      // If start lands on whitespace, trim forward past leading whitespace
      while (newStart < text.length && /\s/.test(text[newStart])) {
        newStart++;
      }
    }
    startOffset = newStart;
  }

  // Snap end boundary: If endOffset is inside a word, scan forwards to word end
  if (endNode.nodeType === Node.TEXT_NODE) {
    const text = endNode.textContent || '';
    let newEnd = endOffset;

    // Check if end is inside a word (preceded by a word character and currently on a word character)
    if (newEnd < text.length && !isDelimiter(text[newEnd]) && newEnd > 0 && !isDelimiter(text[newEnd - 1])) {
      while (newEnd < text.length && !isDelimiter(text[newEnd])) {
        newEnd++;
      }
    } else if (newEnd > 0 && /\s/.test(text[newEnd - 1])) {
      // If end lands after trailing whitespace, trim backward
      while (newEnd > 0 && /\s/.test(text[newEnd - 1])) {
        newEnd--;
      }
    }
    endOffset = newEnd;
  }

  try {
    const newRange = document.createRange();
    newRange.setStart(startNode, startOffset);
    newRange.setEnd(endNode, endOffset);
    return newRange;
  } catch (err) {
    return range;
  }
}

/**
 * LessonTextEditor - Interactive text editor supporting click-to-select word
 * and pen-mode sentence highlighting to generate fill-in-the-blank flashcards.
 *
 * @param {Object} props
 * @param {string} props.lessonTitle - Title of current lesson
 * @param {Function} props.onTitleChange - (newTitle) => void
 * @param {string} props.lessonContent - Text content of lesson
 * @param {Function} props.onContentChange - (newContent) => void
 * @param {Function} props.onCreateCardFromSelection - ({ front, back, sourceType, selectedText }) => void
 */
export default function LessonTextEditor({
  lessonTitle = 'Food and Nutrition',
  onTitleChange,
  lessonContent = 'Food is what we consume everyday. It provides energy and nutrients needed by the human body.\n\nPhotosynthesis is the process plants use to convert light energy into chemical energy.',
  onContentChange,
  onCreateCardFromSelection,
}) {
  const containerRef = useRef(null);
  const editorAreaRef = useRef(null);

  // Pen Selection System Mode: 'word' (Single click on word) | 'pen' (Text selection / dragging sentences)
  const [selectionMode, setSelectionMode] = useState('word');

  // Active Selection State: { text, cleanAnswer, extraction, position, markerRect, isSentence, node, start, end }
  const [activeSelection, setActiveSelection] = useState(null);
  const activeSelectionRef = useRef(null);

  useEffect(() => {
    activeSelectionRef.current = activeSelection;
  }, [activeSelection]);

  // Floating Contextual Action Toolbar State
  const [selectionToolbar, setSelectionToolbar] = useState(null);

  // Feedback Toasts
  const [createdToast, setCreatedToast] = useState(null);
  const [toastWarning, setToastWarning] = useState(null);

  // Drag detection refs to distinguish click from click-and-drag
  const mouseDownPosRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Sync initial content to editable div once on mount
  useEffect(() => {
    if (editorAreaRef.current && editorAreaRef.current.innerText !== lessonContent) {
      editorAreaRef.current.innerText = lessonContent;
    }
  }, []);

  // Clear created toast after 3 seconds
  useEffect(() => {
    if (!createdToast) return;
    const timer = setTimeout(() => setCreatedToast(null), 3000);
    return () => clearTimeout(timer);
  }, [createdToast]);

  // Clear warning toast after 3 seconds
  useEffect(() => {
    if (!toastWarning) return;
    const timer = setTimeout(() => setToastWarning(null), 3000);
    return () => clearTimeout(timer);
  }, [toastWarning]);

  // Global Outside-Click Handler: Clear selection only when clicking outside container
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // If clicking inside container (toolbars, controls, editor), preserve selection
      if (containerRef.current && containerRef.current.contains(e.target)) {
        return;
      }
      // If clicking outside, clear selection cleanly
      setActiveSelection(null);
      setSelectionToolbar(null);
      if (window.getSelection) {
        window.getSelection().removeAllRanges();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Helper to extract clean sentence and generate fill-in-the-blank question
  const extractSentenceWithBlank = useCallback((fullText, selectedText) => {
    if (!fullText || !selectedText) {
      return { sentence: selectedText || '', blankSentence: '_____', cleanAnswer: selectedText || '' };
    }

    const trimmedSelection = selectedText.trim();
    // Clean word/phrase of leading and trailing quotes, brackets, whitespace
    const cleanWord = trimmedSelection.replace(/^[“"'(\[\s]+|[.,!?;:”"')\]\s]+$/g, '');
    const wordToMatch = cleanWord || trimmedSelection;

    // Find the containing paragraph/block from the lesson content
    const paragraphs = fullText.split(/\n+/).map((p) => p.trim()).filter(Boolean);
    let targetBlock = paragraphs.find((p) => p.includes(wordToMatch) || p.includes(trimmedSelection));

    if (!targetBlock) {
      targetBlock = fullText.trim();
    }

    let blankSentence;

    // Check if trimmed selection directly exists in the block (e.g. user selected phrase with punctuation)
    if (targetBlock.includes(trimmedSelection)) {
      blankSentence = targetBlock.replace(trimmedSelection, '_____');
    } else if (targetBlock.includes(wordToMatch)) {
      if (wordToMatch.includes(' ')) {
        // Multi-word phrase or sentence selection: replace directly in paragraph context
        blankSentence = targetBlock.replace(wordToMatch, '_____');
      } else {
        // Single word: use word boundary regex to avoid partial word match
        const escapedWord = wordToMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedWord}\\b`, 'i');
        if (regex.test(targetBlock)) {
          blankSentence = targetBlock.replace(regex, '_____');
        } else {
          blankSentence = targetBlock.replace(wordToMatch, '_____');
        }
      }
    } else {
      blankSentence = targetBlock.replace(wordToMatch, '_____');
    }

    // Clean up any double spaces or spacing before punctuation
    blankSentence = blankSentence.replace(/_____\s*\./g, '_____.').trim();

    return {
      sentence: targetBlock,
      blankSentence: blankSentence || '_____',
      cleanAnswer: wordToMatch,
    };
  }, []);

  // Clear current active selection cleanly
  const clearActiveSelection = useCallback(() => {
    setActiveSelection(null);
    setSelectionToolbar(null);
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }, []);

  // 1. Single Click Word Selection Handler (Word Selection Mode)
  const handleWordClick = useCallback((clientX, clientY) => {
    if (!editorAreaRef.current || !containerRef.current) return;

    const wordResult = getWordAtPoint(clientX, clientY, editorAreaRef.current);
    if (!wordResult) {
      // Clicked on empty space or non-word character: do not replace active selection
      return;
    }

    const { word, range, node, start, end } = wordResult;

    // Toggle off: If clicking the exact same word currently highlighted, remove highlight
    const current = activeSelectionRef.current;
    if (
      current &&
      !current.isSentence &&
      (
        (current.node === node && current.start === start && current.end === end) ||
        current.text === word ||
        current.cleanAnswer === word
      )
    ) {
      clearActiveSelection();
      return;
    }

    // Apply native DOM Range selection for browser selection highlight
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }

    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const top = rect.top - containerRect.top - 12;
    const left = rect.left - containerRect.left + rect.width / 2;

    const fullText = editorAreaRef.current.innerText || '';
    const extraction = extractSentenceWithBlank(fullText, word);

    // Compute marker rectangle for visual highlight indicator
    const markerRect = {
      top: rect.top - containerRect.top - 1,
      left: rect.left - containerRect.left - 2,
      width: rect.width + 4,
      height: rect.height + 2,
    };

    const newSelection = {
      text: word,
      cleanAnswer: extraction.cleanAnswer,
      extraction,
      position: { top, left },
      markerRect,
      isSentence: false,
      node,
      start,
      end,
    };

    setActiveSelection(newSelection);
    setSelectionToolbar({
      position: { top, left },
      selectedText: extraction.cleanAnswer,
      extraction,
      isSentence: false,
    });
  }, [clearActiveSelection, extractSentenceWithBlank]);

  // 2. Drag Range Selection Handler (Pen Mode & Multiple Words / Sentences)
  const handleRangeSelection = useCallback(() => {
    if (!editorAreaRef.current || !containerRef.current) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      // If user did a non-drag click in pen mode and selection collapsed
      if (selectionMode === 'pen') {
        clearActiveSelection();
      }
      return;
    }

    let range = sel.getRangeAt(0);
    // Ensure selection is inside editorAreaRef
    if (!editorAreaRef.current.contains(range.commonAncestorContainer)) {
      clearActiveSelection();
      return;
    }

    // Auto-snap range to complete word boundaries in Pen Mode and multi-word selection
    // e.g. If the user highlighted "od" instead of "Food", snap it to the full "Food"
    const snappedRange = snapRangeToWordBoundaries(range, editorAreaRef.current);
    if (snappedRange) {
      range = snappedRange;
      sel.removeAllRanges();
      sel.addRange(range);
    }

    const rawText = range.toString().trim();
    if (!rawText || rawText.length === 0) {
      return;
    }

    const rect = range.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const top = rect.top - containerRect.top - 12;
    const left = rect.left - containerRect.left + rect.width / 2;

    const fullText = editorAreaRef.current.innerText || '';
    const extraction = extractSentenceWithBlank(fullText, rawText);

    const markerRect = {
      top: rect.top - containerRect.top - 1,
      left: rect.left - containerRect.left - 2,
      width: rect.width + 4,
      height: rect.height + 2,
    };

    const isMultiWord = rawText.includes(' ');

    const newSelection = {
      text: rawText,
      cleanAnswer: extraction.cleanAnswer,
      extraction,
      position: { top, left },
      markerRect,
      isSentence: isMultiWord,
    };

    setActiveSelection(newSelection);
    setSelectionToolbar({
      position: { top, left },
      selectedText: extraction.cleanAnswer,
      extraction,
      isSentence: isMultiWord,
    });
  }, [selectionMode, clearActiveSelection, extractSentenceWithBlank]);

  // Mouse Down: track coordinates to distinguish single click from drag
  const handleEditorMouseDown = (e) => {
    mouseDownPosRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    isDraggingRef.current = false;
  };

  // Mouse Move: check if user dragged beyond threshold
  const handleEditorMouseMove = (e) => {
    if (!mouseDownPosRef.current) return;
    const dx = Math.abs(e.clientX - mouseDownPosRef.current.x);
    const dy = Math.abs(e.clientY - mouseDownPosRef.current.y);
    if (dx > 5 || dy > 5) {
      isDraggingRef.current = true;
    }
  };

  // Mouse Up: dispatch to single click word selection or drag selection
  const handleEditorMouseUp = (e) => {
    const startPos = mouseDownPosRef.current;
    mouseDownPosRef.current = null;

    // Ignore clicks on buttons, inputs, links, or toolbars
    if (e.target.closest('button, input, select, textarea, a, .text-selection-toolbar')) {
      return;
    }

    const wasDrag = startPos
      ? Math.abs(e.clientX - startPos.x) > 5 || Math.abs(e.clientY - startPos.y) > 5 || isDraggingRef.current
      : isDraggingRef.current;
    isDraggingRef.current = false;

    if (selectionMode === 'word' && !wasDrag) {
      // Single click in Word Selection Mode
      handleWordClick(e.clientX, e.clientY);
    } else {
      // Drag in Word or Pen Mode, or text selection in Pen Mode
      handleRangeSelection();
    }
  };

  // Touch Support for mobile devices
  const handleEditorTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      mouseDownPosRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
      isDraggingRef.current = false;
    }
  };

  const handleEditorTouchEnd = (e) => {
    const startPos = mouseDownPosRef.current;
    mouseDownPosRef.current = null;

    if (!startPos) return;
    const touch = e.changedTouches ? e.changedTouches[0] : null;
    if (!touch) return;

    const wasDrag =
      Math.abs(touch.clientX - startPos.x) > 10 ||
      Math.abs(touch.clientY - startPos.y) > 10 ||
      isDraggingRef.current;

    if (selectionMode === 'word' && !wasDrag) {
      handleWordClick(touch.clientX, touch.clientY);
    } else {
      handleRangeSelection();
    }
  };

  // Keyboard navigation selection support
  const handleEditorKeyUp = (e) => {
    if (e.shiftKey) {
      handleRangeSelection();
    }
  };

  // Mode Switch Handler
  const handleModeChange = (newMode) => {
    if (selectionMode === newMode) return;
    setSelectionMode(newMode);
  };

  // Handle clicking "Create Flashcard" (from either header button or floating toolbar)
  const handleCreateFromSelection = () => {
    if (!activeSelection) {
      setToastWarning('Please click a word or drag across a sentence first to create a flashcard.');
      return;
    }

    const { extraction } = activeSelection;
    const { blankSentence, cleanAnswer } = extraction;

    if (!cleanAnswer || cleanAnswer.trim().length === 0) {
      setToastWarning('Please select a valid word or sentence.');
      return;
    }

    onCreateCardFromSelection({
      front: blankSentence,
      back: cleanAnswer,
      sourceType: 'highlight',
      selectedText: cleanAnswer,
    });

    // Success feedback
    setCreatedToast({
      word: cleanAnswer,
      sentence: blankSentence,
    });

    // Clear selection cleanly
    clearActiveSelection();
  };

  // Keep lessonContent state synced when user types in contenteditable
  const handleEditorInput = () => {
    if (editorAreaRef.current && onContentChange) {
      onContentChange(editorAreaRef.current.innerText);
    }
  };

  // Reset to default sample text
  const handleResetSampleText = () => {
    const sample =
      'Food is what we consume everyday. It provides energy and nutrients needed by the human body.\n\nPhotosynthesis is the process plants use to convert light energy into chemical energy.';
    if (editorAreaRef.current) {
      editorAreaRef.current.innerText = sample;
    }
    if (onContentChange) onContentChange(sample);
    if (onTitleChange) onTitleChange('Food and Nutrition');
    clearActiveSelection();
  };

  return (
    <div className="lesson-text-editor-container" ref={containerRef}>
      {/* Floating Contextual Toolbar when text is selected */}
      {selectionToolbar && (
        <TextSelectionToolbar
          position={selectionToolbar.position}
          selectedText={selectionToolbar.selectedText}
          onClick={handleCreateFromSelection}
          isSentence={selectionToolbar.isSentence}
        />
      )}

      {/* Active Word/Phrase Visual Highlight Marker */}
      {activeSelection?.markerRect && (
        <div
          className="active-word-highlight-marker"
          style={{
            top: `${activeSelection.markerRect.top}px`,
            left: `${activeSelection.markerRect.left}px`,
            width: `${activeSelection.markerRect.width}px`,
            height: `${activeSelection.markerRect.height}px`,
          }}
          aria-hidden="true"
        />
      )}

      {/* Floating Success Feedback Toast */}
      {createdToast && (
        <div className="flashcard-created-toast">
          <span className="toast-icon">✨</span>
          <div className="toast-text">
            <strong>Flashcard Generated:</strong> "{createdToast.sentence}" → <em>{createdToast.word}</em>
          </div>
        </div>
      )}

      {/* Floating Warning Feedback Toast for empty selection */}
      {toastWarning && (
        <div className="flashcard-warning-toast" role="alert">
          <span className="warning-toast-icon">⚠️</span>
          <span>{toastWarning}</span>
        </div>
      )}

      {/* Lesson Title Input */}
      <div className="lesson-editor-field">
        <label className="lesson-field-label" htmlFor="lesson-title-input">
          Lesson Title
        </label>
        <input
          id="lesson-title-input"
          type="text"
          className="lesson-title-input"
          placeholder="e.g. Food and Nutrition"
          value={lessonTitle}
          onChange={(e) => onTitleChange && onTitleChange(e.target.value)}
        />
      </div>

      {/* Lesson Content Area */}
      <div className="lesson-editor-field flex-fill">
        <div className="lesson-content-label-row">
          <div className="lesson-label-group">
            <label className="lesson-field-label">
              Lesson Content
            </label>
            <span className={`selection-mode-pill ${selectionMode === 'pen' ? 'is-pen' : 'is-word'}`}>
              {selectionMode === 'word' ? '👆 WORD SELECT' : '🖊️ PEN MODE'}
            </span>
          </div>

          <div className="editor-tools-row">
            {/* Pen Tool / Selection Mode Toggle */}
            <div
              className="selection-mode-toggle"
              role="radiogroup"
              aria-label="Selection Tool Mode"
            >
              <button
                type="button"
                role="radio"
                aria-checked={selectionMode === 'word'}
                className={`mode-toggle-btn ${selectionMode === 'word' ? 'is-active' : ''}`}
                onClick={() => handleModeChange('word')}
                onMouseDown={(e) => e.preventDefault()}
                title="Word Selection Mode: Click any word once to select it"
              >
                <span className="mode-btn-icon">👆</span>
                <span className="mode-btn-label">Word Select</span>
                {selectionMode === 'word' && <span className="mode-active-dot" aria-hidden="true" />}
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={selectionMode === 'pen'}
                className={`mode-toggle-btn ${selectionMode === 'pen' ? 'is-active' : ''}`}
                onClick={() => handleModeChange('pen')}
                onMouseDown={(e) => e.preventDefault()}
                title="Pen Selection Mode: Click and drag across text to select sentences or phrases"
              >
                <span className="mode-btn-icon">🖊️</span>
                <span className="mode-btn-label">Pen Mode</span>
                {selectionMode === 'pen' && <span className="mode-active-dot" aria-hidden="true" />}
              </button>
            </div>

            <div className="editor-action-buttons-group">
              {/* Direct Header Create Flashcard Action Button */}
              <button
                type="button"
                className={`btn-header-create-card ${activeSelection ? 'has-selection' : 'is-disabled'}`}
                onClick={handleCreateFromSelection}
                onMouseDown={(e) => e.preventDefault()}
                title={
                  activeSelection
                    ? `Create flashcard for "${activeSelection.cleanAnswer}"`
                    : 'Click a word or drag across a sentence to select it first'
                }
                aria-label="Create Flashcard from selection"
              >
                <span className="btn-lightning-icon">⚡</span>
                <span>Create Flashcard</span>
                {activeSelection && (
                  <span className="header-card-preview-chip">
                    "{activeSelection.cleanAnswer.length > 14
                      ? `${activeSelection.cleanAnswer.substring(0, 14)}...`
                      : activeSelection.cleanAnswer}"
                  </span>
                )}
              </button>

              {/* Reset / Sample Text Button */}
              <button
                type="button"
                className="btn-tool-sample"
                onClick={handleResetSampleText}
                onMouseDown={(e) => e.preventDefault()}
                title="Reset to default study lesson sample"
              >
                Sample Text
              </button>
            </div>
          </div>
        </div>

        {/* Natural Highlightable & Editable Document Stage */}
        <div
          ref={editorAreaRef}
          className={`lesson-editable-content ${selectionMode === 'word' ? 'is-word-mode' : 'is-pen-mode'}`}
          contentEditable
          suppressContentEditableWarning
          onInput={handleEditorInput}
          onMouseDown={handleEditorMouseDown}
          onMouseMove={handleEditorMouseMove}
          onMouseUp={handleEditorMouseUp}
          onTouchStart={handleEditorTouchStart}
          onTouchEnd={handleEditorTouchEnd}
          onKeyUp={handleEditorKeyUp}
          data-placeholder="Type or paste your lesson notes here... Highlight words to make flashcards."
          spellCheck={false}
        />

        {/* Highlighting Guidance Footer */}
        <div className="editor-highlight-tip">
          <span className="tip-sparkle">✦</span>
          <span className="tip-text">
            {selectionMode === 'word' ? (
              <>
                <strong>Click any individual word once</strong> to select it and generate an instant fill-in-the-blank card.
              </>
            ) : (
              <>
                <strong>Pen Mode active:</strong> Click and drag across text to select sentences or multi-word phrases.
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

