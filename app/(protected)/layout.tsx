import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LogoutButton } from "@/components/logout-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CURRENT_USER } from "@/lib/fixtures";
import { LayoutDashboard, PlusCircle, Settings } from "lucide-react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {/* ─── 데스크톱 사이드바: Apple 클린 스타일 ──────────────────────── */}
      <aside
        className="hidden w-60 shrink-0 flex-col border-r border-[#d2d2d7] bg-white dark:border-[#3a3a3c] dark:bg-black md:flex"
        aria-label="사이드바 네비게이션"
      >
        {/* 사이드바 로고 영역: 단순 텍스트 로고 */}
        <div className="flex h-14 items-center border-b border-[#d2d2d7] px-5 dark:border-[#3a3a3c]">
          <Link
            href="/dashboard"
            className="text-xl font-semibold text-black dark:text-white"
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
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-[#f5f5f7] dark:text-white dark:hover:bg-[#1c1c1e]"
          >
            <LayoutDashboard className="h-4 w-4 text-[#6e6e73]" aria-hidden="true" />
            대시보드
          </Link>

          {/* 새 모임 만들기 링크 */}
          <Link
            href="/dashboard/events/new"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-black transition-colors hover:bg-[#f5f5f7] dark:text-white dark:hover:bg-[#1c1c1e]"
          >
            <PlusCircle className="h-4 w-4 text-[#6e6e73]" aria-hidden="true" />새 모임 만들기
          </Link>
        </nav>

        {/* 사이드바 하단: 프로필 + 로그아웃 */}
        <div className="border-t border-[#d2d2d7] p-4 dark:border-[#3a3a3c]">
          {/* 사용자 프로필 섹션 */}
          <div className="mb-3 flex items-center gap-3 rounded-lg px-2 py-2">
            {/* 아바타: Apple 스타일 중성 회색 배경 */}
            <Avatar size="default">
              <AvatarFallback className="bg-[#e8e8ed] text-xs font-semibold text-black dark:bg-[#3a3a3c] dark:text-white">
                {CURRENT_USER.name[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-black dark:text-white">
                {CURRENT_USER.name}
              </span>
              <span className="truncate text-xs text-[#6e6e73]">{CURRENT_USER.email}</span>
            </div>
          </div>
          {/* 로그아웃 버튼 */}
          <LogoutButton />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* ─── 모바일/공통 상단 헤더: frosted glass ───────────────────── */}
        <header className="flex h-14 items-center justify-between border-b border-[#d2d2d7] bg-white/80 px-6 backdrop-blur-xl dark:border-[#3a3a3c] dark:bg-black/80">
          {/* 모바일 전용 로고 */}
          <div className="md:hidden">
            <Link
              href="/dashboard"
              className="text-lg font-semibold text-black dark:text-white"
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
        className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-[#d2d2d7] bg-white/90 pb-2 backdrop-blur-xl dark:border-[#3a3a3c] dark:bg-black/90 md:hidden"
        aria-label="모바일 하단 네비게이션"
      >
        {/* 대시보드 링크 */}
        <Link
          href="/dashboard"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[#6e6e73] transition-colors hover:text-black dark:hover:text-white"
        >
          <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-medium">대시보드</span>
        </Link>

        {/* 새 모임 만들기 — 중앙 Apple blue pill 버튼 */}
        <Link
          href="/dashboard/events/new"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[#6e6e73] transition-colors hover:text-black dark:hover:text-white"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0071e3]">
            <PlusCircle className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-xs font-medium">새 모임</span>
        </Link>

        {/* 설정 — 준비 중 */}
        <span
          className="flex flex-1 cursor-not-allowed flex-col items-center justify-center gap-1 py-2 text-[#6e6e73]/40"
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
