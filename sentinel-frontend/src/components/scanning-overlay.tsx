"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2, Circle } from "lucide-react";
import { Card } from "@/components/ui/card";

const stages = [
  "Cloning repository...",
  "Resolving files and languages...",
  "Running static analysis (Bandit, Semgrep)...",
  "Mapping findings to CWE identifiers...",
  "Generating AI-powered fixes...",
];

export function ScanningOverlay({ repo }: { repo: string }) {
  const [stageIndex, setStageIndex] = React.useState(0);

  React.useEffect(() => {
    setStageIndex(0);
    const interval = setInterval(() => {
      setStageIndex((i) => (i < stages.length - 1 ? i + 1 : i));
    }, 1100);
    return () => clearInterval(interval);
  }, [repo]);

  return (
    <Card className="glow-cyan p-8">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/15" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
          <Loader2 className="h-6 w-6 text-cyan-300 animate-pulse" />
        </div>

        <div>
          <div className="text-sm font-medium text-foreground/85">
            Scanning <span className="font-mono text-cyan-300">{repo}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            This usually takes under 90 seconds.
          </p>
        </div>

        <div className="mt-2 w-full max-w-sm space-y-2 text-left">
          {stages.map((stage, i) => (
            <div
              key={stage}
              className="flex items-center gap-2.5 text-xs font-mono transition-colors duration-300"
            >
              {i < stageIndex ? (
                <Circle className="h-2.5 w-2.5 fill-severity-low text-severity-low shrink-0" />
              ) : i === stageIndex ? (
                <Circle className="h-2.5 w-2.5 fill-cyan-400 text-cyan-400 shrink-0 animate-pulse-glow" />
              ) : (
                <Circle className="h-2.5 w-2.5 text-foreground/15 shrink-0" />
              )}
              <span
                className={
                  i <= stageIndex ? "text-foreground/70" : "text-foreground/25"
                }
              >
                {stage}
              </span>
            </div>
          ))}
        </div>

        {/* Skeleton preview of incoming results */}
        <div className="mt-4 grid w-full grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 rounded-lg bg-white/[0.03] border border-white/[0.06] overflow-hidden relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
