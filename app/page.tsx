import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Megaphone, Users, Receipt, ArrowRight } from "lucide-react";

// 핵심 기능 목록 — 아이콘, 제목, 설명 구성
const features = [
  {
    icon: Megaphone,
    title: "공지 관리",
    description:
      "중요 공지를 상단에 고정하고, 댓글과 리액션으로 구성원과 소통하세요. 모든 메시지를 한 곳에서 관리합니다.",
  },
  {
    icon: Users,
    title: "참여자 관리",
    description:
      "신청 상태를 확정·대기·거절로 관리하고, 대기자를 자동으로 배치하세요. 스프레드시트 없이 간편하게.",
  },
  {
    icon: Receipt,
    title: "정산 정리",
    description:
      "균등·개별·비율 분담 방식으로 정산하고, 납부 현황을 한눈에 확인하세요. 카카오·문자 정산 요청 자동화.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ─── 헤더: frosted glass sticky 네비게이션 ─────────────────────── */}
      <header className="sticky top-0 z-50 flex h-12 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-xl md:px-10">
        {/* 로고: 단순하고 클린한 텍스트 */}
        <Link
          href="/"
          className="text-sm font-semibold text-foreground"
          aria-label="Gather 홈으로 이동"
        >
          Gather
        </Link>

        {/* 헤더 우측: 테마 스위처 + 인증 버튼 */}
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-md px-4 text-xs font-medium"
            asChild
          >
            <Link href="/auth/login">로그인</Link>
          </Button>
          {/* 시작하기 버튼 */}
          <Button
            size="sm"
            className="h-8 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/auth/sign-up">시작하기</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* ─── 히어로 섹션: 전경색 배경, 풀 블리드 ───────────────────── */}
        <section className="flex flex-col items-center justify-center bg-foreground px-6 py-28 text-center text-background md:px-10 md:py-40">
          <div className="flex flex-col items-center gap-6">
            {/* 상단 뱃지 */}
            <span className="text-sm font-medium text-background/70">새로운 방식의 모임 운영</span>

            {/* 메인 헤드라인 — Apple 스타일 극도로 크고 굵게 */}
            <h1 className="max-w-4xl text-6xl font-bold tracking-tight md:text-8xl">
              모임의 모든 것,
              <br />
              Gather
            </h1>

            {/* 서브텍스트 */}
            <p className="max-w-2xl text-xl leading-relaxed text-background/60 md:text-2xl">
              공지, 참여자 관리, 정산까지.
              <br className="hidden sm:block" />
              모임 운영의 처음부터 끝까지 하나의 링크로.
            </p>

            {/* CTA 버튼 2개: pill 스타일 */}
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              {/* 기본 CTA 버튼 */}
              <Button
                size="lg"
                className="h-12 rounded-md bg-background px-8 text-base font-medium text-foreground hover:bg-background/90"
                asChild
              >
                <Link href="/auth/sign-up">
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              {/* 보조 버튼: 반투명 배경 */}
              <Button
                size="lg"
                className="h-12 rounded-md bg-background/10 px-8 text-base font-medium text-background hover:bg-background/20"
                asChild
              >
                <Link href="/events/jeju-spring-2025">데모 보기</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ─── 기능 소개 섹션: 배경색 ────────────────────────────────── */}
        <section className="bg-background px-6 py-28 text-foreground md:px-10 md:py-40">
          <div className="mx-auto max-w-screen-xl">
            {/* 섹션 레이블 */}
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              왜 Gather인가요?
            </p>

            {/* 섹션 헤드라인 */}
            <h2 className="mb-16 max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
              모임 운영의 모든 과정을
              <br />
              하나로 통합했습니다.
            </h2>

            {/* 기능 목록: border-top으로 구분, 카드 없음 */}
            <div className="divide-y divide-border">
              {features.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex flex-col gap-4 py-10 sm:flex-row sm:items-start sm:gap-12"
                >
                  {/* 좌측: 아이콘 + 제목 */}
                  <div className="flex min-w-[200px] items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                    </span>
                    <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
                  </div>

                  {/* 우측: 설명 */}
                  <p className="text-lg leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA 섹션: 전경색 배경 ──────────────────────────────────── */}
        <section className="bg-foreground px-6 py-28 text-center text-background md:px-10 md:py-40">
          <div className="mx-auto max-w-screen-xl">
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              지금 바로 시작하세요
            </h2>
            <p className="mb-10 text-lg text-background/60">
              무료로 가입하고 첫 번째 모임을 만들어보세요.
            </p>
            <Button
              size="lg"
              className="h-12 rounded-md bg-background px-10 text-base font-medium text-foreground hover:bg-background/90"
              asChild
            >
              <Link href="/auth/sign-up">
                무료로 시작하기
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* ─── 푸터: 심플 스타일 ──────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted px-6 py-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <span className="text-sm font-semibold text-foreground">Gather</span>
            <span className="text-xs text-muted-foreground">
              © 2025 Gather. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
