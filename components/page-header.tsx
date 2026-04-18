import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    // 섹션 시작을 자연스럽게 구분 — border-b 없이 spacing으로 계층감 표현
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        {/* 페이지 제목 — 굵기와 자간으로 계층 강조 */}
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {/* 설명 텍스트 */}
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
            {description}
          </p>
        )}
      </div>

      {/* 액션 영역 — 모바일 왼쪽 정렬, sm 이상 오른쪽 고정 */}
      {action && <div className="shrink-0 self-start">{action}</div>}
    </div>
  );
}
