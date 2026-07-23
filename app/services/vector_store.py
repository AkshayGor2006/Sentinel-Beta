import hashlib
import os
from pathlib import Path

import chromadb

from app.services.embedding_service import create_embedding


VECTOR_DB_PATH = Path(
    os.getenv(
        "SENTINEL_VECTOR_DB_PATH",
        str(Path(__file__).resolve().parents[2] / "vector_db_local")
    )
)

client = chromadb.PersistentClient(
    path=str(VECTOR_DB_PATH)
)

collection = client.get_or_create_collection(
    name="sentinel_chunks_local_384"
)


def make_chunk_id(chunk):
    raw = f"{chunk['file']}:{chunk['chunk_number']}:{chunk['text'][:100]}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def store_chunks(chunks):
    for chunk in chunks:
        embedding = create_embedding(chunk["text"])

        collection.upsert(
            ids=[make_chunk_id(chunk)],
            documents=[chunk["text"]],
            embeddings=[embedding],
            metadatas=[
                {
                    "file": chunk["file"],
                    "chunk": chunk["chunk_number"]
                }
            ]
        )


def search_chunks(question, top_k=5):
    query_embedding = create_embedding(question)

    return collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k
    )
