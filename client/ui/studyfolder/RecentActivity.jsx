/**
 * RecentActivity - Compact RPG study log showing XP gains, lesson completions, and friend joins
 *
 * @param {Object} props
 * @param {Array<Object>} [props.activities] - Optional custom activity feed
 */
export default function RecentActivity({ activities: customActivities }) {
  const defaultActivities = [
    {
      id: 1,
      folderTitle: 'Physics Midterms',
      folderColor: 'red',
      actionText: 'You completed "Energy"',
      reward: '+50 XP',
      timestamp: '2 hours ago',
      icon: '⚡',
    },
    {
      id: 2,
      folderTitle: 'Calculus Finals',
      folderColor: 'blue',
      actionText: 'Alyssa joined your study unit',
      reward: '+25 Coins',
      timestamp: '30 minutes ago',
      icon: '👥',
    },
    {
      id: 3,
      folderTitle: 'Programming Exam',
      folderColor: 'purple',
      actionText: 'You generated an AI Reviewer for "DOM Events"',
      reward: '⚔️ Battle Ready',
      timestamp: 'Yesterday',
      icon: '🤖',
    },
  ];

  const items = customActivities || defaultActivities;

  return (
    <section className="recent-activity-panel" aria-label="Recent Study Activity">
      <div className="activity-panel-header">
        <div className="activity-title-tag">
          <span className="activity-pulse-dot" aria-hidden="true" />
          <span className="activity-title-text">RECENT ACTIVITY</span>
        </div>
        <span className="activity-live-badge">SYNCED</span>
      </div>

      <div className="activity-items-stack">
        {items.map((item) => (
          <div key={item.id} className="activity-row-card">
            {/* Left Folder Badge */}
            <div className={`activity-folder-badge theme-${item.folderColor}`}>
              <span className="activity-icon">{item.icon}</span>
            </div>

            {/* Middle Content */}
            <div className="activity-info-block">
              <div className="activity-headline-line">
                <span className="activity-folder-name">{item.folderTitle}</span>
                <span className="activity-separator">·</span>
                <span className="activity-action-desc">{item.actionText}</span>
              </div>
              <span className="activity-timestamp">{item.timestamp}</span>
            </div>

            {/* Right RPG Reward Chip */}
            {item.reward && (
              <div className="activity-reward-tag">
                {item.reward}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
