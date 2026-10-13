export type WorkspaceKey = "ASK" | "FUZZ" | "BUILD";

export interface WorkspaceData {
  color: string;
  name: WorkspaceKey;
  title: string;
  mutation: string;
  colorName: string;
  statusTitle: string;
  statusDesc: string;
  emotion: string;
  promptSymbol: string;
  headerWs: string;
}

export const WORKSPACE_DATA: Record<WorkspaceKey, WorkspaceData> = {
  ASK: {
    color: "#2dd4bf",
    name: "ASK",
    title: "ASK [READ-ONLY]",
    mutation: "DENIED ✗",
    colorName: "Teal (#2dd4bf)",
    statusTitle: "OHGO BLOB — ASK MODE",
    statusDesc:
      "Analyzing symbols, reading specs, & planning tasks. No code changes allowed.",
    emotion: "CALM_REASONING",
    promptSymbol: "ask>",
    headerWs: "ask",
  },
  FUZZ: {
    color: "#f43f5e",
    name: "FUZZ",
    title: "FUZZ [EXPLORE/TEST]",
    mutation: "EXECUTE YES / MUTATE NO",
    colorName: "Magenta (#f43f5e)",
    statusTitle: "OHGO BLOB — FUZZ MODE",
    statusDesc:
      "Executing tests, probing edge cases & hunting bugs. Mutation strictly blocked.",
    emotion: "ADVERSARIAL_PROBING",
    promptSymbol: "fuzz>",
    headerWs: "fuzz",
  },
  BUILD: {
    color: "#3b82f6",
    name: "BUILD",
    title: "BUILD [MUTATE]",
    mutation: "ALLOWED ✓",
    colorName: "Blue (#3b82f6)",
    statusTitle: "OHGO BLOB — BUILD MODE",
    statusDesc:
      "Full repository mutation authority active. Modifying files & running verifications.",
    emotion: "AUTHORITATIVE_BUILD",
    promptSymbol: "build>",
    headerWs: "build",
  },
};

export const WORKSPACE_KEYS: WorkspaceKey[] = ["ASK", "FUZZ", "BUILD"];
