"use client";

import { useState, useEffect, type CSSProperties } from "react";
import Link from "next/link";
import LogoBrand from "./LogoBrand";
import ThemeToggle from "./ThemeToggle";

const DOC_SECTIONS = [
  {
    id: "getting-started",
    title: "Getting Started",
    body: [
      "OHGO is a human-controlled agent runtime for real codebases. It enforces structural execution boundaries: models are untrusted proposal engines, while the runtime controls tool admission, capability policy, and state verification.",
      "Install the runtime, open your repository, and select a workspace authority boundary (ASK / FUZZ / BUILD) before issuing any turn. Each workspace grants a different mutation authority — see Workspaces below.",
    ],
  },
  {
    id: "workspaces",
    title: "The Three Workspaces",
    body: [
      "ASK (Teal) — read-only. Understand & reason: search, inspect, plan. Mutation authority: NONE.",
      "FUZZ (Magenta) — execute without mutating source: run commands, stress tests, reproduce bugs. Mutation authority: EXECUTE YES / MUTATE NO.",
      "BUILD (Blue) — sole repository mutation authority: patches, file creation, refactors, builds, verification.",
      "Workspaces are runtime authority boundaries, not UI themes. Ambiguity in intent always resolves downward to READ.",
    ],
  },
  {
    id: "terminal",
    title: "Terminal Simulator & Tool Admission",
    body: [
      "The runtime simulator demonstrates how tools are admitted or denied below the UI based on the active Capability Policy. Switch workspaces and observe which tool calls are allowed, refused, or redirected.",
      "Every turn is classified READ / EXECUTE / INVESTIGATE by a deterministic, model-free classifier. Delegation only narrows authority.",
    ],
  },
  {
    id: "sup",
    title: "$sup Ephemeral Query Layer",
    body: [
      "$sup opens a quick reference query layer on the SUP model role. It never alters main task history, persistent context, or workspace state. Sessions retain resolved effective models across restarts in ~/.ohgo/sessions.db.",
    ],
  },
  {
    id: "invariants",
    title: "Core Architectural Invariants",
    body: [
      "I1–I4: Exactly three primary workspaces; BUILD is the sole mutation authority.",
      "I5 & I14: Model output is an untrusted proposal; the capability policy enforces boundaries below the UI.",
      "I6 & I17: $sup is ephemeral and never mutates persistent state.",
      "I8 & I10: Sessions resume truthfully; unknown stays unknown.",
      "I11: <root>/.ohgo/project.yml establishes stable project identity.",
      "I21–I26: Intent routing is deterministic and model-free; ambiguity resolves to READ.",
      "I18: Audit-first seams — changes occur only at defined seams through audit, minimal change, and verification.",
    ],
  },
  {
    id: "completion",
    title: "Intent-Aware Turns & Completion",
    body: [
      "Authority is derived per turn; completion is a state transition, not a stop reason. Verdicts: COMPLETED, NEEDS_REVIEW, PAUSED, FAILED, CANCELLED.",
      "Exit codes: 0 / 2 / 3 / 1 / 130 respectively. Delegation only narrows authority; the UI projects build · ask/read for the turn, then clears it.",
    ],
  },
];

export default function InfoClient() {
  const [motionOn, setMotionOn] = useState(true);
  const [activeDoc, setActiveDoc] = useState(DOC_SECTIONS[0].id);
  useEffect(() => {
    setMotionOn(document.documentElement.dataset.motion !== "off");
  }, []);

  const toggleMotion = () => {
    setMotionOn((prev) => {
      const next = !prev;
      try {
        document.documentElement.dataset.motion = next ? "on" : "off";
        localStorage.setItem("ohgo-motion", next ? "on" : "off");
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col pixel-grid-bg text-sm">
      <div className="scanlines" aria-hidden />

      <header className="border-b-2 border-border-pixel bg-panel-dark/90 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LogoBrand variant="mini" accent="#2dd4bf" />
            <div>
              <Link href="/" className="font-pixel text-2xl tracking-wider text-[var(--app-ink)] flex items-center gap-2">
                <span className="brand-word" aria-label="OHGO">
                  <span>O</span><span>H</span><span>G</span><span>O</span>
                </span>{" "}
                <span className="text-xs font-mono px-1.5 py-0.5 bg-border-pixel/50 text-[var(--app-faint)] rounded-none border border-gray-600">
                  v1.0
                </span>
              </Link>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-mono" aria-label="Sections">
            <Link href="/" className="text-[var(--app-muted)] hover:text-ask-teal transition-colors">HOME</Link>
            <a href="#documentation" className="text-[var(--app-muted)] hover:text-ask-teal transition-colors">DOCUMENTATION</a>
            <Link href="/changelog" className="text-[var(--app-muted)] hover:text-ask-teal transition-colors">CHANGELOG</Link>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMotion}
              aria-pressed={motionOn}
              title="Toggle brand motion"
              className="pixel-btn text-xs !py-1 !px-2.5"
            >
              MOTION: {motionOn ? "ON" : "OFF"}
            </button>
            <a href="https://github.com/PizenLabs/ohgo" target="_blank" rel="noreferrer" className="pixel-btn text-xs !py-1 !px-2.5">
              GITHUB
            </a>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 space-y-12">
        {/* Title */}
        <section className="space-y-3 pt-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-panel-dark border border-border-pixel text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-pixel-green animate-pulse" />
            <span className="text-[var(--app-muted)]">DOCUMENTATION · TUTORIAL GUIDE</span>
          </div>
          <h1 className="font-pixel text-5xl sm:text-6xl text-[var(--app-ink)] tracking-wide leading-tight">
            DOCUMENTATION
          </h1>
          <p className="text-[var(--app-muted)] leading-relaxed max-w-2xl text-sm sm:text-base">
            Guidance on how to use OHGO — workspaces, tool admission, invariants, and completion.
          </p>
        </section>

        {/* Documentation */}
        <section id="documentation" className="space-y-6 py-4 scroll-mt-20">
          <div className="border-b-2 border-border-pixel pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-pixel text-3xl text-[var(--app-ink)] tracking-wide">DOCUMENTATION</h2>
              <p className="text-xs font-mono text-[var(--app-muted)]">How to use OHGO — workspaces, tool admission, invariants, and completion.</p>
            </div>
            <div className="text-xs font-mono text-[var(--app-faint)]">GUIDES</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Table of contents */}
            <aside className="md:col-span-4 lg:col-span-3 self-start">
              <div className="pixel-box p-4 bg-panel-dark space-y-1">
                <div className="text-[10px] font-mono text-[var(--app-faint)] uppercase tracking-wider pb-2 border-b border-border-pixel">
                  Contents
                </div>
                <nav className="flex flex-col" aria-label="Documentation contents">
                  {DOC_SECTIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveDoc(s.id)}
                      aria-current={activeDoc === s.id ? "true" : undefined}
                      className={`text-left text-xs font-mono px-2 py-2 border-l-2 transition-colors ${
                        activeDoc === s.id
                          ? "border-ask-teal text-ask-teal bg-ask-teal/10"
                          : "border-transparent text-[var(--app-muted)] hover:text-[var(--app-ink)] hover:border-border-pixel"
                      }`}
                    >
                      {s.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="md:col-span-8 lg:col-span-9">
              {DOC_SECTIONS.filter((s) => s.id === activeDoc).map((s) => (
                <div key={s.id} className="pixel-box p-6 bg-panel-dark space-y-4">
                  <div className="font-pixel text-3xl text-ask-teal tracking-wider border-b border-border-pixel pb-3">
                    {s.title}
                  </div>
                  <div className="space-y-3 text-sm text-[var(--app-muted)] leading-relaxed">
                    {s.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <div className="flex justify-between pt-4 border-t border-border-pixel text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        const idx = DOC_SECTIONS.findIndex((x) => x.id === activeDoc);
                        if (idx > 0) setActiveDoc(DOC_SECTIONS[idx - 1].id);
                      }}
                      disabled={DOC_SECTIONS.findIndex((x) => x.id === activeDoc) === 0}
                      className="pixel-btn text-xs !py-1 !px-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const idx = DOC_SECTIONS.findIndex((x) => x.id === activeDoc);
                        if (idx < DOC_SECTIONS.length - 1) setActiveDoc(DOC_SECTIONS[idx + 1].id);
                      }}
                      disabled={DOC_SECTIONS.findIndex((x) => x.id === activeDoc) === DOC_SECTIONS.length - 1}
                      className="pixel-btn text-xs !py-1 !px-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t-2 border-border-pixel bg-panel-dark py-6 text-xs font-mono text-[var(--app-faint)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Link href="/" className="hover:text-[var(--app-ink)] transition-colors">© PizenLabs</Link>
            <span className="hidden sm:inline">·</span>
            <span>LICENSE: Apache-2.0</span>
            <span className="hidden sm:inline">·</span>
            <Link href="/" className="hover:text-[var(--app-ink)] transition-colors">Back to home</Link>
            <span className="hidden sm:inline">·</span>
            <Link href="/changelog" className="hover:text-[var(--app-ink)] transition-colors">Changelog</Link>
          </div>
          <div className="flex space-x-4">
            <span>ASK: Teal</span>
            <span>FUZZ: Magenta</span>
            <span>BUILD: Blue</span>          </div>
        </div>
      </footer>
    </div>
  );
}
