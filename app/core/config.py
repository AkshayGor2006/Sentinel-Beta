import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

class Settings:

    APP_NAME = "Sentinel AI"

    VERSION = "1.0.0"

    GITHUB_CLIENT_ID = "Ov23lij72Q8kP7bmYaTy"

    GITHUB_CLIENT_SECRET = "deb663d2d78bdea1fb8ae61cfac0e07e59aac0cd"

    GITHUB_CALLBACK_URL = (
    "https://sentinel-beta-production.up.railway.app/github/callback"
    )

    GEMINI_API_KEY = GEMINI_API_KEY

settings = Settings()

