"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Profile = {
  riot_id: string;
  tier: string;
  main_lane: string;
  sub_lane: string;
  most1: string;
  most2: string;
  most3: string;
};

export default function MyPage() {
  const [message, setMessage] = useState(
    "로그인 정보를 불러오는 중..."
  );

  const [avatarUrl, setAvatarUrl] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        setMessage("로그인 정보를 가져오지 못했습니다.");
        return;
      }

      setAvatarUrl(data.user.user_metadata.avatar_url || "");

      setMessage(
        `안녕하세요, ${
          data.user.user_metadata.global_name ||
          data.user.user_metadata.name ||
          "Discord 유저"
        }님!`
      );

      const { data: profileData } = await supabase
        .from("profiles")
        .select("riot_id, tier, main_lane, sub_lane, most1, most2, most3")
        .eq("user_id", data.user.id)
        .maybeSingle();

      setProfile(profileData);
    };

    getUser();
  }, []);

  return (
    <main className="p-6 text-black">
      <h1 className="text-4xl font-bold text-indigo-600 mb-6">
        마이페이지
      </h1>

      <div className="bg-white rounded-3xl shadow-xl p-8 border max-w-xl mx-auto">
        <div className="flex justify-center mb-4">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="profile"
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "9999px",
                border: "4px solid #818cf8",
              }}
            />
          )}
        </div>

        <p className="text-2xl font-bold text-center mb-6">
          {message}
        </p>

        {!profile ? (
          <div className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 text-center">
            아직 관리자 등록이 완료되지 않았습니다.
            <br />
            관리자에게 Riot ID / 티어 / 라인 / 모스트 챔피언 등록을 요청해주세요.
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">Riot ID</p>
                <p className="font-bold text-xl">
                  {profile.riot_id || "-"}
                </p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">티어</p>
                <p className="font-bold text-xl">
                  🏆 {profile.tier || "-"}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">주라인</p>
                <p className="font-bold text-xl">
                  🎯 {profile.main_lane || "-"}
                </p>
              </div>

              <div className="bg-cyan-50 rounded-xl p-4">
                <p className="text-sm text-gray-500">부라인</p>
                <p className="font-bold text-xl">
                  🔄 {profile.sub_lane || "-"}
                </p>
              </div>
            </div>

            <div className="mt-6 bg-slate-100 rounded-2xl p-5 border">
              <h2 className="text-2xl font-bold mb-4 text-center">
                🏆 모스트 챔피언
              </h2>

              <div className="flex justify-center gap-3">
                {[profile.most1, profile.most2, profile.most3].map(
                  (champion, index) =>
                    champion && (
                      <img
                        key={index}
                        src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champion}.png`}
                        alt={champion}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "9999px",
                          border: "1px solid #d1d5db",
                        }}
                      />
                    )
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}