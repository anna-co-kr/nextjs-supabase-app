"use client";

import { useTransition } from "react";
import { Pin, PinOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAnnouncement, togglePinAnnouncement } from "@/lib/actions/announcement";

// ---------------------------------------------------------------------------
// 공지 삭제 버튼
// ---------------------------------------------------------------------------
interface DeleteAnnouncementButtonProps {
  id: string;
  onError?: (message: string) => void;
}

export function DeleteAnnouncementButton({ id, onError }: DeleteAnnouncementButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm("공지를 삭제하시겠습니까? 삭제된 공지는 복구할 수 없습니다.")) return;
    startTransition(async () => {
      const result = await deleteAnnouncement(id);
      if (!result.success) {
        onError?.(result.error);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 text-xs text-destructive hover:text-destructive"
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? (
        "삭제 중..."
      ) : (
        <>
          <Trash2 className="mr-1 h-3 w-3" />
          삭제
        </>
      )}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// 공지 고정/해제 버튼
// ---------------------------------------------------------------------------
interface TogglePinButtonProps {
  id: string;
  isPinned: boolean;
  onError?: (message: string) => void;
}

export function TogglePinButton({ id, isPinned, onError }: TogglePinButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await togglePinAnnouncement(id);
      if (!result.success) {
        onError?.(result.error);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 text-xs"
      onClick={handleClick}
      disabled={isPending}
      title={isPinned ? "고정 해제" : "공지 고정"}
    >
      {isPending ? (
        "처리 중..."
      ) : isPinned ? (
        <>
          <PinOff className="mr-1 h-3 w-3" />
          해제
        </>
      ) : (
        <>
          <Pin className="mr-1 h-3 w-3" />
          고정
        </>
      )}
    </Button>
  );
}
