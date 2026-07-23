"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderGit2,
  ScanSearch,
  ShieldAlert,
  TriangleAlert,
  Github,
  Link2,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  X,
  ShieldQuestion,
  Bot,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MetricCards, type MetricCard } from "@/components/metric-cards";
import { PublishReadinessSummary } from "@/components/publish-readiness-summary";
import { PriorityFixes } from "@/components/priority-fixes";
import { VulnerabilityTable } from "@/components/vulnerability-table";
import { DeveloperFixPanel, type FixPanelMode } from "@/components/developer-fix-panel";
import { ScanningState } from "@/components/scanning-state";
import { ChatPanel } from "@/components/chat-panel";
import { AiProse } from "@/components/ai-prose";
import { AdvancedAnalysisPlaceholder } from "@/components/advanced-analysis-placeholder";
import {
  getToken,
  getDashboard,
  getGithubStatus,
  getGithubRepos,
  scanGithubRepo,
  analyzeRepo,
  githubLoginUrl,
  ApiError,
} from "@/lib/api";
import type { DashboardResponse, GithubStatus, GithubRepo, ScanResult, Issue } from "@/lib/types";

const DEFAULT_QUERY = "Find security issues";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // auth + dashboard metrics
  const [dashboard, setDashboard] = React.useState<DashboardResponse | null>(null);
  const [dashboardError, setDashboardError] = React.useState<string | null>(null);

  // github connection
  const [githubStatus, setGithubStatus] = React.useState<GithubStatus | null>(null);
  const [githubError, setGithubError] = React.useState<string | null>(null);
  const [repos, setRepos] = React.useState<GithubRepo[] | null>(null);
  const [reposError, setReposError] = React.useState<string | null>(null);
  const [githubBanner, setGithubBanner] = React.useState<{ kind: "success" | "error"; text: string } | null>(
    null
  );

  // direct URL scan
  const [repoUrl, setRepoUrl] = React.useState("");
  const [query, setQuery] = React.useState(DEFAULT_QUERY);

  // scan lifecycle
  const [scanning, setScanning] = React.useState<string | null>(null); // label while in-flight
  const [scanError, setScanError] = React.useState<string | null>(null);
  const [scanResult, setScanResult] = React.useState<ScanResult | null>(null);
  const [selected, setSelected] = React.useState<{ issue: Issue; index: number } | null>(null);
  const [fixPanelMode, setFixPanelMode] = React.useState<FixPanelMode>("fix");

  React.useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    getDashboard()
      .then(setDashboard)
      .catch((err) => setDashboardError(err instanceof ApiError ? err.message : "Failed to load dashboard."));

    refreshGithubStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Redirected back from GET /github/callback — read the outcome, show a
  // banner instead of the raw JSON the old flow used to return, then strip
  // the query params so a refresh doesn't re-show the banner.
  React.useEffect(() => {
    const connected = searchParams.get("github_connected");
    const error = searchParams.get("github_error");

    if (connected) {
      setGithubBanner({ kind: "success", text: "GitHub connected successfully." });
      refreshGithubStatus();
      router.replace("/dashboard");
    } else if (error) {
      setGithubBanner({ kind: "error", text: `GitHub connection failed: ${error.replace(/_/g, " ")}` });
      router.replace("/dashboard");
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  function refreshGithubStatus() {
    setGithubError(null);
    getGithubStatus()
      .then((status) => {
        setGithubStatus(status);
        if (status.connected) loadRepos();
      })
      .catch((err) => setGithubError(err instanceof ApiError ? err.message : "Failed to load GitHub status."));
  }

  function loadRepos() {
    setReposError(null);
    getGithubRepos()
      .then(setRepos)
      .catch((err) => setReposError(err instanceof ApiError ? err.message : "Failed to load repositories."));
  }

  async function handleGithubScan(repo: GithubRepo) {
    setScanError(null);
    setScanResult(null);
    setSelected(null);
    setFixPanelMode("fix");
    setScanning(`Scanning ${repo.full_name}...`);
    try {
      const data = await scanGithubRepo({ repo_name: repo.full_name, query });
      setScanResult(data.scan);
      const firstIssue = data.scan.agent_result?.issues?.[0];
      if (firstIssue) setSelected({ issue: firstIssue, index: 0 });
    } catch (err) {
      setScanError(err instanceof ApiError ? err.message : "Scan failed.");
    } finally {
      setScanning(null);
    }
  }

  async function handleUrlScan(e: React.FormEvent) {
    e.preventDefault();
    if (!repoUrl.trim()) return;
    setScanError(null);
    setScanResult(null);
    setSelected(null);
    setFixPanelMode("fix");
    setScanning(`Analyzing ${repoUrl}...`);
    try {
      const data = await analyzeRepo(repoUrl.trim(), query.trim() || DEFAULT_QUERY);
      setScanResult(data);
      const firstIssue = data.agent_result?.issues?.[0];
      if (firstIssue) setSelected({ issue: firstIssue, index: 0 });
    } catch (err) {
      setScanError(err instanceof ApiError ? err.message : "Scan failed.");
    } finally {
      setScanning(null);
    }
  }

  const dashboardCards: MetricCard[] | null = dashboard
    ? [
        { label: "Repositories", value: dashboard.total_repositories, icon: FolderGit2, accent: "cyan" },
        { label: "Scans Run", value: dashboard.total_scans, icon: ScanSearch, accent: "blue" },
        { label: "Total Vulnerabilities", value: dashboard.total_vulnerabilities, icon: ShieldAlert, accent: "rose" },
        {
          label: "Critical + High",
          value: dashboard.severity.critical + dashboard.severity.high,
          icon: TriangleAlert,
          accent: "amber",
          hint: `${dashboard.severity.critical} critical, ${dashboard.severity.high} high, ${dashboard.severity.medium} medium`,
        },
      ]
    : null;

  const scanCards: MetricCard[] | null = scanResult?.agent_result
    ? [
        {
          label: "Total Issues",
          value: scanResult.agent_result.total_issues ?? scanResult.agent_result.issues?.length ?? 0,
          icon: ShieldAlert,
          accent: "cyan",
        },
        {
          label: "Critical",
          value: scanResult.agent_result.severity_count?.CRITICAL ?? 0,
          icon: TriangleAlert,
          accent: "rose",
        },
        {
          label: "High",
          value: scanResult.agent_result.severity_count?.HIGH ?? 0,
          icon: TriangleAlert,
          accent: "amber",
        },
        {
          label: "Medium + Low",
          value:
            (scanResult.agent_result.severity_count?.MEDIUM ?? 0) +
            (scanResult.agent_result.severity_count?.LOW ?? 0),
          icon: ShieldAlert,
          accent: "blue",
        },
      ]
    : null;

  return (
    <DashboardShell active="dashboard">
      <div className="flex flex-col gap-8">
        {/* Dashboard metrics — GET /dashboard */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-foreground/50">Live totals from your Sentinel backend.</p>

          {dashboardError ? (
            <Card className="mt-4 p-4 flex items-start gap-2.5 border-severity-critical/25 bg-severity-critical/[0.04]">
              <TriangleAlert className="h-4 w-4 text-severity-critical shrink-0 mt-0.5" />
              <p className="text-sm text-severity-critical">{dashboardError}</p>
            </Card>
          ) : dashboardCards ? (
            <div className="mt-4">
              <MetricCards cards={dashboardCards} />
            </div>
          ) : (
            <div className="mt-4 h-24 rounded-xl border border-white/[0.07] animate-pulse bg-white/[0.02]" />
          )}
        </motion.div>

        <AnimatePresence>
          {githubBanner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className={`flex items-center justify-between gap-2 rounded-lg border px-4 py-3 text-sm ${
                  githubBanner.kind === "success"
                    ? "border-severity-low/25 bg-severity-low/[0.06] text-severity-low"
                    : "border-severity-critical/25 bg-severity-critical/[0.06] text-severity-critical"
                }`}
              >
                <span className="flex items-center gap-2">
                  {githubBanner.kind === "success" ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                  ) : (
                    <TriangleAlert className="h-4 w-4 shrink-0" />
                  )}
                  {githubBanner.text}
                </span>
                <button onClick={() => setGithubBanner(null)} className="opacity-60 hover:opacity-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GitHub connection — GET /github/status, GET /github/repos */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <Card className="p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <Github className="h-4.5 w-4.5 text-foreground/70" />
                <h2 className="text-sm font-semibold">GitHub</h2>
                {githubStatus?.connected && <Badge variant="success">connected</Badge>}
              </div>
              <button
                onClick={refreshGithubStatus}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </button>
            </div>

            {githubError && (
              <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-severity-critical/25 bg-severity-critical/[0.06] px-3.5 py-3 text-sm text-severity-critical">
                <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
                {githubError}
              </div>
            )}

            {!githubError && githubStatus && !githubStatus.connected && (
              <div className="mt-4">
                <Button className="gap-2" onClick={() => (window.location.href = githubLoginUrl())}>
                  <Link2 className="h-4 w-4" />
                  Connect GitHub
                </Button>
                <p className="mt-2.5 text-xs text-foreground/35">
                  Redirects to GitHub — you'll come back here automatically once you authorize.
                </p>
              </div>
            )}

            {!githubError && githubStatus?.connected && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Connected as <span className="text-foreground/80 font-medium">{githubStatus.github}</span>
                </p>
                {reposError && (
                  <div className="flex items-start gap-2.5 rounded-lg border border-severity-critical/25 bg-severity-critical/[0.06] px-3.5 py-3 text-sm text-severity-critical">
                    <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
                    {reposError}
                  </div>
                )}
                {repos && repos.length > 0 && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {repos.map((repo) => (
                      <div
                        key={repo.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3.5 py-2.5"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground/85 truncate">{repo.name}</div>
                          <div className="text-xs text-muted-foreground">{repo.language ?? "—"}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="shrink-0 gap-1.5"
                          disabled={!!scanning}
                          onClick={() => handleGithubScan(repo)}
                        >
                          <ScanSearch className="h-3.5 w-3.5" />
                          Scan
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {repos && repos.length === 0 && !reposError && (
                  <p className="text-xs text-muted-foreground">No repositories returned for this account.</p>
                )}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Direct URL scan — POST /analyze-repo (works today without GitHub OAuth) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <ScanSearch className="h-4.5 w-4.5 text-foreground/70" />
              <h2 className="text-sm font-semibold">Scan by URL</h2>
              <span className="text-xs text-muted-foreground">POST /analyze-repo</span>
            </div>
            <form onSubmit={handleUrlScan} className="flex flex-col sm:flex-row gap-3">
              <Input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="flex-1"
                disabled={!!scanning}
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Query"
                className="sm:w-56"
                disabled={!!scanning}
              />
              <Button type="submit" disabled={!!scanning || !repoUrl.trim()} className="gap-2 shrink-0">
                Scan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </Card>
        </motion.div>

        {scanError && (
          <div className="flex items-start gap-2.5 rounded-lg border border-severity-critical/25 bg-severity-critical/[0.06] px-4 py-3.5 text-sm text-severity-critical">
            <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
            {scanError}
          </div>
        )}

        {scanning && <ScanningState label={scanning} />}

        {scanResult && !scanning && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
            {/* First thing the user sees after a scan: is this repo safe to publish? */}
            {scanResult.agent_result?.severity_count ? (
              <PublishReadinessSummary agentResult={scanResult.agent_result} />
            ) : (
              <div className="flex items-start gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 text-sm text-foreground/50">
                <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5 text-foreground/30" />
                No safety verdict to show — this scan's <code className="text-foreground/70">agent_result</code>{" "}
                doesn't include severity counts (the backend selected{" "}
                <span className="font-mono text-foreground/70">
                  {scanResult.selected_agent?.agent ?? "a non-security agent"}
                </span>{" "}
                for this query — try a query like "Find security issues" to route to security_agent).
              </div>
            )}

            {/* "What should I fix first?" — directly below the publish readiness verdict */}
            {scanResult.agent_result?.issues && (
              <PriorityFixes
                issues={scanResult.agent_result.issues}
                patches={scanResult.patches}
                onSelect={(issue, index) => {
                  setSelected({ issue, index });
                  setFixPanelMode("fix");
                }}
                onPreview={(issue, index) => {
                  setSelected({ issue, index });
                  setFixPanelMode("preview");
                }}
              />
            )}

            {scanResult.selected_agent && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Bot className="h-3.5 w-3.5 text-cyan-300/70" />
                Handled by <span className="text-foreground/70 font-mono">{scanResult.selected_agent.agent}</span>
                {scanResult.selected_agent.reason && <span>— {scanResult.selected_agent.reason}</span>}
              </div>
            )}

            {scanCards && <MetricCards cards={scanCards} />}

            {scanResult.ai_summary && (
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldQuestion className="h-4 w-4 text-cyan-300" />
                  <h3 className="text-sm font-semibold">AI Summary</h3>
                </div>
                <AiProse text={scanResult.ai_summary} />
              </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Vulnerabilities</h2>
                  <span className="text-xs text-muted-foreground">
                    {scanResult.agent_result?.issues?.length ?? 0} findings
                  </span>
                </div>
                <VulnerabilityTable
                  issues={scanResult.agent_result?.issues ?? []}
                  selectedIndex={selected?.index}
                  onSelectIssue={(issue, index) => {
                    setSelected({ issue, index });
                    setFixPanelMode("fix");
                  }}
                />
              </div>
              <div>
                <DeveloperFixPanel
                  issue={selected?.issue ?? null}
                  index={selected?.index ?? null}
                  patches={scanResult.patches}
                  mode={fixPanelMode}
                  onModeChange={setFixPanelMode}
                />
              </div>
            </div>

            <AdvancedAnalysisPlaceholder />
          </motion.div>
        )}

        {/* Chat — POST /chat-with-repo */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <ChatPanel />
        </motion.div>
      </div>
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <React.Suspense fallback={null}>
      <DashboardContent />
    </React.Suspense>
  );
}
