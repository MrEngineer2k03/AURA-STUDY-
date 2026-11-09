import React, { useState } from 'react';
import './ProfilePage.css';
import characterImg from '../character/character.png';
import auraLogo from '../dashboard/logoname.png';

export default function ProfilePage({
  onNavigateHome,
  onTabChange,
  userName = 'CARL_MONDIGO',
}) {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'rewards' | 'settings'
  const [previewEmptyFolders, setPreviewEmptyFolders] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showAllAchievementsModal, setShowAllAchievementsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Customization state
  const [currentTitle, setCurrentTitle] = useState('Senior Tactician');
  const [currentOutfit, setCurrentOutfit] = useState('Data Architect Hoodie');
  const [activeFrameRing, setActiveFrameRing] = useState('cyber-prism'); // 'cyber-prism' | 'crimson-crest' | 'golden-halo'

  // Achievements list (6 total, 4 equipped)
  const [achievements, setAchievements] = useState([
    {
      id: 'sql-gm',
      name: 'SQL Grandmaster',
      rarity: 'Epic',
      cardRarityClass: 'rarity-card-epic',
      tileClass: 'tile-epic-cyan',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
          <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      ),
      description: 'Achieved 100% completion and mastery across all lessons in Database Systems.',
      earnedDate: 'Oct 2, 2026',
      equipped: true,
    },
    {
      id: 'eng-vanguard',
      name: 'Engineering Vanguard',
      rarity: 'Rare',
      cardRarityClass: 'rarity-card-rare-red',
      tileClass: 'tile-rare-red',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      description: 'Ranked in the top 5% of department contributors during Engineering Week.',
      earnedDate: 'Oct 1, 2026',
      equipped: true,
    },
    {
      id: '14-day-flame',
      name: '14-Day Flame',
      rarity: 'Uncommon',
      cardRarityClass: 'rarity-card-uncommon',
      tileClass: 'tile-uncommon-gold',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      ),
      description: 'Completed daily study review goals for two consecutive weeks without missing a day.',
      earnedDate: 'Sep 29, 2026',
      equipped: true,
    },
    {
      id: 'arena-duelist',
      name: 'Arena Duelist',
      rarity: 'Rare',
      cardRarityClass: 'rarity-card-rare-purple',
      tileClass: 'tile-rare-purple',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
          <path d="M13 19l6-6" />
          <path d="M16 16l4 4" />
          <path d="M19 21l2-2" />
        </svg>
      ),
      description: 'Won 30+ friendly 1v1 flashcard study battles against fellow classmates.',
      earnedDate: 'Sep 24, 2026',
      equipped: true,
    },
    {
      id: 'boss-slayer',
      name: 'Raid Commander',
      rarity: 'Legendary',
      cardRarityClass: 'rarity-card-legendary',
      tileClass: 'tile-uncommon-gold',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      description: 'Led a squad to defeat the Arch-Automaton in the Calculus Boss Raid.',
      earnedDate: 'Sep 15, 2026',
      equipped: false,
    },
    {
      id: 'knowledge-architect',
      name: 'Knowledge Architect',
      rarity: 'Epic',
      cardRarityClass: 'rarity-card-epic',
      tileClass: 'tile-epic-cyan',
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      description: 'Authored and shared 100+ high-rated study flashcards with the department.',
      earnedDate: 'Aug 28, 2026',
      equipped: false,
    },
  ]);

  const navTabs = ['HOME', 'MY FOLDERS', 'FRIENDS', 'BATTLES', 'EVENTS'];

  const handleNavClick = (tab) => {
    if (tab === 'HOME') {
      window.location.hash = 'home';
      if (onNavigateHome) onNavigateHome();
      else if (onTabChange) onTabChange('HOME');
    } else if (tab === 'MY FOLDERS') {
      window.location.hash = 'study';
      if (onTabChange) onTabChange('MY FOLDERS');
    } else if (tab === 'EVENTS') {
      window.location.hash = 'events';
      if (onTabChange) onTabChange('EVENTS');
    } else if (onTabChange) {
      onTabChange(tab);
    }
  };

  const toggleEquipAchievement = (id) => {
    setAchievements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, equipped: !a.equipped } : a))
    );
  };

  const equippedCount = achievements.filter((a) => a.equipped).length;

  return (
    <div className="aura-profile-page-root">
      {/* Ambient Cyber Background */}
      <div className="profile-ambient-bg" aria-hidden="true" />

      {/* TOP NAVBAR (Matching standard AURA styling) */}
      <header className="aura-navbar" style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%', boxSizing: 'border-box' }}>
        <div className="navbar-left">
          <img
            src={auraLogo}
            alt="AURA"
            className="navbar-brand-logo"
            onClick={() => handleNavClick('HOME')}
            style={{ cursor: 'pointer' }}
          />
          <span className="navbar-separator">·</span>
          <nav className="navbar-nav-links" aria-label="Main Navigation">
            {navTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className="nav-tab-btn"
                onClick={() => handleNavClick(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="navbar-right">
          <div className="coins-badge">
            <span>🪙</span>
            <span>2,450</span>
          </div>

          <button
            type="button"
            className="icon-btn-round"
            aria-label="Notifications"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <div
            className="user-profile-chip active"
            style={{
              borderColor: 'rgba(255, 77, 109, 0.6)',
              background: 'rgba(255, 77, 109, 0.1)',
            }}
          >
            <div className="user-avatar-circle">
              <img
                src={characterImg}
                alt="Carl"
                className="user-avatar-img"
              />
            </div>
            <div className="user-info-text">
              <span className="user-info-name">{userName}</span>
              <span className="user-info-dept">Lv. 12 · Engineering</span>
            </div>
            <span className="user-chevron">▾</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="profile-main-container">
        {/* PAGE HEADER ROW */}
        <div className="profile-page-header-row">
          <div className="prof-header-left">
            <span className="prof-eyebrow">YOUR STUDENT SPACE</span>
            <h1 className="prof-title">My Profile</h1>
            <p className="prof-subtitle">
              Your progress, achievements, and personal identity in AURA.
            </p>
          </div>

          <div className="profile-subnav-pills" role="tablist">
            <button
              type="button"
              className={`prof-subnav-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('overview')}
            >
              <span className="prof-subnav-icon">📈</span>
              <span>Overview & Stats</span>
            </button>
            <button
              type="button"
              className={`prof-subnav-btn ${activeSubTab === 'rewards' ? 'active' : ''}`}
              onClick={() => {
                setActiveSubTab('rewards');
                setShowCustomizeModal(true);
              }}
            >
              <span className="prof-subnav-icon">👤</span>
              <span>Avatar & Frame Rewards</span>
            </button>
            <button
              type="button"
              className={`prof-subnav-btn ${activeSubTab === 'settings' ? 'active' : ''}`}
              onClick={() => {
                setActiveSubTab('settings');
                setShowSettingsModal(true);
              }}
            >
              <span className="prof-subnav-icon">⚙</span>
              <span>Account Settings</span>
            </button>
          </div>
        </div>

        {/* TWO-COLUMN GRID LAYOUT */}
        <div className="profile-main-grid-layout">
          {/* =========================================
              LEFT COLUMN: IDENTITY & ACADEMIC CARD
             ========================================= */}
          <aside className="profile-identity-card">
            {/* Title Crown - Pure stylized text without a shape container */}
            <div className="avatar-crown-title">
              <span>👑</span>
              <span>{currentTitle}</span>
            </div>

            {/* Circular Avatar Bust with Glow Ring */}
            <div className="avatar-bust-container">
              <div
                className="avatar-ring-outer"
                style={{
                  background:
                    activeFrameRing === 'crimson-crest'
                      ? 'linear-gradient(135deg, #ff2a44 0%, #ff6b81 100%)'
                      : activeFrameRing === 'golden-halo'
                      ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
                      : 'linear-gradient(135deg, #ff4d6d 0%, #f59e0b 50%, #2dd4bf 100%)',
                }}
              >
                <div className="avatar-ring-inner">
                  <img
                    src={characterImg}
                    alt="Carl Patrick Mondigo"
                    className="avatar-img-bust"
                  />
                </div>
              </div>
              <div className="avatar-level-badge">
                <span className="level-dot" />
                <span>Level 12</span>
              </div>
            </div>

            {/* Wearing Subtitle */}
            <div className="avatar-wearing-text">
              Wearing <strong style={{ color: '#ffffff' }}>{currentOutfit}</strong>
            </div>

            {/* Customize Button */}
            <button
              type="button"
              className="btn-customize-avatar"
              onClick={() => setShowCustomizeModal(true)}
            >
              <span>✏</span>
              <span>Customize Avatar & Frame</span>
            </button>

            <div className="prof-card-divider" />

            {/* User Identity Details */}
            <div className="user-identity-meta-row">
              <div className="user-crest-box">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="user-identity-names">
                <h2 className="user-full-name">Carl Patrick Mondigo</h2>
                <span className="user-handle-dept">
                  @{userName} · College of Engineering
                </span>
              </div>
            </div>

            {/* Level Progress Block */}
            <div className="level-progress-block">
              <div className="level-progress-row-top">
                <span className="level-title-label">Level 12 Scholar</span>
                <span className="level-xp-value">820 / 1,000 XP</span>
              </div>
              <div className="level-progress-track">
                <div className="level-progress-fill" style={{ width: '82%' }} />
              </div>
              <div className="level-progress-row-bottom">
                <span className="level-needed-text">180 XP needed for Level 13</span>
                <span className="level-dept-rank">Top 4% in Dept</span>
              </div>
            </div>

            <div className="prof-card-divider" />

            {/* Academic Information */}
            <div className="academic-section-label">Academic Information</div>
            <div className="academic-info-grid">
              <div className="academic-info-tile">
                <span className="acad-tile-label">Degree Program</span>
                <span className="acad-tile-value">BS Computer Engineering</span>
              </div>
              <div className="academic-info-tile">
                <span className="acad-tile-label">Year Standing</span>
                <span className="acad-tile-value">4th Year · Senior</span>
              </div>
            </div>

            {/* About Me */}
            <div className="about-me-section">
              <span className="about-me-label">About Me</span>
              <p className="about-me-text">
                Computer Engineering senior passionate about database architecture and collaborative study sessions.
              </p>
            </div>

            {/* Active Buff Perks - Pure text without a shape container */}
            <div className="profile-perks-row">
              <div className="prof-perk-text perk-gold">
                <span className="perk-icon">⚡</span>
                <span>+15% IT & Data Coins</span>
              </div>
              <div className="prof-perk-text perk-teal">
                <span className="perk-icon">👥</span>
                <span>+15% Co-op Study Bonus</span>
              </div>
            </div>
          </aside>

          {/* =========================================
              RIGHT MAIN COLUMN: STATS, FOLDERS, ACHIEVEMENTS
             ========================================= */}
          <div className="profile-right-main-col">
            {/* 1. TOP 4 STAT CARDS */}
            <div className="profile-stats-cards-grid">
              {/* Stat 1: Study Streak */}
              <div className="prof-stat-card">
                <div className="stat-card-top-row">
                  <span className="stat-card-label">Study Streak</span>
                  <div className="stat-card-icon-tile icon-flame">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="stat-card-value">14 Days</div>
                <p className="stat-card-subtext">Current study streak</p>
              </div>

              {/* Stat 2: Battle Record */}
              <div className="prof-stat-card">
                <div className="stat-card-top-row">
                  <span className="stat-card-label">Battle Record</span>
                  <div className="stat-card-icon-tile icon-swords">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
                      <path d="M13 19l6-6" />
                      <path d="M16 16l4 4" />
                      <path d="M19 21l2-2" />
                    </svg>
                  </div>
                </div>
                <div className="stat-card-value">78% Win Rate</div>
                <p className="stat-card-subtext">Study battle performance</p>
              </div>

              {/* Stat 3: Cards Mastered */}
              <div className="prof-stat-card">
                <div className="stat-card-top-row">
                  <span className="stat-card-label">Cards Mastered</span>
                  <div className="stat-card-icon-tile icon-book">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                </div>
                <div className="stat-card-value">412 Cards</div>
                <p className="stat-card-subtext">Flashcards mastered</p>
              </div>

              {/* Stat 4: Balance */}
              <div className="prof-stat-card">
                <div className="stat-card-top-row">
                  <span className="stat-card-label">Balance</span>
                  <div className="stat-card-icon-tile icon-coins">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="8" cy="8" r="6" />
                      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
                      <path d="M7 6h1v4" />
                      <path d="m16.71 13.88.7.71-2.82 2.82" />
                    </svg>
                  </div>
                </div>
                <div className="stat-card-value">2,450 Coins</div>
                <p className="stat-card-subtext">Available balance</p>
              </div>
            </div>

            {/* 2. MY STUDY FOLDERS SECTION */}
            <section className="profile-section-card">
              <div className="prof-section-header-row">
                <div className="prof-sec-title-group">
                  <h2 className="prof-section-title">My Study Folders</h2>
                  <p className="prof-section-subtitle">
                    Recent academic activity and flashcard completion across your subjects.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-preview-empty"
                  onClick={() => setPreviewEmptyFolders(!previewEmptyFolders)}
                >
                  {previewEmptyFolders ? 'Show Active Folders' : 'Preview Empty State'}
                </button>
              </div>

              {previewEmptyFolders ? (
                /* Empty State View */
                <div className="prof-empty-state-box">
                  <span className="empty-state-glyph">📁</span>
                  <div className="empty-state-title">No Study Folders Yet</div>
                  <p className="empty-state-sub">
                    You haven’t created or enrolled in any study folders yet. Create your first folder to begin tracking cards, mastery, and exam readiness.
                  </p>
                  <button
                    type="button"
                    className="btn-create-first-folder"
                    onClick={() => handleNavClick('MY FOLDERS')}
                  >
                    + Create Study Folder
                  </button>
                </div>
              ) : (
                /* 3 Populated Folder Cards Grid */
                <div className="prof-folders-grid">
                  {/* Folder 1: Test (Engineering) */}
                  <div className="prof-folder-card">
                    <div className="folder-card-top-row">
                      <span className="folder-card-dept">Engineering</span>
                      <span className="folder-card-status-text status-progress-blue">
                        In Progress
                      </span>
                    </div>

                    <div className="folder-card-main-info">
                      <h3 className="folder-card-title">Test</h3>
                      <p className="folder-card-sub">Engineering Fundamentals</p>
                      <div className="folder-card-meta-counts">
                        0 lessons · 5 flashcards
                      </div>
                    </div>

                    <div className="folder-card-completion-block">
                      <div className="folder-completion-meta">
                        <span className="comp-label">Completion</span>
                        <span className="comp-pct pct-red">20%</span>
                      </div>
                      <div className="folder-progress-bar-track">
                        <div className="folder-progress-bar-fill fill-red" style={{ width: '20%' }} />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-folder-action"
                      onClick={() => handleNavClick('MY FOLDERS')}
                    >
                      <span>Continue Studying</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Folder 2: Business Strategy */}
                  <div className="prof-folder-card">
                    <div className="folder-card-top-row">
                      <span className="folder-card-dept">Business</span>
                      <span className="folder-card-status-text status-progress-amber">
                        In Progress
                      </span>
                    </div>

                    <div className="folder-card-main-info">
                      <h3 className="folder-card-title">Business Strategy</h3>
                      <p className="folder-card-sub">Entrepreneurship & Markets</p>
                      <div className="folder-card-meta-counts">
                        4 lessons · 28 flashcards
                      </div>
                    </div>

                    <div className="folder-card-completion-block">
                      <div className="folder-completion-meta">
                        <span className="comp-label">Completion</span>
                        <span className="comp-pct pct-amber">25%</span>
                      </div>
                      <div className="folder-progress-bar-track">
                        <div className="folder-progress-bar-fill fill-amber" style={{ width: '25%' }} />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-folder-action"
                      onClick={() => handleNavClick('MY FOLDERS')}
                    >
                      <span>Continue Studying</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Folder 3: Database Systems */}
                  <div className="prof-folder-card">
                    <div className="folder-card-top-row">
                      <span className="folder-card-dept">IT & Data</span>
                      <span className="folder-card-status-text status-completed-green">
                        Completed
                      </span>
                    </div>

                    <div className="folder-card-main-info">
                      <h3 className="folder-card-title">Database Systems</h3>
                      <p className="folder-card-sub">SQL & Relational Algebra</p>
                      <div className="folder-card-meta-counts">
                        7 lessons · 64 flashcards
                      </div>
                    </div>

                    <div className="folder-card-completion-block">
                      <div className="folder-completion-meta">
                        <span className="comp-label">Completion</span>
                        <span className="comp-pct pct-green">100%</span>
                      </div>
                      <div className="folder-progress-bar-track">
                        <div className="folder-progress-bar-fill fill-green" style={{ width: '100%' }} />
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-folder-action"
                      onClick={() => handleNavClick('MY FOLDERS')}
                    >
                      <span>Review Folder</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* 3. EARNED HONORS & ACHIEVEMENTS SECTION */}
            <section className="profile-section-card">
              <div className="prof-section-header-row">
                <div className="prof-sec-title-group">
                  <div className="prof-sec-title-with-badge">
                    <h2 className="prof-section-title">Earned Honors & Achievements</h2>
                    <span className="prof-sec-badge">{equippedCount}/4 Equipped</span>
                  </div>
                  <p className="prof-section-subtitle">
                    Milestones earned through study consistency, folder mastery, and friendly battles.
                  </p>
                </div>
                <button
                  type="button"
                  className="view-all-achievements-link"
                  onClick={() => setShowAllAchievementsModal(true)}
                >
                  <span>View All Achievements ({achievements.length})</span>
                  <span>&gt;</span>
                </button>
              </div>

              {/* 2x2 Grid of Displayed Achievements with Rarity Color Design */}
              <div className="prof-achievements-grid">
                {achievements
                  .filter((a) => a.equipped)
                  .slice(0, 4)
                  .map((ach) => (
                    <div key={ach.id} className={`prof-achievement-card ${ach.cardRarityClass}`}>
                      <div className={`ach-icon-tile ${ach.tileClass}`}>
                        {ach.icon}
                      </div>
                      <div className="ach-content-block">
                        <div className="ach-top-header-line">
                          <h3 className="ach-card-name">{ach.name}</h3>
                        </div>
                        <p className="ach-card-desc">{ach.description}</p>
                        <div className="ach-footer-status-row">
                          <span className="ach-earned-date">{ach.earnedDate}</span>
                          <span className="ach-displayed-flag">
                            <span>✓</span>
                            <span>Displayed</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* =========================================
          CUSTOMIZE AVATAR & FRAME MODAL
         ========================================= */}
      {showCustomizeModal && (
        <div className="prof-modal-backdrop" onClick={() => setShowCustomizeModal(false)}>
          <div className="prof-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="prof-modal-header">
              <h3 className="prof-modal-title">Customize Avatar & Identity</h3>
              <button
                type="button"
                className="prof-modal-close-btn"
                onClick={() => setShowCustomizeModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="prof-modal-body">
              {/* Frame Ring Selection */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  Aura Glow Frame
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'cyber-prism', name: 'Cyber Prism (Triple Glow)' },
                    { id: 'crimson-crest', name: 'Crimson Vanguard' },
                    { id: 'golden-halo', name: 'Golden Scholar' },
                  ].map((frame) => (
                    <button
                      key={frame.id}
                      type="button"
                      onClick={() => setActiveFrameRing(frame.id)}
                      style={{
                        background: activeFrameRing === frame.id ? '#1b2334' : '#131826',
                        border: activeFrameRing === frame.id ? '2px solid #ff4d6d' : '1px solid #1e2638',
                        borderRadius: '10px',
                        padding: '12px 10px',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {frame.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Selection */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  Equipped Title
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {[
                    'Senior Tactician',
                    'Database Architect',
                    'Calculus Conqueror',
                    'Engineering Prodigy',
                  ].map((title) => (
                    <button
                      key={title}
                      type="button"
                      onClick={() => setCurrentTitle(title)}
                      style={{
                        background: currentTitle === title ? '#1b2334' : '#131826',
                        border: currentTitle === title ? '2px solid #fbbf24' : '1px solid #1e2638',
                        borderRadius: '10px',
                        padding: '10px',
                        color: currentTitle === title ? '#fbbf24' : '#ffffff',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      👑 {title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfit Selection */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
                  Equipped Outfit
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                  {[
                    'Data Architect Hoodie',
                    'Crimson Cyber-Engineer Jacket',
                    'Midnight Scholar Coat',
                    'Academy Classic Blazer',
                  ].map((outfit) => (
                    <button
                      key={outfit}
                      type="button"
                      onClick={() => setCurrentOutfit(outfit)}
                      style={{
                        background: currentOutfit === outfit ? '#1b2334' : '#131826',
                        border: currentOutfit === outfit ? '2px solid #ff4d6d' : '1px solid #1e2638',
                        borderRadius: '10px',
                        padding: '10px',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      👕 {outfit}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCustomizeModal(false)}
                style={{
                  marginTop: '12px',
                  background: '#ff4d6d',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontFamily: 'var(--font-heading, Sora)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          VIEW ALL ACHIEVEMENTS MODAL
         ========================================= */}
      {showAllAchievementsModal && (
        <div className="prof-modal-backdrop" onClick={() => setShowAllAchievementsModal(false)}>
          <div className="prof-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="prof-modal-header">
              <h3 className="prof-modal-title">All Honors & Achievements ({achievements.length})</h3>
              <button
                type="button"
                className="prof-modal-close-btn"
                onClick={() => setShowAllAchievementsModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="prof-modal-body">
              <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 8px' }}>
                You can equip up to 4 achievements to display on your public profile and battle cards.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`prof-modal-ach-card ${ach.cardRarityClass}`}
                    style={{
                      borderRadius: '12px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      <div className={`ach-icon-tile ${ach.tileClass}`} style={{ width: '36px', height: '36px' }}>
                        {ach.icon}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '800', color: '#ffffff' }}>
                            {ach.name}
                          </span>
                        </div>
                        <p style={{ fontSize: '11.5px', color: '#94a3b8', margin: '2px 0 0' }}>
                          {ach.description}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleEquipAchievement(ach.id)}
                      style={{
                        background: ach.equipped ? 'rgba(255, 77, 109, 0.15)' : '#1a2233',
                        border: ach.equipped ? '1px solid #ff4d6d' : '1px solid #232d40',
                        color: ach.equipped ? '#ff4d6d' : '#94a3b8',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {ach.equipped ? '✓ Equipped' : 'Equip'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          ACCOUNT SETTINGS MODAL
         ========================================= */}
      {showSettingsModal && (
        <div className="prof-modal-backdrop" onClick={() => setShowSettingsModal(false)}>
          <div className="prof-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="prof-modal-header">
              <h3 className="prof-modal-title">Account Settings</h3>
              <button
                type="button"
                className="prof-modal-close-btn"
                onClick={() => setShowSettingsModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="prof-modal-body">
              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Student Handle
                </label>
                <input
                  type="text"
                  defaultValue={userName}
                  style={{
                    width: '100%',
                    background: '#131826',
                    border: '1px solid #1e2638',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Department / Major
                </label>
                <input
                  type="text"
                  defaultValue="BS Computer Engineering"
                  style={{
                    width: '100%',
                    background: '#131826',
                    border: '1px solid #1e2638',
                    color: '#ffffff',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Notification Preferences
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
                    <input type="checkbox" defaultChecked /> Event & Raid multiplier alerts
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
                    <input type="checkbox" defaultChecked /> Study battle invites from classmates
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSettingsModal(false)}
                style={{
                  marginTop: '12px',
                  background: '#ff4d6d',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Close Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

