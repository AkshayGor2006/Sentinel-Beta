import type {
  AuthResponse,
  ChatResponse,
  DashboardResponse,
  GithubRepo,
  GithubScanResponse,
  GithubStatus,
  ScanResult,
} from "@/lib/types";

/**
 * Your FastAPI backend runs on 127.0.0.1:8001 (confirmed from your Swagger
 * screenshots), and main.py's CORS middleware only allows
 * http://localhost:3000 as an origin â€” so run this frontend on
 * `localhost:3000`, not `127.0.0.1:3000`, or requests will be blocked.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8001";

const TOKEN_KEY = "sentinel_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

/**
 * Your JWT is opaque to the frontend â€” this just reads the `sub`/`username`
 * claim out of the token payload for display (no signature verification,
 * purely cosmetic). Returns null if it can't be decoded.
 */
export function decodeUsernameFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(normalized));
    return json.sub ?? json.username ?? null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path: string, options: RequestInit = {}): Promise<unknown> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !(options.body instanceof URLSearchParams) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(
      `Couldn't reach ${API_BASE_URL}${path}. Confirm uvicorn is running on port 8001 and that this app is running on http://localhost:3000 (CORS in your main.py only allows that exact origin).`
    );
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // no/invalid JSON body
  }

  if (!res.ok) {
    const body = data as Record<string, unknown> | null;
    const detail = body?.detail ?? body?.error;
    throw new ApiError(
      typeof detail === "string" ? detail : `Request failed with status ${res.status}`,
      res.status
    );
  }

  // Your backend returns 200 with { error: "..." } instead of a 4xx in some
  // places (e.g. /auth/login on bad credentials, /dashboard on bad token) â€”
  // surface that the same way as a thrown error.
  const body = data as Record<string, unknown> | null;
  if (body && typeof body === "object" && typeof body.error === "string") {
    throw new ApiError(body.error, res.status);
  }

  return data;
}

// ---------- Auth ----------

/** POST /auth/login â€” OAuth2PasswordRequestForm, so this MUST be form-urlencoded, not JSON. */
export async function login(username: string, password: string): Promise<AuthResponse> {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);
  const data = (await request("/auth/login", { method: "POST", body })) as AuthResponse;
  if (!data?.access_token) {
    throw new ApiError("Backend responded but didn't include an access_token.");
  }
  setToken(data.access_token);
  return data;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

/** POST /auth/signup */
export async function signup(payload: SignupPayload): Promise<{ message: string; user_id: number }> {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  }) as Promise<{ message: string; user_id: number }>;
}

// ---------- GitHub ----------

/** GET /github/login — full browser redirect to GitHub OAuth. */
export function githubLoginUrl(): string {
  const token = getToken();
  const url = new URL(`${API_BASE_URL}/github/login`);

  if (token) {
    url.searchParams.set("token", token);
  }

  return url.toString();
}

/** GET /github/status */
export async function getGithubStatus(): Promise<GithubStatus> {
  return request("/github/status") as Promise<GithubStatus>;
}

/** GET /github/repos */
export async function getGithubRepos(): Promise<GithubRepo[]> {
  return request("/github/repos") as Promise<GithubRepo[]>;
}

export interface GithubScanParams {
  repo_name?: string;
  repo_url?: string;
  query: string;
}

/** POST /github/scan */
export async function scanGithubRepo(params: GithubScanParams): Promise<GithubScanResponse> {
  return request("/github/scan", {
    method: "POST",
    body: JSON.stringify(params),
  }) as Promise<GithubScanResponse>;
}

// ---------- Direct analyze (works today without GitHub OAuth) ----------

/** POST /analyze-repo â€” body is { url, query } per RepoRequest/repo.py. */
export async function analyzeRepo(url: string, query: string): Promise<ScanResult> {
  return request("/analyze-repo", {
    method: "POST",
    body: JSON.stringify({ url, query }),
  }) as Promise<ScanResult>;
}

// ---------- Dashboard ----------

/** GET /dashboard */
export async function getDashboard(): Promise<DashboardResponse> {
  return request("/dashboard") as Promise<DashboardResponse>;
}

// ---------- Chat ----------

/** POST /chat-with-repo â€” no auth required (confirmed: no verify_token dependency in repo.py). */
export async function chatWithRepo(question: string): Promise<ChatResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/chat-with-repo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
  } catch {
    throw new ApiError(`Couldn't reach ${API_BASE_URL}/chat-with-repo.`);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(data?.detail ?? `Chat request failed with status ${res.status}`, res.status);
  }
  return data as ChatResponse;
}

