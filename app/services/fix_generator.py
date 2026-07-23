from app.services.gemini_client import generate_gemini_text


def generate_fix(vulnerability, code):
    prompt = f"""
You are a senior security engineer.

Vulnerability:
{vulnerability}

Code:
{code}

Explain why it is insecure.

Then provide a secure version.

Return only markdown.
"""

    return generate_gemini_text(prompt)
