from google import genai
from app.core.config import GEMINI_API_KEY


def generate_gemini_text(prompt: str):
    if not GEMINI_API_KEY:
        return "Missing GEMINI_API_KEY"

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        return response.text

    except Exception as e:
        return str(e)