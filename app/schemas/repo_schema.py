from pydantic import BaseModel


class RepoRequest(BaseModel):

    url: str

    query: str


class GithubScanRequest(BaseModel):

    repo_name: str | None = None

    repo_url: str | None = None

    query: str = "Find security issues"
