import { storage } from './config';
import { ref, getDownloadURL, listAll } from 'firebase/storage';

/**
 * Firebase Display Service - For displaying manually uploaded files
 * Use this when you upload files through Firebase Console
 */

// ============================================
// GET File URLs
// ============================================

/**
 * Get download URL for a specific file
 * @param {string} filePath - Path to file in Storage (e.g., 'images/portfolio/image1.jpg')
 * @returns {Promise<string>} - Download URL
 * 
 * Example:
 * const url = await getFileURL('images/portfolio/project1.jpg');
 * <img src={url} alt="Project" />
 */
export const getFileURL = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * Get all files from a folder
 * @param {string} folderPath - Path to folder (e.g., 'images/portfolio')
 * @returns {Promise<Array>} - Array of file objects with name and URL
 * 
 * Example:
 * const images = await getAllFilesFromFolder('images/portfolio');
 * images.map(img => <img src={img.url} alt={img.name} />)
 */
export const getAllFilesFromFolder = async (folderPath) => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    
    // Get URLs for all files
    const files = await Promise.all(
      result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url: url,
        };
      })
    );
    
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

/**
 * Get all images from a folder
 * @param {string} folderPath - Path to folder
 * @returns {Promise<Array>} - Array of image objects
 */
export const getAllImages = async (folderPath) => {
  const files = await getAllFilesFromFolder(folderPath);
  // Filter only image files
  return files.filter(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  });
};

/**
 * Get all videos from a folder
 * @param {string} folderPath - Path to folder
 * @returns {Promise<Array>} - Array of video objects
 */
export const getAllVideos = async (folderPath) => {
  const files = await getAllFilesFromFolder(folderPath);
  // Filter only video files
  return files.filter(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    return ['mp4', 'mov', 'avi', 'webm'].includes(ext);
  });
};

/**
 * Get multiple specific files by their paths
 * @param {Array<string>} filePaths - Array of file paths
 * @returns {Promise<Array>} - Array of URLs
 * 
 * Example:
 * const urls = await getMultipleFileURLs([
 *   'images/logo.png',
 *   'images/banner.jpg',
 *   'videos/intro.mp4'
 * ]);
 */
export const getMultipleFileURLs = async (filePaths) => {
  try {
    const urlPromises = filePaths.map(path => getFileURL(path));
    return await Promise.all(urlPromises);
  } catch (error) {
    console.error('Error getting multiple file URLs:', error);
    throw error;
  }
};

/**
 * Get all subfolders in a folder
 * @param {string} folderPath - Path to folder
 * @returns {Promise<Array>} - Array of subfolder names
 */
export const getSubfolders = async (folderPath) => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    
    return result.prefixes.map(prefix => ({
      name: prefix.name,
      fullPath: prefix.fullPath,
    }));
  } catch (error) {
    console.error('Error getting subfolders:', error);
    throw error;
  }
};

// ============================================
// HELPER Functions
// ============================================

/**
 * Check if a file exists
 * @param {string} filePath - Path to file
 * @returns {Promise<boolean>} - True if exists
 */
export const fileExists = async (filePath) => {
  try {
    await getFileURL(filePath);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
};

/**
 * Check if file is an image
 * @param {string} filename - The filename
 * @returns {boolean} - True if image
 */
export const isImage = (filename) => {
  const ext = getFileExtension(filename);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
};

/**
 * Check if file is a video
 * @param {string} filename - The filename
 * @returns {boolean} - True if video
 */
export const isVideo = (filename) => {
  const ext = getFileExtension(filename);
  return ['mp4', 'mov', 'avi', 'webm', 'mkv'].includes(ext);
};

