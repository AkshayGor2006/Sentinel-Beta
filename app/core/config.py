import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class Settings:

    APP_NAME = "Sentinel AI"

    VERSION = "1.0.0"

    GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")

    GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

    GITHUB_CALLBACK_URL = (
    "https://sentinel-beta-production.up.railway.app/github/callback"
    )

    GEMINI_API_KEY = GEMINI_API_KEY

settings = Settings()

