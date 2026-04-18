import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEventDate(
  dateString: string,
  options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", weekday: "short" },
): string {
  return new Date(dateString).toLocaleDateString("ko-KR", options);
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
