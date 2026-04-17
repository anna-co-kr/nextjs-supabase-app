# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

```bash
npm run dev          # 개발 서버 실행 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run lint:fix     # ESLint 자동 수정
npm run format       # Prettier 포맷팅
npm run type-check   # TypeScript 타입 검사
```

## 환경 변수

`.env.local` 파일에 다음 변수가 필요합니다:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

## 프로젝트 개요

이벤트 관리 플랫폼 **Gather** — 이벤트 생성, 참가자 관리, 정산 기능을 제공합니다.

## 아키텍처 개요

### 라우트 구조

- `/` — 공개 홈 페이지
- `/auth/*` — 인증 관련 페이지 (공개, 리디렉션 제외)
- `/events/[slug]` — 공개 이벤트 상세 페이지
- `/events/[slug]/apply` — 참가자 등록 페이지
- `/(protected)/dashboard` — 내 이벤트 목록 (주최자 + 참가자)
- `/(protected)/events/new` — 이벤트 생성
- `/(protected)/manage/[eventId]/*` — 이벤트 관리 허브 (설정, 멤버, 공지, 정산)

보호 경로는 `app/(protected)/layout.tsx`에서 사이드바+헤더 레이아웃을 공유합니다.

### Supabase 클라이언트

컨텍스트별로 반드시 올바른 클라이언트를 사용해야 합니다:

- `lib/supabase/client.ts` — 클라이언트 컴포넌트용 (`createBrowserClient`)
- `lib/supabase/server.ts` — 서버 컴포넌트, Server Action, Route Handler용 (`createServerClient`, 매 호출마다 새 인스턴스 생성)
- `lib/supabase/proxy.ts` — 미들웨어 전용, 세션 갱신 담당

### 인증 플로우

- `proxy.ts` — Vercel Fluid Compute 방식 프록시. 모든 요청을 인터셉트하여 세션 유지
- `/auth/callback` — OAuth 리디렉션 핸들러 (코드 → 세션 교환)
- `/auth/confirm` — 이메일 OTP 인증 핸들러
- 비인증 사용자는 `/`, `/auth/*`, `/events/*` 외 모든 경로에서 `/auth/login`으로 리디렉션

### 타입 시스템

- `types/database.types.ts` — Supabase CLI로 자동 생성. 직접 수정 금지, `npx supabase gen types`로 재생성
- 편의 타입: `Profile`, `ProfileInsert`, `ProfileUpdate`
- 모든 Supabase 클라이언트는 `Database` 제네릭 타입 주입 필수

### 프로필 헬퍼

`lib/supabase/profile.ts` — 서버 전용 프로필 CRUD:

- `getProfile()` — 현재 로그인 사용자 프로필 조회
- `getProfileById(userId)` — 특정 사용자 프로필 조회
- `updateProfile(updates)` — 현재 로그인 사용자 프로필 수정

### shadcn/ui

```bash
npx shadcn@latest add <component-name>
```

컴포넌트는 `components/ui/`에 설치됩니다.

## 문서

- `docs/PRD.md` — 제품 요구사항 (기능 상세, 데이터 모델)
- `docs/ROADMAP.md` — 개발 단계 (Phase 1~5)
- `docs/guides/` — 스타일링, 폼, 컴포넌트 패턴 가이드

@docs/next-js.md
@docs/supabase.md
@docs/coding-style.md
