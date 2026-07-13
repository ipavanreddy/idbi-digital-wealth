import { monthsBetween } from "@/lib/format";
import type {
  Customer,
  EmergencyFundStatus,
  Goal,
  GoalPlan,
  SuitabilityAssessment,
} from "@/lib/types";

/**
 * Advisory math (Shristi's financial rules). These decide WHAT the advice is;
 * the avatar layer only phrases it. Keeping the numbers here keeps advice
 * auditable — a banker can trace every figure to a rule, not an LLM.
 *
 * The constants below are the domain knobs most worth reviewing.
 */
export const ADVISORY_CONFIG = {
  /** Months of essential expenses a healthy emergency fund should cover. */
  emergencyFundTargetMonths: 6,
  /** Monthly amount assumed available to rebuild the fund (from surplus). */
  defaultRecoveryTopUp: 20000,
  /** Never advise cutting monthly food below this floor. */
  minMonthlyFoodBudget: 8000,
} as const;

/**
 * Emergency-fund guard. Coverage = liquid savings ÷ monthly essential spend.
 * Below target it computes the shortfall and how long a monthly top-up takes
 * to rebuild — the exact figures the "iPhone dropped you to 4 months" nudge
 * quotes.
 */
export function emergencyFundStatus(
  liquidSavings: number,
  monthlyEssentialSpend: number,
  targetMonths = ADVISORY_CONFIG.emergencyFundTargetMonths,
): EmergencyFundStatus {
  const safeMonthly = Math.max(1, monthlyEssentialSpend);
  const monthsCovered = liquidSavings / safeMonthly;
  const targetAmount = targetMonths * safeMonthly;
  const shortfallAmount = Math.max(0, targetAmount - liquidSavings);
  const topUp = ADVISORY_CONFIG.defaultRecoveryTopUp;
  const monthsToRecover = shortfallAmount > 0 ? Math.ceil(shortfallAmount / topUp) : 0;
  return {
    monthlyEssentialSpend: safeMonthly,
    liquidSavings,
    monthsCovered: Math.round(monthsCovered * 10) / 10,
    targetMonths,
    onTrack: monthsCovered >= targetMonths - 0.05,
    shortfallAmount,
    monthlyTopUpToRecover: topUp,
    monthsToRecover,
  };
}

/**
 * Goal plan + food-budget recompute. Given a goal and today, work out the
 * monthly contribution required to hit it on time; if the customer is behind,
 * suggest a food budget that funds the gap without starving them.
 */
export function goalPlan(
  goal: Goal,
  today: string,
  avgMonthlyFood: number,
): GoalPlan {
  const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
  const monthsLeft = Math.max(1, monthsBetween(today, goal.targetDate));
  const requiredMonthly = Math.ceil(remaining / monthsLeft);
  const gap = Math.max(0, requiredMonthly - goal.monthlyContribution);
  const suggestedFoodBudget = Math.max(
    ADVISORY_CONFIG.minMonthlyFoodBudget,
    Math.round((avgMonthlyFood - gap) / 100) * 100,
  );
  return {
    goalId: goal.id,
    remaining,
    monthsLeft,
    requiredMonthly,
    currentMonthly: goal.monthlyContribution,
    onTrack: goal.monthlyContribution >= requiredMonthly,
    suggestedFoodBudget,
  };
}

/**
 * Suitability assessment → target asset allocation. Direct stock picks are
 * SEBI-regulated: `regulatedRequest` marks a request the app must NOT answer
 * itself — it routes to a human RM. The allocation guidance below is generic
 * (non-regulated) and safe to show.
 */
export function suitability(
  customer: Customer,
  investableSurplus: number,
  regulatedRequest: boolean,
): SuitabilityAssessment {
  const horizonYears = customer.age < 35 ? 15 : customer.age < 50 ? 10 : 5;
  const byProfile: Record<Customer["riskProfile"], { label: string; pct: number; colorIndex: number }[]> = {
    CONSERVATIVE: [
      { label: "Debt / Bonds", pct: 50, colorIndex: 2 },
      { label: "Equity (index)", pct: 25, colorIndex: 0 },
      { label: "Liquid", pct: 15, colorIndex: 3 },
      { label: "Gold", pct: 10, colorIndex: 1 },
    ],
    MODERATE: [
      { label: "Equity (index)", pct: 50, colorIndex: 0 },
      { label: "Debt / Bonds", pct: 30, colorIndex: 2 },
      { label: "Gold", pct: 10, colorIndex: 1 },
      { label: "Liquid", pct: 10, colorIndex: 3 },
    ],
    AGGRESSIVE: [
      { label: "Equity (index)", pct: 70, colorIndex: 0 },
      { label: "Debt / Bonds", pct: 15, colorIndex: 2 },
      { label: "Liquid", pct: 10, colorIndex: 3 },
      { label: "Gold", pct: 5, colorIndex: 1 },
    ],
  };
  return {
    riskProfile: customer.riskProfile,
    horizonYears,
    investableSurplus,
    regulatedRequest,
    allocation: byProfile[customer.riskProfile],
    rationale:
      `Based on your ${customer.riskProfile.toLowerCase()} risk profile, a ${horizonYears}-year horizon, ` +
      `and roughly ${investableSurplus > 0 ? "surplus" : "tight"} monthly cash flow, a diversified index-led mix ` +
      `suits you better than single stocks. Specific stock recommendations are SEBI-regulated and handled by a certified relationship manager.`,
  };
}
