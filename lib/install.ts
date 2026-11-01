export type InstallMethodId = "script" | "go" | "source" | "docker";

export interface InstallMethod {
  id: InstallMethodId;
  label: string;
  hint: string;
  /** Exact command text copied to the clipboard (may be multi-line). */
  command: string;
}

/** Install paths published in the upstream README, kept verbatim so the
 *  copy button can never drift from the documented command. */
export const INSTALL_METHODS: InstallMethod[] = [
  {
    id: "script",
    label: "CURL | SH",
    hint: "Prebuilt release · verifies sha256sums.txt · installs to $HOME/.local/bin",
    command:
      "curl -fsSL https://raw.githubusercontent.com/PizenLabs/ohgo/main/install.sh | sh",
  },
  {
    id: "go",
    label: "GO INSTALL",
    hint: "Requires Go 1.27+ · static binary, CGO_ENABLED=0",
    command: "go install github.com/PizenLabs/ohgo/cmd/ohgo@latest",
  },
  {
    id: "source",
    label: "FROM SOURCE",
    hint: "Clone, build the static binary, then run ./ohgo --help",
    command:
      "git clone https://github.com/PizenLabs/ohgo.git\ncd ohgo\nmake build",
  },
  {
    id: "docker",
    label: "DOCKER",
    hint: "Distroless static image · non-root · mounts the current directory",
    command: 'make docker\ndocker run -it -v "$PWD:/work" ohgo:dev',
  },
];

/** Commands shown after install; the first two are the documented smoke path. */
export const POST_INSTALL_COMMAND = "ohgo init && ohgo doctor && ohgo";
