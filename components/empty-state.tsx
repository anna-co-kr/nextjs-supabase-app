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
      {/* 아이콘 컨테이너 — Apple 스타일: gradient 없음, 단순 회색 배경 */}
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5f5f7] text-[#6e6e73] dark:bg-[#1c1c1e] dark:text-[#6e6e73]">
        {icon ?? <Inbox className="h-7 w-7" aria-hidden="true" />}
      </div>

      {/* 제목 */}
      <p className="text-base font-semibold text-black dark:text-white">{title}</p>

      {/* 설명 텍스트 — Apple 서브텍스트 컬러 */}
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#6e6e73]">{description}</p>
      )}

      {/* 액션 영역 (버튼 등) */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
