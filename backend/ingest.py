"""
Document Ingestion Script — Reads markdown docs, chunks by section, embeds, upserts to Supabase.

Usage:
    python -m backend.ingest

Re-running is safe — uses UPSERT on (document_name, section, chunk_index).
"""

import os
import re
import sys
import time
from pathlib import Path
from typing import List, Dict

from dotenv import load_dotenv

# Load .env BEFORE importing project modules so env vars are available
load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

from supabase import create_client
from backend.embeddings import generate_embedding, configure as configure_embeddings

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
DOCS_DIR = Path(__file__).resolve().parent.parent / "docs"
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
EMBEDDING_MODEL = os.getenv("GEMINI_EMBEDDING_MODEL", "text-embedding-004")

# Maximum chunk length (characters).  Sections longer than this are split further.
MAX_CHUNK_CHARS = 1500


# ---------------------------------------------------------------------------
# Text cleaning
# ---------------------------------------------------------------------------

def clean_text(text: str) -> str:
    """Remove noisy artefacts from markdown extracted from Qiskit textbook pages."""
    # Remove binary blobs  (b'\\x89PNG ... )
    text = re.sub(r"b'\\x89PNG.*?'", "", text, flags=re.DOTALL)
    text = re.sub(r"b'\\n\\n.*?'", "", text, flags=re.DOTALL)
    # Remove Qiskit version tables
    text = re.sub(r"Version Information.*$", "", text, flags=re.DOTALL)
    # Remove import qiskit.tools.jupyter lines
    text = re.sub(r"import qiskit\.tools\.jupyter.*$", "", text, flags=re.MULTILINE)
    text = re.sub(r"%qiskit_version_table.*$", "", text, flags=re.MULTILINE)
    # Remove VBox/HBox widget output lines
    text = re.sub(r"(VBox|HBox)\(children=.*?\)", "", text, flags=re.DOTALL)
    text = re.sub(r"HTML\(value=.*?\)", "", text, flags=re.DOTALL)
    # Collapse excessive whitespace
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


# ---------------------------------------------------------------------------
# Section-aware chunking
# ---------------------------------------------------------------------------

def _split_long_section(content: str, max_chars: int) -> List[str]:
    """Split a section that exceeds max_chars by paragraphs."""
    paragraphs = re.split(r"\n\n+", content)
    chunks: List[str] = []
    current = ""
    for para in paragraphs:
        if len(current) + len(para) + 2 > max_chars and current:
            chunks.append(current.strip())
            current = para
        else:
            current = current + "\n\n" + para if current else para
    if current.strip():
        chunks.append(current.strip())
    return chunks


def chunk_document(filepath: Path) -> List[Dict]:
    """
    Parse a markdown file into section-aware chunks.

    Strategy:
    1. Split on heading lines (lines starting with # or ##).
    2. Each heading + following body becomes a section.
    3. Sections exceeding MAX_CHUNK_CHARS are further split by paragraph.
    """
    raw = filepath.read_text(encoding="utf-8")
    cleaned = clean_text(raw)

    # Split on markdown headings (##, ###, or top-level #)
    # We keep the heading with its body.
    section_pattern = re.compile(r"^(#{1,3})\s+(.+)$", re.MULTILINE)
    matches = list(section_pattern.finditer(cleaned))

    sections: List[Dict] = []

    if not matches:
        # No headings found — treat entire doc as one section
        sections.append({"heading": "Full Document", "body": cleaned})
    else:
        # Optionally capture content before the first heading
        if matches[0].start() > 0:
            preamble = cleaned[: matches[0].start()].strip()
            if preamble:
                sections.append({"heading": "Introduction", "body": preamble})

        for i, m in enumerate(matches):
            heading = m.group(2).strip()
            start = m.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(cleaned)
            body = cleaned[start:end].strip()
            if body:
                sections.append({"heading": heading, "body": body})

    # Now turn sections into final chunks with metadata
    doc_name = filepath.stem  # e.g. "superposition"
    chunks: List[Dict] = []
    chunk_idx = 0

    for sec in sections:
        heading = sec["heading"]
        body = sec["body"]
        content = f"{heading}\n\n{body}"

        if len(content) <= MAX_CHUNK_CHARS:
            chunks.append({
                "document_name": doc_name,
                "section": heading,
                "chunk_index": chunk_idx,
                "content": content,
            })
            chunk_idx += 1
        else:
            sub_parts = _split_long_section(content, MAX_CHUNK_CHARS)
            for sub in sub_parts:
                chunks.append({
                    "document_name": doc_name,
                    "section": heading,
                    "chunk_index": chunk_idx,
                    "content": sub,
                })
                chunk_idx += 1

    return chunks


# ---------------------------------------------------------------------------
# Embedding + Upsert
# ---------------------------------------------------------------------------

def ingest_documents():
    """Main ingestion entrypoint — read docs, chunk, embed, upsert."""
    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY is not set in .env")
        sys.exit(1)
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("ERROR: SUPABASE_URL / SUPABASE_SERVICE_KEY not set in .env")
        sys.exit(1)

    # Configure embedding module
    configure_embeddings(api_key=GEMINI_API_KEY, model=EMBEDDING_MODEL)

    sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    md_files = sorted(DOCS_DIR.glob("*.md"))
    if not md_files:
        print(f"No .md files found in {DOCS_DIR}")
        sys.exit(1)

    print(f"Found {len(md_files)} document(s) in {DOCS_DIR}:")
    for f in md_files:
        print(f"  - {f.name}")

    total_chunks = 0

    for filepath in md_files:
        print(f"\n--- Processing: {filepath.name} ---")
        chunks = chunk_document(filepath)
        print(f"  Extracted {len(chunks)} chunk(s)")

        for chunk in chunks:
            # Generate embedding
            embedding = generate_embedding(chunk["content"])

            # Upsert into Supabase
            row = {
                "document_name": chunk["document_name"],
                "section": chunk["section"],
                "chunk_index": chunk["chunk_index"],
                "content": chunk["content"],
                "embedding": embedding,
                "metadata": {
                    "source_file": filepath.name,
                },
            }

            # Use upsert with the unique constraint (document_name, section, chunk_index)
            sb.table("document_chunks").upsert(
                row,
                on_conflict="document_name,section,chunk_index",
            ).execute()

            print(f"  [OK] Upserted: [{chunk['document_name']}] {chunk['section']} (chunk {chunk['chunk_index']})")


            # Small delay to respect Gemini rate limits
            time.sleep(0.3)

        total_chunks += len(chunks)

    print(f"\n=== Ingestion complete: {total_chunks} chunk(s) from {len(md_files)} document(s) ===")


# ---------------------------------------------------------------------------
# CLI entry
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    ingest_documents()
