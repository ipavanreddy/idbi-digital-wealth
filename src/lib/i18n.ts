import type { Language } from "@/lib/types";

/**
 * UI string dictionary (English + Hindi). IDBI stressed multi-language support
 * for its pan-India network; the demo ships en + hi and the toggle re-renders
 * the whole shell. The avatar's conversational replies are localised separately
 * in lib/avatar/respond.ts.
 */
const DICT = {
  "app.name": { en: "Wealth Avatar", hi: "वेल्थ अवतार" },
  "app.tagline": { en: "Your everyday money coach", hi: "आपका रोज़ का पैसा कोच" },

  "nav.home": { en: "Home", hi: "होम" },
  "nav.spend": { en: "Spends", hi: "खर्च" },
  "nav.goals": { en: "Goals", hi: "लक्ष्य" },
  "nav.avatar": { en: "Avatar", hi: "अवतार" },
  "nav.alerts": { en: "Alerts", hi: "अलर्ट" },

  "home.greeting": { en: "Hi", hi: "नमस्ते" },
  "home.netWorth": { en: "Net worth", hi: "कुल संपत्ति" },
  "home.savings": { en: "Savings", hi: "बचत" },
  "home.investments": { en: "Investments", hi: "निवेश" },
  "home.deposits": { en: "Deposits", hi: "जमा" },
  "home.emergencyFund": { en: "Emergency fund", hi: "आपातकालीन कोष" },
  "home.months": { en: "months", hi: "महीने" },
  "home.spendThisMonth": { en: "Spending this month", hi: "इस महीने का खर्च" },
  "home.topNudge": { en: "From your avatar", hi: "आपके अवतार से" },
  "home.talkToAvatar": { en: "Talk to your avatar", hi: "अवतार से बात करें" },
  "home.viewAll": { en: "View all", hi: "सभी देखें" },
  "home.salaryDetected": { en: "Salary detected on day", hi: "वेतन का दिन" },

  "spend.title": { en: "Spend intelligence", hi: "खर्च विश्लेषण" },
  "spend.byCategory": { en: "By category", hi: "श्रेणी अनुसार" },
  "spend.transactions": { en: "Transactions", hi: "लेन-देन" },
  "spend.empty": { en: "No transactions yet", hi: "अभी कोई लेन-देन नहीं" },

  "goals.title": { en: "Your goals", hi: "आपके लक्ष्य" },
  "goals.saved": { en: "saved", hi: "बचाया" },
  "goals.of": { en: "of", hi: "में से" },
  "goals.onTrack": { en: "On track", hi: "सही राह पर" },
  "goals.behind": { en: "Needs attention", hi: "ध्यान दें" },
  "goals.needPerMonth": { en: "needed / month", hi: "प्रति माह चाहिए" },
  "goals.askAvatar": { en: "Ask the avatar", hi: "अवतार से पूछें" },

  "avatar.title": { en: "Your avatar", hi: "आपका अवतार" },
  "avatar.placeholder": { en: "Ask about your money…", hi: "अपने पैसे के बारे में पूछें…" },
  "avatar.send": { en: "Send", hi: "भेजें" },
  "avatar.subtitle": { en: "Advisory, not tips. Regulated advice goes to a human RM.", hi: "सलाह, टिप नहीं। विनियमित सलाह मानव RM को जाती है।" },

  "alerts.title": { en: "Alerts & nudges", hi: "अलर्ट और सुझाव" },
  "alerts.empty": { en: "You're all caught up", hi: "सब कुछ अपडेट है" },
  "alerts.market": { en: "Market updates", hi: "बाज़ार अपडेट" },

  "consent.title": { en: "Your data, your consent", hi: "आपका डेटा, आपकी सहमति" },
  "consent.body": {
    en: "Wealth Avatar reads your transaction history to give personalised guidance. Your data stays within IDBI and is never sold. You can withdraw consent anytime (DPDP Act, 2023).",
    hi: "वेल्थ अवतार व्यक्तिगत सलाह के लिए आपका लेन-देन इतिहास पढ़ता है। आपका डेटा IDBI के भीतर रहता है और कभी नहीं बेचा जाता। आप कभी भी सहमति वापस ले सकते हैं (DPDP अधिनियम, 2023)।",
  },
  "consent.agree": { en: "I agree & continue", hi: "मैं सहमत हूँ, आगे बढ़ें" },
  "consent.decline": { en: "Not now", hi: "अभी नहीं" },

  "rm.title": { en: "RM Console", hi: "RM कंसोल" },
  "rm.subtitle": { en: "Qualified leads escalated by the avatar", hi: "अवतार द्वारा भेजे गए योग्य लीड" },
  "rm.empty": { en: "No leads yet", hi: "अभी कोई लीड नहीं" },
  "rm.regulated": { en: "SEBI-regulated", hi: "SEBI-विनियमित" },
  "rm.markContacted": { en: "Mark contacted", hi: "संपर्क किया" },
  "rm.close": { en: "Close lead", hi: "लीड बंद करें" },
} as const;

export type TKey = keyof typeof DICT;

export function t(key: TKey, lang: Language): string {
  return DICT[key][lang];
}

export const LANGUAGE_LABEL: Record<Language, string> = { en: "EN", hi: "हिं" };
