/**
 * Types mirrored from the actual Sentinel AI FastAPI backend
 * (auth.py, dashboard.py, github_auth.py, repo.py).
 *
 * Fields marked `unknown` are returned by the backend but their exact
 * shape wasn't visible in the API samples I was given — they're passed
 * through and rendered generically rather than guessed at. If you want
 * these fully typed and bound to specific UI, share a sample response
 * for that field and I'll wire it properly.
 */

export interface Issue {
  file: string;
  issue: string;
  risk?: string;
  fix?: string;
  /**
   * repo.py saves `issue.get("severity", "MEDIUM")` to the DB, which implies
   * security_agent findings carry a "severity" field — but it wasn't visible
   * in the /analyze-repo sample response you shared (may have been cut off
   * in the screenshot). Treated as optional; UI falls back to "unknown"
   * rather than assuming a value.
   */
  severity?: string;
}

export interface AgentResult {
  total_issues?: number;
  severity_count?: {
    CRITICAL?: number;
    HIGH?: number;
    MEDIUM?: number;
    LOW?: number;
  };
  issues?: Issue[];
  ai_summary?: string;
  [key: string]: unknown;
}

export interface ScanResult {
  selected_agent?: { agent?: string; reason?: string };
  agent_result?: AgentResult | null;
  ai_summary?: string;
  answer?: string;
  error?: string;
  // Returned by run_repository_scan() but shape not confirmed from samples —
  // rendered generically via <RawDataBlock> where present.
  progress?: unknown;
  recommendations?: unknown;
  fix_plan?: unknown;
  patches?: unknown;
  confidence?: unknown;
  pull_request?: unknown;
  approval?: unknown;
  incident_report?: unknown;
  learning_report?: unknown;
  threat_report?: unknown;
  attack_simulation?: unknown;
  decision?: unknown;
  learning_memory?: unknown;
  security_score?: unknown;
  security_roadmap?: unknown;
  executive_report?: unknown;
  dashboard?: unknown;
  ai_reasoning?: unknown;
  sentinel_report?: unknown;
  context?: unknown;
}

export interface GithubScanResponse {
  message: string;
  repository: {
    name: string;
    full_name: string;
    private: boolean;
    html_url: string;
    default_branch: string;
  };
  scan: ScanResult;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  clone_url: string;
  language: string | null;
  default_branch: string;
  updated_at: string;
}

export interface GithubStatus {
  connected: boolean;
  username: string;
  github: string | null;
  avatar: string | null;
}

export interface DashboardResponse {
  total_repositories: number;
  total_scans: number;
  total_vulnerabilities: number;
  severity: {
    critical: number;
    high: number;
    medium: number;
  };
  recent_repositories: string[];
  error?: string;
}

export interface ChatResponse {
  answer: string;
  sources?: { file: string; chunk: number }[];
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
