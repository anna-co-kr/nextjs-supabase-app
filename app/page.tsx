import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
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

      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          모임 공지·참여·정산,
          <br />
          이제 하나의 링크로
        </h1>
        <p className="max-w-md text-lg text-muted-foreground">
          메신저·스프레드시트·계좌이체로 파편화된 모임 운영을 Gather 하나로 통합하세요.
        </p>
        <Button size="lg" asChild>
          <Link href="/auth/sign-up">무료로 시작하기</Link>
        </Button>
      </main>

      <footer className="flex h-14 items-center justify-center border-t text-sm text-muted-foreground">
        © 2025 Gather
      </footer>
    </div>
  );
}
