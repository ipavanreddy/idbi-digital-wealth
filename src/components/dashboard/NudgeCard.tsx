"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useWealth } from "@/lib/store";
import { SEVERITY_STYLE } from "@/lib/severity";
import type { Nudge, NudgeType } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AvatarFace } from "@/components/layout/AvatarFace";
import { cn } from "@/lib/cn";

/** Where a nudge's action button takes the customer. */
const ACTION_TARGET: Record<NudgeType, string> = {
  EMERGENCY_FUND: "/goals",
  GOAL_RISK: "/goals",
  INVEST_OPPORTUNITY: "/avatar",
  SPEND_ALERT: "/spend",
  MARKET_UPDATE: "/alerts",
};

/**
 * A single proactive nudge, delivered in the avatar's voice. Severity drives
 * the left accent + badge tone. `feature` shows the avatar glyph for the
 * hero placement on the home screen.
 */
export function NudgeCard({ nudge, feature = false, dismissible = false }: { nudge: Nudge; feature?: boolean; dismissible?: boolean }) {
  const { acknowledgeNudge } = useWealth();
  const s = SEVERITY_STYLE[nudge.severity];

  return (
    <Card className={cn("border-l-4", s.accent, nudge.acknowledged && "opacity-60")}>
      <div className="flex gap-3 p-4">
        {feature ? (
          <AvatarFace size={40} animated={nudge.severity === "critical"} />
        ) : (
          <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", s.dot)} aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-text-primary">{nudge.title}</p>
            {dismissible && !nudge.acknowledged && (
              <button onClick={() => acknowledgeNudge(nudge.id)} className="shrink-0 text-text-muted hover:text-text-primary" aria-label="Dismiss">
                <X size={16} />
              </button>
            )}
          </div>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">{nudge.body}</p>
          <div className="mt-3 flex items-center gap-2">
            {nudge.actionLabel && (
              <Link href={ACTION_TARGET[nudge.type]}>
                <Badge tone={s.tone} className="cursor-pointer hover:opacity-80">
                  {nudge.actionLabel} →
                </Badge>
              </Link>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
