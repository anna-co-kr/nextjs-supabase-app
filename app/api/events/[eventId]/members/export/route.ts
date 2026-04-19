import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getMembersByEventId } from "@/lib/supabase/members";
import { toCSV, withBOM } from "@/lib/utils/csv";

const STATUS_LABEL: Record<string, string> = {
  confirmed: "확정",
  waiting: "대기",
  rejected: "거절",
};

export async function GET(_req: Request, { params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });

  const { data: event } = await supabase
    .from("events")
    .select("host_id, title")
    .eq("id", eventId)
    .single();

  if (!event) return new NextResponse("Not Found", { status: 404 });
  if (event.host_id !== user.id) return new NextResponse("Forbidden", { status: 403 });

  const members = await getMembersByEventId(eventId);

  const csv = withBOM(
    toCSV(members, [
      { header: "이름", value: (m) => m.profile.full_name ?? m.profile.email },
      { header: "이메일", value: (m) => m.profile.email },
      { header: "상태", value: (m) => STATUS_LABEL[m.status] ?? m.status },
      {
        header: "신청일시",
        value: (m) => new Date(m.applied_at).toLocaleString("ko-KR"),
      },
      {
        header: "확정일시",
        value: (m) => (m.confirmed_at ? new Date(m.confirmed_at).toLocaleString("ko-KR") : ""),
      },
      { header: "메모", value: (m) => m.note ?? "" },
    ]),
  );

  const filename = encodeURIComponent(`${event.title}_참여자목록.csv`);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename*=UTF-8''${filename}`,
    },
  });
}
