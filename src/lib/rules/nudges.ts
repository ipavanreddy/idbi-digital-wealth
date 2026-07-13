import { formatINR, formatINRShort } from "@/lib/format";
import type { Account, Customer, Goal, Nudge, Severity, Transaction } from "@/lib/types";
import { emergencyFundStatus, goalPlan } from "@/lib/rules/advisory";
import {
  categorySpendThisMonth,
  investableSurplus,
  liquidSavings,
  monthlyCategorySpend,
  monthlyEssentialSpend,
} from "@/lib/rules/spend";

const SEVERITY_RANK: Record<Severity, number> = { critical: 0, warning: 1, info: 2, success: 3 };

interface NudgeInputs {
  customer: Customer;
  accounts: Account[];
  transactions: Transaction[];
  goals: Goal[];
  today: string;
}

/**
 * The nudge engine. Deterministic rules translate the current financial state
 * into prioritised, event-tied nudges. No randomness, no LLM — every nudge is
 * reproducible and explainable, which is what bank auditors ask for. The avatar
 * layer rephrases these into its voice at delivery time.
 */
export function computeNudges({ customer, accounts, transactions, goals, today }: NudgeInputs): Nudge[] {
  const month = today.slice(0, 7);
  const essential = monthlyEssentialSpend(transactions);
  const ef = emergencyFundStatus(liquidSavings(accounts), essential);
  const surplus = investableSurplus(transactions, customer.monthlyIncome);
  const nudges: Nudge[] = [];

  // 1) Emergency-fund guard — the headline behaviour.
  if (!ef.onTrack) {
    nudges.push({
      id: "nudge-ef",
      type: "EMERGENCY_FUND",
      severity: ef.monthsCovered < 3 ? "critical" : "warning",
      title: `Emergency fund is at ${ef.monthsCovered} months`,
      body: `Your safety net covers ${ef.monthsCovered} of a target ${ef.targetMonths} months. Setting aside ${formatINR(ef.monthlyTopUpToRecover)}/month rebuilds it to ${ef.targetMonths} months in about ${ef.monthsToRecover} months.`,
      createdAt: today,
      actionLabel: "See recovery plan",
      acknowledged: false,
    });
  } else {
    nudges.push({
      id: "nudge-ef",
      type: "EMERGENCY_FUND",
      severity: "success",
      title: `Emergency fund secured — ${ef.monthsCovered} months`,
      body: `Nicely done. Your liquid savings cover ${ef.monthsCovered} months of essential expenses, at or above the ${ef.targetMonths}-month target.`,
      createdAt: today,
      acknowledged: false,
    });
  }

  // 2) Goal-risk nudges for savings goals.
  const avgFood = monthlyCategorySpend(transactions, "food");
  for (const goal of goals) {
    if (goal.type === "RETIREMENT") continue;
    const plan = goalPlan(goal, today, avgFood);
    if (!plan.onTrack) {
      nudges.push({
        id: `nudge-goal-${goal.id}`,
        type: "GOAL_RISK",
        severity: "warning",
        title: `${goal.name} needs ${formatINRShort(plan.requiredMonthly)}/mo`,
        body: `${formatINR(plan.remaining)} to go in ${plan.monthsLeft} months. You're saving ${formatINRShort(plan.currentMonthly)}/mo — ${formatINRShort(plan.requiredMonthly - plan.currentMonthly)} short. Capping food near ${formatINR(plan.suggestedFoodBudget)} this month closes the gap.`,
        createdAt: today,
        actionLabel: "Recompute plan",
        relatedGoalId: goal.id,
        acknowledged: false,
      });
    }
  }

  // 3) Spend alert — dining running hotter than usual this month.
  const foodThisMonth = categorySpendThisMonth(transactions, "food", month);
  if (avgFood > 0 && foodThisMonth > avgFood * 1.15) {
    nudges.push({
      id: "nudge-spend-food",
      type: "SPEND_ALERT",
      severity: "warning",
      title: "Dining is above your usual pace",
      body: `You've spent ${formatINR(foodThisMonth)} on food this month vs a ${formatINR(avgFood)} average. Worth a glance before month-end.`,
      createdAt: today,
      acknowledged: false,
    });
  }

  // 4) Invest opportunity — only once the safety net is intact.
  if (ef.onTrack && surplus >= 20000) {
    nudges.push({
      id: "nudge-invest",
      type: "INVEST_OPPORTUNITY",
      severity: "info",
      title: `${formatINRShort(surplus)}/mo could be working harder`,
      body: `Your emergency fund is set and about ${formatINR(surplus)} of monthly surplus is sitting in savings. A step-up SIP could put it to work — want to explore suitable options?`,
      createdAt: today,
      actionLabel: "Explore options",
      acknowledged: false,
    });
  }

  return nudges.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
}
