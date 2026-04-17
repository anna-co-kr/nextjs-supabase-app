export default function SettlementsPage({ params }: { params: Promise<{ eventId: string }> }) {
  void params;
  return (
    <div>
      <h1 className="text-2xl font-bold">정산 관리</h1>
      <p className="mt-2 text-muted-foreground">비용 항목을 등록하고 납부 여부를 관리합니다.</p>
    </div>
  );
}
