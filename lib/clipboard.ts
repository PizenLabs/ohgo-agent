/**
 * Copy text with the async Clipboard API and a legacy fallback.
 *
 * `navigator.clipboard` needs a secure context (and can still reject when the
 * document is unfocused or permission is denied), so a hidden textarea is kept
 * as the second attempt. Returns whether a copy was actually performed.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to the legacy path */
    }
  }
  return legacyCopy(text);
}

function legacyCopy(text: string): boolean {
  if (typeof document === "undefined") return false;

  const previousFocus = document.activeElement as HTMLElement | null;
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.setAttribute("aria-hidden", "true");
  area.style.position = "fixed";
  area.style.top = "-9999px";
  area.style.left = "-9999px";
  area.style.opacity = "0";

  document.body.appendChild(area);
  let copied = false;
  try {
    area.select();
    area.setSelectionRange(0, text.length);
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  } finally {
    area.remove();
    previousFocus?.focus?.();
  }
  return copied;
}
