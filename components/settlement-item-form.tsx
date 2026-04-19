"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { settlementItemBaseSchema, type SettlementItemCreateInput } from "@/lib/schemas/settlement";
import { createSettlementItem } from "@/lib/actions/settlement";
import { SPLIT_TYPE_LABEL } from "@/lib/utils/settlement";
import type { ConfirmedMemberWithProfile } from "@/lib/supabase/settlements";

interface SettlementItemFormProps {
  eventId: string;
  /** 확정 참여자 목록 (서버에서 미리 조회) */
  confirmedMembers: ConfirmedMemberWithProfile[];
}

/**
 * 정산 항목 추가 폼 컴포넌트
 * - Dialog 트리거 버튼 + 내부 폼
 * - split_type에 따라 동적으로 추가 입력 필드 표시
 */
export function SettlementItemForm({ eventId, confirmedMembers }: SettlementItemFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SettlementItemCreateInput>({
    resolver: zodResolver(settlementItemBaseSchema),
    defaultValues: {
      eventId,
      name: "",
      total_amount: 0,
      split_type: "equal",
      individual_amounts: confirmedMembers.map((m) => ({ eventMemberId: m.id, amount: 0 })),
      ratios: confirmedMembers.map((m) => ({ eventMemberId: m.id, ratio: 0 })),
    },
  });

  // split_type 감시
  const splitType = watch("split_type");
  const ratios = watch("ratios");

  // ratios 변경 시 합산 계산
  const computedRatioTotal = (ratios ?? []).reduce((sum, r) => sum + (r?.ratio ?? 0), 0);

  /**
   * 멤버 표시 이름 반환 헬퍼
   */
  const getMemberName = (member: ConfirmedMemberWithProfile): string => {
    return member.profile.full_name ?? member.profile.email ?? "알 수 없음";
  };

  const onSubmit = (values: SettlementItemCreateInput) => {
    startTransition(async () => {
      const result = await createSettlementItem(values);
      if (result.success) {
        toast.success("정산 항목이 추가되었습니다");
        reset({
          eventId,
          name: "",
          total_amount: 0,
          split_type: "equal",
          individual_amounts: confirmedMembers.map((m) => ({ eventMemberId: m.id, amount: 0 })),
          ratios: confirmedMembers.map((m) => ({ eventMemberId: m.id, ratio: 0 })),
        });
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          항목 추가
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>정산 항목 추가</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* eventId hidden */}
          <input type="hidden" {...register("eventId")} />

          {/* 항목명 */}
          <div className="space-y-1.5">
            <Label htmlFor="settlement-name">항목명</Label>
            <Input
              id="settlement-name"
              placeholder="예) 숙박비, 식비"
              {...register("name")}
              disabled={isPending}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* 총 금액 */}
          <div className="space-y-1.5">
            <Label htmlFor="settlement-amount">총 금액 (원)</Label>
            <Input
              id="settlement-amount"
              type="number"
              min={1}
              placeholder="예) 150000"
              {...register("total_amount", { valueAsNumber: true })}
              disabled={isPending}
            />
            {errors.total_amount && (
              <p className="text-xs text-destructive">{errors.total_amount.message}</p>
            )}
          </div>

          {/* 분담 방식 */}
          <div className="space-y-1.5">
            <Label>분담 방식</Label>
            <Select
              defaultValue="equal"
              onValueChange={(val) => {
                setValue("split_type", val as SettlementItemCreateInput["split_type"]);
              }}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="분담 방식 선택" />
              </SelectTrigger>
              <SelectContent>
                {(["equal", "individual", "ratio"] as const).map((type) => (
                  <SelectItem key={type} value={type}>
                    {SPLIT_TYPE_LABEL[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.split_type && (
              <p className="text-xs text-destructive">{errors.split_type.message}</p>
            )}
          </div>

          {/* 개별 지정: 멤버별 금액 입력 */}
          {splitType === "individual" && (
            <div className="space-y-3">
              <Label>멤버별 금액</Label>
              {confirmedMembers.map((member, idx) => (
                <div key={member.id} className="flex items-center gap-3">
                  {/* 멤버 이름 */}
                  <span className="w-24 shrink-0 truncate text-sm">{getMemberName(member)}</span>
                  {/* 금액 입력 */}
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    {...register(`individual_amounts.${idx}.amount`, { valueAsNumber: true })}
                    disabled={isPending}
                    className="flex-1"
                  />
                  {/* hidden: eventMemberId */}
                  <input
                    type="hidden"
                    {...register(`individual_amounts.${idx}.eventMemberId`)}
                    value={member.id}
                  />
                  <span className="shrink-0 text-sm text-muted-foreground">원</span>
                </div>
              ))}
              {errors.individual_amounts && (
                <p className="text-xs text-destructive">
                  {typeof errors.individual_amounts.message === "string"
                    ? errors.individual_amounts.message
                    : "금액을 입력해주세요"}
                </p>
              )}
            </div>
          )}

          {/* 비율 분담: 멤버별 비율 입력 + 실시간 합산 */}
          {splitType === "ratio" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>멤버별 비율 (%)</Label>
                {/* 실시간 합산 표시 */}
                <span
                  className={`text-sm font-medium ${
                    Math.abs(computedRatioTotal - 100) < 0.01
                      ? "text-green-600 dark:text-green-400"
                      : "text-destructive"
                  }`}
                >
                  합계: {computedRatioTotal.toFixed(1)}%
                </span>
              </div>
              {confirmedMembers.map((member, idx) => (
                <div key={member.id} className="flex items-center gap-3">
                  {/* 멤버 이름 */}
                  <span className="w-24 shrink-0 truncate text-sm">{getMemberName(member)}</span>
                  {/* 비율 입력 */}
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    placeholder="0"
                    {...register(`ratios.${idx}.ratio`, { valueAsNumber: true })}
                    disabled={isPending}
                    className="flex-1"
                  />
                  {/* hidden: eventMemberId */}
                  <input
                    type="hidden"
                    {...register(`ratios.${idx}.eventMemberId`)}
                    value={member.id}
                  />
                  <span className="shrink-0 text-sm text-muted-foreground">%</span>
                </div>
              ))}
              {errors.ratios && (
                <p className="text-xs text-destructive">
                  {typeof errors.ratios.message === "string"
                    ? errors.ratios.message
                    : "비율을 입력해주세요"}
                </p>
              )}
              {/* 합산이 100이 아닌 경우 경고 */}
              {Math.abs(computedRatioTotal - 100) >= 0.01 && computedRatioTotal > 0 && (
                <p className="text-xs text-destructive">
                  비율의 합이 100%여야 합니다 (현재: {computedRatioTotal.toFixed(1)}%)
                </p>
              )}
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              추가
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
