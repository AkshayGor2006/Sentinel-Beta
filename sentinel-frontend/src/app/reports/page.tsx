"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FolderGit2, ScanSearch, ShieldAlert, TriangleAlert, Info } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { MetricCards, type MetricCard } from "@/components/metric-cards";
import { getToken, getDashboard, ApiError } from "@/lib/api";
import type { DashboardResponse } from "@/lib/types";

export default function ReportsPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = React.useState<DashboardResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!getToken()) {
      router.push("/login");
      return;
    }
    getDashboard()
      .then(setDashboard)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load dashboard."));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cards: MetricCard[] | null = dashboard
    ? [
        { label: "Repositories", value: dashboard.total_repositories, icon: FolderGit2, accent: "cyan" },
        { label: "Scans Run", value: dashboard.total_scans, icon: ScanSearch, accent: "blue" },
        { label: "Total Vulnerabilities", value: dashboard.total_vulnerabilities, icon: ShieldAlert, accent: "rose" },
      ]
    : null;

  return (
    <DashboardShell active="reports">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-foreground/50">Aggregate totals from GET /dashboard.</p>
      </motion.div>

      <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] px-4 py-3 text-xs text-foreground/60">
        <Info className="h-4 w-4 text-cyan-300 shrink-0 mt-0.5" />
        <span>
          Your backend doesn't currently expose a per-scan report history endpoint —{" "}
          <code className="text-foreground/80">GET /dashboard</code> only returns aggregate totals and
          the last 5 repository URIs. This page shows exactly that, rather than fabricating individual
          report rows with dates/scores that don't exist yet.
        </span>
      </div>

      {error ? (
        <Card className="mt-6 p-4 flex items-start gap-2.5 border-severity-critical/25 bg-severity-critical/[0.04]">
          <TriangleAlert className="h-4 w-4 text-severity-critical shrink-0 mt-0.5" />
          <p className="text-sm text-severity-critical">{error}</p>
        </Card>
      ) : cards ? (
        <div className="mt-6">
          <MetricCards cards={cards} />
        </div>
      ) : (
        <div className="mt-6 h-24 rounded-xl border border-white/[0.07] animate-pulse bg-white/[0.02]" />
      )}

      {dashboard && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6"
        >
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-foreground/60" />
            Recently scanned repositories
          </h2>
          {dashboard.recent_repositories.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              recent_repositories is empty — no repositories have been scanned yet.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {dashboard.recent_repositories.map((uri, i) => (
                <Card key={i} className="px-4 py-3 text-sm font-mono text-foreground/70 truncate">
                  {uri}
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </DashboardShell>
  );
}
