"use client";

import { ArrowLeftRight, MapPin, IndianRupee } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t, type TKey } from "@/lib/i18n";
import type { ConsentKey } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";

const ROWS: { key: ConsentKey; icon: typeof MapPin; labelKey: TKey; descKey: TKey }[] = [
  { key: "transactions", icon: ArrowLeftRight, labelKey: "connect.cTxn", descKey: "connect.cTxnDesc" },
  { key: "extraIncome", icon: IndianRupee, labelKey: "connect.cExtraIncome", descKey: "connect.cExtraIncomeDesc" },
  { key: "location", icon: MapPin, labelKey: "connect.cLocation", descKey: "connect.cLocationDesc" },
];

/** Granular, revocable consents (DPDP). Each toggle changes what Saathi surfaces. */
export function ConsentSection() {
  const { consents, setConsent, language } = useWealth();
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("connect.permissions", language)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="-mt-2 mb-3 text-xs text-text-muted">{t("connect.permissionsSub", language)}</p>
        <ul className="space-y-3">
          {ROWS.map(({ key, icon: IconCmp, labelKey, descKey }) => (
            <li key={key} className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <IconCmp size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">{t(labelKey, language)}</p>
                <p className="text-xs text-text-muted">{t(descKey, language)}</p>
              </div>
              <Toggle checked={consents[key]} onChange={(v) => setConsent(key, v)} label={t(labelKey, language)} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
