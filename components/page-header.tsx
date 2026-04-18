import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    // 모바일: 세로 배치 / sm 이상: 가로 배치
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div>
        {/* 모바일에서 텍스트 크기 축소, sm 이상에서 원래 크기 */}
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {/* action 영역: 모바일에서 왼쪽 정렬, sm 이상에서 shrink 방지 */}
      {action && <div className="self-start sm:shrink-0">{action}</div>}
    </div>
  );
}
