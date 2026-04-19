import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ApplyForm } from "./apply-form";
import { createClient } from "@/lib/supabase/server";
import { getPublicEventByToken } from "@/lib/supabase/events";

interface ApplyPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 이벤트 참가 신청 페이지 (서버 컴포넌트)
 * - 비로그인 사용자: /auth/login?redirectTo=/events/{slug}/apply 로 리디렉션
 * - 이벤트 없음: 빈 상태 UI 표시
 * - 정상: ApplyForm 클라이언트 컴포넌트로 폼 렌더링
 */
export default async function ApplyPage({ params }: ApplyPageProps) {
  const { slug } = await params;

  // 인증 체크
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirectTo=/events/${slug}/apply`);
  }

  // 공개 이벤트 조회 (share_token 기반)
  const event = await getPublicEventByToken(slug);

  const publicHeader = (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      <Link href="/" className="text-base font-semibold tracking-tight">
        Gather
      </Link>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard">대시보드</Link>
      </Button>
    </header>
  );

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col">
        {publicHeader}
        <div className="flex flex-1 items-center justify-center px-4 py-10">
          <EmptyState title="존재하지 않는 모임입니다" description="링크를 다시 확인해주세요" />
        </div>
      </div>
    );
  }

  const isFull = event.confirmedCount >= event.max_participants;

  return (
    <div className="flex min-h-screen flex-col">
      {publicHeader}
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:py-16">
        <div className="w-full max-w-lg">
          <ApplyForm eventId={event.id} eventTitle={event.title} slug={slug} isFull={isFull} />
        </div>
      </main>
      <footer className="border-t border-border bg-muted py-6 text-center text-xs text-muted-foreground">
        © 2025 Gather. All rights reserved.
      </footer>
    </div>
  );
}
