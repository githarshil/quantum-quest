import React from 'react';
import { CURRICULUM } from '../data/curriculum';
import Pushpin from '../components/Pushpin';
import Tape from '../components/Tape';
import Stamp from '../components/Stamp';
import NovaMascot from '../components/NovaMascot';
import { calculateLevelProgress } from '../utils/progression';
import { 
  Atom, 
  Award, 
  Lock, 
  ArrowRight, 
  BookOpen, 
  Cpu, 
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function DashboardPage({ 
  user, 
  userProgress, 
  onSelectLevel, 
  onSelectMission, 
  onGoToProfile,
  onGoToHero
}) {
  const levels = CURRICULUM.levels;

  // Calculate dynamic status based on user progress
  const hasCompletedBellState = userProgress?.completedChallenges?.includes('bell-state');
  const currentXP = userProgress?.xp || (hasCompletedBellState ? 450 : 300);
  const lvlProg = calculateLevelProgress(currentXP);

  const completedCount = levels.filter(lvl => 
    lvl.number <= 2 || (lvl.id === 'level-3' && hasCompletedBellState)
  ).length;
  const completionPercentage = Math.round((completedCount / levels.length) * 100);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full select-none">
      
      {/* ========================================================================= */}
      {/* 1. COURSE SYLLABUS OVERVIEW BANNER                                        */}
      {/* ========================================================================= */}
      <section className="relative paper-card p-5 sm:p-7 text-slate-800 mb-8 border-2 border-amber-300">
        <Pushpin color="red" className="absolute -top-3 left-8" />
        <Pushpin color="gold" className="absolute -top-3 right-8" />
        <Tape position="top" angle="rotate-1" className="-top-3 left-1/2 -translate-x-1/2 w-36" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-950 px-2.5 py-0.5 rounded border border-amber-300">
                CURRICULUM TRACK // FOUNDATIONS 101
              </span>
              <span className="font-mono text-[10px] text-emerald-800 bg-emerald-100 font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Qiskit Aer Powered
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-sans tracking-tight">
              Quantum Foundations & Entangled Circuits
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
              Explore the physical reality of superposition, compute unitary matrix transforms, and construct maximally entangled two-qubit Bell states on simulated quantum hardware.
            </p>

            {/* Quick Metrics */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-700">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span><strong>4</strong> Research Sectors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-700" />
                <span><strong>1</strong> Hardware Lab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-500" />
                <span><strong>~60 mins</strong> Total Lab Time</span>
              </div>
            </div>
          </div>

          {/* Progress Tracker Card */}
          <div className="bg-white/80 border border-amber-200/90 rounded-xl p-4 shadow-sm min-w-[240px] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-slate-700">Syllabus Completion</span>
              <span className="font-bold text-emerald-700">{completionPercentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>{completedCount} of {levels.length} Sectors Mastered</span>
              <span className="text-amber-700 font-bold">+{currentXP} XP Earned</span>
            </div>

            {/* Resume Button */}
            <button
              onClick={() => onSelectMission(CURRICULUM.challenge)}
              className="btn-primary-tactile text-xs py-2 px-3 rounded-lg w-full"
            >
              <span>🚀 Resume Bell State Lab</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-200" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. RESEARCH SECTORS TITLE & DESCRIPTION                                   */}
      {/* ========================================================================= */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="inline-block px-2.5 py-0.5 bg-amber-400/20 text-amber-300 font-mono text-[11px] font-bold rounded border border-amber-400/30 mb-1.5">
            EXPEDITION PATHWAY
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Curriculum Research Sectors
          </h2>
        </div>
        <p className="font-hand text-slate-300 text-base sm:text-lg">
          Work sequentially through theory notes, knowledge checks, and live circuit synthesis
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTOR CARDS GRID                                                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 items-stretch">
        {levels.map((lvl) => {
          const isCompleted = lvl.number <= 2 || (lvl.id === 'level-3' && hasCompletedBellState);
          const isActive = lvl.id === 'level-3' && !hasCompletedBellState;
          const isLocked = lvl.number >= 4 && !hasCompletedBellState;

          const duration = lvl.number === 1 ? '15 min' : lvl.number === 2 ? '20 min' : lvl.number === 3 ? '25 min' : '30 min';

          return (
            <div
              key={lvl.id}
              className={`relative rounded-2xl p-5 shadow-paper transition-all duration-300 flex flex-col justify-between ${lvl.rotation} ${
                isActive
                  ? 'bg-dot-paper border-2 border-amber-400 ring-4 ring-amber-400/30 shadow-paper-lift -translate-y-1'
                  : isCompleted
                  ? 'bg-dot-paper border border-amber-900/20 opacity-95 hover:scale-[1.01]'
                  : 'bg-dot-paper-dark border border-slate-700 opacity-70 cursor-not-allowed'
              }`}
            >
              {/* Pushpin & Tape */}
              <Pushpin 
                color={isActive ? 'gold' : isCompleted ? 'green' : 'silver'} 
                className="absolute -top-2.5 left-1/2 -translate-x-1/2" 
              />
              <Tape 
                position="top" 
                angle={lvl.number % 2 === 0 ? 'rotate-2' : '-rotate-2'} 
                color={isActive ? '#fde68a' : '#ece4ce'} 
                className="-top-2.5 right-4 w-20" 
              />

              <div className="flex-1 flex flex-col">
                {/* Sector Header / Badge */}
                <div className="flex justify-between items-start mb-2.5 pt-2">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    SECTOR 0{lvl.number}
                  </span>
                  {isCompleted ? (
                    <Stamp text="MASTERED" color="green" />
                  ) : isActive ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                      ACTIVE EXPEDITION
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400">
                      <Lock className="w-3 h-3" /> PREREQUISITE
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <h3 className={`text-lg font-extrabold font-sans leading-tight ${isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                  {lvl.title}
                </h3>
                <p className="text-xs font-hand text-amber-900 text-base mb-2">
                  {lvl.subtitle}
                </p>

                {/* Description */}
                <p className={`text-xs leading-relaxed mb-4 flex-1 ${isLocked ? 'text-slate-400' : 'text-slate-600'}`}>
                  {lvl.description}
                </p>

                {/* Syllabus Modules Pill Breakdown */}
                <div className={`p-2.5 rounded-lg border mb-4 text-[11px] font-mono space-y-1 ${
                  isLocked ? 'bg-black/20 border-white/5 text-slate-400' : 'bg-white/70 border-amber-200/70 text-slate-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-amber-600" /> Theory & Proofs
                    </span>
                    <span className="font-bold text-slate-800">{lvl.sections?.length || 3} parts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Knowledge Check
                    </span>
                    <span className="font-bold text-slate-800">{lvl.quiz?.length || 1} questions</span>
                  </div>
                  {lvl.id === 'level-3' && (
                    <div className="flex items-center justify-between text-cyan-800 font-semibold">
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-cyan-600" /> Circuit Simulator
                      </span>
                      <span>Qiskit Aer</span>
                    </div>
                  )}
                  <div className="pt-1 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Est. Time</span>
                    <span>{duration}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Pinned to Bottom */}
              <div className="pt-3 border-t border-slate-200/60 mt-auto">
                {isActive ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => onSelectMission(CURRICULUM.challenge)}
                      className="btn-primary-tactile w-full py-2 px-3 text-xs rounded-xl"
                    >
                      <span>🚀 ENTER BELL MISSION</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSelectLevel(lvl)}
                      className="btn-secondary-tactile w-full py-1.5 px-3 text-[11px] rounded-lg"
                    >
                      <BookOpen className="w-3 h-3" /> Read Lesson Notes
                    </button>
                  </div>
                ) : isCompleted ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelectLevel(lvl)}
                      className="btn-secondary-tactile flex-1 py-1.5 px-2 text-xs rounded-lg"
                    >
                      <BookOpen className="w-3 h-3 text-emerald-700" /> Review Notes
                    </button>
                    {lvl.id === 'level-3' && (
                      <button
                        onClick={() => onSelectMission(CURRICULUM.challenge)}
                        className="btn-primary-tactile py-1.5 px-3 text-xs rounded-lg"
                        title="Replay Bell State Lab"
                      >
                        <Cpu className="w-3 h-3" /> Replay
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs font-mono text-slate-400 flex items-center justify-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Requires Sector 03 Pass
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 4. LAB WORKBENCH FLAGSHIP CALLOUT                                         */}
      {/* ========================================================================= */}
      <div className="relative dark-workbench-card p-6 md:p-8 overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-400/30">
                ACTIVE LAB MISSION // HARDWARE BENCH
              </span>
              <span className="text-xs font-mono text-amber-300 font-bold">+150 XP REWARD</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-white">
              Create a Bell State: <span className="font-mono text-cyan-300">|Φ⁺⟩ = (|00⟩ + |11⟩)/√2</span>
            </h3>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Construct the premier entangled quantum pair on a 2-qubit register. Put qubit 0 into equal superposition using a Hadamard gate, then bind qubit 1 with a CNOT gate. Run live Qiskit Aer simulations and view the collapsed probability wavefunction on the CRT Oscilloscope!
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectMission(CURRICULUM.challenge)}
                className="btn-primary-tactile text-xs sm:text-sm py-2.5 px-5 rounded-xl uppercase tracking-wider font-bold"
              >
                <Cpu className="w-4 h-4" />
                <span>LAUNCH QUANTUM WORKBENCH</span>
              </button>
              <button
                onClick={() => onSelectLevel(CURRICULUM.levels[0])}
                className="btn-ghost-tactile text-xs py-2.5 px-4 rounded-xl"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Superposition Lesson & Quiz</span>
              </button>
            </div>
          </div>

          {/* Quick preview card of the formula */}
          <div className="paper-card p-4 border-2 border-amber-300 shadow-paper text-slate-800 w-full md:w-72 rotate-1">
            <Pushpin color="gold" className="absolute -top-2 right-4" />
            <div className="flex items-center justify-between border-b border-amber-200 pb-1.5 mb-2">
              <div className="text-[10px] font-mono text-amber-800 font-bold uppercase tracking-wider">
                PHYSICS DOSSIER
              </div>
              <NovaMascot size="xs" state="idle" />
            </div>
            <div className="font-mono text-sm font-bold text-slate-900 border-b border-amber-200 pb-2 mb-2">
              H(q0) ➔ CNOT(q0, q1)
            </div>
            <p className="text-xs text-slate-600 font-hand text-base">
              "When measured, q0 and q1 collapse to identical values: 00 or 11 with exact 50% odds each!"
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
