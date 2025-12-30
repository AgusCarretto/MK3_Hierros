import './App.css';
import React, { useEffect, useRef } from 'react';
import Home from './components/Home';
import OurWork from './components/OurWork';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ContactUs from './components/ContactUs';
import Hero from './components/Hero';
import WorkDetail from './components/workDetail';

const ScrollToSection = ({ targetRef }) => {
  const { pathname } = useLocation();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    const performScroll = () => {
      const mainNode = targetRef.current;
      const heroNode = document.querySelector('.hero-section');

      const mainRect = mainNode?.getBoundingClientRect();
      const heroRect = heroNode?.getBoundingClientRect();

      const mainTop = mainRect ? mainRect.top + window.scrollY : 0;
      const heroBottom = heroRect ? heroRect.bottom + window.scrollY : 0;
      const scrollTarget = Math.max(mainTop, heroBottom);

      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    };

    requestAnimationFrame(() => {
      setTimeout(performScroll, 30);
    });
  }, [pathname, targetRef]);

  return null;
};

function App() {
  const mainRef = useRef(null);

  return (
    <div className="App">
      <Router>
        <ScrollToSection targetRef={mainRef} />
        <Hero />
        <main ref={mainRef} className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nuestros-trabajos" element={<OurWork />} />
            <Route path="/contactanos" element={<ContactUs />} />
            <Route path="/trabajo/:id" element={<WorkDetail />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
