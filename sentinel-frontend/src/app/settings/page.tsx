"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Github,
  ExternalLink,
  FolderGit2,
  LogOut,
  Trash2,
  ArrowLeft,
  TriangleAlert,
  Link2,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  getToken,
  clearToken,
  decodeUsernameFromToken,
  getGithubStatus,
  getGithubRepos,
  githubLoginUrl,
  ApiError,
} from "@/lib/api";
import type { GithubStatus } from "@/lib/types";

export default function SettingsPage() {
  const router = useRouter();

  const [username, setUsername] = React.useState<string | null>(null);

  const [githubStatus, setGithubStatus] = React.useState<GithubStatus | null>(null);
  const [githubError, setGithubError] = React.useState<string | null>(null);

  const [repoCount, setRepoCount] = React.useState<number | null>(null);
  const [repoCountError, setRepoCountError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setUsername(decodeUsernameFromToken(token));

    getGithubStatus()
      .then((status) => {
        setGithubStatus(status);
        if (status.connected) {
          getGithubRepos()
            .then((repos) => setRepoCount(repos.length))
            .catch((err) =>
              setRepoCountError(err instanceof ApiError ? err.message : "Failed to load repo count.")
            );
        }
      })
      .catch((err) => setGithubError(err instanceof ApiError ? err.message : "Failed to load GitHub status."));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleLogout() {
    clearToken();
    router.push("/login");
  }

  function handleClearLocalSession() {
    // Distinct from Logout: wipes all local storage for this origin (not
    // just the token), useful if local state ever gets stuck/corrupted.
    // Currently the token is the only thing stored, so this behaves the
    // same as Logout today — kept as a separate action since the two are
    // conceptually different and the app may store more locally later.
    window.localStorage.clear();
    router.push("/login");
  }

  return (
    <DashboardShell active="settings">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-foreground/50">Account, GitHub connection, and session.</p>
      </motion.div>

      <div className="mt-6 flex flex-col gap-5 max-w-2xl">
        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
          <Card>
            <CardHeader className="border-b border-white/[0.07] pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <UserIcon className="h-4 w-4 text-cyan-300" />
                Account
              </CardTitle>
            </CardHeader>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  {/* No Sentinel-side avatar field exists on any endpoint I've
                      seen — falling back to initials, same convention already
                      used in the sidebar, not a fabricated image. */}
                  <AvatarFallback className="text-sm">
                    {(username ?? "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-foreground/90">{username ?? "—"}</div>
                  <div className="text-xs text-muted-foreground">Sentinel account</div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 pt-1">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </div>
                  {/* TODO: no endpoint returns the account email (auth/signup
                      accepts one but never returns it back, and there's no
                      GET /me or similar). Wire this up once that exists. */}
                  <p className="text-sm text-foreground/35 italic">Not available (TODO: no backend field)</p>
                </div>
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Joined
                  </div>
                  {/* TODO: no created_at/joined field is returned anywhere. */}
                  <p className="text-sm text-foreground/35 italic">Not available (TODO: no backend field)</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* GitHub */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card>
            <CardHeader className="border-b border-white/[0.07] pb-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Github className="h-4 w-4 text-cyan-300" />
                GitHub
              </CardTitle>
            </CardHeader>
            <div className="p-5">
              {githubError && (
                <div className="flex items-start gap-2.5 rounded-lg border border-severity-critical/25 bg-severity-critical/[0.06] px-3.5 py-3 text-sm text-severity-critical">
                  <TriangleAlert className="h-4 w-4 shrink-0 mt-0.5" />
                  {githubError}
                </div>
              )}

              {!githubError && githubStatus?.connected && (
                <div className="space-y-3">
                  <Badge variant="success">Connected to GitHub</Badge>

                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {githubStatus.avatar && <AvatarImage src={githubStatus.avatar} alt={githubStatus.github ?? ""} />}
                      <AvatarFallback className="text-xs">
                        {(githubStatus.github ?? "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-foreground/90">{githubStatus.github}</div>
                      {/* Derived from the real github username, not a
                          separately-returned field — GitHub profile URLs are
                          always github.com/<username>, so this isn't a guess. */}
                      <a
                        href={`https://github.com/${githubStatus.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
                      >
                        View profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-sm text-foreground/60">
                    <FolderGit2 className="h-4 w-4 text-foreground/40" />
                    {repoCountError ? (
                      <span className="text-xs text-severity-critical">{repoCountError}</span>
                    ) : repoCount === null ? (
                      <span className="text-xs text-muted-foreground">Loading repository count...</span>
                    ) : (
                      <span>
                        <span className="font-mono font-medium text-foreground/85">{repoCount}</span> repositories
                        accessible
                      </span>
                    )}
                  </div>
                </div>
              )}

              {!githubError && githubStatus && !githubStatus.connected && (
                <div>
                  <p className="text-sm text-foreground/50 mb-3">GitHub isn't connected to this account yet.</p>
                  <Button className="gap-2" onClick={() => (window.location.href = githubLoginUrl())}>
                    <Link2 className="h-4 w-4" />
                    Connect GitHub
                  </Button>
                </div>
              )}

              {!githubError && !githubStatus && (
                <div className="h-16 rounded-lg border border-white/[0.07] animate-pulse bg-white/[0.02]" />
              )}
            </div>
          </Card>
        </motion.div>

        {/* Session */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card>
            <CardHeader className="border-b border-white/[0.07] pb-4">
              <CardTitle className="text-sm">Session</CardTitle>
            </CardHeader>
            <div className="p-5 flex flex-col sm:flex-row gap-2.5">
              <Button variant="secondary" className="gap-2 flex-1" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <Button variant="outline" className="gap-2 flex-1" onClick={handleClearLocalSession}>
                <Trash2 className="h-4 w-4" />
                Clear local session
              </Button>
              <Button variant="ghost" className="gap-2 flex-1" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
