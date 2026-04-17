export default function AnnouncementsListPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  void params;
  return (
    <div>
      <h1 className="text-2xl font-bold">공지 목록</h1>
      <p className="mt-2 text-muted-foreground">주최자가 작성한 공지를 확인하고 댓글을 남깁니다.</p>
    </div>
  );
}
