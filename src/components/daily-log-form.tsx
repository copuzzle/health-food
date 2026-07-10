"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toDateInputValue } from "@/lib/dates";
import { parseCommaList } from "@/lib/validation";

export function DailyLogForm({ disabled, symptomTypes }: { disabled: boolean; symptomTypes: string[] }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, number>>({});
  const defaultDate = toDateInputValue(new Date());

  async function submit(formData: FormData) {
    const symptoms = Object.entries(selectedSymptoms).map(([symptomType, severity]) => ({
      symptomType,
      severity,
    }));

    setStatus("保存中...");
    const response = await fetch("/api/daily-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: formData.get("date"),
        breakfast: parseCommaList(formData.get("breakfast")),
        lunch: parseCommaList(formData.get("lunch")),
        dinner: parseCommaList(formData.get("dinner")),
        notes: formData.get("notes") || null,
        symptoms,
      }),
    });

    if (response.ok) {
      setSelectedSymptoms({});
      setStatus("记录已保存");
      router.refresh();
    } else {
      setStatus("保存失败，请确认至少填写一餐");
    }
  }

  return (
    <form action={submit} className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
      <h2 className="text-lg font-black">登记</h2>
      <label className="mt-4 block text-sm font-bold">
        日期
        <input
          name="date"
          type="date"
          required
          disabled={disabled}
          defaultValue={defaultDate}
          className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80"
        />
      </label>

      <div className="mt-4 grid gap-3">
        <MealInput name="breakfast" label="早餐" disabled={disabled} />
        <MealInput name="lunch" label="午餐" disabled={disabled} />
        <MealInput name="dinner" label="晚餐" disabled={disabled} />
      </div>

      <div className="mt-4 rounded-3xl bg-oat p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-black">当天症状</p>
          <button
            type="button"
            disabled={disabled || Object.keys(selectedSymptoms).length === 0}
            onClick={() => setSelectedSymptoms({})}
            className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-kelp disabled:opacity-40"
          >
            清空
          </button>
        </div>
        <div className="mt-3 space-y-3">
          {symptomTypes.length > 0 ? (
            symptomTypes.map((type) => (
              <div key={type} className="rounded-2xl bg-white/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black">{type}</span>
                  <span className="text-xs font-bold text-kelp/60">
                    {selectedSymptoms[type] ? `${selectedSymptoms[type]} 级` : "未选择"}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        setSelectedSymptoms((current) => ({
                          ...current,
                          [type]: level,
                        }))
                      }
                      className={`rounded-xl py-2 text-sm font-black ${
                        selectedSymptoms[type] === level ? "bg-clay text-white" : "bg-oat text-kelp"
                      } disabled:opacity-40`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-kelp/65">先在“我的”页面设置最多 3 个常用症状。</p>
          )}
        </div>
      </div>

      <textarea
        name="notes"
        disabled={disabled}
        maxLength={600}
        placeholder="备注，可不填"
        className="mt-4 w-full rounded-2xl border-kelp/15 bg-white/80"
      />

      <button disabled={disabled} className="mt-5 w-full rounded-2xl bg-kelp px-4 py-3 font-black text-oat disabled:opacity-45">
        {disabled ? "登录后登记" : "保存"}
      </button>
      {status && <p className="mt-3 text-sm text-kelp/70">{status}</p>}
    </form>
  );
}

function MealInput({ name, label, disabled }: { name: string; label: string; disabled: boolean }) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        name={name}
        disabled={disabled}
        placeholder="用逗号分隔食物"
        className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80"
      />
    </label>
  );
}
