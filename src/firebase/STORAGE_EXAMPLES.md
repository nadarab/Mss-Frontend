# Firebase Storage Usage Examples

## 📸 Upload Images and Videos to Firebase Storage

Firebase Storage is perfect for storing your portfolio images, videos, and other media files.

---

## Example 1: Simple Image Upload

```javascript
import React, { useState } from 'react';
import { uploadImage } from '../firebase/storageService';
import { addDocument } from '../firebase/firestoreService';

function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload image to Firebase Storage
      const url = await uploadImage(file, 'portfolio');
      
      // Save image URL to Firestore
      await addDocument('portfolio_images', {
        imageUrl: url,
        fileName: file.name,
        category: 'branding',
        uploadedAt: new Date()
      });

      setImageUrl(url);
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />}
    </div>
  );
}
```

---

## Example 2: Video Upload with Progress Bar

```javascript
import React, { useState } from 'react';
import { uploadVideo } from '../firebase/storageService';
import { addDocument } from '../firebase/firestoreService';

function VideoUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Upload video with progress tracking
      const url = await uploadVideo(file, 'portfolio', (uploadProgress) => {
        setProgress(uploadProgress);
      });

      // Save video URL to Firestore
      await addDocument('portfolio_videos', {
        videoUrl: url,
        fileName: file.name,
        category: 'projects',
        duration: 0, // You can add video duration if needed
        uploadedAt: new Date()
      });

      setVideoUrl(url);
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        disabled={uploading}
      />
      
      {uploading && (
        <div>
          <p>Uploading: {progress}%</p>
          <div style={{ width: '100%', height: '20px', background: '#ddd' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#0066ff',
                transition: 'width 0.3s'
              }}
            />
          </div>
        </div>
      )}

      {videoUrl && (
        <video src={videoUrl} controls style={{ maxWidth: '500px' }} />
      )}
    </div>
  );
}
```

---

## Example 3: Multiple File Upload

```javascript
import React, { useState } from 'react';
import { uploadMultipleFiles } from '../firebase/storageService';
import { addDocument } from '../firebase/firestoreService';

function MultipleImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleMultipleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      // Upload all files at once
      const urls = await uploadMultipleFiles(files, 'images/gallery', (uploadProgress) => {
        setProgress(uploadProgress);
      });

      // Save all URLs to Firestore
      for (const url of urls) {
        await addDocument('gallery_images', {
          imageUrl: url,
          category: 'design',
          uploadedAt: new Date()
        });
      }

      setUploadedUrls(urls);
      alert(`${urls.length} images uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleMultipleUpload}
        disabled={uploading}
      />
      
      {uploading && <p>Uploading: {progress}%</p>}
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {uploadedUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Upload ${index + 1}`}
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Example 4: Complete Portfolio Upload Form

```javascript
import React, { useState } from 'react';
import { uploadImage } from '../firebase/storageService';
import { addDocument } from '../firebase/firestoreService';

function PortfolioUploadForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'branding',
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // 1. Upload image to Storage
      const imageUrl = await uploadImage(file, formData.category, (uploadProgress) => {
        setProgress(uploadProgress);
      });

      // 2. Save project data to Firestore
      await addDocument('portfolio_projects', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        imageUrl: imageUrl,
        featured: false,
        createdAt: new Date(),
      });

      alert('Portfolio item added successfully!');
      
      // Reset form
      setFormData({ title: '', description: '', category: 'branding' });
      setFile(null);
      setProgress(0);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Add Portfolio Item</h2>

      <div style={{ marginBottom: '15px' }}>
        <label>Title:</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows="4"
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Category:</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="branding">Branding</option>
          <option value="design">Design</option>
          <option value="video">Video</option>
          <option value="web">Web Development</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
          style={{ width: '100%' }}
        />
      </div>

      {uploading && (
        <div style={{ marginBottom: '15px' }}>
          <p>Uploading: {progress}%</p>
          <div style={{ width: '100%', height: '10px', background: '#ddd', borderRadius: '5px' }}>
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#0066ff',
                borderRadius: '5px',
                transition: 'width 0.3s'
              }}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={uploading}
        style={{
          padding: '10px 20px',
          background: uploading ? '#ccc' : '#0066ff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: uploading ? 'not-allowed' : 'pointer'
        }}
      >
        {uploading ? 'Uploading...' : 'Upload Portfolio Item'}
      </button>
    </form>
  );
}
```

---

## Example 5: Display Images from Firestore

```javascript
import React, { useState, useEffect } from 'react';
import { getAllDocuments } from '../firebase/firestoreService';

function PortfolioGallery() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getAllDocuments('portfolio_projects');
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
      {projects.map((project) => (
        <div key={project.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
          <img
            src={project.imageUrl}
            alt={project.title}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
          <div style={{ padding: '15px' }}>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <span style={{ fontSize: '12px', color: '#666' }}>{project.category}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔒 Storage Security Rules

Add these rules in Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow uploads to specific folders (you can restrict this later)
    match /images/{allPaths=**} {
      allow write: if request.resource.size < 5 * 1024 * 1024 // 5MB limit
                   && request.resource.contentType.matches('image/.*');
    }
    
    match /videos/{allPaths=**} {
      allow write: if request.resource.size < 100 * 1024 * 1024 // 100MB limit
                   && request.resource.contentType.matches('video/.*');
    }
  }
}
```

---

## 📁 Recommended Folder Structure

```
Firebase Storage/
├── images/
│   ├── portfolio/
│   ├── branding/
│   ├── design/
│   └── gallery/
├── videos/
│   ├── portfolio/
│   └── projects/
└── documents/
    └── pdfs/
```

---

## 💡 Best Practices

1. **Compress images** before uploading (use tools like TinyPNG)
2. **Use descriptive filenames** for better organization
3. **Store metadata in Firestore** (URLs, titles, descriptions)
4. **Implement progress bars** for better UX
5. **Validate file types and sizes** before upload
6. **Use thumbnails** for gallery views (generate smaller versions)
7. **Delete old files** when updating to save storage costs

---

## 🚀 Ready to Use!

All the helper functions are in `storageService.js`. Just import and use them in your components!

