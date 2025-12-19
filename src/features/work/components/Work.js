import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Work.css';
import { videoService, workCardThumbnailService } from '../../../firebase/collections';
import arrowIcon from '../../../assets/images/OurWorkSection/arrow.png';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function Work() {
  const navigate = useNavigate();
  const location = useLocation();
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const card1Ref = useRef(null);
  const card2Ref = useRef(null);
  const card3Ref = useRef(null);
  const headerLabelRef = useRef(null);
  const headerTitleRef = useRef(null);
  const headerSubtitleRef = useRef(null);
  const cardTitleRefs = [useRef(null), useRef(null), useRef(null)];
  const cardDescriptionRefs = [useRef(null), useRef(null), useRef(null)];
  const [firestoreVideo, setFirestoreVideo] = useState(null);
  const [thumbnails, setThumbnails] = useState({
    video: null,
    design: null,
    branding: null
  });
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(true);

  // Clean up GSAP when component unmounts or location changes
  useEffect(() => {
    return () => {
      // Aggressive cleanup of all GSAP ScrollTriggers
      try {
        const triggers = ScrollTrigger.getAll();
        triggers.forEach((trigger) => {
          try {
            trigger.disable();
            trigger.kill(false); // false = don't revert inline styles
          } catch (err) {
            // Ignore errors
          }
        });
        ScrollTrigger.clearMatchMedia();
        ScrollTrigger.refresh();
      } catch (error) {
        // Ignore cleanup errors
      }
    };
  }, [location.pathname]);

  // Load first video and thumbnails from Firestore
  useEffect(() => {
    loadFirstVideo();
    loadThumbnails();
  }, []);

  const loadFirstVideo = async () => {
    try {
      // Get all videos
      const allVideos = await videoService.getAll();
      
      // Get the first video if available
      if (allVideos.length > 0) {
        setFirestoreVideo(allVideos[0].videoUrl);
      }
    } catch (error) {
      console.error('Error loading video:', error);
    }
  };

  const loadThumbnails = async () => {
    try {
      // Load thumbnails for each card type
      const videoThumb = await workCardThumbnailService.getByCardType('video');
      const designThumb = await workCardThumbnailService.getByCardType('design');
      const brandingThumb = await workCardThumbnailService.getByCardType('branding');
      
      setThumbnails({
        video: videoThumb,
        design: designThumb,
        branding: brandingThumb
      });
    } catch (error) {
      console.error('Error loading thumbnails:', error);
    } finally {
      setIsLoadingThumbnails(false);
    }
  };

  useEffect(() => {
    // Don't run animations until thumbnails are loaded
    if (isLoadingThumbnails) {
      return undefined;
    }

    const section = sectionRef.current;
    const cardsContainer = cardsContainerRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    const card3 = card3Ref.current;
    const headerLabel = headerLabelRef.current;
    const headerTitle = headerTitleRef.current;
    const headerSubtitle = headerSubtitleRef.current;

    if (!section || !cardsContainer || !card1 || !card2 || !card3) {
      return undefined;
    }

    // Track if component is mounted
    let isMounted = true;

    // Kill any existing ScrollTriggers (defensive in case of hot reloads)
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // ========== HEADER TEXT ANIMATIONS ==========
    // Set initial states for header text
    if (headerLabel) {
      gsap.set(headerLabel, { y: -50, opacity: 0, force3D: false });
    }
    if (headerTitle) {
      gsap.set(headerTitle, { x: -100, opacity: 0, force3D: false });
    }
    if (headerSubtitle) {
      gsap.set(headerSubtitle, { x: 100, opacity: 0, force3D: false });
    }

    // Animate header text when section enters viewport
    const headerTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
        once: true,
      },
    });

    if (headerLabel) {
      headerTl.to(headerLabel, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        force3D: false
      });
    }
    if (headerTitle) {
      headerTl.to(
        headerTitle,
        {
          x: 0,
          opacity: 1,
          duration: 1.9,
          ease: 'power3.out',
          force3D: false
        },
        '-=0.9'
      );
    }
    if (headerSubtitle) {
      headerTl.to(
        headerSubtitle,
        {
          x: 0,
          opacity: 1,
          duration: 1.7,
          ease: 'power3.out',
          force3D: false
        },
        '-=1.3'
      );
    }

    // ========== CARD TEXT ANIMATIONS ==========
    // Set initial states for card text elements
    cardTitleRefs.forEach((ref) => {
      if (ref.current) {
        gsap.set(ref.current, { x: -80, opacity: 0, force3D: false });
      }
    });
    cardDescriptionRefs.forEach((ref) => {
      if (ref.current) {
        gsap.set(ref.current, { x: 80, opacity: 0, force3D: false });
      }
    });

    // Animate card 1 text when card 1 is visible
    const card1TextTl = gsap.timeline({
      scrollTrigger: {
        trigger: card1,
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
        once: true,
      },
    });

    if (cardTitleRefs[0].current) {
      card1TextTl.to(cardTitleRefs[0].current, {
        x: 0,
        opacity: 1,
        duration: 1.7,
        ease: 'power3.out',
        force3D: false
      });
    }
    if (cardDescriptionRefs[0].current) {
      card1TextTl.to(
        cardDescriptionRefs[0].current,
        {
          x: 0,
          opacity: 1,
          duration: 1.7,
          ease: 'power3.out',
          force3D: false
        },
        '-=1.3'
      );
    }

    // Animate card 2 text when card 2 appears (tied to card animation)
    const card2TextTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=1500',
        scrub: 1.8,
      },
    });

    // Card 2 text appears when card 2 is about 30% visible
    if (cardTitleRefs[1].current) {
      card2TextTl.to(
        cardTitleRefs[1].current,
        {
          x: 0,
          opacity: 1,
          duration: 1.6,
          ease: 'power2.out',
          force3D: false
        },
        0.2
      );
    }
    if (cardDescriptionRefs[1].current) {
      card2TextTl.to(
        cardDescriptionRefs[1].current,
        {
          x: 0,
          opacity: 1,
          duration: 1.6,
          ease: 'power2.out',
          force3D: false
        },
        0.5
      );
    }

    // Animate card 3 text when card 3 appears (tied to card animation)
    if (cardTitleRefs[2].current) {
      card2TextTl.to(
        cardTitleRefs[2].current,
        {
          x: 0,
          opacity: 1,
          duration: 1.6,
          ease: 'power2.out',
          force3D: false
        },
        0.8
      );
    }
    if (cardDescriptionRefs[2].current) {
      card2TextTl.to(
        cardDescriptionRefs[2].current,
        {
          x: 0,
          opacity: 1,
          duration: 1.6,
          ease: 'power2.out',
          force3D: false
        },
        1.
      );
    }

    // ========== CARD STACKING ANIMATION ==========
    // Card 1: keep visible and static (GSAP does not animate it)
    // left: "50%" positions left edge at center, xPercent: -50 shifts by half width to center
    gsap.set(card1, { 
      yPercent: 0,
      left: "50%",
      xPercent: -50, 
      opacity: 1,
      force3D: false
    });

    // Card 2 & 3: start hidden below and transparent, but centered horizontally
    gsap.set([card2, card3], { 
      yPercent: 100,
      left: "50%",
      xPercent: -50, 
      opacity: 0,
      force3D: false
    });

    // Timeline: pin the whole section (title + cards) and animate only card2 & card3
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: section,
        pinSpacing: true,
        markers: false,
        start: 'top top',
        end: '+=1500',
        scrub: 1.8,
        onLeave: () => {
          // Ensure we don't manipulate DOM if component is unmounting
          if (!isMounted) return;
        },
        onEnterBack: () => {
          if (!isMounted) return;
        },
      },
    });

    tl.to(card2, {
      yPercent: 0,
      left: "50%",
      xPercent: -50,
      opacity: 1,
      duration: 0.6,
      force3D: false,
      ease: 'power2.inOut'
    }).to(card3, {
      yPercent: 0,
      left: "50%",
      xPercent: -50,
      opacity: 1,
      duration: 0.6,
      force3D: false,
      ease: 'power2.inOut'
    });

    ScrollTrigger.refresh();

    return () => {
      // Mark as unmounted first
      isMounted = false;
      
      // Safely clean up GSAP ScrollTrigger and pinned elements
      try {
        // Disable all triggers first to stop any ongoing animations
        ScrollTrigger.getAll().forEach((trigger) => {
          try {
            trigger.disable();
          } catch (err) {
            // Ignore disable errors
          }
        });
        
        // Small delay to let GSAP finish current operations
        setTimeout(() => {
          try {
            // Kill all triggers
            ScrollTrigger.getAll().forEach((trigger) => {
              try {
                trigger.kill();
              } catch (err) {
                // Ignore kill errors
              }
            });
            
            // Final refresh to clean up DOM
            ScrollTrigger.refresh();
          } catch (error) {
            // Ignore all cleanup errors
          }
        }, 0);
      } catch (error) {
        // Final cleanup attempt
        try {
          ScrollTrigger.getAll().forEach((trigger) => {
            try {
              trigger.kill();
            } catch (err) {
              // Ignore
            }
          });
        } catch (err) {
          // Ignore all errors
        }
      }
    };
  }, [isLoadingThumbnails]);

  const categories = [
    {
      type: 'video',
      name: thumbnails.video?.name || 'Video Making',
      description: thumbnails.video?.description || 'Turning ideas into cinematic stories that connect with your audience',
      mediaSrc: thumbnails.video?.thumbnailUrl || firestoreVideo || null,
      link: '/work/video',
      isVideo: thumbnails.video?.thumbnailUrl ? false : (firestoreVideo ? true : false),
    },
    {
      type: 'design',
      name: thumbnails.design?.name || 'Design',
      description: thumbnails.design?.description || 'Bold, clean, and purposeful design that makes your brand unforgettable',
      mediaSrc: thumbnails.design?.thumbnailUrl || null,
      link: '/work/design',
      isVideo: false,
    },
    {
      type: 'branding',
      name: thumbnails.branding?.name || 'Branding & Identity',
      description: thumbnails.branding?.description || 'Crafting identities that define who you are and what you stand for',
      mediaSrc: thumbnails.branding?.thumbnailUrl || null,
      link: '/work/branding',
      isVideo: false,
    },
  ];

  return (
    <section id="work" className="work-section" ref={sectionRef}>
      <div className="row">
        <p ref={headerLabelRef} className="work-label">
          OUR WORK
        </p>
        <h1 ref={headerTitleRef}>Where Creativity Meets Growth</h1>
        <p ref={headerSubtitleRef} className="section-subtitle">
          Explore our portfolio , showcasing the creativity and strategic execution we bring to every client challenge.
        </p>
      </div>

      <div className="row cards-row">
        <div className="col-12">
          {isLoadingThumbnails ? (
            <div className="cards-loading" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '500px',
              color: '#fff',
              fontSize: '1.2rem'
            }}>
              Loading...
            </div>
          ) : (
            <div className="cards" ref={cardsContainerRef}>
              {categories.map((category, index) => (
                category.mediaSrc ? (
                  <div
                    key={index}
                    ref={index === 0 ? card1Ref : index === 1 ? card2Ref : card3Ref}
                    className={`custom-card card${index + 1} category-${category.type}`}
                    style={{
                      zIndex: index + 2,
                    }}
                  >
                    <div className="card-background">
                      {category.isVideo ? (
                        <video
                          className="card-bg-media"
                          src={category.mediaSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                        />
                      ) : (
                        <img
                          className="card-bg-media"
                          src={category.mediaSrc}
                          alt={category.name}
                        />
                      )}
                      <div className="card-overlay"></div>
                    </div>

                    <div className="card-content">
                      <h3 ref={cardTitleRefs[index]} className="card-title">
                        {category.name}
                      </h3>
                      <p ref={cardDescriptionRefs[index]} className="card-description">
                        {category.description}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        // Immediately disable and kill all ScrollTriggers
                        try {
                          ScrollTrigger.getAll().forEach((trigger) => {
                            try {
                              trigger.disable();
                              trigger.kill(false);
                            } catch (err) {
                              // Ignore
                            }
                          });
                          ScrollTrigger.clearMatchMedia();
                          ScrollTrigger.refresh();
                        } catch (err) {
                          // Ignore
                        }
                        // Navigate immediately - React will handle unmount
                        navigate(category.link, { replace: true });
                      }}
                      className="check-work-btn"
                      type="button"
                    >
                      Check Our Work
                      <img src={arrowIcon} alt="arrow" className="btn-arrow" />
                    </button>
                  </div>
                ) : null
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Work;
