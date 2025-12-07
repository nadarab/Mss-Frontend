import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './DesignGallery.css';
import { CenteredImageCarousel } from '../../../work/ui';
import heroImg from '../../../../assets/images/design/VedioGallaryBackground.jpg';
import post1 from '../../../../assets/images/design/post1.JPG';
import post2 from '../../../../assets/images/design/post2.JPG';
import post3 from '../../../../assets/images/design/post3.JPG';
import post4 from '../../../../assets/images/design/post4.JPG';
import post5 from '../../../../assets/images/design/post5.PNG';
import post6 from '../../../../assets/images/design/post6.PNG';

function DesignGallery() {
  const heroRef = useRef(null);
  const sectionsRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

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
  }, []);

  const sections = [
    {
      id: 1,
      title: "Item",
      description: "Showcasing products in their best light. Highlighting details, textures, and design with precision photography.",
      images: [post2, post3, post4, post5, post6, post1],
      reverse: false
    },
    {
      id: 2,
      title: "Events",
      description: "Capturing the essence of every event — the energy, emotions, and unforgettable moments through our lens.",
      images: [post5, post6, post1, post2, post3, post4],
      reverse: true
    },
    {
      id: 3,
      title: "Places",
      description: "Transforming locations into visual stories — from architecture to intimate corners, we reveal their character.",
      images: [post6, post1, post2, post3, post4, post5],
      reverse: false
    },
    {
      id: 4,
      title: "Clothes",
      description: "Highlighting each piece with elegance — capturing the details and textures.",
      images: [post3, post4, post5, post6, post1, post2],
      reverse: true
    }
  ];

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
        <img className="video-hero-bg" src={heroImg} alt="Design Hero" />
      </section>

      <div className="video-sections-container" ref={sectionsRef}>
        {sections.map(section => (
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

export default DesignGallery;

