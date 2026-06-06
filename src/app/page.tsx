import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-4">
        롤 내전 관리 사이트
      </h1>

      <p className="text-gray-600 mb-6">
        소환사 정보를 등록하고 내전 정보를 관리하는 사이트입니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/summoners"
          className="bg-white rounded-2xl shadow p-6 border hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold mb-2">
            👥 소환사 관리
          </h2>
          <p className="text-gray-500">
            등록된 소환사 목록을 확인합니다.
          </p>
        </Link>

        <Link
          href="/matches"
          className="bg-white rounded-2xl shadow p-6 border hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold mb-2">
            🎮 내전
          </h2>
          <p className="text-gray-500">
            내전 참가자와 진행 상태를 확인합니다.
          </p>
        </Link>

        <Link
          href="/rankings"
          className="bg-white rounded-2xl shadow p-6 border hover:shadow-xl transition"
        >
          <h2 className="text-2xl font-bold mb-2">
            🏆 랭킹
          </h2>
          <p className="text-gray-500">
            티어 기준 랭킹을 확인합니다.
          </p>
        </Link>
      </div>
    </main>
  );
}