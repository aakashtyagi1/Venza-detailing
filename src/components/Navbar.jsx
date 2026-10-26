import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Sparkles, ChevronRight, Menu, X, Car } from 'lucide-react';
import { toggleSound, isSoundEnabled, playClickSound } from '../utils/soundEffects';

export default function Navbar({ onOpenBooking, onOpenAdminLogin, isAdminLoggedIn, onToggleAdminView, showingAdminView }) {
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playClickSound();
  };

  const scrollTo = (id) => {
    playClickSound();
    setMobileMenuOpen(false);
    if (showingAdminView) {
      onToggleAdminView(false);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full overflow-hidden ${
      scrolled 
        ? 'bg-[#080808]/95 backdrop-blur-md border-b border-neutral-800/80 py-2 sm:py-3 shadow-2xl' 
        : 'bg-gradient-to-b from-black/95 via-black/80 to-transparent py-2.5 sm:py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-1 sm:gap-4 w-full">
        
        {/* Brand Logo - Compact on mobile, rich on desktop */}
        <div 
          onClick={() => {
            playClickSound();
            if (showingAdminView) onToggleAdminView(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink min-w-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded bg-[#ff1e38] flex items-center justify-center font-display font-black text-black text-xs sm:text-base tracking-tighter shadow-glow-red group-hover:scale-105 transition-transform duration-300 shrink-0">
            BID
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black tracking-wider text-white text-xs sm:text-base group-hover:text-[#ff1e38] transition-colors truncate">
                BRING IT DIRTY
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-ping shrink-0" />
            </div>
            <span className="text-[8px] sm:text-[9px] tracking-[0.2em] text-neutral-400 font-mono uppercase truncate hidden sm:block">
              VENZA AUTOMOTIVE ATELIER
            </span>
          </div>
        </div>

        {/* Desktop Navigation (Hidden on Mobile/Tablet) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-mono tracking-widest uppercase text-neutral-300 shrink-0">
          <button 
            onClick={() => scrollTo('turntable')}
            className="hover:text-[#ff1e38] transition-colors flex items-center gap-1.5 group"
          >
            <span className="text-[#ff1e38] text-base group-hover:rotate-45 transition-transform">⬡</span>
            360° Turntable
          </button>
          
          <button 
            onClick={() => scrollTo('services')}
            className="hover:text-[#ff1e38] transition-colors"
          >
            Services & Pricing
          </button>

          <button 
            onClick={() => scrollTo('facility')}
            className="hover:text-[#ff1e38] transition-colors"
          >
            The Standard
          </button>

          <button 
            onClick={() => scrollTo('faq')}
            className="hover:text-[#ff1e38] transition-colors"
          >
            FAQ
          </button>
        </nav>

        {/* Right Action Controls - Strictly sized to fit any screen */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          
          {/* Sound FX Toggle Button */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? "Mute interactive audio FX" : "Unmute interactive audio FX"}
            className="w-8 h-8 rounded border border-neutral-800 bg-neutral-900/80 hover:border-neutral-600 flex items-center justify-center text-neutral-300 hover:text-white transition-colors shrink-0"
          >
            {soundOn ? <Volume2 size={14} className="text-[#ff1e38]" /> : <VolumeX size={14} className="text-neutral-500" />}
          </button>

          {/* Admin CRM Button (Shown on Tablet & Desktop, accessible in mobile menu for phones) */}
          {isAdminLoggedIn ? (
            <button
              onClick={() => {
                playClickSound();
                onToggleAdminView(!showingAdminView);
              }}
              className={`hidden sm:flex px-2.5 py-1.5 rounded text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border transition-all items-center gap-1.5 shrink-0 ${
                showingAdminView
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                  : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400'
              }`}
            >
              <Shield size={12} className={showingAdminView ? "text-neutral-400" : "text-emerald-400"} />
              <span className="hidden md:inline">{showingAdminView ? 'Atelier Site' : 'ADMIN CRM'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                onOpenAdminLogin();
              }}
              className="hidden sm:flex px-2.5 py-1.5 rounded text-[10px] sm:text-xs font-mono font-medium tracking-wider uppercase border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 text-neutral-300 hover:text-white transition-all items-center gap-1 shrink-0"
            >
              <Shield size={12} className="text-neutral-400" />
              <span>CRM</span>
            </button>
          )}

          {/* Book Detail CTA Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenBooking();
            }}
            className="relative group overflow-hidden bg-[#ff1e38] hover:bg-[#d90429] text-white text-[10px] sm:text-xs font-display font-bold tracking-wider uppercase px-2.5 sm:px-4 py-1.5 sm:py-2 rounded shadow-glow-red transition-all duration-300 flex items-center gap-1 active:scale-95 shrink-0"
          >
            <span className="relative z-10 flex items-center gap-1">
              <span className="hidden xs:inline">BOOK</span>
              <span className="xs:hidden">BOOK</span>
              <span className="hidden sm:inline">DETAIL</span>
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </button>

          {/* Mobile & Tablet Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 rounded border border-neutral-800 bg-neutral-900/60 flex items-center justify-center text-neutral-300 hover:text-white shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0a0a]/98 backdrop-blur-xl border-b border-neutral-800 px-4 py-4 flex flex-col gap-3 text-xs font-mono tracking-widest uppercase shadow-2xl animate-fadeIn">
          <button 
            onClick={() => scrollTo('turntable')}
            className="text-left py-2 px-3 rounded bg-neutral-950/60 border border-neutral-900 text-neutral-300 hover:text-[#ff1e38] flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="text-[#ff1e38]">⬡</span>
              360° Atelier Turntable
            </span>
            <ChevronRight size={14} className="text-neutral-500" />
          </button>

          <button 
            onClick={() => scrollTo('services')}
            className="text-left py-2 px-3 rounded bg-neutral-950/60 border border-neutral-900 text-neutral-300 hover:text-[#ff1e38] flex items-center justify-between"
          >
            <span>Services & Pricing</span>
            <ChevronRight size={14} className="text-neutral-500" />
          </button>

          <button 
            onClick={() => scrollTo('facility')}
            className="text-left py-2 px-3 rounded bg-neutral-950/60 border border-neutral-900 text-neutral-300 hover:text-[#ff1e38] flex items-center justify-between"
          >
            <span>The Standard Facility</span>
            <ChevronRight size={14} className="text-neutral-500" />
          </button>

          <button 
            onClick={() => scrollTo('faq')}
            className="text-left py-2 px-3 rounded bg-neutral-950/60 border border-neutral-900 text-neutral-300 hover:text-[#ff1e38] flex items-center justify-between"
          >
            <span>FAQ Knowledge Base</span>
            <ChevronRight size={14} className="text-neutral-500" />
          </button>

          {/* CRM & Quick Booking buttons inside mobile drawer */}
          <div className="border-t border-neutral-800/80 pt-3 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminLoggedIn) {
                  onToggleAdminView(true);
                } else {
                  onOpenAdminLogin();
                }
              }}
              className="w-full py-2.5 px-3 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-[#ff1e38]" />
                <span>ADMIN CRM PORTAL</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full py-2.5 px-3 rounded bg-[#ff1e38] text-white font-display font-bold tracking-wider text-center flex items-center justify-center gap-2 shadow-glow-red"
            >
              <span>BOOK YOUR DETAIL NOW</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
