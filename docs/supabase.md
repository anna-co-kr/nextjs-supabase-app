# Supabase @supabase/ssr 사용 규칙

## 클라이언트 선택 기준

| 컨텍스트                                    | 사용 클라이언트          |
| ------------------------------------------- | ------------------------ |
| 클라이언트 컴포넌트 (`'use client'`)        | `lib/supabase/client.ts` |
| 서버 컴포넌트, Server Action, Route Handler | `lib/supabase/server.ts` |
| 미들웨어 (`proxy.ts`)                       | `lib/supabase/proxy.ts`  |

## Fluid Compute 주의사항

**서버 클라이언트는 전역 변수에 저장 금지.** Fluid Compute 환경에서 함수 인스턴스가 재사용되므로 매 함수 호출마다 새 클라이언트를 생성해야 함.

```tsx
// ✅ 올바른 방법 — 매번 새 클라이언트 생성
export async function getEvents() {
  const supabase = await createClient(); // lib/supabase/server.ts
  return supabase.from("events").select("*");
}

// ❌ 금지 — 전역에 저장
const supabase = createClient(); // 모듈 최상위에서 생성
```

## proxy.ts (미들웨어) 필수 규칙

`createServerClient`와 `supabase.auth.getClaims()` 사이에 다른 코드를 절대 삽입하지 말 것. 세션이 예기치 않게 만료되는 디버깅 어려운 버그가 발생함.

새 `NextResponse` 객체를 만들 경우 반드시 아래 3가지를 지켜야 함:

1. `NextResponse.next({ request })` 형태로 request 전달
2. `supabaseResponse.cookies.getAll()`을 새 응답에 복사
3. 쿠키를 절대 임의로 변경하지 말 것

## 타입 주입

모든 서버 클라이언트는 `Database` 제네릭 타입을 주입해야 함.

```tsx
import type { Database } from '@/types/database.types'

createServerClient<Database>(url, key, { cookies: ... })
```

`types/database.types.ts`는 직접 수정 금지 — `npx supabase gen types` 명령으로 재생성.

## RLS 정책 주의사항

- **INSERT/UPDATE/DELETE**: 반드시 `auth.uid() = user_id` 조건의 RLS 정책 필요
- **SELECT**: 공개 데이터와 비공개 데이터의 정책을 명확히 분리
- `getProfileById()`를 사용하려면 `profiles` 테이블에 퍼블릭 SELECT 정책 필요
- 서버 컴포넌트에서 RLS를 우회하려면 `service_role` 키 사용 (절대 클라이언트에 노출 금지)

## 인증 상태 확인

```tsx
// 서버 컴포넌트에서
const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

// 미들웨어에서 (proxy.ts)
const { data } = await supabase.auth.getClaims();
const user = data?.claims;
```

`getSession()`이 아닌 `getUser()`를 사용 — `getSession()`은 서버에서 JWT를 재검증하지 않음.

## Auth 콜백 경로

| 경로             | 용도                      |
| ---------------- | ------------------------- |
| `/auth/callback` | OAuth 로그인 후 코드 교환 |
| `/auth/confirm`  | 이메일 OTP 인증           |

이 두 경로는 미들웨어 리디렉션에서 반드시 제외 (`/auth/*` 패턴으로 이미 제외됨).
