# Ohgo Agent — Next.js port of the Human-Controlled Agent Runtime landing page

Converted from `ohgo_human_controlled_agent_runtime.html` (single-file Tailwind CDN prototype).

## Run

```bash
npm install
npm run dev
```

## Structure

- `app/layout.tsx` — root layout + `next/font` (VT323, JetBrains Mono, self-hosted)
- `app/globals.css` — Tailwind v4 theme tokens + pixel/scanline styles
- `app/page.tsx` — Server Component shell (streams static markup)
- `components/HomeClient.tsx` — workspace state orchestrator
- `components/MascotCanvas.tsx` — hero blob (exact frame-math port, single rAF)
- `components/MiniMascotCanvas.tsx` — header mini blob (redrawn on workspace change, CSS bob)
- `components/mascot-scene.ts` — pure scene computation (unit-parity-tested vs original)
- `components/TerminalSimulator.tsx` — capability-policy simulator (capped buffer)
- `components/ArchFlow.tsx` — artifact handoff explorer
- `components/SupModal.tsx` — `$sup` ephemeral modal (code-split via `next/dynamic`)
- `lib/workspace.ts` — workspace authority configs
- `lib/terminal.ts` — pure command evaluator + `$sup` answers (testable, no DOM)
