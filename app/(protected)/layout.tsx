import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CURRENT_USER } from "@/lib/fixtures";
import { LayoutDashboard, PlusCircle, Settings, Sparkles } from "lucide-react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* ─── 데스크톱 사이드바 ────────────────────────────────────────────── */}
      <aside
        className="hidden w-60 shrink-0 md:flex md:flex-col"
        style={{ background: "var(--sidebar)" }}
      >
        {/* 사이드바 로고 영역 */}
        <div
          className="flex h-16 items-center gap-3 border-b px-5"
          style={{ borderColor: "var(--sidebar-border)" }}
        >
          {/* Gather 로고 아이콘 */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <Link
            href="/dashboard"
            className="bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-lg font-bold tracking-tight text-transparent"
          >
            Gather
          </Link>
        </div>

        {/* 사이드바 네비게이션 */}
        <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="주요 메뉴">
          {/* 네비게이션 섹션 레이블 */}
          <p
            className="mb-1 px-3 text-xs font-medium uppercase tracking-widest"
            style={{ color: "color-mix(in oklch, var(--sidebar-foreground) 40%, transparent)" }}
          >
            메뉴
          </p>

          {/* 대시보드 링크 */}
          <Link
            href="/dashboard"
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-white/10"
            style={{ color: "var(--sidebar-foreground)" }}
          >
            <LayoutDashboard
              className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
            대시보드
          </Link>

          {/* 새 모임 만들기 링크 */}
          <Link
            href="/dashboard/events/new"
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-white/10"
            style={{ color: "var(--sidebar-foreground)" }}
          >
            <PlusCircle
              className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
            새 모임 만들기
          </Link>
        </nav>

        {/* 사이드바 하단: 프로필 + 로그아웃 */}
        <div className="space-y-3 border-t p-4" style={{ borderColor: "var(--sidebar-border)" }}>
          {/* 사용자 프로필 섹션 */}
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            {/* 아바타: 인디고 계열 그라디언트 배경 */}
            <Avatar size="default">
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-semibold text-white">
                {CURRENT_USER.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span
                className="truncate text-sm font-medium"
                style={{ color: "var(--sidebar-foreground)" }}
              >
                {CURRENT_USER.name}
              </span>
              <span
                className="truncate text-xs"
                style={{ color: "color-mix(in oklch, var(--sidebar-foreground) 55%, transparent)" }}
              >
                {CURRENT_USER.email}
              </span>
            </div>
          </div>
          {/* 로그아웃 버튼 */}
          <LogoutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* ─── 상단 헤더 ──────────────────────────────────────────────────── */}
        <header className="flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-sm">
          {/* 모바일 로고 */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-indigo-600">
              <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden="true" />
            </div>
            <Link
              href="/dashboard"
              className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400"
            >
              Gather
            </Link>
          </div>
          {/* 헤더 우측: 테마 스위처 */}
          <div className="ml-auto flex items-center gap-3">
            <ThemeSwitcher />
          </div>
        </header>

        {/* 메인 콘텐츠 — 모바일 하단 네비 높이(pb-20) 확보 */}
        <main className="flex-1 p-6 pb-20 md:pb-6">{children}</main>
      </div>

      {/* ─── 모바일 하단 고정 네비게이션 ───────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex border-t bg-background/95 pb-2 backdrop-blur-sm md:hidden"
        aria-label="모바일 하단 네비게이션"
      >
        {/* 대시보드 링크 */}
        <Link
          href="/dashboard"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-medium">대시보드</span>
        </Link>

        {/* 새 모임 만들기 — 중앙 강조 버튼 */}
        <Link
          href="/dashboard/events/new"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors hover:text-primary"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
            <PlusCircle className="h-5 w-5 text-white" aria-hidden="true" />
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
