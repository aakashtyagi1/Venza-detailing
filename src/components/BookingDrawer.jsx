import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Calendar, 
  Clock, 
  Car, 
  Shield, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle,
  Download,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PACKAGES } from './PackagesSection';
import { createBooking } from '../services/api';
import { playClickSound, playSuccessChime } from '../utils/soundEffects';

const ADDONS = [
  { id: 'ceramic-wheels', name: 'Wheel-Off & Caliper 10H Ceramic Coating', price: 250 },
  { id: 'glass-coating', name: 'Full Glass Hydrophobic Nano-Shield', price: 150 },
  { id: 'interior-alcantara', name: 'Alcantara & Leather Hydrophobic Barrier', price: 180 },
  { id: 'engine-bay', name: 'Engine Bay Cryo-Clean & Carbon Dress', price: 290 },
  { id: 'ppf-front', name: 'Track-Pack Self-Healing Clear Bra (PPF)', price: 1850 }
];

export default function BookingDrawer({ 
  isOpen, 
  onClose, 
  initialPackage, 
  onBookingSuccess,
  onOpenAdminCRM 
}) {
  const [selectedPkg, setSelectedPkg] = useState(PACKAGES[1]); // default Stage-2
  const [selectedAddons, setSelectedAddons] = useState([]);
  
  // Vehicle Inputs
  const [vehicleYear, setVehicleYear] = useState('2024');
  const [vehicleMake, setVehicleMake] = useState('Porsche');
  const [vehicleModel, setVehicleModel] = useState('911 GT3 RS');
  const [paintColor, setPaintColor] = useState('Guards Red / Gloss Carbon');
  const [condition, setCondition] = useState('Track Grime & Brake Dust');
  
  // Client details
  const [customerName, setCustomerName] = useState('Daniel Vance');
  const [email, setEmail] = useState('daniel.vance@vancetech.io');
  const [phone, setPhone] = useState('+1 (415) 890-4421');
  const [preferredDate, setPreferredDate] = useState('2026-11-04');
  const [preferredTime, setPreferredTime] = useState('08:30 AM (Morning Dropoff)');
  const [specialNotes, setSpecialNotes] = useState('Laguna Seca track rubber on rear arches. Please inspect clear bra.');
  
  // Submission & UI States
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Update selected package if passed in via props
  useEffect(() => {
    if (initialPackage) {
      setSelectedPkg(initialPackage);
    }
  }, [initialPackage]);

  if (!isOpen) return null;

  // Calculate live dynamic total
  const addonsTotal = selectedAddons.reduce((sum, item) => sum + item.price, 0);
  const grandTotal = (selectedPkg?.price || 799) + addonsTotal;

  const toggleAddon = (addon) => {
    playClickSound();
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !email.trim()) {
      setErrorMsg('Please provide your name and contact email.');
      return;
    }

    setSubmitting(true);
    playClickSound();

    try {
      const payload = {
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        vehicle: {
          year: vehicleYear,
          make: vehicleMake,
          model: vehicleModel,
          paintColor: paintColor,
          condition: condition
        },
        servicePackage: {
          id: selectedPkg.id,
          name: selectedPkg.name,
          duration: selectedPkg.duration,
          basePrice: selectedPkg.price
        },
        selectedAddons,
        totalPrice: grandTotal,
        preferredDate,
        preferredTime,
        specialNotes
      };

      const res = await createBooking(payload);
      const bookedData = res.data;
      setConfirmedBooking(bookedData);
      
      // Trigger confetti celebration!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff1e38', '#ffffff', '#222222', '#ff5722']
      });

      playSuccessChime();
      if (onBookingSuccess) onBookingSuccess(bookedData);

    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error saving reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForNewBooking = () => {
    setConfirmedBooking(null);
    setSelectedAddons([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" 
      />

      {/* Slide-out Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-2xl w-full bg-[#0d0d0d] border-l border-neutral-800 shadow-2xl flex flex-col z-10 overflow-y-auto">
        
        {/* Top Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-800/80 flex items-center justify-between sticky top-0 bg-[#0d0d0d]/98 backdrop-blur-md z-20">
          <div>
            <div className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#ff1e38] uppercase mb-0.5">
              ATELIER RESERVATION CONCIERGE
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-tight">
              BOOK YOUR DETAIL
            </h2>
          </div>

          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-8 flex-1">
          
          {confirmedBooking ? (
            /* SUCCESS CONFIRMATION STATE */
            <div className="py-6 flex flex-col items-center text-center animate-fadeIn">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-6 shadow-glow-emerald">
                <CheckCircle2 size={36} />
              </div>

              <div className="text-xs font-mono tracking-[0.25em] text-[#ff1e38] uppercase mb-2">
                RESERVATION CONFIRMED • PASS GENERATED
              </div>

              <h3 className="font-display font-black text-3xl sm:text-4xl text-white uppercase tracking-tight mb-4">
                YOU'RE BOOKED, <br />
                <span className="text-[#ff1e38] glow-text-red">
                  {confirmedBooking.customerName.toUpperCase()}.
                </span>
              </h3>

              <p className="text-neutral-400 text-sm font-light max-w-md mx-auto mb-8">
                Your bespoke commission has been locked into the atelier scheduling queue. Our Chief Detailer will contact you within 2 hours to confirm vehicle intake logistics.
              </p>

              {/* VIP Reservation Pass Card */}
              <div className="w-full bg-[#121212] border border-neutral-800 rounded-xl p-6 text-left mb-8 relative overflow-hidden tech-border">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">REFERENCE CODE</span>
                    <div className="font-mono font-bold text-xl text-white tracking-wider">
                      {confirmedBooking.id}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">STATUS</span>
                    <div className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center gap-1.5 justify-end">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {confirmedBooking.status}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4">
                  <div>
                    <span className="text-neutral-500">COMMISSIONED VEHICLE:</span>
                    <div className="text-white font-semibold mt-0.5">
                      {confirmedBooking.vehicle?.year} {confirmedBooking.vehicle?.make} {confirmedBooking.vehicle?.model}
                    </div>
                  </div>

                  <div>
                    <span className="text-neutral-500">SELECTED PACKAGE:</span>
                    <div className="text-[#ff1e38] font-semibold mt-0.5">
                      {confirmedBooking.servicePackage?.name}
                    </div>
                  </div>

                  <div>
                    <span className="text-neutral-500">SCHEDULED INTAKE:</span>
                    <div className="text-white font-semibold mt-0.5">
                      {confirmedBooking.preferredDate} ({confirmedBooking.preferredTime})
                    </div>
                  </div>

                  <div>
                    <span className="text-neutral-500">TOTAL QUOTE:</span>
                    <div className="text-white font-bold text-sm mt-0.5">
                      ${confirmedBooking.totalPrice?.toLocaleString()}
                    </div>
                  </div>
                </div>

                {confirmedBooking.selectedAddons?.length > 0 && (
                  <div className="border-t border-neutral-800/80 pt-3 text-xs font-mono">
                    <span className="text-neutral-500">BESPOKE ADD-ONS:</span>
                    <div className="text-neutral-300 mt-1">
                      {confirmedBooking.selectedAddons.map(a => a.name).join(', ')}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <button
                  onClick={() => {
                    playClickSound();
                    onClose();
                    if (onOpenAdminCRM) onOpenAdminCRM();
                  }}
                  className="w-full py-3.5 bg-[#ff1e38] hover:bg-[#d90429] text-white rounded font-mono text-xs font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-glow-red"
                >
                  <ExternalLink size={14} />
                  <span>VIEW IN ATELIER CRM LEADS</span>
                </button>

                <button
                  onClick={handleResetForNewBooking}
                  className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded font-mono text-xs tracking-wider uppercase transition-colors"
                >
                  BOOK ANOTHER VEHICLE
                </button>
              </div>

            </div>
          ) : (
            /* INTERACTIVE BOOKING FORM */
            <form onSubmit={handleConfirmBooking} className="space-y-8">
              
              {/* Step 1: Select Package */}
              <div>
                <label className="block text-xs font-mono font-bold tracking-wider text-neutral-300 uppercase mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ff1e38]/20 border border-[#ff1e38]/50 flex items-center justify-center text-[10px] text-[#ff1e38]">1</span>
                  CHOOSE SERVICE PACKAGE
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PACKAGES.map((pkg) => {
                    const isSelected = selectedPkg.id === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          playClickSound();
                          setSelectedPkg(pkg);
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#ff1e38]/10 border-[#ff1e38] shadow-glow-red'
                            : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-[#ff1e38] font-bold">{pkg.level}</span>
                          {isSelected && <Check size={14} className="text-[#ff1e38]" />}
                        </div>
                        <div className="font-display font-bold text-sm text-white uppercase mb-1">
                          {pkg.name}
                        </div>
                        <div className="font-mono text-base font-bold text-white">
                          ${pkg.price}
                        </div>
                        <div className="text-[10px] font-mono text-neutral-500 mt-1">
                          {pkg.duration}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Vehicle Details */}
              <div>
                <label className="block text-xs font-mono font-bold tracking-wider text-neutral-300 uppercase mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ff1e38]/20 border border-[#ff1e38]/50 flex items-center justify-center text-[10px] text-[#ff1e38]">2</span>
                  VEHICLE SPECIFICATION
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">YEAR</label>
                    <input
                      type="text"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                      placeholder="2024"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">MAKE</label>
                    <input
                      type="text"
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      placeholder="Porsche / McLaren"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">MODEL</label>
                    <input
                      type="text"
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="911 GT3 RS"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">PAINT COLOR / FINISH</label>
                    <input
                      type="text"
                      value={paintColor}
                      onChange={(e) => setPaintColor(e.target.value)}
                      placeholder="Guards Red / Gloss Clear"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">CURRENT CONDITION</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                    >
                      <option value="Track Grime & Brake Dust">Track Grime & Brake Dust (Harsh)</option>
                      <option value="Dealer Swirl Marks & Holograms">Dealer Swirl Marks & Holograms</option>
                      <option value="Heavy Clear Coat Oxidation">Heavy Clear Coat Oxidation</option>
                      <option value="Brand New Factory Delivery">Brand New Factory Delivery</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Bespoke Add-ons */}
              <div>
                <label className="block text-xs font-mono font-bold tracking-wider text-neutral-300 uppercase mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ff1e38]/20 border border-[#ff1e38]/50 flex items-center justify-center text-[10px] text-[#ff1e38]">3</span>
                  BESPOKE ATELIER ADD-ONS
                </label>

                <div className="space-y-2">
                  {ADDONS.map((addon) => {
                    const isChecked = selectedAddons.some(a => a.id === addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#ff1e38]/10 border-[#ff1e38]/60 text-white'
                            : 'bg-neutral-950/50 border-neutral-800/80 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked ? 'bg-[#ff1e38] border-[#ff1e38]' : 'border-neutral-700'
                          }`}>
                            {isChecked && <Check size={11} className="text-white" />}
                          </div>
                          <span className="text-xs font-mono">{addon.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-white">
                          +${addon.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 4: Schedule & Logistics */}
              <div>
                <label className="block text-xs font-mono font-bold tracking-wider text-neutral-300 uppercase mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ff1e38]/20 border border-[#ff1e38]/50 flex items-center justify-center text-[10px] text-[#ff1e38]">4</span>
                  LOGISTICS & SCHEDULE
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">INTAKE DATE</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">TIMING / PICKUP</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                    >
                      <option value="08:30 AM (Morning Dropoff)">08:30 AM (Morning Dropoff)</option>
                      <option value="11:00 AM (Mid-Day Intake)">11:00 AM (Mid-Day Intake)</option>
                      <option value="02:00 PM (Afternoon Intake)">02:00 PM (Afternoon Intake)</option>
                      <option value="Enclosed Flatbed Carrier Transport">Enclosed Flatbed Carrier Transport</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">SPECIAL COMMISSION NOTES</label>
                  <textarea
                    rows={2}
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Specific swirl defects, repainted panels, or race rubber..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                  />
                </div>
              </div>

              {/* Step 5: Customer Information */}
              <div>
                <label className="block text-xs font-mono font-bold tracking-wider text-neutral-300 uppercase mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#ff1e38]/20 border border-[#ff1e38]/50 flex items-center justify-center text-[10px] text-[#ff1e38]">5</span>
                  CLIENT IDENTITY
                </label>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">FULL NAME *</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Daniel Vance"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">EMAIL ADDRESS *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="daniel.vance@vancetech.io"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-neutral-500 uppercase block mb-1">PHONE NUMBER</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (415) 890-4421"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2">
                  <AlertCircle size={15} className="text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Real-time Dynamic Price Summary Card */}
              <div className="bg-[#141414] border border-neutral-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Base Package ({selectedPkg.name}):</span>
                  <span className="text-white">${selectedPkg.price.toLocaleString()}</span>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>Add-ons ({selectedAddons.length}):</span>
                    <span className="text-white">+${addonsTotal.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t border-neutral-800 pt-3 flex items-baseline justify-between">
                  <div>
                    <span className="font-display font-bold text-sm text-white uppercase block">
                      ESTIMATED TOTAL
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Payment due on delivery inspection
                    </span>
                  </div>
                  <div className="font-display font-black text-2xl text-[#ff1e38] glow-text-red">
                    ${grandTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Confirm Booking CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#ff1e38] hover:bg-[#d90429] text-white font-display font-black text-sm tracking-widest uppercase rounded shadow-glow-red transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <span className="flex items-center gap-2 font-mono">
                    <Sparkles size={16} className="animate-spin" />
                    RECORDING COMMISSION IN CRM...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>CONFIRM BOOKING</span>
                    <ChevronRight size={16} />
                  </span>
                )}
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
