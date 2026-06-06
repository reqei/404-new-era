"use client";

import { useState } from "react";

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

export default function MatchesPage() {
  const [joinList, setJoinList] = useState<Player[]>([
    {
      name: "정글왕",
      mainLane: "정글",
      subLane: "서포터",
    },
    {
      name: "미드장인",
      mainLane: "미드",
      subLane: "원딜",
    },
    {
      name: "탑신병자",
      mainLane: "탑",
      subLane: "정글",
    },
    {
      name: "원딜신",
      mainLane: "원딜",
      subLane: "미드",
    },
  ]);

  const [blueTeam, setBlueTeam] = useState<Player[]>([]);
  const [redTeam, setRedTeam] = useState<Player[]>([]);

  const [newPlayer, setNewPlayer] = useState("");
  const [mainLane, setMainLane] = useState("탑");
  const [subLane, setSubLane] = useState("정글");

  const lanes = ["탑", "정글", "미드", "원딜", "서포터"];

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

              <div className="flex flex-wrap gap-2">
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

              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-2">
                <input
                  type="text"
                  placeholder="참가자 닉네임 입력"
                  value={newPlayer}
                  onChange={(e) =>
                    setNewPlayer(e.target.value)
                  }
                  className="border rounded-xl px-3 py-2"
                />

                <select
                  value={mainLane}
                  onChange={(e) =>
                    setMainLane(e.target.value)
                  }
                  className="border rounded-xl px-3 py-2"
                >
                  {lanes.map((lane) => (
                    <option key={lane} value={lane}>
                      주라인: {lane}
                    </option>
                  ))}
                </select>

                <select
                  value={subLane}
                  onChange={(e) =>
                    setSubLane(e.target.value)
                  }
                  className="border rounded-xl px-3 py-2"
                >
                  {lanes.map((lane) => (
                    <option key={lane} value={lane}>
                      부라인: {lane}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    const trimmedName = newPlayer.trim();

                    if (trimmedName === "") return;

                    if (joinList.length >= 10) {
                      alert(
                        "참가 인원이 10명이라 모집이 마감되었습니다."
                      );
                      return;
                    }

                    if (
                      joinList.some(
                        (player) => player.name === trimmedName
                      )
                    ) {
                      alert("이미 참가한 유저입니다.");
                      return;
                    }

                    setJoinList([
                      ...joinList,
                      {
                        name: trimmedName,
                        mainLane,
                        subLane,
                      },
                    ]);

                    setNewPlayer("");
                  }}
                  className={`text-white px-4 py-2 rounded-xl ${
                    joinList.length >= 10
                      ? "bg-gray-400"
                      : "bg-blue-500"
                  }`}
                >
                  {joinList.length >= 10
                    ? "모집 마감"
                    : "참가 신청"}
                </button>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    if (joinList.length < 2) {
                      alert(
                        "최소 2명 이상 참가해야 팀을 나눌 수 있습니다."
                      );
                      return;
                    }

                    const shuffled = [...joinList].sort(
                      () => Math.random() - 0.5
                    );

                    const half = Math.ceil(
                      shuffled.length / 2
                    );

                    setBlueTeam(shuffled.slice(0, half));
                    setRedTeam(shuffled.slice(half));
                  }}
                  className="bg-purple-500 text-white px-4 py-2 rounded-xl"
                >
                  팀 자동 배정
                </button>

                <button
                  onClick={() => {
                    setBlueTeam([]);
                    setRedTeam([]);
                  }}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  팀 초기화
                </button>
              </div>
            </div>

            {blueTeam.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 p-4 rounded-xl border">
                  <h3 className="font-bold text-blue-700 mb-2">
                    🔵 블루팀
                  </h3>

                  {blueTeam.map((player) => (
  <div
    key={player.name}
    className="bg-white rounded-lg p-3 mb-2 border"
  >
    <p className="font-bold">
      👤 {player.name}
    </p>
    <p className="text-sm text-gray-600">
      🎯 주라인: {player.mainLane}
    </p>
    <p className="text-sm text-gray-600">
      🔄 부라인: {player.subLane}
    </p>
  </div>
))}
                </div>

                <div className="bg-red-50 p-4 rounded-xl border">
                  <h3 className="font-bold text-red-700 mb-2">
                    🔴 레드팀
                  </h3>

                 {redTeam.map((player) => (
  <div
    key={player.name}
    className="bg-white rounded-lg p-3 mb-2 border"
  >
    <p className="font-bold">
      👤 {player.name}
    </p>

    <p className="text-sm text-gray-600">
      🎯 주라인: {player.mainLane}
    </p>

    <p className="text-sm text-gray-600">
      🔄 부라인: {player.subLane}
    </p>
  </div>
))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}