import React, { useState } from 'react';
import { 
  Compass, 
  BookOpen, 
  Cpu, 
  User, 
  Zap, 
  LogOut, 
  Menu, 
  X,
  LogIn
} from 'lucide-react';

export default function Navbar({
  currentScreen = 'hero',
  onNavigate = () => {},
  user = null,
  userProgress = { xp: 300, completedLevels: [] },
  onSignOut = () => {}
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const xp = userProgress?.xp || 300;
  const isAuthed = !!user;

  const navItems = [
    { id: 'hero', label: 'Walkthrough', icon: Compass },
    { id: 'dashboard', label: 'Syllabus', icon: BookOpen },
    { id: 'lab', label: 'Lab', icon: Cpu },
    { id: 'profile', label: 'Dossier', icon: User },
  ];

  const handleNav = (screenId) => {
    onNavigate(screenId);
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-3 sm:top-4 inset-x-0 z-50 flex justify-center pointer-events-none px-3 select-none">
      {/* Floating Island Capsule - w-max guarantees container never cramps contents */}
      <div className="pointer-events-auto h-11 sm:h-12 px-4 sm:px-5 flex items-center justify-between gap-3 sm:gap-4 rounded-full bg-[#06241e]/95 backdrop-blur-xl border border-emerald-500/25 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-max max-w-[96vw]">
        
        {/* Brand */}
        <button
          onClick={() => handleNav('hero')}
          className="h-7 flex items-center gap-2 group flex-shrink-0 pr-1 text-slate-100 hover:text-amber-300 transition-colors"
          title="Return to Hero Walkthrough"
        >
          <img 
            src="/favicon.svg" 
            alt="Quantum Quest" 
            className="w-5 h-5 rounded object-contain border border-emerald-400/40 group-hover:scale-105 transition-transform"
          />
          <span className="font-sans font-bold text-xs tracking-wider">
            QUANTUM QUEST
          </span>
        </button>

        {/* Center Minimal Navigation Links */}
        <nav className="hidden md:flex items-center gap-0.5 bg-black/25 px-1 py-0.5 rounded-full border border-white/5 h-7">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`h-6 px-2.5 rounded-full text-[11px] font-mono font-medium flex items-center justify-center transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions: XP Pill + Integrated Cadet/SignOut Pill */}
        <div className="flex items-center gap-2 flex-shrink-0">
          
          {/* XP Pill */}
          <button
            onClick={() => handleNav('profile')}
            className="h-7 px-2.5 rounded-full bg-emerald-950/70 border border-emerald-500/25 text-[11px] font-mono text-amber-300 font-bold flex items-center justify-center gap-1 hover:border-amber-400/40 transition-colors"
            title="Current Cadet XP"
          >
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>{xp}</span>
          </button>

          {/* Auth State */}
          {isAuthed ? (
            /* Integrated Cadet Pill with Internal Sign Out Button */
            <div className="h-7 pl-2.5 pr-1 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 flex items-center justify-center gap-1.5 transition-all">
              <button
                onClick={() => handleNav('profile')}
                className="text-[11px] font-mono font-medium text-slate-200 hover:text-white truncate max-w-[90px] sm:max-w-[110px]"
                title="Open Cadet Dossier"
              >
                {user?.email?.split('@')[0] || 'Cadet'}
              </button>

              <button
                onClick={onSignOut}
                className="w-5 h-5 rounded-full hover:bg-rose-500/25 text-slate-400 hover:text-rose-300 flex items-center justify-center transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('auth')}
              className="h-7 px-3 rounded-full text-[11px] font-mono font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center gap-1 transition-all shadow-sm active:scale-95"
            >
              <LogIn className="w-3 h-3" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            className="md:hidden h-7 w-7 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer (Floating under capsule) */}
      {mobileOpen && (
        <div className="pointer-events-auto absolute top-14 inset-x-4 max-w-xs mx-auto bg-[#06241e]/95 backdrop-blur-2xl border border-emerald-500/25 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all text-left ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
