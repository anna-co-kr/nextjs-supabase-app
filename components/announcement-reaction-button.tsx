"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleReaction } from "@/lib/actions/announcement";

interface ReactionButtonProps {
  announcementId: string;
  emoji: string;
  count: number;
  reactedByMe: boolean;
}

export function ReactionButton({ announcementId, emoji, count, reactedByMe }: ReactionButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await toggleReaction(announcementId, emoji);
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        "flex cursor-pointer items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
        reactedByMe
          ? "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
          : "border-border bg-muted hover:bg-muted/80",
        isPending && "opacity-50",
      )}
    >
      {emoji} {count}
    </button>
  );
}

// ---------------------------------------------------------------------------
// 이모지 선택기 — 새 리액션 추가
// ---------------------------------------------------------------------------
const EMOJI_LIST = ["👍", "❤️", "😂", "😮", "🎉", "🙏"];

interface AddReactionButtonProps {
  announcementId: string;
}

export function AddReactionButton({ announcementId }: AddReactionButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleSelect = (emoji: string) => {
    startTransition(async () => {
      await toggleReaction(announcementId, emoji);
    });
  };

  return (
    <div className="flex flex-wrap gap-1">
      {EMOJI_LIST.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => handleSelect(emoji)}
          disabled={isPending}
          className="rounded px-1.5 py-0.5 text-base transition-colors hover:bg-muted disabled:opacity-50"
          title={`${emoji} 리액션`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
