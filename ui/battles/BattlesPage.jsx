import React from 'react';
import './BattlesPage.css';

export default function BattlesPage({ onNavigateHome, onTabChange }) {
  const battleModes = [
    {
      title: '1v1 Blitz Duel // Crimson Division',
      sub: '30 Seconds per Question • ELO Rating: 2,140',
      tag: 'RANKED MATCHMAKING',
      cta: 'Enter Duel Queue',
      badge: 'LIVE QUEUE',
      xp: '+850 XP',
      action: () => alert('Matchmaking search initiated: Crimson Division Blitz Arena!'),
    },
    {
      title: 'Co-Op Raid Boss // The Midterm Leviathan',
      sub: 'Requires 3 Scholars • 2,500 XP + Relic Drop',
      tag: 'BOSS RAID',
      cta: 'Recruit Squadmates',
      badge: 'SQUAD CO-OP',
      xp: '+2,500 XP',
      action: () => onTabChange && onTabChange('FRIENDS'),
    },
    {
      title: 'Custom Deck Skirmish',
      sub: 'Use any personal folder for unranked combat training',
      tag: 'TRAINING ARENA',
      cta: 'Select Study Folder',
      badge: 'SOLO DRILL',
      xp: '+400 XP',
      action: () => onTabChange && onTabChange('MY FOLDERS'),
    },
  ];

  return (
    <div className="aura-battles-page-container">
      {/* Header Banner */}
      <div className="aura-battles-header-banner">
        <div className="aura-battles-banner-left">
          <div className="aura-battles-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
              <line x1="13" y1="19" x2="19" y2="13" />
              <line x1="16" y1="16" x2="20" y2="20" />
              <line x1="19" y1="21" x2="21" y2="19" />
              <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
              <line x1="5" y1="14" x2="9" y2="18" />
              <line x1="7" y1="17" x2="4" y2="20" />
              <line x1="3" y1="19" x2="5" y2="21" />
            </svg>
          </div>
          <div className="aura-battles-banner-text">
            <div className="aura-battles-code-tag">CMB // ARENA-04 · RANKED ARENA</div>
            <h1 className="aura-battles-title">Ranked Knowledge Combat Arena</h1>
            <p className="aura-battles-desc">
              High-voltage 1v1 and Squad Boss battles powered by your study decks. Answer faster with higher accuracy to deal critical strikes.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="aura-battles-home-btn"
          onClick={() => onNavigateHome && onNavigateHome()}
        >
          Return to Home Nexus
        </button>
      </div>

      {/* Battle Modes Grid */}
      <div className="aura-battles-grid">
        {battleModes.map((item, idx) => (
          <div key={idx} className="aura-battles-card">
            <div className="aura-battles-card-top">
              <span className="aura-battles-card-tag">{item.tag}</span>
              <span className="aura-battles-card-xp">{item.xp}</span>
            </div>
            <h3 className="aura-battles-card-title">{item.title}</h3>
            <p className="aura-battles-card-sub">{item.sub}</p>

            <button
              type="button"
              className="aura-battles-card-cta"
              onClick={item.action}
            >
              <span>{item.cta}</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
