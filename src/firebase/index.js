// Firebase Services - Main Export File
// Import all Firebase services from this single file

// Core Firebase
export { app, analytics } from './config';

// Authentication
export {
  auth,
  signUp,
  signIn,
  signInWithGoogle,
  logOut,
  resetPassword,
  getCurrentUser,
  onAuthChange,
  updateUserProfile,
} from './auth';

// Firestore Database
export {
  db,
  createDocument,
  getDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument,
  queryDocuments,
  submitContactForm,
  getContactSubmissions,
  createWorkItem,
  getWorkItems,
  createBlogPost,
  getBlogPosts,
  createTeamMember,
  getTeamMembers,
  createTestimonial,
  getTestimonials,
} from './firestore';

// Storage
export {
  storage,
  uploadFile,
  uploadFileWithProgress,
  deleteFile,
  getFileURL,
  listFiles,
  uploadPortfolioImage,
  uploadTeamPhoto,
  uploadBlogImage,
  uploadDesignAsset,
} from './storage';

