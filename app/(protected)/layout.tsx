import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// 더미 사용자 데이터 (추후 Supabase 인증 연동 시 실제 데이터로 교체)
const DUMMY_USER = {
  name: "김지수",
  email: "jisoo@example.com",
  initials: "김",
};

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
            href="/events/new"
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
              <AvatarFallback>{DUMMY_USER.initials}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">{DUMMY_USER.name}</span>
              <span className="truncate text-xs text-muted-foreground">{DUMMY_USER.email}</span>
            </div>
          </div>
          {/* 로그아웃 버튼 */}
          <LogoutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* 상단 헤더: 모바일에서는 로고 + 대시보드 링크 표시 */}
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center gap-3 md:hidden">
            {/* 모바일에서 앱 로고 */}
            <Link href="/dashboard" className="text-lg font-bold tracking-tight">
              Gather
            </Link>
            {/* 모바일에서 대시보드로 돌아가는 링크 */}
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              모임 목록
            </Link>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <ThemeSwitcher />
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
