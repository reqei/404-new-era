"use client";

import { supabase } from "../../lib/supabase";

export default function LoginPage() {
const loginWithDiscord = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo:"http://localhost:3000/auth/callback",
    
    },
  });
};

  return (
    <main className="p-6">
      <button
  onClick={loginWithDiscord}
  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold"
>
  Discord 로그인
</button>
    </main>
  );
}