import { db } from './config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * Firestore Service - Helper functions for database operations
 */

// ============================================
// CREATE Operations
// ============================================

/**
 * Add a new document with auto-generated ID
 * @param {string} collectionName - Name of the collection
 * @param {object} data - Data to add
 * @returns {Promise<string>} - Document ID
 */
export const addDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    console.log('Document added with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document:', error);
    throw error;
  }
};

/**
 * Set a document with a specific ID (creates or overwrites)
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {object} data - Data to set
 */
export const setDocument = async (collectionName, docId, data) => {
  try {
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('Document set successfully');
  } catch (error) {
    console.error('Error setting document:', error);
    throw error;
  }
};

// ============================================
// READ Operations
// ============================================

/**
 * Get a single document by ID
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Promise<object|null>} - Document data or null
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log('No such document!');
      return null;
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
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error('Error getting documents:', error);
    throw error;
  }
};

/**
 * Query documents with conditions
 * @param {string} collectionName - Name of the collection
 * @param {Array} conditions - Array of query conditions
 * @returns {Promise<Array>} - Array of documents
 * 
 * Example:
 * queryDocuments('users', [
 *   { field: 'age', operator: '>=', value: 18 },
 *   { field: 'city', operator: '==', value: 'New York' }
 * ])
 */
export const queryDocuments = async (collectionName, conditions = []) => {
  try {
    let q = collection(db, collectionName);
    
    // Apply conditions
    const constraints = conditions.map(({ field, operator, value }) => 
      where(field, operator, value)
    );
    
    if (constraints.length > 0) {
      q = query(q, ...constraints);
    }
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
};

/**
 * Get documents with ordering and limit
 * @param {string} collectionName - Name of the collection
 * @param {string} orderByField - Field to order by
 * @param {string} direction - 'asc' or 'desc'
 * @param {number} limitCount - Number of documents to return
 * @returns {Promise<Array>} - Array of documents
 */
export const getOrderedDocuments = async (
  collectionName,
  orderByField,
  direction = 'asc',
  limitCount = 10
) => {
  try {
    const q = query(
      collection(db, collectionName),
      orderBy(orderByField, direction),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    console.error('Error getting ordered documents:', error);
    throw error;
  }
};

// ============================================
// UPDATE Operations
// ============================================

/**
 * Update specific fields in a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {object} updates - Fields to update
 */
export const updateDocument = async (collectionName, docId, updates) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    console.log('Document updated successfully');
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// ============================================
// DELETE Operations
// ============================================

/**
 * Delete a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log('Document deleted successfully');
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// ============================================
// REAL-TIME Listeners
// ============================================

/**
 * Listen to real-time updates on a document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @param {function} callback - Callback function to handle updates
 * @returns {function} - Unsubscribe function
 */
export const listenToDocument = (collectionName, docId, callback) => {
  const docRef = doc(db, collectionName, docId);
  
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error listening to document:', error);
  });
  
  return unsubscribe;
};

/**
 * Listen to real-time updates on a collection
 * @param {string} collectionName - Name of the collection
 * @param {function} callback - Callback function to handle updates
 * @returns {function} - Unsubscribe function
 */
export const listenToCollection = (collectionName, callback) => {
  const q = collection(db, collectionName);
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    callback(documents);
  }, (error) => {
    console.error('Error listening to collection:', error);
  });
  
  return unsubscribe;
};

/**
 * Listen to real-time updates with query conditions
 * @param {string} collectionName - Name of the collection
 * @param {Array} conditions - Array of query conditions
 * @param {function} callback - Callback function to handle updates
 * @returns {function} - Unsubscribe function
 */
export const listenToQuery = (collectionName, conditions, callback) => {
  const constraints = conditions.map(({ field, operator, value }) => 
    where(field, operator, value)
  );
  
  const q = query(collection(db, collectionName), ...constraints);
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    callback(documents);
  }, (error) => {
    console.error('Error listening to query:', error);
  });
  
  return unsubscribe;
};

