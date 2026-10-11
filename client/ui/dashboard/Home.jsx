import { useState, useEffect } from 'react';
import './Home.css';
import StudyCard from './components/StudyCard';
import StudyFolders from '../studyfolder/StudyFolders';
import MyFolders from '../studyfolder/MyFolders';
import characterImg from '../character/character.png';
import auraLogo from './logoname.png';
import homeBg from './homebackground.png';
import eventBanner from './event_banner.png';
import engineeringLogo from './engineeringlogo.png';

export default function Home({ userName = 'CARL_MONDIGO' } = {}) {
  const [activeTab, setActiveTab] = useState('HOME');
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setAnimated(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const navTabs = ['HOME', 'MY FOLDERS', 'FRIENDS', 'BATTLES', 'EVENTS'];

  const [studyLessons, setStudyLessons] = useState([
    { name: 'Motion', completed: true },
    { name: 'Forces', completed: true },
    { name: 'Energy', completed: true },
    { name: 'Momentum', completed: false },
  ]);

  const toggleStudyLesson = (index) => {
    setStudyLessons((prev) =>
      prev.map((l, i) => (i === index ? { ...l, completed: !l.completed } : l))
    );
  };

  const [studyFolders, setStudyFolders] = useState([
    {
      id: 1,
      title: 'Physics Midterms',
      progress: 82,
      lessons: 5,
      members: 3,
      color: 'red',
      battleReady: true,
      hasAiReviewer: true,
      lastStudied: 'Today',
    },
    {
      id: 2,
      title: 'Calculus Finals',
      progress: 43,
      lessons: 8,
      members: 1,
      color: 'blue',
      battleReady: false,
      hasAiReviewer: true,
      lastStudied: 'Yesterday',
    },
    {
      id: 3,
      title: 'Programming Exam',
      progress: 67,
      lessons: 6,
      members: 4,
      color: 'purple',
      battleReady: true,
      hasAiReviewer: false,
      lastStudied: '3d ago',
    },
  ]);

  const handleSelectFolder = (folder) => {
    console.log('[AURA] Selected folder:', folder.title, folder);
  };

  const handleCreateFolder = () => {
    console.log('[AURA] Create new study folder requested');
    const colorThemes = ['red', 'blue', 'purple', 'green', 'gold'];
    const nextIdx = studyFolders.length + 1;
    const assignedColor = colorThemes[(nextIdx - 1) % colorThemes.length];
    setStudyFolders((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: `Study Deck #${nextIdx}`,
        progress: 0,
        lessons: 1,
        members: 1,
        color: assignedColor,
        battleReady: false,
        hasAiReviewer: true,
        lastStudied: 'Just now',
      },
    ]);
  };

  const handleViewAllFolders = () => {
    setActiveTab('MY FOLDERS');
  };

  if (activeTab === 'MY FOLDERS') {
    return (
      <MyFolders
        onNavigateHome={() => setActiveTab('HOME')}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    );
  }

  return (
    <div className="aura-dashboard-root">
      {/* 1. CINEMATIC BACKGROUND LAYERS */}
      <div className="campus-bg-container">
        <img
          src={homeBg}
          alt="Academy Courtyard"
          className="campus-bg-image"
        />
        <div className="campus-gradient-overlay"></div>

        {/* Dynamic Red Cyber Angular Speedline Overlay */}
        <svg
          className="cyber-speedline-overlay"
          viewBox="0 0 1920 800"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left Red Angle Wedge */}
          <polygon
            points="0,0 480,0 320,620 0,720"
            fill="url(#leftCyberGrad)"
            opacity="0.32"
          />
          <polygon
            points="0,0 260,0 120,440 0,520"
            fill="url(#leftCyberGrad2)"
            opacity="0.25"
          />
          {/* Right Red Angle Wedge */}
          <polygon
            points="1480,0 1920,0 1920,580 1620,440"
            fill="url(#rightCyberGrad)"
            opacity="0.28"
          />

          <defs>
            <linearGradient id="leftCyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2a44" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#991b1b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0a0d14" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="leftCyberGrad2" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a0d14" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rightCyberGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff2a44" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#b91c1c" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0a0d14" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Giant Watermark Typography in Sky */}
        <div className="aura-sky-watermark">ENGINEERING</div>
      </div>

      {/* 2. TOP NAVBAR */}
      <header className="aura-navbar">
        <div className="navbar-left">
          <img
            src={auraLogo}
            alt="AURA"
            className="navbar-brand-logo"
          />
          <span className="navbar-separator">·</span>
          <nav className="navbar-nav-links" aria-label="Main Navigation">
            {navTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`nav-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
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
            🔔
          </button>

          <div className="user-profile-chip">
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

      {/* 3. HERO STAGE CONTENT */}
      <div className="hero-stage-layout">
        {/* UPPER VIEWPORT: GREETING, CHARACTER, HUD, AND FLOATING ACTION CARDS */}
        <div className="hero-upper-viewport">
          {/* LEFT HERO COLUMN */}
          <div className="hero-left-column">
            <div className="hero-greetings-block">
              <div className="hero-greeting-tag">
                <span className="red-slant-icon">/</span> GOOD EVENING, {userName.includes('_') ? userName.split('_')[0] : userName}
              </div>
              <h1 className="hero-main-headline">
                Ready to continue <br />
                your <span className="text-highlight-red">journey?</span>
              </h1>
              <p className="hero-sub-description">
                Study, learn, and level up with your friends.
              </p>
            </div>

            {/* ENGINEERING DEPARTMENT & XP (DIRECTLY ABOVE CONTINUE STUDYING CARD) */}
            <div className="hero-engineering-status">
              <img
                src={engineeringLogo}
                alt="Engineering"
                className="engineering-status-logo"
              />
              <div className="engineering-status-info">
                <div className="engineering-header-line">
                  <span className="engineering-big-title">ENGINEERING</span>
                  <span className="engineering-level-tag">Lv. 12</span>
                </div>
                <div className="engineering-xp-line">
                  <span className="engineering-xp-user-name">{userName}</span>
                  <span className="engineering-xp-numbers">820 / 1000 XP</span>
                </div>
                <div className="engineering-xp-bar-track">
                  <div
                    className="engineering-xp-bar-fill"
                    style={{ width: animated ? '82%' : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER CHARACTER STAGE */}
          <div className="hero-center-character-stage">
            <img
              src={characterImg}
              alt="Carl"
              className="hero-character-sprite"
            />
            <div className="hero-character-ground-shadow"></div>
          </div>

          {/* RIGHT HERO COLUMN (BIG LOGO + DAILY MISSIONS) */}
          <div className="hero-right-column">
            {/* BIG AURA LOGO DISPLAY */}
            <div className="hero-brand-big-display">
              <img
                src={auraLogo}
                alt="AURA"
                className="hero-brand-big-logo"
              />
            </div>

            {/* DAILY MISSIONS CARD */}
            <div className="daily-challenge-card">
              {/* Subtle Red Target Rings Watermark */}
              <svg
                className="daily-target-watermark"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="19"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle cx="50" cy="50" r="7" fill="currentColor" />
              </svg>

              <div className="card-top-title-row">
                <div className="card-section-label">
                  <span>🎯</span> DAILY MISSIONS
                </div>
              </div>

              <div className="daily-task-name">Answer 10 questions</div>
              <div className="daily-count-meta">6 / 10</div>
              <div className="daily-progress-track">
                <div
                  className="daily-progress-fill"
                  style={{ width: animated ? '60%' : '0%' }}
                ></div>
              </div>

              <div className="daily-rewards-chips-row">
                <span className="reward-chip-gold">★ +50 XP</span>
                <span className="reward-chip-green">🪙 +25 Coins</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. BOTTOM DASHBOARD FEATURE GRID (3 COLUMNS) */}
        <section className="dashboard-bottom-grid">
          {/* COLUMN 1: CONTINUE STUDYING CARD */}
          <StudyCard
            className="dashboard-study-card"
            title="Physics Midterms"
            subtitle="Forces & Motion"
            progress={82}
            lessonsCompleted={4}
            totalLessons={5}
            lessons={studyLessons}
            onToggleLesson={toggleStudyLesson}
            onContinue={() => console.log('Continue Studying clicked')}
            onViewFolder={() => console.log('View Folder clicked')}
          />

          {/* COLUMN 2: MY STUDY FOLDERS (EXPANDED MIDDLE SECTION) */}
          <StudyFolders
            folders={studyFolders}
            onSelectFolder={handleSelectFolder}
            onCreateFolder={handleCreateFolder}
            onViewAll={handleViewAllFolders}
          />

          {/* COLUMN 3: UPCOMING EVENTS */}
          <div className="bottom-feature-card">
            <div className="feature-header-row">
              <div className="feature-title-label">
                <span>📅</span> UPCOMING EVENTS
              </div>
              <a href="#events" className="view-all-link">
                View all →
              </a>
            </div>

            <div className="event-preview-content">
              <div className="event-top-info">
                <img src={eventBanner} alt="Engineering Week" className="event-banner-img" />
                <div className="event-meta-info">
                  <div className="event-name">Engineering Week</div>
                  <div className="event-dates">Sep 30 – Oct 7</div>
                  <div className="event-perks-list">
                    <span className="event-perk-item">
                      <span className="perk-icon-star">★</span> Exclusive outfit
                    </span>
                    <span className="event-perk-item">
                      <span className="perk-icon-bolt">⚡</span> 2x XP
                    </span>
                    <span className="event-perk-item">
                      <span className="perk-icon-coin">🪙</span> Bonus coins
                    </span>
                  </div>
                </div>
              </div>

              <button type="button" className="btn-view-event">
                View Event
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
