import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HomePage, VideoGallery, DesignGallery, BrandingGallery } from './features/home';
import { ScrollToTop } from './shared/components';
import ErrorBoundary from './shared/components/ErrorBoundary';
import TestFirestore from './components/TestFirestore';
import AdminPanel from './components/AdminPanel';
import './shared/styles/App.css';
// Firebase is initialized in firebase/config.js
import './firebase/config';

function AppRoutes() {
  const location = useLocation();
  
  return (
    <ErrorBoundary location={location}>
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage key="home" />} />
        <Route path="/work/video" element={<VideoGallery key="video" />} />
        <Route path="/work/design" element={<DesignGallery key="design" />} />
        <Route path="/work/branding" element={<BrandingGallery key="branding" />} />
        <Route path="/test-firestore" element={<TestFirestore key="test" />} />
        <Route path="/admin" element={<AdminPanel key="admin" />} />
      </Routes>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
