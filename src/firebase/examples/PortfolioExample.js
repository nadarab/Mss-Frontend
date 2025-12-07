// Example: Dynamic Portfolio with Firebase
// This shows how to fetch and display portfolio items from Firestore

import React, { useEffect, useState } from 'react';
import { getWorkItems } from '../index';

function PortfolioExample() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      setLoading(true);
      const items = await getWorkItems();
      setWorks(items);
      setError(null);
    } catch (err) {
      setError('Failed to load portfolio items');
      console.error('Error fetching portfolio:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorks = filter === 'all' 
    ? works 
    : works.filter(work => work.category === filter);

  const categories = ['all', ...new Set(works.map(work => work.category))];

  if (loading) {
    return (
      <div className="portfolio-loading">
        <div className="spinner"></div>
        <p>Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-error">
        <p>{error}</p>
        <button onClick={fetchPortfolioItems}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="portfolio-container">
      <div className="portfolio-filters">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${filter === category ? 'active' : ''}`}
            onClick={() => setFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="portfolio-grid">
        {filteredWorks.length === 0 ? (
          <p className="no-items">No portfolio items found</p>
        ) : (
          filteredWorks.map(work => (
            <div key={work.id} className="portfolio-item">
              <div className="portfolio-image">
                <img src={work.imageUrl} alt={work.title} />
                {work.featured && <span className="badge">Featured</span>}
              </div>
              <div className="portfolio-content">
                <h3>{work.title}</h3>
                <p className="category">{work.category}</p>
                <p className="description">{work.description}</p>
                {work.client && (
                  <p className="client">Client: {work.client}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PortfolioExample;

