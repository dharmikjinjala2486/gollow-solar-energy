import { useState, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sun, Shield, Sparkles, Zap, Database, Check } from 'lucide-react';
import SEO from '../components/SEO';

const BatteryCanvas = lazy(() => import('../components/canvas/BatteryCanvas'));
const SolarCanvas = lazy(() => import('../components/canvas/SolarCanvas'));

const solutions = [
  {
    title: 'Residential Solar Rental',
    desc: 'Fully managed rooftop solar system rentals designed for villas and residential estates. Offset high afternoon cooling costs directly.',
    benefits: ['Zero upfront capital expense', '100% maintenance & cleaning included', 'Flat monthly rate locked against utility inflation']
  },
  {
    title: 'Commercial Solar Rental',
    desc: 'High-yield rooftop canopy systems designed for offices, malls, hotels, and retail outlets. Peak shaving to mitigate high commercial demand rates.',
    benefits: ['No Balance-Sheet debt liability', 'Custom structural engineered parking shade solutions', 'Complete utility network connection approvals managed by us']
  },
  {
    title: 'Industrial Solar Rental',
    desc: 'Heavy-duty solar designs for warehouses, manufacturing units, cold storage facilities, and factories with large roof surfaces.',
    benefits: ['Substantial carbon savings offsets', 'Stabilize facility voltage inputs during peak loads', 'Option to integrate heavy battery storage backup']
  },
  {
    title: 'Construction Site Solar Containers',
    desc: 'Modular, mobile solar container modules paired with high-capacity batteries. Ideal for infrastructure, remote sites, and highway projects.',
    benefits: ['Replaces noisy, maintenance-heavy diesel generators', 'Reduces site diesel fuel consumption by up to 60%', 'Rapid deployment & mobilization options']
  }
];

const technicalSpecs = [
  { name: 'PV Module Technology', details: 'Tier-1 Monocrystalline Bifacial Double-Glass (550W+)' },
  { name: 'Inverter Systems', details: 'Smart String Inverters with active AFCI arc protection & IoT gateways' },
  { name: 'Racking & Mounting', details: 'Corrosive-resistant structural grade anodized aluminum (certified for 160km/h winds)' },
  { name: 'Battery Chemistry', details: 'Modular LiFePO4 (Lithium Iron Phosphate) with active BMS telemetry' },
  { name: 'Monitoring System', details: 'Real-time cloud SCADA with automatic alarms and performance analytics' }
];

export default function Solutions() {
  const solutionsSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Commercial Solar System Rental',
      'provider': {
        '@id': 'https://www.gollowsolarenergy.com/#organization'
      },
      'areaServed': ['AE', 'IN'],
      'description': 'Zero upfront capital expense commercial solar leases and shade installations for companies in Dubai & India.'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Industrial Solar System Rental',
      'provider': {
        '@id': 'https://www.gollowsolarenergy.com/#organization'
      },
      'areaServed': ['AE', 'IN'],
      'description': 'High-yield rooftop and ground-mounted solar leasing installations for factories, cold storage, and warehouse operations.'
    }
  ];

  return (
    <div className="pt-24 pb-16 overflow-hidden">
      <SEO
        title="Solar Energy Solutions | Commercial, Industrial & Hybrid Grid Rentals"
        description="Explore custom solar solutions by GOL LOW. From industrial solar container grids to commercial rooftop leasing and smart solar-diesel hybrid rentals for construction sites in UAE & India."
        keywords="Solar Rental Dubai, Solar Solutions, Commercial Solar UAE, Industrial Solar UAE, Warehouse Solar Dubai, Villa Solar, Factory Solar, Battery Storage Rental, Solar Power India, Commercial Solar India"
        schemaList={solutionsSchemas}
      />
      {/* Header Banner */}
      <section className="relative py-20 bg-grid-pattern bg-[#04111f] border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/10 to-brand-navy pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4 relative z-10">
          <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
            Modular Fleets & Services
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
            Solar Rental Solutions
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Fully financed, engineered, and managed clean energy setups custom-fit for every industry sector in the UAE.
          </p>
        </div>
      </section>

      {/* Solutions Cards with alternate layout */}
      <section className="py-20 max-w-7xl mx-auto px-6 flex flex-col gap-16">
        {solutions.map((sol, idx) => (
          <div 
            key={idx} 
            className={`flex flex-col lg:flex-row gap-12 items-center text-left ${
              idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Visual Block */}
            <div className={`w-full lg:w-1/2 min-h-[300px] flex items-center justify-center relative ${
              sol.title.includes('Construction') || sol.title.includes('Battery')
                ? 'overflow-visible' 
                : 'bg-[#04111f] border border-white/5 rounded-2xl p-6 overflow-hidden'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* If battery solution, render Battery Canvas, else a visual placeholder */}
              {sol.title.includes('Battery') ? (
                <div className="w-full">
                  <Suspense fallback={
                    <div className="w-full h-[250px] flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="text-[9px] text-white/40 tracking-wider">Loading Battery Model...</span>
                    </div>
                  }>
                    <BatteryCanvas />
                  </Suspense>
                </div>
              ) : sol.title.includes('Construction') ? (
                <div className="w-full">
                  <Suspense fallback={
                    <div className="w-full h-[250px] flex flex-col items-center justify-center">
                      <div className="w-6 h-6 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin mb-2" />
                      <span className="text-[9px] text-white/40 tracking-wider">Loading Solar Container...</span>
                    </div>
                  }>
                    <SolarCanvas />
                  </Suspense>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center p-8">
                  <div className="p-4 bg-brand-yellow/10 rounded-2xl text-brand-yellow">
                    <Sun className="w-10 h-10 animate-spin-slow" />
                  </div>
                  <h4 className="font-heading font-bold text-white uppercase tracking-wider">{sol.title}</h4>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest bg-brand-navy/60 px-3 py-1 rounded-full border border-white/5">
                    Engineering Specs Available Below
                  </span>
                </div>
              )}
            </div>

            {/* Description Block */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <span className="text-brand-yellow font-heading font-extrabold text-xs uppercase tracking-widest block">
                01. Solution Overview
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
                {sol.title}
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                {sol.desc}
              </p>

              <div className="h-px bg-white/15 my-2" />

              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-white/70 uppercase tracking-widest">Key Rental Benefits:</h4>
                <ul className="space-y-2.5">
                  {sol.benefits.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-xs text-white/80">
                      <div className="p-0.5 bg-brand-green/10 text-brand-green rounded mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* R3F Battery Showcase Section */}
      <section className="py-20 bg-[#04111f]/40 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Details */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left">
            <span className="text-xs font-heading font-semibold text-brand-green uppercase tracking-widest">
              Smart Storage Systems
            </span>
            <h2 className="font-heading font-extrabold text-3xl text-white">
              Battery Storage Rentals
            </h2>
            <p className="text-sm text-white/70 leading-relaxed">
              We lease industrial and commercial battery backup cabinets (BESS) designed for clean backup load control, demand response peak-shaving, and off-grid hybrid setups. Integrated safety enclosures, chemical thermal controls, and remote EMS telemetry come standard with every rental contract.
            </p>
            <ul className="grid grid-cols-2 gap-3 text-xs text-white/60">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" /> LiFePO4 Safety cells</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" /> 100kW to 2MW+ scaling</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" /> EMS remote dispatch</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-brand-green" /> Rapid backup transition</li>
            </ul>
          </div>

          {/* R3F Component */}
          <div className="lg:col-span-6 w-full min-h-[300px] flex items-center justify-center">
            <Suspense fallback={
              <div className="w-full h-[300px] flex flex-col items-center justify-center border border-white/5 rounded-2xl bg-white/5 backdrop-blur-md">
                <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-[10px] text-white/40 tracking-wider font-heading uppercase">Loading Battery Storage Container...</span>
              </div>
            }>
              <BatteryCanvas />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Tech Specifications Table */}
      <section className="py-20 max-w-4xl mx-auto px-6">
        <div className="text-center flex flex-col items-center gap-3 mb-12">
          <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">Build Quality</span>
          <h2 className="font-heading font-extrabold text-3xl text-white">Technical Specifications</h2>
        </div>

        <div className="glass-card overflow-hidden border border-white/10">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-white/5 text-white/60 font-heading font-bold uppercase tracking-wider border-b border-white/10">
                <th className="px-6 py-4">Component Group</th>
                <th className="px-6 py-4">Standard Fleet Equipment specifications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {technicalSpecs.map((spec, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{spec.name}</td>
                  <td className="px-6 py-4">{spec.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
