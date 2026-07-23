# Sentinel AI

AI-powered GitHub security scanner — marketing site + dashboard, built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, and Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Pages

- `/` — landing page (navbar, hero with live scan terminal, features, how it works, pricing, CTA)
- `/dashboard` — scan input, security score cards, vulnerability table, AI fix panel
- `/reports` — historical scan reports
- `/login` — sign-in page

## Backend integration

The dashboard's "Scan repository" button is wired to your FastAPI backend via `src/lib/api.ts`.

1. Copy `.env.local.example` to `.env.local` (defaults to `http://localhost:8000`).
2. Make sure your FastAPI server exposes `POST /analyze-repo` accepting:
   ```json
   { "repo_url": "github.com/your-org/your-repo" }
   ```
   and returning:
   ```json
   {
     "repo": "your-org/your-repo",
     "security_score": 74,
     "files_scanned": 312,
     "vulnerabilities": [
       {
         "id": "SENT-1042",
         "title": "Hardcoded database credentials",
         "file": "app/core/database.py",
         "line": 14,
         "severity": "critical",
         "cwe": "CWE-798",
         "detected_by": "Bandit",
         "status": "open",
         "description": "...",
         "vulnerable_code": "...",
         "fixed_code": "...",
         "ai_explanation": "..."
       }
     ]
   }
   ```
3. Enable CORS on the FastAPI side for `http://localhost:3000`, e.g.:
   ```python
   from fastapi.middleware.cors import CORSMiddleware

   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

If your backend's field names differ, adjust `RawVulnerability`/`RawScanResponse` and
`normalizeVulnerability()` in `src/lib/api.ts` — everything else in the UI only depends
on the normalized `Vulnerability` type, so no other files need to change.

Until you run a scan, the dashboard shows demo data (clearly labeled) so the page never looks empty.

- Login is UI-only; wire up GitHub OAuth and your auth provider of choice in `login/page.tsx`.
- The Reports page (`/reports`) is still mock data — same pattern applies if you want to load real scan history from a `/reports` endpoint.
