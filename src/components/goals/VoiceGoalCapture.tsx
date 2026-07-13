"use client";

import { useRef, useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { useWealth } from "@/lib/store";
import { t } from "@/lib/i18n";
import { addMonthsIso, formatINRShort } from "@/lib/format";
import { parseGoals } from "@/lib/voice/parseGoals";
import { useSpeechRecognition } from "@/lib/voice/useSpeechRecognition";
import type { GoalDraft } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MicButton } from "@/components/ui/MicButton";
import { Icon } from "@/components/ui/Icon";

/**
 * Speak (or type) goals → parse into editable drafts → add. The mic just fills
 * the textarea, so the whole flow also works by typing when speech is
 * unsupported. Parsing is deterministic (lib/voice/parseGoals).
 */
export function VoiceGoalCapture() {
  const { addGoal, today, language } = useWealth();
  const [text, setText] = useState("");
  const [drafts, setDrafts] = useState<GoalDraft[] | null>(null);
  const baseRef = useRef("");
  const speech = useSpeechRecognition(language, (transcript) => {
    setText(baseRef.current ? `${baseRef.current} ${transcript}` : transcript);
  });

  const toggleMic = () => {
    if (speech.listening) {
      speech.stop();
    } else {
      baseRef.current = text.trim();
      speech.start();
    }
  };

  const find = () => setDrafts(parseGoals(text));

  const edit = (id: string, patch: Partial<GoalDraft>) =>
    setDrafts((ds) => ds?.map((d) => (d.id === id ? { ...d, ...patch } : d)) ?? null);

  const remove = (id: string) => setDrafts((ds) => ds?.filter((d) => d.id !== id) ?? null);

  const addAll = () => {
    for (const d of drafts ?? []) {
      addGoal({
        name: d.title,
        type: d.type,
        icon: d.icon,
        targetAmount: Math.max(1000, d.amount),
        savedAmount: 0,
        targetDate: addMonthsIso(today, d.months),
        monthlyContribution: 0,
      });
    }
    setDrafts(null);
    setText("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles size={15} className="text-accent" /> {t("voice.goalsTitle", language)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="-mt-2 mb-3 text-xs text-text-muted">
          {speech.supported ? t("voice.goalsHint", language) : t("voice.unsupported", language)}
        </p>

        <div className="flex items-start gap-2">
          {speech.supported && <MicButton listening={speech.listening} onClick={toggleMic} label={t("voice.speakToType", language)} size="sm" />}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={speech.listening ? t("voice.listening", language) : t("voice.transcriptPlaceholder", language)}
            className="min-h-[68px] flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none focus:border-primary"
          />
        </div>

        <Button className="mt-3 w-full" onClick={find} disabled={!text.trim()}>
          {t("voice.findGoals", language)}
        </Button>

        {drafts !== null && drafts.length === 0 && (
          <p className="mt-3 text-center text-sm text-text-muted">{t("voice.none", language)}</p>
        )}

        {drafts && drafts.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-text-muted">{t("voice.review", language)}</p>
            {drafts.map((d) => (
              <DraftRow key={d.id} draft={d} onEdit={(p) => edit(d.id, p)} onRemove={() => remove(d.id)} language={language} />
            ))}
            <Button variant="accent" className="w-full" onClick={addAll}>
              {t("voice.add", language)} ({drafts.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DraftRow({
  draft,
  onEdit,
  onRemove,
  language,
}: {
  draft: GoalDraft;
  onEdit: (patch: Partial<GoalDraft>) => void;
  onRemove: () => void;
  language: "en" | "hi";
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-hover p-3">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
          <Icon name={draft.icon} size={16} />
        </span>
        <input
          value={draft.title}
          onChange={(e) => onEdit({ title: e.target.value })}
          className="h-9 flex-1 rounded-md border border-border bg-surface px-2 text-sm font-medium text-text-primary outline-none focus:border-primary"
        />
        <button onClick={onRemove} className="shrink-0 text-text-muted hover:text-error" aria-label="Remove">
          <Trash2 size={16} />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        <label className="flex items-center gap-1 text-text-muted">
          {t("voice.inMonths", language)}
          <input
            type="number"
            min={1}
            value={draft.months}
            onChange={(e) => onEdit({ months: Math.max(1, Number(e.target.value) || 1) })}
            className="h-8 w-14 rounded-md border border-border bg-surface px-2 text-center text-text-primary outline-none focus:border-primary"
          />
          {t("voice.monthsUnit", language)}
        </label>
        <label className="ml-auto flex items-center gap-1 text-text-muted">
          {t("voice.target", language)}
          <input
            type="number"
            min={1000}
            step={10000}
            value={draft.amount}
            onChange={(e) => onEdit({ amount: Math.max(1000, Number(e.target.value) || 1000) })}
            className="h-8 w-24 rounded-md border border-border bg-surface px-2 text-right text-text-primary outline-none focus:border-primary"
          />
        </label>
        <span className="shrink-0 font-medium text-text-primary">{formatINRShort(draft.amount)}</span>
      </div>
    </div>
  );
}
