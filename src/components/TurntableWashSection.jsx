import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Layers, 
  Eye, 
  ShieldCheck, 
  Droplets, 
  Zap, 
  Sliders, 
  Play, 
  Pause, 
  Compass, 
  ChevronLeft, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { playClickSound, playWashSound, playGlassSound } from '../utils/soundEffects';

export default function TurntableWashSection({ onOpenBooking }) {
  // Active interaction mode: 'turntable' (360 rotate) or 'wash' (split compare)
  const [activeMode, setActiveMode] = useState('turntable');

  // Turntable rotation: 0° to 359°
  const [rotationAngle, setRotationAngle] = useState(45);
  const [isRotating, setIsRotating] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(1); // 1x, 2x

  // Wash slider position: 0 (dirty) to 100 (clean 10H glass)
  const [sliderPos, setSliderPos] = useState(55);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [autoCleanActive, setAutoCleanActive] = useState(false);

  // Specs & UI states
  const [selectedSpec, setSelectedSpec] = useState('gt3');
  const [showDefectPins, setShowDefectPins] = useState(true);

  const containerRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const lastClientXRef = useRef(0);
  const isInteractingRef = useRef(false);
  const gestureLockedRef = useRef(null); // null | 'horizontal' | 'vertical'
  const animFrameRef = useRef(null);

  // Specifications
  const specs = [
    { id: 'gt3', code: 'SPEC 01: GT3 RS', name: 'Porsche 911 GT3 RS (992)', paint: 'Guards Red' },
    { id: '720s', code: 'SPEC 02: 720S', name: 'McLaren 720S Performance', paint: 'Volcano Red' },
    { id: 'f8', code: 'SPEC 03: F8', name: 'Ferrari F8 Tributo Bespoke', paint: 'Rosso Corsa' },
  ];

  // Turntable preset camera angles
  const anglePresets = [
    { angle: 45, label: '045° FRONT', sensor: '48° FRONT LEFT' },
    { angle: 135, label: '135° REAR L', sensor: '135° REAR LEFT FLANK' },
    { angle: 180, label: '180° REAR', sensor: '180° REAR DIFFUSER' },
    { angle: 270, label: '270° REAR R', sensor: '270° REAR RIGHT QTR' },
    { angle: 315, label: '315° FRONT R', sensor: '315° AERO CANOPY' },
  ];

  // Dynamic Telemetry calculations based on wash percentage and turntable bearing
  const glossUnits = (32.4 + (sliderPos / 100) * (98.4 - 32.4)).toFixed(1);
  const particlesEradicated = ((sliderPos / 100) * 14.8).toFixed(1);
  const clearCoatArmor = Math.round((sliderPos / 100) * 28);

  // Determine current quadrant & bearing description
  const getBearingDescription = (deg) => {
    const d = (deg % 360 + 360) % 360;
    if (d >= 337.5 || d < 22.5) return '000° FRONT DIRECT';
    if (d >= 22.5 && d < 67.5) return '045° FRONT LEFT';
    if (d >= 67.5 && d < 112.5) return '090° PORT PROFILE';
    if (d >= 112.5 && d < 157.5) return '135° REAR LEFT';
    if (d >= 157.5 && d < 202.5) return '180° REAR DIRECT';
    if (d >= 202.5 && d < 247.5) return '225° REAR RIGHT';
    if (d >= 247.5 && d < 292.5) return '270° STARBOARD';
    return '315° FRONT RIGHT';
  };

  const normalizedAngle = (rotationAngle % 360 + 360) % 360;
  const isRearView = normalizedAngle >= 90 && normalizedAngle < 270;
  const isMirrored = (normalizedAngle >= 90 && normalizedAngle < 180) || (normalizedAngle >= 270 && normalizedAngle < 360);

  const cleanImageSrc = isRearView ? '/images/car-clean-rear.jpg' : '/images/car-clean-front.jpg';
  const dirtyImageSrc = isRearView ? '/images/car-clean-rear.jpg' : '/images/car-dirty-front.jpg';

  // 360 Motorized Auto-Rotation Loop (Smooth & cinematic)
  useEffect(() => {
    if (!autoRotate) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTime = performance.now();
    const rotateStep = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      // Gentle cinematic speed: ~16 degrees per second at 1x
      const degPerSec = 16 * rotationSpeed;
      setRotationAngle((prev) => (prev + degPerSec * delta) % 360);
      animFrameRef.current = requestAnimationFrame(rotateStep);
    };

    animFrameRef.current = requestAnimationFrame(rotateStep);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoRotate, rotationSpeed]);

  // Pointer Down (Mouse, Touch, Pen)
  const handlePointerDown = (e) => {
    startPosRef.current = { x: e.clientX, y: e.clientY };
    lastClientXRef.current = e.clientX;
    isInteractingRef.current = true;
    gestureLockedRef.current = e.pointerType === 'mouse' ? 'horizontal' : null;

    if (e.pointerType === 'mouse') {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch (err) {}
      if (activeMode === 'wash') {
        setIsDraggingSlider(true);
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const x = e.clientX - rect.left;
          setSliderPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
        }
      } else {
        setIsRotating(true);
        setAutoRotate(false);
        playClickSound();
      }
    }
  };

  // Pointer Move (Mouse, Touch, Pen) with smart horizontal/vertical disambiguation
  const handlePointerMove = (e) => {
    if (!isInteractingRef.current) return;

    // For touch devices, disambiguate horizontal interaction vs vertical page scrolling
    if (gestureLockedRef.current === null) {
      const deltaX = Math.abs(e.clientX - startPosRef.current.x);
      const deltaY = Math.abs(e.clientY - startPosRef.current.y);

      // Need at least 6px movement threshold to classify gesture
      if (deltaX < 6 && deltaY < 6) return;

      if (deltaY > deltaX) {
        // Vertical scroll: do not interfere with page scrolling!
        gestureLockedRef.current = 'vertical';
        isInteractingRef.current = false;
        return;
      } else {
        // Horizontal gesture: user wants to rotate turntable or drag wash slider
        gestureLockedRef.current = 'horizontal';
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch (err) {}
        if (activeMode === 'wash') {
          setIsDraggingSlider(true);
        } else {
          setIsRotating(true);
          setAutoRotate(false);
          playClickSound();
        }
      }
    }

    if (gestureLockedRef.current !== 'horizontal') return;

    if (activeMode === 'wash') {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clamped = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(clamped);
    } else {
      // Damped luxury rotation (0.28 sensitivity prevents high-speed spinning)
      const deltaX = e.clientX - lastClientXRef.current;
      lastClientXRef.current = e.clientX;
      const SENSITIVITY = 0.28;
      const angleChange = deltaX * SENSITIVITY;
      setRotationAngle((prev) => ((prev + angleChange) % 360 + 360) % 360);
    }
  };

  // Pointer Up / Cancel / Lost Capture
  const handlePointerEnd = (e) => {
    if (isInteractingRef.current || gestureLockedRef.current) {
      if (e?.currentTarget && e?.pointerId !== undefined) {
        try {
          if (e.currentTarget.hasPointerCapture && e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        } catch (err) {}
      }
      isInteractingRef.current = false;
      gestureLockedRef.current = null;
      setIsRotating(false);
      setIsDraggingSlider(false);
    }
  };

  // Step rotation by delta degrees
  const stepRotation = (deg) => {
    playClickSound();
    setAutoRotate(false);
    setRotationAngle((prev) => ((prev + deg) % 360 + 360) % 360);
  };

  // Scroll to wash effect when user scrolls section into view (only in wash mode)
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || activeMode !== 'wash') return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight * 0.75 && rect.bottom > windowHeight * 0.25) {
        const progress = Math.max(0, Math.min(1, (windowHeight * 0.75 - rect.top) / (rect.height + windowHeight * 0.4)));
        if (!isInteractingRef.current && !autoCleanActive) {
          setSliderPos(Math.round(progress * 100));
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [autoCleanActive, activeMode]);

  // Automated ultrasonic clean & ceramic wash sequence
  const triggerAutoClean = () => {
    playClickSound();
    playWashSound();
    setActiveMode('wash');
    setAutoCleanActive(true);
    setSliderPos(0);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setAutoCleanActive(false);
        playGlassSound();
      }
      setSliderPos(current);
    }, 28);
  };

  return (
    <section id="turntable" className="relative py-16 sm:py-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#ff1e38]/30 bg-[#ff1e38]/10 text-[#ff1e38] text-[9px] sm:text-[10px] font-mono tracking-widest uppercase mb-3">
          <span>⬡ 360° ATELIER TURNTABLE & DEFECT ERADICATION</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tighter uppercase mb-3 leading-tight">
          SWIRLS OUT. <span className="text-[#ff1e38] glow-text-red">GLASS ON.</span>
        </h2>

        <p className="text-neutral-400 text-xs sm:text-base font-light leading-relaxed">
          Rotate through multi-angle studio perspectives of our precision motorized turntable. Scrub the split-slider to watch track grime transform into 10H liquid glass.
        </p>
      </div>

      {/* Mode Switcher Tabs (360° Turntable Mode vs Wash Split Mode) */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 px-2">
        <button
          onClick={() => {
            playClickSound();
            setActiveMode('turntable');
          }}
          className={`px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-sm ${
            activeMode === 'turntable'
              ? 'bg-[#ff1e38] text-white shadow-glow-red scale-102'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
          }`}
        >
          <RotateCw size={14} className={activeMode === 'turntable' ? 'text-white' : 'text-neutral-500'} />
          <span>360° TURNTABLE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveMode('wash');
          }}
          className={`px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-sm ${
            activeMode === 'wash'
              ? 'bg-[#ff1e38] text-white shadow-glow-red scale-102'
              : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
          }`}
        >
          <Sliders size={14} className={activeMode === 'wash' ? 'text-white' : 'text-neutral-500'} />
          <span>SCROLL-TO-WASH</span>
        </button>
      </div>

      {/* Turntable Control Bar */}
      <div className="bg-[#101010]/95 backdrop-blur-md border border-neutral-800 rounded-t-xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        
        {/* Spec Selectors */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {specs.map((spec) => (
            <button
              key={spec.id}
              onClick={() => {
                playClickSound();
                setSelectedSpec(spec.id);
              }}
              className={`px-2.5 sm:px-3.5 py-1.5 rounded text-[10px] sm:text-xs font-mono tracking-wider uppercase whitespace-nowrap transition-all ${
                selectedSpec === spec.id
                  ? 'bg-[#ff1e38] text-white font-bold shadow-glow-red'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {spec.code}
            </button>
          ))}
        </div>

        {/* 360° Preset Angle Switcher */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {anglePresets.map((ang) => {
            const isClosest = Math.abs(normalizedAngle - ang.angle) < 22.5;
            return (
              <button
                key={ang.angle}
                onClick={() => {
                  playClickSound();
                  setAutoRotate(false);
                  setRotationAngle(ang.angle);
                }}
                className={`px-2 sm:px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono tracking-wider uppercase transition-all whitespace-nowrap ${
                  isClosest
                    ? 'bg-neutral-100 text-black font-bold shadow-sm ring-1 ring-[#ff1e38]'
                    : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {ang.label}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {activeMode === 'turntable' ? (
            <>
              {/* Auto Rotate Button */}
              <button
                onClick={() => {
                  playClickSound();
                  setAutoRotate(!autoRotate);
                }}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border transition-all flex items-center justify-center gap-1.5 ${
                  autoRotate 
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400' 
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
                }`}
              >
                {autoRotate ? <Pause size={12} /> : <Play size={12} />}
                <span>{autoRotate ? 'PAUSE 360°' : 'AUTO-ROTATE 360°'}</span>
              </button>

              {/* Step Rotate Buttons */}
              <div className="flex items-center gap-1 bg-neutral-950 p-0.5 rounded border border-neutral-800 shrink-0">
                <button
                  onClick={() => stepRotation(-15)}
                  className="w-7 h-7 rounded hover:bg-neutral-800 flex items-center justify-center text-neutral-300 active:scale-95"
                  title="Rotate -15° Left"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => stepRotation(15)}
                  className="w-7 h-7 rounded hover:bg-neutral-800 flex items-center justify-center text-neutral-300 active:scale-95"
                  title="Rotate +15° Right"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowDefectPins(!showDefectPins)}
                className={`px-2.5 py-1.5 rounded text-[10px] sm:text-xs font-mono border transition-colors flex items-center gap-1 ${
                  showDefectPins 
                    ? 'border-[#ff1e38]/50 text-[#ff1e38] bg-[#ff1e38]/10' 
                    : 'border-neutral-800 text-neutral-400 bg-neutral-900'
                }`}
              >
                <Eye size={12} />
                <span>HOTSPOTS</span>
              </button>

              <button
                onClick={triggerAutoClean}
                disabled={autoCleanActive}
                className="px-3 py-1.5 rounded text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase bg-gradient-to-r from-red-600 to-[#ff1e38] text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
              >
                <Sparkles size={12} className={autoCleanActive ? "animate-spin" : ""} />
                <span>{autoCleanActive ? 'WASHING...' : 'RUN AUTO-WASH'}</span>
              </button>
            </>
          )}
        </div>

      </div>

      {/* Telemetry Diagnostic Bar */}
      <div className="bg-[#0b0b0b] border-x border-b border-neutral-800/90 px-3 sm:px-4 py-2 text-[10px] sm:text-[11px] font-mono text-neutral-400 flex flex-wrap items-center justify-between gap-y-1.5">
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-pulse" />
            <span className="text-neutral-500">BEARING:</span>
            <span className="text-white font-semibold">
              {Math.round(normalizedAngle)}°
            </span>
            <span className="text-neutral-400 hidden xs:inline">• {getBearingDescription(normalizedAngle)}</span>
          </span>

          <span className="hidden sm:inline-flex items-center gap-1.5">
            <span className="text-neutral-500">PARTICLES:</span>
            <span className="text-[#ff1e38] font-bold">{particlesEradicated}k</span>
          </span>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <span className="flex items-center gap-1.5">
            <span className="text-neutral-500">GLOSS:</span>
            <span className="text-emerald-400 font-bold">{glossUnits} GU</span>
          </span>

          <span className="flex items-center gap-1.5">
            <span className="text-neutral-500">ARMOR:</span>
            <span className="text-white font-semibold">+{clearCoatArmor}µ</span>
            <span className="text-[#ff1e38] font-bold text-[9px] sm:text-[10px]">10H</span>
          </span>
        </div>
      </div>

      {/* Interactive Turntable Viewer Container */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onLostPointerCapture={handlePointerEnd}
        className={`relative w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] min-h-[280px] max-h-[620px] bg-[#070707] border-x border-b border-neutral-800 overflow-hidden select-none touch-pan-y ${
          activeMode === 'turntable' ? (isRotating ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-ew-resize'
        }`}
      >
        {/* Dynamic Studio Ambient Lighting & Shadow */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black pointer-events-none z-10" />

        {/* Motorized Circular Turntable Stage Floor Graphic */}
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-48 flex items-center justify-center pointer-events-none z-0 overflow-hidden max-w-full">
          <div 
            className="w-[95%] sm:w-[850px] max-w-[850px] h-[180px] sm:h-[340px] rounded-[50%] border-2 border-neutral-700/60 shadow-[0_0_80px_rgba(255,30,56,0.35)] relative flex items-center justify-center transition-transform duration-75 ease-out"
            style={{
              transform: `perspective(600px) rotateX(72deg) rotateZ(${normalizedAngle}deg)`,
              background: 'radial-gradient(circle, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 70%, rgba(255,30,56,0.2) 100%)'
            }}
          >
            <div className="w-[80%] h-[75%] rounded-[50%] border border-red-500/40 border-dashed" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-red-500/30" />
              <div className="h-full w-[1px] bg-red-500/30 absolute" />
            </div>
            <span className="absolute top-2 text-[9px] sm:text-[10px] font-mono text-[#ff1e38] font-bold">000°</span>
            <span className="absolute right-3 text-[9px] sm:text-[10px] font-mono text-neutral-400 font-bold">090°</span>
            <span className="absolute bottom-2 text-[9px] sm:text-[10px] font-mono text-neutral-400 font-bold">180°</span>
            <span className="absolute left-3 text-[9px] sm:text-[10px] font-mono text-neutral-400 font-bold">270°</span>
          </div>
        </div>

        {/* CAR PERSPECTIVE LAYER */}
        <div 
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-100 ease-out"
          style={{
            transform: isMirrored ? 'scaleX(-1)' : 'scaleX(1)'
          }}
        >
          {/* Base Clean / Ceramic Image */}
          <img
            src={cleanImageSrc}
            alt="Porsche GT3 RS 360 Turntable View"
            className="w-full h-full object-cover object-center filter contrast-105"
            draggable={false}
          />

          {/* Dynamic Light Sweep reflection simulating motorized turntable rotation */}
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none mix-blend-screen opacity-60 transition-transform duration-75"
            style={{
              transform: `translateX(${((normalizedAngle % 180) / 180) * 120 - 60}%)`
            }}
          />

          {/* If in WASH mode: render clipped dirty layer on top */}
          {activeMode === 'wash' && (
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none transition-[clip-path] duration-75"
              style={{
                clipPath: isMirrored
                  ? `polygon(${100 - sliderPos}% 0, 100% 0, 100% 100%, ${100 - sliderPos}% 100%)`
                  : `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
              }}
            >
              <img
                src={dirtyImageSrc}
                alt="Dirty unwashed car surface"
                className="w-full h-full object-cover object-center filter brightness-95"
                draggable={false}
              />
              <div className="absolute inset-0 bg-black/15 pointer-events-none" />
            </div>
          )}
        </div>

        {/* DEFECT HOTSPOTS */}
        {activeMode === 'wash' && showDefectPins && sliderPos > 25 && (
          <div className="pointer-events-none z-20">
            <div 
              className="absolute top-[48%] left-[24%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-opacity duration-300"
              style={{ opacity: sliderPos > 30 ? 1 : 0 }}
            >
              <div className="w-3 h-3 rounded-full bg-[#ff1e38] animate-ping" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff1e38] absolute" />
              <div className="bg-black/90 backdrop-blur-md border border-[#ff1e38]/50 px-2 py-0.5 rounded text-[9px] font-mono text-neutral-200">
                <span className="text-[#ff1e38] font-bold">DEFECT:</span> Swirls & Grit
              </div>
            </div>

            <div 
              className="absolute top-[68%] left-[38%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 transition-opacity duration-300"
              style={{ opacity: sliderPos > 44 ? 1 : 0 }}
            >
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute" />
              <div className="bg-black/90 backdrop-blur-md border border-amber-500/50 px-2 py-0.5 rounded text-[9px] font-mono text-neutral-200">
                <span className="text-amber-400 font-bold">BRAKE DUST:</span> Iron Sintering
              </div>
            </div>
          </div>
        )}

        {/* WASH MODE: Split Laser Line & Drag Handle */}
        {activeMode === 'wash' && (
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-[#ff1e38] shadow-[0_0_12px_#ff1e38] z-30 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute top-0 -translate-x-1/2 w-3 h-3 bg-[#ff1e38] rotate-45" />
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-black/90 border-2 border-[#ff1e38] shadow-glow-red flex items-center justify-center pointer-events-auto cursor-ew-resize">
              <Sliders size={15} className="text-[#ff1e38] rotate-90" />
            </div>
            <div className="absolute bottom-0 -translate-x-1/2 w-3 h-3 bg-[#ff1e38] rotate-45" />
          </div>
        )}

        {/* 360° TURNTABLE MODE: Interactive Center Angle Compass & HUD Guidance */}
        {activeMode === 'turntable' && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none max-w-[90%]">
            <div className="bg-black/85 backdrop-blur-md border border-neutral-700/80 px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-mono tracking-wider text-white flex items-center gap-1.5 sm:gap-2 shadow-lg truncate">
              <Compass size={13} className="text-[#ff1e38] shrink-0" />
              <span>BEARING: <strong className="text-[#ff1e38]">{Math.round(normalizedAngle)}°</strong></span>
              <span className="text-neutral-500 hidden xs:inline">•</span>
              <span className="text-neutral-300 uppercase text-[10px] hidden xs:inline truncate">{getBearingDescription(normalizedAngle)}</span>
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="bg-black/85 backdrop-blur-md border border-neutral-700/80 px-2 sm:px-3 py-1 rounded text-[9px] sm:text-[11px] font-mono tracking-wider text-neutral-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff1e38] animate-ping shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-none">
              {activeMode === 'turntable' ? '360° TURNTABLE' : 'TRACK GRIME'}
            </span>
          </div>
        </div>

        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <div className="bg-black/85 backdrop-blur-md border border-emerald-500/60 px-2 sm:px-3 py-1 rounded text-[9px] sm:text-[11px] font-mono tracking-wider text-emerald-400 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate max-w-[140px] sm:max-w-none">10H CERAMIC ARMOR</span>
          </div>
        </div>

        {/* Bottom HUD Instruction & Quick Preset Controls */}
        <div className="absolute bottom-3 left-2 right-2 sm:left-4 sm:right-4 z-20 flex flex-col sm:flex-row items-center justify-between gap-2 pointer-events-none">
          
          <div className="bg-black/85 backdrop-blur-md border border-neutral-800 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono text-neutral-300 tracking-wide flex items-center gap-1.5 pointer-events-auto shadow-md">
            {activeMode === 'turntable' ? (
              <>
                <RotateCw size={11} className="text-[#ff1e38] shrink-0" />
                <span>Drag smoothly to rotate 360°</span>
              </>
            ) : (
              <span>Drag slider horizontally to wash</span>
            )}
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-1 pointer-events-auto bg-black/85 backdrop-blur-md border border-neutral-800 p-1 rounded-lg">
            {activeMode === 'turntable' ? (
              <>
                <button
                  onClick={() => { playClickSound(); setRotationAngle(0); setAutoRotate(false); }}
                  className="px-2 py-1 rounded text-[9px] sm:text-[10px] font-mono uppercase text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  0°
                </button>
                <button
                  onClick={() => { playClickSound(); setRotationAngle(90); setAutoRotate(false); }}
                  className="px-2 py-1 rounded text-[9px] sm:text-[10px] font-mono uppercase text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  90°
                </button>
                <button
                  onClick={() => { playClickSound(); setRotationAngle(180); setAutoRotate(false); }}
                  className="px-2 py-1 rounded text-[9px] sm:text-[10px] font-mono uppercase text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  180°
                </button>
                <button
                  onClick={() => { playClickSound(); setRotationAngle(270); setAutoRotate(false); }}
                  className="px-2 py-1 rounded text-[9px] sm:text-[10px] font-mono uppercase text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  270°
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { playClickSound(); setSliderPos(0); }}
                  className="px-2 py-1 rounded text-[9px] sm:text-[10px] font-mono uppercase text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  DIRTY
                </button>
                <button
                  onClick={() => { playClickSound(); setSliderPos(50); }}
                  className="px-2 py-1 rounded text-[9px] sm:text-[10px] font-mono uppercase text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                >
                  SPLIT
                </button>
                <button
                  onClick={() => { playGlassSound(); setSliderPos(100); }}
                  className="px-2 py-1 rounded text-[9px] sm:text-[10px] font-mono uppercase bg-[#ff1e38]/20 border border-[#ff1e38]/40 text-[#ff1e38] font-bold transition-colors"
                >
                  100% GLASS
                </button>
              </>
            )}
          </div>

        </div>

      </div>

      {/* 360 Degree Turntable Angle Scrub Slider Bar */}
      <div className="bg-[#0e0e0e] border-x border-b border-neutral-800 rounded-b-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div className="flex items-center gap-2">
            <RotateCw size={14} className="text-[#ff1e38]" />
            <span className="text-[11px] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider whitespace-nowrap">
              ANGLE:
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-mono font-bold text-white bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded min-w-[50px] text-center">
            {Math.round(normalizedAngle)}°
          </span>
        </div>

        {/* 360 Degree Range Slider */}
        <div className="w-full flex-1 max-w-xl flex items-center gap-2 sm:gap-3">
          <span className="text-[10px] font-mono text-neutral-500">0°</span>
          <input
            type="range"
            min="0"
            max="359"
            value={Math.round(normalizedAngle)}
            onChange={(e) => {
              setAutoRotate(false);
              setRotationAngle(Number(e.target.value));
            }}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#ff1e38]"
          />
          <span className="text-[10px] font-mono text-neutral-500">360°</span>
        </div>

        {/* Turntable Speed Toggle */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">SPEED:</span>
          <button
            onClick={() => {
              playClickSound();
              setRotationSpeed(rotationSpeed === 1 ? 2 : 1);
            }}
            className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-neutral-300 hover:text-white"
          >
            {rotationSpeed}x
          </button>
        </div>
      </div>

      {/* 3 Precision Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-8">
        
        {/* Card 1 */}
        <div className="tech-border glass-panel rounded-xl p-5 sm:p-6 hover:border-[#ff1e38]/40 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-lg bg-[#ff1e38]/10 border border-[#ff1e38]/30 flex items-center justify-center text-[#ff1e38] mb-3 group-hover:scale-105 transition-transform">
            <Droplets size={18} />
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight mb-2">
            pH-Neutral Foam Decontamination
          </h3>
          <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
            Snow foam induction system, iron purge, resin / fallout chemical bath purge, and clay bar treatment to lift 100% bonded asphalt contaminants without clear coat micro-scratching.
          </p>
        </div>

        {/* Card 2 */}
        <div className="tech-border glass-panel rounded-xl p-5 sm:p-6 hover:border-[#ff1e38]/40 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-lg bg-[#ff1e38]/10 border border-[#ff1e38]/30 flex items-center justify-center text-[#ff1e38] mb-3 group-hover:scale-105 transition-transform">
            <Zap size={18} />
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight mb-2">
            Multi-Stage Rotary Correction
          </h3>
          <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
            Micro-abrasive leveling compounds and Rupes Bigfoot rotary polishers eradicate 99% of swirl marks, spider-webbing, and clear coat haze under calibrated 6500K inspection LEDs.
          </p>
        </div>

        {/* Card 3 */}
        <div className="tech-border glass-panel rounded-xl p-5 sm:p-6 hover:border-[#ff1e38]/40 transition-all duration-300 group">
          <div className="w-10 h-10 rounded-lg bg-[#ff1e38]/10 border border-[#ff1e38]/30 flex items-center justify-center text-[#ff1e38] mb-3 group-hover:scale-105 transition-transform">
            <ShieldCheck size={18} />
          </div>
          <h3 className="font-display font-bold text-base sm:text-lg text-white uppercase tracking-tight mb-2">
            Dual-Layer 10H Ceramic Shield
          </h3>
          <p className="text-neutral-400 text-xs sm:text-sm font-light leading-relaxed">
            Cured under infrared short-wave lamps, 10H liquid crystal coats fuse permanently to clear coat. Yields extreme 118° hydrophobic water-shedding, chemical resistance (pH 2–13), and optical depth.
          </p>
        </div>

      </div>

    </section>
  );
}
