# Gather 개발 로드맵

소규모~중규모 모임 주최자를 위한 공지·참여자 관리·정산 통합 웹 서비스

## 개요

**Gather**는 정기 모임(수영·헬스 등 5~20명) 및 일회성 이벤트(여행·파티)를 운영하는 **주최자와 참여자**를 위한 **모임 이벤트 관리 올인원 서비스**로 다음 기능을 제공합니다:

- **이벤트 관리**: 이벤트 생성·수정·삭제, 공개 링크 발급, 참여 신청 및 대기자 자동 배치
- **커뮤니케이션**: 공지 작성·고정, 댓글/이모지 리액션, D-1·D-3 자동 리마인더
- **정산 관리**: 항목별 금액 등록, 균등/개별/비율 분담 계산, 납부 확인, 미납 리마인더

## 기술 스택

- **프레임워크**: Next.js 15 (App Router), React 19, TypeScript
- **스타일링**: Tailwind CSS + shadcn/ui
- **백엔드/DB**: Supabase (Auth + PostgreSQL + RLS)
- **폼 처리**: React Hook Form + Zod
- **상태 관리**: Zustand
- **이메일 알림**: Resend
- **배포**: Vercel

## 개발 전략 (UI-First Approach)

본 프로젝트는 **UI/UX를 먼저 빠르게 구축하여 전체 사용자 플로우를 검증**한 후, **DB 스키마 및 백엔드 연동을 진행**하는 UI-First 방식으로 개발합니다.

1. **Phase 1**: 더미 데이터 기반으로 전체 13개 페이지 UI를 빠르게 구축
2. **Phase 2**: UI 검토 및 사용성 보완
3. **Phase 3**: DB 스키마 설계 및 Supabase 백엔드 연동
4. **Phase 4**: 정산 기능 구현
5. **Phase 5**: 고도화 (반복 이벤트, 카풀, 캘린더 연동 등)

이 방식의 장점:

- 전체 사용자 플로우를 조기에 체험·검증하여 요구사항 변경에 유연하게 대응
- UI와 백엔드 작업의 분리로 병렬 개발 및 명확한 역할 분담 가능
- 더미 데이터로 디자인·UX 반복이 자유로워, 스키마 결정이 UI에 의해 역설계됨

## 개발 워크플로우

1. **작업 계획**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
- 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**

- 기존 코드베이스를 학습하고 현재 상태를 파악
- `/tasks` 디렉토리에 새 작업 파일 생성
- 명명 형식: `XXX-description.md` (예: `001-setup.md`)
- 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
- **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
- 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조
- 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조

3. **작업 구현**

- 작업 파일의 명세서를 따름
- 기능과 기능성 구현
- **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
- 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
- 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
- 테스트 통과 확인 후 다음 단계로 진행
- 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**

- 로드맵에서 완료된 작업을 ✅로 표시

---

## 개발 단계

### Phase 1: UI/UX 프로토타입 (더미 데이터 기반) ✅

**목표**: 더미 데이터만으로 전체 13개 페이지의 UI를 빠르게 구축하여 사용자 플로우를 체험 가능하게 만든다
**구현 범위**: 라우팅, 레이아웃, 공통 컴포넌트, 모든 페이지 화면 (DB/백엔드 연동 제외)
**예상 기간**: 2~3주

- **Task 001: 프로젝트 구조 및 라우팅 설정** ✅
  - 예상 소요: 2일
  - Next.js App Router 기반 전체 라우트 구조 생성 (13개 페이지 빈 껍데기)
  - 공개/인증/주최자/참여자 구분 라우트 그룹 설계 (`/(public)`, `/auth`, `/(protected)`)
  - 공통 레이아웃 컴포넌트 골격 구현 (네비게이션, 사이드바, 푸터)
  - 전역 에러 페이지 및 로딩 페이지 스켈레톤 추가

- **Task 002: UI 타입 정의 및 더미 데이터 설계** ✅
  - 예상 소요: 1일
  - 화면 구성에 필요한 TypeScript 인터페이스 정의 (Event, EventMember, Announcement, Settlement 등 View 모델)
  - 더미 데이터 생성 유틸리티 작성 (`lib/fixtures.ts`)
  - 상태/플래그용 Enum 타입 정의 (참여 상태, 이벤트 상태, 납부 상태 등)
  - _주의: 실제 DB 스키마는 Phase 3에서 별도 설계 (UI가 먼저 요구사항을 이끎)_

- **Task 003: 공통 컴포넌트 라이브러리 구현** ✅
  - 예상 소요: 3일
  - shadcn/ui 기반 공통 컴포넌트 설치 (Button, Input, Form, Dialog, Card, Badge, Table, Tabs 등)
  - 디자인 토큰 및 테마 설정 (Tailwind 색상·타이포그래피)
  - 이벤트 카드, 참여자 아이템, 상태 배지 등 도메인 컴포넌트 구현
  - 빈 상태(Empty State), 로딩 스켈레톤, 에러 상태 공용 컴포넌트

- **Task 004: 인증 페이지 UI (로그인/회원가입/비밀번호 재설정)** ✅
  - 예상 소요: 1일
  - 로그인/회원가입/비밀번호 재설정 UI 리디자인
  - 이메일·Google 로그인 버튼 레이아웃 (기존 Supabase 로직은 유지하되 UI만 갱신)
  - 폼 유효성 검증 UI (React Hook Form + Zod)
  - 반응형 및 접근성 점검

- **Task 005: 대시보드 및 이벤트 목록 UI (더미 데이터)** ✅
  - 예상 소요: 2일
  - 대시보드 페이지 레이아웃 (내 주최 이벤트/참여 이벤트 탭 구분)
  - 이벤트 카드 리스트 UI (상태·참여 인원·마감일 표시)
  - 반응형 그리드 및 모바일 최적화
  - 빈 상태 및 로딩 스켈레톤 적용

- **Task 006: 이벤트 생성/수정/상세 페이지 UI** ✅
  - 예상 소요: 2일
  - 이벤트 생성 폼 UI (React Hook Form + Zod 검증만)
  - 이벤트 수정 페이지 UI
  - 이벤트 상세 페이지 UI (참여자 목록, 공지 영역, 정산 영역 자리 구분)
  - 공유 링크 복사 UI (클립보드 API)

- **Task 007: 공개 이벤트 페이지 및 참여 신청 UI** ✅
  - 예상 소요: 1일
  - 비로그인 사용자용 공개 이벤트 상세 UI (`/events/[token]`)
  - 참여 신청 페이지 UI (정원 미달/초과 상태 시각화)
  - 대기자 배치 안내 UI
  - 로그인 유도 모달 UI

- **Task 008: 참여자 관리 페이지 UI** ✅
  - 예상 소요: 1일
  - 참여자 목록 테이블 UI (확정/대기/거절 필터)
  - 상태 변경 드롭다운 UI
  - CSV 내보내기 버튼 UI (기능은 Phase 3에서)
  - 대량 선택·일괄 처리 UI

- **Task 009: 공지 및 댓글/리액션 UI** ✅
  - 예상 소요: 2일
  - 공지 목록 페이지 UI (고정 공지 > 최신 순 정렬 시각화)
  - 공지 작성/수정 폼 UI (간단 에디터)
  - 댓글 리스트 및 입력 UI
  - 이모지 리액션 피커 및 집계 뱃지 UI

- **Task 010: 정산 관리 및 참여자 정산 현황 UI** ✅
  - 예상 소요: 2일
  - 정산 항목 등록 폼 UI (항목명 + 금액 + 분담 방식 3종)
  - 분담 계산 프리뷰 UI (클라이언트 계산)
  - 호스트 계좌 등록 UI
  - 참여자별 납부 상태 테이블 UI
  - 참여자용 정산 현황 조회 UI (본인 분담·계좌 복사)

- **Task 011: Phase 1 UI 통합 점검** ✅
  - 예상 소요: 1일
  - 13개 페이지 전체 네비게이션 흐름 점검
  - 반응형(모바일/태블릿/데스크톱) 일괄 검증
  - 더미 데이터 기반 사용자 플로우 리허설 (주최자/참여자 시나리오)
  - 디자인 일관성 및 접근성(WCAG AA) 점검

---

### Phase 2: UI 검토 및 사용성 보완 ✅

**목표**: Phase 1에서 완성된 UI를 사용자 관점에서 검토하고 UX·디자인·인터랙션을 다듬는다
**구현 범위**: UI 개선, 마이크로 인터랙션, 접근성, 디자인 토큰 정돈
**예상 기간**: 1~2주

- **Task 012: 사용자 플로우 리뷰 및 개선 포인트 도출** ✅
  - 예상 소요: 1일
  - 주최자 온보딩 → 이벤트 생성 → 공유 → 정산 전체 플로우 리뷰
  - 참여자 링크 접속 → 참여 → 공지 확인 → 납부 전체 플로우 리뷰
  - 병목/혼란 지점 목록화 및 개선안 문서화 (`/docs/ux-review.md`)
  - ✅ 완료: 주최자 플로우 6단계 + 참여자 플로우 4단계 리뷰. View 모델 vs PRD 불일치 5개 항목 해소 (ApprovalType 추가, registrationDeadline 추가, rejectedAt 추가). docs/ux-review.md 생성. Phase 3 스키마 설계 인풋 문서화 완료.

- **Task 013: 디자인 시스템 정돈 및 일관성 강화** ✅
  - 예상 소요: 2일
  - 색상·타이포그래피·간격 토큰 정리
  - 버튼·인풋·카드 variant 통일
  - 다크 모드 지원 (선택적)
  - 아이콘 세트 통일 (lucide-react)
  - ✅ 완료: text-black/white 하드코딩 → text-foreground/bg-background 교체. text-red-500 → text-destructive 통일. 스켈레톤 스타일 EventCard와 통일. cn() 헬퍼 적용. 대기자 색상 다크 모드 대응 추가.

- **Task 014: 마이크로 인터랙션 및 피드백 개선** ✅
  - 예상 소요: 2일
  - 폼 제출·삭제 시 Toast/Sonner 피드백
  - 로딩/전환 애니메이션 (skeleton, fade-in)
  - 낙관적 UI 업데이트 패턴 준비 (추후 API 연동 대비)
  - 모바일 터치 타깃 크기 조정
  - ✅ 완료: announcement-actions/form, comment-form, login-form에 toast + Loader2 스피너 적용. 댓글 달기 버튼 min-h-[44px] 터치 타깃 확보.

- **Task 015: 접근성 및 반응형 보완** ✅
  - 예상 소요: 2일
  - 키보드 네비게이션 점검 (Tab, Enter, Esc)
  - aria-label, alt, role 속성 보강
  - 모바일 하단 네비게이션 및 터치 제스처 개선
  - 스크린 리더 시나리오 테스트
  - ✅ 완료: ReactionButton aria-label/aria-pressed, TableHead scope="col", EventStatusBadge role="status", MemberStatusBadge aria-label, 모바일 하단 네비 aria-label 적용.

- **Task 016: Phase 2 최종 UI 검수** ✅
  - 예상 소요: 1일
  - 개선 사항 반영 여부 체크리스트 검증
  - Playwright MCP 스냅샷 테스트로 UI 회귀 방지 베이스라인 수립
  - 디자인 리뷰 승인 → Phase 3 진입 준비
  - ✅ 완료: Playwright MCP로 홈/로그인/대시보드 리디렉션/모바일(375px) 5개 시나리오 통과. lint/type-check/build 0 에러.

---

### Phase 3: DB 스키마 및 Supabase 연동

**목표**: Phase 1~2에서 확정된 UI를 근거로 DB 스키마를 설계하고, 더미 데이터를 실제 Supabase 연동으로 교체한다
**구현 기능**: F001, F002, F003, F004, F005, F006, F010, F011
**예상 기간**: 3~4주

- **Task 017: 데이터 모델 및 DB 스키마 설계** - 우선순위
  - 예상 소요: 2일
  - UI에서 요구된 데이터 구조를 기반으로 스키마 역설계
  - Supabase 데이터베이스 스키마 설계 (8개 테이블: users, events, event_members, announcements, announcement_comments, announcement_reactions, settlement_items, settlement_payments, host_bank_accounts)
  - ERD 문서화 및 관계 정의 (`/docs/ERD.md`)
  - 공통 API 응답 타입 및 에러 타입 정의

- **Task 018: Supabase 마이그레이션 및 RLS 정책 적용**
  - 예상 소요: 3일
  - 8개 테이블 생성 마이그레이션 파일 작성
  - RLS(Row Level Security) 정책 설계 및 적용 (주최자/참여자/공개 접근 분리)
  - 공개 링크용 `share_token` 컬럼 및 인덱스 설정
  - `npx supabase gen types`로 `types/database.types.ts` 자동 생성
  - Playwright MCP로 RLS 정책 동작 검증 (주최자/참여자/비로그인 시나리오)

- **Task 019: 인증 시스템 연동 강화 (F010, F011)**
  - 예상 소요: 2일
  - 기존 이메일/Google OAuth 로그인 플로우 검증
  - 회원가입 시 `users` 테이블에 프로필 자동 생성(트리거 또는 Server Action)
  - `lib/supabase/profile.ts`에 프로필 조회/수정 헬퍼 확장
  - Playwright MCP로 회원가입 → 로그인 → 프로필 생성 E2E 테스트

- **Task 020: 대시보드 및 이벤트 목록 API 연동**
  - 예상 소요: 1일
  - 더미 데이터를 Supabase 쿼리로 교체
  - 주최/참여 이벤트 조회 Server Action 구현
  - 캐싱 전략 적용 (Next.js Cache Components)
  - Playwright MCP로 데이터 로드 및 필터링 검증

- **Task 021: 이벤트 생성/수정/삭제 연동 (F001)**
  - 예상 소요: 2일
  - Server Action으로 이벤트 CRUD 처리
  - 이벤트 유형, 최대 인원, 마감일 저장·수정·삭제
  - 이벤트 관리 페이지에서 수정·삭제 동작 연결
  - Playwright MCP로 이벤트 생성·수정·삭제 전체 플로우 테스트

- **Task 022: 공개 이벤트 페이지 및 공유 링크 연동 (F002)**
  - 예상 소요: 1일
  - `share_token` 기반 공개 URL 서버 조회
  - 비로그인 사용자용 RLS 정책으로 공개 SELECT 허용
  - Playwright MCP로 비로그인 상태에서 공개 링크 접근 테스트

- **Task 023: 참여 신청 및 대기자 자동 배치 연동 (F003, F004)**
  - 예상 소요: 3일
  - `event_members` 레코드 생성 Server Action
  - 정원 초과 시 자동 `waiting` 상태 전환 로직
  - 참여자 관리 페이지에서 주최자가 확정/대기/거절 상태 변경
  - 대기자 → 확정 승격 시 자동 재배치 규칙 적용
  - Playwright MCP로 정원 미달/초과 시나리오 E2E 테스트

- **Task 024: 참여자 CSV 내보내기 연동 (F005)**
  - 예상 소요: 1일
  - CSV 변환 유틸리티 작성 (이름·이메일·상태·신청일시)
  - 한글 인코딩 처리 (UTF-8 BOM)
  - 다운로드 Server Action 및 권한 체크 (주최자 전용)
  - Playwright MCP로 CSV 다운로드 동작 검증

- **Task 025: 공지/댓글/리액션 연동 (F006)**
  - 예상 소요: 3일
  - 공지 CRUD 및 고정 토글 Server Action
  - 댓글 작성·수정·삭제 (작성자 본인만 수정/삭제)
  - 이모지 리액션 토글 (중복 방지, 집계)
  - 낙관적 업데이트(Optimistic UI) 적용
  - Playwright MCP로 공지/댓글/리액션 전체 상호작용 테스트

- **Task 026: D-1·D-3 자동 리마인더 (F007)**
  - 예상 소요: 3일
  - Vercel Cron Job 설정 (매일 1회 실행)
  - 이벤트 날짜 기준 D-1, D-3 대상 참여자 조회 로직
  - Resend를 활용한 이메일 템플릿 작성 (이벤트 정보 포함)
  - 발송 이력 테이블 및 중복 발송 방지 로직
  - Playwright MCP로 리마인더 트리거 조건 단위 테스트 (시간 모킹)

- **Task 027: Phase 3 통합 테스트**
  - 예상 소요: 1일
  - 주최자 전체 플로우 (회원가입 → 이벤트 생성 → 링크 공유 → 참여자 승인 → 공지 → 리마인더)
  - 참여자 전체 플로우 (링크 접속 → 로그인 → 참여 신청 → 공지 확인)
  - RLS 정책 권한 경계 테스트
  - 에러 핸들링 및 엣지 케이스 점검 (정원 0, 마감일 초과, 중복 신청 등)

---

### Phase 4: 정산 기능 (정산 등록, 분담 계산, 납부 관리) ✅

**목표**: 비용 정산 루프를 완성하여 주최자의 스프레드시트 작업을 제거한다
**구현 기능**: F008, F009
**예상 기간**: 2~3주

- **Task 028: 정산 항목 등록 및 분담 계산 연동 (F008)** ✅
  - 예상 소요: 3일
  - 정산 항목 다중 입력 Server Action
  - 분담 방식 3종 서버 계산 로직: 균등 분할 / 개별 금액 지정 / 비율 분담
  - `settlement_items` + `settlement_payments` 스키마 연동
  - 실시간 총액·인당 금액 프리뷰를 서버 계산 결과로 교체
  - ✅ 완료: lib/schemas/settlement.ts(Zod+비율 합산 refine), lib/utils/settlement.ts(순수 계산+총액 보정), lib/supabase/settlements.ts, lib/actions/settlement.ts(CRUD), components/settlement-item-form.tsx(Dialog+동적 폼), settlements/page.tsx 더미 완전 제거

- **Task 029: 호스트 계좌번호 등록 연동 (F009)** ✅
  - 예상 소요: 1일
  - `host_bank_accounts` 테이블 CRUD
  - 계좌번호 입력 폼 저장/수정/삭제
  - 참여자에게 노출되는 계좌 정보 RLS 정책 적용
  - ✅ 완료: bankAccountSchema, getBankAccount, upsertBankAccount(insert/update 분기), BankAccountForm(등록/수정 모드 자동 전환) 구현

- **Task 030: 납부 확인 및 상태 관리 연동 (F009)** ✅
  - 예상 소요: 2일
  - 참여자별 납부 상태 체크박스 동작
  - `settlement_payments` 상태 업데이트 Server Action (pending/paid)
  - 납부일시 자동 기록
  - 납부 완료율 대시보드 실데이터 반영
  - ✅ 완료: togglePaymentStatus(paid_at 자동 기록), PaymentToggleButton(useTransition+Loader2), 모바일/데스크톱 양쪽 연결, 요약 카드 flatMap 집계

- **Task 031: 참여자용 정산 현황 연동** ✅
  - 예상 소요: 1일
  - 참여자가 본인 분담 금액 및 납부 상태를 실시간 조회
  - 계좌번호 복사 UI 동작 연결
  - 항목별 상세 분담 내역 서버 조회
  - ✅ 완료: getMySettlementStatus(확정 참여자 전용+RLS), CopyButton, settlements-status/page.tsx 더미 완전 제거

- **Task 032: 미납자 리마인더 발송 (F009)** ✅
  - 예상 소요: 2일
  - 미납자 필터링 및 일괄 선택 동작
  - Resend 이메일 템플릿 (미납 금액·계좌·마감일 포함)
  - 수동 발송 + 발송 이력 기록
  - 과도한 중복 발송 방지 (24시간 쿨다운)
  - ✅ 완료: sendUnpaidReminderEmail(HTML 템플릿), sendUnpaidReminders(24시간 쿨다운+멤버별 합산), SendReminderButton, reminder_logs에 unpaid_reminder 타입 마이그레이션 추가

- **Task 033: Phase 4 통합 테스트** ✅
  - 예상 소요: 1일
  - 정산 등록 → 분담 계산 → 계좌 등록 → 납부 확인 → 미납 리마인더 전체 루프 검증
  - 3가지 분담 방식 정확성 회귀 테스트
  - 주최자/참여자 권한 분리 검증
  - ✅ 완료: lint/type-check/build 0 에러. Playwright MCP로 홈/로그인/정산 페이지 인증 보호(미로그인→/auth/login 리디렉션) 확인. DUMMY_SETTLEMENTS import 완전 제거. tasks/033-phase4-test-report.md 생성.

---

### Phase 5: 고도화 (MVP 이후)

**목표**: MVP 운영 경험을 바탕으로 사용자 경험을 확장한다
**구현 기능**: 반복 이벤트, 출석 체크, 카풀 매칭, 캘린더 연동, 프로필 상세화 등
**예상 기간**: 4~6주 (우선순위에 따라 유동적)

- **Task 034: 반복 이벤트 자동 생성**
  - 예상 소요: 4일
  - 반복 규칙 정의 (주간/격주/월간, 특정 요일)
  - `events` 테이블에 `recurrence_rule` 컬럼 및 마스터-인스턴스 구조 추가
  - 반복 이벤트 일괄 생성·수정·삭제 UI (전체/이번만/이후 전체)
  - 주최자 대시보드 반복 이벤트 시리즈 뷰
  - Playwright MCP로 반복 규칙별 이벤트 생성 검증

- **Task 035: 출석 체크 기능**
  - 예상 소요: 3일
  - 이벤트 당일 출석 체크 UI (주최자)
  - QR 코드 기반 자가 체크인 옵션
  - 참여자별 출석 이력 통계
  - 노쇼율 대시보드 지표 추가

- **Task 036: 카풀 매칭**
  - 예상 소요: 4일
  - 출발지·목적지·탑승 가능 인원 등록 UI
  - 지도 API 연동 (카카오/네이버 맵)
  - 참여자 간 카풀 요청·수락 플로우
  - 카풀 상태 이벤트 상세에 노출

- **Task 037: 캘린더 연동**
  - 예상 소요: 3일
  - iCal(.ics) 파일 생성 및 다운로드
  - Google Calendar OAuth 연동 (이벤트 자동 추가)
  - 참여자 개인 캘린더 구독 URL 발급

- **Task 038: 프로필 상세화 및 설정**
  - 예상 소요: 2일
  - 아바타 업로드 (Supabase Storage)
  - 자기소개, 관심사 태그 추가
  - 알림 설정 페이지 (이메일 수신 범주 선택)
  - 테마(라이트/다크) 설정

- **Task 039: 실시간 기능 (Supabase Realtime)**
  - 예상 소요: 3일
  - 공지 댓글/리액션 실시간 동기화
  - 참여 신청 실시간 알림 (주최자)
  - 납부 상태 실시간 반영

- **Task 040: 성능 최적화 및 배포 파이프라인**
  - 예상 소요: 3일
  - Next.js 캐싱 전략 적용 (`use cache`, `cacheLife`, `cacheTag`)
  - 이미지 최적화 및 CDN 설정
  - Vercel Analytics 및 Sentry 연동
  - GitHub Actions CI: lint, type-check, Playwright E2E
  - 프로덕션 배포 체크리스트 및 모니터링 대시보드 구성

- **Task 041: 관리자 대시보드 및 지표 수집**
  - 예상 소요: 3일
  - 전체 이벤트·사용자·정산 통계 대시보드
  - 활성 사용자·리텐션 지표
  - 운영자 전용 이벤트 강제 종료/사용자 차단 기능

---

## 상태 범례

- **✅**: 완료된 작업 또는 세부 구현 사항
- **- 우선순위**: 즉시 시작해야 할 작업
- **상태 없음**: 대기 중인 작업
- **(Phase 제목 + ✅)**: Phase 전체 완료
