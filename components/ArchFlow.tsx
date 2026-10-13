"use client";

import { memo, useCallback, useState } from "react";

const STEPS = [
  {
    n: 1,
    label: "ASK",
    sub: "Understand",
    artifact: "PLAN",
    color: "text-ask-teal",
    border: "border-ask-teal",
    hover: "hover:bg-ask-teal/10",
    title: "1. ASK WORKSPACE → PLAN ARTIFACT",
    body: "In ASK, the agent reads code, inspects dependencies, and formulates a structured PLAN artifact. Crucially, generating a plan gives zero write capability to the model.",
  },
  {
    n: 2,
    label: "FUZZ",
    sub: "Discover",
    artifact: "FINDING (fuzz-8f)",
    color: "text-fuzz-magenta",
    border: "border-fuzz-magenta",
    hover: "hover:bg-fuzz-magenta/10",
    title: "2. FUZZ WORKSPACE → FINDING ARTIFACT (fuzz-8f)",
    body: "The task transitions to FUZZ to reproduce issues, run stress tests, or execute race detectors. FUZZ outputs a structured FINDING artifact with observed logs and evidence.",
  },
  {
    n: 3,
    label: "BUILD",
    sub: "Change",
    artifact: "CHANGE / VERIFY",
    color: "text-build-blue",
    border: "border-build-blue",
    hover: "hover:bg-build-blue/10",
    title: "3. BUILD WORKSPACE → REPOSITORY MUTATION",
    body: "BUILD receives the FINDING artifact and executes code patches under full mutation authority. Verification builds are performed before completing the turn.",
  },
  {
    n: 4,
    label: "RE-FUZZ",
    sub: "Regression",
    artifact: "VERIFICATION",
    color: "text-pixel-green",
    border: "border-pixel-green",
    hover: "hover:bg-pixel-green/10",
    title: "4. RE-FUZZ → REGRESSION VERIFICATION",
    body: "The modified state is handed back to FUZZ to ensure adjacent failure modes and edge cases pass verification before final human acceptance.",
  },
] as const;

/** Interactive arch board — client island; only active-step index is state. */
function ArchFlow() {
  const [active, setActive] = useState<number | null>(null);
  const select = useCallback((n: number) => setActive(n), []);
  const detail = active != null ? STEPS[active - 1] : null;

  return (
    <div className="pixel-box p-6 bg-panel-dark space-y-6">
      <div className="text-xs font-mono text-[var(--app-muted)] uppercase tracking-wider mb-2">
        Canonical Loop &amp; Artifact Flow:
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center font-mono text-xs">
        {STEPS.map((s) => (
          <button
            key={s.n}
            onClick={() => select(s.n)}
            aria-pressed={active === s.n}
            className={`pixel-box p-4 bg-bg-dark border ${s.border} cursor-pointer ${s.hover} transition-all text-left ${
              active === s.n ? "scale-105 shadow-lg" : ""
            }`}
          >
            <div className={`${s.color} font-bold font-pixel text-xl mb-1 text-center`}>
              {s.n}. {s.label}
            </div>
            <div className="text-[var(--app-muted)] font-semibold mb-2 text-center">{s.sub}</div>
            <div className="text-[10px] text-[var(--app-faint)] bg-panel-dark p-2 border border-border-pixel text-center">
              Produces Artifact:<br />
              <span className={`${s.color} font-bold`}>{s.artifact}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-bg-dark p-4 border border-border-pixel font-mono text-xs space-y-2">
        <div className="text-pixel-amber font-semibold">
          {detail ? detail.title : "ARTIFACT HANDOFF CONTRACT"}
        </div>
        <div className="text-[var(--app-muted)] leading-relaxed">
          {detail
            ? detail.body
            : "Click on any architecture step above to inspect how structured artifacts bridge boundaries without passing implicit write authority across workspaces."}
        </div>
      </div>
    </div>
  );
}

export default memo(ArchFlow);
