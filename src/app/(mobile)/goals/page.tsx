"use client";

import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { EmergencyFundCard } from "@/components/dashboard/EmergencyFundCard";
import { GoalCard } from "@/components/goals/GoalCard";
import { VoiceGoalCapture } from "@/components/goals/VoiceGoalCapture";
import { SectionTitle } from "@/components/ui/Section";

/** Goals: the emergency-fund guard (detailed) + each savings goal. */
export default function GoalsPage() {
  const { goals, language } = useWealth();

  return (
    <div className="space-y-5 p-4 pb-24">
      <h1 className="text-lg font-semibold text-text-primary">{t("goals.title", language)}</h1>

      <VoiceGoalCapture />

      <section>
        <SectionTitle title={t("home.emergencyFund", language)} />
        <EmergencyFundCard detailed />
      </section>

      <section className="space-y-3">
        <SectionTitle title={t("goals.title", language)} />
        {goals.map((g) => (
          <GoalCard key={g.id} goal={g} />
        ))}
      </section>
    </div>
  );
}
