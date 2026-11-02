/**
 * Shared helpers for the Home bottom dashboard section
 * (Continue Studying, My Study Folders, Upcoming Events).
 */

/** localStorage key written by the My Folders page (single source of truth for folder data). */
export const FOLDER_STORAGE_KEY = 'aura_study_folders_v6';

/** Subject accent palette – kept intentionally small to avoid visual noise. */
export const ACCENTS = {
  red: { hex: '#ff2a44', rgb: '255, 42, 68' },
  blue: { hex: '#3b82f6', rgb: '59, 130, 246' },
  purple: { hex: '#a855f7', rgb: '168, 85, 247' },
  green: { hex: '#10b981', rgb: '16, 185, 129' },
  orange: { hex: '#f59e0b', rgb: '245, 158, 11' },
  cyan: { hex: '#06b6d4', rgb: '6, 182, 212' },
};

export function getAccent(color) {
  return ACCENTS[(color || 'red').toLowerCase()] || ACCENTS.red;
}

/** CSS custom properties used by cards to tint icons, badges, bars, and buttons. */
export function accentStyle(color) {
  const accent = getAccent(color);
  return { '--hb-accent': accent.hex, '--hb-accent-rgb': accent.rgb };
}

/** Reads the persisted folders created/edited on the My Folders page. */
export function loadStoredFolders() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(FOLDER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('[AURA] Unable to read stored folders', e);
    return [];
  }
}

export function isActiveFolder(folder) {
  return Boolean(folder) && !folder.isArchived && folder.status?.toLowerCase() !== 'archived';
}

/**
 * Converts relative "last studied" labels ("Just now", "5h ago", "Yesterday", "3d ago")
 * or timestamps into minutes-ago so folders can be ordered by recency.
 */
export function minutesSinceStudied(folder) {
  if (!folder) return Number.MAX_SAFE_INTEGER;
  if (typeof folder.lastAccessedAt === 'number') {
    return Math.max(0, (Date.now() - folder.lastAccessedAt) / 60000);
  }
  const label = String(folder.lastStudied || '').trim().toLowerCase();
  if (!label) return Number.MAX_SAFE_INTEGER;
  if (label === 'just now' || label === 'now') return 0;
  if (label === 'today') return 60;
  if (label === 'yesterday') return 60 * 24;
  const match = label.match(/(\d+)\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days|w|wk|week|weeks)\b/);
  if (!match) return Number.MAX_SAFE_INTEGER - 1;
  const value = Number(match[1]);
  const unit = match[2][0];
  if (unit === 'm') return value;
  if (unit === 'h') return value * 60;
  if (unit === 'd') return value * 60 * 24;
  if (unit === 'w') return value * 60 * 24 * 7;
  return Number.MAX_SAFE_INTEGER - 1;
}

export function sortByRecent(folders) {
  return [...folders].sort((a, b) => minutesSinceStudied(a) - minutesSinceStudied(b));
}

export function getCompletedLessons(folder) {
  if (typeof folder.completedLessons === 'number') return folder.completedLessons;
  if (typeof folder.completed === 'number') return folder.completed;
  const lessons = folder.lessons || 0;
  return Math.round(((folder.progress || 0) / 100) * lessons);
}

export function getFlashcardCount(folder) {
  if (Array.isArray(folder.flashcards)) return folder.flashcards.length;
  if (typeof folder.cards === 'number') return folder.cards;
  return 0;
}

/** Normalised status used for the badge: New | In Progress | Completed | Shared */
export function getFolderStatus(folder) {
  const raw = (folder.status || '').toLowerCase();
  if (raw.includes('shared') || folder.isShared) return { key: 'shared', label: 'Shared' };
  if (raw.includes('complete') || (folder.progress || 0) >= 100) return { key: 'completed', label: 'Completed' };
  if (raw.includes('new') || (folder.progress || 0) === 0) return { key: 'new', label: 'New' };
  return { key: 'progress', label: 'In Progress' };
}

/** Label for the per-folder action button. */
export function getFolderActionLabel(folder) {
  const status = getFolderStatus(folder).key;
  if (status === 'completed') return 'Review';
  if (status === 'new') return 'Start';
  return 'Continue';
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

