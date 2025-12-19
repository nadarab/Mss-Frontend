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
  const observerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add animate-in class immediately for elements that are already visible
    // This avoids needing IntersectionObserver for initial render
    const addInitialAnimations = () => {
      try {
        if (sectionRef.current) {
          sectionRef.current.classList.add('animate-in');
          setIsVisible(true);
        }
        if (mapRef.current) mapRef.current.classList.add('animate-in');
        if (footerRef.current) footerRef.current.classList.add('animate-in');
        if (headerRef.current) headerRef.current.classList.add('animate-in');
        cardRefs.current.forEach((card) => {
          if (card) card.classList.add('animate-in');
        });
      } catch (error) {
        // Ignore errors
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(addInitialAnimations, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section id="contact" ref={sectionRef} className="contact-section">
      <div className="container">
        <div ref={headerRef} className="section-header">
          <p className="section-eyebrow">CONTACT US</p>
          <h2 className="section-headline">Have a question, idea, or project?</h2>
          <p className="section-subtitle">Reach out and let&apos;s make it happen.</p>
        </div>

        <div className="contact-layout">
          <div 
            ref={mapRef}
            className="map-card grid-map" 
            aria-label="Map - Jezan St., Amman 11185"
          >
            <img src={contactUsMap} alt="Map showing Amman, Jordan" loading="lazy" />
          </div>

          {/* Desktop Layout - Grid Areas */}
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
              <p className="contact-info"> info@mssteam.com</p>
            </div>
          </a>

          <a 
            ref={(el) => (cardRefs.current[2] = el)}
            href="https://maps.app.goo.gl/NgTsHuMAAkEf2ipF9?g_st=ic"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card grid-location"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="contact-icon">
              <img src={locationIcon} alt="Location" className="contact-icon-img" />
            </div>
            <div>
              <h5 className="contact-title">Location</h5>
              <p className="contact-info">Jezan St., Amman 11185</p>
            </div>
          </a>

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

          {/* Mobile & Tablet Layout - 2x2 Grid */}
          <div className="contact-cards-mobile">
            <a 
              ref={(el) => (cardRefs.current[4] = el)}
              href="https://maps.app.goo.gl/NgTsHuMAAkEf2ipF9?g_st=ic"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card mobile-card"
              style={{ animationDelay: '0.1s' }}
            >
              <div className="contact-icon">
                <img src={locationIcon} alt="Location" className="contact-icon-img" />
              </div>
              <div>
                <h5 className="contact-title">Location</h5>
                <p className="contact-info">Jezan St., Amman 11185</p>
              </div>
            </a>

            <a 
              ref={(el) => (cardRefs.current[5] = el)}
              href="tel:+962776684015" 
              className="contact-card mobile-card"
              style={{ animationDelay: '0.2s' }}
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
              ref={(el) => (cardRefs.current[6] = el)}
              href="mailto:info@mssteam.com"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card mobile-card"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="contact-icon">
                <img src={emailIcon} alt="Email" className="contact-icon-img" />
              </div>
              <div>
                <h5 className="contact-title">Email</h5>
                <p className="contact-info">info@mssteam.com</p>
              </div>
            </a>

            <a
              ref={(el) => (cardRefs.current[7] = el)}
              href="https://www.instagram.com/mss.team1"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card mobile-card"
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
 
