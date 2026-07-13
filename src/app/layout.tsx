import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { WealthProvider } from "@/lib/store";

// Self-hosted (offline-safe). Inter covers Latin; Noto Devanagari covers Hindi.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const notoDev = Noto_Sans_Devanagari({ subsets: ["devanagari"], variable: "--font-noto-dev", display: "swap" });

export const metadata: Metadata = {
  title: "IDBI Wealth Avatar",
  description: "Avatar-based AI wealth advisor for the IDBI mobile app — Track 1, IDBI Innovate 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${notoDev.variable}`}>
      <body>
        <WealthProvider>{children}</WealthProvider>
      </body>
    </html>
  );
}
