"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Player = {
  user_id: string;
  discord_name: string;
  avatar_url: string;
  riot_id: string;
  tier: string;
};

function getTierScore(tier: string) {
  if (tier.includes("챌린저")) return 10;
  if (tier.includes("그랜드마스터")) return 9;
  if (tier.includes("마스터")) return 8;
  if (tier.includes("다이아")) return 7;
  if (tier.includes("에메랄드")) return 6;
  if (tier.includes("플래티넘")) return 5;
  if (tier.includes("골드")) return 4;
  if (tier.includes("실버")) return 3;
  if (tier.includes("브론즈")) return 2;
  if (tier.includes("아이언")) return 1;
  return 0;
}

export default function RankingsPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchRankings = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, discord_name, avatar_url, riot_id, tier");

      setPlayers(data || []);
    };

    fetchRankings();
  }, []);

  const rankings = [...players].sort(
    (a, b) => getTierScore(b.tier || "") - getTierScore(a.tier || "")
  );

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        🏆 티어 랭킹
      </h1>

      <div className="space-y-4">
        {rankings.map((player, index) => (
          <div
            key={player.user_id}
            className={`rounded-2xl shadow p-4 border flex items-center gap-4 ${
              index === 0
                ? "bg-yellow-100 border-yellow-400"
                : index === 1
                ? "bg-gray-100 border-gray-400"
                : index === 2
                ? "bg-orange-100 border-orange-400"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="text-3xl font-bold w-12">
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `#${index + 1}`}
            </div>

            <img
              src={player.avatar_url}
              alt="avatar"
              className="w-12 h-12 rounded-full border"
            />

            <div>
              <h2 className="text-xl font-bold">
                {player.discord_name || "이름 없음"}
              </h2>
              <p className="text-gray-500">
                {player.riot_id || "-"}
              </p>
            </div>

            <div className="ml-auto font-bold">
              {player.tier || "티어 없음"}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}