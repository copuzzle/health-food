"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FOODMAP_TAGS } from "@/lib/constants";
import { AsyncSubmitButton } from "@/components/async-submit-button";

export function RestaurantCreateForm({ disabled }: { disabled: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  async function submit(formData: FormData) {
    const tags = FOODMAP_TAGS.filter((tag) => formData.getAll("tags").includes(tag));
    setStatus(null);
    try {
      const response = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          address: formData.get("address"),
          city: formData.get("city"),
          lat: formData.get("lat"),
          lng: formData.get("lng"),
          tags,
        }),
      });

      setStatus(response.ok ? "餐馆已创建" : "提交失败：请确认已登录且信息完整");
      if (response.ok) router.refresh();
    } catch {
      setStatus("提交失败，请检查网络后重试");
    }
  }

  return (
    <form action={submit} className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-soft">
      <h2 className="text-lg font-black">新增餐馆</h2>
      <p className="mt-1 text-sm text-kelp/65">先用手动坐标创建，后续可接入地址搜索和逆地理编码。</p>
      <div className="mt-4 grid gap-3">
        <input name="name" required disabled={disabled} maxLength={80} placeholder="餐馆名称" className="rounded-2xl border-kelp/15 bg-white/80" />
        <input name="address" required disabled={disabled} maxLength={160} placeholder="地址" className="rounded-2xl border-kelp/15 bg-white/80" />
        <div className="grid grid-cols-2 gap-3">
          <input name="city" required disabled={disabled} maxLength={40} placeholder="城市" className="rounded-2xl border-kelp/15 bg-white/80" />
          <input name="lat" required disabled={disabled} type="number" step="0.000001" placeholder="纬度" className="rounded-2xl border-kelp/15 bg-white/80" />
        </div>
        <input name="lng" required disabled={disabled} type="number" step="0.000001" placeholder="经度" className="rounded-2xl border-kelp/15 bg-white/80" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {FOODMAP_TAGS.map((tag) => (
          <label key={tag} className="rounded-full bg-oat px-3 py-2 text-xs font-bold text-kelp">
            <input type="checkbox" name="tags" value={tag} disabled={disabled} className="mr-1 rounded border-kelp/20" />
            {tag}
          </label>
        ))}
      </div>
      <AsyncSubmitButton
        disabled={disabled}
        idleLabel={disabled ? "登录后创建" : "提交餐馆"}
        pendingLabel="提交中..."
        className="mt-5 w-full rounded-2xl bg-kelp px-4 py-3 font-black text-oat disabled:opacity-45"
      />
      {status && <p className="mt-3 text-sm text-kelp/70">{status}</p>}
    </form>
  );
}
