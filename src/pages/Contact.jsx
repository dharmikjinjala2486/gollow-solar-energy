import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Phone, MapPin, Send, CheckCircle2,
  MessageSquare, Clock, ShieldAlert, ArrowRight
} from 'lucide-react';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emirate, setEmirate] = useState('Dubai');
  const [billRange, setBillRange] = useState('1,000 - 5,000 AED');
  const [sizeInput, setSizeInput] = useState('');
  const [message, setMessage] = useState('');

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (name && email && phone) {
      const numericBillMap = {
        'Under 1,000 AED': 500,
        '1,000 - 5,000 AED': 3000,
        '5,000 - 15,000 AED': 10000,
        'Over 15,000 AED': 25000
      };

      const payload = {
        name,
        company,
        email,
        phone,
        emirate,
        propertyType: 'Commercial',
        projectType: sizeInput ? 'Sized PV Array' : 'General Inquiry',
        roofSize: 0,
        bill: numericBillMap[billRange] || 0,
        contactMethod: 'Email',
        preferredDate: null,
        preferredTime: null,
        message: message + (sizeInput ? ` [Sizing Request: ${sizeInput}]` : ''),
        type: 'General'
      };

      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => {
          if (!res.ok) throw new Error('API submission error');
          return res.json();
        })
        .then(() => {
          setFormSubmitted(true);
          setName('');
          setCompany('');
          setEmail('');
          setPhone('');
          setSizeInput('');
          setMessage('');
        })
        .catch((err) => {
          console.error('Submission failed:', err);
          alert('Failed to send proposal request. Please check connections or try again.');
        });
    }
  };

  return (
    <div className="pt-24 pb-16 overflow-hidden">
      {/* Header Banner */}
      <section className="relative py-20 bg-grid-pattern bg-[#04111f] border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/10 to-brand-navy pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-4 relative z-10">
          <span className="text-xs font-heading font-semibold text-brand-yellow uppercase tracking-widest">
            Contact & Support
          </span>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-white">
            Connect with GOL LOW
          </h1>
          <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
            Request an energy survey, calculate dynamic solar savings, or consult our engineering team on industrial designs.
          </p>
        </div>
      </section>

      {/* Main Grid Contact Content */}
      <section className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left Side: Directory & Business info */}
        <div className="lg:col-span-4 flex flex-col gap-6 text-left">
          <div className="glass-card p-6 flex flex-col gap-6 border border-white/10">
            <h3 className="font-heading font-bold text-lg text-white">Dubai Headquarters</h3>

            <div className="flex flex-col gap-4 text-xs text-white/70">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                <span>Al Muraqqabat, Port Saeed, Dubai, United Arab Emirates</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-brand-yellow shrink-0" />
                <a href="tel:+97143377881" className="hover:text-white transition-colors">+971 4 337 7881</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-brand-yellow shrink-0" />
                <a href="mailto:Hr@gollowsolarenergy.com" className="hover:text-white transition-colors">Hr@gollowsolarenergy.com</a>
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div className="flex flex-col gap-3 text-xs text-white/60">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4.5 h-4.5 text-brand-yellow" />
                <span>Business Hours: Mon - Fri (08:00 AM - 06:00 PM)</span>
              </div>

              {/* WhatsApp direct trigger */}
              <a
                href="https://wa.me/971509876543"
                target="_blank"
                rel="noreferrer"
                className="btn-green w-full !py-2.5 text-xs flex items-center justify-center gap-2 mt-2"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Chat via WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Emergency support panel */}
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2.5 text-red-400">
              <ShieldAlert className="w-5.5 h-5.5" />
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                Emergency 24/7 Hotline
              </h4>
            </div>
            <p className="text-[11px] text-white/60 leading-relaxed">
              If you have an active container installation that requires emergency electrical troubleshooting, call our support line.
            </p>
            <a
              href="tel:+971509876543"
              className="text-sm text-red-400 hover:text-red-300 font-bold tracking-wider mt-1 block"
            >
              +971 50 987 6543
            </a>
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div className="lg:col-span-8 w-full">
          <div className="glass-card p-6 md:p-8 text-left border border-white/10 relative" id="rental-quote-form">
            <h3 className="font-heading font-bold text-lg text-white mb-6">
              Request Solar Sizing & RFQ proposal
            </h3>

                  {formSubmitted ? (
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="bg-brand-green/10 border border-brand-green/30 p-8 rounded-2xl flex flex-col items-center gap-4 text-center py-16"
                    >
                      <CheckCircle2 className="w-16 h-16 text-brand-green" />
                      <h4 className="font-heading font-bold text-lg text-white">Proposal Request Received</h4>
                      <p className="text-xs text-white/60 max-w-md leading-relaxed">
                        Thank you for contacting GOL LOW. Our solar design engineers will perform a preliminary rooftop survey via drone imagery and email options within 1 business day.
                      </p>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className="btn-secondary text-xs mt-4"
                      >
                        Submit another request
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-white/40 uppercase">Full Name</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-white/40 uppercase">Company Name (Optional)</label>
                          <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Enterprise LLC"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-white/40 uppercase">Work Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="john@enterprise.ae"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-white/40 uppercase">Phone Number</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+971 50 123 4567"
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-white/40 uppercase">UAE Emirate Location</label>
                          <select
                            value={emirate}
                            onChange={(e) => setEmirate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50"
                          >
                            {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'].map(e => (
                              <option key={e} value={e} className="bg-brand-navy text-white">{e}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-white/40 uppercase">Est. Monthly Bill</label>
                          <select
                            value={billRange}
                            onChange={(e) => setBillRange(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50"
                          >
                            {['Under 1,000 AED', '1,000 - 5,000 AED', '5,000 - 15,000 AED', 'Over 15,000 AED'].map(range => (
                              <option key={range} value={range} className="bg-brand-navy text-white">{range}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-bold text-white/40 uppercase">System Sizing Needed (kWp)</label>
                          <span className="text-[9px] text-brand-yellow">Optional: Auto-filled from AI Estimator</span>
                        </div>
                        <input
                          type="text"
                          id="form-system-size"
                          value={sizeInput}
                          onChange={(e) => setSizeInput(e.target.value)}
                          placeholder="e.g. 50 kWp array + 100 kWh battery"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-white/40 uppercase">Design requirements / Message</label>
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          rows="4"
                          placeholder="Provide details about roof material, structural load capability, or shift schedule patterns..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-brand-yellow/50 resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn-primary w-full"
                      >
                        <span>Send Engineering Inquiry</span>
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  )}
          </div>
        </div>

      </section>
    </div>
  );
}
