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
      {/* 아이콘 컨테이너: icon prop이 없으면 기본 Inbox 아이콘 표시 */}
      <div className="mb-5 rounded-full bg-muted p-4 text-muted-foreground">
        {icon ?? <Inbox className="h-8 w-8" aria-hidden="true" />}
      </div>
      {/* 제목 */}
      <p className="text-base font-semibold text-foreground">{title}</p>
      {/* 설명 텍스트 */}
      {description && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {/* 액션 영역 (버튼 등) */}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
