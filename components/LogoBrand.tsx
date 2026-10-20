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
 * - outer `.brand-float logo-bounce` — up-down bounce on hero (right side)
 * - `.brand-swim` — fast tail-wag shimmy, tail-side origin (hero only)
 * - `.brand-breathe` — slow belly breathe scale (replaces whole-fish squash)
 * - img `.brand-glow` — accent-tinted halo, static drop-shadow + opacity pulse
 * - `.brand-dew` — subtle water droplets glinting on the mark (hero only)
 * - `.brand-bubbles` — pixel bubbles from the mouth (hero only)
 *
 * Mini header is static (no drift/glow) so chrome stays calm.
 * All motion is CSS-only (zero JS per frame) and disabled under
 * `prefers-reduced-motion`.
 */
function LogoBrand({ variant = "mini", accent }: LogoBrandProps) {
  const isMini = variant === "mini";
  const style: BrandStyle = { "--brand-accent": accent };

  return (
    <span className="brand" style={style}>
      <span className={`brand-float${isMini ? "" : " logo-bounce"}`}>
        <span className={isMini ? undefined : "brand-swim"}>
          <span className={isMini ? "brand-breathe-static" : "brand-breathe"}>
            <Image
              src={`${BASE_PATH}/ohgo-logo-pixel.svg`}
              alt="OHGO logo"
              width={isMini ? 48 : 330}
              height={isMini ? 32 : 220}
              className={`pixelated${isMini ? "" : " h-auto w-full max-w-[330px]"}`}
              preload
            />
            {!isMini && (
              // Glow twin: same bitmap (already preloaded/cached), painted
              // behind the mark. Only its drop-shadow halo escapes, and only
              // its opacity animates — see .brand-glow in globals.css.
              <Image
                src={`${BASE_PATH}/ohgo-logo-pixel.svg`}
                alt=""
                aria-hidden
                width={330}
                height={220}
                className="pixelated brand-glow"
              />
            )}
            {!isMini && (
              <span className="brand-dew" aria-hidden>
                <i />
                <i />
                <i />
              </span>
            )}
            {!isMini && (
              <span className="brand-bubbles" aria-hidden>
                <i />
                <i />
                <i />
              </span>
            )}
          </span>
        </span>
      </span>
    </span>
  );
}

export default memo(LogoBrand);
