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
  const cardButtonRefs = [useRef(null), useRef(null), useRef(null)];
  const cardOverlayRefs = [useRef(null), useRef(null), useRef(null)];
  const particlesContainerRef = useRef(null);
  // Static images are now used, no loading needed
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [particlesEnabled, setParticlesEnabled] = useState(true);

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
    const particlesContainer = particlesContainerRef.current;
    
    // Detect mobile device early - used throughout the effect
    const isMobile = window.innerWidth <= 768;
    
    // Check device performance for particle effects
    const checkPerformance = () => {
      // Disable particles on mobile or low-end devices
      const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                       (navigator.deviceMemory && navigator.deviceMemory <= 4);
      return !isMobile && !isLowEnd;
    };
    
    const shouldShowParticles = checkPerformance() && particlesEnabled;

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
    // Set initial states for buttons (slide up from bottom)
    cardButtonRefs.forEach((ref) => {
      if (ref.current) {
        gsap.set(ref.current, { y: 30, opacity: 0, force3D: false });
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
    // Card 1 button appears after text (staggered)
    if (cardButtonRefs[0].current) {
      card1TextTl.to(
        cardButtonRefs[0].current,
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          force3D: false
        },
        '-=0.8'
      );
    }

    // ========== CARD STACKING ANIMATION ==========
    // Card 1: keep visible and static (GSAP does not animate it)
    // left: "50%" positions left edge at center, xPercent: -50 shifts by half width to center
    // Use force3D: true on mobile for better performance and to prevent layout jumps
    gsap.set(card1, { 
      yPercent: 0,
      left: "50%",
      xPercent: -50, 
      opacity: 1,
      force3D: isMobile ? true : false,
      immediateRender: true // Ensure position is set immediately
    });

    // Card 2 & 3: start hidden below and transparent, but centered horizontally
    gsap.set([card2, card3], { 
      yPercent: 100,
      left: "50%",
      xPercent: -50, 
      opacity: 0,
      force3D: isMobile ? true : false,
      immediateRender: true // Ensure position is set immediately
    });

    // ========== SCROLL PROGRESS INTEGRATION ==========
    // Progress-based animations with smooth interpolation and bidirectional support
    
    // ========== PARTICLE EFFECTS SYSTEM ==========
    // Create subtle particle effects during card transitions
    const createParticles = (container, intensity) => {
      if (!container || !shouldShowParticles) return;
      
      // Clear existing particles
      container.innerHTML = '';
      
      // Create 15-20 subtle particles
      const particleCount = Math.floor(15 + (intensity * 5));
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = 2 + Math.random() * 3;
        const duration = 3 + Math.random() * 2;
        const delay = Math.random() * 1;
        
        particle.style.cssText = `
          position: absolute;
          left: ${x}%;
          top: ${y}%;
          width: ${size}px;
          height: ${size}px;
          background: rgba(69, 137, 255, ${0.4 * intensity});
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
          box-shadow: 0 0 ${size * 2}px rgba(69, 137, 255, ${0.6 * intensity});
        `;
        
        container.appendChild(particle);
      }
    };
    
    // Initialize particles container if enabled
    if (shouldShowParticles && particlesContainer) {
      particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
      `;
    }
    
    // Timeline: pin the whole section (title + cards) and animate only card2 & card3
    // Use matchMedia to handle mobile-specific pinning issues
    const pinEndValue = isMobile ? window.innerHeight * 2.5 : 1500; // Viewport-based for mobile
    
    // Track if we're entering from below to prevent jump on mobile
    let isEnteringFromBelow = false;
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: section,
        pinSpacing: true,
        markers: false,
        start: 'top top',
        end: `+=${pinEndValue}`,
        scrub: 1.8, // Smooth scroll-linked animation (bidirectional)
        anticipatePin: isMobile ? 1 : 0, // Help prevent jump on mobile
        invalidateOnRefresh: isMobile, // Recalculate on mobile viewport changes
        fastScrollEnd: isMobile, // Optimize for mobile scroll performance
        onUpdate: (self) => {
          if (!isMounted) return;
          
          // Get scroll progress (0 to 1)
          const progress = self.progress;
          
          // Progress-based card animations with smooth interpolation
          // Card 2: Animates from 0% to 50% progress (0 to 0.5)
          const card2Progress = Math.min(Math.max((progress - 0) / 0.5, 0), 1);
          // Card 3: Animates from 50% to 100% progress (0.5 to 1.0)
          const card3Progress = Math.min(Math.max((progress - 0.5) / 0.5, 0), 1);
          
          // Smooth interpolation using ease function
          const easeCard2 = gsap.parseEase('power2.inOut')(card2Progress);
          const easeCard3 = gsap.parseEase('power2.inOut')(card3Progress);
          
          // Apply interpolated values to card 2
          if (card2) {
            gsap.set(card2, {
              yPercent: 100 * (1 - easeCard2), // 100% to 0%
              opacity: card2Progress > 0 ? 1 : 0, // Immediately fully visible when appearing
              force3D: true
            });
          }
          
          // Apply interpolated values to card 3
          if (card3) {
            gsap.set(card3, {
              yPercent: 100 * (1 - easeCard3), // 100% to 0%
              opacity: card3Progress > 0 ? 1 : 0, // Immediately fully visible when appearing
              force3D: true
            });
          }
          
          // Update card text animations based on progress
          // Card 2 text appears when card 2 is ~30% visible
          if (card2Progress > 0.3) {
            const textProgress = (card2Progress - 0.3) / 0.7; // 0 to 1 when card is 30-100% visible
            const textEase = gsap.parseEase('power2.out')(textProgress);
            
            if (cardTitleRefs[1].current) {
              gsap.set(cardTitleRefs[1].current, {
                x: -80 * (1 - textEase),
                opacity: textEase,
                force3D: true
              });
            }
            if (cardDescriptionRefs[1].current) {
              const descProgress = Math.max(0, (card2Progress - 0.4) / 0.6);
              const descEase = gsap.parseEase('power2.out')(descProgress);
              gsap.set(cardDescriptionRefs[1].current, {
                x: 80 * (1 - descEase),
                opacity: descEase,
                force3D: true
              });
            }
            if (cardButtonRefs[1].current) {
              const btnProgress = Math.max(0, (card2Progress - 0.5) / 0.5);
              const btnEase = gsap.parseEase('power2.out')(btnProgress);
              gsap.set(cardButtonRefs[1].current, {
                y: 30 * (1 - btnEase),
                opacity: btnEase,
                force3D: true
              });
            }
          } else {
            // Reset card 2 text when scrolling back
            if (cardTitleRefs[1].current) {
              gsap.set(cardTitleRefs[1].current, { x: -80, opacity: 0, force3D: true });
            }
            if (cardDescriptionRefs[1].current) {
              gsap.set(cardDescriptionRefs[1].current, { x: 80, opacity: 0, force3D: true });
            }
            if (cardButtonRefs[1].current) {
              gsap.set(cardButtonRefs[1].current, { y: 30, opacity: 0, force3D: true });
            }
          }
          
          // Card 3 text appears when card 3 is ~30% visible
          if (card3Progress > 0.3) {
            const textProgress = (card3Progress - 0.3) / 0.7;
            const textEase = gsap.parseEase('power2.out')(textProgress);
            
            if (cardTitleRefs[2].current) {
              gsap.set(cardTitleRefs[2].current, {
                x: -80 * (1 - textEase),
                opacity: textEase,
                force3D: true
              });
            }
            if (cardDescriptionRefs[2].current) {
              const descProgress = Math.max(0, (card3Progress - 0.4) / 0.6);
              const descEase = gsap.parseEase('power2.out')(descProgress);
              gsap.set(cardDescriptionRefs[2].current, {
                x: 80 * (1 - descEase),
                opacity: descEase,
                force3D: true
              });
            }
            if (cardButtonRefs[2].current) {
              const btnProgress = Math.max(0, (card3Progress - 0.5) / 0.5);
              const btnEase = gsap.parseEase('power2.out')(btnProgress);
              gsap.set(cardButtonRefs[2].current, {
                y: 30 * (1 - btnEase),
                opacity: btnEase,
                force3D: true
              });
            }
          } else {
            // Reset card 3 text when scrolling back
            if (cardTitleRefs[2].current) {
              gsap.set(cardTitleRefs[2].current, { x: -80, opacity: 0, force3D: true });
            }
            if (cardDescriptionRefs[2].current) {
              gsap.set(cardDescriptionRefs[2].current, { x: 80, opacity: 0, force3D: true });
            }
            if (cardButtonRefs[2].current) {
              gsap.set(cardButtonRefs[2].current, { y: 30, opacity: 0, force3D: true });
            }
          }
          
          // ========== VISUAL POLISH: PARTICLE EFFECTS ==========
          if (shouldShowParticles && particlesContainer) {
            // Update particle intensity based on card transitions
            const particleIntensity = Math.max(
              easeCard2 * 0.5, // Particles during card 2 transition
              easeCard3 * 0.5  // Particles during card 3 transition
            );
            
            // Update container opacity
            particlesContainer.style.opacity = particleIntensity.toString();
            
            // Create particles during transitions
            if ((card2Progress > 0.1 && card2Progress < 0.9) || (card3Progress > 0.1 && card3Progress < 0.9)) {
              if (!particlesContainer.hasAttribute('data-particles-active')) {
                particlesContainer.setAttribute('data-particles-active', 'true');
                createParticles(particlesContainer, particleIntensity);
              }
            } else {
              particlesContainer.removeAttribute('data-particles-active');
              particlesContainer.innerHTML = ''; // Clear particles when not transitioning
            }
          }
        },
        onLeave: () => {
          // Ensure we don't manipulate DOM if component is unmounting
          if (!isMounted) return;
          isEnteringFromBelow = true; // Mark that we're leaving (will enter from below next time)
        },
        onEnter: () => {
          if (!isMounted) return;
          isEnteringFromBelow = false; // Reset when entering from top
        },
        onEnterBack: () => {
          if (!isMounted) return;
          // On mobile, avoid refresh to prevent jump/stutter when scrolling back up
          // The pin spacing should already be correct, refreshing causes recalculation jump
          if (!isMobile) {
            // Only refresh on desktop where it's needed
            ScrollTrigger.refresh();
          }
          // Reset the tracking flag
          isEnteringFromBelow = false;
        },
      },
    });

    // ========== SET OVERLAY VALUES ONCE (PRESERVE IMAGE COLORS) ==========
    // Set constant overlay values for all cards to preserve image brightness and tone
    // This is done once, not in onUpdate, to prevent color changes during scroll
    const constantIntensity = 0.15; // Same intensity for all cards
    
    // Set overlay for Card 1
    if (cardOverlayRefs[0].current) {
      cardOverlayRefs[0].current.style.setProperty('--gradient-top', `rgba(69, 137, 255, ${constantIntensity * 0.3})`);
      cardOverlayRefs[0].current.style.setProperty('--gradient-mid', `rgba(0, 102, 255, ${constantIntensity * 0.4})`);
      cardOverlayRefs[0].current.style.setProperty('--gradient-bottom', `rgba(0, 0, 0, ${constantIntensity * 0.6})`);
    }
    
    // Set overlay for Card 2 (same as Card 1)
    if (cardOverlayRefs[1].current) {
      cardOverlayRefs[1].current.style.setProperty('--gradient-top', `rgba(69, 137, 255, ${constantIntensity * 0.3})`);
      cardOverlayRefs[1].current.style.setProperty('--gradient-mid', `rgba(0, 102, 255, ${constantIntensity * 0.4})`);
      cardOverlayRefs[1].current.style.setProperty('--gradient-bottom', `rgba(0, 0, 0, ${constantIntensity * 0.6})`);
    }
    
    // Set overlay for Card 3 (same as Card 1)
    if (cardOverlayRefs[2].current) {
      cardOverlayRefs[2].current.style.setProperty('--gradient-top', `rgba(69, 137, 255, ${constantIntensity * 0.3})`);
      cardOverlayRefs[2].current.style.setProperty('--gradient-mid', `rgba(0, 102, 255, ${constantIntensity * 0.4})`);
      cardOverlayRefs[2].current.style.setProperty('--gradient-bottom', `rgba(0, 0, 0, ${constantIntensity * 0.6})`);
    }

    // Animations are now fully driven by onUpdate callback for precise progress-based control
    // This ensures smooth bidirectional animations with perfect scroll synchronization

    // Delay refresh on mobile to let layout settle and prevent jump
    if (isMobile) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      });
    } else {
      ScrollTrigger.refresh();
    }

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
    <>
      {/* Particle Effects Container */}
      <div ref={particlesContainerRef} className="particles-container" />
      
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
                    <div ref={cardOverlayRefs[index]} className="card-overlay"></div>
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
                      ref={cardButtonRefs[index]}
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
    </>
  );
}

export default Work;
