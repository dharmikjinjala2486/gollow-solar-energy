import { useState, useRef, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Sun, ArrowRight, Zap, Shield, Sparkles, Building, Landmark, Forklift, HardHat, Hotel,
  HelpCircle, ChevronDown, CheckCircle2, ChevronRight, User, Star, MapPin, Phone, Mail
} from 'lucide-react';

import SEO from '../components/SEO';

const SolarCanvas = lazy(() => import('../components/canvas/SolarCanvas'));
const EarthCanvas = lazy(() => import('../components/canvas/EarthCanvas'));

// Trusted Companies marquee items
const clientMarquee = [
  'Construction Sites', 'Industrial Facilities', 'Commercial Office Buildings',
  'Warehouses & Logistics', 'Hotels & Hospitality', 'Schools & Universities',
  'Hospitals & Healthcare', 'Agricultural Farms', 'Infrastructure & Government'
];

// Services data
const servicesData = [
  { title: 'Residential Solar Rental', icon: Sun, desc: 'Zero upfront solar installations for villa homeowners with lower grid bills.', tag: 'Home' },
  { title: 'Commercial Solar Rental', icon: Building, desc: 'Tailored corporate leases to reduce commercial peak tariff burdens.', tag: 'Enterprise' },
  { title: 'Industrial Solar Rental', icon: Forklift, desc: 'High-voltage PV structures designed for factories and high-load facilities.', tag: 'Heavy' },
  { title: 'Construction Site Solar', icon: HardHat, desc: 'Solar-diesel hybrid rentals replacing traditional polluting generator lines.', tag: 'Off-grid' },
  { title: 'Battery Storage Rental', icon: Zap, desc: 'Modular industrial battery storage containers for continuous backup.', tag: 'Power' },
  { title: 'Solar Panels Rental', icon: Sparkles, desc: 'Flexible short and long-term PV panel leases with quick scaling options.', tag: 'Hardware' },
  { title: 'Inverter Rental Systems', icon: Zap, desc: 'Premium smart inverters paired with grid stabilization technologies.', tag: 'Hardware' },
  { title: 'Installation & Commissioning', icon: Shield, desc: 'Turnkey setup by licensed, certified solar engineers.', tag: 'Service' },
  { title: 'Preventive Maintenance', icon: Shield, desc: 'Regular cleanings, drone inspections, and inverter servicing included.', tag: 'Support' },
  { title: 'Monitoring & Optimization', icon: Sparkles, desc: 'Real-time telemetry and power output alerts via IoT gateways.', tag: 'Support' },
  { title: 'Energy Consultation', icon: Landmark, desc: 'Comprehensive audits, ROI reports, and Shams Dubai authorization.', tag: 'Consulting' }
];

// How It Works Steps
const stepsData = [
  { step: '01', title: 'Consultation', desc: 'Brief audit of utility bills and energy patterns.' },
  { step: '02', title: 'Site Survey', desc: 'Drone scanning of rooftop loading capabilities.' },
  { step: '03', title: 'Customized Design', desc: '3D structural layout & electrical sizing diagrams.' },
  { step: '04', title: 'Installation', desc: 'Secure mounting of PV arrays & integration by engineers.' },
  { step: '05', title: 'Commissioning', desc: 'Grid synchronized testing and authority signoff.' },
  { step: '06', title: 'Monitoring', desc: '24/7 telemetry activation for immediate savings tracking.' },
  { step: '07', title: 'Maintenance', desc: 'Periodic manual cleanings & automated performance checks.' }
];

// Benefits KPIs
const benefitsData = [
  { title: 'Electricity Cost Offset', val: 'Up to 35%', sub: 'Immediate grid bill reduction' },
  { title: 'Upfront Capital Required', val: '0 AED', sub: 'Fully asset-financed solar setups' },
  { title: 'Carbon Emissions Avoided', val: '45,000 Tons', sub: 'Equivalent to planting 2M+ trees' },
  { title: 'Diesel Fuel Savings', val: 'Up to 60%', sub: 'Saved in hybrid construction setups' },
  { title: 'Emergency Backup Storage', val: '24/7', sub: 'Zero-downtime battery transition' },
  { title: 'Maintenance & O&M Fees', val: '0 AED', sub: 'Included throughout the lease period' }
];

// Featured Projects
const projectsData = [
  { name: 'Al Maktoum Industrial Solar Hub', category: 'Industrial', location: 'Jebel Ali, Dubai', capacity: '1.2 MWp', generation: '2.0 GWh/yr', savings: '450,000 AED/yr', date: '2025' },
  { name: 'Marina Heights Commercial Canopy', category: 'Commercial', location: 'Dubai Marina', capacity: '450 kWp', generation: '760 MWh/yr', savings: '190,000 AED/yr', date: '2025' },
  { name: 'EcoVillas Estate PV Cluster', category: 'Residential', location: 'Yas Island, Abu Dhabi', capacity: '180 kWp', generation: '310 MWh/yr', savings: '68,000 AED/yr', date: '2026' },
  { name: 'E22 Road Highway Site Setup', category: 'Construction', location: 'Al Ain Border, UAE', capacity: '350 kWp + 600 kWh Battery', generation: '600 MWh/yr', savings: 'Diesel cut by 55%', date: '2026' }
];

// FAQ list
const faqData = [
  { q: "What is solar system rental, and how does GOL LOW handle it?", a: "Solar rental is a solar leasing program where GOL LOW covers all design, equipment, and installation costs. You simply pay a flat monthly fee to use the electricity generated, which is significantly lower than the standard utility tariff." },
  { q: "How long does the installation take?", a: "Residential villas take 3-5 days. Commercial rooftops take 3-6 weeks, and large industrial facilities take 6-10 weeks depending on structure and regulatory approvals from authorities like DEWA." },
  { q: "Are maintenance and cleaning included in the rental plan?", a: "Yes. GOL LOW provides full operations & maintenance (O&M) services, including scheduled panel washings, electrical checks, and remote troubleshooting, with zero additional charges." },
  { q: "What happens if it is a cloudy day or night time?", a: "Your building remains connected to the main utility grid, which automatically supplies power when solar is unavailable. If you rent our Battery Storage systems, power transitions seamlessly to battery backup." }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [sliderPosition, setSliderPosition] = useState(50); // for traditional vs solar comparison
  const [openFaq, setOpenFaq] = useState(null);

  // Scroll parallax reference
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Filter projects
  const filteredProjects = activeFilter === 'All'
    ? projectsData
    : projectsData.filter(p => p.category === activeFilter);

  const homeSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'GOL LOW Solar Energy Systems Rental',
      'url': 'https://www.gollowsolarenergy.com',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://www.gollowsolarenergy.com/blog?search={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqData.map(item => ({
        '@type': 'Question',
        'name': item.q,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.a
        }
      }))
    }
  ];

  return (
    <div ref={containerRef} className="relative w-full">
      <SEO
        title="GOL LOW | Premium Solar Energy Systems Rental UAE & India"
        description="GOL LOW Solar Energy Systems Rental offers zero-upfront commercial solar panels, industrial solar leasing, and construction site hybrid power grid rentals across Dubai, Abu Dhabi, UAE, and India."
        keywords="Gol Low Solar Energy, Gol Low, Gol Low Solar, Solar Energy Dubai, Solar Rental Dubai, Solar Panel Rental Dubai, Solar Leasing Dubai, Solar System Rental UAE, Commercial Solar UAE, Industrial Solar UAE, Solar Company Dubai, Solar Power Dubai, Solar Energy Company UAE, Solar Installation Dubai, Solar Rental Company, Solar Panels, Solar Energy, Solar Solutions, Renewable Energy, Clean Energy, Green Energy, Solar ROI, Solar Savings, Warehouse Solar, Villa Solar, Factory Solar, Business Solar, Solar Investment, Solar Power UAE, India Solar Company, Solar Rental India, Solar Energy India, Commercial Solar India, Industrial Solar India"
        schemaList={homeSchemas}
      />
      {/* 1. HERO SECTION */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-grid-pattern"
      >
        <div className="absolute inset-0 bg-[#061b2d]/60 z-0" />

        {/* Animated Sunlight rays effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-yellow/10 rounded-full blur-[120px] animate-pulse pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          {/* Left Column Text */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 bg-brand-yellow/10 border border-brand-yellow/30 px-4 py-1.5 rounded-full w-fit">
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
                Zero Upfront Investment
              </span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight">
              Rent Smart.<br />
              <span className="text-brand-yellow text-glow-yellow">Save More.</span><br />
              Power Sustainably.
            </h1>

            <p className="text-sm sm:text-base text-white/70 max-w-lg leading-relaxed">
              Reliable solar energy rental solutions for Residential, Commercial, Industrial, and Construction projects across the UAE. Offset grid costs immediately.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <Link to="/contact" className="btn-primary w-full sm:w-auto">
                <span>Get Free Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/solutions" className="btn-secondary w-full sm:w-auto">
                Explore Solutions
              </Link>
            </div>

            {/* Micro Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-8 border-t border-white/10 mt-4">
              <div>
                <span className="text-xl sm:text-2xl font-heading font-extrabold text-white">0 AED</span>
                <span className="text-[10px] text-white/50 block uppercase tracking-wider mt-1">Capital Investment</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-heading font-extrabold text-brand-yellow">Up to 35%</span>
                <span className="text-[10px] text-white/50 block uppercase tracking-wider mt-1">Tariff Reduction</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-heading font-extrabold text-brand-green">24/7</span>
                <span className="text-[10px] text-white/50 block uppercase tracking-wider mt-1">O&M Operations</span>
              </div>
            </div>
          </div>

          {/* Right Column - 3D Render Canvas */}
          <div className="lg:col-span-6 w-full flex items-center justify-center relative min-h-[400px]">
            {/* Ambient solar particle background */}
            <div className="absolute inset-0 bg-[#4caf50]/5 rounded-full blur-[80px] pointer-events-none" />
            <Suspense fallback={
              <div className="w-full h-[400px] flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/5 backdrop-blur-md">
                <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-[10px] text-white/40 tracking-wider font-heading uppercase">Loading 3D Solar Model...</span>
              </div>
            }>
              <SolarCanvas />
            </Suspense>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] font-heading uppercase tracking-widest text-white/40">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3.5 bg-brand-yellow rounded-full"
          />
        </div>
      </motion.section>

      {/* 2. TRUSTED COMPANIES SECTION (Marquee) */}
      <section className="py-12 bg-[#04111f] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
          <span className="text-[10px] font-heading font-bold uppercase tracking-[0.25em] text-white/30">
            Trusted Energy Services For Core Industries
          </span>
        </div>

        {/* Infinite Marquee */}
        <div className="relative flex items-center">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {/* First Set */}
            {clientMarquee.map((client, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white/40 text-sm font-semibold tracking-wider uppercase font-heading">
                <Sun className="w-4 h-4 text-brand-yellow/40 shrink-0" />
                <span>{client}</span>
              </div>
            ))}
            {/* Second Set (Duplicate for smooth transition) */}
            {clientMarquee.map((client, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-3 text-white/40 text-sm font-semibold tracking-wider uppercase font-heading">
                <Sun className="w-4 h-4 text-brand-yellow/40 shrink-0" />
                <span>{client}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. WHY SOLAR RENTAL (Interactive comparison) */}
      <section className="py-24 bg-[#030d16] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-3 mb-16">
            <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
              Financial & Environmental ROI
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Why Solar Rental?
            </h2>
            <p className="text-sm text-white/60 max-w-xl">
              Traditional Diesel Generators vs. GOL LOW Managed Solar Rentals. See the clean, silent difference.
            </p>
          </div>

          {/* Interactive Before-After Slider Container */}
          <div className="max-w-4xl mx-auto glass-card overflow-hidden relative min-h-[400px] border border-white/10 shadow-2xl flex flex-col md:flex-row">

            {/* Left side: Diesel Generator (Red/Dark) */}
            <div className="flex-1 p-8 bg-red-950/15 border-r border-white/5 flex flex-col gap-6 text-left justify-center">
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Traditional Diesel Generator</span>
              </div>
              <ul className="space-y-4">
                {['High diesel fuel refilling costs', 'Noisy engine operation (75+ dB)', 'Heavy carbon dioxide exhaust', 'Regular oil filters & radiator breakdowns', 'Vulnerable to localized fuel price spikes'].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/60">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vertical dividing element */}
            <div className="hidden md:flex flex-col items-center justify-center relative px-2">
              <div className="w-px h-full bg-white/10" />
              <div className="absolute w-8 h-8 rounded-full bg-brand-yellow border border-brand-navy flex items-center justify-center text-brand-navy font-heading font-bold text-xs shadow-md">
                VS
              </div>
            </div>

            {/* Right side: Solar Rental (Green/Yellow) */}
            <div className="flex-1 p-8 bg-brand-green/5 flex flex-col gap-6 text-left justify-center">
              <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full w-fit">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest">GOL LOW Solar Rental</span>
              </div>
              <ul className="space-y-4">
                {['Zero fuel requirements (100% sunlight)', 'Completely silent PV operation', 'Zero operational greenhouse emissions', 'Full O&M support & scheduled cleanings included', 'Flat lease billing (immediate utility savings)'].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="text-brand-green font-bold shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 4. OUR SERVICES SECTION */}
      <section className="py-24 bg-[#04111f] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="text-left flex flex-col gap-3">
              <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
                Our Fleet Solutions
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                Comprehensive Solar Services
              </h2>
            </div>
            <Link to="/solutions" className="btn-secondary text-xs">
              <span>View All Solutions</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service, idx) => {
              const IconComp = service.icon;
              return (
                <div
                  key={idx}
                  className="glass-card p-6 flex flex-col items-start gap-4 text-left group hover:bg-[#061B2D]/90 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-yellow/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="p-3 bg-brand-yellow/10 rounded-xl text-brand-yellow group-hover:scale-110 transition-transform duration-300">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-heading font-bold text-base text-white group-hover:text-brand-yellow transition-colors duration-300">
                        {service.title}
                      </h3>
                      <span className="text-[9px] bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                        {service.tag}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed mt-1">
                      {service.desc}
                    </p>
                  </div>

                  <Link
                    to="/solutions"
                    className="mt-4 text-xs font-heading font-semibold text-brand-yellow/80 hover:text-brand-yellow flex items-center gap-1 group/btn"
                  >
                    <span>Learn More</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (Timeline) */}
      <section className="py-24 bg-[#030d16] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-3 mb-16">
            <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
              Seamless Integration
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              The Solar Leasing Journey
            </h2>
            <p className="text-sm text-white/60 max-w-xl">
              From engineering layout to active savings tracking: we manage the complete lifecycle.
            </p>
          </div>

          {/* Timeline Scrollable Row */}
          <div className="relative overflow-x-auto pb-8 scrollbar-none flex gap-8 snap-x snap-mandatory">
            {/* SVG Connecting Energy Line Background */}
            <div className="absolute top-1/4 left-10 right-10 h-0.5 bg-gradient-to-r from-brand-yellow to-brand-green/20 pointer-events-none hidden lg:block" />

            {stepsData.map((step, idx) => (
              <div
                key={idx}
                className="min-w-[280px] flex-1 max-w-[320px] snap-center glass-card p-6 relative flex flex-col items-start gap-4 text-left border border-white/5 bg-[#04111f]/60"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow font-heading font-extrabold text-lg">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BENEFITS KPI DASHBOARD */}
      <section className="py-24 bg-[#04111f] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-3 mb-16">
            <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
              Performance Targets
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Key Performance Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefitsData.map((benefit, idx) => (
              <div key={idx} className="bg-[#061b2d] border border-white/5 rounded-2xl p-6 flex flex-col items-start gap-3 text-left">
                <span className="text-xs text-brand-yellow font-heading font-bold tracking-wider uppercase block">
                  {benefit.title}
                </span>
                <span className="text-3xl font-heading font-black text-white mt-1 block">
                  {benefit.val}
                </span>
                <span className="text-xs text-white/50 leading-relaxed block border-t border-white/5 pt-2 w-full">
                  {benefit.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FEATURED PROJECTS GALLERY */}
      <section className="py-24 bg-[#030d16] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="text-left flex flex-col gap-3">
              <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
                Case Studies
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                Featured Installations
              </h2>
            </div>

            {/* Project Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Commercial', 'Residential', 'Industrial', 'Construction'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all duration-300 ${activeFilter === tab
                      ? 'bg-brand-yellow border-brand-yellow text-brand-navy'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Project List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="glass-card p-6 flex flex-col gap-4 text-left border border-white/10"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-wider block mb-1">
                        {project.category} • {project.location}
                      </span>
                      <h3 className="font-heading font-extrabold text-lg text-white">
                        {project.name}
                      </h3>
                    </div>
                    <span className="text-[10px] bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded-full uppercase">
                      Completed {project.date}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 bg-[#04111f] border border-white/5 rounded-xl p-4 mt-2">
                    <div>
                      <span className="text-[9px] text-white/40 uppercase block">Installed Capacity</span>
                      <span className="text-xs font-heading font-bold text-white mt-1 block">{project.capacity}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 uppercase block">Power Gen</span>
                      <span className="text-xs font-heading font-bold text-white mt-1 block">{project.generation}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-white/40 uppercase block">Net Savings</span>
                      <span className="text-xs font-heading font-bold text-brand-green mt-1 block">{project.savings}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 8. SUSTAINABILITY SECTION (Earth visual) */}
      <section className="py-24 bg-[#04111f] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Visual Globe */}
          <div className="lg:col-span-6 w-full flex items-center justify-center min-h-[400px]">
            <Suspense fallback={
              <div className="w-full h-[400px] flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/5 backdrop-blur-md">
                <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-[10px] text-white/40 tracking-wider font-heading uppercase">Loading 3D Globe...</span>
              </div>
            }>
              <EarthCanvas />
            </Suspense>
          </div>

          {/* Right Column: Text & Call to Action */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <span className="text-xs font-heading font-semibold text-brand-green uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
              UAE Net Zero 2050 Alignment
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Pioneering Energy Decarbonization
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              In coordination with the Dubai Clean Energy Strategy and UAE Net Zero 2050, we finance, build, and deploy localized solar energy structures. By replacing heavy construction diesel units with modular solar container configurations, we eliminate grid leakage and build resilient power networks.
            </p>

            <div className="flex flex-col gap-4 bg-white/5 border border-white/5 rounded-2xl p-5 mt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-green shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-heading font-bold text-white uppercase tracking-wider">Fully Licensed by Regulatory Authorities</h4>
                  <p className="text-[11px] text-white/50 mt-0.5">Authorized for grid parallel connection and net energy metering across all UAE emirates.</p>
                </div>
              </div>
            </div>

            <Link to="/contact" className="btn-primary w-fit mt-2">
              <span>Calculate Carbon Footprint Offset</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section className="py-24 bg-[#030d16] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-3 mb-16">
            <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
              Customer Success
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Partner Experiences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1 */}
            <div className="glass-card p-6 flex flex-col justify-between gap-6 text-left">
              <div className="flex items-center gap-1 text-brand-yellow">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-yellow" />)}
              </div>
              <p className="text-sm text-white/80 italic leading-relaxed">
                "Switching our warehouse logistics roofs to GOL LOW rentals was completely seamless. There was no upfront CAPEX, and our monthly electricity bills were immediately offset by 28%. The preventive washing services have kept power output peak all year."
              </p>
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-brand-yellow/10 flex items-center justify-center font-heading font-bold text-brand-yellow">
                  MK
                </div>
                <div>
                  <h4 className="text-xs font-heading font-bold text-white">Mustafa Khan</h4>
                  <span className="text-[10px] text-white/40 block">Director of Logistics, Emirates Cargo Hub</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card p-6 flex flex-col justify-between gap-6 text-left">
              <div className="flex items-center gap-1 text-brand-yellow">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand-yellow" />)}
              </div>
              <p className="text-sm text-white/80 italic leading-relaxed">
                "Our remote desert road construction sites required loud diesel generators running 24/7. GOL LOW solar containers + battery system rental reduced our weekly diesel fuel supply needs by 58%. Excellent environmental compliance step."
              </p>
              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-brand-yellow/10 flex items-center justify-center font-heading font-bold text-brand-yellow">
                  JS
                </div>
                <div>
                  <h4 className="text-xs font-heading font-bold text-white">Janice Smith</h4>
                  <span className="text-[10px] text-white/40 block">Operations Manager, Gulf Infra Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ SECTION */}
      <section className="py-24 bg-[#04111f] relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-3 mb-16">
            <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
              Information Center
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqData.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#061b2d] border border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-heading font-bold text-sm text-white hover:text-brand-yellow transition-colors">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-brand-yellow shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-white/5 bg-[#030d16]/30"
                    >
                      <p className="px-6 py-4 text-xs text-white/60 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. MINI CONTACT SECTION */}
      <section className="py-24 bg-[#030d16] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Text block */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left justify-center">
            <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
              Ready to Save?
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
              Launch Your Solar Transition
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              Get in touch with GOL LOW engineers. We perform full feasibility surveys, utility bill audits, and structure complete proposal blueprints for your approval.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <MapPin className="w-5 h-5 text-brand-yellow shrink-0" />
                <span>Al Muraqqabat, Port Saeed, Dubai, United Arab Emirates</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Phone className="w-5 h-5 text-brand-yellow shrink-0" />
                <a href="tel:+97143377881" className="hover:text-white transition-colors">+971 4 337 7881</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Mail className="w-5 h-5 text-brand-yellow shrink-0" />
                <a href="mailto:Hr@gollowsolarenergy.com" className="hover:text-white transition-colors">Hr@gollowsolarenergy.com</a>
              </div>
            </div>
          </div>

          {/* Form Trigger Card */}
          <div className="lg:col-span-7 bg-[#04111f] border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col gap-6 text-left">
            <h3 className="font-heading font-bold text-lg text-white">
              Request Energy Audit Feasibility
            </h3>
            <p className="text-xs text-white/50 -mt-3">
              We respond with preliminary sizing options within 1 business day.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="fullName" className="text-[10px] font-bold text-white/40 uppercase">Full Name</label>
                <input id="fullName" type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="companyName" className="text-[10px] font-bold text-white/40 uppercase">Company Name</label>
                <input id="companyName" type="text" placeholder="Enterprise LLC" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="workEmail" className="text-[10px] font-bold text-white/40 uppercase">Work Email</label>
                <input id="workEmail" type="email" placeholder="john@enterprise.ae" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phoneNum" className="text-[10px] font-bold text-white/40 uppercase">Phone Number</label>
                <input id="phoneNum" type="tel" placeholder="+971 50 123 4567" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50" />
              </div>
            </div>

            <Link to="/contact" className="btn-primary w-full text-center">
              <span>Go to Full RFQ Form</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}
