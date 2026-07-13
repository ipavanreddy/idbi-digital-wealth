import type { ReactNode } from "react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { AuthGate } from "@/components/layout/AuthGate";

/** The customer-facing mobile shell — gated behind login (AuthGate). */
export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <PhoneFrame>
      <AuthGate>{children}</AuthGate>
    </PhoneFrame>
  );
}
