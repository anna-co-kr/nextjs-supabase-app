export default function PublicEventPage({ params }: { params: Promise<{ slug: string }> }) {
  void params;
  return (
    <div>
      <h1 className="text-2xl font-bold">이벤트 상세</h1>
      <p className="mt-2 text-muted-foreground">이벤트 정보를 확인하고 참여를 신청합니다.</p>
    </div>
  );
}
