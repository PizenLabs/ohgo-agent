import type { CSSProperties } from "react";
import { withBasePath } from "@/lib/base-path";

/**
 * Provider marks are vendored under `public/providers/` (sourced from
 * models.dev and Simple Icons) and rendered as CSS masks. That keeps the
 * section monochrome and theme-aware: the SVG only contributes an alpha
 * silhouette, so the icon inherits `currentColor` and stays quiet until
 * hover.
 */
type Provider = {
  id: string;
  name: string;
  note?: string;
  icon: string;
};

const PROVIDERS: Provider[] = [
  { id: "openai", name: "OpenAI", icon: "openai" },
  { id: "anthropic", name: "Anthropic", icon: "anthropic" },
  { id: "google", name: "Google", note: "Gemini API", icon: "google" },
  { id: "xai", name: "xAI", note: "Grok", icon: "xai" },
  { id: "mistral", name: "Mistral", icon: "mistral" },
  { id: "deepseek", name: "DeepSeek", icon: "deepseek" },
  { id: "aws-bedrock", name: "AWS Bedrock", icon: "amazon-bedrock" },
  { id: "google-vertex", name: "Google Vertex AI", icon: "google-vertex" },
  { id: "azure-openai", name: "Azure OpenAI", icon: "azure" },
  { id: "groq", name: "Groq", icon: "groq" },
  { id: "cerebras", name: "Cerebras", icon: "cerebras" },
  { id: "fireworks", name: "Fireworks", icon: "fireworks-ai" },
  { id: "together", name: "Together", icon: "togetherai" },
  { id: "openrouter", name: "OpenRouter", icon: "openrouter" },
  { id: "github-copilot", name: "GitHub Copilot", note: "Models", icon: "github-copilot" },
  { id: "opencode-go", name: "OpenCode Go", icon: "opencode-go" },
  { id: "opencode-zen", name: "OpenCode Zen", icon: "opencode-zen" },
  { id: "ollama", name: "Ollama", note: "local", icon: "ollama" },
  { id: "ollama-cloud", name: "Ollama Cloud", icon: "ollama-cloud" },
  { id: "custom", name: "Custom", note: "OpenAI-Compatible", icon: "custom" },
];

export default function Providers() {
  return (
    <section id="providers" className="space-y-5 pt-4 pb-8 scroll-mt-20">
      <div className="border-b-2 border-border-pixel pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 className="font-pixel text-2xl sm:text-3xl text-[var(--app-ink)] tracking-wide">
            06. PROVIDERS
          </h2>
          <p className="text-xs font-mono text-[var(--app-muted)]">
            Bring your own model backend. Provider choice never widens the runtime&apos;s authority boundary.
          </p>
        </div>
        <div className="text-xs font-mono text-[var(--app-faint)]">
          {PROVIDERS.length} BACKENDS · BRING YOUR OWN KEY
        </div>
      </div>

      <ul className="provider-grid" role="list" aria-label="Supported model providers">
        {PROVIDERS.map((provider) => (
          <li key={provider.id}>
            <span
              className="provider-chip"
              title={provider.note ? `${provider.name} (${provider.note})` : provider.name}
            >
              <span
                aria-hidden
                className="provider-icon"
                style={
                  {
                    "--provider-icon": `url("${withBasePath(`/providers/${provider.icon}.svg`)}")`,
                  } as CSSProperties
                }
              />
              <span className="provider-name">
                {provider.name}
                {provider.note && <span className="provider-note"> ({provider.note})</span>}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
