export default function MembersPage({ params }: { params: Promise<{ eventId: string }> }) {
  void params;
  return (
    <div>
      <h1 className="text-2xl font-bold">참여자 관리</h1>
      <p className="mt-2 text-muted-foreground">참여 신청자를 확정·거절하고 대기자를 관리합니다.</p>
    </div>
  );
}
