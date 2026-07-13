"use client";

import { Sparkles, TrendingUp, MapPin, Lock } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { formatINR } from "@/lib/format";
import { additionalIncomeStatus, frequentMerchants } from "@/lib/rules/connect";
import { CATEGORIES } from "@/lib/data/categories";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { SectionTitle } from "@/components/ui/Section";

/**
 * The reason to connect: things a salary account alone never reveals. Each
 * insight is gated behind its consent — turned off, it shows a locked prompt so
 * the value of granting access is obvious.
 */
export function ConnectInsights() {
  const { transactions, customer, consents, language, today } = useWealth();
  const month = today.slice(0, 7);
  const income = additionalIncomeStatus(transactions, customer.monthlyIncome);
  const places = frequentMerchants(transactions, month);
  const incomeUnlocked = consents.extraIncome && consents.transactions;

  return (
    <section>
      <SectionTitle title={t("connect.found", language)} />
      <div className="space-y-3">
        {/* Hidden income */}
        {incomeUnlocked && income.detected ? (
          <Card className="border-l-4 border-l-accent">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-accent" />
                <p className="text-sm font-semibold text-text-primary">{t("connect.hiddenIncome", language)}</p>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xs text-text-muted">{t("connect.realIncome", language)}</p>
                  <p className="text-2xl font-semibold text-text-primary">{formatINR(income.realMonthly)}<span className="text-sm font-normal text-text-muted">/mo</span></p>
                </div>
                <Badge tone="accent">
                  <TrendingUp size={12} /> +{formatINR(income.averageMonthly)}/mo
                </Badge>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                {t("connect.bankSees", language)} {formatINR(income.salaryMonthly)} · {formatINR(income.totalDetected)} detected over {income.monthsWithIncome} months
              </p>
            </div>
          </Card>
        ) : (
          <LockedInsight icon={<TrendingUp size={16} />} title={t("connect.hiddenIncome", language)} language={language} />
        )}

        {/* Frequent places */}
        {consents.location && places.length > 0 ? (
          <Card>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <p className="text-sm font-semibold text-text-primary">{t("connect.frequentPlaces", language)}</p>
              </div>
              <ul className="mt-3 space-y-2">
                {places.map((p) => {
                  const cat = CATEGORIES[p.category];
                  return (
                    <li key={p.merchant} className="flex items-center gap-3 text-sm">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-hover text-text-muted">
                        <Icon name={cat.icon} size={14} />
                      </span>
                      <span className="flex-1 truncate text-text-primary">{p.merchant}</span>
                      <span className="text-xs text-text-muted">{p.visits} {t("connect.visits", language)}</span>
                      <span className="w-16 text-right font-medium text-text-primary">{formatINR(p.total)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Card>
        ) : (
          <LockedInsight icon={<MapPin size={16} />} title={t("connect.frequentPlaces", language)} language={language} />
        )}
      </div>
    </section>
  );
}

function LockedInsight({ icon, title, language }: { icon: React.ReactNode; title: string; language: "en" | "hi" }) {
  return (
    <Card className="border-dashed">
      <div className="flex items-center gap-3 p-4 text-text-muted">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-hover">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-primary">{title}</p>
          <p className="text-xs">{t("connect.enableToSee", language)}</p>
        </div>
        <Lock size={16} />
      </div>
    </Card>
  );
}
