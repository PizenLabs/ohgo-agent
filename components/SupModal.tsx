"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { answerSup } from "@/lib/terminal";

interface Entry {
  id: number;
  kind: "q" | "a";
  text: string;
}

interface Props {
  open: boolean;
  initialQuery: string;
  onClose: () => void;
}

/**
 * $sup ephemeral modal. Rendered via next/dynamic (code-split, not in
 * initial bundle). Escape-to-close + autofocus preserved from original.
 */
function SupModal({ open, initialQuery, onClose }: Props) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const idRef = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Seed with the query that opened the modal (terminal $sup / header button).
  useEffect(() => {
    if (open && initialQuery) {
      const q = initialQuery;
      setEntries((prev) =>
        [...prev, { id: idRef.current++, kind: "q" as const, text: q }, { id: idRef.current++, kind: "a" as const, text: answerSup(q) }].slice(-40),
      );
    }
  }, [open, initialQuery]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open ]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [entries]);

  const onSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const el = inputRef.current;
    const q = el?.value.trim();
    if (!q) return;
    if (el) el.value = "";
    setEntries((prev) =>
      [...prev, { id: idRef.current++, kind: "q" as const, text: q }, { id: idRef.current++, kind: "a" as const, text: answerSup(q) }].slice(-40),
    );
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="$sup ephemeral support">
      <div className="pixel-box w-full max-w-xl bg-panel-dark border-2 border-pixel-amber p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-pixel pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-pixel-amber animate-ping" />
            <span className="font-pixel text-2xl text-pixel-amber tracking-wider">$sup — EPHEMERAL SUPPORT SURFACE</span>
          </div>
          <button onClick={onClose} className="text-[var(--app-faint)] hover:text-[var(--app-ink)] font-mono text-sm px-2" aria-label="Close support modal">
            ESC [X]
          </button>
        </div>

        <div className="text-xs font-mono text-[var(--app-muted)] bg-bg-dark p-3 border border-border-pixel space-y-1">
          <div><span className="text-pixel-amber">&gt; $sup</span> Transient reference query layer</div>
          <div className="text-[11px] text-[var(--app-faint)]">Invariant I17: Does not pollute main session context, create tasks, or mutate workspace authority.</div>
        </div>

        <div ref={boxRef} className="terminal-dark h-40 overflow-y-auto p-3 border border-border-pixel font-mono text-xs space-y-2 text-gray-300">
          {entries.length === 0 && (
            <div className="text-gray-500">// Type a quick question below (e.g. &quot;What is Go AST search?&quot;, &quot;Explain model fallback&quot;)</div>
          )}
          {entries.map((en) =>
            en.kind === "q" ? (
              <div key={en.id} className="text-pixel-amber font-semibold">&gt; $sup {en.text}</div>
            ) : (
              <div key={en.id} className="text-gray-300 pl-3 border-l border-pixel-amber/40 py-1">{en.text}</div>
            ),
          )}
        </div>

        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-grow bg-bg-dark border border-border-pixel p-2 text-xs font-mono text-[var(--app-ink)] placeholder:text-[var(--app-faint)] focus:border-pixel-amber focus:outline-none"
            placeholder="Ask $sup a reference question..."
            autoComplete="off"
            aria-label="$sup question input"
          />
          <button type="submit" className="pixel-btn text-xs !py-1 !px-4 border-pixel-amber text-pixel-amber hover:bg-pixel-amber/20">
            QUERY
          </button>
        </form>
      </div>
    </div>
  );
}

export default memo(SupModal);
