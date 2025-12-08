# Firebase Firestore Setup - MSS Project

## ✅ Setup Complete!

Your Firebase Firestore is now fully configured and ready to use in your MSS Frontend project.

## 📁 Files Created

```
src/firebase/
├── config.js                    # Firebase initialization & configuration
├── index.js                     # Convenient exports
├── firestoreService.js          # Helper functions for CRUD operations (Database)
├── storageService.js            # Helper functions for file uploads (from app)
├── displayService.js            # ⭐ Helper functions to display manually uploaded files
├── CONTACT_FORM_EXAMPLE.js      # Practical contact form example
├── USAGE_EXAMPLES.md            # Detailed Firestore usage examples
├── STORAGE_EXAMPLES.md          # Detailed Storage upload examples
├── MANUAL_UPLOAD_GUIDE.md       # ⭐ Guide for uploading via Firebase Console
└── README.md                    # This file
```

**⭐ For manual uploads (your use case), check `MANUAL_UPLOAD_GUIDE.md`**

## 🚀 Quick Start

### 1. Import in Your Components

```javascript
// Import Firestore helper functions (for data)
import { addDocument, getAllDocuments } from '../firebase/firestoreService';

// Import Storage helper functions (for images/videos)
import { uploadImage, uploadVideo } from '../firebase/storageService';

// Or import Firebase directly
import { db, storage } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
```

### 2. Save Data to Firestore

```javascript
// Example: Save contact form submission
const handleSubmit = async (formData) => {
  try {
    await addDocument('contact_submissions', {
      name: formData.name,
      email: formData.email,
      message: formData.message
    });
    alert('Submitted successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### 3. Read Data from Firestore

```javascript
// Get all documents
const contacts = await getAllDocuments('contact_submissions');

// Get with conditions
const activeProjects = await queryDocuments('projects', [
  { field: 'status', operator: '==', value: 'active' }
]);
```

## 📋 Next Steps in Firebase Console

### Step 1: Choose Your Plan

**For Manual Uploads (Your Use Case):**
- Stay on **Spark Plan (FREE)** ✅
- No credit card needed
- 5GB storage + 1GB/day downloads
- Perfect for manually uploading files via Console

**For App-Based Uploads:**
- Upgrade to **Blaze Plan (Pay as you go)**
- Only needed if users upload files from your app
- You get FREE tier included (5GB + 1GB/day)

### Step 2: Enable Firestore Database

1. Click **"Firestore Database"** in the left menu
2. Click **"Create database"**
3. Choose **Test mode** (for development) or **Production mode**
4. Select a location (choose closest to your users, e.g., europe-west)
5. Click **"Enable"**

### Step 3: Enable Firebase Storage

1. Click **"Storage"** in the left menu
2. Click **"Get started"**
3. Choose **Test mode** (for development)
4. Use the same location as Firestore
5. Click **"Done"**

### Step 4: Set Up Security Rules

**Firestore Rules** (Important!):
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Public read access
       match /{document=**} {
         allow read: if true;
       }
       
       // Allow contact form submissions
       match /contact_submissions/{docId} {
         allow create: if true;
         allow update, delete: if false;
       }
       
       // Protect other collections (admin only)
       match /{collection}/{docId} {
         allow write: if false;
       }
     }
   }
   ```

**Storage Rules** (Important!):
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Allow anyone to read files
       match /{allPaths=**} {
         allow read: if true;
       }
       
       // Allow image uploads (max 5MB)
       match /images/{allPaths=**} {
         allow write: if request.resource.size < 5 * 1024 * 1024
                      && request.resource.contentType.matches('image/.*');
       }
       
       // Allow video uploads (max 100MB)
       match /videos/{allPaths=**} {
         allow write: if request.resource.size < 100 * 1024 * 1024
                      && request.resource.contentType.matches('video/.*');
       }
     }
   }
   ```

## 💡 Common Use Cases for MSS

### 1. Upload Portfolio Images
Upload images to Storage and save metadata to Firestore:
```javascript
import { uploadImage } from '../firebase/storageService';
import { addDocument } from '../firebase/firestoreService';

const handleImageUpload = async (file) => {
  // Upload to Storage
  const imageUrl = await uploadImage(file, 'portfolio');
  
  // Save URL to Firestore
  await addDocument('portfolio_images', {
    imageUrl: imageUrl,
    title: 'Project Name',
    category: 'branding'
  });
};
```

### 2. Upload Portfolio Videos
```javascript
import { uploadVideo } from '../firebase/storageService';

const handleVideoUpload = async (file) => {
  const videoUrl = await uploadVideo(file, 'projects', (progress) => {
    console.log(`Upload: ${progress}%`);
  });
  
  await addDocument('portfolio_videos', {
    videoUrl: videoUrl,
    title: 'Video Project'
  });
};
```

### 3. Contact Form Submissions
Store all contact form submissions in Firestore:
```javascript
await addDocument('contact_submissions', {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+962 7 XXXX XXXX',
  message: 'Interested in your services',
  status: 'new'
});
```

### 4. Client Testimonials
Store and display testimonials:
```javascript
await addDocument('testimonials', {
  clientName: 'Jane Smith',
  company: 'ABC Corp',
  rating: 5,
  testimonial: 'Excellent service!',
  approved: true
});
```

### 5. Service Inquiries
Track which services are most popular:
```javascript
await addDocument('service_inquiries', {
  service: 'web-development',
  clientEmail: 'client@example.com',
  budget: '5000-10000',
  timeline: '2-3 months'
});
```

### 6. Analytics & Tracking
Log custom events:
```javascript
await addDocument('analytics', {
  eventType: 'page_view',
  page: '/services',
  timestamp: new Date(),
  userAgent: navigator.userAgent
});
```

## 📚 Available Helper Functions

### Firestore (Database) Functions

#### Create
- `addDocument(collection, data)` - Add document with auto-generated ID
- `setDocument(collection, docId, data)` - Set document with specific ID

#### Read
- `getDocument(collection, docId)` - Get single document
- `getAllDocuments(collection)` - Get all documents
- `queryDocuments(collection, conditions)` - Query with conditions
- `getOrderedDocuments(collection, field, direction, limit)` - Get ordered documents

#### Update
- `updateDocument(collection, docId, updates)` - Update specific fields

#### Delete
- `deleteDocument(collection, docId)` - Delete document

#### Real-time Listeners
- `listenToDocument(collection, docId, callback)` - Listen to single document
- `listenToCollection(collection, callback)` - Listen to entire collection
- `listenToQuery(collection, conditions, callback)` - Listen to query results

### Storage (Files) Functions

#### Upload
- `uploadImage(file, category, onProgress)` - Upload image with validation
- `uploadVideo(file, category, onProgress)` - Upload video with validation
- `uploadFile(file, folder, onProgress)` - Upload any file
- `uploadMultipleFiles(files, folder, onProgress)` - Upload multiple files

#### Delete
- `deleteFile(fileUrl)` - Delete a single file
- `deleteMultipleFiles(fileUrls)` - Delete multiple files

#### Read
- `getFileURL(filePath)` - Get download URL for a file
- `listFiles(folderPath)` - List all files in a folder

#### Helpers
- `validateFile(file, options)` - Validate file before upload
- `formatFileSize(bytes)` - Format file size for display

## 🔒 Security Best Practices

1. **Never expose sensitive data** in client-side code
2. **Use Firebase Security Rules** to protect your data
3. **Validate data** before saving to Firestore
4. **Use server-side functions** (Cloud Functions) for sensitive operations
5. **Monitor usage** in Firebase Console to detect anomalies

## 🎯 Integration Examples

### Add to Your Contact Component

```javascript
// In ContactUs.js
import { addDocument } from '../../firebase/firestoreService';

// Add this function
const saveContactSubmission = async (data) => {
  try {
    await addDocument('contact_submissions', data);
    console.log('Contact saved to Firestore');
  } catch (error) {
    console.error('Error saving contact:', error);
  }
};
```

### Display Real-time Projects

```javascript
// In Work.js or HomePage.js
import { listenToCollection } from '../../firebase/firestoreService';

useEffect(() => {
  const unsubscribe = listenToCollection('projects', (projects) => {
    setProjects(projects);
  });
  return () => unsubscribe();
}, []);
```

## 📖 Documentation

- **Firestore Docs**: https://firebase.google.com/docs/firestore
- **Storage Docs**: https://firebase.google.com/docs/storage
- **React + Firebase**: https://firebase.google.com/docs/firestore/quickstart
- **Security Rules**: https://firebase.google.com/docs/firestore/security/get-started
- **Pricing**: https://firebase.google.com/pricing

## 🆘 Troubleshooting

### Error: "Missing or insufficient permissions"
- Check your Firestore Security Rules in Firebase Console
- Make sure you've enabled Firestore Database

### Error: "Firebase not initialized"
- Make sure `import './firebase/config'` is in your App.js
- Check that Firebase config is correct

### Data not showing up
- Check Firebase Console → Firestore Database to see if data is being saved
- Verify collection names match exactly (case-sensitive)

## 🎉 You're All Set!

Your Firebase is fully configured with Firestore (database) and Storage (files). Check out:
- `USAGE_EXAMPLES.md` for detailed Firestore examples
- `STORAGE_EXAMPLES.md` for detailed Storage examples
- `CONTACT_FORM_EXAMPLE.js` for a complete contact form
- `firestoreService.js` for all database functions
- `storageService.js` for all file upload functions

Happy coding! 🚀

