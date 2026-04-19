"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/page-header";
import { eventCreateSchema, type EventCreateInput } from "@/lib/schemas/event";
import { createEvent } from "@/lib/actions/event";

export default function NewEventPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EventCreateInput>({
    resolver: zodResolver(eventCreateSchema),
    defaultValues: { eventType: "one_time", approvalType: "auto", maxParticipants: 10 },
  });

  const onSubmit = async (values: EventCreateInput) => {
    const result = await createEvent(values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success("모임이 생성되었습니다");
    router.push(`/manage/${result.data.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="새 모임 만들기" description="모임 정보를 입력해주세요" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">
                모임 이름 <span className="text-destructive">*</span>
              </Label>
              <Input id="title" placeholder="예: 제주도 봄 여행" {...register("title")} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">모임 설명</Label>
              <Textarea
                id="description"
                placeholder="모임에 대해 설명해주세요"
                rows={4}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>모임 유형</Label>
                <Controller
                  name="eventType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one_time">일회성</SelectItem>
                        <SelectItem value="recurring">정기 모임</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>신청 승인 방식</Label>
                <Controller
                  name="approvalType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">자동 승인</SelectItem>
                        <SelectItem value="manual">수동 승인</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxParticipants">
                최대 인원 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                min={2}
                {...register("maxParticipants", { valueAsNumber: true })}
              />
              {errors.maxParticipants && (
                <p className="text-xs text-destructive">{errors.maxParticipants.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startsAt">
                  시작 일시 <span className="text-destructive">*</span>
                </Label>
                <Input id="startsAt" type="datetime-local" {...register("startsAt")} />
                {errors.startsAt && (
                  <p className="text-xs text-destructive">{errors.startsAt.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endsAt">종료 일시</Label>
                <Input id="endsAt" type="datetime-local" {...register("endsAt")} />
                {errors.endsAt && (
                  <p className="text-xs text-destructive">{errors.endsAt.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">장소</Label>
              <Input id="location" placeholder="예: 강남구청 수영장" {...register("location")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registrationDeadline">신청 마감일</Label>
              <Input
                id="registrationDeadline"
                type="datetime-local"
                {...register("registrationDeadline")}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                취소
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? "생성 중..." : "모임 만들기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
