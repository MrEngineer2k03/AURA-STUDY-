import HbIcon from './HomeBottomIcons';

/**
 * Consistent section header used by all three bottom dashboard cards.
 */
export default function HbSectionHeader({ icon, title, description, actionLabel, onAction, actionAriaLabel }) {
  return (
    <header className="hb-head">
      <div className="hb-head-main">
        <span className="hb-head-icon" aria-hidden="true">
          <HbIcon name={icon} size={14} />
        </span>
        <div className="hb-head-text">
          <h2 className="hb-head-title">{title}</h2>
          {description && <p className="hb-head-desc">{description}</p>}
        </div>
      </div>

      {actionLabel && (
        <button
          type="button"
          className="hb-link-btn"
          onClick={onAction}
          aria-label={actionAriaLabel || actionLabel}
        >
          <span>{actionLabel}</span>
          <HbIcon name="arrow" size={12} strokeWidth={2.4} />
        </button>
      )}
    </header>
  );
}

