from app.core.config import GEMINI_API_KEY


def generate_gemini_text(prompt: str):
    if not GEMINI_API_KEY:
        return (
            "Gemini is not configured yet. Add GEMINI_API_KEY to Railway "
            "environment variables and redeploy."
        )

    try:
        import google.generativeai as genai
    except ImportError as error:
        return (
            "Gemini SDK is not installed in this deployment. "
            "Make sure google-genai is in requirements.txt and redeploy with cache cleared. "
            f"Import error: {error}"
        )

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text
    except Exception as error:
        return f"Gemini request failed: {error}"
