"use client";

import { Check } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { profileCompleteness } from "@/lib/rules/connect";
import { cn } from "@/lib/cn";

/**
 * "Saathi sees X% of your money" — a radial gauge plus the checklist of signals.
 * The score is what gates how confident Saathi's advice can be.
 */
export function CompletenessMeter() {
  const { pan, linkedSources, consents, language } = useWealth();
  const { score, items } = profileCompleteness({ panLinked: !!pan, sources: linkedSources, consents });

  const r = 34;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);

  return (
    <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
            <circle cx="40" cy="40" r={r} fill="none" stroke="rgb(var(--color-surface-hover))" strokeWidth="8" />
            <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              stroke="rgb(var(--color-primary))"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold text-text-primary">{score}%</span>
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-text-primary">{t("connect.sees", language)} {score}%</p>
          <p className="text-xs text-text-muted">{t("connect.subtitle", language)}</p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-1 gap-1.5">
        {items.map((item) => (
          <li key={item.key} className="flex items-center gap-2 text-sm">
            <span
              className={cn(
                "grid h-5 w-5 place-items-center rounded-full",
                item.done ? "bg-success text-primary-foreground" : "bg-surface-hover text-text-muted",
              )}
            >
              {item.done ? <Check size={12} strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-text-muted" />}
            </span>
            <span className={item.done ? "text-text-primary" : "text-text-muted"}>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
