"use client";

import { Wand2, FileCode2, TriangleAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AiProse } from "@/components/ai-prose";
import type { Issue } from "@/lib/types";

const severityBadge: Record<string, "critical" | "high" | "medium" | "low" | "outline"> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

export function AiFixPanel({ issue }: { issue: Issue | null }) {
  if (!issue) {
    return (
      <Card className="p-6 text-sm text-muted-foreground text-center">
        Select an issue from the table to see Sentinel's AI explanation and fix.
      </Card>
    );
  }

  const sevKey = issue.severity?.toLowerCase();

  return (
    <Card className="glow-cyan sticky top-24">
      <CardHeader className="border-b border-white/[0.07] flex-row items-center gap-2.5 space-y-0 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20">
          <Wand2 className="h-4 w-4 text-cyan-300" />
        </div>
        <div>
          <CardTitle className="text-sm">AI Fix Suggestion</CardTitle>
          <p className="text-xs text-muted-foreground font-mono mt-0.5 flex items-center gap-1.5">
            <FileCode2 className="h-3 w-3" />
            {issue.file}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        <div className="flex items-center gap-2">
          {sevKey && severityBadge[sevKey] ? (
            <Badge variant={severityBadge[sevKey]}>{sevKey}</Badge>
          ) : (
            <Badge variant="outline">unknown severity</Badge>
          )}
          <span className="text-sm font-medium text-foreground/90">{issue.issue}</span>
        </div>

        {issue.risk && (
          <div className="rounded-lg border border-severity-critical/15 bg-severity-critical/[0.04] p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-severity-critical/80 mb-1.5">
              <TriangleAlert className="h-3 w-3" />
              Risk
            </div>
            <p className="text-[13px] leading-relaxed text-foreground/70">{issue.risk}</p>
          </div>
        )}

        {issue.fix ? (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-severity-low/80 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-severity-low" />
              Sentinel's fix
            </div>
            <AiProse text={issue.fix} />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            This issue has no "fix" field in the backend response.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
