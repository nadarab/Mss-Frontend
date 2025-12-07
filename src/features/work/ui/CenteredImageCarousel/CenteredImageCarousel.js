import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './CenteredImageCarousel.css';

function CenteredImageCarousel({ images = [], carouselId = 'image-carousel' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const autoPlayTimerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isHovered) {
      autoPlayTimerRef.current = setTimeout(() => {
        handleNext();
      }, 2500);

      return () => {
        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
        }
      };
    }
  }, [currentIndex, isHovered, handleNext]);

  const getVisible = () => {
    if (isMobile) return [currentIndex];
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    return [prevIndex, currentIndex, nextIndex];
  };

  const getPosition = (index) => {
    if (isMobile) return index === currentIndex ? 'center' : 'hidden';
    const [prevIndex, centerIndex, nextIndex] = getVisible();
    if (index === prevIndex) return 'left';
    if (index === centerIndex) return 'center';
    if (index === nextIndex) return 'right';
    return 'hidden';
  };

  const slideVariants = {
    center: { x: '0%', scale: 1, opacity: 1, zIndex: 3 },
    left: { x: '-85%', scale: 0.7, opacity: 0.6, zIndex: 1 },
    right: { x: '85%', scale: 0.7, opacity: 0.6, zIndex: 1 },
    hidden: { x: direction > 0 ? '200%' : '-200%', scale: 0.5, opacity: 0, zIndex: 0 },
  };

  return (
    <div className="centered-carousel-container" ref={containerRef} id={carouselId}>
      <div className="carousel-wrapper">
        <button className="carousel-arrow carousel-arrow-left" onClick={handlePrev} aria-label="Previous image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="carousel-track">
          {images.map((img, index) => {
            const position = getPosition(index);
            if (position === 'hidden') return null;
            return (
              <motion.div
                key={`${carouselId}-${index}`}
                className={`carousel-slide ${position}`}
                variants={slideVariants}
                initial={position}
                animate={position}
                transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, scale: { duration: 0.4 }, opacity: { duration: 0.4 } }}
                onMouseEnter={() => position === 'center' && setIsHovered(true)}
                onMouseLeave={() => position === 'center' && setIsHovered(false)}
              >
                <div className="image-container">
                  <img src={img} alt="carousel" className="carousel-image" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <button className="carousel-arrow carousel-arrow-right" onClick={handleNext} aria-label="Next image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="carousel-dots">
        {images.map((_, index) => (
          <button
            key={`${carouselId}-dot-${index}`}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default CenteredImageCarousel;
