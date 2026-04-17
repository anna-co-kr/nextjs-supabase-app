# Development Guidelines

## Project Overview

- **서비스명**: Gather — 소규모~중규모 모임 통합 관리 웹 서비스
- **스택**: Next.js 15 (App Router) + Supabase + TypeScript 5 + TailwindCSS v3 + shadcn/ui
- **현재 상태**: 인증(이메일/Google OAuth) 완료, PRD 기반 이벤트·참여자·공지·정산 기능 구현 예정
- **배포**: Vercel (Fluid Compute)

---

## Project Architecture

```
app/
  auth/           # 공개 인증 경로 (login, sign-up, confirm, callback 등)
  protected/      # 인증 필요 경로 (대시보드, 이벤트 관리 등)
  page.tsx        # 공개 랜딩 페이지
  layout.tsx      # 루트 레이아웃 (ThemeProvider 포함)

components/
  ui/             # shadcn/ui 컴포넌트만 위치 (npx shadcn 으로만 추가)
  *.tsx           # 비즈니스 컴포넌트 (auth-button, login-form 등)

lib/
  supabase/
    client.ts     # 클라이언트 컴포넌트 전용
    server.ts     # 서버 컴포넌트·Server Action 전용
    proxy.ts      # 프록시(세션 갱신) 전용 — 루트 proxy.ts에서만 호출
    profile.ts    # 서버 전용 프로필 CRUD 헬퍼
  utils.ts        # cn() 유틸리티

proxy.ts          # 루트 프록시 — proxy.ts의 updateSession 호출
types/
  database.types.ts  # Supabase CLI 자동 생성 타입 — 직접 수정 금지

docs/
  PRD.md          # 제품 요구사항 명세
  ROADMAP.md      # 개발 로드맵
  LEANCANVAS.md   # 린 캔버스
  guides/         # 개발 가이드 문서
```

---

## Supabase Client Rules

**⚠️ 가장 중요한 규칙 — 반드시 준수**

| 컨텍스트                             | 사용 파일                | 비고                            |
| ------------------------------------ | ------------------------ | ------------------------------- |
| 클라이언트 컴포넌트 (`"use client"`) | `lib/supabase/client.ts` | `createBrowserClient`           |
| 서버 컴포넌트                        | `lib/supabase/server.ts` | `createServerClient`            |
| Server Action                        | `lib/supabase/server.ts` | 함수 내부에서 매번 새 인스턴스  |
| 프록시(세션 갱신)                    | `lib/supabase/proxy.ts`  | `proxy.ts` 루트 파일에서만 호출 |

- **전역 변수에 Supabase 클라이언트 저장 금지** — Fluid Compute 환경에서 세션 오염 발생
- `lib/supabase/server.ts`의 `createClient()`는 함수 호출마다 새 인스턴스 생성 필수
- `supabase.auth.getClaims()` 호출 전후에 다른 코드 삽입 금지 (proxy.ts 내)
- 모든 클라이언트 생성 시 `Database` 제네릭 타입 주입 필수:
  ```ts
  createBrowserClient<Database>(URL, KEY);
  createServerClient<Database>(URL, KEY, options);
  ```

---

## Authentication Flow Rules

- **공개 경로**: `/`, `/auth/*` — 인증 없이 접근 가능
- **보호 경로**: `/protected/*` 및 그 외 모든 경로 — 비인증 시 `/auth/login` 리디렉션
- 리디렉션 로직은 `lib/supabase/proxy.ts`의 `updateSession()` 내부에서만 처리
- 새 보호 경로 추가 시 `proxy.ts`의 리디렉션 조건 검토 필요
- 새 공개 경로 추가 시 `proxy.ts`의 `if` 조건에 예외 추가 필요
- 인증 확인은 `supabase.auth.getUser()` 사용 — `getSession()`은 서버에서 신뢰 불가

---

## Type System Rules

- **`types/database.types.ts` 직접 수정 절대 금지**
- DB 스키마 변경 후 반드시 타입 재생성:
  ```bash
  npx supabase gen types typescript --project-id <id> > types/database.types.ts
  ```
  또는 MCP 툴: `mcp__supabase__generate_typescript_types`
- `any` 타입 사용 금지 — 명시적 타입 또는 제네릭 사용
- DB 테이블 타입 참조:
  ```ts
  import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";
  // 또는 편의 타입 별칭
  import type { Profile, ProfileInsert, ProfileUpdate } from "@/types/database.types";
  ```

---

## Component Rules

- **`components/ui/`**: shadcn/ui 컴포넌트만 위치 — `npx shadcn@latest add <name>`으로만 추가
- **`components/`**: 비즈니스 컴포넌트 위치 (폼, 버튼, 레이아웃 등)
- 클라이언트 컴포넌트: 파일 최상단에 `"use client"` 선언 필수
- Server Action: `"use server"` 지시자 선언 필수 (별도 파일 또는 함수 내부)
- 컴포넌트명: PascalCase, 변수/함수명: camelCase
- 반응형 필수 — 모바일 퍼스트 TailwindCSS 클래스 사용

---

## Route Structure Rules (PRD 기반)

현재 구조와 앞으로 추가될 경로:

```
app/
  page.tsx                          # 랜딩 (공개)
  auth/
    login/page.tsx                  # 로그인 (공개)
    sign-up/page.tsx                # 회원가입 (공개)
    confirm/route.ts                # OTP 콜백 (공개)
    callback/route.ts               # OAuth 콜백 (공개)
  protected/
    page.tsx                        # 대시보드 (인증 필요)
    events/
      new/page.tsx                  # 이벤트 생성
      [eventId]/
        page.tsx                    # 이벤트 관리
        members/page.tsx            # 참여자 관리
        announcements/page.tsx      # 공지 관리
        settlements/page.tsx        # 정산 관리
  events/
    [slug]/page.tsx                 # 이벤트 공개 상세 (비인증 열람 가능)
    [slug]/apply/page.tsx           # 참여 신청 (인증 필요)
```

- 공개 이벤트 상세 페이지(`/events/[slug]`)는 `proxy.ts`의 공개 경로 예외 처리 필요
- 이벤트 관리 하위 경로는 주최자 권한 검증 필수 (Server Component에서 `getUser()` 후 `host_id` 비교)

---

## Profile Helper Rules

`lib/supabase/profile.ts` 함수는 서버 전용:

- `getProfile()` — 현재 로그인 사용자 프로필 조회 (Server Component, Server Action)
- `getProfileById(userId)` — 특정 유저 프로필 조회 (RLS PUBLIC SELECT 필요)
- `updateProfile(updates)` — 현재 로그인 사용자 프로필 수정 (Server Action)
- 클라이언트 컴포넌트에서 직접 호출 금지 — Server Action 또는 API Route를 통해 호출

---

## Database Migration Rules

- Supabase DB 변경은 MCP 툴 사용: `mcp__supabase__apply_migration`
- 마이그레이션 후 반드시 타입 재생성: `mcp__supabase__generate_typescript_types`
- PRD 데이터 모델 기준 테이블: `events`, `event_members`, `announcements`, `announcement_comments`, `announcement_reactions`, `settlement_items`, `settlement_payments`, `host_bank_accounts`
- RLS 정책은 모든 테이블에 적용 필수 — `host_id` 또는 `user_id` 기반 행 수준 보안

---

## Code Quality Rules

- **커밋 전 자동 실행**: ESLint (`--max-warnings=0`) + Prettier (Husky pre-commit)
- ESLint 경고 0개 허용 — 경고를 에러로 처리
- Prettier 설정: `.prettierrc.json` 참조, `prettier-plugin-tailwindcss` 사용 (클래스 자동 정렬)
- 들여쓰기: 2칸
- 수동 실행:
  ```bash
  npm run lint        # ESLint 검사
  npm run lint:fix    # ESLint 자동 수정
  npm run format      # Prettier 전체 포맷
  npm run type-check  # TypeScript 타입 검사
  ```

---

## Multi-File Coordination Rules

아래 상황에서는 반드시 연관 파일을 함께 수정:

| 변경 사항             | 동시 수정 필요 파일                                             |
| --------------------- | --------------------------------------------------------------- |
| DB 스키마 변경        | `types/database.types.ts` (재생성)                              |
| 새 공개 경로 추가     | `lib/supabase/proxy.ts` (리디렉션 예외 추가)                    |
| 새 환경변수 추가      | `.env.local` + `CLAUDE.md` 환경변수 섹션                        |
| shadcn 컴포넌트 추가  | `components/ui/` (자동 생성), `components.json` (자동 업데이트) |
| 새 Server Action 추가 | `"use server"` 지시자 필수                                      |

---

## AI Decision Rules

### Supabase 클라이언트 선택

```
컴포넌트에 "use client" 있음?
  YES → lib/supabase/client.ts
  NO  → lib/supabase/server.ts (매 함수 호출마다 새 인스턴스)
proxy.ts 루트 파일 관련?
  YES → lib/supabase/proxy.ts
```

### 인증 필요 여부 판단

```
경로가 / 또는 /auth/* 또는 /events/[slug] (공개 이벤트 열람)?
  YES → 공개 경로, proxy.ts 예외 처리 확인
  NO  → 보호 경로, Server Component에서 getUser() 검증 필수
```

### DB 조회 위치 판단

```
데이터가 SEO/초기 렌더링 필요?
  YES → Server Component에서 직접 조회 (lib/supabase/server.ts)
  NO, 사용자 인터랙션 후 조회?
  YES → Server Action 또는 Route Handler 사용
```

---

## Prohibited Actions

- `types/database.types.ts` 직접 편집 — 항상 CLI 재생성
- Supabase 클라이언트를 모듈 레벨 전역 변수에 저장
- `any` 타입 사용
- 클라이언트 컴포넌트에서 `lib/supabase/server.ts` import
- `supabase.auth.getSession()` 서버에서 사용 — `getUser()` 또는 `getClaims()` 사용
- `eslint-disable` 주석으로 경고 무시 (근본 원인 수정 필수)
- `components/ui/` 내 shadcn 컴포넌트 직접 수정 — 커스터마이징은 래퍼 컴포넌트 생성
- Server Action 없이 클라이언트에서 직접 DB 뮤테이션 (보안 취약점)
- PRD에 없는 기능 임의 추가 (MVP 이후 기능은 docs/PRD.md 섹션 3 참조)
