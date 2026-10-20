/**
 * Folder Thumbnails Mapping and Resolution Helper
 * Provides high-res cyberpunk thumbnail images for AURA study folders.
 */

export const FOLDER_THUMBNAILS = {
  database: '/folders/thumb_database.jpg',
  programming: '/folders/thumb_programming.jpg',
  calculus: '/folders/thumb_calculus.jpg',
  biology: '/folders/thumb_biology.jpg',
  business: '/folders/thumb_business.jpg',
  physics: '/folders/thumb_physics.jpg',
};

export function getFolderThumbnail(folder) {
  if (!folder) return FOLDER_THUMBNAILS.database;
  if (folder.thumbnail) return folder.thumbnail;

  const title = (folder.title || '').toLowerCase();
  const subtitle = (folder.subtitle || '').toLowerCase();
  const text = `${title} ${subtitle}`;

  if (text.includes('data') || text.includes('sql') || text.includes('db')) return FOLDER_THUMBNAILS.database;
  if (text.includes('prog') || text.includes('code') || text.includes('script') || text.includes('javascript') || text.includes('dev')) {
    return FOLDER_THUMBNAILS.programming;
  }
  if (text.includes('calc') || text.includes('math') || text.includes('algebra') || text.includes('deriv') || text.includes('limit')) {
    return FOLDER_THUMBNAILS.calculus;
  }
  if (text.includes('bio') || text.includes('cell') || text.includes('gene') || text.includes('chem')) {
    return FOLDER_THUMBNAILS.biology;
  }
  if (text.includes('busi') || text.includes('strat') || text.includes('econ') || text.includes('entre')) {
    return FOLDER_THUMBNAILS.business;
  }
  if (text.includes('phys') || text.includes('motion') || text.includes('force') || text.includes('mechanic')) {
    return FOLDER_THUMBNAILS.physics;
  }

  const color = (folder.color || '').toLowerCase();
  if (color === 'red') return FOLDER_THUMBNAILS.database;
  if (color === 'purple') return FOLDER_THUMBNAILS.programming;
  if (color === 'blue' || color === 'cyan') return FOLDER_THUMBNAILS.calculus;
  if (color === 'green') return FOLDER_THUMBNAILS.biology;
  if (color === 'orange') return FOLDER_THUMBNAILS.business;
  return FOLDER_THUMBNAILS.physics;
}
