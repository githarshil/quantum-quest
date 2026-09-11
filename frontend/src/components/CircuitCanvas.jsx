import React, { useState } from 'react';
import { Play, RotateCcw, Info } from 'lucide-react';
import Pushpin from './Pushpin';
import Tape from './Tape';

export default function CircuitCanvas({ 
  onRunSimulation, 
  isRunning = false,
  circuit = [], 
  setCircuit 
}) {
  const [selectedGateType, setSelectedGateType] = useState('H');

  const steps = [0, 1, 2, 3];
  const qubits = [0, 1];

  // Helper to add or toggle gate at qubit & step
  const handleCellClick = (qubitIdx, stepIdx) => {
    // Check if a gate already exists here
    const existingIndex = circuit.findIndex(g => {
      if (g.step === stepIdx) {
        if (g.type === 'CNOT') {
          return g.control === qubitIdx || g.target === qubitIdx;
        }
        return g.target === qubitIdx;
      }
      return false;
    });

    if (existingIndex >= 0) {
      // Remove existing gate
      const updated = [...circuit];
      updated.splice(existingIndex, 1);
      setCircuit(updated);
      return;
    }

    // Add selected gate
    if (selectedGateType === 'H') {
      setCircuit(prev => [...prev, { type: 'H', target: qubitIdx, step: stepIdx }]);
    } else if (selectedGateType === 'X') {
      setCircuit(prev => [...prev, { type: 'X', target: qubitIdx, step: stepIdx }]);
    } else if (selectedGateType === 'CNOT') {
      // For CNOT, if qubitIdx is 0, control is 0, target is 1; if qubitIdx is 1, control is 1, target is 0
      const control = qubitIdx;
      const target = qubitIdx === 0 ? 1 : 0;
      setCircuit(prev => [...prev, { type: 'CNOT', control, target, step: stepIdx }]);
    }
  };

  const clearCircuit = () => {
    setCircuit([]);
  };

  const loadBellPreset = () => {
    setCircuit([
      { type: 'H', target: 0, step: 0 },
      { type: 'CNOT', control: 0, target: 1, step: 1 }
    ]);
  };

  return (
    <div className="relative bg-graph-paper rounded-xl p-4 sm:p-5 shadow-paper border-2 border-amber-200 text-slate-800">
      <Pushpin color="red" className="absolute -top-2.5 left-8" />
      <Pushpin color="blue" className="absolute -top-2.5 right-8" />
      <Tape position="top" angle="rotate-1" className="-top-3 left-1/3 w-28" />

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-slate-300 pb-2.5 mb-3.5 gap-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-hand text-lg sm:text-xl font-bold tracking-wide text-slate-900">QUANTUM CIRCUIT WORKBENCH</span>
            <span className="text-[10px] sm:text-[11px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold border border-blue-300">
              2 QUBITS // STATE |00⟩
            </span>
          </div>
          <p className="text-[11px] text-slate-600 font-sans mt-0.5">
            Click a gate from the palette, then click a slot on the circuit wire to attach.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadBellPreset}
            className="btn-secondary-tactile text-xs py-1 px-3 rounded-lg"
            title="Auto-place Bell State recipe"
          >
            <span>⚡ Auto-Wire Bell State</span>
          </button>
          <button
            onClick={clearCircuit}
            className="btn-ghost-tactile text-xs py-1 px-2.5 rounded-lg text-rose-300 hover:text-rose-200 border-rose-500/30 hover:border-rose-400/50"
            title="Clear all gates"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Gate Toolbox Palette */}
      <div className="mb-3.5 bg-creamCard p-2 sm:p-2.5 rounded-lg border border-amber-200 shadow-inner flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-wider">GATE TOOLBOX:</span>
          
          {/* H Gate */}
          <button
            onClick={() => setSelectedGateType('H')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              selectedGateType === 'H'
                ? 'bg-purple-600 text-white ring-2 ring-purple-400 ring-offset-1 scale-105'
                : 'bg-purple-100 text-purple-900 hover:bg-purple-200 border border-purple-300'
            }`}
          >
            <span className="w-4 h-4 rounded bg-purple-700 text-white flex items-center justify-center text-[10px]">H</span>
            <span>Hadamard</span>
          </button>

          {/* CNOT Gate */}
          <button
            onClick={() => setSelectedGateType('CNOT')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              selectedGateType === 'CNOT'
                ? 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-1 scale-105'
                : 'bg-blue-100 text-blue-900 hover:bg-blue-200 border border-blue-300'
            }`}
          >
            <span className="text-[12px] font-bold">●—⊕</span>
            <span>CNOT</span>
          </button>

          {/* X Gate */}
          <button
            onClick={() => setSelectedGateType('X')}
            className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all flex items-center gap-1.5 shadow-sm ${
              selectedGateType === 'X'
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 ring-offset-1 scale-105'
                : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300'
            }`}
          >
            <span className="w-4 h-4 rounded bg-emerald-700 text-white flex items-center justify-center text-[10px]">X</span>
            <span>Pauli-X</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500 bg-white/70 px-2.5 py-1 rounded border border-amber-200">
          Selected: <strong className="text-slate-800 uppercase">{selectedGateType} Gate</strong>
        </div>
      </div>

      {/* Circuit Board Wire Canvas */}
      <div className="relative bg-white rounded-lg p-3 sm:p-4 border border-slate-300 shadow-inner select-none overflow-x-auto">
        {/* Step Column Labels */}
        <div className="grid grid-cols-[80px_repeat(4,1fr)_60px] gap-2 mb-1.5 text-center text-slate-400 font-mono text-[11px]">
          <div>QUBIT</div>
          {steps.map(s => (
            <div key={s} className="border-b border-slate-200 pb-1">
              STEP {s + 1}
            </div>
          ))}
          <div>METER</div>
        </div>

        {/* Qubit Wires */}
        {qubits.map((qubitIdx) => {
          return (
            <div key={qubitIdx} className="grid grid-cols-[80px_repeat(4,1fr)_60px] gap-2 items-center py-3 sm:py-3.5 relative">
              {/* Horizontal Wire Line */}
              <div className="absolute left-[80px] right-[60px] h-[3px] bg-slate-700 top-1/2 -translate-y-1/2 pointer-events-none" />

              {/* Qubit Register Tag */}
              <div className="flex items-center gap-1.5 z-10">
                <span className="px-2 py-1 bg-slate-900 text-white font-mono text-xs font-bold rounded shadow-sm">
                  q[{qubitIdx}]
                </span>
                <span className="font-mono text-xs font-semibold text-slate-600">|0⟩</span>
              </div>

              {/* Step Slots */}
              {steps.map((stepIdx) => {
                // Find gate at this step and qubit
                const singleGate = circuit.find(g => g.step === stepIdx && g.target === qubitIdx && g.type !== 'CNOT');
                const cnotGate = circuit.find(g => g.step === stepIdx && g.type === 'CNOT');
                const isCnotControl = cnotGate && cnotGate.control === qubitIdx;
                const isCnotTarget = cnotGate && cnotGate.target === qubitIdx;

                return (
                  <div 
                    key={stepIdx} 
                    className="flex items-center justify-center relative min-h-[48px] z-10"
                  >
                    {/* CNOT vertical connector wire */}
                    {cnotGate && qubitIdx === 0 && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[3px] h-[96px] bg-blue-700 pointer-events-none z-0" />
                    )}

                    <button
                      onClick={() => handleCellClick(qubitIdx, stepIdx)}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 relative ${
                        singleGate
                          ? singleGate.type === 'H'
                            ? 'bg-purple-600 text-white font-mono font-bold text-base shadow-md hover:scale-105'
                            : 'bg-emerald-600 text-white font-mono font-bold text-base shadow-md hover:scale-105'
                          : isCnotControl
                          ? 'bg-blue-700 text-white shadow-md hover:scale-105'
                          : isCnotTarget
                          ? 'bg-blue-700 text-white shadow-md hover:scale-105'
                          : 'border-2 border-dashed border-slate-300 bg-white/80 hover:bg-amber-50 hover:border-amber-400 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {singleGate && (
                        <span>{singleGate.type}</span>
                      )}

                      {isCnotControl && (
                        <div className="w-4 h-4 rounded-full bg-white shadow" />
                      )}

                      {isCnotTarget && (
                        <div className="text-xl font-bold">⊕</div>
                      )}

                      {!singleGate && !isCnotControl && !isCnotTarget && (
                        <span className="text-[10px] font-mono text-slate-400 opacity-0 hover:opacity-100 font-bold">+</span>
                      )}
                    </button>
                  </div>
                );
              })}

              {/* End of Wire Measurement Meter */}
              <div className="flex items-center justify-center z-10">
                <div className="w-10 h-10 rounded border-2 border-slate-800 bg-slate-100 flex flex-col items-center justify-center text-slate-800 shadow-sm" title="Measurement basis Z">
                  <span className="text-[10px] font-mono font-bold">∿</span>
                  <span className="text-[8px] font-mono font-bold -mt-1">MEAS</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Footer: Run Simulation on Aer */}
      <div className="mt-3.5 pt-3 border-t-2 border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-600">
          <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>
            Current sequence: {circuit.length ? circuit.map(g => g.type === 'CNOT' ? `CNOT(${g.control}→${g.target})` : `${g.type}(q[${g.target}])`).join(' → ') : 'Empty wire'}
          </span>
        </div>

        <button
          onClick={onRunSimulation}
          disabled={isRunning || circuit.length === 0}
          className={`font-mono text-xs sm:text-sm font-bold tracking-wider uppercase flex items-center gap-2 rounded-xl transition-all ${
            isRunning
              ? 'bg-amber-500 text-slate-950 cursor-wait animate-pulse px-5 py-2.5 shadow-md'
              : circuit.length === 0
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed px-5 py-2.5 opacity-60'
              : 'btn-primary-tactile px-5 py-2.5'
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : 'fill-white'}`} />
          <span>{isRunning ? 'SIMULATING ON AER...' : 'RUN ON QISKIT AER'}</span>
        </button>
      </div>
    </div>
  );
}
