import type { ReactNode } from "react";
import { PhoneFrame } from "@/components/layout/PhoneFrame";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { ConsentGate } from "@/components/layout/ConsentGate";
import { DemoControls } from "@/components/layout/DemoControls";

/** The customer-facing mobile shell: header · scrollable screen · bottom nav. */
export default function MobileLayout({ children }: { children: ReactNode }) {
  return (
    <PhoneFrame>
      <AppHeader />
      <main className="relative flex-1 overflow-y-auto scroll-slim">{children}</main>
      <BottomNav />
      <ConsentGate />
      <DemoControls />
    </PhoneFrame>
  );
}
