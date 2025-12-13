import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import './CenteredVideoCarousel.css';

function CenteredVideoCarousel({ videos, carouselId = 'default' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);
  const [showTapPrompt, setShowTapPrompt] = useState(false);
  const centerVideoRef = useRef(null);
  const autoPlayTimerRef = useRef(null);
  const containerRef = useRef(null);
  const videoRefsMap = useRef({});

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && isInViewport) {
        setShowTapPrompt(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isInViewport]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewport(entry.isIntersecting);
          
          if (!entry.isIntersecting && centerVideoRef.current) {
            centerVideoRef.current.pause();
            if (autoPlayTimerRef.current) {
              clearTimeout(autoPlayTimerRef.current);
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '50px',
      }
    );

    observer.observe(currentContainer);

    return () => {
      // Safely disconnect observer
      try {
        observer.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
    };
  }, []);

  const pauseAllVideosExceptCenter = useCallback(() => {
    Object.entries(videoRefsMap.current).forEach(([index, videoRef]) => {
      if (videoRef && parseInt(index) !== currentIndex) {
        videoRef.pause();
        videoRef.currentTime = 0;
      }
    });
  }, [currentIndex]);

  useEffect(() => {
    pauseAllVideosExceptCenter();
    
    if (isInViewport) {
      Object.entries(videoRefsMap.current).forEach(([index, videoRef]) => {
        if (videoRef && parseInt(index) !== currentIndex && videoRef.readyState === 0) {
          videoRef.load();
        }
      });
    }
  }, [currentIndex, pauseAllVideosExceptCenter, isInViewport]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  }, [videos.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  }, [videos.length]);

  useEffect(() => {
    if (!isHovered && isInViewport && centerVideoRef.current) {
      pauseAllVideosExceptCenter();
      
      centerVideoRef.current.muted = true;
      centerVideoRef.current.load();
      const playPromise = centerVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }

      autoPlayTimerRef.current = setTimeout(() => {
        handleNext();
      }, 2500);

      return () => {
        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
        }
      };
    } else if (!isInViewport && centerVideoRef.current) {
      centerVideoRef.current.pause();
    }
  }, [currentIndex, isHovered, isInViewport, handleNext, pauseAllVideosExceptCenter]);

  useEffect(() => {
    if (centerVideoRef.current && isInViewport) {
      if (isHovered) {
        setShowTapPrompt(false);
        
        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
        }
        
        pauseAllVideosExceptCenter();
        
        centerVideoRef.current.muted = false;
        const playPromise = centerVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        centerVideoRef.current.muted = true;
      }
    }
  }, [isHovered, isInViewport, pauseAllVideosExceptCenter]);

  const getVisibleVideos = () => {
    if (isMobile) {
      return [currentIndex];
    }
    
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    const nextIndex = (currentIndex + 1) % videos.length;
    return [prevIndex, currentIndex, nextIndex];
  };

  const getVideoPosition = (index) => {
    if (isMobile) {
      return index === currentIndex ? 'center' : 'hidden';
    }

    const visibleIndices = getVisibleVideos();
    if (index === visibleIndices[0]) return 'left';
    if (index === visibleIndices[1]) return 'center';
    if (index === visibleIndices[2]) return 'right';
    return 'hidden';
  };

  const slideVariants = {
    center: {
      x: '0%',
      scale: 1,
      opacity: 1,
      zIndex: 3,
    },
    left: {
      x: '-85%',
      scale: 0.7,
      opacity: 0.5,
      zIndex: 1,
    },
    right: {
      x: '85%',
      scale: 0.7,
      opacity: 0.5,
      zIndex: 1,
    },
    hidden: {
      x: direction > 0 ? '200%' : '-200%',
      scale: 0.5,
      opacity: 0,
      zIndex: 0,
    },
  };

  return (
    <div className="centered-carousel-container" ref={containerRef}>
      <div className="carousel-wrapper">
        <button 
          className="carousel-arrow carousel-arrow-left" 
          onClick={handlePrev}
          aria-label="Previous video"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="carousel-track">
          {videos.map((video, index) => {
            const position = getVideoPosition(index);
            if (position === 'hidden') return null;

            const isCenter = position === 'center';

            return (
              <motion.div
                key={index}
                className={`carousel-slide ${position}`}
                variants={slideVariants}
                initial={position}
                animate={position}
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  scale: { duration: 0.4 },
                  opacity: { duration: 0.4 },
                }}
                onMouseEnter={() => isCenter && setIsHovered(true)}
                onMouseLeave={() => isCenter && setIsHovered(false)}
                onClick={() => isCenter && isMobile && setShowTapPrompt(false)}
              >
                <div className="video-container">
                  {!isCenter && (
                    <div className="video-thumbnail-overlay">
                      <div className="thumbnail-gradient"></div>
                    </div>
                  )}
                  <video
                    ref={(el) => {
                      if (isCenter) {
                        centerVideoRef.current = el;
                      }
                      videoRefsMap.current[index] = el;
                    }}
                    src={isInViewport ? video : undefined}
                    loop
                    playsInline
                    muted={!isCenter || !isHovered}
                    preload={isCenter ? "auto" : "metadata"}
                    className={`carousel-video ${!isCenter ? 'side-video' : ''}`}
                  />
                  
                  {isCenter && isHovered && (
                    <motion.div
                      className="sound-indicator"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    </motion.div>
                  )}

                  {!isCenter && !isMobile && (
                    <div className="video-overlay-side">
                      <div className="play-icon-small">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {isCenter && isMobile && showTapPrompt && (
                    <motion.div
                      className="tap-prompt-overlay"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="tap-prompt-content">
                        <motion.div
                          className="tap-icon"
                          animate={{ 
                            y: [0, -10, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"/>
                            <circle cx="12" cy="17" r="1.5" fill="white"/>
                          </svg>
                        </motion.div>
                        <p className="tap-prompt-text">Tap to play</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <button 
          className="carousel-arrow carousel-arrow-right" 
          onClick={handleNext}
          aria-label="Next video"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="carousel-dots">
        {videos.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            aria-label={`Go to video ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default CenteredVideoCarousel;
