"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Segmented numeric entry for OTPs (mask=false) and PINs (mask=true). A single
 * hidden input holds the value; the boxes are a visual overlay.
 */
export function PinInput({
  value,
  onChange,
  length,
  mask = false,
  autoFocus = false,
}: {
  value: string;
  onChange: (v: string) => void;
  length: number;
  mask?: boolean;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="relative" onClick={() => ref.current?.focus()}>
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, length))}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus={autoFocus}
        className="absolute inset-0 h-full w-full opacity-0"
        aria-label={mask ? "PIN" : "One-time code"}
      />
      <div className="flex justify-center gap-2">
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "grid h-12 w-11 place-items-center rounded-md border bg-surface text-lg font-semibold text-text-primary transition-colors",
              i === value.length ? "border-primary ring-1 ring-primary" : "border-border",
            )}
          >
            {value[i] ? (mask ? "•" : value[i]) : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
