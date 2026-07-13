/**
 * Domain model for Wealth Avatar (Track 1). Every entity the demo storyline
 * touches lives here. All monetary values are in INR (paise-free rupees as
 * numbers). Debits are stored as negative amounts, credits positive.
 */

export type Segment = "MASS" | "AFFLUENT" | "HNI";
export type RiskProfile = "CONSERVATIVE" | "MODERATE" | "AGGRESSIVE";
export type Language = "en" | "hi";

export interface Customer {
  id: string;
  name: string;
  /** Placeholder avatar — swap for real asset later (see README). */
  avatarSeed: string;
  segment: Segment;
  age: number;
  city: string;
  monthlyIncome: number;
  riskProfile: RiskProfile;
  kycVerified: boolean;
  language: Language;
}

export type AccountType = "SAVINGS" | "INVESTMENT" | "DEPOSIT";

export interface Account {
  id: string;
  type: AccountType;
  name: string;
  maskedNumber: string;
  balance: number;
}

export type CategoryKey =
  | "income"
  | "food"
  | "shopping"
  | "bills"
  | "rent"
  | "transport"
  | "entertainment"
  | "investments"
  | "health"
  | "transfers"
  | "other";

export interface Category {
  key: CategoryKey;
  label: string;
  /** lucide-react icon name, resolved in the UI layer. */
  icon: string;
  /** Index into the design-system chart palette (--chart-N). */
  colorIndex: number;
  /** Essential spend counts toward the emergency-fund monthly-expense base. */
  essential: boolean;
}

export type TxnChannel = "UPI" | "CARD" | "NEFT" | "AUTO_DEBIT" | "SALARY";

export interface Transaction {
  id: string;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  merchant: string;
  /** Negative = debit, positive = credit. */
  amount: number;
  category: CategoryKey;
  channel: TxnChannel;
  isSalary?: boolean;
  /** True for transactions injected live during the demo (e.g. the iPhone). */
  injected?: boolean;
}

export type GoalType = "EMERGENCY_FUND" | "TRIP" | "PURCHASE" | "RETIREMENT";

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  icon: string;
  targetAmount: number;
  savedAmount: number;
  /** ISO date the customer wants to hit the target. */
  targetDate: string;
  monthlyContribution: number;
}

export type NudgeType =
  | "EMERGENCY_FUND"
  | "GOAL_RISK"
  | "SPEND_ALERT"
  | "INVEST_OPPORTUNITY"
  | "MARKET_UPDATE";

export type Severity = "info" | "success" | "warning" | "critical";

export interface Nudge {
  id: string;
  type: NudgeType;
  severity: Severity;
  title: string;
  body: string;
  createdAt: string;
  actionLabel?: string;
  relatedGoalId?: string;
  acknowledged: boolean;
}

export type LeadStatus = "NEW" | "CONTACTED" | "CLOSED";

export interface Lead {
  id: string;
  customerName: string;
  topic: string;
  detail: string;
  productInterest: string;
  /** True when the trigger is SEBI-regulated advice (why it escalated). */
  regulated: boolean;
  status: LeadStatus;
  assignedRM: string;
  createdAt: string;
}

export interface RelationshipManager {
  id: string;
  name: string;
  specialization: string;
}

export type ChatRole = "user" | "avatar";
export type ChatKind = "text" | "nudge" | "goalPlan" | "suitability" | "emergencyFund" | "lead";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  kind: ChatKind;
  text: string;
  createdAt: string;
  /** Optional structured payload the UI renders as a rich card. */
  meta?: Record<string, unknown>;
}

export interface MarketUpdate {
  id: string;
  instrument: string;
  headline: string;
  changePct: number;
  note: string;
}

/* ---------- Derived / computed (produced by the rules engine) ---------- */

export interface SpendSlice {
  category: CategoryKey;
  label: string;
  total: number;
  colorIndex: number;
}

export interface IncomeRhythm {
  detected: boolean;
  salaryDay: number | null;
  averageMonthlyIncome: number;
  lastSalaryDate: string | null;
}

export interface EmergencyFundStatus {
  monthlyEssentialSpend: number;
  liquidSavings: number;
  monthsCovered: number;
  targetMonths: number;
  onTrack: boolean;
  shortfallAmount: number;
  monthlyTopUpToRecover: number;
  monthsToRecover: number;
}

export interface GoalPlan {
  goalId: string;
  remaining: number;
  monthsLeft: number;
  requiredMonthly: number;
  currentMonthly: number;
  onTrack: boolean;
  /** Discretionary monthly food budget that still closes the goal on time. */
  suggestedFoodBudget: number;
}

export interface SuitabilityAssessment {
  riskProfile: RiskProfile;
  horizonYears: number;
  investableSurplus: number;
  regulatedRequest: boolean;
  allocation: { label: string; pct: number; colorIndex: number }[];
  rationale: string;
}
