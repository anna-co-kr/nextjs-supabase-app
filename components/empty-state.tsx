import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-center", className)}>
      {/* 아이콘 컨테이너 — 일러스트레이션 느낌의 그라디언트 배경 */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 text-violet-500 shadow-sm dark:from-violet-900/30 dark:to-indigo-900/30 dark:text-violet-400">
        {icon ?? <Inbox className="h-9 w-9" aria-hidden="true" />}
      </div>

      {/* 제목 */}
      <p className="text-base font-semibold text-foreground">{title}</p>

      {/* 설명 텍스트 */}
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}

      {/* 액션 영역 (버튼 등) */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
