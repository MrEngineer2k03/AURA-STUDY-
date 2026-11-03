import React from 'react';

/**
 * Circular Mini Progress Ring
 */
function CircularProgress({ progress = 25, size = 46, strokeWidth = 3.5, color = '#f59e0b' }) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className="hero-progress-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="hero-progress-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="hero-progress-text">{progress}%</span>
    </div>
  );
}

/**
 * ContinueHeroCard - "Continue where you left off" Hero Banner
 * Matches reference design from media_1793688713050_7bd1929c.png:
 * - Eyebrow: "Continue where you left off" in coral red
 * - Progress circle on the left with 25%
 * - Folder title and "Next: Lesson X of Y ▪ Xh ago"
 * - Full-width action button: "▷ Continue studying"
 *
 * @param {Object} props
 * @param {Object} props.folder - Featured folder (defaults to Business Strategy)
 * @param {Function} props.onContinue - Callback for "Continue studying"
 * @param {Function} props.onOpen - Callback for "Open folder"
 */
export default function ContinueHeroCard({
  folder,
  onContinue,
  onOpen,
}) {
  if (!folder) return null;

  const title = folder.title || 'Business Strategy';
  const subtitle = folder.subtitle || 'Entrepreneurship';
  const progress = typeof folder.progress === 'number' ? folder.progress : 25;
  const lessons = folder.lessons || 4;
  const completed = typeof folder.completedLessons === 'number'
    ? folder.completedLessons
    : typeof folder.completed === 'number'
    ? folder.completed
    : 1;

  const nextLessonNum = Math.min(lessons, completed + 1);
  const studiedAgo = folder.lastStudied || '5h ago';

  return (
    <div className="continue-hero-banner" role="region" aria-label="Continue where you left off">
      {/* Ambient Glow */}
      <div className="continue-hero-glow" aria-hidden="true" />

      {/* Mobile Top Eyebrow */}
      <span className="continue-hero-eyebrow continue-hero-eyebrow-mobile">Continue where you left off</span>

      <div className="continue-hero-main-row">
        {/* DESKTOP LEFT: Icon & Folder Info */}
        <div className="continue-hero-left">
          <div className="continue-hero-icon-box" aria-hidden="true">
            <svg
              className="continue-folder-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            </svg>
          </div>

          {/* Mobile Ring positioned beside title */}
          <div className="continue-hero-mobile-ring" aria-hidden="true">
            <CircularProgress progress={progress} size={48} strokeWidth={3.8} color="#ff4766" />
          </div>

          <div className="continue-hero-text">
            <span className="continue-hero-eyebrow continue-hero-eyebrow-desktop">Continue where you left off</span>
            <h2 className="continue-hero-title">{title}</h2>
            <p className="continue-hero-subtitle continue-hero-subtitle-desktop">{subtitle}</p>
            <p className="continue-hero-subtitle continue-hero-subtitle-mobile">
              Next: Lesson {nextLessonNum} of {lessons} ▪ {studiedAgo}
            </p>
          </div>
        </div>

        {/* DESKTOP CENTER: Progress Ring & Next Up details */}
        <div className="continue-hero-center">
          <CircularProgress progress={progress} size={48} strokeWidth={3.8} color="#f59e0b" />

          <div className="continue-hero-stats">
            <span className="continue-hero-stats-label">Next up</span>
            <strong className="continue-hero-stats-lesson">
              Lesson {nextLessonNum} of {lessons}
            </strong>
            <span className="continue-hero-stats-time">Studied {studiedAgo}</span>
          </div>
        </div>
      </div>

      {/* RIGHT / BOTTOM: Action Buttons */}
      <div className="continue-hero-actions">
        <button
          type="button"
          className="btn-continue-studying-primary"
          onClick={() => onContinue && onContinue(folder)}
        >
          <svg
            className="continue-play-icon"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
          <span>Continue studying</span>
          <span className="btn-arrow-icon" aria-hidden="true">→</span>
        </button>

        <button
          type="button"
          className="btn-continue-open-secondary"
          onClick={() => onOpen && onOpen(folder)}
        >
          <span>Open folder</span>
        </button>
      </div>
    </div>
  );
}
