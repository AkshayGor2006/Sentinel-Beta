from app.services.gemini_client import generate_gemini_text

def ask_ai(context, question):
    prompt = f"""
    You are an expert software security engineer.

    Repository Context:

    {context}

    User Question:

    {question}

    Answer only using repository context.
    If the answer is not found, clearly say so.
    """

    return generate_gemini_text(prompt)
