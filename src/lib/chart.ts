/** Resolve a 0-based palette index to its chart CSS variable (--chart-1..8). */
export function chartColor(index: number): string {
  return `var(--chart-${(index % 8) + 1})`;
}
