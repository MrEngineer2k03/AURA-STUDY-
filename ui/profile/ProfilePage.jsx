import React, { useState } from 'react';
import './ProfilePage.css';
import auraLogo from '../dashboard/logoname.png';
import CharacterCustomizer, {
  CharacterRenderer,
  BigCircleAvatar,
  useSavedEquipment,
  getEquipmentItemById,
  getFrameConfig,
  BetaCharacterCustomizer,
} from '../character';

export default function ProfilePage({
  onNavigateHome,
  onTabChange,
  userName = 'Carl Patrick Mondigo',
  initialSubTab = 'overview',
  showNavbar = true,
}) {
  const [activeSubTab, setActiveSubTab] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const h = window.location.hash.toLowerCase();
      if (h === '#customize' || h === '#character' || h === '#rewards') {
        return 'rewards';
      }
      if (h === '#beta') {
        return 'beta';
      }
    }
    return initialSubTab;
  }); // 'overview' | 'rewards' | 'beta' | 'settings'
  const [previewEmptyFolders, setPreviewEmptyFolders] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showAllAchievementsModal, setShowAllAchievementsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCoverPopover, setShowCoverPopover] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [coverTheme, setCoverTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_profile_cover_v1');
      if (saved === 'campus' || saved === 'circuit' || saved === 'aurora') {
        return saved;
      }
    } catch {
      // ignore storage errors
    }
    return 'campus';
  });

  const handleSelectCoverTheme = (themeId) => {
    setCoverTheme(themeId);
    try {
      localStorage.setItem('aura_profile_cover_v1', themeId);
    } catch {
      // ignore storage errors
    }
  };

  const handleResetCoverTheme = () => {
    handleSelectCoverTheme('campus');
    setShowCoverPopover(false);
  };

  const handleShareProfile = () => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // ignore clipboard errors
    }
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2200);
  };

  // Live synced equipment from character.tsx
  const savedEquipment = useSavedEquipment();
  const equippedTopItem = getEquipmentItemById(savedEquipment.upperOutfit);
  const equippedFrameItem = getEquipmentItemById(savedEquipment.frame);

  // Customization & Dynamic Profile Data State
  const [currentTitle, setCurrentTitle] = useState('Senior Tactician');
  const currentOutfit = equippedTopItem ? equippedTopItem.name : 'Crimson Engineering Jacket';
  const frameConfig = getFrameConfig(savedEquipment?.frame);
  const frameRingGradient = frameConfig.gradient;

  const defaultProfileData = {
    fullName: userName || 'Carl Patrick Mondigo',
    handle: '@carl_mondigo',
    location: 'Cebu, Philippines',
    university: 'Cebu Technological University',
    campus: 'Danao Campus',
    college: 'College of Engineering',
    degree: 'BS Computer Engineering',
    yearLevel: '4th Year – Senior',
    academicStatus: 'Currently Studying',
    memberSince: 'Sep 2025',
    bio: 'Computer Engineering senior passionate about database architecture and collaborative study sessions.',
    interests: 'Database Systems, SQL Optimization, Co-op Study Battles',
  };

  const [profileData, setProfileData] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_user_profile_data_v1');
      if (saved) {
        return { ...defaultProfileData, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return defaultProfileData;
  });

  const [settingsForm, setSettingsForm] = useState(profileData);

  const handleOpenSettingsModal = () => {
    setSettingsForm(profileData);
    setShowSettingsModal(true);
  };

  const handleSaveSettings = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const updated = {
      ...profileData,
      ...settingsForm,
      fullName: (settingsForm.fullName || '').trim() || defaultProfileData.fullName,
      handle: (settingsForm.handle || '').trim() || defaultProfileData.handle,
    };
    setProfileData(updated);
    try {
      localStorage.setItem('aura_user_profile_data_v1', JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
    setShowSettingsModal(false);
  };

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
      {showNavbar && (
        <header className="aura-navbar events-top-navbar">
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
              <span className="coin-icon">🪙</span>
              <span className="coin-val">2,450</span>
            </div>

            <button
              type="button"
              className="icon-btn-round desktop-only-element"
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

            <div className="user-profile-chip desktop-only-element active">
              <div className="user-avatar-circle" style={{ background: frameRingGradient, boxShadow: `0 0 10px ${frameConfig.color}66` }}>
                <div className="user-avatar-inner">
                  <CharacterRenderer
                    equipment={savedEquipment}
                    cropMode="circle"
                    showFrame={true}
                    level={12}
                    className="user-avatar-bust"
                  />
                </div>
              </div>
              <div className="user-info-text">
                <span className="user-info-name">Carl Patrick Mondigo</span>
                <span className="user-info-dept">Lv. 12 · Engineering</span>
              </div>
              <span className="user-chevron">▾</span>
            </div>

            <button
              type="button"
              className="user-profile-mobile-btn mobile-only-element active"
              onClick={() => handleTabClick('PROFILE')}
              aria-label="View Profile"
              title="View Profile"
            >
              <div className="user-avatar-circle" style={{ background: frameRingGradient, boxShadow: `0 0 10px ${frameConfig.color}66` }}>
                <div className="user-avatar-inner">
                  <CharacterRenderer
                    equipment={savedEquipment}
                    cropMode="circle"
                    showFrame={true}
                    level={12}
                    className="user-avatar-bust"
                  />
                </div>
              </div>
            </button>
          </div>
        </header>
      )}

      {/* TOP COVER BACKGROUND BANNER */}
      <div className={`profile-cover-banner cover-theme-${coverTheme}`}>
        <svg
          className="profile-cover-skyline-svg"
          viewBox="0 0 1600 260"
          preserveAspectRatio="xMidYMax slice"
           aria-hidden="true"
        >
          <defs>
            <linearGradient id="coverMoonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop
                offset="0%"
                stopColor={
                  coverTheme === 'circuit'
                    ? '#22d3ee'
                    : coverTheme === 'aurora'
                    ? '#a855f7'
                    : '#f43f5e'
                }
                stopOpacity="0.42"
              />
              <stop
                offset="100%"
                stopColor={
                  coverTheme === 'circuit'
                    ? '#083344'
                    : coverTheme === 'aurora'
                    ? '#3b0764'
                    : '#881337'
                }
                stopOpacity="0.1"
              />
            </linearGradient>
            <pattern id="coverWinPattern" x="0" y="0" width="16" height="18" patternUnits="userSpaceOnUse">
              <rect x="4" y="4" width="5" height="8" rx="0.5" fill="rgba(251, 191, 36, 0.38)" />
            </pattern>
          </defs>

          {/* Twinkling Stars */}
          <g fill="#ffffff" opacity="0.65">
            <circle cx="120" cy="42" r="1.5" />
            <circle cx="260" cy="28" r="1" />
            <circle cx="410" cy="54" r="1.5" />
            <circle cx="580" cy="24" r="1.2" />
            <circle cx="760" cy="48" r="1.6" />
            <circle cx="920" cy="30" r="1.2" />
            <circle cx="1050" cy="60" r="1.4" />
            <circle cx="1290" cy="34" r="1.5" />
            <circle cx="1460" cy="50" r="1.2" />
          </g>

          {/* Glowing Horizon Disk */}
          <circle cx="1195" cy="185" r="120" fill="url(#coverMoonGrad)" />

          {/* Back Skyline Silhouette */}
          <g fill="#0b0e18" opacity="0.7">
            <rect x="0" y="165" width="95" height="95" />
            <rect x="85" y="135" width="80" height="125" />
            <rect x="290" y="120" width="90" height="140" />
            <rect x="490" y="130" width="105" height="130" />
            <rect x="700" y="140" width="95" height="120" />
            <rect x="910" y="110" width="88" height="150" />
            <rect x="1220" y="125" width="110" height="135" />
            <rect x="1450" y="140" width="150" height="120" />
          </g>

          {/* Front Campus / City Skyline Silhouette with Lit Windows */}
          <g fill="#080b12">
            <rect x="25" y="150" width="70" height="110" />
            <rect x="130" y="180" width="75" height="80" />
            <rect x="210" y="112" width="74" height="148" />
            <rect x="315" y="148" width="92" height="112" />
            <rect x="425" y="172" width="68" height="88" />
            <rect x="590" y="82" width="88" height="178" />
            <rect x="690" y="168" width="65" height="92" />
            <rect x="795" y="118" width="90" height="142" />
            <rect x="965" y="146" width="82" height="114" />
            {/* Clock Tower Spire */}
            <polygon points="1082,52 1106,4 1130,52" />
            <rect x="1074" y="52" width="64" height="208" />
            <rect x="1152" y="158" width="76" height="102" />
            <rect x="1250" y="122" width="78" height="138" />
            <rect x="1340" y="106" width="68" height="154" />
            <rect x="1425" y="162" width="88" height="98" />
            <rect x="1520" y="132" width="80" height="128" />
          </g>

          {/* Lit Building Windows Overlay */}
          <g fill="url(#coverWinPattern)" opacity="0.85">
            <rect x="33" y="160" width="54" height="92" />
            <rect x="218" y="122" width="58" height="130" />
            <rect x="325" y="158" width="72" height="96" />
            <rect x="600" y="92" width="68" height="160" />
            <rect x="805" y="128" width="70" height="124" />
            <rect x="975" y="156" width="62" height="98" />
            <rect x="1082" y="62" width="48" height="190" />
            <rect x="1260" y="132" width="58" height="120" />
            <rect x="1348" y="118" width="52" height="134" />
            <rect x="1528" y="142" width="64" height="110" />
          </g>
        </svg>

        <div className="profile-cover-controls-wrap">
          {showCoverPopover && (
            <div
              className="profile-cover-popover"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Choose profile cover"
            >
              <div className="cover-popover-title">Cover</div>
              <div className="cover-popover-options-grid">
                <button
                  type="button"
                  className={`cover-option-tile tile-campus ${
                    coverTheme === 'campus' ? 'active' : ''
                  }`}
                  onClick={() => handleSelectCoverTheme('campus')}
                >
                  <span className="cover-option-label">Campus</span>
                </button>
                <button
                  type="button"
                  className={`cover-option-tile tile-circuit ${
                    coverTheme === 'circuit' ? 'active' : ''
                  }`}
                  onClick={() => handleSelectCoverTheme('circuit')}
                >
                  <span className="cover-option-label">Circuit</span>
                </button>
                <button
                  type="button"
                  className={`cover-option-tile tile-aurora ${
                    coverTheme === 'aurora' ? 'active' : ''
                  }`}
                  onClick={() => handleSelectCoverTheme('aurora')}
                >
                  <span className="cover-option-label">Aurora</span>
                </button>
              </div>
              <div className="cover-popover-actions">
                <button
                  type="button"
                  className="cover-popover-reset-btn"
                  onClick={handleResetCoverTheme}
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn-change-cover"
            onClick={() => setShowCoverPopover((prev) => !prev)}
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Change cover</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="profile-main-container profile-main-with-cover">
        {/* TOP UNIFIED PROFILE DASHBOARD CARD OVERLAPPING COVER */}
        <section className="profile-identity-card profile-identity-banner-card">
          {/* Top Section: Avatar, Identity Info, XP Progression & Upper-Right Actions */}
          <div className="profile-banner-top-row">
            {/* Left: Avatar + Identity Meta */}
            <div className="profile-banner-left-group">
              {/* Circular Avatar Bust with Glow Ring */}
              <div
                className="avatar-bust-container banner-avatar-bust"
                onClick={() => setActiveSubTab('rewards')}
                style={{ cursor: 'pointer' }}
                title="Click to customize character"
              >
                <div
                  className="avatar-ring-outer"
                  style={{
                    background: frameRingGradient,
                    boxShadow: frameConfig.glow,
                  }}
                >
                  <div className="avatar-ring-inner">
                    <CharacterRenderer
                      equipment={savedEquipment}
                      cropMode="circle"
                      showFrame={true}
                      level={12}
                      className="avatar-img-bust"
                    />
                  </div>
                </div>
                <div className="avatar-level-badge">
                  <span
                    className="level-dot"
                    style={{
                      background: frameConfig.color,
                      boxShadow: `0 0 8px ${frameConfig.color}`,
                    }}
                  />
                  <span>Level 12</span>
                </div>
              </div>

              {/* Name, Crown Title, Handle, Personal & Academic Info & Equipped Chips */}
              <div className="profile-banner-identity-details">
                <div
                  className="avatar-crown-title banner-crown-title"
                  onClick={() => setShowCustomizeModal(true)}
                  style={{ cursor: 'pointer' }}
                  title="Click to change equipped title"
                >
                  <span>👑</span>
                  <span>{currentTitle}</span>
                </div>

                <div className="banner-name-handle-line">
                  <h2 className="user-full-name banner-user-name">{profileData.fullName}</h2>
                  <span className="banner-handle-badge">
                    {profileData.handle}
                    {profileData.college ? ` · ${profileData.college}` : ''}
                  </span>
                  {profileData.academicStatus && (
                    <span className="banner-status-dot-tag">
                      · {profileData.academicStatus}
                    </span>
                  )}
                </div>

                {/* Organized Two-Group Personal & Academic Information Grid */}
                <div className="banner-info-groups-grid">
                  {/* Group 1: Personal & Platform Information */}
                  <div className="banner-info-group">
                    <span className="banner-info-group-heading">Personal Info</span>
                    {profileData.location && (
                      <div className="banner-info-item" title="Location">
                        <svg
                          viewBox="0 0 24 24"
                          width="13"
                          height="13"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="banner-info-icon icon-rose"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{profileData.location}</span>
                      </div>
                    )}
                    <div className="banner-info-item" title="Platform Membership">
                      <svg
                        viewBox="0 0 24 24"
                        width="13"
                        height="13"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="banner-info-icon icon-amber"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Member since {profileData.memberSince || 'Sep 2025'}</span>
                    </div>
                  </div>

                  {/* Group 2: Academic Information */}
                  {(profileData.university || profileData.campus || profileData.degree || profileData.yearLevel) && (
                    <div className="banner-info-group banner-info-group-academic">
                      <span className="banner-info-group-heading">Academic Info</span>
                      {(profileData.university || profileData.campus) && (
                        <div className="banner-info-item" title="University & Campus">
                          <svg
                            viewBox="0 0 24 24"
                            width="13"
                            height="13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="banner-info-icon icon-sky"
                          >
                            <path d="M3 21h18" />
                            <path d="M5 21V7l7-4 7 4v14" />
                            <path d="M9 9h1" />
                            <path d="M14 9h1" />
                            <path d="M9 13h1" />
                            <path d="M14 13h1" />
                            <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
                          </svg>
                          <span>
                            {profileData.university}
                            {profileData.university && profileData.campus ? ' – ' : ''}
                            {profileData.campus && (
                              <strong style={{ color: '#e2e8f0', fontWeight: 600 }}>
                                {profileData.campus}
                              </strong>
                            )}
                          </span>
                        </div>
                      )}
                      {(profileData.college || profileData.degree || profileData.yearLevel) && (
                        <div className="banner-info-item" title="College, Degree Program & Year Standing">
                          <svg
                            viewBox="0 0 24 24"
                            width="13"
                            height="13"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="banner-info-icon icon-teal"
                          >
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                            <path d="M6 12v5c3 3 9 3 12 0v-5" />
                          </svg>
                          <span>
                            {profileData.college && (
                              <>
                                <span style={{ color: '#cbd5e1', fontWeight: 600 }}>
                                  {profileData.college}
                                </span>
                                {(profileData.degree || profileData.yearLevel) ? ' · ' : ''}
                              </>
                            )}
                            {profileData.degree && (
                              <strong style={{ color: '#ffffff', fontWeight: 700 }}>
                                {profileData.degree}
                              </strong>
                            )}
                            {profileData.degree && profileData.yearLevel ? ' · ' : ''}
                            {profileData.yearLevel}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Recent Achievements Icon Badges */}
                <div className="profile-banner-achievements-row">
                  <span className="banner-achievements-label">Recent Achievements</span>
                  <div className="banner-achievements-icons-list">
                    {achievements
                      .filter((ach) => ach.equipped)
                      .slice(0, 4)
                      .map((ach) => (
                        <button
                          key={ach.id}
                          type="button"
                          className={`ach-icon-tile banner-ach-icon-badge ${ach.tileClass}`}
                          onClick={() => setShowAllAchievementsModal(true)}
                          title={`${ach.name} (${ach.rarity}) — ${ach.description}`}
                          aria-label={ach.name}
                        >
                          {ach.icon}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Upper-Right Action Buttons & XP Progression Section */}
            <div className="profile-banner-right-group">
              {/* Upper-Right Customize & Share Buttons */}
              <div className="profile-banner-actions">
                <button
                  type="button"
                  className="btn-customize-avatar banner-btn-customize"
                  onClick={() => setActiveSubTab('rewards')}
                >
                  <span>✏</span>
                  <span>Customize</span>
                </button>
                <button
                  type="button"
                  className="btn-share-profile"
                  onClick={handleShareProfile}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span>{shareCopied ? 'Copied!' : 'Share'}</span>
                </button>
              </div>

              {/* XP Progression Block */}
              <div className="level-progress-block banner-level-progress">
                <div className="level-progress-row-top">
                  <span className="level-title-label">Level 12 Scholar</span>
                  <span className="level-xp-value">820 / 1,000 XP</span>
                </div>
                <div className="level-progress-track">
                  <div className="level-progress-fill" style={{ width: '82%' }} />
                </div>
                <div className="level-progress-row-bottom">
                  <span className="level-needed-text">180 XP to Level 13</span>
                  <span className="level-dept-rank">Top 4% in dept</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Integrated 4-Column Horizontal Statistics Strip */}
          <div className="profile-unified-stats-strip">
            {/* Stat 1: Study Streak */}
            <div className="unified-stat-item">
              <div className="stat-card-top-row">
                <span className="stat-card-label">Study Streak</span>
                <div className="stat-card-icon-tile icon-flame">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                </div>
              </div>
              <div className="stat-card-value">14 Days</div>
              <p className="stat-card-subtext">Current study streak</p>
              <div className="unified-stat-bar-track">
                <div className="unified-stat-bar-fill bar-amber" />
              </div>
            </div>

            {/* Stat 2: Battle Record */}
            <div className="unified-stat-item">
              <div className="stat-card-top-row">
                <span className="stat-card-label">Battle Record</span>
                <div className="stat-card-icon-tile icon-swords">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
                    <path d="M13 19l6-6" />
                    <path d="M16 16l4 4" />
                    <path d="M19 21l2-2" />
                  </svg>
                </div>
              </div>
              <div className="stat-card-value">78% Win Rate</div>
              <p className="stat-card-subtext">Study battle performance</p>
              <div className="unified-stat-bar-track">
                <div className="unified-stat-bar-fill bar-crimson" />
              </div>
            </div>

            {/* Stat 3: Lessons Mastered */}
            <div className="unified-stat-item">
              <div className="stat-card-top-row">
                <span className="stat-card-label">Lessons Mastered</span>
                <div className="stat-card-icon-tile icon-book">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
              </div>
              <div className="stat-card-value">412 Lessons</div>
              <p className="stat-card-subtext">Total lessons mastered</p>
              <div className="unified-stat-bar-track">
                <div className="unified-stat-bar-fill bar-sky" />
              </div>
            </div>

            {/* Stat 4: Total Matches */}
            <div className="unified-stat-item">
              <div className="stat-card-top-row">
                <span className="stat-card-label">Total Matches</span>
                <div className="stat-card-icon-tile icon-matches">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.45 1-1 1H8v4h8v-4h-1c-.55 0-1-.45-1-1v-2.34" />
                    <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
                  </svg>
                </div>
              </div>
              <div className="stat-card-value">128 Matches</div>
              <p className="stat-card-subtext">Total matches played</p>
              <div className="unified-stat-bar-track">
                <div className="unified-stat-bar-fill bar-teal" />
              </div>
            </div>
          </div>
        </section>

        {/* SUB-NAVIGATION TABS BAR */}
        <div className="profile-tabs-bar-row">
          <div className="profile-subnav-pills" role="tablist">
            <button
              type="button"
              className={`prof-subnav-btn ${activeSubTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('overview')}
            >
              <span className="prof-subnav-icon">📈</span>
              <span>Overview &amp; Stats</span>
            </button>
            <button
              type="button"
              className={`prof-subnav-btn ${activeSubTab === 'rewards' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('rewards')}
            >
              <span className="prof-subnav-icon">👤</span>
              <span>Avatar &amp; Frame Rewards</span>
            </button>
            <button
              type="button"
              className={`prof-subnav-btn ${activeSubTab === 'beta' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('beta')}
            >
              <span className="prof-subnav-icon">🧪</span>
              <span>Beta</span>
            </button>
            <button
              type="button"
              className={`prof-subnav-btn ${activeSubTab === 'settings' ? 'active' : ''}`}
              onClick={handleOpenSettingsModal}
            >
              <span className="prof-subnav-icon">⚙</span>
              <span>Account Settings</span>
            </button>
          </div>
        </div>

        {activeSubTab === 'rewards' ? (
          <CharacterCustomizer
            embedded={true}
            userName={profileData.fullName}
            level={12}
          />
        ) : activeSubTab === 'beta' ? (
          <BetaCharacterCustomizer
            userName={profileData.fullName}
            level={12}
          />
        ) : (
        /* TWO-COLUMN GRID LAYOUT */
        <div className="profile-main-grid-layout">
          {/* =========================================
              LEFT COLUMN: ABOUT ME & ACTIVE PERKS
             ========================================= */}
          <aside className="profile-left-sidebar-col">
            {/* 1. About Me Card */}
            <div className="profile-identity-card">
              <div className="about-me-section" style={{ marginBottom: 0 }}>
                <span className="about-me-label">About me</span>
                <p className="about-me-text">
                  {profileData.bio || 'No biography added yet.'}
                </p>
                {profileData.interests && (
                  <div className="about-me-interests-wrap">
                    <span className="about-me-interests-label">Interests</span>
                    <div className="about-me-interest-tags">
                      {profileData.interests
                        .split(',')
                        .map((tag) => tag.trim())
                        .filter(Boolean)
                        .map((tag) => (
                          <span key={tag} className="about-me-interest-pill">
                            {tag}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Active Perks Card */}
            <div className="profile-identity-card">
              <div className="academic-section-label">Active perks</div>
              <div className="profile-perks-row profile-perks-stacked">
                <div className="prof-perk-text perk-gold">
                  <span className="perk-icon">⚡</span>
                  <span>+15% IT &amp; Data Coins</span>
                </div>
                <div className="prof-perk-text perk-teal">
                  <span className="perk-icon">👥</span>
                  <span>+15% Co-op Study Bonus</span>
                </div>
              </div>
            </div>
          </aside>

          {/* =========================================
              RIGHT MAIN COLUMN: FOLDERS & ACHIEVEMENTS
             ========================================= */}
          <div className="profile-right-main-col">
            {/* 1. MY STUDY FOLDERS SECTION */}
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
        )}
      </main>

      {/* =========================================
          CUSTOMIZE TITLE MODAL
         ========================================= */}
      {showCustomizeModal && (
        <div className="prof-modal-backdrop" onClick={() => setShowCustomizeModal(false)}>
          <div className="prof-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="prof-modal-header">
              <h3 className="prof-modal-title">Customize Equipped Title</h3>
              <button
                type="button"
                className="prof-modal-close-btn"
                onClick={() => setShowCustomizeModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="prof-modal-body">
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomizeModal(false);
                    setActiveSubTab('rewards');
                  }}
                  style={{
                    flex: 1,
                    background: '#1b2334',
                    color: '#ffffff',
                    border: '1px solid #2e3b52',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-heading, Sora)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Open Full Character Customizer
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomizeModal(false)}
                  style={{
                    flex: 1,
                    background: '#ff4d6d',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontFamily: 'var(--font-heading, Sora)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Save Title
                </button>
              </div>
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
          <div
            className="prof-modal-dialog prof-settings-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="prof-modal-header">
              <h3 className="prof-modal-title">Account &amp; Profile Settings</h3>
              <button
                type="button"
                className="prof-modal-close-btn"
                onClick={() => setShowSettingsModal(false)}
              >
                ✕
              </button>
            </div>
            <form className="prof-modal-body prof-settings-form" onSubmit={handleSaveSettings}>
              <div className="settings-form-section-title">Personal Information</div>
              <div className="settings-two-col-grid">
                <div>
                  <label className="settings-field-label">Full Name</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={settingsForm.fullName}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="Carl Patrick Mondigo"
                  />
                </div>
                <div>
                  <label className="settings-field-label">Username / Handle</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={settingsForm.handle}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, handle: e.target.value }))
                    }
                    placeholder="@carl_mondigo"
                  />
                </div>
              </div>

              <div className="settings-two-col-grid">
                <div>
                  <label className="settings-field-label">Location (Optional)</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={settingsForm.location}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="Cebu, Philippines"
                  />
                </div>
                <div>
                  <label className="settings-field-label">Member Since</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={settingsForm.memberSince}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, memberSince: e.target.value }))
                    }
                    placeholder="Sep 2025"
                  />
                </div>
              </div>

              <div className="settings-form-section-title" style={{ marginTop: '6px' }}>
                Educational Details
              </div>
              <div className="settings-two-col-grid">
                <div>
                  <label className="settings-field-label">University / School (Optional)</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={settingsForm.university}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, university: e.target.value }))
                    }
                    placeholder="Cebu Technological University"
                  />
                </div>
                <div>
                  <label className="settings-field-label">Campus (Optional)</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={settingsForm.campus}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, campus: e.target.value }))
                    }
                    placeholder="Danao Campus"
                  />
                </div>
              </div>

              <div className="settings-two-col-grid">
                <div>
                  <label className="settings-field-label">Degree Program (Optional)</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={settingsForm.degree}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, degree: e.target.value }))
                    }
                    placeholder="BS Computer Engineering"
                  />
                </div>
                <div>
                  <label className="settings-field-label">Year Level / Standing (Optional)</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={settingsForm.yearLevel}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, yearLevel: e.target.value }))
                    }
                    placeholder="4th Year – Senior"
                  />
                </div>
              </div>

              <div className="settings-two-col-grid">
                <div>
                  <label className="settings-field-label">College / Department (Optional)</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={settingsForm.college || ''}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, college: e.target.value }))
                    }
                    placeholder="College of Engineering"
                  />
                </div>
                <div>
                  <label className="settings-field-label">Academic Status (Optional)</label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={settingsForm.academicStatus}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({ ...prev, academicStatus: e.target.value }))
                    }
                    placeholder="Currently Studying"
                  />
                </div>
              </div>

              <div className="settings-form-section-title" style={{ marginTop: '6px' }}>
                Biography &amp; Interests
              </div>
              <div>
                <label className="settings-field-label">Short Bio (About Me)</label>
                <textarea
                  rows={2}
                  className="settings-field-input"
                  value={settingsForm.bio}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Tell classmates about your academic focus and study goals..."
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div>
                <label className="settings-field-label">
                  Personal Interests (Comma-separated, Optional)
                </label>
                <input
                  type="text"
                  className="settings-field-input"
                  value={settingsForm.interests}
                  onChange={(e) =>
                    setSettingsForm((prev) => ({ ...prev, interests: e.target.value }))
                  }
                  placeholder="Database Systems, SQL Optimization, Co-op Study Battles"
                />
              </div>

              <div>
                <label className="settings-field-label">Notification Preferences</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                    <input type="checkbox" defaultChecked /> Event &amp; Raid multiplier alerts
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                    <input type="checkbox" defaultChecked /> Study battle invites from classmates
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  style={{
                    flex: 1,
                    background: '#1b2334',
                    color: '#cbd5e1',
                    border: '1px solid #2e3b52',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#ff4d6d',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

