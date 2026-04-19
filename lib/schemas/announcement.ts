import { z } from "zod";

export const announcementCreateSchema = z.object({
  eventId: z.string().uuid(),
  title: z.string().min(1, "제목을 입력해주세요").max(200, "200자 이내로 입력해주세요"),
  body: z.string().min(1, "내용을 입력해주세요").max(5000, "5000자 이내로 입력해주세요"),
});

export const announcementUpdateSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(1).max(5000).optional(),
});

export const commentCreateSchema = z.object({
  announcementId: z.string().uuid(),
  body: z.string().min(1, "댓글을 입력해주세요").max(1000, "1000자 이내로 입력해주세요"),
});

export type AnnouncementCreateInput = z.infer<typeof announcementCreateSchema>;
export type AnnouncementUpdateInput = z.infer<typeof announcementUpdateSchema>;
export type CommentCreateInput = z.infer<typeof commentCreateSchema>;
