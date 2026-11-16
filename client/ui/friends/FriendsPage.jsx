import React, { useState, useMemo } from 'react';
import './FriendsPage.css';

// Initial mock data matching AURA screenshots exactly
const INITIAL_FRIENDS = [
  {
    id: 'friend-1',
    name: 'Mia Santos',
    username: '@mia.santos',
    department: 'Engineering',
    initials: 'MS',
    avatarBg: '#881337',
    level: 15,
    statusText: 'Studying Calculus · 25 min',
    statusType: 'studying', // green book
    isOnline: true,
    isStudying: true,
    streak: 21,
    weeklyXp: '3,820',
    actionPrimary: 'Challenge',
    actionSecondary: 'Study together',
  },
  {
    id: 'friend-2',
    name: 'Jon Reyes',
    username: '@jonr',
    department: 'Information Tech',
    initials: 'JR',
    avatarBg: '#1e3a8a',
    level: 11,
    statusText: 'In a study battle',
    statusType: 'battle', // gold swords
    isOnline: true,
    isStudying: false,
    streak: 4,
    weeklyXp: '2,940',
    actionPrimary: 'Challenge',
    actionSecondary: 'Study together',
  },
  {
    id: 'friend-3',
    name: 'Paolo Cruz',
    username: '@paolo_c',
    department: 'Architecture',
    initials: 'PC',
    avatarBg: '#581c87',
    level: 9,
    statusText: 'Online',
    statusType: 'online', // green checkmark
    isOnline: true,
    isStudying: false,
    streak: 2,
    weeklyXp: '1,650',
    actionPrimary: 'Challenge',
    actionSecondary: 'Study together',
  },
  {
    id: 'friend-4',
    name: 'Ana Lim',
    username: '@analim',
    department: 'Business & Mgmt',
    initials: 'AL',
    avatarBg: '#064e3b',
    level: 13,
    statusText: 'Last seen 2 hours ago',
    statusType: 'offline', // gray clock
    isOnline: false,
    isStudying: false,
    streak: 9,
    weeklyXp: '2,410',
    actionPrimary: 'Send challenge',
    actionSecondary: 'Study together',
  },
  {
    id: 'friend-5',
    name: 'Bea Villanueva',
    username: '@bea.v',
    department: 'Engineering',
    initials: 'BV',
    avatarBg: '#78350f',
    level: 14,
    statusText: 'Last seen yesterday',
    statusType: 'offline', // gray clock
    isOnline: false,
    isStudying: false,
    streak: 15,
    weeklyXp: '3,105',
    actionPrimary: 'Send challenge',
    actionSecondary: 'Study together',
  },
  {
    id: 'friend-6',
    name: 'Kyle Tan',
    username: '@kyletan',
    department: 'Information Tech',
    initials: 'KT',
    avatarBg: '#134e4a',
    level: 10,
    statusText: 'Last seen 3 days ago',
    statusType: 'offline', // gray clock
    isOnline: false,
    isStudying: false,
    streak: 0,
    weeklyXp: '980',
    actionPrimary: 'Send challenge',
    actionSecondary: 'Study together',
  },
];

const INITIAL_REQUESTS = [
  {
    id: 'req-1',
    name: 'Rina Ocampo',
    username: '@rina.o',
    department: 'Engineering',
    initials: 'RO',
    avatarBg: '#8f432a',
    level: 8,
    mutualText: '3 mutual friends',
  },
  {
    id: 'req-2',
    name: 'Dan Uy',
    username: '@danuy',
    department: 'Information Tech',
    initials: 'DU',
    avatarBg: '#445484',
    level: 12,
    mutualText: '1 mutual friend',
  },
];

const SUGGESTED_FRIENDS = [
  {
    id: 'sug-1',
    name: 'Marco Diaz',
    username: '@marcod',
    department: 'Engineering',
    initials: 'MD',
    avatarBg: '#e11d48',
    level: 12,
    mutualText: '4 mutual friends',
    streak: 7,
    weeklyXp: '1,890',
  },
  {
    id: 'sug-2',
    name: 'Sophia Chen',
    username: '@sophiac',
    department: 'Computer Science',
    initials: 'SC',
    avatarBg: '#8b5cf6',
    level: 14,
    mutualText: '2 mutual friends',
    streak: 12,
    weeklyXp: '2,650',
  },
  {
    id: 'sug-3',
    name: 'Leon Rivera',
    username: '@leonr',
    department: 'Engineering',
    initials: 'LR',
    avatarBg: '#06b6d4',
    level: 11,
    mutualText: '5 mutual friends',
    streak: 5,
    weeklyXp: '1,420',
  },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Mia Santos', initials: 'MS', xp: '3,820 XP', isUser: false },
  { rank: 2, name: 'Carl Mondigo', initials: 'CM', xp: '3,260 XP', isUser: true },
  { rank: 3, name: 'Bea Villanueva', initials: 'BV', xp: '3,105 XP', isUser: false },
  { rank: 4, name: 'Jon Reyes', initials: 'JR', xp: '2,940 XP', isUser: false },
  { rank: 5, name: 'Ana Lim', initials: 'AL', xp: '2,410 XP', isUser: false },
];

const ACTIVITY_FEED = [
  {
    id: 'act-1',
    initials: 'MS',
    text: 'Mia mastered 20 cards in',
    highlight: 'Calculus',
    time: '12 min ago',
  },
  {
    id: 'act-2',
    initials: 'JR',
    text: 'Jon won a study battle against',
    highlight: 'Ana',
    time: '1 hour ago',
  },
  {
    id: 'act-3',
    initials: 'BV',
    text: 'Bea reached a',
    highlight: '15-day streak',
    time: 'Yesterday',
  },
  {
    id: 'act-4',
    initials: 'AL',
    text: 'Ana joined',
    highlight: 'Engineering Week',
    time: 'Yesterday',
  },
];

export default function FriendsPage({
  onNavigateHome,
  onTabChange,
  userName = 'Carl Patrick Mondigo',
}) {
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeSubTab, setActiveSubTab] = useState('ALL'); // 'ALL' | 'ONLINE' | 'REQUESTS' | 'SUGGESTED'
  const [mobileBottomTab, setMobileBottomTab] = useState('leaderboard'); // 'leaderboard' | 'activity' | 'invite'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFriendInput, setAddFriendInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleCopyInvite = () => {
    const inviteLink = 'aura.app/join/carl-mondigo';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(inviteLink).catch(() => {});
    }
    setIsCopied(true);
    showToast('Invite link copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2200);
  };

  const handleAcceptRequest = (req) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    const newFriend = {
      id: `friend-${Date.now()}`,
      name: req.name,
      username: req.username || `@${req.name.toLowerCase().replace(/\s+/g, '')}`,
      department: req.department,
      initials: req.initials,
      avatarBg: req.avatarBg || '#2563eb',
      level: req.level || 10,
      statusText: 'Online',
      statusType: 'online',
      isOnline: true,
      isStudying: false,
      streak: 1,
      weeklyXp: '1,200',
      actionPrimary: 'Challenge',
      actionSecondary: 'Study together',
    };
    setFriends((prev) => [newFriend, ...prev]);
    showToast(`Accepted friend request from ${req.name}!`);
  };

  const handleDeclineRequest = (req) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    showToast(`Declined request from ${req.name}.`);
  };

  const handleAddFriendSubmit = (e) => {
    e.preventDefault();
    if (!addFriendInput.trim()) return;
    showToast(`Friend request sent to ${addFriendInput.trim()}!`);
    setAddFriendInput('');
    setShowAddModal(false);
  };

  // Filtered friends based on tab and search query
  const filteredFriends = useMemo(() => {
    let list = friends;
    if (activeSubTab === 'ONLINE') {
      list = friends.filter((f) => f.isOnline);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.username.toLowerCase().includes(q) ||
          f.department.toLowerCase().includes(q)
      );
    }
    return list;
  }, [friends, activeSubTab, searchQuery]);

  const filteredRequests = useMemo(() => {
    if (!searchQuery.trim()) return requests;
    const q = searchQuery.toLowerCase();
    return requests.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.username && r.username.toLowerCase().includes(q)) ||
        r.department.toLowerCase().includes(q)
    );
  }, [requests, searchQuery]);

  const onlineCount = useMemo(() => friends.filter((f) => f.isOnline).length, [friends]);
  const studyingCount = useMemo(() => friends.filter((f) => f.isStudying).length, [friends]);

  const renderRequestsWidget = () => (
    <div className="friends-widget-card">
      <div className="friends-widget-head">
        <h3 className="friends-widget-title">Friend requests</h3>
        <span className="friends-widget-meta">{requests.length} pending</span>
      </div>
      <div className="friend-requests-list">
        {requests.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '12px', margin: '4px 0' }}>No pending requests.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="friend-req-item">
              <div className="friend-req-avatar-info">
                <div className="friend-req-avatar" style={{ background: req.avatarBg || '#1f293d' }}>
                  {req.initials}
                </div>
                <div className="friend-req-text">
                  <span className="friend-req-name">{req.name}</span>
                  <span className="friend-req-meta">
                    {req.department} · {req.mutualText}
                  </span>
                </div>
              </div>
              <div className="friend-req-actions">
                <button
                  type="button"
                  className="friend-req-btn friend-req-btn--accept"
                  onClick={() => handleAcceptRequest(req)}
                  title="Accept request"
                >
                  ✓
                </button>
                <button
                  type="button"
                  className="friend-req-btn friend-req-btn--decline"
                  onClick={() => handleDeclineRequest(req)}
                  title="Decline request"
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderLeaderboardWidget = () => (
    <div className="friends-widget-card">
      <div className="friends-widget-head">
        <h3 className="friends-widget-title">Weekly leaderboard</h3>
        <span className="friends-widget-meta">XP this week</span>
      </div>
      <div className="leaderboard-list">
        {LEADERBOARD_DATA.map((row) => (
          <div
            key={row.rank}
            className={`leaderboard-row ${row.isUser ? 'is-current-user' : ''}`}
          >
            <div className="leaderboard-left">
              <span className={`leaderboard-rank leaderboard-rank--${row.rank}`}>
                {row.rank}
              </span>
              <span className="leaderboard-avatar">{row.initials}</span>
              <span className="leaderboard-name">
                <span>{row.isUser ? userName.split(' ')[0] : row.name}</span>
                {row.isUser && <span className="leaderboard-you-badge">You</span>}
              </span>
            </div>
            <span className="leaderboard-xp">{row.xp}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivityWidget = () => (
    <div className="friends-widget-card">
      <div className="friends-widget-head">
        <h3 className="friends-widget-title">Activity</h3>
      </div>
      <div className="activity-feed-list">
        {ACTIVITY_FEED.map((act) => (
          <div key={act.id} className="activity-feed-item">
            <div className="activity-avatar">{act.initials}</div>
            <div className="activity-text-wrap">
              <p className="activity-desc">
                {act.text} <span className="activity-highlight">{act.highlight}</span>
              </p>
              <span className="activity-time">{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInviteWidget = () => (
    <div className="friends-widget-card invite-classmates-card">
      <h3 className="friends-widget-title">Invite classmates</h3>
      <p className="invite-desc">You and a friend each get 200 coins when they join.</p>
      <div className="invite-copy-row">
        <input
          type="text"
          readOnly
          value="aura.app/join/carl-mondigo"
          className="invite-link-input"
        />
        <button
          type="button"
          className={`invite-btn-copy ${isCopied ? 'copied' : ''}`}
          onClick={handleCopyInvite}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="aura-friends-page aura-page-content" aria-label="AURA Friends Section">
      {/* Background Futuristic Network / Constellation Elements (Matching Screenshot) */}
      <div className="friends-bg-decorations" aria-hidden="true">
        <svg
          className="friends-constellation-svg"
          viewBox="0 0 750 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="redGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="greenGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Concentric Radar Grid Rings centered at (680, 200) */}
          <circle cx="680" cy="200" r="130" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          <circle cx="680" cy="200" r="240" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="680" cy="200" r="360" stroke="rgba(255, 255, 255, 0.035)" strokeWidth="1" />
          <circle cx="680" cy="200" r="500" stroke="rgba(255, 255, 255, 0.025)" strokeWidth="1" strokeDasharray="4 8" />

          {/* Network Connecting Lines */}
          <line x1="640" y1="75" x2="495" y2="120" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
          <line x1="640" y1="75" x2="575" y2="265" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="1" />
          <line x1="495" y1="120" x2="575" y2="265" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
          <line x1="575" y1="265" x2="710" y2="360" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
          <line x1="575" y1="265" x2="460" y2="400" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" strokeDasharray="3 5" />
          <line x1="640" y1="75" x2="720" y2="50" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="1" strokeDasharray="3 4" />

          {/* Glowing Golden Ring Node (Upper Right) */}
          <circle cx="640" cy="75" r="8.5" stroke="#fbbf24" strokeWidth="2.2" fill="none" opacity="0.95" filter="url(#goldGlow)" />

          {/* Glowing Red Dot Node with Halo (Upper Middle) */}
          <circle cx="495" cy="120" r="12" fill="rgba(255, 42, 68, 0.25)" />
          <circle cx="495" cy="120" r="4.8" fill="#ff2a44" filter="url(#redGlow)" />

          {/* Glowing Green Ring Node (Middle Right) */}
          <circle cx="575" cy="265" r="8.5" stroke="#10b981" strokeWidth="2.2" fill="none" opacity="0.95" filter="url(#greenGlow)" />

          {/* Faint Auxiliary Constellation Nodes */}
          <circle cx="710" cy="360" r="3" fill="rgba(255, 255, 255, 0.35)" />
          <circle cx="460" cy="400" r="2.5" fill="rgba(255, 255, 255, 0.2)" />
        </svg>
      </div>

      <div className="friends-container">
        {/* 1. PAGE HEADER */}
        <header className="friends-page-header">
          <div className="friends-page-title-wrap">
            <h1 className="friends-page-title">Friends</h1>
            <p className="friends-page-sub">Study together, trade challenges and keep each other on track.</p>
          </div>
          <button
            type="button"
            className="friends-btn-add"
            onClick={() => setShowAddModal(true)}
          >
            <span>+</span>
            <span>Add friend</span>
          </button>
        </header>

        {/* 2. TOP METRIC BANNER CARD */}
        <section className="friends-metric-banner" aria-label="Friends Overview Stats">
          <div className="friends-metric-stats-group">
            <div className="friends-metric-stat">
              <span className="friends-metric-num">{onlineCount}</span>
              <span className="friends-metric-label">Online now</span>
            </div>
            <div className="friends-metric-stat">
              <span className="friends-metric-num">{studyingCount}</span>
              <span className="friends-metric-label">Studying right now</span>
            </div>
            <div className="friends-metric-stat">
              <span className="friends-metric-num">{friends.length}</span>
              <span className="friends-metric-label">Friends</span>
            </div>
          </div>

          <div className="friends-metric-actions-group">
            <div className="friends-avatar-stack" title="Friends currently active">
              <div className="friends-avatar-stack-item" style={{ background: '#881337' }}>MS</div>
              <div className="friends-avatar-stack-item" style={{ background: '#1e3a8a' }}>JR</div>
              <div className="friends-avatar-stack-item" style={{ background: '#581c87' }}>PC</div>
            </div>
            <button
              type="button"
              className="friends-btn-study-together-top"
              onClick={() => showToast('Opening group study lobby...')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Study together</span>
            </button>
          </div>
        </section>

        {/* 3. TABS & SEARCH ROW */}
        <section className="friends-nav-search-row">
          <nav className="friends-tabs-list" aria-label="Friends Filter Tabs">
            <button
              type="button"
              className={`friends-tab-btn ${activeSubTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('ALL')}
            >
              <span className="tab-label-desktop">All friends</span>
              <span className="tab-label-mobile">All</span>
              <span className="friends-tab-count">{friends.length}</span>
            </button>

            <button
              type="button"
              className={`friends-tab-btn ${activeSubTab === 'ONLINE' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('ONLINE')}
            >
              <span>Online</span>
              <span className="friends-tab-count">{onlineCount}</span>
            </button>

            <button
              type="button"
              className={`friends-tab-btn ${activeSubTab === 'REQUESTS' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('REQUESTS')}
            >
              <span>Requests</span>
              {requests.length > 0 && (
                <span className="friends-tab-badge">{requests.length}</span>
              )}
            </button>

            <button
              type="button"
              className={`friends-tab-btn ${activeSubTab === 'SUGGESTED' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('SUGGESTED')}
            >
              <span>Suggested</span>
              <span className="friends-tab-count">3</span>
            </button>
          </nav>

          <div className="friends-search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="friends-search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or username"
              className="friends-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* 4. TWO-COLUMN MAIN CONTENT */}
        <main className="friends-main-grid">
          {/* Left Column: Friends List or Tab Specific Content */}
          <section className="friends-left-col">
            <div className="friends-col-header">
              <h2 className="friends-col-title">
                {activeSubTab === 'REQUESTS'
                  ? 'Friend requests'
                  : activeSubTab === 'SUGGESTED'
                  ? 'Suggested classmates'
                  : activeSubTab === 'ONLINE'
                  ? 'Online friends'
                  : 'All friends'}
              </h2>
              <span className="friends-col-count">
                {activeSubTab === 'REQUESTS'
                  ? `${requests.length} people`
                  : activeSubTab === 'SUGGESTED'
                  ? `${SUGGESTED_FRIENDS.length} people`
                  : `${filteredFriends.length} people`}
              </span>
            </div>

            {/* REQUESTS VIEW (when tab is Requests - Matches media_1794766164633_8c71a256.png) */}
            {activeSubTab === 'REQUESTS' ? (
              <div className="friends-cards-grid">
                {filteredRequests.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '13px', gridColumn: '1 / -1', margin: '12px 0' }}>
                    No pending friend requests.
                  </p>
                ) : (
                  filteredRequests.map((req) => (
                    <article key={req.id} className="friend-card friend-req-grid-card">
                      <div className="friend-card-head">
                        <div className="friend-avatar-info">
                          <div
                            className="friend-avatar-circle"
                            style={{ background: req.avatarBg || '#8f432a' }}
                          >
                            {req.initials}
                          </div>
                          <div className="friend-user-text">
                            <span className="friend-name">{req.name}</span>
                            <span className="friend-sub">
                              {req.username} · {req.department}
                            </span>
                          </div>
                        </div>

                        <div className="friend-level-block">
                          <span className="friend-level-val">{req.level}</span>
                          <span className="friend-level-lbl">Level</span>
                        </div>
                      </div>

                      {/* Mutual Friends Row */}
                      <div className="friend-req-card-mutual">
                        <svg
                          className="friend-req-mutual-svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        <span>{req.mutualText}</span>
                      </div>

                      {/* Action Buttons: Accept (Red with checkmark) & Decline (Dark) */}
                      <div className="friend-req-card-btns">
                        <button
                          type="button"
                          className="friend-req-btn-action friend-req-btn-action--accept"
                          onClick={() => handleAcceptRequest(req)}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Accept</span>
                        </button>

                        <button
                          type="button"
                          className="friend-req-btn-action friend-req-btn-action--decline"
                          onClick={() => handleDeclineRequest(req)}
                        >
                          Decline
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            ) : activeSubTab === 'SUGGESTED' ? (
              /* SUGGESTED VIEW */
              <div className="friends-cards-grid">
                {SUGGESTED_FRIENDS.map((sug) => (
                  <article key={sug.id} className="friend-card">
                    <div className="friend-card-head">
                      <div className="friend-avatar-info">
                        <div className="friend-avatar-circle" style={{ background: sug.avatarBg }}>
                          {sug.initials}
                        </div>
                        <div className="friend-user-text">
                          <span className="friend-name">{sug.name}</span>
                          <span className="friend-sub">{sug.username} · {sug.department}</span>
                        </div>
                      </div>
                      <div className="friend-level-block">
                        <span className="friend-level-val">{sug.level}</span>
                        <span className="friend-level-lbl">Level</span>
                      </div>
                    </div>
                    <div className="friend-status-row online">
                      <span>{sug.mutualText}</span>
                    </div>
                    <div className="friend-stats-row">
                      <span className="friend-streak">
                        <span className="friend-streak-flame">🔥</span> {sug.streak} day streak
                      </span>
                      <span className="friend-xp-val">{sug.weeklyXp} XP this week</span>
                    </div>
                    <div className="friend-actions-row" style={{ gridTemplateColumns: '1fr' }}>
                      <button
                        type="button"
                        className="friend-btn friend-btn-primary"
                        onClick={() => showToast(`Friend request sent to ${sug.name}!`)}
                      >
                        <span>+ Add friend</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* ALL / ONLINE FRIENDS GRID */
              <div className="friends-cards-grid">
                {filteredFriends.length === 0 ? (
                  <p style={{ color: '#94a3b8', fontSize: '13px', gridColumn: '1 / -1' }}>
                    No friends found matching your search.
                  </p>
                ) : (
                  filteredFriends.map((f) => (
                    <article key={f.id} className="friend-card">
                      <div className="friend-card-head">
                        <div className="friend-avatar-info">
                          <div className="friend-avatar-wrap">
                            <div className="friend-avatar-circle" style={{ background: f.avatarBg }}>
                              {f.initials}
                            </div>
                            <span className={`friend-status-dot dot-${f.statusType}`} aria-hidden="true" />
                          </div>
                          <div className="friend-user-text">
                            <span className="friend-name">{f.name}</span>
                            <span className="friend-sub">{f.username} · {f.department}</span>
                          </div>
                        </div>
                        <div className="friend-level-block">
                          <span className="friend-level-val">{f.level}</span>
                          <span className="friend-level-lbl">Level</span>
                        </div>
                      </div>

                      {/* Status row */}
                      <div className={`friend-status-row ${f.statusType}`}>
                        {f.statusType === 'studying' && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="friend-status-icon">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                        )}
                        {f.statusType === 'battle' && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="friend-status-icon">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                          </svg>
                        )}
                        {f.statusType === 'online' && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="friend-status-icon">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {f.statusType === 'offline' && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="friend-status-icon">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        )}
                        <span>{f.statusText}</span>
                      </div>

                      {/* Streak and XP row */}
                      <div className="friend-stats-row">
                        <span className={`friend-streak ${f.streak > 0 ? 'has-streak' : 'no-streak'}`}>
                          <span className="friend-streak-flame">🔥</span>
                          <span>{f.streak} day streak</span>
                        </span>
                        <span className="friend-xp-val">{f.weeklyXp} XP this week</span>
                      </div>

                      {/* Action buttons */}
                      <div className="friend-actions-row">
                        <button
                          type="button"
                          className="friend-btn friend-btn-primary"
                          onClick={() => showToast(`Challenge sent to ${f.name}!`)}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                          </svg>
                          <span>{f.actionPrimary}</span>
                        </button>

                        <button
                          type="button"
                          className="friend-btn friend-btn-soft"
                          title={f.actionSecondary}
                          onClick={() => showToast(`Study invite sent to ${f.name}!`)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="4" y="2" width="16" height="20" rx="2" />
                            <line x1="8" y1="6" x2="16" y2="6" />
                            <line x1="8" y1="10" x2="16" y2="10" />
                            <line x1="8" y1="14" x2="12" y2="14" />
                          </svg>
                          <span className="friend-btn-soft-label">{f.actionSecondary}</span>
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {/* Mobile bottom segmented section (Leaderboard / Activity / Invite) */}
            <div className="mobile-friends-bottom-section" aria-label="Additional friend details">
              <div className="mobile-segmented-control" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mobileBottomTab === 'leaderboard'}
                  className={`mobile-seg-btn ${mobileBottomTab === 'leaderboard' ? 'active' : ''}`}
                  onClick={() => setMobileBottomTab('leaderboard')}
                >
                  Leaderboard
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mobileBottomTab === 'activity'}
                  className={`mobile-seg-btn ${mobileBottomTab === 'activity' ? 'active' : ''}`}
                  onClick={() => setMobileBottomTab('activity')}
                >
                  Activity
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mobileBottomTab === 'invite'}
                  className={`mobile-seg-btn ${mobileBottomTab === 'invite' ? 'active' : ''}`}
                  onClick={() => setMobileBottomTab('invite')}
                >
                  Invite
                </button>
              </div>

              <div className="mobile-widget-display">
                {mobileBottomTab === 'leaderboard' && renderLeaderboardWidget()}
                {mobileBottomTab === 'activity' && renderActivityWidget()}
                {mobileBottomTab === 'invite' && renderInviteWidget()}
              </div>
            </div>
          </section>

          {/* Right Sidebar Widgets */}
          <aside className="friends-right-col" aria-label="Friends Sidebar Info">
            {renderRequestsWidget()}
            {renderLeaderboardWidget()}
            {renderActivityWidget()}
            {renderInviteWidget()}
          </aside>
        </main>
      </div>

      {/* QUICK ADD FRIEND MODAL */}
      {showAddModal && (
        <div className="friends-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="friends-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="friends-modal-head">
              <h3 className="friends-modal-title">Add a Friend</h3>
              <button
                type="button"
                className="friends-modal-close-btn"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddFriendSubmit}>
              <label className="friends-modal-input-label">
                Search by student name or @username
              </label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. @mia.santos"
                value={addFriendInput}
                onChange={(e) => setAddFriendInput(e.target.value)}
                className="friends-modal-input"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
                <button
                  type="button"
                  className="friend-btn friend-btn-soft"
                  onClick={() => setShowAddModal(false)}
                  style={{ height: '38px', padding: '0 14px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="friends-modal-submit-btn"
                  style={{ padding: '0 18px' }}
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="friends-toast-banner" role="status">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff2a44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
