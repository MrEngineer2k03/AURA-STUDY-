import React, { useEffect } from 'react';
import './SettingsModal.css';

export default function SettingsModal({
  isOpen,
  onClose,
  uiVersion = '2.0',
  onSelectUiVersion,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (version) => {
    if (onSelectUiVersion) {
      onSelectUiVersion(version);
    }
  };

  return (
    <div className="aura-settings-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="aura-settings-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="aura-settings-header">
          <div className="aura-settings-title-group">
            <div className="aura-settings-icon-wrap">
              <svg
                width="20"
                height="20"
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
            </div>
            <div>
              <h2 className="aura-settings-title">Settings</h2>
              <p className="aura-settings-subtitle">Customize your AURA workspace experience</p>
            </div>
          </div>
          <button
            type="button"
            className="aura-settings-close-btn"
            onClick={onClose}
            aria-label="Close Settings"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="aura-settings-body">
          {/* Section: UI Version */}
          <div className="aura-settings-section">
            <div className="aura-settings-section-header">
              <span className="aura-settings-section-badge">DISPLAY LAYOUT</span>
              <h3 className="aura-settings-section-title">Home Dashboard Version</h3>
              <p className="aura-settings-section-desc">
                Toggle between the classic courtyard view and the new tactical modular card layout.
              </p>
            </div>

            {/* Segmented Quick Switcher */}
            <div className="aura-settings-segmented-switcher">
              <button
                type="button"
                className={`aura-segmented-btn ${uiVersion === '1.0' ? 'active' : ''}`}
                onClick={() => handleSelect('1.0')}
              >
                <span className="aura-segmented-dot"></span>
                UI 1.0 (Classic)
              </button>
              <button
                type="button"
                className={`aura-segmented-btn ${uiVersion === '2.0' ? 'active' : ''}`}
                onClick={() => handleSelect('2.0')}
              >
                <span className="aura-segmented-dot"></span>
                UI 2.0 (Tactical New)
                <span className="aura-segmented-pill">NEW</span>
              </button>
            </div>

            {/* Version Cards Grid */}
            <div className="aura-version-cards-grid">
              {/* Option: UI 1.0 */}
              <div
                className={`aura-version-card ${uiVersion === '1.0' ? 'selected' : ''}`}
                onClick={() => handleSelect('1.0')}
              >
                <div className="aura-version-card-top">
                  <div className="aura-version-name">UI 1.0</div>
                  <div className="aura-version-tag">Courtyard Classic</div>
                  <div className="aura-version-radio">
                    {uiVersion === '1.0' && <div className="aura-version-radio-inner" />}
                  </div>
                </div>
                <p className="aura-version-card-desc">
                  Traditional campus hero layout with central anime character standing in the university courtyard, flanked by greeting &amp; missions, with 3 bottom study panels.
                </p>
                <div className="aura-version-features">
                  <span>🏛️ Courtyard Hero</span>
                  <span>👤 Centered Sprite</span>
                  <span>📑 3-Column Bottom</span>
                </div>
              </div>

              {/* Option: UI 2.0 */}
              <div
                className={`aura-version-card ${uiVersion === '2.0' ? 'selected' : ''}`}
                onClick={() => handleSelect('2.0')}
              >
                <div className="aura-version-card-top">
                  <div className="aura-version-name">
                    UI 2.0 <span className="aura-version-new-badge">ACTIVE DESIGN</span>
                  </div>
                  <div className="aura-version-tag">Tactical Dashboard</div>
                  <div className="aura-version-radio">
                    {uiVersion === '2.0' && <div className="aura-version-radio-inner" />}
                  </div>
                </div>
                <p className="aura-version-card-desc">
                  Cyberpunk-inspired tactical card layout with chamfered Study Folders, tall Flashcards, Battles, Store, Rewards, Events, bottom Daily Mission bar, and right hero character HUD.
                </p>
                <div className="aura-version-features">
                  <span>⚡ Tactical Card Grid</span>
                  <span>🎨 Rich Color Gradients</span>
                  <span>🛡️ Side Character Stage</span>
                  <span>💎 Quick Action Rail</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="aura-settings-footer">
          <div className="aura-settings-status-note">
            Currently displaying <strong>UI {uiVersion}</strong>
          </div>
          <button type="button" className="aura-settings-apply-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
