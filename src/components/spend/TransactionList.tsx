"use client";

import { useWealth } from "@/lib/store";
import { CATEGORIES } from "@/lib/data/categories";
import { monthKey, formatDate, formatINR } from "@/lib/format";
import { chartColor } from "@/lib/chart";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

/** Bank-statement style ledger. Filters by month and caps to `limit` rows. */
export function TransactionList({ month, limit }: { month?: string; limit?: number }) {
  const { transactions } = useWealth();
  const rows = transactions.filter((t) => (month ? monthKey(t.date) === month : true)).slice(0, limit);

  if (rows.length === 0) {
    return <p className="py-8 text-center text-sm text-text-muted">No transactions for this period.</p>;
  }

  return (
    <ul className="divide-y divide-border">
      {rows.map((t) => {
        const cat = CATEGORIES[t.category];
        const credit = t.amount > 0;
        return (
          <li key={t.id} className="flex items-center gap-3 py-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
              style={{ backgroundColor: chartColor(cat.colorIndex), color: "white" }}
            >
              <Icon name={cat.icon} size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-text-primary">{t.merchant}</p>
                {t.injected && <Badge tone="accent">New</Badge>}
              </div>
              <p className="text-xs text-text-muted">
                {formatDate(t.date)} · {t.channel}
              </p>
            </div>
            <span className={cn("shrink-0 text-sm font-semibold", credit ? "text-success" : "text-text-primary")}>
              {credit ? "+" : "−"}
              {formatINR(Math.abs(t.amount))}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
