import { z } from "zod";

export const eventCreateSchema = z
  .object({
    title: z.string().min(1, "모임 이름을 입력해주세요").max(100, "100자 이내로 입력해주세요"),
    description: z.string().max(1000, "1000자 이내로 입력해주세요").optional(),
    eventType: z.enum(["one_time", "recurring"]),
    approvalType: z.enum(["auto", "manual"]),
    maxParticipants: z
      .number()
      .min(2, "최소 2명 이상이어야 합니다")
      .max(500, "최대 500명까지 가능합니다"),
    startsAt: z.string().min(1, "시작 일시를 선택해주세요"),
    endsAt: z.string().optional(),
    location: z.string().max(200).optional(),
    registrationDeadline: z.string().optional(),
  })
  .refine((data) => !data.endsAt || data.endsAt >= data.startsAt, {
    message: "종료 일시는 시작 일시 이후여야 합니다",
    path: ["endsAt"],
  });

export const eventUpdateSchema = eventCreateSchema.partial().extend({
  id: z.string().uuid(),
  status: z.enum(["draft", "open", "closed", "cancelled"]).optional(),
});

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;
