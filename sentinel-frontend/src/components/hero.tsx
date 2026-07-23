"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Github, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanTerminal } from "@/components/scan-terminal";

export function Hero() {
  const [repo, setRepo] = React.useState("");
  const router = useRouter();

  function handleScan(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <section className="relative overflow-hidden pt-40 pb-28">
      <div className="absolute inset-0 bg-grid-glow" />
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <div className="container relative grid gap-16 lg:grid-cols-2 lg:items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3.5 py-1.5 text-xs font-medium text-cyan-300"
          >
            <Sparkles className="h-3 w-3" />
            AI-generated fixes, not just findings
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.08]"
          >
            Ship code without
            <br />
            shipping <span className="text-gradient">vulnerabilities.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-lg text-lg text-foreground/60 leading-relaxed"
          >
            Sentinel Beta scans your GitHub repos, finds the vulnerabilities that matter,
            and writes the secure code to fix them — so solo developers get
            enterprise-grade security without the enterprise price tag.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleScan}
            className="mt-9 flex flex-col sm:flex-row gap-3 max-w-lg"
          >
            <div className="relative flex-1">
              <Github className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/35" />
              <Input
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                placeholder="github.com/your-org/your-repo"
                className="pl-10 h-12"
              />
            </div>
            <Button type="submit" size="lg" className="gap-2 shrink-0">
              Scan repository
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex items-center gap-6 text-xs text-foreground/40"
          >
            <span>No credit card required</span>
            <span className="h-1 w-1 rounded-full bg-foreground/20" />
            <span>Scans in under 90 seconds</span>
            <span className="h-1 w-1 rounded-full bg-foreground/20" />
            <span>SOC 2 in progress</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
          className="flex justify-center lg:justify-end"
        >
          <ScanTerminal />
        </motion.div>
      </div>
    </section>
  );
}
