import Link from "next/link";
const players = [];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">
        롤 내전 관리 사이트
      </h1>

  

      <h2 className="text-2xl font-semibold mb-4">
        참가자 목록
      </h2>

      <div className="grid gap-4">
        {players.map((player) => {
          const winRate = (
            (player.wins / (player.wins + player.losses)) *
            100
          ).toFixed(1);

          return (
            <div
              key={player.name}
              className="bg-white rounded-xl shadow p-4"
            >
              <h3 className="text-xl font-bold">
                {player.name}
              </h3>

              <p>티어: {player.tier}</p>
              <p>
                주라인: {player.mainLane} / 부라인:{" "}
                {player.subLane}
              </p>

              <p>
                {player.wins}승 {player.losses}패
              </p>

              <p>승률: {winRate}%</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
