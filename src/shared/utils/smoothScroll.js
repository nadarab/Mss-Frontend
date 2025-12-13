// Store the current animation frame ID to allow cancellation
let currentAnimationFrame = null;

export const smoothScrollTo = (targetElement, offset = 80) => {
  if (!targetElement) return;

  // Cancel any ongoing scroll animation
  if (currentAnimationFrame !== null) {
    cancelAnimationFrame(currentAnimationFrame);
    currentAnimationFrame = null;
  }

  const startPosition = window.pageYOffset || window.scrollY;
  const targetPosition = targetElement.getBoundingClientRect().top + startPosition - offset;
  const distance = targetPosition - startPosition;
  
  // Faster duration for quick response (400ms)
  const duration = 400;
  let startTime = null;

  const animate = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easing = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo({
      top: startPosition + distance * easing,
      behavior: 'auto' // Use 'auto' to avoid conflicts with CSS scroll-behavior
    });
    
    if (elapsed < duration) {
      currentAnimationFrame = requestAnimationFrame(animate);
    } else {
      currentAnimationFrame = null;
    }
  };

  currentAnimationFrame = requestAnimationFrame(animate);
};

export const handleHashChange = () => {
  const hash = window.location.hash;
  if (hash) {
    const targetId = hash.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      setTimeout(() => {
        smoothScrollTo(targetElement);
      }, 0);
    }
  }
};

export const initSmoothScroll = () => {
  window.addEventListener('hashchange', handleHashChange);
  
  if (window.location.hash) {
    setTimeout(() => {
      handleHashChange();
    }, 100);
  }
  
  return () => {
    window.removeEventListener('hashchange', handleHashChange);
  };
};

