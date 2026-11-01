"use client";

import { memo, useCallback, useEffect, useId, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import {
  INSTALL_METHODS,
  POST_INSTALL_COMMAND,
  type InstallMethod,
  type InstallMethodId,
} from "@/lib/install";

type CopyState = "idle" | "copied" | "failed";
type Slot = "install" | "quick";

const STATE_LABEL: Record<CopyState, string> = {
  idle: "COPY",
  copied: "COPIED ✓",
  failed: "SELECT ABOVE",
};

function InstallBox() {
  const [methodId, setMethodId] = useState<InstallMethodId>(INSTALL_METHODS[0].id);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [quickState, setQuickState] = useState<CopyState>("idle");
  const baseId = useId();
  const timers = useRef<Partial<Record<Slot, ReturnType<typeof setTimeout>>>>({});

  useEffect(() => {
    const refs = timers.current;
    return () => {
      if (refs.install) clearTimeout(refs.install);
      if (refs.quick) clearTimeout(refs.quick);
    };
  }, []);

  const active: InstallMethod =
    INSTALL_METHODS.find((m) => m.id === methodId) ?? INSTALL_METHODS[0];

  const copy = useCallback(
    async (text: string, slot: Slot, setState: (s: CopyState) => void) => {
      const copied = await copyText(text);
      setState(copied ? "copied" : "failed");
      const previous = timers.current[slot];
      if (previous) clearTimeout(previous);
      timers.current[slot] = setTimeout(() => setState("idle"), 2200);
    },
    [],
  );

  const selectMethod = useCallback((id: InstallMethodId) => {
    setMethodId(id);
    setCopyState("idle");
  }, []);

  const onTabKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const index = INSTALL_METHODS.findIndex((m) => m.id === methodId);
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % INSTALL_METHODS.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + INSTALL_METHODS.length) % INSTALL_METHODS.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = INSTALL_METHODS.length - 1;
      else return;

      event.preventDefault();
      const id = INSTALL_METHODS[next].id;
      selectMethod(id);
      document.getElementById(`${baseId}-tab-${id}`)?.focus();
    },
    [baseId, methodId, selectMethod],
  );

  const copyButtonClass = (state: CopyState) =>
    state === "copied"
      ? "border-pixel-green bg-pixel-green text-[#0d1117]"
      : state === "failed"
        ? "border-pixel-amber text-pixel-amber hover:bg-pixel-amber/20"
        : "border-pixel-green text-pixel-green hover:bg-pixel-green/20";

  return (
    <div className="pixel-box p-0 bg-bg-dark border-2 border-border-pixel overflow-hidden">
      <div className="bg-panel-dark px-4 py-2 border-b-2 border-border-pixel flex items-center justify-between gap-3">
        <div className="flex items-center space-x-2 min-w-0">
          <span className="w-3 h-3 bg-red-500 rounded-none inline-block border border-red-700" />
          <span className="w-3 h-3 bg-yellow-500 rounded-none inline-block border border-yellow-700" />
          <span className="w-3 h-3 bg-green-500 rounded-none inline-block border border-green-700" />
          <span className="text-xs font-mono text-[var(--app-faint)] ml-2 truncate">
            install.sh — ohgo
          </span>
        </div>
        <div className="text-[10px] font-mono text-[var(--app-faint)] hidden sm:block shrink-0">
          SHA-256 VERIFIED · SELF-UPDATE: ohgo update
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Install method"
        onKeyDown={onTabKeyDown}
        className="px-4 pt-3 flex flex-wrap gap-2"
      >
        {INSTALL_METHODS.map((m) => {
          const selected = m.id === active.id;
          return (
            <button
              key={m.id}
              id={`${baseId}-tab-${m.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => selectMethod(m.id)}
              className={`px-2 py-1 border text-[11px] font-mono uppercase tracking-wide transition-colors ${
                selected
                  ? "border-pixel-green text-pixel-green bg-pixel-green/10"
                  : "border-border-pixel text-[var(--app-faint)] hover:text-[var(--app-ink)]"
              }`}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active.id}`}
        className="p-4 space-y-2"
      >
        <div className="flex flex-col sm:flex-row gap-2 sm:items-stretch">
          <div className="terminal-dark flex-1 min-w-0 border border-border-pixel px-3 py-2.5 font-mono text-xs leading-relaxed overflow-x-auto">
            {active.command.split("\n").map((line, i) => (
              <span key={`${active.id}-${i}`} className="block whitespace-pre">
                <span aria-hidden className="select-none text-gray-500">$ </span>
                <span className="select-all text-gray-100">{line}</span>
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void copy(active.command, "install", setCopyState)}
            className={`pixel-btn text-xs !py-1.5 !px-3 shrink-0 self-start sm:self-stretch transition-colors ${copyButtonClass(
              copyState,
            )}`}
            aria-label={
              copyState === "copied"
                ? `${active.label} command copied to clipboard`
                : `Copy ${active.label} command to clipboard`
            }
          >
            {STATE_LABEL[copyState]}
          </button>
        </div>

        <p className="text-[10px] font-mono text-[var(--app-faint)] leading-relaxed">
          {active.hint}
          {copyState === "failed" && (
            <span className="text-pixel-amber"> · Clipboard blocked — select the command and copy it manually.</span>
          )}
        </p>
        <span className="sr-only" role="status" aria-live="polite">
          {copyState === "copied"
            ? "Command copied to clipboard."
            : copyState === "failed"
              ? "Copy failed. Select the command and copy it manually."
              : ""}
        </span>
      </div>

      <div className="px-4 py-3 bg-panel-dark border-t border-border-pixel flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <span className="text-[10px] font-mono text-[var(--app-faint)] uppercase tracking-wider shrink-0">
          Then:
        </span>
        <code className="text-[11px] font-mono text-[var(--app-muted)] min-w-0 overflow-x-auto whitespace-nowrap">
          {POST_INSTALL_COMMAND}
        </code>
        <button
          type="button"
          onClick={() => void copy(POST_INSTALL_COMMAND, "quick", setQuickState)}
          className="px-2 py-1 text-[10px] font-mono border border-border-pixel text-[var(--app-faint)] hover:text-[var(--app-ink)] shrink-0 self-start sm:ml-auto"
          aria-label="Copy quick start commands to clipboard"
        >
          {quickState === "copied" ? "COPIED ✓" : quickState === "failed" ? "SELECT ABOVE" : "COPY"}
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {quickState === "copied" ? "Quick start commands copied to clipboard." : ""}
        </span>
      </div>
    </div>
  );
}

export default memo(InstallBox);
