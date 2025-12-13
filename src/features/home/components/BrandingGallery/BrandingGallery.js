import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import './BrandingGallery.css';
import logo from '../../../../assets/images/common/logoMSS.PNG';
import { getDocument } from '../../../../firebase/firestoreService';
import ContactUs from '../../../contact/components/ContactUs';

function BrandingGallery() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [navExpanded, setNavExpanded] = useState(false);
  const [pageData, setPageData] = useState({
    desktopHeroImage: '',
    mobileHeroImage: '',
    title: 'Branding & Identity',
    mainText: 'Crafting identities that define who you are and what you stand for.',
    shortDescription: 'Short Description',
  });
  const navigate = useNavigate();

  // Main showcase state
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [explorePage, setExplorePage] = useState(1);

  // Placeholder branding items data (will be replaced with database data later)
  const [brandingItems, setBrandingItems] = useState([
    {
      id: 1,
      projectName: 'Project Name',
      shortDescription: 'Short Description',
      images: [
        'https://via.placeholder.com/800x600/cccccc/000000?text=Image+1',
        'https://via.placeholder.com/800x600/dddddd/000000?text=Image+2',
        'https://via.placeholder.com/800x600/eeeeee/000000?text=Image+3',
      ],
    },
    {
      id: 2,
      projectName: 'Project Name 2',
      shortDescription: 'Short Description 2',
      images: [
        'https://via.placeholder.com/800x600/cccccc/000000?text=Image+1',
        'https://via.placeholder.com/800x600/dddddd/000000?text=Image+2',
        'https://via.placeholder.com/800x600/eeeeee/000000?text=Image+3',
      ],
    },
    {
      id: 3,
      projectName: 'Project Name 3',
      shortDescription: 'Short Description 3',
      images: [
        'https://via.placeholder.com/800x600/cccccc/000000?text=Image+1',
        'https://via.placeholder.com/800x600/dddddd/000000?text=Image+2',
        'https://via.placeholder.com/800x600/eeeeee/000000?text=Image+3',
      ],
    },
    {
      id: 4,
      projectName: 'Project Name 4',
      shortDescription: 'Short Description 4',
      images: [
        'https://via.placeholder.com/800x600/cccccc/000000?text=Image+1',
        'https://via.placeholder.com/800x600/dddddd/000000?text=Image+2',
        'https://via.placeholder.com/800x600/eeeeee/000000?text=Image+3',
      ],
    },
    {
      id: 5,
      projectName: 'Project Name 5',
      shortDescription: 'Short Description 5',
      images: [
        'https://via.placeholder.com/800x600/cccccc/000000?text=Image+1',
        'https://via.placeholder.com/800x600/dddddd/000000?text=Image+2',
        'https://via.placeholder.com/800x600/eeeeee/000000?text=Image+3',
      ],
    },
    {
      id: 6,
      projectName: 'Project Name 6',
      shortDescription: 'Short Description 6',
      images: [
        'https://via.placeholder.com/800x600/cccccc/000000?text=Image+1',
        'https://via.placeholder.com/800x600/dddddd/000000?text=Image+2',
        'https://via.placeholder.com/800x600/eeeeee/000000?text=Image+3',
      ],
    },
  ]);

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

    // Fetch branding page data from Firestore
    const fetchPageData = async () => {
      try {
        // Try to fetch from 'branding_page' collection first
        // If it doesn't exist, use default values
        const data = await getDocument('branding_page', 'hero_section');
        if (data) {
          setPageData({
            desktopHeroImage: data.desktopHeroImage || '',
            mobileHeroImage: data.mobileHeroImage || '',
            title: data.title || 'Branding & Identity',
            mainText: data.mainText || 'Crafting identities that define who you are and what you stand for.',
            shortDescription: data.shortDescription || 'Short Description',
          });
        }
      } catch (error) {
        console.log('Branding page data not found in Firestore, using defaults');
      }
    };

    fetchPageData();
  }, []);

  const handleNavClick = (e, targetPath) => {
    e.preventDefault();
    setNavExpanded(false);

    if (targetPath === 'hero') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById('hero');
        if (element) {
          window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
      }, 100);
    } else if (targetPath.startsWith('/')) {
      navigate(targetPath);
    } else {
      navigate('/');
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
    navigate('/');
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
        <Link to="/" className="breadcrumb-link" onClick={handleHomeClick}>
          <svg className="breadcrumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </Link>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">Branding & Identity</span>
      </div>

      {/* Hero Section */}
      <div className="branding-hero-section">
        {/* Desktop Background Image */}
        <div className="branding-hero-bg branding-hero-bg-desktop">
          {pageData.desktopHeroImage && (
            <img src={pageData.desktopHeroImage} alt="Branding Hero Desktop" />
          )}
        </div>

        {/* Mobile Background Image */}
        <div className="branding-hero-bg branding-hero-bg-mobile">
          {pageData.mobileHeroImage && (
            <img src={pageData.mobileHeroImage} alt="Branding Hero Mobile" />
          )}
        </div>

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
        </div>
      </section>

      {/* Contact Us Section */}
      <ContactUs />
    </section>
  );
}

export default BrandingGallery;