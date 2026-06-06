"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const finishLogin = async () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        alert("토큰을 찾지 못했습니다.");
        router.push("/login");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        alert("세션 저장 실패: " + error.message);
        router.push("/login");
        return;
      }

      router.push("/mypage");
    };

    finishLogin();
  }, [router]);

  return (
    <main className="p-6 text-black">
      로그인 처리 중...
    </main>
  );
}