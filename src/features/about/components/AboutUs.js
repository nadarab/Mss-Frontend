import React, { useRef, useEffect } from 'react';
import './AboutUs.css';
import aboutUsChar from '../../../assets/images/design/AboutUsChar.png';

function AboutUs() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      if (headerRef.current) observer.unobserve(headerRef.current);
    };
  }, []);

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="container">
        <div className="about-layout">
          <div className="about-content">
            <div ref={headerRef} className="about-header">
              <p className="about-eyebrow">About Us</p>
              <h2 className="about-title">Innovating in Motion</h2>
            </div>
            <div className="about-text-container">
              <p className="about-text">
                Founded in 2021, <strong>we are a creative digital agency delivering innovative solutions in the fast-moving world of marketing.</strong>
              </p>
              <p className="about-text">
                We help brands achieve measurable growth through strategies that are engaging, agile, and aligned with evolving market trends. Our goal is to be a leading mobile and digital marketing agency—known for creativity, speed, and results that truly resonate with audiences.
              </p>
            </div>
          </div>
          <div className="about-image-wrapper">
            <div className="about-image">
              <img src={aboutUsChar} alt="About Us" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
