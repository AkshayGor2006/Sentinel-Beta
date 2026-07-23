"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { extractPatchForIssue } from "@/lib/patch-extract";
import type { Issue } from "@/lib/types";

interface DiffLine {
  type: "add" | "remove" | "hunk" | "meta" | "context";
  text: string;
}

function parseDiff(text: string): DiffLine[] {
  return text.split("\n").map((line): DiffLine => {
    if (line.startsWith("diff --git") || line.startsWith("+++") || line.startsWith("---")) {
      return { type: "meta", text: line };
    }
    if (line.startsWith("@@")) return { type: "hunk", text: line };
    if (/^\+[^+]/.test(line) || line === "+") return { type: "add", text: line };
    if (/^-[^-]/.test(line) || line === "-") return { type: "remove", text: line };
    return { type: "context", text: line };
  });
}

const lineStyles: Record<DiffLine["type"], string> = {
  add: "bg-severity-low/[0.08] text-severity-low border-l-2 border-severity-low/50",
  remove: "bg-severity-critical/[0.08] text-severity-critical border-l-2 border-severity-critical/50",
  hunk: "text-cyan-300/70 bg-cyan-400/[0.04]",
  meta: "text-foreground/40",
  context: "text-foreground/55",
};

export function DiffView({
  issue,
  index,
  patches,
}: {
  issue: Issue;
  index: number;
  patches: unknown;
}) {
  const extracted = React.useMemo(() => extractPatchForIssue(patches, index), [patches, index]);
  const diffLines = extracted.isDiff && extracted.text ? parseDiff(extracted.text) : [];

  if (extracted.isDiff && diffLines.length > 0) {
    return (
      <pre className="font-mono text-[12px] leading-6 max-h-[50vh] overflow-auto">
        {diffLines.map((line, i) => (
          <div key={i} className={`px-3 whitespace-pre-wrap ${lineStyles[line.type]}`}>
            {line.text || " "}
          </div>
        ))}
      </pre>
    );
  }

  if (extracted.text) {
    return (
      <div className="max-h-[50vh] overflow-auto">
        <div className="mb-3 flex items-start gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/[0.05] px-3.5 py-2.5 text-xs text-foreground/60">
          <Info className="h-3.5 w-3.5 text-cyan-300 shrink-0 mt-0.5" />
          {extracted.isRawObject
            ? "The backend's patch for this issue isn't a plain diff string — showing the raw data returned instead of guessing at a diff format."
            : "This patch doesn't look like a unified diff (no +/- lines or @@ hunks) — showing it as returned."}
        </div>
        <pre className="font-mono text-[11.5px] leading-5 text-foreground/65 whitespace-pre-wrap">
          {extracted.text}
        </pre>
      </div>
    );
  }

  return (
    <div className="py-8 text-center">
      <p className="text-sm text-foreground/60">No patch available for this issue.</p>
      <p className="mt-1.5 text-xs text-foreground/35 max-w-sm mx-auto">
        The backend's <code className="text-foreground/50">patches</code> field is empty at index{" "}
        {index}, or patch_agent didn't generate a fix for this specific finding.
      </p>
    </div>
  );
}
