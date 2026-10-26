import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Atelier Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#080808] text-neutral-100 flex flex-col items-center justify-center p-6 text-center font-mono selection:bg-[#ff1e38] selection:text-white">
          <div className="w-14 h-14 rounded-2xl bg-[#ff1e38]/15 border-2 border-[#ff1e38] flex items-center justify-center text-[#ff1e38] text-2xl font-bold mb-6 shadow-glow-red animate-pulse">
            !
          </div>

          <div className="text-[10px] font-mono tracking-widest text-[#ff1e38] uppercase mb-2">
            ATELIER RUNTIME RECOVERY
          </div>

          <h1 className="font-display font-black text-2xl sm:text-4xl text-white uppercase tracking-tight mb-3">
            DISPLAY RESYNC REQUIRED
          </h1>

          <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-md mx-auto mb-8 leading-relaxed">
            A temporary rendering anomaly was intercepted. Tap below to reload the high-definition atelier experience.
          </p>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#ff1e38] hover:bg-[#d90429] text-white font-display font-bold text-xs uppercase tracking-widest rounded shadow-glow-red transition-all"
          >
            RELOAD ATELIER STUDIO
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
