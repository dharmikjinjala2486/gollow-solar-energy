import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin,
  MessageSquare, Clock, ShieldAlert
} from 'lucide-react';
import SEO from '../components/SEO';

export default function Contact() {
  return (
    <div className="pt-24 pb-20 overflow-hidden">
      <SEO
        title="Contact GOL LOW | Solar Rental UAE"
        description="Get in touch with GOL LOW Solar Energy Systems Rental. Reach our Dubai headquarters or use our support hotline for clean energy canopy inquiries across UAE."
        keywords="Best Solar Rental Company Dubai, Affordable Solar Rental Dubai, Solar Energy Company in Dubai, Call Solar Company Dubai, Solar Company Dubai, Solar Panel Rental Company Dubai, Solar Energy Solutions Dubai"
      />
      {/* Header Banner */}
      <section className="relative py-24 bg-grid-pattern bg-[#04111f] border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/10 to-brand-navy pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4 relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest"
          >
            Contact & Support
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-extrabold text-4xl sm:text-5xl text-white tracking-tight"
          >
            Connect with GOL LOW
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base text-white/60 leading-relaxed max-w-2xl mt-2"
          >
            Get in touch with our engineering team, access priority emergency support, or visit our headquarters in Dubai.
          </motion.p>
        </div>
      </section>

      {/* Main Grid Contact Content */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Dubai Headquarters & Map */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="glass-card p-8 flex flex-col justify-between border border-white/10 relative overflow-hidden h-full">
              {/* Decorative radial gradient */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col gap-6 relative z-10">
                <div>
                  <h2 className="font-heading font-extrabold text-2xl text-white">Dubai Headquarters</h2>
                  <p className="text-xs text-white/50 mt-1">Main Engineering Hub & Operations Center</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-white/70 mt-2">
                  <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <MapPin className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-white/80">Location</span>
                      <span className="leading-relaxed">Al Muraqqabat, Port Saeed, Dubai, UAE</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <Clock className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-white/80">Business Hours</span>
                      <span>Mon - Fri (08:00 AM - 06:00 PM)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <Phone className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-white/80">Call Center</span>
                      <a href="tel:+97143377881" className="hover:text-white transition-colors text-sm font-semibold">+971 4 337 7881</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <Mail className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-white/80">Email Communications</span>
                      <a href="mailto:Hr@gollowsolarenergy.com" className="hover:text-white transition-colors text-sm font-semibold break-all">Hr@gollowsolarenergy.com</a>
                    </div>
                  </div>
                </div>

                {/* Styled Dark Theme Google Map */}
                <div className="w-full h-80 relative rounded-xl overflow-hidden border border-white/10 mt-2 group shadow-inner">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.3582498263155!2d55.3289066!3d25.2585252!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5cd5a5d24b61%3A0xe543e387114b0df1!2sPort%20Saeed%2C%20Dubai!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                    className="absolute inset-0 w-full h-full border-0 filter invert-[90%] hue-rotate-[180deg] saturate-[60%] brightness-[92%] contrast-[95%] opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto"
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="GOL LOW Dubai Headquarters Map"
                  ></iframe>
                </div>
              </div>

              {/* Dynamic Action Button */}
              <div className="mt-8 relative z-10">
                <a
                  href="https://wa.me/971509876543"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-green w-full !py-4 flex items-center justify-center gap-3 text-sm font-bold shadow-glow-green"
                >
                  <MessageSquare className="w-5 h-5 fill-white" />
                  <span>Start Live WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Emergency & Live Operations Status */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-5 flex flex-col gap-8 justify-between h-full"
          >
            {/* Emergency Support Panel */}
            <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-2xl flex flex-col gap-6 text-left relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.03)] hover:border-red-500/35 transition-colors duration-500">
              <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-3 text-red-400 relative z-10">
                <div className="relative">
                  <ShieldAlert className="w-7 h-7 text-red-500" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                </div>
                <h2 className="font-heading font-extrabold text-sm uppercase tracking-wider text-white">
                  Emergency 24/7 Hotline
                </h2>
              </div>

              <p className="text-xs text-white/60 leading-relaxed relative z-10">
                If you have an active hybrid container installation, smart solar array, or rental power grid that requires emergency electrical troubleshooting, call our duty engineer.
              </p>

              <a
                href="tel:+971509876543"
                className="flex items-center justify-center gap-3 bg-red-600/90 hover:bg-red-600 text-white font-heading font-bold text-sm tracking-wider py-4 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300 hover:scale-[1.01] active:scale-95 relative z-10"
              >
                <Phone className="w-4 h-4" />
                <span>Call Support: +971 50 987 6543</span>
              </a>
            </div>

            {/* UAE Fleet Status Dashboard */}
            <div className="glass-card p-8 text-left border border-white/10 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-heading font-bold text-base text-white">UAE Fleet Operations</h2>
                  <span className="text-[10px] font-bold text-brand-green bg-brand-green/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-brand-green/20">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-green"></span>
                    </span>
                    Live Grid
                  </span>
                </div>
                
                <p className="text-xs text-white/60 leading-relaxed mb-6">
                  Real-time connectivity status of GOL LOW hybrid power grids, smart solar containers, and dynamic battery storage units across the United Arab Emirates.
                </p>

                <div className="flex flex-col gap-3.5">
                  {[
                    { name: 'Dubai Grid', status: 'Online', count: '14 Active Systems' },
                    { name: 'Abu Dhabi Grid', status: 'Online', count: '9 Active Systems' },
                    { name: 'Sharjah & Northern Emirates', status: 'Online', count: '7 Active Systems' },
                  ].map((loc, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-green relative flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-brand-green opacity-40"></span>
                        </div>
                        <span className="text-xs font-semibold text-white/90">{loc.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-white/40 block font-heading">{loc.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40">
                <span>Operations Sync: 100%</span>
                <span>Security Level: Tier 3</span>
              </div>
            </div>

          </motion.div>

        </div>
      </section>
    </div>
  );
}
