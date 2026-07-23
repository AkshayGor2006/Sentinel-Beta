export type Severity = "critical" | "high" | "medium" | "low" | "info";

export interface Vulnerability {
  id: string;
  title: string;
  file: string;
  line: number;
  severity: Severity;
  cwe: string;
  detectedBy: "Bandit" | "Semgrep" | "Sentinel Core";
  status: "open" | "fixed" | "ignored";
  description: string;
  vulnerableCode: string;
  fixedCode: string;
  aiExplanation: string;
}

export const vulnerabilities: Vulnerability[] = [
  {
    id: "SENT-1042",
    title: "Hardcoded database credentials",
    file: "app/core/database.py",
    line: 14,
    severity: "critical",
    cwe: "CWE-798",
    detectedBy: "Bandit",
    status: "open",
    description:
      "Database password is committed directly in source, exposing credentials to anyone with repo access.",
    vulnerableCode: `DB_PASSWORD = "sentinel_prod_2024"
engine = create_engine(f"postgresql://admin:{DB_PASSWORD}@db:5432/app")`,
    fixedCode: `DB_PASSWORD = os.environ["DB_PASSWORD"]
engine = create_engine(f"postgresql://admin:{DB_PASSWORD}@db:5432/app")`,
    aiExplanation:
      "Move secrets to environment variables and load them with os.environ. Add .env to .gitignore and rotate this credential immediately since it's already in git history.",
  },
  {
    id: "SENT-1041",
    title: "SQL injection via string formatting",
    file: "app/routers/users.py",
    line: 58,
    severity: "critical",
    cwe: "CWE-89",
    detectedBy: "Semgrep",
    status: "open",
    description:
      "User-controlled input is interpolated directly into a raw SQL query, allowing arbitrary query injection.",
    vulnerableCode: `query = f"SELECT * FROM users WHERE email = '{email}'"
result = db.execute(query)`,
    fixedCode: `query = text("SELECT * FROM users WHERE email = :email")
result = db.execute(query, {"email": email})`,
    aiExplanation:
      "Use parameterized queries via SQLAlchemy's text() with bound parameters instead of f-string interpolation. This lets the driver escape input safely.",
  },
  {
    id: "SENT-1038",
    title: "Missing authentication on admin route",
    file: "app/routers/admin.py",
    line: 22,
    severity: "high",
    cwe: "CWE-306",
    detectedBy: "Sentinel Core",
    status: "open",
    description:
      "The /admin/users/delete endpoint has no dependency guard, allowing any authenticated or unauthenticated caller to invoke it.",
    vulnerableCode: `@router.delete("/admin/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db.query(User).filter(User.id == user_id).delete()`,
    fixedCode: `@router.delete("/admin/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    db.query(User).filter(User.id == user_id).delete()`,
    aiExplanation:
      "Add a require_admin dependency that validates the caller's JWT and role claim before the handler executes. Every destructive admin route should share this guard.",
  },
  {
    id: "SENT-1035",
    title: "Insecure deserialization with pickle",
    file: "app/services/cache.py",
    line: 31,
    severity: "high",
    cwe: "CWE-502",
    detectedBy: "Bandit",
    status: "open",
    description:
      "Deserializing cached data with pickle.loads() allows arbitrary code execution if the cache backend is ever compromised.",
    vulnerableCode: `import pickle
data = pickle.loads(redis_client.get(key))`,
    fixedCode: `import json
data = json.loads(redis_client.get(key))`,
    aiExplanation:
      "Switch to json for cache serialization. It covers the same use case here and can't execute code on deserialization.",
  },
  {
    id: "SENT-1029",
    title: "Weak JWT signing algorithm allowed",
    file: "app/core/security.py",
    line: 19,
    severity: "medium",
    cwe: "CWE-347",
    detectedBy: "Semgrep",
    status: "fixed",
    description:
      "jwt.decode() accepts the 'none' algorithm, letting an attacker forge unsigned tokens that pass verification.",
    vulnerableCode: `payload = jwt.decode(token, SECRET, algorithms=["HS256", "none"])`,
    fixedCode: `payload = jwt.decode(token, SECRET, algorithms=["HS256"])`,
    aiExplanation:
      "Restrict algorithms to the single expected value. Never include 'none' in the allowed list — it disables signature verification entirely.",
  },
  {
    id: "SENT-1024",
    title: "CORS wildcard with credentials enabled",
    file: "app/main.py",
    line: 41,
    severity: "medium",
    cwe: "CWE-942",
    detectedBy: "Sentinel Core",
    status: "open",
    description:
      "allow_origins=['*'] combined with allow_credentials=True lets any origin make authenticated requests on behalf of a user.",
    vulnerableCode: `app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
)`,
    fixedCode: `app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.sentinel.ai"],
    allow_credentials=True,
)`,
    aiExplanation:
      "Replace the wildcard with an explicit allow-list of trusted frontend origins. Wildcards and credentials should never be combined per the Fetch spec.",
  },
  {
    id: "SENT-1018",
    title: "Verbose error responses leak stack traces",
    file: "app/main.py",
    line: 67,
    severity: "low",
    cwe: "CWE-209",
    detectedBy: "Bandit",
    status: "open",
    description:
      "debug=True in production returns full tracebacks to clients, revealing file paths and internal logic.",
    vulnerableCode: `app = FastAPI(debug=True)`,
    fixedCode: `app = FastAPI(debug=os.getenv("ENV") == "development")`,
    aiExplanation:
      "Gate debug mode behind an environment check so tracebacks never reach clients in production.",
  },
  {
    id: "SENT-1011",
    title: "Outdated dependency with known CVE",
    file: "requirements.txt",
    line: 9,
    severity: "low",
    cwe: "CWE-1104",
    detectedBy: "Sentinel Core",
    status: "ignored",
    description:
      "python-jose 3.3.0 has a known algorithm confusion vulnerability (CVE-2024-33663).",
    vulnerableCode: `python-jose==3.3.0`,
    fixedCode: `python-jose==3.4.0`,
    aiExplanation:
      "Bump to 3.4.0 or later, which patches the algorithm confusion issue in the JWT verification path.",
  },
];

export const severityWeight: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  info: 0,
};

export function buildScoreCards(params: {
  securityScore: number;
  vulnerabilities: Vulnerability[];
  filesScanned: number;
  previousScore?: number;
}) {
  const { securityScore, vulnerabilities, filesScanned, previousScore } = params;
  const open = vulnerabilities.filter((v) => v.status === "open");
  const critical = open.filter((v) => v.severity === "critical").length;
  const high = open.filter((v) => v.severity === "high").length;
  const medium = open.filter((v) => v.severity === "medium").length;
  const delta =
    typeof previousScore === "number" ? securityScore - previousScore : undefined;

  return [
    {
      label: "Security Score",
      value: securityScore,
      suffix: "/100",
      trend: delta === undefined ? "—" : delta >= 0 ? `+${delta}` : `${delta}`,
      description:
        delta === undefined ? "First scan for this repo" : "Compared to last scan",
      accent: "cyan" as const,
    },
    {
      label: "Open Vulnerabilities",
      value: open.length,
      suffix: "",
      trend: open.length === 0 ? "clean" : `${critical} critical`,
      description: `${critical} critical, ${high} high, ${medium} medium`,
      accent: "rose" as const,
    },
    {
      label: "AI Fixes Available",
      value: vulnerabilities.filter((v) => v.fixedCode).length,
      suffix: "",
      trend: "ready",
      description: "Ready to apply in one click",
      accent: "blue" as const,
    },
    {
      label: "Files Scanned",
      value: filesScanned,
      suffix: "",
      trend: "100%",
      description: "Across your repository",
      accent: "emerald" as const,
    },
  ];
}

export const scoreCards = [
  {
    label: "Security Score",
    value: 74,
    suffix: "/100",
    trend: "+6",
    description: "Up from 68 last scan",
    accent: "cyan" as const,
  },
  {
    label: "Open Vulnerabilities",
    value: 6,
    suffix: "",
    trend: "-3",
    description: "2 critical, 2 high, 2 medium",
    accent: "rose" as const,
  },
  {
    label: "AI Fixes Available",
    value: 8,
    suffix: "",
    trend: "new",
    description: "Ready to apply in one click",
    accent: "blue" as const,
  },
  {
    label: "Files Scanned",
    value: 312,
    suffix: "",
    trend: "100%",
    description: "Across 4 languages",
    accent: "emerald" as const,
  },
];

export const reports = [
  {
    id: "RPT-2026-0710",
    repo: "sentinel-ai/api-gateway",
    date: "Jul 10, 2026",
    score: 74,
    critical: 2,
    high: 2,
    medium: 2,
    low: 2,
    status: "completed" as const,
  },
  {
    id: "RPT-2026-0703",
    repo: "sentinel-ai/api-gateway",
    date: "Jul 3, 2026",
    score: 68,
    critical: 3,
    high: 3,
    medium: 3,
    low: 1,
    status: "completed" as const,
  },
  {
    id: "RPT-2026-0626",
    repo: "sentinel-ai/worker-service",
    date: "Jun 26, 2026",
    score: 81,
    critical: 0,
    high: 1,
    medium: 4,
    low: 3,
    status: "completed" as const,
  },
  {
    id: "RPT-2026-0619",
    repo: "sentinel-ai/web-dashboard",
    date: "Jun 19, 2026",
    score: 59,
    critical: 4,
    high: 5,
    medium: 2,
    low: 0,
    status: "completed" as const,
  },
  {
    id: "RPT-2026-0612",
    repo: "sentinel-ai/api-gateway",
    date: "Jun 12, 2026",
    score: 62,
    critical: 3,
    high: 4,
    medium: 3,
    low: 2,
    status: "completed" as const,
  },
];

export const scanLogLines = [
  "$ sentinel scan github.com/akshay/api-gateway",
  "→ cloning repository...",
  "→ resolved 312 files across 4 languages",
  "→ running static analysis (bandit, semgrep)...",
  "→ analyzing dependency graph...",
  "✗ critical: hardcoded credentials in database.py:14",
  "✗ critical: SQL injection in users.py:58",
  "✗ high: missing auth guard in admin.py:22",
  "→ generating AI-powered fixes...",
  "✓ scan complete — score 74/100",
];
