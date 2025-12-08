import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './BrandingGallery.css';
import logo from '../../../../assets/images/common/logoMSS.PNG';
import b1 from '../../../../assets/images/branding/Branding1.JPG';
import b2 from '../../../../assets/images/branding/Branding2.JPG';
import b3 from '../../../../assets/images/branding/Branding3.JPG';
import b4 from '../../../../assets/images/branding/Branding4.png';

// Constants
const NAVIGATION_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/#services', label: 'Our Services' },
  { path: '/#work', label: 'Our Work' },
  { path: '/#about', label: 'About Us' },
  { path: '/#contact', label: 'Contact Us' },
];

const PROJECTS = [
  {
    name: 'Project Name',
    description: 'Short Description',
    mainImage: b1,
    thumbnails: [b1, b2, b3],
  },
];

const EXPLORE_PROJECTS = [b1, b2, b3, b4, b1, b2];
const ITEMS_PER_PAGE = 6;
const SCROLL_OFFSET = 600;

const HERO_CONTENT = {
  category: 'Branding & Identity',
  title: 'Crafting identities that define who you are and what you stand for.',
  description: 'Short Description',
};

const BREADCRUMB_LABEL = 'Branding & Identity';

// SVG Icons Components
const HomeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

// Sub-components
const NavigationHeader = ({ navExpanded, onToggle }) => (
  <Navbar expand="lg" className="branding-header" expanded={navExpanded} onToggle={onToggle}>
    <Container fluid>
      <Navbar.Brand href="/" className="navbar-brand-custom">
        <img src={logo} alt="MSS Agency" className="navbar-logo" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ms-auto">
          {NAVIGATION_ITEMS.map((item) => (
            <Nav.Link key={item.path} as={Link} to={item.path}>
              {item.label}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

const Breadcrumbs = () => (
  <div className="branding-breadcrumbs">
    <Link to="/" className="breadcrumb-home-link">
      <HomeIcon className="breadcrumb-home-icon" />
    </Link>
    <ChevronRightIcon className="breadcrumb-separator" />
    <span>{BREADCRUMB_LABEL}</span>
  </div>
);

const HeroSection = ({ backgroundImage }) => (
  <section className="branding-hero-section">
    <img src={backgroundImage} alt="Hero Background" className="branding-hero-bg" />
    <div className="branding-hero-overlay-gradient" />
    <div className="branding-hero-content">
      <div className="branding-hero-overlay-box">
        <div className="branding-hero-category">{HERO_CONTENT.category}</div>
        <h1 className="branding-hero-title">{HERO_CONTENT.title}</h1>
        <p className="branding-hero-description">{HERO_CONTENT.description}</p>
      </div>
    </div>
  </section>
);

const CarouselControls = ({ onPrev, onNext, currentIndex, totalItems }) => (
  <div className="branding-carousel-controls">
    <button className="branding-carousel-arrow" onClick={onPrev} aria-label="Previous project">
      <ChevronLeftIcon />
    </button>
    <span className="branding-carousel-counter">
      {currentIndex + 1}/{totalItems}
    </span>
    <button className="branding-carousel-arrow" onClick={onNext} aria-label="Next project">
      <ChevronRightIcon />
    </button>
  </div>
);

const ThumbnailGallery = ({ thumbnails, onThumbnailClick }) => (
  <div className="branding-thumbnails">
    {thumbnails.map((thumb, index) => (
      <div
        key={index}
        className="branding-thumbnail"
        onClick={() => onThumbnailClick(thumb)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onThumbnailClick(thumb);
          }
        }}
        aria-label={`View thumbnail ${index + 1}`}
      >
        <img src={thumb} alt={`Thumbnail ${index + 1}`} />
      </div>
    ))}
  </div>
);

const ProjectShowcase = ({
  project,
  currentMainImage,
  currentIndex,
  totalProjects,
  onPrevProject,
  onNextProject,
  onThumbnailClick,
}) => (
  <div className="branding-project-card">
    <div className="branding-project-left">
      <div>
        <h3 className="branding-project-name">{project.name}</h3>
        <p className="branding-project-description">{project.description}</p>
      </div>

      <CarouselControls
        onPrev={onPrevProject}
        onNext={onNextProject}
        currentIndex={currentIndex}
        totalItems={totalProjects}
      />

      <ThumbnailGallery thumbnails={project.thumbnails} onThumbnailClick={onThumbnailClick} />
    </div>

    <div className="branding-project-right">
      <img src={currentMainImage} alt={project.name} className="branding-main-image" />
    </div>
  </div>
);

const ExploreSection = ({
  projects,
  currentIndex,
  totalPages,
  onPrev,
  onNext,
  galleryRef,
}) => (
  <section className="branding-explore-section">
    <div className="branding-explore-header">
      <h2 className="branding-explore-title">Explore Other Projects</h2>
      <div className="branding-explore-controls">
        <button className="branding-explore-arrow" onClick={onPrev} aria-label="Previous page">
          <ChevronLeftIcon />
        </button>
        <span className="branding-explore-counter">
          {currentIndex + 1}/{totalPages}
        </span>
        <button className="branding-explore-arrow" onClick={onNext} aria-label="Next page">
          <ChevronRightIcon />
        </button>
      </div>
    </div>

    <div className="branding-explore-gallery" ref={galleryRef}>
      {projects.map((project, index) => (
        <div key={index} className="branding-explore-item">
          <img src={project} alt={`Project ${index + 1}`} />
        </div>
      ))}
    </div>
  </section>
);

// Main Component
function BrandingGallery() {
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentExploreIndex, setCurrentExploreIndex] = useState(0);
  const [currentMainImage, setCurrentMainImage] = useState(PROJECTS[0].mainImage);
  const [navExpanded, setNavExpanded] = useState(false);
  const exploreGalleryRef = useRef(null);

  const currentProject = useMemo(() => PROJECTS[currentProjectIndex], [currentProjectIndex]);
  const totalExplorePages = useMemo(
    () => Math.ceil(EXPLORE_PROJECTS.length / ITEMS_PER_PAGE),
    []
  );

  useEffect(() => {
    setCurrentMainImage(currentProject.mainImage);
  }, [currentProject]);

  const handlePrevProject = useCallback(() => {
    setCurrentProjectIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  }, []);

  const handleNextProject = useCallback(() => {
    setCurrentProjectIndex((prev) => (prev + 1) % PROJECTS.length);
  }, []);

  const handlePrevExplore = useCallback(() => {
    if (exploreGalleryRef.current) {
      exploreGalleryRef.current.scrollBy({ left: -SCROLL_OFFSET, behavior: 'smooth' });
    }
    setCurrentExploreIndex((prev) => (prev - 1 + totalExplorePages) % totalExplorePages);
  }, [totalExplorePages]);

  const handleNextExplore = useCallback(() => {
    if (exploreGalleryRef.current) {
      exploreGalleryRef.current.scrollBy({ left: SCROLL_OFFSET, behavior: 'smooth' });
    }
    setCurrentExploreIndex((prev) => (prev + 1) % totalExplorePages);
  }, [totalExplorePages]);

  const handleThumbnailClick = useCallback((thumbnailImage) => {
    setCurrentMainImage(thumbnailImage);
  }, []);

  return (
    <div className="branding-gallery-page">
      <NavigationHeader navExpanded={navExpanded} onToggle={setNavExpanded} />
      <Breadcrumbs />

      <HeroSection backgroundImage={b1} />

      <section className="branding-showcase-section">
        <div className="branding-showcase-header">
          <h2 className="branding-showcase-title">Branding & Identity Work Showcase</h2>
          <p className="branding-showcase-subtitle">
            Discover more of our creative work across different disciplines.
          </p>
        </div>

        <ProjectShowcase
          project={currentProject}
          currentMainImage={currentMainImage}
          currentIndex={currentProjectIndex}
          totalProjects={PROJECTS.length}
          onPrevProject={handlePrevProject}
          onNextProject={handleNextProject}
          onThumbnailClick={handleThumbnailClick}
        />
      </section>

      <ExploreSection
        projects={EXPLORE_PROJECTS}
        currentIndex={currentExploreIndex}
        totalPages={totalExplorePages}
        onPrev={handlePrevExplore}
        onNext={handleNextExplore}
        galleryRef={exploreGalleryRef}
      />
    </div>
  );
}

export default BrandingGallery;

