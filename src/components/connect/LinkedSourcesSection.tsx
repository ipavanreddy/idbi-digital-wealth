"use client";

import { useState } from "react";
import { Landmark, CreditCard, Smartphone, Plus, Trash2, ShieldCheck } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import type { LinkedSource, SourceType } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { AddSourceSheet } from "@/components/connect/AddSourceSheet";
import { cn } from "@/lib/cn";

const GROUPS: { type: SourceType; icon: typeof Landmark; titleKey: Parameters<typeof t>[0] }[] = [
  { type: "BANK", icon: Landmark, titleKey: "connect.banks" },
  { type: "CARD", icon: CreditCard, titleKey: "connect.cards" },
  { type: "UPI", icon: Smartphone, titleKey: "connect.upi" },
];

export function LinkedSourcesSection() {
  const { linkedSources, removeSource, language } = useWealth();
  const [sheet, setSheet] = useState<SourceType | null>(null);

  return (
    <div className="space-y-3">
      {GROUPS.map(({ type, icon: IconCmp, titleKey }) => {
        const items = linkedSources.filter((s) => s.type === type);
        return (
          <Card key={type}>
            <div className="flex items-center justify-between px-4 pt-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                <IconCmp size={18} className="text-primary" /> {t(titleKey, language)}
              </div>
              <button
                onClick={() => setSheet(type)}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/15"
              >
                <Plus size={14} /> {t("connect.add", language)}
              </button>
            </div>
            <div className="px-4 pb-3 pt-2">
              {items.length === 0 ? (
                <p className="py-2 text-xs text-text-muted">{t("connect.none", language)}</p>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((s) => (
                    <SourceRow key={s.id} source={s} onRemove={() => removeSource(s.id)} />
                  ))}
                </ul>
              )}
            </div>
          </Card>
        );
      })}

      {sheet && <AddSourceSheet type={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
}

function SourceRow({ source, onRemove }: { source: LinkedSource; onRemove: () => void }) {
  const { language } = useWealth();
  return (
    <li className="flex items-center gap-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text-primary">{source.label}</p>
        <p className="text-xs text-text-muted">
          {source.detail} ·{" "}
          {source.linkedVia === "AA" ? (
            <span className="inline-flex items-center gap-0.5 text-success">
              <ShieldCheck size={11} /> {t("connect.viaAA", language)}
            </span>
          ) : (
            t("connect.viaManual", language)
          )}
        </p>
      </div>
      <button onClick={onRemove} className={cn("shrink-0 text-text-muted hover:text-error")} aria-label="Remove source">
        <Trash2 size={16} />
      </button>
    </li>
  );
}
