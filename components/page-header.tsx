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
        "mb-6 flex flex-col gap-4 border-b border-[#d2d2d7] pb-6 dark:border-[#3a3a3c] sm:flex-row sm:items-start sm:justify-between sm:gap-6",
        className,
      )}
    >
      <div className="flex flex-col gap-1.5">
        {/* 페이지 제목 — Apple 스타일: 크고 굵게, tight 자간 */}
        <h1 className="text-3xl font-bold tracking-tight text-black dark:text-white">{title}</h1>
        {/* 설명 텍스트 — Apple 서브텍스트 컬러 */}
        {description && (
          <p className="text-sm leading-relaxed text-[#6e6e73] md:text-base">{description}</p>
        )}
      </div>

      {/* 액션 영역 — 모바일 왼쪽 정렬, sm 이상 오른쪽 고정 */}
      {action && <div className="shrink-0 self-start">{action}</div>}
    </div>
  );
}
