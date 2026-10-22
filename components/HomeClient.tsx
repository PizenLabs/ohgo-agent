"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { WORKSPACE_DATA, WORKSPACE_KEYS, type WorkspaceKey } from "@/lib/workspace";
import TerminalSimulator from "./TerminalSimulator";
import ArchFlow from "./ArchFlow";
import LogoBrand from "./LogoBrand";
import ThemeToggle from "./ThemeToggle";

// Code-split: modal JS excluded from initial bundle, loaded on first open.
const SupModal = dynamic(() => import("./SupModal"), { ssr: false });

const BTN_CLASS: Record<WorkspaceKey, string> = {
  ASK: "pixel-btn-ask",
  FUZZ: "pixel-btn-fuzz",
  BUILD: "pixel-btn-build",
};

export default function HomeClient() {
  const [workspace, setWorkspace] = useState<WorkspaceKey>("ASK");
  const [supOpen, setSupOpen] = useState(false);
  const [supQuery, setSupQuery] = useState("");
  // Manual motion override (hero MOTION toggle). Initialized to the SSR value
  // (ON) to avoid a hydration mismatch, then synced post-hydration from the
  // pre-paint html[data-motion] value set in layout (stored pref, else OS
  // prefers-reduced-motion). Lets users force motion on/off regardless of OS.
  const [motionOn, setMotionOn] = useState(true);
  useEffect(() => {
    setMotionOn(document.documentElement.dataset.motion !== "off");
  }, []);
  const data = WORKSPACE_DATA[workspace];

  // Pause the hero's CSS loops while it is off-screen. Toggling the class on
  // the DOM (instead of state) avoids re-rendering the whole page mid-scroll.
  const heroMotionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = heroMotionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      el.classList.toggle("brand-hold", !entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const switchWorkspace = useCallback((ws: WorkspaceKey) => setWorkspace(ws), []);
  const openSup = useCallback((q = "") => {
    setSupQuery(q);
    setSupOpen(true);
  }, []);
  const closeSup = useCallback(() => setSupOpen(false), []);
  const toggleMotion = useCallback(() => {
    setMotionOn((prev) => {
      const next = !prev;
      try {
        document.documentElement.dataset.motion = next ? "on" : "off";
        localStorage.setItem("ohgo-motion", next ? "on" : "off");
      } catch {
        /* storage unavailable (private mode) — attr still applies */
      }
      return next;
    });
  }, []);
  const onSupQuery = useCallback(
    (q: string) => {
      openSup(q);
    },
    [openSup],
  );

  return (
    <div
      className="min-h-screen flex flex-col pixel-grid-bg text-sm"
      style={{ "--active-accent": data.color } as CSSProperties}
    >
      <div className="scanlines" aria-hidden />

      <header className="border-b-2 border-border-pixel bg-panel-dark/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LogoBrand variant="mini" accent={data.color} />
            <div>
              <a href="#" className="font-pixel text-2xl tracking-wider text-[var(--app-ink)] flex items-center gap-2">
                <span className="brand-word" aria-label="OHGO">
                  <span>O</span><span>H</span><span>G</span><span>O</span>
                </span>{" "}
                <span className="text-xs font-mono px-1.5 py-0.5 bg-border-pixel/50 text-[var(--app-faint)] rounded-none border border-gray-600">
                  v1.0
                </span>
              </a>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono" aria-label="Sections">
            <a href="#workspaces" className="text-[var(--app-muted)] hover:text-ask-teal transition-colors">WORKSPACES</a>
            <a href="#simulator" className="text-[var(--app-muted)] hover:text-ask-teal transition-colors">TERMINAL SIMULATOR</a>
            <a href="#architecture" className="text-[var(--app-muted)] hover:text-ask-teal transition-colors">ARCHITECTURE</a>
            <a href="#invariants" className="text-[var(--app-muted)] hover:text-ask-teal transition-colors">INVARIANTS</a>
            <a href="#intent" className="text-[var(--app-muted)] hover:text-ask-teal transition-colors">INTENT</a>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => openSup()}
              className="pixel-btn text-xs !py-1 !px-2.5 text-pixel-amber border-pixel-amber hover:bg-pixel-amber/20"
            >
              $sup QUERY
            </button>
            <Link href="/info" className="pixel-btn text-xs !py-1 !px-2.5">
              INFO
            </Link>
            <a href="https://github.com/PizenLabs/ohgo" target="_blank" rel="noreferrer" className="pixel-btn text-xs !py-1 !px-2.5">
              GITHUB
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 space-y-12">
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-panel-dark border border-border-pixel text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-pixel-green animate-pulse" />
              <span className="text-[var(--app-muted)]">HUMAN-CONTROLLED AGENT RUNTIME FOR REAL CODEBASES</span>
            </div>

            <h1 className="font-pixel text-5xl sm:text-6xl text-[var(--app-ink)] tracking-wide leading-tight">
              DYNAMIC PATH.
              <br />
              <span className="transition-colors duration-300" style={{ color: data.color }}>
                {data.name} AUTHORITY.
              </span>
              <br />
              TRUTHFUL STATE.
            </h1>

            <p className="text-[var(--app-muted)] leading-relaxed max-w-2xl text-sm sm:text-base">
              OHGO enforces structural execution boundaries across your codebase. Models are untrusted
              proposal engines—the runtime controls tool admission, capability policy, and state verification.
            </p>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono text-[var(--app-faint)] uppercase tracking-wider">
                Select Runtime Authority Boundary:
              </div>
              <div className="flex flex-wrap gap-3" role="group" aria-label="Workspace selector">
                {WORKSPACE_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => switchWorkspace(k)}
                    aria-pressed={workspace === k}
                    className={`pixel-btn ${BTN_CLASS[k]}${workspace === k ? " active" : ""}`}
                  >
                    {WORKSPACE_DATA[k].title}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono text-[var(--app-muted)] border-t border-border-pixel/60">
              <div>
                <span className="text-[var(--app-faint)] block">AUTHORITY:</span>
                <span className="font-semibold" style={{ color: data.color }}>{data.title}</span>
              </div>
              <div>
                <span className="text-[var(--app-faint)] block">MUTATION:</span>
                <span className="text-red-400 font-semibold">{data.mutation}</span>
              </div>
              <div>
                <span className="text-[var(--app-faint)] block">COLOR IDENTITY:</span>
                <span className="font-semibold" style={{ color: data.color }}>{data.colorName}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="pixel-box p-6 w-full max-w-md flex flex-col items-center bg-panel-dark text-center relative overflow-hidden">
              <div className="absolute top-2 left-3 text-[10px] font-mono text-[var(--app-faint)]">BRAND // UNIFORM</div>
              <div
                className="absolute top-2 right-3 text-[10px] font-mono px-1.5 bg-bg-dark border border-border-pixel"
                style={{ color: data.color }}
              >
                OHGO_{workspace}
              </div>

              <div ref={heroMotionRef} className="my-6 relative flex justify-center items-center w-full">
                <div className="brand-water" aria-hidden>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <LogoBrand variant="hero" accent={data.color} />
              </div>

              <div className="space-y-1">
                <div className="font-pixel text-2xl text-[var(--app-ink)] tracking-wider">{data.statusTitle}</div>
                <p className="text-xs text-[var(--app-muted)]">{data.statusDesc}</p>
              </div>

              <div className="mt-4 w-full flex flex-wrap gap-2 justify-between items-center text-[10px] font-mono text-[var(--app-faint)] pt-3 border-t border-border-pixel/50">
                <span>LOGO: <span className="text-[var(--app-muted)]">BOUNCE // WATER // SWIM</span></span>
                <span className="flex items-center gap-2">
                  <span>AUTHORITY: <span style={{ color: data.color }}>{workspace}</span></span>
                  <button
                    onClick={toggleMotion}
                    aria-pressed={motionOn}
                    title="Toggle brand motion (overrides OS reduced-motion)"
                    className="px-1.5 py-0.5 bg-bg-dark border border-border-pixel text-[var(--app-muted)] hover:text-[var(--app-ink)]"
                  >
                    MOTION: {motionOn ? "ON" : "OFF"}
                  </button>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 01 Workspaces (static — no JS) */}
        <section id="workspaces" className="space-y-6 pt-6 scroll-mt-20">
          <div className="border-b-2 border-border-pixel pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-pixel text-3xl text-[var(--app-ink)] tracking-wide">01. THE THREE WORKSPACES</h2>
              <p className="text-xs font-mono text-[var(--app-muted)]">Architectural Invariant: Workspaces are runtime authority boundaries, not UI visual themes.</p>
            </div>
            <div className="text-xs font-mono text-[var(--app-faint)]">EXACTLY 3 PRIMARY WORKSPACES</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="pixel-box pixel-box-interactive p-5 flex flex-col justify-between space-y-4 border-l-4 border-l-ask-teal">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-2xl text-ask-teal tracking-wider">ASK</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-ask-teal/10 text-ask-teal border border-ask-teal/30">TEAL</span>
                </div>
                <div className="text-xs font-mono font-semibold text-[var(--app-ink)]">Understand &amp; Reason</div>
                <p className="text-xs text-[var(--app-muted)] leading-relaxed">
                  Read-only workspace for understanding user intent, searching codebases, dependency analysis, git inspection, and architectural planning.
                </p>
              </div>
              <div className="space-y-2 pt-3 border-t border-border-pixel">
                <div className="text-[10px] font-mono text-[var(--app-faint)] uppercase">Mutation Authority:</div>
                <div className="text-xs font-mono text-red-400 bg-red-950/20 px-2 py-1 border border-red-900/40">NONE (Read Only)</div>
                <div className="text-[10px] font-mono text-[var(--app-faint)] uppercase pt-1">Allowed Tools:</div>
                <div className="flex flex-wrap gap-1">
                  {["read", "grep", "glob", "ls", "webfetch"].map((t) => (
                    <span key={t} className="text-[10px] font-mono bg-bg-dark text-[var(--app-muted)] px-1.5 py-0.5 border border-border-pixel">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pixel-box pixel-box-interactive p-5 flex flex-col justify-between space-y-4 border-l-4 border-l-fuzz-magenta">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-2xl text-fuzz-magenta tracking-wider">FUZZ</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-fuzz-magenta/10 text-fuzz-magenta border border-fuzz-magenta/30">MAGENTA</span>
                </div>
                <div className="text-xs font-mono font-semibold text-[var(--app-ink)]">Discover &amp; Probe</div>
                <p className="text-xs text-[var(--app-muted)] leading-relaxed">
                  Adversarial and exploratory investigation. Executes commands, stress tests, benchmarks, and reproduces bugs without mutating repository source files.
                </p>
              </div>
              <div className="space-y-2 pt-3 border-t border-border-pixel">
                <div className="text-[10px] font-mono text-[var(--app-faint)] uppercase">Mutation Authority:</div>
                <div className="text-xs font-mono text-pixel-amber bg-amber-950/20 px-2 py-1 border border-amber-900/40">EXECUTE YES / MUTATE NO</div>
                <div className="text-[10px] font-mono text-[var(--app-faint)] uppercase pt-1">Allowed Tools:</div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] font-mono bg-bg-dark text-[var(--app-muted)] px-1.5 py-0.5 border border-border-pixel">read</span>
                  <span className="text-[10px] font-mono bg-bg-dark text-fuzz-magenta px-1.5 py-0.5 border border-fuzz-magenta/40">bash*</span>
                  <span className="text-[10px] font-mono bg-bg-dark text-fuzz-magenta px-1.5 py-0.5 border border-fuzz-magenta/40">wait</span>
                  <span className="text-[10px] font-mono bg-bg-dark text-[var(--app-muted)] px-1.5 py-0.5 border border-border-pixel">grep</span>
                </div>
              </div>
            </div>

            <div className="pixel-box pixel-box-interactive p-5 flex flex-col justify-between space-y-4 border-l-4 border-l-build-blue">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-2xl text-build-blue tracking-wider">BUILD</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-build-blue/10 text-build-blue border border-build-blue/30">BLUE</span>
                </div>
                <div className="text-xs font-mono font-semibold text-[var(--app-ink)]">Change &amp; Implement</div>
                <p className="text-xs text-[var(--app-muted)] leading-relaxed">
                  Sole repository mutation authority. Performs patches, creates files, refactors code, runs builds, and executes verification steps.
                </p>
              </div>
              <div className="space-y-2 pt-3 border-t border-border-pixel">
                <div className="text-[10px] font-mono text-[var(--app-faint)] uppercase">Mutation Authority:</div>
                <div className="text-xs font-mono text-pixel-green bg-green-950/20 px-2 py-1 border border-green-900/40">FULL REPOSITORY MUTATION</div>
                <div className="text-[10px] font-mono text-[var(--app-faint)] uppercase pt-1">Allowed Tools:</div>
                <div className="flex flex-wrap gap-1">
                  {["write", "edit", "bash"].map((t) => (
                    <span key={t} className="text-[10px] font-mono bg-bg-dark text-build-blue px-1.5 py-0.5 border border-build-blue/40">{t}</span>
                  ))}
                  <span className="text-[10px] font-mono bg-bg-dark text-[var(--app-muted)] px-1.5 py-0.5 border border-border-pixel">read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 Simulator */}
        <section id="simulator" className="space-y-6 pt-4 scroll-mt-20">
          <div className="border-b-2 border-border-pixel pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-pixel text-3xl text-[var(--app-ink)] tracking-wide">02. RUNTIME SIMULATOR &amp; TOOL ADMISSION</h2>
              <p className="text-xs font-mono text-[var(--app-muted)]">Test how OHGO admits or denies tools below the UI based on Capability Policy.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-[var(--app-muted)]">ACTIVE:</span>
              <span
                className="text-xs font-mono font-bold px-2 py-0.5 border"
                style={{ color: data.color, borderColor: data.color, backgroundColor: `${data.color}20` }}
              >
                {workspace}
              </span>
            </div>
          </div>

          <TerminalSimulator workspace={workspace} onSupQuery={onSupQuery} />
        </section>

        {/* 03 Architecture */}
        <section id="architecture" className="space-y-6 pt-4 scroll-mt-20">
          <div className="border-b-2 border-border-pixel pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-pixel text-3xl text-[var(--app-ink)] tracking-wide">03. ARCHITECTURE &amp; ARTIFACT HANDOFFS</h2>
              <p className="text-xs font-mono text-[var(--app-muted)]">Cross-workspace workflows communicate using structured artifacts—never conversation inheritance.</p>
            </div>
          </div>
          <ArchFlow />
        </section>

        {/* 04 Invariants (continuous horizontal marquee) */}
        <section id="invariants" className="space-y-6 pt-4 pb-8 scroll-mt-20">
          <div className="border-b-2 border-border-pixel pb-3">
            <h2 className="font-pixel text-3xl text-[var(--app-ink)] tracking-wide">04. CORE ARCHITECTURAL INVARIANTS</h2>
            <p className="text-xs font-mono text-[var(--app-muted)]">Non-negotiable rules governing runtime authority, sessions, and persistence.</p>
          </div>

          <div className="invariant-marquee" aria-label="Core architectural invariants">
            <div className="invariant-marquee-track">
              {[0, 1].map((dup) => (
                <div key={dup} className="invariant-marquee-group" aria-hidden={dup === 1 ? "true" : undefined}>
                  {[
                    { t: "I1-I4. THREE AUTHORITIES", tag: "RUNTIME", cls: "text-ask-teal", b: "Exactly three primary workspaces (ASK, FUZZ, BUILD). BUILD is the sole mutation authority. ASK & FUZZ can never mutate code." },
                    { t: "I5 & I14. MODEL UNTRUSTED", tag: "POLICY", cls: "text-fuzz-magenta", b: "Model output is untrusted proposal. The runtime capability policy enforces boundaries below the UI regardless of model intent or prompts." },
                    { t: "I6 & I17. EPHEMERAL $SUP", tag: "SUPPORT", cls: "text-build-blue", b: "$sup opens a quick reference query layer on the SUP model role. It never alters main task history, persistent context, or workspace state." },
                    { t: "I8 & I10. SESSION TRUTH", tag: "PERSISTENCE", cls: "text-pixel-green", b: "Sessions retain resolved effective models across restarts in ~/.ohgo/sessions.db. Unfinished states resume truthfully; unknown stays unknown." },
                    { t: "I11. PROJECT IDENTITY", tag: "METADATA", cls: "text-pixel-amber", b: "<root>/.ohgo/project.yml establishes stable project identification without duplicating global session storage databases." },
                    { t: "I21-I26. INTENT ROUTING", tag: "AUTHORITY", cls: "text-fuzz-magenta", b: "Each turn classified READ/EXECUTE/INVESTIGATE by a deterministic, model-free classifier. Delegation only narrows authority; ambiguity resolves downward to READ." },
                    { t: "I18. AUDIT-FIRST SEAMS", tag: "ENGINE", cls: "text-[var(--app-muted)]", b: "Existing execution engine is preserved. Architectural changes occur only at defined seams through audit, minimal change, and verification." },
                  ].map((c) => (
                    <div key={`${dup}-${c.t}`} className="pixel-box p-4 bg-panel-dark space-y-2 invariant-marquee-item font-mono text-xs">
                      <div className={`${c.cls} font-bold flex items-center justify-between`}>
                        <span>{c.t}</span>
                        <span className="text-[10px] text-[var(--app-faint)]">{c.tag}</span>
                      </div>
                      <p className="text-[var(--app-muted)]">{c.b}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 05 Intent-aware turns & completion (compact) */}
        <section id="intent" className="space-y-6 pt-4 pb-8 scroll-mt-20">
          <div className="border-b-2 border-border-pixel pb-3">
            <h2 className="font-pixel text-3xl text-[var(--app-ink)] tracking-wide">05. INTENT-AWARE TURNS &amp; COMPLETION</h2>
            <p className="text-xs font-mono text-[var(--app-muted)]">Authority is derived per turn; completion is a state transition, not a stop reason.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="pixel-box p-5 bg-panel-dark space-y-2">
              <div className="text-xs font-mono text-[var(--app-faint)] uppercase tracking-wider">Transition matrix</div>
              <div className="font-mono text-[11px] space-y-1 text-[var(--app-muted)]">
                <div className="grid grid-cols-3 gap-2 font-bold text-[var(--app-ink)] border-b border-border-pixel pb-1">
                  <span>ACTIVE</span><span>INTENT</span><span>RESULT</span>
                </div>
                {[
                  ["ASK", "READ", "ASK"],
                  ["ASK", "EXECUTE", "REFUSED → /build"],
                  ["ASK", "INVESTIGATE", "REFUSED → /fuzz"],
                  ["BUILD", "READ", "ASK semantics, BUILD stays"],
                  ["BUILD", "EXECUTE", "BUILD"],
                  ["BUILD", "INVESTIGATE", "FUZZ semantics, BUILD stays"],
                  ["FUZZ", "READ", "ASK semantics, FUZZ stays"],
                  ["FUZZ", "INVESTIGATE", "FUZZ"],
                  ["FUZZ", "EXECUTE", "REFUSED → /build"],
                ].map(([a, i, r]) => (
                  <div key={`${a}-${i}`} className="grid grid-cols-3 gap-2">
                    <span className="text-ask-teal">{a}</span>
                    <span className="text-pixel-amber">{i}</span>
                    <span className="text-[var(--app-muted)]">{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pixel-box p-5 bg-panel-dark space-y-2">
              <div className="text-xs font-mono text-[var(--app-faint)] uppercase tracking-wider">Completion verdicts</div>
              <div className="font-mono text-[11px] space-y-1 text-[var(--app-muted)]">
                {[
                  { v: "COMPLETED", c: "text-pixel-green" },
                  { v: "NEEDS_REVIEW", c: "text-pixel-amber" },
                  { v: "PAUSED", c: "text-build-blue" },
                  { v: "FAILED", c: "text-red-400" },
                  { v: "CANCELLED", c: "text-[var(--app-faint)]" },
                ].map((x) => (
                  <div key={x.v}><span className={`${x.c} font-bold`}>{x.v}</span></div>
                ))}
              </div>
              <p className="text-[10px] font-mono text-[var(--app-faint)] pt-2 border-t border-border-pixel">
                ohgo run exits 0 / 2 / 3 / 1 / 130. Delegation only narrows authority; the UI projects <span className="text-[var(--app-ink)]">build · ask/read</span> for the turn, then clears it.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-border-pixel bg-panel-dark py-6 text-xs font-mono text-[var(--app-faint)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <a href="https://pizenlabs.dev" target="_blank" rel="noreferrer" className="hover:text-[var(--app-ink)] transition-colors">© PizenLabs</a>
            <span className="hidden sm:inline">·</span>
            <span>LICENSE: Apache-2.0</span>
          </div>
          <div className="flex space-x-4">
            <span>ASK: Teal</span>
            <span>FUZZ: Magenta</span>
            <span>BUILD: Blue</span>
          </div>
        </div>
      </footer>

      {supOpen && <SupModal open={supOpen} initialQuery={supQuery} onClose={closeSup} />}
    </div>
  );
}
