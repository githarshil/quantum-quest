from typing import List, Dict, Optional
from pydantic import BaseModel
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

class GateOp(BaseModel):
    type: str  # "H", "X", "CNOT", "MEASURE"
    target: int
    control: Optional[int] = None
    step: Optional[int] = 0

class SimulationRequest(BaseModel):
    num_qubits: int = 2
    gates: List[GateOp]
    shots: int = 1000
    challenge_id: Optional[str] = None
    target_distribution: Optional[Dict[str, float]] = None

class SimulationResult(BaseModel):
    counts: Dict[str, int]
    probabilities: Dict[str, float]
    passed: bool
    score: int
    message: str
    circuit_summary: str
    target_distribution: Optional[Dict[str, float]] = None

def run_simulation(req: SimulationRequest) -> SimulationResult:
    qc = QuantumCircuit(req.num_qubits, req.num_qubits)
    
    summary_lines = []
    
    # Sort gates by step if provided
    sorted_gates = sorted(req.gates, key=lambda g: g.step or 0)
    
    for g in sorted_gates:
        gate_type = g.type.upper()
        if gate_type == "H":
            qc.h(g.target)
            summary_lines.append(f"H applied to q[{g.target}]")
        elif gate_type == "X":
            qc.x(g.target)
            summary_lines.append(f"X applied to q[{g.target}]")
        elif gate_type == "CNOT":
            ctrl = g.control if g.control is not None else 0
            qc.cx(ctrl, g.target)
            summary_lines.append(f"CNOT (control=q[{ctrl}], target=q[{g.target}])")
        elif gate_type == "MEASURE":
            qc.measure(g.target, g.target)
            summary_lines.append(f"Measure q[{g.target}]")

    # Add final measurements if none were explicitly added
    if not any(g.type.upper() == "MEASURE" for g in sorted_gates):
        qc.measure(range(req.num_qubits), range(req.num_qubits))

    sim = AerSimulator()
    job = sim.run(qc, shots=req.shots)
    raw_counts = job.result().get_counts()

    # Normalize state strings to fixed length (e.g. 2 qubits -> 2 digits)
    total_shots = sum(raw_counts.values())
    counts = {}
    probs = {}
    
    # Pre-populate all possible 2-qubit basis states
    possible_states = [f"{i:0{req.num_qubits}b}" for i in range(2**req.num_qubits)]
    for state in possible_states:
        c = raw_counts.get(state, 0)
        counts[state] = c
        probs[state] = round(c / total_shots, 4)

    # Verification against target
    target = req.target_distribution
    if not target and (req.challenge_id == "bell-state" or req.challenge_id == "cccccccc-cccc-cccc-cccc-cccccccccccc"):
        target = {"00": 0.5, "11": 0.5}

    passed = False
    score = 0
    message = "Circuit simulated successfully."

    if target:
        # Check tolerance (e.g. within 0.10 of target for high probability states, <0.05 for zero states)
        is_match = True
        for state in possible_states:
            exp = target.get(state, 0.0)
            actual = probs.get(state, 0.0)
            if abs(actual - exp) > 0.12:  # shot noise tolerance for 1000 shots
                is_match = False
                break
        
        passed = is_match
        if passed:
            score = 100
            message = "Success! Maximum entanglement achieved! Perfect Bell State |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 created."
        else:
            # Provide helpful feedback based on results
            p00 = probs.get("00", 0.0)
            p01 = probs.get("01", 0.0)
            p10 = probs.get("10", 0.0)
            p11 = probs.get("11", 0.0)
            
            if p00 > 0.9:
                message = "The qubits are still in state |00⟩. Did you apply a Hadamard gate to put q0 in superposition?"
            elif abs(p00 - 0.5) < 0.12 and abs(p01 - 0.5) < 0.12:
                message = "You have superposition on q0, but q1 isn't entangled yet! Connect a CNOT from q0 to q1."
            elif p00 > 0.4 and p11 > 0.4:
                # Close enough but noise slightly outside
                passed = True
                score = 95
                message = "Excellent! You created the Bell State! Small shot noise observed."
            else:
                message = f"Output distribution does not match target. Observed: 00: {p00:.0%}, 11: {p11:.0%}, 01: {p01:.0%}, 10: {p10:.0%}."
    else:
        passed = True
        score = 100

    return SimulationResult(
        counts=counts,
        probabilities=probs,
        passed=passed,
        score=score,
        message=message,
        circuit_summary=" -> ".join(summary_lines) if summary_lines else "Empty circuit (all |0⟩)",
        target_distribution=target
    )
