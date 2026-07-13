"use client";

import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { CompletenessMeter } from "@/components/connect/CompletenessMeter";
import { LinkedSourcesSection } from "@/components/connect/LinkedSourcesSection";
import { PanSection } from "@/components/connect/PanSection";
import { ConsentSection } from "@/components/connect/ConsentSection";
import { ConnectInsights } from "@/components/connect/ConnectInsights";

/** Connect your money — link sources, PAN, consents; see what it unlocks. */
export default function ConnectPage() {
  const { language } = useWealth();
  return (
    <div className="space-y-5 p-4 pb-24">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{t("connect.title", language)}</h1>
        <p className="text-sm text-text-muted">{t("connect.subtitle", language)}</p>
      </div>

      <CompletenessMeter />

      <LinkedSourcesSection />

      <PanSection />

      <ConsentSection />

      <ConnectInsights />
    </div>
  );
}
