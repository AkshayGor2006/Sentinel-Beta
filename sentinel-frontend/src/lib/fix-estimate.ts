import type { Issue } from "@/lib/types";

/**
 * Your backend doesn't return a numeric score or a per-issue fix-time
 * estimate anywhere confirmed — these are computed client-side from real
 * severity data (severity_count / issue.severity) using a fixed weighting.
 * Single source of truth so Publish Readiness, Priority Fixes, and
 * Developer Fix all show numbers that agree with each other.
 */

export const SCORE_WEIGHTS = { critical: 25, high: 12, medium: 5, low: 2 };
export const FIX_MINUTES = { critical: 45, high: 25, medium: 12, low: 5 };

export function computeScore(counts: { critical: number; high: number; medium: number; low: number }) {
  const penalty =
    counts.critical * SCORE_WEIGHTS.critical +
    counts.high * SCORE_WEIGHTS.high +
    counts.medium * SCORE_WEIGHTS.medium +
    counts.low * SCORE_WEIGHTS.low;
  return Math.max(0, 100 - penalty);
}

export function computeFixMinutes(counts: { critical: number; high: number; medium: number; low: number }) {
  return (
    counts.critical * FIX_MINUTES.critical +
    counts.high * FIX_MINUTES.high +
    counts.medium * FIX_MINUTES.medium +
    counts.low * FIX_MINUTES.low
  );
}

export function formatMinutes(total: number) {
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/** Per-issue estimate based on that issue's own severity. */
export function fixMinutesFor(issue: Issue): number {
  const key = issue.severity?.toLowerCase() as keyof typeof FIX_MINUTES | undefined;
  return key && key in FIX_MINUTES ? FIX_MINUTES[key] : FIX_MINUTES.medium;
}
