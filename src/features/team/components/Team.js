import React, { useRef, useState, useEffect } from 'react';
import './Team.css';
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
    name: 'Hazem Alzubi',
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

function Team() {
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const titleRefs = useRef([]);
  const [currentPage, setCurrentPage] = useState(1);
  const membersPerPage = 4;
  const totalPages = Math.ceil(allTeamMembers.length / membersPerPage);

  const scrollLeft = () => {
    if (scrollContainerRef.current && currentPage > 1) {
      const cardWidth = 220; // width + gap
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
      const cardWidth = 220; // width + gap
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

    titleRefs.current.forEach((title) => {
      if (title) observer.observe(title);
    });

    return () => {
      titleRefs.current.forEach((title) => {
        if (title) observer.unobserve(title);
      });
    };
  }, []);

  return (
    <section id="team" ref={sectionRef} className="team-section">
      <div className="container">
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
    </section>
  );
}

export default Team;
