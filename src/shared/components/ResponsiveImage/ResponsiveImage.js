import React from 'react';
import './ResponsiveImage.css';

/**
 * ResponsiveImage component for displaying different images on mobile vs desktop
 * @param {string} desktopSrc - Image source for desktop/laptop
 * @param {string} mobileSrc - Image source for mobile devices
 * @param {string} alt - Alt text for the image
 * @param {string} className - Additional CSS classes
 * @param {object} style - Inline styles
 */
function ResponsiveImage({ desktopSrc, mobileSrc, alt = '', className = '', style = {} }) {
  return (
    <picture className={`responsive-image ${className}`} style={style}>
      <source media="(max-width: 768px)" srcSet={mobileSrc} />
      <source media="(min-width: 769px)" srcSet={desktopSrc} />
      <img src={desktopSrc} alt={alt} />
    </picture>
  );
}

export default ResponsiveImage;

