"use client";

import { useState } from "react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { SpendDonut } from "@/components/spend/SpendDonut";
import { CategoryList } from "@/components/spend/CategoryList";
import { TransactionList } from "@/components/spend/TransactionList";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/Section";
import { cn } from "@/lib/cn";

/** Spend intelligence: donut + category breakdown + full ledger, per month. */
export default function SpendPage() {
  const { language, today } = useWealth();
  const thisMonth = today.slice(0, 7);
  const lastMonth = "2026-06";
  const [month, setMonth] = useState(thisMonth);

  const tabs: { key: string; label: string }[] = [
    { key: thisMonth, label: "This month" },
    { key: lastMonth, label: "Last month" },
  ];

  return (
    <div className="space-y-5 p-4 pb-24">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{t("spend.title", language)}</h1>
      </div>

      <div className="flex gap-1 rounded-full border border-border p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMonth(tab.key)}
            className={cn(
              "flex-1 rounded-full py-1.5 text-xs font-medium transition-colors",
              month === tab.key ? "bg-primary text-primary-foreground" : "text-text-muted hover:bg-surface-hover",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <div className="py-4">
          <SpendDonut month={month} />
        </div>
      </Card>

      <section>
        <SectionTitle title={t("spend.byCategory", language)} />
        <Card>
          <div className="px-4">
            <CategoryList month={month} />
          </div>
        </Card>
      </section>

      <section>
        <SectionTitle title={t("spend.transactions", language)} />
        <Card>
          <div className="px-4">
            <TransactionList month={month} />
          </div>
        </Card>
      </section>
    </div>
  );
}
