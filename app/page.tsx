import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Megaphone, Users, Receipt } from "lucide-react";

// 핵심 기능 카드 데이터 정의
const features = [
  {
    icon: Megaphone,
    title: "공지 관리",
    description: "중요 공지를 상단에 고정하고, 댓글과 리액션으로 구성원과 소통하세요.",
  },
  {
    icon: Users,
    title: "참여자 관리",
    description: "신청 상태를 확정·대기·거절로 관리하고, 대기자를 자동으로 배치하세요.",
  },
  {
    icon: Receipt,
    title: "정산 정리",
    description: "균등·개별·비율 분담 방식으로 정산하고, 납부 현황을 한눈에 확인하세요.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* 헤더: 로고, 테마 스위처, 인증 버튼 */}
      <header className="flex h-16 items-center justify-between border-b px-6">
        <span className="text-lg font-bold tracking-tight">Gather</span>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <Button variant="ghost" asChild>
            <Link href="/auth/login">로그인</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">회원가입</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* 히어로 섹션 */}
        <section className="flex flex-col items-center justify-center gap-8 px-6 py-24 text-center md:py-36">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              모임 공지·참여·정산,
              <br />
              이제 하나의 링크로
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
              메신저·스프레드시트·계좌이체로 파편화된 모임 운영을 Gather 하나로 통합하세요.
            </p>
          </div>
          {/* CTA 버튼 영역 */}
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">무료로 시작하기</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/events/jeju-spring-2025">데모 보기</Link>
            </Button>
          </div>
        </section>

        {/* 핵심 기능 카드 섹션 */}
        <section className="border-t bg-muted/40 px-6 py-20">
          <div className="mx-auto max-w-5xl">
            {/* 섹션 타이틀 */}
            <div className="mb-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">모임 운영의 모든 것</h2>
              <p className="mt-3 text-muted-foreground">
                Gather 하나로 모임의 처음부터 끝까지 관리하세요.
              </p>
            </div>

            {/* 기능 카드 그리드 */}
            <div className="grid gap-6 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description }) => (
                <Card key={title} className="bg-background">
                  <CardHeader className="gap-3">
                    {/* 아이콘 컨테이너 */}
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="flex h-14 items-center justify-center border-t text-sm text-muted-foreground">
        © 2025 Gather
      </footer>
    </div>
  );
}
