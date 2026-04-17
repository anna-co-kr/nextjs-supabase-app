export default function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  void params;
  return (
    <div>
      <h1 className="text-2xl font-bold">참여 신청</h1>
      <p className="mt-2 text-muted-foreground">이벤트 참여를 신청합니다.</p>
    </div>
  );
}
