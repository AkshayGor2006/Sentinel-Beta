from app.services.vector_store import search_chunks


def search_code(query: str):
    return search_chunks(query, top_k=5)
