"""
Gemini Embedding Module — Isolated embedding generation for RAG pipeline.

Uses the google.genai SDK (current, non-deprecated).
Model and API key are configurable via environment variables.
"""

import os
from typing import List

from google import genai
from google.genai import types

# ---------------------------------------------------------------------------
# Configuration (read once at import time, overridable by callers)
# ---------------------------------------------------------------------------
_API_KEY = os.getenv("GEMINI_API_KEY", "")
_EMBEDDING_MODEL = os.getenv("GEMINI_EMBEDDING_MODEL", "gemini-embedding-001")

_client = None


def _get_client():
    """Lazy-init the genai client."""
    global _client
    if _client is None:
        key = _API_KEY or os.getenv("GEMINI_API_KEY", "")
        if not key:
            raise RuntimeError("GEMINI_API_KEY is not set — cannot generate embeddings.")
        _client = genai.Client(api_key=key)
    return _client


def configure(api_key: str | None = None, model: str | None = None):
    """Re-configure the module at runtime (useful after dotenv load)."""
    global _API_KEY, _EMBEDDING_MODEL, _client
    if api_key:
        _API_KEY = api_key
        _client = genai.Client(api_key=_API_KEY)
    if model:
        _EMBEDDING_MODEL = model


def generate_embedding(text: str) -> List[float]:
    """Generate an embedding vector for a single text string (document ingestion)."""
    client = _get_client()
    model_name = _EMBEDDING_MODEL or os.getenv("GEMINI_EMBEDDING_MODEL", "gemini-embedding-001")
    result = client.models.embed_content(
        model=model_name,
        contents=text,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_DOCUMENT",
            output_dimensionality=768
        ),
    )
    return result.embeddings[0].values


def generate_query_embedding(text: str) -> List[float]:
    """Generate an embedding optimised for *query* retrieval."""
    client = _get_client()
    model_name = _EMBEDDING_MODEL or os.getenv("GEMINI_EMBEDDING_MODEL", "gemini-embedding-001")
    result = client.models.embed_content(
        model=model_name,
        contents=text,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
            output_dimensionality=768
        ),
    )
    return result.embeddings[0].values

