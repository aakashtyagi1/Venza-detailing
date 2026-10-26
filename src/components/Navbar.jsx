import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Sparkles, ChevronRight, Menu, X, Car } from 'lucide-react';
import { toggleSound, isSoundEnabled, playClickSound } from '../utils/soundEffects';

export default function Navbar({ onOpenBooking, onOpenAdminLogin, isAdminLoggedIn, onToggleAdminView, showingAdminView }) {
  const [scrolled, setScrolled] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#080808]/95 backdrop-blur-md border-b border-neutral-800/80 py-2.5 sm:py-3 shadow-2xl' 
        : 'bg-gradient-to-b from-black/90 to-transparent py-3 sm:py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            playClickSound();
            if (showingAdminView) onToggleAdminView(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded bg-[#ff1e38] flex items-center justify-center font-display font-black text-black text-sm sm:text-lg tracking-tighter shadow-glow-red group-hover:scale-105 transition-transform duration-300">
            BID
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black tracking-wider text-white text-sm sm:text-lg group-hover:text-[#ff1e38] transition-colors whitespace-nowrap">
                BRING IT DIRTY
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-ping" />
            </div>
            <span className="text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] text-neutral-400 font-mono uppercase truncate max-w-[160px] sm:max-w-none">
              AUTOMOTIVE DETAIL ATELIER
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-mono tracking-widest uppercase text-neutral-300">
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

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Sound FX Toggle */}
          <button
            onClick={handleSoundToggle}
            title={soundOn ? "Mute interactive audio FX" : "Unmute interactive audio FX"}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-md border border-neutral-800 bg-neutral-900/80 hover:border-neutral-600 flex items-center justify-center text-neutral-300 hover:text-white transition-colors shrink-0"
          >
            {soundOn ? <Volume2 size={15} className="text-[#ff1e38]" /> : <VolumeX size={15} className="text-neutral-500" />}
          </button>

          {/* Admin CRM Button */}
          {isAdminLoggedIn ? (
            <button
              onClick={() => {
                playClickSound();
                onToggleAdminView(!showingAdminView);
              }}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border transition-all flex items-center gap-1.5 ${
                showingAdminView
                  ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                  : 'bg-emerald-950/40 border-emerald-500/60 text-emerald-400'
              }`}
            >
              <Shield size={13} className={showingAdminView ? "text-neutral-400" : "text-emerald-400"} />
              <span className="hidden md:inline">
                {showingAdminView ? 'View Atelier Site' : 'ADMIN CRM'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                onOpenAdminLogin();
              }}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md text-[10px] sm:text-xs font-mono font-medium tracking-wider uppercase border border-neutral-800 hover:border-neutral-600 bg-neutral-900/60 text-neutral-300 hover:text-white transition-all flex items-center gap-1"
              title="Admin CRM Login"
            >
              <Shield size={13} className="text-neutral-400" />
              <span className="hidden sm:inline">CRM</span>
            </button>
          )}

          {/* Glowing Red Book Detail Button */}
          <button
            onClick={() => {
              playClickSound();
              onOpenBooking();
            }}
            className="relative group overflow-hidden bg-[#ff1e38] hover:bg-[#d90429] text-white text-[10px] sm:text-xs font-display font-bold tracking-widest uppercase px-3 sm:px-5 py-2 sm:py-2.5 rounded shadow-glow-red transition-all duration-300 flex items-center gap-1 sm:gap-1.5 active:scale-95 shrink-0"
          >
            <span className="relative z-10 flex items-center gap-1">
              <span>BOOK DETAIL</span>
              <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform hidden xs:inline" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 rounded border border-neutral-800 flex items-center justify-center text-neutral-300 shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d0d0d]/98 border-b border-neutral-800 px-6 py-5 flex flex-col gap-4 text-xs font-mono tracking-widest uppercase shadow-2xl animate-fadeIn">
          <button 
            onClick={() => scrollTo('turntable')}
            className="text-left py-2 text-neutral-300 hover:text-[#ff1e38] flex items-center justify-between"
          >
            <span>360° Atelier Turntable</span>
            <span className="text-[#ff1e38]">→</span>
          </button>
          <button 
            onClick={() => scrollTo('services')}
            className="text-left py-2 text-neutral-300 hover:text-[#ff1e38] flex items-center justify-between"
          >
            <span>Services & Pricing</span>
            <span className="text-[#ff1e38]">→</span>
          </button>
          <button 
            onClick={() => scrollTo('facility')}
            className="text-left py-2 text-neutral-300 hover:text-[#ff1e38] flex items-center justify-between"
          >
            <span>The Standard Facility</span>
            <span className="text-[#ff1e38]">→</span>
          </button>
          <button 
            onClick={() => scrollTo('faq')}
            className="text-left py-2 text-neutral-300 hover:text-[#ff1e38] flex items-center justify-between"
          >
            <span>FAQ Knowledge Base</span>
            <span className="text-[#ff1e38]">→</span>
          </button>

          <div className="border-t border-neutral-800 pt-3 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminLoggedIn) {
                  onToggleAdminView(true);
                } else {
                  onOpenAdminLogin();
                }
              }}
              className="text-neutral-400 hover:text-white flex items-center gap-2 py-1"
            >
              <Shield size={14} className="text-[#ff1e38]" />
              <span>ADMIN CRM PORTAL</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
