from typing import Optional, Dict, Any, List
from pydantic import BaseModel

class NovaChatRequest(BaseModel):
    message: Optional[str] = ""
    context: Optional[str] = "general"  # "bell_state_results", "lab_hint", "lesson", "general"
    circuit_data: Optional[Dict[str, Any]] = None
    simulation_result: Optional[Dict[str, Any]] = None

class NovaChatResponse(BaseModel):
    reply: str
    mood: str = "happy"  # "happy", "excited", "thinking", "curious", "celebrating"
    suggested_actions: Optional[List[str]] = None

def get_nova_response(req: NovaChatRequest) -> NovaChatResponse:
    context = req.context or "general"
    sim = req.simulation_result or {}
    msg = (req.message or "").lower().strip()
    
    # Check if this is explaining Bell State simulation results
    if context == "bell_state_results" or "explain" in msg or "result" in msg:
        passed = sim.get("passed", False)
        probs = sim.get("probabilities", {})
        p00 = probs.get("00", 0.0)
        p11 = probs.get("11", 0.0)
        p01 = probs.get("01", 0.0)
        p10 = probs.get("10", 0.0)
        
        if passed or (p00 > 0.4 and p11 > 0.4 and p01 < 0.1 and p10 < 0.1):
            return NovaChatResponse(
                reply=(
                    "⭐ Eureka! Look at that oscilloscope! Notice that the qubits only ever measure **|00⟩** (about 50%) "
                    "or **|11⟩** (about 50%). You NEVER see |01⟩ or |10⟩!\n\n"
                    "By applying the Hadamard gate to **q0**, you placed it in an equal superposition of |0⟩ and |1⟩. "
                    "Then, the **CNOT** gate tied the fate of **q1** directly to **q0**. "
                    "When q0 is |0⟩, q1 stays |0⟩. When q0 is |1⟩, q1 flips to |1⟩. "
                    "They are now intrinsically entangled across space and time—what Einstein famously called *'spooky action at a distance'*!"
                ),
                mood="celebrating",
                suggested_actions=["Review Bell State Math", "Claim +150 XP", "Return to Mission Control"]
            )
        elif p00 > 0.85:
            return NovaChatResponse(
                reply=(
                    "Hmm, cadet! Both qubits collapsed to **|00⟩** 100% of the time. "
                    "That means neither qubit was ever placed into quantum superposition! "
                    "Remember the recipe: Drag an **H (Hadamard)** gate onto **q0** first to unlock quantum possibilities!"
                ),
                mood="thinking",
                suggested_actions=["Add H gate to q0", "Re-run simulation"]
            )
        elif abs(p00 - 0.5) < 0.15 and abs(p01 - 0.5) < 0.15:
            return NovaChatResponse(
                reply=(
                    "You're halfway there! Your **q0** is humming in superposition, producing |00⟩ and |01⟩ (or |10⟩). "
                    "However, **q1** is still solitary—it hasn't been entangled! "
                    "Connect a **CNOT** gate with **q0** as the control (the dot) and **q1** as the target (the ⊕) to weave them together."
                ),
                mood="curious",
                suggested_actions=["Add CNOT gate q0 -> q1", "Re-run simulation"]
            )
        else:
            return NovaChatResponse(
                reply=(
                    f"Fascinating distribution on the monitor: |00⟩: {p00:.1%}, |11⟩: {p11:.1%}, |01⟩: {p01:.1%}, |10⟩: {p10:.1%}. "
                    "For the canonical Bell State |Φ⁺⟩, we need an even 50/50 split between only |00⟩ and |11⟩. "
                    "Check your gate sequence: H on q0, followed by CNOT from q0 to q1!"
                ),
                mood="thinking",
                suggested_actions=["Reset Circuit", "Follow Mission Steps"]
            )

    # Context: Lab hint
    if context == "lab_hint" or "hint" in msg:
        return NovaChatResponse(
            reply=(
                "Need a spark, cadet? Here is the blueprint for creating a Bell State |Φ⁺⟩:\n"
                "1. **Step 1:** Drag an **H Gate** onto line **q0**. This turns |0⟩ into (|0⟩ + |1⟩)/√2.\n"
                "2. **Step 2:** Drag a **CNOT Gate** across **q0** and **q1** (control on q0, target on q1).\n"
                "3. **Step 3:** Hit the glowing **'RUN ON QISKIT AER'** switch and watch the oscilloscope beam!"
            ),
            mood="happy",
            suggested_actions=["Apply H gate", "Apply CNOT gate", "Test Run"]
        )

    # Context: Lesson / Concept questions
    if "superposition" in msg:
        return NovaChatResponse(
            reply=(
                "**Superposition** is the quantum superpower! While a classical coin is either Heads or Tails, "
                "a spinning coin in the air has a probability of landing on either. A qubit in superposition (|ψ⟩ = α|0⟩ + β|1⟩) "
                "exists in a linear combination of both states until measured!"
            ),
            mood="excited",
            suggested_actions=["What is a Hadamard gate?", "How does measurement work?"]
        )
    elif "hadamard" in msg or "h gate" in msg:
        return NovaChatResponse(
            reply=(
                "The **Hadamard (H) gate** is the master key to quantum mechanics! "
                "It takes a definite basis state like |0⟩ and rotates it into |+⟩ = (|0⟩ + |1⟩)/√2, "
                "giving an exact 50% chance of measuring 0 and 50% chance of measuring 1."
            ),
            mood="happy",
            suggested_actions=["Tell me about CNOT", "Take the Superposition Quiz"]
        )
    elif "entanglement" in msg or "bell" in msg:
        return NovaChatResponse(
            reply=(
                "**Quantum Entanglement** occurs when two or more particles become connected such that the quantum state "
                "of each particle cannot be described independently of the others. "
                "When you measure qubit 0 and get '1', qubit 1 instantaneously collapses to '1' as well, no matter how far apart they are!"
            ),
            mood="celebrating",
            suggested_actions=["Build a Bell State", "Run Qiskit simulation"]
        )

    # Default friendly greeting
    return NovaChatResponse(
        reply=(
            "Greetings, quantum explorer! I'm **Nova**, your resident laboratory AI. "
            "I'm here to decipher quantum circuits, analyze wavefunctions, and guide your journey through Quantum Quest! "
            "What would you like to explore today?"
        ),
        mood="happy",
        suggested_actions=["How do I create a Bell State?", "What is Superposition?", "Test my circuit"]
    )
