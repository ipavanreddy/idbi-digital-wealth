"use client";

import { useWealth } from "@/lib/store";
import type { ChatMessage } from "@/lib/types";
import type { AvatarAction } from "@/lib/avatar/respond";
import { AvatarFace } from "@/components/layout/AvatarFace";
import { RichCard } from "@/components/avatar/RichCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const { runAction } = useWealth();
  const actions = (message.meta?.actions as AvatarAction[] | undefined) ?? [];

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <AvatarFace size={32} animated={false} className="mt-0.5 shrink-0" />
      <div className="max-w-[85%]">
        <div className="rounded-2xl rounded-tl-sm border border-border bg-surface px-3.5 py-2.5 text-sm text-text-primary">
          {message.text}
          <RichCard message={message} />
        </div>
        {actions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {actions.map((a) => (
              <Button key={a.action} size="sm" variant="accent" onClick={() => runAction(a.action)}>
                {a.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
