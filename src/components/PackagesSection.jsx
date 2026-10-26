import React from 'react';
import { Check, Sparkles, ChevronRight, Clock, Shield, Star } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

export const PACKAGES = [
  {
    id: 'signature-wash',
    level: 'LEVEL 01',
    name: 'Signature Decon Wash',
    duration: '1 Day Turnaround',
    price: 249,
    description: 'Essential deep cleanse and short-term gloss preservation for pristine drivers.',
    features: [
      'Citrus Foam Pre-Wash & Hand Mitt Decontamination',
      'Chemical Iron & Tar Fallout Removal',
      'Wheels, Barrels & Caliper Deep Clean',
      'Hydrophobic SiO2 Spray Sealant (3-Month Barrier)'
    ],
    buttonText: 'SELECT & CONFIGURE',
    isPopular: false
  },
  {
    id: 'stage-2',
    level: 'LEVEL 02',
    name: 'Stage-2 Paint Correction',
    duration: '2 Days Turnaround',
    price: 799,
    description: 'Comprehensive defect elimination, swirling eradication, micro-scratches, and etching.',
    features: [
      'Full Chemical + Mechanical Clay Bar Treatment',
      'Two-Step Rotary & Orbital Compounding',
      '90%+ Paint Imperfection & Swirl Eradication',
      'Jeweling Polish & 1-Year Polymer Sealant'
    ],
    buttonText: 'BOOK PAINT CORRECTION',
    isPopular: true
  },
  {
    id: 'ceramic-10h',
    level: 'LEVEL 03',
    name: '10H Ceramic Armor',
    duration: '3-4 Days Turnaround',
    price: 1499,
    description: 'Bespoke hypercar finish with multi-stage correction followed by molecular ceramic bonding.',
    features: [
      'Flawless 2-Stage Mirror Polishing Preparation',
      'Dual Base + Top Coat 10H Ceramic Grid',
      'Ceramic Coated Headlights & Glass Shield',
      'Infrared Short-Wave Lamp Heat Curing Cycle'
    ],
    buttonText: 'SELECT & CONFIGURE',
    isPopular: false
  }
];

export default function PackagesSection({ onSelectPackage }) {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      
      {/* Glow background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-950/20 blur-[130px] pointer-events-none rounded-full" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 text-[#ff1e38] text-[10px] font-mono tracking-widest uppercase mb-4">
          <span>TERMS OF MASTERY</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tighter uppercase mb-3 sm:mb-4">
          TAILORED DETAILING <span className="text-[#ff1e38]">PACKAGES</span>
        </h2>

        <p className="text-neutral-400 text-xs sm:text-base font-light leading-relaxed">
          From single-day concourse revitalizations to 5-year permanent ceramic armor. Select a package to pre-load our booking engine.
        </p>
      </div>

      {/* 3 Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {PACKAGES.map((pkg) => {
          const isFeatured = pkg.isPopular;
          return (
            <div
              key={pkg.id}
              className={`relative rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                isFeatured
                  ? 'bg-neutral-950/90 border-2 border-[#ff1e38] shadow-glow-red scale-[1.02] md:-translate-y-2'
                  : 'bg-[#101010]/90 border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {/* Most Requested Badge */}
              {isFeatured && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#ff1e38] text-white text-[10px] font-mono font-bold tracking-widest uppercase px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                  <Star size={11} className="fill-white" />
                  <span>MOST REQUESTED</span>
                </div>
              )}

              <div>
                {/* Header Level & Duration */}
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mb-4 pt-1">
                  <span className="text-[#ff1e38] font-bold">{pkg.level}</span>
                  <span className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded text-[11px]">
                    <Clock size={12} className="text-neutral-400" />
                    {pkg.duration}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-display font-bold text-2xl text-white uppercase tracking-tight mb-3">
                  {pkg.name}
                </h3>

                {/* Description */}
                <p className="text-neutral-400 text-xs font-light leading-relaxed mb-6 min-h-[36px]">
                  {pkg.description}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-neutral-800/80">
                  <span className="font-display font-black text-4xl text-white tracking-tight">
                    ${pkg.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-mono text-neutral-500 uppercase">
                    / BASE SEDAN
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3.5 mb-8">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-neutral-300">
                      <div className="w-4 h-4 rounded-full bg-[#ff1e38]/15 border border-[#ff1e38]/40 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} className="text-[#ff1e38]" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  playClickSound();
                  onSelectPackage(pkg);
                }}
                className={`w-full py-3.5 px-4 rounded text-xs font-display font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 group ${
                  isFeatured
                    ? 'bg-[#ff1e38] hover:bg-[#d90429] text-white shadow-glow-red'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span>{pkg.buttonText}</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

    </section>
  );
}
