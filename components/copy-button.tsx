"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: "outline" | "ghost";
  size?: "sm" | "default";
  className?: string;
}

export function CopyButton({
  text,
  label = "복사",
  variant = "outline",
  size = "sm",
  className,
}: CopyButtonProps) {
  // 복사 성공 후 2초간 체크 아이콘으로 변경하기 위한 상태
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("복사되었습니다");

      setCopied(true);
      // 2초 후 원래 아이콘으로 복원
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다");
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("shrink-0", className)}
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="mr-1.5 h-3.5 w-3.5 text-green-600" />
      ) : (
        <Copy className="mr-1.5 h-3.5 w-3.5" />
      )}
      {label}
    </Button>
  );
}
