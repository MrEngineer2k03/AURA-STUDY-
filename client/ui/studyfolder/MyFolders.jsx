import { useState, useMemo, useEffect, useRef } from 'react';
import FolderHeader from './FolderHeader';
import ContinueHeroCard from './ContinueHeroCard';
import FolderToolbar from './FolderToolbar';
import FolderGrid from './FolderGrid';
import RecentActivity from './RecentActivity';
import CreateFolderModal from './CreateFolderModal';
import StudyTypeModal from './StudyTypeModal';
import FlashcardEditor from './flashcards/FlashcardEditor';
import FlashcardsPage from './flashcards/FlashcardsPage';
import ArchiveSection from './ArchiveSection';
import FolderFilesModal from './FolderFilesModal';
import './MyFolders.css';

import characterImg from '../character/character.png';
import auraLogo from '../dashboard/logoname.png';

/**
 * MyFolders - Dedicated "MY FOLDERS" Page for AURA with Study Creation & Archive System
 *
 * Full workflow:
 * 1. Active Folder Grid with Search, Filter & RPG Progression
 * 2. Archive Section for viewing and restoring archived folders & individual study files
 * 3. Folder Files Inspector for archiving/restoring files directly
 * 4. Study Type Selection & Flashcard Editor
 *
 * @param {Object} props
 * @param {Function} [props.onNavigateHome] - Callback to return to HOME tab
 * @param {Function} [props.onTabChange] - Callback to switch top-level navbar tabs
 * @param {Function} [props.onOpenFolder] - Callback when a folder is opened
 * @param {boolean} [props.showNavbar=true] - Whether to render top navigation
 * @param {boolean} [props.scrollToCreate=false] - Auto-scroll to Create Folder card
 */
export default function MyFolders({
  onNavigateHome,
  onTabChange,
  onOpenFolder,
  showNavbar = true,
  scrollToCreate = false,
  initialActiveFolder = null,
  initialView = 'grid',
}) {
  // Navigation tabs
  const navTabs = ['HOME', 'MY FOLDERS', 'FRIENDS', 'BATTLES', 'EVENTS'];
  const activeTab = 'MY FOLDERS';

  // Realistic Example Study Folders matching exact reference design (media_1793596234655_f4b8a921.jpg)
  const initialFolders = [
    {
      id: 'folder-test',
      title: 'Test',
      subtitle: 'for test',
      description: 'for test',
      progress: 0,
      lessons: 0,
      completed: 0,
      completedLessons: 0,
      cards: 1,
      members: 1,
      status: 'New',
      color: 'red',
      lastStudied: 'Just now',
      createdAt: '2026-10-25',
      department: 'Testing',
      isShared: false,
      isArchived: false,
      studyType: 'flashcards',
      flashcards: [
        {
          id: 'fc-test-1',
          question: 'Who is the prettiest woman in your life?',
          answer: 'Stepanie',
        },
      ],
    },
    {
      id: 'folder-biz',
      title: 'Business Strategy',
      subtitle: 'Entrepreneurship',
      description: 'Market analysis, business model canvas, and venture scalability',
      progress: 25,
      lessons: 4,
      completed: 1,
      completedLessons: 1,
      members: 1,
      cards: 1,
      status: 'In progress',
      color: 'orange',
      lastStudied: '5h ago',
      createdAt: '2026-10-01',
      department: 'Business',
      isShared: false,
      isArchived: false,
      studyType: 'flashcards',
      flashcards: [
        {
          id: 'fc-biz-1',
          question: 'What is a value proposition?',
          answer: 'The promise of value to be delivered and acknowledged.',
        },
      ],
    },
    {
      id: 'folder-db',
      title: 'Database Systems',
      subtitle: 'SQL and Relational Databases',
      description: 'SQL queries, relational algebra, indexing, and ACID transactions',
      progress: 100,
      lessons: 7,
      completed: 7,
      completedLessons: 7,
      cards: 1,
      members: 2,
      status: 'Completed',
      color: 'cyan',
      lastStudied: '20h ago',
      createdAt: '2026-10-18',
      department: 'Computer Science',
      isShared: false,
      isArchived: false,
      studyType: 'flashcards',
      flashcards: [
        {
          id: 'fc-db-1',
          question: 'What does ACID stand for in databases?',
          answer: 'Atomicity, Consistency, Isolation, Durability.',
        },
      ],
    },
    {
      id: 'folder-bio',
      title: 'Biology 101',
      subtitle: 'Cell Structure and Function',
      description: 'Cell biology, organelles, DNA replication, and cellular respiration',
      progress: 63,
      lessons: 8,
      completed: 5,
      completedLessons: 5,
      cards: 1,
      members: 3,
      status: 'Shared',
      color: 'green',
      lastStudied: 'Yesterday',
      createdAt: '2026-09-25',
      department: 'Life Sciences',
      isShared: true,
      isArchived: false,
      studyType: 'flashcards',
      flashcards: [
        {
          id: 'fc-bio-1',
          question: 'What is the function of Mitochondria?',
          answer: 'Generates ATP energy via cellular respiration.',
        },
      ],
    },
    {
      id: 'folder-calc',
      title: 'Calculus Basics',
      subtitle: 'Limits and Derivatives',
      description: 'Differential calculus, limit laws, continuity, and chain rule',
      progress: 40,
      lessons: 5,
      completed: 2,
      completedLessons: 2,
      cards: 1,
      members: 1,
      status: 'In progress',
      color: 'blue',
      lastStudied: 'Yesterday',
      createdAt: '2026-09-20',
      department: 'Mathematics',
      isShared: false,
      isArchived: false,
      studyType: 'flashcards',
      flashcards: [
        {
          id: 'fc-calc-1',
          question: 'What is the derivative of sin(x)?',
          answer: 'cos(x)',
        },
      ],
    },
    {
      id: 'folder-prog',
      title: 'Programming Exam',
      subtitle: 'JavaScript Fundamentals',
      description: 'Async/await, event loop, closures, and ES6+ features',
      progress: 67,
      lessons: 6,
      completed: 4,
      completedLessons: 4,
      cards: 4,
      members: 4,
      status: 'In progress',
      color: 'purple',
      lastStudied: '3d ago',
      createdAt: '2026-09-22',
      department: 'Computer Science',
      isShared: false,
      isArchived: false,
      studyType: 'flashcards',
      flashcards: [
        {
          id: 'fc-prog-1',
          question: 'What is a closure in JavaScript?',
          answer: 'A closure is the combination of a function bundled together with references to its lexical environment.',
        },
        {
          id: 'fc-prog-2',
          question: 'What is the Event Loop?',
          answer: 'The event loop continuously checks call stack and message queue to execute tasks.',
        },
        {
          id: 'fc-prog-3',
          question: 'What does Promise.all() do?',
          answer: 'Waits for all promises to resolve, or rejects when any promise rejects.',
        },
        {
          id: 'fc-prog-4',
          question: 'What is prototypal inheritance?',
          answer: 'A language feature that allows objects to inherit properties and methods directly from other objects.',
        },
      ],
    },
  ];

  // State Management with localStorage persistence (v6 key for latest redesign)
  const [folders, setFolders] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_study_folders_v6');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load folders from localStorage', e);
    }
    return initialFolders;
  });

  // Save to localStorage whenever folders change
  useEffect(() => {
    try {
      localStorage.setItem('aura_study_folders_v6', JSON.stringify(folders));
    } catch (e) {
      console.warn('Failed to save folders to localStorage', e);
    }
  }, [folders]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'in-progress' | 'completed' | 'shared' | 'new' | 'archived'
  const [sortBy, setSortBy] = useState('recent-studied'); // 'recent-studied' | 'recent-created' | 'progress' | 'alpha'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Section State: Archive View vs Active View
  const [isArchiveView, setIsArchiveView] = useState(false);

  // Workflow Dialog / Navigation States
  const [currentView, setCurrentView] = useState(() => {
    if (initialActiveFolder) return 'flashcards';
    return initialView || 'grid';
  }); // 'grid' | 'flashcards' | 'flashcard-editor'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStudyTypeModalOpen, setIsStudyTypeModalOpen] = useState(false);
  const [activeFolderForStudy, setActiveFolderForStudy] = useState(() => {
    if (!initialActiveFolder) return null;
    const targetId =
      initialActiveFolder.id === 1
        ? 'folder-1'
        : initialActiveFolder.id === 2
        ? 'folder-2'
        : initialActiveFolder.id === 3
        ? 'folder-3'
        : initialActiveFolder.id;
    return (
      folders.find((f) => f.id === targetId || f.id === initialActiveFolder.id) ||
      initialActiveFolder
    );
  });

  // Sync active folder when initialActiveFolder changes
  useEffect(() => {
    if (initialActiveFolder) {
      const targetId =
        initialActiveFolder.id === 1
          ? 'folder-1'
          : initialActiveFolder.id === 2
          ? 'folder-2'
          : initialActiveFolder.id === 3
          ? 'folder-3'
          : initialActiveFolder.id;
      const fresh =
        folders.find((f) => f.id === targetId || f.id === initialActiveFolder.id) ||
        initialActiveFolder;
      setActiveFolderForStudy(fresh);
      setCurrentView('flashcards');
    }
  }, [initialActiveFolder, folders]);

  // Folder Materials Inspector State
  const [inspectingFolder, setInspectingFolder] = useState(null);

  // Toast Notification State
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  const showToast = (message, undoAction = null) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, undoAction });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Keep inspectingFolder state synced when folders update
  useEffect(() => {
    if (inspectingFolder) {
      const fresh = folders.find((f) => f.id === inspectingFolder.id);
      if (fresh) {
        setInspectingFolder(fresh);
      }
    }
  }, [folders]);

  // Separate Active and Archived Folders
  const activeFolders = useMemo(() => {
    return folders.filter(
      (f) => !f.isArchived && f.status?.toLowerCase() !== 'archived'
    );
  }, [folders]);

  const archivedFolders = useMemo(() => {
    return folders.filter(
      (f) => Boolean(f.isArchived || f.status?.toLowerCase() === 'archived')
    );
  }, [folders]);

  // Aggregate all archived files across all folders
  const allArchivedFiles = useMemo(() => {
    const list = [];
    folders.forEach((folder) => {
      if (folder.lessonItems && Array.isArray(folder.lessonItems)) {
        folder.lessonItems.forEach((item) => {
          if (item.isArchived) {
            list.push({
              ...item,
              folderId: folder.id,
              folderTitle: folder.title,
              folderColor: folder.color,
            });
          }
        });
      }
    });
    return list;
  }, [folders]);

  // Auto-scroll to Create Folder card when redirected from Home page
  useEffect(() => {
    if (scrollToCreate && currentView === 'grid' && !isArchiveView) {
      const timer = setTimeout(() => {
        const createCard =
          document.getElementById('create-folder-card') ||
          document.getElementById('create-folder-card-section') ||
          document.querySelector('.create-folder-grid-card');
        if (createCard) {
          createCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          createCard.classList.add('card-highlight-pulse');
          if (typeof createCard.focus === 'function') {
            createCard.focus();
          }
          const pulseTimer = setTimeout(() => {
            createCard.classList.remove('card-highlight-pulse');
          }, 3500);
          return () => clearTimeout(pulseTimer);
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [scrollToCreate, currentView, isArchiveView]);

  // Handle Tab Navigation Click
  const handleNavTabClick = (tab) => {
    if (tab === 'HOME') {
      if (onNavigateHome) onNavigateHome();
      else if (onTabChange) onTabChange('HOME');
    } else if (onTabChange) {
      onTabChange(tab);
    }
  };

  // STEP 1: Create Folder Submission
  const handleCreateFolderSubmit = (newFolderData) => {
    const preparedFolder = {
      ...newFolderData,
      isArchived: false,
    };
    setFolders((prev) => [preparedFolder, ...prev]);
    setActiveFolderForStudy(preparedFolder);
    setIsCreateModalOpen(false);
    showToast(`Folder "${preparedFolder.title}" created successfully.`);
    // Transition immediately to Step 2: Study Type Selection
    setIsStudyTypeModalOpen(true);
  };

  // STEP 2: Study Type Selection (Flashcards)
  const handleSelectStudyType = (studyType, folder) => {
    setIsStudyTypeModalOpen(false);
    const updatedFolder = {
      ...folder,
      studyType,
    };
    setFolders((prev) =>
      prev.map((f) => (f.id === folder.id ? updatedFolder : f))
    );
    setActiveFolderForStudy(updatedFolder);
    // Transition directly to Flashcards section
    setCurrentView('flashcards');
  };

  // STEP 3: Save Progress in Flashcard Editor
  const handleSaveFlashcardProgress = (updatedFolder) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === updatedFolder.id ? updatedFolder : f))
    );
    setActiveFolderForStudy(updatedFolder);
  };

  // STEP 4: Finish & Save -> Return to My Folders Grid
  const handleFinishFlashcards = (finalFolder) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === finalFolder.id ? finalFolder : f))
    );
    setActiveFolderForStudy(finalFolder);
    setCurrentView('flashcards');
    showToast(`Saved study materials for "${finalFolder.title}".`);
  };

  // Open Folder Handler (Navigation / Study)
  const handleOpenFolder = (folder) => {
    if (onOpenFolder) {
      onOpenFolder(folder);
    } else {
      setActiveFolderForStudy(folder);
      setCurrentView('flashcards');
    }
  };

  // Study Folder Handler (Primary button "Start Studying →")
  const handleStudyFolder = (folder) => {
    setActiveFolderForStudy(folder);
    setCurrentView('flashcards');
  };

  // ==========================================
  // ARCHIVE & RESTORE HANDLERS
  // ==========================================

  // Archive a Folder
  const handleArchiveFolder = (folder) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folder.id
          ? {
              ...f,
              isArchived: true,
              status: 'Archived',
              archivedAt: new Date().toISOString(),
            }
          : f
      )
    );
    showToast(
      `Folder "${folder.title}" moved to Archive.`,
      () => handleRestoreFolder(folder)
    );
  };

  // Restore a Folder
  const handleRestoreFolder = (folder) => {
    setFolders((prev) =>
      prev.map((f) =>
        f.id === folder.id
          ? {
              ...f,
              isArchived: false,
              status: (f.progress || 0) >= 100 ? 'Completed' : 'In Progress',
              archivedAt: null,
            }
          : f
      )
    );
    showToast(`Restored ${folder.title}`, () => handleArchiveFolder(folder));
  };

  // Restore All Archived Folders and Files (Image 3 confirmation workflow)
  const handleRestoreAllFolders = () => {
    setFolders((prev) =>
      prev.map((f) => {
        const updatedItems = (f.lessonItems || []).map((item) =>
          item.isArchived ? { ...item, isArchived: false, archivedAt: null } : item
        );
        if (f.isArchived) {
          return {
            ...f,
            isArchived: false,
            status: (f.progress || 0) >= 100 ? 'Completed' : 'In Progress',
            archivedAt: null,
            lessonItems: updatedItems,
          };
        }
        return { ...f, lessonItems: updatedItems };
      })
    );
    showToast('Restored all archived items');
  };

  // Permanently Delete Folder
  const handleDeleteFolder = (folderId) => {
    const target = folders.find((f) => f.id === folderId);
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    if (inspectingFolder?.id === folderId) {
      setInspectingFolder(null);
    }
    showToast(`Folder "${target?.title || 'Item'}" permanently removed.`);
  };

  // Archive an Individual File in a Folder
  const handleArchiveFile = (file, folderId) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          const updatedItems = (f.lessonItems || []).map((item) =>
            item.id === file.id
              ? {
                  ...item,
                  isArchived: true,
                  archivedAt: new Date().toISOString(),
                }
              : item
          );
          return { ...f, lessonItems: updatedItems };
        }
        return f;
      })
    );
    showToast(`File "${file.fileName}" moved to Archive Section.`);
  };

  // Restore an Individual File
  const handleRestoreFile = (file, folderId) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          const updatedItems = (f.lessonItems || []).map((item) =>
            item.id === file.id
              ? {
                  ...item,
                  isArchived: false,
                  archivedAt: null,
                }
              : item
          );
          return { ...f, lessonItems: updatedItems };
        }
        return f;
      })
    );
    showToast(`Restored ${file.fileName}`, () => handleArchiveFile(file, folderId));
  };

  // Delete an Individual File
  const handleDeleteFile = (fileId, folderId) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          const updatedItems = (f.lessonItems || []).filter((item) => item.id !== fileId);
          return { ...f, lessonItems: updatedItems };
        }
        return f;
      })
    );
    showToast('File permanently deleted.');
  };

  // Add/Upload a New File to Folder
  const handleAddFileToFolder = (newFile, folderId) => {
    setFolders((prev) =>
      prev.map((f) => {
        if (f.id === folderId) {
          const currentItems = f.lessonItems || [];
          const updatedItems = [newFile, ...currentItems];
          return {
            ...f,
            lessonItems: updatedItems,
            lessons: Math.max(f.lessons || 0, updatedItems.length),
          };
        }
        return f;
      })
    );
    showToast(`Uploaded "${newFile.fileName}" to folder.`);
  };

  // Three-dot Action Menu Handler
  const handleFolderAction = (actionType, folder) => {
    switch (actionType) {
      case 'open':
        handleOpenFolder(folder);
        break;
      case 'archive':
        handleArchiveFolder(folder);
        break;
      case 'restore':
        handleRestoreFolder(folder);
        break;
      case 'inspectFiles':
        setInspectingFolder(folder);
        break;
      case 'rename': {
        const newName = window.prompt('Rename folder:', folder.title);
        if (newName && newName.trim()) {
          setFolders((prev) =>
            prev.map((f) => (f.id === folder.id ? { ...f, title: newName.trim() } : f))
          );
          showToast(`Folder renamed to "${newName.trim()}".`);
        }
        break;
      }
      case 'delete':
        if (window.confirm(`Are you sure you want to delete "${folder.title}"?`)) {
          handleDeleteFolder(folder.id);
        }
        break;
      case 'duplicate': {
        const duplicated = {
          ...folder,
          id: `folder-${Date.now()}`,
          title: `${folder.title} (Copy)`,
          isArchived: false,
          createdAt: new Date().toISOString(),
        };
        setFolders((prev) => [duplicated, ...prev]);
        showToast(`Duplicated "${folder.title}".`);
        break;
      }
      case 'share':
        console.log(`[AURA] Sharing link generated for folder ${folder.id}`);
        showToast(`Share link copied for "${folder.title}".`);
        break;
      default:
        break;
    }
  };

  // Filter counts calculation matching reference design
  const filterCounts = useMemo(() => {
    const all = activeFolders.length;
    let inProgress = 0;
    let completed = 0;
    let shared = 0;
    let newCount = 0;

    activeFolders.forEach((f) => {
      const s = (f.status || '').toLowerCase();
      const p = f.progress || 0;
      if (s.includes('new') || p === 0) {
        newCount++;
      } else if (s.includes('completed') || p >= 100) {
        completed++;
      } else if (s.includes('shared') || f.isShared) {
        shared++;
      } else {
        inProgress++;
      }
    });

    return { all, inProgress, completed, shared, new: newCount };
  }, [activeFolders]);

  // Featured Hero Folder ("Business Strategy" or most recent active)
  const heroFolder = useMemo(() => {
    const found = activeFolders.find((f) =>
      f.title?.toLowerCase().includes('business strategy')
    );
    return found || activeFolders[0] || null;
  }, [activeFolders]);

  // Filter & Search & Sort Pipeline
  const filteredActiveFolders = useMemo(() => {
    return folders
      .filter((folder) => {
        const isArchived = Boolean(
          folder.isArchived || folder.status?.toLowerCase() === 'archived'
        );
        if (isArchived) return false;

        // Search Filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          folder.title.toLowerCase().includes(query) ||
          folder.subtitle?.toLowerCase().includes(query) ||
          folder.department?.toLowerCase().includes(query) ||
          (Array.isArray(folder.lessonItems) &&
            folder.lessonItems.some(
              (item) =>
                item.fileName?.toLowerCase().includes(query) ||
                item.title?.toLowerCase().includes(query)
            ));

        if (!matchesSearch) return false;

        // Tab Filter
        if (activeFilter === 'in-progress') {
          const s = (folder.status || '').toLowerCase();
          const p = folder.progress || 0;
          return !s.includes('new') && !s.includes('completed') && p > 0 && p < 100;
        }
        if (activeFilter === 'completed') {
          const s = (folder.status || '').toLowerCase();
          const p = folder.progress || 0;
          return s.includes('completed') || p >= 100;
        }
        if (activeFilter === 'shared') {
          return Boolean(folder.isShared || folder.status?.toLowerCase().includes('shared'));
        }
        if (activeFilter === 'new') {
          const s = (folder.status || '').toLowerCase();
          const p = folder.progress || 0;
          return s.includes('new') || p === 0;
        }
        return true; // 'all' shows all active (non-archived) folders
      })
      .sort((a, b) => {
        if (sortBy === 'progress') {
          return b.progress - a.progress;
        }
        if (sortBy === 'alpha') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'recent-created') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        return 0; // 'recent-studied'
      });
  }, [folders, searchQuery, activeFilter, sortBy]);

  // Navbar Component
  const renderNavbar = (isFlashcardMode = false) => (
    <header className={`aura-navbar ${isFlashcardMode ? 'is-flashcard-navbar' : ''}`}>
      <div className="navbar-left">
        {isFlashcardMode ? (
          <div
            className="navbar-brand-text-only"
            style={{ cursor: 'pointer' }}
            onClick={() => handleNavTabClick('HOME')}
          >
            AURA
          </div>
        ) : (
          <img
            src={auraLogo}
            alt="AURA"
            className="navbar-brand-logo"
            style={{ cursor: 'pointer' }}
            onClick={() => handleNavTabClick('HOME')}
          />
        )}
        {!isFlashcardMode && <span className="navbar-separator">·</span>}
        {!isFlashcardMode && (
          <nav className="navbar-nav-links" aria-label="Main Navigation">
            {navTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`nav-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleNavTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="navbar-right">
        <div className="coins-badge">
          <span>🪙</span>
          <span>2,450</span>
        </div>

        {/* Mobile user profile avatar circle with neon red glowing ring */}
        <div className="mobile-user-avatar-wrap" title="User Profile">
          <img src="/user_avatar.jpg" alt="Carl" className="mobile-user-avatar-img" />
          <span className="mobile-user-avatar-status" aria-hidden="true" />
        </div>

        <button
          type="button"
          className="icon-btn-round desktop-only-element"
          aria-label="Notifications"
        >
          🔔
        </button>

        {!isFlashcardMode && (
          <div className="user-profile-chip desktop-only-element">
            <div className="user-avatar-circle">
              <img
                src={characterImg}
                alt="Carl"
                className="user-avatar-img"
              />
            </div>
            <div className="user-info-text">
              <span className="user-info-name">CARL_MONDIGO</span>
              <span className="user-info-dept">Lv. 12 · Engineering</span>
            </div>
            <span className="user-chevron">▾</span>
          </div>
        )}
      </div>
    </header>
  );

  // VIEW 1: DEDICATED FLASHCARDS SECTION VIEW
  if (currentView === 'flashcards' && activeFolderForStudy) {
    return (
      <div className="my-folders-page-root in-flashcard-view">
        <div className="my-folders-ambient-bg" aria-hidden="true" />
        {showNavbar && renderNavbar(true)}
        <FlashcardsPage
          folder={activeFolderForStudy}
          onBackToFolders={() => setCurrentView('grid')}
          onUpdateFolder={(updatedFolder) => {
            setFolders((prev) =>
              prev.map((f) => (f.id === updatedFolder.id ? updatedFolder : f))
            );
            setActiveFolderForStudy(updatedFolder);
          }}
        />
      </div>
    );
  }

  // VIEW 1B: FLASHCARD EDITOR VIEW
  if (currentView === 'flashcard-editor' && activeFolderForStudy) {
    return (
      <div className="my-folders-page-root">
        <div className="my-folders-ambient-bg" aria-hidden="true" />
        {showNavbar && renderNavbar()}
        <FlashcardEditor
          folder={activeFolderForStudy}
          onSaveProgress={handleSaveFlashcardProgress}
          onFinish={handleFinishFlashcards}
          onBack={() => setCurrentView('flashcards')}
        />
      </div>
    );
  }

  // VIEW 2: DEDICATED MY FOLDERS (ACTIVE GRID OR ARCHIVE SECTION)
  return (
    <div className={`my-folders-page-root ${isArchiveView ? 'in-archive-view' : ''}`}>
      {/* Ambient Cyber Atmosphere */}
      <div className="my-folders-ambient-bg" aria-hidden="true" />

      {/* 1. TOP NAVBAR */}
      {showNavbar && renderNavbar()}

      {/* 2. MAIN CONTENT STAGE */}
      <main className="my-folders-content-container">
        {/* Page Header matching reference */}
        <FolderHeader
          onCreateFolder={() => setIsCreateModalOpen(true)}
          folderCount={activeFolders.length}
          lastStudiedName={heroFolder?.title || 'Business Strategy'}
          isArchiveView={isArchiveView}
          onToggleArchive={() => {
            const nextView = !isArchiveView;
            setIsArchiveView(nextView);
            if (nextView) {
              setActiveFilter('archived');
            } else {
              setActiveFilter('all');
            }
          }}
          archivedCount={archivedFolders.length}
          onRestoreAll={handleRestoreAllFolders}
        />

        {/* CONDITIONALLY RENDER: ARCHIVE SECTION VS ACTIVE FOLDERS */}
        {isArchiveView ? (
          <ArchiveSection
            archivedFolders={archivedFolders}
            archivedFiles={allArchivedFiles}
            onRestoreFolder={handleRestoreFolder}
            onDeleteFolder={handleDeleteFolder}
            onOpenFolder={handleOpenFolder}
            onInspectFiles={(folder) => setInspectingFolder(folder)}
            onRestoreFile={handleRestoreFile}
            onDeleteFile={handleDeleteFile}
            onRestoreAll={handleRestoreAllFolders}
            onBackToFolders={() => {
              setIsArchiveView(false);
              setActiveFilter('all');
            }}
          />
        ) : (
          <>
            {/* "Continue where you left off" Hero Banner */}
            {heroFolder && (
              <ContinueHeroCard
                folder={heroFolder}
                onContinue={handleStudyFolder}
                onOpen={handleOpenFolder}
              />
            )}

            {/* Search & Filter Toolbar with Live Counts */}
            <FolderToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              filterCounts={filterCounts}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />

            {/* Responsive 4-Column Folder Grid or List */}
            <FolderGrid
              folders={filteredActiveFolders}
              viewMode={viewMode}
              onCreateFolder={() => setIsCreateModalOpen(true)}
              onOpenFolder={handleOpenFolder}
              onStudyFolder={handleStudyFolder}
              onFolderAction={handleFolderAction}
            />
          </>
        )}
      </main>

      {/* 3. STEP 1: CREATE FOLDER MODAL DIALOG */}
      <CreateFolderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateFolderSubmit}
      />

      {/* 4. STEP 2: STUDY TYPE SELECTION MODAL */}
      <StudyTypeModal
        isOpen={isStudyTypeModalOpen}
        folder={activeFolderForStudy}
        onClose={() => setIsStudyTypeModalOpen(false)}
        onSelectType={handleSelectStudyType}
      />

      {/* 5. FOLDER FILES INSPECTOR MODAL */}
      <FolderFilesModal
        isOpen={Boolean(inspectingFolder)}
        folder={inspectingFolder}
        onClose={() => setInspectingFolder(null)}
        onArchiveFile={handleArchiveFile}
        onRestoreFile={handleRestoreFile}
        onDeleteFile={handleDeleteFile}
        onAddFile={handleAddFileToFolder}
      />

      {/* 6. AURA TOAST NOTIFICATION */}
      {toast && (
        <div className="aura-toast-container" role="status" aria-live="polite">
          <div className="aura-toast">
            <span className="toast-icon">📦</span>
            <span className="toast-message">{toast.message}</span>
            {toast.undoAction && (
              <button
                type="button"
                className="toast-undo-btn"
                onClick={() => {
                  toast.undoAction();
                  setToast(null);
                }}
              >
                Undo
              </button>
            )}
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* 7. MOBILE BOTTOM NAVIGATION */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <div className="mobile-bottom-nav-inner">
          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'HOME' ? 'active' : ''}`}
            onClick={() => handleNavTabClick('HOME')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="mobile-nav-label">Home</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'MY FOLDERS' ? 'active' : ''}`}
            onClick={() => handleNavTabClick('MY FOLDERS')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="mobile-nav-label">My Study</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'BATTLES' ? 'active' : ''}`}
            onClick={() => handleNavTabClick('BATTLES')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="4" x2="20" y2="20" />
                <line x1="20" y1="4" x2="4" y2="20" />
                <line x1="2" y1="9" x2="9" y2="2" />
                <line x1="15" y1="2" x2="22" y2="9" />
                <line x1="2" y1="15" x2="9" y2="22" />
                <line x1="15" y1="22" x2="22" y2="15" />
              </svg>
            </div>
            <span className="mobile-nav-label">Battles</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'FRIENDS' ? 'active' : ''}`}
            onClick={() => handleNavTabClick('FRIENDS')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="mobile-nav-label">Friends</span>
          </button>

          <button
            type="button"
            className={`mobile-nav-item ${activeTab === 'EVENTS' ? 'active' : ''}`}
            onClick={() => handleNavTabClick('EVENTS')}
          >
            <div className="mobile-nav-icon-wrap">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="mobile-nav-label">Events</span>
          </button>
        </div>
        <div className="mobile-home-indicator" aria-hidden="true" />
      </nav>
    </div>
  );
}
