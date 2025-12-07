// Firebase Storage Service
// This file provides functions to upload and manage files in Firebase Storage

import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { app } from './config';

// Initialize Storage
const storage = getStorage(app);

// ==================== Storage Functions ====================

/**
 * Upload a file to Firebase Storage
 * @param {File} file - File to upload
 * @param {string} path - Storage path (e.g., 'images/profile.jpg')
 * @returns {Promise<string>} - Download URL
 */
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload a file with progress tracking
 * @param {File} file - File to upload
 * @param {string} path - Storage path
 * @param {function} onProgress - Progress callback (receives progress percentage)
 * @returns {Promise<string>} - Download URL
 */
export const uploadFileWithProgress = (file, path, onProgress) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Error uploading file:', error);
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

/**
 * Delete a file from Firebase Storage
 * @param {string} path - Storage path of the file to delete
 * @returns {Promise<void>}
 */
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Get download URL for a file
 * @param {string} path - Storage path
 * @returns {Promise<string>} - Download URL
 */
export const getFileURL = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * List all files in a directory
 * @param {string} path - Directory path
 * @returns {Promise<Array>} - Array of file references
 */
export const listFiles = async (path) => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    
    const files = await Promise.all(
      result.items.map(async (itemRef) => ({
        name: itemRef.name,
        fullPath: itemRef.fullPath,
        url: await getDownloadURL(itemRef),
      }))
    );
    
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

// ==================== Helper Functions for Common Use Cases ====================

/**
 * Upload portfolio/work image
 * @param {File} file - Image file
 * @param {string} fileName - Custom file name (optional)
 * @returns {Promise<string>} - Download URL
 */
export const uploadPortfolioImage = async (file, fileName = null) => {
  const name = fileName || `${Date.now()}_${file.name}`;
  const path = `portfolio/${name}`;
  return await uploadFile(file, path);
};

/**
 * Upload team member photo
 * @param {File} file - Image file
 * @param {string} fileName - Custom file name (optional)
 * @returns {Promise<string>} - Download URL
 */
export const uploadTeamPhoto = async (file, fileName = null) => {
  const name = fileName || `${Date.now()}_${file.name}`;
  const path = `team/${name}`;
  return await uploadFile(file, path);
};

/**
 * Upload blog post image
 * @param {File} file - Image file
 * @param {string} fileName - Custom file name (optional)
 * @returns {Promise<string>} - Download URL
 */
export const uploadBlogImage = async (file, fileName = null) => {
  const name = fileName || `${Date.now()}_${file.name}`;
  const path = `blog/${name}`;
  return await uploadFile(file, path);
};

/**
 * Upload branding/design asset
 * @param {File} file - Asset file
 * @param {string} fileName - Custom file name (optional)
 * @returns {Promise<string>} - Download URL
 */
export const uploadDesignAsset = async (file, fileName = null) => {
  const name = fileName || `${Date.now()}_${file.name}`;
  const path = `designs/${name}`;
  return await uploadFile(file, path);
};

export { storage };
export default storage;

