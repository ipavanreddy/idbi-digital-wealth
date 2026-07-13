import type { Severity } from "@/lib/types";

/**
 * Maps a nudge severity to token-driven styling. All class names are LITERAL
 * strings (never template-constructed) so Tailwind's content scanner keeps them.
 */
export const SEVERITY_STYLE: Record<
  Severity,
  { tone: "error" | "warning" | "info" | "success"; accent: string; dot: string }
> = {
  critical: { tone: "error", accent: "border-l-error", dot: "bg-error" },
  warning: { tone: "warning", accent: "border-l-warning", dot: "bg-warning" },
  info: { tone: "info", accent: "border-l-info", dot: "bg-info" },
  success: { tone: "success", accent: "border-l-success", dot: "bg-success" },
};
