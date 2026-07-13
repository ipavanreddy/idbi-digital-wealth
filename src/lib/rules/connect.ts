import { monthKey } from "@/lib/format";
import type {
  AdditionalIncomeStatus,
  CompletenessItem,
  ConsentSettings,
  FrequentPlace,
  LinkedSource,
  ProfileCompleteness,
  Transaction,
} from "@/lib/types";
import { monthsInData } from "@/lib/rules/spend";

/**
 * Connect-module rules. The more sources a customer links and the more consents
 * they grant, the more of their money Saathi can see — and the more the bank
 * learns that a salary account alone never reveals (freelance income, real spend
 * geography). All deterministic; consent gates decide what is surfaced.
 */

interface CompletenessInputs {
  panLinked: boolean;
  sources: LinkedSource[];
  consents: ConsentSettings;
}

/**
 * Profile completeness — a checklist of the signals that sharpen advice. Score
 * is the share of items done (0–100). Gates how confident Saathi's advice is.
 */
export function profileCompleteness({ panLinked, sources, consents }: CompletenessInputs): ProfileCompleteness {
  const items: CompletenessItem[] = [
    { key: "bank", label: "Bank / savings account", done: sources.some((s) => s.type === "BANK") },
    { key: "card", label: "Credit / debit card", done: sources.some((s) => s.type === "CARD") },
    { key: "upi", label: "UPI ID", done: sources.some((s) => s.type === "UPI") },
    { key: "pan", label: "PAN linked", done: panLinked },
    { key: "txn", label: "Transaction access", done: consents.transactions },
  ];
  const done = items.filter((i) => i.done).length;
  return { score: Math.round((done / items.length) * 100), items };
}

/**
 * Detect income beyond the fixed salary: recurring non-salary credits (freelance,
 * consulting). Averaged over completed months so the "real income" figure is
 * conservative. Only meaningful once extra-income + transaction consent are on —
 * the caller enforces that gate.
 */
export function additionalIncomeStatus(transactions: Transaction[], salaryMonthly: number): AdditionalIncomeStatus {
  const fullMonths = monthsInData(transactions).slice(0, -1);
  const credits = transactions.filter(
    (t) => t.amount > 0 && !t.isSalary && fullMonths.includes(monthKey(t.date)),
  );
  const totalDetected = credits.reduce((sum, t) => sum + t.amount, 0);
  const monthsWithIncome = new Set(credits.map((t) => monthKey(t.date))).size;
  const averageMonthly = fullMonths.length > 0 ? Math.round(totalDetected / fullMonths.length) : 0;
  return {
    detected: totalDetected > 0,
    monthsWithIncome,
    totalDetected,
    averageMonthly,
    salaryMonthly,
    realMonthly: salaryMonthly + averageMonthly,
  };
}

/**
 * Most-frequented merchants this month — the compliant, consented reframing of
 * "where do you keep going". Surfaced only when location consent is granted.
 */
export function frequentMerchants(transactions: Transaction[], month: string, limit = 3): FrequentPlace[] {
  const byMerchant = new Map<string, FrequentPlace>();
  for (const t of transactions) {
    if (t.amount >= 0 || monthKey(t.date) !== month) continue;
    const existing = byMerchant.get(t.merchant);
    if (existing) {
      existing.visits += 1;
      existing.total += Math.abs(t.amount);
    } else {
      byMerchant.set(t.merchant, { merchant: t.merchant, visits: 1, total: Math.abs(t.amount), category: t.category });
    }
  }
  return Array.from(byMerchant.values())
    .filter((p) => p.visits >= 2)
    .sort((a, b) => b.visits - a.visits || b.total - a.total)
    .slice(0, limit);
}
