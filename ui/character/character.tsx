// @ts-nocheck
/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useMemo } from 'react';
import './character.css';
import baseCharacterImg from './Character Outfits/Base/Base Character 1.png';
import epicCharacterOutfitImg from './Character Outfits/Uniform Outfits/Epic Character Outfit.png';
import epicCharacterOutfitHomeImg from './Character Outfits/Character Home Display Outfits/epic character outfit home.png';

export const BETA_STORAGE_KEY = 'aura_beta_character_outfit_v2';
export const BETA_ACTIVE_STORAGE_KEY = 'aura_beta_character_active_across_app_v1';

export function getSavedBetaCharacterState() {
  try {
    const isActive = localStorage.getItem(BETA_ACTIVE_STORAGE_KEY) === 'true';
    const outfitId = localStorage.getItem(BETA_STORAGE_KEY) || 'epic-character-outfit';
    return { isActive, outfitId };
  } catch {
    return { isActive: false, outfitId: 'epic-character-outfit' };
  }
}

export function useBetaCharacterState() {
  const [betaState, setBetaState] = useState(getSavedBetaCharacterState);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e?.detail && typeof e.detail.active === 'boolean') {
        setBetaState({
          isActive: e.detail.active,
          outfitId: e.detail.outfitId || localStorage.getItem(BETA_STORAGE_KEY) || 'epic-character-outfit',
        });
      } else {
        setBetaState(getSavedBetaCharacterState());
      }
    };
    window.addEventListener('aura-beta-character-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('aura-beta-character-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return betaState;
}

// ============================================================================
// 0. SELF-CONTAINED SVG ICON COMPONENTS (Zero External Icon Dependency)
// ============================================================================
const IconBase = ({ className = 'w-4 h-4', children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const Sparkles = ({ className }) => (
  <IconBase className={className}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4M22 5h-4M4 17v2M5 18H3" />
  </IconBase>
);
const Lock = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </IconBase>
);
const Check = ({ className }) => (
  <IconBase className={className}>
    <polyline points="20 6 9 17 4 12" />
  </IconBase>
);
const RotateCcw = ({ className }) => (
  <IconBase className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </IconBase>
);
const Save = ({ className }) => (
  <IconBase className={className}>
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
    <polyline points="7 3 7 8 15 8" />
  </IconBase>
);
const User = ({ className }) => (
  <IconBase className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </IconBase>
);
const Shirt = ({ className }) => (
  <IconBase className={className}>
    <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  </IconBase>
);
const Footprints = ({ className }) => (
  <IconBase className={className}>
    <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
    <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
    <path d="M16 17h4M4 13h4" />
  </IconBase>
);
const Glasses = ({ className }) => (
  <IconBase className={className}>
    <circle cx="6" cy="15" r="4" />
    <circle cx="18" cy="15" r="4" />
    <path d="M14 15a2 2 0 0 0-4 0" />
    <path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2" />
    <path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2" />
  </IconBase>
);
const Award = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </IconBase>
);
const Frame = ({ className }) => (
  <IconBase className={className}>
    <line x1="22" y1="6" x2="2" y2="6" />
    <line x1="22" y1="18" x2="2" y2="18" />
    <line x1="6" y1="2" x2="6" y2="22" />
    <line x1="18" y1="2" x2="18" y2="22" />
  </IconBase>
);
const Eye = ({ className }) => (
  <IconBase className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);
const ZoomIn = ({ className }) => (
  <IconBase className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </IconBase>
);
const ZoomOut = ({ className }) => (
  <IconBase className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </IconBase>
);
const Layers = ({ className }) => (
  <IconBase className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </IconBase>
);
const Trophy = ({ className }) => (
  <IconBase className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
    <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </IconBase>
);
const CheckCircle2 = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </IconBase>
);
const AlertCircle = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </IconBase>
);
const Palette = ({ className }) => (
  <IconBase className={className}>
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </IconBase>
);

// ============================================================================
// 1. COLOR PALETTES & DESIGN TOKENS
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
  { id: 'porcelain', name: 'Porcelain', base: '#FFE9DC', shadow: '#F3C6B0', blush: '#FDA4AF' },
  { id: 'warm-ivory', name: 'Warm Ivory', base: '#FCD7BD', shadow: '#E3B091', blush: '#FB7185' },
  { id: 'sand', name: 'Golden Sand', base: '#EAB68C', shadow: '#C98F63', blush: '#F43F5E' },
  { id: 'honey', name: 'Warm Honey', base: '#C68652', shadow: '#9E6234', blush: '#E11D48' },
  { id: 'espresso-skin', name: 'Deep Espresso', base: '#7F4B2B', shadow: '#5B3218', blush: '#BE123C' }
];

export const EYE_COLORS = [
  { id: 'indigo', name: 'AURA Indigo', main: '#4F46E5', light: '#818CF8' },
  { id: 'emerald', name: 'Code Emerald', main: '#059669', light: '#34D399' },
  { id: 'crimson', name: 'Raid Crimson', main: '#E11D48', light: '#FB7185' },
  { id: 'amber', name: 'Scholar Gold', main: '#D97706', light: '#FBBF24' },
  { id: 'obsidian', name: 'Dark Onyx', main: '#1E293B', light: '#64748B' }
];

export const RARITY_CONFIG = {
  Common: {
    badge: 'bg-slate-800 text-slate-300 border-slate-600',
    cardBorder: 'border-slate-700/80 hover:border-slate-500',
    glow: '',
    accent: '#94A3B8'
  },
  Rare: {
    badge: 'bg-sky-950/90 text-sky-300 border-sky-500/50',
    cardBorder: 'border-sky-500/40 hover:border-sky-400',
    glow: 'shadow-[0_0_15px_-3px_rgba(56,189,248,0.2)]',
    accent: '#38BDF8'
  },
  Epic: {
    badge: 'bg-purple-950/90 text-purple-300 border-purple-500/50',
    cardBorder: 'border-purple-500/40 hover:border-purple-400',
    glow: 'shadow-[0_0_18px_-3px_rgba(168,85,247,0.28)]',
    accent: '#A855F7'
  },
  Mythic: {
    badge: 'bg-amber-950/90 text-amber-300 border-amber-400/60',
    cardBorder: 'border-amber-400/50 hover:border-amber-300',
    glow: 'shadow-[0_0_22px_-3px_rgba(251,191,36,0.35)]',
    accent: '#FBBF24'
  }
};

// ============================================================================
// 2. CENTRALIZED DATA-DRIVEN EQUIPMENT REGISTRY
// ============================================================================
export const EQUIPMENT_REGISTRY = [
  // -------------------- A. HAIRSTYLES --------------------
  {
    id: 'hair-short-messy',
    name: 'Short Student Cut',
    category: 'hairstyle',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default Starter Item',
    description: 'Clean everyday textured student cut that stays out of your eyes during late-night study sessions.'
  },
  {
    id: 'hair-medium-layered',
    name: 'Medium Layered Flow',
    category: 'hairstyle',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default Starter Item',
    description: 'Relaxed shoulder-grazing layered locks with soft framing bangs.'
  },
  {
    id: 'hair-long-flowing',
    name: 'Long Flowing Locks',
    category: 'hairstyle',
    rarity: 'Rare',
    defaultUnlocked: true,
    unlockRequirement: 'Reach Study Level 5',
    description: 'Full-length flowing hair with a dual-layer rear cascade behind the shoulders.'
  },
  {
    id: 'hair-curly-volume',
    name: 'Textured Curly Crown',
    category: 'hairstyle',
    rarity: 'Rare',
    defaultUnlocked: true,
    unlockRequirement: '7-Day Study Streak',
    description: 'High-volume sculpted curls with dynamic bounce and silhouette.'
  },
  {
    id: 'hair-side-part',
    name: 'Honor Roll Side-Part',
    category: 'hairstyle',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default Starter Item',
    description: 'Sharp, combed side-part favored by student council officers and debate captains.'
  },
  {
    id: 'hair-modern-twoblock',
    name: 'Modern Two-Block Cut',
    category: 'hairstyle',
    rarity: 'Epic',
    defaultUnlocked: false,
    unlockRequirement: '14-Day Focus Streak Reward',
    description: 'Trendy campus two-block silhouette with swept curtain bangs and tapered sides.'
  },

  // -------------------- B. UPPER BODY CLOTHING --------------------
  {
    id: 'top-basic-tee',
    name: 'Classic AURA Crew Tee',
    category: 'upperOutfit',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default Starter Item',
    description: 'Breathable cotton crewneck tee with stitched collar trim and subtle chest emblem.'
  },
  {
    id: 'top-campus-polo',
    name: 'Smart Campus Polo',
    category: 'upperOutfit',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Complete Onboarding Quiz',
    description: 'Collared pique polo shirt with two-button placket and cuffed short sleeves.'
  },
  {
    id: 'top-engineering-uniform',
    name: 'Crimson Engineering Jacket',
    category: 'upperOutfit',
    rarity: 'Epic',
    defaultUnlocked: true,
    unlockRequirement: 'Engineering Week Event',
    description: 'Structured crimson technical field jacket with utility chest pockets, gold piping, and high collar.'
  },
  {
    id: 'top-university-jacket',
    name: 'AURA University Windbreaker',
    category: 'upperOutfit',
    rarity: 'Rare',
    defaultUnlocked: true,
    unlockRequirement: 'Level 10 Milestone',
    description: 'Two-tone zip windbreaker featuring angled chevron panels and high-visibility trim.'
  },
  {
    id: 'top-varsity-jacket',
    name: 'First-String Varsity Jacket',
    category: 'upperOutfit',
    rarity: 'Epic',
    defaultUnlocked: false,
    unlockRequirement: 'Inter-Dept Tournament Top 10',
    description: 'Heavyweight wool body with cream leather sleeves, ribbed varsity stripes, and chenille "A" patch.'
  },
  {
    id: 'top-data-hoodie',
    name: 'Data Architect Hoodie',
    category: 'upperOutfit',
    rarity: 'Epic',
    defaultUnlocked: false,
    unlockRequirement: 'SQL & Database Speedrun Cup',
    description: 'Oversized cyber-slate pullover hoodie with neon cyan drawstrings, kangaroo pocket, and circuit sleeves.'
  },
  {
    id: 'top-formal-blazer',
    name: 'Deanâ€™s List Blazer & Tie',
    category: 'upperOutfit',
    rarity: 'Rare',
    defaultUnlocked: true,
    unlockRequirement: 'Complete 25 Pomodoro Sessions',
    description: 'Tailored navy academy blazer over a crisp white dress shirt with a crimson silk necktie.'
  },
  {
    id: 'top-archon-scholar',
    name: 'Archon Scholar Mantle',
    category: 'upperOutfit',
    rarity: 'Mythic',
    defaultUnlocked: false,
    unlockRequirement: 'Midterm Boss Raid Victor',
    description: 'Ornate gold-trimmed astral scholar coat with layered shoulder capelet and glowing arcane sigils.'
  },

  // -------------------- C. LOWER BODY CLOTHING --------------------
  {
    id: 'Bottom-black-trousers',
    name: 'Tailored Black Trousers',
    category: 'lowerOutfit',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default Starter Item',
    description: 'Clean straight-cut dark trousers that pair effortlessly with any campus top.'
  },
  {
    id: 'Bottom-classic-jeans',
    name: 'Indigo Selvedge Jeans',
    category: 'lowerOutfit',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default Starter Item',
    description: 'Durable medium-wash denim jeans with contrast stitching and rolled cuffs.'
  },
  {
    id: 'Bottom-tech-joggers',
    name: 'Cargo Tech Joggers',
    category: 'lowerOutfit',
    rarity: 'Rare',
    defaultUnlocked: true,
    unlockRequirement: '7-Day Study Streak',
    description: 'Tapered athletic joggers with side utility pockets and ribbed ankle cuffs.'
  },
  {
    id: 'Bottom-campus-shorts',
    name: 'Relaxed Chino Shorts',
    category: 'lowerOutfit',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default Starter Item',
    description: 'Breezy knee-length khaki chino shorts showing lower leg proportions.'
  },
  {
    id: 'Bottom-formal-slacks',
    name: 'Pleated Academy Slacks',
    category: 'lowerOutfit',
    rarity: 'Rare',
    defaultUnlocked: false,
    unlockRequirement: 'Thesis Defense Milestone',
    description: 'Charcoal wool-blend dress slacks with center crease and brass belt buckle.'
  },

  // -------------------- D. SHOES --------------------
  {
    id: 'shoes-basic-sneakers',
    name: 'Classic Low Canvas',
    category: 'shoes',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default Starter Item',
    description: 'Timeless white-and-slate low-top sneakers with vulcanized rubber soles.'
  },
  {
    id: 'shoes-running',
    name: 'Velocity Runners',
    category: 'shoes',
    rarity: 'Rare',
    defaultUnlocked: true,
    unlockRequirement: 'Complete 10 Morning Sessions',
    description: 'Aerodynamic mesh running shoes with cushioned neon midsole.'
  },
  {
    id: 'shoes-high-tops',
    name: 'Crimson Court High-Tops',
    category: 'shoes',
    rarity: 'Epic',
    defaultUnlocked: true,
    unlockRequirement: 'Engineering Week Event',
    description: 'Retro ankle-strapped basketball high-tops in signature crimson, black, and white.'
  },
  {
    id: 'shoes-formal-oxford',
    name: 'Polished Oxford Brogues',
    category: 'shoes',
    rarity: 'Rare',
    defaultUnlocked: true,
    unlockRequirement: 'Level 8 Milestone',
    description: 'Hand-burnished dark leather dress shoes with stacked heel.'
  },
  {
    id: 'shoes-cyber-kicks',
    name: 'Limited SQL Cyber Kicks',
    category: 'shoes',
    rarity: 'Mythic',
    defaultUnlocked: false,
    unlockRequirement: 'SQL & Database Speedrun Cup',
    description: 'Self-lacing futuristic high-tops with electroluminescent cyan sole waveguides.'
  },

  // -------------------- E. FACE ACCESSORIES --------------------
  {
    id: 'acc-none',
    name: 'No Eyewear / Audio',
    category: 'faceAccessory',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default',
    description: 'Clear, unobstructed face view.'
  },
  {
    id: 'acc-blue-light-glasses',
    name: 'Blue-Light Study Frames',
    category: 'faceAccessory',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default Starter Item',
    description: 'Anti-glare optical glasses with subtle cyan lens reflection for marathon coding.'
  },
  {
    id: 'acc-retro-sunglasses',
    name: 'Club President Shades',
    category: 'faceAccessory',
    rarity: 'Rare',
    defaultUnlocked: true,
    unlockRequirement: 'Join a Study Guild',
    description: 'Dark tinted angular frames with gold nose bridge.'
  },
  {
    id: 'acc-studio-headphones',
    name: 'Lo-Fi Beats Headphones',
    category: 'faceAccessory',
    rarity: 'Epic',
    defaultUnlocked: true,
    unlockRequirement: '50 Hours Focus Music Logged',
    description: 'Over-ear studio monitor headphones wrapping seamlessly over the head with glowing earcups.'
  },
  {
    id: 'acc-wireless-earbuds',
    name: 'ANC Pro Earbuds',
    category: 'faceAccessory',
    rarity: 'Rare',
    defaultUnlocked: false,
    unlockRequirement: 'Level 12 Milestone',
    description: 'Sleek pearl-white active noise-cancelling stems tucked neatly into the ears.'
  },

  // -------------------- F. LANYARDS & ID --------------------
  {
    id: 'lanyard-none',
    name: 'No Lanyard',
    category: 'lanyard',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default',
    description: 'Keep your collar and chest area uncluttered.'
  },
  {
    id: 'lanyard-engineering-id',
    name: 'Engineering Red Lanyard',
    category: 'lanyard',
    rarity: 'Rare',
    defaultUnlocked: true,
    unlockRequirement: 'Engineering Week Event',
    description: 'Crimson woven strap with metallic clip and barcoded College of Engineering ID badge.'
  },
  {
    id: 'lanyard-cs-binary',
    name: 'CS Binary Pass',
    category: 'lanyard',
    rarity: 'Epic',
    defaultUnlocked: false,
    unlockRequirement: 'SQL & Database Speedrun Cup',
    description: 'Dark matrix strap with glowing cyan smart-chip Lab Access card.'
  },
  {
    id: 'lanyard-gold-honor',
    name: 'Summa Cum Laude Cord',
    category: 'lanyard',
    rarity: 'Mythic',
    defaultUnlocked: false,
    unlockRequirement: 'Maintain 95%+ Quiz Accuracy',
    description: 'Braided royal gold honor lanyard with holographic Scholar Crest ID.'
  },

  // -------------------- G. SPECIAL EQUIPMENT (BACK & FRONT) --------------------
  {
    id: 'special-none',
    name: 'No Special Equipment',
    category: 'specialEffect',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default',
    description: 'Standard student gear with no extra aura or companion.'
  },
  {
    id: 'special-dept-pin',
    name: 'Golden Gear & Chrono Set',
    category: 'specialEffect',
    rarity: 'Rare',
    defaultUnlocked: true,
    unlockRequirement: 'Engineering Week Event',
    description: 'Equips an embossed Department Crest pin on the chest and a smart study chrono watch on the wrist.'
  },
  {
    id: 'special-sql-nodes',
    name: 'Database Champion Aura',
    category: 'specialEffect',
    rarity: 'Epic',
    defaultUnlocked: false,
    unlockRequirement: 'SQL & Database Speedrun Cup',
    description: 'Floating holographic SQL schema nodes and binary telemetry orbiting behind your character.'
  },
  {
    id: 'special-archon-halo',
    name: 'Archon Astral Wings & Halo',
    category: 'specialEffect',
    rarity: 'Mythic',
    defaultUnlocked: false,
    unlockRequirement: 'Midterm Boss Raid Victor',
    description: 'Manifests a radiant celestial crown halo, floating shoulder owl familiar, and mythic energy wings.'
  },

  // -------------------- H. CHARACTER FRAMES --------------------
  {
    id: 'frame-default',
    name: 'AURA Standard Ring',
    category: 'frame',
    rarity: 'Common',
    defaultUnlocked: true,
    unlockRequirement: 'Default Starter Item',
    description: 'Clean slate-and-indigo border ring with level indicator pill.'
  },
  {
    id: 'frame-crimson-eng',
    name: 'Engineering Department Frame',
    category: 'frame',
    rarity: 'Epic',
    defaultUnlocked: true,
    unlockRequirement: 'Engineering Week Event',
    description: 'Forged crimson-and-brass mechanical gear border with precision rivets.'
  },
  {
    id: 'frame-sql-champion',
    name: 'Database Speedrun Frame',
    category: 'frame',
    rarity: 'Epic',
    defaultUnlocked: false,
    unlockRequirement: 'SQL & Database Speedrun Cup',
    description: 'Hexagonal neon cyan circuit frame with live telemetry accents.'
  },
  {
    id: 'frame-archon-mythic',
    name: 'Archon Raid Sovereign Frame',
    category: 'frame',
    rarity: 'Mythic',
    defaultUnlocked: false,
    unlockRequirement: 'Midterm Boss Raid Victor',
    description: 'Luminous gold filigree frame crowned with mythic gemstones and sovereign wings.'
  }
];

// Default backwards-compatible AURA equipment configuration
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

// Safe Fallback Resolver so missing or corrupted item IDs never break rendering
export function resolveSafeEquipment(rawConfig = {}) {
  const cfg = rawConfig || {};
  const validIds = new Set(EQUIPMENT_REGISTRY.map(i => i.id));
  const check = (val, fallback) => (val && validIds.has(val) ? val : fallback);

  return {
    hairstyle: check(cfg.hairstyle, DEFAULT_EQUIPMENT.hairstyle),
    hairColor: HAIR_COLORS.some(c => c.id === cfg.hairColor) ? cfg.hairColor : DEFAULT_EQUIPMENT.hairColor,
    skinTone: SKIN_TONES.some(s => s.id === cfg.skinTone) ? cfg.skinTone : DEFAULT_EQUIPMENT.skinTone,
    eyeColor: EYE_COLORS.some(e => e.id === cfg.eyeColor) ? cfg.eyeColor : DEFAULT_EQUIPMENT.eyeColor,
    upperOutfit: check(cfg.upperOutfit, DEFAULT_EQUIPMENT.upperOutfit),
    lowerOutfit: check(cfg.lowerOutfit, DEFAULT_EQUIPMENT.lowerOutfit),
    shoes: check(cfg.shoes, DEFAULT_EQUIPMENT.shoes),
    faceAccessory: check(cfg.faceAccessory, DEFAULT_EQUIPMENT.faceAccessory),
    lanyard: check(cfg.lanyard, DEFAULT_EQUIPMENT.lanyard),
    specialEffect: check(cfg.specialEffect, DEFAULT_EQUIPMENT.specialEffect),
    frame: check(cfg.frame, DEFAULT_EQUIPMENT.frame)
  };
}

export function getEquipmentItemById(id) {
  return EQUIPMENT_REGISTRY.find(i => i.id === id) || null;
}

export function getFrameConfig(frameId) {
  switch (frameId) {
    case 'frame-archon-mythic':
    case 'frame-golden-halo':
      return {
        id: 'frame-archon-mythic',
        name: 'Archon Raid Sovereign Frame',
        gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        glow: '0 0 22px rgba(245, 158, 11, 0.45)',
        color: '#f59e0b',
        border: '#fbbf24',
      };
    case 'frame-sql-champion':
      return {
        id: 'frame-sql-champion',
        name: 'Database Speedrun Frame',
        gradient: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
        glow: '0 0 22px rgba(6, 182, 212, 0.45)',
        color: '#06b6d4',
        border: '#22d3ee',
      };
    case 'frame-crimson-eng':
      return {
        id: 'frame-crimson-eng',
        name: 'Engineering Department Frame',
        gradient: 'linear-gradient(135deg, #ff2a44 0%, #dc2626 50%, #991b1b 100%)',
        glow: '0 0 22px rgba(255, 42, 68, 0.45)',
        color: '#ff2a44',
        border: '#ef4444',
      };
    case 'frame-default':
    default:
      return {
        id: 'frame-default',
        name: 'AURA Standard Ring',
        gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
        glow: '0 0 22px rgba(99, 102, 241, 0.45)',
        color: '#6366f1',
        border: '#818cf8',
      };
  }
}

// ============================================================================
// 3. MODULAR SVG LAYER COMPONENTS (Shared Coordinate System: 0 0 400 520)
// ============================================================================

/**
 * LAYER 1: Background & Aura Environment
 */
const CharacterEnvironmentLayer = ({ frameId }) => {
  const glowColor =
    frameId === 'frame-crimson-eng' ? '#EF4444' :
    frameId === 'frame-sql-champion' ? '#06B6D4' :
    frameId === 'frame-archon-mythic' ? '#F59E0B' : '#6366F1';

  return (
    <g id="layer-01-environment">
      <defs>
        <radialGradient id="auraStageGlow" cx="50%" cy="42%" r="52%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.28" />
          <stop offset="65%" stopColor="#1E1B4B" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#090D16" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floorShadow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="50%" stopColor="#000" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Ambient Backdrop Circle */}
      <circle cx="200" cy="220" r="175" fill="url(#auraStageGlow)" />
      {/* Subtle Grid Ring */}
      <circle cx="200" cy="195" r="138" fill="none" stroke={glowColor} strokeOpacity="0.16" strokeWidth="1.5" strokeDasharray="6 6" />
      {/* Ground Platform Shadow */}
      <ellipse cx="200" cy="492" rx="86" ry="14" fill="url(#floorShadow)" />
      <ellipse cx="200" cy="492" rx="64" ry="8" fill={glowColor} fillOpacity="0.15" />
    </g>
  );
};

/**
 * LAYER 2: Back Accessories & Special Effects
 */
const CharacterBackAccessoriesLayer = ({ specialId }) => {
  if (specialId === 'special-sql-nodes') {
    return (
      <g id="layer-02-back-special" strokeLinecap="round" strokeLinejoin="round">
        {/* Orbiting SQL Telemetry Ring & Floating Schema Nodes */}
        <ellipse cx="200" cy="225" rx="145" ry="52" fill="none" stroke="#22D3EE" strokeWidth="2" strokeDasharray="8 6" opacity="0.65" transform="rotate(-14 200 225)" />
        {/* Left Floating DB Node */}
        <g transform="translate(56, 150)">
          <rect x="0" y="0" width="46" height="54" rx="8" fill="#083344" stroke="#22D3EE" strokeWidth="2.5" />
          <line x1="8" y1="16" x2="38" y2="16" stroke="#67E8F9" strokeWidth="2.5" />
          <line x1="8" y1="28" x2="30" y2="28" stroke="#22D3EE" strokeWidth="2" />
          <circle cx="35" cy="40" r="4" fill="#34D399" />
          <text x="8" y="43" fill="#A5F3FC" fontSize="9" fontWeight="bold" fontFamily="monospace">SQL</text>
        </g>
        {/* Right Floating DB Cylinder */}
        <g transform="translate(296, 130)">
          <path d="M4,12 C4,6 44,6 44,12 L44,44 C44,50 4,50 4,44 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
          <ellipse cx="24" cy="12" rx="20" ry="6" fill="#0284C7" stroke="#7DD3FC" strokeWidth="2" />
          <path d="M4,24 C4,30 44,30 44,24" fill="none" stroke="#38BDF8" strokeWidth="2" />
          <path d="M4,35 C4,41 44,41 44,35" fill="none" stroke="#38BDF8" strokeWidth="2" />
        </g>
      </g>
    );
  }

  if (specialId === 'special-archon-halo') {
    return (
      <g id="layer-02-back-archon">
        {/* Celestial Crown Halo Behind Head */}
        <circle cx="200" cy="115" r="76" fill="none" stroke="#FBBF24" strokeWidth="3" opacity="0.85" />
        <circle cx="200" cy="115" r="84" fill="none" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="4 8" />
        {/* Radiant Star Points */}
        <polygon points="200,22 206,38 194,38" fill="#FBBF24" />
        <polygon points="108,115 124,109 124,121" fill="#FBBF24" />
        <polygon points="292,115 276,109 276,121" fill="#FBBF24" />
        {/* Astral Energy Wings Behind Torso */}
        <path
          d="M145,235 C95,205 60,160 48,115 C78,128 112,152 135,185 C98,175 68,162 55,148 C82,182 110,208 142,228 Z"
          fill="#F59E0B"
          fillOpacity="0.32"
          stroke="#FBBF24"
          strokeWidth="2.5"
        />
        <path
          d="M255,235 C305,205 340,160 352,115 C322,128 288,152 265,185 C302,175 332,162 345,148 C318,182 290,208 258,228 Z"
          fill="#F59E0B"
          fillOpacity="0.32"
          stroke="#FBBF24"
          strokeWidth="2.5"
        />
      </g>
    );
  }

  return null;
};

/**
 * LAYER 3: Rear Hair (For long or medium hairstyles that fall behind the neck/shoulders)
 */
const CharacterRearHairLayer = ({ hairstyleId, hairPalette }) => {
  if (hairstyleId === 'hair-long-flowing') {
    return (
      <g id="layer-03-rear-hair" stroke="#14141F" strokeWidth="3" strokeLinejoin="round">
        <path
          d="M138,115 C120,155 112,225 118,282 C128,288 144,285 152,275 L156,185 L244,185 L248,275 C256,285 272,288 282,282 C288,225 280,155 262,115 Z"
          fill={hairPalette.secondary}
        />
        {/* Inner shadow strands */}
        <path d="M132,175 C126,215 128,252 134,276" fill="none" stroke={hairPalette.primary} strokeWidth="4" />
        <path d="M268,175 C274,215 272,252 266,276" fill="none" stroke={hairPalette.primary} strokeWidth="4" />
      </g>
    );
  }

  if (hairstyleId === 'hair-medium-layered') {
    return (
      <g id="layer-03-rear-hair-medium" stroke="#14141F" strokeWidth="3" strokeLinejoin="round">
        <path
          d="M140,128 C128,162 126,204 134,226 C144,230 156,225 162,216 L238,216 C244,225 256,230 266,226 C274,204 272,162 260,128 Z"
          fill={hairPalette.secondary}
        />
      </g>
    );
  }

  if (hairstyleId === 'hair-curly-volume') {
    return (
      <g id="layer-03-rear-hair-curly" stroke="#14141F" strokeWidth="3">
        <circle cx="136" cy="122" r="28" fill={hairPalette.secondary} />
        <circle cx="264" cy="122" r="28" fill={hairPalette.secondary} />
        <circle cx="142" cy="154" r="22" fill={hairPalette.secondary} />
        <circle cx="258" cy="154" r="22" fill={hairPalette.secondary} />
      </g>
    );
  }

  return null;
};

/**
 * LAYER 4: Body Base, Arms, Hands & Legs
 */
const CharacterBaseLayer = ({ skinPalette }) => {
  return (
    <g id="layer-04-body-base" stroke="#181824" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {/* Left & Right Lower Legs (visible when wearing shorts) */}
      <rect x="160" y="340" width="28" height="118" rx="12" fill={skinPalette.base} />
      <rect x="212" y="340" width="28" height="118" rx="12" fill={skinPalette.base} />
      {/* Knee shading */}
      <path d="M167,395 Q174,400 181,395" fill="none" stroke={skinPalette.shadow} strokeWidth="2.5" />
      <path d="M219,395 Q226,400 233,395" fill="none" stroke={skinPalette.shadow} strokeWidth="2.5" />

      {/* White Crew Socks */}
      <rect x="160" y="432" width="28" height="28" fill="#F8FAFC" />
      <line x1="160" y1="440" x2="188" y2="440" stroke="#EF4444" strokeWidth="2.5" />
      <rect x="212" y="432" width="28" height="28" fill="#F8FAFC" />
      <line x1="212" y1="440" x2="240" y2="440" stroke="#EF4444" strokeWidth="2.5" />

      {/* Torso Under-Base */}
      <path
        d="M154,196 L246,196 L242,340 L158,340 Z"
        fill={skinPalette.base}
      />

      {/* Left Arm & Hand */}
      <path
        d="M148,204 C132,225 126,275 128,325 C128,336 146,336 148,325 L156,245 Z"
        fill={skinPalette.base}
      />
      <circle cx="137" cy="334" r="12" fill={skinPalette.base} />
      <path d="M142,331 C146,334 146,340 142,342" fill="none" stroke={skinPalette.shadow} strokeWidth="2" />

      {/* Right Arm & Hand */}
      <path
        d="M252,204 C268,225 274,275 272,325 C272,336 254,336 252,325 L244,245 Z"
        fill={skinPalette.base}
      />
      <circle cx="263" cy="334" r="12" fill={skinPalette.base} />
      <path d="M258,331 C254,334 254,340 258,342" fill="none" stroke={skinPalette.shadow} strokeWidth="2" />
    </g>
  );
};

/**
 * LAYER 5: Lower Body Clothing (CharacterPants)
 */
const CharacterPantsLayer = ({ pantsId }) => {
  switch (pantsId) {
    case 'Bottom-classic-jeans':
      return (
        <g id="layer-05-pants-jeans" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M154,328 L246,328 L244,454 L210,454 L204,368 L196,368 L190,454 L156,454 Z"
            fill="#2563EB"
          />
          {/* Denim Seam & Pockets */}
          <line x1="200" y1="328" x2="200" y2="368" stroke="#1D4ED8" strokeWidth="2.5" />
          <path d="M156,342 Q170,352 176,334" fill="none" stroke="#93C5FD" strokeWidth="2" />
          <path d="M244,342 Q230,352 224,334" fill="none" stroke="#93C5FD" strokeWidth="2" />
          {/* Rolled Denim Cuffs */}
          <rect x="154" y="442" width="38" height="12" rx="3" fill="#93C5FD" stroke="#181824" strokeWidth="2.5" />
          <rect x="208" y="442" width="38" height="12" rx="3" fill="#93C5FD" stroke="#181824" strokeWidth="2.5" />
        </g>
      );

    case 'Bottom-tech-joggers':
      return (
        <g id="layer-05-pants-joggers" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M154,328 L246,328 L248,395 L240,446 L212,446 L204,368 L196,368 L188,446 L160,446 L152,395 Z"
            fill="#334155"
          />
          {/* Cargo Side Pockets */}
          <rect x="148" y="366" width="14" height="32" rx="4" fill="#1E293B" />
          <rect x="238" y="366" width="14" height="32" rx="4" fill="#1E293B" />
          {/* Drawstrings */}
          <path d="M195,332 L192,352 M205,332 L208,352" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          {/* Ribbed Ankle Cuffs */}
          <rect x="160" y="438" width="28" height="14" rx="4" fill="#0F172A" />
          <rect x="212" y="438" width="28" height="14" rx="4" fill="#0F172A" />
        </g>
      );

    case 'Bottom-campus-shorts':
      return (
        <g id="layer-05-pants-shorts" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M154,328 L246,328 L248,392 L206,392 L202,364 L198,364 L194,392 L152,392 Z"
            fill="#D6B588"
          />
          <line x1="152" y1="384" x2="194" y2="384" stroke="#B89364" strokeWidth="2" />
          <line x1="206" y1="384" x2="248" y2="384" stroke="#B89364" strokeWidth="2" />
        </g>
      );

    case 'Bottom-formal-slacks':
      return (
        <g id="layer-05-pants-slacks" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M154,328 L246,328 L243,454 L210,454 L204,366 L196,366 L190,454 L157,454 Z"
            fill="#374151"
          />
          {/* Leather Belt & Brass Buckle */}
          <rect x="154" y="326" width="92" height="10" fill="#111827" />
          <rect x="192" y="325" width="16" height="12" rx="2" fill="#FBBF24" stroke="#181824" strokeWidth="2" />
          {/* Tailored Crease Lines */}
          <line x1="173" y1="345" x2="173" y2="450" stroke="#4B5563" strokeWidth="2" />
          <line x1="227" y1="345" x2="227" y2="450" stroke="#4B5563" strokeWidth="2" />
        </g>
      );

    case 'Bottom-black-trousers':
    default:
      return (
        <g id="layer-05-pants-black" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M154,328 L246,328 L243,454 L210,454 L204,366 L196,366 L190,454 L157,454 Z"
            fill="#1E293B"
          />
          <line x1="174" y1="350" x2="174" y2="448" stroke="#334155" strokeWidth="2" />
          <line x1="226" y1="350" x2="226" y2="448" stroke="#334155" strokeWidth="2" />
        </g>
      );
  }
};

/**
 * LAYER 6: Footwear (CharacterShoes)
 */
const CharacterShoesLayer = ({ shoesId }) => {
  switch (shoesId) {
    case 'shoes-running':
      return (
        <g id="layer-06-shoes-running" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Left Runner */}
          <path d="M158,454 L190,454 L194,486 L142,486 C140,472 148,462 158,454 Z" fill="#0284C7" />
          <path d="M140,482 L195,482 L193,492 L142,492 Z" fill="#A3E635" />
          <path d="M162,468 L182,462" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
          {/* Right Runner */}
          <path d="M210,454 L242,454 C252,462 260,472 258,486 L206,486 Z" fill="#0284C7" />
          <path d="M205,482 L260,482 L258,492 L207,492 Z" fill="#A3E635" />
          <path d="M238,468 L218,462" stroke="#F8FAFC" strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'shoes-high-tops':
      return (
        <g id="layer-06-shoes-hightops" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Left Crimson High-Top */}
          <path d="M156,442 L190,442 L192,486 L142,486 C142,468 152,458 156,442 Z" fill="#DC2626" />
          <rect x="155" y="446" width="35" height="8" fill="#181824" />
          <rect x="142" y="482" width="50" height="9" rx="3" fill="#F8FAFC" />
          <line x1="158" y1="460" x2="176" y2="460" stroke="#F8FAFC" strokeWidth="2.5" />
          <line x1="156" y1="467" x2="174" y2="467" stroke="#F8FAFC" strokeWidth="2.5" />
          {/* Right Crimson High-Top */}
          <path d="M210,442 L244,442 C248,458 258,468 258,486 L208,486 Z" fill="#DC2626" />
          <rect x="210" y="446" width="35" height="8" fill="#181824" />
          <rect x="208" y="482" width="50" height="9" rx="3" fill="#F8FAFC" />
          <line x1="224" y1="460" x2="242" y2="460" stroke="#F8FAFC" strokeWidth="2.5" />
          <line x1="226" y1="467" x2="244" y2="467" stroke="#F8FAFC" strokeWidth="2.5" />
        </g>
      );

    case 'shoes-formal-oxford':
      return (
        <g id="layer-06-shoes-formal" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path d="M158,456 L190,456 L192,486 L144,486 C144,472 152,464 158,456 Z" fill="#451A03" />
          <rect x="144" y="483" width="48" height="7" fill="#1C1917" />
          <path d="M210,456 L242,456 C248,464 256,472 256,486 L208,486 Z" fill="#451A03" />
          <rect x="208" y="483" width="48" height="7" fill="#1C1917" />
        </g>
      );

    case 'shoes-cyber-kicks':
      return (
        <g id="layer-06-shoes-cyber" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Left Cyber Kick */}
          <path d="M154,438 L190,438 L193,486 L140,486 C140,466 150,455 154,438 Z" fill="#0F172A" />
          <rect x="140" y="480" width="53" height="11" rx="4" fill="#06B6D4" />
          <circle cx="156" cy="485" r="2.5" fill="#ECFEFF" stroke="none" />
          <circle cx="176" cy="485" r="2.5" fill="#ECFEFF" stroke="none" />
          <path d="M156,452 L186,452" stroke="#22D3EE" strokeWidth="3" />
          {/* Right Cyber Kick */}
          <path d="M210,438 L246,438 C250,455 260,466 260,486 L207,486 Z" fill="#0F172A" />
          <rect x="207" y="480" width="53" height="11" rx="4" fill="#06B6D4" />
          <circle cx="224" cy="485" r="2.5" fill="#ECFEFF" stroke="none" />
          <circle cx="244" cy="485" r="2.5" fill="#ECFEFF" stroke="none" />
          <path d="M214,452 L244,452" stroke="#22D3EE" strokeWidth="3" />
        </g>
      );

    case 'shoes-basic-sneakers':
    default:
      return (
        <g id="layer-06-shoes-basic" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path d="M158,456 L190,456 L192,486 L144,486 C144,470 152,462 158,456 Z" fill="#F8FAFC" />
          <rect x="144" y="482" width="48" height="8" rx="3" fill="#CBD5E1" />
          <path d="M164,468 L184,474" stroke="#475569" strokeWidth="3" />
          <path d="M210,456 L242,456 C248,462 256,470 256,486 L208,486 Z" fill="#F8FAFC" />
          <rect x="208" y="482" width="48" height="8" rx="3" fill="#CBD5E1" />
          <path d="M236,468 L216,474" stroke="#475569" strokeWidth="3" />
        </g>
      );
  }
};

/**
 * LAYER 7: Upper Body Clothing (CharacterOutfit)
 * Each clothing item has genuinely distinct silhouettes, sleeves, collars, and details.
 */
const CharacterOutfitLayer = ({ outfitId }) => {
  switch (outfitId) {
    case 'top-basic-tee':
      return (
        <g id="layer-07-outfit-tee" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Short-Sleeve T-Shirt Silhouette */}
          <path
            d="M152,196 L124,228 L142,256 L154,242 L152,334 L248,334 L246,242 L258,256 L276,228 L248,196 Z"
            fill="#4F46E5"
          />
          {/* Ribbed Crewneck Collar */}
          <path d="M174,196 C182,216 218,216 226,196" fill="#312E81" stroke="#181824" strokeWidth="3" />
          {/* AURA Chest Emblem */}
          <circle cx="222" cy="242" r="9" fill="#818CF8" stroke="#181824" strokeWidth="2" />
          <path d="M219,245 L222,237 L225,245 Z" fill="#FFF" stroke="none" />
        </g>
      );

    case 'top-campus-polo':
      return (
        <g id="layer-07-outfit-polo" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Polo Body with Cuffed Short Sleeves */}
          <path
            d="M152,196 L125,230 L143,256 L154,242 L152,334 L248,334 L246,242 L257,256 L275,230 L248,196 Z"
            fill="#0F766E"
          />
          {/* Sleeve Cuffs */}
          <line x1="128" y1="226" x2="145" y2="251" stroke="#F8FAFC" strokeWidth="4" />
          <line x1="272" y1="226" x2="255" y2="251" stroke="#F8FAFC" strokeWidth="4" />
          {/* Button Placket */}
          <rect x="194" y="204" width="12" height="44" rx="3" fill="#115E59" />
          <circle cx="200" cy="218" r="2" fill="#F8FAFC" stroke="none" />
          <circle cx="200" cy="232" r="2" fill="#F8FAFC" stroke="none" />
          {/* Folded Polo Collar */}
          <polygon points="172,192 198,208 182,222 162,204" fill="#F8FAFC" />
          <polygon points="228,192 202,208 218,222 238,204" fill="#F8FAFC" />
        </g>
      );

    case 'top-engineering-uniform':
      return (
        <g id="layer-07-outfit-engineering" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Inner Dark Tech Undershirt */}
          <path d="M174,196 L226,196 L226,334 L174,334 Z" fill="#1E293B" />
          {/* Structured Long-Sleeve Crimson Engineering Field Jacket */}
          <path
            d="M148,196 L122,226 L126,322 L148,322 L154,244 L152,336 L194,336 L194,206 L168,192 Z"
            fill="#B91C1C"
          />
          <path
            d="M252,196 L278,226 L274,322 L252,322 L246,244 L248,336 L206,336 L206,206 L232,192 Z"
            fill="#B91C1C"
          />
          {/* Gold Engineering Shoulder Epaulettes & Piping */}
          <polygon points="146,196 170,192 168,204 142,208" fill="#FBBF24" />
          <polygon points="254,196 230,192 232,204 258,208" fill="#FBBF24" />
          {/* Utility Chest Pocket & Gear Emblem */}
          <rect x="160" y="236" width="24" height="26" rx="3" fill="#991B1B" />
          <rect x="216" y="236" width="24" height="26" rx="3" fill="#991B1B" />
          <circle cx="228" cy="249" r="6" fill="#FBBF24" />
          {/* High Standing Tech Collar */}
          <path d="M166,184 L192,206 L172,216 L158,198 Z" fill="#7F1D1D" />
          <path d="M234,184 L208,206 L228,216 L242,198 Z" fill="#7F1D1D" />
        </g>
      );

    case 'top-university-jacket':
      return (
        <g id="layer-07-outfit-unijacket" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Long-Sleeve Windbreaker */}
          <path
            d="M148,196 L122,226 L126,322 L148,322 L154,244 L152,336 L248,336 L246,244 L252,322 L274,322 L278,226 L252,196 Z"
            fill="#1E3A8A"
          />
          {/* White & Sky Chevron Chest Panel */}
          <polygon points="153,234 200,264 247,234 247,258 200,288 153,258" fill="#38BDF8" />
          {/* Center Zipper */}
          <line x1="200" y1="202" x2="200" y2="336" stroke="#F8FAFC" strokeWidth="3" />
          {/* Standing Collar */}
          <path d="M170,188 L200,206 L230,188 L238,202 L200,218 L162,202 Z" fill="#0F172A" />
        </g>
      );

    case 'top-varsity-jacket':
      return (
        <g id="layer-07-outfit-varsity" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Cream Leather Long Sleeves */}
          <path d="M152,198 L122,226 L126,322 L148,322 L156,244 Z" fill="#FEF3C7" />
          <path d="M248,198 L278,226 L274,322 L252,322 L244,244 Z" fill="#FEF3C7" />
          {/* Maroon Wool Torso */}
          <path d="M150,196 L250,196 L248,336 L152,336 Z" fill="#881337" />
          {/* Ribbed Striped Waistband & Cuffs */}
          <rect x="152" y="320" width="96" height="16" rx="4" fill="#F8FAFC" />
          <line x1="154" y1="328" x2="246" y2="328" stroke="#881337" strokeWidth="3" />
          <rect x="125" y="312" width="24" height="10" rx="2" fill="#F8FAFC" />
          <rect x="251" y="312" width="24" height="10" rx="2" fill="#F8FAFC" />
          {/* Snap Buttons */}
          {[222, 246, 270, 294, 312].map(y => (
            <circle key={y} cx="200" cy={y} r="3" fill="#F8FAFC" stroke="#181824" strokeWidth="1.5" />
          ))}
          {/* Chenille 'A' Patch */}
          <rect x="214" y="232" width="22" height="26" rx="4" fill="#FBBF24" />
          <text x="220" y="251" fill="#881337" fontSize="16" fontWeight="900" fontFamily="sans-serif">A</text>
        </g>
      );

    case 'top-data-hoodie':
      return (
        <g id="layer-07-outfit-hoodie" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Oversized Hoodie Body & Sleeves */}
          <path
            d="M144,194 L118,228 L124,324 L148,324 L154,248 L150,338 L250,338 L246,248 L252,324 L276,324 L282,228 L256,194 Z"
            fill="#0F172A"
          />
          {/* Bunched Hood Ring Around Neck */}
          <path
            d="M152,186 C146,208 176,220 200,220 C224,220 254,208 248,186 C234,196 166,196 152,186 Z"
            fill="#1E293B"
          />
          {/* Kangaroo Front Pocket */}
          <polygon points="164,282 236,282 244,328 156,328" fill="#1E293B" />
          {/* Glowing Cyan Circuit Traces & Drawstrings */}
          <path d="M188,214 L188,256 M212,214 L212,256" stroke="#22D3EE" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M130,260 L142,272 L142,305" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
          <path d="M270,260 L258,272 L258,305" fill="none" stroke="#22D3EE" strokeWidth="2.5" />
        </g>
      );

    case 'top-formal-blazer':
      return (
        <g id="layer-07-outfit-blazer" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Crisp White Dress Shirt Center */}
          <polygon points="172,194 228,194 220,334 180,334" fill="#F8FAFC" />
          {/* Crimson Silk Necktie */}
          <polygon points="195,204 205,204 209,288 200,302 191,288" fill="#DC2626" />
          {/* Tailored Navy Academy Blazer */}
          <path
            d="M148,196 L122,226 L126,322 L148,322 L154,244 L152,336 L192,336 L192,265 L172,196 Z"
            fill="#1E293B"
          />
          <path
            d="M252,196 L278,226 L274,322 L252,322 L246,244 L248,336 L208,336 L208,265 L228,196 Z"
            fill="#1E293B"
          />
          {/* Blazer Lapels */}
          <polygon points="172,194 192,265 162,248" fill="#0F172A" />
          <polygon points="228,194 208,265 238,248" fill="#0F172A" />
          {/* Gold Academy Crest on Pocket */}
          <polygon points="220,245 236,245 236,260 228,268 220,260" fill="#FBBF24" />
        </g>
      );

    case 'top-archon-scholar':
      return (
        <g id="layer-07-outfit-archon" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Royal Astral Robe & Flared Lower Coat */}
          <path
            d="M144,194 L116,232 L120,326 L148,326 L154,248 L144,352 L256,352 L246,248 L252,326 L280,326 L284,232 L256,194 Z"
            fill="#311042"
          />
          {/* Inner Gold & Ivory Tabard */}
          <polygon points="180,200 220,200 228,352 172,352" fill="#FEF3C7" />
          <polygon points="192,208 208,208 212,342 188,342" fill="#F59E0B" />
          {/* Ornate Layered Shoulder Pauldrons / Capelet */}
          <path
            d="M132,212 C152,188 182,192 200,214 C218,192 248,188 268,212 L258,236 C236,226 214,228 200,240 C186,228 164,226 142,236 Z"
            fill="#FBBF24"
          />
          {/* Arcane Diamond Gem at Collar */}
          <polygon points="200,202 212,218 200,234 188,218" fill="#38BDF8" stroke="#181824" strokeWidth="2.5" />
        </g>
      );

    default:
      return null;
  }
};

/**
 * LAYER 8: Neck & Head Base
 */
const CharacterHeadBaseLayer = ({ skinPalette }) => {
  return (
    <g id="layer-08-head-base" stroke="#181824" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      {/* Neck & Collarbone Cast Shadow */}
      <rect x="182" y="162" width="36" height="44" rx="12" fill={skinPalette.base} />
      <path d="M182,174 C192,186 208,186 218,174 L218,164 L182,164 Z" fill={skinPalette.shadow} stroke="none" />

      {/* Ears */}
      <ellipse cx="136" cy="128" rx="12" ry="16" fill={skinPalette.base} />
      <path d="M133,122 C138,125 138,132 134,135" fill="none" stroke={skinPalette.shadow} strokeWidth="2.5" />
      <ellipse cx="264" cy="128" rx="12" ry="16" fill={skinPalette.base} />
      <path d="M267,122 C262,125 262,132 266,135" fill="none" stroke={skinPalette.shadow} strokeWidth="2.5" />

      {/* Main Anime/Student Head Contour */}
      <path
        d="M140,104 C140,62 260,62 260,104 C260,145 236,176 200,178 C164,176 140,145 140,104 Z"
        fill={skinPalette.base}
      />

      {/* Soft Cheek Blush */}
      <ellipse cx="162" cy="138" rx="10" ry="5" fill={skinPalette.blush} opacity="0.38" stroke="none" />
      <ellipse cx="238" cy="138" rx="10" ry="5" fill={skinPalette.blush} opacity="0.38" stroke="none" />
    </g>
  );
};

/**
 * LAYER 9: Facial Features & Eyes (CharacterFace & CharacterEyes)
 */
const CharacterFaceLayer = ({ eyePalette, hairPalette }) => {
  return (
    <g id="layer-09-face-eyes">
      {/* Eyebrows */}
      <path d="M158,104 Q172,98 184,103" fill="none" stroke={hairPalette.primary} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M216,103 Q228,98 242,104" fill="none" stroke={hairPalette.primary} strokeWidth="3.5" strokeLinecap="round" />

      {/* Left Eye */}
      <g>
        <rect x="160" y="110" width="22" height="22" rx="9" fill="#FFFFFF" stroke="#181824" strokeWidth="2.5" />
        <rect x="164" y="112" width="15" height="18" rx="7" fill={eyePalette.main} />
        <circle cx="171.5" cy="121" r="4.5" fill="#0F172A" />
        <circle cx="168" cy="116" r="3" fill="#FFFFFF" />
        <circle cx="175" cy="125" r="1.5" fill={eyePalette.light} />
        <path d="M158,112 Q171,106 184,112" fill="none" stroke="#181824" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Right Eye */}
      <g>
        <rect x="218" y="110" width="22" height="22" rx="9" fill="#FFFFFF" stroke="#181824" strokeWidth="2.5" />
        <rect x="221" y="112" width="15" height="18" rx="7" fill={eyePalette.main} />
        <circle cx="228.5" cy="121" r="4.5" fill="#0F172A" />
        <circle cx="225" cy="116" r="3" fill="#FFFFFF" />
        <circle cx="232" cy="125" r="1.5" fill={eyePalette.light} />
        <path d="M216,112 Q229,106 242,112" fill="none" stroke="#181824" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      {/* Nose */}
      <path d="M199,130 L197,139 L202,140" fill="none" stroke="#181824" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Confident Student Smile */}
      <path d="M188,151 Q200,159 212,151" fill="none" stroke="#181824" strokeWidth="2.8" strokeLinecap="round" />
    </g>
  );
};

/**
 * LAYER 10: Front Hair (CharacterHair)
 * Each hairstyle is an independent SVG path design that frames the forehead without obscuring the eyes.
 */
const CharacterFrontHairLayer = ({ hairstyleId, hairPalette }) => {
  switch (hairstyleId) {
    case 'hair-medium-layered':
      return (
        <g id="layer-10-hair-medium" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M134,116 C130,62 168,44 200,44 C232,44 270,62 266,116 C262,145 256,174 248,190 C246,162 248,125 242,102 L222,94 L206,104 L196,90 L176,105 L158,96 C152,125 154,162 152,190 C144,174 138,145 134,116 Z"
            fill={hairPalette.primary}
          />
          <path d="M162,68 Q200,56 238,68" fill="none" stroke={hairPalette.highlight} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
        </g>
      );

    case 'hair-long-flowing':
      return (
        <g id="layer-10-hair-long" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M134,116 C132,58 166,42 200,42 C234,42 268,58 266,116 C264,165 258,218 250,248 C244,218 246,142 242,102 C226,100 214,92 200,82 C186,92 174,100 158,102 C154,142 156,218 150,248 C142,218 136,165 134,116 Z"
            fill={hairPalette.primary}
          />
          {/* Swept Hime / Framing Bangs */}
          <path d="M168,66 Q200,54 232,66" fill="none" stroke={hairPalette.highlight} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        </g>
      );

    case 'hair-curly-volume':
      return (
        <g id="layer-10-hair-curly" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M132,112 C122,94 130,68 148,60 C156,42 180,36 200,40 C220,36 244,42 252,60 C270,68 278,94 268,112 C258,102 248,96 236,98 C224,86 210,88 200,98 C190,88 176,86 164,98 C152,96 142,102 132,112 Z"
            fill={hairPalette.primary}
          />
          <circle cx="164" cy="64" r="14" fill={hairPalette.primary} />
          <circle cx="200" cy="56" r="16" fill={hairPalette.primary} />
          <circle cx="236" cy="64" r="14" fill={hairPalette.primary} />
          <path d="M188,52 A10,10 0 0,1 210,52" fill="none" stroke={hairPalette.highlight} strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'hair-side-part':
      return (
        <g id="layer-10-hair-sidepart" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M136,114 C132,68 164,46 204,46 C240,46 266,68 264,114 L256,96 C236,96 202,94 172,78 C164,92 154,100 144,102 Z"
            fill={hairPalette.primary}
          />
          <line x1="172" y1="56" x2="172" y2="78" stroke={hairPalette.secondary} strokeWidth="3" />
          <path d="M184,64 Q218,58 244,72" fill="none" stroke={hairPalette.highlight} strokeWidth="4" strokeLinecap="round" opacity="0.6" />
        </g>
      );

    case 'hair-modern-twoblock':
      return (
        <g id="layer-10-hair-twoblock" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Tapered Undercut Sides */}
          <path d="M138,114 L144,86 L256,86 L262,114 Z" fill={hairPalette.secondary} />
          {/* Voluminous Center Curtain Bangs */}
          <path
            d="M136,98 C134,56 168,42 200,44 C232,42 266,56 264,98 C250,106 236,104 224,94 L200,76 L176,94 C164,104 150,106 136,98 Z"
            fill={hairPalette.primary}
          />
          <path d="M158,68 Q178,56 196,68 M204,68 Q222,56 242,68" fill="none" stroke={hairPalette.highlight} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
        </g>
      );

    case 'hair-short-messy':
    default:
      return (
        <g id="layer-10-hair-short" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <path
            d="M136,114 C130,74 156,46 184,46 L192,36 L208,44 L226,38 L234,48 C258,56 268,82 264,114 L254,96 L238,102 L226,88 L208,104 L194,88 L178,104 L162,90 L146,102 Z"
            fill={hairPalette.primary}
          />
          <path d="M164,66 Q200,54 236,66" fill="none" stroke={hairPalette.highlight} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
        </g>
      );
  }
};

/**
 * LAYER 11: Face Accessories & Eyewear / Audio (CharacterAccessories)
 */
const CharacterAccessoriesLayer = ({ accessoryId }) => {
  switch (accessoryId) {
    case 'acc-blue-light-glasses':
      return (
        <g id="layer-11-acc-glasses" stroke="#1E293B" strokeWidth="2.8" strokeLinejoin="round">
          {/* Left & Right Rectangular Study Frames */}
          <rect x="153" y="106" width="36" height="26" rx="6" fill="#38BDF8" fillOpacity="0.16" />
          <rect x="211" y="106" width="36" height="26" rx="6" fill="#38BDF8" fillOpacity="0.16" />
          {/* Bridge & Temples */}
          <path d="M189,116 Q200,112 211,116" fill="none" />
          <line x1="140" y1="116" x2="153" y2="116" />
          <line x1="247" y1="116" x2="260" y2="116" />
          {/* Anti-Glare Glint */}
          <line x1="159" y1="112" x2="166" y2="126" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
          <line x1="217" y1="112" x2="224" y2="126" stroke="#BAE6FD" strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    case 'acc-retro-sunglasses':
      return (
        <g id="layer-11-acc-sunglasses" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          <polygon points="150,106 192,108 188,132 154,130" fill="#0F172A" />
          <polygon points="208,108 250,106 246,130 212,132" fill="#0F172A" />
          <line x1="192" y1="112" x2="208" y2="112" stroke="#FBBF24" strokeWidth="3" />
          <line x1="138" y1="114" x2="150" y2="112" stroke="#FBBF24" strokeWidth="2.5" />
          <line x1="250" y1="112" x2="262" y2="114" stroke="#FBBF24" strokeWidth="2.5" />
          <line x1="158" y1="112" x2="170" y2="126" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="216" y1="112" x2="228" y2="126" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );

    case 'acc-studio-headphones':
      return (
        <g id="layer-11-acc-headphones" stroke="#181824" strokeWidth="3" strokeLinejoin="round">
          {/* Over-Head Arch Band */}
          <path
            d="M128,122 C122,42 278,42 272,122"
            fill="none"
            stroke="#334155"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M128,122 C122,42 278,42 272,122"
            fill="none"
            stroke="#181824"
            strokeWidth="3"
          />
          {/* Left & Right Ear Cups */}
          <rect x="118" y="106" width="20" height="40" rx="10" fill="#1E293B" />
          <ellipse cx="126" cy="126" rx="4" ry="11" fill="#38BDF8" stroke="none" />
          <rect x="262" y="106" width="20" height="40" rx="10" fill="#1E293B" />
          <ellipse cx="274" cy="126" rx="4" ry="11" fill="#38BDF8" stroke="none" />
        </g>
      );

    case 'acc-wireless-earbuds':
      return (
        <g id="layer-11-acc-earbuds" stroke="#181824" strokeWidth="2">
          <rect x="132" y="128" width="7" height="18" rx="3.5" fill="#F8FAFC" transform="rotate(-12 135 135)" />
          <rect x="261" y="128" width="7" height="18" rx="3.5" fill="#F8FAFC" transform="rotate(12 265 135)" />
        </g>
      );

    case 'acc-none':
    default:
      return null;
  }
};

/**
 * LAYER 12: Lanyard & Student ID Card (CharacterLanyard)
 * Hangs naturally over the upper outfit torso.
 */
const CharacterLanyardLayer = ({ lanyardId }) => {
  if (!lanyardId || lanyardId === 'lanyard-none') return null;

  const strapColor =
    lanyardId === 'lanyard-engineering-id' ? '#DC2626' :
    lanyardId === 'lanyard-cs-binary' ? '#06B6D4' : '#F59E0B';

  const cardAccent =
    lanyardId === 'lanyard-engineering-id' ? '#991B1B' :
    lanyardId === 'lanyard-cs-binary' ? '#0891B2' : '#B45309';

  return (
    <g id="layer-12-lanyard" stroke="#181824" strokeWidth="2.5" strokeLinejoin="round">
      {/* Woven Lanyard Strap Draping Over Collar */}
      <path
        d="M178,188 L196,258 L204,258 L222,188"
        fill="none"
        stroke="#181824"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M178,188 L196,258 L204,258 L222,188"
        fill="none"
        stroke={strapColor}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Metallic Clasp */}
      <rect x="196" y="256" width="8" height="10" rx="2" fill="#CBD5E1" />
      {/* Student ID Badge Holder */}
      <rect x="182" y="264" width="36" height="48" rx="5" fill="#F8FAFC" />
      <rect x="182" y="264" width="36" height="12" rx="3" fill={cardAccent} />
      {/* Mini Avatar Silhouette & Barcode on ID Card */}
      <circle cx="193" cy="286" r="5" fill="#64748B" stroke="none" />
      <line x1="202" y1="283" x2="213" y2="283" stroke="#334155" strokeWidth="2" />
      <line x1="202" y1="289" x2="210" y2="289" stroke="#94A3B8" strokeWidth="2" />
      <rect x="188" y="298" width="24" height="6" fill="#1E293B" stroke="none" />
    </g>
  );
};

/**
 * LAYER 13: Front & Shoulder Accessories (Department Pin, Watch, Owl Companion)
 */
const CharacterFrontAccessoriesLayer = ({ specialId }) => {
  if (specialId === 'special-dept-pin') {
    return (
      <g id="layer-13-front-pin-watch" stroke="#181824" strokeWidth="2">
        {/* Smart Study Chrono Watch on Left Wrist */}
        <rect x="125" y="314" width="24" height="10" rx="3" fill="#0F172A" />
        <circle cx="137" cy="319" r="6" fill="#38BDF8" />
        {/* Golden Department Gear Pin on Left Lapel */}
        <circle cx="172" cy="232" r="8" fill="#FBBF24" />
        <circle cx="172" cy="232" r="3.5" fill="#B91C1C" />
      </g>
    );
  }

  if (specialId === 'special-archon-halo') {
    return (
      <g id="layer-13-front-owl" stroke="#181824" strokeWidth="2.5" strokeLinejoin="round">
        {/* Mini Astral Owl Companion Perched on Right Shoulder */}
        <g transform="translate(248, 152)">
          <ellipse cx="18" cy="24" rx="14" ry="16" fill="#FEF3C7" />
          <path d="M6,12 L12,18 L24,18 L30,12 L26,26 L10,26 Z" fill="#F59E0B" />
          <circle cx="13" cy="20" r="3.5" fill="#38BDF8" />
          <circle cx="23" cy="20" r="3.5" fill="#38BDF8" />
          <polygon points="18,22 15,26 21,26" fill="#D97706" />
        </g>
      </g>
    );
  }

  return null;
};

/**
 * LAYER 14: Character Frame & Level Indicators (CharacterFrame)
 * All frames render as circular profile rings with distinct department / event styling
 */
const CharacterFrameLayer = ({ frameId, level = 24, cropMode = 'circle' }) => {
  const isCircle = true; // Frames are always circular profile frames

  if (frameId === 'frame-crimson-eng') {
    return (
      <g id="layer-14-frame-crimson">
        {/* Outer concentric tech border & crimson ring */}
        <circle cx="200" cy="155" r="149" fill="none" stroke="#FBBF24" strokeWidth="1.5" opacity="0.65" strokeDasharray="6 14" />
        <circle cx="200" cy="155" r="142" fill="none" stroke="#DC2626" strokeWidth="8" />
        <circle cx="200" cy="155" r="134" fill="none" stroke="#991B1B" strokeWidth="2.5" strokeDasharray="16 8" />
        {/* Precision Rivets around the circle */}
        <circle cx="342" cy="155" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="58" cy="155" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="200" cy="13" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="300" cy="55" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="100" cy="55" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="100" cy="255" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        <circle cx="300" cy="255" r="4.5" fill="#FBBF24" stroke="#181824" strokeWidth="1.5" />
        {/* Level Pill */}
        <g transform="translate(200, 295)">
          <rect x="-46" y="-14" width="92" height="24" rx="12" fill="#991B1B" stroke="#FBBF24" strokeWidth="2.5" />
          <text x="0" y="2" textAnchor="middle" fill="#FEF2F2" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            ENG LVL {level}
          </text>
        </g>
      </g>
    );
  }

  if (frameId === 'frame-sql-champion') {
    return (
      <g id="layer-14-frame-sql">
        <circle cx="200" cy="155" r="150" fill="none" stroke="#22D3EE" strokeWidth="1.5" opacity="0.8" strokeDasharray="4 8" />
        <circle cx="200" cy="155" r="142" fill="none" stroke="#06B6D4" strokeWidth="8" strokeDasharray="24 6" />
        <circle cx="200" cy="155" r="134" fill="none" stroke="#083344" strokeWidth="3" />
        {/* Telemetry Nodes */}
        <circle cx="300" cy="55" r="4.5" fill="#22D3EE" />
        <circle cx="100" cy="55" r="4.5" fill="#22D3EE" />
        <circle cx="100" cy="255" r="4.5" fill="#22D3EE" />
        <circle cx="300" cy="255" r="4.5" fill="#22D3EE" />
        <g transform="translate(200, 295)">
          <rect x="-52" y="-14" width="104" height="24" rx="6" fill="#083344" stroke="#22D3EE" strokeWidth="2.5" />
          <text x="0" y="2" textAnchor="middle" fill="#67E8F9" fontSize="11" fontWeight="800" fontFamily="monospace">
            SQL::LVL_{level}
          </text>
        </g>
      </g>
    );
  }

  if (frameId === 'frame-archon-mythic') {
    return (
      <g id="layer-14-frame-archon">
        <circle cx="200" cy="155" r="150" fill="none" stroke="#FDE68A" strokeWidth="2" strokeDasharray="16 10" />
        <circle cx="200" cy="155" r="142" fill="none" stroke="#F59E0B" strokeWidth="9" />
        <circle cx="200" cy="155" r="133" fill="none" stroke="#78350F" strokeWidth="3" />
        {/* Sovereign star on top */}
        <polygon points="200,3 203,11 211,13 203,15 200,23 197,15 189,13 197,11" fill="#FDE68A" stroke="#78350F" strokeWidth="1" />
        <circle cx="300" cy="55" r="4.5" fill="#FDE68A" />
        <circle cx="100" cy="55" r="4.5" fill="#FDE68A" />
        <g transform="translate(200, 295)">
          <rect x="-56" y="-14" width="112" height="24" rx="12" fill="#451A03" stroke="#FBBF24" strokeWidth="2.5" />
          <text x="0" y="2" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="800" fontFamily="sans-serif">
            â˜… ARCHON {level} â˜…
          </text>
        </g>
      </g>
    );
  }

  // Default AURA Frame
  return (
    <g id="layer-14-frame-default">
      <circle cx="200" cy="155" r="148" fill="none" stroke="#A5B4FC" strokeWidth="1.5" opacity="0.65" strokeDasharray="8 6" />
      <circle cx="200" cy="155" r="142" fill="none" stroke="#6366F1" strokeWidth="7" opacity="0.9" />
      <circle cx="200" cy="155" r="135" fill="none" stroke="#312E81" strokeWidth="2.5" />
      <g transform="translate(200, 295)">
        <rect x="-38" y="-14" width="76" height="24" rx="12" fill="#1E293B" stroke="#6366F1" strokeWidth="2" />
        <text x="0" y="2" textAnchor="middle" fill="#E2E8F0" fontSize="11" fontWeight="800" fontFamily="sans-serif">
          LVL {level}
        </text>
      </g>
    </g>
  );
};

// ============================================================================
// 4. REUSABLE MODULAR CHARACTER RENDERER & BACKWARDS-COMPATIBLE BIGCIRCLEAVATAR
// ============================================================================

export const CharacterRenderer = ({
  equipment = DEFAULT_EQUIPMENT,
  cropMode = 'full', // 'full' | 'circle'
  showFrame = true,
  showEnvironment = true,
  level = 12,
  className = 'w-full h-full',
  forceStandard = false,
}) => {
  const safeEq = useMemo(() => resolveSafeEquipment(equipment), [equipment]);
  const betaState = useBetaCharacterState();
  const hairPalette = useMemo(
    () => HAIR_COLORS.find(c => c.id === safeEq.hairColor) || HAIR_COLORS[0],
    [safeEq.hairColor]
  );
  const skinPalette = useMemo(
    () => SKIN_TONES.find(s => s.id === safeEq.skinTone) || SKIN_TONES[1],
    [safeEq.skinTone]
  );
  const eyePalette = useMemo(
    () => EYE_COLORS.find(e => e.id === safeEq.eyeColor) || EYE_COLORS[0],
    [safeEq.eyeColor]
  );

  const isBetaActive = !forceStandard && betaState.isActive;
  const betaImage =
    betaState.outfitId === 'base-character-1' ? baseCharacterImg : epicCharacterOutfitImg;

  // Render standalone Beta Character when toggle is active
  if (isBetaActive) {
    if (cropMode === 'circle') {
      return (
        <svg
          viewBox="45 5 310 310"
          className={`select-none transition-all duration-300 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <clipPath id="betaAvatarCircleClip">
              <circle cx="200" cy="155" r="138" />
            </clipPath>
          </defs>
          {showEnvironment && <CharacterEnvironmentLayer frameId={safeEq.frame} />}
          <g clipPath="url(#betaAvatarCircleClip)">
            <rect x="50" y="5" width="300" height="300" fill="#0d1322" />
            <image
              href={betaImage}
              x="-30"
              y="26"
              width="460"
              height="690"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
          {showFrame && <CharacterFrameLayer frameId={safeEq.frame} level={level} cropMode="circle" />}
        </svg>
      );
    }

    // cropMode === 'full' for Home Page stage & full body displays
    const isEpic = betaState.outfitId !== 'base-character-1';
    if (isEpic) {
      return (
        <svg
          viewBox="405 30 1014 2370"
          className={`select-none transition-all duration-300 ${className}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {showEnvironment && <CharacterEnvironmentLayer frameId={safeEq.frame} />}
          <image
            href={epicCharacterOutfitHomeImg}
            x="0"
            y="0"
            width="1792"
            height="2400"
            preserveAspectRatio="xMidYMid meet"
          />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 -30 1024 1580"
        className={`select-none transition-all duration-300 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {showEnvironment && <CharacterEnvironmentLayer frameId={safeEq.frame} />}
        <image
          href={baseCharacterImg}
          x="0"
          y="0"
          width="1024"
          height="1536"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>
    );
  }

  // Adjust viewBox for Full Body vs Avatar Portrait Circle
  const viewBox = cropMode === 'circle' ? '45 5 310 310' : '0 0 400 520';

  return (
    <svg
      viewBox={viewBox}
      className={`select-none transition-all duration-300 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 1. Background / Aura Environment */}
      {showEnvironment && <CharacterEnvironmentLayer frameId={safeEq.frame} />}

      {/* 2. Back Accessories / Special Effects */}
      <CharacterBackAccessoriesLayer specialId={safeEq.specialEffect} />

      {/* 3. Rear Hair (behind shoulders) */}
      <CharacterRearHairLayer hairstyleId={safeEq.hairstyle} hairPalette={hairPalette} />

      {/* 4. Body Base & Legs */}
      <CharacterBaseLayer skinPalette={skinPalette} />

      {/* 5. Lower Body Clothing (Pants/Jeans/Shorts) */}
      <CharacterPantsLayer pantsId={safeEq.lowerOutfit} />

      {/* 6. Footwear (Shoes) */}
      <CharacterShoesLayer shoesId={safeEq.shoes} />

      {/* 7. Upper Body Clothing (Shirts/Jackets/Hoodies) */}
      <CharacterOutfitLayer outfitId={safeEq.upperOutfit} />

      {/* 8. Neck & Head Base */}
      <CharacterHeadBaseLayer skinPalette={skinPalette} />

      {/* 9. Facial Features & Eyes */}
      <CharacterFaceLayer eyePalette={eyePalette} hairPalette={hairPalette} />

      {/* 10. Front Hair */}
      <CharacterFrontHairLayer hairstyleId={safeEq.hairstyle} hairPalette={hairPalette} />

      {/* 11. Face Accessories (Glasses, Headphones) */}
      <CharacterAccessoriesLayer accessoryId={safeEq.faceAccessory} />

      {/* 12. Lanyard & Student ID (hangs over shirt) */}
      <CharacterLanyardLayer lanyardId={safeEq.lanyard} />

      {/* 13. Front / Shoulder Accessories */}
      <CharacterFrontAccessoriesLayer specialId={safeEq.specialEffect} />

      {/* 14. Character Frame & Level Badge */}
      {showFrame && <CharacterFrameLayer frameId={safeEq.frame} level={level} cropMode={cropMode} />}
    </svg>
  );
};

/**
 * Backwards-Compatible BigCircleAvatar Wrapper
 * Preserves existing AURA profile/leaderboard integrations while upgrading under the hood.
 */
export const BigCircleAvatar = ({
  equipment = DEFAULT_EQUIPMENT,
  size = 96,
  level = 12,
  showFrame = true,
  className = ''
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`aura-big-circle-avatar relative rounded-full overflow-hidden bg-slate-900/90 flex items-center justify-center shrink-0 ${className}`}
    >
      <CharacterRenderer
        equipment={equipment}
        cropMode="circle"
        showFrame={showFrame}
        level={level}
      />
    </div>
  );
};

/**
 * Isolated Mini SVG Item Thumbnail Preview for the Customization Grid
 */
const ItemThumbnailPreview = ({ item, hairColor, skinTone }) => {
  const hairPalette = HAIR_COLORS.find(c => c.id === hairColor) || HAIR_COLORS[0];
  const skinPalette = SKIN_TONES.find(s => s.id === skinTone) || SKIN_TONES[1];

  // Focus viewBox on the exact body region for the item category
  const getCategoryViewBox = (cat) => {
    switch (cat) {
      case 'hairstyle':
      case 'faceAccessory':
        return '115 30 170 145';
      case 'upperOutfit':
      case 'lanyard':
        return '110 175 180 175';
      case 'lowerOutfit':
        return '135 315 130 155';
      case 'shoes':
        return '130 430 140 72';
      case 'specialEffect':
        return '45 20 310 320';
      case 'frame':
        return '45 5 310 310';
      default:
        return '0 0 400 520';
    }
  };

  return (
    <svg viewBox={getCategoryViewBox(item.category)} className="w-full h-full">
      {item.category === 'hairstyle' && (
        <>
          <CharacterRearHairLayer hairstyleId={item.id} hairPalette={hairPalette} />
          <circle cx="200" cy="116" r="52" fill={skinPalette.base} opacity="0.35" />
          <CharacterFrontHairLayer hairstyleId={item.id} hairPalette={hairPalette} />
        </>
      )}
      {item.category === 'upperOutfit' && <CharacterOutfitLayer outfitId={item.id} />}
      {item.category === 'lowerOutfit' && <CharacterPantsLayer pantsId={item.id} />}
      {item.category === 'shoes' && <CharacterShoesLayer shoesId={item.id} />}
      {item.category === 'faceAccessory' && (
        <>
          <circle cx="200" cy="118" r="54" fill={skinPalette.base} opacity="0.35" />
          <CharacterAccessoriesLayer accessoryId={item.id} />
        </>
      )}
      {item.category === 'lanyard' && (
        <>
          <path d="M150,196 L250,196 L248,334 L152,334 Z" fill="#1E293B" opacity="0.45" />
          <CharacterLanyardLayer lanyardId={item.id} />
        </>
      )}
      {item.category === 'specialEffect' && (
        <>
          <CharacterBackAccessoriesLayer specialId={item.id} />
          <circle cx="200" cy="120" r="45" fill="#334155" opacity="0.4" />
          <rect x="155" y="195" width="90" height="125" rx="16" fill="#334155" opacity="0.4" />
          <CharacterFrontAccessoriesLayer specialId={item.id} />
        </>
      )}
      {item.category === 'frame' && (
        <g id={`thumb-frame-${item.id}`}>
          {/* Circular dark backdrop */}
          <circle cx="200" cy="155" r="142" fill="#0A0E1A" />
          <CharacterEnvironmentLayer frameId={item.id} />
          {/* Avatar bust preview inside circular frame */}
          <CharacterRearHairLayer hairstyleId="hair-side-part" hairPalette={hairPalette} />
          <CharacterHeadBaseLayer skinPalette={skinPalette} />
          <CharacterFaceLayer eyePalette={EYE_COLORS[0]} hairPalette={hairPalette} />
          <CharacterFrontHairLayer hairstyleId="hair-side-part" hairPalette={hairPalette} />
          <CharacterOutfitLayer outfitId="outfit-eng-jacket" />
          {/* Circular Frame */}
          <CharacterFrameLayer frameId={item.id} level={12} cropMode="circle" />
        </g>
      )}
    </svg>
  );
};

// ============================================================================
// 5. MAIN AURA AVATAR & FRAME REWARDS CUSTOMIZATION INTERFACE
// ============================================================================
const CATEGORIES = [
  { id: 'hairstyle', label: 'Hairstyles', icon: User },
  { id: 'upperOutfit', label: 'Upper Outfit', icon: Shirt },
  { id: 'lowerOutfit', label: 'Lower Outfit', icon: Layers },
  { id: 'shoes', label: 'Shoes', icon: Footprints },
  { id: 'faceAccessory', label: 'Accessories', icon: Glasses },
  { id: 'lanyard', label: 'Lanyards & ID', icon: Award },
  { id: 'specialEffect', label: 'Special & Aura', icon: Sparkles },
  { id: 'frame', label: 'Frames', icon: Frame }
];

export const STORAGE_KEY = 'aura_student_character_equipment_v2';

// Camera Angles & Coordinates for Character Customizer
export const CAMERA_TRANSFORMS = {
  full: 'translate3d(0, 0%, 0) scale(1)',
  frame: 'translate3d(0, 33.3%, 0) scale(1.65)',
  head: 'translate3d(0, 51.5%, 0) scale(1.85)',
  torso: 'translate3d(0, 4.5%, 0) scale(1.55)',
  legs: 'translate3d(0, -41%, 0) scale(1.65)',
  feet: 'translate3d(0, -70%, 0) scale(1.8)',
};

export const CAMERA_LABELS = {
  full: 'Full Body',
  frame: 'Frame Focus',
  head: 'Head & Face',
  torso: 'Upper Body',
  legs: 'Lower Body',
  feet: 'Footwear',
};

export const getCameraAngleForCategory = (categoryId) => {
  switch (categoryId) {
    case 'frame':
      return 'frame';
    case 'lowerOutfit':
      return 'legs';
    case 'shoes':
      return 'feet';
    case 'upperOutfit':
    case 'lanyard':
    case 'specialEffect':
      return 'torso';
    case 'hairstyle':
    case 'faceAccessory':
      return 'head';
    default:
      return 'full';
  }
};

export function getSavedEquipment() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? resolveSafeEquipment(JSON.parse(raw)) : DEFAULT_EQUIPMENT;
  } catch {
    return DEFAULT_EQUIPMENT;
  }
}

export function useSavedEquipment() {
  const [equipment, setEquipment] = useState(getSavedEquipment);

  useEffect(() => {
    const handleCustomUpdate = (e) => {
      if (e?.detail) {
        setEquipment(resolveSafeEquipment(e.detail));
      } else {
        setEquipment(getSavedEquipment());
      }
    };

    const handleStorageUpdate = (e) => {
      if (e.key === STORAGE_KEY) {
        setEquipment(getSavedEquipment());
      }
    };

    window.addEventListener('aura-equipment-updated', handleCustomUpdate);
    window.addEventListener('storage', handleStorageUpdate);
    return () => {
      window.removeEventListener('aura-equipment-updated', handleCustomUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  return equipment;
}

export default function App({
  embedded = false,
  onEquipmentSaved,
  userName = 'Carl Patrick Mondigo',
  level = 12
} = {}) {
  // Saved (persisted) equipment vs Live Preview equipment
  const [savedEquipment, setSavedEquipment] = useState(getSavedEquipment);

  const [previewEquipment, setPreviewEquipment] = useState(savedEquipment);
  const [activeCategory, setActiveCategory] = useState('upperOutfit');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'unlocked' | 'locked'
  const [cameraAngle, setCameraAngle] = useState('full'); // 'full' | 'frame' | 'head' | 'torso' | 'legs' | 'feet'
  const [showFrame, setShowFrame] = useState(true); // Toggle to show/hide frame on character stage
  const [inspectLayerOrder, setInspectLayerOrder] = useState(false);

  // Frame is always visible when activeCategory is 'frame'
  const isFrameVisible = activeCategory === 'frame' || showFrame;

  const [syncStatus, setSyncStatus] = useState(null);
  const [selectedLockedItem, setSelectedLockedItem] = useState(null);

  // All items are unlocked for character customization
  const isItemUnlocked = (item) => Boolean(item);

  // Filtered items for the active category
  const categoryItems = useMemo(() => {
    return EQUIPMENT_REGISTRY.filter(item => {
      if (item.category !== activeCategory) return false;
      const unlocked = isItemUnlocked(item);
      if (filterMode === 'unlocked') return unlocked;
      if (filterMode === 'locked') return !unlocked;
      return true;
    });
  }, [activeCategory, filterMode]);

  // Check if there are unsaved preview changes
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(savedEquipment) !== JSON.stringify(previewEquipment);
  }, [savedEquipment, previewEquipment]);

  // Select an item in the grid
  const handleSelectItem = (item) => {
    setSelectedLockedItem(null);
    const updated = {
      ...previewEquipment,
      [item.category]: item.id
    };
    setPreviewEquipment(updated);

    // Keep camera angle aligned with chosen item's category
    const targetCamera = getCameraAngleForCategory(item.category);
    setCameraAngle(targetCamera);

    // When changing a frame, automatically equip and persist it immediately
    // so that all profile frame icons in Profile, Navbar, and Home update in real time!
    if (item.category === 'frame') {
      const verified = resolveSafeEquipment(updated);
      setSavedEquipment(verified);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(verified));
        window.dispatchEvent(new CustomEvent('aura-equipment-updated', { detail: verified }));
      } catch {
        // fallback
      }
      if (onEquipmentSaved) {
        onEquipmentSaved(verified);
      }
      setSyncStatus({
        type: 'success',
        message: `Equipped ${item.name}! Profile frame icons updated. Click "Save" to zoom out to full body.`
      });
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  // Persist Equipped Configuration to LocalStorage & Simulated Supabase `user_equipment`
  const handleSaveAndEquip = () => {
    const verified = resolveSafeEquipment(previewEquipment);
    setSavedEquipment(verified);
    setPreviewEquipment(verified);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(verified));
      window.dispatchEvent(new CustomEvent('aura-equipment-updated', { detail: verified }));
    } catch {
      // fallback if storage restricted
    }

    if (onEquipmentSaved) {
      onEquipmentSaved(verified);
    }

    // Zoom camera out to view the full body character
    setCameraAngle('full');

    setSyncStatus({
      type: 'success',
      message: 'Loadout saved & camera zoomed out to full body!'
    });
    setTimeout(() => setSyncStatus(null), 4000);
  };

  const handleResetToSaved = () => {
    setPreviewEquipment(savedEquipment);
    setSelectedLockedItem(null);
    setCameraAngle('full');
    setSyncStatus({
      type: 'info',
      message: 'Reverted preview to your last saved loadout.'
    });
    setTimeout(() => setSyncStatus(null), 2500);
  };

  return (
    <div
      className={`aura-char-customizer-root ${
        embedded
          ? 'is-embedded text-slate-100 font-sans'
          : 'is-standalone min-h-screen bg-[#070A12] text-slate-100 font-sans pb-16'
      }`}
    >
      {/* ==================== STATUS TOAST BANNER ==================== */}
      {syncStatus && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-4">
          <div
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
              syncStatus.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                : syncStatus.type === 'locked'
                ? 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                : 'bg-indigo-950/70 border-indigo-500/50 text-indigo-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {syncStatus.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {syncStatus.type === 'locked' && <Lock className="w-4 h-4 text-rose-400 shrink-0" />}
              {syncStatus.type === 'info' && <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />}
              <span>{syncStatus.message}</span>
            </div>
            <button onClick={() => setSyncStatus(null)} className="text-xs opacity-75 hover:opacity-100">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ==================== MAIN TWO-COLUMN CUSTOMIZATION WORKSPACE ==================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* -------------------- LEFT COLUMN: LIVE CHARACTER PREVIEW STAGE -------------------- */}
        <section className="lg:col-span-5 bg-[#0D1322] border border-slate-800/90 rounded-2xl p-5 shadow-2xl lg:sticky lg:top-20">
          {/* Stage Header Controls */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Live SVG Character Stage
              </span>
              <h2 className="text-lg font-bold text-white truncate max-w-[260px] sm:max-w-xs" title={`${userName} â€¢ Lvl ${level}`}>
                {userName ? `${userName} â€¢ Lvl ${level}` : 'Student Loadout Preview'}
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Frame Visibility Toggle (Icon Only) */}
              <button
                onClick={() => {
                  if (activeCategory === 'frame') {
                    setSyncStatus({
                      type: 'info',
                      message: 'Frame is always visible while in the Frames section.'
                    });
                    setTimeout(() => setSyncStatus(null), 2500);
                    return;
                  }
                  setShowFrame(v => !v);
                }}
                className={`p-2 rounded-lg border text-xs transition shadow-sm ${
                  isFrameVisible
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                    : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={
                  activeCategory === 'frame'
                    ? 'Frame is locked visible in Frames section'
                    : isFrameVisible
                    ? 'Hide avatar frame'
                    : 'Show avatar frame'
                }
                aria-label={isFrameVisible ? 'Hide avatar frame' : 'Show avatar frame'}
              >
                <Frame className={`w-4 h-4 ${isFrameVisible ? 'text-indigo-400' : 'text-slate-400'}`} />
              </button>

              {/* Camera Focus Toggle (Icon Only) */}
              <button
                onClick={() => setCameraAngle(c => (c === 'full' ? getCameraAngleForCategory(activeCategory) : 'full'))}
                className={`p-2 rounded-lg border text-xs transition shadow-sm ${
                  cameraAngle !== 'full'
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                    : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={cameraAngle === 'full' ? 'Zoom focus camera' : 'Reset camera to full body'}
                aria-label={cameraAngle === 'full' ? 'Zoom focus camera' : 'Reset camera to full body'}
              >
                {cameraAngle === 'full' ? (
                  <ZoomIn className="w-4 h-4 text-indigo-400" />
                ) : (
                  <ZoomOut className="w-4 h-4 text-amber-400" />
                )}
              </button>

              {/* Layer Inspector (Icon Only) */}
              <button
                onClick={() => setInspectLayerOrder(v => !v)}
                className={`p-2 rounded-lg border text-xs transition ${
                  inspectLayerOrder
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200'
                    : 'bg-slate-800/90 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Inspect 14 SVG Layers"
                aria-label="Inspect 14 SVG Layers"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Unsaved Changes Indicator Pill */}
          {hasUnsavedChanges && (
            <div className="mb-3 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-between text-xs text-amber-300">
              <span>Previewing unsaved changes</span>
              <span className="font-semibold">Click &ldquo;Equip Loadout&rdquo; to save</span>
            </div>
          )}

          {/* Main SVG Character Canvas Container */}
          <div className="relative w-full h-[390px] sm:h-[430px] rounded-2xl bg-gradient-to-b from-[#131B31] via-[#0E1424] to-[#090D18] border border-slate-800/80 flex items-center justify-center overflow-hidden p-3">
            {/* Smooth Animated Camera Viewport */}
            <div
              className="camera-stage-viewport w-full h-full flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transform: CAMERA_TRANSFORMS[cameraAngle] || CAMERA_TRANSFORMS.full,
                transformOrigin: '50% 50%',
                willChange: 'transform',
              }}
            >
              <CharacterRenderer
                equipment={previewEquipment}
                cropMode="full"
                showFrame={isFrameVisible}
                level={level}
                className="w-full h-full max-h-[405px]"
                forceStandard={true}
              />
            </div>

            {/* Optional 14-Layer Order Overlay Inspector */}
            {inspectLayerOrder && (
              <div className="absolute inset-2 bg-slate-950/90 backdrop-blur-md rounded-xl p-3.5 overflow-y-auto border border-indigo-500/30 text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Active 14-Layer SVG Stack Order
                  </span>
                  <button
                    onClick={() => setInspectLayerOrder(false)}
                    className="text-slate-400 hover:text-white text-[11px]"
                  >
                    Close
                  </button>
                </div>
                <ol className="space-y-1 text-[11px] font-mono text-slate-300">
                  <li>01. EnvironmentAura ({previewEquipment.frame})</li>
                  <li>02. BackAccessories ({previewEquipment.specialEffect})</li>
                  <li>03. RearHair ({previewEquipment.hairstyle})</li>
                  <li>04. BodyBase & Legs (skin: {previewEquipment.skinTone})</li>
                  <li>05. CharacterPants ({previewEquipment.lowerOutfit})</li>
                  <li>06. CharacterShoes ({previewEquipment.shoes})</li>
                  <li>07. CharacterOutfit ({previewEquipment.upperOutfit})</li>
                  <li>08. NeckAndHeadBase (skin: {previewEquipment.skinTone})</li>
                  <li>09. CharacterFaceAndEyes (eyes: {previewEquipment.eyeColor})</li>
                  <li>10. FrontHair ({previewEquipment.hairstyle})</li>
                  <li>11. FaceAccessories ({previewEquipment.faceAccessory})</li>
                  <li>12. CharacterLanyard ({previewEquipment.lanyard})</li>
                  <li>13. FrontAccessories ({previewEquipment.specialEffect})</li>
                  <li>14. CharacterFrame ({previewEquipment.frame})</li>
                </ol>
              </div>
            )}
          </div>

          {/* Physical Trait Color Pickers (Hair Color, Skin Tone, Eye Color) */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-3">
            {/* Hair Color Selector */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" /> Hair Color:
              </span>
              <div className="flex items-center gap-1.5">
                {HAIR_COLORS.map(color => (
                  <button
                    key={color.id}
                    onClick={() => {
                      setPreviewEquipment(p => ({ ...p, hairColor: color.id }));
                      setCameraAngle('head');
                    }}
                    style={{ backgroundColor: color.primary }}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      previewEquipment.hairColor === color.id
                        ? 'border-white scale-110 ring-2 ring-indigo-500/60'
                        : 'border-slate-700 hover:scale-105'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Skin Tone & Eye Color Row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-400 mr-1">Skin:</span>
                {SKIN_TONES.map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => {
                      setPreviewEquipment(p => ({ ...p, skinTone: tone.id }));
                      setCameraAngle('head');
                    }}
                    style={{ backgroundColor: tone.base }}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      previewEquipment.skinTone === tone.id
                        ? 'border-white scale-110 ring-2 ring-indigo-500/60'
                        : 'border-slate-700'
                    }`}
                    title={tone.name}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-slate-400 mr-1">Eyes:</span>
                {EYE_COLORS.map(eye => (
                  <button
                    key={eye.id}
                    onClick={() => {
                      setPreviewEquipment(p => ({ ...p, eyeColor: eye.id }));
                      setCameraAngle('head');
                    }}
                    style={{ backgroundColor: eye.main }}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${
                      previewEquipment.eyeColor === eye.id
                        ? 'border-white scale-110 ring-2 ring-indigo-500/60'
                        : 'border-slate-700'
                    }`}
                    title={eye.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Primary Equip & Reset Action Buttons */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSaveAndEquip}
              disabled={!hasUnsavedChanges && cameraAngle === 'full'}
              className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                hasUnsavedChanges || cameraAngle !== 'full'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/25 cursor-pointer'
                  : 'bg-slate-800/80 text-slate-500 border border-slate-700/60 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {hasUnsavedChanges
                ? 'Equip & Save Loadout'
                : cameraAngle !== 'full'
                ? 'Save & View Full Body'
                : 'Loadout Equipped'}
            </button>

            <button
              onClick={handleResetToSaved}
              disabled={!hasUnsavedChanges}
              className="py-2.5 px-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 disabled:opacity-40 text-slate-300 border border-slate-700 text-sm font-medium flex items-center gap-1.5 transition"
              title="Reset to Saved Configuration"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </section>

        {/* -------------------- RIGHT COLUMN: CATEGORY TABS & ITEM SELECTION GRID -------------------- */}
        <section className="lg:col-span-7 space-y-5">
          {/* Category Navigation Bar */}
          <div className="bg-[#0D1322] border border-slate-800/90 rounded-2xl p-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                const equippedId = previewEquipment[cat.id];
                const equippedItem = EQUIPMENT_REGISTRY.find(i => i.id === equippedId);

                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setSelectedLockedItem(null);
                      const targetCamera = getCameraAngleForCategory(cat.id);
                      setCameraAngle(targetCamera);
                    }}
                    className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {EQUIPMENT_REGISTRY.filter(i => i.category === cat.id).length}
                      </span>
                    </div>
                    <span className="text-xs font-bold leading-tight">{cat.label}</span>
                    <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                      {equippedItem ? equippedItem.name : 'None'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filter Bar & Category Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D1322] border border-slate-800/90 rounded-2xl px-5 py-3.5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {CATEGORIES.find(c => c.id === activeCategory)?.label}
              </h3>
              <p className="text-xs text-slate-400">
                Select any unlocked cosmetic to update your live character immediately.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              {['all', 'unlocked', 'locked'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition ${
                    filterMode === mode
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Locked Item Requirement Inspection Banner */}
          {selectedLockedItem && (
            <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Lock className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{selectedLockedItem.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${RARITY_CONFIG[selectedLockedItem.rarity].badge}`}>
                      {selectedLockedItem.rarity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{selectedLockedItem.description}</p>
                  <p className="text-xs font-semibold text-amber-300 mt-1 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> Unlock Requirement: {selectedLockedItem.unlockRequirement}
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 shrink-0">
                Unlocked via Campus Quests & Achievements
              </span>
            </div>
          )}

          {/* Item Selection Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categoryItems.map(item => {
              const unlocked = isItemUnlocked(item);
              const isPreviewEquipped = previewEquipment[item.category] === item.id;
              const isSavedEquipped = savedEquipment[item.category] === item.id;
              const rarityStyle = RARITY_CONFIG[item.rarity] || RARITY_CONFIG.Common;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`group relative flex flex-col rounded-2xl border p-3.5 text-left transition-all ${
                    isPreviewEquipped
                      ? 'bg-indigo-950/40 border-indigo-400 ring-2 ring-indigo-500/40'
                      : unlocked
                      ? `bg-[#0D1322] ${rarityStyle.cardBorder} ${rarityStyle.glow}`
                      : 'bg-[#0A0E1A]/90 border-slate-800/80 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* Top Badges: Rarity + Equipped/Locked Status */}
                  <div className="flex items-center justify-between w-full gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rarityStyle.badge}`}>
                      {item.rarity}
                    </span>

                    {isSavedEquipped ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <Check className="w-3 h-3" /> Equipped
                      </span>
                    ) : isPreviewEquipped ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-400/50">
                        Previewing
                      </span>
                    ) : !unlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-500/40">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : null}
                  </div>

                  {/* SVG Layer Mini Thumbnail Box */}
                  <div className={`relative w-full ${item.category === 'frame' ? 'h-36 flex items-center justify-center p-1.5' : 'h-32 p-2'} rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-center overflow-hidden my-1 group-hover:border-slate-700 transition`}>
                    <div className={item.category === 'frame' ? 'w-28 h-28 rounded-full overflow-hidden shadow-md flex items-center justify-center' : 'w-full h-full'}>
                      <ItemThumbnailPreview
                        item={item}
                        hairColor={previewEquipment.hairColor}
                        skinTone={previewEquipment.skinTone}
                      />
                    </div>
                    {!unlocked && (
                      <div className={`absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-center ${item.category === 'frame' ? 'rounded-full' : ''}`}>
                        <Lock className="w-5 h-5 text-rose-400 mb-1" />
                        <span className="text-[10px] font-semibold text-amber-300 leading-tight">
                          {item.unlockRequirement}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Item Name, Description & Requirement Footer */}
                  <div className="mt-2 flex-1 flex flex-col justify-between w-full">
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                      <span className={unlocked ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                        {unlocked ? 'âœ“ Unlocked' : item.unlockRequirement}
                      </span>
                      <span className="text-slate-500 font-mono">{item.id}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
