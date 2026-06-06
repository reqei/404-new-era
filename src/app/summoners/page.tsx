"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Player = {
  id: string;
  discordName: string;
  avatarUrl: string;
  riotId: string;
  tier: string;
  mainLane: string;
  subLane: string;
  most1: string;
  most2: string;
  most3: string;
};

function getTierColor(tier: string) {
  if (tier.includes("아이언")) return "bg-gray-700 text-white";
  if (tier.includes("브론즈")) return "bg-amber-700 text-white";
  if (tier.includes("실버")) return "bg-slate-400 text-black";
  if (tier.includes("골드")) return "bg-yellow-400 text-black";
  if (tier.includes("플래티넘")) return "bg-cyan-500 text-white";
  if (tier.includes("에메랄드")) return "bg-green-500 text-white";
  if (tier.includes("다이아")) return "bg-blue-500 text-white";
  if (tier.includes("그랜드마스터")) return "bg-red-500 text-white";
  if (tier.includes("챌린저")) return "bg-yellow-300 text-black";
  if (tier.includes("마스터")) return "bg-purple-500 text-white";

  return "bg-gray-300 text-black";
}

export default function SummonersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState("");
  const [laneFilter, setLaneFilter] = useState("전체");

  const lanes = ["탑", "정글", "미드", "원딜", "서포터"];
  const filterLanes = ["전체", ...lanes];

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          
          "user_id, discord_name, avatar_url, riot_id, tier, main_lane, sub_lane, most1, most2, most3")
      if (error) {
        alert("소환사 목록을 불러오지 못했습니다.");
        return;
      }

      const mappedPlayers =
        data?.map((profile) => ({
          id: profile.user_id,
          discordName: profile.discord_name || "이름 없음",
          riotId: profile.riot_id || "-",
          tier: profile.tier || "티어 없음",
          mainLane: profile.main_lane || "-",
          subLane: profile.sub_lane || "-",
          avatarUrl: profile.avatar_url || "",
          most1: profile.most1 || "",
          most2: profile.most2 || "",
          most3: profile.most3 || "",
        })) || [];

      setPlayers(mappedPlayers);
    };

    fetchProfiles();
  }, []);

 const filteredPlayers = players.filter((player) => {
  const keyword = search.toLowerCase();

  const matchSearch =
    player.discordName.toLowerCase().includes(keyword) ||
    player.riotId.toLowerCase().includes(keyword) ||
    player.tier.toLowerCase().includes(keyword) ||
    player.mainLane.toLowerCase().includes(keyword) ||
    player.subLane.toLowerCase().includes(keyword) ||
    player.most1.toLowerCase().includes(keyword) ||
    player.most2.toLowerCase().includes(keyword) ||
    player.most3.toLowerCase().includes(keyword);

  const matchLane =
    laneFilter === "전체" || player.mainLane === laneFilter;

  return matchSearch && matchLane;
});

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        👥 소환사 관리
      </h1>

      <input
        type="text"
        placeholder="닉네임, Riot ID, 티어, 라인, 모스트 챔피언 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border rounded-xl px-4 py-3 mb-4"
      />

      <div className="flex gap-2 flex-wrap mb-6">
        {filterLanes.map((lane) => (
          <button
            key={lane}
            onClick={() => setLaneFilter(lane)}
            className={`px-3 py-2 rounded-xl ${
              laneFilter === lane
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {lane}
          </button>
        ))}
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-6 border">
          등록된 소환사가 없습니다.
        </div>
      ) : (
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {filteredPlayers.map((player) => (
            <a
  key={player.id}
  href={`/summoners/${player.id}`}
  className="bg-white rounded-xl shadow p-4 border block hover:shadow-xl hover:scale-[1.02] transition"
  style={{
    width: "300px",
  }}
>
             <div className="flex justify-center mb-4">
              <img
                src={player.avatarUrl}
               alt="avatar"
               className="w-14 h-14 rounded-full border-2 border-indigo-400"
              />
        </div>

        <h2
  className="text-xl font-bold mb-2 text-center truncate"
  title={player.discordName}
>
  {player.discordName}
</h2>

              <p
  className="text-gray-500 mb-3 truncate"
  title={player.riotId}
>
  {player.riotId}
</p>

              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-3 ${getTierColor(
                  player.tier
                )}`}
              >
                {player.tier}
              </span>

              <p>🎯 주라인: {player.mainLane}</p>
              <p>🔄 부라인: {player.subLane}</p>
              <div className="flex justify-center gap-2 mt-3">
  {[player.most1, player.most2, player.most3].map(
    (champion, index) =>
      champion && (
        <img
  key={index}
  src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champion}.png`}
  alt={champion}
  style={{
    width: "32px",
    height: "32px",
    borderRadius: "9999px",
    border: "1px solid #d1d5db",
  }}
/>
      )
  )}
</div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}