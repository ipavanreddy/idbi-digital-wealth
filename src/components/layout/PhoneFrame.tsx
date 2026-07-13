import type { ReactNode } from "react";

/**
 * Device shell. On phones it fills the viewport; on desktop it renders a
 * centred device frame on a branded backdrop — the app is "inside the bank's
 * mobile app", so the demo always reads as a phone. Colours come from tokens
 * (inline vars), never hardcoded hex.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen w-full sm:grid sm:place-items-center sm:p-6"
      style={{ background: "linear-gradient(160deg, rgb(var(--color-primary)) 0%, rgb(var(--color-primary-hover)) 30%, rgb(var(--color-background)) 78%)" }}
    >
      <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background sm:h-[880px] sm:max-h-[92vh] sm:w-[430px] sm:rounded-[44px] sm:border-[10px] sm:border-text-primary sm:shadow-lg">
        {children}
      </div>
    </div>
  );
}
