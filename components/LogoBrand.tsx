"use client";

import { memo, type CSSProperties } from "react";
import Image from "next/image";
import { BASE_PATH } from "@/lib/base-path";

interface LogoBrandProps {
  /** "mini" for header (48px), "hero" for brand card (330px). */
  variant?: "mini" | "hero";
  /** Workspace accent used for the glow tint. */
  accent: string;
}

interface BrandStyle extends CSSProperties {
  "--brand-accent": string;
}

/**
 * Animated OHGO brand mark.
 *
 * Layered compositor-friendly motion (one animated property per layer):
 * - outer `.brand-float-*` — translate/rotate drift (existing logo-float)
 * - middle `.brand-blink` — slow scaleY squash emulating a blink
 * - img `.brand-glow` — accent-tinted drop-shadow pulse (filter only)
 * - `.brand-shine` — diagonal light sweep, clipped to the mark
 *
 * All motion is CSS-only (zero JS per frame) and disabled under
 * `prefers-reduced-motion`.
 */
function LogoBrand({ variant = "mini", accent }: LogoBrandProps) {
  const isMini = variant === "mini";
  const style: BrandStyle = { "--brand-accent": accent };

  return (
    <span className="brand" style={style}>
      <span className={`brand-float ${isMini ? "logo-float-mini" : "logo-float"}`}>
        <span className="brand-blink">
          <Image
            src={`${BASE_PATH}/ohgo-logo-pixel.svg`}
            alt="OHGO logo"
            width={isMini ? 48 : 330}
            height={isMini ? 32 : 220}
            className={`pixelated brand-glow${isMini ? "" : " h-auto w-full max-w-[330px]"}`}
            preload
          />
          <span className="brand-shine" aria-hidden />
        </span>
      </span>
    </span>
  );
}

export default memo(LogoBrand);
