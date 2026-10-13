"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";
import { BASE_PATH } from "@/lib/base-path";
import { WORKSPACE_DATA, WORKSPACE_KEYS, type WorkspaceKey } from "@/lib/workspace";
import TerminalSimulator from "./TerminalSimulator";
import ArchFlow from "./ArchFlow";

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
  const data = WORKSPACE_DATA[workspace];

  const switchWorkspace = useCallback((ws: WorkspaceKey) => setWorkspace(ws), []);
  const openSup = useCallback((q = "") => {
    setSupQuery(q);
    setSupOpen(true);
  }, []);
  const closeSup = useCallback(() => setSupOpen(false), []);
  const onSupQuery = useCallback(
    (q: string) => {
      openSup(q);
    },
    [openSup],
  );

  return (
    <div className="min-h-screen flex flex-col pixel-grid-bg text-sm">
      <div className="scanlines" aria-hidden />

      <header className="border-b-2 border-border-pixel bg-panel-dark/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image
              src={`${BASE_PATH}/ohgo-logo-pixel.svg`}
              alt="OHGO logo"
              width={48}
              height={32}
              className="pixelated logo-float-mini"
              preload
            />
            <div>
              <a href="#" className="font-pixel text-2xl tracking-wider text-white flex items-center gap-2">
                OHGO{" "}
                <span className="text-xs font-mono px-1.5 py-0.5 bg-border-pixel/50 text-gray-400 rounded-none border border-gray-600">
                  v1.0
                </span>
              </a>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono" aria-label="Sections">
            <a href="#workspaces" className="text-gray-300 hover:text-ask-teal transition-colors">WORKSPACES</a>
            <a href="#simulator" className="text-gray-300 hover:text-ask-teal transition-colors">TERMINAL SIMULATOR</a>
            <a href="#architecture" className="text-gray-300 hover:text-ask-teal transition-colors">ARCHITECTURE</a>
            <a href="#invariants" className="text-gray-300 hover:text-ask-teal transition-colors">INVARIANTS</a>
          </nav>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => openSup()}
              className="pixel-btn text-xs !py-1 !px-2.5 text-pixel-amber border-pixel-amber hover:bg-pixel-amber/20"
            >
              $sup QUERY
            </button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="pixel-btn text-xs !py-1 !px-2.5">
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
              <span className="text-gray-300">HUMAN-CONTROLLED AGENT RUNTIME FOR REAL CODEBASES</span>
            </div>

            <h1 className="font-pixel text-5xl sm:text-6xl text-white tracking-wide leading-tight">
              DYNAMIC PATH.
              <br />
              <span className="transition-colors duration-300" style={{ color: data.color }}>
                {data.name} AUTHORITY.
              </span>
              <br />
              TRUTHFUL STATE.
            </h1>

            <p className="text-gray-400 leading-relaxed max-w-2xl text-sm sm:text-base">
              OHGO enforces structural execution boundaries across your codebase. Models are untrusted
              proposal engines—the runtime controls tool admission, capability policy, and state verification.
            </p>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono text-gray-400 uppercase tracking-wider">
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

            <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono text-gray-400 border-t border-border-pixel/60">
              <div>
                <span className="text-gray-500 block">AUTHORITY:</span>
                <span className="font-semibold" style={{ color: data.color }}>{data.title}</span>
              </div>
              <div>
                <span className="text-gray-500 block">MUTATION:</span>
                <span className="text-red-400 font-semibold">{data.mutation}</span>
              </div>
              <div>
                <span className="text-gray-500 block">COLOR IDENTITY:</span>
                <span className="font-semibold" style={{ color: data.color }}>{data.colorName}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="pixel-box p-6 w-full max-w-md flex flex-col items-center bg-panel-dark text-center relative overflow-hidden">
              <div className="absolute top-2 left-3 text-[10px] font-mono text-gray-500">BRAND // UNIFORM</div>
              <div
                className="absolute top-2 right-3 text-[10px] font-mono px-1.5 bg-bg-dark border border-border-pixel"
                style={{ color: data.color }}
              >
                OHGO_{workspace}
              </div>

              <div className="my-6 relative flex justify-center items-center">
                <Image
                  src={`${BASE_PATH}/ohgo-logo-pixel.svg`}
                  alt="OHGO pixel logo"
                  width={330}
                  height={220}
                  className="pixelated logo-float h-auto w-full max-w-[330px]"
                  preload
                />
              </div>

              <div className="space-y-1">
                <div className="font-pixel text-2xl text-white tracking-wider">{data.statusTitle}</div>
                <p className="text-xs text-gray-400">{data.statusDesc}</p>
              </div>

              <div className="mt-4 w-full flex justify-between items-center text-[10px] font-mono text-gray-500 pt-3 border-t border-border-pixel/50">
                <span>LOGO: <span className="text-gray-300">FLOAT // UNIFORM</span></span>
                <span>AUTHORITY: <span style={{ color: data.color }}>{workspace}</span></span>
              </div>
            </div>
          </div>
        </section>

        {/* 01 Workspaces (static — no JS) */}
        <section id="workspaces" className="space-y-6 pt-6 scroll-mt-20">
          <div className="border-b-2 border-border-pixel pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-pixel text-3xl text-white tracking-wide">01. THE THREE WORKSPACES</h2>
              <p className="text-xs font-mono text-gray-400">Architectural Invariant: Workspaces are runtime authority boundaries, not UI visual themes.</p>
            </div>
            <div className="text-xs font-mono text-gray-500">EXACTLY 3 PRIMARY WORKSPACES</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="pixel-box pixel-box-interactive p-5 flex flex-col justify-between space-y-4 border-l-4 border-l-ask-teal">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-2xl text-ask-teal tracking-wider">ASK</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-ask-teal/10 text-ask-teal border border-ask-teal/30">TEAL</span>
                </div>
                <div className="text-xs font-mono font-semibold text-gray-200">Understand &amp; Reason</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Read-only workspace for understanding user intent, searching codebases, dependency analysis, git inspection, and architectural planning.
                </p>
              </div>
              <div className="space-y-2 pt-3 border-t border-border-pixel">
                <div className="text-[10px] font-mono text-gray-500 uppercase">Mutation Authority:</div>
                <div className="text-xs font-mono text-red-400 bg-red-950/20 px-2 py-1 border border-red-900/40">NONE (Read Only)</div>
                <div className="text-[10px] font-mono text-gray-500 uppercase pt-1">Allowed Tools:</div>
                <div className="flex flex-wrap gap-1">
                  {["read", "grep", "glob", "ls", "webfetch"].map((t) => (
                    <span key={t} className="text-[10px] font-mono bg-bg-dark text-gray-300 px-1.5 py-0.5 border border-border-pixel">{t}</span>
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
                <div className="text-xs font-mono font-semibold text-gray-200">Discover &amp; Probe</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Adversarial and exploratory investigation. Executes commands, stress tests, benchmarks, and reproduces bugs without mutating repository source files.
                </p>
              </div>
              <div className="space-y-2 pt-3 border-t border-border-pixel">
                <div className="text-[10px] font-mono text-gray-500 uppercase">Mutation Authority:</div>
                <div className="text-xs font-mono text-pixel-amber bg-amber-950/20 px-2 py-1 border border-amber-900/40">EXECUTE YES / MUTATE NO</div>
                <div className="text-[10px] font-mono text-gray-500 uppercase pt-1">Allowed Tools:</div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-[10px] font-mono bg-bg-dark text-gray-300 px-1.5 py-0.5 border border-border-pixel">read</span>
                  <span className="text-[10px] font-mono bg-bg-dark text-fuzz-magenta px-1.5 py-0.5 border border-fuzz-magenta/40">bash*</span>
                  <span className="text-[10px] font-mono bg-bg-dark text-fuzz-magenta px-1.5 py-0.5 border border-fuzz-magenta/40">wait</span>
                  <span className="text-[10px] font-mono bg-bg-dark text-gray-300 px-1.5 py-0.5 border border-border-pixel">grep</span>
                </div>
              </div>
            </div>

            <div className="pixel-box pixel-box-interactive p-5 flex flex-col justify-between space-y-4 border-l-4 border-l-build-blue">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-2xl text-build-blue tracking-wider">BUILD</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-build-blue/10 text-build-blue border border-build-blue/30">BLUE</span>
                </div>
                <div className="text-xs font-mono font-semibold text-gray-200">Change &amp; Implement</div>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Sole repository mutation authority. Performs patches, creates files, refactors code, runs builds, and executes verification steps.
                </p>
              </div>
              <div className="space-y-2 pt-3 border-t border-border-pixel">
                <div className="text-[10px] font-mono text-gray-500 uppercase">Mutation Authority:</div>
                <div className="text-xs font-mono text-pixel-green bg-green-950/20 px-2 py-1 border border-green-900/40">FULL REPOSITORY MUTATION</div>
                <div className="text-[10px] font-mono text-gray-500 uppercase pt-1">Allowed Tools:</div>
                <div className="flex flex-wrap gap-1">
                  {["write", "edit", "bash"].map((t) => (
                    <span key={t} className="text-[10px] font-mono bg-bg-dark text-build-blue px-1.5 py-0.5 border border-build-blue/40">{t}</span>
                  ))}
                  <span className="text-[10px] font-mono bg-bg-dark text-gray-300 px-1.5 py-0.5 border border-border-pixel">read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 Simulator */}
        <section id="simulator" className="space-y-6 pt-4 scroll-mt-20">
          <div className="border-b-2 border-border-pixel pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-pixel text-3xl text-white tracking-wide">02. RUNTIME SIMULATOR &amp; TOOL ADMISSION</h2>
              <p className="text-xs font-mono text-gray-400">Test how OHGO admits or denies tools below the UI based on Capability Policy.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">ACTIVE:</span>
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
              <h2 className="font-pixel text-3xl text-white tracking-wide">03. ARCHITECTURE &amp; ARTIFACT HANDOFFS</h2>
              <p className="text-xs font-mono text-gray-400">Cross-workspace workflows communicate using structured artifacts—never conversation inheritance.</p>
            </div>
          </div>
          <ArchFlow />
        </section>

        {/* 04 Invariants (static — no JS) */}
        <section id="invariants" className="space-y-6 pt-4 pb-8 scroll-mt-20">
          <div className="border-b-2 border-border-pixel pb-3">
            <h2 className="font-pixel text-3xl text-white tracking-wide">04. CORE ARCHITECTURAL INVARIANTS</h2>
            <p className="text-xs font-mono text-gray-400">Non-negotiable rules governing runtime authority, sessions, and persistence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            {[
              { t: "I1-I4. THREE AUTHORITIES", tag: "RUNTIME", cls: "text-ask-teal", b: "Exactly three primary workspaces (ASK, FUZZ, BUILD). BUILD is the sole mutation authority. ASK & FUZZ can never mutate code." },
              { t: "I5 & I14. MODEL UNTRUSTED", tag: "POLICY", cls: "text-fuzz-magenta", b: "Model output is untrusted proposal. The runtime capability policy enforces boundaries below the UI regardless of model intent or prompts." },
              { t: "I6 & I17. EPHEMERAL $SUP", tag: "SUPPORT", cls: "text-build-blue", b: "$sup opens a quick reference query layer on the SUP model role. It never alters main task history, persistent context, or workspace state." },
              { t: "I8 & I10. SESSION TRUTH", tag: "PERSISTENCE", cls: "text-pixel-green", b: "Sessions retain resolved effective models across restarts in ~/.ohgo/sessions.db. Unfinished states resume truthfully; unknown stays unknown." },
              { t: "I11. PROJECT IDENTITY", tag: "METADATA", cls: "text-pixel-amber", b: "<root>/.ohgo/project.yml establishes stable project identification without duplicating global session storage databases." },
              { t: "I18. AUDIT-FIRST SEAMS", tag: "ENGINE", cls: "text-gray-300", b: "Existing execution engine is preserved. Architectural changes occur only at defined seams through audit, minimal change, and verification." },
            ].map((c) => (
              <div key={c.t} className="pixel-box p-4 bg-panel-dark space-y-2">
                <div className={`${c.cls} font-bold flex items-center justify-between`}>
                  <span>{c.t}</span>
                  <span className="text-[10px] text-gray-500">{c.tag}</span>
                </div>
                <p className="text-gray-400">{c.b}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-border-pixel bg-panel-dark py-6 text-xs font-mono text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>OHGO Core Architecture Contract v1 — Human-Controlled Agent Runtime</div>
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
