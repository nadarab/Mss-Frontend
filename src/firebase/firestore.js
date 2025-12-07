// Firestore Database Service
// This file provides functions to interact with Firestore database

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { app } from './config';

// Initialize Firestore
const db = getFirestore(app);

// ==================== CRUD Operations ====================

/**
 * Create a new document in a collection
 * @param {string} collectionName - Name of the collection
 * @param {object} data - Data to store
 * @returns {Promise<string>} - Document ID
 */
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

/**
 * Get a single document by ID
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - Document ID
 * @returns {Promise<object>} - Document data
 */
export const getDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
};

/**
 * Get all documents from a collection
 * @param {string} collectionName - Name of the collection
 * @returns {Promise<Array>} - Array of documents
 */
export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

/**
 * Update a document
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - Document ID
 * @param {object} data - Data to update
 * @returns {Promise<void>}
 */
export const updateDocument = async (collectionName, documentId, data) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

/**
 * Delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} documentId - Document ID
 * @returns {Promise<void>}
 */
export const deleteDocument = async (collectionName, documentId) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// ==================== Query Operations ====================

/**
 * Query documents with filters
 * @param {string} collectionName - Name of the collection
 * @param {Array} filters - Array of filter conditions [field, operator, value]
 * @param {string} orderByField - Field to order by (optional)
 * @param {number} limitCount - Limit number of results (optional)
 * @returns {Promise<Array>} - Array of documents
 */
export const queryDocuments = async (
  collectionName,
  filters = [],
  orderByField = null,
  limitCount = null
) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply filters
    const constraints = [];
    filters.forEach(([field, operator, value]) => {
      constraints.push(where(field, operator, value));
    });
    
    // Apply ordering
    if (orderByField) {
      constraints.push(orderBy(orderByField));
    }
    
    // Apply limit
    if (limitCount) {
      constraints.push(limit(limitCount));
    }
    
    q = query(q, ...constraints);
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};

// ==================== Example Usage Collections ====================

/**
 * Contact form submissions
 */
export const submitContactForm = async (formData) => {
  return await createDocument('contacts', formData);
};

export const getContactSubmissions = async () => {
  return await getAllDocuments('contacts');
};

/**
 * Portfolio/Work items
 */
export const createWorkItem = async (workData) => {
  return await createDocument('portfolio', workData);
};

export const getWorkItems = async () => {
  return await queryDocuments('portfolio', [], 'createdAt', null);
};

/**
 * Blog posts or news
 */
export const createBlogPost = async (postData) => {
  return await createDocument('blog', postData);
};

export const getBlogPosts = async (limitCount = 10) => {
  return await queryDocuments('blog', [], 'createdAt', limitCount);
};

/**
 * Team members
 */
export const createTeamMember = async (memberData) => {
  return await createDocument('team', memberData);
};

export const getTeamMembers = async () => {
  return await getAllDocuments('team');
};

/**
 * Client testimonials
 */
export const createTestimonial = async (testimonialData) => {
  return await createDocument('testimonials', testimonialData);
};

export const getTestimonials = async () => {
  return await getAllDocuments('testimonials');
};

export { db };
export default db;

