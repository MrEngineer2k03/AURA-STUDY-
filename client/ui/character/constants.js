// ============================================================================
// COLOR PALETTES, RARITY TOKENS & DEFAULT CONFIGURATION
// ============================================================================

export const HAIR_COLORS = [
  { id: 'obsidian', name: 'Obsidian Black', primary: '#1E1E28', secondary: '#12121A', highlight: '#38384C' },
  { id: 'espresso', name: 'Dark Espresso', primary: '#3B2314', secondary: '#26150B', highlight: '#5C3A24' },
  { id: 'crimson', name: 'Engineering Crimson', primary: '#991B1B', secondary: '#650F0F', highlight: '#DC2626' },
  { id: 'amber', name: 'Honey Blonde', primary: '#D97706', secondary: '#92400E', highlight: '#F59E0B' },
  { id: 'cyber-blue', name: 'SQL Cyan', primary: '#0284C7', secondary: '#0369A1', highlight: '#38BDF8' },
  { id: 'archon-silver', name: 'Archon Silver', primary: '#CBD5E1', secondary: '#94A3B8', highlight: '#F8FAFC' },
  { id: 'violet', name: 'Arcane Violet', primary: '#6D28D9', secondary: '#4C1D95', highlight: '#8B5CF6' }
];

export const SKIN_TONES = [
  { id: 'porcelain', name: 'Porcelain Fair', base: '#FFE8DC', shadow: '#F5C6B0', blush: '#FB7185' },
  { id: 'warm-ivory', name: 'Warm Ivory', base: '#FCD7B8', shadow: '#E2B08C', blush: '#F43F5E' },
  { id: 'golden-tan', name: 'Golden Honey', base: '#DCA06E', shadow: '#B47846', blush: '#BE123C' },
  { id: 'deep-espresso', name: 'Rich Espresso', base: '#6C462C', shadow: '#462C1A', blush: '#9F1239' },
  { id: 'cyber-lumina', name: 'Lumina Synth', base: '#CBD5E1', shadow: '#94A3B8', blush: '#38BDF8' }
];

export const EYE_COLORS = [
  { id: 'indigo', name: 'Deep Scholar Indigo', main: '#3730A3', light: '#818CF8' },
  { id: 'amber', name: 'Golden Amber', main: '#B45309', light: '#FBBF24' },
  { id: 'emerald', name: 'Code Emerald', main: '#059669', light: '#34D399' },
  { id: 'crimson', name: 'Dean’s Crimson', main: '#991B1B', light: '#F87171' },
  { id: 'cyan', name: 'Overclock Cyan', main: '#0891B2', light: '#67E8F9' },
  { id: 'violet', name: 'Arcane Violet', main: '#5B21B6', light: '#A78BFA' }
];

export const RARITY_CONFIG = {
  Common: {
    badge: 'bg-slate-700/80 text-slate-200 border-slate-600',
    glow: '',
    cardBorder: 'border-slate-800 hover:border-slate-700'
  },
  Rare: {
    badge: 'bg-blue-900/70 text-blue-300 border-blue-500/40',
    glow: 'hover:shadow-[0_0_18px_rgba(59,130,246,0.25)]',
    cardBorder: 'border-blue-900/50 hover:border-blue-500/60'
  },
  Epic: {
    badge: 'bg-purple-900/70 text-purple-300 border-purple-500/40',
    glow: 'hover:shadow-[0_0_22px_rgba(168,85,247,0.3)]',
    cardBorder: 'border-purple-900/50 hover:border-purple-500/70'
  },
  Mythic: {
    badge: 'bg-gradient-to-r from-amber-600 to-rose-600 text-amber-100 border-amber-400/50',
    glow: 'hover:shadow-[0_0_26px_rgba(245,158,11,0.38)] animate-pulse',
    cardBorder: 'border-amber-500/60 hover:border-amber-400'
  }
};

export const DEFAULT_EQUIPMENT = {
  hairstyle: 'hair-short-messy',
  hairColor: 'obsidian',
  skinTone: 'warm-ivory',
  eyeColor: 'indigo',
  upperOutfit: 'top-engineering-uniform',
  lowerOutfit: 'Bottom-black-trousers',
  shoes: 'shoes-high-tops',
  faceAccessory: 'acc-blue-light-glasses',
  lanyard: 'lanyard-engineering-id',
  specialEffect: 'special-dept-pin',
  frame: 'frame-crimson-eng'
};

export const STORAGE_KEY = 'aura_student_character_equipment_v2';

