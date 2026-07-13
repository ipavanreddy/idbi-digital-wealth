import { chartColor } from "@/lib/chart";

interface Slice {
  label: string;
  pct: number;
  colorIndex: number;
}

/** Suitability allocation shown as a stacked bar + legend. */
export function AllocationBars({ allocation }: { allocation: Slice[] }) {
  return (
    <div>
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {allocation.map((a) => (
          <div key={a.label} style={{ width: `${a.pct}%`, backgroundColor: chartColor(a.colorIndex) }} />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {allocation.map((a) => (
          <li key={a.label} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColor(a.colorIndex) }} />
            <span className="text-text-muted">{a.label}</span>
            <span className="ml-auto font-semibold text-text-primary">{a.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
