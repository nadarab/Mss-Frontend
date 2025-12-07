import React, { useRef, useState, useEffect } from 'react';
import './AboutAndTeam.css';
import aboutUsChar from '../../../assets/images/design/AboutUsChar.png';
import charHazem from '../../../assets/images/common/charHazem.PNG';

const managementTeam = [
  {
    id: 1,
    name: 'Rashed Rababah',
    position: 'Company Owner',
    image: charHazem
  },
  {
    id: 2,
    name: 'Hazem Al Zubi',
    position: 'Company Owner',
    image: charHazem
  }
];

const allTeamMembers = [
  {
    id: 3,
    name: 'Zaid Al-Abbadi',
    position: 'Photographer',
    image: charHazem
  },
  {
    id: 4,
    name: 'Sameer Mashagbeh',
    position: 'Photographer',
    image: charHazem
  },
  {
    id: 5,
    name: 'Sanad Al-Abbadi',
    position: 'Photographer',
    image: charHazem
  },
  {
    id: 6,
    name: 'Faisal Asaad',
    position: 'Manager',
    image: charHazem
  },
  {
    id: 7,
    name: 'Yousef Sungur',
    position: 'Assistant Manager',
    image: charHazem
  },
  {
    id: 8,
    name: 'Sara Rababah',
    position: 'Team Leader',
    image: charHazem
  },
  {
    id: 9,
    name: 'Diana Aswad',
    position: 'Account Manager',
    image: charHazem
  },
  {
    id: 10,
    name: 'Aya AL-hamaidah',
    position: 'Account Manager',
    image: charHazem
  },
  {
    id: 11,
    name: 'Ghaedaa AL-Faqeeh',
    position: 'Account Manager',
    image: charHazem
  },
  {
    id: 12,
    name: 'Reem Rababah',
    position: 'Branding & Graphic Designer',
    image: charHazem
  },
  {
    id: 13,
    name: 'Ahmad Alzubi',
    position: 'Developer',
    image: charHazem
  },
  {
    id: 14,
    name: 'Nada Rababah',
    position: 'Developer',
    image: charHazem
  }
];

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
  const membersPerPage = 4;
  const totalPages = Math.ceil(allTeamMembers.length / membersPerPage);

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

  return (
    <section id="about-and-team" className="about-team-section" ref={sectionRef}>
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
          <div className="team-subsection">
            <h2 
              ref={(el) => (titleRefs.current[0] = el)}
              className="team-subsection-title"
            >
              The Minds Who Started It All
            </h2>
            <div className="team-row management-row">
              {managementTeam.map((member, index) => (
                <TeamMember 
                  key={member.id} 
                  member={member} 
                  size="large" 
                  index={index}
                  animateDirection={index === 0 ? 'slide-left' : 'slide-right'}
                />
              ))}
            </div>
          </div>

          <div className="team-subsection">
            <div className="team-subsection-header">
              <h2 
                ref={(el) => (titleRefs.current[1] = el)}
                className="team-subsection-title"
              >
                The Talent Behind Our Work
              </h2>
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
            </div>
            
            <div className="team-carousel-wrapper">
              <div className="team-row-scrollable" ref={scrollContainerRef}>
                <div className="team-scroll-container">
                  {allTeamMembers.map((member, index) => (
                    <TeamMember 
                      key={member.id} 
                      member={member} 
                      size="small" 
                      index={index}
                      animateDirection="fade-up"
                    />
                  ))}
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
