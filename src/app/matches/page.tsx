"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function MatchesPage() {
  const [userId, setUserId] = useState("");
  const [applied, setApplied] = useState(false);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchApplicationStatus = async (id: string) => {
    const { count } = await supabase
      .from("match_applications")
      .select("*", { count: "exact", head: true });

    setCount(count || 0);

    const { data } = await supabase
      .from("match_applications")
      .select("user_id")
      .eq("user_id", id)
      .maybeSingle();

    setApplied(!!data);
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        setLoading(false);
        return;
      }

      setUserId(data.user.id);
      await fetchApplicationStatus(data.user.id);
      setLoading(false);
    };

    init();
  }, []);

  const applyMatch = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (applied) {
      alert("이미 참여 신청하셨습니다.");
      return;
    }

    const { error } = await supabase
      .from("match_applications")
      .insert({
        user_id: userId,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("참여 신청 완료!");
    await fetchApplicationStatus(userId);
  };

  const cancelApply = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!applied) {
      alert("아직 참여 신청하지 않았습니다.");
      return;
    }
    if (count >= 10) {
  alert("신청 인원이 마감되었습니다.");
  return;
}

    const ok = confirm("참여 신청을 취소할까요?");

    if (!ok) return;

    const { error } = await supabase
      .from("match_applications")
      .delete()
      .eq("user_id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("참여 신청 취소 완료!");
    await fetchApplicationStatus(userId);
  };

  if (loading) {
    return <main className="p-6">불러오는 중...</main>;
  }

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        🎮 내전 신청
      </h1>

      <div className="bg-white rounded-2xl shadow p-6 border max-w-xl">
        <h2 className="text-2xl font-bold mb-3">
          오늘의 내전
        </h2>

        <p className="text-gray-600 mb-6">
          참여 신청자는 공개되지 않습니다.
        </p>

        <div className="text-xl font-bold mb-6 space-y-1">
  <p>총인원: 10명</p>
  <p>현재 신청 인원: {count}명</p>
</div>

        <div className="flex items-center gap-3">
          <button
            onClick={applyMatch}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold"
          >
            참여하기
          </button>

          <button
            onClick={cancelApply}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm"
          >
            참여 취소
          </button>
        </div>

        {applied && (
          <p className="text-green-600 font-bold mt-4">
            참여 신청 완료 상태입니다.
          </p>
        )}
      </div>
    </main>
  );
}