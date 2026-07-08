import { Link } from 'react-router-dom';
import { ShieldCheck, HelpCircle, ArrowRight, Table, Check } from 'lucide-react';
import SEO from '../components/SEO';

const plans = [
  {
    name: 'Residential Lease',
    rate: 'From 36 AED / kWp / mo',
    term: '1 to 5 Years',
    bestFor: 'Villa Homeowners',
    desc: 'Lock in immediate bill savings. GOL LOW owns and maintains the panels. You pay a low monthly rent.',
    features: ['0 AED Upfront investment', 'All cleaning & washing covered', 'Transferable on property sale']
  },
  {
    name: 'Commercial PPA',
    rate: 'Pay per kWh Generated',
    term: '5 to 15 Years',
    bestFor: 'Corporate Offices & Retail',
    desc: 'Pay only for the clean energy generated. Rate is fixed at a steep discount to DEWA/federal grid rates.',
    features: ['Pay-as-you-go billing model', 'Grid connection sync managed', 'No balance sheet debt liability']
  },
  {
    name: 'Industrial Lease-to-Own',
    rate: 'From 18 AED / kWp / mo',
    term: '10 to 15 Years',
    bestFor: 'Factories & Cold Storage',
    desc: 'Flat lease payments that amortize over time. At the end of the lease term, the complete solar assets transfer to your ownership.',
    features: ['Assets transfer at contract end', 'Full O&M support included', 'Maximum 10-year cumulative ROI']
  },
  {
    name: 'Construction Site Fleet',
    rate: 'From 48 AED / kWp / mo',
    term: 'Monthly Rolling',
    bestFor: 'Remote infrastructure setups',
    desc: 'Short-term rolling solar container + battery generator rentals to replace heavy diesel operations.',
    features: ['Rapid mobile trailer setup', 'Reduces diesel fuel lines by 60%', 'Flexible month-to-month contracts']
  }
];

export default function RentalPlans() {
  return (
    <div className="pt-24 pb-16 overflow-hidden">
      <SEO
        title="Solar Rental Plans & Zero-CAPEX Leasing Models | GOL LOW"
        description="Flexible rental and leasing contracts for solar panel systems. Zero upfront CAPEX options: Flat-rate rental, energy savings lease, and lease-to-own models for UAE and India businesses."
        keywords="Solar Panel Rental Dubai, Solar Leasing Dubai, Solar ROI, Solar Savings, Solar Investment, Best Solar Rental UAE, Commercial Solar Leasing UAE, Industrial Solar Rental UAE"
      />
      {/* Header Banner */}
      <section className="relative py-20 bg-grid-pattern bg-[#04111f] border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/10 to-brand-navy pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4 relative z-10">
          <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
            Flexible Financing
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
            Solar Rental Plans
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Choose a clean energy lease model that aligns with your household savings goals or corporate accounting preferences.
          </p>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="sr-only">Available Solar Rental & Leasing Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className="glass-card p-6 flex flex-col justify-between gap-6 text-left group hover:border-brand-yellow/30 transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-wider block mb-1">
                    {plan.bestFor}
                  </span>
                  <h3 className="font-heading font-extrabold text-lg text-white">
                    {plan.name}
                  </h3>
                </div>

                <div className="py-3 px-4 bg-white/5 border border-white/5 rounded-xl text-center">
                  <span className="text-[9px] text-white/40 block uppercase tracking-widest font-bold">Rental Pricing</span>
                  <span className="text-sm font-heading font-bold text-white mt-1 block">{plan.rate}</span>
                </div>

                <p className="text-xs text-white/60 leading-relaxed min-h-[70px]">
                  {plan.desc}
                </p>

                <div className="h-px bg-white/10 my-1" />

                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Key Plan Inclusions:</span>
                  <ul className="space-y-2">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-[11px] text-white/80">
                        <Check className="w-3.5 h-3.5 text-brand-green shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link 
                to="/contact" 
                className="btn-primary w-full text-center text-xs"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Side-by-side Comparative Table */}
      <section className="py-20 bg-[#04111f]/40 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center flex flex-col items-center gap-3 mb-12">
            <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">At A Glance</span>
            <h2 className="font-heading font-extrabold text-3xl text-white">Leasing Comparison Table</h2>
          </div>

          <div className="glass-card overflow-hidden border border-white/10 text-xs text-left">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-white/5 text-white/60 font-bold uppercase border-b border-white/10">
                  <th className="px-6 py-4">Option Group</th>
                  <th className="px-6 py-4 text-center">Residential</th>
                  <th className="px-6 py-4 text-center">Commercial</th>
                  <th className="px-6 py-4 text-center">Industrial</th>
                  <th className="px-6 py-4 text-center">Construction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                <tr>
                  <td className="px-6 py-4 font-bold text-white">Capital Expenditure (CAPEX)</td>
                  <td className="px-6 py-4 text-center text-brand-green font-bold">0 AED</td>
                  <td className="px-6 py-4 text-center text-brand-green font-bold">0 AED</td>
                  <td className="px-6 py-4 text-center text-brand-green font-bold">0 AED</td>
                  <td className="px-6 py-4 text-center text-brand-green font-bold">0 AED</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-white">System Sizing (kWp)</td>
                  <td className="px-6 py-4 text-center">5 - 30 kWp</td>
                  <td className="px-6 py-4 text-center">50 - 500 kWp</td>
                  <td className="px-6 py-4 text-center">200 - 2,000 kWp</td>
                  <td className="px-6 py-4 text-center">100 - 1,000 kWp</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-white">Contract Lease Terms</td>
                  <td className="px-6 py-4 text-center">3 - 5 Years</td>
                  <td className="px-6 py-4 text-center">5 - 15 Years</td>
                  <td className="px-6 py-4 text-center">10 - 15 Years</td>
                  <td className="px-6 py-4 text-center">Monthly Rolling</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-white">Grid Parallel Sync (DEWA)</td>
                  <td className="px-6 py-4 text-center">Yes</td>
                  <td className="px-6 py-4 text-center">Yes</td>
                  <td className="px-6 py-4 text-center">Yes</td>
                  <td className="px-6 py-4 text-center">Off-Grid (Diesel Hybrid)</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-white">Asset Ownership Transfer</td>
                  <td className="px-6 py-4 text-center">No (Rental only)</td>
                  <td className="px-6 py-4 text-center">Optional buy-out</td>
                  <td className="px-6 py-4 text-center text-brand-yellow font-bold">Yes (At Term End)</td>
                  <td className="px-6 py-4 text-center">No (De-mobilized)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
