import React, { useState, useEffect, useMemo } from 'react';

/**
 * Subject-specific fallback distractors for when the folder has fewer than 4 flashcards
 */
const FALLBACK_DISTRACTORS = [
  'An object remains in perpetual motion regardless of external applied forces.',
  'The instantaneous rate of change of mass with respect to time.',
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
 * MultipleChoiceQuestion - Question Panel with 4 Multiple-Choice Options
 *
 * @param {Object} props
 * @param {Object} props.card - Current flashcard object { id, question, answer, ... }
 * @param {number} props.index - 0-based card index
 * @param {number} props.total - Total number of cards in session
 * @param {Array<Object>} props.allCards - All flashcards in deck for distractor generation
 * @param {Function} props.onAnswer - (isCorrect, selectedAnswer, correctAnswer) => void
 * @param {Function} props.onNext - () => void
 * @param {boolean} props.isLast - Whether this is the final question
 */
export default function MultipleChoiceQuestion({
  card,
  index = 0,
  total = 1,
  allCards = [],
  onAnswer,
  onNext,
  isLast = false,
}) {
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate 4 randomized options (1 correct answer + 3 distinct distractors)
  const optionsData = useMemo(() => {
    if (!card) return { options: [], correctIndex: 0 };

    const correctAnswer = (card.answer || card.back || '').trim();

    // 1. Collect distractors from other flashcards in the folder
    const poolFromCards = allCards
      .filter((c) => c.id !== card.id)
      .map((c) => (c.answer || c.back || '').trim())
      .filter((ans) => Boolean(ans) && ans !== correctAnswer);

    // Remove duplicates
    const uniqueFromCards = Array.from(new Set(poolFromCards));

    // 2. Supplement with realistic contextual fallbacks if fewer than 3 distractors
    const chosenDistractors = [...uniqueFromCards];
    let fallbackIdx = 0;
    while (chosenDistractors.length < 3 && fallbackIdx < FALLBACK_DISTRACTORS.length) {
      const fallback = FALLBACK_DISTRACTORS[fallbackIdx];
      if (fallback !== correctAnswer && !chosenDistractors.includes(fallback)) {
        chosenDistractors.push(fallback);
      }
      fallbackIdx++;
    }

    // Take top 3 distractors
    const top3Distractors = chosenDistractors.slice(0, 3);

    // Combine correct answer and 3 distractors
    const rawChoices = [correctAnswer, ...top3Distractors];

    // Shuffle choices
    const shuffledChoices = shuffleArray(rawChoices);
    const correctIndex = shuffledChoices.indexOf(correctAnswer);

    return {
      options: shuffledChoices,
      correctIndex,
    };
  }, [card?.id, allCards]);

  // Reset state when card changes
  useEffect(() => {
    setSelectedOptionIndex(null);
    setIsAnswered(false);
  }, [card?.id]);

  if (!card) return null;

  const currentQuestionNumber = `QUESTION ${String(index + 1).padStart(2, '0')}`;
  const questionText = card.question || card.front || 'Untitled Question';
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (optIndex) => {
    if (isAnswered) return; // Prevent repeated clicks and double rewards

    setSelectedOptionIndex(optIndex);
    setIsAnswered(true);

    const isCorrect = optIndex === optionsData.correctIndex;
    const selectedAnswerText = optionsData.options[optIndex];
    const correctAnswerText = optionsData.options[optionsData.correctIndex];

    if (onAnswer) {
      onAnswer(isCorrect, selectedAnswerText, correctAnswerText);
    }
  };

  const isSelectedCorrect = isAnswered && selectedOptionIndex === optionsData.correctIndex;

  return (
    <div className="study-question-panel" role="region" aria-label={`Question ${index + 1}`}>
      {/* 1. TOP BAR */}
      <div className="study-question-top">
        <div className="study-question-index-badge">{currentQuestionNumber}</div>
        <div className="study-xp-badge">
          <span>⚡</span>
          <span>+10 XP on Correct</span>
        </div>
      </div>

      {/* 2. QUESTION PROMPT */}
      <h2 className="study-question-text">{questionText}</h2>

      {/* 3. FOUR MULTIPLE-CHOICE OPTIONS */}
      <div className="study-options-grid" role="radiogroup" aria-label="Answer Choices">
        {optionsData.options.map((optionText, optIdx) => {
          const letter = optionLetters[optIdx] || String.fromCharCode(65 + optIdx);
          const isSelected = selectedOptionIndex === optIdx;
          const isCorrectChoice = optIdx === optionsData.correctIndex;

          let optionStateClass = '';
          if (isAnswered) {
            optionStateClass = 'is-locked';
            if (isCorrectChoice) {
              optionStateClass += ' is-correct';
            } else if (isSelected && !isCorrectChoice) {
              optionStateClass += ' is-incorrect';
            }
          }

          return (
            <button
              key={`${card.id}-opt-${optIdx}`}
              type="button"
              className={`study-option-card ${optionStateClass}`}
              onClick={() => handleSelectOption(optIdx)}
              disabled={isAnswered}
              role="radio"
              aria-checked={isSelected}
            >
              <div className="option-letter-badge">
                {isAnswered && isCorrectChoice ? '✓' : isAnswered && isSelected && !isCorrectChoice ? '✕' : letter}
              </div>
              <div className="option-text-content">{optionText}</div>
            </button>
          );
        })}
      </div>

      {/* 4. ANSWER VALIDATION BANNER & NEXT ACTION */}
      {isAnswered && (
        <div className={`study-feedback-banner ${isSelectedCorrect ? 'is-correct' : 'is-incorrect'}`}>
          <div className="feedback-banner-left">
            <div className="feedback-icon-box">
              {isSelectedCorrect ? '✓' : '✕'}
            </div>
            <div>
              <div className="feedback-headline">
                {isSelectedCorrect ? 'CORRECT ANSWER!' : 'NOT QUITE!'}
              </div>
              <p className="feedback-subtext">
                {isSelectedCorrect
                  ? 'Great job! You got it right.'
                  : "Don't worry. Review the correct answer and keep learning."}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-next-question-action"
            onClick={onNext}
            autoFocus
          >
            <span>{isLast ? 'COMPLETE STUDY SESSION' : 'NEXT QUESTION'}</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
