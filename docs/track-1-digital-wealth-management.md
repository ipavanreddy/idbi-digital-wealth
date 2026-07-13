# Track 1 — Digital Wealth Management (`apps/wealth-avatar`)

Tags: Wealth Advisory · Conversational AI · Mobile Banking

## Official problem statement

> Wealth management and advisory services remain fragmented and largely
> inaccessible to large number of customers. Absence of comprehensive customer
> investment behaviour and spending habits limits the ability to provide
> timely, personalized, data-driven guidance.

**Expected outcome:** AI-powered Digital Wealth Management (Avatar Based)
application which integrates into the bank's mobile application, to deliver
personalized and scalable wealth advisory services through an intuitive
digital interface.

## What IDBI said they want (GM Harikeshin, explainer session)

- 360° view of the customer: savings, investments, spending patterns.
- **Avatar-based**, integrates with the bank's mobile app as phase 1.
- **Hybrid model**: AI handles vanilla/non-regulated products directly;
  complex or regulated cases (SEBI-governed advice) generate a **lead that is
  passed to a seasoned relationship manager**. The app is also a lead
  generator.
- Suitability metrics derived from goals (short/long-term), spend behaviour,
  investment pattern, capacity — product suggestions follow suitability.
- Serves all segments (mass → HNI) at bank scale.
- **Multi-language support is important** (pan-India branch network).
- Market-linked products need frequent market updates/notifications so the
  customer can make informed decisions.

## Our solution (Shristi's spec — canonical)

An AI agent that ingests the customer's full transaction stream and becomes a
proactive financial coach:

1. **Spend intelligence**: auto-categorize every transaction — food, shopping,
   investments, regular expenses; detect salary-credit day and income rhythm.
2. **Proactive nudges tied to real events** (the demo-winning behaviour):
   - *Emergency fund guard*: "Your 6-month emergency fund dropped to 4 months
     because of the iPhone purchase. Saving ₹X/month gets you back to 6 months
     in N months."
   - *Goal tracking*: Europe trip goal ₹5,00,000, saved ₹3,80,000. When the
     user overspends (₹10,000 on dining), the avatar recomputes: "Here's what
     you can spend on food this month and still close the remaining ₹1.2L in
     2–3 months."
3. **Advisory, not tipping**: warns on spending, guides on saving/investing
   allocation. Direct stock-level recommendations are an optional module —
   and in the bank context they route to the RM (hybrid escalation), keeping
   us SEBI-clean.
4. **Avatar chat UI** in the mobile-app style: conversational, multi-language
   (demo English + Hindi minimum), with goal cards and spending charts.

## Demo storyline (build the app to tell this story)

Synthetic customer "Ravi", 6 months of generated transactions → salary
detected → dashboard shows categorized spend → he "buys an iPhone" (inject
transaction) → avatar nudges about the emergency fund → he asks about his
Europe-trip goal → avatar shows the plan → he asks "which stocks should I
buy?" → avatar explains suitability and offers an RM callback (lead created →
visible in a small RM console view).

## Success metrics for the deck

Advisory coverage at bank scale (automated for mass segment), lead quality to
RMs, engagement (nudges acted on), goal completion rate. Cost per advisory
interaction vs human-only model.

## Build notes

- Synthetic data generator: 6–12 months of realistic Indian transaction data
  (UPI merchants, salary credits, SIPs, rent) — Aman.
- Nudge engine: deterministic rules (Shristi's financial math) + Claude for
  natural-language delivery in the avatar's voice. Rules decide, LLM talks —
  this keeps advice auditable, which bankers will ask about.
- Avatar: animated presenter component is enough; do not sink time into 3D.
