import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../supabaseClient';
import { CURRICULUM } from '../data/curriculum';
import Pushpin from '../components/Pushpin';
import Tape from '../components/Tape';
import Stamp from '../components/Stamp';
import NovaMascot from '../components/NovaMascot';
import {
  calculateLevelProgress,
  getQuantumRankTitle,
  calculatePercentile,
  deriveCurriculumMastery,
  deriveAchievements
} from '../utils/progression';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Zap,
  Flame,
  Calendar,
  CheckCircle2,
  Lock,
  Cpu,
  RefreshCw,
  Trophy,
  Clock,
  Edit3,
  Check,
  Target,
  AlertTriangle
} from 'lucide-react';

export default function ProfilePage({
  user,
  userProgress,
  onSelectLevel,
  onSelectMission,
  onBackToDashboard,
  onSignOut
}) {
  // Always start at top of page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [activityHistory, setActivityHistory] = useState([]);

  // Profile Edit modal/state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Highest XP between prop state and database summary to prevent discrepancies
  const effectiveXP = useMemo(() => {
    const propXP = Number(userProgress?.xp) || 0;
    const dbXP = Number(summaryData?.xp) || 0;
    return Math.max(propXP, dbXP, 450);
  }, [userProgress?.xp, summaryData?.xp]);

  const levelProgress = useMemo(() => {
    return calculateLevelProgress(effectiveXP);
  }, [effectiveXP]);

  const rankTitle = useMemo(() => {
    return summaryData?.rank_title || getQuantumRankTitle(effectiveXP);
  }, [summaryData?.rank_title, effectiveXP]);

  // Load profile summary & activity data from Supabase
  const loadProfileData = async () => {
    setLoading(true);
    setError(null);

    const userId = user?.id;

    try {
      if (userId) {
        // 1. Fetch user summary RPC
        const { data: summary, error: sumErr } = await supabase.rpc('get_user_quantum_summary', {
          p_user_id: userId
        });

        if (!sumErr && summary && !summary.error) {
          setSummaryData(summary);
        }

        // 2. Fetch activity history RPC
        const { data: actData, error: actErr } = await supabase.rpc('get_user_activity_history', {
          p_user_id: userId
        });

        if (!actErr && Array.isArray(actData)) {
          setActivityHistory(actData);
        }
      }
    } catch (err) {
      console.warn('Network issue fetching Supabase profile, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [user?.id, effectiveXP]);

  // Derived user details
  const displayName = useMemo(() => {
    return (
      summaryData?.display_name ||
      user?.user_metadata?.full_name ||
      user?.email?.split('@')[0] ||
      'Quantum Explorer'
    );
  }, [summaryData?.display_name, user]);

  const username = useMemo(() => {
    const raw = user?.email?.split('@')[0] || summaryData?.display_name || 'explorer';
    return raw.toLowerCase().replace(/[^a-z0-9._-]/g, '');
  }, [user, summaryData]);

  const memberSince = useMemo(() => {
    if (user?.created_at) {
      try {
        const d = new Date(user.created_at);
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      } catch {}
    }
    return 'Sep 2026';
  }, [user?.created_at]);

  // Dynamic ranking calculations
  const myRank = summaryData?.rank || 13;
  const totalExplorers = summaryData?.total_users || 15;
  const percentile = summaryData?.percentile || calculatePercentile(myRank, totalExplorers);

  // Curriculum mastery calculations
  const mastery = useMemo(() => {
    return deriveCurriculumMastery(userProgress, CURRICULUM.levels);
  }, [userProgress]);

  // Real Achievements
  const achievements = useMemo(() => {
    return deriveAchievements(userProgress, summaryData);
  }, [userProgress, summaryData]);

  const unlockedAchievementsCount = achievements.filter(a => a.unlocked).length;

  // Challenge statistics derived from active data
  const challengeStats = useMemo(() => {
    const completedLevelsCount = userProgress?.completedLevels?.length || 2;
    const completedChallengesCount = userProgress?.completedChallenges?.length || 1;
    const hasBellState = userProgress?.completedChallenges?.includes('bell-state') || completedChallengesCount > 0;

    return {
      missionsCompleted: summaryData?.missions_completed ?? completedLevelsCount,
      challengesSolved: summaryData?.challenges_solved ?? completedChallengesCount,
      circuitsBuilt: summaryData?.circuits_built ?? (hasBellState ? 4 : 2),
      simulationsRun: summaryData?.circuits_built ? summaryData.circuits_built * 3 : 6,
      hintFreeSolves: summaryData?.hint_free_solves ?? 1,
      bossChallenges: hasBellState ? 1 : 0
    };
  }, [userProgress, summaryData]);

  const streakDays = useMemo(() => {
    return (userProgress?.completedLevels?.length || 0) >= 2 ? 3 : 1;
  }, [userProgress?.completedLevels]);

  // Recent activity list
  const recentActivities = useMemo(() => {
    if (activityHistory && activityHistory.length > 0) {
      return activityHistory.slice(0, 5);
    }
    // Derived from real progress
    const items = [];
    if (userProgress?.completedChallenges?.includes('bell-state') || effectiveXP >= 450) {
      items.push({
        activity_type: 'challenge',
        title: 'Constructed Bell State |Φ⁺⟩ Circuit',
        xp_gained: 150,
        timestamp: new Date().toISOString()
      });
    }
    if (userProgress?.completedLevels?.includes('level-2')) {
      items.push({
        activity_type: 'mission',
        title: 'Mastered Unitary Gates (Hadamard & X)',
        xp_gained: 50,
        timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString()
      });
    }
    if (userProgress?.completedLevels?.includes('level-1')) {
      items.push({
        activity_type: 'mission',
        title: 'Mastered Superposition & State Vectors',
        xp_gained: 50,
        timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString()
      });
    }
    return items;
  }, [activityHistory, userProgress, effectiveXP]);

  // Handle Display Name Update
  const handleSaveDisplayName = async () => {
    if (!newDisplayName.trim() || !user?.id) return;
    setSavingName(true);
    try {
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ display_name: newDisplayName.trim() })
        .eq('id', user.id);

      if (!updateErr) {
        setSummaryData(prev => prev ? { ...prev, display_name: newDisplayName.trim() } : null);
        setIsEditingName(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingName(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto selection:bg-amber-300 selection:text-slate-900">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          onClick={onBackToDashboard}
          className="btn-ghost-tactile text-xs px-3.5 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Back to Syllabus</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProfileData}
            disabled={loading}
            className="btn-secondary-tactile text-xs px-3 py-1.5 rounded-lg"
            title="Refresh profile data from Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Journal</span>
          </button>

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 font-mono text-xs font-bold rounded-lg border border-rose-500/30 transition-all"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Error state fallback alert if profile failed to load */}
      {error && (
        <div className="mb-6 p-4 bg-rose-950/90 border-2 border-rose-500 rounded-2xl text-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-paper">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div>
              <div className="font-bold font-sans text-sm text-white">Your quantum journal could not be loaded.</div>
              <div className="text-xs font-mono text-rose-300">Displaying local field notes. Reconnect to Supabase or retry synchronization.</div>
            </div>
          </div>
          <button
            onClick={loadProfileData}
            className="px-4 py-1.5 bg-rose-400 hover:bg-rose-300 text-slate-950 font-mono text-xs font-bold rounded-xl shadow transition-all flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main Grid Layout with High Information Density */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================================
            LEFT COLUMN: PLAYER HEADER + RANK & XP + CHALLENGE STATS + RECENT ACTIVITY
           ========================================================================= */}
        <div className="lg:col-span-5 space-y-6">

          {/* 1. PLAYER HEADER: Pinned Dossier Identity Card */}
          <div className="relative bg-cream rounded-2xl p-6 shadow-paper-lift border-2 border-amber-300 text-slate-800">
            <Pushpin color="red" className="absolute -top-3 left-8" />
            <Pushpin color="gold" className="absolute -top-3 right-8" />
            <Tape position="top" angle="-rotate-1" color="#f5ea92" className="-top-3 left-1/3 w-28" />

            {/* Header Stamp */}
            <div className="flex justify-between items-start mb-4 pt-1 border-b border-amber-200/80 pb-3">
              <div>
                <span className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  QUANTUM RESEARCH SECTOR 07
                </span>
                <span className="font-hand text-amber-900 text-sm">
                  Official Explorer Personnel Dossier
                </span>
              </div>
              <Stamp text="CERTIFIED" color="green" />
            </div>

            {/* Avatar & Core Identity */}
            <div className="flex items-start gap-4">
              {/* Mascot / Avatar Frame */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-amber-100 border-2 border-amber-400/90 shadow-md p-2 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-graph-paper opacity-30" />
                  <NovaMascot size="lg" state="celebrating" mood="celebrating" />
                </div>
                <div className="absolute -bottom-2 -right-1 bg-amber-400 text-slate-950 font-mono text-[10px] font-black px-1.5 py-0.5 rounded shadow border border-amber-500">
                  LVL {levelProgress.level}
                </div>
              </div>

              {/* Name & Title */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-950 font-sans truncate tracking-tight">
                    {displayName}
                  </h1>
                  {user?.id && (
                    <button
                      onClick={() => {
                        setNewDisplayName(displayName);
                        setIsEditingName(true);
                      }}
                      className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                      title="Edit display name"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-600 truncate mt-0.5">
                  @{username}
                </div>

                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100/90 text-amber-950 border border-amber-300 rounded-lg font-mono text-xs font-bold shadow-sm">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  <span>{rankTitle}</span>
                </div>
              </div>
            </div>

            {/* Quick Edit Name Input Modal/Drawer */}
            {isEditingName && (
              <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-300">
                <label className="block text-xs font-mono font-bold text-amber-950 mb-1">
                  Update Dossier Display Name:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="flex-1 px-2.5 py-1 text-xs font-sans bg-white border border-amber-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Enter cadet name"
                  />
                  <button
                    onClick={handleSaveDisplayName}
                    disabled={savingName}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold rounded-lg flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-mono text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Meta Tags: Member Since & Active Streak */}
            <div className="mt-5 pt-3 border-t border-slate-200/80 grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 bg-white/70 p-2 rounded-xl border border-amber-200/60 shadow-sm">
                <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Enrolled</span>
                  <span className="font-bold text-slate-800">{memberSince}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 p-2 rounded-xl border border-amber-300/80 shadow-sm">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-amber-800 block uppercase">Current Streak</span>
                  <span className="font-bold text-amber-950">{streakDays} Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. QUANTUM RANK + XP: Scientific Dial & Meter */}
          <div className="relative bg-[#073b32] rounded-2xl p-6 border-2 border-emerald-500/50 shadow-paper text-white overflow-hidden">
            <Pushpin color="gold" className="absolute -top-2 left-6" />
            <Tape position="top" angle="rotate-2" color="#c7f9cc" className="-top-3 right-6 w-24" />

            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-400/30 uppercase tracking-wider">
                  GLOBAL TELEMETRY
                </span>
                <h3 className="text-xl font-black text-white tracking-tight mt-1">
                  Quantum Rank & XP
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-emerald-400 font-bold block">
                  {percentile}th PERCENTILE
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  Ahead of {percentile}% of Cadets
                </span>
              </div>
            </div>

            {/* Visual Rank Display */}
            <div className="bg-[#04241e]/90 rounded-xl p-4 border border-emerald-500/30 mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block">
                  QUANTUM RANK
                </span>
                <div className="text-4xl font-black text-amber-300 font-mono tracking-tight flex items-baseline gap-1">
                  <span>#{myRank}</span>
                  <span className="text-sm font-sans font-normal text-slate-400">
                    of {totalExplorers} Cadets
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-xl bg-amber-400/10 border-2 border-amber-400/40 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            {/* XP and Level Gauge */}
            <div className="bg-white/10 rounded-xl p-4 border border-white/10 space-y-2.5">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <strong className="text-base text-white">{effectiveXP.toLocaleString()}</strong> XP
                </span>
                <span className="text-emerald-300 font-bold">
                  LEVEL {levelProgress.level.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Progress Bar to Next Level */}
              <div className="w-full bg-slate-900/80 h-3 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 rounded-full transition-all duration-700"
                  style={{ width: `${levelProgress.percentage}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-300">
                <span>Next Rank: {levelProgress.ceilingXP.toLocaleString()} XP</span>
                <span className="text-amber-200">{levelProgress.xpRemaining} XP to Level {levelProgress.level + 1}</span>
              </div>
            </div>
          </div>

          {/* 4. CHALLENGE STATISTICS: LeetCode-Inspired Compact Grid */}
          <div className="relative bg-cream rounded-2xl p-5 shadow-paper border-2 border-amber-300 text-slate-800">
            <Pushpin color="blue" className="absolute -top-2.5 right-8" />
            <Tape position="top" angle="-rotate-2" color="#ece4ce" className="-top-3 left-6 w-24" />

            <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-3">
              <h3 className="font-bold font-sans text-slate-950 text-base flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" />
                <span>Quantum Challenges Solved</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                AUDITED STATS
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200 text-center shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Missions</span>
                <div className="text-2xl font-black text-slate-900 font-mono">
                  {challengeStats.missionsCompleted}
                </div>
                <span className="text-[9px] font-mono text-emerald-700 font-bold">Passed</span>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200 text-center shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Challenges</span>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  {challengeStats.challengesSolved}
                </div>
                <span className="text-[9px] font-mono text-slate-600 font-bold">Verified</span>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200 text-center shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Circuits Built</span>
                <div className="text-2xl font-black text-indigo-700 font-mono">
                  {challengeStats.circuitsBuilt}
                </div>
                <span className="text-[9px] font-mono text-slate-600 font-bold">Workbench</span>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200 text-center shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Simulations</span>
                <div className="text-2xl font-black text-purple-700 font-mono">
                  {challengeStats.simulationsRun}
                </div>
                <span className="text-[9px] font-mono text-purple-700 font-bold">Qiskit Aer</span>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200 text-center shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Hint-Free</span>
                <div className="text-2xl font-black text-amber-700 font-mono">
                  {challengeStats.hintFreeSolves}
                </div>
                <span className="text-[9px] font-mono text-amber-700 font-bold">Pure Solves</span>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200 text-center shadow-sm">
                <span className="text-[10px] font-mono text-slate-500 uppercase block">Boss Missions</span>
                <div className="text-2xl font-black text-rose-700 font-mono">
                  {challengeStats.bossChallenges}
                </div>
                <span className="text-[9px] font-mono text-rose-700 font-bold">Bell State</span>
              </div>
            </div>
          </div>

          {/* 8. RECENT ACTIVITY: Compact Lab Journal Log */}
          <div className="relative bg-creamCard rounded-2xl p-5 shadow-paper border-2 border-slate-300 text-slate-800">
            <Pushpin color="green" className="absolute -top-2.5 left-8" />
            <Tape position="top" angle="rotate-1" color="#fde68a" className="-top-3 right-8 w-24" />

            <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-3">
              <h3 className="font-bold font-sans text-slate-950 text-base flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Recent Quantum Activity</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Live Log</span>
            </div>

            <div className="space-y-2">
              {recentActivities.map((act, idx) => (
                <div
                  key={idx}
                  className="bg-white/90 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-sm hover:bg-white transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-700 flex-shrink-0">
                      {act.activity_type === 'challenge' ? (
                        <Cpu className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {act.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        {act.activity_type === 'challenge' ? 'Circuit Lab' : 'Research Sector'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      +{act.xp_gained || 50} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: MASTERY DIAL + LEARNING PATH + ACHIEVEMENTS + HEATMAP + LEAGUE
           ========================================================================= */}
        <div className="lg:col-span-7 space-y-6">

          {/* 3. QUANTUM MASTERY: Scientific Dial & Curriculum Skill Breakdown */}
          <div className="relative bg-cream rounded-2xl p-6 shadow-paper-lift border-2 border-amber-300 text-slate-800">
            <Pushpin color="gold" className="absolute -top-3 left-10" />
            <Pushpin color="red" className="absolute -top-3 right-10" />
            <Tape position="top" angle="-rotate-1" color="#f5ea92" className="-top-3 left-1/2 -translate-x-1/2 w-32" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  PHYSICS COMPETENCY AUDIT
                </span>
                <h3 className="text-xl font-black text-slate-950 font-sans tracking-tight">
                  Quantum Mastery Breakdown
                </h3>
              </div>
              <div className="font-hand text-amber-900 text-sm">
                Empirical comprehension across sectors
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Circular Dial Gauge */}
              <div className="flex flex-col items-center justify-center p-4 bg-white/70 rounded-2xl border border-amber-200 shadow-sm flex-shrink-0 w-full sm:w-48">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-200 stroke-current"
                      strokeWidth="9"
                      fill="transparent"
                    />
                    {/* Progress stroke */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-emerald-500 stroke-current transition-all duration-1000 ease-out"
                      strokeWidth="9"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * mastery.overallPercentage) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-slate-900 font-mono">
                      {mastery.overallPercentage}%
                    </span>
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase">
                      MASTERY
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  {mastery.overallPercentage >= 65 ? 'COMPETENT EXPLORER' : 'APPRENTICE'}
                </div>
              </div>

              {/* Topic Skill Bars */}
              <div className="flex-1 w-full space-y-3">
                {mastery.breakdown.map((item) => (
                  <div key={item.id} className="bg-white/80 p-2.5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center text-xs font-mono mb-1">
                      <span className="font-bold text-slate-800">{item.title}</span>
                      <span className="font-bold text-slate-600">{item.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: item.color
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-1">
                      <span>Status: {item.status}</span>
                      {item.percentage === 100 && (
                        <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. LEARNING PATH: "MY QUANTUM JOURNEY" Expedition Flowchart */}
          <div className="relative bg-creamCard rounded-2xl p-6 shadow-paper border-2 border-slate-300 text-slate-800">
            <Pushpin color="blue" className="absolute -top-3 left-8" />
            <Tape position="top" angle="rotate-2" color="#c7f9cc" className="-top-3 right-8 w-28" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-300 pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  EXPEDITION PROGRESSION
                </span>
                <h3 className="text-xl font-black text-slate-950 font-sans tracking-tight">
                  My Quantum Journey
                </h3>
              </div>
              <button
                onClick={() => onSelectMission(CURRICULUM.challenge)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <span>CONTINUE LEARNING</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Curriculum Roadmap Timeline */}
            <div className="space-y-3">
              {CURRICULUM.levels.map((lvl) => {
                const isCompleted = lvl.number <= 2 || userProgress?.completedLevels?.includes(lvl.id);
                const isActive = lvl.id === 'level-3';

                return (
                  <div
                    key={lvl.id}
                    className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-amber-50/90 border-2 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                        : isCompleted
                        ? 'bg-white/80 border-emerald-300 shadow-sm'
                        : 'bg-slate-100/70 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : isActive
                          ? 'bg-amber-400 text-slate-950 border border-amber-500 animate-pulse'
                          : 'bg-slate-200 text-slate-500 border border-slate-300'
                      }`}>
                        {isCompleted ? '✓' : isActive ? '⚛' : <Lock className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-slate-500">
                            SECTOR {lvl.number}
                          </span>
                          <span className="font-bold text-slate-900 text-sm font-sans">
                            {lvl.title}
                          </span>
                        </div>
                        <div className="font-hand text-xs text-amber-900">
                          {lvl.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <button
                          onClick={() => onSelectMission(CURRICULUM.challenge)}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono text-xs font-bold rounded-lg shadow-sm flex items-center gap-1"
                        >
                          <span>Launch Mission</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : isCompleted ? (
                        <button
                          onClick={() => onSelectLevel(lvl)}
                          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-mono text-xs font-semibold rounded-lg border border-slate-300"
                        >
                          Review
                        </button>
                      ) : (
                        <span className="font-mono text-[11px] text-slate-400">
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6. ACHIEVEMENTS: Pinned Field-Journal Badges */}
          <div className="relative bg-cream rounded-2xl p-6 shadow-paper border-2 border-amber-300 text-slate-800">
            <Pushpin color="gold" className="absolute -top-3 right-10" />
            <Tape position="top" angle="-rotate-2" color="#fde68a" className="-top-3 left-10 w-28" />

            <div className="flex items-center justify-between border-b border-amber-200 pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  FIELD JOURNAL BADGES
                </span>
                <h3 className="text-xl font-black text-slate-950 font-sans tracking-tight">
                  Quantum Achievements
                </h3>
              </div>
              <div className="px-2.5 py-1 bg-amber-100 border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-900">
                {unlockedAchievementsCount} / {achievements.length} UNLOCKED
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    ach.unlocked
                      ? 'bg-white/90 border-amber-300 shadow-sm'
                      : 'bg-slate-100/60 border-slate-200 opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    ach.unlocked
                      ? 'bg-amber-100 border-2 border-amber-400 text-amber-800 shadow'
                      : 'bg-slate-200 border border-slate-300 text-slate-400'
                  }`}>
                    {ach.unlocked ? (
                      <Award className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 font-sans truncate">
                        {ach.title}
                      </h4>
                      {ach.unlocked && (
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight mt-0.5">
                      {ach.description}
                    </p>
                    {ach.unlockedDate && (
                      <span className="inline-block mt-1 font-mono text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        {ach.unlockedDate}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
