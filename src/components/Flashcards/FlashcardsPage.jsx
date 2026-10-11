import React from 'react';
import FlashcardFolder from '../FlashcardFolder/FlashcardFolder';

/**
 * FlashcardsPage - Entry point for the Flashcard Folder Experience
 * Renders the dedicated FlashcardFolder interface (Overview, Review Mode, Study Mode)
 */
export default function FlashcardsPage({
  folder,
  onBackToFolders,
  onUpdateFolder,
}) {
  return (
    <FlashcardFolder
      folder={folder}
      onBackToFolders={onBackToFolders}
      onUpdateFolder={onUpdateFolder}
    />
  );
}
