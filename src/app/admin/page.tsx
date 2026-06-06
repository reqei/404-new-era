"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Profile = {
  user_id: string;
  discord_name: string;
  riot_id: string;
  tier: string;
};

export default function AdminPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from("profiles")
        .select(
          "user_id, discord_name, riot_id, tier"
        );

      setProfiles(data || []);
    };

    fetchProfiles();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        ⚙️ 관리자 페이지
      </h1>

      <div className="space-y-3">
        {profiles.map((profile) => (
          <div
            key={profile.user_id}
            className="bg-white border rounded-xl p-4"
          >
            <p>
              <b>닉네임:</b>{" "}
              {profile.discord_name}
            </p>

            <p>
              <b>Riot ID:</b>{" "}
              {profile.riot_id || "-"}
            </p>

            <p>
              <b>티어:</b>{" "}
              {profile.tier || "-"}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}