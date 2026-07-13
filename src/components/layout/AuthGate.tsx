"use client";

import type { ReactNode } from "react";
import { useWealth } from "@/lib/store";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { ConsentGate } from "@/components/layout/ConsentGate";
import { DemoControls } from "@/components/layout/DemoControls";
import { LoginFlow } from "@/components/auth/LoginFlow";

/**
 * Decides what fills the phone frame: the login flow when unauthenticated, or
 * the full app shell (header · screen · bottom nav) once logged in.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const { session } = useWealth();

  if (!session.authed) return <LoginFlow />;

  return (
    <>
      <AppHeader />
      <main className="relative flex-1 overflow-y-auto scroll-slim">{children}</main>
      <BottomNav />
      <ConsentGate />
      <DemoControls />
    </>
  );
}
