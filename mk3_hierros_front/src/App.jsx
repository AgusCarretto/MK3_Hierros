import { useEffect, useRef } from "react";
import {
  HashRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";

import { TooltipProvider } from "./components/ui/Tooltip";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import OurWork from "./components/OurWork";
import ContactUs from "./components/ContactUs";
import Hero from "./components/Hero";
import WorkDetail from "./components/workDetail";

const ScrollToSection = ({ targetRef }) => {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    const performScroll = () => {
      const mainNode = targetRef.current;
      const mainRect = mainNode?.getBoundingClientRect();
      const mainTop = mainRect ? mainRect.top + window.scrollY : 0;
      window.scrollTo({ top: mainTop, behavior: "smooth" });
    };

    requestAnimationFrame(() => {
      setTimeout(performScroll, 30);
    });
  }, [pathname, targetRef]);

  return null;
};

const AppRoutes = ({ mainRef }) => {
  const { pathname } = useLocation();
  const showHero = pathname === "/";

  return (
    <>
      <ScrollToSection targetRef={mainRef} />
      <Navbar />
      {showHero && <Hero />}
      <main ref={mainRef} className="relative z-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nuestros-trabajos" element={<OurWork />} />
          <Route path="/contactanos" element={<ContactUs />} />
          <Route path="/trabajo/:id" element={<WorkDetail />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  const mainRef = useRef(null);

  return (
    <TooltipProvider>
      <div className="App">
        <Router>
          <AppRoutes mainRef={mainRef} />
        </Router>
        <Toaster
          theme="dark"
          position="bottom-center"
          toastOptions={{
            style: {
              background: "var(--color-surface-panel-strong)",
              border: "1px solid var(--color-surface-border)",
              color: "var(--color-text-primary)",
            },
          }}
        />
      </div>
    </TooltipProvider>
  );
}

export default App;
