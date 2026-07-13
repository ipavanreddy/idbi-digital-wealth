"use client";

import { createContext, useContext, useMemo, useReducer, type ReactNode } from "react";
import {
  DEMO_TODAY,
  DINING_SPLURGE_AMOUNT,
  IPHONE_AMOUNT,
  RAVI,
  RELATIONSHIP_MANAGERS,
  SEED_ACCOUNTS,
  SEED_GOALS,
  generateTransactions,
} from "@/lib/data/seed";
import { computeNudges } from "@/lib/rules/nudges";
import { respond, routeIntent, type AvatarAction, type AvatarBubble, type AvatarContext, type AvatarIntent } from "@/lib/avatar/respond";
import type { Account, ChatMessage, Goal, Language, Lead, LeadStatus, Nudge, Transaction } from "@/lib/types";

interface State {
  language: Language;
  consentGiven: boolean;
  accounts: Account[];
  transactions: Transaction[];
  goals: Goal[];
  nudges: Nudge[];
  leads: Lead[];
  chat: ChatMessage[];
  pendingLead: AvatarReplyLead | null;
  seq: number;
}

type AvatarReplyLead = { topic: string; detail: string; productInterest: string; regulated: boolean };

function buildInitial(language: Language = "en"): State {
  const accounts = SEED_ACCOUNTS.map((a) => ({ ...a }));
  const transactions = generateTransactions();
  const goals = SEED_GOALS.map((g) => ({ ...g }));
  const nudges = computeNudges({ customer: RAVI, accounts, transactions, goals, today: DEMO_TODAY });
  return { language, consentGiven: false, accounts, transactions, goals, nudges, leads: [], chat: [], pendingLead: null, seq: 0 };
}

type Action =
  | { type: "SET_LANGUAGE"; language: Language }
  | { type: "GIVE_CONSENT" }
  | { type: "INJECT_IPHONE" }
  | { type: "INJECT_DINING" }
  | { type: "ADD_CHAT"; bubbles: (AvatarBubble & { role: ChatMessage["role"] })[]; pendingLead?: AvatarReplyLead | null }
  | { type: "CREATE_LEAD"; draft: AvatarReplyLead }
  | { type: "SET_LEAD_STATUS"; id: string; status: LeadStatus }
  | { type: "ACK_NUDGE"; id: string }
  | { type: "RESET" };

function recompute(state: State): Nudge[] {
  return computeNudges({ customer: RAVI, accounts: state.accounts, transactions: state.transactions, goals: state.goals, today: DEMO_TODAY });
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LANGUAGE":
      return { ...state, language: action.language };

    case "GIVE_CONSENT":
      return { ...state, consentGiven: true };

    case "INJECT_IPHONE": {
      const txn: Transaction = {
        id: `txn-inject-${state.seq}`,
        date: DEMO_TODAY,
        merchant: "Apple Store — iPhone",
        amount: -IPHONE_AMOUNT,
        category: "shopping",
        channel: "CARD",
        injected: true,
      };
      const accounts = state.accounts.map((a) => (a.type === "SAVINGS" ? { ...a, balance: a.balance - IPHONE_AMOUNT } : a));
      const transactions = [txn, ...state.transactions];
      const next = { ...state, accounts, transactions, seq: state.seq + 1 };
      return { ...next, nudges: recompute(next) };
    }

    case "INJECT_DINING": {
      const txn: Transaction = {
        id: `txn-inject-${state.seq}`,
        date: DEMO_TODAY,
        merchant: "Toit Brewpub — group dinner",
        amount: -DINING_SPLURGE_AMOUNT,
        category: "food",
        channel: "CARD",
        injected: true,
      };
      const accounts = state.accounts.map((a) => (a.type === "SAVINGS" ? { ...a, balance: a.balance - DINING_SPLURGE_AMOUNT } : a));
      const transactions = [txn, ...state.transactions];
      const next = { ...state, accounts, transactions, seq: state.seq + 1 };
      return { ...next, nudges: recompute(next) };
    }

    case "ADD_CHAT": {
      let seq = state.seq;
      const stamped: ChatMessage[] = action.bubbles.map((b) => ({
        id: `msg-${seq++}`,
        role: b.role,
        kind: b.kind,
        text: b.text,
        createdAt: DEMO_TODAY,
        meta: b.actions ? { ...b.meta, actions: b.actions } : b.meta,
      }));
      return {
        ...state,
        chat: [...state.chat, ...stamped],
        seq,
        pendingLead: action.pendingLead !== undefined ? action.pendingLead : state.pendingLead,
      };
    }

    case "CREATE_LEAD": {
      const rm = action.draft.regulated ? RELATIONSHIP_MANAGERS[0] : RELATIONSHIP_MANAGERS[1];
      const lead: Lead = {
        id: `lead-${state.seq}`,
        customerName: RAVI.name,
        topic: action.draft.topic,
        detail: action.draft.detail,
        productInterest: action.draft.productInterest,
        regulated: action.draft.regulated,
        status: "NEW",
        assignedRM: rm.name,
        createdAt: DEMO_TODAY,
      };
      return { ...state, leads: [lead, ...state.leads], seq: state.seq + 1, pendingLead: null };
    }

    case "SET_LEAD_STATUS":
      return { ...state, leads: state.leads.map((l) => (l.id === action.id ? { ...l, status: action.status } : l)) };

    case "ACK_NUDGE":
      return { ...state, nudges: state.nudges.map((n) => (n.id === action.id ? { ...n, acknowledged: true } : n)) };

    case "RESET":
      return buildInitial(state.language);

    default:
      return state;
  }
}

interface StoreValue extends State {
  customer: typeof RAVI;
  today: string;
  managers: typeof RELATIONSHIP_MANAGERS;
  setLanguage: (lang: Language) => void;
  giveConsent: () => void;
  injectIphone: () => void;
  injectDining: () => void;
  sendIntent: (intent: AvatarIntent, userText?: string) => void;
  sendText: (text: string) => void;
  runAction: (action: AvatarAction["action"]) => void;
  createLeadFromNudge: (topic: string, detail: string, productInterest: string, regulated: boolean) => void;
  setLeadStatus: (id: string, status: LeadStatus) => void;
  acknowledgeNudge: (id: string) => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function WealthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => buildInitial("en"));

  const value = useMemo<StoreValue>(() => {
    const ctx: AvatarContext = { customer: RAVI, accounts: state.accounts, transactions: state.transactions, goals: state.goals, today: DEMO_TODAY };

    const emitReply = (intent: AvatarIntent, userText?: string) => {
      const reply = respond(intent, ctx, state.language);
      const bubbles: (AvatarBubble & { role: ChatMessage["role"] })[] = [];
      if (userText) bubbles.push({ role: "user", kind: "text", text: userText });
      for (const b of reply.bubbles) bubbles.push({ ...b, role: "avatar" });
      dispatch({ type: "ADD_CHAT", bubbles, pendingLead: reply.lead ?? null });
    };

    return {
      ...state,
      customer: RAVI,
      today: DEMO_TODAY,
      managers: RELATIONSHIP_MANAGERS,
      setLanguage: (language) => dispatch({ type: "SET_LANGUAGE", language }),
      giveConsent: () => dispatch({ type: "GIVE_CONSENT" }),
      injectIphone: () => dispatch({ type: "INJECT_IPHONE" }),
      injectDining: () => dispatch({ type: "INJECT_DINING" }),
      sendIntent: (intent, userText) => emitReply(intent, userText),
      sendText: (text) => emitReply(routeIntent(text), text),
      runAction: (action) => {
        if (action === "create_lead" && state.pendingLead) {
          dispatch({ type: "CREATE_LEAD", draft: state.pendingLead });
          const confirm: (AvatarBubble & { role: ChatMessage["role"] }) = {
            role: "avatar",
            kind: "lead",
            text:
              state.language === "en"
                ? "Done — I've raised a callback request with a certified relationship manager. You'll hear from them within a working day."
                : "हो गया — मैंने एक प्रमाणित रिलेशनशिप मैनेजर के साथ कॉलबैक अनुरोध दर्ज किया है। एक कार्यदिवस में आपसे संपर्क होगा।",
          };
          dispatch({ type: "ADD_CHAT", bubbles: [confirm], pendingLead: null });
        }
      },
      createLeadFromNudge: (topic, detail, productInterest, regulated) =>
        dispatch({ type: "CREATE_LEAD", draft: { topic, detail, productInterest, regulated } }),
      setLeadStatus: (id, status) => dispatch({ type: "SET_LEAD_STATUS", id, status }),
      acknowledgeNudge: (id) => dispatch({ type: "ACK_NUDGE", id }),
      resetDemo: () => dispatch({ type: "RESET" }),
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useWealth(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useWealth must be used within WealthProvider");
  return ctx;
}
