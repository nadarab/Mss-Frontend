import React, { useState, useEffect } from 'react';
import {
  videoCategoryService,
  videoService,
  brandingProjectService,
  designProjectService,
  employeeService
} from '../firebase/collections';

/**
 * EXAMPLE: How to use the collections in your components
 * This shows the patterns you'll use throughout your app
 */

// ============================================
// Example 1: Display Video Categories
// ============================================
export function VideoCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await videoCategoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="video-categories">
      <h1>Video Categories</h1>
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <h3>{category.title}</h3>
            <p>{category.subtitle}</p>
            <button onClick={() => window.location.href = `/videos/${category.id}`}>
              View Videos
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Example 2: Display Videos by Category
// ============================================
export function CategoryVideosPage({ categoryId }) {
  const [category, setCategory] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryAndVideos();
  }, [categoryId]);

  const loadCategoryAndVideos = async () => {
    try {
      // Load category info
      const categoryData = await videoCategoryService.getById(categoryId);
      setCategory(categoryData);

      // Load videos for this category
      const videosData = await videoService.getByCategory(categoryId);
      setVideos(videosData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="category-videos">
      <h1>{category?.title}</h1>
      <p>{category?.subtitle}</p>
      
      <div className="videos-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <video src={video.videoUrl} controls />
            {video.title && <h4>{video.title}</h4>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Example 3: Display Branding Projects
// ============================================
export function BrandingProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await brandingProjectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="branding-projects">
      <h1>Branding Projects</h1>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            
            {/* Display project images */}
            <div className="project-images">
              {project.images?.map((imageUrl, index) => (
                <img 
                  key={index} 
                  src={imageUrl} 
                  alt={`${project.title} - ${index + 1}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Example 4: Display Team Members
// ============================================
export function TeamPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="team">
      <h1>Our Team</h1>
      <div className="team-grid">
        {employees.map((employee) => (
          <div key={employee.id} className="employee-card">
            <img src={employee.imageUrl} alt={`${employee.firstName} ${employee.lastName}`} />
            <h3>{employee.firstName} {employee.lastName}</h3>
            <p>{employee.role}</p>
            {employee.bio && <p className="bio">{employee.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Example 5: Add New Data (Admin Function)
// ============================================
export function AddVideoCategory() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    type: '',
    order: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await videoCategoryService.add(formData);
      alert('Category added successfully!');
      setFormData({ title: '', subtitle: '', type: '', order: 0 });
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Subtitle"
        value={formData.subtitle}
        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
      />
      <input
        type="text"
        placeholder="Type"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
      />
      <button type="submit">Add Category</button>
    </form>
  );
}

