"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type MatchPost = {
  title: string;
  description: string;
  max_players: number;
  created_at?: string;
};

export default function MatchesPage() {
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState<MatchPost[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(10);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("match_posts")
      .select("*")
      .order("created_at", { ascending: false });

    setPosts(data || []);
  };

  const fetchApplications = async () => {
    const { data } = await supabase
      .from("match_applications")
      .select("*");

    setApplications(data || []);
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        setUserId(data.user.id);
      }

      fetchPosts();
      fetchApplications();
    };

    init();
  }, []);

  const createPost = async () => {
    if (!title.trim()) {
      alert("내전 제목을 입력해주세요.");
      return;
    }

    const { error } = await supabase
      .from("match_posts")
      .insert({
        title,
        description,
        max_players: maxPlayers,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("내전 포스트 생성 완료!");
    setTitle("");
    setDescription("");
    setMaxPlayers(10);
    setShowCreate(false);
    fetchPosts();
  };

  const applyMatch = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const alreadyApplied = applications.some(
      (app) => app.user_id === userId
    );

    if (alreadyApplied) {
      alert("이미 참여 신청하셨습니다.");
      return;
    }

    if (applications.length >= maxPlayers) {
      alert("신청 인원이 마감되었습니다.");
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
    fetchApplications();
  };

  const cancelApply = async () => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const { error } = await supabase
      .from("match_applications")
      .delete()
      .eq("user_id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    alert("참여 신청 취소 완료!");
    fetchApplications();
  };

  return (
    <main className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        🎮 내전
      </h1>

      <button
        onClick={() => setShowCreate(!showCreate)}
        className="bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold mb-6"
      >
        + 내전 포스트 생성하기
      </button>

      {showCreate && (
        <div className="bg-white rounded-2xl shadow p-5 border mb-6">
          <h2 className="text-2xl font-bold mb-4">
            내전 포스트 생성
          </h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="내전 제목"
            className="border rounded-xl px-4 py-3 w-full mb-3"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="시간, 룰, 안내사항 등을 적어주세요."
            className="border rounded-xl px-4 py-3 w-full mb-3"
          />

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMaxPlayers(10)}
              className={`px-4 py-2 rounded-xl font-bold ${
                maxPlayers === 10
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              10인
            </button>

            <button
              onClick={() => setMaxPlayers(20)}
              className={`px-4 py-2 rounded-xl font-bold ${
                maxPlayers === 20
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              20인
            </button>
          </div>

          <button
            onClick={createPost}
            className="bg-green-500 text-white px-5 py-3 rounded-xl font-bold"
          >
            생성하기
          </button>
        </div>
      )}

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-6 border">
            생성된 내전 포스트가 없습니다.
          </div>
        ) : (
          posts.map((post, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow p-6 border"
            >
              <h2 className="text-2xl font-bold mb-2">
                {post.title}
              </h2>

              <p className="text-gray-600 whitespace-pre-line mb-4">
                {post.description || "설명 없음"}
              </p>

              <div className="text-lg font-bold mb-4">
                <p>총인원: {post.max_players}명</p>
                <p>
                  현재 신청 인원: {applications.length}명
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-4">
                신청자는 공개되지 않습니다.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={applyMatch}
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm"
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
            </div>
          ))
        )}
      </div>
    </main>
  );
}