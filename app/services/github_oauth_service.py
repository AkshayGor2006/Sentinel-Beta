import httpx
from app.core.config import settings

async def exchange_code_for_token(
        code: str
):
    url = ("https://github.com/login/oauth/access_token")

    async with httpx.AsyncClient() as client:
        response = await client.post(

            url,

            headers={
                "Accept": "application/json"
            },

            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_CALLBACK_URL
            }
        )

    response.raise_for_status()
    return response.json()
