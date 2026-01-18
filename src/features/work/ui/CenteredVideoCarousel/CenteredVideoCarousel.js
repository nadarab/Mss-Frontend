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
  const [videoLoading, setVideoLoading] = useState({});
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [isSwiping, setIsSwiping] = useState(false);
  const [videoProgress, setVideoProgress] = useState({});
  const [loadingProgress, setLoadingProgress] = useState({});
  const [connectionSpeed, setConnectionSpeed] = useState('4g');
  const [showDataWarning, setShowDataWarning] = useState(false);
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

  // Detect network connection speed
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        const effectiveType = connection.effectiveType || '4g';
        setConnectionSpeed(effectiveType);
        
        // Show data warning on slow connections
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          setShowDataWarning(true);
        }

        const handleConnectionChange = () => {
          const newType = connection.effectiveType || '4g';
          setConnectionSpeed(newType);
          if (newType === 'slow-2g' || newType === '2g') {
            setShowDataWarning(true);
          }
        };

        connection.addEventListener('change', handleConnectionChange);
        return () => connection.removeEventListener('change', handleConnectionChange);
      }
    }
  }, []);

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
        threshold: 0.1,
        rootMargin: '1000px',
      }
    );

    observer.observe(currentContainer);
    
    // Initial check - if container is already visible, set in viewport
    const rect = currentContainer.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      setIsInViewport(true);
    }

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

  // Preload adjacent videos when carousel enters viewport or index changes
  useEffect(() => {
    pauseAllVideosExceptCenter();
    
    if (isInViewport && videos.length > 0) {
      // Get visible video indices (left, center, right) for preloading
      const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
      const nextIndex = (currentIndex + 1) % videos.length;
      const visibleIndices = [prevIndex, currentIndex, nextIndex];
      
      Object.entries(videoRefsMap.current).forEach(([index, videoRef]) => {
        const videoIndex = parseInt(index);
        const isVisible = visibleIndices.includes(videoIndex);
        
        if (videoRef && isVisible) {
          // Preload visible videos (center, left, right) - load metadata for smooth transitions
          if (videoRef.readyState === 0) {
            videoRef.load();
          }
        }
      });
    }
  }, [currentIndex, pauseAllVideosExceptCenter, isInViewport, videos.length]);

  const handleVideoLoadStart = useCallback((index) => {
    setVideoLoading(prev => ({ ...prev, [index]: true }));
    setLoadingProgress(prev => ({ ...prev, [index]: 0 }));
  }, []);

  const handleVideoCanPlay = useCallback((index) => {
    setVideoLoading(prev => ({ ...prev, [index]: false }));
    setLoadingProgress(prev => ({ ...prev, [index]: 100 }));
  }, []);

  const handleVideoProgress = useCallback((index, event) => {
    const video = event.target;
    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const duration = video.duration;
      if (duration > 0) {
        const percentLoaded = (bufferedEnd / duration) * 100;
        setLoadingProgress(prev => ({ ...prev, [index]: percentLoaded }));
      }
    }
  }, []);

  const handleVideoTimeUpdate = useCallback((index, event) => {
    const video = event.target;
    if (video.duration > 0) {
      const progress = (video.currentTime / video.duration) * 100;
      setVideoProgress(prev => ({ ...prev, [index]: progress }));
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (centerVideoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      centerVideoRef.current.muted = newMutedState;
    }
  }, [isMuted]);

  const handleNext = useCallback(() => {
    if (videos.length === 0) return;
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  }, [videos.length]);

  const handlePrev = useCallback(() => {
    if (videos.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  }, [videos.length]);

  // Swipe gesture handlers
  const minSwipeDistance = 50; // Minimum distance for a swipe to register

  const onTouchStart = useCallback((e) => {
    setTouchEnd(null); // Reset touch end
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

    // Reset swipe state
    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  }, [touchStart, touchEnd, handleNext, handlePrev]);

  useEffect(() => {
    if (!isHovered && isInViewport && centerVideoRef.current) {
      pauseAllVideosExceptCenter();
      
      // On mobile, videos autostart muted
      if (isMobile) {
        centerVideoRef.current.muted = isMuted;
      } else {
        centerVideoRef.current.muted = true;
      }
      
      centerVideoRef.current.load();
      const playPromise = centerVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }

      // Auto-play disabled - videos only change via arrow controls
      // Removed autoPlayTimerRef setTimeout that was calling handleNext()

    } else if (!isInViewport && centerVideoRef.current) {
      centerVideoRef.current.pause();
    }
  }, [currentIndex, isHovered, isInViewport, pauseAllVideosExceptCenter, isMobile, isMuted]);

  useEffect(() => {
    if (centerVideoRef.current && isInViewport) {
      if (isHovered) {
        setShowTapPrompt(false);
        
        if (autoPlayTimerRef.current) {
          clearTimeout(autoPlayTimerRef.current);
        }
        
        pauseAllVideosExceptCenter();
        
        // On desktop, hover unmutes. On mobile, respect mute button state
        if (!isMobile) {
          centerVideoRef.current.muted = false;
        } else {
          centerVideoRef.current.muted = isMuted;
        }
        
        const playPromise = centerVideoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      } else {
        // On desktop, mute when not hovering. On mobile, respect mute button state
        if (!isMobile) {
          centerVideoRef.current.muted = true;
        } else {
          centerVideoRef.current.muted = isMuted;
        }
      }
    }
  }, [isHovered, isInViewport, pauseAllVideosExceptCenter, isMobile, isMuted]);

  const getVisibleVideos = () => {
    // Always show left, center, and right videos for horizontal scrolling
    const prevIndex = (currentIndex - 1 + videos.length) % videos.length;
    const nextIndex = (currentIndex + 1) % videos.length;
    return [prevIndex, currentIndex, nextIndex];
  };

  const getVideoPosition = (index) => {
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
      x: isMobile ? '-75%' : '-85%',
      scale: isMobile ? 0.75 : 0.7,
      opacity: isMobile ? 0.6 : 0.5,
      zIndex: 1,
    },
    right: {
      x: isMobile ? '75%' : '85%',
      scale: isMobile ? 0.75 : 0.7,
      opacity: isMobile ? 0.6 : 0.5,
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
    <div id={carouselId} className="centered-carousel-container" ref={containerRef}>
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

        <div 
          className="carousel-track"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
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
                  
                  {/* Enhanced Loading Indicator with Progress */}
                  {videoLoading[index] && (
                    <div className="video-loading-overlay">
                      <div className="loading-content">
                        <div className="video-spinner"></div>
                        <div className="loading-text">
                          <span className="loading-percentage">
                            {Math.round(loadingProgress[index] || 0)}%
                          </span>
                          <span className="loading-label">Loading</span>
                        </div>
                        <div className="loading-progress-bar">
                          <motion.div 
                            className="loading-progress-fill"
                            initial={{ width: '0%' }}
                            animate={{ width: `${loadingProgress[index] || 0}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
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
                    preload={
                      isCenter 
                        ? "auto" 
                        : (connectionSpeed === 'slow-2g' || connectionSpeed === '2g' 
                            ? "none" 
                            : "metadata")
                    }
                    className={`carousel-video ${!isCenter ? 'side-video' : ''}`}
                    onLoadStart={() => handleVideoLoadStart(index)}
                    onCanPlay={() => handleVideoCanPlay(index)}
                    onLoadedData={() => handleVideoCanPlay(index)}
                    onProgress={(e) => handleVideoProgress(index, e)}
                    onTimeUpdate={(e) => handleVideoTimeUpdate(index, e)}
                  />
                  
                  {/* Desktop hover sound indicator */}
                  {isCenter && isHovered && !isMobile && (
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

                  {/* Mobile sound toggle button */}
                  {isCenter && isMobile && (
                    <motion.button
                      className="mobile-sound-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                      }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                    >
                      {isMuted ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                      )}
                    </motion.button>
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
                        <p className="tap-prompt-text">Swipe to explore videos</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Video Progress Bar */}
                  {isCenter && !videoLoading[index] && (
                    <div className="video-progress-bar-container">
                      <motion.div 
                        className="video-progress-bar-fill"
                        style={{ width: `${videoProgress[index] || 0}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
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

      {/* Data Warning for Slow Connections */}
      {showDataWarning && isMobile && (
        <motion.div
          className="data-warning-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="data-warning-content">
            <svg viewBox="0 0 24 24" fill="currentColor" className="data-warning-icon">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
            <div className="data-warning-text">
              <strong>Slow connection detected</strong>
              <span>Videos may take longer to load</span>
            </div>
            <button 
              className="data-warning-close"
              onClick={() => setShowDataWarning(false)}
              aria-label="Close warning"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </motion.div>
      )}

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


