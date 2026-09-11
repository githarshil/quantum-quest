from backend.simulator import run_simulation, SimulationRequest, GateOp
from backend.nova import get_nova_response, NovaChatRequest

# Test Bell State simulation
req = SimulationRequest(
    num_qubits=2,
    gates=[
        GateOp(type="H", target=0, step=0),
        GateOp(type="CNOT", control=0, target=1, step=1)
    ],
    challenge_id="bell-state"
)

res = run_simulation(req)
print(f"Result Passed: {res.passed}")
print(f"Counts: {res.counts}")
print(f"Probabilities: {res.probabilities}")
print(f"Message: {res.message}")

# Test Nova response
nova_req = NovaChatRequest(
    context="bell_state_results",
    simulation_result=res.model_dump()
)
nova_res = get_nova_response(nova_req)
print(f"\nNova Mood: {nova_res.mood}")
print(f"Nova Reply:\n{nova_res.reply}")
