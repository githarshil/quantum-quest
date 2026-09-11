import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env BEFORE anything else so env vars are available to all modules
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env", override=True)

from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from backend.simulator import run_simulation, SimulationRequest, SimulationResult
from backend.nova import get_nova_response, NovaChatRequest, NovaChatResponse

app = FastAPI(
    title="Quantum Quest API",
    description="Backend service for Quantum Quest gamified quantum learning platform with Qiskit Aer simulation",
    version="1.0.0"
)

# Configure CORS origins (read from env in production, fallback to permissive for dev)
raw_origins = os.getenv("ALLOWED_ORIGINS", "*").strip()
if raw_origins == "*":
    cors_origins = ["*"]
else:
    cors_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]
    # Ensure production Netlify app and local development origins remain accessible
    for prod_origin in ["https://quantum-quest-app.netlify.app", "http://quantum-quest-app.netlify.app", "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]:
        if prod_origin not in cors_origins:
            cors_origins.append(prod_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "Quantum Quest API",
        "simulator": "Qiskit Aer 0.17.2",
        "endpoints": ["/api/simulate", "/api/nova/chat", "/api/ai/ask", "/api/health"]
    }

@app.get("/api/health")
def health():
    from backend.rag import is_rag_available
    return {
        "status": "healthy",
        "service": "quantum-quest-backend",
        "rag_available": is_rag_available(),
    }

@app.post("/api/simulate", response_model=SimulationResult)
def simulate_circuit(req: SimulationRequest):
    try:
        result = run_simulation(req)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

@app.post("/api/nova/chat", response_model=NovaChatResponse)
def nova_chat(req: NovaChatRequest):
    from backend.rag import is_rag_available, ask_nova_rag
    if is_rag_available():
        try:
            # Build an appropriate prompt from message or context
            query = req.message or ""
            if not query.strip():
                if req.context == "bell_state_results":
                    query = "Analyze the simulation results of this quantum circuit and explain the quantum state to the student."
                elif req.context == "lab_hint":
                    query = "Give a concise hint on how to construct a Bell State circuit with H and CNOT gates."
                else:
                    query = "Greet the cadet as NOVA and explain what we can do in the quantum lab."

            rag_res = ask_nova_rag(
                query=query,
                lesson_id="Entanglement & Bell States",
                mission_id="bell-state",
                circuit_data=req.circuit_data,
                simulation_result=req.simulation_result,
            )
            return NovaChatResponse(
                reply=rag_res["answer"],
                mood=rag_res.get("mood", "happy"),
                suggested_actions=["Explain why |01⟩ is zero", "What is spooky action at a distance?", "How does the CNOT gate work?"]
            )
        except Exception as e:
            print(f"[nova_chat RAG fallback]: {e}")

    try:
        response = get_nova_response(req)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Nova AI error: {str(e)}")



# ---- NEW: RAG-powered AI endpoint ----

class AiAskRequest(BaseModel):
    query: str
    lesson_id: Optional[str] = None
    mission_id: Optional[str] = None
    circuit: Optional[Dict[str, Any]] = None
    simulation_result: Optional[Dict[str, Any]] = None

class AiAskSource(BaseModel):
    document: str
    section: str

class AiAskResponse(BaseModel):
    answer: str
    sources: List[AiAskSource] = []
    mood: str = "happy"
    grounded: bool = False

@app.post("/api/ai/ask", response_model=AiAskResponse)
def ai_ask(req: AiAskRequest):
    """
    RAG-powered NOVA endpoint.

    Attempts the full RAG pipeline (embed → retrieve → Gemini).
    Falls back to the existing deterministic Nova if RAG is unavailable.
    """
    from backend.rag import is_rag_available, ask_nova_rag

    if is_rag_available():
        try:
            result = ask_nova_rag(
                query=req.query,
                lesson_id=req.lesson_id,
                mission_id=req.mission_id,
                circuit_data=req.circuit,
                simulation_result=req.simulation_result,
            )
            return AiAskResponse(
                answer=result["answer"],
                sources=[AiAskSource(**s) for s in result.get("sources", [])],
                mood=result.get("mood", "happy"),
                grounded=result.get("grounded", False),
            )
        except Exception as e:
            print(f"[RAG fallback] RAG failed, falling back to deterministic Nova: {e}")
            # Fall through to deterministic Nova below

    # Fallback: use existing keyword-matching Nova
    try:
        nova_req = NovaChatRequest(
            message=req.query,
            context="general",
            simulation_result=req.simulation_result,
        )
        nova_resp = get_nova_response(nova_req)
        return AiAskResponse(
            answer=nova_resp.reply,
            sources=[],
            mood=nova_resp.mood,
            grounded=False,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    is_dev = os.environ.get("ENVIRONMENT", "development") == "development"
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=is_dev)
