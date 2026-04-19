"use client";

import { useTransition } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { sendUnpaidReminders } from "@/lib/actions/settlement";

interface SendReminderButtonProps {
  eventId: string;
}

/**
 * 미납자 리마인더 발송 버튼
 * - 클라이언트 컴포넌트: useTransition으로 pending 상태 관리
 * - 24시간 쿨다운이 적용된 미납자에게만 이메일 발송
 */
export function SendReminderButton({ eventId }: SendReminderButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await sendUnpaidReminders(eventId);

      if (result.success) {
        const { sent, skipped } = result.data;
        if (sent === 0) {
          toast.success("미납자가 없거나 모두 쿨다운 중입니다");
        } else {
          toast.success(
            `${sent}명에게 발송 완료${skipped > 0 ? ` (${skipped}명 쿨다운으로 건너뜀)` : ""}`,
          );
        }
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={isPending}>
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Mail className="mr-2 h-4 w-4" />
      )}
      미납자 리마인더 발송
    </Button>
  );
}
