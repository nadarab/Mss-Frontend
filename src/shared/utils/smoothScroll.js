export const smoothScrollTo = (targetElement, offset = 80) => {
  if (!targetElement) return;

  const startPosition = window.pageYOffset;
  const targetPosition = targetElement.getBoundingClientRect().top + startPosition - offset;
  const distance = targetPosition - startPosition;
  const duration = 1000;
  let startTime = null;

  const animate = (currentTime) => {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easing = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    
    window.scrollTo(0, startPosition + distance * easing);
    
    if (elapsed < duration) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
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

