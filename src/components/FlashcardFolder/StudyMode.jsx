import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import StudyResults from './StudyResults';
import ReviewMistakes from './ReviewMistakes';
import AnswerFeedbackNotification from './AnswerFeedbackNotification';
import StudyCompletionModal from './StudyCompletionModal';
import './FlashcardFolder.css';

/**
 * Subject-specific fallback distractors for when the folder has fewer than 4 flashcards
 */
const FALLBACK_DISTRACTORS = [
  'Force equals mass times acceleration.',
  'An object stays at rest or in motion unless a net force acts on it.',
  '2',
  '2x',
  'Watt',
  'Newton',
  'Joule',
  'The instantaneous rate of change of mass with respect to time.',
  'An object remains in perpetual motion regardless of external applied forces.',
  'Force is directly proportional to displacement divided by friction coefficient.',
  'The total mechanical energy in a closed non-isolated system always halves.',
  'A scalar physical quantity measured strictly in kilograms per cubic meter.',
  'The resistance of a semiconductor material to electron flow at absolute zero.',
  'Energy transferred solely through electromagnetic radiation in a vacuum.',
  'A vector quantity defined by the rate of change of momentum over distance.',
  'The work required to accelerate a body of a given mass from rest to velocity.',
  'The internal thermal equilibrium state achieved only during adiabatic expansion.',
];

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffleArray(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Circular Countdown Timer Ring Component
 */
function TimerRing({ timeLeft, totalTime = 10, isTimedOut = false }) {
  const radius = 13;
  const strokeWidth = 2.5;
  const circumference = 2 * Math.PI * radius; // ~81.68
  const strokeDashoffset = circumference - (Math.max(0, timeLeft) / totalTime) * circumference;

  let strokeColor = '#00D69A'; // Emerald cyan default
  if (isTimedOut || timeLeft === 0) {
    strokeColor = '#FFAA32'; // Amber orange for timeout
  } else if (timeLeft <= 2) {
    strokeColor = '#FF405C'; // Red alert
  } else if (timeLeft <= 4) {
    strokeColor = '#FFAA32'; // Amber warning
  }

  return (
    <div
      className={`study-timer-ring-wrap ${isTimedOut ? 'is-timed-out' : ''} ${timeLeft <= 2 && !isTimedOut ? 'is-critical' : ''}`}
      title={isTimedOut ? "Time's Up!" : `${timeLeft}s remaining`}
    >
      <svg className="study-timer-svg" width="34" height="34" viewBox="0 0 34 34">
        {/* Track circle */}
        <circle
          cx="17"
          cy="17"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress ring */}
        <circle
          cx="17"
          cy="17"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={isTimedOut ? circumference : strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 17 17)"
          style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s ease' }}
        />
      </svg>
      {isTimedOut ? (
        <span className="study-timer-val is-clock-indicator" aria-label="Time's Up">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFAA32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
      ) : (
        <span className="study-timer-val" style={{ color: strokeColor }}>
          {timeLeft}
        </span>
      )}
    </div>
  );
}

/**
 * Segmented Progress Bar Component matching the reference designs
 */
function SegmentedProgressBar({ currentIndex, total }) {
  const segmentCount = Math.max(1, total);

  return (
    <div
      className="study-segmented-progress"
      role="progressbar"
      aria-valuenow={currentIndex + 1}
      aria-valuemin={1}
      aria-valuemax={segmentCount}
    >
      {Array.from({ length: segmentCount }).map((_, idx) => {
        let status = 'upcoming';
        if (idx < currentIndex) status = 'completed';
        else if (idx === currentIndex) status = 'active';

        return (
          <div
            key={`seg-${idx}`}
            className={`study-progress-segment is-${status}`}
          />
        );
      })}
    </div>
  );
}

/**
 * StudyMode - High-fidelity Flashcard Study Experience for AURA
 * Fully implements the dedicated question & answer interface matching the reference designs:
 * 1. Mobile View (media_1792341619033.png): Single-column, compact header, stacked choices, bottom hint.
 * 2. Web View (media_1792341737951.png): 2-Column Grid (Main Quiz + Session Stats & Shortcuts Sidebar).
 *
 * @param {Object} props
 * @param {Array<Object>} props.cards - Flashcard list
 * @param {Object} props.folder - Folder info
 * @param {Function} props.onExit - Callback to return to folder overview
 * @param {Function} props.onRecordStudyResult - (cardId, isCorrect) => void
 * @param {Function} props.onSessionComplete - (sessionSummary) => void
 */
export default function StudyMode({
  cards = [],
  folder,
  onExit,
  onBackToFolders,
  onRecordStudyResult,
  onSessionComplete,
}) {
  const [sessionCards, setSessionCards] = useState(() => [...cards]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Gamified Session Stats
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [mistakesList, setMistakesList] = useState([]);
  const [sessionResults, setSessionResults] = useState([]);

  // Completion Modal State & Ref Guards
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const hasCompletedRef = useRef(false);
  const statsRef = useRef({
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    xp: 0,
    results: [],
  });

  // Interactive Question State
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // Active view: 'quiz' | 'results' | 'mistakes'
  const [studyView, setStudyView] = useState('quiz');

  // Question Card & Text Refs for dynamic font-size fitting
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const rafRef = useRef(null);

  // Dynamic question font size auto-fitting algorithm
  // Adapts from maxFs (~32px mobile / ~40px desktop) down to minFs (16px mobile / 20px desktop)
  const fitQuestionText = useCallback(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const isMobile = window.innerWidth <= 900;
    const isShortScreen = window.innerHeight < 600;

    // Bounds:
    // Short questions (1-30 chars) up to 32px on mobile (40px desktop)
    // Scale smoothly down to 16px minimum on mobile (14px on very short screens)
    const maxFs = isMobile ? (isShortScreen ? 24 : 32) : 40;
    const minFs = isMobile ? (isShortScreen ? 14 : 16) : 20;

    // Temporarily disable overflow scrollbars for accurate dimension measurement
    const originalOverflow = container.style.overflowY;
    container.style.overflowY = 'hidden';

    const availHeight = container.clientHeight;
    const availWidth = container.clientWidth;

    if (availHeight <= 0 || availWidth <= 0) {
      container.style.overflowY = originalOverflow;
      return;
    }

    // Step down from maxFs to minFs in 1px steps until text fits without clipping
    let fs = maxFs;
    for (; fs > minFs; fs--) {
      textEl.style.fontSize = `${fs}px`;
      textEl.style.lineHeight = '1.25';
      if (textEl.scrollHeight <= availHeight && textEl.scrollWidth <= availWidth) {
        break;
      }
    }
    textEl.style.fontSize = `${fs}px`;
    textEl.style.lineHeight = '1.25';

    // If text still overflows at minFs, allow only the question card to scroll internally
    const overflowsAtMin = textEl.scrollHeight > availHeight;
    container.style.overflowY = overflowsAtMin ? 'auto' : 'hidden';
  }, []);

  // Debounced fit scheduler
  const scheduleFit = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      fitQuestionText();
    });
  }, [fitQuestionText]);

  // Mount effect: hide global navbar, breadcrumbs, and parent spacing during study mode, and scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
    const scrollContainers = document.querySelectorAll('.my-folders-page-root, .flashcard-folder-root, #root, html, body');
    scrollContainers.forEach((el) => {
      if (el) el.scrollTop = 0;
    });
    document.body.classList.add('aura-study-mode-active');
    return () => {
      document.body.classList.remove('aura-study-mode-active');
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const prevFolderIdRef = useRef(folder?.id);

  // Sync session ONLY if folder changes or if session is empty and cards arrive
  useEffect(() => {
    const isNewFolder = folder?.id && folder.id !== prevFolderIdRef.current;
    if (isNewFolder) {
      prevFolderIdRef.current = folder.id;
      setSessionCards([...cards]);
      setCurrentIndex(0);
      setCorrectCount(0);
      setIncorrectCount(0);
      setUnansweredCount(0);
      setStreak(0);
      setBestStreak(0);
      setXpEarned(0);
      setMistakesList([]);
      setSessionResults([]);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
      setTimeLeft(10);
      setIsCompletionModalOpen(false);
      hasCompletedRef.current = false;
      statsRef.current = {
        correct: 0,
        incorrect: 0,
        unanswered: 0,
        xp: 0,
        results: [],
      };
      setStudyView('quiz');
    } else if (sessionCards.length === 0 && cards.length > 0) {
      setSessionCards([...cards]);
    }
  }, [folder?.id, cards, sessionCards.length]);

  const totalCards = sessionCards.length;
  const currentCard = sessionCards[currentIndex] || null;

  // Generate 4 randomized multiple-choice options (1 correct answer + 3 distinct distractors)
  const optionsData = useMemo(() => {
    if (!currentCard) return { options: [], correctIndex: 0 };

    const correctAnswer = (currentCard.answer || currentCard.back || '').trim();

    // Collect distractors from other flashcards in the folder
    const poolFromCards = sessionCards
      .filter((c) => c.id !== currentCard.id)
      .map((c) => (c.answer || c.back || '').trim())
      .filter((ans) => Boolean(ans) && ans !== correctAnswer);

    const uniqueFromCards = Array.from(new Set(poolFromCards));
    const chosenDistractors = [...uniqueFromCards];
    let fallbackIdx = 0;
    while (chosenDistractors.length < 3 && fallbackIdx < FALLBACK_DISTRACTORS.length) {
      const fallback = FALLBACK_DISTRACTORS[fallbackIdx];
      if (fallback !== correctAnswer && !chosenDistractors.includes(fallback)) {
        chosenDistractors.push(fallback);
      }
      fallbackIdx++;
    }

    const rawChoices = [correctAnswer, ...chosenDistractors.slice(0, 3)];
    const shuffledChoices = shuffleArray(rawChoices);
    const correctIndex = shuffledChoices.indexOf(correctAnswer);

    return {
      options: shuffledChoices,
      correctIndex,
    };
  }, [currentCard?.id, sessionCards]);

  // Answer handler - prevents duplicate submissions and updates actual session data
  const handleSelectOption = useCallback((optIdx) => {
    if (isAnswered || !currentCard) return;

    setSelectedOptionIndex(optIdx);
    setIsAnswered(true);

    const isCorrect = optIdx === optionsData.correctIndex;
    const selectedAnswerText = optionsData.options[optIdx];
    const correctAnswerText = optionsData.options[optionsData.correctIndex];
    const letterPrefixes = ['A', 'B', 'C', 'D'];
    const selectedLetter = letterPrefixes[optIdx] || 'A';
    const correctLetter = letterPrefixes[optionsData.correctIndex] || 'A';

    const currentQText = currentCard.question || currentCard.front || 'Untitled Question';

    const resultRecord = {
      cardId: currentCard.id,
      questionIndex: currentIndex,
      question: currentQText,
      selectedOptionIndex: optIdx,
      selectedAnswer: `${selectedLetter}. ${selectedAnswerText}`,
      rawSelectedAnswer: selectedAnswerText,
      selectedLetter,
      correctOptionIndex: optionsData.correctIndex,
      correctAnswer: `${correctLetter}. ${correctAnswerText}`,
      rawCorrectAnswer: correctAnswerText,
      correctLetter,
      status: isCorrect ? 'correct' : 'incorrect',
      isAnswered: true,
      isCorrect,
      isTimeout: false,
    };

    setSessionResults((prev) => {
      const updated = [...prev];
      updated[currentIndex] = resultRecord;
      return updated;
    });

    statsRef.current.results[currentIndex] = resultRecord;

    if (isCorrect) {
      setCorrectCount((prev) => {
        const next = prev + 1;
        statsRef.current.correct = next;
        return next;
      });
      setXpEarned((prev) => {
        const next = prev + 10;
        statsRef.current.xp = next;
        return next;
      });
      setStreak((prev) => {
        const nextStreak = prev + 1;
        setBestStreak((b) => Math.max(b, nextStreak));
        return nextStreak;
      });
    } else {
      setIncorrectCount((prev) => {
        const next = prev + 1;
        statsRef.current.incorrect = next;
        return next;
      });
      setStreak(0);
      setMistakesList((prev) => [
        ...prev,
        {
          question: currentQText,
          selectedAnswer: `${selectedLetter}. ${selectedAnswerText}`,
          correctAnswer: `${correctLetter}. ${correctAnswerText}`,
          index: currentIndex,
        },
      ]);
    }

    if (onRecordStudyResult) {
      onRecordStudyResult(currentCard.id, isCorrect);
    }
  }, [isAnswered, currentCard, optionsData, currentIndex, onRecordStudyResult]);

  // Advance to next question or complete session
  const handleNext = useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
      setTimeLeft(10);
    } else {
      // Completed all questions in the session
      const total = totalCards;
      const finalCorrect = statsRef.current.correct;
      const finalIncorrect = statsRef.current.incorrect;
      const finalAnswered = finalCorrect + finalIncorrect;
      const finalUnanswered = Math.max(0, total - finalAnswered);
      const finalXp = finalCorrect * 10;

      const calculatedAccuracy =
        total > 0 ? Math.round((finalCorrect / total) * 100) : 0;

      // Ensure completion logic and XP award are triggered exactly once
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        if (onSessionComplete) {
          onSessionComplete({
            totalQuestions: total,
            answeredQuestions: finalAnswered,
            unansweredQuestions: finalUnanswered,
            correctAnswers: finalCorrect,
            incorrectAnswers: finalIncorrect,
            accuracy: calculatedAccuracy,
            xpEarned: finalXp,
          });
        }
      }

      // Automatically display completion popup
      setIsCompletionModalOpen(true);
    }
  }, [currentIndex, totalCards, onSessionComplete]);

  // Auto-advance / trigger completion popup on final question
  useEffect(() => {
    if (!isAnswered || currentIndex !== totalCards - 1 || isCompletionModalOpen) return;

    // A short 2.2s delay allows the user to see the feedback card, then opens the completion modal
    // Clicking "View Results" or pressing Enter triggers it immediately
    const autoAdvanceTimer = setTimeout(() => {
      handleNext();
    }, 2200);

    return () => clearTimeout(autoAdvanceTimer);
  }, [isAnswered, currentIndex, totalCards, isCompletionModalOpen, handleNext]);

  // Timer countdown hook - counts expiration as UNANSWERED (not incorrect)
  useEffect(() => {
    if (isAnswered || studyView !== 'quiz' || !currentCard || isCompletionModalOpen) return;

    if (timeLeft <= 0) {
      // Time ran out! Mark question as UNANSWERED
      setIsAnswered(true);
      setSelectedOptionIndex(-1);

      const correctAnswerText = optionsData.options[optionsData.correctIndex];
      const letterPrefixes = ['A', 'B', 'C', 'D'];
      const correctLetter = letterPrefixes[optionsData.correctIndex] || 'A';
      const currentQText = currentCard.question || currentCard.front || 'Untitled Question';

      const timeoutRecord = {
        cardId: currentCard.id,
        questionIndex: currentIndex,
        question: currentQText,
        selectedOptionIndex: -1,
        selectedAnswer: '(No answer - Time expired)',
        rawSelectedAnswer: null,
        selectedLetter: null,
        correctOptionIndex: optionsData.correctIndex,
        correctAnswer: `${correctLetter}. ${correctAnswerText}`,
        rawCorrectAnswer: correctAnswerText,
        correctLetter,
        status: 'unanswered',
        isAnswered: false,
        isCorrect: false,
        isTimeout: true,
      };

      setSessionResults((prev) => {
        const updated = [...prev];
        updated[currentIndex] = timeoutRecord;
        return updated;
      });

      statsRef.current.results[currentIndex] = timeoutRecord;

      setUnansweredCount((prev) => {
        const next = prev + 1;
        statsRef.current.unanswered = next;
        return next;
      });
      setStreak(0);

      setMistakesList((prev) => [
        ...prev,
        {
          question: currentQText,
          selectedAnswer: 'Time ran out',
          correctAnswer: `${correctLetter}. ${correctAnswerText}`,
          index: currentIndex,
        },
      ]);

      if (onRecordStudyResult) {
        onRecordStudyResult(currentCard.id, false);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, studyView, currentCard, optionsData, currentIndex, isCompletionModalOpen, onRecordStudyResult]);

  // Keyboard shortcuts (A, B, C, D to answer, Enter to advance)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If completion popup modal is open, avoid triggering quiz shortcuts
      if (isCompletionModalOpen) return;
      if (studyView !== 'quiz') return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const key = e.key.toUpperCase();
      if (!isAnswered) {
        if (key === 'A' || key === '1') handleSelectOption(0);
        else if (key === 'B' || key === '2') handleSelectOption(1);
        else if (key === 'C' || key === '3') handleSelectOption(2);
        else if (key === 'D' || key === '4') handleSelectOption(3);
      } else {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, studyView, isCompletionModalOpen, handleSelectOption, handleNext]);

  // Restart Study Session
  const handleStudyAgain = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setSessionCards(shuffled);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setUnansweredCount(0);
    setStreak(0);
    setBestStreak(0);
    setXpEarned(0);
    setMistakesList([]);
    setSessionResults([]);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setTimeLeft(10);
    setIsCompletionModalOpen(false);
    hasCompletedRef.current = false;
    statsRef.current = {
      correct: 0,
      incorrect: 0,
      unanswered: 0,
      xp: 0,
      results: [],
    };
    setStudyView('quiz');
  };

  // Navigate back to folders
  const handleBackToFolders = () => {
    setIsCompletionModalOpen(false);
    if (onBackToFolders) {
      onBackToFolders();
    } else if (onExit) {
      onExit();
    }
  };

  const accuracy =
    totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

  // Empty state handling
  if (totalCards === 0) {
    return (
      <div className="study-mode-root" role="region" aria-label="Study Session">
        <div className="flashcards-empty-state">
          <div className="empty-state-icon">🗂</div>
          <h2 className="empty-state-title">NO FLASHCARDS TO STUDY</h2>
          <p className="empty-state-text">
            This folder does not have any flashcards yet. Add flashcards before starting a study session.
          </p>
          <button type="button" className="btn-result-back-folder" onClick={onExit}>
            ← Back to Folder Overview
          </button>
        </div>
      </div>
    );
  }

  // View: Results
  if (studyView === 'results') {
    return (
      <div className="study-redesign-root" role="region" aria-label="Study Results">
        <StudyCompletionModal
          isOpen={true}
          folderTitle={folder?.title || 'Physics Midterms'}
          totalQuestions={totalCards}
          answeredQuestions={correctCount + incorrectCount}
          unansweredQuestions={Math.max(0, totalCards - (correctCount + incorrectCount))}
          correctAnswers={correctCount}
          incorrectAnswers={incorrectCount}
          xpEarned={correctCount * 10}
          questionResults={sessionResults}
          onBackToFolders={handleBackToFolders}
          onStudyAgain={handleStudyAgain}
          onClose={() => setStudyView('quiz')}
        />
      </div>
    );
  }

  // View: Review Mistakes
  if (studyView === 'mistakes') {
    return (
      <div className="study-mode-root" role="region" aria-label="Review Mistakes">
        <ReviewMistakes
          mistakes={mistakesList}
          onBackToResults={() => setStudyView('results')}
          onBackToFolder={onExit}
        />
      </div>
    );
  }

  const questionText = currentCard?.question || currentCard?.front || 'Untitled Question';
  const feedbackState = !isAnswered
    ? null
    : selectedOptionIndex === -1
    ? 'timeout'
    : selectedOptionIndex === optionsData.correctIndex
    ? 'correct'
    : 'wrong';

  const progressPercent = totalCards > 0
    ? Math.round(((currentIndex + (isAnswered ? 1 : 0)) / totalCards) * 100)
    : 0;
  const correctPercent = totalCards > 0
    ? (correctCount / totalCards) * 100
    : 0;
  const incorrectPercent = totalCards > 0
    ? (incorrectCount / totalCards) * 100
    : 0;

  // Trigger fit whenever currentIndex, question text or feedbackState changes
  useEffect(() => {
    scheduleFit();
  }, [currentIndex, questionText, feedbackState, scheduleFit]);

  // Window resize, orientation change, document fonts ready, and ResizeObserver listeners
  useEffect(() => {
    window.addEventListener('resize', scheduleFit);
    window.addEventListener('orientationchange', scheduleFit);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        scheduleFit();
      });
    }

    let ro = null;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => {
        scheduleFit();
      });
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', scheduleFit);
      window.removeEventListener('orientationchange', scheduleFit);
      if (ro) ro.disconnect();
    };
  }, [scheduleFit]);

  return (
    <div className="study-quiz-root" role="region" aria-label="Practice Quiz">
      {/* Ambient Cyber Red Glow */}
      <div className="study-quiz-ambient-glow" aria-hidden="true" />

      {/* ========================================================
          1. TOP NAVIGATION HEADER (Flip Cards Style)
          ======================================================== */}
      <header className="study-quiz-top-bar" aria-label="Practice Quiz Header">
        {/* Left: Exit button */}
        <div className="study-quiz-top-left">
          <button
            type="button"
            className="btn-quiz-exit"
            onClick={onExit}
            aria-label="Exit Practice Quiz"
          >
            <span className="quiz-exit-icon" aria-hidden="true">✕</span>
            <span>Exit</span>
          </button>
        </div>

        {/* Center: PRACTICE QUIZ + Question pill */}
        <div className="study-quiz-top-center">
          <h1 className="study-quiz-title">PRACTICE QUIZ</h1>
          <span className="study-quiz-question-pill">
            Question {currentIndex + 1} of {totalCards}
          </span>
        </div>

        {/* Right: +10 XP chip, Countdown Timer, Coin balance */}
        <div className="study-quiz-top-right">
          <div className="quiz-xp-chip" title="+10 XP for correct answer">
            <span className="quiz-xp-bolt" aria-hidden="true">⚡</span>
            <span>+10 XP</span>
          </div>

          <div className="quiz-timer-pill" title={isAnswered && selectedOptionIndex === -1 ? "Time's Up!" : `${timeLeft}s remaining`}>
            <TimerRing
              timeLeft={timeLeft}
              totalTime={10}
              isTimedOut={isAnswered && selectedOptionIndex === -1}
            />
          </div>

          <div className="quiz-coins-badge" title="Coin Balance">
            <span className="quiz-coins-icon" aria-hidden="true">🪙</span>
            <span className="quiz-coins-val">2,450</span>
          </div>
        </div>
      </header>

      {/* ========================================================
          2. PROGRESS ROW (Flip Cards Progress Style with Right Stats)
          ======================================================== */}
      <section className="study-quiz-progress-section" aria-label="Quiz Progress and Live Stats">
        <div className="study-quiz-progress-meta-row">
          <div className="study-quiz-progress-stats">
            <span className="quiz-meta-stat">
              <span className="quiz-meta-dot is-correct" aria-hidden="true">●</span>
              <span className="quiz-meta-label">Correct</span>
              <span className="quiz-meta-val">{correctCount}</span>
            </span>
            <span className="quiz-meta-stat">
              <span className="quiz-meta-dot is-streak" aria-hidden="true">●</span>
              <span className="quiz-meta-label">Streak</span>
              <span className="quiz-meta-val">{streak}</span>
            </span>
            <span className="quiz-meta-pct">{progressPercent}% complete</span>
          </div>
        </div>

        <div className="study-quiz-progress-track">
          <div
            className="study-quiz-progress-fill is-correct"
            style={{ width: `${correctPercent}%` }}
            aria-hidden="true"
          />
          <div
            className="study-quiz-progress-fill is-incorrect"
            style={{ width: `${incorrectPercent}%` }}
            aria-hidden="true"
          />
        </div>
      </section>

      {/* ========================================================
          3. MAIN TWO-COLUMN WORKSPACE (Main Quiz + 320px Right Column)
          ======================================================== */}
      <div className="study-quiz-workspace-grid">
        {/* ---------------- LEFT / MAIN QUIZ AREA ---------------- */}
        <main className="study-quiz-main-col">
          {/* Question Card */}
          <div
            className={`quiz-question-hero-card ${feedbackState ? `feedback-${feedbackState} has-feedback` : ''}`}
            ref={cardRef}
          >
            {/* Faint decorative concentric-ring pattern in top-right corner */}
            <svg className="quiz-card-radar-rings" width="220" height="220" viewBox="0 0 220 220" fill="none" aria-hidden="true">
              <circle cx="220" cy="0" r="50" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
              <circle cx="220" cy="0" r="95" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
              <circle cx="220" cy="0" r="140" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
              <circle cx="220" cy="0" r="185" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
            </svg>

            {/* Glowing notch */}
            <div
              className={`quiz-card-glowing-notch ${feedbackState ? `notch-${feedbackState}` : ''}`}
              aria-hidden="true"
            />

            {/* Card Header: QUESTION 01 / 05 tag + status chip */}
            <div className="quiz-card-header">
              <div className="quiz-card-tag">
                <span>QUESTION {String(currentIndex + 1).padStart(2, '0')} / {String(totalCards).padStart(2, '0')}</span>
              </div>

              <div className="quiz-card-status-chip">
                <span>{currentCard?.lessonTag || 'Practice'}</span>
              </div>
            </div>

            {/* Card Body with Question text */}
            <div className="quiz-card-body" ref={containerRef}>
              <h2 className="quiz-card-question-text" ref={textRef}>
                {questionText}
              </h2>
            </div>

            {/* Answer Feedback Notification (if answered) */}
            {isAnswered && (
              <AnswerFeedbackNotification
                feedbackState={feedbackState}
                correctAnswerText={optionsData.options[optionsData.correctIndex]}
                xpEarned={10}
                isLastQuestion={currentIndex === totalCards - 1}
                onNext={handleNext}
              />
            )}

            {/* Card Footer: Tap hint pill */}
            <div className="quiz-card-footer">
              {!isAnswered ? (
                <div className="quiz-card-bottom-pill">
                  <span className="quiz-pill-cue" aria-hidden="true">⏱</span>
                  <span>Tap an answer before time runs out</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="quiz-card-bottom-pill is-action"
                  onClick={handleNext}
                >
                  <span className="quiz-pill-cue" aria-hidden="true">➔</span>
                  <span>Press Enter or tap for {currentIndex === totalCards - 1 ? 'Results' : 'Next Question'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Multiple-Choice Answer Choices (2x2 Grid) */}
          <div className="quiz-choices-grid" role="radiogroup" aria-label="Answer Choices">
            {optionsData.options.map((optionText, optIdx) => {
              const letter = ['A', 'B', 'C', 'D'][optIdx];
              const isSelected = selectedOptionIndex === optIdx;
              const isCorrectChoice = optIdx === optionsData.correctIndex;

              let choiceState = '';
              if (isAnswered) {
                if (isCorrectChoice) {
                  choiceState = 'is-correct';
                } else if (isSelected && !isCorrectChoice) {
                  choiceState = 'is-incorrect aura-shake';
                } else {
                  choiceState = 'is-dimmed';
                }
              }

              return (
                <button
                  key={`choice-${cardKey(currentCard?.id)}-${optIdx}`}
                  type="button"
                  className={`quiz-choice-card ${choiceState}`}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswered}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="quiz-choice-letter-badge">
                    {letter}
                  </div>
                  <span className="quiz-choice-text">{optionText}</span>

                  {/* Status Indicator */}
                  {isAnswered && (isCorrectChoice || isSelected) && (
                    <div
                      className={`quiz-choice-status-icon ${
                        isCorrectChoice ? 'icon-correct' : 'icon-wrong'
                      }`}
                      aria-hidden="true"
                    >
                      {isCorrectChoice ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ff405c"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </main>

        {/* ---------------- RIGHT COLUMN (320px) ---------------- */}
        <aside className="study-quiz-right-col" aria-label="Session Overview and Shortcuts">
          <div className="quiz-sidebar-panel">
            {/* 1. Folder Info Row (compact) */}
            <div className="quiz-sidebar-folder-row">
              <div className="quiz-sidebar-folder-icon" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#ef4444">
                  <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                </svg>
              </div>
              <div className="quiz-sidebar-folder-meta">
                <h2 className="quiz-sidebar-folder-name">{folder?.title || 'Test'}</h2>
                <p className="quiz-sidebar-folder-sub">Flashcard study session</p>
              </div>
            </div>

            {/* 2. Session Stats (Compact 2x2 Grid) */}
            <div className="quiz-sidebar-stats-section">
              <h3 className="quiz-sidebar-section-title">Session Stats</h3>
              <div className="quiz-sidebar-stats-grid">
                <div className="quiz-stat-tile">
                  <span className="quiz-stat-val is-correct">{correctCount}</span>
                  <span className="quiz-stat-label">Correct</span>
                </div>
                <div className="quiz-stat-tile">
                  <span className="quiz-stat-val is-xp">+{xpEarned}</span>
                  <span className="quiz-stat-label">XP earned</span>
                </div>
                <div className="quiz-stat-tile">
                  <span className="quiz-stat-val is-streak">{streak}</span>
                  <span className="quiz-stat-label">Streak</span>
                </div>
                <div className="quiz-stat-tile">
                  <span className="quiz-stat-val is-best">{bestStreak}</span>
                  <span className="quiz-stat-label">Best streak</span>
                </div>
              </div>
            </div>

            {/* 3. Keyboard Shortcuts */}
            <div className="quiz-sidebar-shortcuts-section">
              <h3 className="quiz-sidebar-section-title">Keyboard shortcuts</h3>
              <div className="quiz-shortcuts-list">
                <div className="quiz-shortcut-row">
                  <span className="quiz-shortcut-desc">pick an answer</span>
                  <div className="quiz-keycap-cluster">
                    <kbd className="quiz-keycap">A</kbd>
                    <kbd className="quiz-keycap">B</kbd>
                    <kbd className="quiz-keycap">C</kbd>
                    <kbd className="quiz-keycap">D</kbd>
                  </div>
                </div>
                <div className="quiz-shortcut-row">
                  <span className="quiz-shortcut-desc">next card</span>
                  <kbd className="quiz-keycap is-enter">Enter</kbd>
                </div>
              </div>
            </div>

          </div>
        </aside>
      </div>

      {/* ========================================================
          3. STUDY SESSION COMPLETION & DETAILED SUMMARY POPUP MODAL
          ======================================================== */}
      <StudyCompletionModal
        isOpen={isCompletionModalOpen}
        folderTitle={folder?.title || 'Physics Midterms'}
        totalQuestions={totalCards}
        answeredQuestions={correctCount + incorrectCount}
        unansweredQuestions={Math.max(0, totalCards - (correctCount + incorrectCount))}
        correctAnswers={correctCount}
        incorrectAnswers={incorrectCount}
        xpEarned={correctCount * 10}
        questionResults={sessionResults}
        onBackToFolders={handleBackToFolders}
        onStudyAgain={handleStudyAgain}
        onClose={() => setIsCompletionModalOpen(false)}
      />
    </div>
  );
}

// Helper to create safe React keys
function cardKey(id) {
  return id || 'card';
}
