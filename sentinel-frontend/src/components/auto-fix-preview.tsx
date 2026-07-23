"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { GitBranch, X, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DiffView } from "@/components/diff-view";
import type { Issue } from "@/lib/types";

/**
 * If `onPreview` is provided (the dashboard page always provides it, routing
 * into the Developer Fix drawer), this never opens its own popup — it just
 * calls back up so the caller can show the diff in the existing drawer.
 * That's the normal path: exactly one preview surface on screen, ever.
 *
 * The self-contained portal popup below only exists as a fallback for using
 * this button somewhere with no docked panel to route into. It's rendered
 * via createPortal(..., document.body) specifically so it can never end up
 * clipped or under a sibling card: any framer-motion ancestor that sets an
 * inline `transform` creates a new containing block for `position: fixed`
 * children, which is exactly what caused the clipping before — a portal to
 * document.body escapes that entirely, regardless of z-index.
 */
export function AutoFixPreviewButton({
  issue,
  index,
  patches,
  onPreview,
  triggerVariant = "secondary",
  triggerSize = "sm",
  className,
}: {
  issue: Issue;
  index: number;
  patches: unknown;
  onPreview?: (issue: Issue, index: number) => void;
  triggerVariant?: "secondary" | "outline" | "ghost";
  triggerSize?: "sm" | "default";
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (onPreview) {
      onPreview(issue, index);
      return;
    }
    setOpen(true);
  }

  return (
    <>
      <Button
        variant={triggerVariant}
        size={triggerSize}
        className={className ? `gap-1.5 ${className}` : "gap-1.5"}
        onClick={handleClick}
      >
        <GitBranch className="h-3.5 w-3.5" />
        Auto Fix Preview
      </Button>

      {!onPreview &&
        mounted &&
        open &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="fixed left-1/2 top-1/2 z-[101] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-[#0B101B] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
                <div className="flex items-center gap-2 min-w-0">
                  <FileCode2 className="h-4 w-4 text-cyan-300 shrink-0" />
                  <span className="text-sm font-medium text-foreground/85 truncate">{issue.file}</span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-foreground/40 hover:text-foreground hover:bg-white/[0.06]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5">
                <DiffView issue={issue} index={index} patches={patches} />
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
