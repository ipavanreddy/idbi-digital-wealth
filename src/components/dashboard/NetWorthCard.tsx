"use client";

import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { formatINR } from "@/lib/format";
import { netWorth } from "@/lib/rules/spend";
import type { AccountType } from "@/lib/types";

const LABEL_KEY: Record<AccountType, Parameters<typeof t>[0]> = {
  SAVINGS: "home.savings",
  INVESTMENT: "home.investments",
  DEPOSIT: "home.deposits",
};

/** Hero card: total net worth + a per-account breakdown. */
export function NetWorthCard() {
  const { accounts, language } = useWealth();
  const total = netWorth(accounts);

  return (
    <div
      className="rounded-xl p-5 text-primary-foreground shadow-md"
      style={{ background: "linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-primary-hover)) 100%)" }}
    >
      <p className="text-xs font-medium uppercase tracking-wide opacity-80">{t("home.netWorth", language)}</p>
      <p className="mt-1 text-3xl font-semibold">{formatINR(total)}</p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {accounts.map((a) => (
          <div key={a.id} className="rounded-lg bg-primary-foreground/10 px-2.5 py-2">
            <p className="text-[11px] opacity-80">{t(LABEL_KEY[a.type], language)}</p>
            <p className="mt-0.5 text-sm font-semibold">{formatINR(a.balance)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
