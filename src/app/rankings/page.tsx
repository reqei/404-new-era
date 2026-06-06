export default function RankingsPage() {
  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        🏆 내전 랭킹
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 border text-center">
        <p className="text-xl font-bold">
          아직 기록된 내전 결과가 없습니다.
        </p>

        <p className="text-gray-500 mt-2">
          관리자가 내전 결과를 입력하면 랭킹이 표시됩니다.
        </p>
      </div>
    </main>
  );
}