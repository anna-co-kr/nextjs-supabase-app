"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GoogleAuthButton } from "@/components/google-auth-button";

const loginSchema = z.object({
  email: z.string().min(1, "이메일을 입력해주세요").email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(1, "비밀번호를 입력해주세요"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setError("root", { message: "이메일 또는 비밀번호가 올바르지 않습니다" });
      return;
    }
    router.push("/dashboard");
  };

  return (
    /* Apple ID 로그인 스타일 페이지 래퍼 */
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* 브랜드 헤더 — 순수 텍스트 로고 (Sparkles 아이콘 제거) */}
      <div className="flex flex-col items-center gap-2 text-center">
        <Link
          href="/"
          className="text-2xl font-semibold text-black dark:text-white"
          aria-label="Gather 홈으로 이동"
        >
          Gather
        </Link>
        <p className="text-sm text-[#6e6e73]">모임 운영의 모든 것</p>
      </div>

      {/* 로그인 카드 — Apple 스타일: border 없음, 둥근 모서리, 흰 배경 */}
      <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-[#1c1c1e]">
        {/* 카드 헤더 */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-black dark:text-white">로그인</h1>
          <p className="mt-1 text-sm text-[#6e6e73]">Gather에 오신 것을 환영합니다</p>
        </div>

        <div className="space-y-5">
          {/* Google 소셜 로그인 버튼 */}
          <GoogleAuthButton label="Google로 계속하기" />

          {/* 구분선 */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-[#d2d2d7] dark:after:border-[#3a3a3c]">
            <span className="relative z-10 bg-white px-2 text-[#6e6e73] dark:bg-[#1c1c1e]">
              또는
            </span>
          </div>

          {/* 이메일/비밀번호 폼 */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-black dark:text-white">
                이메일
              </Label>
              {/* Apple 스타일 input: rounded-xl, h-12 */}
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                className="h-12 rounded-xl border-[#d2d2d7] text-sm dark:border-[#3a3a3c]"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-black dark:text-white"
                >
                  비밀번호
                </Label>
                {/* 비밀번호 찾기 링크: Apple blue 텍스트 */}
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#0071e3] underline-offset-4 hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="h-12 rounded-xl border-[#d2d2d7] text-sm dark:border-[#3a3a3c]"
                {...register("password")}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* 폼 전체 에러 메시지 */}
            {errors.root && (
              <div className="rounded-xl bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {errors.root.message}
              </div>
            )}

            {/* 로그인 제출 버튼 — Apple blue pill 스타일 */}
            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-[#0071e3] text-sm font-medium text-white hover:bg-[#0077ed]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          {/* 회원가입 유도 링크 */}
          <p className="text-center text-sm text-[#6e6e73]">
            계정이 없으신가요?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-[#0071e3] underline-offset-4 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
