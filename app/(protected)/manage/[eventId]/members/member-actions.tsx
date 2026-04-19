"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateMemberStatus } from "@/lib/actions/member";
import { toast } from "sonner";

interface MemberActionsProps {
  memberId: string;
  currentStatus: "confirmed" | "waiting" | "rejected";
}

/**
 * 멤버 상태 변경 버튼 (클라이언트 컴포넌트)
 * Server Action(updateMemberStatus)을 호출하고 결과를 toast로 표시
 */
export function MemberActions({ memberId, currentStatus }: MemberActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (newStatus: "confirmed" | "rejected") => {
    startTransition(async () => {
      const result = await updateMemberStatus(memberId, newStatus);
      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(newStatus === "confirmed" ? "참여 확정되었습니다" : "거절 처리되었습니다");
      }
    });
  };

  return (
    <div className="flex gap-1">
      {currentStatus !== "confirmed" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          disabled={isPending}
          onClick={() => handleStatusChange("confirmed")}
        >
          확정
        </Button>
      )}
      {currentStatus !== "rejected" && (
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs text-destructive hover:text-destructive"
          disabled={isPending}
          onClick={() => handleStatusChange("rejected")}
        >
          거절
        </Button>
      )}
    </div>
  );
}
