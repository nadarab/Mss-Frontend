import React, { useState } from 'react';
import {
  videoCategoryService,
  videoService,
  brandingProjectService,
  designProjectService,
  employeeService
} from '../firebase/collections';

/**
 * Simple Admin Panel to add data to Firestore
 * Collections will be created automatically when you add first document
 */
function AdminPanel() {
  const [activeTab, setActiveTab] = useState('video-category');
  const [message, setMessage] = useState('');

  const showMessage = (msg, isError = false) => {
    setMessage({ text: msg, isError });
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <h1>🔧 Admin Panel</h1>
      <p style={{ color: '#aaa' }}>Add data to your Firestore database. Collections will be created automatically!</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('video-category')} style={tabStyle(activeTab === 'video-category')}>
          Video Categories
        </button>
        <button onClick={() => setActiveTab('video')} style={tabStyle(activeTab === 'video')}>
          Videos
        </button>
        <button onClick={() => setActiveTab('branding')} style={tabStyle(activeTab === 'branding')}>
          Branding Projects
        </button>
        <button onClick={() => setActiveTab('design')} style={tabStyle(activeTab === 'design')}>
          Design Projects
        </button>
        <button onClick={() => setActiveTab('employee')} style={tabStyle(activeTab === 'employee')}>
          Team Members
        </button>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '8px',
          background: message.isError ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)',
          color: message.isError ? '#ff6b6b' : '#4ade80'
        }}>
          {message.text}
        </div>
      )}

      {/* Forms */}
      {activeTab === 'video-category' && <VideoCategoryForm onSuccess={showMessage} />}
      {activeTab === 'video' && <VideoForm onSuccess={showMessage} />}
      {activeTab === 'branding' && <BrandingProjectForm onSuccess={showMessage} />}
      {activeTab === 'design' && <DesignProjectForm onSuccess={showMessage} />}
      {activeTab === 'employee' && <EmployeeForm onSuccess={showMessage} />}
    </div>
  );
}

// ============================================
// Video Category Form
// ============================================
function VideoCategoryForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: '',
    order: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await videoCategoryService.add(formData);
      onSuccess('✅ Video category added successfully!');
      setFormData({ title: '', subtitle: '', type: '', order: 0 });
    } catch (error) {
      onSuccess('❌ Error: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Add Video Category</h3>
      <input
        type="text"
        placeholder="Title (e.g., Social Media Ads)"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Subtitle (e.g., Engaging content for your audience)"
        value={formData.subtitle}
        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Type (e.g., commercial, promotional)"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Order (for sorting)"
        value={formData.order}
        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
        style={inputStyle}
      />
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Adding...' : 'Add Category'}
      </button>
    </form>
  );
}

// ============================================
// Video Form
// ============================================
function VideoForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    categoryId: '',
    title: '',
    videoUrl: '',
    thumbnailUrl: '',
    order: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await videoService.add(formData);
      onSuccess('✅ Video added successfully!');
      setFormData({ categoryId: '', title: '', videoUrl: '', thumbnailUrl: '', order: 0 });
    } catch (error) {
      onSuccess('❌ Error: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Add Video</h3>
      <p style={{ color: '#aaa', fontSize: '14px' }}>
        First, upload your video to Firebase Storage, then paste the URL here
      </p>
      <input
        type="text"
        placeholder="Category ID (copy from Firestore)"
        value={formData.categoryId}
        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
        required
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Title (optional)"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        style={inputStyle}
      />
      <input
        type="url"
        placeholder="Video URL (from Firebase Storage)"
        value={formData.videoUrl}
        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
        required
        style={inputStyle}
      />
      <input
        type="url"
        placeholder="Thumbnail URL (optional)"
        value={formData.thumbnailUrl}
        onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Order"
        value={formData.order}
        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
        style={inputStyle}
      />
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Adding...' : 'Add Video'}
      </button>
    </form>
  );
}

// ============================================
// Branding Project Form
// ============================================
function BrandingProjectForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: '',
    clientName: '',
    year: new Date().getFullYear(),
    featured: false,
    order: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert comma-separated URLs to array
      const imagesArray = formData.images.split(',').map(url => url.trim()).filter(url => url);
      
      await brandingProjectService.add({
        ...formData,
        images: imagesArray
      });
      onSuccess('✅ Branding project added successfully!');
      setFormData({ title: '', description: '', images: '', clientName: '', year: new Date().getFullYear(), featured: false, order: 0 });
    } catch (error) {
      onSuccess('❌ Error: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Add Branding Project</h3>
      <input
        type="text"
        placeholder="Project Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        style={inputStyle}
      />
      <textarea
        placeholder="Project Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        rows="4"
        style={inputStyle}
      />
      <textarea
        placeholder="Image URLs (comma-separated, from Firebase Storage)"
        value={formData.images}
        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
        required
        rows="3"
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Client Name (optional)"
        value={formData.clientName}
        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Year"
        value={formData.year}
        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
        style={inputStyle}
      />
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
        <input
          type="checkbox"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
        />
        Featured Project
      </label>
      <input
        type="number"
        placeholder="Order"
        value={formData.order}
        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
        style={inputStyle}
      />
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Adding...' : 'Add Project'}
      </button>
    </form>
  );
}

// ============================================
// Design Project Form
// ============================================
function DesignProjectForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    images: '',
    category: '',
    clientName: '',
    year: new Date().getFullYear(),
    featured: false,
    order: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imagesArray = formData.images.split(',').map(url => url.trim()).filter(url => url);
      
      await designProjectService.add({
        ...formData,
        images: imagesArray
      });
      onSuccess('✅ Design project added successfully!');
      setFormData({ title: '', description: '', images: '', category: '', clientName: '', year: new Date().getFullYear(), featured: false, order: 0 });
    } catch (error) {
      onSuccess('❌ Error: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Add Design Project</h3>
      <input
        type="text"
        placeholder="Project Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
        style={inputStyle}
      />
      <textarea
        placeholder="Project Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
        rows="4"
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Category (e.g., social-media, print, digital)"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        style={inputStyle}
      />
      <textarea
        placeholder="Image URLs (comma-separated)"
        value={formData.images}
        onChange={(e) => setFormData({ ...formData, images: e.target.value })}
        required
        rows="3"
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Client Name (optional)"
        value={formData.clientName}
        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
        style={inputStyle}
      />
      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff' }}>
        <input
          type="checkbox"
          checked={formData.featured}
          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
        />
        Featured Project
      </label>
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Adding...' : 'Add Project'}
      </button>
    </form>
  );
}

// ============================================
// Employee Form
// ============================================
function EmployeeForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    imageUrl: '',
    bio: '',
    order: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await employeeService.add(formData);
      onSuccess('✅ Team member added successfully!');
      setFormData({ firstName: '', lastName: '', role: '', imageUrl: '', bio: '', order: 0 });
    } catch (error) {
      onSuccess('❌ Error: ' + error.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h3>Add Team Member</h3>
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        required
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="Role (e.g., CEO, Designer, Developer)"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        required
        style={inputStyle}
      />
      <input
        type="url"
        placeholder="Image URL (from Firebase Storage)"
        value={formData.imageUrl}
        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        required
        style={inputStyle}
      />
      <textarea
        placeholder="Bio (optional)"
        value={formData.bio}
        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        rows="3"
        style={inputStyle}
      />
      <input
        type="number"
        placeholder="Order"
        value={formData.order}
        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
        style={inputStyle}
      />
      <button type="submit" disabled={loading} style={buttonStyle}>
        {loading ? 'Adding...' : 'Add Team Member'}
      </button>
    </form>
  );
}

// Styles
const tabStyle = (active) => ({
  padding: '10px 20px',
  background: active ? '#0066ff' : 'rgba(255,255,255,0.1)',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px'
});

const formStyle = {
  background: 'rgba(255,255,255,0.05)',
  padding: '30px',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '15px'
};

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.2)',
  background: 'rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: '14px'
};

const buttonStyle = {
  padding: '12px 24px',
  background: '#0066ff',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: '600'
};

export default AdminPanel;

