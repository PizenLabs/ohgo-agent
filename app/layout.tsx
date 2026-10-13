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
  description:
    "OHGO enforces structural execution boundaries across your codebase. Models are untrusted proposal engines.",
  metadataBase: new URL("https://ohgo.dev"),
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
    <html lang="en" className={`${vt323.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
