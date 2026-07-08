import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Activity, Zap, TrendingUp, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

const projects = [
  {
    name: 'Al Maktoum Industrial Solar Hub',
    category: 'Industrial',
    location: 'Jebel Ali, Dubai',
    capacity: '1.2 MWp',
    generation: '2,040 MWh/year',
    savings: '450,000 AED/year',
    date: 'Dec 2025',
    offset: '1,120 Tons CO2/yr',
    desc: 'Bifacial solar rooftop array installed across three manufacturing warehouses. Integrated with a grid parallel SCADA station.'
  },
  {
    name: 'Marina Heights Commercial Canopy',
    category: 'Commercial',
    location: 'Dubai Marina, Dubai',
    capacity: '450 kWp',
    generation: '765 MWh/year',
    savings: '190,000 AED/year',
    date: 'Oct 2025',
    offset: '420 Tons CO2/yr',
    desc: 'Solar parking canopy structure providing shading for 120 customer vehicles while generating peak demand power.'
  },
  {
    name: 'EcoVillas Estate PV Cluster',
    category: 'Residential',
    location: 'Yas Island, Abu Dhabi',
    capacity: '180 kWp',
    generation: '306 MWh/year',
    savings: '68,000 AED/year',
    date: 'Mar 2026',
    offset: '168 Tons CO2/yr',
    desc: 'Decentralized villa cluster rooftop project, feeding clean power back to the grid under ADDC net metering policies.'
  },
  {
    name: 'E22 Road Highway Site Setup',
    category: 'Construction',
    location: 'Al Ain Border, UAE',
    capacity: '350 kWp + 600 kWh Battery',
    generation: '600 MWh/year',
    savings: 'Diesel cut by 55%',
    date: 'Jan 2026',
    offset: '330 Tons CO2/yr',
    desc: 'Temporary off-grid solar-battery hybrid container trailer replacing large diesel generator plants for roadworks lighting.'
  },
  {
    name: 'Mussafah Factory Carport',
    category: 'Industrial',
    location: 'Mussafah, Abu Dhabi',
    capacity: '800 kWp',
    generation: '1,360 MWh/year',
    savings: '295,000 AED/year',
    date: 'Feb 2026',
    offset: '748 Tons CO2/yr',
    desc: 'Industrial steel carport PV layout matching factory machinery peak startup electrical current surges.'
  },
  {
    name: 'Downtown Commercial Plaza',
    category: 'Commercial',
    location: 'Downtown Dubai',
    capacity: '320 kWp',
    generation: '544 MWh/year',
    savings: '135,000 AED/year',
    date: 'Nov 2025',
    offset: '299 Tons CO2/yr',
    desc: 'Premium glassmorphic building-integrated photovoltaics (BIPV) blending into modern building facade panels.'
  }
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="pt-24 pb-16 overflow-hidden">
      <SEO
        title="Solar Rental Projects Portfolio | GOL LOW"
        description="Browse our commercial, industrial, and hybrid solar rental case studies across Dubai, Abu Dhabi, and the wider UAE. Review real-world savings, carbon offset metrics, and deployment statistics."
        keywords="Solar Rental Company Dubai, Solar Energy Solutions Dubai, Rooftop Solar Dubai, Warehouse Solar Dubai, UAE Solar Projects, Commercial Solar UAE, Industrial Solar India, Solar Panel Rental Company Dubai"
      />
      {/* Header Banner */}
      <section className="relative py-20 bg-grid-pattern bg-[#04111f] border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/10 to-brand-navy pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4 relative z-10">
          <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
            Case Studies & Portfolio
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
            Our Completed Projects
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Review live active leased solar assets delivering grid offsets across residential, commercial, industrial, and infrastructure sectors.
          </p>
        </div>
      </section>

      {/* Interactive Power Telemetry Simulation Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left column details */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest flex items-center gap-1.5">
            <Activity className="w-4.5 h-4.5 text-brand-yellow" />
            Live Grid Performance
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            Daily Power Sizing Curve
          </h2>
          <p className="text-sm text-white/60 leading-relaxed">
            Solar generation correlates directly with peak afternoon commercial air conditioning loads in the UAE. By renting solar panels, businesses cover their most expensive grid tariffs (noon peak tariffs) and smooth their daily utility load curve.
          </p>

          <div className="grid grid-cols-2 gap-4 bg-[#04111f] p-4 rounded-xl border border-white/5 text-xs text-white/70">
            <div>
              <span className="text-white/40 uppercase block text-[9px] font-bold">Solar Generation Peak</span>
              <span className="text-sm font-heading font-extrabold text-brand-yellow mt-1 block">12:00 PM - 2:00 PM</span>
            </div>
            <div>
              <span className="text-white/40 uppercase block text-[9px] font-bold">Grid Feed Efficiency</span>
              <span className="text-sm font-heading font-extrabold text-brand-green mt-1 block">98.4% Average</span>
            </div>
          </div>
        </div>

        {/* Right column graph (SVG) */}
        <div className="lg:col-span-7 bg-[#04111f] border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="font-heading font-bold text-white uppercase tracking-wider">Estimated Solar Output (kW) vs. Day Cycle</span>
            <span className="text-brand-yellow font-semibold">Live Simulation</span>
          </div>

          <div className="relative w-full h-[220px] bg-white/5 border border-white/5 rounded-xl p-4 mt-2 flex items-end">
            {/* Y Axis markings */}
            <div className="absolute left-2 top-2 bottom-6 flex flex-col justify-between text-[8px] text-white/30 text-right w-8 pointer-events-none">
              <span>1000 kW</span>
              <span>750 kW</span>
              <span>500 kW</span>
              <span>250 kW</span>
              <span>0 kW</span>
            </div>

            {/* Simple SVG Chart */}
            <svg viewBox="0 0 500 150" className="w-full h-full ml-8 overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="37.5" x2="500" y2="37.5" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1="0" y1="112.5" x2="500" y2="112.5" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />

              {/* Baseline load curve */}
              <path d="M 0,130 C 100,130 180,80 250,80 C 320,80 400,130 500,130" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
              
              {/* Solar Bell Curve (glowing yellow) */}
              <motion.path 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5 }}
                d="M 100,150 C 150,150 200,20 250,20 C 300,20 350,150 400,150" 
                fill="none" 
                stroke="#f9b233" 
                strokeWidth="3.5" 
                className="filter drop-shadow-glow-yellow"
              />

              {/* Fill area under solar curve */}
              <path d="M 100,150 C 150,150 200,20 250,20 C 300,20 350,150 400,150 Z" fill="rgba(249,178,51,0.06)" />
            </svg>

            {/* X Axis markings */}
            <div className="absolute left-10 right-4 bottom-1 flex justify-between text-[8px] text-white/30 pointer-events-none">
              <span>06:00</span>
              <span>09:00</span>
              <span>12:00 (Noon)</span>
              <span>15:00</span>
              <span>18:00</span>
            </div>
          </div>
          
          <div className="flex gap-4 text-[9px] text-white/40 mt-1 uppercase font-bold justify-center">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-brand-yellow rounded" /> Solar PV Output</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-white/20 rounded" /> Building Base Electrical Load</span>
          </div>
        </div>
      </section>

      {/* Filterable Project Grid */}
      <section className="py-20 bg-[#04111f]/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <h2 className="font-heading font-extrabold text-2xl text-white">Project Directory</h2>
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Commercial', 'Residential', 'Industrial', 'Construction'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-heading font-semibold border transition-all duration-300 ${
                    activeFilter === tab
                      ? 'bg-brand-yellow border-brand-yellow text-brand-navy'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div 
                  key={project.name}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card p-6 flex flex-col justify-between gap-6 text-left group hover:border-brand-yellow/30"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] bg-white/5 border border-white/10 text-white/60 font-semibold px-2 py-0.5 rounded-full uppercase">
                        {project.category}
                      </span>
                      <span className="text-[10px] text-white/40 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {project.date}
                      </span>
                    </div>

                    <h4 className="font-heading font-extrabold text-base text-white group-hover:text-brand-yellow transition-colors">
                      {project.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <MapPin className="w-4 h-4 text-brand-yellow" />
                      <span>{project.location}</span>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed border-t border-white/5 pt-3">
                      {project.desc}
                    </p>
                  </div>

                  {/* Project specific stats */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-white/40 block text-[8px] uppercase tracking-wider font-semibold">Capacity</span>
                      <span className="font-heading font-bold text-white mt-0.5 block">{project.capacity}</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                      <span className="text-white/40 block text-[8px] uppercase tracking-wider font-semibold">Annual Offset</span>
                      <span className="font-heading font-bold text-brand-green mt-0.5 block">{project.offset}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
