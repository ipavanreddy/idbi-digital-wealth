"use client";

import Link from "next/link";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { goalPlan } from "@/lib/rules/advisory";
import { monthlyCategorySpend } from "@/lib/rules/spend";
import { formatINR, formatINRShort, formatDate } from "@/lib/format";
import type { Goal } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Icon } from "@/components/ui/Icon";

export function GoalCard({ goal }: { goal: Goal }) {
  const { transactions, language, today } = useWealth();
  const plan = goalPlan(goal, today, monthlyCategorySpend(transactions, "food"));
  const pct = Math.round((goal.savedAmount / goal.targetAmount) * 100);

  return (
    <Card>
      <div className="flex items-center gap-3 px-4 pt-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon name={goal.icon} size={18} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text-primary">{goal.name}</p>
          <p className="text-xs text-text-muted">{formatDate(goal.targetDate, true)}</p>
        </div>
        <Badge tone={plan.onTrack ? "success" : "warning"}>{plan.onTrack ? t("goals.onTrack", language) : t("goals.behind", language)}</Badge>
      </div>
      <div className="px-4 py-4">
        <div className="mb-1 flex justify-between text-sm">
          <span className="font-semibold text-text-primary">{formatINR(goal.savedAmount)}</span>
          <span className="text-text-muted">
            {t("goals.of", language)} {formatINR(goal.targetAmount)}
          </span>
        </div>
        <Progress value={goal.savedAmount} max={goal.targetAmount} tone={plan.onTrack ? "success" : "warning"} />
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-text-muted">{pct}% {t("goals.saved", language)}</span>
          <span className="text-text-muted">
            <span className="font-semibold text-text-primary">{formatINRShort(plan.requiredMonthly)}</span> {t("goals.needPerMonth", language)}
          </span>
        </div>
        {!plan.onTrack && (
          <div className="mt-3 rounded-md bg-warning/10 p-3 text-xs text-text-primary">
            {formatINR(plan.remaining)} left in {plan.monthsLeft} months. Keeping food near{" "}
            <span className="font-semibold">{formatINR(plan.suggestedFoodBudget)}</span> this month keeps it on track.
          </div>
        )}
        <Link href="/avatar" className="mt-3 inline-block">
          <Badge tone="primary" className="cursor-pointer hover:opacity-80">
            {t("goals.askAvatar", language)} →
          </Badge>
        </Link>
      </div>
    </Card>
  );
}
