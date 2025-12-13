import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './HeroSection.css';
import heroVideo from '../../../assets/Vedio/HeroSection.mp4';
import logo from '../../../assets/images/common/logoMSS.PNG';
import orbetLogo from '../../../assets/images/Hero/orbet.png';
import rashedLogo from '../../../assets/images/Hero/rashed.png';
import { smoothScrollTo } from '../../../shared/utils/smoothScroll';

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const videoRef = useRef(null);
  const logosTrackRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // Handle seamless infinite scroll for partner logos
  useEffect(() => {
    const track = logosTrackRef.current;
    if (!track) return;

    let animationId;
    let position = 0;
    let lastTime = performance.now();
    const duration = 30000; // 30 seconds in milliseconds
    let setWidth = 0;

    // Calculate set width after layout
    const calculateSetWidth = () => {
      if (track.scrollWidth > 0) {
        setWidth = track.scrollWidth / 2; // Width of one set of logos
        return true;
      }
      return false;
    };

    const animate = (currentTime) => {
      if (!setWidth && !calculateSetWidth()) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Calculate speed based on duration (setWidth pixels in 30 seconds)
      const speed = (setWidth / duration) * deltaTime;
      position -= speed;

      // Reset position seamlessly when we've moved one full set width
      if (Math.abs(position) >= setWidth) {
        position = 0;
      }

      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);  
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    setNavExpanded(false);

    // Immediate check first
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      smoothScrollTo(targetElement, 80);
      return;
    }

    // Quick retry for dynamic content (only if not found immediately)
    const scrollToTarget = (retries = 2) => {
      const element = document.getElementById(targetId);
      if (element) {
        smoothScrollTo(element, 80);
      } else if (retries > 0) {
        // Very short delay for retry
        setTimeout(() => scrollToTarget(retries - 1), 10);
      }
    };
    
    scrollToTarget();
  };

  const handleVideoEnd = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.duration && !isNaN(video.duration)) {
        // تثبيت الفيديو عند آخر إطار تقريباً (1/30 ثانية قبل النهاية)
        const lastFrameTime = Math.max(0, video.duration - 1 / 60);
        video.currentTime = lastFrameTime;
        video.pause();
      }
    }
  };

  // Partner logos data
  const partnerLogos = [
    { name: 'Orbet', image: orbetLogo },
    { name: 'Rashed', image: rashedLogo },
    { name: 'MSS', image: logo },
  ];

  return (
    <section id="hero" className={`hero-section ${isLoaded ? 'loaded' : ''}`}>
      <Navbar expand="lg" className="hero-navbar" expanded={navExpanded} onToggle={setNavExpanded}>
        <Container fluid>
          <Navbar.Brand href="#" className="navbar-brand-custom">
            <img src={logo} alt="MSS Agency" className="navbar-logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#hero" onClick={(e) => handleNavClick(e, 'hero')}>Home</Nav.Link>
              <Nav.Link href="#services" onClick={(e) => handleNavClick(e, 'services')}>Our Services</Nav.Link>
              <Nav.Link href="#work" onClick={(e) => handleNavClick(e, 'work')}>Our Work</Nav.Link>
              <Nav.Link href="#about" onClick={(e) => handleNavClick(e, 'about')}>About Us</Nav.Link>
              <Nav.Link href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="hero-video-container">
      <video 
  ref={videoRef}
  className="hero-video" 
  autoPlay 
  muted 
  playsInline
  onTimeUpdate={() => {
    const video = videoRef.current;
    if (!video) return;

    const freezeThreshold = 0.07; // 50ms قبل النهاية
    if (video.currentTime >= video.duration - freezeThreshold) {
      video.pause();
      video.currentTime = video.duration - freezeThreshold; // ابقِ على آخر إطار تقريبًا
    }
  }}
>
  <source src={heroVideo} type="video/mp4" />
  Your browser does not support the video tag.
</video>

        <div className="hero-video-overlay"></div>
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          Content That <span className="highlight-blue">Captures.</span>
        </h1>
        <h1 className="hero-title hero-title-second">
          <span className="highlight-blue">Strategies </span> That Scale.
        </h1>
      </div>

      <div className="trusted-worldwide-section">
        <div className="trusted-text">Our<div> Partners</div></div>
        <div className="partner-logos-container">
          <div className="partner-logos-track" ref={logosTrackRef}>
            {partnerLogos.map((logo, index) => (
              <div key={index} className={`partner-logo ${logo.name === 'MSS' || logo.name === 'Rashed' || logo.name === 'Orbet' ? 'partner-logo-with-text' : ''} ${logo.name === 'Orbet' ? 'partner-logo-orbet' : ''}`}>
                <img src={logo.image} alt={logo.name} />
                {logo.name === 'MSS' && <span className="partner-logo-text">MSS Team</span>}
                {logo.name === 'Rashed' && <span className="partner-logo-text">Rashed Courses</span>}
                {logo.name === 'Orbet' && <span className="partner-logo-text">Orbit Production</span>}
              </div>
            ))}
            {/* Duplicate logos for seamless loop */}
            {partnerLogos.map((logo, index) => (
              <div key={`duplicate-${index}`} className={`partner-logo ${logo.name === 'MSS' || logo.name === 'Rashed' || logo.name === 'Orbet' ? 'partner-logo-with-text' : ''} ${logo.name === 'Orbet' ? 'partner-logo-orbet' : ''}`}>
                <img src={logo.image} alt={logo.name} />
                {logo.name === 'MSS' && <span className="partner-logo-text">MSS Team</span>}
                {logo.name === 'Rashed' && <span className="partner-logo-text">Rashed Courses</span>}
                {logo.name === 'Orbet' && <span className="partner-logo-text">Orbit Production</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;