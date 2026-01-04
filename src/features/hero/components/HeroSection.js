import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './HeroSection.css';
import logo from '../../../assets/images/common/logoMSS.PNG';
import orbetLogo from '../../../assets/images/Hero/orbet.png';
import rashedLogo from '../../../assets/images/Hero/rashed.png';
import heroImage from '../../../assets/Vedio/MSS Render.00_00_05_01.Still001.png';
import heroVideo from '../../../assets/Vedio/MSS Render New.mp4';
// Removed smoothScrollTo import - using CSS scroll-behavior instead

function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);
  const logosTrackRef = useRef(null);

  // Partner logos data - defined early so it can be used in useEffect
  const partnerLogos = [
    { name: 'Orbet', image: orbetLogo },
    { name: 'Rashed', image: rashedLogo },
    { name: 'MSS', image: logo },
  ];

  // Duplicate logos 3 times for seamless infinite scroll (3 × 3 = 9 total)
  const duplicatedPartnerLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  // Preload partner logos for faster display
  useEffect(() => {
    partnerLogos.forEach((logo) => {
      if (logo.image) {
        const img = new Image();
        img.src = logo.image;
      }
    });
  }, []);

  // Handle video loading and seamless transition from image to video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoReady(true);
      // Small delay to ensure smooth transition
      setTimeout(() => {
        setShowVideo(true);
        video.play().catch((error) => {
          console.error('Error playing video:', error);
        });
      }, 100);
    };

    const handleLoadedData = () => {
      setVideoReady(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);

    // Preload video
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  // Infinite scrolling carousel using requestAnimationFrame
  useEffect(() => {
    const track = logosTrackRef.current;
    if (!track) return;

    let animationId = null;
    let position = 0;
    let setWidth = 0;
    let lastTime = performance.now();
    
    // Calculate scroll speed based on screen size
    // Slower on laptop screens (992px - 1400px)
    const getScrollSpeed = () => {
      const width = window.innerWidth;
      // Laptop screens: much slower speed
      if (width >= 992 && width <= 1400) {
        return 0.025; // Much slower for laptop screens
      }
      // Default speed for other screens
      return 0.1;
    };
    
    let scrollSpeed = getScrollSpeed();
    
    // Update speed on window resize
    const handleResize = () => {
      scrollSpeed = getScrollSpeed();
    };
    window.addEventListener('resize', handleResize);
    
    // Calculate number of sets dynamically based on duplicated logos
    const numSets = duplicatedPartnerLogos.length / partnerLogos.length;

    // Calculate the width of one set accurately
    const calculateSetWidth = () => {
      // Wait for track to have content
      if (!track.children || track.children.length === 0) return false;
      
      // Get the total scroll width (includes all duplicated sets)
      const totalWidth = track.scrollWidth;
      
      // Ensure we have a valid width
      if (totalWidth <= 0) return false;
      
      // Divide by number of sets to get width of one set
      // This works because we have identical duplicated sets
      setWidth = totalWidth / numSets;
      
      // Verify the calculation is reasonable
      if (setWidth <= 0 || !isFinite(setWidth)) return false;
      
      return true;
    };

    // Ensure no CSS animation is interfering
    track.style.animation = 'none';
    track.style.transform = 'translateX(0px)';
    track.style.willChange = 'transform';

    const animate = (currentTime) => {
      // Calculate set width if not already calculated
      if (!setWidth) {
        if (!calculateSetWidth()) {
          animationId = requestAnimationFrame(animate);
          return;
        }
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Skip if deltaTime is too large (tab was inactive)
      if (deltaTime > 100) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      // Move left (negative direction) - logos scroll from right to left
      position -= scrollSpeed * deltaTime;

      // Seamless infinite loop: continuously wrap position
      // Keep position in range [-setWidth, 0) for seamless scrolling
      // The while loop ensures we handle any overshoot smoothly
      while (position <= -setWidth) {
        position += setWidth;
      }

      // Apply transform with hardware acceleration
      // translate3d uses GPU acceleration for smoother rendering
      // This prevents stutter and layout recalculation
      track.style.transform = `translate3d(${position}px, 0, 0)`;
      animationId = requestAnimationFrame(animate);
    };

    // Start animation after ensuring DOM is ready
    const startAnimation = () => {
      // Force a reflow to ensure layout is calculated
      void track.offsetHeight;
      
      if (calculateSetWidth()) {
        // Reset position to 0 to start fresh
        position = 0;
        track.style.transform = 'translateX(0px)';
        lastTime = performance.now();
        animationId = requestAnimationFrame(animate);
      } else {
        // Retry if layout not ready
        requestAnimationFrame(startAnimation);
      }
    };

    // Wait for images to load and DOM to be fully rendered
    const timeoutId = setTimeout(() => {
      startAnimation();
    }, 300);

    // Also try to start when window loads
    const handleLoad = () => {
      if (!setWidth) {
        startAnimation();
      }
    };
    window.addEventListener('load', handleLoad);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [partnerLogos, duplicatedPartnerLogos.length]); // Re-run if logos change

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    setNavExpanded(false);

    // Use native scrollIntoView with CSS scroll-behavior: smooth
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
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

  return (
    <section id="hero" className={`hero-section ${isLoaded ? 'loaded' : ''}`}>
      <Navbar expand="lg" className="hero-navbar" expanded={navExpanded} onToggle={setNavExpanded}>
        <Container fluid>
          <Navbar.Brand href="#" className="navbar-brand-custom">
            <img 
              src={logo} 
              alt="MSS Agency" 
              className="navbar-logo"
              loading="eager"
              fetchPriority="high"
            />
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
        {/* Hero Image - shown first, then hidden when video is ready */}
        <img 
          src={heroImage} 
          alt="Hero" 
          className={`hero-image ${showVideo ? 'hero-image-hidden' : ''}`}
          loading="eager"
          fetchPriority="high"
        />
        
        {/* Hero Video - shown after image */}
        <video 
          ref={videoRef}
          className={`hero-video ${showVideo ? 'hero-video-visible' : ''}`}
          muted 
          playsInline
          preload="auto"
          onTimeUpdate={() => {
            const video = videoRef.current;
            if (!video) return;

            const freezeThreshold = 0.07; // 50ms before end
            if (video.currentTime >= video.duration - freezeThreshold) {
              video.pause();
              video.currentTime = video.duration - freezeThreshold;
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
        Your Growth<span className="highlight-blue"> Partners </span>
        </h1>
        <h1 className="hero-title hero-title-second">
          <span className="highlight-blue"> </span> 
        </h1>
      </div>

      <div className="trusted-worldwide-section">
        <div className="trusted-text">Our<div> Partners</div></div>
        <div className="partner-logos-container">
          <div className="partner-logos-track" ref={logosTrackRef}>
            {duplicatedPartnerLogos.map((logo, index) => {
              const originalIndex = index % partnerLogos.length;
              const originalLogo = partnerLogos[originalIndex];
              return (
                <div key={`partner-${index}`} className={`partner-logo ${originalLogo.name === 'MSS' || originalLogo.name === 'Rashed' || originalLogo.name === 'Orbet' ? 'partner-logo-with-text' : ''} ${originalLogo.name === 'Orbet' ? 'partner-logo-orbet' : ''}`}>
                  <img 
                    src={logo.image} 
                    alt={originalLogo.name}
                    loading={index < 3 ? "eager" : "lazy"}
                  />
                  {originalLogo.name === 'MSS' && <span className="partner-logo-text">MSS Team</span>}
                  {originalLogo.name === 'Rashed' && <span className="partner-logo-text">Rashed Courses</span>}
                  {originalLogo.name === 'Orbet' && <span className="partner-logo-text">Orbit Production</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;