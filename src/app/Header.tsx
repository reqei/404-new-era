"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) return;

      setAvatarUrl(
        data.user.user_metadata.avatar_url || ""
      );
    };

    getUser();
  }, []);
const loginWithDiscord = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
};
  return (
    <header className="bg-slate-950 text-white sticky top-0 z-50 shadow">
      <div className="max-w-[1000px] mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-black">
           404 : ℕ𝕖𝕨 𝔼𝕣𝕒 ｡+.｡☆ﾟ
        </h1>

        <nav className="flex items-center gap-2">
          <Link href="/" className="bg-slate-800 px-4 py-2 rounded-xl">
            🏠 홈
          </Link>

          <Link href="/summoners" className="bg-slate-800 px-4 py-2 rounded-xl">
            👥 소환사
          </Link>

          <Link href="/matches" className="bg-slate-800 px-4 py-2 rounded-xl">
            🎮 내전
          </Link>

          <Link href="/rankings" className="bg-slate-800 px-4 py-2 rounded-xl">
            🏆 랭킹
          </Link>

          {avatarUrl ? (
            <Link href="/mypage">
              <img
                src={avatarUrl}
                alt="profile"
                style={{
  width: "40px",
  height: "40px",
  borderRadius: "9999px",
}}
              />
            </Link>
          ) : (
            <button
  onClick={loginWithDiscord}
  className="bg-indigo-500 px-4 py-2 rounded-xl font-bold"
>
  Discord 로그인
</button>
          )}
        </nav>
      </div>
    </header>
  );
}