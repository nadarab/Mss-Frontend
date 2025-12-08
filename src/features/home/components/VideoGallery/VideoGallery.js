import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './VideoGallery.css';
import { CenteredVideoCarousel } from '../../../work/ui';
import { videoCategoryService, videoService } from '../../../../firebase/collections';
import heroVideo from '../../../../assets/videos/HeroSection (2).mp4';

function VideoGallery() {
  const heroRef = useRef(null);
  const sectionsRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load videos from Firestore
  useEffect(() => {
    loadVideosFromFirestore();
  }, []);

  const loadVideosFromFirestore = async () => {
    try {
      // Get all video categories
      const categories = await videoCategoryService.getAll();
      
      // For each category, get its videos
      const sectionsData = await Promise.all(
        categories.map(async (category, index) => {
          const videos = await videoService.getByCategory(category.id);
          
          return {
            id: category.id,
            title: category.title,
            description: category.subtitle || 'Amazing video content',
            videos: videos.map(v => v.videoUrl),
            reverse: index % 2 !== 0 // Alternate layout
          };
        })
      );

      setSections(sectionsData);
    } catch (error) {
      console.error('Error loading videos:', error);
      // Fallback to empty array if error
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

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
  }, []);

  if (loading) {
    return (
      <div className="video-gallery-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
          color: '#fff',
          fontSize: '1.5rem'
        }}>
          Loading videos...
        </div>
      </div>
    );
  }

  return (
    <div className="video-gallery-page">
      <section 
        className="video-hero-section" 
        ref={heroRef}
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          opacity: 1 - scrollY / 800
        }}
      >
        <div className="video-hero-overlay">
          <h1 className="video-hero-title">Video Production</h1>
          <p className="video-hero-subtitle">Cinematic storytelling that brings your brand to life</p>
          <div 
            className="scroll-indicator"
            onClick={() => {
              sectionsRef.current?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }}
          >
            <span>Scroll to Explore</span>
            <div className="scroll-arrow"></div>
          </div>
        </div>
        <video
          className="video-hero-bg"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </section>

      <div className="video-sections-container" ref={sectionsRef}>
        {sections.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px 20px',
            color: '#fff'
          }}>
            <h2>No video categories yet</h2>
            <p>Add video categories and videos in the admin panel at <a href="/admin" style={{ color: '#0066ff' }}>/admin</a></p>
          </div>
        ) : (
          sections.map((section) => (
            <section 
              key={section.id}
              className={`video-section ${section.reverse ? 'reverse' : ''}`}
            >
              <div className="video-section-content-carousel">
                <div className="video-text-content">
                  <h2>{section.title}</h2>
                  <p>{section.description}</p>
                </div>

                {section.videos.length > 0 ? (
                  <div className="section-carousel-wrapper">
                    <CenteredVideoCarousel 
                      videos={section.videos} 
                      carouselId={`carousel-${section.id}`}
                    />
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#aaa'
                  }}>
                    <p>No videos in this category yet</p>
                  </div>
                )}
              </div>
            </section>
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

export default VideoGallery;

