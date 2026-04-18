# UX 리뷰 및 개선 포인트 문서

> **작성일**: 2026-04-18
> **작성 목적**: Phase 2 Task 012 — 사용자 플로우 전체 리뷰, View 모델과 PRD 불일치 해소, Phase 3 스키마 설계 인풋 정리

---

## 1. 주최자 플로우 리뷰

### 1-1. 플로우 전체 흐름

```
온보딩(회원가입/로그인)
  → 대시보드(내 이벤트 목록)
  → 이벤트 생성(기본 정보 + 승인 방식 선택)
  → 이벤트 관리 허브(링크 공유 + 탭 내비게이션)
    ├─ 참여자 관리 탭(확정/대기/거절 상태 처리)
    ├─ 공지 관리 탭(작성 + 고정 + 리마인더 확인)
    └─ 정산 관리 탭(항목 등록 + 분담 계산 + 납부 확인)
```

### 1-2. 각 단계별 리뷰

#### 온보딩

- **현황**: 이메일/비밀번호 + Google OAuth 지원, 이메일 OTP 인증 플로우 구현됨
- **개선 포인트**:
  - 회원가입 완료 후 이메일 인증 대기 화면에 "이메일이 안 왔어요" 재발송 버튼 필요
  - 로그인 후 원래 접근하려던 페이지로 리디렉션하는 `redirectTo` 파라미터 활용 필요

#### 이벤트 생성

- **현황**: 이벤트 생성 폼 UI 구현됨 (`/(protected)/events/new`)
- **개선 포인트**:
  - 승인 방식(auto/manual) 선택 UI에 툴팁이나 도움말 텍스트 추가 필요 — "자동 승인"과 "수동 승인"의 차이를 신규 주최자가 직관적으로 이해하기 어려움
  - 이벤트 저장 직후 공유 링크가 바로 복사 가능하도록 성공 모달/토스트에 링크 복사 버튼 포함 권장
  - 마감일을 설정하지 않을 경우 기본값 처리 방식 UX 명확화 필요 (무기한인지, 이벤트 당일인지)

#### 공유 링크

- **현황**: `shareToken` 기반 공개 URL (`/events/[token]`) 구조 설계됨
- **개선 포인트**:
  - 링크 복사 버튼 클릭 시 "복사됨" 피드백이 2초 후 원상 복구되는 토글 패턴 일관성 확인 필요
  - SNS 공유(카카오톡, 인스타그램 등)를 위한 Open Graph 메타태그 설정 필요 (이미지, 설명 포함)

#### 참여자 관리

- **현황**: 확정/대기/거절 탭 필터 UI 구현됨
- **개선 포인트**:
  - 수동 승인 이벤트에서 대기 인원이 많을 때 주최자가 한 번에 일괄 승인할 수 있는 "전체 승인" 버튼 고려
  - 거절 처리 시 사유 입력(선택사항) 모달 추가하면 참여자 경험 개선 가능
  - 거절 시점(`rejectedAt`) 데이터 확보 → 거절 후 재신청 방지 기간 정책 적용 가능

#### 공지 작성

- **현황**: 제목+본문 공지 UI 및 고정 토글 구현됨
- **개선 포인트**:
  - 공지 작성 폼에 미리보기 모드 추가 권장 (마크다운 혹은 줄바꿈 렌더링)
  - 공지 목록에서 고정된 공지가 시각적으로 충분히 강조되는지 확인 필요 (배경색, 아이콘 등)
  - D-1·D-3 리마인더 발송 예약 현황이 공지 관리 탭에서 바로 보이도록 배치

#### 정산 관리

- **현황**: 균등/개별/비율 분담 3종, 납부 상태 체크 UI 구현됨
- **개선 포인트**:
  - 분담 방식이 3가지이므로 선택 즉시 입력 UI가 동적으로 변경되어야 함 — 현재 UX 흐름 점검 필요
  - 주최자가 계좌번호를 등록하지 않은 상태에서 참여자가 정산 현황 페이지에 접근 시 적절한 안내 메시지 필요
  - 총액과 1인당 금액 계산 프리뷰를 입력 중에도 실시간으로 보여주면 오류 방지에 효과적

---

## 2. 참여자 플로우 리뷰

### 2-1. 플로우 전체 흐름

```
공유 링크 접속(비로그인 허용)
  → 이벤트 상세 페이지(공개 정보 확인)
  → 참여 신청 버튼 클릭
    ├─ 로그인 상태: 바로 참여 신청 페이지로 이동
    └─ 비로그인: 로그인 페이지 → 참여 신청 페이지 (redirectTo 처리 필요)
  → 참여 신청 완료(자동 승인: 즉시 확정 / 수동 승인: 대기 상태)
  → 확정 후 접근 가능
    ├─ 공지 목록(고정 공지 + 최신순)
    └─ 정산 현황(본인 분담 금액 + 계좌 확인)
```

### 2-2. 각 단계별 리뷰

#### 공유 링크 접속 및 이벤트 상세

- **현황**: `/events/[token]` 공개 라우트, `shareToken` 기반 조회 구조 설계됨
- **개선 포인트**:
  - 이벤트 정원이 모두 찼을 경우 "대기자로 신청하기" CTA로 즉시 전환되어야 함 — 버튼 문구와 안내 텍스트 변경 필요
  - 마감일이 지난 이벤트는 신청 버튼을 비활성화하고 "신청이 마감되었습니다" 메시지 노출
  - 이벤트 날짜까지 D-Day 카운트다운 표시가 동기적 서버 렌더링으로 처리될 경우 하이드레이션 불일치(hydration mismatch) 주의

#### 참여 신청

- **현황**: 신청 완료 후 이벤트 상세 페이지로 복귀하는 플로우 설계됨
- **개선 포인트**:
  - 자동 승인 이벤트에서 신청 즉시 "확정되었습니다" 메시지를 명확하게 노출 — 수동 승인 이벤트의 "대기 중" 상태와 혼동되지 않도록 구분
  - 이미 신청한 참여자가 다시 공개 페이지를 방문할 경우 신청 상태(확정/대기/거절)를 이벤트 상세 페이지에서 직접 확인 가능해야 함
  - 거절된 참여자가 재신청을 시도할 경우 처리 정책 결정 필요 (재신청 허용 여부)

#### 공지 확인

- **현황**: 확정 참여자 전용 공지 목록 페이지 UI 구현됨
- **개선 포인트**:
  - 공지가 없을 경우 빈 상태(Empty State) 메시지가 명확한지 확인
  - 리마인더 이메일의 링크를 클릭하면 해당 공지 또는 이벤트 페이지로 딥링크되어야 함

#### 정산 현황 확인

- **현황**: 본인 분담 금액 및 납부 상태 조회 UI 구현됨
- **개선 포인트**:
  - 납부 완료 처리는 주최자만 가능하므로, 참여자 화면에는 납부 완료 체크박스 대신 "납부 완료됨" 배지만 표시해야 함 (혼동 방지)
  - 계좌번호 복사 버튼 클릭 후 "복사됨" 피드백 2초 토글 필요

---

## 3. View 모델 vs PRD 불일치 해소 내역

### Before/After 비교표

| 항목             | PRD 컬럼명                   | Before (View 모델)        | After (View 모델)                        | 결정 근거                                                                                                                                                                                                          |
| ---------------- | ---------------------------- | ------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 공개 공유 슬러그 | `public_slug`                | `shareToken: string`      | `shareToken: string` (유지)              | View 모델 전체에서 `shareToken`으로 일관 사용 중. Phase 3 DB 컬럼명을 `public_slug`로, 앱 내 필드명을 `shareToken`으로 매핑 처리                                                                                   |
| 승인 방식        | `approval_type`              | 없음                      | `approvalType: ApprovalType` 추가        | PRD F003 "주최자 수동 확정" 기능 지원. `ApprovalType = "auto" \| "manual"` export 타입 추가                                                                                                                        |
| 참여 신청 마감일 | `registration_deadline`      | 없음                      | `registrationDeadline?: string` 추가     | PRD 이벤트 생성 페이지에 "참여 신청 마감일 설정" 명시됨. 선택 필드                                                                                                                                                 |
| 거절 처리 일시   | (미정)                       | 없음                      | `rejectedAt?: string` 추가 (EventMember) | 거절 시점 추적으로 재신청 방지 정책 및 감사 로그 지원                                                                                                                                                              |
| 주최자 계좌 소속 | `host_bank_accounts.host_id` | `HostBankAccount.eventId` | `HostBankAccount.eventId` (유지)         | PRD는 사용자(호스트) 단위로 계좌 관리하나, View 모델의 이벤트별 계좌 구조가 더 유연함. 주최자가 이벤트마다 다른 계좌를 사용하는 시나리오 지원. Phase 3 스키마 설계 시 `event_id` + `host_id` 복합 구조로 확장 검토 |

---

## 4. Phase 3 스키마 설계 인풋

### 4-1. 확정된 Enum 목록

아래 enum은 `lib/types/index.ts`의 View 모델에서 확정된 값들이며, Phase 3 DB 스키마에 PostgreSQL `ENUM` 타입으로 그대로 반영한다.

| Enum 타입       | 값 목록                                | DB 컬럼                             | 대응 테이블           |
| --------------- | -------------------------------------- | ----------------------------------- | --------------------- |
| `EventStatus`   | `draft`, `open`, `closed`, `cancelled` | `status`                            | `events`              |
| `EventType`     | `one_time`, `recurring`                | `event_type`                        | `events`              |
| `ApprovalType`  | `auto`, `manual`                       | `approval_type`                     | `events`              |
| `MemberStatus`  | `confirmed`, `waiting`, `rejected`     | `status`                            | `event_members`       |
| `SplitType`     | `equal`, `individual`, `ratio`         | `split_type`                        | `settlement_items`    |
| `PaymentStatus` | `pending`, `paid`                      | `is_paid` (boolean으로 단순화 가능) | `settlement_payments` |

> `PaymentStatus` 비고: PRD는 `is_paid: boolean`으로 설계했으나, View 모델은 `"pending" | "paid"` enum으로 표현. DB에서는 boolean으로 처리하고 앱 레이어에서 변환하거나, 향후 "환불" 등 상태 확장을 위해 enum 컬럼으로 변경 가능. Phase 3에서 결정 필요.

### 4-2. View 모델 필드 → DB 컬럼 매핑

#### `events` 테이블

| View 모델 필드         | DB 컬럼                 | 타입                                  | 비고                     |
| ---------------------- | ----------------------- | ------------------------------------- | ------------------------ |
| `id`                   | `id`                    | `uuid DEFAULT gen_random_uuid()`      | PK                       |
| `host.id`              | `host_id`               | `uuid REFERENCES auth.users`          | FK                       |
| `title`                | `title`                 | `text NOT NULL`                       |                          |
| `description`          | `description`           | `text`                                |                          |
| `type`                 | `event_type`            | `event_type_enum`                     |                          |
| `status`               | `status`                | `event_status_enum` DEFAULT `open`    |                          |
| `approvalType`         | `approval_type`         | `approval_type_enum` DEFAULT `manual` |                          |
| `maxCapacity`          | `max_participants`      | `integer`                             |                          |
| `startDate`            | `starts_at`             | `timestamptz NOT NULL`                |                          |
| `endDate`              | `ends_at`               | `timestamptz`                         | nullable                 |
| `location`             | `location`              | `text`                                |                          |
| `registrationDeadline` | `registration_deadline` | `timestamptz`                         | nullable                 |
| `shareToken`           | `public_slug`           | `text UNIQUE NOT NULL`                | 공개 링크 슬러그         |
| `createdAt`            | `created_at`            | `timestamptz DEFAULT now()`           |                          |
| `updatedAt`            | `updated_at`            | `timestamptz DEFAULT now()`           | trigger로 자동 갱신 권장 |

> `confirmedCount`, `waitingCount`는 파생 집계값이므로 DB 컬럼이 아님. 조회 시 `event_members` 집계 쿼리로 계산.

#### `event_members` 테이블

| View 모델 필드 | DB 컬럼        | 타입                             | 비고     |
| -------------- | -------------- | -------------------------------- | -------- |
| `id`           | `id`           | `uuid DEFAULT gen_random_uuid()` | PK       |
| `eventId`      | `event_id`     | `uuid REFERENCES events`         | FK       |
| `user.id`      | `user_id`      | `uuid REFERENCES auth.users`     | FK       |
| `status`       | `status`       | `member_status_enum`             |          |
| `note`         | `note`         | `text`                           | nullable |
| `appliedAt`    | `applied_at`   | `timestamptz DEFAULT now()`      |          |
| `confirmedAt`  | `confirmed_at` | `timestamptz`                    | nullable |
| `rejectedAt`   | `rejected_at`  | `timestamptz`                    | nullable |

#### `host_bank_accounts` 테이블

PRD(사용자 단위)와 View 모델(이벤트 단위)의 구조 불일치 해소 방향:

- **Phase 3 권장 구조**: `event_id` + `host_id` 복합 구성. `event_id`를 추가하여 이벤트별 계좌 분리 지원하되, `host_id`도 유지하여 RLS 정책 적용 기준으로 사용
- **컬럼**: `id`, `host_id` (FK → `auth.users`), `event_id` (FK → `events`, nullable), `bank_name`, `account_number`, `account_holder`

### 4-3. 인덱스 권장 목록

| 테이블                | 인덱스 컬럼             | 이유                                   |
| --------------------- | ----------------------- | -------------------------------------- |
| `events`              | `public_slug`           | 공개 링크 조회 시 사용 (UNIQUE 인덱스) |
| `events`              | `host_id`               | 주최자 대시보드 이벤트 목록 조회       |
| `event_members`       | `(event_id, user_id)`   | 중복 신청 방지 UNIQUE 제약 + 조회 성능 |
| `event_members`       | `(event_id, status)`    | 상태별 필터링 조회 성능                |
| `announcements`       | `(event_id, is_pinned)` | 고정 공지 우선 정렬                    |
| `settlement_payments` | `(event_id, user_id)`   | 참여자별 납부 현황 조회                |

### 4-4. RLS 정책 설계 방향

| 테이블                | 접근 주체   | 허용 작업                | 정책 조건                                                                                                                        |
| --------------------- | ----------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `events`              | 누구나      | SELECT                   | `status != 'draft'`                                                                                                              |
| `events`              | 주최자      | INSERT / UPDATE / DELETE | `auth.uid() = host_id`                                                                                                           |
| `event_members`       | 주최자      | SELECT / UPDATE          | `auth.uid() = (SELECT host_id FROM events WHERE id = event_id)`                                                                  |
| `event_members`       | 본인        | SELECT / INSERT          | `auth.uid() = user_id`                                                                                                           |
| `announcements`       | 확정 참여자 | SELECT                   | `EXISTS (SELECT 1 FROM event_members WHERE event_id = announcements.event_id AND user_id = auth.uid() AND status = 'confirmed')` |
| `announcements`       | 주최자      | ALL                      | `auth.uid() = author_id`                                                                                                         |
| `settlement_payments` | 본인 참여자 | SELECT                   | `auth.uid() = user_id`                                                                                                           |
| `settlement_payments` | 주최자      | UPDATE                   | `auth.uid() = (SELECT host_id FROM events WHERE id = event_id)`                                                                  |
| `host_bank_accounts`  | 확정 참여자 | SELECT                   | 이벤트 확정 참여자 조건 (위와 동일)                                                                                              |
| `host_bank_accounts`  | 주최자      | ALL                      | `auth.uid() = host_id`                                                                                                           |

---

## 5. 종합 개선 우선순위

| 순위 | 개선 항목                                     | 영향                  | 구현 시점            |
| ---- | --------------------------------------------- | --------------------- | -------------------- |
| 1    | 이벤트 생성 후 공유 링크 즉시 복사 CTA        | 주최자 온보딩 핵심    | Phase 2 (Task 014)   |
| 2    | 승인 방식 선택 UI 툴팁/도움말                 | 신규 주최자 혼란 방지 | Phase 2 (Task 014)   |
| 3    | 비로그인 → 로그인 → 참여 신청 redirectTo 처리 | 참여자 이탈 방지      | Phase 3 (Task 023)   |
| 4    | 이미 신청한 참여자의 상태 노출                | 중복 신청 혼란 방지   | Phase 3 (Task 022)   |
| 5    | 거절된 참여자 재신청 정책 결정                | 데이터 정합성         | Phase 3 (Task 023)   |
| 6    | 공지 미리보기 모드                            | 주최자 편의           | Phase 2 또는 Phase 3 |
| 7    | OG 메타태그 (링크 공유 미리보기)              | 참여자 유입           | Phase 3 (Task 022)   |
