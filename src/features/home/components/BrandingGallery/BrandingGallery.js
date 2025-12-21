import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './BrandingGallery.css';
import logo from '../../../../assets/images/common/logoMSS.PNG';
import { brandingProjectService } from '../../../../firebase/collections';
import ContactUs from '../../../contact/components/ContactUs';
// Static hero images for Branding Gallery
import brandingHeroDesktop from '../../../../assets/images/Cover/lapBranding.png';
import brandingHeroMobile from '../../../../assets/images/Cover/phoneBranding.png';

function BrandingGallery() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navExpanded, setNavExpanded] = useState(false);
  const [pageData] = useState({
    title: 'Branding & Identity',
    mainText: 'Crafting identities that define who you are and what you stand for.',
    shortDescription: 'Explore our branding projects',
  });
  const navigate = useNavigate();

  // Main showcase state
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [explorePage, setExplorePage] = useState(1);
  const [thumbnailStartOffset, setThumbnailStartOffset] = useState(0); // Starting index for visible thumbnails (scrolls one at a time)
  const [imageSelected, setImageSelected] = useState(true); // Track if an image has been clicked - default true to show first image
  const [imageTransitioning, setImageTransitioning] = useState(false); // Track image transition for smooth fade

  // Branding items from Firestore
  const [brandingItems, setBrandingItems] = useState([]);

  // Items per page for "Explore Other Projects" (responsive)
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
  // Scroll to top when component mounts
  useEffect(() => {
    // Force scroll to top when component mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(4); // 4 items for tablets and phones
      } else {
        setItemsPerPage(6); // 6 items for larger screens
      }
    };
    
    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);
  
  const totalPages = Math.ceil(brandingItems.length / itemsPerPage);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Fetch branding projects from Firestore
    const fetchBrandingProjects = async () => {
      try {
        const projects = await brandingProjectService.getAll();
        
        // Format projects for the component
        const formattedProjects = projects.map(project => ({
          id: project.id,
          projectName: project.title,
          shortDescription: project.description,
          images: project.images || []
        }));

        setBrandingItems(formattedProjects);
      } catch (error) {
        console.error('Error loading branding projects:', error);
        setBrandingItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandingProjects();
  }, []);

  const handleNavClick = (e, targetPath) => {
    e.preventDefault();
    setNavExpanded(false);

    if (targetPath === 'hero') {
      navigate('/', { replace: true });
      setTimeout(() => {
        const element = document.getElementById('hero');
        if (element) {
          window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
      }, 100);
    } else if (targetPath.startsWith('/')) {
      navigate(targetPath, { replace: true });
    } else {
      navigate('/', { replace: true });
      setTimeout(() => {
        const element = document.getElementById(targetPath);
        if (element) {
          window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate('/', { replace: true });
  };

  // Calculate thumbnail display
  const currentItem = brandingItems[currentItemIndex] || brandingItems[0];
  const thumbnailsPerPage = 3;
  const totalImages = currentItem && currentItem.images ? currentItem.images.length : 0;
  const maxStartOffset = Math.max(0, totalImages - thumbnailsPerPage);
  
  const thumbnailStartIndex = thumbnailStartOffset;
  const thumbnailEndIndex = thumbnailStartIndex + thumbnailsPerPage;
  const visibleThumbnails = currentItem && currentItem.images 
    ? currentItem.images.slice(thumbnailStartIndex, thumbnailEndIndex)
    : [];

  // Handle thumbnail navigation (scroll one image at a time)
  const handleThumbnailPagePrev = () => {
    // Smooth fade transition for image change
    setImageTransitioning(true);
    
    setThumbnailStartOffset((prev) => {
      let newOffset;
      if (prev === 0) {
        newOffset = maxStartOffset; // Wrap to end
      } else {
        newOffset = prev - 1;
      }
      
      // Update main image to show the first visible thumbnail (leftmost)
      setTimeout(() => {
        setCurrentImageIndex(newOffset);
        setImageSelected(true);
        setImageTransitioning(false);
      }, 200); // Fade duration
      
      return newOffset;
    });
  };

  const handleThumbnailPageNext = () => {
    // Smooth fade transition for image change
    setImageTransitioning(true);
    
    setThumbnailStartOffset((prev) => {
      let newOffset;
      if (prev >= maxStartOffset) {
        newOffset = 0; // Wrap to beginning
      } else {
        newOffset = prev + 1;
      }
      
      // Update main image to show the first visible thumbnail (leftmost)
      setTimeout(() => {
        setCurrentImageIndex(newOffset);
        setImageSelected(true);
        setImageTransitioning(false);
      }, 200); // Fade duration
      
      return newOffset;
    });
  };

  const handleThumbnailClick = (index) => {
    // Smooth fade transition for image change
    setImageTransitioning(true);
    
    setTimeout(() => {
      setCurrentImageIndex(index);
      setImageSelected(true); // Mark that an image has been selected
      setImageTransitioning(false);
    }, 200); // Fade duration
    
    // Check if the clicked thumbnail is the last one visible (rightmost)
    const localIndex = index - thumbnailStartIndex;
    const isLastVisible = localIndex === visibleThumbnails.length - 1;
    const isFirstVisible = localIndex === 0;
    
    // If it's the last visible thumbnail and there are more images to show, scroll forward by one
    if (isLastVisible && thumbnailStartIndex + thumbnailsPerPage < totalImages) {
      setTimeout(() => {
        setThumbnailStartOffset((prev) => prev + 1);
      }, 400); // Delay for smooth transition
    }
    
    // If it's the first visible thumbnail and there are previous images to show, scroll backward by one
    if (isFirstVisible && thumbnailStartIndex > 0) {
      setTimeout(() => {
        setThumbnailStartOffset((prev) => prev - 1);
      }, 400); // Delay for smooth transition
    }
  };

  // Reset thumbnail offset and image selection when item changes
  useEffect(() => {
    setThumbnailStartOffset(0);
    setImageSelected(true); // Show first image when switching projects
    setCurrentImageIndex(0);
  }, [currentItemIndex]);

  // Handle "Explore Other Projects" pagination
  const handleExplorePrev = () => {
    setExplorePage((prev) => (prev === 1 ? totalPages : prev - 1));
  };

  const handleExploreNext = () => {
    setExplorePage((prev) => (prev === totalPages ? 1 : prev + 1));
  };

  // Handle clicking on a project thumbnail in "Explore Other Projects"
  const handleProjectClick = (itemIndex) => {
    setCurrentItemIndex(itemIndex);
    setCurrentImageIndex(0);
    setImageSelected(true); // Show first image when changing project
    // Scroll to showcase section
    const showcaseSection = document.getElementById('branding-showcase');
    if (showcaseSection) {
      showcaseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  // Get items for current explore page
  const startIndex = (explorePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageItems = brandingItems.slice(startIndex, endIndex);

  return (
    <section className={`branding-page ${isLoaded ? 'loaded' : ''}`}>
      {/* Navbar */}
      <Navbar expand="lg" className="branding-navbar" expanded={navExpanded} onToggle={setNavExpanded}>
        <Container fluid>
          <Navbar.Brand href="/" className="navbar-brand-custom" onClick={handleHomeClick}>
            <img src={logo} alt="MSS Agency" className="navbar-logo" />
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
      <div className="branding-breadcrumb">
        <button 
          onClick={handleHomeClick}
          className="breadcrumb-link"
          type="button"
        >
          <svg className="breadcrumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">{pageData.title}</span>
      </div>

      {/* Hero Section */}
      <div 
        className="branding-hero-section"
      >
        <picture className="hero-background-image">
          <source media="(max-width: 768px)" srcSet={brandingHeroMobile} />
          <source media="(min-width: 769px)" srcSet={brandingHeroDesktop} />
          <img src={brandingHeroDesktop} alt="Branding Gallery Hero" />
        </picture>
        {/* Overlay Text Box */}
        <div className="branding-hero-overlay-box">
          <div className="branding-hero-content">
            <div className="branding-hero-title-small">{pageData.title}</div>
            <div className="branding-hero-text-main">{pageData.mainText}</div>
            <div className="branding-hero-description">{pageData.shortDescription}</div>
          </div>
        </div>
      </div>

      {/* Branding Work Showcase Section */}
      <section id="branding-showcase" className="branding-showcase-section">
        <div className="branding-showcase-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#fff' }}>
              <p>Loading projects...</p>
            </div>
          ) : brandingItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#fff' }}>
              <h3>No branding projects yet</h3>
              <p>Add branding projects in the <a href="/admin" style={{ color: '#0066ff' }}>admin panel</a></p>
            </div>
          ) : (
            <>
              {/* Combined Container with Shadow */}
              <div className="branding-unified-container">
                {/* Showcase Header */}
                <div className="branding-showcase-header">
                  <h2 className="branding-showcase-title">Branding & Identity Work Showcase</h2>
                  <p className="branding-showcase-subtitle">Discover more of our creative work across different disciplines.</p>
                </div>

                {/* Main Showcase Card */}
                <div className="branding-showcase-card">
                  {/* Large Main Image - Full Width */}
                  <div className="branding-main-image">
                    {currentItem && currentItem.images && currentItem.images.length > 0 && imageSelected && (
                      <img 
                        src={currentItem.images[currentImageIndex]} 
                        alt={`${currentItem.projectName} - Image ${currentImageIndex + 1}`}
                        className={imageTransitioning ? 'transitioning' : ''}
                      />
                    )}

                    {/* Project Name Overlay - Top Left of Image, No Background */}
                    {currentItem && (
                      <div className="branding-project-name-overlay">
                        <h3 className="branding-project-name">{currentItem?.projectName || 'Project Name'}</h3>
                      </div>
                    )}

                    {/* Thumbnail Carousel - Bottom Left on Desktop Only */}
                    {currentItem && currentItem.images && currentItem.images.length > 0 && (
                      <div className="branding-thumbnail-carousel branding-thumbnail-carousel-desktop">
                        {/* Indicator - Above Thumbnails, with White Border */}
                        <div className="branding-thumbnail-pagination">
                          <button 
                            className="branding-carousel-btn branding-carousel-btn-prev"
                            onClick={handleThumbnailPagePrev}
                            aria-label="Previous thumbnails"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M15 18l-6-6 6-6" />
                            </svg>
                          </button>
                          <div className="branding-thumbnail-indicator">
                            {currentImageIndex + 1}/{totalImages}
                          </div>
                          <button 
                            className="branding-carousel-btn branding-carousel-btn-next"
                            onClick={handleThumbnailPageNext}
                            aria-label="Next thumbnails"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </button>
                        </div>

                        {/* Thumbnails - Below Indicator */}
                        <div className="branding-thumbnails-container">
                          {visibleThumbnails.map((image, localIndex) => {
                            const globalIndex = thumbnailStartIndex + localIndex;
                            return (
                              <div
                                key={globalIndex}
                                className={`branding-thumbnail ${globalIndex === currentImageIndex ? 'active' : ''}`}
                                onClick={() => handleThumbnailClick(globalIndex)}
                              >
                                <img src={image} alt={`Thumbnail ${globalIndex + 1}`} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Carousel - Separate Container for Mobile/Tablet Only */}
                  {currentItem && currentItem.images && currentItem.images.length > 0 && (
                    <div className="branding-thumbnail-carousel branding-thumbnail-carousel-mobile">
                      {/* Indicator - Above Thumbnails, with White Border */}
                      <div className="branding-thumbnail-pagination">
                        <button 
                          className="branding-carousel-btn branding-carousel-btn-prev"
                          onClick={handleThumbnailPagePrev}
                          aria-label="Previous thumbnails"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <div className="branding-thumbnail-indicator">
                          {currentImageIndex + 1}/{totalImages}
                        </div>
                        <button 
                          className="branding-carousel-btn branding-carousel-btn-next"
                          onClick={handleThumbnailPageNext}
                          aria-label="Next thumbnails"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>

                      {/* Thumbnails - Below Indicator */}
                      <div className="branding-thumbnails-container">
                        {visibleThumbnails.map((image, localIndex) => {
                          const globalIndex = thumbnailStartIndex + localIndex;
                          return (
                            <div
                              key={globalIndex}
                              className={`branding-thumbnail ${globalIndex === currentImageIndex ? 'active' : ''}`}
                              onClick={() => handleThumbnailClick(globalIndex)}
                            >
                              <img src={image} alt={`Thumbnail ${globalIndex + 1}`} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Spring Separator Line */}
                <div className="branding-spring-separator"></div>

                {/* Explore Other Projects Section */}
                <div className="branding-explore-section">
                  <div className="branding-explore-header">
                    <h3 className="branding-explore-title">Explore Other Projects</h3>
                    
                    {totalPages > 1 && (
                      <div className="branding-explore-pagination">
                        <button 
                          className="branding-explore-btn branding-explore-btn-prev"
                          onClick={handleExplorePrev}
                          aria-label="Previous page"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.5">
                            <path d="M15 18l-6-6 6-6" />
                          </svg>
                        </button>
                        <div className="branding-explore-page-indicator">
                          {explorePage}/{totalPages}
                        </div>
                        <button 
                          className="branding-explore-btn branding-explore-btn-next"
                          onClick={handleExploreNext}
                          aria-label="Next page"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="#0066ff" strokeWidth="2.5">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="branding-explore-grid">
                    {currentPageItems.map((item, index) => {
                      const globalIndex = startIndex + index;
                      const thumbnailImage = item.images && item.images.length > 0 ? item.images[0] : '';
                      return (
                        <div
                          key={item.id}
                          className={`branding-explore-thumbnail ${globalIndex === currentItemIndex ? 'active' : ''}`}
                          onClick={() => handleProjectClick(globalIndex)}
                        >
                          {thumbnailImage && (
                            <img src={thumbnailImage} alt={item.projectName} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Us Section - Full Width */}
      <div className="branding-contact-wrapper">
        <ContactUs />
      </div>
    </section>

  );

}

export default BrandingGallery;