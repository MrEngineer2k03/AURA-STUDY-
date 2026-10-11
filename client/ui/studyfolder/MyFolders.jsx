import { useState, useMemo, useEffect, useRef } from 'react';
import FolderHeader from './FolderHeader';
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

  // Realistic Example Study Folders with pre-configured lesson items & archived material
  const initialFolders = [
    {
      id: 'folder-1',
      title: 'Physics Midterms',
      subtitle: 'Forces & Motion',
      description: 'Forces & Motion Comprehensive Review',
      progress: 82,
      lessons: 5,
      completed: 4,
      completedLessons: 4,
      members: 3,
      status: 'In Progress',
      color: 'red',
      lastStudied: '2 hours ago',
      createdAt: '2026-09-15',
      department: 'Engineering',
      isShared: false,
      isArchived: false,
      studyType: 'flashcards',
      lessonItems: [
        {
          id: 'file-101',
          fileName: 'Newton_Laws_Forces_Motion.pdf',
          fileSize: '2.4 MB',
          fileType: 'PDF',
          isArchived: false,
          createdAt: '2026-09-15',
        },
        {
          id: 'file-102',
          fileName: 'Friction_and_Equilibrium_Exercises.docx',
          fileSize: '1.1 MB',
          fileType: 'DOCX',
          isArchived: false,
          createdAt: '2026-09-18',
        },
      ],
      flashcards: [
        {
          id: 'card-101',
          folderId: 'folder-1',
          question: 'What is inertia?',
          answer: 'The property of an object to resist changes in its state of motion.',
          front: 'What is inertia?',
          back: 'The property of an object to resist changes in its state of motion.',
          status: 'mastered',
          createdAt: '2026-09-15T10:00:00Z',
          studiedAt: '2026-10-11T12:00:00Z',
          studyCount: 4,
          correctCount: 4,
          lessonTag: 'Newtonian Physics',
        },
        {
          id: 'card-102',
          folderId: 'folder-1',
          question: 'What is Newton’s second law formula?',
          answer: 'Force equals mass times acceleration (F = m × a).',
          front: 'What is Newton’s second law formula?',
          back: 'Force equals mass times acceleration (F = m × a).',
          status: 'learning',
          createdAt: '2026-09-16T14:30:00Z',
          studiedAt: '2026-10-11T14:15:00Z',
          studyCount: 2,
          correctCount: 1,
          lessonTag: 'Forces',
        },
        {
          id: 'card-103',
          folderId: 'folder-1',
          question: 'What is the definition of work in physics?',
          answer: 'Work is the energy transferred to or from an object via the application of force along a displacement.',
          front: 'What is the definition of work in physics?',
          back: 'Work is the energy transferred to or from an object via the application of force along a displacement.',
          status: 'mastered',
          createdAt: '2026-09-17T09:15:00Z',
          studiedAt: '2026-10-10T16:00:00Z',
          studyCount: 3,
          correctCount: 3,
          lessonTag: 'Energy',
        },
        {
          id: 'card-104',
          folderId: 'folder-1',
          question: 'What is power and what is its SI unit?',
          answer: 'Power is the rate of doing work or transferring energy. Its SI unit is the Watt (W = J/s).',
          front: 'What is power and what is its SI unit?',
          back: 'Power is the rate of doing work or transferring energy. Its SI unit is the Watt (W = J/s).',
          status: 'learning',
          createdAt: '2026-09-18T11:20:00Z',
          studiedAt: '2026-10-09T18:00:00Z',
          studyCount: 1,
          correctCount: 0,
          lessonTag: 'Power',
        },
        {
          id: 'card-105',
          folderId: 'folder-1',
          question: 'What is the law of conservation of momentum?',
          answer: 'The total momentum of an isolated system remains constant if no external net force acts upon it.',
          front: 'What is the law of conservation of momentum?',
          back: 'The total momentum of an isolated system remains constant if no external net force acts upon it.',
          status: 'new',
          createdAt: '2026-09-20T08:00:00Z',
          studiedAt: null,
          studyCount: 0,
          correctCount: 0,
          lessonTag: 'Momentum',
        },
      ],
    },
    {
      id: 'folder-2',
      title: 'Calculus Finals',
      subtitle: 'Differential Calculus',
      description: 'Derivatives, chain rule, and optimization',
      progress: 43,
      lessons: 8,
      completed: 3,
      completedLessons: 3,
      members: 1,
      status: 'In Progress',
      color: 'blue',
      lastStudied: 'Yesterday',
      createdAt: '2026-09-20',
      department: 'Engineering',
      isShared: false,
      isArchived: false,
      lessonItems: [
        {
          id: 'file-201',
          fileName: 'Differential_Calculus_Formula_Sheet.pdf',
          fileSize: '3.8 MB',
          fileType: 'PDF',
          isArchived: false,
          createdAt: '2026-09-20',
        },
      ],
      flashcards: [
        {
          id: 'card-calc-101',
          folderId: 'folder-2',
          question: 'What is the derivative of sin(x)?',
          answer: 'The derivative of sin(x) with respect to x is cos(x).',
          front: 'What is the derivative of sin(x)?',
          back: 'The derivative of sin(x) with respect to x is cos(x).',
          status: 'mastered',
          createdAt: '2026-09-20T10:00:00Z',
          studiedAt: '2026-10-10T11:00:00Z',
          studyCount: 2,
          correctCount: 2,
          lessonTag: 'Trigonometry',
        },
        {
          id: 'card-calc-102',
          folderId: 'folder-2',
          question: 'What is the chain rule for derivatives?',
          answer: 'If y = f(g(x)), then dy/dx = f\'(g(x)) * g\'(x).',
          front: 'What is the chain rule for derivatives?',
          back: 'If y = f(g(x)), then dy/dx = f\'(g(x)) * g\'(x).',
          status: 'learning',
          createdAt: '2026-09-21T10:00:00Z',
          studiedAt: '2026-10-10T11:15:00Z',
          studyCount: 1,
          correctCount: 0,
          lessonTag: 'Derivatives',
        },
        {
          id: 'card-calc-103',
          folderId: 'folder-2',
          question: 'What is L\'Hopital\'s Rule?',
          answer: 'A method of evaluating limits of indeterminate forms 0/0 or ∞/∞ by taking derivatives of the numerator and denominator.',
          front: 'What is L\'Hopital\'s Rule?',
          back: 'A method of evaluating limits of indeterminate forms 0/0 or ∞/∞ by taking derivatives of the numerator and denominator.',
          status: 'new',
          createdAt: '2026-09-22T10:00:00Z',
          studiedAt: null,
          studyCount: 0,
          correctCount: 0,
          lessonTag: 'Limits',
        },
      ],
    },
    {
      id: 'folder-3',
      title: 'Programming Exam',
      subtitle: 'JavaScript Fundamentals',
      description: 'Async, closures, and DOM events',
      progress: 67,
      lessons: 6,
      completed: 4,
      completedLessons: 4,
      members: 4,
      status: 'In Progress',
      color: 'purple',
      lastStudied: '3 days ago',
      createdAt: '2026-09-22',
      department: 'Computer Science',
      isShared: true,
      isArchived: false,
      lessonItems: [
        {
          id: 'file-301',
          fileName: 'Async_Await_and_Closures_Notes.txt',
          fileSize: '480 KB',
          fileType: 'TXT',
          isArchived: false,
          createdAt: '2026-09-22',
        },
      ],
      flashcards: [
        {
          id: 'card-dev-001',
          folderId: 'folder-3',
          question: 'What is food?',
          answer: 'Food is what we consume every day.',
          front: 'What is food?',
          back: 'Food is what we consume every day.',
          status: 'mastered',
          createdAt: '2026-09-22T10:00:00Z',
          studiedAt: '2026-10-11T09:00:00Z',
          studyCount: 3,
          correctCount: 3,
          lessonTag: 'General',
        },
        {
          id: 'card-dev-002',
          folderId: 'folder-3',
          question: 'What is photosynthesis?',
          answer: 'The process by which plants use sunlight to produce food from carbon dioxide and water.',
          front: 'What is photosynthesis?',
          back: 'The process by which plants use sunlight to produce food from carbon dioxide and water.',
          status: 'learning',
          createdAt: '2026-09-22T10:15:00Z',
          studiedAt: '2026-10-11T09:10:00Z',
          studyCount: 2,
          correctCount: 1,
          lessonTag: 'Biology',
        },
        {
          id: 'card-dev-003',
          folderId: 'folder-3',
          question: 'What is an algorithm?',
          answer: 'A step-by-step procedure for solving a problem or completing a task.',
          front: 'What is an algorithm?',
          back: 'A step-by-step procedure for solving a problem or completing a task.',
          status: 'mastered',
          createdAt: '2026-09-22T10:30:00Z',
          studiedAt: '2026-10-11T09:20:00Z',
          studyCount: 3,
          correctCount: 3,
          lessonTag: 'Algorithms',
        },
        {
          id: 'card-dev-004',
          folderId: 'folder-3',
          question: 'What is a closure in JavaScript?',
          answer: 'A closure is the combination of a function bundled together with references to its lexical environment.',
          front: 'What is a closure in JavaScript?',
          back: 'A closure is the combination of a function bundled together with references to its lexical environment.',
          status: 'new',
          createdAt: '2026-09-23T11:00:00Z',
          studiedAt: null,
          studyCount: 0,
          correctCount: 0,
          lessonTag: 'JavaScript',
        },
      ],
    },
    {
      id: 'folder-4',
      title: 'Database Systems',
      subtitle: 'SQL and Relational Databases',
      description: 'Indexing, ACID transactions, and normalization',
      progress: 100,
      lessons: 7,
      completed: 7,
      completedLessons: 7,
      members: 2,
      status: 'Completed',
      color: 'cyan',
      lastStudied: '4 days ago',
      createdAt: '2026-09-10',
      department: 'Computer Science',
      isShared: false,
      isArchived: false,
      lessonItems: [
        {
          id: 'file-401',
          fileName: 'SQL_Joins_Indexing_Transactions.pdf',
          fileSize: '4.2 MB',
          fileType: 'PDF',
          isArchived: false,
          createdAt: '2026-09-10',
        },
      ],
    },
    {
      id: 'folder-5',
      title: 'Engineering Mathematics',
      subtitle: 'Algebra and Trigonometry',
      description: 'Vectors, complex numbers, and matrices',
      progress: 18,
      lessons: 10,
      completed: 2,
      completedLessons: 2,
      members: 5,
      status: 'New',
      color: 'orange',
      lastStudied: '5 hours ago',
      createdAt: '2026-10-01',
      department: 'Engineering',
      isShared: true,
      isArchived: false,
      lessonItems: [
        {
          id: 'file-501',
          fileName: 'Algebra_and_Matrices_Slides.pptx',
          fileSize: '5.6 MB',
          fileType: 'PPTX',
          isArchived: false,
          createdAt: '2026-10-01',
        },
      ],
    },
    {
      id: 'folder-archived-1',
      title: 'Chemistry 101',
      subtitle: 'Periodic Trends & Bonding',
      description: 'First semester comprehensive general chemistry unit',
      progress: 100,
      lessons: 9,
      completed: 9,
      completedLessons: 9,
      members: 2,
      status: 'Archived',
      color: 'cyan',
      lastStudied: '2 weeks ago',
      createdAt: '2026-08-10',
      archivedAt: '2026-09-28',
      department: 'Chemistry',
      isShared: false,
      isArchived: true,
      studyType: 'flashcards',
      lessonItems: [
        {
          id: 'file-arc-1',
          fileName: 'Organic_Chemistry_Bonding_Guide.pdf',
          fileSize: '3.1 MB',
          fileType: 'PDF',
          isArchived: true,
          archivedAt: '2026-09-28',
          createdAt: '2026-08-10',
        },
        {
          id: 'file-arc-2',
          fileName: 'Chemical_Kinetics_Lab_Manual.docx',
          fileSize: '1.5 MB',
          fileType: 'DOCX',
          isArchived: true,
          archivedAt: '2026-09-28',
          createdAt: '2026-08-12',
        },
      ],
      flashcards: [
        {
          id: 'fc-201',
          front: 'What type of bond is formed by the sharing of electron pairs between atoms?',
          back: 'Covalent bond',
          sourceType: 'manual',
        },
        {
          id: 'fc-202',
          front: 'What is the measure of the ability of an atom in a chemical compound to attract electrons?',
          back: 'Electronegativity',
          sourceType: 'manual',
        },
      ],
    },
  ];

  // State Management with localStorage persistence
  const [folders, setFolders] = useState(() => {
    try {
      const saved = localStorage.getItem('aura_study_folders');
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
      localStorage.setItem('aura_study_folders', JSON.stringify(folders));
    } catch (e) {
      console.warn('Failed to save folders to localStorage', e);
    }
  }, [folders]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'my-folders' | 'shared' | 'archived'
  const [sortBy, setSortBy] = useState('recent-studied'); // 'recent-studied' | 'recent-created' | 'progress' | 'alpha'

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
    return folders.filter((f) => !f.isArchived);
  }, [folders]);

  const archivedFolders = useMemo(() => {
    return folders.filter((f) => Boolean(f.isArchived));
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
    showToast(`Folder "${folder.title}" restored to My Folders.`);
  };

  // Restore All Archived Folders
  const handleRestoreAllFolders = () => {
    if (archivedFolders.length === 0) return;
    setFolders((prev) =>
      prev.map((f) =>
        f.isArchived
          ? {
              ...f,
              isArchived: false,
              status: (f.progress || 0) >= 100 ? 'Completed' : 'In Progress',
              archivedAt: null,
            }
          : f
      )
    );
    showToast('All archived folders restored to your active library.');
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
    showToast(`File "${file.fileName}" restored to active folder.`);
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

  // Filter & Search & Sort Pipeline for Active Folders
  const filteredActiveFolders = useMemo(() => {
    return activeFolders
      .filter((folder) => {
        // Search Filter
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          folder.title.toLowerCase().includes(query) ||
          folder.subtitle?.toLowerCase().includes(query) ||
          folder.department?.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        // Tab Filter
        if (activeFilter === 'my-folders') return !folder.isShared;
        if (activeFilter === 'shared') return !!folder.isShared;
        return true;
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
        // Default: recent-studied
        return String(b.id).localeCompare(String(a.id));
      });
  }, [activeFolders, searchQuery, activeFilter, sortBy]);

  // Navbar Component
  const renderNavbar = () => (
    <header className="aura-navbar">
      <div className="navbar-left">
        <img
          src={auraLogo}
          alt="AURA"
          className="navbar-brand-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => handleNavTabClick('HOME')}
        />
        <span className="navbar-separator">·</span>
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
      </div>

      <div className="navbar-right">
        <div className="coins-badge">
          <span>🪙</span>
          <span>2,450</span>
        </div>

        <button
          type="button"
          className="icon-btn-round"
          aria-label="Notifications"
        >
          🔔
        </button>

        <div className="user-profile-chip">
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
      </div>
    </header>
  );

  // VIEW 1: DEDICATED FLASHCARDS SECTION VIEW
  if (currentView === 'flashcards' && activeFolderForStudy) {
    return (
      <div className="my-folders-page-root">
        <div className="my-folders-ambient-bg" aria-hidden="true" />
        {showNavbar && renderNavbar()}
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
    <div className="my-folders-page-root">
      {/* Ambient Cyber Atmosphere */}
      <div className="my-folders-ambient-bg" aria-hidden="true" />

      {/* 1. TOP NAVBAR */}
      {showNavbar && renderNavbar()}

      {/* 2. MAIN CONTENT STAGE */}
      <main className="my-folders-content-container">
        {/* Page Header with Create Folder */}
        <FolderHeader
          onCreateFolder={() => setIsCreateModalOpen(true)}
          folderCount={activeFolders.length}
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
            {/* Search & Filter Toolbar */}
            <FolderToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={(filterId) => {
                if (filterId === 'archived') {
                  setIsArchiveView(true);
                  setActiveFilter('archived');
                } else {
                  setIsArchiveView(false);
                  setActiveFilter(filterId);
                }
              }}
              sortBy={sortBy}
              onSortChange={setSortBy}
              archivedCount={archivedFolders.length}
            />

            {/* Responsive Folder Grid */}
            <FolderGrid
              folders={filteredActiveFolders}
              onCreateFolder={() => setIsCreateModalOpen(true)}
              onOpenFolder={handleOpenFolder}
              onStudyFolder={handleStudyFolder}
              onFolderAction={handleFolderAction}
            />

            {/* Compact Recent Activity Panel */}
            <RecentActivity />
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
      </nav>
    </div>
  );
}
