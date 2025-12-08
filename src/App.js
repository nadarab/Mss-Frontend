import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, VideoGallery, DesignGallery, BrandingGallery } from './features/home';
import { ScrollToTop } from './shared/components';
import TestFirestore from './components/TestFirestore';
import AdminPanel from './components/AdminPanel';
import './shared/styles/App.css';
// Firebase is initialized in firebase/config.js
import './firebase/config';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/video" element={<VideoGallery />} />
        <Route path="/work/design" element={<DesignGallery />} />
        <Route path="/work/branding" element={<BrandingGallery />} />
        <Route path="/test-firestore" element={<TestFirestore />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
