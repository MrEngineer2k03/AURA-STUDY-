import HbIcon from './HomeBottomIcons';
import HbSectionHeader from './HbSectionHeader';
import { accentStyle } from './homeBottomUtils';

function EventThumb({ event }) {
  return (
    <span className="hb-event-thumb" aria-hidden="true">
      {event.thumbnail ? <img src={event.thumbnail} alt="" /> : <HbIcon name="calendar" size={18} />}
    </span>
  );
}

function RewardChips({ rewards }) {
  if (!rewards || rewards.length === 0) return null;
  return (
    <div className="hb-rewards">
      <span className="hb-rewards-label">Rewards</span>
      <ul className="hb-reward-list">
        {rewards.map((reward) => (
          <li key={reward.label} className={`hb-reward hb-reward--${reward.tone || 'neutral'}`}>
            <HbIcon name={reward.icon || 'gift'} size={11} />
            <span>{reward.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * UpcomingEventsCard – featured next event plus a compact scrollable list of the rest.
 *
 * @param {Array}    props.events       [{ id, title, dateLabel, timeLabel, description, category, color, rewards, thumbnail }]
 * @param {Function} props.onOpenEvent  Opens an event's details
 * @param {Function} props.onViewAll    Navigates to the events page
 */
export default function UpcomingEventsCard({ events = [], onOpenEvent, onViewAll }) {
  const [featured, ...others] = events;

  return (
    <section className="hb-card hb-events" aria-label="Upcoming events">
      <HbSectionHeader
        icon="calendar"
        title="Upcoming Events"
        actionLabel="View all"
        actionAriaLabel="View all events"
        onAction={onViewAll}
      />

      {!featured ? (
        <div className="hb-empty">
          <span className="hb-empty-icon" aria-hidden="true">
            <HbIcon name="calendar" size={20} />
          </span>
          <p className="hb-empty-title">No upcoming events</p>
          <p className="hb-empty-text">New campus events and challenges will show up here. Check back soon!</p>
        </div>
      ) : (
        <>
          <div className="hb-event-scroll">
            <button
              type="button"
              className="hb-event-featured"
              style={accentStyle(featured.color)}
              onClick={() => onOpenEvent(featured)}
              aria-label={`Open event: ${featured.title}`}
            >
              <div className="hb-event-head">
                <EventThumb event={featured} />
                <div className="hb-event-info">
                  {featured.category && <span className="hb-event-category">{featured.category}</span>}
                  <span className="hb-event-title">{featured.title}</span>
                  <span className="hb-event-date">
                    <HbIcon name="calendar" size={11} />
                    {featured.dateLabel}
                  </span>
                </div>
              </div>
              {featured.timeLabel && <span className="hb-event-time">{featured.timeLabel}</span>}
              {featured.description && <span className="hb-event-desc">{featured.description}</span>}
              <RewardChips rewards={featured.rewards} />
            </button>

            {others.length > 0 && (
              <ul className="hb-event-list" aria-label="More events">
                {others.map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      className="hb-event-row"
                      style={accentStyle(event.color)}
                      onClick={() => onOpenEvent(event)}
                    >
                      <EventThumb event={event} />
                      <span className="hb-event-row-text">
                        <span className="hb-event-row-title">{event.title}</span>
                        <span className="hb-event-row-date">{event.dateLabel}</span>
                      </span>
                      <HbIcon name="arrow" size={12} strokeWidth={2.4} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="hb-actions hb-actions--single">
            <button type="button" className="hb-btn hb-btn--ghost-red" onClick={() => onOpenEvent(featured)}>
              <span>View Event</span>
              <HbIcon name="arrow" size={12} strokeWidth={2.4} />
            </button>
          </div>
        </>
      )}
    </section>
  );
}

