"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { announcementCreateSchema, announcementUpdateSchema } from "@/lib/schemas/announcement";
import { createAnnouncement, updateAnnouncement } from "@/lib/actions/announcement";
import type { AnnouncementCreateInput, AnnouncementUpdateInput } from "@/lib/schemas/announcement";
import type { Tables } from "@/types/database.types";

// ---------------------------------------------------------------------------
// 공지 작성 폼
// ---------------------------------------------------------------------------
interface AnnouncementCreateFormProps {
  eventId: string;
  /** 폼 제출 성공 후 콜백 */
  onSuccess?: () => void;
}

function AnnouncementCreateForm({ eventId, onSuccess }: AnnouncementCreateFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementCreateInput>({
    resolver: zodResolver(announcementCreateSchema),
    defaultValues: { eventId },
  });

  const onSubmit = (values: AnnouncementCreateInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await createAnnouncement(values);
      if (result.success) {
        reset({ eventId });
        onSuccess?.();
      } else {
        setServerError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* eventId는 hidden 필드로 전달 */}
      <input type="hidden" {...register("eventId")} />

      <div className="space-y-1.5">
        <Label htmlFor="create-title">제목</Label>
        <Input
          id="create-title"
          placeholder="공지 제목을 입력하세요"
          {...register("title")}
          disabled={isPending}
        />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="create-body">내용</Label>
        <Textarea
          id="create-body"
          placeholder="공지 내용을 입력하세요"
          rows={6}
          {...register("body")}
          disabled={isPending}
          className="resize-none"
        />
        {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex justify-end gap-2">
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "작성 중..." : "공지 작성"}
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// 공지 수정 폼
// ---------------------------------------------------------------------------
interface AnnouncementEditFormProps {
  announcement: Tables<"announcements">;
  onSuccess?: () => void;
  onCancel?: () => void;
}

function AnnouncementEditForm({ announcement, onSuccess, onCancel }: AnnouncementEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementUpdateInput>({
    resolver: zodResolver(announcementUpdateSchema),
    defaultValues: {
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
    },
  });

  const onSubmit = (values: AnnouncementUpdateInput) => {
    setServerError(null);
    startTransition(async () => {
      const result = await updateAnnouncement(values);
      if (result.success) {
        onSuccess?.();
      } else {
        setServerError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("id")} />

      <div className="space-y-1.5">
        <Label htmlFor={`edit-title-${announcement.id}`}>제목</Label>
        <Input id={`edit-title-${announcement.id}`} {...register("title")} disabled={isPending} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={`edit-body-${announcement.id}`}>내용</Label>
        <Textarea
          id={`edit-body-${announcement.id}`}
          rows={6}
          {...register("body")}
          disabled={isPending}
          className="resize-none"
        />
        {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>
          취소
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? "저장 중..." : "저장"}
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// 공지 작성 다이얼로그 (트리거 포함)
// ---------------------------------------------------------------------------
interface AnnouncementCreateDialogProps {
  eventId: string;
  trigger?: React.ReactNode;
}

export function AnnouncementCreateDialog({ eventId, trigger }: AnnouncementCreateDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger ?? <Button size="sm">공지 작성</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>공지 작성</DialogTitle>
        </DialogHeader>
        <AnnouncementCreateForm eventId={eventId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// 공지 수정 다이얼로그 (트리거 포함)
// ---------------------------------------------------------------------------
interface AnnouncementEditDialogProps {
  announcement: Tables<"announcements">;
  trigger?: React.ReactNode;
}

export function AnnouncementEditDialog({ announcement, trigger }: AnnouncementEditDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            수정
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>공지 수정</DialogTitle>
        </DialogHeader>
        <AnnouncementEditForm
          announcement={announcement}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
