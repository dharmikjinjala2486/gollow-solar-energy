import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, ArrowLeft, Home, BookOpen, Layers } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-16 relative overflow-hidden bg-grid-pattern">
      <SEO
        title="Page Not Found | GOL LOW Solar Rentals"
        description="The requested page could not be found. Return to GOL LOW Solar Energy Systems Rental to explore our zero-CAPEX solar leasing models."
        robots="noindex, nofollow"
      />
      
      {/* Decorative radial gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md mx-auto px-6 text-center relative z-10 flex flex-col items-center gap-6">
        
        {/* Animated Sun Logo */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="relative w-20 h-20 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow"
        >
          <Sun className="w-12 h-12 text-brand-yellow" />
          <div className="absolute inset-0 rounded-2xl bg-brand-yellow/20 blur opacity-75" />
        </motion.div>

        {/* 404 text content */}
        <div className="flex flex-col gap-2.5 mt-2">
          <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
            Error 404
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-sm mt-1.5">
            The page you are trying to access has been moved, renamed, or does not exist. Let's get you back on track.
          </p>
        </div>

        {/* Helpful links grid */}
        <div className="grid grid-cols-2 gap-3.5 w-full mt-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-yellow/30 rounded-xl transition-all duration-300 text-xs font-semibold text-white/80 hover:text-white"
          >
            <Home className="w-4 h-4 text-brand-yellow" />
            <span>Home Page</span>
          </Link>
          <Link
            to="/solutions"
            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-yellow/30 rounded-xl transition-all duration-300 text-xs font-semibold text-white/80 hover:text-white"
          >
            <Layers className="w-4 h-4 text-brand-yellow" />
            <span>Our Solutions</span>
          </Link>
          <Link
            to="/plans"
            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-yellow/30 rounded-xl transition-all duration-300 text-xs font-semibold text-white/80 hover:text-white"
          >
            <Layers className="w-4 h-4 text-brand-yellow" />
            <span>Rental Plans</span>
          </Link>
          <Link
            to="/blog"
            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-yellow/30 rounded-xl transition-all duration-300 text-xs font-semibold text-white/80 hover:text-white"
          >
            <BookOpen className="w-4 h-4 text-brand-yellow" />
            <span>Read Blog</span>
          </Link>
        </div>

        <Link
          to="/"
          className="btn-primary w-full mt-2 text-xs flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
        
      </div>
    </div>
  );
}
