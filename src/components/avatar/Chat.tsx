"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { quickPrompts } from "@/lib/avatar/respond";
import { AvatarFace } from "@/components/layout/AvatarFace";
import { MessageBubble } from "@/components/avatar/MessageBubble";

/** The avatar conversation surface: history, quick prompts, and the input. */
export function Chat() {
  const { chat, language, customer, sendText, sendIntent } = useWealth();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const prompts = quickPrompts(language);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.length]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    sendText(text);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto scroll-slim p-4">
        {/* Welcome state before any conversation. */}
        {chat.length === 0 && (
          <div className="flex flex-col items-center py-6 text-center">
            <AvatarFace size={72} />
            <p className="mt-4 text-base font-semibold text-text-primary">{t("avatar.title", language)}</p>
            <p className="mt-1 max-w-[80%] text-xs text-text-muted">{t("avatar.subtitle", language)}</p>
            <p className="mt-4 text-sm text-text-primary">
              {t("home.greeting", language)}, {customer.name.split(" ")[0]} 👋
            </p>
          </div>
        )}

        {chat.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
        <div ref={endRef} />
      </div>

      {/* Quick prompts */}
      <div className="flex gap-2 overflow-x-auto scroll-slim border-t border-border px-4 py-2">
        {prompts.map((p) => (
          <button
            key={p.intent}
            onClick={() => sendIntent(p.intent, p.label)}
            className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-primary transition-colors hover:bg-surface-hover"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t("avatar.placeholder", language)}
          className="h-11 flex-1 rounded-full border border-border bg-surface px-4 text-sm text-text-primary outline-none focus:border-primary"
        />
        <button
          type="submit"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:opacity-50"
          disabled={!draft.trim()}
          aria-label={t("avatar.send", language)}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
