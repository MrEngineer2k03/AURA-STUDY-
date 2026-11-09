import React, { useState, useEffect, useMemo } from 'react';
import './EventsPage.css';
import auraLogo from '../dashboard/logoname.png';
import { BigCircleAvatar, useSavedEquipment } from '../character';

function renderCategoryIcon(icon) {
  switch (icon) {
    case 'sun':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    case 'sword':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
          <path d="M13 19l6-6" />
          <path d="M16 16l4 4" />
          <path d="M19 21l2-2" />
        </svg>
      );
    case 'database':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'moon':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      );
    case 'gear':
    default:
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
  }
}

function renderRewardIcon(type) {
  switch (type) {
    case 'outfit':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.5a2 2 0 001.34 1.57L6 11.4V20a2 2 0 002 2h8a2 2 0 002-2v-8.6l1.8-0.64a2 2 0 001.34-1.57l.58-3.5a2 2 0 00-1.34-2.23z" />
        </svg>
      );
    case 'xp':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'coin':
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v10M9 9.5a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5" />
        </svg>
      );
    case 'trophy':
    default:
      return (
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
          <path d="M18 4H6v7a6 6 0 0 0 12 0V4z" />
        </svg>
      );
  }
}

/**
 * EventsPage - Campus Events & Raids
 * Replicates the reference design (media_1794194207290_88928397.jpg,
 * media_1794194238309_4dd05c52.jpg, media_1794194252113_31aa14c3.jpg)
 * adhering strictly to AURA theme colors, fonts, and full-width layout occupying left/right corners.
 */
export default function EventsPage({ onNavigateHome, onTabChange }) {
  const navTabs = ['HOME', 'MY FOLDERS', 'FRIENDS', 'BATTLES', 'EVENTS'];
  const activeTab = 'EVENTS';
  const savedEquipment = useSavedEquipment();

  // Live countdown timer state for Hero Event
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 11,
    minutes: 39,
    seconds: 44,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyRegistered, setShowOnlyRegistered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarTab, setMobileSidebarTab] = useState('standings');

  // Mobile Floating Buff States: floating toast in bottom part & floating corner FAB
  const [initialFloatingToastVisible, setInitialFloatingToastVisible] = useState(true);
  const [initialToastClosing, setInitialToastClosing] = useState(false);
  const [showFloatingBuffCard, setShowFloatingBuffCard] = useState(false);

  const handleDismissInitialToast = () => {
    setInitialToastClosing(true);
    setTimeout(() => {
      setInitialFloatingToastVisible(false);
    }, 350);
  };

  useEffect(() => {
    // Auto-dismiss initial floating bottom toast after 5 seconds
    const timer = setTimeout(() => {
      handleDismissInitialToast();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Interactive Quests state
  const [quests, setQuests] = useState([
    {
      id: 'quest-1',
      badge: 'DAILY EVENT QUEST',
      progressText: '2 / 2',
      progressPercent: 100,
      description: 'Complete 2 Engineering or Database Flashcard Decks',
      rewards: '+150 XP  +100 Coins',
      points: '+150 Pts',
      isCompleted: true,
      isClaimed: false,
    },
    {
      id: 'quest-2',
      badge: 'BATTLE CHALLENGE',
      progressText: '2 / 3',
      progressPercent: 66,
      description: 'Win 3 Study Battles representing Engineering Dept',
      rewards: '+250 XP  +150 Coins',
      points: '+350 Pts',
      isCompleted: false,
      isClaimed: false,
    },
    {
      id: 'quest-3',
      badge: 'ACCURACY SPRINT',
      progressText: '18 / 25',
      progressPercent: 72,
      description: 'Answer 25 Questions with 90%+ Accuracy',
      rewards: '+100 XP  +75 Coins',
      points: '+150 Pts',
      isCompleted: false,
      isClaimed: false,
    },
  ]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState('');
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3200);
  };

  const handleClaimQuest = (questId) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, isClaimed: true } : q))
    );
    triggerToast('🎉 Reward claimed! +150 XP, +100 Coins & +150 Event Points added.');
  };

  // Events list matching reference design and public background images
  const [eventsList, setEventsList] = useState([
    {
      id: 'ev-eng-week',
      title: 'Engineering Week',
      category: 'Department',
      badgeType: 'Department',
      badgeIcon: 'sun',
      isLive: true,
      timeText: 'Live now',
      dateRange: 'Nov 6 – Nov 13 · All week · Engineering department',
      dates: 'Nov 6 – Nov 13',
      format: 'All week · Engineering department',
      studentsGoing: '429',
      subtitle: 'Department · Live now',
      description:
        'Join department challenges and study battles to earn limited-time rewards. Every study session in your Engineering folders boosts our department leaderboard standing!',
      bgImage: '/Engineering Week BG.png',
      goingCount: '429 going',
      accentColor: '#ff4d6d',
      rewards: [
        { label: 'Exclusive outfit', type: 'outfit', color: '#ff6b81' },
        { label: '2x XP', type: 'xp', color: '#ff6b81' },
        { label: 'Bonus coins', type: 'coin', color: '#ff6b81' },
      ],
      isRegistered: true,
    },
    {
      id: 'ev-boss-raid',
      title: 'Midterm Boss Raid: Calculus & Logic',
      category: 'Boss Raids',
      badgeType: 'Boss raid',
      badgeIcon: 'sword',
      isLive: false,
      timeText: 'In 2d 23h',
      dateRange: 'Nov 12 – Nov 14 · Weekend raid · Campus-wide co-op',
      dates: 'Nov 12 – Nov 14',
      format: 'Weekend raid · Campus-wide co-op',
      studentsGoing: '312',
      subtitle: 'Boss raid · Starts Nov 12',
      description:
        'Squad up with 4 friends to defeat the Arch-Automaton using high-accuracy study streaks and timed formula solves.',
      bgImage: '/Midterm Boss Raid_Calculus & Logic.png',
      goingCount: '312 going',
      accentColor: '#c084fc',
      rewards: [
        { label: 'Void Visor', type: 'outfit', color: '#c084fc' },
        { label: '3x raid XP', type: 'xp', color: '#c084fc' },
        { label: '800 coins', type: 'coin', color: '#c084fc' },
      ],
      isRegistered: false,
    },
    {
      id: 'ev-speedrun-cup',
      title: 'SQL & Database Speedrun Cup',
      category: 'Tournament',
      badgeType: 'Tournament',
      badgeIcon: 'database',
      isLive: false,
      timeText: 'In 7d 23h',
      dateRange: 'Nov 17 – Nov 19 · 48 hours · IT & Engineering arena',
      dates: 'Nov 17 – Nov 19',
      format: '48 hours · IT & Engineering arena',
      studentsGoing: '186',
      subtitle: 'Tournament · Starts Nov 17',
      description:
        'Put your Database Systems and Relational Algebra flashcards to the test in ranked 1v1 speed brackets.',
      bgImage: '/Golden SQL Speedrun Arena.png',
      goingCount: '186 going',
      accentColor: '#fbbf24',
      rewards: [
        { label: 'Golden DB badge', type: 'trophy', color: '#fbbf24' },
        { label: '5,000 coins', type: 'coin', color: '#fbbf24' },
        { label: 'Champion title', type: 'xp', color: '#fbbf24' },
      ],
      isRegistered: false,
    },
    {
      id: 'ev-inter-dept',
      title: 'Inter-Department Clash: Eng vs. Business',
      category: 'Campus-Wide',
      badgeType: 'Campus-wide',
      badgeIcon: 'shield',
      isLive: false,
      timeText: 'In 12d 23h',
      dateRange: 'Nov 22 – Nov 27 · 5 days · Faction war',
      dates: 'Nov 22 – Nov 27',
      format: '5 days · Faction war',
      studentsGoing: '954',
      subtitle: 'Campus-wide · Starts Nov 22',
      description:
        'Defend the Engineering spire against Business Strategy challengers in high-stakes cross-discipline study battles.',
      bgImage: '/Night Owl Study.png',
      goingCount: '954 going',
      accentColor: '#2dd4bf',
      rewards: [
        { label: 'Campus banner', type: 'outfit', color: '#2dd4bf' },
        { label: '+20% XP buff', type: 'xp', color: '#2dd4bf' },
        { label: 'Rare trophy', type: 'trophy', color: '#2dd4bf' },
      ],
      isRegistered: false,
    },
    {
      id: 'ev-night-owl',
      title: 'Night Owl Study Sprint',
      category: 'Study Sprints',
      badgeType: 'Study sprint',
      badgeIcon: 'moon',
      isLive: false,
      timeText: 'In 15d 10h',
      dateRange: 'Nov 28 – Nov 30 · 11 PM – 4 AM · Midnight grind',
      dates: 'Nov 29 – Nov 30',
      format: '11 PM – 4 AM · Midnight grind',
      studentsGoing: '241',
      subtitle: 'Study sprint · Starts Nov 29',
      description:
        'Review flashcards after dark to earn nocturnal scholar buffs and 1.5x coin multipliers on every session.',
      bgImage: '/Night Owl Study Sprint.png',
      goingCount: '241 going',
      accentColor: '#818cf8',
      rewards: [
        { label: 'Nocturnal Cloak', type: 'outfit', color: '#818cf8' },
        { label: '1.5x coins', type: 'coin', color: '#818cf8' },
        { label: '500 pts', type: 'xp', color: '#818cf8' },
      ],
      isRegistered: false,
    },
    {
      id: 'ev-sys-design',
      title: 'AURA Campus System Design Jam',
      category: 'Campus-Wide',
      badgeType: 'Campus-wide',
      badgeIcon: 'gear',
      isLive: false,
      timeText: 'In 18d 04h',
      dateRange: 'Dec 2 – Dec 5 · Collaborative project hackathon',
      dates: 'Dec 2 – Dec 5',
      format: 'Collaborative project hackathon',
      studentsGoing: '518',
      subtitle: 'Campus-wide · Starts Dec 2',
      description:
        'Design scalable systems architecture decks with your study squad and earn peer review upvotes and exclusive badges.',
      bgImage: '/Engineering Week BG.png',
      goingCount: '518 going',
      accentColor: '#38bdf8',
      rewards: [
        { label: 'System Architect Ring', type: 'outfit', color: '#38bdf8' },
        { label: '3,000 coins', type: 'coin', color: '#38bdf8' },
        { label: '1,200 XP', type: 'xp', color: '#38bdf8' },
      ],
      isRegistered: false,
    },
  ]);

  // Floating detail modal state
  const [selectedModalEventId, setSelectedModalEventId] = useState(null);
  const modalEvent = useMemo(
    () => eventsList.find((e) => e.id === selectedModalEventId),
    [eventsList, selectedModalEventId]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedModalEventId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleReminder = (eventId, e) => {
    if (e) e.stopPropagation();
    const ev = eventsList.find((item) => item.id === eventId);
    triggerToast(`🔔 Reminder notification set for "${ev ? ev.title : 'Event'}"!`);
  };

  const toggleEventRegistration = (eventId, e) => {
    if (e) e.stopPropagation();
    setEventsList((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextState = !ev.isRegistered;
          triggerToast(
            nextState
              ? `✓ Registered for "${ev.title}"! Notifications enabled.`
              : `Unregistered from "${ev.title}".`
          );
          return { ...ev, isRegistered: nextState };
        }
        return ev;
      })
    );
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsList.filter((ev) => {
      if (showOnlyRegistered && !ev.isRegistered) return false;
      if (selectedCategory === 'department' && ev.category !== 'Department') return false;
      if (selectedCategory === 'boss-raids' && ev.category !== 'Boss Raids') return false;
      if (selectedCategory === 'tournament' && ev.category !== 'Tournament' && ev.badgeType !== 'Tournament') return false;
      if (selectedCategory === 'campus-wide' && ev.category !== 'Campus-Wide') return false;
      if (selectedCategory === 'study-sprints' && ev.category !== 'Study Sprints') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesDesc = ev.description.toLowerCase().includes(q);
        const matchesCat = ev.category.toLowerCase().includes(q);
        const matchesRewards = ev.rewards.some((r) => r.label.toLowerCase().includes(q));
        return matchesTitle || matchesDesc || matchesCat || matchesRewards;
      }
      return true;
    });
  }, [eventsList, selectedCategory, showOnlyRegistered, searchQuery]);

  // Counts for Category Pills
  const counts = useMemo(() => {
    return {
      all: eventsList.length,
      department: eventsList.filter((e) => e.category === 'Department').length,
      bossRaids: eventsList.filter((e) => e.category === 'Boss Raids').length,
      tournament: eventsList.filter((e) => e.category === 'Tournament' || e.badgeType === 'Tournament').length,
      campusWide: eventsList.filter((e) => e.category === 'Campus-Wide').length,
      studySprints: eventsList.filter((e) => e.category === 'Study Sprints').length,
      registered: eventsList.filter((e) => e.isRegistered).length,
    };
  }, [eventsList]);

  const handleNavClick = (tab) => {
    if (tab === 'HOME') {
      if (onNavigateHome) onNavigateHome();
      else if (onTabChange) onTabChange('HOME');
    } else if (onTabChange) {
      onTabChange(tab);
    }
  };

  const padZero = (n) => String(n).padStart(2, '0');

  return (
    <div className="aura-events-page-root">
      {/* Dynamic Cyber Speedlines & Ambient Glow */}
      <div className="events-ambient-bg" aria-hidden="true" />

      {/* TOP NAVBAR */}
      <header className="aura-navbar events-top-navbar">
        <div className="navbar-left">
          <img
            src={auraLogo}
            alt="AURA"
            className="navbar-brand-logo"
            onClick={() => handleNavClick('HOME')}
          />
          <span className="navbar-separator">·</span>
          <nav className="navbar-nav-links" aria-label="Main Navigation">
            {navTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`nav-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleNavClick(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="navbar-right">
          <div className="coins-badge">
            <span className="coin-icon">🪙</span>
            <span className="coin-val">2,450</span>
          </div>

          <button
            type="button"
            className="icon-btn-round desktop-only-element"
            aria-label="Notifications"
          >
            🔔
          </button>

          <div
            className="user-profile-chip desktop-only-element"
            onClick={() => handleNavClick('PROFILE')}
            style={{ cursor: 'pointer' }}
            title="View Profile"
          >
            <div className="user-avatar-circle">
              <BigCircleAvatar
                equipment={savedEquipment}
                size={32}
                level={12}
                showFrame={false}
              />
            </div>
            <div className="user-info-text">
              <span className="user-info-name">CARL_MONDIGO</span>
              <span className="user-info-dept">Lv. 12 · Engineering</span>
            </div>
            <span className="user-chevron">▾</span>
          </div>
        </div>
      </header>

      {/* MAIN FULL-WIDTH CONTAINER OCCUPYING LEFT & RIGHT CORNERS */}
      <main className="events-main-container">
        {/* MOBILE PAGE HEADER (media_1794205572754_ccc21c1c.png) */}
        <div className="mobile-only-section mobile-page-header">
          <h1 className="mobile-page-title">
            Campus <span className="mobile-page-title-accent">Events</span> & Raids
          </h1>
          <p className="mobile-page-subtitle">
            Compete in department challenges, boss raids, and study sprints to earn exclusive outfits & buffs.
          </p>
        </div>

        {/* PAGE HEADER ROW (Desktop Only) */}
        <section className="events-page-header-row desktop-only-section">
          <div className="eph-left">
            <div className="eph-eyebrow">
              <span className="red-slash">/</span> CAMPUS ARENA & SEASONAL ACTIVITIES
            </div>
            <h1 className="eph-title">
              Campus <span className="eph-title-accent">Events</span> & Raids
            </h1>
            <p className="eph-subtitle">
              Compete in department challenges, boss raids, and study sprints to earn exclusive outfits & buffs.
            </p>
          </div>

          <div className="eph-right">
            <div className="buff-active-banner">
              <div className="buff-icon-box">
                <span className="buff-bolt-symbol">⚡</span>
              </div>
              <div className="buff-text-content">
                <div className="buff-top-line">
                  <span className="buff-label">ENGINEERING BUFF ACTIVE</span>
                  <span className="buff-xp-tag">2x XP</span>
                </div>
                <div className="buff-desc">
                  All Engineering & SQL flashcards grant double XP this week
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HERO FEATURED EVENT CARD: ENGINEERING WEEK (Desktop Only) */}
        <section className="featured-hero-event-card desktop-only-section">
          {/* Subtle giant watermark typography in the background */}
          <div className="hero-giant-watermark" aria-hidden="true">
            ENGINEERING
          </div>

          {/* Top Info Row without shape card background */}
          <div className="hero-top-badges">
            <span className="badge-live-event">
              <span className="live-pulsing-dot" /> LIVE EVENT
            </span>
            <span className="hero-badge-sep">·</span>
            <span className="badge-category-chip">DEPARTMENT</span>
            <span className="hero-badge-sep">·</span>
            <span className="badge-countdown-pill">
              <span className="clock-glyph">⏱</span>
              <span className="countdown-digits">
                {padZero(timeLeft.days)}d : {padZero(timeLeft.hours)}h :{' '}
                {padZero(timeLeft.minutes)}m : {padZero(timeLeft.seconds)}s
              </span>
            </span>
          </div>

          <div className="ev-hero-grid-split">
            {/* Left Hero Details */}
            <div className="ev-hero-left-col">
              <div className="hero-event-heading-row">
                <div className="hero-icon-avatar-box">
                  {/* Detailed Cyber-Engineer Avatar Bust matching Image 2 */}
                  <svg
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="hero-avatar-svg"
                  >
                    {/* Character Head */}
                    <circle cx="32" cy="22" r="10" fill="#fbcfe8" />
                    {/* White/Silver Cyber Hair */}
                    <path
                      d="M22 22C22 15 26 12 32 12C38 12 42 15 42 22C42 18 39 15 32 15C25 15 22 18 22 22Z"
                      fill="#ffffff"
                    />
                    <path
                      d="M24 18C24 14 28 11 32 11C36 11 40 14 40 18C37 14 34 13 32 13C30 13 27 14 24 18Z"
                      fill="#e2e8f0"
                    />
                    {/* Glowing Cyan Visor */}
                    <rect x="25" y="19" width="14" height="4" rx="2" fill="#22d3ee" />
                    {/* White Shirt Collar */}
                    <path d="M26 32L32 40L38 32V44H26V32Z" fill="#ffffff" />
                    {/* Red Jacket Shoulders */}
                    <path
                      d="M14 54C14 43 22 36 28 34L32 41L36 34C42 36 50 43 50 54H14Z"
                      fill="#ff2a44"
                    />
                    {/* Red Lapels */}
                    <path d="M26 34L32 44L28 54H20L26 34Z" fill="#b91c1c" />
                    <path d="M38 34L32 44L36 54H44L38 34Z" fill="#b91c1c" />
                    {/* Yellow Lanyard ID Badge */}
                    <line x1="32" y1="41" x2="32" y2="48" stroke="#fbbf24" strokeWidth="1.5" />
                    <rect x="30" y="48" width="4" height="5" rx="1" fill="#fbbf24" />
                  </svg>
                </div>
                <div className="hero-heading-meta">
                  <h2 className="hero-event-title">Engineering Week</h2>
                  <div className="hero-dates-row">
                    <span className="dates-text">Sep 30 – Oct 7</span>
                    <span className="meta-bullet">·</span>
                    <span className="meta-dept">All week · Engineering Department</span>
                  </div>
                </div>
              </div>

              <p className="hero-event-description">
                Join department challenges and study battles to earn limited-time rewards. Every study session in your Engineering folders boosts our department leaderboard standing!
              </p>

              {/* Rewards Chips */}
              <div className="hero-rewards-container">
                <span className="rewards-lead-tag">REWARDS</span>
                <span className="ev-reward-chip chip-outfit">
                  <svg className="chip-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.5a2 2 0 001.34 1.57L6 11.4V20a2 2 0 002 2h8a2 2 0 002-2v-8.6l1.8-0.64a2 2 0 001.34-1.57l.58-3.5a2 2 0 00-1.34-2.23z" />
                  </svg>
                  <span>Exclusive outfit</span>
                </span>
                <span className="ev-reward-chip chip-xp">
                  <span className="chip-icon">⚡</span>
                  <span>2x XP</span>
                </span>
                <span className="ev-reward-chip chip-coin">
                  <svg className="chip-svg-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="12" r="6" />
                    <circle cx="15" cy="12" r="6" />
                  </svg>
                  <span>Bonus coins</span>
                </span>
                <span className="hero-participants-count">
                  +428 Engineers participating
                </span>
              </div>

              {/* Action Buttons */}
              <div className="hero-actions-row">
                <button
                  type="button"
                  className="btn-hero-primary"
                  onClick={() =>
                    triggerToast('⚔️ Entering Department Study Battle matchmaking...')
                  }
                >
                  <span className="btn-sword-icon">⚔</span>
                  <span>Join Dept Study Battle (+100 Pts)</span>
                  <span className="btn-arrow-right">→</span>
                </button>

                <button
                  type="button"
                  className="btn-hero-secondary"
                  onClick={() => {
                    const previewCard = document.getElementById('outfit-preview-card');
                    if (previewCard) {
                      previewCard.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.5a2 2 0 001.34 1.57L6 11.4V20a2 2 0 002 2h8a2 2 0 002-2v-8.6l1.8-0.64a2 2 0 001.34-1.57l.58-3.5a2 2 0 00-1.34-2.23z" />
                  </svg>
                  <span>Preview Exclusive Outfit & Pass</span>
                </button>
              </div>
            </div>

            {/* Right Hero: Personal Event Pass Milestone Track */}
            <div className="ev-hero-right-col">
              <div className="personal-event-pass-card">
                <div className="pass-header-row">
                  <div className="pass-header-left">
                    <span className="pass-eyebrow">PERSONAL EVENT PASS</span>
                    <div className="pass-track-title">
                      Engineering Week Milestone Track
                    </div>
                  </div>
                  <span className="pass-points-value">
                    <strong className="m-points-num">1,450</strong>{' '}
                    <span className="m-points-total">/ 2000 Pts</span>
                  </span>
                </div>

                {/* Gradient Progress Bar */}
                <div className="pass-progress-track">
                  <div
                    className="pass-progress-fill"
                    style={{ width: '72.5%' }}
                  />
                </div>

                {/* 4 Milestones matching exact reference layout */}
                <div className="pass-milestones-grid">
                  {/* Tier 1 - 500 Pts (Unlocked) */}
                  <div className="milestone-box is-unlocked">
                    <div className="milestone-pts-row">
                      <span className="m-pts">500 PTS</span>
                      <svg
                        className="milestone-status-svg is-done"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#2dd4bf"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="9.5" strokeWidth="1.8" />
                        <polyline points="8.5 12.2 11 14.8 15.8 9.5" />
                      </svg>
                    </div>

                    <div className="milestone-icon-tile">
                      <svg
                        viewBox="0 0 24 24"
                        width="22"
                        height="22"
                        fill="none"
                        stroke="#2dd4bf"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="9" cy="10" r="5" />
                        <path d="M9 8.5v3" />
                        <circle cx="15" cy="14" r="5" />
                        <path d="M15 12.5v3" />
                      </svg>
                    </div>

                    <div className="milestone-reward-name">
                      500 Bonus Coins
                    </div>
                  </div>

                  {/* Tier 2 - 1000 Pts (Unlocked) */}
                  <div className="milestone-box is-unlocked">
                    <div className="milestone-pts-row">
                      <span className="m-pts">1000 PTS</span>
                      <svg
                        className="milestone-status-svg is-done"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#2dd4bf"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="9.5" strokeWidth="1.8" />
                        <polyline points="8.5 12.2 11 14.8 15.8 9.5" />
                      </svg>
                    </div>

                    <div className="milestone-icon-tile">
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>

                    <div className="milestone-reward-name">
                      2x XP Booster<br />(24h)
                    </div>
                  </div>

                  {/* Tier 3 - 1500 Pts (Locked) */}
                  <div className="milestone-box is-locked">
                    <div className="milestone-pts-row">
                      <span className="m-pts is-muted">1500 PTS</span>
                      <svg
                        className="milestone-status-svg is-locked"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </div>

                    <div className="milestone-icon-tile">
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="#f87171"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="5" />
                        <path d="M9.5 12.5L8 21l4-2.5 4 2.5-1.5-8.5" />
                      </svg>
                    </div>

                    <div className="milestone-reward-name">
                      Eng. Crest Frame
                    </div>
                  </div>

                  {/* Tier 4 - 2000 Pts (Locked) */}
                  <div className="milestone-box is-locked">
                    <div className="milestone-pts-row">
                      <span className="m-pts is-muted">2000 PTS</span>
                      <svg
                        className="milestone-status-svg is-locked"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="#64748b"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                      </svg>
                    </div>

                    <div className="milestone-icon-tile">
                      <svg
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="#c084fc"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="8" r="5" />
                        <path d="M9.5 12.5L8 21l4-2.5 4 2.5-1.5-8.5" />
                      </svg>
                    </div>

                    <div className="milestone-reward-name">
                      Cyber-Vanguard<br />Avatar
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MOBILE HERO EVENT CARD (media_1794204198475_20f95eec.png) */}
        <section className="mobile-only-section mobile-hero-card">
          <div
            className="mobile-hero-banner"
            style={{ backgroundImage: 'url("/Engineering Week BG.png")' }}
          >
            <div className="mobile-hero-banner-overlay" />
            <div className="mobile-hero-badges-row">
              <div className="mobile-hero-dept-badge">
                <span className="mobile-badge-icon">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#ff4d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                  </svg>
                </span>
                <span>Department</span>
              </div>
              <div className="mobile-hero-timer-badge">
                <span className="mobile-timer-dot">●</span>
                <span>Ends in {timeLeft.days}d {timeLeft.hours}h</span>
              </div>
            </div>
          </div>

          <div className="mobile-hero-body">
            <h2 className="mobile-hero-title">Engineering Week</h2>
            <div className="mobile-hero-subtitle">
              Nov 6 – Nov 14 · 428 engineers joined
            </div>

            <div className="mobile-hero-points-row">
              <div className="mobile-hero-pts">
                <strong className="mobile-pts-big">1,450</strong>
                <span className="mobile-pts-slash">/ 2,000 pts</span>
              </div>
              <button
                type="button"
                className="mobile-hero-view-rewards"
                onClick={() => {
                  setMobileSidebarTab('rewards');
                  const el = document.getElementById('mobile-bottom-tabs');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View rewards
              </button>
            </div>

            {/* Multi-node progress track matching Image 1 */}
            <div className="mobile-hero-track-wrap">
              <div className="mobile-hero-track-bar">
                {/* Segment 1: Red/coral to node 1 (33.33%) */}
                <div className="mobile-track-seg-coral" style={{ width: '33.33%' }} />
                {/* Segment 2: Orange/yellow to node 2 (33.33% to 66.66%) */}
                <div className="mobile-track-seg-yellow" style={{ left: '33.33%', width: '33.33%' }} />
                {/* Current progress fill from node 2 toward node 3 (1450/2000 is 72.5%) */}
                <div className="mobile-track-seg-progress" style={{ left: '66.66%', width: '6.5%' }} />
                {/* Node 1 (500 pts) - reached */}
                <div className="mobile-track-node node-1 reached" style={{ left: '33.33%' }} />
                {/* Node 2 (1000 pts) - reached */}
                <div className="mobile-track-node node-2 reached" style={{ left: '66.66%' }} />
                {/* Node 3 (2000 pts) - locked */}
                <div className="mobile-track-node node-3 locked" style={{ left: '100%' }} />
              </div>
            </div>

            <div className="mobile-hero-hint-box">
              <strong>50 pts</strong> to unlock Eng. Crest frame.
            </div>

            <button
              type="button"
              className="btn-mobile-hero-battle"
              onClick={() => triggerToast('⚔️ Entering Study Battle matchmaking... (+100 pts)')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
              </svg>
              <span>Join study battle (+100 pts)</span>
            </button>
          </div>
        </section>

        {/* FILTER BAR ROW (Desktop Only) */}
        <section className="events-filter-bar desktop-only-section">
          <div className="filter-pills-left">
            <button
              type="button"
              className={`filter-pill-btn ${selectedCategory === 'all' && !showOnlyRegistered ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('all');
                setShowOnlyRegistered(false);
              }}
            >
              <span>All Events</span>
              <span className="filter-count-chip">{counts.all}</span>
            </button>

            <button
              type="button"
              className={`filter-pill-btn ${selectedCategory === 'department' && !showOnlyRegistered ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('department');
                setShowOnlyRegistered(false);
              }}
            >
              <span>Department</span>
              <span className="filter-count-chip">{counts.department}</span>
            </button>

            <button
              type="button"
              className={`filter-pill-btn ${selectedCategory === 'boss-raids' && !showOnlyRegistered ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('boss-raids');
                setShowOnlyRegistered(false);
              }}
            >
              <span>Boss Raids</span>
              <span className="filter-count-chip">{counts.bossRaids}</span>
            </button>

            <button
              type="button"
              className={`filter-pill-btn ${selectedCategory === 'campus-wide' && !showOnlyRegistered ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('campus-wide');
                setShowOnlyRegistered(false);
              }}
            >
              <span>Campus-Wide</span>
              <span className="filter-count-chip">{counts.campusWide}</span>
            </button>

            <button
              type="button"
              className={`filter-pill-btn ${selectedCategory === 'study-sprints' && !showOnlyRegistered ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory('study-sprints');
                setShowOnlyRegistered(false);
              }}
            >
              <span>Study Sprints</span>
              <span className="filter-count-chip">{counts.studySprints}</span>
            </button>
          </div>

          <div className="filter-controls-right">
            <button
              type="button"
              className={`filter-registered-toggle ${showOnlyRegistered ? 'active' : ''}`}
              onClick={() => setShowOnlyRegistered((prev) => !prev)}
            >
              <span className="registered-user-icon">👤</span>
              <span>My Registered ({counts.registered})</span>
            </button>

            <div className="filter-search-box">
              <span className="search-glyph">🔍</span>
              <input
                type="text"
                placeholder="Search events, raids, rewards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* MAIN TWO-COLUMN BODY LAYOUT */}
        <div className="events-main-grid-layout">
          {/* LEFT COLUMN: QUESTS & EVENT CARDS GRID */}
          <div className="events-left-main-column">
            {/* 1. ENGINEERING WEEK • EVENT QUESTS (Desktop Only) */}
            <section className="event-quests-panel desktop-only-section">
              <div className="quests-header-row">
                <div className="quests-title-group">
                  <div>
                    <h3 className="quests-title">
                      ENGINEERING WEEK • EVENT QUESTS
                    </h3>
                    <p className="quests-subtitle">
                      Complete study tasks to earn Event Pass points and instant rewards
                    </p>
                  </div>
                </div>

                <div className="quests-reset-pill">
                  <span>Resets in 11h 42m</span>
                </div>
              </div>

              <div className="quests-cards-grid">
                {quests.map((quest) => (
                  <div key={quest.id} className="quest-item-card">
                    <div className="quest-card-top">
                      <span className="quest-badge-type">{quest.badge}</span>
                      <span className="quest-progress-fraction">
                        {quest.progressText}
                      </span>
                    </div>

                    <div className="quest-desc-text">
                      {quest.description}
                    </div>

                    <div className="quest-progress-track">
                      <div
                        className="quest-progress-fill"
                        style={{
                          width: `${quest.progressPercent}%`,
                          backgroundColor:
                            quest.progressPercent === 100 ? '#f59e0b' : '#ff4d6d',
                        }}
                      />
                    </div>

                    <div className="quest-footer-row">
                      <div className="quest-rewards-text">{quest.rewards}</div>
                      {quest.isCompleted ? (
                        quest.isClaimed ? (
                          <span className="quest-claimed-chip">Claimed ✓</span>
                        ) : (
                          <button
                            type="button"
                            className="btn-claim-quest"
                            onClick={() => handleClaimQuest(quest.id)}
                          >
                            Claim!
                          </button>
                        )
                      ) : (
                        <span className="quest-points-tag">{quest.points}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* MOBILE TODAY'S QUESTS SECTION (media_1794204214083_1f0608cb.jpg) */}
            <section className="mobile-only-section mobile-quests-section">
              <div className="mobile-quests-header">
                <h3 className="mobile-quests-title">Today's quests</h3>
                <span className="mobile-quests-reset">Resets in 9h 56m</span>
              </div>

              <div className="mobile-quests-card">
                {/* Quest 1 */}
                <div className="mobile-quest-row">
                  <div className="mobile-quest-icon-tile icon-deck">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="16" height="14" rx="2" />
                      <path d="M6 3h14a2 2 0 0 1 2 2v12" />
                    </svg>
                  </div>
                  <div className="mobile-quest-center">
                    <div className="mobile-quest-title">Complete 2 Engineering or Database flashcard decks</div>
                    <div className="mobile-quest-bar-wrap">
                      <div className="mobile-quest-bar-fill fill-yellow" style={{ width: '100%' }} />
                    </div>
                    <div className="mobile-quest-sub">+150 XP · +100 coins</div>
                  </div>
                  <div className="mobile-quest-status status-done">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Done</span>
                  </div>
                </div>

                {/* Quest 2 */}
                <div className="mobile-quest-row">
                  <div className="mobile-quest-icon-tile icon-battle">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ff4d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
                      <path d="M13 19l6-6" />
                      <path d="M16 16l4 4" />
                      <path d="M19 21l2-2" />
                    </svg>
                  </div>
                  <div className="mobile-quest-center">
                    <div className="mobile-quest-title">Win 3 study battles for Engineering</div>
                    <div className="mobile-quest-bar-wrap">
                      <div className="mobile-quest-bar-fill fill-coral" style={{ width: '66.6%' }} />
                    </div>
                    <div className="mobile-quest-sub">+250 XP · +150 coins · +350 pts</div>
                  </div>
                  <div className="mobile-quest-status status-fraction">
                    <span>2/3</span>
                  </div>
                </div>

                {/* Quest 3 */}
                <div className="mobile-quest-row">
                  <div className="mobile-quest-icon-tile icon-accuracy">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="12" cy="12" r="1" fill="#3b82f6" />
                    </svg>
                  </div>
                  <div className="mobile-quest-center">
                    <div className="mobile-quest-title">Answer 25 questions with 90%+ accuracy</div>
                    <div className="mobile-quest-bar-wrap">
                      <div className="mobile-quest-bar-fill fill-blue" style={{ width: '72%' }} />
                    </div>
                    <div className="mobile-quest-sub">+100 XP · +75 coins · +150 pts</div>
                  </div>
                  <div className="mobile-quest-status status-fraction">
                    <span>18/25</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. UPCOMING & ACTIVE EVENTS (6) */}
            <section className="upcoming-events-section">
              <div className="upcoming-section-header desktop-only-section">
                <h3 className="upcoming-section-title">
                  UPCOMING & ACTIVE EVENTS ({filteredEvents.length})
                </h3>
              </div>

              {/* Mobile Browse Events Header & Filter Pills */}
              <div className="mobile-only-section mobile-browse-header">
                <h3 className="mobile-browse-title">Browse events</h3>
                <span className="mobile-browse-count">{filteredEvents.length} events</span>
              </div>

              <div
                className="mobile-only-section mobile-filter-pills-row"
                role="tablist"
                aria-label="Filter events by category"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === 'all'}
                  className={`mobile-filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={(e) => {
                    setSelectedCategory('all');
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                >
                  <span className="mobile-pill-dot" />
                  <span className="mobile-pill-text">All</span>
                  <span className="mobile-pill-badge">{counts.all}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === 'department'}
                  className={`mobile-filter-pill ${selectedCategory === 'department' ? 'active' : ''}`}
                  onClick={(e) => {
                    setSelectedCategory('department');
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                >
                  <span className="mobile-pill-dot" />
                  <span className="mobile-pill-text">Department</span>
                  <span className="mobile-pill-badge">{counts.department}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === 'boss-raids'}
                  className={`mobile-filter-pill ${selectedCategory === 'boss-raids' ? 'active' : ''}`}
                  onClick={(e) => {
                    setSelectedCategory('boss-raids');
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                >
                  <span className="mobile-pill-dot" />
                  <span className="mobile-pill-text">Boss Raid</span>
                  <span className="mobile-pill-badge">{counts.bossRaids}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === 'tournament'}
                  className={`mobile-filter-pill ${selectedCategory === 'tournament' ? 'active' : ''}`}
                  onClick={(e) => {
                    setSelectedCategory('tournament');
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                >
                  <span className="mobile-pill-dot" />
                  <span className="mobile-pill-text">Tournament</span>
                  <span className="mobile-pill-badge">{counts.tournament || 1}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === 'campus-wide'}
                  className={`mobile-filter-pill ${selectedCategory === 'campus-wide' ? 'active' : ''}`}
                  onClick={(e) => {
                    setSelectedCategory('campus-wide');
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                >
                  <span className="mobile-pill-dot" />
                  <span className="mobile-pill-text">Campus-wide</span>
                  <span className="mobile-pill-badge">{counts.campusWide}</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === 'study-sprints'}
                  className={`mobile-filter-pill ${selectedCategory === 'study-sprints' ? 'active' : ''}`}
                  onClick={(e) => {
                    setSelectedCategory('study-sprints');
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                  }}
                >
                  <span className="mobile-pill-dot" />
                  <span className="mobile-pill-text">Study sprint</span>
                  <span className="mobile-pill-badge">{counts.studySprints}</span>
                </button>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="events-empty-state">
                  <div className="empty-glyph">🔍</div>
                  <div className="empty-title">No events match your filter</div>
                  <p className="empty-sub">
                    Try adjusting your search query or selecting "All Events".
                  </p>
                  <button
                    type="button"
                    className="btn-reset-filters"
                    onClick={() => {
                      setSelectedCategory('all');
                      setShowOnlyRegistered(false);
                      setSearchQuery('');
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="event-cards-two-col-grid">
                  {filteredEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="event-card-item"
                      onClick={() => setSelectedModalEventId(ev.id)}
                    >
                      {/* Top Banner with Background Image */}
                      <div
                        className="event-card-banner"
                        style={{
                          backgroundImage: `url("${encodeURI(ev.bgImage)}")`,
                        }}
                      >
                        <div className="event-banner-overlay" />
                        <div className="event-banner-badges-row">
                          <div className="event-cat-badge">
                            <span className="event-cat-badge-icon">
                              {renderCategoryIcon(ev.badgeIcon)}
                            </span>
                            <span className="event-cat-badge-label">
                              {ev.badgeType}
                            </span>
                          </div>

                          {ev.isLive ? (
                            <div className="event-live-pill">Live now</div>
                          ) : (
                            <div className="event-time-pill">
                              {ev.timeText || 'Upcoming'}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="event-card-body">
                        <h4 className="event-card-title">{ev.title}</h4>

                        <div className="event-card-meta-line">
                          {ev.dateRange}
                        </div>

                        <p className="event-card-desc-text">{ev.description}</p>

                        {/* Rewards Row */}
                        <div className="event-card-rewards-row">
                          {ev.rewards.map((r, i) => (
                            <div key={i} className="event-reward-inline-item">
                              <span
                                className="reward-item-icon"
                                style={{ color: r.color || '#ff4d6d' }}
                              >
                                {renderRewardIcon(r.type || r.icon)}
                              </span>
                              <span className="reward-item-label">
                                {r.label}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Footer Row */}
                        <div className="event-card-footer-row">
                          <div className="event-going-group">
                            <svg
                              className="going-users-icon"
                              viewBox="0 0 24 24"
                              width="15"
                              height="15"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            <span className="going-count-text">
                              {ev.goingCount || '300+ going'}
                            </span>
                          </div>

                          <div className="event-card-footer-actions">
                            {ev.isRegistered ? (
                              <button
                                type="button"
                                className="btn-event-registered"
                                onClick={(e) => toggleEventRegistration(ev.id, e)}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  width="14"
                                  height="14"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>Registered</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  className="btn-event-reminder-icon"
                                  onClick={(e) => toggleReminder(ev.id, e)}
                                  title="Set reminder"
                                  aria-label="Set reminder"
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    width="14"
                                    height="14"
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

                                <button
                                  type="button"
                                  className="btn-event-register"
                                  onClick={(e) => toggleEventRegistration(ev.id, e)}
                                >
                                  Register
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* MOBILE BOTTOM TABS SECTION (media_1794204252329_9c59e001.png) */}
            <section id="mobile-bottom-tabs" className="mobile-only-section mobile-bottom-tabs-section">
              {/* 3-tab segmented control */}
              <div className="mobile-tabs-pill-nav" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mobileSidebarTab === 'standings'}
                  className={`mobile-tab-btn ${mobileSidebarTab === 'standings' ? 'active' : ''}`}
                  onClick={() => setMobileSidebarTab('standings')}
                >
                  Standings
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mobileSidebarTab === 'rewards'}
                  className={`mobile-tab-btn ${mobileSidebarTab === 'rewards' ? 'active' : ''}`}
                  onClick={() => setMobileSidebarTab('rewards')}
                >
                  Rewards
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mobileSidebarTab === 'buffs'}
                  className={`mobile-tab-btn ${mobileSidebarTab === 'buffs' ? 'active' : ''}`}
                  onClick={() => setMobileSidebarTab('buffs')}
                >
                  Buffs
                </button>
              </div>

              {/* Tab 1: Standings (Department cup) */}
              {mobileSidebarTab === 'standings' && (
                <div className="mobile-standings-card">
                  <div className="mobile-cup-header">
                    <h4 className="mobile-cup-title">Department cup</h4>
                    <span className="mobile-cup-sub">XP this week</span>
                  </div>

                  <div className="mobile-cup-list">
                    {/* #1 Engineering You */}
                    <div className="mobile-cup-row">
                      <div className="mobile-cup-row-top">
                        <span className="mobile-cup-rank">
                          <strong>#1 Engineering</strong> <span className="mobile-you-badge">You</span>
                        </span>
                        <span className="mobile-cup-xp">148,920 XP</span>
                      </div>
                      <div className="mobile-cup-bar-track">
                        <div className="mobile-cup-bar-fill fill-red" style={{ width: '100%' }} />
                      </div>
                    </div>

                    {/* #2 Information Tech */}
                    <div className="mobile-cup-row">
                      <div className="mobile-cup-row-top">
                        <span className="mobile-cup-rank"><strong>#2 Information Tech</strong></span>
                        <span className="mobile-cup-xp">136,400 XP</span>
                      </div>
                      <div className="mobile-cup-bar-track">
                        <div className="mobile-cup-bar-fill fill-gold" style={{ width: '86%' }} />
                      </div>
                    </div>

                    {/* #3 Business & Mgmt */}
                    <div className="mobile-cup-row">
                      <div className="mobile-cup-row-top">
                        <span className="mobile-cup-rank"><strong>#3 Business & Mgmt</strong></span>
                        <span className="mobile-cup-xp">119,150 XP</span>
                      </div>
                      <div className="mobile-cup-bar-track">
                        <div className="mobile-cup-bar-fill fill-cyan" style={{ width: '75%' }} />
                      </div>
                    </div>

                    {/* #4 Architecture */}
                    <div className="mobile-cup-row">
                      <div className="mobile-cup-row-top">
                        <span className="mobile-cup-rank"><strong>#4 Architecture</strong></span>
                        <span className="mobile-cup-xp">94,800 XP</span>
                      </div>
                      <div className="mobile-cup-bar-track">
                        <div className="mobile-cup-bar-fill fill-purple" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="mobile-cup-footer">
                    <span className="mobile-contrib-label">Your contribution</span>
                    <span className="mobile-contrib-val"><strong>1,450 XP</strong> · top 8%</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Rewards */}
              {mobileSidebarTab === 'rewards' && (
                <div className="mobile-rewards-tab-card">
                  <div className="side-card-header">
                    <h3 className="side-card-title">Reward preview</h3>
                    <p className="side-card-subtitle">Engineering Week, tier 3</p>
                  </div>
                  <div className="reward-preview-body">
                    <div className="reward-preview-tile">
                      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#ff4d6d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.5a2 2 0 001.34 1.57L6 11.4V20a2 2 0 002 2h8a2 2 0 002-2v-8.6l1.8-0.64a2 2 0 001.34-1.57l.58-3.5a2 2 0 00-1.34-2.23z" />
                      </svg>
                    </div>
                    <div className="reward-preview-info">
                      <h4 className="reward-preview-name">Crimson Cyber-Engineer Jacket</h4>
                      <p className="reward-preview-buff">+10% department XP bonus</p>
                      <div className="reward-preview-unlock">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="5" y="11" width="14" height="10" rx="2" />
                          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                        </svg>
                        <span>Unlocks at 1,500 pts</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Buffs */}
              {mobileSidebarTab === 'buffs' && (
                <div className="mobile-buffs-tab-card">
                  <div className="side-card-header">
                    <h3 className="side-card-title">Upcoming buffs</h3>
                    <p className="side-card-subtitle">Server-wide multipliers</p>
                  </div>
                  <div className="buffs-list-container">
                    <div className="buff-list-row">
                      <div className="buff-row-main">
                        <span className="buff-starts-tag">Starts in 5h 46m</span>
                        <h4 className="buff-row-title">Double coin happy hour</h4>
                        <p className="buff-row-desc">+100% coins on all flashcard quizzes and practice sessions.</p>
                      </div>
                      <button
                        type="button"
                        className="btn-buff-reminder"
                        onClick={() => triggerToast('🔔 Reminder set for "Double coin happy hour"!')}
                        title="Set reminder"
                        aria-label="Set reminder for Double coin happy hour"
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                      </button>
                    </div>
                    <div className="buff-list-row">
                      <div className="buff-row-main">
                        <span className="buff-starts-tag">Starts in 6h 46m</span>
                        <h4 className="buff-row-title">Engineering boss hour</h4>
                        <p className="buff-row-desc">Co-op study battle with 3x points toward the department cup.</p>
                      </div>
                      <button
                        type="button"
                        className="btn-buff-reminder"
                        onClick={() => triggerToast('🔔 Reminder set for "Engineering boss hour"!')}
                        title="Set reminder"
                        aria-label="Set reminder for Engineering boss hour"
                      >
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR COLUMN: STANDINGS, OUTFIT PREVIEW, BUFF SCHEDULE (Desktop Only) */}
          <aside className="events-right-sidebar-column desktop-only-sidebar">
            {/* 1. DEPARTMENT CUP STANDINGS */}
            <div className="sidebar-card department-cup-card">
              <div className="sbc-header">
                <div className="sbc-icon-title-row">
                  <div>
                    <h3 className="sbc-title">DEPARTMENT CUP STANDINGS</h3>
                    <p className="sbc-subtitle">
                      Total study XP earned during Engineering Week
                    </p>
                  </div>
                </div>
              </div>

              <div className="standings-list">
                {/* #1 Engineering (YOU) */}
                <div className="standing-row is-user-dept">
                  <div className="standing-meta-top">
                    <span className="standing-rank-name">
                      <strong>#1</strong> Engineering <span className="you-chip">YOU</span>
                    </span>
                    <span className="standing-xp-value">148,920 XP</span>
                  </div>
                  <div className="standing-bar-track">
                    <div
                      className="standing-bar-fill fill-red"
                      style={{ width: '94%' }}
                    />
                  </div>
                </div>

                {/* #2 Information Tech */}
                <div className="standing-row">
                  <div className="standing-meta-top">
                    <span className="standing-rank-name">
                      <strong>#2</strong> Information Tech
                    </span>
                    <span className="standing-xp-value">136,400 XP</span>
                  </div>
                  <div className="standing-bar-track">
                    <div
                      className="standing-bar-fill fill-gold"
                      style={{ width: '86%' }}
                    />
                  </div>
                </div>

                {/* #3 Business & Mgmt */}
                <div className="standing-row">
                  <div className="standing-meta-top">
                    <span className="standing-rank-name">
                      <strong>#3</strong> Business & Mgmt
                    </span>
                    <span className="standing-xp-value">119,150 XP</span>
                  </div>
                  <div className="standing-bar-track">
                    <div
                      className="standing-bar-fill fill-cyan"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>

                {/* #4 Architecture */}
                <div className="standing-row">
                  <div className="standing-meta-top">
                    <span className="standing-rank-name">
                      <strong>#4</strong> Architecture
                    </span>
                    <span className="standing-xp-value">94,800 XP</span>
                  </div>
                  <div className="standing-bar-track">
                    <div
                      className="standing-bar-fill fill-purple"
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
              </div>

              <div className="sbc-footer-contribution">
                <span className="contr-label">Your Contribution:</span>
                <span className="contr-value">
                  <strong>1,450 XP</strong> (Top 8% in Eng)
                </span>
              </div>
            </div>

            {/* 2. REWARD PREVIEW (media_1794201220730_168fedf6.png) */}
            <div
              id="outfit-preview-card"
              className="sidebar-card reward-preview-card"
            >
              <div className="side-card-header">
                <h3 className="side-card-title">Reward preview</h3>
                <p className="side-card-subtitle">Engineering Week, tier 3</p>
              </div>

              <div className="reward-preview-body">
                <div className="reward-preview-tile">
                  <svg
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill="none"
                    stroke="#ff4d6d"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l.58 3.5a2 2 0 001.34 1.57L6 11.4V20a2 2 0 002 2h8a2 2 0 002-2v-8.6l1.8-0.64a2 2 0 001.34-1.57l.58-3.5a2 2 0 00-1.34-2.23z" />
                  </svg>
                </div>

                <div className="reward-preview-info">
                  <h4 className="reward-preview-name">Crimson Cyber-Engineer Jacket</h4>
                  <p className="reward-preview-buff">+10% department XP bonus</p>
                  <div className="reward-preview-unlock">
                    <svg
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="5" y="11" width="14" height="10" rx="2" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    <span>Unlocks at 1,500 pts</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. UPCOMING BUFFS (media_1794201220730_168fedf6.png) */}
            <div className="sidebar-card upcoming-buffs-card">
              <div className="side-card-header">
                <h3 className="side-card-title">Upcoming buffs</h3>
                <p className="side-card-subtitle">Server-wide multipliers</p>
              </div>

              <div className="buffs-list-container">
                {/* Buff 1 */}
                <div className="buff-list-row">
                  <div className="buff-row-main">
                    <span className="buff-starts-tag">Starts in 5h 46m</span>
                    <h4 className="buff-row-title">Double coin happy hour</h4>
                    <p className="buff-row-desc">
                      +100% coins on all flashcard quizzes and practice sessions.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-buff-reminder"
                    onClick={() => triggerToast('🔔 Reminder set for "Double coin happy hour"!')}
                    title="Set reminder"
                    aria-label="Set reminder for Double coin happy hour"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
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
                </div>

                {/* Buff 2 */}
                <div className="buff-list-row">
                  <div className="buff-row-main">
                    <span className="buff-starts-tag">Starts in 6h 46m</span>
                    <h4 className="buff-row-title">Engineering boss hour</h4>
                    <p className="buff-row-desc">
                      Co-op study battle with 3x points toward the department cup.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-buff-reminder"
                    onClick={() => triggerToast('🔔 Reminder set for "Engineering boss hour"!')}
                    title="Set reminder"
                    aria-label="Set reminder for Engineering boss hour"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="15"
                      height="15"
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
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* TOAST NOTIFICATION POPUP */}
      {toastMessage && (
        <div className="events-toast-bubble" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}

      {/* FLOATING EVENT DETAILS MODAL (media_1794200442743_3f73e686.png) */}
      {modalEvent && (
        <div
          className="event-modal-backdrop"
          onClick={() => setSelectedModalEventId(null)}
        >
          <div
            className="event-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-event-title"
          >
            {/* Top Header */}
            <div className="ev-modal-header-row">
              <div
                className="ev-modal-icon-box"
                style={{ color: modalEvent.accentColor || '#818cf8' }}
              >
                {renderCategoryIcon(modalEvent.badgeIcon)}
              </div>
              <div className="ev-modal-header-text">
                <h3 id="modal-event-title" className="ev-modal-title">
                  {modalEvent.title}
                </h3>
                <p className="ev-modal-subtitle">
                  {modalEvent.subtitle || `${modalEvent.badgeType} · ${modalEvent.dates || modalEvent.dateRange}`}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="ev-modal-description">{modalEvent.description}</p>

            {/* Rewards Row */}
            <div className="ev-modal-rewards-row">
              {modalEvent.rewards.map((r, i) => (
                <div key={i} className="ev-modal-reward-item">
                  <span
                    className="ev-modal-reward-icon"
                    style={{ color: r.color || modalEvent.accentColor || '#818cf8' }}
                  >
                    {renderRewardIcon(r.type || r.icon)}
                  </span>
                  <span className="ev-modal-reward-label">{r.label}</span>
                </div>
              ))}
            </div>

            {/* Key-Value Info List */}
            <div className="ev-modal-info-list">
              <div className="ev-modal-info-row">
                <span className="ev-modal-info-label">Dates</span>
                <span className="ev-modal-info-value">{modalEvent.dates || modalEvent.dateRange}</span>
              </div>

              <div className="ev-modal-info-row">
                <span className="ev-modal-info-label">Format</span>
                <span className="ev-modal-info-value">{modalEvent.format || modalEvent.location}</span>
              </div>

              <div className="ev-modal-info-row">
                <span className="ev-modal-info-label">Students going</span>
                <span className="ev-modal-info-value">
                  {modalEvent.studentsGoing || modalEvent.goingCount?.replace(' going', '')}
                </span>
              </div>
            </div>

            {/* Actions Row without any dark box background */}
            <div className="ev-modal-actions-row">
              <button
                type="button"
                className="ev-btn-modal-close"
                onClick={() => setSelectedModalEventId(null)}
              >
                Close
              </button>

              {modalEvent.isRegistered ? (
                <button
                  type="button"
                  className="ev-btn-modal-registered"
                  onClick={(e) => toggleEventRegistration(modalEvent.id, e)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Registered</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="ev-btn-modal-register"
                  onClick={(e) => toggleEventRegistration(modalEvent.id, e)}
                >
                  Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING BUFF ICON & FLOATING NOTIFICATION (Bottom Part for Mobile) */}
      <div className="mobile-only-section mobile-floating-buff-wrapper">
        {/* Initial floating buff card in the bottom part (disappears after a few seconds) */}
        {initialFloatingToastVisible && (
          <div
            className={`mobile-floating-buff-toast ${initialToastClosing ? 'toast-closing' : ''}`}
            role="status"
            aria-live="polite"
          >
            <div className="mobile-buff-icon-tile">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#fbbf24" />
              </svg>
            </div>
            <div className="mobile-buff-text-group">
              <div className="mobile-buff-title">2x XP active for Engineering</div>
              <div className="mobile-buff-sub">Engineering and SQL flashcards give double XP this week.</div>
            </div>
            <button
              type="button"
              className="mobile-buff-close-btn"
              onClick={handleDismissInitialToast}
              aria-label="Dismiss buff notification"
              title="Dismiss"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Floating Buff Popover Card (opened by tapping the corner floating icon) */}
        {showFloatingBuffCard && (
          <div className="mobile-floating-buff-card" role="dialog" aria-label="Active Buff Information">
            <div className="mobile-buff-icon-tile">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#fbbf24" />
              </svg>
            </div>
            <div className="mobile-buff-text-group">
              <div className="mobile-buff-title">2x XP active for Engineering</div>
              <div className="mobile-buff-sub">Engineering and SQL flashcards give double XP this week.</div>
            </div>
            <button
              type="button"
              className="mobile-buff-close-btn"
              onClick={() => setShowFloatingBuffCard(false)}
              aria-label="Close buff card"
              title="Close"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Floating Icon in bottom-right corner (appears after the initial toast disappears) */}
        {!initialFloatingToastVisible && (
          <button
            type="button"
            className={`mobile-floating-buff-fab ${showFloatingBuffCard ? 'active' : ''}`}
            onClick={() => setShowFloatingBuffCard((prev) => !prev)}
            title="Active Buff: 2x XP"
            aria-label="Toggle active buff info"
          >
            <span className="buff-fab-bolt">⚡</span>
            <span className="buff-fab-tag">2x XP</span>
          </button>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <div className="mobile-bottom-nav-inner">
          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'HOME' ? 'active' : ''}`}
            onClick={() => handleNavClick('HOME')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="mobile-nav-label">Home</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'MY FOLDERS' ? 'active' : ''}`}
            onClick={() => handleNavClick('MY FOLDERS')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="mobile-nav-label">My Study</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'BATTLES' ? 'active' : ''}`}
            onClick={() => handleNavClick('BATTLES')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            onClick={() => handleNavClick('FRIENDS')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
            onClick={() => handleNavClick('EVENTS')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
