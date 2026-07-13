"use client";

import { useWealth } from "@/lib/store";
import { spendByCategory } from "@/lib/rules/spend";
import { CATEGORIES } from "@/lib/data/categories";
import { chartColor } from "@/lib/chart";
import { formatINR } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

/** Ranked category breakdown with share-of-spend bars. */
export function CategoryList({ month }: { month: string }) {
  const { transactions } = useWealth();
  const slices = spendByCategory(transactions, month);
  const total = slices.reduce((sum, s) => sum + s.total, 0);

  if (total === 0) return null;

  return (
    <ul className="divide-y divide-border">
      {slices.map((s) => {
        const pct = Math.round((s.total / total) * 100);
        return (
          <li key={s.category} className="flex items-center gap-3 py-3">
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
              style={{ backgroundColor: chartColor(s.colorIndex), color: "white" }}
            >
              <Icon name={CATEGORIES[s.category].icon} size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-text-primary">{s.label}</span>
                <span className="font-semibold text-text-primary">{formatINR(s.total)}</span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-hover">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: chartColor(s.colorIndex) }} />
                </div>
                <span className="w-8 text-right text-xs text-text-muted">{pct}%</span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
