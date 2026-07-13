import { ShieldAlert } from "lucide-react";
import type { ChatMessage, EmergencyFundStatus, GoalPlan, SuitabilityAssessment } from "@/lib/types";
import { formatINR } from "@/lib/format";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { AllocationBars } from "@/components/avatar/AllocationBars";

/**
 * Renders the structured payload attached to an avatar message. Keeps the
 * numbers visual (bars, allocations) rather than buried in prose — the figures
 * all originate in the rules engine.
 */
export function RichCard({ message }: { message: ChatMessage }) {
  const meta = message.meta;
  if (!meta) return null;

  if (message.kind === "suitability") {
    const m = meta as unknown as Pick<SuitabilityAssessment, "allocation" | "rationale"> & { regulated: boolean };
    return (
      <div className="mt-2 rounded-lg border border-border bg-surface p-3">
        {m.regulated && (
          <Badge tone="error" className="mb-2">
            <ShieldAlert size={12} /> SEBI-regulated — routed to RM
          </Badge>
        )}
        <AllocationBars allocation={m.allocation} />
        <p className="mt-3 text-xs leading-relaxed text-text-muted">{m.rationale}</p>
      </div>
    );
  }

  if (message.kind === "emergencyFund") {
    const m = meta as unknown as EmergencyFundStatus;
    return (
      <div className="mt-2 rounded-lg border border-border bg-surface p-3">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-text-muted">Coverage</span>
          <span className="font-semibold text-text-primary">
            {m.monthsCovered} / {m.targetMonths} months
          </span>
        </div>
        <Progress value={m.monthsCovered} max={m.targetMonths} tone={m.onTrack ? "success" : "warning"} />
        {!m.onTrack && (
          <p className="mt-2 text-xs text-text-muted">
            Shortfall {formatINR(m.shortfallAmount)} · rebuild with {formatINR(m.monthlyTopUpToRecover)}/mo in ~{m.monthsToRecover} months.
          </p>
        )}
      </div>
    );
  }

  if (message.kind === "goalPlan") {
    const m = meta as unknown as GoalPlan & { goalName: string };
    return (
      <div className="mt-2 grid grid-cols-3 gap-2 rounded-lg border border-border bg-surface p-3 text-center">
        <Stat label="Remaining" value={formatINR(m.remaining)} />
        <Stat label="Need / mo" value={formatINR(m.requiredMonthly)} />
        <Stat label="Food cap" value={formatINR(m.suggestedFoodBudget)} />
      </div>
    );
  }

  return null;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}
