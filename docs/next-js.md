# Next.js 15 App Router 규칙

## params / searchParams는 반드시 await

Next.js 15부터 `params`와 `searchParams`가 비동기 API로 변경됨.

```tsx
// ✅ 올바른 방법
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const query = await searchParams;
}

// ❌ 금지 (15.x에서 에러)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
}
```

`cookies()`와 `headers()`도 동일하게 `await` 필수.

## Server Components 우선

`'use client'`는 상태(`useState`, `useEffect`)나 브라우저 이벤트가 필요한 경우에만 사용. 기본값은 Server Component.

서버에서 데이터를 fetch하고 클라이언트 컴포넌트에 props로 전달하는 방식을 선호.

```tsx
// ✅ 서버에서 fetch → 클라이언트로 전달
export default async function Page() {
  const data = await getData();
  return <ClientComponent data={data} />;
}
```

## Route 구조

이 프로젝트의 라우트 그룹:

- `/(protected)/` — 인증 필요 경로. `layout.tsx`에서 사이드바+헤더 공유
- `/auth/` — 공개 인증 경로 (미들웨어 리디렉션 제외)
- `/events/[slug]/` — 공개 이벤트 페이지

새 보호 경로는 반드시 `app/(protected)/` 하위에 생성.

## after() — 응답 후 비동기 작업

응답을 블로킹하지 않는 사후 처리(로그, 캐시 갱신 등)에 사용.

```tsx
import { after } from "next/server";

export async function POST(request: Request) {
  const result = await processData(request);
  after(async () => {
    await logAnalytics(result);
  });
  return Response.json(result);
}
```

## 캐시 전략

```tsx
// 태그 기반 캐시 + 무효화
const data = await fetch("/api/events", {
  next: { revalidate: 3600, tags: ["events"] },
});

import { revalidateTag } from "next/cache";
revalidateTag("events"); // 이벤트 변경 시 호출
```

## 금지 사항

- Pages Router 패턴(`pages/`, `getServerSideProps`, `getStaticProps`) 사용 금지
- 불필요한 `'use client'` 추가 금지 (상호작용 없는 컴포넌트에 적용 시)
- 클라이언트 컴포넌트에서 서버 전용 함수(`lib/supabase/server.ts` 등) 직접 import 금지
