"use client";

import { ShieldCheck, ShieldAlert } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { formatINR } from "@/lib/format";
import { emergencyFundStatus } from "@/lib/rules/advisory";
import { liquidSavings, monthlyEssentialSpend } from "@/lib/rules/spend";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

/** Emergency-fund guard card. `detailed` adds the recovery plan breakdown. */
export function EmergencyFundCard({ detailed = false }: { detailed?: boolean }) {
  const { accounts, transactions, language } = useWealth();
  const ef = emergencyFundStatus(liquidSavings(accounts), monthlyEssentialSpend(transactions));
  const pct = (ef.monthsCovered / ef.targetMonths) * 100;

  return (
    <Card className={detailed ? "border-l-4 border-l-primary" : undefined}>
      <div className="flex items-start justify-between px-4 pt-4">
        <div className="flex items-center gap-2">
          <span className={ef.onTrack ? "text-success" : "text-warning"}>
            {ef.onTrack ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
          </span>
          <div>
            <p className="text-sm font-semibold text-text-primary">{t("home.emergencyFund", language)}</p>
            <p className="text-xs text-text-muted">
              {formatINR(ef.liquidSavings)} · {formatINR(ef.monthlyEssentialSpend)}/mo essential
            </p>
          </div>
        </div>
        <Badge tone={ef.onTrack ? "success" : "warning"}>
          {ef.monthsCovered} / {ef.targetMonths} {t("home.months", language)}
        </Badge>
      </div>
      <div className="px-4 py-4">
        <Progress value={ef.monthsCovered} max={ef.targetMonths} tone={ef.onTrack ? "success" : "warning"} />
        {detailed && !ef.onTrack && (
          <div className="mt-4 rounded-md bg-surface-hover p-3 text-sm text-text-primary">
            <p>
              Shortfall <span className="font-semibold">{formatINR(ef.shortfallAmount)}</span>. Saving{" "}
              <span className="font-semibold">{formatINR(ef.monthlyTopUpToRecover)}/mo</span> rebuilds your{" "}
              {ef.targetMonths}-month cushion in about{" "}
              <span className="font-semibold">{ef.monthsToRecover} months</span>.
            </p>
          </div>
        )}
        {detailed && ef.onTrack && (
          <p className="mt-3 text-sm text-text-muted">Your safety net is fully funded. Surplus can go toward goals or investments.</p>
        )}
      </div>
    </Card>
  );
}
