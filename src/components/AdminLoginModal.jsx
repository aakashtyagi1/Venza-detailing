import React, { useState } from 'react';
import { X, ShieldCheck, Lock, User, KeyRound, AlertCircle, ArrowRight, Zap } from 'lucide-react';
import { adminLogin } from '../services/api';
import { playClickSound, playSuccessChime } from '../utils/soundEffects';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    playClickSound();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await adminLogin(username, password);
      playSuccessChime();
      onLoginSuccess(res);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('admin123');
    setTimeout(() => {
      handleSubmit();
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-md" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#0f0f0f] border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 z-10 tech-border">
        
        {/* Close Button */}
        <button
          onClick={() => { playClickSound(); onClose(); }}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-600 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#ff1e38]/10 border border-[#ff1e38]/40 flex items-center justify-center text-[#ff1e38] mx-auto mb-3 shadow-glow-red">
            <Lock size={22} />
          </div>

          <div className="text-[10px] font-mono tracking-widest text-[#ff1e38] uppercase mb-1">
            CONCIERGE PORTAL ACCESS
          </div>

          <h3 className="font-display font-black text-2xl text-white uppercase tracking-tight">
            WELCOME BACK, ADMIN
          </h3>

          <p className="text-neutral-400 text-xs mt-1">
            Enter authorized security clearance to manage customer reservations and atelier CRM leads.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1.5 flex items-center gap-1.5">
              <User size={12} className="text-neutral-500" />
              ADMIN USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-neutral-400 uppercase block mb-1.5 flex items-center gap-1.5">
              <KeyRound size={12} className="text-neutral-500" />
              SECURITY KEY / PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#ff1e38]"
              placeholder="••••••••"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono flex items-center gap-2">
              <AlertCircle size={14} className="text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#ff1e38] hover:bg-[#d90429] text-white font-mono text-xs font-bold tracking-wider uppercase rounded shadow-glow-red transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <span>VERIFYING CREDENTIALS...</span>
            ) : (
              <span className="flex items-center gap-2">
                <span>AUTHORIZE ACCESS</span>
                <ArrowRight size={14} />
              </span>
            )}
          </button>
        </form>

        {/* Quick Demo Access Helper */}
        <div className="mt-6 pt-5 border-t border-neutral-800/80 text-center">
          <button
            onClick={handleQuickDemoLogin}
            className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-300 rounded text-xs font-mono tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={13} className="text-amber-400" />
            <span>ONE-CLICK DEMO ADMIN LOGIN (admin / admin123)</span>
          </button>
        </div>

      </div>
    </div>
  );
}
