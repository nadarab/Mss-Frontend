# Firestore Usage Examples

## Setup Complete! ✅

Your Firebase Firestore is now configured and ready to use.

## File Structure

```
src/
  firebase/
    ├── config.js              # Firebase initialization
    ├── index.js               # Exports for easy imports
    ├── firestoreService.js    # Helper functions
    └── USAGE_EXAMPLES.md      # This file
```

## How to Use Firestore in Your Components

### Example 1: Basic CRUD Operations

```javascript
import React, { useState, useEffect } from 'react';
import {
  addDocument,
  getAllDocuments,
  updateDocument,
  deleteDocument
} from '../firebase/firestoreService';

function ContactForm() {
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Load all contacts on component mount
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const data = await getAllDocuments('contacts');
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  // Add a new contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDocument('contacts', formData);
      alert('Contact submitted successfully!');
      setFormData({ name: '', email: '', message: '' });
      loadContacts(); // Refresh the list
    } catch (error) {
      console.error('Error submitting contact:', error);
    }
  };

  // Update a contact
  const handleUpdate = async (id, updates) => {
    try {
      await updateDocument('contacts', id, updates);
      loadContacts();
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  // Delete a contact
  const handleDelete = async (id) => {
    try {
      await deleteDocument('contacts', id);
      loadContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Name"
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Email"
        />
        <textarea
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          placeholder="Message"
        />
        <button type="submit">Submit</button>
      </form>

      <div>
        <h2>Contacts</h2>
        {contacts.map((contact) => (
          <div key={contact.id}>
            <p>{contact.name} - {contact.email}</p>
            <button onClick={() => handleDelete(contact.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Example 2: Real-time Listener

```javascript
import React, { useState, useEffect } from 'react';
import { listenToCollection } from '../firebase/firestoreService';

function RealtimeProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Set up real-time listener
    const unsubscribe = listenToCollection('projects', (data) => {
      setProjects(data);
    });

    // Cleanup: unsubscribe when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Projects (Real-time)</h2>
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Query with Conditions

```javascript
import React, { useState, useEffect } from 'react';
import { queryDocuments, getOrderedDocuments } from '../firebase/firestoreService';

function FilteredServices() {
  const [services, setServices] = useState([]);

  // Get services with specific conditions
  const loadActiveServices = async () => {
    try {
      const data = await queryDocuments('services', [
        { field: 'status', operator: '==', value: 'active' },
        { field: 'price', operator: '<=', value: 1000 }
      ]);
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  // Get latest 5 services
  const loadLatestServices = async () => {
    try {
      const data = await getOrderedDocuments('services', 'createdAt', 'desc', 5);
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  return (
    <div>
      <button onClick={loadActiveServices}>Load Active Services</button>
      <button onClick={loadLatestServices}>Load Latest Services</button>
      
      {services.map((service) => (
        <div key={service.id}>
          <h3>{service.name}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 4: Using Direct Firestore Functions

```javascript
import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function DirectFirestoreExample() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      // Direct Firestore usage
      const docRef = await addDoc(collection(db, 'submissions'), {
        ...data,
        timestamp: serverTimestamp(),
        status: 'pending'
      });
      console.log('Document written with ID:', docRef.id);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

## Common Use Cases for Your MSS Project

### 1. Store Contact Form Submissions

```javascript
// In your ContactUs component
import { addDocument } from '../../firebase/firestoreService';

const handleContactSubmit = async (formData) => {
  await addDocument('contact_submissions', {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    message: formData.message,
    status: 'new'
  });
};
```

### 2. Store Project Portfolio Items

```javascript
// Add projects to Firestore
await addDocument('projects', {
  title: 'Project Name',
  category: 'branding', // or 'video', 'design'
  description: 'Project description',
  imageUrl: 'https://...',
  featured: true
});
```

### 3. Track Analytics Events

```javascript
// Log custom events
await addDocument('analytics_events', {
  eventType: 'page_view',
  page: '/services',
  userId: 'anonymous',
  metadata: { source: 'organic' }
});
```

### 4. Store Client Testimonials

```javascript
// Add testimonials
await addDocument('testimonials', {
  clientName: 'John Doe',
  company: 'ABC Corp',
  rating: 5,
  testimonial: 'Great service!',
  approved: true
});
```

## Important Notes

1. **Firestore Rules**: Don't forget to set up security rules in Firebase Console
2. **Collections**: Create collections in Firebase Console or they'll be created automatically on first write
3. **Offline Support**: Firestore has built-in offline support
4. **Real-time Updates**: Use listeners for real-time data synchronization
5. **Timestamps**: Use `serverTimestamp()` for consistent timestamps

## Next Steps

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mss-project-57e93`
3. Navigate to Firestore Database
4. Click "Create database"
5. Choose production mode or test mode
6. Set up security rules
7. Start using Firestore in your components!

## Security Rules Example (for Firebase Console)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all
    match /{document=**} {
      allow read: if true;
    }
    
    // Allow write to contact_submissions
    match /contact_submissions/{docId} {
      allow create: if true;
      allow update, delete: if false;
    }
    
    // Protect other collections
    match /{collection}/{docId} {
      allow write: if false; // Only allow through admin SDK
    }
  }
}
```

