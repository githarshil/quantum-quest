export const CURRICULUM = {
  levels: [
    {
      id: "level-1",
      number: 1,
      title: "Superposition",
      subtitle: "The Quantum Coin Flip",
      tag: "FUNDAMENTALS",
      status: "completed", // or "active", "locked"
      badge: "⭐ MASTERED",
      color: "amber",
      tapeColor: "#f5ea92",
      rotation: "-rotate-1",
      description: "Understand how a quantum bit can exist in a linear combination of |0⟩ and |1⟩ simultaneously.",
      sections: [
        {
          heading: "1. The Spinning Coin Analogy",
          content: "A classical bit is like a coin lying flat on a desk: it is strictly Heads (0) or Tails (1). A qubit in superposition is like a coin spinning rapidly on the tabletop. While it spins, it isn't strictly Heads or Tails—it possesses the potential to be either until an observation forces it to settle.",
          note: "Mathematical definition: |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1."
        },
        {
          heading: "2. The Measurement Postulate",
          content: "Before measurement, the qubit exists in a continuum of possibilities. Upon measurement, the wavefunction instantly collapses to either state |0⟩ (with probability |α|²) or |1⟩ (with probability |β|²). Superposition is destroyed by observation.",
          note: "You cannot peek without disturbing the state!"
        },
        {
          heading: "3. What Superposition is NOT",
          content: "Superposition is NOT the qubit oscillating rapidly between 0 and 1. It is a genuine linear combination with quantum phase—allowing constructive and destructive interference.",
          note: "This interference is what gives quantum computing its exponential algorithmic power!"
        }
      ],
      quiz: [
        {
          id: "q1",
          question: "Which gate creates an equal superposition from the ground state |0⟩?",
          options: [
            "Pauli-X Gate (NOT)",
            "Hadamard Gate (H)",
            "Phase Gate (S)",
            "Measurement Gate"
          ],
          correctIndex: 1,
          explanation: "The Hadamard (H) gate transforms |0⟩ into (|0⟩ + |1⟩)/√2, which has a 50% probability of collapsing to |0⟩ and 50% to |1⟩."
        },
        {
          id: "q2",
          question: "If |ψ⟩ = (1/√2)|0⟩ + (1/√2)|1⟩, what is the probability of measuring 0?",
          options: ["0%", "25%", "50%", "100%"],
          correctIndex: 2,
          explanation: "Probability is given by |α|² = |1/√2|² = 1/2 = 50%."
        },
        {
          id: "q3",
          question: "What happens to a qubit in superposition immediately after it is measured?",
          options: [
            "It splits into two parallel universes",
            "Its wavefunction collapses to a definite state (|0⟩ or |1⟩)",
            "It doubles its energy",
            "It remains in superposition forever"
          ],
          correctIndex: 1,
          explanation: "Measurement forces the quantum system to collapse into one of the eigenstates of the observable."
        }
      ]
    },
    {
      id: "level-2",
      number: 2,
      title: "Quantum Gates",
      subtitle: "Hadamard & Pauli Transforms",
      tag: "CORE TOOLKIT",
      status: "completed",
      badge: "⭐ MASTERED",
      color: "emerald",
      tapeColor: "#c7f9cc",
      rotation: "rotate-1",
      description: "Learn how unitary operators manipulate quantum state vectors without losing information.",
      sections: [
        {
          heading: "1. The Pauli-X Gate (Quantum NOT)",
          content: "The X gate acts as a quantum bit-flip: X|0⟩ = |1⟩ and X|1⟩ = |0⟩. In matrix form, it is [[0, 1], [1, 0]].",
          note: "Applying X twice returns the qubit to its original state (X² = I)."
        },
        {
          heading: "2. The Hadamard Gate (H)",
          content: "The Hadamard gate maps the computational basis into the X-basis. H|0⟩ = |+⟩ = (|0⟩ + |1⟩)/√2, and H|1⟩ = |-⟩ = (|0⟩ - |1⟩)/√2.",
          note: "H is self-inverse: H·H = I. Applying H twice cancels it out!"
        }
      ],
      quiz: [
        {
          id: "q2_1",
          question: "What is the result of applying the Hadamard gate twice in a row: H(H|0⟩)?",
          options: ["|1⟩", "|0⟩", "|+⟩", "(|0⟩ - |1⟩)/√2"],
          correctIndex: 1,
          explanation: "Because H is unitary and self-inverse (H² = I), H(H|0⟩) = |0⟩."
        }
      ]
    },
    {
      id: "level-3",
      number: 3,
      title: "Entanglement & Bell States",
      subtitle: "Spooky Action at a Distance",
      tag: "CURRENT MISSION",
      status: "active",
      badge: "🚀 ACTIVE MISSION",
      color: "amber",
      tapeColor: "#fde68a",
      rotation: "-rotate-1",
      description: "Tie two qubits together into a unified quantum state that cannot be separated.",
      sections: [
        {
          heading: "1. What is Quantum Entanglement?",
          content: "When two particles interact and become entangled, their physical properties become intimately linked. Even if separated by light-years, measuring one qubit instantly reveals the state of the other.",
          note: "Einstein called this 'spooky action at a distance' (spukhafte Fernwirkung)."
        },
        {
          heading: "2. The 4 Canonical Bell States",
          content: "The Bell states form an orthonormal basis of maximally entangled two-qubit states:\n• |Φ⁺⟩ = (|00⟩ + |11⟩)/√2\n• |Φ⁻⟩ = (|00⟩ - |11⟩)/√2\n• |Ψ⁺⟩ = (|01⟩ + |10⟩)/√2\n• |Ψ⁻⟩ = (|01⟩ - |10⟩)/√2",
          note: "Notice that in |Φ⁺⟩, the two qubits are ALWAYS identical upon measurement (both 0 or both 1)."
        },
        {
          heading: "3. The Recipe for |Φ⁺⟩",
          content: "To construct the primary Bell State |Φ⁺⟩ from initial state |00⟩:\n1. Apply H to qubit 0: |00⟩ → (|0⟩ + |1⟩)/√2 ⊗ |0⟩ = (|00⟩ + |10⟩)/√2\n2. Apply CNOT with control q0 and target q1: flips target if control is 1 → (|00⟩ + |11⟩)/√2.",
          note: "Two simple gates create the foundation of quantum teleportation and cryptography!"
        }
      ],
      challengeId: "bell-state",
      quiz: [
        {
          id: "q3_1",
          question: "In the Bell State |Φ⁺⟩ = (|00⟩ + |11⟩)/√2, if qubit 0 is measured and found to be 1, what is qubit 1?",
          options: [
            "50% chance of 0, 50% chance of 1",
            "Definitely 1 (100% probability)",
            "Definitely 0 (100% probability)",
            "Unknown until second measurement"
          ],
          correctIndex: 1,
          explanation: "Because |01⟩ and |10⟩ amplitudes are zero in |Φ⁺⟩, measuring q0 = 1 instantly collapses the system to |11⟩, meaning q1 is guaranteed to be 1."
        }
      ]
    },
    {
      id: "level-4",
      number: 4,
      title: "Quantum Teleportation",
      subtitle: "Information Relayed Across Space",
      tag: "FUTURE MISSION",
      status: "locked",
      badge: "🔒 LOCKED",
      color: "slate",
      tapeColor: "#e2e8f0",
      rotation: "rotate-1",
      description: "Transfer an unknown quantum state from Alice to Bob using an entangled pair and classical communications.",
      sections: []
    }
  ],

  challenge: {
    id: "bell-state",
    supabaseChallengeId: "cccccccc-cccc-cccc-cccc-cccccccccccc",
    title: "Mission: Create a Bell State",
    targetState: "|Φ⁺⟩ = (|00⟩ + |11⟩)/√2",
    targetDescription: "Equal 50% probability of |00⟩ and 50% probability of |11⟩. Zero chance of |01⟩ or |10⟩.",
    targetDistribution: { "00": 0.5, "11": 0.5, "01": 0.0, "10": 0.0 },
    xpReward: 150,
    badgeReward: "Entanglement Pioneer",
    instructions: [
      "Place an H (Hadamard) gate on qubit line q[0] to create superposition.",
      "Place a CNOT gate with control on q[0] (click dot) and target on q[1] (click ⊕).",
      "Press the 'RUN ON QISKIT AER' switch to simulate 1,000 quantum shots.",
      "Inspect the green oscilloscope CRT monitor and hear Nova's analysis!"
    ],
    hints: [
      "Remember: H on q[0] turns |00⟩ into (|00⟩ + |10⟩)/√2.",
      "Then CNOT(0, 1) flips the second qubit whenever the first qubit is 1, yielding (|00⟩ + |11⟩)/√2!",
      "If you see 100% |00⟩, make sure you dropped the H gate onto the circuit wire."
    ]
  }
};
