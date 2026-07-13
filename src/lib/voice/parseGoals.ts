import type { GoalDraft, GoalType } from "@/lib/types";

/**
 * Deterministic goal parser. Turns spoken/typed sentences like
 *   "in three months my goal is to buy a car, in six months a Europe trip,
 *    in another year change my job"
 * into structured, editable goal drafts. Optimised for the natural "time-first"
 * phrasing (timeframe, then the goal). No LLM — fully auditable and offline.
 */

const NUMBER_WORDS: Record<string, number> = {
  a: 1, an: 1, another: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6,
  seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
};

// "in the next three months", "within 6 months", "in another year", "after 2 years"
const TIME_RE =
  /\b(?:in|within|after|by|next|over the next)\s+(?:the\s+)?(?:next\s+)?(a|an|another|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|\d{1,2})\s+(months?|years?|yrs?)\b/gi;

function wordToMonths(word: string, unit: string): number {
  const n = /^\d+$/.test(word) ? parseInt(word, 10) : NUMBER_WORDS[word] ?? 1;
  return /^y/.test(unit) ? n * 12 : n;
}

function stripMoneyFiller(s: string): string {
  return s
    .replace(/\b(worth|around|about|approximately|roughly|costing|which costs?|that costs?)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Pull a rupee amount out of a phrase, returning the amount and the phrase without it. */
function extractAmount(phrase: string): { amount: number | null; cleaned: string } {
  const unit = phrase.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(lakhs?|lacs?|crores?|cr|thousand|k)\b/i);
  if (unit) {
    const n = parseFloat(unit[1]);
    const u = unit[2].toLowerCase();
    const mult = /^cr/.test(u) ? 1e7 : /^la/.test(u) ? 1e5 : 1e3;
    return { amount: Math.round(n * mult), cleaned: stripMoneyFiller(phrase.replace(unit[0], " ")) };
  }
  const plain = phrase.match(/(?:₹|rs\.?)\s*([\d,]{4,})/i);
  if (plain) {
    const amount = parseInt(plain[1].replace(/,/g, ""), 10);
    return { amount: Number.isNaN(amount) ? null : amount, cleaned: stripMoneyFiller(phrase.replace(plain[0], " ")) };
  }
  return { amount: null, cleaned: phrase };
}

/** Classify a goal title → type, icon, and a sensible (editable) default target. */
function categorize(title: string): { type: GoalType; icon: string; defaultAmount: number } {
  const t = title.toLowerCase();
  if (/\b(car|vehicle|bike|scooter|motorcycle)\b/.test(t)) return { type: "PURCHASE", icon: "Car", defaultAmount: 800000 };
  if (/\b(trip|travel|vacation|holiday|europe|goa|tour|abroad|trek)\b/.test(t)) return { type: "TRIP", icon: "Plane", defaultAmount: 400000 };
  if (/\b(home|house|flat|apartment|down\s?payment|property)\b/.test(t)) return { type: "PURCHASE", icon: "Home", defaultAmount: 2000000 };
  if (/\b(job|career|switch|business|startup|course|mba|study|upskill)\b/.test(t)) return { type: "PURCHASE", icon: "Briefcase", defaultAmount: 200000 };
  if (/\b(wedding|marriage|shaadi)\b/.test(t)) return { type: "PURCHASE", icon: "Target", defaultAmount: 500000 };
  if (/\b(retire|retirement)\b/.test(t)) return { type: "RETIREMENT", icon: "Target", defaultAmount: 5000000 };
  return { type: "PURCHASE", icon: "Target", defaultAmount: 200000 };
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/^[\s,;.:-]+/, "")
    .replace(/^(?:my|the)?\s*goal\s+is\b\s*/, "")
    .replace(/^i\s+(?:want|plan|would like|wish|need|hope)\s+/, "")
    .replace(/^(?:is\s+)?to\s+/, "")
    .replace(/^(?:and|then)\s+/, "")
    .replace(/[\s,;.]+$/, "")
    .replace(/\s+(?:and|then)$/, "")
    .trim();
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Parse a transcript into up to 6 editable goal drafts (empty array if none). */
export function parseGoals(input: string): GoalDraft[] {
  const text = input.toLowerCase().replace(/\s+/g, " ").trim();
  const matches = [...text.matchAll(TIME_RE)];
  const drafts: GoalDraft[] = [];

  for (let i = 0; i < matches.length && drafts.length < 6; i++) {
    const m = matches[i];
    const months = wordToMonths(m[1], m[2]);
    const start = (m.index ?? 0) + m[0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;

    const { amount, cleaned } = extractAmount(text.slice(start, end));
    const title = cleanTitle(cleaned);
    if (!title || months <= 0) continue;

    const cat = categorize(title);
    drafts.push({
      id: `draft-${i}`,
      title: capitalize(title),
      months,
      amount: amount && amount > 0 ? amount : cat.defaultAmount,
      type: cat.type,
      icon: cat.icon,
    });
  }

  return drafts;
}
