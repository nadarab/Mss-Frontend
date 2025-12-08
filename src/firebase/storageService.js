import { storage } from './config';
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';

/**
 * Firebase Storage Service - Helper functions for uploading images and videos
 */

// ============================================
// UPLOAD Operations
// ============================================

/**
 * Upload a file (image or video) to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - Folder path (e.g., 'images/portfolio', 'videos/projects')
 * @param {function} onProgress - Optional callback for upload progress (0-100)
 * @returns {Promise<string>} - Download URL of uploaded file
 * 
 * Example:
 * const url = await uploadFile(file, 'images/portfolio', (progress) => {
 *   console.log(`Upload is ${progress}% done`);
 * });
 */
export const uploadFile = async (file, folder = 'uploads', onProgress = null) => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `${folder}/${fileName}`;
    
    // Create a storage reference
    const storageRef = ref(storage, filePath);
    
    // If progress callback is provided, use resumable upload
    if (onProgress) {
      return new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);
        
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Calculate progress percentage
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            // Upload completed successfully
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      // Simple upload without progress tracking
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload an image file
 * @param {File} imageFile - The image file to upload
 * @param {string} category - Category folder (e.g., 'portfolio', 'branding', 'design')
 * @param {function} onProgress - Optional progress callback
 * @returns {Promise<string>} - Download URL
 */
export const uploadImage = async (imageFile, category = 'general', onProgress = null) => {
  // Validate file type
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validImageTypes.includes(imageFile.type)) {
    throw new Error('Invalid image type. Please upload JPG, PNG, GIF, or WebP');
  }
  
  // Validate file size (max 5MB for images)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (imageFile.size > maxSize) {
    throw new Error('Image size must be less than 5MB');
  }
  
  return uploadFile(imageFile, `images/${category}`, onProgress);
};

/**
 * Upload a video file
 * @param {File} videoFile - The video file to upload
 * @param {string} category - Category folder (e.g., 'portfolio', 'projects')
 * @param {function} onProgress - Optional progress callback
 * @returns {Promise<string>} - Download URL
 */
export const uploadVideo = async (videoFile, category = 'general', onProgress = null) => {
  // Validate file type
  const validVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
  if (!validVideoTypes.includes(videoFile.type)) {
    throw new Error('Invalid video type. Please upload MP4, MOV, or AVI');
  }
  
  // Validate file size (max 100MB for videos)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (videoFile.size > maxSize) {
    throw new Error('Video size must be less than 100MB');
  }
  
  return uploadFile(videoFile, `videos/${category}`, onProgress);
};

/**
 * Upload multiple files at once
 * @param {FileList|Array} files - Array of files to upload
 * @param {string} folder - Folder path
 * @param {function} onProgress - Optional callback for overall progress
 * @returns {Promise<Array>} - Array of download URLs
 */
export const uploadMultipleFiles = async (files, folder = 'uploads', onProgress = null) => {
  try {
    const fileArray = Array.from(files);
    const totalFiles = fileArray.length;
    let completedFiles = 0;
    
    const uploadPromises = fileArray.map(async (file) => {
      const url = await uploadFile(file, folder, (fileProgress) => {
        if (onProgress) {
          // Calculate overall progress
          const overallProgress = ((completedFiles + (fileProgress / 100)) / totalFiles) * 100;
          onProgress(Math.round(overallProgress));
        }
      });
      completedFiles++;
      return url;
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

// ============================================
// DELETE Operations
// ============================================

/**
 * Delete a file from Firebase Storage
 * @param {string} fileUrl - The download URL or file path
 * @returns {Promise<void>}
 */
export const deleteFile = async (fileUrl) => {
  try {
    // Extract the file path from the URL
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Delete multiple files at once
 * @param {Array<string>} fileUrls - Array of file URLs or paths
 * @returns {Promise<void>}
 */
export const deleteMultipleFiles = async (fileUrls) => {
  try {
    const deletePromises = fileUrls.map((url) => deleteFile(url));
    await Promise.all(deletePromises);
    console.log('All files deleted successfully');
  } catch (error) {
    console.error('Error deleting files:', error);
    throw error;
  }
};

// ============================================
// READ Operations
// ============================================

/**
 * Get download URL for a file
 * @param {string} filePath - Path to the file in storage
 * @returns {Promise<string>} - Download URL
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
 * List all files in a folder
 * @param {string} folderPath - Path to the folder
 * @returns {Promise<Array>} - Array of file metadata
 */
export const listFiles = async (folderPath) => {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    
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

// ============================================
// HELPER Functions
// ============================================

/**
 * Get file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - File extension
 */
export const getFileExtension = (filename) => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size (e.g., "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'],
  } = options;
  
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than ${formatFileSize(maxSize)}`,
    };
  }
  
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }
  
  return { valid: true, error: null };
};

