"use client";

import { BellOff } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { NudgeCard } from "@/components/dashboard/NudgeCard";
import { MarketUpdates } from "@/components/alerts/MarketUpdates";
import { SectionTitle } from "@/components/ui/Section";

/** Alerts & nudges feed + market-linked updates. */
export default function AlertsPage() {
  const { nudges, language } = useWealth();
  const active = nudges.filter((n) => !n.acknowledged);

  return (
    <div className="space-y-5 p-4 pb-24">
      <h1 className="text-lg font-semibold text-text-primary">{t("alerts.title", language)}</h1>

      {active.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center text-text-muted">
          <BellOff size={28} />
          <p className="text-sm">{t("alerts.empty", language)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((n) => (
            <NudgeCard key={n.id} nudge={n} dismissible />
          ))}
        </div>
      )}

      <section>
        <SectionTitle title={t("alerts.market", language)} />
        <MarketUpdates />
      </section>
    </div>
  );
}
