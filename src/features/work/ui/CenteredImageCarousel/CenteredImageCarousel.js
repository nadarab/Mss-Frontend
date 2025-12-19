import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './CenteredImageCarousel.css';

function CenteredImageCarousel({ images = [], carouselId = 'image-carousel' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isSwiping, setIsSwiping] = useState(false);
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

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  }, []);

  const onTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (touchStart) {
      const distance = Math.abs(touchStart - e.targetTouches[0].clientX);
      if (distance > 10) {
        setIsSwiping(true);
      }
    }
  }, [touchStart]);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  }, [touchStart, touchEnd, handleNext, handlePrev]);

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
    // Always show left, center, and right images for horizontal scrolling (like video carousel)
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    return [prevIndex, currentIndex, nextIndex];
  };

  const getPosition = (index) => {
    const [prevIndex, centerIndex, nextIndex] = getVisible();
    if (index === prevIndex) return 'left';
    if (index === centerIndex) return 'center';
    if (index === nextIndex) return 'right';
    return 'hidden';
  };

  const slideVariants = {
    center: { x: '0%', scale: 1, opacity: 1, zIndex: 3 },
    left: { 
      x: isMobile ? '-75%' : '-85%', 
      scale: isMobile ? 0.75 : 0.7, 
      opacity: isMobile ? 0.6 : 0.5, 
      zIndex: 1 
    },
    right: { 
      x: isMobile ? '75%' : '85%', 
      scale: isMobile ? 0.75 : 0.7, 
      opacity: isMobile ? 0.6 : 0.5, 
      zIndex: 1 
    },
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

        <div 
          className="carousel-track"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
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
