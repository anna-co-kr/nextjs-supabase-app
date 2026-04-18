"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

const schema = z.object({
  title: z.string().min(1, "모임 이름을 입력해주세요").max(100, "100자 이내로 입력해주세요"),
  description: z.string().max(1000, "1000자 이내로 입력해주세요").optional(),
  type: z.enum(["one_time", "recurring"]),
  maxCapacity: z
    .number()
    .min(2, "최소 2명 이상이어야 합니다")
    .max(500, "최대 500명까지 가능합니다"),
  startDate: z.string().min(1, "시작 일시를 선택해주세요"),
  endDate: z.string().optional(),
  location: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewEventPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "one_time", maxCapacity: 10 },
  });

  const onSubmit = async (values: FormValues) => {
    // Phase 3에서 실제 API 연동 예정
    console.log("새 모임 생성:", values);
    await new Promise((r) => setTimeout(r, 500));
    router.push("/dashboard");
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
                <Select
                  defaultValue="one_time"
                  onValueChange={(v) => setValue("type", v as "one_time" | "recurring")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one_time">일회성</SelectItem>
                    <SelectItem value="recurring">정기 모임</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapacity">
                  최대 인원 <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  min={2}
                  {...register("maxCapacity", { valueAsNumber: true })}
                />
                {errors.maxCapacity && (
                  <p className="text-xs text-destructive">{errors.maxCapacity.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  시작 일시 <span className="text-destructive">*</span>
                </Label>
                <Input id="startDate" type="datetime-local" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-xs text-destructive">{errors.startDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">종료 일시</Label>
                <Input id="endDate" type="datetime-local" {...register("endDate")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">장소</Label>
              <Input id="location" placeholder="예: 강남구청 수영장" {...register("location")} />
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
