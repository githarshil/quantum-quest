import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Atom, KeyRound, Mail, Sparkles, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import Pushpin from '../components/Pushpin';
import Tape from '../components/Tape';
import NovaMascot from '../components/NovaMascot';

export default function AuthPage({ onAuthenticated, onBack }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusNotice, setStatusNotice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setStatusNotice('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        if (data?.session) {
          onAuthenticated(data.session.user);
        } else {
          setStatusNotice('Account created! Please check your email or proceed with 1-Click Demo Login.');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data?.user) {
          onAuthenticated(data.user);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Instant Demo Login for Hackathon Judges & Testing
  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // Try to sign in to demo account, if not found then sign up
      const demoEmail = 'cadet.demo@quantumquest.internal';
      const demoPassword = 'QuantumExplorer2026!';

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (signInError) {
        // Try sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
        });
        if (signUpError) {
          // If signup fails because of rate limit or email confirmation, supply mock user session
          const mockUser = {
            id: 'mock-cadet-001',
            email: 'cadet.demo@quantumquest.internal',
            user_metadata: { full_name: 'Quantum Pioneer' }
          };
          onAuthenticated(mockUser);
          return;
        }
        if (signUpData?.user) {
          onAuthenticated(signUpData.user);
          return;
        }
      } else if (signInData?.user) {
        onAuthenticated(signInData.user);
        return;
      }
      
      // Fallback
      onAuthenticated({ id: 'demo-user', email: 'cadet.demo@quantumquest.internal' });
    } catch {
      // Graceful instant fallback
      onAuthenticated({ id: 'demo-user', email: 'cadet.demo@quantumquest.internal' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {onBack && (
        <button
          onClick={onBack}
          className="mb-4 btn-ghost-tactile text-xs px-4 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Return to Overview</span>
        </button>
      )}

      {/* Scrapbook Manila Folder Card */}
      <div className="relative w-full max-w-md paper-card-lift p-8 border-2 border-amber-300 text-slate-800">
        {/* Decorative Tape & Pushpins */}
        <Pushpin color="red" className="absolute -top-3 left-10" />
        <Pushpin color="gold" className="absolute -top-3 right-10" />
        <Tape position="top" angle="-rotate-3" color="#f5ea92" className="-top-3 left-1/3 w-32" />

        {/* Brand Header */}
        <div className="text-center mb-6 pt-2">
          <img 
            src="/favicon.svg" 
            alt="Quantum Quest Logo" 
            className="w-14 h-14 rounded-2xl shadow-md mb-3 border-2 border-[#166557] mx-auto object-contain" 
          />
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-sans">QUANTUM QUEST</h1>
          <p className="font-hand text-lg text-amber-900 mt-1">Laboratory Enrollment & Cadet Dossier</p>
        </div>

        {/* Quick Demo Access Callout */}
        <div className="mb-6 p-3 bg-amber-50 rounded-xl border border-amber-300/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-900 flex items-center gap-1 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> HACKATHON QUICK-PASS
            </div>
            <p className="text-[11px] text-amber-800 font-sans">Instant guest session without waiting</p>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="btn-secondary-tactile text-xs py-1.5 px-3 rounded-lg"
          >
            <span>Demo Login</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-300 w-full" />
          <span className="bg-cream px-3 text-[11px] font-mono text-slate-400 uppercase">OR CADET CREDENTIALS</span>
        </div>

        {/* Error / Status Alert */}
        {errorMessage && (
          <div className="mb-4 p-2.5 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-lg font-mono">
            {errorMessage}
          </div>
        )}
        {statusNotice && (
          <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg font-mono">
            {statusNotice}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">CADET EMAIL</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="feynman@quantumquest.org"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">SECURITY CLEARANCE (PASSWORD)</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-tactile w-full py-2.5 rounded-xl uppercase tracking-wider text-xs font-bold"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>{loading ? 'AUTHENTICATING...' : isSignUp ? 'ENROLL CADET DOSSIER' : 'ENTER LABORATORY'}</span>
          </button>
        </form>

        {/* Toggle Login / Sign Up */}
        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(''); setStatusNotice(''); }}
            className="text-xs text-slate-600 hover:text-slate-900 underline font-sans"
          >
            {isSignUp ? 'Already enrolled? Enter with existing credentials' : "Need a cadet dossier? Register new identity"}
          </button>
        </div>

        {/* Onboarding NOVA Assistant Greeting */}
        <div className="mt-5 pt-3 border-t border-amber-200/80 flex items-center justify-center gap-2 text-slate-600 text-[11px] font-mono">
          <NovaMascot size="xs" state="idle" />
          <span>NOVA AI Guide standing by to assist your quantum training</span>
        </div>
      </div>
    </div>
  );
}
