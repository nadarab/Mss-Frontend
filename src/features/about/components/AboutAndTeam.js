import React, { useRef, useState, useEffect } from 'react';
import './AboutAndTeam.css';
import aboutUsChar from '../../../assets/images/design/AboutUsChar.png';
import charHazem from '../../../assets/images/common/charHazem.PNG';
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
      if (memberRef.current) {
        observer.unobserve(memberRef.current);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [managementTeam, setManagementTeam] = useState([]);
  const [allTeamMembers, setAllTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const membersPerPage = 4;
  const totalPages = Math.ceil(allTeamMembers.length / membersPerPage);

  // Load employees from Firestore
  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      // Get all employees from Firestore
      const employees = await employeeService.getAll();

      // Separate Company Owners from other employees
      const owners = employees.filter(emp => 
        emp.role.toLowerCase() === 'company owner'
      );
      
      const otherMembers = employees.filter(emp => 
        emp.role.toLowerCase() !== 'company owner'
      );

      // Map to the format expected by the component
      const formattedOwners = owners.map(emp => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        position: emp.role,
        image: emp.imageUrl || charHazem
      }));

      const formattedMembers = otherMembers.map(emp => ({
        id: emp.id,
        name: `${emp.firstName} ${emp.lastName}`,
        position: emp.role,
        image: emp.imageUrl || charHazem
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

  const scrollLeft = () => {
    if (scrollContainerRef.current && currentPage > 1) {
      const cardWidth = 220;
      const scrollAmount = cardWidth * membersPerPage;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
      setCurrentPage(currentPage - 1);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current && currentPage < totalPages) {
      const cardWidth = 220;
      const scrollAmount = cardWidth * membersPerPage;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
      setCurrentPage(currentPage + 1);
    }
  };

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

    titleRefs.current.forEach((title) => {
      if (title) observer.observe(title);
    });

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      if (headerRef.current) observer.unobserve(headerRef.current);
      titleRefs.current.forEach((title) => {
        if (title) observer.unobserve(title);
      });
    };
  }, []);

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
                    disabled={currentPage === 1}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <span className="team-page-indicator">{currentPage}/{totalPages}</span>
                  <button 
                    className="team-arrow team-arrow-right" 
                    onClick={scrollRight}
                    aria-label="Next page"
                    disabled={currentPage === totalPages}
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
                    allTeamMembers.map((member, index) => (
                      <TeamMember 
                        key={member.id} 
                        member={member} 
                        size="small" 
                        index={index}
                        animateDirection="fade-up"
                      />
                    ))
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
