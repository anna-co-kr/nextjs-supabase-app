"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { commentCreateSchema, type CommentCreateInput } from "@/lib/schemas/announcement";
import { createComment, deleteComment } from "@/lib/actions/announcement";
import type { Tables } from "@/types/database.types";

// ---------------------------------------------------------------------------
// 댓글 작성 폼
// ---------------------------------------------------------------------------
interface CommentFormProps {
  announcementId: string;
}

export function CommentForm({ announcementId }: CommentFormProps) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentCreateInput>({
    resolver: zodResolver(commentCreateSchema),
    defaultValues: { announcementId },
  });

  const onSubmit = (values: CommentCreateInput) => {
    startTransition(async () => {
      const result = await createComment(values);
      if (result.success) {
        reset({ announcementId });
        setIsOpen(false);
        toast.success("댓글이 등록되었습니다");
      } else {
        toast.error(result.error);
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex min-h-[44px] cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <MessageCircle className="h-3.5 w-3.5" />
        댓글 달기
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <input type="hidden" {...register("announcementId")} />
      <Textarea
        placeholder="댓글을 입력하세요 (최대 1000자)"
        rows={3}
        {...register("body")}
        disabled={isPending}
        className="resize-none text-sm"
        autoFocus
      />
      {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => setIsOpen(false)}
          disabled={isPending}
        >
          취소
        </Button>
        <Button type="submit" size="sm" className="h-7 text-xs" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              작성 중...
            </>
          ) : (
            "댓글 작성"
          )}
        </Button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// 댓글 삭제 버튼
// ---------------------------------------------------------------------------
interface DeleteCommentButtonProps {
  commentId: string;
  /** 현재 로그인 사용자 ID */
  currentUserId: string | undefined;
  /** 댓글 작성자 ID */
  authorId: string;
}

export function DeleteCommentButton({
  commentId,
  currentUserId,
  authorId,
}: DeleteCommentButtonProps) {
  const [isPending, startTransition] = useTransition();

  // 본인 댓글이 아니면 렌더링하지 않음
  if (!currentUserId || currentUserId !== authorId) return null;

  const handleClick = () => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    startTransition(async () => {
      const result = await deleteComment(commentId);
      if (result.success) {
        toast.success("댓글이 삭제되었습니다");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="ml-1 text-[10px] text-muted-foreground hover:text-destructive disabled:opacity-50"
      title="댓글 삭제"
    >
      {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// 댓글 목록 + 작성 폼 통합 컴포넌트
// ---------------------------------------------------------------------------
interface CommentSectionProps {
  announcementId: string;
  comments: Array<
    Tables<"announcement_comments"> & {
      author: Pick<Tables<"profiles">, "id" | "full_name" | "email">;
    }
  >;
  currentUserId: string | undefined;
}

export function CommentSection({ announcementId, comments, currentUserId }: CommentSectionProps) {
  return (
    <div className="space-y-3">
      {comments.length > 0 && (
        <div className="space-y-2 border-t border-border pt-3">
          {comments.map((c) => {
            const displayName = c.author.full_name ?? c.author.email ?? "알 수 없음";
            return (
              <div key={c.id} className="flex gap-2">
                <Avatar className="mt-0.5 h-6 w-6 shrink-0">
                  <AvatarFallback className="text-[10px]">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-medium">{displayName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("ko-KR") : ""}
                    </span>
                    <DeleteCommentButton
                      commentId={c.id}
                      currentUserId={currentUserId}
                      authorId={c.author_id}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{c.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <CommentForm announcementId={announcementId} />
    </div>
  );
}
