import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './BrandingGallery.css';
import logo from '../../../../assets/images/common/logoMSS.PNG';
import { brandingProjectService } from '../../../../firebase/collections';
import ContactUs from '../../../contact/components/ContactUs';

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

  // Branding items from Firestore
  const [brandingItems, setBrandingItems] = useState([]);

  // Items per page for "Explore Other Projects" (responsive)
  const [itemsPerPage, setItemsPerPage] = useState(6);
  
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

  // Handle thumbnail carousel navigation
  const handleThumbnailPrev = () => {
    const currentItem = brandingItems[currentItemIndex];
    if (currentItem && currentItem.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? currentItem.images.length - 1 : prev - 1
      );
    }
  };

  const handleThumbnailNext = () => {
    const currentItem = brandingItems[currentItemIndex];
    if (currentItem && currentItem.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === currentItem.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

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
    // Scroll to showcase section
    const showcaseSection = document.getElementById('branding-showcase');
    if (showcaseSection) {
      showcaseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Get current branding item
  const currentItem = brandingItems[currentItemIndex] || brandingItems[0];
  
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
        <span className="breadcrumb-current">Branding & Identity</span>
      </div>

      {/* Hero Section */}
      <div className="branding-hero-section">
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
          <div className="branding-showcase-header">
            <h2 className="branding-showcase-title">Branding & Identity Work Showcase</h2>
            <p className="branding-showcase-subtitle">Discover more of our creative work across different disciplines.</p>
          </div>

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
              {/* Main Showcase Card */}
              <div className="branding-showcase-card">
            {/* Large Main Image - Full Width */}
            {currentItem && currentItem.images && currentItem.images.length > 0 && (
              <div className="branding-main-image">
                <img 
                  src={currentItem.images[currentImageIndex]} 
                  alt={currentItem.projectName}
                />
                
                {/* Project Name Overlay - Top Left */}
                <div className="branding-project-name-overlay">
                  <h3 className="branding-project-name">{currentItem?.projectName || 'Project Name'}</h3>
                  <p className="branding-project-description">{currentItem?.shortDescription || 'Short Description'}</p>
                </div>

                {/* Thumbnail Carousel - Bottom Left */}
                {currentItem.images.length > 0 && (
                  <div className="branding-thumbnail-carousel">
                    <button 
                      className="branding-carousel-btn branding-carousel-btn-prev"
                      onClick={handleThumbnailPrev}
                      aria-label="Previous image"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    
                    <div className="branding-thumbnail-indicator">
                      {currentImageIndex + 1}/{currentItem.images.length}
                    </div>

                    <div className="branding-thumbnails-container">
                      {currentItem.images.map((image, index) => (
                        <div
                          key={index}
                          className={`branding-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => handleThumbnailClick(index)}
                        >
                          <img src={image} alt={`Thumbnail ${index + 1}`} />
                        </div>
                      ))}
                    </div>

                    <button 
                      className="branding-carousel-btn branding-carousel-btn-next"
                      onClick={handleThumbnailNext}
                      aria-label="Next image"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Explore Other Projects Section */}
          <div className="branding-explore-section">
            <h3 className="branding-explore-title">Explore Other Projects</h3>
            
            <div className="branding-explore-container">
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

              {totalPages > 1 && (
                <div className="branding-explore-pagination">
                  <div className="branding-explore-page-indicator">
                    {explorePage}/{totalPages}
                  </div>
                  <button 
                    className="branding-explore-btn branding-explore-btn-prev"
                    onClick={handleExplorePrev}
                    aria-label="Previous page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button 
                    className="branding-explore-btn branding-explore-btn-next"
                    onClick={handleExploreNext}
                    aria-label="Next page"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
            </>
          )}
        </div>
      </section>

      {/* Contact Us Section */}
      <ContactUs />
    </section>
  );
}

export default BrandingGallery;