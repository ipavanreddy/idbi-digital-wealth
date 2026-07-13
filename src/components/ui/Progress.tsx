import { cn } from "@/lib/cn";

/**
 * Token-driven progress bar. `tone` maps to a CSS-variable colour so the fill
 * never hardcodes hex. Value is clamped to [0, max].
 */
export function Progress({ value, max = 100, tone = "primary", className }: { value: number; max?: number; tone?: "primary" | "accent" | "success" | "warning"; className?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fill: Record<string, string> = {
    primary: "bg-primary",
    accent: "bg-accent",
    success: "bg-success",
    warning: "bg-warning",
  };
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-surface-hover", className)}>
      <div className={cn("h-full rounded-full transition-all", fill[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}
