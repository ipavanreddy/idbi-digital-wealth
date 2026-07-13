"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { BANK_DIRECTORY } from "@/lib/data/seed";
import type { CardKind, CardNetwork, LinkedSource, SourceType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const NETWORKS: CardNetwork[] = ["VISA", "MASTERCARD", "RUPAY", "AMEX"];

/** Bottom-sheet form for linking a new source. Fields adapt to the type. */
export function AddSourceSheet({ type, onClose }: { type: SourceType; onClose: () => void }) {
  const { addSource, language } = useWealth();

  // Shared form state (only the fields relevant to `type` are used).
  const [bank, setBank] = useState(BANK_DIRECTORY[0]);
  const [accountType, setAccountType] = useState<"SAVINGS" | "CURRENT">("SAVINGS");
  const [network, setNetwork] = useState<CardNetwork>("VISA");
  const [cardKind, setCardKind] = useState<CardKind>("CREDIT");
  const [issuer, setIssuer] = useState(BANK_DIRECTORY[0]);
  const [last4, setLast4] = useState("");
  const [upi, setUpi] = useState("");
  const [error, setError] = useState("");

  const title =
    type === "BANK" ? t("connect.sheetBank", language) : type === "CARD" ? t("connect.sheetCard", language) : t("connect.sheetUpi", language);

  const submit = () => {
    let draft: Omit<LinkedSource, "id" | "linkedOn"> | null = null;
    if (type === "BANK") {
      const tail = String(((bank.length * 371 + accountType.length * 13) % 9000) + 1000);
      draft = { type: "BANK", label: `${bank} ${accountType === "SAVINGS" ? "Savings" : "Current"}`, detail: `•••• ${tail}`, linkedVia: "AA" };
    } else if (type === "CARD") {
      if (!/^[0-9]{4}$/.test(last4)) return setError(t("connect.last4Invalid", language));
      draft = {
        type: "CARD",
        label: `${issuer} ${cardKind === "CREDIT" ? "Credit" : "Debit"} Card`,
        detail: `${network} •••• ${last4}`,
        network,
        cardKind,
        linkedVia: "MANUAL",
      };
    } else {
      if (!/^[\w.\-]{2,}@[\w.\-]{2,}$/.test(upi.trim())) return setError(t("connect.upiInvalid", language));
      draft = { type: "UPI", label: "UPI ID", detail: upi.trim().toLowerCase(), linkedVia: "MANUAL" };
    }
    addSource(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-text-primary/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-[430px] rounded-t-[24px] bg-surface p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary" aria-label={t("connect.cancel", language)}>
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {type === "BANK" && (
            <>
              <Field label={t("connect.fBank", language)}>
                <Select value={bank} onChange={setBank} options={BANK_DIRECTORY} />
              </Field>
              <Field label={t("connect.fAccountType", language)}>
                <SegmentedTwo
                  a={{ value: "SAVINGS", label: t("connect.savings", language) }}
                  b={{ value: "CURRENT", label: t("connect.current", language) }}
                  value={accountType}
                  onChange={(v) => setAccountType(v as "SAVINGS" | "CURRENT")}
                />
              </Field>
              <p className="text-xs text-text-muted">{t("connect.viaAA", language)} · RBI Account Aggregator</p>
            </>
          )}

          {type === "CARD" && (
            <>
              <Field label={t("connect.fIssuer", language)}>
                <Select value={issuer} onChange={setIssuer} options={BANK_DIRECTORY} />
              </Field>
              <Field label={t("connect.fNetwork", language)}>
                <Select value={network} onChange={(v) => setNetwork(v as CardNetwork)} options={NETWORKS} />
              </Field>
              <Field label={t("connect.fCardKind", language)}>
                <SegmentedTwo
                  a={{ value: "CREDIT", label: t("connect.credit", language) }}
                  b={{ value: "DEBIT", label: t("connect.debit", language) }}
                  value={cardKind}
                  onChange={(v) => setCardKind(v as CardKind)}
                />
              </Field>
              <Field label={t("connect.fLast4", language)}>
                <input
                  value={last4}
                  onChange={(e) => {
                    setLast4(e.target.value.replace(/\D/g, "").slice(0, 4));
                    setError("");
                  }}
                  inputMode="numeric"
                  placeholder="1234"
                  className="h-11 w-full rounded-md border border-border bg-surface px-3 font-mono tracking-widest text-text-primary outline-none focus:border-primary"
                />
              </Field>
            </>
          )}

          {type === "UPI" && (
            <Field label={t("connect.fUpi", language)}>
              <input
                value={upi}
                onChange={(e) => {
                  setUpi(e.target.value);
                  setError("");
                }}
                placeholder="name@okbank"
                className="h-11 w-full rounded-md border border-border bg-surface px-3 text-text-primary outline-none focus:border-primary"
              />
            </Field>
          )}

          {error && <p className="text-xs text-error">{error}</p>}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t("connect.cancel", language)}
            </Button>
            <Button className="flex-1" onClick={submit}>
              {t("connect.link", language)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-text-muted">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-text-primary outline-none focus:border-primary"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function SegmentedTwo({
  a,
  b,
  value,
  onChange,
}: {
  a: { value: string; label: string };
  b: { value: string; label: string };
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full border border-border p-0.5">
      {[a, b].map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex-1 rounded-full py-1.5 text-xs font-medium transition-colors",
            value === opt.value ? "bg-primary text-primary-foreground" : "text-text-muted hover:bg-surface-hover",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
