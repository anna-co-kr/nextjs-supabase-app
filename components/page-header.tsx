import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    /* Apple 스타일 페이지 헤더: border-b로 섹션 구분, 넉넉한 하단 여백 */
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        {/* 페이지 제목: 크고 굵게, tight 자간 */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
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
