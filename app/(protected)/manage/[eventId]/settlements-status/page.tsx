export default function SettlementsStatusPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  void params;
  return (
    <div>
      <h1 className="text-2xl font-bold">정산 현황</h1>
      <p className="mt-2 text-muted-foreground">납부 금액과 주최자 계좌를 확인합니다.</p>
    </div>
  );
}
