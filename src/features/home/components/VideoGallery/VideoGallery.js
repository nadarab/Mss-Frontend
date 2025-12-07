import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './VideoGallery.css';
import { CenteredVideoCarousel } from '../../../work/ui';
import heroVideo from '../../../../assets/videos/HeroSection (2).mp4';
import video2 from '../../../../assets/videos/Vedio2.MOV';
import video3 from '../../../../assets/videos/Vedio3.MOV';
import video4 from '../../../../assets/videos/Vedio4.MOV';
import video5 from '../../../../assets/videos/Vedio5.MOV';
import video6 from '../../../../assets/videos/Vedio6.MOV';
import video7 from '../../../../assets/videos/Vedio7.MOV';
import video8 from '../../../../assets/videos/Vedio8.MOV';

function VideoGallery() {
  const heroRef = useRef(null);
  const sectionsRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

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

  const sections = [
    {
      id: 1,
      title: "Item",
      description: "Showcasing products in their best light. Highlighting details, textures, and design with precision photography.",
      videos: [video2, video3, video4, video5, video6, video7, video8],
      reverse: false
    },
    {
      id: 2,
      title: "Events",
      description: "Capturing the essence of every event — the energy, emotions, and unforgettable moments through our lens.",
      videos: [video5, video6, video7, video8, video2, video3, video4],
      reverse: true
    },
    {
      id: 3,
      title: "Places",
      description: "Transforming locations into visual stories — from architecture to intimate corners, we reveal their character.",
      videos: [video8, video2, video3, video4, video5, video6, video7],
      reverse: false
    },
    {
      id: 4,
      title: "Clothes",
      description: "Highlighting each piece with elegance — capturing the details and textures.",
      videos: [video4, video5, video6, video7, video8, video2, video3],
      reverse: true
    }
  ];

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
        {sections.map((section) => (
          <section 
            key={section.id}
            className={`video-section ${section.reverse ? 'reverse' : ''}`}
          >
            <div className="video-section-content-carousel">
              <div className="video-text-content">
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </div>

              <div className="section-carousel-wrapper">
                <CenteredVideoCarousel 
                  videos={section.videos} 
                  carouselId={`carousel-${section.id}`}
                />
              </div>
            </div>
          </section>
        ))}
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

