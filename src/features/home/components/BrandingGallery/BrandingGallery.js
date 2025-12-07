import React from 'react';
import { Link } from 'react-router-dom';
import { CoverflowSlider } from '../../../work/ui';
import '../../../../shared/styles/Gallery.css';
import b1 from '../../../../assets/images/branding/Branding1.JPG';
import b2 from '../../../../assets/images/branding/Branding2.JPG';
import b3 from '../../../../assets/images/branding/Branding3.JPG';
import b4 from '../../../../assets/images/branding/Branding4.png';

function BrandingGallery() {
  const brandingSlides = [
    { id: 'b1', image: b1, title: 'Logo Systems', description: 'Scalable logo systems with strong visual consistency.', buttonText: 'Read More', buttonAction: () => {} },
    { id: 'b2', image: b2, title: 'Brand Guidelines', description: 'Clear rules for typography, color, and usage.', buttonText: 'Read More', buttonAction: () => {} },
    { id: 'b3', image: b3, title: 'Identity Collateral', description: 'Business cards, letterheads, and stationery suites.', buttonText: 'Read More', buttonAction: () => {} },
    { id: 'b4', image: b4, title: 'Packaging Concepts', description: 'Memorable shelf presence through smart design.', buttonText: 'Read More', buttonAction: () => {} },
    { id: 'b5', image: b1, title: 'Visual Language', description: 'Iconography, patterns, and brand assets.', buttonText: 'Read More', buttonAction: () => {} },
    { id: 'b6', image: b2, title: 'Campaign Branding', description: 'Cohesive campaigns across platforms.', buttonText: 'Read More', buttonAction: () => {} },
    { id: 'b7', image: b3, title: 'Event Branding', description: 'Immersive on-site brand experiences.', buttonText: 'Read More', buttonAction: () => {} },
    { id: 'b8', image: b4, title: 'Digital Identity', description: 'Design systems for websites and apps.', buttonText: 'Read More', buttonAction: () => {} }
  ];

  return (
    <div className="design-gallery-page">
      <CoverflowSlider slides={brandingSlides} />

      <div className="gallery-content">
        <div className="section-header">
          <h2 className="section-title">Our Branding Portfolio</h2>
          <p className="section-subtitle">Explore strategic brand identity work</p>
        </div>
      </div>

      <div className="video-footer">
        <Link to="/" className="back-home-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default BrandingGallery;

