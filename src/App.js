import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, VideoGallery, DesignGallery, BrandingGallery } from './features/home';
import { ScrollToTop } from './shared/components';
import './shared/styles/App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/video" element={<VideoGallery />} />
        <Route path="/work/design" element={<DesignGallery />} />
        <Route path="/work/branding" element={<BrandingGallery />} />
      </Routes>
    </Router>
  );
}

export default App;
