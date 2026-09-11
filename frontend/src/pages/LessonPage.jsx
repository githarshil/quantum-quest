import React, { useState } from 'react';
import Pushpin from '../components/Pushpin';
import Tape from '../components/Tape';
import Stamp from '../components/Stamp';
import NovaMascot from '../components/NovaMascot';
import { triggerConfetti } from '../utils/confetti';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Cpu, 
  BookOpen, 
  HelpCircle,
  Sparkles,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export default function LessonPage({ 
  level, 
  onBack, 
  onGoToMission, 
  onQuizComplete 
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const quiz = level?.quiz || [];
  const sections = level?.sections || [];

  const handleSelectOption = (qId, optionIdx) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitQuiz = () => {
    let score = 0;
    quiz.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
    setSubmitted(true);

    if (score === quiz.length) {
      triggerConfetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onQuizComplete) {
        onQuizComplete(level.id, 50);
      }
    }
  };

  const scrollToSection = (idx) => {
    setActiveTab(idx);
    const element = document.getElementById(`section-${idx}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full select-none">
      
      {/* ========================================================================= */}
      {/* 1. NAVIGATION BAR & STATUS                                                */}
      {/* ========================================================================= */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="btn-ghost-tactile text-xs px-3.5 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span>Back to Syllabus</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-amber-300 font-bold bg-amber-400/20 px-3 py-1 rounded-lg border border-amber-400/30 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>SECTOR 0{level?.number}: {level?.title?.toUpperCase()}</span>
          </span>
          <span className="font-mono text-[11px] text-emerald-300 font-bold bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            +50 XP
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN RESEARCH NOTEBOOK MANILA DOSSIER                                  */}
      {/* ========================================================================= */}
      <article className="paper-card-lift p-6 sm:p-8 md:p-10 text-slate-800 mb-10 border-2 border-amber-300">
        <Pushpin color="red" className="absolute -top-3 left-10" />
        <Pushpin color="blue" className="absolute -top-3 right-10" />
        <Tape position="top" angle="-rotate-1" color="#f5ea92" className="-top-3 left-1/3 w-36" />

        {/* Notebook Header */}
        <header className="border-b-2 border-slate-300 pb-5 mb-6">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  QUANTUM LAB NOTEBOOK // SECTOR 0{level?.number}
                </span>
                <span className="font-mono text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded border border-amber-300 font-semibold">
                  THEORY & PROOF
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-sans tracking-tight mt-1.5">
                {level?.title}
              </h1>
              <p className="font-hand text-xl text-amber-900 mt-0.5">
                {level?.subtitle}
              </p>
            </div>

            {submitted && quizScore === quiz.length && (
              <Stamp text="VERIFIED MASTERED" color="green" className="scale-110" />
            )}
          </div>

          {/* Quick-Nav Chapter Pills */}
          <nav className="mt-4 pt-3 border-t border-amber-200/60 flex flex-wrap gap-2 text-xs font-mono">
            {sections.map((sec, idx) => (
              <button
                key={idx}
                onClick={() => scrollToSection(idx)}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                  activeTab === idx
                    ? 'bg-amber-200 text-amber-950 font-bold border border-amber-400 shadow-sm'
                    : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200'
                }`}
              >
                <span className="text-[10px] font-bold opacity-75">§{idx + 1}</span>
                <span className="truncate max-w-[140px] sm:max-w-none">{sec.heading.replace(/^\d+\.\s*/, '')}</span>
              </button>
            ))}
            {quiz.length > 0 && (
              <button
                onClick={() => {
                  const el = document.getElementById('knowledge-check-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3 text-indigo-600" />
                <span>Knowledge Check</span>
              </button>
            )}
          </nav>
        </header>

        {/* ===================================================================== */}
        {/* 3. PEDAGOGICAL CONTENT SECTIONS                                       */}
        {/* ===================================================================== */}
        <div className="space-y-6 mb-10">
          {sections.map((sec, idx) => {
            const isMathHeading = sec.heading.toLowerCase().includes('formalism') || sec.heading.toLowerCase().includes('matrix') || sec.heading.toLowerCase().includes('recipe') || sec.heading.toLowerCase().includes('canonical');
            const isMisconception = sec.heading.toLowerCase().includes('not') || sec.heading.toLowerCase().includes('misconception');

            return (
              <section 
                id={`section-${idx}`} 
                key={idx} 
                className="bg-white/80 p-5 rounded-xl border border-amber-200/90 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold flex items-center justify-center border border-amber-300">
                    {idx + 1}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 font-sans tracking-tight">
                    {sec.heading}
                  </h2>
                </div>

                {/* Section Content with tailored styling */}
                <p className="text-sm leading-relaxed text-slate-700 font-sans whitespace-pre-line">
                  {sec.content}
                </p>

                {/* Mathematical Formulation Callout */}
                {sec.note && (
                  <div className={
                    isMisconception 
                      ? 'callout-misconception text-xs font-mono flex items-start gap-2.5' 
                      : isMathHeading 
                      ? 'callout-math text-xs font-mono flex items-start gap-2.5' 
                      : 'callout-nova text-xs font-mono flex items-start gap-2.5'
                  }>
                    <NovaMascot size="xs" state="idle" className="mt-0.5 flex-shrink-0" />
                    <div>
                      <strong className="tracking-wide">
                        {isMisconception ? 'CRITICAL DISTINCTION: ' : isMathHeading ? 'MATHEMATICAL FORMALISM: ' : 'NOVA FIELD NOTE: '}
                      </strong>
                      <span className="font-mono text-slate-800">{sec.note}</span>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* 4. INTERACTIVE KNOWLEDGE CHECK QUIZ                                   */}
        {/* ===================================================================== */}
        {quiz.length > 0 && (
          <section id="knowledge-check-section" className="pt-6 border-t-2 border-slate-300">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded border border-indigo-300 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3 text-indigo-600" /> KNOWLEDGE CHECK
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-semibold">+50 XP REWARD</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-sans mt-1">
                  Sector Comprehension Questions
                </h2>
              </div>

              {submitted && (
                <div className="font-mono text-xs font-bold px-3 py-1.5 bg-slate-900 text-white rounded-lg shadow flex items-center gap-2">
                  <span>SCORE: {quizScore} / {quiz.length}</span>
                  {quizScore === quiz.length ? (
                    <span className="text-emerald-400">● 100% PERFECT</span>
                  ) : (
                    <span className="text-amber-400">● REVIEW RECOMMENDED</span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-6 mb-6">
              {quiz.map((q, qIndex) => {
                const selected = selectedAnswers[q.id];
                const isCorrect = selected === q.correctIndex;
                const optionLetters = ['A', 'B', 'C', 'D'];

                return (
                  <div key={q.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-2.5 font-sans font-bold text-slate-900 text-sm sm:text-base mb-4">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 flex-shrink-0">
                        Q{qIndex + 1}
                      </span>
                      <span>{q.question}</span>
                    </div>

                    {/* Options List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIndex) => {
                        const isThisSelected = selected === optIndex;
                        let optionStyle = 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-700';

                        if (submitted) {
                          if (optIndex === q.correctIndex) {
                            optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-300';
                          } else if (isThisSelected && !isCorrect) {
                            optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through opacity-80';
                          }
                        } else if (isThisSelected) {
                          optionStyle = 'bg-amber-100 border-amber-500 text-amber-950 font-bold ring-2 ring-amber-300';
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleSelectOption(q.id, optIndex)}
                            className={`w-full text-left p-3 rounded-xl border text-xs font-sans transition-all flex items-center justify-between gap-2.5 ${optionStyle}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-black/5 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                                {optionLetters[optIndex]}
                              </span>
                              <span className="leading-snug">{opt}</span>
                            </div>

                            {submitted && optIndex === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            )}
                            {submitted && isThisSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Pedagogical Explanation when submitted */}
                    {submitted && (
                      <div className={`mt-3.5 p-3 rounded-xl text-xs font-sans flex items-start gap-2.5 ${
                        isCorrect 
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' 
                          : 'bg-rose-50 text-rose-900 border border-rose-300'
                      }`}>
                        <NovaMascot size="xs" state={isCorrect ? 'celebrating' : 'thinking'} className="mt-0.5 flex-shrink-0" />
                        <div>
                          <strong>{isCorrect ? '✓ Correct Understanding: ' : '✗ Conceptual Clarification: '}</strong>
                          <span>{q.explanation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Controls & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
              {!submitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < quiz.length}
                  className={`btn-primary-tactile text-xs py-2.5 px-6 rounded-xl uppercase tracking-wider ${
                    Object.keys(selectedAnswers).length < quiz.length
                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                      : ''
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Quiz Answers</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setSubmitted(false); setSelectedAnswers({}); }}
                    className="btn-secondary-tactile text-xs py-2 px-3 rounded-lg"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                    <span>Retake Quiz</span>
                  </button>
                  <span className="text-xs font-mono text-emerald-800 font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    +50 XP Credited to Cadet Profile!
                  </span>
                </div>
              )}

              {onGoToMission && (
                <button
                  onClick={onGoToMission}
                  className="btn-primary-tactile text-xs py-2.5 px-5 rounded-xl uppercase tracking-wider"
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Launch Bell State Lab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </section>
        )}
      </article>

    </div>
  );
}
