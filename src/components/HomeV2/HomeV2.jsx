import React, { useState, useEffect } from 'react';
import './HomeV2.css';
import auraLogo from '../../assets/logoname.png';
import engineeringLogo from '../../assets/engineeringlogo.png';
import homeBg from '../../assets/homebackground.png';
import epicCharacterOutfitHomeImg from '../../../client/ui/character/Character Outfits/Character Home Display Outfits/epic character outfit home.png';
import baseCharacterOutfitHomeImg from '../../../client/ui/character/Character Outfits/Character Home Display Outfits/base character outfit home.png';
import studyFoldersCardBg from '../../../client/ui/dashboard/studyfolderscard.png';
import battlesCardBg from '../../../client/ui/dashboard/battlescard.png';
import eventsCardBg from '../../../client/ui/dashboard/eventscard.png';
import cosmeticsCardBg from '../../../client/ui/dashboard/cosmetics card.png';
import storeCardBg from '../../../client/ui/dashboard/storecard.png';
import achievementsCardBg from '../../../client/ui/dashboard/achievementscard.png';
import { CharacterRenderer, useBetaCharacterState } from 'ui/character';
import {
  StudyFoldersCardIcon,
  EventsCardIcon,
  BattlesCardIcon,
  RewardsCardIcon,
  CosmeticsCardIcon,
  StoreCardIcon,
  AchievementsCardIcon,
} from './CardIcons';

export default function HomeV2({
  cleanUserName = 'Carl Patrick Mondigo',
  savedEquipment,
  studyFolders = [],
  continueFolder,
  onSelectFolder,
  onContinueStudying,
  onCreateFolder,
  onOpenEvent,
  onTabChange,
  uiVersion = '2.0',
  onOpenSettings,
}) {
  const [animated, setAnimated] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [seasonOpen, setSeasonOpen] = useState(false);
  const betaCharacterState = useBetaCharacterState();
  const isBaseCharacter =
    betaCharacterState?.outfitId === 'base-character-1' ||
    betaCharacterState?.outfitId?.startsWith('base');
  const activeCharacterImg = isBaseCharacter
    ? baseCharacterOutfitHomeImg
    : epicCharacterOutfitHomeImg;

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setAnimated(true);
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  const firstName = cleanUserName.split(' ')[0] || 'Carl';

  // Resolved continue folder info (fallback to Business Strategy matching wireframe)
  const activeContinueFolder = continueFolder || {
    id: 1,
    title: 'Business Strategy',
    subtitle: 'Entrepreneurship',
    progress: 25,
    lessons: 4,
    currentLesson: 2,
  };

  const handleFolderClick = () => {
    if (onSelectFolder && activeContinueFolder) {
      onSelectFolder(activeContinueFolder);
    } else if (onTabChange) {
      onTabChange('MY FOLDERS');
    }
  };

  const handleFlashcardsClick = () => {
    if (onTabChange) {
      onTabChange('MY FOLDERS');
    }
  };

  const handleBattlesClick = () => {
    if (onTabChange) {
      onTabChange('BATTLES');
    }
  };

  const handleEventsClick = () => {
    if (onTabChange) {
      onTabChange('EVENTS');
    }
  };

  const handleAchievementsClick = () => {
    if (onTabChange) {
      window.location.hash = 'achievements';
      onTabChange('PROFILE', 'ACHIEVEMENTS');
    }
  };

  const handleCosmeticsClick = () => {
    if (onTabChange) {
      window.location.hash = 'customize';
      onTabChange('PROFILE', 'COSMETICS');
    }
  };

  const handleRewardsClick = () => {
    if (onTabChange) {
      onTabChange('PROFILE', 'ACHIEVEMENTS');
    }
  };

  const handleStoreClick = () => {
    if (onTabChange) {
      window.location.hash = 'store';
      onTabChange('PROFILE', 'STORE');
    }
  };

  return (
    <div className="homev2-dashboard-root">
      {/* 1. EXACT CINEMATIC BACKGROUND & EFFECTS OF UI 1.0 */}
      <div className="campus-bg-container" aria-hidden="true">
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
            fill="url(#leftCyberGradV2)"
            opacity="0.32"
          />
          <polygon
            points="0,0 260,0 120,440 0,520"
            fill="url(#leftCyberGrad2V2)"
            opacity="0.25"
          />
          {/* Right Red Angle Wedge */}
          <polygon
            points="1480,0 1920,0 1920,580 1620,440"
            fill="url(#rightCyberGradV2)"
            opacity="0.28"
          />

          <defs>
            <linearGradient id="leftCyberGradV2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff2a44" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#991b1b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0a0d14" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="leftCyberGrad2V2" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a0d14" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="rightCyberGradV2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff2a44" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#b91c1c" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0a0d14" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 2. MAIN 2-COLUMN TACTICAL HERO CONTAINER */}
      <div className="homev2-container">
        {/* LEFT COLUMN: BRANDING, TICKER, MODULAR CARD GRID, AND DAILY MISSION */}
        <div className="homev2-left-pane">
          {/* Header Brand & Event Ticker */}
          <div className="homev2-header-block">
            <div className="homev2-brand-row">
              <img src={auraLogo} alt="AURA STUDY • BATTLE • GROW" className="homev2-brand-logo" />
            </div>
            <div className="homev2-event-ticker" onClick={handleEventsClick} role="button" tabIndex={0}>
              <span className="homev2-ticker-indicator"></span>
              <span className="homev2-ticker-text">ENGINEERING WEEK IS LIVE · SEP 30 – OCT 7</span>
            </div>
          </div>

          {/* Tactical Cards Grid */}
          <div className="homev2-cards-grid">
            {/* CARD 1: STUDY FOLDERS (Top Left) */}
            <div
              className="homev2-card homev2-card-folders"
              onClick={handleFolderClick}
              role="button"
              tabIndex={0}
            >
              <img src={studyFoldersCardBg} alt="" className="homev2-card-bg-img" />
              <div className="homev2-card-bg-overlay homev2-card-bg-overlay-folders" />
              <div className="homev2-card-badge-row">
                <span className="homev2-badge-dark">3 FOLDERS · 1 IN PROGRESS</span>
              </div>
              <div className="homev2-card-content">
                <h2 className="homev2-card-title">STUDY FOLDERS</h2>
                <p className="homev2-card-subtitle">Business Strategy · 25% complete</p>
              </div>
              <StudyFoldersCardIcon className="homev2-card-icon-folders" />
            </div>

            {/* CARD 2: EVENTS (Tall Middle Column) */}
            <div
              className="homev2-card homev2-card-flashcards homev2-card-events-tall"
              onClick={handleEventsClick}
              role="button"
              tabIndex={0}
            >
              <img src={eventsCardBg} alt="" className="homev2-card-bg-img" />
              <div className="homev2-card-bg-overlay homev2-card-bg-overlay-events" />
              <div className="homev2-card-badge-row right-align">
                <span className="homev2-badge-gold">LIVE</span>
              </div>
              <EventsCardIcon className="homev2-card-icon-events" />
              <div className="homev2-card-content">
                <h2 className="homev2-card-title">EVENTS</h2>
                <p className="homev2-card-subtitle">Engineering Week is live</p>
              </div>
            </div>

            {/* CARD 3: BATTLES (Middle Left) */}
            <div
              className="homev2-card homev2-card-battles"
              onClick={handleBattlesClick}
              role="button"
              tabIndex={0}
            >
              <img src={battlesCardBg} alt="" className="homev2-card-bg-img" />
              <div className="homev2-card-bg-overlay homev2-card-bg-overlay-battles" />
              <div className="homev2-card-badge-row">
                <span className="homev2-badge-purple">2 FRIENDS ONLINE</span>
              </div>
              <div className="homev2-card-content">
                <h2 className="homev2-card-title">BATTLES</h2>
                <p className="homev2-card-subtitle">Quiz duels with your classmates</p>
              </div>
              <BattlesCardIcon className="homev2-card-icon-battles" />
            </div>

            {/* ROW 3: THREE COMPACT CARDS (COSMETICS, STORE, ACHIEVEMENTS) */}
            <div className="homev2-subcards-row">
              {/* COSMETICS CARD */}
              <div
                className="homev2-card homev2-card-sub homev2-card-cosmetics"
                onClick={handleCosmeticsClick}
                role="button"
                tabIndex={0}
              >
                <img src={cosmeticsCardBg} alt="" className="homev2-card-bg-img" />
                <div className="homev2-card-bg-overlay homev2-card-bg-overlay-cosmetics" />
                <div className="homev2-subcard-body">
                  <h3 className="homev2-subcard-title">COSMETICS</h3>
                  <p className="homev2-subcard-subtitle">Outfits & styles</p>
                </div>
                <CosmeticsCardIcon className="homev2-subcard-icon" />
              </div>

              {/* STORE CARD */}
              <div
                className="homev2-card homev2-card-sub homev2-card-store"
                onClick={handleStoreClick}
                role="button"
                tabIndex={0}
              >
                <img src={storeCardBg} alt="" className="homev2-card-bg-img" />
                <div className="homev2-card-bg-overlay homev2-card-bg-overlay-store" />
                <div className="homev2-subcard-body">
                  <h3 className="homev2-subcard-title">STORE</h3>
                  <p className="homev2-subcard-subtitle">Outfits · 2x XP boosts</p>
                </div>
                <StoreCardIcon className="homev2-subcard-icon" />
              </div>

              {/* ACHIEVEMENTS CARD */}
              <div
                className="homev2-card homev2-card-sub homev2-card-achievements"
                onClick={handleAchievementsClick}
                role="button"
                tabIndex={0}
              >
                <img src={achievementsCardBg} alt="" className="homev2-card-bg-img" />
                <div className="homev2-card-bg-overlay homev2-card-bg-overlay-achievements" />
                <div className="homev2-subcard-body">
                  <h3 className="homev2-subcard-title">ACHIEVEMENTS</h3>
                  <p className="homev2-subcard-subtitle">Badges & trophies</p>
                </div>
                <AchievementsCardIcon className="homev2-subcard-icon" />
              </div>
            </div>

            {/* ROW 4: DAILY MISSION FULL-WIDTH BAR */}
            <div className="homev2-daily-mission-bar">
              <span className="homev2-mission-tag">DAILY MISSION</span>
              <span className="homev2-mission-name">Answer 10 questions</span>
              <div className="homev2-mission-track">
                <div
                  className="homev2-mission-fill"
                  style={{ width: animated ? '60%' : '0%' }}
                ></div>
              </div>
              <span className="homev2-mission-counter">6 / 10</span>
              <div className="homev2-mission-rewards">
                <span className="homev2-reward-xp">★ +50 XP</span>
                <span className="homev2-reward-sep">·</span>
                <span className="homev2-reward-coins">🪙 +25 Coins</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CHARACTER STAGE, USER STATS HUD, AND CONTINUE CARD */}
        <div className="homev2-right-pane">
          {/* Big Engineering Watermark Behind Character's Head */}
          <div className="homev2-character-watermark-bg" aria-hidden="true">
            <span className="homev2-character-watermark-text">ENGINEERING</span>
          </div>

          {/* Ethereal Glowing Circle Behind Character */}
          <div className="homev2-character-halo-aura"></div>

          {/* User Stats HUD Overlay (Top Right) */}
          <div className="homev2-user-stats-hud">
            <div className="homev2-hud-name-block">
              <div className="homev2-hud-name-line">
                <h1 className="homev2-hud-username">{firstName}</h1>
                <img
                  src={engineeringLogo}
                  alt="Engineering Department"
                  className="homev2-hud-dept-logo"
                />
              </div>
              <div className="homev2-hud-department">ENGINEERING · SCHOLAR</div>
            </div>

            <div className="homev2-hud-level-block">
              <span className="homev2-hud-level-label">LEVEL</span>
              <span className="homev2-hud-level-number">12</span>
            </div>

            <div className="homev2-hud-xp-block">
              <div className="homev2-hud-xp-track">
                <div
                  className="homev2-hud-xp-fill"
                  style={{ width: animated ? '82%' : '0%' }}
                ></div>
              </div>
              <span className="homev2-hud-xp-text">820 / 1000 XP</span>
            </div>
          </div>

          {/* Character Art Stage */}
          <div className="homev2-character-stage">
            <img
              src={activeCharacterImg}
              alt={isBaseCharacter ? 'Base Character Outfit' : 'Character Outfit'}
              className={`homev2-character-sprite ${isBaseCharacter ? 'homev2-character-sprite-base' : ''}`}
            />
          </div>

          {/* Floating CONTINUE JOURNEY Card (Pinned Bottom Right) */}
          <div className="homev2-continue-journey-card">
            <div className="homev2-cj-tag">CONTINUE JOURNEY</div>
            <h3 className="homev2-cj-title">{activeContinueFolder.title || 'Business Strategy'}</h3>
            <p className="homev2-cj-meta">
              Lesson {activeContinueFolder.currentLesson || 2} of {activeContinueFolder.lessons || 4} ·{' '}
              {activeContinueFolder.progress || 25}% complete
            </p>
            <div className="homev2-cj-track">
              <div
                className="homev2-cj-fill"
                style={{ width: animated ? `${activeContinueFolder.progress || 25}%` : '0%' }}
              ></div>
            </div>
            <button
              type="button"
              className="homev2-cj-btn"
              onClick={() => {
                if (onContinueStudying) onContinueStudying(activeContinueFolder);
                else handleFolderClick();
              }}
            >
              Continue Studying
            </button>
          </div>
        </div>

        {/* 3. FLOATING RIGHT-EDGE ACTIONS RAIL */}
        <aside className="homev2-floating-rail" aria-label="Quick Actions">
          {/* Season Button */}
          <button
            type="button"
            className="homev2-diamond-btn"
            onClick={() => setSeasonOpen(true)}
            title="Season Overview"
          >
            <div className="homev2-diamond-shape">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <span className="homev2-diamond-label">Season</span>
          </button>

          {/* News Button */}
          <button
            type="button"
            className="homev2-diamond-btn"
            onClick={() => setNewsOpen(true)}
            title="Academy News"
          >
            <div className="homev2-diamond-shape">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                <path d="M18 14h-8" />
                <path d="M15 18h-5" />
                <path d="M10 6h8v4h-8V6Z" />
              </svg>
            </div>
            <span className="homev2-diamond-label">News</span>
          </button>

          {/* Rewards Button */}
          <button
            type="button"
            className="homev2-diamond-btn homev2-rewards-trigger-btn"
            onClick={handleRewardsClick}
            title="Daily Rewards & Quests"
          >
            <div className="homev2-diamond-shape">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </div>
            <span className="homev2-diamond-label">Rewards</span>
          </button>
        </aside>
      </div>

      {/* 4. BOTTOM-RIGHT ANGULAR RED ACCENT SHAPE */}
      <div className="homev2-bottom-right-wedge" aria-hidden="true">
        <div className="homev2-bottom-right-wedge-inner"></div>
        <div className="homev2-bottom-right-wedge-glow"></div>
      </div>

      {/* QUICK FLOATING UI VERSION PILL AT CORNER */}
      <div className="homev2-version-pill-badge" onClick={onOpenSettings} title="Click to open Settings & toggle UI">
        <span className="homev2-pill-pulse"></span>
        <span className="homev2-pill-text">UI 2.0 TACTICAL</span>
        <span className="homev2-pill-action">⚙ SWITCH</span>
      </div>

      {/* Season Modal (Optional popup) */}
      {seasonOpen && (
        <div className="homev2-quick-modal-backdrop" onClick={() => setSeasonOpen(false)}>
          <div className="homev2-quick-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="homev2-quick-modal-header">
              <h3>Engineering Week Season 1</h3>
              <button type="button" onClick={() => setSeasonOpen(false)}>✕</button>
            </div>
            <p className="homev2-quick-modal-desc">
              Season 1 is active from <strong>Sep 30 – Oct 7</strong>. Compete in quiz battles, complete daily study missions, and unlock the limited-edition Engineering Department uniform!
            </p>
            <button
              type="button"
              className="homev2-quick-modal-btn"
              onClick={() => {
                setSeasonOpen(false);
                handleEventsClick();
              }}
            >
              Go to Events
            </button>
          </div>
        </div>
      )}

      {/* News Modal (Optional popup) */}
      {newsOpen && (
        <div className="homev2-quick-modal-backdrop" onClick={() => setNewsOpen(false)}>
          <div className="homev2-quick-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="homev2-quick-modal-header">
              <h3>Academy News &amp; Updates</h3>
              <button type="button" onClick={() => setNewsOpen(false)}>✕</button>
            </div>
            <div className="homev2-news-list">
              <div className="homev2-news-item">
                <span className="homev2-news-date">Today</span>
                <h4>UI 2.0 Tactical Interface Deployed</h4>
                <p>Welcome to the brand new tactical layout featuring modular study cards, instant battles, and hero HUD.</p>
              </div>
              <div className="homev2-news-item">
                <span className="homev2-news-date">Sep 30</span>
                <h4>Engineering Week Challenges Live</h4>
                <p>Double XP is enabled on all Engineering department flashcard sets and battle arenas.</p>
              </div>
            </div>
            <button type="button" className="homev2-quick-modal-btn" onClick={() => setNewsOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
