"use client";

import Link from "next/link";
import { BadgeCheck, ChevronRight, Link2, Bell, LogOut, RotateCcw, User } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { maskMobile } from "@/lib/format";
import type { Language } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

/** Profile: identity, settings, and logout (replaces the old Alerts tab). */
export default function ProfilePage() {
  const { session, customer, language, setLanguage, logout, resetDemo } = useWealth();
  const langs: Language[] = ["en", "hi"];

  return (
    <div className="space-y-5 p-4 pb-24">
      <h1 className="text-lg font-semibold text-text-primary">{t("profile.title", language)}</h1>

      {/* Identity */}
      <Card>
        <div className="flex items-center gap-3 p-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <User size={24} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-text-primary">{customer.name}</p>
            <p className="text-xs text-text-muted">{session.mobile ? maskMobile(session.mobile) : "—"}</p>
          </div>
          <Badge tone="success">
            <BadgeCheck size={12} /> {t("profile.verified", language)}
          </Badge>
        </div>
      </Card>

      {/* Settings */}
      <Card>
        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-text-primary">{t("profile.language", language)}</span>
            <div className="flex items-center gap-1 rounded-full border border-border p-0.5">
              {langs.map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    language === l ? "bg-primary text-primary-foreground" : "text-text-muted hover:bg-surface-hover",
                  )}
                >
                  {l === "en" ? "EN" : "हिं"}
                </button>
              ))}
            </div>
          </div>
          <ProfileLink href="/connect" icon={<Link2 size={18} />} label={t("profile.manageMoney", language)} />
          <ProfileLink href="/alerts" icon={<Bell size={18} />} label={t("nav.alerts", language)} />
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full text-error" onClick={logout}>
          <LogOut size={18} /> {t("profile.logout", language)}
        </Button>
        <Button variant="ghost" className="w-full text-text-muted" onClick={resetDemo}>
          <RotateCcw size={16} /> {t("profile.resetDemo", language)}
        </Button>
      </div>
    </div>
  );
}

function ProfileLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hover">
      <span className="text-text-muted">{icon}</span>
      <span className="flex-1 text-sm text-text-primary">{label}</span>
      <ChevronRight size={16} className="text-text-muted" />
    </Link>
  );
}
