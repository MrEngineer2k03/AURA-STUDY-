import './GlobalNavbar.css';
import auraLogo from '../../assets/logoname.png';
import { CharacterRenderer, useSavedEquipment } from 'ui/character';

export default function GlobalNavbar({
  activeTab = 'HOME',
  onTabChange,
  userName = 'Carl Patrick Mondigo',
  coins = '2,450',
  level = 12,
  department = 'Engineering',
}) {
  const savedEquipment = useSavedEquipment();

  const cleanUserName = (!userName || userName === 'CARL_MONDIGO')
    ? 'Carl Patrick Mondigo'
    : userName.includes('_')
      ? userName.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
      : userName;

  const frameRingGradient =
    savedEquipment?.frame === 'frame-archon-mythic' || savedEquipment?.frame === 'frame-golden-halo'
      ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
      : savedEquipment?.frame === 'frame-sql-champion'
      ? 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)'
      : 'linear-gradient(135deg, #ff2a44 0%, #ff6b81 100%)';

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
    } else if (tab === 'HOME') {
      window.location.hash = 'home';
    }
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <header className="aura-navbar events-top-navbar aura-global-navbar" aria-label="Main Navigation Header">
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
        <div className="coins-badge">
          <span className="coin-icon">🪙</span>
          <span className="coin-val">{coins}</span>
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

        <div
          className={`user-profile-chip desktop-only-element ${activeTab === 'PROFILE' ? 'active' : ''}`}
          onClick={() => handleNavClick('PROFILE')}
          style={{ cursor: 'pointer' }}
          title="View Profile"
        >
          <div className="user-avatar-circle" style={{ background: frameRingGradient }}>
            <div className="user-avatar-inner">
              <CharacterRenderer
                equipment={savedEquipment}
                cropMode="circle"
                showFrame={false}
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
          <div className="user-avatar-circle" style={{ background: frameRingGradient }}>
            <div className="user-avatar-inner">
              <CharacterRenderer
                equipment={savedEquipment}
                cropMode="circle"
                showFrame={false}
                level={level}
                className="user-avatar-bust"
              />
            </div>
          </div>
        </button>
      </div>
    </header>
  );
}

