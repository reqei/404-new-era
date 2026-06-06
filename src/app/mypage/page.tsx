"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MyPage() {
  const [message, setMessage] = useState(
    "로그인 정보를 불러오는 중..."
  );

  const [userId, setUserId] = useState("");
  const [riotId, setRiotId] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [tier, setTier] = useState("");
  const [mainLane, setMainLane] = useState("");
  const [subLane, setSubLane] = useState("");
  const [most1, setMost1] = useState("");
  const [most2, setMost2] = useState("");
  const [most3, setMost3] = useState("");
  const tiers = [
  "아이언 4",
  "아이언 3",
  "아이언 2",
  "아이언 1",
  "브론즈 4",
  "브론즈 3",
  "브론즈 2",
  "브론즈 1",
  "실버 4",
  "실버 3",
  "실버 2",
  "실버 1",
  "골드 4",
  "골드 3",
  "골드 2",
  "골드 1",
  "플래티넘 4",
  "플래티넘 3",
  "플래티넘 2",
  "플래티넘 1",
  "에메랄드 4",
  "에메랄드 3",
  "에메랄드 2",
  "에메랄드 1",
  "다이아 4",
  "다이아 3",
  "다이아 2",
  "다이아 1",
  "마스터",
  "그랜드마스터",
  "챌린저",
];

const lanes = ["탑", "정글", "미드", "원딜", "서포터"];

 useEffect(() => {
  const getUser = async () => {
    const { data, error } =
      await supabase.auth.getUser();

    if (error || !data.user) {
      setMessage(
        "로그인 정보를 가져오지 못했습니다."
      );
      return;
    }

    setUserId(data.user.id);
    setAvatarUrl(
  data.user.user_metadata.avatar_url || ""
);

    setMessage(
      `안녕하세요, ${
        data.user.user_metadata.global_name ||
        data.user.user_metadata.name ||
        "Discord 유저"
      }님!`
    );
    const discordName =
  data.user.user_metadata.global_name ||
  data.user.user_metadata.name ||
  "Discord 유저";

    const { data: profile } =
      await supabase
        .from("profiles")
        .select("riot_id, tier, main_lane, sub_lane, most1, most2, most3")
        .eq("user_id", data.user.id)
        .maybeSingle();

    if (profile) {
  setRiotId(profile.riot_id || "");
  setTier(profile.tier || "");
  setMainLane(profile.main_lane || "");
  setSubLane(profile.sub_lane || "");

  setMost1(profile.most1 || "");
  setMost2(profile.most2 || "");
  setMost3(profile.most3 || "");
}
  };

  getUser();
}, []);

  const saveRiotId = async () => {
    if (!riotId.trim()) {
      alert("Riot ID를 입력해주세요.");
      return;
    }

    const { error } = await supabase
  .from("profiles")
 .upsert({
  user_id: userId,
  discord_name: message
    .replace("안녕하세요, ", "")
    .replace("님!", ""),
  avatar_url: avatarUrl,

  riot_id: riotId,

  tier: tier,
  main_lane: mainLane,
  sub_lane: subLane,

  most1: most1,
  most2: most2,
  most3: most3,
});

    if (error) {
      alert("저장 실패");
      return;
    }

    alert("Riot ID 저장 완료!");
  };

  return (
    <main className="p-6 text-black">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">
        마이페이지
      </h1>

      <div className="bg-white rounded-2xl shadow p-5 border">
        <p className="text-xl font-bold mb-6">
          {message}
        </p>

        <h2 className="text-xl font-bold mb-2">
          🎮 Riot ID 연동
        </h2>

        <input
          type="text"
          placeholder="Hide on bush#KR1"
          value={riotId}
          onChange={(e) =>
            setRiotId(e.target.value)
          }
          className="border rounded-xl px-4 py-3 w-full mb-4"
                />
<select
  value={tier}
  onChange={(e) => setTier(e.target.value)}
  className="border rounded-xl px-4 py-3 w-full mb-4"
>
  <option value="">티어 선택</option>
  {tiers.map((item) => (
    <option key={item} value={item}>
      {item}
    </option>
  ))}
</select>

<select
  value={mainLane}
  onChange={(e) => setMainLane(e.target.value)}
  className="border rounded-xl px-4 py-3 w-full mb-4"
>
  <option value="">주라인 선택</option>

  {lanes.map((lane) => (
    <option
      key={lane}
      value={lane}
    >
      {lane}
    </option>
  ))}
</select>
<select
  value={subLane}
  onChange={(e) => setSubLane(e.target.value)}
  className="border rounded-xl px-4 py-3 w-full mb-4"
>
  <option value="">부라인 선택</option>

  {lanes.map((lane) => (
    <option
      key={lane}
      value={lane}
    >
      {lane}
    </option>
  ))}
</select>
<input
  type="text"
  placeholder="🥇 모스트 1 챔피언"
  value={most1}
  onChange={(e) => setMost1(e.target.value)}
  className="border rounded-xl px-4 py-3 w-full mb-4"
/>

<input
  type="text"
  placeholder="🥈 모스트 2 챔피언"
  value={most2}
  onChange={(e) => setMost2(e.target.value)}
  className="border rounded-xl px-4 py-3 w-full mb-4"
/>

<input
  type="text"
  placeholder="🥉 모스트 3 챔피언"
  value={most3}
  onChange={(e) => setMost3(e.target.value)}
  className="border rounded-xl px-4 py-3 w-full mb-4"
/>
       <button
  type="button"
  onClick={saveRiotId}
  style={{
    backgroundColor: "#6366f1",
    color: "white",
  }}
  className="
    mt-3
    px-6
    py-3
    rounded-xl
    font-bold
    shadow-md
    hover:scale-105
    transition
  "
>
  💾 Riot ID 저장
</button>
<div className="mt-8 bg-slate-100 rounded-2xl p-5 border">
  <h3 className="text-2xl font-bold mb-4">
    🎮 내 롤 정보
  </h3>

  <p className="mb-2">
    <strong>Riot ID:</strong> {riotId || "-"}
  </p>

  <p className="mb-2">
    <strong>티어:</strong> {tier || "-"}
  </p>

  <p className="mb-2">
    <strong>주라인:</strong> {mainLane || "-"}
  </p>

  <p>
    <strong>부라인:</strong> {subLane || "-"}
  </p>
</div>
      </div>
    </main>
  );
}