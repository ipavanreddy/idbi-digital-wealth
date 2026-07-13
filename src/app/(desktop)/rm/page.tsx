"use client";

import { Inbox, ShieldAlert } from "lucide-react";
import { useWealth } from "@/lib/store";
import { formatDate } from "@/lib/format";
import type { LeadStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const STATUS_TONE: Record<LeadStatus, "info" | "warning" | "neutral"> = {
  NEW: "warning",
  CONTACTED: "info",
  CLOSED: "neutral",
};

/**
 * RM console: the hybrid model's other half. Every SEBI-regulated request the
 * avatar declines becomes a qualified lead here — the app is both advisor and
 * lead generator.
 */
export default function RMConsolePage() {
  const { leads, managers, setLeadStatus } = useWealth();

  const open = leads.filter((l) => l.status !== "CLOSED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Qualified leads</h1>
          <p className="text-sm text-text-muted">Escalated by the avatar for human advisory</p>
        </div>
        <div className="flex gap-6 text-right">
          <Stat label="Open leads" value={open} />
          <Stat label="Total" value={leads.length} />
        </div>
      </div>

      {leads.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center gap-2 py-16 text-center text-text-muted">
            <Inbox size={32} />
            <p className="text-sm">No leads yet.</p>
            <p className="max-w-sm text-xs">
              In the app, ask the avatar &ldquo;which stocks should I buy?&rdquo; and arrange a callback — the lead appears here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card key={lead.id}>
              <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-text-primary">{lead.topic}</p>
                    {lead.regulated && (
                      <Badge tone="error">
                        <ShieldAlert size={12} /> SEBI-regulated
                      </Badge>
                    )}
                    <Badge tone={STATUS_TONE[lead.status]}>{lead.status}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">{lead.detail}</p>
                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-text-muted">
                    <span>Customer: <span className="font-medium text-text-primary">{lead.customerName}</span></span>
                    <span>Interest: <span className="font-medium text-text-primary">{lead.productInterest}</span></span>
                    <span>Assigned: <span className="font-medium text-text-primary">{lead.assignedRM}</span></span>
                    <span>Raised: <span className="font-medium text-text-primary">{formatDate(lead.createdAt, true)}</span></span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  {lead.status === "NEW" && (
                    <Button size="sm" variant="outline" onClick={() => setLeadStatus(lead.id, "CONTACTED")}>
                      Mark contacted
                    </Button>
                  )}
                  {lead.status !== "CLOSED" && (
                    <Button size="sm" variant="ghost" onClick={() => setLeadStatus(lead.id, "CLOSED")}>
                      Close
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-2 text-sm font-semibold text-text-primary">Advisory desk</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {managers.map((m) => (
            <Card key={m.id}>
              <div className="p-4">
                <p className="text-sm font-semibold text-text-primary">{m.name}</p>
                <p className="text-xs text-text-muted">{m.specialization}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-text-muted">{label}</p>
      <p className="text-2xl font-semibold text-text-primary">{value}</p>
    </div>
  );
}
