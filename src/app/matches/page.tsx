"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const matches = [
  {
    id: 1,
    title: "오늘 1차 내전",
    status: "진행 예정",
  },
];

type Player = {
  name: string;
  mainLane: string;
  subLane: string;
};

type Profile = {
  discord_name: string;
  main_lane: string;
  sub_lane: string;
};

export default function MatchesPage() {
  const [joinList, setJoinList] = useState<Player[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("discord_name, main_lane, sub_lane");

      setProfiles(data || []);
    };

    fetchProfiles();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        🎮 내전 목록
      </h1>

      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="bg-white rounded-2xl shadow p-5 border"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">
                  {match.title}
                </h2>

                <p className="text-gray-600">
                  현재 참가자: {joinList.length}명
                </p>
              </div>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                {match.status}
              </span>
            </div>

            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <h3 className="font-bold mb-2">
                참가자 목록
              </h3>

              {joinList.length === 0 ? (
                <p className="text-gray-500 mb-3">
                  아직 참가자가 없습니다.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 mb-4">
                  {joinList.map((player) => (
                    <div
                      key={player.name}
                      className="bg-white border rounded-xl px-3 py-2 flex items-center gap-4"
                    >
                      <span>
                        👤 {player.name} / 🎯 {player.mainLane} / 🔄{" "}
                        {player.subLane}
                      </span>

                      <button
                        onClick={() =>
                          setJoinList(
                            joinList.filter(
                              (item) => item.name !== player.name
                            )
                          )
                        }
                        className="text-red-500 font-bold"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                <select
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="border rounded-xl px-3 py-2"
                >
                  <option value="">참가자 선택</option>

                  {profiles.map((profile) => (
                    <option
                      key={profile.discord_name}
                      value={profile.discord_name}
                    >
                      {profile.discord_name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    if (selectedPlayer === "") {
                      alert("참가자를 선택해주세요.");
                      return;
                    }

                    if (joinList.length >= 10) {
                      alert("참가 인원이 10명이라 모집이 마감되었습니다.");
                      return;
                    }

                    if (
                      joinList.some(
                        (player) => player.name === selectedPlayer
                      )
                    ) {
                      alert("이미 참가한 유저입니다.");
                      return;
                    }

                    const profile = profiles.find(
                      (item) => item.discord_name === selectedPlayer
                    );

                    if (!profile) {
                      alert("유저 정보를 찾을 수 없습니다.");
                      return;
                    }

                    setJoinList([
                      ...joinList,
                      {
                        name: profile.discord_name,
                        mainLane: profile.main_lane || "-",
                        subLane: profile.sub_lane || "-",
                      },
                    ]);

                    setSelectedPlayer("");
                  }}
                  className={`text-white px-4 py-2 rounded-xl ${
                    joinList.length >= 10
                      ? "bg-gray-400"
                      : "bg-blue-500"
                  }`}
                >
                  {joinList.length >= 10 ? "모집 마감" : "참가 신청"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}