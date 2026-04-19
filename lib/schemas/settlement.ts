import { z } from "zod";

// 분담 유형 enum
const splitTypeEnum = z.enum(["equal", "individual", "ratio"]);

// 금액 필드 공통 정의
const amountField = z.number().int("금액은 정수여야 합니다").positive("금액은 0보다 커야 합니다");

const nonNegativeAmountField = z
  .number()
  .int("금액은 정수여야 합니다")
  .min(0, "금액은 0 이상이어야 합니다");

const ratioField = z
  .number()
  .min(0, "비율은 0 이상이어야 합니다")
  .max(100, "비율은 100 이하여야 합니다");

/**
 * 정산 항목 공용 기반 스키마 (UI 상태 관리 및 Server Action 입력용)
 * - split_type에 따라 individual_amounts / ratios 필드가 선택적으로 필요
 * - 비율 분담의 경우 ratios 합산 100% 검증은 Server Action에서 처리
 */
export const settlementItemBaseSchema = z.object({
  eventId: z.string().uuid("유효하지 않은 이벤트 ID입니다"),
  name: z.string().min(1, "항목명을 입력해주세요").max(100, "100자 이내로 입력해주세요"),
  total_amount: amountField,
  split_type: splitTypeEnum,
  // 개별 지정 시 멤버별 금액 배열
  individual_amounts: z
    .array(
      z.object({
        eventMemberId: z.string().uuid("유효하지 않은 멤버 ID입니다"),
        amount: nonNegativeAmountField,
      }),
    )
    .optional(),
  // 비율 분담 시 멤버별 비율 배열 (합산 100 검증 포함)
  ratios: z
    .array(
      z.object({
        eventMemberId: z.string().uuid("유효하지 않은 멤버 ID입니다"),
        ratio: ratioField,
      }),
    )
    .optional()
    .refine(
      (items) => {
        if (!items) return true; // optional이므로 undefined는 통과
        const total = items.reduce((sum, item) => sum + item.ratio, 0);
        // 부동소수점 오차를 고려하여 0.01 허용 범위
        return Math.abs(total - 100) < 0.01;
      },
      { message: "비율의 합이 100%여야 합니다" },
    ),
});

/**
 * 정산 항목 수정 스키마 — 기반 스키마에 id 추가
 */
export const settlementItemUpdateSchema = settlementItemBaseSchema.extend({
  id: z.string().uuid("유효하지 않은 항목 ID입니다"),
});

export type SplitTypeEnum = z.infer<typeof splitTypeEnum>;
export type SettlementItemCreateInput = z.infer<typeof settlementItemBaseSchema>;
export type SettlementItemUpdateInput = z.infer<typeof settlementItemUpdateSchema>;

/**
 * 입금 계좌 등록/수정 스키마
 */
export const bankAccountSchema = z.object({
  bank_name: z.string().min(1, "은행명을 입력해주세요"),
  account_number: z.string().min(1, "계좌번호를 입력해주세요"),
  account_holder: z.string().min(1, "예금주를 입력해주세요"),
});

export type BankAccountInput = z.infer<typeof bankAccountSchema>;
