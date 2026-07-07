import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Mail, Phone, MapPin, Send, ShieldAlert, ExternalLink } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
        .then((res) => {
          if (res.status === 409) {
            alert('This email address is already subscribed to our newsletter.');
            throw new Error('Duplicate subscription');
          }
          if (!res.ok) throw new Error('API subscription error');
          return res.json();
        })
        .then(() => {
          setSubscribed(true);
          setEmail('');
          setTimeout(() => setSubscribed(false), 5000);
        })
        .catch((err) => {
          if (err.message !== 'Duplicate subscription') {
            console.error('Subscription failed:', err);
            alert('Subscription failed. Please check connections and try again.');
          }
        });
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#030d16] border-t border-white/10 pt-20 pb-10 overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-yellow/10 border border-brand-yellow/30">
                <Sun className="w-6 h-6 text-brand-yellow" />
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
            <p className="text-white/60 text-sm leading-relaxed max-w-sm">
              Empowering residential, commercial, and industrial facilities across the United Arab Emirates with zero upfront investment solar energy rentals. Realize immediate utility savings and reduce your carbon footprint today.
            </p>
            
            <div className="flex flex-col gap-3">
              <h4 className="font-heading font-semibold text-sm tracking-wider uppercase text-white/80">
                Subscribe to Solar Insights
              </h4>
              <form onSubmit={handleSubscribe} className="relative flex max-w-sm">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  required
                  className="w-full bg-white/5 border border-white/15 focus:border-brand-yellow/50 focus:outline-none rounded-full px-5 py-3 text-xs transition-colors duration-300 placeholder:text-white/30 text-white"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 bg-brand-yellow hover:bg-brand-yellow/90 text-brand-navy rounded-full px-4 flex items-center justify-center transition-colors duration-300 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              {subscribed && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-brand-green font-medium"
                >
                  Thank you! You have successfully subscribed to our newsletter.
                </motion.span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-bold text-xs tracking-widest text-brand-yellow uppercase">
              Services
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-white/60">
              <li><Link to="/solutions" className="hover:text-white transition-colors duration-300">Commercial Solar</Link></li>
              <li><Link to="/solutions" className="hover:text-white transition-colors duration-300">Industrial Solar</Link></li>
              <li><Link to="/solutions" className="hover:text-white transition-colors duration-300">Construction Site Rentals</Link></li>
              <li><Link to="/solutions" className="hover:text-white transition-colors duration-300">Residential Systems</Link></li>
              <li><Link to="/solutions" className="hover:text-white transition-colors duration-300">Battery Storage Systems</Link></li>
              <li><Link to="/solutions" className="hover:text-white transition-colors duration-300">Maintenance & Operations</Link></li>
            </ul>
          </div>

          {/* Industries served */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-bold text-xs tracking-widest text-brand-yellow uppercase">
              Industries
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-white/60">
              <li><Link to="/projects" className="hover:text-white transition-colors duration-300">Construction Sites</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors duration-300">Logistics & Warehouses</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors duration-300">Manufacturing Plants</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors duration-300">Hotels & Resorts</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors duration-300">Schools & Hospitals</Link></li>
              <li><Link to="/projects" className="hover:text-white transition-colors duration-300">Government Buildings</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-bold text-xs tracking-widest text-brand-yellow uppercase">
              Contact Us
            </h4>
            <div className="flex flex-col gap-3.5 text-sm text-white/60">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                <span className="leading-tight">Al Muraqqabat, Port Saeed, Dubai, United Arab Emirates</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-yellow shrink-0" />
                <a href="tel:+97143377881" className="hover:text-white transition-colors duration-300">+971 4 337 7881</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-yellow shrink-0" />
                <a href="mailto:Hr@gollowsolarenergy.com" className="hover:text-white transition-colors duration-300">Hr@gollowsolarenergy.com</a>
              </div>
              
              {/* Emergency Hotline */}
              <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">24/7 Technical Support</div>
                  <a href="tel:+971509876543" className="text-xs text-red-400 hover:text-red-300 font-semibold transition-colors duration-300">+971 50 987 6543</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 text-xs text-white/40">
          <div className="flex items-center gap-6">
            <span>© {currentYear} GOL LOW Solar Energy Systems Rental. All rights reserved.</span>
            <span className="hidden sm:inline">|</span>
            <span>Licensed by DEWA & RSB Dubai</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/contact" className="hover:text-white transition-colors duration-300">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-white transition-colors duration-300">Terms of Service</Link>
            
            {/* Social media links */}
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-brand-yellow hover:border-brand-yellow/50 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-brand-yellow hover:border-brand-yellow/50 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-brand-yellow hover:border-brand-yellow/50 transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
