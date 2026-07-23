import httpx

GITHUB_API_BASE_URL = "https://api.github.com"

async def get_github_user(token):
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_API_BASE_URL}/user",
            headers=headers
        )

    response.raise_for_status()
    return response.json()


async def get_github_repositories(token):
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json"
    }

    params = {
        "visibility": "all",
        "affiliation": "owner,collaborator,organization_member",
        "sort": "updated",
        "per_page": 100
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_API_BASE_URL}/user/repos",
            headers=headers,
            params=params
        )

    response.raise_for_status()
    return response.json()
