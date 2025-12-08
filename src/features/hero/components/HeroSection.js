import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './HeroSection.css';
import heroVideo from '../../../assets/videos/HeroSection (2).mp4';
import logo from '../../../assets/images/common/logoMSS.PNG';
import orbetLogo from '../../../assets/images/Hero/orbet.png';
import rashedLogo from '../../../assets/images/Hero/rashed.png';
import { smoothScrollTo } from '../../../shared/utils/smoothScroll';

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    setNavExpanded(false);
    
    setTimeout(() => {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        smoothScrollTo(targetElement, 80);
      }
    }, 100);
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
          className="hero-video" 
          autoPlay 
          loop 
          muted 
          playsInline
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
          <div className="partner-logos-track">
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

