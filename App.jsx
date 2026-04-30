import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import CompactStorySection from './components/CompactStorySection';
import MapSection from './components/MapSection';
import CommunitySection from './components/CommunitySection';
import LocationPage from './components/booking/LocationPage';

const HomePage = () => {
  useEffect(() => {
    const savedY = parseInt(sessionStorage.getItem('vanroots_scroll_pos') || '0', 10);
    const wasOnBookingPage = sessionStorage.getItem('vanroots_hero_played') === 'true';

    if (!wasOnBookingPage || savedY <= 50) return;

    // Ensure react-root has correct margin and is visible before scrolling
    const root = document.getElementById('react-root');
    if (root) {
      root.style.marginTop = '1200vh';
      if (window.gsap) {
        window.gsap.killTweensOf(root);
        window.gsap.set(root, { opacity: 1 });
      }
    }

    // We need to wait for:
    // 1. React to finish mounting this component (1 tick)
    // 2. App.jsx useEffect to restore margin-top: 1200vh (1 tick)
    // 3. Lenis to be fully restarted by LocationPage.goBack (async)
    // 300ms covers all of these safely.
    const timer = setTimeout(() => {
      const lenis = window.__vanrootsLenis;

      // Temporarily stop Lenis so it doesn't intercept or cancel our scroll
      if (lenis) lenis.stop();

      // Use native scrollTo — guaranteed to work
      window.scrollTo({ top: savedY });

      // Give the scroll one paint to settle, then re-enable Lenis
      requestAnimationFrame(() => {
        if (lenis) lenis.start();
        // Refresh GSAP ScrollTrigger so it knows we're mid-page
        if (window.ScrollTrigger) {
          setTimeout(() => window.ScrollTrigger.refresh(), 80);
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      <CompactStorySection />
      <MapSection />
      <CommunitySection />
    </div>
  );
};

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const isBooking = location.pathname.startsWith('/booking/');
    const root = document.getElementById('react-root');

    if (isBooking) {
      document.body.classList.add('booking-route');
      if (root) {
        root.style.marginTop = '0';
        root.style.opacity = '1';
      }
    } else {
      document.body.classList.remove('booking-route');
      // Restore margin — HomePage useEffect handles opacity + scroll
      if (root) root.style.marginTop = '1200vh';
      // Ensure body overflow is clear (belt-and-suspenders)
      document.body.style.overflow = '';
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/booking/:id" element={<LocationPage />} />
    </Routes>
  );
};

export default App;
