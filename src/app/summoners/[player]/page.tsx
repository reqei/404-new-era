"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Profile = {
  user_id: string;
  discord_name: string;
  avatar_url: string;
  riot_id: string;
  tier: string;
  main_lane: string;
  sub_lane: string;
  most1: string;
  most2: string;
  most3: string;
};

export default function PlayerPage() {
  const params = useParams();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", params.player)
        .maybeSingle();

      setProfile(data);
    };

    fetchProfile();
  }, [params]);

  if (!profile) {
    return (
      <main className="p-6">
        불러오는 중...
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 border max-w-xl mx-auto">

        <div className="flex justify-center mb-4">
          <img
            src={profile.avatar_url}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-400 shadow-lg"
          />
        </div>

        <h1 className="text-4xl font-bold text-center mb-2">
          {profile.discord_name}
        </h1>

        <p className="text-center text-gray-500 mb-6">
          {profile.riot_id}
        </p>
        <div className="flex justify-center mb-6">
  <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold">
    {profile.tier}
  </span>
</div>

        <div className="grid gap-3">
  <div className="bg-green-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">
      주라인
    </p>

    <p className="font-bold text-xl">
      🎯 {profile.main_lane}
    </p>
  </div>

  <div className="bg-cyan-50 rounded-xl p-4">
    <p className="text-sm text-gray-500">
      부라인
    </p>

    <p className="font-bold text-xl">
      🔄 {profile.sub_lane}
    </p>
  </div>

</div>
<div className="mt-6 bg-slate-100 rounded-2xl p-5 border">
  <h2 className="text-2xl font-bold mb-4 text-center">
    🏆 모스트 챔피언
  </h2>

  <div className="flex justify-center gap-4">
    {[profile.most1, profile.most2, profile.most3].map(
      (champion, index) =>
        champion && (
          <img
            key={index}
            src={`https://ddragon.leagueoflegends.com/cdn/15.5.1/img/champion/${champion}.png`}
            alt={champion}
            className="w-7 h-7 rounded-full border-2 border-indigo-400"
          />
        )
    )}
  </div>
</div>

      </div>
    </main>
  );
}