"use client";

import Link from "next/link";
import { Link2 } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import type { Language } from "@/lib/types";
import { cn } from "@/lib/cn";

/** Top bar: IDBI wordmark, greeting, and the language toggle (en/hi). */
export function AppHeader() {
  const { customer, language, setLanguage } = useWealth();
  const first = customer.name.split(" ")[0];
  const langs: Language[] = ["en", "hi"];

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
      <div className="flex items-center gap-2.5">
        {/* IDBI emblem (brand asset). White canvas blends on the white header. */}
        <img
          src="/brand/idbi-emblem-sq.png"
          alt="IDBI Bank"
          width={32}
          height={32}
          decoding="async"
          className="h-8 w-8 object-contain"
        />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">IDBI · {t("app.name", language)}</p>
          <p className="text-sm text-text-muted">
            {t("home.greeting", language)}, <span className="font-medium text-text-primary">{first}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/connect"
          className="grid h-8 w-8 place-items-center rounded-full border border-border text-text-muted transition-colors hover:bg-surface-hover hover:text-primary"
          aria-label={t("connect.title", language)}
        >
          <Link2 size={16} />
        </Link>
        <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
          {langs.map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                language === l ? "bg-primary text-primary-foreground" : "text-text-muted hover:bg-surface-hover",
              )}
              aria-pressed={language === l}
            >
              {l === "en" ? "EN" : "हिं"}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
