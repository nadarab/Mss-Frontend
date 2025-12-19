import React, { useRef, useEffect } from 'react';
import './OurClient.css';

// Import all client logos
import logo1 from '../../../assets/images/client/11.png';
import logo3 from '../../../assets/images/client/ch.bar.png';
import logo4 from '../../../assets/images/client/d7-2.png';
import logo5 from '../../../assets/images/client/golden.png';
import logo6 from '../../../assets/images/client/jca.png';
import logo7 from '../../../assets/images/client/luxe.png';
import logo8 from '../../../assets/images/client/rich.png';
import logo9 from '../../../assets/images/client/sa-sushi.png';
import logo10 from '../../../assets/images/client/waha.png';
import logo11 from '../../../assets/images/client/المهندس.png';
import logo12 from '../../../assets/images/client/امان.png';
import logo13 from '../../../assets/images/client/اونو.png';
import logo14 from '../../../assets/images/client/اويس.png';
import logo15 from '../../../assets/images/client/ايليت.png';
import logo16 from '../../../assets/images/client/بيروت.png';
import logo17 from '../../../assets/images/client/تفاصيل.png';
import logo18 from '../../../assets/images/client/حجيلان.png';
import logo19 from '../../../assets/images/client/حياة-زمان2.png';
import logo20 from '../../../assets/images/client/ستي.png';
import logo21 from '../../../assets/images/client/شمس.png';
import logo22 from '../../../assets/images/client/عاطف.png';
import logo23 from '../../../assets/images/client/فيكلينك.png';
import logo24 from '../../../assets/images/client/كسب.png';
import logo25 from '../../../assets/images/client/مود.png';
import logo26 from '../../../assets/images/client/ميت.png';
import logo27 from '../../../assets/images/client/ناحية.png';

function OurClient() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

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

    return () => {
      try {
        observer.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
    };
  }, []);

  // Major brand logos - First row
  const majorBrands = [
    logo8,  // rich.png
    logo12, // امان.png
    logo19, // حياة-زمان2.png
    logo21  // شمس.png
  ];

  // Other client logos - Second row
  const otherClients = [
    logo1, logo3, logo4, logo5, logo6, logo7, logo9, logo10,
    logo11, logo13, logo14, logo15, logo16, logo17, logo18, logo20,
    logo22, logo23, logo24, logo25, logo26, logo27
  ];

  // Logos that need to be smaller
  const smallerLogos = [logo4, logo10, logo11, logo15]; // d7-2, waha, المهندس, ايليت

  // Duplicate logos for seamless infinite scroll
  const duplicatedMajorBrands = [...majorBrands, ...majorBrands, ...majorBrands];
  const duplicatedOtherClients = [...otherClients, ...otherClients];

  return (
    <section id="clients" ref={sectionRef} className="clients-section">
      <div className="container">
        <div ref={headerRef} className="clients-header">
          <p className="clients-eyebrow">OUR CLIENTS</p>
          <h2 className="clients-title">We Grow Together</h2>
          <p className="clients-subtitle">
             Success is a collaboration. We partner with visionary brands to define their goals and achieve measurable, sustained digital growth.
          </p>
        </div>
        
        {/* Two scrolling bars - Major Brands and Other Clients */}
        <div className="clients-scroll-container">
          {/* First bar - Major Brands - moves left */}
          <div className="clients-scroll-bar clients-scroll-bar-left">
            <div className="clients-scroll-track">
              {duplicatedMajorBrands.map((logo, index) => {
                const originalIndex = index % majorBrands.length;
                const isSmaller = smallerLogos.includes(majorBrands[originalIndex]);
                return (
                  <div key={`major-${index}`} className={`client-logo-item ${isSmaller ? 'client-logo-small' : ''}`}>
                    <img src={logo} alt={`Major Brand ${index + 1}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Second bar - Other Clients - moves right */}
          <div className="clients-scroll-bar clients-scroll-bar-right">
            <div className="clients-scroll-track">
              {duplicatedOtherClients.map((logo, index) => {
                const originalIndex = index % otherClients.length;
                const isSmaller = smallerLogos.includes(otherClients[originalIndex]);
                return (
                  <div key={`other-${index}`} className={`client-logo-item ${isSmaller ? 'client-logo-small' : ''}`}>
                    <img src={logo} alt={`Client ${index + 1}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurClient;
