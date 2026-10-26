import React, { useState } from 'react';
import { ShieldCheck, Wind, Sun, Flame, Radio, CheckCircle2 } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

export default function FacilitySection({ onOpenBooking }) {
  const [bayActive, setBayActive] = useState('bay-1');

  return (
    <section id="facility" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      <div className="bg-[#0e0e0e] border border-neutral-800/80 rounded-2xl p-4 sm:p-10 lg:p-12 relative overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute -right-20 -bottom-20 w-[450px] h-[450px] bg-red-950/20 blur-[130px] pointer-events-none rounded-full" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          
          {/* Left Column: Facility Specs & Philosophy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ff1e38]/30 bg-[#ff1e38]/10 text-[#ff1e38] text-[9px] sm:text-[10px] font-mono tracking-widest uppercase mb-4 w-max">
              <span>CLIMATE-CONTROLLED FACILITY</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tighter uppercase mb-4 sm:mb-6 leading-tight">
              ENGINEERED FOR THE <br />
              <span className="text-[#ff1e38] glow-text-red">1% OF PERFECTION.</span>
            </h2>

            <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed mb-8">
              Maintain zero-contamination dynamics within human-inspected, positive-pressure air cleanrooms with continuous air cycle changes and 99.97% HEPA particle traps. Precision optics eliminate inspection blind spots under 6500K daylight LEDs, ensuring zero micron-level marring escapes notice prior to ceramic cross-linking.
            </p>

            {/* Atelier Technical Specifications Grid */}
            <div className="space-y-4 border-t border-neutral-800/90 pt-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono py-2 border-b border-neutral-900 gap-1">
                <span className="text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <Wind size={14} className="text-[#ff1e38]" />
                  AIRFLOW DEPOSITION CONTROL
                </span>
                <span className="text-white font-semibold tracking-wide">
                  GRADE 6 HEPA DUAL ISO 14644
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono py-2 border-b border-neutral-900 gap-1">
                <span className="text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <Sun size={14} className="text-[#ff1e38]" />
                  OPTIC INSPECTION SPECTRUM
                </span>
                <span className="text-white font-semibold tracking-wide">
                  6500K DAYLIGHT BALANCED CRI 98+
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono py-2 border-b border-neutral-900 gap-1">
                <span className="text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <Flame size={14} className="text-[#ff1e38]" />
                  HEAT CURING MATRIX
                </span>
                <span className="text-white font-semibold tracking-wide">
                  SHORTWAVE DIGITAL INFRARED CURED
                </span>
              </div>

            </div>

          </div>

          {/* Right Column: Live Facility Intake & Feed Card */}
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 overflow-hidden shadow-2xl relative group">
              
              {/* Image Preview of Facility */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src="/images/car-clean-front.jpg"
                  alt="BRING IT DIRTY Atelier Curing Bay"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Live Feed Status Pill */}
                <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md border border-neutral-700/80 px-2.5 py-1 rounded text-[10px] font-mono text-neutral-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-semibold text-emerald-400">ATELIER CAM 02</span>
                  <span className="text-neutral-500">• 21.4°C / 42% RH</span>
                </div>

                {/* Bay selector */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded border border-neutral-800 text-[10px] font-mono">
                  <button
                    onClick={() => { playClickSound(); setBayActive('bay-1'); }}
                    className={`px-2 py-0.5 rounded transition-colors ${bayActive === 'bay-1' ? 'bg-[#ff1e38] text-white' : 'text-neutral-400'}`}
                  >
                    BAY 1
                  </button>
                  <button
                    onClick={() => { playClickSound(); setBayActive('bay-2'); }}
                    className={`px-2 py-0.5 rounded transition-colors ${bayActive === 'bay-2' ? 'bg-[#ff1e38] text-white' : 'text-neutral-400'}`}
                  >
                    BAY 2
                  </button>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5">
                <div className="text-[10px] font-mono tracking-widest text-[#ff1e38] uppercase mb-1">
                  ATELIER COMMISSION STATUS • LIVE INTAKE
                </div>
                <h4 className="font-display font-bold text-base text-white uppercase tracking-tight mb-3">
                  Accepting Hypercars, GT-Class & Bespoke Commissions
                </h4>
                <p className="text-neutral-400 text-xs font-light mb-4">
                  Current waitlist queue: 4–6 business days. White-glove enclosed transporter pickup available throughout metropolitan regions.
                </p>

                <button
                  onClick={() => {
                    playClickSound();
                    onOpenBooking();
                  }}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-[#ff1e38] text-neutral-200 hover:text-white border border-neutral-800 hover:border-transparent rounded text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={13} className="text-[#ff1e38] group-hover:text-white" />
                  <span>RESERVE ATELIER BAY</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
