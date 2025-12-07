import React, { useRef, useEffect, useState } from 'react';
import contactUsMap from '../../../assets/images/ContactUs/contactUsMap.png';
import phoneIcon from '../../../assets/images/ContactUs/phone.png';
import emailIcon from '../../../assets/images/ContactUs/Email.png';
import instaIcon from '../../../assets/images/ContactUs/insta.png';
import locationIcon from '../../../assets/images/ContactUs/Location.png';
import logo from '../../../assets/images/common/logoMSS.PNG';
import './ContactUs.css';

function ContactUs() {
  const sectionRef = useRef(null);
  const mapRef = useRef(null);
  const footerRef = useRef(null);
  const cardRefs = useRef([]);
  const headerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            if (entry.target === sectionRef.current) {
              setIsVisible(true);
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Observe section for header animation
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    // Observe map
    if (mapRef.current) {
      observer.observe(mapRef.current);
    }

    // Observe cards
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    // Observe footer
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    // Observe header
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      if (mapRef.current) observer.unobserve(mapRef.current);
      if (footerRef.current) observer.unobserve(footerRef.current);
      if (headerRef.current) observer.unobserve(headerRef.current);
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="container">
        <div ref={headerRef} className="section-header">
          <p className="section-eyebrow">Contact Us</p>
          <h2 className="section-headline">Have a question, idea, or project?</h2>
          <p className="section-subtitle">Reach out and let&apos;s make it happen.</p>
        </div>

        <div className="contact-layout">
          <div 
            ref={mapRef}
            className="map-card grid-map" 
            aria-label="Map - Amman, Jordan"
          >
            <img src={contactUsMap} alt="Map showing Amman, Jordan" loading="lazy" />
          </div>

          <a 
            ref={(el) => (cardRefs.current[0] = el)}
            href="tel:+962776684015" 
            className="contact-card grid-phone"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="contact-icon">
              <img src={phoneIcon} alt="Phone" className="contact-icon-img" />
            </div>
            <div>
              <h5 className="contact-title">Phone</h5>
              <p className="contact-info">+962 7 7668 4015</p>
            </div>
          </a>

          <a
            ref={(el) => (cardRefs.current[1] = el)}
            href="mailto:mss.hrteam@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card grid-email"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="contact-icon">
              <img src={emailIcon} alt="Email" className="contact-icon-img" />
            </div>
            <div>
              <h5 className="contact-title">Email</h5>
              <p className="contact-info">mss.hrteam@gmail.com</p>
            </div>
          </a>

          <div 
            ref={(el) => (cardRefs.current[2] = el)}
            className="contact-card grid-location"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="contact-icon">
              <img src={locationIcon} alt="Location" className="contact-icon-img" />
            </div>
            <div>
              <h5 className="contact-title">Location</h5>
              <p className="contact-info">Amman, Jordan</p>
            </div>
          </div>

          <a
            ref={(el) => (cardRefs.current[3] = el)}
            href="https://www.instagram.com/mss.team1"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card grid-instagram"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="contact-icon">
              <img src={instaIcon} alt="Instagram" className="contact-icon-img" />
            </div>
            <div>
              <h5 className="contact-title">Instagram</h5>
              <p className="contact-info">@mss.team1</p>
            </div>
          </a>
        </div>
      </div>
      
      <div ref={footerRef} className="contact-footer">
        <div className="contact-footer-container">
          <div className="contact-footer-logo">
            <img src={logo} alt="MSS" className="footer-logo-img" />
          </div>
          <div className="contact-footer-copyright">
            <p>&copy; 2025 MSS Team. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
 
