import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Presentational press-to-talk button. The caller owns the speech hook and
 * passes `listening`; when not supported, the caller simply doesn't render this.
 */
export function MicButton({
  listening,
  onClick,
  label,
  size = "md",
}: {
  listening: boolean;
  onClick: () => void;
  label: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={listening}
      className={cn(
        "grid shrink-0 place-items-center rounded-full border transition-colors",
        dim,
        listening
          ? "avatar-pulse border-transparent bg-error text-primary-foreground"
          : "border-border bg-surface text-text-muted hover:bg-surface-hover hover:text-primary",
      )}
    >
      {listening ? <Square size={size === "sm" ? 14 : 16} /> : <Mic size={size === "sm" ? 16 : 18} />}
    </button>
  );
}
