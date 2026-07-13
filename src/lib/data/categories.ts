import type { Category, CategoryKey } from "@/lib/types";

/**
 * Spend taxonomy. `essential: true` categories form the base for the
 * emergency-fund monthly-expense calculation (rent, bills, food, transport,
 * health) — discretionary spend (shopping, entertainment) is excluded so the
 * fund target reflects survivable, not lifestyle, cost.
 */
export const CATEGORIES: Record<CategoryKey, Category> = {
  income: { key: "income", label: "Income", icon: "Wallet", colorIndex: 4, essential: false },
  food: { key: "food", label: "Food & Dining", icon: "UtensilsCrossed", colorIndex: 2, essential: true },
  shopping: { key: "shopping", label: "Shopping", icon: "ShoppingBag", colorIndex: 5, essential: false },
  bills: { key: "bills", label: "Bills & Utilities", icon: "ReceiptText", colorIndex: 6, essential: true },
  rent: { key: "rent", label: "Rent", icon: "Home", colorIndex: 1, essential: true },
  transport: { key: "transport", label: "Transport", icon: "Car", colorIndex: 3, essential: true },
  entertainment: { key: "entertainment", label: "Entertainment", icon: "Clapperboard", colorIndex: 7, essential: false },
  investments: { key: "investments", label: "Investments", icon: "TrendingUp", colorIndex: 0, essential: false },
  health: { key: "health", label: "Health", icon: "HeartPulse", colorIndex: 4, essential: true },
  transfers: { key: "transfers", label: "Transfers", icon: "ArrowLeftRight", colorIndex: 3, essential: false },
  other: { key: "other", label: "Other", icon: "Circle", colorIndex: 7, essential: false },
};

export const CATEGORY_LIST: Category[] = Object.values(CATEGORIES);

export function categoryOf(key: CategoryKey): Category {
  return CATEGORIES[key];
}
