import type { ReactNode } from "react";

/** Titled section header with an optional right-side action (e.g. a link). */
export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-sm font-semibold text-text-primary">{title}</h2>
      {action}
    </div>
  );
}
