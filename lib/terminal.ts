import type { WorkspaceKey } from "./workspace";

export interface TerminalLine {
  id: number;
  html: string;
  tone: "gray" | "teal" | "red" | "green" | "magenta" | "amber" | "white";
}

/**
 * Pure command evaluator — identical admission logic to the original
 * `runCommand`, extracted so it is unit-testable and allocates no DOM.
 * Returns new lines to append (caller caps the buffer for RAM).
 */
export function evaluateCommand(
  cmd: string,
  workspace: WorkspaceKey,
  nextId: () => number,
): TerminalLine[] {
  const symbol =
    workspace === "ASK" ? "ask>" : workspace === "FUZZ" ? "fuzz>" : "build>";
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const echo: TerminalLine = {
    id: nextId(),
    html: `<span class="text-gray-500">${symbol}</span> ${esc(cmd)}`,
    tone: "gray",
  };

  if (cmd.startsWith("$sup")) {
    return [
      echo,
      {
        id: nextId(),
        html: "[$sup] Opening ephemeral support overlay — main session untouched.",
        tone: "amber",
      },
    ];
  }

  if (cmd === "help") {
    return [
      echo,
      {
        id: nextId(),
        html: `Available Commands &amp; Tools:<br/>- <span class="text-ask-teal">read &lt;file&gt;</span> : Read source (ASK, FUZZ, BUILD)<br/>- <span class="text-fuzz-magenta">go test ./...</span> : Execute tests (FUZZ, BUILD)<br/>- <span class="text-build-blue">edit &lt;file&gt; / write &lt;file&gt;</span> : Mutate (BUILD ONLY)<br/>- <span class="text-pixel-amber">$sup &lt;query&gt;</span> : Ephemeral support`,
        tone: "gray",
      },
    ];
  }

  if (
    cmd.startsWith("edit") ||
    cmd.startsWith("write") ||
    cmd.startsWith("rm") ||
    cmd.startsWith("patch")
  ) {
    if (workspace !== "BUILD") {
      return [
        echo,
        {
          id: nextId(),
          html: `<span class="text-red-400 font-bold">[CAPABILITY DENIED]</span> workspace=${workspace.toLowerCase()} operation=write<br/><span class="text-gray-400">⊢ Reason: Invariant I2/I3 — mutation forbidden outside BUILD.</span>`,
          tone: "red",
        },
      ];
    }
    return [
      echo,
      {
        id: nextId(),
        html: `<span class="text-pixel-green font-bold">[ADMITTED &amp; EXECUTED]</span> workspace=build tool=edit<br/><span class="text-gray-300">⊢ Truthful state updated. Verification required.</span>`,
        tone: "green",
      },
    ];
  }

  if (
    cmd.startsWith("read") ||
    cmd.startsWith("grep") ||
    cmd.startsWith("glob") ||
    cmd.startsWith("ls")
  ) {
    return [
      echo,
      {
        id: nextId(),
        html: `<span class="text-ask-teal font-bold">[ADMITTED]</span> tool=read status=success<br/><span class="text-gray-400">⊢ Returned 142 lines from target source file.</span>`,
        tone: "teal",
      },
    ];
  }

  if (cmd.includes("test") || cmd.includes("bash")) {
    if (workspace === "ASK") {
      return [
        echo,
        {
          id: nextId(),
          html: `<span class="text-red-400 font-bold">[CAPABILITY DENIED]</span> workspace=ask operation=execute<br/><span class="text-gray-400">⊢ ASK is read-only. Switch to FUZZ or BUILD.</span>`,
          tone: "red",
        },
      ];
    }
    return [
      echo,
      {
        id: nextId(),
        html: `<span class="text-fuzz-magenta font-bold">[ADMITTED &amp; EXECUTED]</span> tool=bash command="${esc(cmd)}"<br/><span class="text-gray-300">⊢ PASS: 18 tests, 0 failures. No repo mutation.</span>`,
        tone: "magenta",
      },
    ];
  }

  return [
    echo,
    {
      id: nextId(),
      html: `[RUNTIME] Evaluated under ${workspace} capability policy. Executed safely.`,
      tone: "gray",
    },
  ];
}

export function answerSup(q: string): string {
  const lq = q.toLowerCase();
  if (lq.includes("authority"))
    return "Authority boundaries are static runtime invariants (ASK=Read, FUZZ=Execute, BUILD=Mutate). Models cannot grant themselves authority.";
  if (lq.includes("fallback") || lq.includes("model"))
    return "Model resolution follows: CLI flag → Workspace Model → Global Default Model → Built-in Catalog Fallback.";
  if (lq.includes("ast"))
    return "OHGO includes a pure Go ported AST search tool for fast structural code introspection without native cgo dependencies.";
  return "$sup queries run on the SUP model role using ephemeral context. Answers never enter your primary session history or task transcripts.";
}
