import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Work.css';
import arrowIcon from '../../../assets/images/OurWorkSection/arrow.png';
// Static images for Our Work section cards
// TODO: Replace these with actual OurWorkSection images when available:
//   - assets/images/OurWorkSection/video-desktop.jpg (or .png)
//   - assets/images/OurWorkSection/video-mobile.jpg (or .png)
//   - assets/images/OurWorkSection/design-desktop.jpg (or .png)
//   - assets/images/OurWorkSection/design-mobile.jpg (or .png)
//   - assets/images/OurWorkSection/branding-desktop.jpg (or .png)
//   - assets/images/OurWorkSection/branding-mobile.jpg (or .png)
// Using Cover folder images as temporary placeholders
import videoCardDesktop from '../../../assets/images/Cover/lapVedio.png';
import videoCardMobile from '../../../assets/images/Cover/PhoneVedio.png';
import designCardDesktop from '../../../assets/images/Cover/lapDesign.png';
import designCardMobile from '../../../assets/images/Cover/phoneDesign.png';
import brandingCardDesktop from '../../../assets/images/Cover/lapBranding.png';
import brandingCardMobile from '../../../assets/images/Cover/phoneBranding.png';

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
  // Static images are now used, no loading needed
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);

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

  // Static images - no loading needed
  useEffect(() => {
    // Component is ready immediately with static images
    setIsLoadingThumbnails(false);
  }, []);

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

    // Check for reduced motion preference (accessibility)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Kill any existing ScrollTriggers (defensive in case of hot reloads)
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // ========== HEADER TEXT ANIMATIONS ==========
    // Set initial states for header text
    if (headerLabel) {
      gsap.set(headerLabel, { y: -50, opacity: 0, force3D: true });
    }
    if (headerTitle) {
      gsap.set(headerTitle, { x: -100, opacity: 0, force3D: true });
    }
    if (headerSubtitle) {
      gsap.set(headerSubtitle, { x: 100, opacity: 0, force3D: true });
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
        duration: prefersReducedMotion ? 0.1 : 1.2,
        ease: prefersReducedMotion ? 'none' : 'power3.out',
        force3D: true // GPU acceleration
      });
    }
    if (headerTitle) {
      headerTl.to(
        headerTitle,
        {
          x: 0,
          opacity: 1,
          duration: prefersReducedMotion ? 0.1 : 1.9,
          ease: prefersReducedMotion ? 'none' : 'power3.out',
          force3D: true // GPU acceleration
        },
        prefersReducedMotion ? 0 : '-=0.9'
      );
    }
    if (headerSubtitle) {
      headerTl.to(
        headerSubtitle,
        {
          x: 0,
          opacity: 1,
          duration: prefersReducedMotion ? 0.1 : 1.7,
          ease: prefersReducedMotion ? 'none' : 'power3.out',
          force3D: true // GPU acceleration
        },
        prefersReducedMotion ? 0 : '-=1.3'
      );
    }

    // ========== CARD TEXT ANIMATIONS ==========
    // Set initial states for card text elements
    cardTitleRefs.forEach((ref) => {
      if (ref.current) {
        gsap.set(ref.current, { x: -80, opacity: 0, force3D: true });
      }
    });
    cardDescriptionRefs.forEach((ref) => {
      if (ref.current) {
        gsap.set(ref.current, { x: 80, opacity: 0, force3D: true });
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
        duration: prefersReducedMotion ? 0.1 : 1.7,
        ease: prefersReducedMotion ? 'none' : 'power3.out',
        force3D: true // GPU acceleration
      });
    }
    if (cardDescriptionRefs[0].current) {
      card1TextTl.to(
        cardDescriptionRefs[0].current,
        {
          x: 0,
          opacity: 1,
          duration: prefersReducedMotion ? 0.1 : 1.7,
          ease: prefersReducedMotion ? 'none' : 'power3.out',
          force3D: true // GPU acceleration
        },
        prefersReducedMotion ? 0 : '-=1.3'
      );
    }

    // Animate card 2 text when card 2 appears (tied to card animation)
    // Use responsive pin duration calculation
    const getTextTimelineEnd = () => {
      const viewportHeight = window.innerHeight;
      const cardCount = 2;
      const buffer = 250;
      let multiplier = 1.0;
      
      if (window.innerWidth <= 576) {
        multiplier = 0.6;
      } else if (window.innerWidth <= 992) {
        multiplier = 0.8;
      }
      
      return (viewportHeight * cardCount * multiplier) + buffer;
    };

    const card2TextTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${getTextTimelineEnd()}`, // Dynamic end based on viewport
        scrub: 1.1, // Matched with main timeline for consistent scroll responsiveness
      },
    });

    // Card 2 text appears when card 2 is about 30% visible
    if (cardTitleRefs[1].current) {
      card2TextTl.to(
        cardTitleRefs[1].current,
        {
          x: 0,
          opacity: 1,
          duration: prefersReducedMotion ? 0.1 : 1.6,
          ease: prefersReducedMotion ? 'none' : 'power2.out',
          force3D: true // GPU acceleration
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
          duration: prefersReducedMotion ? 0.1 : 1.6,
          ease: prefersReducedMotion ? 'none' : 'power2.out',
          force3D: true // GPU acceleration
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
          duration: prefersReducedMotion ? 0.1 : 1.6,
          ease: prefersReducedMotion ? 'none' : 'power2.out',
          force3D: true // GPU acceleration
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
          duration: prefersReducedMotion ? 0.1 : 1.6,
          ease: prefersReducedMotion ? 'none' : 'power2.out',
          force3D: true // GPU acceleration
        },
        1.
      );
    }

    // ========== CARD STACKING ANIMATION ==========
    // Add is-animating class to enable will-change optimization
    [card1, card2, card3].forEach(card => {
      if (card) card.classList.add('is-animating');
    });

    // Card 1: keep visible and static with strongest shadow (always in front)
    // left: "50%" positions left edge at center, xPercent: -50 shifts by half width to center
    gsap.set(card1, { 
      yPercent: 0,
      left: "50%",
      xPercent: -50, 
      opacity: 1,
      '--shadow-blur': '35px', // Strongest shadow for active card
      '--shadow-opacity': '0.25',
      force3D: true // GPU acceleration enabled for better performance
    });

    // Card 2 & 3: start hidden below, transparent, scaled down, with softer shadows
    gsap.set([card2, card3], { 
      yPercent: 100,
      left: "50%",
      xPercent: -50, 
      opacity: prefersReducedMotion ? 1 : 0, // Show immediately if reduced motion
      scale: prefersReducedMotion ? 1 : 0.96, // Skip scale animation if reduced motion
      '--shadow-blur': '20px', // Softer shadow when stacked behind
      '--shadow-opacity': '0.15',
      force3D: true // GPU acceleration enabled for better performance
    });

    // Calculate dynamic pin duration based on viewport height and card count
    const calculatePinDuration = (multiplier = 1.0) => {
      const viewportHeight = window.innerHeight;
      const cardCount = 2; // Cards 2 and 3 that animate
      const buffer = 250; // Buffer space for smooth transitions
      return (viewportHeight * cardCount * multiplier) + buffer;
    };

    // Helper function to create card animation timeline
    const createCardTimeline = (scrollTriggerConfig) => {
      const tl = gsap.timeline({
        scrollTrigger: scrollTriggerConfig,
      });

      // Card 2: starts immediately with smooth easing, scales up, fades in, and shadow intensifies
      tl.to(card2, {
        yPercent: 0,
        left: "50%",
        xPercent: -50,
        opacity: 1,
        scale: 1, // Scale from 0.96 to 1.0 for depth effect
        '--shadow-blur': '35px', // Progressive shadow intensity as card comes forward
        '--shadow-opacity': '0.25',
        duration: prefersReducedMotion ? 0.1 : 0.6, // Faster, simpler animation if reduced motion
        force3D: true, // GPU acceleration enabled for better performance
        ease: prefersReducedMotion ? 'none' : 'power3.out' // No easing if reduced motion
      })
      // Card 3: starts 0.3s into timeline (overlaps with card2 for cascading effect)
      .to(card3, {
        yPercent: 0,
        left: "50%",
        xPercent: -50,
        opacity: 1,
        scale: 1, // Scale from 0.96 to 1.0 for depth effect
        '--shadow-blur': '35px', // Progressive shadow intensity as card comes forward
        '--shadow-opacity': '0.25',
        duration: prefersReducedMotion ? 0.1 : 0.6, // Faster, simpler animation if reduced motion
        force3D: true, // GPU acceleration enabled for better performance
        ease: prefersReducedMotion ? 'none' : 'power3.out' // No easing if reduced motion
      }, prefersReducedMotion ? 0 : "-=0.3"); // No overlap if reduced motion, otherwise start 0.3s before card2 finishes

      return tl;
    };

    // Use ScrollTrigger.matchMedia() for responsive pinning
    ScrollTrigger.matchMedia({
      // Mobile: Shorter pin duration
      "(max-width: 576px)": () => {
        const pinDuration = calculatePinDuration(0.6); // 60% of viewport height per card
        return createCardTimeline({
          trigger: section,
          pin: section,
          pinSpacing: true,
          markers: false,
          start: 'top top',
          end: `+=${pinDuration}`,
          scrub: 1.1,
          anticipatePin: 1,
          snap: {
            snapTo: [0, 0.5, 1],
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            inertia: false,
          },
          onLeave: () => {
            if (!isMounted) return;
            if (section) {
              gsap.to(section, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                force3D: true
              });
            }
          },
          onEnterBack: () => {
            if (!isMounted) return;
            if (section) {
              gsap.fromTo(section, 
                { opacity: 0.95 },
                { 
                  opacity: 1,
                  duration: 0.3,
                  ease: 'power2.out',
                  force3D: true
                }
              );
            }
          },
        });
      },
      // Tablet: Medium pin duration
      "(min-width: 577px) and (max-width: 992px)": () => {
        const pinDuration = calculatePinDuration(0.8); // 80% of viewport height per card
        return createCardTimeline({
          trigger: section,
          pin: section,
          pinSpacing: true,
          markers: false,
          start: 'top top',
          end: `+=${pinDuration}`,
          scrub: 1.1,
          anticipatePin: 1,
          snap: {
            snapTo: [0, 0.5, 1],
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            inertia: false,
          },
          onLeave: () => {
            if (!isMounted) return;
            if (section) {
              gsap.to(section, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                force3D: true
              });
            }
          },
          onEnterBack: () => {
            if (!isMounted) return;
            if (section) {
              gsap.fromTo(section, 
                { opacity: 0.95 },
                { 
                  opacity: 1,
                  duration: 0.3,
                  ease: 'power2.out',
                  force3D: true
                }
              );
            }
          },
        });
      },
      // Desktop: Full pin duration
      "(min-width: 993px)": () => {
        const pinDuration = calculatePinDuration(1.0); // 100% of viewport height per card
        return createCardTimeline({
          trigger: section,
          pin: section,
          pinSpacing: true,
          markers: false,
          start: 'top top',
          end: `+=${pinDuration}`,
          scrub: 1.1,
          anticipatePin: 1,
          snap: {
            snapTo: [0, 0.5, 1],
            duration: { min: 0.2, max: 0.6 },
            delay: 0.1,
            inertia: false,
          },
          onLeave: () => {
            if (!isMounted) return;
            if (section) {
              gsap.to(section, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                force3D: true
              });
            }
          },
          onEnterBack: () => {
            if (!isMounted) return;
            if (section) {
              gsap.fromTo(section, 
                { opacity: 0.95 },
                { 
                  opacity: 1,
                  duration: 0.3,
                  ease: 'power2.out',
                  force3D: true
                }
              );
            }
          },
        });
      },
    });

    ScrollTrigger.refresh();

    return () => {
      // Mark as unmounted first
      isMounted = false;
      
      // Remove is-animating class to disable will-change optimization
      [card1, card2, card3].forEach(card => {
        if (card) card.classList.remove('is-animating');
      });
      
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
      name: 'Video Production',
      description: 'Turning ideas into cinematic stories that connect with your audience',
      desktopImage: videoCardDesktop,
      mobileImage: videoCardMobile,
      link: '/work/video',
      isVideo: false,
    },
    {
      type: 'design',
      name: 'Design',
      description: 'Bold, clean, and purposeful design that makes your brand unforgettable',
      desktopImage: designCardDesktop,
      mobileImage: designCardMobile,
      link: '/work/design',
      isVideo: false,
    },
    {
      type: 'branding',
      name: 'Branding & Identity',
      description: 'Crafting identities that define who you are and what you stand for',
      desktopImage: brandingCardDesktop,
      mobileImage: brandingCardMobile,
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
                <div
                  key={index}
                  ref={index === 0 ? card1Ref : index === 1 ? card2Ref : card3Ref}
                  className={`custom-card card${index + 1} category-${category.type}`}
                  style={{
                    zIndex: index + 2,
                  }}
                >
                  <div className="card-background">
                    <picture className="card-bg-media">
                      <source media="(max-width: 768px)" srcSet={category.mobileImage} />
                      <source media="(min-width: 769px)" srcSet={category.desktopImage} />
                      <img
                        src={category.desktopImage}
                        alt={category.name}
                      />
                    </picture>
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
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Work;
