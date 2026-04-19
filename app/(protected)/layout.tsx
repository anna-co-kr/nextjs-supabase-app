import Link from "next/link";
import { redirect } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProfile } from "@/lib/supabase/profile";
import { LayoutDashboard, PlusCircle, Settings } from "lucide-react";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // 인증된 사용자의 프로필을 조회하고, 없으면 로그인 페이지로 리디렉션
  const profile = await getProfile();
  if (!profile) redirect("/auth/login");
  return (
    <div className="flex min-h-screen bg-background">
      {/* ─── 데스크톱 사이드바 ──────────────────────────────────────── */}
      <aside
        className="hidden w-60 shrink-0 flex-col border-r border-border bg-background md:flex"
        aria-label="사이드바 네비게이션"
      >
        {/* 사이드바 로고 영역: 단순 텍스트 로고 */}
        <div className="flex h-14 items-center border-b border-border px-5">
          <Link
            href="/dashboard"
            className="text-xl font-semibold text-foreground"
            aria-label="Gather 대시보드로 이동"
          >
            Gather
          </Link>
        </div>

        {/* 사이드바 네비게이션 링크 */}
        <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label="주요 메뉴">
          {/* 대시보드 링크 */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            대시보드
          </Link>

          {/* 새 모임 만들기 링크 */}
          <Link
            href="/dashboard/events/new"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <PlusCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />새 모임
            만들기
          </Link>
        </nav>

        {/* 사이드바 하단: 프로필 + 로그아웃 */}
        <div className="border-t border-border p-4">
          {/* 사용자 프로필 섹션 */}
          <div className="mb-3 flex items-center gap-3 rounded-lg px-2 py-2">
            {/* 아바타: 시맨틱 muted 배경 */}
            <Avatar size="default">
              <AvatarFallback className="bg-muted text-xs font-semibold text-foreground">
                {(profile.full_name?.[0] ?? profile.email[0] ?? "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                {profile.full_name ?? profile.email}
              </span>
              <span className="truncate text-xs text-muted-foreground">{profile.email}</span>
            </div>
          </div>
          {/* 로그아웃 버튼 */}
          <LogoutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* ─── 모바일/공통 상단 헤더: frosted glass ───────────────────── */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
          {/* 모바일 전용 로고 */}
          <div className="md:hidden">
            <Link
              href="/dashboard"
              className="text-lg font-semibold text-foreground"
              aria-label="Gather 대시보드로 이동"
            >
              Gather
            </Link>
          </div>
          {/* 데스크톱: 빈 공간 (로고는 사이드바에 있음) */}
          <div className="hidden md:block" />
          {/* 헤더 우측: 테마 스위처 */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
          </div>
        </header>

        {/* 메인 콘텐츠 — 모바일 하단 네비 높이(pb-20) 확보 */}
        <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
      </div>

      {/* ─── 모바일 하단 고정 네비게이션: frosted glass ──────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-background/90 pb-2 backdrop-blur-xl md:hidden"
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

        {/* 새 모임 만들기 — 중앙 버튼 */}
        <Link
          href="/dashboard/events/new"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <PlusCircle className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium">새 모임</span>
        </Link>

        {/* 설정 — 준비 중 */}
        <span
          className="flex flex-1 cursor-not-allowed flex-col items-center justify-center gap-1 py-2 text-muted-foreground/40"
          aria-disabled="true"
          title="준비 중입니다"
        >
          <Settings className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-medium">설정</span>
        </span>
      </nav>
    </div>
  );
}
