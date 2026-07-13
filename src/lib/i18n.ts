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
  "nav.avatar": { en: "Saathi", hi: "साथी" },
  "nav.alerts": { en: "Alerts", hi: "अलर्ट" },

  "home.greeting": { en: "Hi", hi: "नमस्ते" },
  "home.netWorth": { en: "Net worth", hi: "कुल संपत्ति" },
  "home.savings": { en: "Savings", hi: "बचत" },
  "home.investments": { en: "Investments", hi: "निवेश" },
  "home.deposits": { en: "Deposits", hi: "जमा" },
  "home.emergencyFund": { en: "Emergency fund", hi: "आपातकालीन कोष" },
  "home.months": { en: "months", hi: "महीने" },
  "home.spendThisMonth": { en: "Spending this month", hi: "इस महीने का खर्च" },
  "home.topNudge": { en: "From Saathi", hi: "साथी से" },
  "home.talkToAvatar": { en: "Talk to Saathi", hi: "साथी से बात करें" },
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
  "goals.askAvatar": { en: "Ask Saathi", hi: "साथी से पूछें" },

  "avatar.title": { en: "Saathi", hi: "साथी" },
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

  "connect.title": { en: "Connect your money", hi: "अपना पैसा जोड़ें" },
  "connect.subtitle": { en: "The more Saathi sees, the sharper your advice.", hi: "साथी जितना ज़्यादा देखेगा, सलाह उतनी बेहतर।" },
  "connect.sees": { en: "Saathi sees", hi: "साथी देखता है" },
  "connect.ofYourMoney": { en: "of your money", hi: "आपके पैसे का" },
  "connect.banks": { en: "Banks & accounts", hi: "बैंक और खाते" },
  "connect.cards": { en: "Cards", hi: "कार्ड" },
  "connect.upi": { en: "UPI IDs", hi: "UPI आईडी" },
  "connect.add": { en: "Add", hi: "जोड़ें" },
  "connect.none": { en: "None linked yet", hi: "अभी कुछ नहीं जुड़ा" },
  "connect.viaAA": { en: "via Account Aggregator", hi: "अकाउंट एग्रीगेटर द्वारा" },
  "connect.viaManual": { en: "manually added", hi: "मैन्युअल रूप से जोड़ा" },
  "connect.pan": { en: "PAN", hi: "पैन" },
  "connect.panHint": { en: "Links your spends across banks (RBI Account Aggregator).", hi: "आपके सभी बैंकों के खर्च जोड़ता है (RBI अकाउंट एग्रीगेटर)।" },
  "connect.panInvalid": { en: "Enter a valid PAN (ABCDE1234F).", hi: "मान्य पैन दर्ज करें (ABCDE1234F)।" },
  "connect.last4Invalid": { en: "Enter the last 4 digits.", hi: "अंतिम 4 अंक दर्ज करें।" },
  "connect.upiInvalid": { en: "Enter a valid UPI ID (name@bank).", hi: "मान्य UPI आईडी दर्ज करें (name@bank)।" },
  "connect.linked": { en: "Linked", hi: "जुड़ा" },
  "connect.save": { en: "Save", hi: "सहेजें" },
  "connect.link": { en: "Link", hi: "जोड़ें" },
  "connect.cancel": { en: "Cancel", hi: "रद्द करें" },

  "connect.permissions": { en: "Permissions", hi: "अनुमतियाँ" },
  "connect.permissionsSub": { en: "You control what Saathi can use. Revoke anytime (DPDP Act).", hi: "आप तय करते हैं साथी क्या उपयोग करे। कभी भी वापस लें (DPDP अधिनियम)।" },
  "connect.cTxn": { en: "Transaction access", hi: "लेन-देन एक्सेस" },
  "connect.cTxnDesc": { en: "Read your account & card statements to categorize spend.", hi: "खर्च वर्गीकृत करने के लिए आपके खाते और कार्ड विवरण पढ़ें।" },
  "connect.cLocation": { en: "Location for context", hi: "संदर्भ के लिए स्थान" },
  "connect.cLocationDesc": { en: "Spot places you visit often for smarter, timely nudges.", hi: "समय पर बेहतर सुझावों के लिए अक्सर जाने वाली जगहें पहचानें।" },
  "connect.cExtraIncome": { en: "Additional income", hi: "अतिरिक्त आय" },
  "connect.cExtraIncomeDesc": { en: "Detect freelance / other income beyond your salary.", hi: "वेतन के अलावा फ्रीलांस / अन्य आय पहचानें।" },

  "connect.found": { en: "What Saathi found", hi: "साथी ने क्या पाया" },
  "connect.hiddenIncome": { en: "Income beyond your salary", hi: "वेतन से अधिक आय" },
  "connect.realIncome": { en: "Real monthly income", hi: "वास्तविक मासिक आय" },
  "connect.bankSees": { en: "Your bank sees only", hi: "आपका बैंक केवल देखता है" },
  "connect.frequentPlaces": { en: "Places you visit often", hi: "अक्सर जाने वाली जगहें" },
  "connect.visits": { en: "visits", hi: "बार" },
  "connect.enableToSee": { en: "Turn on the permission to see this.", hi: "देखने के लिए अनुमति चालू करें।" },

  "connect.sheetBank": { en: "Link a bank account", hi: "बैंक खाता जोड़ें" },
  "connect.sheetCard": { en: "Add a card", hi: "कार्ड जोड़ें" },
  "connect.sheetUpi": { en: "Add a UPI ID", hi: "UPI आईडी जोड़ें" },
  "connect.fBank": { en: "Bank", hi: "बैंक" },
  "connect.fAccountType": { en: "Account type", hi: "खाता प्रकार" },
  "connect.fNetwork": { en: "Network", hi: "नेटवर्क" },
  "connect.fCardKind": { en: "Card type", hi: "कार्ड प्रकार" },
  "connect.fIssuer": { en: "Issuer bank", hi: "जारीकर्ता बैंक" },
  "connect.fLast4": { en: "Last 4 digits", hi: "अंतिम 4 अंक" },
  "connect.fUpi": { en: "UPI ID", hi: "UPI आईडी" },
  "connect.savings": { en: "Savings", hi: "बचत" },
  "connect.current": { en: "Current", hi: "चालू" },
  "connect.credit": { en: "Credit", hi: "क्रेडिट" },
  "connect.debit": { en: "Debit", hi: "डेबिट" },

  "connect.ctaTitle": { en: "Connect your money", hi: "अपना पैसा जोड़ें" },
  "connect.ctaSub": { en: "Add cards, UPI & PAN so Saathi sees your full picture.", hi: "कार्ड, UPI और पैन जोड़ें ताकि साथी पूरी तस्वीर देखे।" },
} as const;

export type TKey = keyof typeof DICT;

export function t(key: TKey, lang: Language): string {
  return DICT[key][lang];
}

export const LANGUAGE_LABEL: Record<Language, string> = { en: "EN", hi: "हिं" };
