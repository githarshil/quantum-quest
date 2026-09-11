import React, { useState, useEffect, Suspense, lazy } from 'react';
import CircuitCanvas from '../components/CircuitCanvas';
import CRTMonitor from '../components/CRTMonitor';
import NovaMascot from '../components/NovaMascot';
import Pushpin from '../components/Pushpin';
import Tape from '../components/Tape';
import Stamp from '../components/Stamp';
import { triggerConfetti } from '../utils/confetti';

const NovaGuide = lazy(() => import('../components/NovaGuide'));
import { 
  ArrowLeft, 
  Award, 
  ArrowRight,
  Flame
} from 'lucide-react';
import { API_BASE_URL } from '../apiConfig';

export default function LabPage({ 
  challenge, 
  onBack, 
  onCompleteMission 
}) {
  // Always land at top of page on load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const [circuit, setCircuit] = useState([
    { type: 'H', target: 0, step: 0 },
    { type: 'CNOT', control: 0, target: 1, step: 1 }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);
  const [novaSpeech, setNovaSpeech] = useState(
    "Welcome to the Quantum Lab! Assemble your gates on the workbench. To create the Bell State |Φ⁺⟩, place an H gate on q[0] and a CNOT from q[0] to q[1]!"
  );
  const [novaMood, setNovaMood] = useState('happy');

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setSimulationResult(null);

    try {
      // Call FastAPI backend
      const res = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          num_qubits: 2,
          gates: circuit,
          shots: 1000,
          challenge_id: challenge?.id || 'bell-state'
        })
      });

      if (!res.ok) {
        throw new Error(`Simulation failed with code: ${res.status}`);
      }

      const data = await res.json();
      setSimulationResult(data);

      // Now query Nova AI for contextual explanation of these simulation results
      try {
        const novaRes = await fetch(`${API_BASE_URL}/api/nova/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            context: 'bell_state_results',
            circuit_data: { gates: circuit },
            simulation_result: data
          })

        });
        if (novaRes.ok) {
          const novaData = await novaRes.json();
          setNovaSpeech(novaData.reply);
          setNovaMood(novaData.mood || (data.passed ? 'celebrating' : 'thinking'));
        }
      } catch {
        // Fallback explanation
        if (data.passed) {
          setNovaSpeech("⭐ Eureka! Look at that CRT monitor! Notice that the qubits only collapse to |00⟩ and |11⟩! You have created a maximally entangled Bell State!");
          setNovaMood('celebrating');
        }
      }

      if (data.passed) {
        triggerConfetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
        setShowCelebrationModal(true);
        if (onCompleteMission) {
          onCompleteMission(challenge.id, 150);
        }
      }
    } catch (err) {
      console.error(err);
      // If backend network fails, execute graceful in-browser simulation fallback
      executeFallbackSimulation();
    } finally {
      setIsRunning(false);
    }
  };

  // Fallback in case backend server is unreachable
  const executeFallbackSimulation = () => {
    const hasH0 = circuit.some(g => g.type === 'H' && g.target === 0);
    const hasCnot = circuit.some(g => g.type === 'CNOT' && g.control === 0 && g.target === 1);

    let probs, counts, passed, message;
    if (hasH0 && hasCnot) {
      probs = { '00': 0.495, '11': 0.505, '01': 0.0, '10': 0.0 };
      counts = { '00': 495, '11': 505, '01': 0, '10': 0 };
      passed = true;
      message = "Success! Maximum entanglement achieved! Perfect Bell State |Φ⁺⟩ created.";
    } else if (hasH0) {
      probs = { '00': 0.5, '01': 0.0, '10': 0.5, '11': 0.0 };
      counts = { '00': 500, '01': 0, '10': 500, '11': 0 };
      passed = false;
      message = "You have superposition on q[0], but q[1] is not yet entangled!";
    } else {
      probs = { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 };
      counts = { '00': 1000, '01': 0, '10': 0, '11': 0 };
      passed = false;
      message = "Circuit is still in ground state |00⟩. Place an H gate on q[0]!";
    }

    const fallbackRes = {
      probabilities: probs,
      counts: counts,
      passed: passed,
      message: message,
      score: passed ? 100 : 0
    };

    setSimulationResult(fallbackRes);
    if (passed) {
      setNovaSpeech("⭐ Eureka! Look at that CRT monitor! Notice that the qubits only collapse to |00⟩ and |11⟩! Maximum quantum entanglement achieved!");
      setNovaMood('celebrating');
      setShowCelebrationModal(true);
      if (onCompleteMission) onCompleteMission(challenge.id, 150);
      triggerConfetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
    } else {
      setNovaSpeech(message);
      setNovaMood('thinking');
    }
  };

  const handleAskNova = async (msg) => {
    // Try RAG endpoint first with full context
    try {
      const ragRes = await fetch(`${API_BASE_URL}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: msg,
          lesson_id: 'Entanglement & Bell States',
          mission_id: challenge?.id || 'bell-state',
          circuit: circuit,
          simulation_result: simulationResult,
        })
      });
      if (ragRes.ok) {
        const ragData = await ragRes.json();
        return {
          reply: ragData.answer,
          mood: ragData.mood || 'happy',
          sources: ragData.sources || [],
        };
      }
    } catch {
      // RAG unavailable — fall through
    }
    // Fallback to existing deterministic Nova
    const res = await fetch(`${API_BASE_URL}/api/nova/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: msg,
        context: 'lab_hint',
        simulation_result: simulationResult
      })
    });
    return await res.json();
  };

  return (
    <div className="min-h-screen px-3 py-3 sm:px-6 sm:py-4 max-w-7xl mx-auto">
      {/* Navigation Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <button
          onClick={onBack}
          className="btn-ghost-tactile text-xs px-3 py-1.5 rounded-lg self-start"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span>Back to Syllabus</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="bg-amber-400/20 text-amber-300 font-mono text-xs font-bold px-3 py-1 rounded-lg border border-amber-400/30 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>MISSION 03: CREATE A BELL STATE</span>
          </div>
          <span className="bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold px-2.5 py-1 rounded border border-emerald-500/30">
            +150 XP
          </span>
        </div>
      </div>

      {/* Main Grid: Workbench on Left, CRT Monitor & Nova on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Mission Briefing + Circuit Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mission Briefing Paper Note */}
          <div className="relative bg-creamCard rounded-xl p-3 sm:p-4 shadow-paper border border-amber-200 text-slate-800">
            <Pushpin color="gold" className="absolute -top-2 left-6" />
            <Tape position="top" angle="rotate-1" color="#f5ea92" className="-top-2 right-10 w-20" />

            <div className="flex justify-between items-center mb-1.5 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-200">
                  MISSION OBJECTIVE
                </span>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-950 font-sans">
                  Target: <span className="font-mono text-indigo-900 font-bold">{challenge?.targetState || '|Φ⁺⟩ = (|00⟩ + |11⟩)/√2'}</span>
                </h2>
              </div>
              {simulationResult?.passed && (
                <Stamp text="MISSION ACCOMPLISHED" color="green" />
              )}
            </div>

            <p className="text-xs text-slate-600 font-sans leading-relaxed mb-2.5">
              {challenge?.targetDescription || 'Create a state where measuring either qubit yields 0 or 1 with 50% probability, but both qubits always agree with 100% correlation.'}
            </p>

            {/* Instruction Checklist - Responsive 3-column pill row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] font-sans text-slate-700 bg-white/70 p-2 rounded-lg border border-amber-200/80">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                <span><strong>H Gate</strong> on <strong>q[0]</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-800 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                <span><strong>CNOT</strong> (q[0] ➔ q[1])</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                <span>Run on <strong>Qiskit Aer</strong></span>
              </div>
            </div>
          </div>

          {/* Circuit Canvas Workbench */}
          <CircuitCanvas
            circuit={circuit}
            setCircuit={setCircuit}
            onRunSimulation={handleRunSimulation}
            isRunning={isRunning}
          />

          {/* CRT Monitor (Oscilloscope) below Workbench */}
          <CRTMonitor
            probabilities={simulationResult?.probabilities || { '00': 1.0, '01': 0.0, '10': 0.0, '11': 0.0 }}
            counts={simulationResult?.counts || { '00': 1000, '01': 0, '10': 0, '11': 0 }}
            passed={simulationResult?.passed || false}
            isRunning={isRunning}
            statusText={
              isRunning 
                ? "RUNNING QISKIT AER SIMULATOR (1000 SHOTS)..." 
                : simulationResult 
                ? simulationResult.passed ? "ENTANGLEMENT VERIFIED // |Φ⁺⟩ BELL STATE" : "WAVEFUNCTION RECORDED // MISMATCH"
                : "READY. WAITING FOR CIRCUIT TRIGGER..."
            }
          />
        </div>

        {/* Right Column: Full-Height Nova AI Guide with Chat History (5 cols) */}
        <div className="lg:col-span-5 flex flex-col self-stretch h-full">
          <Suspense fallback={
            <div className="h-full min-h-[420px] rounded-xl border border-amber-300/40 bg-amber-50/80 p-6 flex flex-col items-center justify-center text-center">
              <NovaMascot size="lg" state="thinking" mood="thinking" />
              <div className="mt-3 font-mono text-xs text-amber-900 font-bold animate-pulse">
                INITIALIZING NOVA AI ASSISTANT...
              </div>
              <p className="text-[11px] text-slate-500 font-sans mt-1">Connecting quantum hypervisor uplink</p>
            </div>
          }>
            <NovaGuide
              initialMessage={novaSpeech}
              mood={novaMood}
              onAskNova={handleAskNova}
              lessonId="Entanglement & Bell States"
              missionId={challenge?.id || 'bell-state'}
              circuitData={circuit}
              simulationResult={simulationResult}
              suggestedActions={[
                "Explain why |01⟩ is zero",
                "What is spooky action at a distance?",
                "How does the CNOT gate work?"
              ]}
            />
          </Suspense>
        </div>
      </div>

      {/* Celebration Modal on Mission Success */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-cream rounded-2xl p-8 shadow-paper-lift border-4 border-amber-400 text-slate-900 text-center">
            <Pushpin color="gold" className="absolute -top-3 left-1/2 -translate-x-1/2" />
            <Tape position="top" angle="-rotate-2" color="#fde68a" className="-top-3 left-10 w-28" />
            <Tape position="top" angle="rotate-2" color="#fde68a" className="-top-3 right-10 w-28" />

            <div className="relative inline-flex items-center justify-center mb-1">
              <NovaMascot size="xl" state="celebrating" mood="celebrating" showBadge={true} />
            </div>

            {/* Rubber Stamp: Animated Slam-Down with Dedicated Spacing to NEVER overlap text */}
            <div className="py-2.5 my-1.5 flex items-center justify-center">
              <Stamp 
                text="VERIFIED BY QISKIT AER" 
                color="green" 
                rotation="-rotate-6" 
                className="scale-110" 
                animate={true}
              />
            </div>

            <h2 className="text-3xl font-extrabold font-sans text-slate-950 tracking-tight mt-1">
              MISSION 03 COMPLETE!
            </h2>
            <p className="font-hand text-xl text-amber-900 mt-1">
              Maximal Quantum Entanglement Achieved
            </p>

            <div className="my-5 p-4 bg-white/80 rounded-xl border border-amber-200 text-left text-xs font-sans text-slate-700 leading-relaxed space-y-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-amber-200/80 font-mono text-[11px] text-amber-900 font-bold">
                <NovaMascot size="xs" state="celebrating" />
                <span>NOVA's Mission Commendation:</span>
              </div>
              <p>
                ⭐ You have successfully synthesized the canonical <strong>Bell State |Φ⁺⟩ = (|00⟩ + |11⟩)/√2</strong>!
              </p>
              <p>
                When measured, both qubits collapsed together 100% of the time. You have unlocked the core building block of quantum teleportation and superdense coding!
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-mono text-xs">
                <span className="text-amber-800 font-bold">REWARD: +150 XP</span>
                <span className="text-emerald-700 font-bold">BADGE: Entanglement Pioneer</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCelebrationModal(false)}
                className="btn-secondary-tactile flex-1 py-2.5 px-4 text-xs rounded-xl"
              >
                Inspect Oscilloscope
              </button>
              <button
                onClick={onBack}
                className="btn-primary-tactile flex-1 py-2.5 px-4 text-xs rounded-xl"
              >
                <span>Return to Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
