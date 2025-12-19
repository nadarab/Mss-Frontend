import React, { useState, useEffect, useRef } from 'react';
import './Services.css';
import socialMediaCardImage from '../../../assets/images/serviceSection/socialMediaCard.png';
import marketingCardImage from '../../../assets/images/serviceSection/Markiting Card.png';
import seoCardImage from '../../../assets/images/serviceSection/SEO card.png';
import brandingCardImage from '../../../assets/images/serviceSection/BrandingCard.png';
import webCardImage from '../../../assets/images/serviceSection/webCard.png';

const services = [
  {
    id: 'social-media',
    title: 'Digital Marketing',
    description: 'Solutions tailored to give you a competitive edge and keep your brand always at the forefront.',
    image: socialMediaCardImage,
    slideDirection: 'left',
  },
  {
    id: 'seo',
    title: 'SEO',
    description: 'Rank higher. Get found. Achieve long-term growth with advanced digital marketing.',
    image: seoCardImage,
    slideDirection: 'left',
  },
  {
    id: 'branding',
    title: 'Branding & Identity',
    description: 'Stand out. Be bold. Craft a clear and unforgettable brand identity.',
    image: brandingCardImage,
    slideDirection: 'bottom',
  },
  {
    id: 'marketing-strategies',
    title: 'Marketing Strategies',
    description: 'Smart, customized strategies that drive measurable results and move you closer to your most ambitious business goals.',
    image: marketingCardImage,
    slideDirection: 'right',
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Building robust, scalable, and cutting-edge web applications with superior stability and best industry practices.',
    image: webCardImage,
    slideDirection: 'right',
  },
];

function Services() {
  const [visibleCards, setVisibleCards] = useState(new Set());
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const sectionRef = useRef(null);
  const cardRefs = useRef({});

  useEffect(() => {
    // Observer for header
    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHeaderVisible(true);
            headerObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observer for individual cards
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardId = entry.target.dataset.cardId;
            if (cardId) {
              setVisibleCards((prev) => new Set([...prev, cardId]));
              cardObserver.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe header
    if (sectionRef.current) {
      const headerElement = sectionRef.current.querySelector('.services-header');
      if (headerElement) {
        headerObserver.observe(headerElement);
      }
    }

    // Observe all cards
    Object.values(cardRefs.current).forEach((cardRef) => {
      if (cardRef) {
        cardObserver.observe(cardRef);
      }
    });

    return () => {
      // Safely disconnect observers instead of unobserve
      try {
        headerObserver.disconnect();
        cardObserver.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
    };
  }, []);

  return (
    <section id="services" ref={sectionRef} className="services-section">
      <div className={`services-header ${isHeaderVisible ? 'animate-header' : ''}`}>
        <p className="services-label">Our Services</p>
        <h1 className="services-title">Smart Solutions That Keep You Ahead</h1>
        <p className="services-subtitle">
        We craft smart, creative solutions that guarantee measurable growth.
        </p>
      </div>

      <div className="services-container">
        {services.map((service, index) => {
          const isCardVisible = visibleCards.has(service.id);
          return (
            <div
              key={service.id}
              ref={(el) => (cardRefs.current[service.id] = el)}
              data-card-id={service.id}
              className={`service-card ${service.id}-card ${
                isCardVisible ? `animate-${service.slideDirection}` : ''
              }`}
            >
              <div className="service-card-background">
                <img src={service.image} alt={service.title} className="service-character" />
              </div>
              <div className="service-card-content">
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-description">
                  {service.description}
                  {service.description2 && (
                    <>
                      <br />
                      {service.description2}
                    </>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Services;
