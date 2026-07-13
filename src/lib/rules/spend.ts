import { CATEGORIES } from "@/lib/data/categories";
import { monthKey } from "@/lib/format";
import type {
  Account,
  CategoryKey,
  IncomeRhythm,
  SpendSlice,
  Transaction,
} from "@/lib/types";

/**
 * Spend-intelligence rules. Pure functions over the transaction stream — these
 * are the deterministic, auditable inputs the avatar later narrates.
 */

/** Distinct full-month buckets present in the data (partial current month excluded by caller). */
export function monthsInData(txns: Transaction[]): string[] {
  return Array.from(new Set(txns.map((t) => monthKey(t.date)))).sort();
}

/** Categorised debit totals for one month (or all-time if month omitted). */
export function spendByCategory(txns: Transaction[], month?: string): SpendSlice[] {
  const totals = new Map<CategoryKey, number>();
  for (const t of txns) {
    if (t.amount >= 0) continue; // debits only
    if (month && monthKey(t.date) !== month) continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + Math.abs(t.amount));
  }
  return Array.from(totals.entries())
    .map(([category, total]) => ({
      category,
      label: CATEGORIES[category].label,
      total,
      colorIndex: CATEGORIES[category].colorIndex,
    }))
    .sort((a, b) => b.total - a.total);
}

/** Total spend in a category for a given month. */
export function categorySpendThisMonth(txns: Transaction[], category: CategoryKey, month: string): number {
  return txns
    .filter((t) => t.amount < 0 && t.category === category && monthKey(t.date) === month)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

/**
 * Detect the salary rhythm: the recurring credit tagged as salary. Returns the
 * modal credit day, the average amount, and the most recent salary date.
 */
export function detectIncomeRhythm(txns: Transaction[]): IncomeRhythm {
  const salary = txns.filter((t) => t.isSalary);
  if (salary.length === 0) {
    return { detected: false, salaryDay: null, averageMonthlyIncome: 0, lastSalaryDate: null };
  }
  const dayCounts = new Map<number, number>();
  let sum = 0;
  let last = salary[0].date;
  for (const s of salary) {
    const day = Number(s.date.split("-")[2]);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
    sum += s.amount;
    if (s.date > last) last = s.date;
  }
  const salaryDay = Array.from(dayCounts.entries()).sort((a, b) => b[1] - a[1])[0][0];
  return {
    detected: true,
    salaryDay,
    averageMonthlyIncome: Math.round(sum / salary.length),
    lastSalaryDate: last,
  };
}

/** Average monthly spend for a predicate over the completed months only. */
function averageMonthly(txns: Transaction[], keep: (t: Transaction) => boolean): number {
  const months = monthsInData(txns);
  // Exclude the current (partial) month so averages aren't understated.
  const fullMonths = months.slice(0, -1);
  if (fullMonths.length === 0) return 0;
  const total = txns
    .filter((t) => t.amount < 0 && keep(t) && fullMonths.includes(monthKey(t.date)))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  return Math.round(total / fullMonths.length);
}

/** Average monthly ESSENTIAL spend — the emergency-fund base. */
export function monthlyEssentialSpend(txns: Transaction[]): number {
  return averageMonthly(txns, (t) => CATEGORIES[t.category].essential);
}

/** Average monthly discretionary (non-essential, non-investment) spend. */
export function monthlyDiscretionarySpend(txns: Transaction[]): number {
  return averageMonthly(txns, (t) => !CATEGORIES[t.category].essential && t.category !== "investments");
}

/** Average monthly spend in a single category. */
export function monthlyCategorySpend(txns: Transaction[], category: CategoryKey): number {
  return averageMonthly(txns, (t) => t.category === category);
}

/** Free monthly cash after all recurring outflows (income − every debit). */
export function investableSurplus(txns: Transaction[], monthlyIncome: number): number {
  const totalOut = averageMonthly(txns, () => true);
  return Math.max(0, monthlyIncome - totalOut);
}

/** Sum of all account balances. */
export function netWorth(accounts: Account[]): number {
  return accounts.reduce((sum, a) => sum + a.balance, 0);
}

/** Liquid savings = balance of SAVINGS accounts (what backs the emergency fund). */
export function liquidSavings(accounts: Account[]): number {
  return accounts.filter((a) => a.type === "SAVINGS").reduce((sum, a) => sum + a.balance, 0);
}
