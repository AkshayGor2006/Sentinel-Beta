"use client";

import * as React from "react";
import { Wrench, Clock, FileCode2, TriangleAlert, Copy, Check, GitBranch, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiffView } from "@/components/diff-view";
import { extractPatchForIssue } from "@/lib/patch-extract";
import { oneSentence } from "@/lib/text";
import { fixMinutesFor } from "@/lib/fix-estimate";
import type { Issue } from "@/lib/types";

const severityBadge: Record<string, "critical" | "high" | "medium" | "low" | "outline"> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

export type FixPanelMode = "fix" | "preview";

/**
 * This is the single docked panel for both the fix summary and the Auto Fix
 * Preview diff — `mode` is controlled by the dashboard page so that
 * clicking "Auto Fix Preview" anywhere (Priority Fixes cards or this panel
 * itself) reuses this same panel instead of opening a second floating
 * popup. There is exactly one preview surface on screen at a time.
 */
export function DeveloperFixPanel({
  issue,
  index,
  patches,
  mode,
  onModeChange,
}: {
  issue: Issue | null;
  index: number | null;
  patches: unknown;
  mode: FixPanelMode;
  onModeChange: (mode: FixPanelMode) => void;
}) {
  const [copied, setCopied] = React.useState(false);
  const [diffCopied, setDiffCopied] = React.useState(false);

  if (!issue || index === null) {
    return (
      <Card className="p-6 text-sm text-muted-foreground text-center">
        Select an issue to see its Developer Fix.
      </Card>
    );
  }

  const sevKey = issue.severity?.toLowerCase();
  const risk = oneSentence(issue.risk);
  const fix = oneSentence(issue.fix);
  const minutes = fixMinutesFor(issue);

  function copyFix() {
    navigator.clipboard?.writeText(issue?.fix ?? "").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function copyDiff() {
    const extracted = extractPatchForIssue(patches, index);
    navigator.clipboard?.writeText(extracted.text ?? "").catch(() => {});
    setDiffCopied(true);
    setTimeout(() => setDiffCopied(false), 1500);
  }

  return (
    <Card className="glow-cyan sticky top-24">
      <CardHeader className="border-b border-white/[0.07] flex-row items-center gap-2.5 space-y-0 pb-4">
        {mode === "preview" ? (
          <button
            onClick={() => onModeChange("fix")}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08] text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Back to fix summary"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20">
            <Wrench className="h-4 w-4 text-cyan-300" />
          </div>
        )}
        <div className="min-w-0">
          <CardTitle className="text-sm">
            {mode === "preview" ? "Auto Fix Preview" : "Developer Fix"}
          </CardTitle>
          {mode === "preview" && (
            <p className="text-xs text-muted-foreground font-mono whitespace-normal break-all leading-relaxed">{issue.file}</p>
          )}
        </div>
      </CardHeader>

      {mode === "preview" ? (
        <div className="p-5 space-y-3">
          <DiffView issue={issue} index={index} patches={patches} />
          <Button variant="secondary" size="sm" className="w-full gap-1.5" onClick={copyDiff}>
            {diffCopied ? (
              <>
                <Check className="h-3.5 w-3.5 text-severity-low" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Diff
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="p-5 space-y-3.5 text-sm">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-1">
              Problem
            </div>
            <div className="flex min-w-0 items-center gap-2">
              {sevKey && severityBadge[sevKey] ? (
                <Badge variant={severityBadge[sevKey]}>{sevKey}</Badge>
              ) : (
                <Badge variant="outline">unknown</Badge>
              )}
              <span className="min-w-0 font-medium text-foreground/90 break-words">{issue.issue}</span>
            </div>
            <div className="mt-1.5 flex min-w-0 items-start gap-1.5 text-xs text-muted-foreground font-mono leading-relaxed">
              <FileCode2 className="h-3 w-3 shrink-0 mt-0.5" />
              <span className="min-w-0 break-all whitespace-normal">{issue.file}</span>
            </div>
          </div>

          {risk && (
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-severity-critical/70 mb-1 flex items-center gap-1">
                <TriangleAlert className="h-3 w-3" />
                Risk
              </div>
              <p className="text-foreground/70 leading-relaxed">{risk}</p>
            </div>
          )}

          {fix && (
            <div>
              <div className="text-[11px] font-medium uppercase tracking-wide text-severity-low/70 mb-1">
                Fix
              </div>
              <p className="text-foreground/70 leading-relaxed">{fix}</p>
            </div>
          )}

          <div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Estimated Time
            </div>
            <p className="text-foreground/70 font-mono">~{minutes} minutes</p>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 gap-1.5"
              disabled={!issue.fix}
              onClick={copyFix}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-severity-low" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Fix
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 gap-1.5"
              onClick={() => onModeChange("preview")}
            >
              <GitBranch className="h-3.5 w-3.5" />
              Auto Fix Preview
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

