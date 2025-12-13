import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './DesignGallery.css';
import { CenteredImageCarousel } from '../../../work/ui';
import { designProjectService } from '../../../../firebase/collections';
import { getDocument } from '../../../../firebase/firestoreService';
import heroImg from '../../../../assets/images/design/VedioGallaryBackground.jpg';

function DesignGallery() {
  const heroRef = useRef(null);
  const sectionsRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState(heroImg);

  // Load design projects from Firestore
  useEffect(() => {
    loadDesignProjectsFromFirestore();
    loadHeroImageFromFirestore();
  }, []);

  const loadHeroImageFromFirestore = async () => {
    try {
      const pageData = await getDocument('design_page', 'hero_section');
      if (pageData && pageData.heroImage) {
        setHeroImage(pageData.heroImage);
      }
    } catch (error) {
      console.log('Design page hero image not found in Firestore, using default');
    }
  };

  const loadDesignProjectsFromFirestore = async () => {
    try {
      // Get all design projects
      const allProjects = await designProjectService.getAll();
      
      // Group projects by category
      const categoryMap = {};
      
      allProjects.forEach(project => {
        const category = project.category || 'uncategorized';
        if (!categoryMap[category]) {
          categoryMap[category] = {
            category: category,
            title: project.title || category.charAt(0).toUpperCase() + category.slice(1),
            description: project.description || `Creative design work in ${category}`,
            images: []
          };
        }
        
        // Add all images from this project to the category
        if (project.images && Array.isArray(project.images)) {
          categoryMap[category].images.push(...project.images);
        }
      });

      // Convert to sections array
      const sectionsData = Object.values(categoryMap).map((category, index) => ({
        id: category.category,
        title: category.title,
        description: category.description,
        images: category.images,
        reverse: index % 2 !== 0 // Alternate layout
      }));

      setSections(sectionsData);
    } catch (error) {
      console.error('Error loading design projects:', error);
      // Fallback to empty array if error
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          entry.target.classList.remove('animate-out');
        } else {
          const rect = entry.target.getBoundingClientRect();
          if (rect.bottom < 0) {
            entry.target.classList.remove('animate-in');
            entry.target.classList.add('animate-out');
          }
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('.video-section');
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="video-gallery-page">
      <section
        className="video-hero-section"
        ref={heroRef}
        style={{ transform: `translateY(${scrollY * 0.5}px)`, opacity: 1 - scrollY / 800 }}
      >
        <div className="video-hero-overlay">
          <h1 className="video-hero-title">Design Gallery</h1>
          <p className="video-hero-subtitle">Creative design that brings your brand to life</p>
          <div
            className="scroll-indicator"
            onClick={() => {
              sectionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <span>Scroll to Explore</span>
            <div className="scroll-arrow"></div>
          </div>
        </div>
        <img className="video-hero-bg" src={heroImage} alt="Design Hero" />
      </section>

      <div className="video-sections-container" ref={sectionsRef}>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '50vh',
            color: '#fff',
            fontSize: '1.5rem'
          }}>
            Loading design projects...
          </div>
        ) : sections.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 20px',
            color: '#fff'
          }}>
            <h2>No design projects yet</h2>
            <p>Add design projects in the admin panel at <a href="/admin" style={{ color: '#0066ff' }}>/admin</a></p>
          </div>
        ) : (
          sections.map(section => (
            section.images && section.images.length > 0 ? (
              <section key={section.id} className={`video-section ${section.reverse ? 'reverse' : ''}`}>
                <div className="video-section-content-carousel">
                  <div className="video-text-content">
                    <h2>{section.title}</h2>
                    <p>{section.description}</p>
                  </div>
                  <div className="section-carousel-wrapper">
                    <CenteredImageCarousel images={section.images} carouselId={`design-carousel-${section.id}`} />
                  </div>
                </div>
              </section>
            ) : null
          ))
        )}
      </div>

      <div className="video-footer">
        <Link to="/" className="back-home-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default DesignGallery;

