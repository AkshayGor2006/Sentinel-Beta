"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ShieldX, TriangleAlert, Clock, Rocket, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { computeScore, computeFixMinutes, formatMinutes } from "@/lib/fix-estimate";
import type { AgentResult } from "@/lib/types";

/**
 * Your backend doesn't return a numeric "security score" or an "estimated
 * fix time" anywhere I've seen — only real severity counts
 * (agent_result.severity_count). So "score" and "fix time" here are
 * computed client-side from those real counts using a fixed weighting
 * (src/lib/fix-estimate.ts — single source of truth, also used by Priority
 * Fixes and Developer Fix so all three agree). Labeled as such in the UI
 * rather than presented as if the API returned them. Safe/Not Safe and
 * Publish Readiness are deterministic from the same real counts: critical
 * > 0 or high > 0 ⇒ not safe / not ready.
 */

export function PublishReadinessSummary({ agentResult }: { agentResult: AgentResult }) {
  const counts = {
    critical: agentResult.severity_count?.CRITICAL ?? 0,
    high: agentResult.severity_count?.HIGH ?? 0,
    medium: agentResult.severity_count?.MEDIUM ?? 0,
    low: agentResult.severity_count?.LOW ?? 0,
  };

  const isSafe = counts.critical === 0 && counts.high === 0;
  const score = computeScore(counts);
  const fixMinutes = computeFixMinutes(counts);
  const totalIssues = agentResult.total_issues ?? counts.critical + counts.high + counts.medium + counts.low;

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card
        className={cn(
          "p-6 border-2",
          isSafe ? "border-severity-low/30 glow-cyan" : "border-severity-critical/35"
        )}
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Verdict */}
          <div className="flex items-center gap-4 lg:pr-6 lg:border-r lg:border-white/[0.08]">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border",
                isSafe
                  ? "bg-severity-low/10 border-severity-low/30 text-severity-low"
                  : "bg-severity-critical/10 border-severity-critical/30 text-severity-critical"
              )}
            >
              {isSafe ? <ShieldCheck className="h-7 w-7" /> : <ShieldX className="h-7 w-7" />}
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Repository status
              </div>
              <div
                className={cn(
                  "text-lg font-semibold tracking-tight",
                  isSafe ? "text-severity-low" : "text-severity-critical"
                )}
              >
                {isSafe ? "Safe to Deploy" : "Not Safe to Deploy"}
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div>
              <div className="text-xs text-muted-foreground">Security Score</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span
                  className={cn(
                    "text-2xl font-bold font-mono",
                    score >= 75 ? "text-severity-low" : score >= 50 ? "text-severity-medium" : "text-severity-critical"
                  )}
                >
                  {score}
                </span>
                <span className="text-xs text-muted-foreground">/100</span>
              </div>
              <div className="mt-0.5 text-[10px] text-foreground/30">computed, not from API</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Severity Breakdown</div>
              <div className="mt-1 flex items-center gap-2.5 font-mono text-sm">
                <span className="text-severity-critical">{counts.critical}C</span>
                <span className="text-severity-high">{counts.high}H</span>
                <span className="text-severity-medium">{counts.medium}M</span>
                <span className="text-severity-low">{counts.low}L</span>
              </div>
              <div className="mt-0.5 text-[10px] text-foreground/30">{totalIssues} total issues</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Est. Fix Time
              </div>
              <div className="mt-1 text-2xl font-bold font-mono text-foreground">
                {formatMinutes(fixMinutes)}
              </div>
              <div className="mt-0.5 text-[10px] text-foreground/30">computed, not from API</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Rocket className="h-3 w-3" />
                Publish Readiness
              </div>
              <div
                className={cn(
                  "mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-sm font-bold",
                  isSafe
                    ? "bg-severity-low/10 text-severity-low border border-severity-low/25"
                    : "bg-severity-critical/10 text-severity-critical border border-severity-critical/25"
                )}
              >
                {isSafe ? "YES" : "NO"}
              </div>
            </div>
          </div>
        </div>

        {!isSafe && (
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-start gap-2 text-xs text-foreground/40">
            <TriangleAlert className="h-3.5 w-3.5 shrink-0 mt-0.5 text-severity-critical/60" />
            Blocked by {counts.critical > 0 && `${counts.critical} critical`}
            {counts.critical > 0 && counts.high > 0 && " and "}
            {counts.high > 0 && `${counts.high} high`} severity finding{totalIssues === 1 ? "" : "s"} —
            resolve these before publishing.
          </div>
        )}
      </Card>

      <div className="mt-2 flex items-start gap-1.5 text-[11px] text-foreground/25">
        <Info className="h-3 w-3 shrink-0 mt-0.5" />
        Score and fix time are estimates computed from real severity counts (critical/high/medium/low),
        not values returned by your backend. Status and Publish Readiness are deterministic: any
        critical or high severity finding marks the repo not safe / not ready.
      </div>
    </motion.div>
  );
}
