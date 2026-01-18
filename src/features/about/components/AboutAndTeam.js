import React, { useRef, useState, useEffect } from 'react';
import './AboutAndTeam.css';
import aboutUsChar from '../../../assets/images/AboutUs/AboutUsChar.png';
import { employeeService } from '../../../firebase/collections';

function TeamMember({ member, size, index, animateDirection }) {
  const memberRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (memberRef.current) {
      observer.observe(memberRef.current);
    }

    return () => {
      // Safely disconnect observer instead of unobserve
      try {
        observer.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
    };
  }, []);

  return (
    <div 
      ref={memberRef}
      className={`team-member ${size} ${isVisible ? `animate-${animateDirection || 'fade-up'}` : ''}`}
      style={isVisible ? { animationDelay: `${index * 0.1}s` } : {}}
    >
      <div className="team-card">
        <div className="team-image">
          <img src={member.image} alt={member.name} />
        </div>
        <div className="team-card-content">
          <h5 className="team-name">{member.name}</h5>
          <p className="team-role">{member.position}</p>
        </div>
      </div>
    </div>
  );
}

function AboutAndTeam() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const titleRefs = useRef([]);
  const scrollTimeoutRef = useRef(null);
  const pageMarkersRef = useRef([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [managementTeam, setManagementTeam] = useState([]);
  const [allTeamMembers, setAllTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [membersPerPage, setMembersPerPage] = useState(4);
  const [isScrolling, setIsScrolling] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const totalPages = Math.ceil(allTeamMembers.length / membersPerPage);

  // Load employees from Firestore
  useEffect(() => {
    loadEmployees();
  }, []);

  // Calculate how many members can fit in the visible container
  const calculateMembersPerPage = () => {
    if (!scrollContainerRef.current) return 4;
    
    const containerWidth = scrollContainerRef.current.clientWidth;
    const { cardWidth, gap } = getCardDimensions();
    
    // Calculate how many full cards fit in the container
    const membersVisible = Math.floor(containerWidth / (cardWidth + gap));
    
    // Return at least 1, but typically 2-6 depending on screen size
    return Math.max(1, membersVisible);
  };

  // Check if we can scroll in each direction based on actual scroll position
  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    // Can scroll left if we're not at the very beginning
    setCanScrollLeft(scrollLeft > 1); // 1px threshold to account for rounding
    
    // Can scroll right if we haven't reached the end
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Calculate current page based on scroll position
  const calculateCurrentPage = () => {
    if (!scrollContainerRef.current) return 1;
    
    const { cardWidth, gap } = getCardDimensions();
    const scrollLeft = scrollContainerRef.current.scrollLeft;
    const itemWidth = cardWidth + gap;
    const currentMembersPerPage = calculateMembersPerPage();
    
    // Calculate the width of one full page
    const pageWidth = itemWidth * currentMembersPerPage;
    
    // Calculate page based on scroll position with a small threshold
    // If scrolled more than 10% of a page width past a boundary, we're on the next page
    const scrolledPages = scrollLeft / pageWidth;
    const pageNumber = Math.floor(scrolledPages) + 1;
    
    // Ensure it's within valid range
    return Math.max(1, Math.min(pageNumber, totalPages));
  };

  // Intersection Observer to detect which page is visible
  useEffect(() => {
    if (!scrollContainerRef.current || allTeamMembers.length === 0) return;

    const options = {
      root: scrollContainerRef.current,
      threshold: 0.5, // Page marker needs to be 50% visible
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNumber = parseInt(entry.target.dataset.page, 10);
          if (!isNaN(pageNumber)) {
            setCurrentPage(pageNumber);
          }
        }
      });
    }, options);

    // Observe all page markers
    pageMarkersRef.current.forEach((marker) => {
      if (marker) observer.observe(marker);
    });

    return () => {
      observer.disconnect();
    };
  }, [allTeamMembers.length, membersPerPage, loading]);

  // Handle manual scrolling (touch/drag)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Show that we're scrolling
      setIsScrolling(true);
      
      // Update scroll button states immediately
      updateScrollButtons();

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Set timeout to detect when scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        // Update button states when stopped
        updateScrollButtons();
      }, 150); // Wait 150ms after scroll stops
    };

    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial check
    updateScrollButtons();

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [totalPages, membersPerPage, allTeamMembers.length]);

  // Update members per page on mount and resize
  useEffect(() => {
    const updateMembersPerPage = () => {
      const newMembersPerPage = calculateMembersPerPage();
      if (newMembersPerPage > 0) {
        setMembersPerPage(prev => {
          if (prev !== newMembersPerPage) {
            // Reset to first page when members per page changes
            setCurrentPage(1);
            return newMembersPerPage;
          }
          return prev;
        });
      }
    };

    // Initial calculation after a short delay to ensure DOM is ready
    const timer = setTimeout(updateMembersPerPage, 100);

    const handleResize = () => {
      updateMembersPerPage();
      // Reset scroll position
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [loading, allTeamMembers.length]); // Run when loading completes or team size changes

  const loadEmployees = async () => {
    try {
      // Get all employees from Firestore
      const employees = await employeeService.getAll();

      // Sort employees: first by order field (if exists), then by createdAt (oldest first)
      const sortEmployees = (empList) => {
        return [...empList].sort((a, b) => {
          // If both have order field, sort by order
          if (a.order !== undefined && b.order !== undefined) {
            if (a.order !== b.order) {
              return a.order - b.order;
            }
          }
          // If only one has order, prioritize it
          if (a.order !== undefined && b.order === undefined) return -1;
          if (a.order === undefined && b.order !== undefined) return 1;
          
          // Otherwise, sort by createdAt (oldest first - first added appears first)
          const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
          const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
          return aTime - bTime;
        });
      };

      const owners = employees.filter(emp => {
        const roleLower = emp.role?.toLowerCase() || '';
        return roleLower === 'co-founder' || 
               roleLower === 'ceo & co-founder' ||
               roleLower.includes('co-founder');
               
      });
      
      const otherMembers = employees.filter(emp => {
        const roleLower = emp.role?.toLowerCase() || '';
        return roleLower !== 'co-founder' && 
               roleLower !== 'ceo & co-founder ' &&
               !roleLower.includes('co-founder');
      });

      // Sort both groups
      const sortedOwners = sortEmployees(owners);
      const sortedMembers = sortEmployees(otherMembers);

      // Map to the format expected by the component
      const formattedOwners = sortedOwners.map(emp => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        position: emp.role,
        image: emp.imageUrl 
      }));

      const formattedMembers = sortedMembers.map(emp => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        position: emp.role,
        image: emp.imageUrl 
      }));

      setManagementTeam(formattedOwners);
      setAllTeamMembers(formattedMembers);
    } catch (error) {
      console.error('Error loading employees:', error);
      // Set empty arrays on error
      setManagementTeam([]);
      setAllTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const getCardDimensions = () => {
    // Get actual card width and gap from the DOM or based on screen size
    const width = window.innerWidth;
    let cardWidth, gap;
    
    if (width <= 576) {
      // Small mobile
      cardWidth = 140;
      gap = 12;
    } else if (width <= 768) {
      // Mobile
      cardWidth = 160;
      gap = 15;
    } else if (width <= 992) {
      // Tablet
      cardWidth = 180;
      gap = 20;
    } else {
      // Desktop
      cardWidth = 200;
      gap = 20;
    }
    
    return { cardWidth, gap };
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current && canScrollLeft && currentPage > 1) {
      // Calculate target scroll position for previous page
      const { cardWidth, gap } = getCardDimensions();
      const itemWidth = cardWidth + gap;
      const targetPage = currentPage - 1;
      const targetScrollLeft = (targetPage - 1) * itemWidth * membersPerPage;
      
      scrollContainerRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
      
      // Update button states after scroll
      setTimeout(() => {
        updateScrollButtons();
      }, 100);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current && canScrollRight && currentPage < totalPages) {
      // Calculate target scroll position for next page
      const { cardWidth, gap } = getCardDimensions();
      const itemWidth = cardWidth + gap;
      const targetPage = currentPage + 1;
      const targetScrollLeft = (targetPage - 1) * itemWidth * membersPerPage;
      
      scrollContainerRef.current.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
      
      // Update button states after scroll
      setTimeout(() => {
        updateScrollButtons();
      }, 100);
    }
  };

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
        // Check if already visible
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          sectionRef.current.classList.add('animate-in');
        }
      }
      if (headerRef.current) {
        observer.observe(headerRef.current);
        const rect = headerRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          headerRef.current.classList.add('animate-in');
        }
      }

      titleRefs.current.forEach((title) => {
        if (title) {
          observer.observe(title);
          const rect = title.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            title.classList.add('animate-in');
          }
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      try {
        observer.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
    };
  }, [loading]);

  if (loading) {
    return (
      <section id="about" className="about-team-section" ref={sectionRef}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          color: '#fff',
          fontSize: '1.2rem'
        }}>
          Loading team...
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="about-team-section" ref={sectionRef}>
      <div className="about-team-container">
        {/* About Us Section */}
        <div className="about-section-content">
          <div className="about-layout">
            <div className="about-content">
              <div ref={headerRef} className="about-header">
                <p className="about-eyebrow">ABOUT US</p>
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

        {/* Team Section */}
        <div className="team-section-content">
          {/* Company Owners Section */}
          <div className="team-subsection">
            <h2 
              ref={(el) => (titleRefs.current[0] = el)}
              className="team-subsection-title"
            >
              The Minds Who Started It All
            </h2>
            <div className="team-row management-row">
              {managementTeam.length > 0 ? (
                managementTeam.map((member, index) => (
                  <TeamMember 
                    key={member.id} 
                    member={member} 
                    size="large" 
                    index={index}
                    animateDirection={index === 0 ? 'slide-left' : 'slide-right'}
                  />
                ))
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#aaa',
                  width: '100%'
                }}>
                  <p>No company owners added yet. Add them in the <a href="/admin" style={{ color: '#0066ff' }}>admin panel</a>.</p>
                </div>
              )}
            </div>
          </div>

          {/* Other Team Members Section */}
          <div className="team-subsection">
            <div className="team-subsection-header">
              <h2 
                ref={(el) => (titleRefs.current[1] = el)}
                className="team-subsection-title"
              >
                The Talent Behind Our Work
              </h2>
              {allTeamMembers.length > 0 && (
                <div className="team-pagination">
                  <button 
                    className="team-arrow team-arrow-left" 
                    onClick={scrollLeft}
                    aria-label="Previous page"
                    disabled={!canScrollLeft}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <span 
                    className="team-page-indicator" 
                    style={{ 
                      opacity: isScrolling ? 0 : 1,
                      transition: 'opacity 0.2s ease'
                    }}
                  >
                    {currentPage}/{totalPages}
                  </span>
                  <button 
                    className="team-arrow team-arrow-right" 
                    onClick={scrollRight}
                    aria-label="Next page"
                    disabled={!canScrollRight}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            <div className="team-carousel-wrapper">
              <div className="team-row-scrollable" ref={scrollContainerRef}>
                <div className="team-scroll-container">
                  {allTeamMembers.length > 0 ? (
                    allTeamMembers.map((member, index) => {
                      const pageNumber = Math.floor(index / membersPerPage) + 1;
                      const isFirstInPage = index % membersPerPage === 0;
                      
                      return (
                        <div
                          key={member.id}
                          ref={isFirstInPage ? (el) => (pageMarkersRef.current[pageNumber - 1] = el) : null}
                          data-page={isFirstInPage ? pageNumber : undefined}
                          className="team-member-wrapper"
                        >
                          <TeamMember 
                            member={member} 
                            size="small" 
                            index={index}
                            animateDirection="fade-up"
                          />
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '40px',
                      color: '#aaa',
                      width: '100%'
                    }}>
                      <p>No team members added yet. Add them in the <a href="/admin" style={{ color: '#0066ff' }}>admin panel</a>.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutAndTeam;
