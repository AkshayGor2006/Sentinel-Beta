from app.services.vector_store import search_chunks
from app.services.context_engine import build_context
from app.services.ai_service import ask_ai


def chat_with_repository(question):

    results = search_chunks(question)

    context = build_context(results)

    answer = ask_ai(
        context,
        question
    )

    return {
        "answer": answer,
        "sources": results["metadatas"][0]
    }