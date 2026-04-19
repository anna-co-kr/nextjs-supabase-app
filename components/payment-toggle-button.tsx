"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { togglePaymentStatus } from "@/lib/actions/settlement";

interface PaymentToggleButtonProps {
  paymentId: string;
  isPaid: boolean;
}

/**
 * 납부 상태 토글 버튼
 * - 확인: is_paid false → true
 * - 취소: is_paid true → false
 */
export function PaymentToggleButton({ paymentId, isPaid }: PaymentToggleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await togglePaymentStatus(paymentId, !isPaid);
      if (result.success) {
        toast.success(isPaid ? "납부가 취소되었습니다" : "납부 완료로 처리되었습니다");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-7 text-xs"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isPaid ? "납부 취소" : "납부 확인"}
    >
      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : isPaid ? "취소" : "확인"}
    </Button>
  );
}
