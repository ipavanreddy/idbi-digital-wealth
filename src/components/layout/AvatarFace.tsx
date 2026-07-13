import { cn } from "@/lib/cn";

/**
 * The avatar presenter. A lightweight animated glyph (CSS pulse) stands in for
 * a richer animated/3D presenter — deliberately not over-invested per the spec.
 * Placeholder identity: replace with a real avatar asset later (see README).
 */
export function AvatarFace({ size = 48, animated = true, className }: { size?: number; animated?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "relative grid place-items-center rounded-full bg-primary text-primary-foreground",
        animated && "avatar-pulse",
        className,
      )}
      style={{ width: size, height: size }}
      aria-label="Wealth avatar"
    >
      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface bg-accent" />
      <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58} fill="none" aria-hidden>
        <circle cx="12" cy="8.5" r="3.6" fill="currentColor" />
        <path d="M4.5 19c0-4 3.4-6.4 7.5-6.4S19.5 15 19.5 19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </div>
  );
}
