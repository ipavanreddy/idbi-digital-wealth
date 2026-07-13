"use client";

import { useState } from "react";
import { BadgeCheck, Pencil } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { PAN_PATTERN, maskPan } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/** PAN capture — the identity anchor that links spends across banks (AA). */
export function PanSection() {
  const { pan, setPan, language } = useWealth();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const save = () => {
    const normalized = value.trim().toUpperCase();
    if (!PAN_PATTERN.test(normalized)) {
      setError(true);
      return;
    }
    setPan(normalized);
    setEditing(false);
    setError(false);
    setValue("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("connect.pan", language)}</CardTitle>
        {pan && !editing && <Badge tone="success"><BadgeCheck size={12} /> {t("connect.linked", language)}</Badge>}
      </CardHeader>
      <CardContent>
        {pan && !editing ? (
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm tracking-wider text-text-primary">{maskPan(pan)}</span>
            <button onClick={() => setEditing(true)} className="text-text-muted hover:text-text-primary" aria-label="Edit PAN">
              <Pencil size={16} />
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-xs text-text-muted">{t("connect.panHint", language)}</p>
            <div className="flex gap-2">
              <input
                value={value}
                onChange={(e) => {
                  setValue(e.target.value.toUpperCase());
                  setError(false);
                }}
                maxLength={10}
                placeholder="ABCDE1234F"
                className="h-11 flex-1 rounded-md border border-border bg-surface px-3 font-mono text-sm uppercase tracking-wider text-text-primary outline-none focus:border-primary"
              />
              <Button onClick={save} size="md">
                {t("connect.save", language)}
              </Button>
            </div>
            {error && <p className="mt-2 text-xs text-error">{t("connect.panInvalid", language)}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
