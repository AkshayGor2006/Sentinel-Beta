"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, User, Mail, Lock, ArrowRight, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { login, signup, githubLoginUrl, ApiError } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = React.useState<"login" | "signup">("login");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      // Backend sent us here mid GitHub-connect flow (no valid session when
      // /github/login was hit) — pick straight back up instead of dropping
      // the user on the dashboard with GitHub still unconnected.
      //
      // window.location.href, not router.push: router.push is Next.js
      // client-side navigation for routes inside this app. githubLoginUrl()
      // points at the backend on a different origin (127.0.0.1:8001) —
      // router.push doesn't perform a real cross-origin browser navigation
      // for that, which is why this was silently landing back on
      // /dashboard instead of ever reaching GitHub.
      if (searchParams.get("next") === "github") {
        window.location.href = githubLoginUrl();
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await signup({ username, email, password });
      setSuccess("Account created — sign in below.");
      setMode("login");
      setPassword("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-void flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-grid-glow" />
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_50%_50%_at_50%_40%,black,transparent)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500">
            <ShieldCheck className="h-5 w-5 text-[#04121A]" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Sentinel <span className="text-gradient">Beta</span>
          </span>
        </Link>

        <Card className="glow-cyan p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold tracking-tight">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="mt-1.5 text-sm text-foreground/50">
              {mode === "login"
                ? "Sign in to view your repositories and scans"
                : "Sign up, then connect GitHub from the dashboard"}
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-4 flex items-start gap-2 rounded-lg border border-severity-critical/25 bg-severity-critical/[0.06] px-3.5 py-2.5 text-xs text-severity-critical">
                  <TriangleAlert className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  {error}
                </div>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-4 rounded-lg border border-severity-low/25 bg-severity-low/[0.06] px-3.5 py-2.5 text-xs text-severity-low">
                  {success}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/35" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="akshay"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/35" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/35" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full gap-2 mt-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {mode === "login" ? "Sign in" : "Create account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/45">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                  }}
                  className="text-cyan-300 hover:text-cyan-200 font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="text-cyan-300 hover:text-cyan-200 font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </Card>

        <p className="mt-6 text-center text-xs text-foreground/30">
          GitHub connects from the dashboard after you're signed in.
        </p>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={null}>
      <LoginForm />
    </React.Suspense>
  );
}
