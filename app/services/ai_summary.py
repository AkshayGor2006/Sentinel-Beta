from app.services.gemini_client import generate_gemini_text


def generate_ai_summary(report):
    prompt = f"""
You are a Senior Security Engineer.

Analyze the following security report.

{report}

Return:

1. Executive Summary
2. Overall Risk
3. Top 3 Priorities
4. Deployment Recommendation

Keep the response under 200 words.
"""

    return generate_gemini_text(prompt)
