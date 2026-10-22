"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LogoBrand from "./LogoBrand";
import ThemeToggle from "./ThemeToggle";

const CHANGELOG = [
  {
    version: "v1.0.0",
    date: "2026-10-22",
    tag: "INITIAL",
    items: [
      "Initial public release of the OHGO human-controlled agent runtime landing site.",
      "Three workspaces (ASK, FUZZ, BUILD) with distinct mutation authority boundaries.",
      "Runtime simulator demonstrating capability-policy tool admission.",
      "Architecture & artifact handoff explorer.",
      "Core architectural invariants and intent-aware turn matrix.",
      "$sup ephemeral query layer modal.",
      "Dark/light theme toggle with reduced-motion support.",
    ],
  },
  {
    version: "v0.9.0",
    date: "2026-09-30",
    tag: "PREVIEW",
    items: [
      "Static export build for GitHub Pages with basePath support.",
      "Self-hosted VT323 + JetBrains Mono via next/font.",
      "Tailwind v4 theme tokens replacing CDN JIT.",
    ],
  },
];

export default function ChangelogClient() {
  const [motionOn, setMotionOn] = useState(true);
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
            <Link href="/info" className="text-[var(--app-muted)] hover:text-ask-teal transition-colors">DOCUMENTATION</Link>
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
        <section className="space-y-3 pt-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-panel-dark border border-border-pixel text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-pixel-green animate-pulse" />
            <span className="text-[var(--app-muted)]">CHANGELOG · RELEASE HISTORY</span>
          </div>
          <h1 className="font-pixel text-5xl sm:text-6xl text-[var(--app-ink)] tracking-wide leading-tight">
            CHANGELOG
          </h1>
          <p className="text-[var(--app-muted)] leading-relaxed max-w-2xl text-sm sm:text-base">
            Latest updates and changes to the OHGO platform.
          </p>
        </section>

        <section className="space-y-6 pt-4 scroll-mt-20">
          <div className="border-b-2 border-border-pixel pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-pixel text-3xl text-[var(--app-ink)] tracking-wide">RELEASES</h2>
              <p className="text-xs font-mono text-[var(--app-muted)]">Newest first.</p>
            </div>
            <div className="text-xs font-mono text-[var(--app-faint)]">CHANGELOG</div>
          </div>

          <div className="space-y-6">
            {CHANGELOG.map((entry) => (
              <div key={entry.version} className="pixel-box p-5 bg-panel-dark space-y-3">
                <div className="flex flex-wrap items-center gap-3 border-b border-border-pixel pb-2">
                  <span className="font-pixel text-2xl text-build-blue tracking-wider">{entry.version}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-build-blue/10 text-build-blue border border-build-blue/30">{entry.tag}</span>
                  <span className="text-xs font-mono text-[var(--app-faint)] ml-auto">{entry.date}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[var(--app-muted)] list-disc pl-5">
                  {entry.items.map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
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
            <Link href="/info" className="hover:text-[var(--app-ink)] transition-colors">Documentation</Link>
          </div>
          <div className="flex space-x-4">
            <span>ASK: Teal</span>
            <span>FUZZ: Magenta</span>
            <span>BUILD: Blue</span>
          </div>
        </div>
      </footer>
    </div>
  );
}