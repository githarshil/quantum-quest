import React, { useState, useEffect, Suspense, lazy } from 'react';
import { supabase } from './supabaseClient';
import HeroSection from './components/HeroSection';
import ErrorBoundary from './components/ErrorBoundary';
import { CURRICULUM } from './data/curriculum';
import CuttingMatBackground from './components/CuttingMatBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Route-based async code splitting
const AuthPage = lazy(() => import('./pages/AuthPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LessonPage = lazy(() => import('./pages/LessonPage'));
const LabPage = lazy(() => import('./pages/LabPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function QuantumPageFallback() {
  return (
    <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-8 text-center select-none">
      <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mb-4" />
      <span className="font-mono text-xs text-amber-300 font-bold tracking-wider">
        LOADING QUANTUM MODULE...
      </span>
      <span className="text-[11px] text-emerald-400/80 font-mono mt-1">
        Synchronizing state vector
      </span>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState('hero'); // 'hero', 'auth', 'dashboard', 'lesson', 'lab', 'profile'
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);

  // User progress state (stored in localStorage or Supabase)
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('quantum_quest_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      xp: 300,
      completedLevels: ['level-1', 'level-2'],
      completedChallenges: [],
      badges: ['Quantum Apprentice']
    };
  });

  // Save progress locally whenever it changes
  useEffect(() => {
    localStorage.setItem('quantum_quest_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  // Centralized Navigation with Browser History (Back / Forward) support
  const navigateTo = (screen, replace = false) => {
    if (replace) {
      window.history.replaceState({ screen }, '', `#${screen}`);
    } else {
      window.history.pushState({ screen }, '', `#${screen}`);
    }
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to resolve screen from state, hash, or pathname (e.g. /login, /lab, /dashboard)
  const resolveScreenFromLocation = (screenFromState = null) => {
    if (screenFromState) return screenFromState;
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    const path = rawPath.split('/')[0];

    const pathMap = {
      'hero': 'hero',
      'auth': 'auth',
      'login': 'auth',
      'signup': 'auth',
      'dashboard': 'dashboard',
      'lesson': 'lesson',
      'lab': 'lab',
      'mission': 'lab',
      'results': 'lab',
      'profile': 'profile',
    };

    if (hash && pathMap[hash]) return pathMap[hash];
    if (path && pathMap[path]) return pathMap[path];
    return 'hero';
  };

  // Sync with browser Back and Forward buttons
  useEffect(() => {
    const handlePopState = (e) => {
      const targetScreen = resolveScreenFromLocation(e.state?.screen);
      setCurrentScreen(targetScreen);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Check auth and initial screen on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        // Check if demo user was saved
        const demoUser = localStorage.getItem('quantum_quest_demo_user');
        if (demoUser) {
          try {
            setUser(JSON.parse(demoUser));
          } catch {}
        }
      }

      // Check URL path or hash if specific screen requested
      const initialScreen = resolveScreenFromLocation();
      window.history.replaceState({ screen: initialScreen }, '', `#${initialScreen}`);
      setCurrentScreen(initialScreen);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthenticated = (authedUser) => {
    setUser(authedUser);
    localStorage.setItem('quantum_quest_demo_user', JSON.stringify(authedUser));
    navigateTo('dashboard');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('quantum_quest_demo_user');
    setUser(null);
    navigateTo('auth');
  };

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    navigateTo('lesson');
  };

  const handleSelectMission = (mission) => {
    setSelectedMission(mission || CURRICULUM.challenge);
    navigateTo('lab');
  };

  const handleQuizComplete = (levelId, xpGained) => {
    setUserProgress(prev => {
      const alreadyCompleted = prev.completedLevels.includes(levelId);
      return {
        ...prev,
        xp: prev.xp + (alreadyCompleted ? 0 : xpGained),
        completedLevels: alreadyCompleted ? prev.completedLevels : [...prev.completedLevels, levelId]
      };
    });

    // Sync to Supabase if authenticated
    if (user?.id) {
      supabase.rpc('record_quantum_mission_completion', {
        p_user_id: user.id,
        p_level_id: null,
        p_challenge_id: null,
        p_xp_gained: xpGained,
        p_circuit: null,
        p_hint_unlocked: false
      }).catch(err => console.warn('Supabase quiz sync notice:', err));
    }
  };

  const handleMissionComplete = (challengeId, xpGained) => {
    setUserProgress(prev => {
      const alreadyCompleted = prev.completedChallenges.includes(challengeId);
      return {
        ...prev,
        xp: prev.xp + (alreadyCompleted ? 0 : xpGained),
        completedChallenges: alreadyCompleted ? prev.completedChallenges : [...prev.completedChallenges, challengeId],
        badges: prev.badges.includes('Entanglement Pioneer') ? prev.badges : [...prev.badges, 'Entanglement Pioneer']
      };
    });

    // Sync to Supabase if authenticated
    if (user?.id) {
      supabase.rpc('record_quantum_mission_completion', {
        p_user_id: user.id,
        p_level_id: null,
        p_challenge_id: challengeId === 'bell-state' ? 'cccccccc-cccc-cccc-cccc-cccccccccccc' : null,
        p_xp_gained: xpGained,
        p_circuit: { solved: true },
        p_hint_unlocked: false
      }).catch(err => console.warn('Supabase mission sync notice:', err));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-chalkboard text-emerald-400 font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span>INITIALIZING QUANTUM LAB HYPERVISOR...</span>
        </div>
      </div>
    );
  }

  // Render view
  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-300 selection:text-slate-900 bg-[#073b32] relative">
      <CuttingMatBackground />

      {/* Persistent Global Learning Platform Navbar (hidden on hero section) */}
      {currentScreen !== 'hero' && (
        <Navbar
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          user={user}
          userProgress={userProgress}
          activeLevel={selectedLevel || CURRICULUM.levels[0]}
          activeMission={selectedMission || CURRICULUM.challenge}
          onSignOut={handleSignOut}
        />
      )}

      {/* Main Viewport Workspace with breathing room for floating navbar on non-hero pages */}
      <main className={`relative z-10 flex-1 flex flex-col ${currentScreen !== 'hero' ? 'pt-16 sm:pt-20' : ''}`}>
        <ErrorBoundary>
          <Suspense fallback={<QuantumPageFallback />}>
            {currentScreen === 'hero' && (
              <div className="flex-1 flex flex-col">
                <HeroSection
                  isAuthenticated={!!user}
                  onBeginJourney={() => {
                    const target = user ? 'dashboard' : 'auth';
                    navigateTo(target);
                  }}
                  onExploreUniverse={() => {
                    navigateTo('dashboard');
                  }}
                  onLogin={() => {
                    navigateTo('auth');
                  }}
                />
              </div>
            )}

            {currentScreen === 'auth' && (
              <AuthPage 
                onAuthenticated={handleAuthenticated} 
                onBack={() => navigateTo('hero')}
              />
            )}

            {currentScreen === 'dashboard' && (
              <DashboardPage
                user={user}
                userProgress={userProgress}
                onSelectLevel={handleSelectLevel}
                onSelectMission={handleSelectMission}
                onGoToProfile={() => navigateTo('profile')}
                onSignOut={handleSignOut}
                onGoToHero={() => navigateTo('hero')}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfilePage
                user={user}
                userProgress={userProgress}
                onSelectLevel={handleSelectLevel}
                onSelectMission={handleSelectMission}
                onBackToDashboard={() => navigateTo('dashboard')}
                onSignOut={handleSignOut}
              />
            )}

            {currentScreen === 'lesson' && (
              <LessonPage
                level={selectedLevel || CURRICULUM.levels[0]}
                onBack={() => navigateTo('dashboard')}
                onGoToMission={() => handleSelectMission(CURRICULUM.challenge)}
                onQuizComplete={handleQuizComplete}
              />
            )}

            {currentScreen === 'lab' && (
              <LabPage
                challenge={selectedMission || CURRICULUM.challenge}
                onBack={() => navigateTo('dashboard')}
                onCompleteMission={handleMissionComplete}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Persistent Platform Footer across curriculum & lab views */}
      {currentScreen !== 'hero' && (
        <Footer 
          onNavigate={navigateTo}
          onSelectLevel={handleSelectLevel}
          levels={CURRICULUM.levels}
        />
      )}
    </div>
  );
}
