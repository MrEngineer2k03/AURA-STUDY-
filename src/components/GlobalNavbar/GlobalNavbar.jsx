import './GlobalNavbar.css';
import auraLogo from '../../assets/logoname.png';
import { CharacterRenderer, useSavedEquipment, getFrameConfig } from 'ui/character';

export default function GlobalNavbar({
  activeTab = 'HOME',
  onTabChange,
  userName = 'Carl Patrick Mondigo',
  coins = '2,450',
  level = 12,
  department = 'Engineering',
  uiVersion = '2.0',
  onOpenSettings,
  onToggleUiVersion,
}) {
  const savedEquipment = useSavedEquipment();

  const cleanUserName = (!userName || userName === 'CARL_MONDIGO')
    ? 'Carl Patrick Mondigo'
    : userName.includes('_')
      ? userName.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      : userName;

  const frameConfig = getFrameConfig(savedEquipment?.frame);
  const frameRingGradient = frameConfig.gradient;

  const navTabs = ['HOME', 'MY FOLDERS', 'FRIENDS', 'BATTLES', 'EVENTS'];

  const handleNavClick = (tab) => {
    if (tab === 'EVENTS') {
      window.location.hash = 'events';
    } else if (tab === 'PROFILE') {
      window.location.hash = 'profile';
    } else if (tab === 'MY FOLDERS') {
      window.location.hash = 'my-folders';
    } else if (tab === 'FRIENDS') {
      window.location.hash = 'friends';
    } else if (tab === 'BATTLES') {
      window.location.hash = 'battles';
    } else if (tab === 'HOME') {
      window.location.hash = 'home';
    }
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <header className={`aura-navbar events-top-navbar aura-global-navbar ${uiVersion === '2.0' ? 'navbar-ui-v2' : ''}`} aria-label="Main Navigation Header">
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
              className={`nav-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleNavClick(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="navbar-right">
        {/* Quick UI Version Switcher Pill */}
        <button
          type="button"
          className="navbar-ui-version-toggle-btn"
          onClick={onOpenSettings}
          title="Toggle Home UI 1.0 / 2.0 (Click to open Settings)"
        >
          <span className="nav-ui-pill-dot"></span>
          <span className="nav-ui-pill-text">UI {uiVersion}</span>
        </button>

        <div className="coins-badge">
          <span className="coin-icon">🪙</span>
          <span className="coin-val">{coins}</span>
          {uiVersion === '2.0' && <span className="coins-plus-btn">+</span>}
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

        {/* Settings Icon Button */}
        <button
          type="button"
          className="icon-btn-round navbar-settings-btn"
          onClick={onOpenSettings}
          aria-label="Settings and UI Toggle"
          title="Settings (UI 1.0 & 2.0 Toggle)"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>

        <div
          className={`user-profile-chip desktop-only-element ${activeTab === 'PROFILE' ? 'active' : ''}`}
          onClick={() => handleNavClick('PROFILE')}
          style={{ cursor: 'pointer' }}
          title="View Profile"
        >
          <div className="user-avatar-circle" style={{ background: frameRingGradient, boxShadow: `0 0 8px ${frameConfig.color}66` }}>
            <div className="user-avatar-inner">
              <CharacterRenderer
                equipment={savedEquipment}
                cropMode="circle"
                showFrame={true}
                level={level}
                className="user-avatar-bust"
              />
            </div>
          </div>
          <div className="user-info-text">
            <span className="user-info-name">{cleanUserName}</span>
            <span className="user-info-dept">Lv. {level} · {department}</span>
          </div>
          <span className="user-chevron">▾</span>
        </div>

        {/* Mobile Profile Icon Button (Placed after coins side) */}
        <button
          type="button"
          className={`user-profile-mobile-btn mobile-only-element ${activeTab === 'PROFILE' ? 'active' : ''}`}
          onClick={() => handleNavClick('PROFILE')}
          aria-label="View Profile"
          title="View Profile"
        >
          <div className="user-avatar-circle" style={{ background: frameRingGradient, boxShadow: `0 0 8px ${frameConfig.color}66` }}>
            <div className="user-avatar-inner">
              <CharacterRenderer
                equipment={savedEquipment}
                cropMode="circle"
                showFrame={true}
                level={level}
                className="user-avatar-bust"
              />
            </div>
          </div>
        </button>

        {/* Mobile Settings Icon Button */}
        <button
          type="button"
          className="icon-btn-round mobile-only-element navbar-settings-mobile-btn"
          onClick={onOpenSettings}
          aria-label="Settings"
          title="Settings (UI Toggle)"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
}

