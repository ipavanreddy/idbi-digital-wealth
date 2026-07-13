"use client";

import Link from "next/link";
import { CalendarClock, MessageCircle } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { detectIncomeRhythm } from "@/lib/rules/spend";
import { formatINR } from "@/lib/format";
import { NetWorthCard } from "@/components/dashboard/NetWorthCard";
import { EmergencyFundCard } from "@/components/dashboard/EmergencyFundCard";
import { NudgeCard } from "@/components/dashboard/NudgeCard";
import { ConnectCard } from "@/components/dashboard/ConnectCard";
import { SpendDonut } from "@/components/spend/SpendDonut";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/Section";

/** Home / 360° dashboard. */
export default function HomePage() {
  const { transactions, nudges, language, today } = useWealth();
  const rhythm = detectIncomeRhythm(transactions);
  const topNudge = nudges[0];
  const month = today.slice(0, 7);

  return (
    <div className="space-y-5 p-4 pb-24">
      <NetWorthCard />

      <ConnectCard />

      {rhythm.detected && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-text-muted">
          <CalendarClock size={16} className="text-primary" />
          {t("home.salaryDetected", language)} <span className="font-semibold text-text-primary">{rhythm.salaryDay}</span> ·{" "}
          <span className="font-semibold text-text-primary">{formatINR(rhythm.averageMonthlyIncome)}</span>/mo
        </div>
      )}

      {topNudge && (
        <section>
          <SectionTitle title={t("home.topNudge", language)} />
          <NudgeCard nudge={topNudge} feature />
        </section>
      )}

      <EmergencyFundCard />

      <section>
        <SectionTitle
          title={t("home.spendThisMonth", language)}
          action={
            <Link href="/spend" className="text-xs font-medium text-primary">
              {t("home.viewAll", language)} →
            </Link>
          }
        />
        <Card>
          <div className="py-4">
            <SpendDonut month={month} />
          </div>
        </Card>
      </section>

      <Link href="/avatar">
        <Button className="w-full">
          <MessageCircle size={18} /> {t("home.talkToAvatar", language)}
        </Button>
      </Link>
    </div>
  );
}
