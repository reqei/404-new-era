"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
const ADMIN_USER_ID = "83805e49-e935-4413-93f5-bad10d4bde4c";

type Profile = {
  user_id: string;
  discord_name: string;
  riot_id: string;
  tier: string;
  main_lane: string;
  sub_lane: string;
  most1: string;
  most2: string;
  most3: string;
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const fetchProfiles = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*");

    setProfiles(data || []);
  };

  useEffect(() => {
  const checkAdmin = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      setChecking(false);
      return;
    }

    if (data.user.id === ADMIN_USER_ID) {
      setIsAdmin(true);
      fetchProfiles();
    }

    setChecking(false);
  };

  checkAdmin();
}, []);

  const updateProfile = async (profile: Profile) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        riot_id: profile.riot_id,
        tier: profile.tier,
        main_lane: profile.main_lane,
        sub_lane: profile.sub_lane,
        most1: profile.most1,
        most2: profile.most2,
        most3: profile.most3,
      })
      .eq("user_id", profile.user_id);

    if (error) {
      alert("저장 실패");
      return;
    }

    alert("저장 완료!");
    fetchProfiles();
  };

  const updateLocal = (
    userId: string,
    key: keyof Profile,
    value: string
  ) => {
    setProfiles((prev) =>
      prev.map((profile) =>
        profile.user_id === userId
          ? { ...profile, [key]: value }
          : profile
      )
    );
  };
if (checking) {
  return <main className="p-6">관리자 확인 중...</main>;
}

if (!isAdmin) {
  return <main className="p-6">접근 권한이 없습니다.</main>;
}
  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        ⚙️ 관리자 페이지
      </h1>

      <div className="space-y-4">
        {profiles.map((profile) => (
          <div
            key={profile.user_id}
            className="bg-white border rounded-2xl p-5 shadow"
          >
            <h2 className="text-2xl font-bold mb-4">
              {profile.discord_name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                value={profile.riot_id || ""}
                onChange={(e) =>
                  updateLocal(profile.user_id, "riot_id", e.target.value)
                }
                placeholder="Riot ID"
                className="border rounded-xl px-3 py-2"
              />

              <input
                value={profile.tier || ""}
                onChange={(e) =>
                  updateLocal(profile.user_id, "tier", e.target.value)
                }
                placeholder="티어"
                className="border rounded-xl px-3 py-2"
              />

              <input
                value={profile.main_lane || ""}
                onChange={(e) =>
                  updateLocal(profile.user_id, "main_lane", e.target.value)
                }
                placeholder="주라인"
                className="border rounded-xl px-3 py-2"
              />

              <input
                value={profile.sub_lane || ""}
                onChange={(e) =>
                  updateLocal(profile.user_id, "sub_lane", e.target.value)
                }
                placeholder="부라인"
                className="border rounded-xl px-3 py-2"
              />

              <input
                value={profile.most1 || ""}
                onChange={(e) =>
                  updateLocal(profile.user_id, "most1", e.target.value)
                }
                placeholder="모스트1 영어명"
                className="border rounded-xl px-3 py-2"
              />

              <input
                value={profile.most2 || ""}
                onChange={(e) =>
                  updateLocal(profile.user_id, "most2", e.target.value)
                }
                placeholder="모스트2 영어명"
                className="border rounded-xl px-3 py-2"
              />

              <input
                value={profile.most3 || ""}
                onChange={(e) =>
                  updateLocal(profile.user_id, "most3", e.target.value)
                }
                placeholder="모스트3 영어명"
                className="border rounded-xl px-3 py-2"
              />
            </div>

            <button
              onClick={() => updateProfile(profile)}
              className="mt-4 bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold"
            >
              저장
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}