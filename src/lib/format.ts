/** Formatting helpers. All money is INR, grouped in the Indian lakh system. */

const inr0 = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹1,20,000 — no decimals, Indian grouping. */
export function formatINR(amount: number): string {
  return inr0.format(Math.round(amount));
}

/** Compact form for tight spots: ₹1.2L, ₹3.6L, ₹20.0L. */
export function formatINRShort(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}k`;
  return `${sign}₹${abs}`;
}

/** "12 Jun" / "12 Jun 2026" from an ISO date string (no timezone drift). */
export function formatDate(isoDate: string, withYear = false): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d} ${months[m - 1]}${withYear ? ` ${y}` : ""}`;
}

/** yyyy-mm bucket key from an ISO date. */
export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

/** PAN regex: five letters, four digits, one letter (e.g. ABCDE1234F). */
export const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/** Mask a PAN for display: ABCDE1234F → ABCDE••••F. */
export function maskPan(pan: string): string {
  if (pan.length !== 10) return pan;
  return `${pan.slice(0, 5)}••••${pan.slice(9)}`;
}

/** Whole months between two ISO dates (from → to), floored at 0. */
export function monthsBetween(fromIso: string, toIso: string): number {
  const [fy, fm, fd] = fromIso.split("-").map(Number);
  const [ty, tm, td] = toIso.split("-").map(Number);
  let months = (ty - fy) * 12 + (tm - fm);
  if (td < fd) months -= 1;
  return Math.max(0, months);
}
