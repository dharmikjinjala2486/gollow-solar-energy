import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { Analytics } from '@vercel/analytics/react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ChatAssistant from './components/ai/ChatAssistant';

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Solutions = lazy(() => import('./pages/Solutions'));
const Projects = lazy(() => import('./pages/Projects'));
const RentalPlans = lazy(() => import('./pages/RentalPlans'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
    });

    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.lenis = null;
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-brand-navy">
        {/* Navigation Glass Bar */}
        <Navbar />

        {/* Core Main Viewport */}
        <main className="flex-1">
          <Suspense fallback={
            <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest animate-pulse">GOL LOW Solar Energy</span>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/plans" element={<RentalPlans />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Global Floating AI Assistant Widget */}
        <ChatAssistant />

        {/* Brand footer grid */}
        <Footer />

        {/* Vercel Web Analytics */}
        <Analytics />
      </div>
    </Router>
  );
}
