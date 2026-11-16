import React, { useState, useMemo } from 'react';
import './character.css';
import baseCharacterImg from './Character Outfits/Base/Base Character 1.png';
import epicCharacterOutfitImg from './Character Outfits/Uniform Outfits/Epic Character Outfit.png';
import homeBg from '../dashboard/homebackground.png';

const BETA_STORAGE_KEY = 'aura_beta_character_outfit_v2';
const BETA_CAMERA_STORAGE_KEY = 'aura_beta_default_camera_angle_v1';

const BETA_CHARACTER_ITEMS = [
  {
    id: 'base-character-1',
    name: 'Base Character (Default Uniform)',
    category: 'uniformOutfits',
    rarity: 'Common',
    image: baseCharacterImg,
    description: 'Standard CTU short-sleeve white polo uniform with official lanyard, black slacks, and classic sneakers.',
    unlockRequirement: 'Default Character',
  },
  {
    id: 'epic-character-outfit',
    name: 'Epic Character Outfit',
    category: 'uniformOutfits',
    rarity: 'Epic',
    image: epicCharacterOutfitImg,
    description: 'CTU Esports purple & gold hooded jacket with graphic tee, tactical cargo pants, and high-top sneakers.',
    unlockRequirement: 'Uniform Outfits',
  },
];

const BETA_CAMERA_TRANSFORMS = {
  full: 'translate3d(0, 0%, 0) scale(1)',
  // Half-body camera: frames head, torso, jacket, and hands (y = -5..850) cleanly inside the stage
  upperBody: 'translate3d(0, 39.3%, 0) scale(1.82)',
  // Head & Chest close-up camera: frames head, neck, collar, chest logo, and lanyard (y = -5..575)
  headChest: 'translate3d(0, 78.3%, 0) scale(2.62)',
};

const BETA_CAMERA_LABELS = {
  headChest: 'Head & Chest',
  upperBody: 'Half Body',
  full: 'Full Body',
};

function loadSavedBetaCharacter() {
  try {
    const saved = localStorage.getItem(BETA_STORAGE_KEY);
    if (saved && BETA_CHARACTER_ITEMS.some((item) => item.id === saved)) {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return 'epic-character-outfit';
}

function loadSavedDefaultCameraAngle() {
  try {
    const saved = localStorage.getItem(BETA_CAMERA_STORAGE_KEY);
    if (saved && Object.prototype.hasOwnProperty.call(BETA_CAMERA_TRANSFORMS, saved)) {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  // Head & Chest camera angle is the default
  return 'headChest';
}

/**
 * Standalone 2D Character Stage Renderer (Beta)
 * Renders each character outfit as a separate, self-contained character illustration.
 */
export function BetaCharacterStageRenderer({
  outfitId = 'epic-character-outfit',
  className = 'w-full h-full',
  style,
}) {
  const activeItem =
    BETA_CHARACTER_ITEMS.find((item) => item.id === outfitId) || BETA_CHARACTER_ITEMS[0];

  const isEpic = activeItem.rarity === 'Epic';

  return (
    <svg
      viewBox="0 -40 1024 1616"
      className={`select-none transition-all ${className}`}
      style={{ width: '100%', height: '100%', maxHeight: '370px', display: 'block', ...style }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Stage Ambient Glow */}
        <radialGradient id="betaStageGlow" cx="50%" cy="42%" r="50%">
          <stop offset="0%" stopColor={isEpic ? '#A855F7' : '#6366F1'} stopOpacity="0.28" />
          <stop offset="60%" stopColor="#1E1B4B" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#090D16" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="betaFloorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#000000" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient Backdrop & Floor Shadow */}
      <circle cx="512" cy="640" r="440" fill="url(#betaStageGlow)" />
      <ellipse cx="525" cy="1495" rx="235" ry="34" fill="url(#betaFloorShadow)" />

      {/* Standalone Character Illustration */}
      <image
        href={activeItem.image}
        x="0"
        y="0"
        width="1024"
        height="1536"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}

export default function BetaCharacterCustomizer({
  userName = 'Carl Patrick Mondigo',
  level = 12,
}) {
  const [savedOutfitId, setSavedOutfitId] = useState(loadSavedBetaCharacter);
  const [previewOutfitId, setPreviewOutfitId] = useState(savedOutfitId);
  // Default camera view is Head & Chest ('headChest'), or user's saved default camera angle
  const [defaultCameraAngle, setDefaultCameraAngle] = useState(loadSavedDefaultCameraAngle);
  const [cameraAngle, setCameraAngle] = useState(loadSavedDefaultCameraAngle); // 'headChest' | 'upperBody' | 'full'
  const [syncStatus, setSyncStatus] = useState(null);

  const hasUnsavedChanges = savedOutfitId !== previewOutfitId;
  const isCurrentCameraDefault = cameraAngle === defaultCameraAngle;

  const equippedItem = useMemo(
    () => BETA_CHARACTER_ITEMS.find((i) => i.id === previewOutfitId) || BETA_CHARACTER_ITEMS[0],
    [previewOutfitId]
  );

  // Camera helper functions
  const zoomToHeadChest = () => {
    setCameraAngle('headChest');
  };

  const zoomToUpperBody = () => {
    setCameraAngle('upperBody');
  };

  const zoomToFullBody = () => {
    setCameraAngle('full');
  };

  const handleSaveDefaultCameraAngle = (angleToSave = cameraAngle) => {
    setDefaultCameraAngle(angleToSave);
    try {
      localStorage.setItem(BETA_CAMERA_STORAGE_KEY, angleToSave);
    } catch {
      // ignore storage errors
    }
    setSyncStatus({
      type: 'success',
      message: `Saved "${BETA_CAMERA_LABELS[angleToSave]}" as your default camera angle!`,
    });
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleSelectOutfit = (item) => {
    setPreviewOutfitId(item.id);
    setCameraAngle(defaultCameraAngle);
  };

  const handleSaveLoadout = () => {
    setSavedOutfitId(previewOutfitId);
    try {
      localStorage.setItem(BETA_STORAGE_KEY, previewOutfitId);
    } catch {
      // ignore storage errors
    }
    setSyncStatus({
      type: 'success',
      title: 'Character Saved!',
      message: `${equippedItem.name} is now equipped as your active character.`,
    });
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const handleReset = () => {
    setPreviewOutfitId(savedOutfitId);
    setCameraAngle(defaultCameraAngle);
    setSyncStatus({
      type: 'info',
      message: 'Reverted preview to your last saved character.',
    });
    setTimeout(() => setSyncStatus(null), 2500);
  };

  return (
    <div className="aura-char-customizer-root is-embedded text-slate-100 font-sans">
      {/* Main Two-Column Beta Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: LIVE CHARACTER STAGE CARD */}
        <section
          className="lg:col-span-5 bg-[#0D1322] border border-slate-800/90 rounded-2xl p-5 shadow-2xl lg:sticky lg:top-20"
          style={{ padding: '22px' }}
        >
          {/* Card Header with balanced vertical spacing */}
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: '16px', gap: '12px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Live Character Stage
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  BETA
                </span>
              </div>
              <h2
                className="text-lg font-bold text-white truncate"
                style={{ margin: 0, lineHeight: 1.25 }}
                title={`${userName} • Lvl ${level}`}
              >
                {userName} • Lvl {level}
              </h2>
            </div>

            {/* Stage Camera Icon Controls (Head & Chest, Half-Body, Full-Body) */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Head & Chest Close-Up Camera Button */}
              <button
                type="button"
                onClick={zoomToHeadChest}
                className={`p-2 rounded-lg border text-xs transition shadow-sm ${
                  cameraAngle === 'headChest'
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                    : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={`Head & Chest Camera${defaultCameraAngle === 'headChest' ? ' (Default)' : ''}`}
                aria-label="Head & Chest Camera"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-4 h-4 ${
                    cameraAngle === 'headChest' ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
                </svg>
              </button>

              {/* Half-Body Camera Button */}
              <button
                type="button"
                onClick={zoomToUpperBody}
                className={`p-2 rounded-lg border text-xs transition shadow-sm ${
                  cameraAngle === 'upperBody'
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                    : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={`Half Body Camera${defaultCameraAngle === 'upperBody' ? ' (Default)' : ''}`}
                aria-label="Half Body Camera"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-4 h-4 ${
                    cameraAngle === 'upperBody' ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>

              {/* Full-Body Camera Button */}
              <button
                type="button"
                onClick={zoomToFullBody}
                className={`p-2 rounded-lg border text-xs transition shadow-sm ${
                  cameraAngle === 'full'
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                    : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={`Full Body Camera${defaultCameraAngle === 'full' ? ' (Default)' : ''}`}
                aria-label="Full Body Camera"
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`w-4 h-4 ${
                    cameraAngle === 'full' ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
            </div>
          </div>

          {/* Floating Saved Character Notification Toast */}
          {syncStatus && (
            <div
              role="status"
              aria-live="polite"
              style={{
                position: 'fixed',
                top: '84px',
                right: '28px',
                zIndex: 9999,
                maxWidth: '380px',
                width: 'calc(100vw - 40px)',
                padding: '12px 16px',
                borderRadius: '14px',
                background:
                  syncStatus.type === 'success'
                    ? 'rgba(6, 38, 29, 0.92)'
                    : 'rgba(23, 25, 65, 0.92)',
                border:
                  syncStatus.type === 'success'
                    ? '1px solid rgba(16, 185, 129, 0.55)'
                    : '1px solid rgba(99, 102, 241, 0.55)',
                boxShadow:
                  syncStatus.type === 'success'
                    ? '0 16px 36px rgba(0, 0, 0, 0.55), 0 0 24px rgba(16, 185, 129, 0.22)'
                    : '0 16px 36px rgba(0, 0, 0, 0.55), 0 0 24px rgba(99, 102, 241, 0.22)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                animation: 'betaToastFloatIn 0.28s cubic-bezier(0.22, 1, 0.36, 1) forwards',
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '999px',
                    background:
                      syncStatus.type === 'success'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(99, 102, 241, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-4 h-4 shrink-0 ${
                      syncStatus.type === 'success' ? 'text-emerald-400' : 'text-indigo-400'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                  {syncStatus.title && (
                    <span className="font-bold text-white text-xs leading-tight">
                      {syncStatus.title}
                    </span>
                  )}
                  <span className="text-[11px] text-slate-200 leading-tight">
                    {syncStatus.message}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSyncStatus(null)}
                className="text-xs font-semibold text-slate-300 opacity-75 hover:opacity-100 shrink-0"
                style={{ padding: '4px' }}
                aria-label="Dismiss notification"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main Character Stage Viewport with Home Background Image */}
          <div
            className="relative w-full h-[390px] rounded-2xl bg-gradient-to-b from-[#131B31] via-[#0E1424] to-[#090D18] border border-slate-800/80 flex items-center justify-center overflow-hidden p-3"
            style={{ height: '385px', maxHeight: '385px' }}
          >
            {/* Home Section Campus Background Image Behind Character */}
            <img
              src={homeBg}
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 25%',
                filter: 'brightness(0.72) contrast(1.06)',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            {/* Atmospheric Vignette & Depth Overlay */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(10, 13, 20, 0.45) 0%, rgba(10, 13, 20, 0.12) 40%, rgba(10, 13, 20, 0.78) 100%), radial-gradient(ellipse at 50% 38%, transparent 40%, rgba(10, 13, 20, 0.6) 100%)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            />

            <div
              className="camera-stage-viewport w-full h-full flex items-center justify-center"
              style={{
                position: 'relative',
                zIndex: 2,
                transform: BETA_CAMERA_TRANSFORMS[cameraAngle] || BETA_CAMERA_TRANSFORMS.headChest,
                transformOrigin: '50% 50%',
                willChange: 'transform',
              }}
            >
              <BetaCharacterStageRenderer
                outfitId={previewOutfitId}
                className="w-full h-full max-h-[405px]"
                style={{ maxHeight: '360px' }}
              />
            </div>
          </div>

          {/* Camera Angle & Save as Default Option Bar */}
          <div
            className="border-t border-slate-800/80 flex items-center justify-between text-xs"
            style={{
              marginTop: '16px',
              paddingTop: '14px',
              gap: '10px',
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-slate-400 shrink-0">Camera View:</span>
              <span className="font-semibold text-indigo-300 truncate">
                {BETA_CAMERA_LABELS[cameraAngle]}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleSaveDefaultCameraAngle(cameraAngle)}
              disabled={isCurrentCameraDefault}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition shrink-0 ${
                isCurrentCameraDefault
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 cursor-not-allowed'
                  : 'bg-slate-800/90 hover:bg-slate-700 border-indigo-500/50 text-indigo-200 hover:text-white cursor-pointer'
              }`}
              title={
                isCurrentCameraDefault
                  ? `${BETA_CAMERA_LABELS[cameraAngle]} is currently saved as your default camera angle`
                  : `Save ${BETA_CAMERA_LABELS[cameraAngle]} as your default camera angle`
              }
            >
              {isCurrentCameraDefault ? '✓ Default Camera' : 'Set as Default'}
            </button>
          </div>

          {/* Selected Character Info Row with clean vertical breathing room */}
          <div
            className="border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400"
            style={{
              marginTop: '12px',
              paddingTop: '12px',
              marginBottom: '14px',
              gap: '12px',
            }}
          >
            <span className="shrink-0">Selected Outfit:</span>
            <span className="font-semibold text-slate-200 truncate">{equippedItem.name}</span>
          </div>

          {/* Primary Equip & Reset Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSaveLoadout}
              disabled={!hasUnsavedChanges}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                hasUnsavedChanges
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white cursor-pointer'
                  : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed'
              }`}
            >
              <span>{hasUnsavedChanges ? 'Equip & Save Loadout' : 'Loadout Equipped'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={!hasUnsavedChanges}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 text-sm font-medium flex items-center gap-1.5 transition"
              title="Reset to Saved Configuration"
            >
              Reset
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: UNIFORM OUTFITS CATEGORY & CHARACTER CARDS */}
        <section className="lg:col-span-7 space-y-5">
          {/* Category Navigation Bar — Only Uniform Outfits enabled for Beta test */}
          <div className="bg-[#0D1322] border border-slate-800/90 rounded-2xl p-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setCameraAngle(defaultCameraAngle)}
                className="flex flex-col items-start p-2.5 rounded-xl border text-left transition-all bg-indigo-600/20 border-indigo-500 text-white shadow-md"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold text-indigo-400">👕</span>
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {BETA_CHARACTER_ITEMS.length}
                  </span>
                </div>
                <span className="text-xs font-bold leading-tight">Uniform Outfits</span>
                <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                  {equippedItem.name}
                </span>
              </button>
            </div>
          </div>

          {/* Category Header */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 bg-[#0D1322] border border-slate-800/90 rounded-2xl px-5 py-3.5"
            style={{ padding: '16px 20px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h3 className="text-base font-bold text-white" style={{ margin: 0 }}>
                Uniform Outfits
              </h3>
              <p className="text-xs text-slate-400" style={{ margin: 0 }}>
                Select a standalone character uniform below to preview and equip on your stage.
              </p>
            </div>
          </div>

          {/* Compact 3-Column Character Outfit Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {BETA_CHARACTER_ITEMS.map((item) => {
              const isSelected = previewOutfitId === item.id;
              const isSaved = savedOutfitId === item.id;
              const isEpic = item.rarity === 'Epic';

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectOutfit(item)}
                  className={`group relative rounded-2xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/40'
                      : 'bg-[#0D1322] border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-1.5 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isEpic
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-800/90 text-slate-300 border-slate-600'
                      }`}
                    >
                      {item.rarity}
                    </span>

                    {isSaved ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        ✓ Equipped
                      </span>
                    ) : isSelected ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-400/50">
                        Previewing
                      </span>
                    ) : null}
                  </div>

                  {/* Compact Image Thumbnail Box */}
                  <div
                    className="relative w-full h-32 p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-center overflow-hidden my-1 group-hover:border-slate-700 transition"
                    style={{ height: '136px', maxHeight: '136px' }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="select-none transition-transform group-hover:scale-105"
                      style={{
                        maxHeight: '120px',
                        maxWidth: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* Item Name, Description & Footer */}
                  <div
                    className="flex-1 flex flex-col justify-between w-full"
                    style={{ marginTop: '10px' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h4
                        className="text-sm font-bold text-white group-hover:text-indigo-300 transition"
                        style={{ margin: 0 }}
                      >
                        {item.name}
                      </h4>
                      <p
                        className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed"
                        style={{ margin: 0 }}
                      >
                        {item.description}
                      </p>
                    </div>

                    <div
                      className="border-t border-slate-800/80 flex items-center justify-between text-[10px]"
                      style={{ marginTop: '12px', paddingTop: '10px' }}
                    >
                      <span className="text-emerald-400 font-medium">{item.unlockRequirement}</span>
                      <span className="text-slate-400 font-semibold group-hover:text-white transition">
                        {isSelected ? 'Selected' : 'Select →'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
