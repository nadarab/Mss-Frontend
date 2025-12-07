import React, { useEffect } from 'react';
import HeroSection from '../../hero';
import Services from '../../services';
import OurClient from '../../clients';
import Work from '../../work';
import AboutAndTeam from '../../about/components/AboutAndTeam';
import ContactUs from '../../contact';
import Footer from '../../../shared/components/Footer';
import { initSmoothScroll } from '../../../shared/utils/smoothScroll';

function HomePage() {
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  return (
    <>
      <HeroSection />
      <Services />
      <Work />
      <OurClient />
      <AboutAndTeam />
      <ContactUs />
      <Footer />
    </>
  );
}

export default HomePage;

