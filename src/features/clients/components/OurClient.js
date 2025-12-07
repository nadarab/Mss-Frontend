import React, { useRef, useEffect } from 'react';
import './OurClient.css';

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
      if (sectionRef.current) observer.unobserve(sectionRef.current);
      if (headerRef.current) observer.unobserve(headerRef.current);
    };
  }, []);

  // Placeholder logos - 10 total (2 rows of 5)
  const clientLogos = Array(10).fill(null);

  return (
    <section id="clients" ref={sectionRef} className="clients-section">
      <div className="container">
        <div ref={headerRef} className="clients-header">
          <p className="clients-eyebrow">Our Clients</p>
          <h2 className="clients-title">Creating Impact Together</h2>
          <p className="clients-subtitle">
            Collaborating with forward-thinking companies to deliver creative, results-driven solutions that resonate.
          </p>
        </div>
        <div className="clients-grid">
          {clientLogos.map((_, index) => (
            <div key={index} className="client-logo">
              {/* Empty placeholder - logo will be added later */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurClient;
