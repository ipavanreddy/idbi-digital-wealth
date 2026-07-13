import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "success" | "warning" | "error" | "info" | "accent" | "primary";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-hover text-text-muted",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  error: "bg-error/10 text-error",
  info: "bg-info/10 text-info",
  accent: "bg-accent/15 text-accent",
  primary: "bg-primary/10 text-primary",
};

export function Badge({ tone = "neutral", className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", TONES[tone], className)}>
      {children}
    </span>
  );
}
