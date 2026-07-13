"use client";

import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useWealth } from "@/lib/store";
import { spendByCategory } from "@/lib/rules/spend";
import { chartColor } from "@/lib/chart";
import { formatINR, formatINRShort } from "@/lib/format";

/** Donut of categorised debits for a month, with the total in the centre. */
export function SpendDonut({ month }: { month: string }) {
  const { transactions } = useWealth();
  const slices = spendByCategory(transactions, month);
  const total = slices.reduce((sum, s) => sum + s.total, 0);

  if (total === 0) {
    return <p className="py-8 text-center text-sm text-text-muted">No spending recorded for this period.</p>;
  }

  return (
    <div className="relative mx-auto h-52 w-52">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={slices} dataKey="total" nameKey="label" innerRadius={64} outerRadius={90} paddingAngle={2} stroke="none">
            {slices.map((s) => (
              <Cell key={s.category} fill={chartColor(s.colorIndex)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xs text-text-muted">Total spend</span>
        <span className="text-xl font-semibold text-text-primary">{formatINR(total)}</span>
        <span className="text-[11px] text-text-muted">{formatINRShort(total)}</span>
      </div>
    </div>
  );
}
