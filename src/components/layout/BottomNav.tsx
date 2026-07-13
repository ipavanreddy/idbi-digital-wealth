"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PieChart, Target, MessageCircle, User } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t, type TKey } from "@/lib/i18n";
import { cn } from "@/lib/cn";

const TABS: { href: string; icon: typeof Home; key: TKey }[] = [
  { href: "/", icon: Home, key: "nav.home" },
  { href: "/spend", icon: PieChart, key: "nav.spend" },
  { href: "/avatar", icon: MessageCircle, key: "nav.avatar" },
  { href: "/goals", icon: Target, key: "nav.goals" },
  { href: "/profile", icon: User, key: "nav.profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { language } = useWealth();

  return (
    <nav className="flex items-stretch border-t border-border bg-surface">
      {TABS.map(({ href, icon: IconCmp, key }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex flex-1 flex-col items-center gap-1 py-2 text-xs transition-colors",
              active ? "text-primary" : "text-text-muted hover:text-text-primary",
            )}
          >
            <IconCmp size={20} strokeWidth={active ? 2.4 : 1.8} aria-hidden />
            {t(key, language)}
          </Link>
        );
      })}
    </nav>
  );
}
