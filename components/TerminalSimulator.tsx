"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { WORKSPACE_DATA, type WorkspaceKey } from "@/lib/workspace";
import { evaluateCommand, type TerminalLine } from "@/lib/terminal";

/* RAM bound: terminal buffer capped; original grew unbounded via
   appendChild (DOM nodes + innerHTML strings never freed). */
const MAX_LINES = 120;

const TONE_CLASS: Record<TerminalLine["tone"], string> = {
  gray: "text-gray-300",
  teal: "text-ask-teal",
  red: "text-red-400",
  green: "text-pixel-green",
  magenta: "text-fuzz-magenta",
  amber: "text-pixel-amber",
  white: "text-white font-bold",
};

const LogRow = memo(function LogRow({ line }: { line: TerminalLine }) {
  return (
    <div
      className={TONE_CLASS[line.tone]}
      dangerouslySetInnerHTML={{ __html: line.html }}
    />
  );
});

interface Props {
  workspace: WorkspaceKey;
  onSupQuery: (q: string) => void;
  /** Lines injected from outside — appended on change. */
  externalLog?: { id: number; text: string } | null;
}

function TerminalSimulator({ workspace, onSupQuery, externalLog = null }: Props) {
  const data = WORKSPACE_DATA[workspace];
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 1, html: "OHGO Agent Runtime v1.0.0 [Target: Go Codebase]<br/>Authority pipeline: Workspace → Capability Policy → Tool Admission → Execution", tone: "gray" },
    { id: 2, html: "[ASK WORKSPACE LOADED] Read-only capabilities active. Model: provider/fast-model", tone: "teal" },
    { id: 3, html: 'Type <span class="text-pixel-amber">help</span>, select sample prompts below, or test write mutations.', tone: "gray" },
  ]);
  const idRef = useRef(4);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextId = useCallback(() => idRef.current++, []);

  const append = useCallback((fresh: TerminalLine[]) => {
    setLines((prev) => [...prev, ...fresh].slice(-MAX_LINES));
  }, []);

  // Announce workspace transitions (replaces original addTerminalLog side-effect in switchWorkspace)
  const lastWs = useRef<WorkspaceKey>(workspace);
  useEffect(() => {
    if (lastWs.current !== workspace) {
      lastWs.current = workspace;
      const d = WORKSPACE_DATA[workspace];
      append([
        { id: nextId(), html: `[WORKSPACE TRANSITION] Switching authority boundary → ${workspace}`, tone: "white" },
        { id: nextId(), html: `[CAPABILITY POLICY] Mutation authority updated: ${d.mutation}`, tone: "gray" },
      ]);
    }
  }, [workspace, append, nextId]);

  // Auto-scroll only if already near bottom (avoids yanking the user).
  useEffect(() => {
    const el = bodyRef.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
      el.scrollTop = el.scrollHeight;
    }
  }, [lines]);

  // External events — mirrors original addTerminalLog call.
  useEffect(() => {
    if (!externalLog) return;
    const text = externalLog.text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    append([{ id: nextId(), html: text, tone: "amber" }]);
  }, [externalLog, append, nextId]);

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      if (!cmd) return;
      if (cmd.startsWith("$sup")) {
        append(evaluateCommand(cmd, workspace, nextId));
        onSupQuery(cmd.replace("$sup", "").trim() || "What is authority boundary?");
        return;
      }
      append(evaluateCommand(cmd, workspace, nextId));
    },
    [workspace, append, nextId, onSupQuery],
  );

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const el = inputRef.current;
      if (!el) return;
      run(el.value);
      el.value = "";
    },
    [run],
  );

  const clear = useCallback(() => {
    setLines([
      { id: nextId(), html: `Terminal buffer cleared. Active workspace: ${workspace}`, tone: "gray" },
    ]);
  }, [workspace, nextId]);

  return (
    <div className="pixel-box p-0 bg-bg-dark border-2 border-border-pixel">
      <div className="bg-panel-dark px-4 py-2 border-b-2 border-border-pixel flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-none inline-block border border-red-700" />
          <span className="w-3 h-3 bg-yellow-500 rounded-none inline-block border border-yellow-700" />
          <span className="w-3 h-3 bg-green-500 rounded-none inline-block border border-green-700" />
          <span className="text-xs font-mono text-[var(--app-faint)] ml-2">
            ohgo-repl — workspace::{data.headerWs}
          </span>
        </div>
        <div className="text-[10px] font-mono text-[var(--app-faint)] hidden sm:block">
          PERSISTENCE: ~/.ohgo/sessions.db
        </div>
      </div>

      <div ref={bodyRef} className="terminal-dark p-4 h-80 overflow-y-auto font-mono text-xs space-y-3">
        {lines.map((l) => (
          <LogRow key={l.id} line={l} />
        ))}
      </div>

      <div className="px-4 py-2 bg-panel-dark/80 border-t border-border-pixel flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[var(--app-faint)] font-mono text-[10px]">PRESETS:</span>
        <button onClick={() => run("read internal/runtime.go")} className="px-2 py-1 bg-bg-dark text-[var(--app-muted)] hover:text-[var(--app-ink)] border border-border-pixel text-[11px]">
          Read Code
        </button>
        <button onClick={() => run("edit main.go")} className="px-2 py-1 bg-bg-dark text-fuzz-magenta hover:text-[var(--app-ink)] border border-fuzz-magenta/40 text-[11px]">
          Mutate File
        </button>
        <button onClick={() => run("go test -race ./...")} className="px-2 py-1 bg-bg-dark text-ask-teal hover:text-[var(--app-ink)] border border-ask-teal/40 text-[11px]">
          Run Race Test
        </button>
        <button onClick={() => run("$sup What is authority boundary?")} className="px-2 py-1 bg-bg-dark text-pixel-amber hover:text-[var(--app-ink)] border border-pixel-amber/40 text-[11px]">
          $sup Prompt
        </button>
        <button onClick={clear} className="ml-auto px-2 py-1 text-[var(--app-faint)] hover:text-[var(--app-muted)] text-[10px]">
          CLEAR
        </button>
      </div>

      <form onSubmit={onSubmit} className="p-3 bg-panel-dark border-t-2 border-border-pixel flex items-center gap-2">
        <span className="font-bold font-mono text-sm" style={{ color: data.color }}>
          {data.promptSymbol}
        </span>
        <input
          ref={inputRef}
          type="text"
          className="flex-grow bg-transparent text-[var(--app-ink)] font-mono text-xs focus:outline-none placeholder:text-[var(--app-faint)]"
          placeholder="Enter tool command or query (e.g. edit foo.go, read main.go)..."
          autoComplete="off"
          aria-label="Terminal command input"
        />
        <button type="submit" className="pixel-btn text-xs !py-1 !px-3">
          EXEC
        </button>
      </form>
    </div>
  );
}

export default memo(TerminalSimulator);
