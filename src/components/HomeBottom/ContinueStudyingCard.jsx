import { useEffect, useState } from 'react';
import HbIcon from './HomeBottomIcons';
import HbSectionHeader from './HbSectionHeader';
import { accentStyle, getCompletedLessons, getFlashcardCount, pluralize } from './homeBottomUtils';

const MAX_VISIBLE_TOPICS = 4;

/** "Just now" -> "just now", "Today" -> "today", "5h ago" stays as-is. */
function formatLastStudied(label) {
  if (!label) return 'recently';
  return /^(just now|today|yesterday)$/i.test(label) ? label.toLowerCase() : label;
}

/**
 * ContinueStudyingCard – shows the most recently accessed study folder.
 *
 * @param {Object}   props.folder            Most recently studied folder (real folder data)
 * @param {Array}    [props.topics]          Optional topic chips [{ name, completed }]
 * @param {Function} [props.onToggleTopic]   Toggle a topic's completed state (index)
 * @param {Function} props.onContinue        Opens the folder's study session
 * @param {Function} props.onViewFolder      Opens the folder
 * @param {Function} [props.onCreateFolder]  Used by the empty state
 */
export default function ContinueStudyingCard({
  folder,
  topics = [],
  onToggleTopic,
  onContinue,
  onViewFolder,
  onCreateFolder,
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!folder) {
    return (
      <section className="hb-card hb-continue" aria-label="Continue studying">
        <HbSectionHeader icon="book" title="Continue Studying" />
        <div className="hb-empty">
          <span className="hb-empty-icon" aria-hidden="true">
            <HbIcon name="book" size={20} />
          </span>
          <p className="hb-empty-title">Nothing to continue yet</p>
          <p className="hb-empty-text">Create a folder to start your first study session.</p>
          <button type="button" className="hb-btn hb-btn--primary" onClick={onCreateFolder}>
            <HbIcon name="plus" size={13} strokeWidth={2.6} />
            <span>Create Folder</span>
          </button>
        </div>
      </section>
    );
  }

  const progress = Math.min(100, Math.max(0, Math.round(folder.progress || 0)));
  const lessons = folder.lessons || 0;
  const completedLessons = Math.min(lessons, getCompletedLessons(folder));
  const flashcards = getFlashcardCount(folder);
  const visibleTopics = topics.slice(0, MAX_VISIBLE_TOPICS);
  const hiddenTopics = Math.max(0, topics.length - MAX_VISIBLE_TOPICS);

  return (
    <section className="hb-card hb-continue" style={accentStyle(folder.color)} aria-label="Continue studying">
      <HbSectionHeader icon="book" title="Continue Studying" />

      {/* Folder identity */}
      <div className="hb-continue-folder">
        <span className="hb-folder-icon hb-folder-icon--lg" aria-hidden="true">
          <HbIcon name="folder" size={18} />
        </span>
        <div className="hb-continue-titles">
          <h3 className="hb-continue-title" title={folder.title}>{folder.title}</h3>
          <p className="hb-continue-sub" title={folder.subtitle}>
            {folder.subtitle || folder.description || 'General study material'}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="hb-progress-block">
        <div className="hb-progress-meta">
          <span className="hb-progress-pct">
            {progress}%<span className="hb-progress-pct-label"> complete</span>
          </span>
          <span className="hb-progress-count">
            {lessons === 0 ? 'No lessons yet' : `${completedLessons} / ${lessons} lessons`}
          </span>
        </div>
        <div
          className="hb-bar hb-bar--lg"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${folder.title} progress`}
        >
          <span className="hb-bar-fill" style={{ width: animated ? `${progress}%` : '0%' }} />
        </div>
      </div>

      {/* Topics */}
      {visibleTopics.length > 0 && (
        <ul className="hb-topics" aria-label="Study topics">
          {visibleTopics.map((topic, idx) => (
            <li key={topic.name || idx}>
              {onToggleTopic ? (
                <button
                  type="button"
                  className={`hb-topic ${topic.completed ? 'is-done' : ''}`}
                  onClick={() => onToggleTopic(idx)}
                  aria-pressed={Boolean(topic.completed)}
                  title={topic.completed ? `${topic.name} – completed` : `${topic.name} – not completed`}
                >
                  <HbIcon name={topic.completed ? 'check' : 'circle'} size={10} strokeWidth={3} />
                  <span>{topic.name}</span>
                </button>
              ) : (
                <span className={`hb-topic hb-topic--tag ${topic.completed ? 'is-done' : ''}`}>
                  {topic.completed && <HbIcon name="check" size={10} strokeWidth={3} />}
                  <span>{topic.name}</span>
                </span>
              )}
            </li>
          ))}
          {hiddenTopics > 0 && (
            <li>
              <span className="hb-topic hb-topic--more">+{hiddenTopics}</span>
            </li>
          )}
        </ul>
      )}

      {/* Meta */}
      <div className="hb-meta-row">
        <span className="hb-meta">
          <HbIcon name="clock" size={12} />
          <span>Last studied {formatLastStudied(folder.lastStudied)}</span>
        </span>
        <span className="hb-meta">
          <HbIcon name="layers" size={12} />
          <span>{pluralize(flashcards, 'card')}</span>
        </span>
      </div>

      {/* Actions */}
      <div className="hb-actions">
        <button type="button" className="hb-btn hb-btn--primary" onClick={() => onContinue(folder)}>
          <span>Continue Studying</span>
          <HbIcon name="arrow" size={13} strokeWidth={2.4} />
        </button>
        <button type="button" className="hb-btn hb-btn--ghost" onClick={() => onViewFolder(folder)}>
          View Folder
        </button>
      </div>
    </section>
  );
}
