import React from 'react';
import { Sparkles, ArrowDown, ChevronRight, Gauge, ShieldCheck, Flame, Layers } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

export default function Hero({ onOpenBooking, onScrollToTurntable }) {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center items-center text-center pt-32 pb-16 px-4 overflow-hidden">
      
      {/* Background Lighting & Atmospheric Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#ff1e38]/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-10 left-1/4 w-[300px] h-[300px] bg-red-950/20 blur-[120px] pointer-events-none" />
      
      {/* Subtle HUD Grid Overlay */}
      <div className="absolute inset-0 hud-grid opacity-40 pointer-events-none" />

      {/* Laboratory Badge */}
      <div className="inline-flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-[#ff1e38]/30 bg-[#ff1e38]/10 text-[#ff1e38] text-[9px] sm:text-[11px] font-mono tracking-widest uppercase mb-6 sm:mb-8 backdrop-blur-sm animate-pulse-glow max-w-[95%]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-ping shrink-0" />
        <span className="truncate">PAINT CORRECTION & CERAMIC LABORATORY</span>
      </div>

      {/* Main Bold Display Headline */}
      <h1 className="max-w-5xl mx-auto font-display font-black text-4xl sm:text-7xl md:text-8xl tracking-tighter uppercase leading-[0.92] mb-6 sm:mb-8 select-none px-2">
        <span className="block text-white">BRING IT</span>
        <span className="block text-[#ff1e38] glow-text-red">DIRTY.</span>
        <span className="block text-white mt-1">TAKE IT</span>
        <span className="block bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-400 bg-clip-text text-transparent">
          IMMORTAL.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-2xl mx-auto text-neutral-400 text-xs sm:text-base md:text-lg font-light leading-relaxed mb-8 sm:mb-10 px-4">
        We specialize in concours-grade paint revival, self-healing PPF, and 10H ceramic shield coatings for hypercars, exotics, and bespoke sports machines.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16 w-full max-w-sm sm:max-w-md px-4">
        <button
          onClick={() => {
            playClickSound();
            onScrollToTurntable();
          }}
          className="w-full sm:w-auto relative group overflow-hidden bg-[#ff1e38] hover:bg-[#d90429] text-white font-display font-bold text-xs sm:text-sm tracking-widest uppercase px-5 sm:px-7 py-3.5 sm:py-4 rounded shadow-glow-red transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shrink-0"
        >
          <span>LAUNCH 360° ATELIER TURNTABLE</span>
          <ChevronRight size={15} className="group-hover:translate-x-1.5 transition-transform shrink-0" />
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
        </button>

        <button
          onClick={() => {
            playClickSound();
            onOpenBooking();
          }}
          className="w-full sm:w-auto border border-neutral-700 hover:border-neutral-500 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 font-mono text-xs sm:text-sm tracking-wider uppercase px-4 sm:px-6 py-3.5 sm:py-4 rounded transition-all duration-300 flex items-center justify-center gap-2 shrink-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] shrink-0" />
          <span>INSTANT QUOTE & BOOKING</span>
        </button>
      </div>

      {/* Four Precision Metrics Row (as in reference image) */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 px-2 sm:px-4 pt-4 sm:pt-6 border-t border-neutral-800/80">
        
        <div className="flex flex-col items-center p-3 rounded-lg bg-neutral-950/40 border border-neutral-900/90">
          <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            100%
          </span>
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#ff1e38] uppercase mt-1">
            SWIRL MARK ERADICATION
          </span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg bg-neutral-950/40 border border-neutral-900/90">
          <span className="font-display font-black text-2xl sm:text-3xl text-[#ff1e38] tracking-tight glow-text-red">
            10H
          </span>
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-neutral-400 uppercase mt-1">
            LIQUID GRAPHENE SHIELD
          </span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg bg-neutral-950/40 border border-neutral-900/90">
          <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            450+
          </span>
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#ff1e38] uppercase mt-1">
            EXOTICS REVITALIZED
          </span>
        </div>

        <div className="flex flex-col items-center p-3 rounded-lg bg-neutral-950/40 border border-neutral-900/90">
          <span className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
            0.05 <span className="text-sm font-light text-neutral-400">mm</span>
          </span>
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-neutral-400 uppercase mt-1">
            MICRON PRECISION MEASURED
          </span>
        </div>

      </div>

      {/* Scroll to wash prompt */}
      <div 
        onClick={() => {
          playClickSound();
          onScrollToTurntable();
        }}
        className="mt-14 flex flex-col items-center gap-2 text-neutral-500 hover:text-[#ff1e38] cursor-pointer transition-colors group"
      >
        <span className="text-[11px] font-mono tracking-[0.3em] uppercase group-hover:text-white transition-colors">
          SCROLL TO WASH IT
        </span>
        <div className="w-8 h-8 rounded-full border border-neutral-800 group-hover:border-[#ff1e38] flex items-center justify-center animate-bounce">
          <ArrowDown size={14} className="text-[#ff1e38]" />
        </div>
      </div>

    </section>
  );
}
