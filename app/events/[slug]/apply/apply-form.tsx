"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { applyToEvent } from "@/lib/actions/member";
import { toast } from "sonner";

const schema = z.object({
  note: z.string().max(300, "300자 이내로 입력해주세요").optional(),
});

type FormValues = z.infer<typeof schema>;

interface ApplyFormProps {
  eventId: string;
  eventTitle: string;
  slug: string;
  isFull: boolean;
}

/**
 * 이벤트 참가 신청 폼 (클라이언트 컴포넌트)
 * Server Component인 page.tsx에서 이벤트 데이터를 props로 받아 렌더링
 */
export function ApplyForm({ eventId, eventTitle, slug, isFull }: ApplyFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    const result = await applyToEvent(eventId, values.note);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    const statusMsg =
      result.data.status === "confirmed"
        ? "참여 신청이 확정되었습니다!"
        : "대기자로 등록되었습니다. 자리가 생기면 자동으로 확정됩니다.";

    toast.success(statusMsg);
    router.push(`/events/${slug}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isFull ? "대기자 신청" : "참여 신청"}</CardTitle>
        <p className="text-sm text-muted-foreground">{eventTitle}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="note">주최자에게 한마디 (선택)</Label>
            <Textarea
              id="note"
              placeholder="참여 동기나 간단한 자기소개를 남겨주세요"
              rows={3}
              {...register("note")}
            />
            {errors.note && <p className="text-xs text-destructive">{errors.note.message}</p>}
          </div>

          {isFull && (
            <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
              현재 정원이 꽉 찼습니다. 대기자로 등록되며, 자리가 생기면 자동으로 확정됩니다.
            </p>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" asChild>
              <Link href={`/events/${slug}`}>취소</Link>
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "신청 중..." : isFull ? "대기자로 신청" : "참여 신청"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
