"use client";

import { useTransition } from "react";
import { Loader2, Pin, PinOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteAnnouncement, togglePinAnnouncement } from "@/lib/actions/announcement";

// ---------------------------------------------------------------------------
// 공지 삭제 버튼
// ---------------------------------------------------------------------------
interface DeleteAnnouncementButtonProps {
  id: string;
}

export function DeleteAnnouncementButton({ id }: DeleteAnnouncementButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (!confirm("공지를 삭제하시겠습니까? 삭제된 공지는 복구할 수 없습니다.")) return;
    startTransition(async () => {
      const result = await deleteAnnouncement(id);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("공지가 삭제되었습니다");
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
      aria-label="공지 삭제"
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
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
}

export function TogglePinButton({ id, isPinned }: TogglePinButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await togglePinAnnouncement(id);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(isPinned ? "고정이 해제되었습니다" : "공지가 고정되었습니다");
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
      aria-label={isPinned ? "공지 고정 해제" : "공지 고정"}
    >
      {isPending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
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
