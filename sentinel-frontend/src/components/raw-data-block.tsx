"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Renders any JSON value your backend returns without assuming field names.
 * Used for the parts of the scan response (security_score, executive_report,
 * ai_reasoning, patches, etc.) whose exact shape wasn't visible in the API
 * samples I had — so the data still shows up, nothing gets fabricated or
 * silently dropped.
 */
export function RawDataBlock({ label, value }: { label: string; value: unknown }) {
  const [open, setOpen] = React.useState(false);

  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === "object" && Object.keys(value as object).length === 0) ||
    (Array.isArray(value) && value.length === 0);

  if (isEmpty) return null;

  return (
    <div className="rounded-lg border border-white/[0.07] overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-medium text-foreground/70 hover:bg-white/[0.03] transition-colors"
      >
        {label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <pre className="max-h-64 overflow-auto border-t border-white/[0.07] bg-black/30 px-4 py-3 text-[11px] leading-5 text-foreground/60 font-mono whitespace-pre-wrap">
          {JSON.stringify(value, null, 2)}
        </pre>
      )}
    </div>
  );
}
