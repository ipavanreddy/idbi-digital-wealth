"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Smartphone, UtensilsCrossed, RotateCcw, Monitor, X } from "lucide-react";
import { useWealth } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { IPHONE_AMOUNT, DINING_SPLURGE_AMOUNT } from "@/lib/data/seed";
import { cn } from "@/lib/cn";

/**
 * Presenter panel for driving the demo storyline live. Not part of the product
 * UI — it's the remote control the presenter taps to inject the iPhone purchase,
 * a dining splurge, open the RM console, or reset. Floating, dismissible.
 */
export function DemoControls() {
  const [open, setOpen] = useState(false);
  const { injectIphone, injectDining, resetDemo } = useWealth();

  return (
    <div className="pointer-events-none absolute bottom-20 right-3 z-20 flex flex-col items-end gap-2">
      {open && (
        <div className="pointer-events-auto w-60 rounded-lg border border-border bg-surface p-2 shadow-lg">
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-text-muted">Demo controls</p>
          <DemoButton icon={<Smartphone size={16} />} label={`Buy iPhone (${formatINR(IPHONE_AMOUNT)})`} onClick={injectIphone} />
          <DemoButton icon={<UtensilsCrossed size={16} />} label={`Log ${formatINR(DINING_SPLURGE_AMOUNT)} dining`} onClick={injectDining} />
          <Link href="/rm" className="block">
            <DemoButton icon={<Monitor size={16} />} label="Open RM Console" onClick={() => {}} />
          </Link>
          <DemoButton icon={<RotateCcw size={16} />} label="Reset demo" onClick={resetDemo} />
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "pointer-events-auto grid h-12 w-12 place-items-center rounded-full text-primary-foreground shadow-lg transition-colors",
          open ? "bg-primary-hover" : "bg-primary",
        )}
        aria-label="Toggle demo controls"
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
      </button>
    </div>
  );
}

function DemoButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm text-text-primary transition-colors hover:bg-surface-hover"
    >
      <span className="text-text-muted">{icon}</span>
      {label}
    </button>
  );
}
