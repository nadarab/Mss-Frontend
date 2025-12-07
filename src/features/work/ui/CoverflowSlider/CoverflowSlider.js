import React, { useState, useEffect } from 'react';
import './CoverflowSlider.css';

function CoverflowSlider({ slides, autoPlay = false, autoPlayInterval = 5000 }) {
  const [items, setItems] = useState(slides);

  const handleNext = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.push(newItems.shift());
      return newItems;
    });
  };

  const handlePrev = () => {
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems.unshift(newItems.pop());
      return newItems;
    });
  };

  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [items, autoPlay, autoPlayInterval]);

  return (
    <main className="coverflow-main">
      <ul className="slider">
        {items.map((slide, index) => (
          <li
            key={slide.id || index}
            className="item"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="content">
              <h2 className="title">{slide.title}</h2>
              <p className="description">{slide.description}</p>
              {slide.buttonText && (
                <button onClick={slide.buttonAction}>
                  {slide.buttonText}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <nav className="nav">
        <button 
          className="btn prev" 
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button 
          className="btn next" 
          onClick={handleNext}
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </nav>
    </main>
  );
}

export default CoverflowSlider;

