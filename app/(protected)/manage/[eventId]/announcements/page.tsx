export default function AnnouncementsPage({ params }: { params: Promise<{ eventId: string }> }) {
  void params;
  return (
    <div>
      <h1 className="text-2xl font-bold">공지 관리</h1>
      <p className="mt-2 text-muted-foreground">공지를 작성하고 고정 설정을 관리합니다.</p>
    </div>
  );
}
