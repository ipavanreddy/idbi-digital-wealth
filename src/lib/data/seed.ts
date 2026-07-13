import type {
  Account,
  ConsentSettings,
  Customer,
  Goal,
  LinkedSource,
  MarketUpdate,
  RelationshipManager,
  Transaction,
} from "@/lib/types";

/**
 * Deterministic synthetic dataset for the demo customer "Ravi".
 * SYNTHETIC ONLY — no real PII or financials (workspace CLAUDE.md §6).
 *
 * A seeded PRNG makes the 6-month transaction stream identical on every load,
 * so the figures the avatar quotes always match the charts.
 */

/** The demo's "today". Everything is dated relative to this. */
export const DEMO_TODAY = "2026-07-13";

/** iPhone injected live during the demo — the emergency-fund trigger. */
export const IPHONE_AMOUNT = 120000;
export const DINING_SPLURGE_AMOUNT = 10000;

/** mulberry32 — tiny deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const RAVI: Customer = {
  id: "cust-ravi",
  name: "Ravi Kumar",
  avatarSeed: "ravi", // placeholder identity — real avatar asset TBD
  segment: "AFFLUENT",
  age: 31,
  city: "Bengaluru",
  monthlyIncome: 120000,
  riskProfile: "MODERATE",
  kycVerified: true,
  language: "en",
};

/**
 * Liquid savings (₹3.6L) = exactly 6 months of Ravi's ≈₹60k essential spend.
 * Investment + deposit sit outside the emergency-fund calculation.
 */
export const SEED_ACCOUNTS: Account[] = [
  { id: "acc-sav", type: "SAVINGS", name: "IDBI Savings", maskedNumber: "•••• 4821", balance: 360000 },
  { id: "acc-inv", type: "INVESTMENT", name: "Mutual Fund Folio", maskedNumber: "•••• MF07", balance: 218500 },
  { id: "acc-fd", type: "DEPOSIT", name: "Fixed Deposit", maskedNumber: "•••• 9033", balance: 150000 },
];

export const SEED_GOALS: Goal[] = [
  {
    id: "goal-europe",
    name: "Europe Trip",
    type: "TRIP",
    icon: "Plane",
    targetAmount: 500000,
    savedAmount: 380000,
    targetDate: "2026-10-15",
    monthlyContribution: 35000,
  },
  {
    id: "goal-home",
    name: "Home Downpayment",
    type: "PURCHASE",
    icon: "Home",
    targetAmount: 2000000,
    savedAmount: 640000,
    targetDate: "2029-04-01",
    monthlyContribution: 25000,
  },
];

export const RELATIONSHIP_MANAGERS: RelationshipManager[] = [
  { id: "rm-1", name: "Priya Nair", specialization: "Equity & Mutual Funds (SEBI RIA)" },
  { id: "rm-2", name: "Arjun Mehta", specialization: "Retirement & Insurance Planning" },
];

/**
 * Connect module — what Ravi has linked at the start of the demo: just his IDBI
 * salary account (via the bank relationship). Cards, UPI and PAN are unlinked so
 * the "connect more → sharper advice" arc has somewhere to go.
 */
export const SEED_LINKED_SOURCES: LinkedSource[] = [
  { id: "src-idbi-sav", type: "BANK", label: "IDBI Savings", detail: "•••• 4821", linkedVia: "AA", linkedOn: "2026-01-02" },
];

/** Banks selectable in the Account-Aggregator link flow. */
export const BANK_DIRECTORY = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "IDBI Bank",
];

/** Default consents: an existing customer already shares his IDBI txn data. */
export const SEED_CONSENTS: ConsentSettings = {
  transactions: true,
  location: false,
  extraIncome: false,
};

/**
 * Irregular non-salary credits — freelance/consulting income the bank never sees
 * on a salary account. Detected once the customer grants "extra-income" consent.
 * Keyed yyyy-mm; deliberately sporadic to read like real freelance work.
 */
const FREELANCE_BY_MONTH: Record<string, { amount: number; merchant: string; day: number }> = {
  "2026-02": { amount: 55000, merchant: "Freelance — Brightcove Studio", day: 18 },
  "2026-04": { amount: 40000, merchant: "Freelance — Nova Labs consulting", day: 14 },
  "2026-05": { amount: 72000, merchant: "Freelance — weekend workshop series", day: 22 },
  "2026-06": { amount: 48000, merchant: "Freelance — Brightcove Studio", day: 9 },
  "2026-07": { amount: 60000, merchant: "Freelance — Nova Labs consulting", day: 8 },
};

export const MARKET_UPDATES: MarketUpdate[] = [
  { id: "mkt-1", instrument: "NIFTY 50", headline: "Nifty holds above 24,800 on IT strength", changePct: 0.62, note: "Large-cap allocation steady." },
  { id: "mkt-2", instrument: "Gold (MCX)", headline: "Gold cools 0.4% as yields firm", changePct: -0.41, note: "A dip window for your gold SIP." },
  { id: "mkt-3", instrument: "10Y G-Sec", headline: "Yields ease to 6.92%", changePct: -0.18, note: "Debt funds marginally positive." },
];

/* ---------------- Transaction stream generator ---------------- */

interface RecurringSpec {
  day: number;
  merchant: string;
  amount: number;
  category: Transaction["category"];
  channel: Transaction["channel"];
  isSalary?: boolean;
}

const RECURRING: RecurringSpec[] = [
  { day: 1, merchant: "Acme Technologies Payroll", amount: 120000, category: "income", channel: "SALARY", isSalary: true },
  { day: 3, merchant: "Prestige Apartments Rent", amount: -28000, category: "rent", channel: "AUTO_DEBIT" },
  { day: 5, merchant: "Groww SIP — Flexi Cap", amount: -15000, category: "investments", channel: "AUTO_DEBIT" },
  { day: 8, merchant: "BESCOM Electricity", amount: -5400, category: "bills", channel: "AUTO_DEBIT" },
  { day: 10, merchant: "ACT Fibernet + Airtel", amount: -1800, category: "bills", channel: "AUTO_DEBIT" },
  { day: 12, merchant: "Netflix + Spotify", amount: -1100, category: "entertainment", channel: "CARD" },
];

const FOOD_MERCHANTS = ["Swiggy", "Zomato", "BigBasket", "Blinkit", "More Supermarket", "Third Wave Coffee"];
const SHOP_MERCHANTS = ["Amazon", "Flipkart", "Myntra", "Croma", "Nike Store"];
const TRANSPORT_MERCHANTS = ["Uber", "Ola", "Indian Oil", "Namma Metro"];
const HEALTH_MERCHANTS = ["Apollo Pharmacy", "Cult.fit", "PharmEasy"];
const FUN_MERCHANTS = ["PVR Cinemas", "BookMyShow", "Toit Brewpub"];

/** Months to generate: Jan–Jun 2026 fully, plus July up to DEMO_TODAY. */
const MONTHS = [
  { y: 2026, m: 1, days: 31 },
  { y: 2026, m: 2, days: 28 },
  { y: 2026, m: 3, days: 31 },
  { y: 2026, m: 4, days: 30 },
  { y: 2026, m: 5, days: 31 },
  { y: 2026, m: 6, days: 30 },
  { y: 2026, m: 7, days: 13 },
];

function iso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function pick<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

/** Build the full deterministic 6-month transaction history. */
export function generateTransactions(): Transaction[] {
  const rng = mulberry32(20260713);
  const txns: Transaction[] = [];
  let seq = 0;
  const add = (t: Omit<Transaction, "id">) => {
    txns.push({ ...t, id: `txn-${String(seq++).padStart(4, "0")}` });
  };

  for (const { y, m, days } of MONTHS) {
    // Recurring debits/credits (only those whose day has occurred this month).
    for (const r of RECURRING) {
      if (r.day <= days) {
        add({ date: iso(y, m, r.day), merchant: r.merchant, amount: r.amount, category: r.category, channel: r.channel, isSalary: r.isSalary });
      }
    }
    // Irregular freelance credit (non-salary income) if this month has one.
    const freelance = FREELANCE_BY_MONTH[`${y}-${String(m).padStart(2, "0")}`];
    if (freelance && freelance.day <= days) {
      add({ date: iso(y, m, freelance.day), merchant: freelance.merchant, amount: freelance.amount, category: "income", channel: "NEFT" });
    }
    // Variable spend, deterministic counts scaled to a partial month.
    const scale = days / 30;
    const foodCount = Math.round(9 * scale);
    for (let i = 0; i < foodCount; i++) {
      const day = 2 + Math.floor(rng() * (days - 2));
      add({ date: iso(y, m, day), merchant: pick(rng, FOOD_MERCHANTS), amount: -Math.round((350 + rng() * 1900) / 10) * 10, category: "food", channel: "UPI" });
    }
    const transportCount = Math.round(4 * scale);
    for (let i = 0; i < transportCount; i++) {
      const day = 2 + Math.floor(rng() * (days - 2));
      add({ date: iso(y, m, day), merchant: pick(rng, TRANSPORT_MERCHANTS), amount: -Math.round((200 + rng() * 1600) / 10) * 10, category: "transport", channel: "UPI" });
    }
    const shopCount = Math.round(2 * scale);
    for (let i = 0; i < shopCount; i++) {
      const day = 2 + Math.floor(rng() * (days - 2));
      add({ date: iso(y, m, day), merchant: pick(rng, SHOP_MERCHANTS), amount: -Math.round((1500 + rng() * 6000) / 10) * 10, category: "shopping", channel: "CARD" });
    }
    if (rng() > 0.4) {
      const day = 2 + Math.floor(rng() * (days - 2));
      add({ date: iso(y, m, day), merchant: pick(rng, HEALTH_MERCHANTS), amount: -Math.round((800 + rng() * 4200) / 10) * 10, category: "health", channel: "UPI" });
    }
    const funCount = Math.round(1.5 * scale);
    for (let i = 0; i < funCount; i++) {
      const day = 2 + Math.floor(rng() * (days - 2));
      add({ date: iso(y, m, day), merchant: pick(rng, FUN_MERCHANTS), amount: -Math.round((500 + rng() * 2500) / 10) * 10, category: "entertainment", channel: "CARD" });
    }
  }

  // Newest first — the ledger reads top-down like a bank statement.
  return txns.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
