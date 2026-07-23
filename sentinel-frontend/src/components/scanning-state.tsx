"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

/**
 * No fabricated "cloning... analyzing... generating fixes..." stage list —
 * the backend doesn't stream progress, so this only shows what's real: a
 * spinner and how long the request has actually been running.
 */
export function ScanningState({ label }: { label: string }) {
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    setSeconds(0);
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [label]);

  return (
    <Card className="glow-cyan p-8">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/15" />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
          />
          <Loader2 className="h-5 w-5 text-cyan-300 animate-pulse" />
        </div>
        <div>
          <div className="text-sm font-medium text-foreground/85">{label}</div>
          <p className="mt-1 text-xs text-muted-foreground font-mono">
            {seconds}s elapsed — cloning and static analysis can take a while for larger repos
          </p>
        </div>
      </div>
    </Card>
  );
}
