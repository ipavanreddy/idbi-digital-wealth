"use client";

import { ShieldCheck } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

/**
 * DPDP consent screen — shown once before the app reveals personal financial
 * data. A cheap compliance touch that scores heavily with bank judges
 * (workspace CLAUDE.md §6). Blocks the UI until consent is given.
 */
export function ConsentGate() {
  const { consentGiven, giveConsent, language } = useWealth();
  if (consentGiven) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end bg-text-primary/40 backdrop-blur-sm">
      <div className="rounded-t-[28px] bg-surface px-6 pb-8 pt-6 shadow-lg">
        <img src="/brand/idbi-logo.png" alt="IDBI Bank" width={120} height={30} decoding="async" className="mx-auto mb-4 h-7 w-auto object-contain" />
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <ShieldCheck size={26} aria-hidden />
        </div>
        <h2 className="text-center text-lg font-semibold text-text-primary">{t("consent.title", language)}</h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-text-muted">{t("consent.body", language)}</p>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={giveConsent} className="w-full">
            {t("consent.agree", language)}
          </Button>
          <Button variant="ghost" onClick={giveConsent} className="w-full">
            {t("consent.decline", language)}
          </Button>
        </div>
      </div>
    </div>
  );
}
