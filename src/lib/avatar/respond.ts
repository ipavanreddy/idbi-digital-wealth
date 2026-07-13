import { formatINR } from "@/lib/format";
import type { Account, ChatMessage, ConsentSettings, Customer, Goal, Language, Transaction } from "@/lib/types";
import { emergencyFundStatus, goalPlan, suitability } from "@/lib/rules/advisory";
import { additionalIncomeStatus } from "@/lib/rules/connect";
import {
  categorySpendThisMonth,
  investableSurplus,
  liquidSavings,
  monthlyCategorySpend,
  monthlyEssentialSpend,
  spendByCategory,
} from "@/lib/rules/spend";

/**
 * The avatar's response layer — "rules decide, the avatar talks". Every number
 * comes from the rules engine; this file only chooses words (en/hi). In
 * production the phrasing step swaps to Claude behind the same interface, with
 * the rule outputs passed in as grounded facts so advice stays auditable.
 */

export type AvatarIntent = "greeting" | "emergency_fund" | "goal" | "stocks" | "spend" | "invest" | "income" | "help";

export interface AvatarContext {
  customer: Customer;
  accounts: Account[];
  transactions: Transaction[];
  goals: Goal[];
  today: string;
  consents: ConsentSettings;
}

export interface AvatarAction {
  label: string;
  action: "create_lead" | "open_goals" | "open_alerts";
}

export type AvatarBubble = Omit<ChatMessage, "id" | "createdAt" | "role"> & { actions?: AvatarAction[] };

export interface AvatarReply {
  bubbles: AvatarBubble[];
  lead?: { topic: string; detail: string; productInterest: string; regulated: boolean };
}

const KEYWORDS: Record<AvatarIntent, string[]> = {
  stocks: ["stock", "stocks", "share", "shares", "equity", "which stock", "स्टॉक", "शेयर", "कौन सा शेयर"],
  income: ["real income", "income", "earn", "earning", "salary", "freelance", "how much do i make", "आय", "कमाई", "आमदनी", "वेतन"],
  goal: ["goal", "europe", "trip", "travel", "यूरोप", "लक्ष्य", "ट्रिप", "यात्रा"],
  emergency_fund: ["emergency", "fund", "safety", "rainy", "आपात", "कोष", "सुरक्षा"],
  spend: ["spend", "spent", "spending", "food", "dining", "expense", "खर्च", "डाइनिंग", "खाना"],
  invest: ["invest", "investing", "sip", "mutual", "surplus", "निवेश", "एसआईपी", "म्यूचुअल"],
  greeting: ["hi", "hello", "hey", "namaste", "नमस्ते", "हाय", "हैलो"],
  help: ["help", "what can you", "मदद", "सहायता"],
};

/** Route free text to an intent. Order matters: regulated 'stocks' beats generic 'invest'. */
export function routeIntent(text: string): AvatarIntent {
  const lower = text.toLowerCase();
  const order: AvatarIntent[] = ["stocks", "income", "goal", "emergency_fund", "spend", "invest", "greeting", "help"];
  for (const intent of order) {
    if (KEYWORDS[intent].some((k) => lower.includes(k))) return intent;
  }
  return "help";
}

const pick = (lang: Language, en: string, hi: string) => (lang === "en" ? en : hi);

export function respond(intent: AvatarIntent, ctx: AvatarContext, lang: Language): AvatarReply {
  const { customer, accounts, transactions, goals, today } = ctx;

  switch (intent) {
    case "emergency_fund": {
      const ef = emergencyFundStatus(liquidSavings(accounts), monthlyEssentialSpend(transactions));
      const text = ef.onTrack
        ? pick(
            lang,
            `Your emergency fund covers ${ef.monthsCovered} months of essential spending — at or above your 6-month target. You're well protected.`,
            `आपका आपातकालीन कोष ${ef.monthsCovered} महीने के ज़रूरी खर्च को कवर करता है — 6 महीने के लक्ष्य पर या उससे ऊपर। आप सुरक्षित हैं।`,
          )
        : pick(
            lang,
            `Your emergency fund is at ${ef.monthsCovered} months, below your 6-month target because of the recent large spend. Setting aside ${formatINR(ef.monthlyTopUpToRecover)}/month rebuilds it in about ${ef.monthsToRecover} months. Want me to add it as a goal?`,
            `आपका आपातकालीन कोष ${ef.monthsCovered} महीने पर है, हाल के बड़े खर्च के कारण 6 महीने के लक्ष्य से नीचे। हर महीने ${formatINR(ef.monthlyTopUpToRecover)} अलग रखने से यह लगभग ${ef.monthsToRecover} महीनों में फिर से बन जाएगा। क्या मैं इसे लक्ष्य के रूप में जोड़ूँ?`,
          );
      return {
        bubbles: [{ kind: "emergencyFund", text, meta: { ...ef } }],
      };
    }

    case "goal": {
      const goal = goals.find((g) => g.type === "TRIP") ?? goals[0];
      if (!goal) return respond("help", ctx, lang);
      const avgFood = monthlyCategorySpend(transactions, "food");
      const plan = goalPlan(goal, today, avgFood);
      const text = plan.onTrack
        ? pick(
            lang,
            `Your ${goal.name} is on track — ${formatINR(goal.savedAmount)} of ${formatINR(goal.targetAmount)} saved, and your current pace closes it in time.`,
            `आपका ${goal.name} सही राह पर है — ${formatINR(goal.targetAmount)} में से ${formatINR(goal.savedAmount)} बच गया, और आपकी मौजूदा गति समय पर इसे पूरा कर देगी।`,
          )
        : pick(
            lang,
            `For your ${goal.name}, ${formatINR(plan.remaining)} is left over ${plan.monthsLeft} months — that needs ${formatINR(plan.requiredMonthly)}/month. If you keep food near ${formatINR(plan.suggestedFoodBudget)} this month, you can still close it on time.`,
            `आपके ${goal.name} के लिए ${plan.monthsLeft} महीनों में ${formatINR(plan.remaining)} बाकी है — इसके लिए ${formatINR(plan.requiredMonthly)}/माह चाहिए। अगर इस महीने खाने का खर्च ${formatINR(plan.suggestedFoodBudget)} के आसपास रखें, तो आप इसे समय पर पूरा कर सकते हैं।`,
          );
      return { bubbles: [{ kind: "goalPlan", text, meta: { goalName: goal.name, ...plan } }] };
    }

    case "stocks": {
      // SEBI-regulated request → generic suitability guidance + escalation to a human RM.
      const surplus = investableSurplus(transactions, customer.monthlyIncome);
      const s = suitability(customer, surplus, true);
      const explain: AvatarBubble = {
        kind: "suitability",
        text: pick(
          lang,
          `I can't recommend specific stocks — that's SEBI-regulated advice. What I can show is a suitable mix for your ${s.riskProfile.toLowerCase()} profile and ${s.horizonYears}-year horizon:`,
          `मैं विशिष्ट शेयरों की सिफ़ारिश नहीं कर सकता — यह SEBI-विनियमित सलाह है। मैं आपके ${s.riskProfile.toLowerCase()} प्रोफ़ाइल और ${s.horizonYears}-वर्ष की अवधि के लिए एक उपयुक्त मिश्रण दिखा सकता हूँ:`,
        ),
        meta: { allocation: s.allocation, horizonYears: s.horizonYears, rationale: s.rationale, regulated: true },
      };
      const escalate: AvatarBubble = {
        kind: "text",
        text: pick(
          lang,
          `For specific stock picks, I'll connect you with a certified relationship manager. Shall I arrange a callback?`,
          `विशिष्ट शेयरों के लिए, मैं आपको एक प्रमाणित रिलेशनशिप मैनेजर से जोड़ूँगा। क्या मैं कॉलबैक की व्यवस्था करूँ?`,
        ),
        actions: [{ label: pick(lang, "Arrange RM callback", "RM कॉलबैक की व्यवस्था करें"), action: "create_lead" }],
      };
      return {
        bubbles: [explain, escalate],
        lead: {
          topic: "Direct equity / stock recommendation",
          detail: `${customer.name} asked for specific stock picks. Profile: ${customer.riskProfile}, monthly surplus ≈ ${formatINR(surplus)}. Suitability discussed; regulated advice pending.`,
          productInterest: "Direct Equity / PMS",
          regulated: true,
        },
      };
    }

    case "spend": {
      const month = today.slice(0, 7);
      const slices = spendByCategory(transactions, month).slice(0, 3);
      const food = categorySpendThisMonth(transactions, "food", month);
      const list = slices.map((s) => `${s.label} ${formatINR(s.total)}`).join(", ");
      const text = pick(
        lang,
        `This month your top spends are ${list}. Food is at ${formatINR(food)}. Want me to suggest a cap to protect your goals?`,
        `इस महीने आपके सबसे बड़े खर्च हैं ${list}। खाने पर ${formatINR(food)}। क्या मैं आपके लक्ष्यों की रक्षा के लिए एक सीमा सुझाऊँ?`,
      );
      return { bubbles: [{ kind: "text", text }] };
    }

    case "invest": {
      const surplus = investableSurplus(transactions, customer.monthlyIncome);
      const s = suitability(customer, surplus, false);
      const text = pick(
        lang,
        `You have about ${formatINR(surplus)}/month of surplus. ${s.rationale} Here's a suitable allocation to consider:`,
        `आपके पास लगभग ${formatINR(surplus)}/माह का अधिशेष है। ${s.rationale} यहाँ एक उपयुक्त आवंटन है:`,
      );
      return { bubbles: [{ kind: "suitability", text, meta: { allocation: s.allocation, horizonYears: s.horizonYears, rationale: s.rationale, regulated: false } }] };
    }

    case "income": {
      // "Real income" — needs both transaction + extra-income consent to reveal.
      if (!ctx.consents.extraIncome || !ctx.consents.transactions) {
        return {
          bubbles: [
            {
              kind: "text",
              text: pick(
                lang,
                `Right now I only see your salary. Turn on “Additional income” in Connect and I'll include freelance and other credits to show your real earnings — the part your bank can't see.`,
                `अभी मैं केवल आपका वेतन देख पाता हूँ। Connect में “अतिरिक्त आय” चालू करें, फिर मैं फ्रीलांस और अन्य क्रेडिट जोड़कर आपकी वास्तविक कमाई दिखाऊँगा — वह हिस्सा जो आपका बैंक नहीं देख पाता।`,
              ),
            },
          ],
        };
      }
      const ai = additionalIncomeStatus(transactions, customer.monthlyIncome);
      const text = ai.detected
        ? pick(
            lang,
            `Your real income is about ${formatINR(ai.realMonthly)}/mo — ${formatINR(ai.salaryMonthly)} salary plus roughly ${formatINR(ai.averageMonthly)}/mo of other income I found across ${ai.monthsWithIncome} months (${formatINR(ai.totalDetected)} in total). Your bank sees only the salary — so this ${formatINR(ai.averageMonthly)}/mo can go toward your goals.`,
            `आपकी वास्तविक आय लगभग ${formatINR(ai.realMonthly)}/माह है — ${formatINR(ai.salaryMonthly)} वेतन और लगभग ${formatINR(ai.averageMonthly)}/माह अन्य आय जो मैंने ${ai.monthsWithIncome} महीनों में पाई (कुल ${formatINR(ai.totalDetected)})। आपका बैंक केवल वेतन देखता है — तो यह ${formatINR(ai.averageMonthly)}/माह आपके लक्ष्यों में लगाया जा सकता है।`,
          )
        : pick(lang, `I don't see income beyond your salary yet.`, `अभी वेतन के अलावा कोई आय नहीं दिख रही।`);
      return { bubbles: [{ kind: "text", text }] };
    }

    case "greeting": {
      return {
        bubbles: [
          {
            kind: "text",
            text: pick(
              lang,
              `Hi ${customer.name.split(" ")[0]}! I'm Saathi, your money companion. Ask me about your spending, goals, emergency fund, or investing.`,
              `नमस्ते ${customer.name.split(" ")[0]}! मैं साथी हूँ, आपका पैसा साथी। मुझसे अपने खर्च, लक्ष्य, आपातकालीन कोष या निवेश के बारे में पूछें।`,
            ),
          },
        ],
      };
    }

    default:
      return {
        bubbles: [
          {
            kind: "text",
            text: pick(
              lang,
              `I can help with your spending, goals, emergency fund, and suitable investments. Try one of the suggestions below.`,
              `मैं आपके खर्च, लक्ष्य, आपातकालीन कोष और उपयुक्त निवेश में मदद कर सकता हूँ। नीचे दिए गए सुझावों में से कोई आज़माएँ।`,
            ),
          },
        ],
      };
  }
}

/** Quick-prompt chips shown under the chat, localised. */
export function quickPrompts(lang: Language): { intent: AvatarIntent; label: string }[] {
  return [
    { intent: "emergency_fund", label: pick(lang, "How's my emergency fund?", "मेरा आपातकालीन कोष कैसा है?") },
    { intent: "goal", label: pick(lang, "Am I on track for Europe?", "क्या मैं यूरोप के लिए तैयार हूँ?") },
    { intent: "income", label: pick(lang, "What's my real income?", "मेरी वास्तविक आय क्या है?") },
    { intent: "stocks", label: pick(lang, "Which stocks should I buy?", "मुझे कौन से शेयर खरीदने चाहिए?") },
    { intent: "spend", label: pick(lang, "Where did my money go?", "मेरा पैसा कहाँ गया?") },
    { intent: "invest", label: pick(lang, "How should I invest my surplus?", "अधिशेष कैसे निवेश करूँ?") },
  ];
}
