import { motion } from 'framer-motion';
import { ShieldCheck, Target, Eye, Users, Calendar, Briefcase, Mail } from 'lucide-react';
import SEO from '../components/SEO';

const values = [
  { title: 'Engineering Precision', desc: 'Every installation is modeled using satellite drone telemetry to ensure maximum structural integrity and peak kWp yield.', icon: ShieldCheck },
  { title: 'Zero CAPEX Model', desc: 'We believe sustainable energy shouldn’t represent a cash flow risk. We finance, manage, and scale the assets entirely.', icon: Target },
  { title: 'Enterprise Reliability', desc: 'From certified Tier-1 panels to redundancy batteries and active IoT monitoring, we guarantee 99.9% uptime.', icon: Users }
];

const timeline = [
  { year: '2021', title: 'Company Founded', desc: 'Launched in Dubai with a core focus on containerized off-grid solar rentals.' },
  { year: '2022', title: 'DEWA Shams Certification', desc: 'Acquired official regulatory certifications to sync solar setups to the grid parallelly.' },
  { year: '2023', title: '10 MWp Milestone', desc: 'Reached 10 Megawatts of active leased solar capacity across warehouses and retail outlets.' },
  { year: '2024', title: 'Hybrid Container Fleet Launch', desc: 'Introduced integrated Solar-Diesel-Battery generators for remote construction projects.' },
  { year: '2025', title: 'Abu Dhabi Expansion', desc: 'Opened a dedicated regional operations center in Mussafah, Abu Dhabi.' },
  { year: '2026', title: 'AI-Guided Energy Auditing', desc: 'Deployed real-time telemetry systems and custom estimators to optimize customer savings.' }
];


const jobs = [
  { title: 'Senior Solar PV Design Engineer', dept: 'Engineering', loc: 'Dubai HQ', type: 'Full-Time' },
  { title: 'Grid Integration Specialist', dept: 'Operations', loc: 'Dubai HQ', type: 'Full-Time' },
  { title: 'Renewable Energy Sales Executive', dept: 'Business Development', loc: 'Abu Dhabi Branch', type: 'Full-Time' },
  { title: 'Clean-Tech O&M Maintenance Lead', dept: 'Support', loc: 'Mussafah, UAE', type: 'Full-Time' }
];

export default function About() {
  return (
    <div className="pt-24 pb-16 overflow-hidden">
      <SEO
        title="About GOL LOW | Solar Energy Experts UAE"
        description="Learn about GOL LOW Solar Energy Systems Rental. We are a leading provider of commercial, industrial, and residential solar leasing solutions with 0 capital investment required across the UAE."
        keywords="About Gol Low, Solar Company Dubai, Solar Energy Company UAE, India Solar Company, Solar Rental Company, Renewable Energy Dubai, Clean Energy UAE, Solar Solutions, Solar Investment, Commercial Solar Dubai, Industrial Solar India"
      />
      {/* Header Banner */}
      <section className="relative py-20 bg-grid-pattern bg-[#04111f] border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/10 to-brand-navy pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4 relative z-10">
          <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
            Decarbonizing the Middle East
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
            Our Story & Mission
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Established in the UAE, GOL LOW Solar Energy Systems Rental is dedicated to making solar energy deployment accessible, zero-risk, and operationally seamless.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-card p-8 flex flex-col items-start gap-4 text-left border border-white/10">
          <div className="p-3 bg-brand-yellow/10 rounded-xl text-brand-yellow">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-bold text-xl text-white">Our Mission</h2>
          <p className="text-sm text-white/60 leading-relaxed">
            To eliminate the capital expenditure barrier for solar transitions across the Middle East. By providing fully funded, engineered, and maintained solar rentals, we enable organizations to immediately offset utility expenses and lower their environmental footprint without operational risk.
          </p>
        </div>

        <div className="glass-card p-8 flex flex-col items-start gap-4 text-left border border-white/10">
          <div className="p-3 bg-brand-green/10 rounded-xl text-brand-green">
            <Eye className="w-6 h-6" />
          </div>
          <h2 className="font-heading font-bold text-xl text-white">Our Vision</h2>
          <p className="text-sm text-white/60 leading-relaxed">
            To become the premier clean energy rental platform in the UAE, supporting the national Net Zero 2050 targets. We aim to deploy over 100 Megawatts of decentralized clean capacity by 2030, replacing diesel generators with modular smart grids.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[#04111f]/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-3 mb-16">
            <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">Our DNA</span>
            <h2 className="font-heading font-extrabold text-3xl text-white">Core Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <div key={idx} className="glass-card p-6 flex flex-col items-start gap-4 text-left">
                  <div className="p-2.5 bg-brand-yellow/10 rounded-lg text-brand-yellow">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">{val.title}</h4>
                  <p className="text-xs text-white/50 leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center flex flex-col items-center gap-3 mb-16">
          <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">Growth Pathway</span>
          <h2 className="font-heading font-extrabold text-3xl text-white">Company Milestones</h2>
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-32">
          {timeline.map((item, idx) => (
            <div key={idx} className="mb-12 relative pl-8 md:pl-12">
              {/* Year badge */}
              <div className="absolute top-0 -left-4 md:-left-36 w-8 h-8 rounded-full bg-brand-yellow text-brand-navy flex items-center justify-center font-heading font-extrabold text-xs">
                {item.year}
              </div>
              <div className="hidden md:block absolute top-1.5 -left-24 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                Milestone
              </div>
              
              <div className="glass-card p-6 text-left">
                <h3 className="font-heading font-bold text-sm text-white mb-2">{item.title}</h3>
                <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Careers Section */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <span className="text-xs font-heading font-semibold text-brand-green uppercase tracking-widest flex items-center gap-1">
              <Users className="w-4 h-4 text-brand-green" />
              Build the Future
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-white">Join Our Team</h2>
            <p className="text-sm text-white/60 leading-relaxed">
              We are expanding operations rapidly across Dubai, Abu Dhabi, and the Northern Emirates. If you are passionate about clean technology, engineering precision, and modular solar microgrids, we would love to meet you.
            </p>
            
            <a 
              href="mailto:Hr@gollowsolarenergy.com" 
              className="btn-primary w-fit mt-2"
            >
              <Mail className="w-4 h-4" />
              <span>Submit General Application</span>
            </a>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-4">
            {jobs.map((job, idx) => (
              <div 
                key={idx} 
                className="bg-[#04111f] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left hover:border-brand-yellow/20 transition-all duration-300"
              >
                <div>
                  <h3 className="font-heading font-bold text-sm text-white">{job.title}</h3>
                  <div className="flex gap-4 mt-1.5 text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                    <span>{job.dept}</span>
                    <span>•</span>
                    <span>{job.loc}</span>
                  </div>
                </div>
                
                <span className="bg-white/5 border border-white/10 text-white/60 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                  {job.type}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
