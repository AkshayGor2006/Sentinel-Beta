"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Loader2, FileCode2 } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { chatWithRepo, ApiError } from "@/lib/api";
import type { ChatResponse } from "@/lib/types";

interface Exchange {
  question: string;
  response?: ChatResponse;
  error?: string;
}

export function ChatPanel() {
  const [question, setQuestion] = React.useState("");
  const [exchanges, setExchanges] = React.useState<Exchange[]>([]);
  const [loading, setLoading] = React.useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;

    setQuestion("");
    setLoading(true);
    const index = exchanges.length;
    setExchanges((prev) => [...prev, { question: q }]);

    try {
      const response = await chatWithRepo(q);
      setExchanges((prev) =>
        prev.map((ex, i) => (i === index ? { ...ex, response } : ex))
      );
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Chat request failed.";
      setExchanges((prev) => prev.map((ex, i) => (i === index ? { ...ex, error: message } : ex)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="border-b border-white/[0.07] flex-row items-center gap-2.5 space-y-0 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400/20 to-blue-500/20 border border-cyan-400/20">
          <MessageCircle className="h-4 w-4 text-cyan-300" />
        </div>
        <div>
          <CardTitle className="text-sm">Chat with your repo</CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">POST /chat-with-repo</p>
        </div>
      </CardHeader>

      <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
        {exchanges.length === 0 && !loading && (
          <p className="text-xs text-muted-foreground text-center py-6">
            Ask something about the last repository Sentinel indexed — e.g. "where all are auth
            leakage?"
          </p>
        )}
        <AnimatePresence initial={false}>
          {exchanges.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="ml-auto max-w-[85%] rounded-lg bg-white/[0.05] border border-white/[0.07] px-3.5 py-2 text-sm text-foreground/80">
                {ex.question}
              </div>
              {ex.error && (
                <div className="max-w-[90%] rounded-lg border border-severity-critical/25 bg-severity-critical/[0.06] px-3.5 py-2.5 text-xs text-severity-critical">
                  {ex.error}
                </div>
              )}
              {ex.response && (
                <div className="max-w-[90%] rounded-lg border border-cyan-400/15 bg-cyan-400/[0.04] px-3.5 py-3 text-[13px] leading-relaxed text-foreground/70">
                  <p className="whitespace-pre-wrap">{ex.response.answer}</p>
                  {ex.response.sources && ex.response.sources.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {ex.response.sources.map((src, si) => (
                        <span
                          key={si}
                          className="flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-foreground/50 font-mono"
                        >
                          <FileCode2 className="h-2.5 w-2.5" />
                          {src.file}:{src.chunk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 border-t border-white/[0.07] p-4">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about this repository..."
          disabled={loading}
        />
        <Button type="submit" size="icon" disabled={loading || !question.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
