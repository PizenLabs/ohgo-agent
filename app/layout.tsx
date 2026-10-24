import type { Metadata } from "next";
import { VT323, JetBrains_Mono } from "next/font/google";
import { BASE_PATH } from "@/lib/base-path";
import "./globals.css";

// next/font: self-hosted, zero render-blocking Google Fonts requests.
// `display: swap` avoids FOIT; subsets trimmed to latin.
const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["300", "400", "600", "800"],
  subsets: ["latin"],
  variable: "--font-mono2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OHGO — Human-Controlled Agent Runtime",
  // Directory-listing metadata (renders as <meta name="..."> tags), not
  // HTTP wire headers — no runtime code field carries category/description
  // on the wire.
  category: "agent runtime",
  description: "A human-controlled agent runtime built for real-world codebases.",
  metadataBase: new URL("https://pizenlabs.dev/ohgo-agent"),
  icons: {
    icon: `${BASE_PATH}/ohgo-logo.svg`,
    apple: `${BASE_PATH}/ohgo-logo.svg`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: browser extensions (dark-mode, grammar,
    // accessibility tools) commonly append classes to <html> before React
    // hydrates. Server output is byte-deterministic (verified); any residual
    // diff here is third-party DOM mutation, not app content.
    // data-theme defaults to dark; the inline script corrects it pre-paint
    // from localStorage / prefers-color-scheme to avoid a theme flash.
    // suppressHydrationWarning on <html> also covers that pre-paint rewrite.
    <html lang="en" data-theme="dark" className={`${vt323.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ohgo-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem('ohgo-motion');if(m!=='on'&&m!=='off'){m=window.matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on';}document.documentElement.dataset.motion=m;}catch(e){document.documentElement.dataset.motion='on';}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
