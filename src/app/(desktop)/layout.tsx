import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Desktop shell for the bank-side RM console (distinct from the mobile app). */
export default function DesktopLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
        <div className="flex items-center gap-3">
          {/* IDBI emblem brand mark (white canvas blends on white header). */}
          <img src="/brand/idbi-emblem-sq.png" alt="IDBI Bank" width={36} height={36} decoding="async" className="h-9 w-9 object-contain" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">IDBI · Wealth Avatar</p>
            <p className="text-sm font-medium text-text-primary">Relationship Manager Console</p>
          </div>
        </div>
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary">
          <ArrowLeft size={16} /> Back to app
        </Link>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
