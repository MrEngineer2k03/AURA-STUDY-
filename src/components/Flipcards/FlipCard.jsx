import React, { useState, useCallback, useRef } from 'react';
import './Flipcards.css';

/**
 * FlipCard - Interactive 3D Two-Sided Flashcard Component for AURA
 *
 * Implements a realistic 3D flipping animation with CSS transforms:
 * - Front: Question / Term / Concept with "TAP TO REVEAL" indicator & flip icon
 * - Back: Answer / Explanation with "REVEALED ANSWER" label & flip-back indicator
 * - Preserves 3D depth, backface-visibility: hidden, and smooth cubic-bezier easing
 * - Fixed height on both sides (never jumps or resizes during rotation)
 * - Accessible button semantics with keyboard (Space / Enter) support
 * - Respects prefers-reduced-motion
 *
 * @param {Object} props
 * @param {Object} props.card - Flashcard data object ({ id, question, answer, front, back, lessonTag, status })
 * @param {boolean} [props.isFlipped] - Controlled flipped state (optional)
 * @param {Function} [props.onFlip] - (nextIsFlipped) => void callback
 * @param {number} [props.cardNumber] - Numerical card index (1-based)
 * @param {number} [props.totalCards] - Total cards in deck
 * @param {boolean} [props.showIndicators=true] - Whether to show the top tag and bottom tap indicators
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {boolean} [props.disabled=false] - Disable flip interaction
 */
export default function FlipCard({
  card,
  isFlipped: controlledFlipped,
  onFlip,
  cardNumber,
  totalCards,
  showIndicators = true,
  className = '',
  disabled = false,
}) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isControlled = typeof controlledFlipped === 'boolean';
  const flipped = isControlled ? controlledFlipped : internalFlipped;

  // Animation lock ref to avoid glitching on rapid repeated clicks
  const isAnimatingRef = useRef(false);

  const handleToggleFlip = useCallback(() => {
    if (disabled || isAnimatingRef.current) return;

    // Lock interaction briefly during rotation (600ms transition)
    isAnimatingRef.current = true;
    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 450);

    const nextFlipped = !flipped;
    if (!isControlled) {
      setInternalFlipped(nextFlipped);
    }
    if (onFlip) {
      onFlip(nextFlipped);
    }
  }, [disabled, flipped, isControlled, onFlip]);

  if (!card) return null;

  const questionText = card.question || card.front || 'Untitled Question';
  const answerText = card.answer || card.back || 'No answer provided.';
  const status = (card.status || 'new').toLowerCase();
  
  // Format formatted card numbers (e.g. "Question 01 / 05")
  const pad2 = (n) => String(n || 1).padStart(2, '0');
  const cardIndexLabel = cardNumber && totalCards
    ? `Question ${pad2(cardNumber)} / ${pad2(totalCards)}`
    : cardNumber
    ? `Question ${pad2(cardNumber)}`
    : 'Question';
  const answerIndexLabel = cardNumber && totalCards
    ? `Answer ${pad2(cardNumber)} / ${pad2(totalCards)}`
    : 'Answer';

  const statusLabel = status === 'mastered' ? 'Mastered' : status === 'learning' ? 'Learning' : 'New';

  return (
    <div
      className={`aura-flipcard-stage ${className}`}
      role="region"
      aria-label={`Flashcard: ${questionText}`}
    >
      <div
        className={`aura-flipcard-inner ${flipped ? 'is-flipped' : ''} ${disabled ? 'is-disabled' : ''}`}
        onClick={handleToggleFlip}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-pressed={flipped}
        aria-label={
          flipped
            ? `Answer revealed: ${answerText}. Click or press space to flip back to question.`
            : `Question: ${questionText}. Click or press space to reveal answer.`
        }
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            handleToggleFlip();
          }
        }}
      >
        {/* ========================================================
            FRONT SIDE (QUESTION)
            ======================================================== */}
        <div className="aura-flipcard-face aura-flipcard-front">
          {/* Subtle decorative concentric radar ripples in top right corner */}
          <svg className="aura-card-radar-rings" width="220" height="220" viewBox="0 0 220 220" fill="none" aria-hidden="true">
            <circle cx="220" cy="0" r="50" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
            <circle cx="220" cy="0" r="95" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
            <circle cx="220" cy="0" r="140" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
            <circle cx="220" cy="0" r="185" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
          </svg>

          {/* Top Meta Bar */}
          {showIndicators && (
            <div className="aura-flipcard-header">
              <div className="aura-flipcard-tag is-question-tag">
                <span className="aura-tag-text">{cardIndexLabel}</span>
              </div>

              <div className="aura-flipcard-badges-right">
                {card.lessonTag && (
                  <span className="aura-card-lesson-tag">{card.lessonTag}</span>
                )}
                <span className={`aura-card-status-pill is-${status}`}>
                  {statusLabel}
                </span>
              </div>
            </div>
          )}

          {/* Centered Question Content Area */}
          <div className="aura-flipcard-body">
            <div className="aura-flipcard-content-scroller">
              <span className="aura-flipcard-type-sublabel">Question</span>
              <h2 className="aura-flipcard-question-text">{questionText}</h2>
            </div>
          </div>

          {/* Bottom Flip Indicator */}
          {showIndicators && (
            <div className="aura-flipcard-footer">
              <div className="aura-flip-cue">
                <span className="aura-flip-cue-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                  </svg>
                </span>
                <span className="aura-flip-cue-label">TAP TO REVEAL</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            BACK SIDE (ANSWER)
            ======================================================== */}
        <div className="aura-flipcard-face aura-flipcard-back">
          {/* Subtle decorative concentric radar ripples in top right corner */}
          <svg className="aura-card-radar-rings is-answer" width="220" height="220" viewBox="0 0 220 220" fill="none" aria-hidden="true">
            <circle cx="220" cy="0" r="50" stroke="rgba(16,185,129,0.04)" strokeWidth="1" />
            <circle cx="220" cy="0" r="95" stroke="rgba(16,185,129,0.04)" strokeWidth="1" />
            <circle cx="220" cy="0" r="140" stroke="rgba(16,185,129,0.04)" strokeWidth="1" />
            <circle cx="220" cy="0" r="185" stroke="rgba(16,185,129,0.04)" strokeWidth="1" />
          </svg>

          {/* Top Meta Bar */}
          {showIndicators && (
            <div className="aura-flipcard-header">
              <div className="aura-flipcard-tag is-answer-tag">
                <span className="aura-tag-text">{answerIndexLabel}</span>
              </div>

              <div className="aura-flipcard-badges-right">
                {card.lessonTag && (
                  <span className="aura-card-lesson-tag">{card.lessonTag}</span>
                )}
                <span className={`aura-card-status-pill is-${status}`}>
                  {statusLabel}
                </span>
              </div>
            </div>
          )}

          {/* Centered Answer Content Area */}
          <div className="aura-flipcard-body">
            <div className="aura-flipcard-content-scroller">
              <span className="aura-flipcard-type-sublabel is-answer">Answer</span>
              <p className="aura-flipcard-answer-text">{answerText}</p>
            </div>
          </div>

          {/* Bottom Flip-Back Indicator */}
          {showIndicators && (
            <div className="aura-flipcard-footer">
              <div className="aura-flip-cue is-flip-back">
                <span className="aura-flip-cue-icon" aria-hidden="true">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38L-2.44 1.52" />
                  </svg>
                </span>
                <span className="aura-flip-cue-label">TAP TO FLIP BACK</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

