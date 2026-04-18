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
        <p className="text-sm text-muted-foreground">모임 운영의 모든 것</p>
      </div>

      {/* 로그인 카드 — border 없음, 둥근 모서리, 카드 배경 */}
      <div className="rounded-lg bg-card p-8 shadow-sm">
        {/* 카드 헤더 */}
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-foreground">로그인</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gather에 오신 것을 환영합니다</p>
        </div>

        <div className="space-y-5">
          {/* Google 소셜 로그인 버튼 */}
          <GoogleAuthButton label="Google로 계속하기" />

          {/* 구분선 */}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
            <span className="relative z-10 bg-card px-2 text-muted-foreground">또는</span>
          </div>

          {/* 이메일/비밀번호 폼 */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                이메일
              </Label>
              {/* 이메일 입력 필드 */}
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                className="h-12 rounded-md border-border text-sm"
                {...register("email")}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  비밀번호
                </Label>
                {/* 비밀번호 찾기 링크 */}
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-primary underline-offset-4 hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="h-12 rounded-md border-border text-sm"
                {...register("password")}
              />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            {/* 폼 전체 에러 메시지 */}
            {errors.root && (
              <div className="rounded-md bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {errors.root.message}
              </div>
            )}

            {/* 로그인 제출 버튼 */}
            <Button
              type="submit"
              className="h-12 w-full rounded-md bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          {/* 회원가입 유도 링크 */}
          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link
              href="/auth/sign-up"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
