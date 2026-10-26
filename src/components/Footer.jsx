import React from 'react';
import { Shield, Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

export default function Footer({ onOpenAdminLogin }) {
  return (
    <footer className="border-t border-neutral-800/80 bg-[#070707] text-neutral-400 py-12 px-4 sm:px-6 lg:px-8 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#ff1e38] flex items-center justify-center font-display font-black text-black text-sm">
            BID
          </div>
          <div>
            <div className="font-display font-bold text-white uppercase tracking-wider text-sm">
              BRING IT DIRTY AUTO ATELIER
            </div>
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest">
              © 2026 BRING IT DIRTY INC. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center gap-6 text-[11px] uppercase tracking-wider text-neutral-400">
          <a href="#services" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#facility" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#turntable" className="hover:text-[#ff1e38] transition-colors">Ceramic Code</a>
          
          <button
            onClick={() => {
              playClickSound();
              onOpenAdminLogin();
            }}
            className="text-[#ff1e38] hover:underline font-bold uppercase"
          >
            VIP CRM Portal
          </button>
        </div>

      </div>
    </footer>
  );
}
