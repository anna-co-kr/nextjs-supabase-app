import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CURRENT_USER } from "@/lib/fixtures";
import { LayoutDashboard, PlusCircle, Settings } from "lucide-react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* 데스크톱 사이드바 */}
      <aside className="hidden w-60 shrink-0 border-r bg-background md:flex md:flex-col">
        {/* 사이드바 로고 영역 */}
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            Gather
          </Link>
        </div>

        {/* 사이드바 네비게이션 */}
        <nav className="flex flex-1 flex-col gap-1 p-4">
          <Link
            href="/dashboard"
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            대시보드
          </Link>
          <Link
            href="/dashboard/events/new"
            className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            새 모임 만들기
          </Link>
        </nav>

        {/* 사이드바 하단: 프로필 + 로그아웃 */}
        <div className="space-y-3 border-t p-4">
          {/* 사용자 프로필 섹션 */}
          <div className="flex items-center gap-3 px-1">
            <Avatar size="default">
              <AvatarFallback>{CURRENT_USER.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{CURRENT_USER.name}</span>
              <span className="truncate text-xs text-muted-foreground">{CURRENT_USER.email}</span>
            </div>
          </div>
          {/* 로그아웃 버튼 */}
          <LogoutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* 상단 헤더: 모바일에서는 로고만 표시 */}
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div className="md:hidden">
            {/* 모바일 앱 로고 */}
            <Link href="/dashboard" className="text-lg font-bold tracking-tight">
              Gather
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeSwitcher />
          </div>
        </header>

        {/* 모바일 하단 네비게이션 공간 확보 */}
        <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
      </div>

      {/* 모바일 하단 고정 네비게이션 */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-background pb-2 md:hidden"
        aria-label="모바일 하단 네비게이션"
      >
        {/* 대시보드 링크 */}
        <Link
          href="/dashboard"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-medium">대시보드</span>
        </Link>

        {/* 새 모임 만들기 링크 */}
        <Link
          href="/dashboard/events/new"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <PlusCircle className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-medium">새 모임</span>
        </Link>

        {/* 설정 링크 (Phase 5 예정, 현재는 대시보드로 연결) */}
        <Link
          href="/dashboard"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-medium">설정</span>
        </Link>
      </nav>
    </div>
  );
}
