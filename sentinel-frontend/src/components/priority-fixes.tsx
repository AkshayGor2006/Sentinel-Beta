"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Clock, Copy, Check, FileCode2, ListOrdered } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AutoFixPreviewButton } from "@/components/auto-fix-preview";
import { oneSentence } from "@/lib/text";
import { fixMinutesFor } from "@/lib/fix-estimate";
import type { Issue } from "@/lib/types";

const SEVERITY_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const severityBadge: Record<string, "critical" | "high" | "medium" | "low" | "outline"> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

function rankOf(issue: Issue) {
  const key = issue.severity?.toLowerCase();
  return key && key in SEVERITY_RANK ? SEVERITY_RANK[key] : 4;
}

export function PriorityFixes({
  issues,
  patches,
  onSelect,
  onPreview,
}: {
  issues: Issue[];
  patches: unknown;
  onSelect?: (issue: Issue, index: number) => void;
  onPreview?: (issue: Issue, index: number) => void;
}) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const top5 = React.useMemo(() => {
    return issues
      .map((issue, index) => ({ issue, index }))
      .sort((a, b) => rankOf(a.issue) - rankOf(b.issue))
      .slice(0, 5);
  }, [issues]);

  function copyFix(issue: Issue, index: number) {
    navigator.clipboard?.writeText(issue.fix ?? "").catch(() => {});
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex((v) => (v === index ? null : v)), 1500);
  }

  if (issues.length === 0) {
    return (
      <Card className="p-5 text-sm text-muted-foreground text-center">
        No issues in this scan — nothing to prioritize.
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <ListOrdered className="h-4 w-4 text-cyan-300" />
        <h2 className="text-lg font-semibold">Priority Fixes</h2>
        <span className="text-xs text-muted-foreground">
          top {top5.length} of {issues.length}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {top5.map(({ issue, index }, rank) => {
          const sevKey = issue.severity?.toLowerCase();
          const risk = oneSentence(issue.risk);
          const fix = oneSentence(issue.fix);
          const minutes = fixMinutesFor(issue);
          const isCopied = copiedIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: rank * 0.05 }}
            >
              <Card
                className="glass-hover p-4 h-full flex flex-col gap-2.5 cursor-pointer"
                onClick={() => onSelect?.(issue, index)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-white/[0.06] text-[10px] font-mono text-foreground/50">
                      P{rank + 1}
                    </span>
                    {sevKey && severityBadge[sevKey] ? (
                      <Badge variant={severityBadge[sevKey]}>{sevKey}</Badge>
                    ) : (
                      <Badge variant="outline">unknown</Badge>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                    <Clock className="h-3 w-3" />
                    ~{minutes}m
                  </span>
                </div>

                <div>
                  <div className="text-sm font-medium text-foreground/90 leading-snug">{issue.issue}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground font-mono truncate">
                    <FileCode2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">{issue.file}</span>
                  </div>
                </div>

                {risk && (
                  <p className="text-xs text-foreground/55 leading-relaxed">
                    <span className="text-severity-critical/70 font-medium">Risk: </span>
                    {risk}
                  </p>
                )}

                {fix && (
                  <p className="text-xs text-foreground/55 leading-relaxed">
                    <span className="text-severity-low/70 font-medium">Fix: </span>
                    {fix}
                  </p>
                )}

                <div className="mt-auto pt-1 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 flex-1"
                    disabled={!issue.fix}
                    onClick={(e) => {
                      e.stopPropagation();
                      copyFix(issue, index);
                    }}
                  >
                    {isCopied ? (
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
                  <AutoFixPreviewButton
                    issue={issue}
                    index={index}
                    patches={patches}
                    onPreview={onPreview}
                    triggerSize="sm"
                    className="flex-1"
                  />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
