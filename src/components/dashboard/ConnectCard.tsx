"use client";

import Link from "next/link";
import { Link2, ChevronRight } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { profileCompleteness } from "@/lib/rules/connect";
import { Progress } from "@/components/ui/Progress";

/**
 * Home CTA into the Connect module. Hidden once the profile is fully connected;
 * otherwise nudges the customer to link more so Saathi sees the full picture.
 */
export function ConnectCard() {
  const { pan, linkedSources, consents, language } = useWealth();
  const { score } = profileCompleteness({ panLinked: !!pan, sources: linkedSources, consents });
  if (score >= 100) return null;

  return (
    <Link href="/connect" className="block">
      <div className="rounded-xl border border-border bg-surface p-4 shadow-sm transition-colors hover:bg-surface-hover">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
            <Link2 size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary">{t("connect.ctaTitle", language)}</p>
            <p className="truncate text-xs text-text-muted">{t("connect.ctaSub", language)}</p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-text-muted" />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Progress value={score} max={100} tone="accent" />
          <span className="shrink-0 text-xs font-medium text-text-muted">
            {t("connect.sees", language)} {score}%
          </span>
        </div>
      </div>
    </Link>
  );
}
