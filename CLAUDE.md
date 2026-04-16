# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

```bash
npm run dev      # 개발 서버 실행 (localhost:3000)
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 검사
```

## 환경 변수

`.env.local` 파일에 다음 변수가 필요합니다:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## 아키텍처 개요

Next.js 15 App Router + Supabase를 사용하는 스타터 킷입니다.

### Supabase 클라이언트

세 가지 컨텍스트에 맞는 클라이언트를 각각 사용해야 합니다:

- `lib/supabase/client.ts` — 클라이언트 컴포넌트용 (`createBrowserClient`)
- `lib/supabase/server.ts` — 서버 컴포넌트 및 Server Action용 (`createServerClient`, 매 함수 호출마다 새 인스턴스 생성 필수)
- `lib/supabase/proxy.ts` — 프록시(미들웨어) 전용, 세션 갱신 담당

### 인증 플로우

- `proxy.ts` — Vercel Fluid Compute 방식의 프록시. 미들웨어 대신 사용하여 세션 유지
- 인증 경로: `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/update-password`
- 이메일 OTP 인증 콜백: `/auth/confirm` (Route Handler)
- 비인증 사용자는 `/` 및 `/auth/*` 외 모든 경로에서 `/auth/login`으로 리디렉션

### 라우트 구조

- `/` — 공개 홈 페이지
- `/auth/*` — 인증 관련 페이지 (공개)
- `/protected/*` — 인증된 사용자만 접근 가능

### 타입 시스템

- `types/database.types.ts` — Supabase CLI로 자동 생성된 DB 타입. 직접 수정하지 말고 `npx supabase gen types`로 재생성
- 편의 타입: `Profile`, `ProfileInsert`, `ProfileUpdate`
- 모든 Supabase 클라이언트는 `Database` 제네릭 타입을 주입하여 사용

### 프로필 헬퍼

`lib/supabase/profile.ts`에 서버 전용 프로필 CRUD 함수 제공:
- `getProfile()` — 현재 로그인 사용자 프로필 조회
- `getProfileById(userId)` — 특정 사용자 프로필 조회 (RLS 퍼블릭 SELECT 필요)
- `updateProfile(updates)` — 현재 로그인 사용자 프로필 수정

### shadcn/ui

`components.json`으로 설정되어 있습니다. 새 컴포넌트 추가:

```bash
npx shadcn@latest add <component-name>
```

컴포넌트는 `components/ui/`에 설치됩니다.
