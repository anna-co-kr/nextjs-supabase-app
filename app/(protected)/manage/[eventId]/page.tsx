export default function EventManagePage({ params }: { params: Promise<{ eventId: string }> }) {
  void params;
  return (
    <div>
      <h1 className="text-2xl font-bold">이벤트 관리</h1>
      <p className="mt-2 text-muted-foreground">이벤트 기본 정보를 수정하고 관리합니다.</p>
    </div>
  );
}
