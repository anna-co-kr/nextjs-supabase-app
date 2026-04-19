import type { SplitTypeEnum } from "@/lib/schemas/settlement";

/**
 * 개별 지정 옵션
 */
interface IndividualOpts {
  splitType: "individual";
  amounts: number[]; // memberIds와 동일 순서로 매핑
}

/**
 * 비율 분담 옵션
 */
interface RatioOpts {
  splitType: "ratio";
  ratios: number[]; // memberIds와 동일 순서로 매핑 (합산 100)
}

/**
 * 균등 분할 옵션
 */
interface EqualOpts {
  splitType: "equal";
}

type CalculateOpts = EqualOpts | IndividualOpts | RatioOpts;

/**
 * 계산된 결제 정보
 */
export interface CalculatedPayment {
  eventMemberId: string;
  amount: number;
  ratio?: number; // ratio 타입인 경우에만 포함
}

/**
 * 분담 금액 계산 순수 함수
 *
 * @param totalAmount - 총 금액 (정수, 원 단위)
 * @param memberIds - 참여 멤버 ID 배열
 * @param opts - 분담 방식 및 추가 옵션
 * @returns 멤버별 결제 정보 배열
 *
 * 반올림 처리:
 * - equal: Math.round로 각 멤버 금액 계산, 첫 번째 멤버에게 나머지 보정
 * - individual: opts.amounts 그대로 사용
 * - ratio: Math.round(totalAmount * ratio / 100), 첫 번째 멤버에게 나머지 보정
 */
export function calculatePayments(
  totalAmount: number,
  memberIds: string[],
  opts: CalculateOpts,
): CalculatedPayment[] {
  if (memberIds.length === 0) return [];

  switch (opts.splitType) {
    case "equal": {
      // 균등 분할: 반올림 후 총액 불일치를 첫 번째 멤버에게 보정
      const base = Math.round(totalAmount / memberIds.length);
      const payments = memberIds.map((id, idx) => ({
        eventMemberId: id,
        amount: idx === 0 ? 0 : base, // 첫 번째는 나중에 계산
      }));

      // 나머지 멤버 합산
      const othersTotal = payments.slice(1).reduce((sum, p) => sum + p.amount, 0);
      // 첫 번째 멤버에게 총액에서 나머지를 뺀 금액 배정 (반올림 오차 흡수)
      payments[0] = { eventMemberId: memberIds[0], amount: totalAmount - othersTotal };

      return payments;
    }

    case "individual": {
      // 개별 지정: 전달된 amounts 그대로 사용
      return memberIds.map((id, idx) => ({
        eventMemberId: id,
        amount: opts.amounts[idx] ?? 0,
      }));
    }

    case "ratio": {
      // 비율 분담: 반올림 후 총액 불일치를 첫 번째 멤버에게 보정
      const payments = memberIds.map((id, idx) => ({
        eventMemberId: id,
        amount: idx === 0 ? 0 : Math.round((totalAmount * (opts.ratios[idx] ?? 0)) / 100),
        ratio: opts.ratios[idx] ?? 0,
      }));

      // 나머지 멤버 합산
      const othersTotal = payments.slice(1).reduce((sum, p) => sum + p.amount, 0);
      // 첫 번째 멤버에게 보정 금액 배정
      payments[0] = {
        eventMemberId: memberIds[0],
        amount: totalAmount - othersTotal,
        ratio: opts.ratios[0] ?? 0,
      };

      return payments;
    }
  }
}

/**
 * split_type 한국어 레이블 매핑
 */
export const SPLIT_TYPE_LABEL: Record<SplitTypeEnum, string> = {
  equal: "균등 분할",
  individual: "개별 지정",
  ratio: "비율 분담",
};
