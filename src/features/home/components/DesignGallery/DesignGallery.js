import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './DesignGallery.css';
import { CenteredImageCarousel } from '../../../work/ui';
import { designProjectService } from '../../../../firebase/collections';
import logo from '../../../../assets/images/common/logoMSS.PNG';
import { smoothScrollTo } from '../../../../shared/utils/smoothScroll';
import ContactUs from '../../../contact';
// Static hero images for Design Gallery
import designHeroDesktop from '../../../../assets/images/Cover/lapDesign.png';
import designHeroMobile from '../../../../assets/images/Cover/phoneDesign.png';

function DesignGallery() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const sectionsRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [carouselIndices, setCarouselIndices] = useState({});
  const [heroData] = useState({
    label: 'Design',
    title: 'Turning ideas into cinematic stories that connect with your audience.',
    subtitle: 'Start your project'
  });

  // Load design projects from Firestore
  useEffect(() => {
    // Force scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    setIsLoaded(true);
    loadDesignProjectsFromFirestore();
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    e.stopPropagation();
    setNavExpanded(false);

    if (targetId === 'hero') {
      navigate('/');
      return;
    }

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      smoothScrollTo(targetElement, 80);
      return;
    }

    const scrollToTarget = (retries = 2) => {
      const element = document.getElementById(targetId);
      if (element) {
        smoothScrollTo(element, 80);
      } else if (retries > 0) {
        setTimeout(() => scrollToTarget(retries - 1), 10);
      }
    };
    
    scrollToTarget();
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
      
      // Preload first section's images for faster initial display
      if (sectionsData.length > 0 && sectionsData[0].images && sectionsData[0].images.length > 0) {
        // Preload first 3 images of the first section (center + adjacent)
        const imagesToPreload = sectionsData[0].images.slice(0, 3);
        imagesToPreload.forEach((imageUrl) => {
          if (imageUrl) {
            const img = new Image();
            img.src = imageUrl;
          }
        });
      }
    } catch (error) {
      console.error('Error loading design projects:', error);
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

  // Sync carousel indices with carousel dots using MutationObserver
  useEffect(() => {
    if (sections.length === 0) return;

    const observers = [];
    
    sections.forEach(section => {
      const carousel = document.querySelector(`#design-carousel-${section.id}`);
      if (carousel) {
        const dotsContainer = carousel.querySelector('.carousel-dots');
        if (dotsContainer) {
          const syncIndex = () => {
            const activeDot = dotsContainer.querySelector('.dot.active');
            if (activeDot) {
              const dots = dotsContainer.querySelectorAll('.dot');
              const activeIndex = Array.from(dots).indexOf(activeDot);
              if (activeIndex !== -1) {
                setCarouselIndices(prev => {
                  if (prev[section.id] !== activeIndex) {
                    return { ...prev, [section.id]: activeIndex };
                  }
                  return prev;
                });
              }
            }
          };

          // Initial sync
          syncIndex();

          // Watch for changes
          const observer = new MutationObserver(syncIndex);
          observer.observe(dotsContainer, {
            childList: true,
            attributes: true,
            attributeFilter: ['class'],
            subtree: true
          });
          observers.push(observer);
        }
      }
    });

    return () => {
      observers.forEach(obs => obs.disconnect());
    };
  }, [sections]);

  useEffect(() => {
    let observer = null;
    let mounted = true;

    const setupObserver = () => {
      if (!mounted) return;

      try {
        observer = new IntersectionObserver((entries) => {
          if (!mounted) return;
          
          entries.forEach(entry => {
            try {
              if (entry.isIntersecting && entry.target && entry.target.isConnected) {
                entry.target.classList.add('animate-in');
                entry.target.classList.remove('animate-out');
              } else if (entry.target && entry.target.isConnected) {
                const rect = entry.target.getBoundingClientRect();
                if (rect.bottom < 0) {
                  entry.target.classList.remove('animate-in');
                  entry.target.classList.add('animate-out');
                }
              }
            } catch (err) {
              // Ignore individual entry errors
            }
          });
        }, {
          threshold: 0.15,
          rootMargin: '0px 0px -50px 0px'
        });

        // Use refs instead of querySelectorAll
        if (sectionsRef.current && sectionsRef.current.isConnected) {
          const sections = sectionsRef.current.querySelectorAll('.video-section');
          sections.forEach(section => {
            if (section && section.isConnected && mounted) {
              try {
                observer.observe(section);
              } catch (err) {
                // Ignore observation errors
              }
            }
          });
        }
      } catch (error) {
        // If observer fails, continue without animations
      }
    };

    // Delay to ensure DOM is ready
    const timeoutId = setTimeout(setupObserver, 100);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      
      if (observer) {
        try {
          observer.disconnect();
        } catch (err) {
          // Ignore disconnect errors
        }
        observer = null;
      }
    };
  }, [sections]);

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
          Loading design projects...
        </div>
      </div>
    );
  }

  return (
    <div className="video-gallery-page">
      {/* Navbar - exactly like home page */}
      <Navbar expand="lg" className="gallery-navbar" expanded={navExpanded} onToggle={setNavExpanded}>
        <Container fluid>
          <Navbar.Brand href="/" className="navbar-brand-custom">
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
              <Nav.Link href="/" onClick={(e) => handleNavClick(e, 'hero')}>Home</Nav.Link>
              <Nav.Link href="/#services" onClick={(e) => handleNavClick(e, 'services')}>Our Services</Nav.Link>
              <Nav.Link href="/#work" onClick={(e) => handleNavClick(e, 'work')}>Our Work</Nav.Link>
              <Nav.Link href="/#about" onClick={(e) => handleNavClick(e, 'about')}>About Us</Nav.Link>
              <Nav.Link href="/#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact Us</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Breadcrumb */}
      <div className="gallery-breadcrumb">
        <button 
          onClick={() => navigate('/')}
          className="breadcrumb-link"
          type="button"
        >
          <svg className="breadcrumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">{heroData.label}</span>
      </div>

      {/* Hero Section */}
      <div 
        className="video-hero-section" 
        ref={heroRef}
      >
        <picture className="hero-background-image">
          <source media="(max-width: 768px)" srcSet={designHeroMobile} />
          <source media="(min-width: 769px)" srcSet={designHeroDesktop} />
          <img 
            src={designHeroDesktop} 
            alt="Design Gallery Hero" 
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        {/* Overlay Text Box */}
        <div className="video-hero-overlay-box">
          <div className="video-hero-content">
            <div className="video-hero-title-small">{heroData.label}</div>
            <div className="video-hero-text-main">{heroData.title}</div>
            <div className="video-hero-description">{heroData.subtitle}</div>
          </div>
        </div>
      </div>

       <div className="video-sections-container" ref={sectionsRef}>
         {sections.length === 0 ? (
           <div style={{ 
             textAlign: 'center', 
             padding: '100px 20px',
             color: '#fff'
           }}>
             <h2>No design projects yet</h2>
             <p>Add design projects in the admin panel at <a href="/admin" style={{ color: '#0066ff' }}>/admin</a></p>
           </div>
         ) : (
           <div className="video-sections-wrapper">
             {sections.map((section, index) => (
             <section 
               key={section.id}
               className={`video-section ${section.reverse ? 'reverse' : ''}`}
             >
               <div className="video-section-content-carousel">
                 <div className="video-text-content">
                   <span className="section-number">{String(index + 1).padStart(2, '0')}</span>
                   <h2>{section.title}</h2>
                   <p>{section.description}</p>
                 </div>

                 {section.images.length > 0 ? (
               <div className="section-carousel-wrapper">
                 <CenteredImageCarousel 
                   images={section.images} 
                   carouselId={`design-carousel-${section.id}`}
                 />
                 <div className="carousel-navigation-controls">
                   <button 
                     className="carousel-nav-btn carousel-nav-prev"
                     onClick={() => {
                       const carousel = document.querySelector(`#design-carousel-${section.id}`);
                       if (carousel) {
                         const prevBtn = carousel.querySelector('.carousel-arrow-left');
                         if (prevBtn) {
                           prevBtn.click();
                           // Update index after click
                           setTimeout(() => {
                             const currentIdx = carouselIndices[section.id] || 0;
                             const newIdx = (currentIdx - 1 + section.images.length) % section.images.length;
                             setCarouselIndices(prev => ({ ...prev, [section.id]: newIdx }));
                           }, 100);
                         }
                       }
                     }}
                     aria-label="Previous"
                   >
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M15 18l-6-6 6-6" />
                     </svg>
                   </button>
                   <span className="carousel-counter">
                     <span className="carousel-current">{(carouselIndices[section.id] ?? 0) + 1}</span>
                     <span className="carousel-separator">/</span>
                     <span className="carousel-total">{section.images.length}</span>
                   </span>
                   <button 
                     className="carousel-nav-btn carousel-nav-next"
                     onClick={() => {
                       const carousel = document.querySelector(`#design-carousel-${section.id}`);
                       if (carousel) {
                         const nextBtn = carousel.querySelector('.carousel-arrow-right');
                         if (nextBtn) {
                           nextBtn.click();
                           // Update index after click
                           setTimeout(() => {
                             const currentIdx = carouselIndices[section.id] || 0;
                             const newIdx = (currentIdx + 1) % section.images.length;
                             setCarouselIndices(prev => ({ ...prev, [section.id]: newIdx }));
                           }, 100);
                         }
                       }
                     }}
                     aria-label="Next"
                   >
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                       <path d="M9 18l6-6-6-6" />
                     </svg>
                   </button>
                 </div>
               </div>
                 ) : (
                   <div style={{ 
                     textAlign: 'center', 
                     padding: '40px',
                     color: '#aaa'
                   }}>
                     <p>No images in this category yet</p>
                   </div>
                 )}
               </div>
             </section>
             ))}
           </div>
         )}
       </div>

      <ContactUs />
    </div>
  );
}

export default DesignGallery;

