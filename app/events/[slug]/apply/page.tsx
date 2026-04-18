"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/empty-state";
import { DUMMY_EVENTS } from "@/lib/fixtures";

const schema = z.object({
  note: z.string().max(300, "300자 이내로 입력해주세요").optional(),
});

type FormValues = z.infer<typeof schema>;

export default function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const event = DUMMY_EVENTS.find((e) => e.shareToken === slug);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    // Phase 3에서 실제 API 연동 예정
    console.log("참여 신청:", values);
    await new Promise((r) => setTimeout(r, 500));
    router.push(`/events/${slug}`);
  };

  if (!event) {
    return (
      <div className="mx-auto max-w-lg px-4 py-10">
        <EmptyState title="존재하지 않는 모임입니다" description="링크를 다시 확인해주세요" />
      </div>
    );
  }

  const isFull = event.confirmedCount >= event.maxCapacity;

  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>{isFull ? "대기자 신청" : "참여 신청"}</CardTitle>
          {event && <p className="text-sm text-muted-foreground">{event.title}</p>}
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
              <p className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700">
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
    </div>
  );
}
