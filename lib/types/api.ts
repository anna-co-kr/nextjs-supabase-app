// Phase 3 공통 Server Action 응답 타입

/**
 * 표준화된 에러 코드
 * 클라이언트에서 에러 유형별 UI 처리에 활용
 */
export type ActionErrorCode =
  | "UNAUTHORIZED" // 미인증 사용자 접근
  | "FORBIDDEN" // 권한 없음 (다른 사용자 리소스 접근)
  | "NOT_FOUND" // 리소스 없음
  | "VALIDATION" // Zod 등 입력값 검증 실패
  | "CAPACITY_FULL" // 이벤트 정원 초과 (대기자 처리 분기)
  | "DUPLICATE" // 중복 신청 등 유니크 제약 위반
  | "INTERNAL"; // 예기치 않은 서버 에러

/**
 * Server Action 및 Route Handler 공통 응답 타입
 * 성공 시 data 필드, 실패 시 error + code 필드를 반환
 */
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: ActionErrorCode };
