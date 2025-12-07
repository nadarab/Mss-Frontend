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
    title: 'Social Media Management',
    description: 'Grow your audience. Drive engagement.Own every platform.',
    image: socialMediaCardImage,
    slideDirection: 'left',
  },
  {
    id: 'marketing-strategies',
    title: 'Marketing Strategies',
    description: 'Smart, customized strategies that drive measurable results and move you closer to your goals.',
    image: marketingCardImage,
    slideDirection: 'right',
  },
  {
    id: 'seo',
    title: 'SEO',
    description: 'Get found first. Rank higher. Drive real results.',
    image: seoCardImage,
    slideDirection: 'left',
  },
  {
    id: 'branding',
    title: 'Branding & Identity',
    description: 'Craft a brand that\'s unforgettable, bold, and unmistakably you',
    image: brandingCardImage,
    slideDirection: 'bottom',
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Building robust, scalable web applications with cutting-edge technologies and industry best practices.',
    image: webCardImage,
    slideDirection: 'right',
  },
];

function Services() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="services-section">
      <div className={`services-header ${isVisible ? 'animate-header' : ''}`}>
        <p className="services-label">Our Services</p>
        <h1 className="services-title">Services That Keep You Ahead</h1>
        <p className="services-subtitle">
          Smart, creative, and always on-trend solutions crafted for real audience impact.
        </p>
      </div>

      <div className="services-container">
        {services.map((service, index) => (
          <div
            key={service.id}
            className={`service-card ${service.id}-card ${
              isVisible ? `animate-${service.slideDirection}` : ''
            }`}
            style={{
              animationDelay: `${index * 0.15}s`,
            }}
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
        ))}
      </div>
    </section>
  );
}

export default Services;
