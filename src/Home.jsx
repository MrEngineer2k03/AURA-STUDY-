import { useState, useEffect } from 'react';
import './Home.css';
import StudyCard from './components/StudyCard';
import StudyFolders from 'ui/studyfolder/StudyFolders';
import MyFolders from 'ui/studyfolder/MyFolders';
import characterImg from './assets/character.png';
import auraLogo from './assets/logoname.png';
import homeBg from './assets/homebackground.png';
import eventBanner from './assets/event_banner.png';
import engineeringLogo from './assets/engineeringlogo.png';

export default function Home({ userName = 'CARL_MONDIGO' } = {}) {
  const getInitialTab = () => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.toLowerCase();
      if (h === '#study' || h === '#folders' || h === '#my-folders') {
        return 'MY FOLDERS';
      }
    }
    return 'HOME';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      const h = window.location.hash.toLowerCase();
      if (h === '#study' || h === '#folders' || h === '#my-folders') {
        setActiveTab('MY FOLDERS');
      } else if (h === '#home' || h === '') {
        setActiveTab('HOME');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

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

  const [scrollToCreateFolder, setScrollToCreateFolder] = useState(false);
  const [selectedFolderForStudy, setSelectedFolderForStudy] = useState(null);

  const handleSelectFolder = (folder) => {
    const targetFolder = {
      ...folder,
      id: folder.id === 1 ? 'folder-1' : folder.id === 2 ? 'folder-2' : folder.id === 3 ? 'folder-3' : folder.id,
    };
    setSelectedFolderForStudy(targetFolder);
    setActiveTab('MY FOLDERS');
  };

  const handleContinueStudying = () => {
    const physicsFolder = {
      id: 'folder-1',
      title: 'Physics Midterms',
      subtitle: 'Forces & Motion',
      progress: 82,
      lessons: 5,
      color: 'red',
    };
    setSelectedFolderForStudy(physicsFolder);
    setActiveTab('MY FOLDERS');
  };

  const handleCreateFolder = () => {
    console.log('[AURA] Create new study folder requested -> redirecting to My Folders Create Folder card');
    setSelectedFolderForStudy(null);
    setScrollToCreateFolder(true);
    setActiveTab('MY FOLDERS');
  };

  const handleViewAllFolders = () => {
    setSelectedFolderForStudy(null);
    setScrollToCreateFolder(false);
    setActiveTab('MY FOLDERS');
  };

  if (activeTab === 'MY FOLDERS') {
    return (
      <MyFolders
        onNavigateHome={() => {
          setSelectedFolderForStudy(null);
          setScrollToCreateFolder(false);
          setActiveTab('HOME');
        }}
        onTabChange={(tab) => {
          setSelectedFolderForStudy(null);
          setScrollToCreateFolder(false);
          setActiveTab(tab);
        }}
        scrollToCreate={scrollToCreateFolder}
        initialActiveFolder={selectedFolderForStudy}
      />
    );
  }

  // Helper to render Daily Missions card (used in hero right for desktop, in vertical stream for mobile)
  const renderDailyMissions = (extraClass = '') => (
    <div className={`daily-challenge-card ${extraClass}`}>
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
  );

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
            onClick={() => setActiveTab('HOME')}
          />
          <span className="navbar-separator">·</span>
          <nav className="navbar-nav-links" aria-label="Main Navigation">
            {navTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`nav-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => {
                  setScrollToCreateFolder(false);
                  setActiveTab(tab);
                }}
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
                Ready to <br className="mobile-br" />continue <br className="desktop-br" />your{' '}
                <span className="text-highlight-red">journey?</span>
              </h1>
              <p className="hero-sub-description">
                Study, learn, and level up with your friends.
              </p>
            </div>

            {/* ENGINEERING DEPARTMENT & XP */}
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

          {/* RIGHT HERO COLUMN (BIG LOGO + DAILY MISSIONS FOR DESKTOP) */}
          <div className="hero-right-column">
            {/* BIG AURA LOGO DISPLAY */}
            <div className="hero-brand-big-display">
              <img
                src={auraLogo}
                alt="AURA"
                className="hero-brand-big-logo"
              />
            </div>

            {/* DAILY MISSIONS CARD (DESKTOP POSITION) */}
            {renderDailyMissions('desktop-only')}
          </div>
        </div>

        {/* 4. BOTTOM DASHBOARD FEATURE GRID (STACKED VERTICALLY ON MOBILE) */}
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
            onContinue={handleContinueStudying}
            onViewFolder={handleViewAllFolders}
          />

          {/* DAILY MISSIONS CARD (MOBILE POSITION BETWEEN CONTINUE STUDYING & MY STUDY FOLDERS) */}
          {renderDailyMissions('mobile-only')}

          {/* COLUMN 2: MY STUDY FOLDERS (EXPANDED MIDDLE SECTION) */}
          <StudyFolders
            folders={studyFolders}
            onSelectFolder={handleSelectFolder}
            onCreateFolder={handleCreateFolder}
            onViewAll={handleViewAllFolders}
          />

          {/* COLUMN 3: UPCOMING EVENTS */}
          <div className="bottom-feature-card upcoming-events-card">
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

      {/* 5. MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <div className="mobile-bottom-nav-inner">
          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'HOME' ? 'active' : ''}`}
            onClick={() => setActiveTab('HOME')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="mobile-nav-label">Home</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'MY FOLDERS' ? 'active' : ''}`}
            onClick={() => setActiveTab('MY FOLDERS')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="mobile-nav-label">My Study</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'BATTLES' ? 'active' : ''}`}
            onClick={() => setActiveTab('BATTLES')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
                <line x1="2" y1="9" x2="9" y2="2" />
                <line x1="15" y1="2" x2="22" y2="9" />
                <line x1="2" y1="15" x2="9" y2="22" />
                <line x1="15" y1="22" x2="22" y2="15" />
              </svg>
            </div>
            <span className="mobile-nav-label">Battles</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'FRIENDS' ? 'active' : ''}`}
            onClick={() => setActiveTab('FRIENDS')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="mobile-nav-label">Friends</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'EVENTS' ? 'active' : ''}`}
            onClick={() => setActiveTab('EVENTS')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="mobile-nav-label">Events</span>
          </button>
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="ios-home-indicator-bar" />
      </nav>
    </div>
  );
}
