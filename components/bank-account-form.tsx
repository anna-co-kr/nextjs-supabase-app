"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { bankAccountSchema, type BankAccountInput } from "@/lib/schemas/settlement";
import { upsertBankAccount } from "@/lib/actions/settlement";
import type { Tables } from "@/types/database.types";

interface BankAccountFormProps {
  eventId: string;
  /** 기존 계좌 정보 — 없으면 등록 모드, 있으면 수정 모드 */
  existingAccount?: Tables<"host_bank_accounts"> | null;
}

/**
 * 입금 계좌 등록/수정 폼 컴포넌트
 * - Dialog 트리거 버튼 + 내부 폼
 * - existingAccount 여부에 따라 "등록" / "수정" 모드 전환
 */
export function BankAccountForm({ eventId, existingAccount }: BankAccountFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEdit = !!existingAccount;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankAccountInput>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bank_name: existingAccount?.bank_name ?? "",
      account_number: existingAccount?.account_number ?? "",
      account_holder: existingAccount?.account_holder ?? "",
    },
  });

  const onSubmit = (data: BankAccountInput) => {
    startTransition(async () => {
      const result = await upsertBankAccount(eventId, data);
      if (result.success) {
        toast.success(isEdit ? "계좌가 수정되었습니다" : "계좌가 등록되었습니다");
        setOpen(false);
      } else {
        toast.error(result.error ?? "계좌 저장에 실패했습니다");
      }
    });
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      // Dialog 닫힐 때 폼 초기값으로 리셋
      reset({
        bank_name: existingAccount?.bank_name ?? "",
        account_number: existingAccount?.account_number ?? "",
        account_holder: existingAccount?.account_holder ?? "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {isEdit ? "수정" : "등록"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "계좌 수정" : "계좌 등록"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 은행명 */}
          <div className="space-y-1.5">
            <Label htmlFor="bank_name">은행명</Label>
            <Input id="bank_name" placeholder="예: 카카오뱅크" {...register("bank_name")} />
            {errors.bank_name && (
              <p className="text-xs text-destructive">{errors.bank_name.message}</p>
            )}
          </div>

          {/* 계좌번호 */}
          <div className="space-y-1.5">
            <Label htmlFor="account_number">계좌번호</Label>
            <Input
              id="account_number"
              placeholder="예: 3333-01-1234567"
              {...register("account_number")}
            />
            {errors.account_number && (
              <p className="text-xs text-destructive">{errors.account_number.message}</p>
            )}
          </div>

          {/* 예금주 */}
          <div className="space-y-1.5">
            <Label htmlFor="account_holder">예금주</Label>
            <Input id="account_holder" placeholder="예: 홍길동" {...register("account_holder")} />
            {errors.account_holder && (
              <p className="text-xs text-destructive">{errors.account_holder.message}</p>
            )}
          </div>

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "수정 저장" : "등록"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
