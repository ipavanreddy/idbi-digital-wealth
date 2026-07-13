import { TrendingUp, TrendingDown } from "lucide-react";
import { MARKET_UPDATES } from "@/lib/data/seed";
import { Card } from "@/components/ui/Card";

/** Market-linked update feed — IDBI asked for timely market notifications so
 * customers can act on informed decisions. Synthetic snapshots for the demo. */
export function MarketUpdates() {
  return (
    <div className="space-y-2">
      {MARKET_UPDATES.map((m) => {
        const up = m.changePct >= 0;
        return (
          <Card key={m.id}>
            <div className="flex items-center gap-3 p-3">
              <span className={up ? "text-success" : "text-error"}>
                {up ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary">{m.headline}</p>
                <p className="text-xs text-text-muted">
                  {m.instrument} · {m.note}
                </p>
              </div>
              <span className={`shrink-0 text-sm font-semibold ${up ? "text-success" : "text-error"}`}>
                {up ? "+" : ""}
                {m.changePct.toFixed(2)}%
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
