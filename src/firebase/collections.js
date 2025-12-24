/**
 * Firestore Collections Structure for MSS Project
 * 
 * This file defines the database structure and provides
 * helper functions to interact with each collection
 */

import { 
  addDocument, 
  getAllDocuments, 
  getDocument,
  updateDocument,
  deleteDocument,
  queryDocuments 
} from './firestoreService';

// ============================================
// COLLECTION NAMES
// ============================================

export const COLLECTIONS = {
  EMPLOYEES: 'employees',
  VIDEO_CATEGORIES: 'video_categories',
  VIDEOS: 'videos',
  BRANDING_PROJECTS: 'branding_projects',
  DESIGN_PROJECTS: 'design_projects',
  WORK_CARD_THUMBNAILS: 'work_card_thumbnails',
};

// ============================================
// EMPLOYEES Collection
// ============================================

/**
 * Employee Structure:
 * {
 *   id: auto-generated
 *   firstName: string
 *   lastName: string
 *   role: string (e.g., "CEO", "Designer", "Developer")
 *   imageUrl: string (Firebase Storage URL)
 *   bio: string (optional)
 *   order: number (for display order)
 * }
 */

export const employeeService = {
  // Add new employee
  add: async (employeeData) => {
    return await addDocument(COLLECTIONS.EMPLOYEES, employeeData);
  },

  // Get all employees
  getAll: async () => {
    return await getAllDocuments(COLLECTIONS.EMPLOYEES);
  },

  // Get employee by ID
  getById: async (id) => {
    return await getDocument(COLLECTIONS.EMPLOYEES, id);
  },

  // Update employee
  update: async (id, updates) => {
    return await updateDocument(COLLECTIONS.EMPLOYEES, id, updates);
  },

  // Delete employee
  delete: async (id) => {
    return await deleteDocument(COLLECTIONS.EMPLOYEES, id);
  },
};

// ============================================
// VIDEO CATEGORIES Collection
// ============================================

/**
 * Video Category Structure:
 * {
 *   id: auto-generated
 *   title: string (e.g., "Social Media Ads")
 *   subtitle: string (e.g., "Engaging content for your audience")
 *   type: string (e.g., "commercial", "promotional", "educational")
 *   thumbnailUrl: string (optional - category thumbnail)
 *   order: number (for display order)
 * }
 */

export const videoCategoryService = {
  add: async (categoryData) => {
    return await addDocument(COLLECTIONS.VIDEO_CATEGORIES, categoryData);
  },

  getAll: async () => {
    return await getAllDocuments(COLLECTIONS.VIDEO_CATEGORIES);
  },

  getById: async (id) => {
    return await getDocument(COLLECTIONS.VIDEO_CATEGORIES, id);
  },

  update: async (id, updates) => {
    return await updateDocument(COLLECTIONS.VIDEO_CATEGORIES, id, updates);
  },

  delete: async (id) => {
    return await deleteDocument(COLLECTIONS.VIDEO_CATEGORIES, id);
  },
};

// ============================================
// VIDEOS Collection
// ============================================

/**
 * Video Structure:
 * {
 *   id: auto-generated
 *   categoryId: string (reference to video_categories)
 *   title: string (optional - video title)
 *   videoUrl: string (Firebase Storage URL)
 *   thumbnailUrl: string (optional - video thumbnail)
 *   duration: string (optional - e.g., "2:30")
 *   order: number (for display order within category)
 * }
 */

export const videoService = {
  // Add new video
  add: async (videoData) => {
    return await addDocument(COLLECTIONS.VIDEOS, videoData);
  },

  // Get all videos
  getAll: async () => {
    return await getAllDocuments(COLLECTIONS.VIDEOS);
  },

  // Get videos by category
  getByCategory: async (categoryId) => {
    return await queryDocuments(COLLECTIONS.VIDEOS, [
      { field: 'categoryId', operator: '==', value: categoryId }
    ]);
  },

  // Get video by ID
  getById: async (id) => {
    return await getDocument(COLLECTIONS.VIDEOS, id);
  },

  // Update video
  update: async (id, updates) => {
    return await updateDocument(COLLECTIONS.VIDEOS, id, updates);
  },

  // Delete video
  delete: async (id) => {
    return await deleteDocument(COLLECTIONS.VIDEOS, id);
  },
};

// ============================================
// BRANDING PROJECTS Collection
// ============================================

/**
 * Branding Project Structure:
 * {
 *   id: auto-generated
 *   title: string (e.g., "Brand Identity for XYZ Company")
 *   description: string (project details)
 *   images: array of strings (Firebase Storage URLs)
 *   clientName: string (optional)
 *   year: number (optional)
 *   featured: boolean (to highlight on homepage)
 *   order: number (for display order)
 * }
 */

export const brandingProjectService = {
  // Add new branding project
  add: async (projectData) => {
    return await addDocument(COLLECTIONS.BRANDING_PROJECTS, projectData);
  },

  // Get all branding projects
  getAll: async () => {
    return await getAllDocuments(COLLECTIONS.BRANDING_PROJECTS);
  },

  // Get featured projects only
  getFeatured: async () => {
    return await queryDocuments(COLLECTIONS.BRANDING_PROJECTS, [
      { field: 'featured', operator: '==', value: true }
    ]);
  },

  // Get project by ID
  getById: async (id) => {
    return await getDocument(COLLECTIONS.BRANDING_PROJECTS, id);
  },

  // Update project
  update: async (id, updates) => {
    return await updateDocument(COLLECTIONS.BRANDING_PROJECTS, id, updates);
  },

  // Delete project
  delete: async (id) => {
    return await deleteDocument(COLLECTIONS.BRANDING_PROJECTS, id);
  },
};

// ============================================
// DESIGN PROJECTS Collection
// ============================================

/**
 * Design Project Structure:
 * {
 *   id: auto-generated
 *   title: string (e.g., "Social Media Post Design")
 *   description: string (project details)
 *   images: array of strings (Firebase Storage URLs)
 *   category: string (e.g., "social-media", "print", "digital")
 *   clientName: string (optional)
 *   year: number (optional)
 *   featured: boolean
 *   order: number
 * }
 */

export const designProjectService = {
  add: async (projectData) => {
    return await addDocument(COLLECTIONS.DESIGN_PROJECTS, projectData);
  },

  getAll: async () => {
    return await getAllDocuments(COLLECTIONS.DESIGN_PROJECTS);
  },

  getFeatured: async () => {
    return await queryDocuments(COLLECTIONS.DESIGN_PROJECTS, [
      { field: 'featured', operator: '==', value: true }
    ]);
  },

  getByCategory: async (category) => {
    return await queryDocuments(COLLECTIONS.DESIGN_PROJECTS, [
      { field: 'category', operator: '==', value: category }
    ]);
  },

  getById: async (id) => {
    return await getDocument(COLLECTIONS.DESIGN_PROJECTS, id);
  },

  update: async (id, updates) => {
    return await updateDocument(COLLECTIONS.DESIGN_PROJECTS, id, updates);
  },

  delete: async (id) => {
    return await deleteDocument(COLLECTIONS.DESIGN_PROJECTS, id);
  },
};

// ============================================
// WORK CARD THUMBNAILS Collection
// ============================================

/**
 * Work Card Thumbnail Structure:
 * {
 *   id: auto-generated
 *   cardType: string ('video', 'design', or 'branding')
 *   thumbnailUrl: string (Firebase Storage URL for the thumbnail image)
 *   name: string (e.g., "Video Production", "Design", "Branding & Identity")
 *   description: string (card description)
 *   active: boolean (whether this thumbnail should be used)
 * }
 */

export const workCardThumbnailService = {
  // Add new thumbnail
  add: async (thumbnailData) => {
    return await addDocument(COLLECTIONS.WORK_CARD_THUMBNAILS, thumbnailData);
  },

  // Get all thumbnails
  getAll: async () => {
    return await getAllDocuments(COLLECTIONS.WORK_CARD_THUMBNAILS);
  },

  // Get thumbnail by card type
  getByCardType: async (cardType) => {
    const thumbnails = await queryDocuments(COLLECTIONS.WORK_CARD_THUMBNAILS, [
      { field: 'cardType', operator: '==', value: cardType },
      { field: 'active', operator: '==', value: true }
    ]);
    return thumbnails.length > 0 ? thumbnails[0] : null;
  },

  // Get thumbnail by ID
  getById: async (id) => {
    return await getDocument(COLLECTIONS.WORK_CARD_THUMBNAILS, id);
  },

  // Update thumbnail
  update: async (id, updates) => {
    return await updateDocument(COLLECTIONS.WORK_CARD_THUMBNAILS, id, updates);
  },

  // Delete thumbnail
  delete: async (id) => {
    return await deleteDocument(COLLECTIONS.WORK_CARD_THUMBNAILS, id);
  },
};

