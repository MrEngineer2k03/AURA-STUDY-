import React, { useState, useEffect, useMemo, useCallback } from 'react';
import StudyResults from './StudyResults';
import ReviewMistakes from './ReviewMistakes';
import './FlashcardFolder.css';

/**
 * Subject-specific fallback distractors for when the folder has fewer than 4 flashcards
 */
const FALLBACK_DISTRACTORS = [
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
  'meow',
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
function TimerRing({ timeLeft, totalTime = 10 }) {
  const radius = 13;
  const strokeWidth = 2.5;
  const circumference = 2 * Math.PI * radius; // ~81.68
  const strokeDashoffset = circumference - (Math.max(0, timeLeft) / totalTime) * circumference;

  let strokeColor = '#10b981'; // Cyan / emerald
  if (timeLeft <= 2) {
    strokeColor = '#ef4444'; // Red alert
  } else if (timeLeft <= 4) {
    strokeColor = '#f59e0b'; // Amber warning
  }

  return (
    <div className="study-timer-ring-wrap" title={`${timeLeft}s remaining`}>
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
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 17 17)"
          style={{ transition: 'stroke-dashoffset 0.8s linear, stroke 0.3s ease' }}
        />
      </svg>
      <span className="study-timer-val" style={{ color: strokeColor }}>
        {timeLeft}
      </span>
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
  onRecordStudyResult,
  onSessionComplete,
}) {
  const [sessionCards, setSessionCards] = useState(() => [...cards]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Gamified Session Stats
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [mistakesList, setMistakesList] = useState([]);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState(new Set());

  // Interactive Question State
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // Active view: 'quiz' | 'results' | 'mistakes'
  const [studyView, setStudyView] = useState('quiz');

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
    };
  }, []);

  // Reset/sync session if cards change
  useEffect(() => {
    setSessionCards([...cards]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setXpEarned(0);
    setMistakesList([]);
    setAnsweredQuestionIds(new Set());
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setTimeLeft(10);
    setStudyView('quiz');
  }, [cards]);

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

  // Answer handler
  const handleSelectOption = useCallback((optIdx) => {
    if (isAnswered || !currentCard) return;

    setSelectedOptionIndex(optIdx);
    setIsAnswered(true);

    const isCorrect = optIdx === optionsData.correctIndex;
    const selectedAnswerText = optionsData.options[optIdx];
    const correctAnswerText = optionsData.options[optionsData.correctIndex];

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => {
        const nextStreak = prev + 1;
        setBestStreak((b) => Math.max(b, nextStreak));
        return nextStreak;
      });
      setXpEarned((prev) => prev + 10);
    } else {
      setIncorrectCount((prev) => prev + 1);
      setStreak(0);
      setMistakesList((prev) => [
        ...prev,
        {
          question: currentCard.question || currentCard.front,
          selectedAnswer: selectedAnswerText,
          correctAnswer: correctAnswerText,
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
      // Completed all questions
      const completionBonus = 20;
      const perfectBonus = incorrectCount === 0 && correctCount > 0 ? 50 : 0;
      const finalXp = xpEarned + completionBonus + perfectBonus;
      setXpEarned(finalXp);

      const calculatedAccuracy =
        totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

      if (onSessionComplete) {
        onSessionComplete({
          totalQuestions: totalCards,
          correctAnswers: correctCount,
          incorrectAnswers: incorrectCount,
          accuracy: calculatedAccuracy,
          xpEarned: finalXp,
        });
      }

      setStudyView('results');
    }
  }, [currentIndex, totalCards, incorrectCount, correctCount, xpEarned, onSessionComplete]);

  // Timer countdown hook
  useEffect(() => {
    if (isAnswered || studyView !== 'quiz' || !currentCard) return;

    if (timeLeft <= 0) {
      // Time ran out!
      setIsAnswered(true);
      setSelectedOptionIndex(-1);
      setIncorrectCount((prev) => prev + 1);
      setStreak(0);
      setMistakesList((prev) => [
        ...prev,
        {
          question: currentCard.question || currentCard.front,
          selectedAnswer: 'Time ran out',
          correctAnswer: optionsData.options[optionsData.correctIndex],
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
  }, [timeLeft, isAnswered, studyView, currentCard, optionsData, currentIndex, onRecordStudyResult]);

  // Keyboard shortcuts (A, B, C, D to answer, Enter to advance)
  useEffect(() => {
    const handleKeyDown = (e) => {
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
  }, [isAnswered, studyView, handleSelectOption, handleNext]);

  // Restart Study Session
  const handleStudyAgain = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setSessionCards(shuffled);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setXpEarned(0);
    setMistakesList([]);
    setAnsweredQuestionIds(new Set());
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setTimeLeft(10);
    setStudyView('quiz');
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
      <div className="study-mode-root" role="region" aria-label="Study Results">
        <StudyResults
          folderTitle={folder?.title || 'Test'}
          totalQuestions={totalCards}
          correctAnswers={correctCount}
          incorrectAnswers={incorrectCount}
          accuracy={accuracy}
          xpEarned={xpEarned}
          onStudyAgain={handleStudyAgain}
          onReviewMistakes={() => setStudyView('mistakes')}
          onBackToFolder={onExit}
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

  return (
    <div className="study-redesign-root" role="region" aria-label="Flashcard Study Session">
      {/* ========================================================
          1. TOP NAVIGATION BARS (Responsive Desktop & Mobile)
          ======================================================== */}
      {/* Desktop Top Bar matching Web Image */}
      <header className="study-web-top-bar" aria-label="Desktop Session Header">
        <button
          type="button"
          className="btn-study-web-exit"
          onClick={onExit}
          title="Exit study session and return to folder"
        >
          <span className="exit-icon" aria-hidden="true">✕</span>
          <span>Exit</span>
        </button>

        <div className="study-web-progress-container">
          <SegmentedProgressBar currentIndex={currentIndex} total={totalCards} />
        </div>

        <div className="study-web-top-right">
          <span className="study-brand-aura">AURA</span>
          <div className="study-coins-badge">
            <span className="coins-icon">🪙</span>
            <span className="coins-amount">2,450</span>
          </div>
        </div>
      </header>

      {/* Mobile Top Bar matching Mobile Image */}
      <header className="study-mobile-top-bar" aria-label="Mobile Session Header">
        <div className="study-mobile-brand-row">
          <span className="study-brand-aura">AURA</span>
          <div className="study-coins-badge">
            <span className="coins-icon">🪙</span>
            <span className="coins-amount">2,450</span>
          </div>
        </div>

        <div className="study-mobile-subbar">
          <button
            type="button"
            className="btn-study-mobile-close"
            onClick={onExit}
            aria-label="Exit session"
          >
            ✕
          </button>
          <div className="study-mobile-progress-wrap">
            <SegmentedProgressBar currentIndex={currentIndex} total={totalCards} />
          </div>
        </div>
      </header>

      {/* ========================================================
          2. MAIN STUDY GRID (2-Column on Web, 1-Column on Mobile)
          ======================================================== */}
      <div className="study-redesign-grid">
        {/* ---------------- LEFT / MAIN QUIZ AREA ---------------- */}
        <main className="study-main-quiz-col">
          {/* Question Meta Row: Counter (Left) + XP Badge & Timer (Right) */}
          <div className="study-question-meta-row">
            <h1 className="study-question-counter-text">
              Question {currentIndex + 1} of {totalCards}
            </h1>

            <div className="study-meta-right-group">
              <div className="study-xp-chip" title="+10 XP for correct answer">
                <span className="xp-bolt" aria-hidden="true">⚡</span>
                <span>+10 XP</span>
              </div>

              <TimerRing timeLeft={timeLeft} totalTime={10} />
            </div>
          </div>

          {/* Flashcard Question Card with Glowing Red Notch Accent */}
          <div className="study-question-hero-card">
            <div className="study-card-glowing-notch" aria-hidden="true" />
            <div className="study-card-content-center">
              <span className="study-card-question-text">{questionText}</span>
            </div>
          </div>

          {/* Multiple-Choice Answer Choices (2x2 on Desktop, 1 Col on Mobile) */}
          <div className="study-choices-grid" role="radiogroup" aria-label="Answer Choices">
            {optionsData.options.map((optionText, optIdx) => {
              const letter = ['A', 'B', 'C', 'D'][optIdx];
              const isSelected = selectedOptionIndex === optIdx;
              const isCorrectChoice = optIdx === optionsData.correctIndex;

              let choiceState = '';
              if (isAnswered) {
                if (isCorrectChoice) {
                  choiceState = 'is-correct';
                } else if (isSelected && !isCorrectChoice) {
                  choiceState = 'is-incorrect';
                } else {
                  choiceState = 'is-dimmed';
                }
              }

              return (
                <button
                  key={`choice-${cardKey(currentCard?.id)}-${optIdx}`}
                  type="button"
                  className={`study-choice-card ${choiceState}`}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswered}
                  role="radio"
                  aria-checked={isSelected}
                >
                  <div className="choice-letter-badge">
                    {isAnswered && isCorrectChoice
                      ? '✓'
                      : isAnswered && isSelected && !isCorrectChoice
                      ? '✕'
                      : letter}
                  </div>
                  <span className="choice-text-content">{optionText}</span>
                </button>
              );
            })}
          </div>

          {/* Bottom Guidance Hint (Mobile) or Next Action Button */}
          <div className="study-quiz-footer-row">
            {!isAnswered ? (
              <p className="study-tap-hint-text">Tap an answer before time runs out</p>
            ) : (
              <button
                type="button"
                className="btn-study-advance-action"
                onClick={handleNext}
                autoFocus
              >
                <span>{currentIndex < totalCards - 1 ? 'Next card' : 'Finish session'}</span>
                <span className="kbd-shortcut-hint" aria-hidden="true">↵</span>
              </button>
            )}
          </div>
        </main>

        {/* ---------------- RIGHT SIDEBAR (DESKTOP ONLY) ---------------- */}
        <aside className="study-sidebar-col" aria-label="Session Overview and Shortcuts">
          {/* 1. Folder Info Card */}
          <div className="study-sidebar-card study-folder-info-card">
            <div className="study-sidebar-folder-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#ef4444">
                <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
              </svg>
            </div>
            <div className="study-sidebar-folder-text">
              <h2 className="study-sidebar-folder-name">{folder?.title || 'Test'}</h2>
              <p className="study-sidebar-folder-sub">Flashcard study session</p>
            </div>
          </div>

          {/* 2. "This session" Stats Card */}
          <div className="study-sidebar-card study-session-stats-card">
            <h3 className="study-sidebar-card-title">This session</h3>
            <div className="study-sidebar-stats-grid">
              <div className="study-sidebar-stat-box">
                <span className="study-stat-number is-correct">{correctCount}</span>
                <span className="study-stat-label">Correct</span>
              </div>
              <div className="study-sidebar-stat-box">
                <span className="study-stat-number is-xp">{xpEarned}</span>
                <span className="study-stat-label">XP earned</span>
              </div>
              <div className="study-sidebar-stat-box">
                <span className="study-stat-number is-streak">{streak}</span>
                <span className="study-stat-label">Streak</span>
              </div>
              <div className="study-sidebar-stat-box">
                <span className="study-stat-number is-best">{bestStreak}</span>
                <span className="study-stat-label">Best streak</span>
              </div>
            </div>
          </div>

          {/* 3. "Shortcuts" Card */}
          <div className="study-sidebar-card study-shortcuts-card">
            <h3 className="study-sidebar-card-title">Shortcuts</h3>
            <div className="study-shortcuts-list">
              <div className="study-shortcut-item">
                <div className="study-kbd-group">
                  <kbd className="study-kbd">A</kbd>
                  <kbd className="study-kbd">B</kbd>
                  <kbd className="study-kbd">C</kbd>
                  <kbd className="study-kbd">D</kbd>
                </div>
                <span className="study-shortcut-label">pick an answer</span>
              </div>
              <div className="study-shortcut-item">
                <kbd className="study-kbd is-wide">Enter</kbd>
                <span className="study-shortcut-label">next card</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Helper to create safe React keys
function cardKey(id) {
  return id || 'card';
}
