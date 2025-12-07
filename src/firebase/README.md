# Firebase Backend Integration

This directory contains all Firebase backend services for the MSS Frontend website.

## 📋 Table of Contents

- [Setup Instructions](#setup-instructions)
- [Available Services](#available-services)
- [Usage Examples](#usage-examples)
- [Firebase Console Setup](#firebase-console-setup)
- [Security Rules](#security-rules)

---

## 🚀 Setup Instructions

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

### 2. Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "MSS Website")
5. Copy the configuration values

### 3. Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace the placeholder values with your actual Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Enable Firebase Services

In Firebase Console, enable the services you need:

#### **Authentication**
- Go to **Authentication** > **Sign-in method**
- Enable **Email/Password**
- Enable **Google** (optional)

#### **Firestore Database**
- Go to **Firestore Database**
- Click **Create database**
- Start in **Test mode** (for development)
- Choose a location close to your users

#### **Storage**
- Go to **Storage**
- Click **Get started**
- Start in **Test mode** (for development)

### 5. Restart Your Development Server

```bash
npm start
```

---

## 🛠 Available Services

### 1. **Authentication** (`auth.js`)

User authentication and account management.

**Functions:**
- `signUp(email, password, displayName)` - Create new user account
- `signIn(email, password)` - Sign in existing user
- `signInWithGoogle()` - Sign in with Google
- `logOut()` - Sign out current user
- `resetPassword(email)` - Send password reset email
- `getCurrentUser()` - Get current authenticated user
- `onAuthChange(callback)` - Listen to auth state changes
- `updateUserProfile(updates)` - Update user profile

### 2. **Firestore Database** (`firestore.js`)

NoSQL database for storing and syncing data.

**Generic Functions:**
- `createDocument(collection, data)` - Create a new document
- `getDocument(collection, id)` - Get a single document
- `getAllDocuments(collection)` - Get all documents from a collection
- `updateDocument(collection, id, data)` - Update a document
- `deleteDocument(collection, id)` - Delete a document
- `queryDocuments(collection, filters, orderBy, limit)` - Query with filters

**Pre-built Functions:**
- `submitContactForm(formData)` - Submit contact form
- `getContactSubmissions()` - Get all contact submissions
- `createWorkItem(workData)` - Add portfolio item
- `getWorkItems()` - Get all portfolio items
- `createBlogPost(postData)` - Create blog post
- `getBlogPosts(limit)` - Get blog posts
- `createTeamMember(memberData)` - Add team member
- `getTeamMembers()` - Get all team members
- `createTestimonial(testimonialData)` - Add testimonial
- `getTestimonials()` - Get all testimonials

### 3. **Storage** (`storage.js`)

File storage for images, videos, and other assets.

**Functions:**
- `uploadFile(file, path)` - Upload a file
- `uploadFileWithProgress(file, path, onProgress)` - Upload with progress tracking
- `deleteFile(path)` - Delete a file
- `getFileURL(path)` - Get download URL
- `listFiles(path)` - List all files in a directory

**Helper Functions:**
- `uploadPortfolioImage(file, fileName)` - Upload portfolio image
- `uploadTeamPhoto(file, fileName)` - Upload team member photo
- `uploadBlogImage(file, fileName)` - Upload blog image
- `uploadDesignAsset(file, fileName)` - Upload design asset

---

## 💡 Usage Examples

### Example 1: Contact Form Submission

```javascript
import { submitContactForm } from './firebase';

const handleContactSubmit = async (formData) => {
  try {
    const docId = await submitContactForm({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      phone: formData.phone,
    });
    console.log('Contact form submitted:', docId);
    alert('Thank you! We will get back to you soon.');
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Error submitting form. Please try again.');
  }
};
```

### Example 2: Display Portfolio Items

```javascript
import { useEffect, useState } from 'react';
import { getWorkItems } from './firebase';

function Portfolio() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const items = await getWorkItems();
        setWorks(items);
      } catch (error) {
        console.error('Error fetching works:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {works.map(work => (
        <div key={work.id}>
          <h3>{work.title}</h3>
          <img src={work.imageUrl} alt={work.title} />
          <p>{work.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Upload Image with Progress

```javascript
import { useState } from 'react';
import { uploadPortfolioImage } from './firebase';

function ImageUpload() {
  const [progress, setProgress] = useState(0);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const url = await uploadFileWithProgress(
        file,
        `portfolio/${file.name}`,
        (progress) => setProgress(progress)
      );
      setImageUrl(url);
      console.log('Upload complete:', url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} accept="image/*" />
      {progress > 0 && <progress value={progress} max="100" />}
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

### Example 4: User Authentication

```javascript
import { useState, useEffect } from 'react';
import { signIn, signUp, logOut, onAuthChange } from './firebase';

function Auth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignUp = async (email, password, name) => {
    try {
      const user = await signUp(email, password, name);
      console.log('User created:', user);
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  const handleSignIn = async (email, password) => {
    try {
      const user = await signIn(email, password);
      console.log('User signed in:', user);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleLogOut = async () => {
    try {
      await logOut();
      console.log('User signed out');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.displayName || user.email}!</p>
          <button onClick={handleLogOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <button onClick={() => handleSignIn('user@example.com', 'password')}>
            Sign In
          </button>
        </div>
      )}
    </div>
  );
}
```

### Example 5: Query with Filters

```javascript
import { queryDocuments } from './firebase';

// Get published blog posts, ordered by date, limit 5
const getRecentPosts = async () => {
  const posts = await queryDocuments(
    'blog',
    [['status', '==', 'published']],
    'createdAt',
    5
  );
  return posts;
};

// Get team members by role
const getDesigners = async () => {
  const designers = await queryDocuments(
    'team',
    [['role', '==', 'designer']],
    'name',
    null
  );
  return designers;
};
```

---

## 🔒 Security Rules

### Firestore Security Rules

For production, update your Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users
    // Allow write only to authenticated users
    
    match /contacts/{document} {
      allow read: if request.auth != null;
      allow create: if true; // Allow anyone to submit contact forms
    }
    
    match /portfolio/{document} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    match /blog/{document} {
      allow read: if true; // Public read
      allow write: if request.auth != null;
    }
    
    match /team/{document} {
      allow read: if true; // Public read
      allow write: if request.auth != null;
    }
    
    match /testimonials/{document} {
      allow read: if true; // Public read
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules

For production, update your Storage rules in Firebase Console:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Only authenticated users can upload
    }
  }
}
```

---

## 📊 Suggested Database Structure

### Contacts Collection
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  message: "I'm interested in your services",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Portfolio Collection
```javascript
{
  title: "Brand Identity Design",
  description: "Complete branding package for tech startup",
  imageUrl: "https://...",
  category: "branding",
  client: "Tech Startup Inc",
  featured: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Blog Collection
```javascript
{
  title: "10 Marketing Trends for 2024",
  content: "Full blog post content...",
  excerpt: "Short description...",
  imageUrl: "https://...",
  author: "MSS Team",
  status: "published",
  tags: ["marketing", "trends"],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Team Collection
```javascript
{
  name: "Jane Smith",
  role: "Creative Director",
  bio: "10+ years of experience...",
  photoUrl: "https://...",
  social: {
    linkedin: "https://...",
    twitter: "https://..."
  },
  order: 1,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Testimonials Collection
```javascript
{
  clientName: "ABC Company",
  clientRole: "CEO",
  testimonial: "Working with MSS was amazing...",
  rating: 5,
  projectType: "branding",
  featured: true,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## 🎯 Next Steps

1. **Set up Firebase project** and get credentials
2. **Update `.env` file** with your Firebase config
3. **Enable required services** in Firebase Console
4. **Test the integration** with the provided examples
5. **Update security rules** before going to production
6. **Integrate with your components** (Contact form, Portfolio, etc.)

---

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)

---

## ⚠️ Important Notes

- **Never commit `.env` file** to version control
- **Use environment variables** for all sensitive data
- **Update security rules** before deploying to production
- **Enable billing** in Firebase for production use
- **Monitor usage** in Firebase Console to avoid unexpected costs
- **Test mode rules** allow anyone to read/write - update before production!

---

For questions or issues, refer to the Firebase documentation or contact the development team.

