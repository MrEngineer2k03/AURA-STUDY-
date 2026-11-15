import HbIcon from './HomeBottomIcons';
import defaultPoster from '../../assets/engineering_week_bg.png';

/**
 * UpcomingEventsCard – redesigned featured event card matching the AURA design reference.
 * Supports side-by-side desktop view and responsive stacked mobile view.
 *
 * @param {Array}    props.events       [{ id, title, dateLabel, timeLabel, description, category, poster, thumbnail, hasBakedBadges, rewards }]
 * @param {Function} props.onOpenEvent  Opens the event details
 * @param {Function} props.onViewAll    Navigates to the events page
 */
export default function UpcomingEventsCard({ events = [], onOpenEvent, onViewAll }) {
  const [featured] = events;

  const currentEvent = featured || {
    id: 'event-engineering-week',
    title: 'Engineering Week',
    dateLabel: 'Sep 30 – Oct 7',
    timeLabel: 'All week · Engineering Department',
    description: 'Join department challenges and study battles to earn limited-time rewards.',
    category: 'Department',
    poster: defaultPoster,
    bgImage: '/Engineering Week BG.png',
    hasBakedBadges: false,
    rewards: [
      { icon: 'shirt', label: 'Exclusive outfit', tone: 'purple' },
      { icon: 'bolt', label: '2x XP', tone: 'gold' },
      { icon: 'coin', label: 'Bonus coins', tone: 'green' },
    ],
  };

  const handleAction = () => {
    if (onOpenEvent) {
      onOpenEvent(currentEvent);
    } else {
      window.location.hash = 'events';
    }
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      window.location.hash = 'events';
    }
  };

  const posterImg =
    currentEvent.poster ||
    currentEvent.thumbnail ||
    currentEvent.bgImage ||
    defaultPoster ||
    '/Engineering Week BG.png';

  return (
    <section className="hb-card hb-events hb-events--redesign" aria-label="Upcoming events">
      {/* 1. TOP HEADER ROW */}
      <div className="hb-events-header">
        <div className="hb-events-header-left">
          <span className="hb-events-header-icon" aria-hidden="true">
            <HbIcon name="calendar" size={15} />
          </span>
          <h2 className="hb-events-header-title">UPCOMING EVENTS</h2>
        </div>

        <button
          type="button"
          className="hb-events-view-all-btn"
          onClick={handleViewAll}
          aria-label="View all events"
        >
          <span>View all</span>
          <span className="hb-events-arrow-glyph">→</span>
        </button>
      </div>

      {/* 2. CARD CONTENT BODY */}
      <div className="hb-events-body">
        {/* Left: Poster Column */}
        <div className="hb-events-poster-col">
          {/* Event Poster (Artwork Unobstructed) */}
          <div className="hb-events-poster-card">
            <img
              src={posterImg}
              alt={currentEvent.title}
              className="hb-events-poster-image"
              onError={(e) => {
                if (!e.currentTarget.dataset.retried) {
                  e.currentTarget.dataset.retried = 'true';
                  e.currentTarget.src = encodeURI('/Engineering Week BG.png');
                }
              }}
            />
          </div>

          {/* Date Information (Below Image) */}
          <div className="hb-events-poster-date-row">
            <HbIcon name="calendar" size={12} className="hb-events-date-icon" />
            <span className="hb-events-date-text">
              {currentEvent.dateLabel || 'Sep 30 – Oct 7'}
            </span>
          </div>
        </div>

        {/* Right: Event Information & Action */}
        <div className="hb-events-info-col">
          <div className="hb-events-info-top">
            {/* Category / Department Badge (Positioned at Top of Title) */}
            <div className="hb-events-category-wrap">
              <span className="hb-events-dept-badge">
                {(currentEvent.category || 'DEPARTMENT').toUpperCase()}
              </span>
            </div>
            <h3 className="hb-events-title">{currentEvent.title}</h3>
            <p className="hb-events-meta">{currentEvent.timeLabel || 'All week · Engineering Department'}</p>
            <p className="hb-events-desc">
              {currentEvent.description || 'Join department challenges and study battles to earn limited-time rewards.'}
            </p>
          </div>

          <div className="hb-events-rewards-block">
            <div className="hb-events-rewards-label">REWARDS</div>
            <div className="hb-events-rewards-list">
              {(currentEvent.rewards || []).map((reward, i) => (
                <div key={reward.label || i} className="hb-events-reward-pill">
                  <span className={`hb-events-reward-icon-circle hb-events-reward-icon--${reward.tone || 'purple'}`}>
                    <HbIcon name={reward.icon || 'gift'} size={15} />
                  </span>
                  <span className="hb-events-reward-name">{reward.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="hb-events-primary-btn"
            onClick={handleAction}
          >
            <span>View Event</span>
            <span className="hb-events-btn-arrow">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
