# TypeScript + Tailwind CSS 코딩 스타일 가이드

## TypeScript 규칙

### `any` 타입 금지

```tsx
// ❌ 금지
function process(data: any) { ... }

// ✅ 올바른 방법
function process(data: EventRow) { ... }
function process<T>(data: T) { ... }
```

### Props 인터페이스 정의

컴포넌트 Props는 반드시 `interface`로 명시. `type`도 허용하나 일관성 유지.

```tsx
interface EventCardProps {
  event: EventRow
  onSelect?: (id: string) => void
  className?: string
}

export function EventCard({ event, onSelect, className }: EventCardProps) { ... }
```

### Supabase 타입 활용

```tsx
import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

type EventRow = Tables<"events">;
type EventInsert = TablesInsert<"events">;
```

### Server Action 반환 타입

```tsx
type ActionResult = { success: true; data: EventRow } | { success: false; error: string }

export async function createEvent(formData: FormData): Promise<ActionResult> { ... }
```

## Tailwind CSS 규칙

- 시맨틱 색상 변수 사용 (`bg-background`, `text-foreground`, `text-muted-foreground` 등) — 하드코딩 금지
- 조건부 클래스는 반드시 `cn()` 헬퍼 사용 (`import { cn } from '@/lib/utils'`)
- 반응형: 모바일 우선 (`flex-col md:flex-row`)
- 인라인 스타일 금지

> 상세 스타일 가이드: `docs/guides/styling-guide.md`

## 컴포넌트 규칙

### Server Component 기본

`'use client'`는 `useState`, `useEffect`, 이벤트 핸들러가 필요한 경우에만 사용.

### 파일 구조

- 페이지: `app/**/page.tsx`
- 공유 UI 컴포넌트: `components/ui/` (shadcn/ui)
- 기능 컴포넌트: `components/*.tsx`
- 서버 유틸: `lib/`

### shadcn/ui 컴포넌트 우선

직접 버튼/카드/인풋을 만들기 전에 `components/ui/`에 이미 있는지 확인.

```bash
npx shadcn@latest add <component-name>
```

### CVA로 변형 관리

여러 variant가 필요한 컴포넌트는 `class-variance-authority` 사용.

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});
```

## 폼 규칙

React Hook Form + Zod 조합 사용.

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;
```

## 네이밍 규칙

| 대상            | 규칙             | 예시                       |
| --------------- | ---------------- | -------------------------- |
| 컴포넌트        | PascalCase       | `EventCard`, `UserProfile` |
| 함수/변수       | camelCase        | `getEvents`, `isLoading`   |
| 상수            | UPPER_SNAKE_CASE | `MAX_EVENT_COUNT`          |
| 타입/인터페이스 | PascalCase       | `EventRow`, `FormValues`   |
| 파일(컴포넌트)  | kebab-case       | `event-card.tsx`           |
