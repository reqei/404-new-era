"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Profile = {
  user_id: string;
  discord_name: string;
  avatar_url: string;
  riot_id: string;
};

type MatchResult = {
  user_id: string;
  result: string;
};

export default function RankingsPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [results, setResults] = useState<MatchResult[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("user_id, discord_name, avatar_url, riot_id");

      const { data: resultData } = await supabase
        .from("match_results")
        .select("user_id, result");

      setProfiles(profileData || []);
      setResults(resultData || []);
    };

    fetchData();
  }, []);

  const rankings = profiles
    .map((profile) => {
      const userResults = results.filter(
        (item) => item.user_id === profile.user_id
      );

      const wins = userResults.filter(
        (item) => item.result === "win"
      ).length;

      const losses = userResults.filter(
        (item) => item.result === "lose"
      ).length;

      const total = wins + losses;
      const winRate =
        total === 0 ? 0 : Math.round((wins / total) * 100);

      return {
        ...profile,
        wins,
        losses,
        total,
        winRate,
      };
    })
    .filter((player) => player.total > 0)
    .sort((a, b) => b.winRate - a.winRate || b.wins - a.wins);

  return (
    <main className="px-0 pt-6">
      <h1 className="text-4xl font-bold mb-6">
        🏆 내전 랭킹
      </h1>

      {rankings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6 border text-center">
          <p className="text-xl font-bold">
            아직 기록된 내전 결과가 없습니다.
          </p>
          <p className="text-gray-500 mt-2">
            관리자가 내전 결과를 입력하면 랭킹이 표시됩니다.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rankings.map((player, index) => (
            <div
              key={player.user_id}
              className="bg-white rounded-2xl shadow p-5 border flex items-center gap-4"
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
                  {player.discord_name}
                </h2>
                <p className="text-gray-500">
                  {player.riot_id || "-"}
                </p>
              </div>

              <div className="ml-auto text-right font-bold">
                <p>
                  {player.wins}승 {player.losses}패
                </p>
                <p className="text-blue-500">
                  승률 {player.winRate}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}