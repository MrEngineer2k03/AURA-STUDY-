import { useState, useEffect } from 'react';
import './StudyCard.css';

/**
 * StudyCard - A premium dark futuristic RPG study card for AURA
 *
 * @param {Object} props
 * @param {string} [props.title="Physics Midterms"] - Course title
 * @param {string} [props.subtitle="Forces & Motion"] - Course subtitle or topic
 * @param {number} [props.progress=82] - Progress percentage (0 - 100)
 * @param {Array<{name: string, completed: boolean}>} [props.lessons] - List of lesson objects
 * @param {number} [props.lessonsCompleted] - Number of completed lessons
 * @param {number} [props.totalLessons] - Total number of lessons
 * @param {string} [props.backgroundImage] - Optional background image URL/asset
 * @param {Function} [props.onContinue] - Callback when "Continue Studying →" is clicked
 * @param {Function} [props.onViewFolder] - Callback when "View Folder" is clicked
 * @param {Function} [props.onMenuClick] - Callback when three-dot menu is clicked
 * @param {Function} [props.onToggleLesson] - Optional callback when a lesson chip is toggled
 * @param {string} [props.className] - Additional class name
 */
export default function StudyCard({
  title = 'Physics Midterms',
  subtitle = 'Forces & Motion',
  progress = 82,
  lessons: initialLessons,
  lessonsCompleted,
  totalLessons,
  backgroundImage,
  onContinue,
  onViewFolder,
  onMenuClick,
  onToggleLesson,
  className = '',
}) {
  const defaultLessons = [
    { name: 'Motion', completed: true },
    { name: 'Forces', completed: true },
    { name: 'Energy', completed: true },
    { name: 'Momentum', completed: false },
  ];

  const [lessonsList, setLessonsList] = useState(
    initialLessons && initialLessons.length > 0 ? initialLessons : defaultLessons
  );

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (initialLessons && initialLessons.length > 0) {
      setLessonsList(initialLessons);
    }
  }, [initialLessons]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAnimated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleLessonToggle = (index) => {
    if (onToggleLesson) {
      onToggleLesson(index);
    } else {
      setLessonsList((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, completed: !item.completed } : item
        )
      );
    }
  };

  const calculatedCompleted =
    typeof lessonsCompleted === 'number'
      ? lessonsCompleted
      : lessonsList.filter((l) => l.completed).length;

  const calculatedTotal =
    typeof totalLessons === 'number'
      ? totalLessons
      : lessonsList.length > 0
      ? lessonsList.length
      : 5;

  const cardStyle = backgroundImage
    ? {
        backgroundImage: `linear-gradient(rgba(7, 12, 22, 0.84), rgba(7, 12, 22, 0.95)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  return (
    <div
      className={`study-card-container ${className} ${backgroundImage ? 'has-bg-image' : ''}`}
      style={cardStyle}
    >
      {/* Top red laser accent notch */}
      <div className="study-card-top-accent"></div>

      {/* Subtle ambient tech grid background overlay */}
      <div className="study-card-tech-overlay" aria-hidden="true"></div>

      {/* 1. HEADER */}
      <div className="study-card-header">
        <div className="study-card-tag">
          {/* Small crisp book icon */}
          <svg
            className="study-card-book-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span className="study-card-header-label">CONTINUE STUDYING</span>
        </div>

        {/* Top-Right Options / View All */}
        <div className="study-card-header-right">
          <a
            href="#continue"
            className="study-card-view-all"
            onClick={(e) => {
              e.preventDefault();
              if (onViewFolder) onViewFolder();
            }}
          >
            <span>View all</span>
            <span className="view-all-arrow">→</span>
          </a>

          <button
            type="button"
            className="study-card-dots-btn"
            aria-label="Card Options"
            onClick={onMenuClick}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2.2" />
              <circle cx="12" cy="12" r="2.2" />
              <circle cx="19" cy="12" r="2.2" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. COURSE INFORMATION */}
      <div className="study-card-course-info">
        {/* Square red course icon badge with subtle glow */}
        <div className="study-card-folder-badge">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            <line x1="9" y1="13" x2="15" y2="13" />
          </svg>
        </div>

        {/* Title & Subtitle */}
        <div className="study-card-title-group">
          <h3 className="study-card-course-title">{title}</h3>
          <p className="study-card-course-subtitle">{subtitle}</p>
        </div>

        {/* Course row options */}
        <button
          type="button"
          className="study-card-dots-btn mini-course-dots"
          aria-label="Course Options"
          onClick={onMenuClick}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="2.2" />
            <circle cx="12" cy="12" r="2.2" />
            <circle cx="19" cy="12" r="2.2" />
          </svg>
        </button>
      </div>

      {/* 3. PROGRESS */}
      <div className="study-card-progress-section">
        <div className="study-card-progress-meta">
          <span className="study-card-progress-pct">{progress}% Complete</span>
          <span className="study-card-progress-count">
            {calculatedCompleted} / {calculatedTotal} Lessons
          </span>
        </div>

        {/* Progress Bar Track & Fill */}
        <div className="study-card-progress-track">
          <div
            className="study-card-progress-fill"
            style={{ width: animated ? `${progress}%` : '0%' }}
          ></div>
        </div>
      </div>

      {/* 4. LESSON STATUS CHIPS */}
      <div className="study-card-chips-row">
        {lessonsList.map((lesson, idx) => (
          <button
            key={lesson.name || idx}
            type="button"
            className={`study-card-lesson-chip ${
              lesson.completed ? 'completed' : 'incomplete'
            }`}
            onClick={() => handleLessonToggle(idx)}
            title={`Click to toggle ${lesson.name}`}
          >
            {lesson.completed ? (
              <svg
                className="chip-check-icon"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff2a44"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                className="chip-circle-icon"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2.5"
              >
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
            <span className="chip-label">{lesson.name}</span>
          </button>
        ))}
      </div>

      {/* 5. BOTTOM ACTIONS */}
      <div className="study-card-actions">
        <button
          type="button"
          className="study-card-btn-primary"
          onClick={onContinue}
        >
          <span>Continue Studying</span>
          <span className="btn-arrow">→</span>
        </button>

        <button
          type="button"
          className="study-card-btn-secondary"
          onClick={onViewFolder}
        >
          View Folder
        </button>
      </div>
    </div>
  );
}
