import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

/**
 * 로그인 페이지
 * LoginForm 내부에서 useSearchParams를 사용하므로 Suspense 래퍼 필요
 */
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center px-4 py-10 sm:px-10">
      <div className="w-full max-w-sm">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
