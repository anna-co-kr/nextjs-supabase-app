import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Megaphone, Users, Receipt, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

// 핵심 기능 카드 데이터 정의 — 각 카드별 고유 컬러 테마 지정
const features = [
  {
    icon: Megaphone,
    title: "공지 관리",
    description: "중요 공지를 상단에 고정하고, 댓글과 리액션으로 구성원과 소통하세요.",
    iconBg: "bg-violet-100 dark:bg-violet-900/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    accentBorder: "border-t-violet-500",
  },
  {
    icon: Users,
    title: "참여자 관리",
    description: "신청 상태를 확정·대기·거절로 관리하고, 대기자를 자동으로 배치하세요.",
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
    accentBorder: "border-t-blue-500",
  },
  {
    icon: Receipt,
    title: "정산 정리",
    description: "균등·개별·비율 분담 방식으로 정산하고, 납부 현황을 한눈에 확인하세요.",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    accentBorder: "border-t-emerald-500",
  },
];

// 히어로 섹션 강조 포인트 목록
const highlights = [
  "모임 링크 하나로 신청부터 정산까지",
  "스프레드시트 없이 참여자 관리",
  "카카오·문자 정산 요청 자동화",
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ─── 헤더 ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur-md">
        {/* 로고: Sparkles 아이콘 + gradient 텍스트 */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
            <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-lg font-bold tracking-tight text-transparent dark:from-violet-400 dark:to-indigo-400">
            Gather
          </span>
        </Link>

        {/* 헤더 우측: 테마 스위처 + 인증 버튼 */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">로그인</Link>
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm hover:from-violet-700 hover:to-indigo-700"
            asChild
          >
            <Link href="/auth/sign-up">무료 시작하기</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* ─── 히어로 섹션 ────────────────────────────────────────────────── */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 py-28 text-center md:py-40">
          {/* 배경 그라디언트 레이어 */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-50 via-background to-background dark:from-violet-950/25 dark:via-background dark:to-background"
            aria-hidden="true"
          />
          {/* 배경 블러 블롭 — 장식용 */}
          <div
            className="pointer-events-none absolute left-1/4 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-700/15"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute right-1/4 top-32 h-56 w-56 translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl dark:bg-indigo-700/15"
            aria-hidden="true"
          />

          <div className="relative flex flex-col items-center gap-6">
            {/* 상단 뱃지 */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-medium text-violet-700 dark:border-violet-800/50 dark:bg-violet-900/30 dark:text-violet-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              모임 운영의 새로운 기준
            </div>

            {/* 메인 헤드라인 — 핵심 키워드에 gradient 적용 */}
            <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              모임 공지·참여·정산,
              <br />
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400">
                이제 하나의 링크로
              </span>
            </h1>

            {/* 서브 설명 */}
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              메신저·스프레드시트·계좌이체로 파편화된 모임 운영을
              <br className="hidden sm:block" />
              Gather 하나로 통합하세요.
            </p>

            {/* 강조 포인트 목록 */}
            <ul className="flex flex-col gap-2 sm:flex-row sm:gap-6" aria-label="주요 기능 목록">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2
                    className="h-4 w-4 shrink-0 text-violet-500 dark:text-violet-400"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTA 버튼 영역 */}
            <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-12 gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-white shadow-md hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg"
                asChild
              >
                <Link href="/auth/sign-up">
                  무료로 시작하기
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                <Link href="/events/jeju-spring-2025">데모 보기</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ─── 핵심 기능 카드 섹션 ────────────────────────────────────────── */}
        <section className="border-t bg-muted/30 px-6 py-24 dark:bg-muted/10">
          <div className="mx-auto max-w-5xl">
            {/* 섹션 타이틀 */}
            <div className="mb-14 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Features
              </p>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">모임 운영의 모든 것</h2>
              <p className="mt-4 text-muted-foreground">
                Gather 하나로 모임의 처음부터 끝까지 관리하세요.
              </p>
            </div>

            {/* 기능 카드 그리드 — hover 시 lift 효과 */}
            <div className="grid gap-6 md:grid-cols-3">
              {features.map(
                ({ icon: Icon, title, description, iconBg, iconColor, accentBorder }) => (
                  <Card
                    key={title}
                    className={`group border-t-2 bg-background shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${accentBorder}`}
                  >
                    <CardHeader className="gap-4 pt-6">
                      {/* 아이콘 컨테이너 — 각 카드별 고유 컬러 배경 */}
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} transition-transform duration-200 group-hover:scale-105`}
                      >
                        <Icon className={`h-6 w-6 ${iconColor}`} aria-hidden="true" />
                      </div>
                      <CardTitle className="text-base font-semibold">{title}</CardTitle>
                      <CardDescription className="leading-relaxed">{description}</CardDescription>
                    </CardHeader>
                  </Card>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ─── 하단 CTA 섹션 ──────────────────────────────────────────────── */}
        <section className="px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            {/* 배경 그라디언트 카드 */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-8 py-14 shadow-2xl dark:from-violet-700 dark:via-purple-700 dark:to-indigo-800">
              {/* 장식용 블롭 */}
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                aria-hidden="true"
              />

              <div className="relative flex flex-col items-center gap-6">
                <h2 className="text-3xl font-bold text-white md:text-4xl">지금 바로 시작하세요</h2>
                <p className="max-w-sm text-violet-100">
                  무료로 가입하고 첫 번째 모임을 만들어보세요. 신용카드 필요 없음.
                </p>
                <Button
                  size="lg"
                  className="h-12 gap-2 bg-white px-8 text-violet-700 shadow-lg hover:bg-violet-50 hover:shadow-xl"
                  asChild
                >
                  <Link href="/auth/sign-up">
                    무료로 시작하기
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ─── 푸터 ─────────────────────────────────────────────────────────── */}
      <footer className="flex h-16 items-center justify-between border-t px-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-violet-500 to-indigo-600">
            <Sparkles className="h-2.5 w-2.5 text-white" aria-hidden="true" />
          </div>
          <span className="font-medium text-foreground">Gather</span>
        </div>
        <span>© 2025 Gather. All rights reserved.</span>
      </footer>
    </div>
  );
}
