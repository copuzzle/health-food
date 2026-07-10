"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AsyncSubmitButton } from "@/components/async-submit-button";

export function RatingForm({ restaurantId, disabled }: { restaurantId: string; disabled: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setStatus(null);
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fodmapScore: formData.get("fodmapScore"),
          symptomSafetyScore: formData.get("symptomSafetyScore"),
          comment: formData.get("comment") || null,
        }),
      });

      if (response.status === 409) {
        setStatus("你已经评价过这家餐馆");
        return;
      }
      setStatus(response.ok ? "评分已提交" : "提交失败");
      if (response.ok) router.refresh();
    } catch {
      setStatus("提交失败，请检查网络后重试");
    }
  }

  return (
    <form action={submit} className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
      <h2 className="text-lg font-black">提交评分</h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <label className="text-sm font-bold">
          低FODMAP友好
          <select name="fodmapScore" disabled={disabled} className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80">
            {[5, 4, 3, 2, 1].map((score) => (
              <option key={score} value={score}>{score} 分</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-bold">
          症状安全感
          <select name="symptomSafetyScore" disabled={disabled} className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80">
            {[5, 4, 3, 2, 1].map((score) => (
              <option key={score} value={score}>{score} 分</option>
            ))}
          </select>
        </label>
      </div>
      <textarea name="comment" disabled={disabled} maxLength={400} placeholder="说明可沟通项、踩雷点或安全吃法" className="mt-4 w-full rounded-2xl border-kelp/15 bg-white/80" />
      <AsyncSubmitButton
        disabled={disabled}
        idleLabel={disabled ? "登录后评分" : "提交评分"}
        pendingLabel="提交中..."
        className="mt-4 w-full rounded-2xl bg-kelp px-4 py-3 font-black text-oat disabled:opacity-45"
      />
      {status && <p className="mt-3 text-sm text-kelp/70">{status}</p>}
    </form>
  );
}
