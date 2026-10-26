import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/soundEffects';

const FAQS = [
  {
    q: "How does the 'Scroll-to-Wash' simulation reflect real-world paint revivification?",
    a: "Our virtual atelier turntable simulator mimics the exact 3-stage chemical and mechanical leveling sequence we perform in our cleanroom bays. As dirt and track fallout are scrubbed, you see the true gloss transformation from 32 GU up to 98+ GU optical mirror finish."
  },
  {
    q: "What is the difference between 10H ceramic and standard dealership coatings?",
    a: "Standard dealership sealants are temporary silicone sprays that wash away in months. Our 10H Liquid Graphene & Ceramic Armor bonds molecularly to clear coat at a hardness rating of 10H on the pencil scale, providing permanent hydrophobic protection, scratch resistance, and extreme chemical barrier against bird etchings, acid rain, and road salts."
  },
  {
    q: "How does the booking and atelier scheduling process work?",
    a: "When you submit your commission via 'BOOK YOUR DETAIL', our concierge engine registers your vehicle and specifications into our CRM. You will receive an immediate reservation pass with reference code, and our Chief Detailer coordinates intake, flatbed transport, or white-glove valet logistics."
  },
  {
    q: "Do you offer enclosed flatbed transport for low-clearance exotics and hypercars?",
    a: "Yes. We maintain hydraulic tilt-tray enclosed transporters specifically outfitted with soft wheel-lashings and low-approach race ramps for Ferrari, Lamborghini, McLaren, and Porsche GT machinery."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    playClickSound();
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 text-[#ff1e38] text-[10px] font-mono tracking-widest uppercase mb-3">
          <span>ATELIER KNOWLEDGE BASE</span>
        </div>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
          FREQUENTLY ASKED <span className="text-[#ff1e38]">QUESTIONS</span>
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[#0f0f0f] border border-neutral-800/80 rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 group"
              >
                <span className="font-display font-bold text-sm sm:text-base text-white group-hover:text-[#ff1e38] transition-colors uppercase">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-[#ff1e38] transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-neutral-400 text-xs sm:text-sm font-light leading-relaxed border-t border-neutral-900 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
