import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Calculator, PhoneCall, MessageSquare, ChevronDown } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Solutions', path: '/solutions' },
  { name: 'Projects', path: '/projects' },
  { name: 'Rental Plans', path: '/plans' },
  { name: 'Blog', path: '/blog' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page change
  useEffect(() => {
    setMobileMenuOpen(false);
    setAiMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll and toggle PWA elements when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.classList.add('mobile-menu-active');
      window.lenis?.stop();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('mobile-menu-active');
      window.lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('mobile-menu-active');
      window.lenis?.start();
    };
  }, [mobileMenuOpen]);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'py-4 bg-brand-navy/85 backdrop-blur-md border-b border-white/10 shadow-lg' 
          : 'py-6 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/30 group-hover:bg-brand-yellow/20 group-hover:border-brand-yellow transition-all duration-300">
            <Sun className="w-6 h-6 text-brand-yellow animate-spin-slow" />
            <div className="absolute inset-0 rounded-lg bg-brand-yellow/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-lg tracking-wider text-white">
              GOL LOW
            </span>
            <span className="text-[9px] font-heading tracking-[0.2em] text-brand-yellow -mt-1 font-semibold">
              SOLAR RENTALS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className="relative text-sm font-medium tracking-wide text-white/80 hover:text-white transition-colors duration-300 py-2"
              >
                {link.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* AI Assistant Nav Link */}
          <button
            onClick={() => {
              const chatBtn = document.getElementById('chat-trigger-btn');
              if (chatBtn) chatBtn.click();
            }}
            className="flex items-center gap-1.5 text-sm font-medium tracking-wide text-white/80 hover:text-white transition-colors duration-300 py-2 text-left"
          >
            <MessageSquare className="w-4 h-4 text-brand-yellow shrink-0" />
            <span>AI Assistant</span>
          </button>
        </nav>

        {/* Action Button & Hamburger */}
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden sm:flex btn-primary !py-2.5 !px-5 text-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Consultation</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden absolute top-full left-0 right-0 bg-brand-navy border-b border-white/10 overflow-hidden shadow-2xl z-40"
          >
            <div className="px-6 py-8 flex flex-col gap-6 max-h-[85vh] overflow-y-auto">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`text-lg font-heading font-medium tracking-wide py-2 ${
                        isActive ? 'text-brand-yellow' : 'text-white/80'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="h-px bg-white/10 my-2" />

              {/* Mobile AI Tools section */}
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    const chatBtn = document.getElementById('chat-trigger-btn');
                    if (chatBtn) chatBtn.click();
                  }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10 text-left"
                >
                  <MessageSquare className="w-5 h-5 text-sky-400" />
                  <div className="text-sm font-semibold">AI Assistant Chat</div>
                </button>
              </div>

              <Link
                to="/contact"
                className="btn-primary w-full mt-4"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Get Free Consultation</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
