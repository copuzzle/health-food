"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AsyncSubmitButton } from "@/components/async-submit-button";

export function SymptomPreferencesForm({
  disabled,
  initialSymptoms,
}: {
  disabled: boolean;
  initialSymptoms: string[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);

  async function submit(formData: FormData) {
    setStatus(null);
    const symptoms = [formData.get("symptom1"), formData.get("symptom2"), formData.get("symptom3")]
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

    try {
      const response = await fetch("/api/symptom-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });

      setStatus(response.ok ? "症状设置已保存" : "保存失败");
      if (response.ok) router.refresh();
    } catch {
      setStatus("保存失败，请检查网络后重试");
    }
  }

  return (
    <form action={submit} className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
      <h2 className="text-lg font-black">常用症状</h2>
      <p className="mt-2 text-sm leading-6 text-kelp/70">最多设置 3 个，登记时用 0-5 滑块记录，步进 0.5。</p>
      <div className="mt-4 grid gap-3">
        {[0, 1, 2].map((index) => (
          <input
            key={index}
            name={`symptom${index + 1}`}
            disabled={disabled}
            defaultValue={initialSymptoms[index] ?? ""}
            maxLength={20}
            placeholder={["例如：腹泻", "例如：腹痛", "例如：胀气"][index]}
            className="rounded-2xl border-kelp/15 bg-white/80"
          />
        ))}
      </div>
      <AsyncSubmitButton
        disabled={disabled}
        idleLabel={disabled ? "登录后设置" : "保存症状"}
        pendingLabel="保存中..."
        className="mt-5 w-full rounded-2xl bg-kelp px-4 py-3 font-black text-oat disabled:opacity-45"
      />
      {status && <p className="mt-3 text-sm text-kelp/70">{status}</p>}
    </form>
  );
}
