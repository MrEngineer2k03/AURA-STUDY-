import React, { useState, useEffect } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import StudyProgress from './StudyProgress';
import StudyResults from './StudyResults';
import ReviewMistakes from './ReviewMistakes';

/**
 * StudyMode - Dedicated full-screen or focused multiple-choice study session
 *
 * @param {Object} props
 * @param {Array<Object>} props.cards - List of flashcards to study
 * @param {Object} props.folder - Current folder object
 * @param {Function} props.onExit - Callback to return to Folder Overview
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

  // Session Tracking
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [mistakesList, setMistakesList] = useState([]);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState(new Set());

  // View state inside Study Mode: 'quiz' | 'results' | 'mistakes'
  const [studyView, setStudyView] = useState('quiz');

  // Re-initialize if cards change
  useEffect(() => {
    setSessionCards([...cards]);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setXpEarned(0);
    setMistakesList([]);
    setAnsweredQuestionIds(new Set());
    setStudyView('quiz');
  }, [cards]);

  const totalCards = sessionCards.length;
  const currentCard = sessionCards[currentIndex] || null;

  // Empty state handling
  if (totalCards === 0) {
    return (
      <div className="study-mode-root" role="region" aria-label="Study Session">
        <div className="flashcards-empty-state">
          <div className="empty-state-icon">🗂</div>
          <h2 className="empty-state-title">NO FLASHCARDS TO STUDY</h2>
          <p className="empty-state-text">
            This folder does not have any flashcards yet. Add flashcards in Review Mode before starting a study session.
          </p>
          <button
            type="button"
            className="btn-result-back-folder"
            onClick={onExit}
          >
            ← Back to Folder Overview
          </button>
        </div>
      </div>
    );
  }

  // Handle Question Answer
  const handleAnswer = (isCorrect, selectedAnswer, correctAnswer) => {
    if (!currentCard) return;

    // Prevent duplicate scoring if already answered
    if (answeredQuestionIds.has(currentCard.id)) return;
    setAnsweredQuestionIds((prev) => new Set(prev).add(currentCard.id));

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      setXpEarned((prev) => prev + 10);
    } else {
      setIncorrectCount((prev) => prev + 1);
      setMistakesList((prev) => [
        ...prev,
        {
          question: currentCard.question || currentCard.front,
          selectedAnswer,
          correctAnswer,
          index: currentIndex,
        },
      ]);
    }

    if (onRecordStudyResult) {
      onRecordStudyResult(currentCard.id, isCorrect);
    }
  };

  // Handle Advancing to Next Question
  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Completed all questions! Award session completion bonus
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
  };

  // Study Again Handler
  const handleStudyAgain = () => {
    // Shuffle cards for fresh review
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setSessionCards(shuffled);
    setCurrentIndex(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setXpEarned(0);
    setMistakesList([]);
    setAnsweredQuestionIds(new Set());
    setStudyView('quiz');
  };

  const accuracy =
    totalCards > 0 ? Math.round((correctCount / totalCards) * 100) : 0;

  // View: Study Results
  if (studyView === 'results') {
    return (
      <div className="study-mode-root" role="region" aria-label="Study Results">
        <StudyResults
          folderTitle={folder?.title || 'Study Folder'}
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

  // View: Active Multiple-Choice Quiz
  return (
    <div className="study-mode-root" role="region" aria-label="Flashcard Study Session">
      {/* 1. STUDY HEADER */}
      <header className="study-mode-header">
        <div className="study-header-top-row">
          <div className="study-header-info">
            <span className="study-folder-title">{folder?.title || 'Study Folder'}</span>
            <span className="study-session-subtitle">✦ Flashcard Study Session</span>
          </div>

          <div className="study-header-actions">
            <div className="study-card-counter">
              CARD {currentIndex + 1} / {totalCards}
            </div>

            <button
              type="button"
              className="btn-exit-study"
              onClick={onExit}
              title="Exit study session and return to folder overview"
            >
              ✕ Exit Study
            </button>
          </div>
        </div>

        {/* Horizontal Progress Bar */}
        <StudyProgress current={currentIndex + 1} total={totalCards} />
      </header>

      {/* 2. CENTERED MULTIPLE CHOICE FLASHCARD PANEL */}
      <MultipleChoiceQuestion
        card={currentCard}
        index={currentIndex}
        total={totalCards}
        allCards={sessionCards}
        onAnswer={handleAnswer}
        onNext={handleNext}
        isLast={currentIndex === totalCards - 1}
      />
    </div>
  );
}
