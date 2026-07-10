"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AsyncSubmitButton } from "@/components/async-submit-button";
import { toDateInputValue } from "@/lib/dates";
import { parseCommaList } from "@/lib/validation";

export type EditableDailyLog = {
  id: string;
  date: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  notes: string | null;
  symptoms: Array<{ symptomType: string; severity: number }>;
};

export function DailyLogForm({
  disabled,
  symptomTypes,
  editingLog,
}: {
  disabled: boolean;
  symptomTypes: string[];
  editingLog?: EditableDailyLog | null;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, number>>(() =>
    Object.fromEntries((editingLog?.symptoms ?? []).map((symptom) => [symptom.symptomType, symptom.severity])),
  );
  const defaultDate = editingLog?.date ?? toDateInputValue(new Date());
  const formKey = editingLog?.id ?? "new-log";

  async function submit(formData: FormData) {
    const symptoms = Object.entries(selectedSymptoms).map(([symptomType, severity]) => ({
      symptomType,
      severity,
    }));

    setStatus(null);
    try {
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
        router.push("/logs");
        router.refresh();
      } else {
        setStatus("保存失败，请确认至少填写一餐");
      }
    } catch {
      setStatus("保存失败，请检查网络后重试");
    }
  }

  return (
    <form key={formKey} action={submit} className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">{editingLog ? "修改记录" : "登记"}</h2>
        {editingLog && (
          <button
            type="button"
            onClick={() => router.push("/logs")}
            className="rounded-full bg-oat px-3 py-1 text-xs font-bold text-kelp"
          >
            取消编辑
          </button>
        )}
      </div>
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
        <MealInput name="breakfast" label="早餐" disabled={disabled} defaultFoods={editingLog?.breakfast ?? []} />
        <MealInput name="lunch" label="午餐" disabled={disabled} defaultFoods={editingLog?.lunch ?? []} />
        <MealInput name="dinner" label="晚餐" disabled={disabled} defaultFoods={editingLog?.dinner ?? []} />
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
                    {selectedSymptoms[type] !== undefined ? `${formatSeverity(selectedSymptoms[type])} / 5` : "未选择"}
                  </span>
                </div>
                <div className="mt-3">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    disabled={disabled}
                    value={selectedSymptoms[type] ?? 0}
                    onChange={(event) =>
                      setSelectedSymptoms((current) => ({
                        ...current,
                        [type]: Number(event.target.value),
                      }))
                    }
                    className="h-2 w-full cursor-pointer accent-clay disabled:cursor-not-allowed disabled:opacity-40"
                  />
                  <div className="mt-2 flex justify-between text-[11px] font-bold text-kelp/50">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
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
        defaultValue={editingLog?.notes ?? ""}
        placeholder="备注，可不填"
        className="mt-4 w-full rounded-2xl border-kelp/15 bg-white/80"
      />

      <AsyncSubmitButton
        disabled={disabled}
        idleLabel={disabled ? "登录后登记" : "保存"}
        pendingLabel="保存中..."
        className="mt-5 w-full rounded-2xl bg-kelp px-4 py-3 font-black text-oat disabled:opacity-45"
      />
      {status && <p className="mt-3 text-sm text-kelp/70">{status}</p>}
    </form>
  );
}

function formatSeverity(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function MealInput({
  name,
  label,
  disabled,
  defaultFoods,
}: {
  name: string;
  label: string;
  disabled: boolean;
  defaultFoods: string[];
}) {
  return (
    <label className="block text-sm font-bold">
      {label}
      <input
        name={name}
        disabled={disabled}
        defaultValue={defaultFoods.join("，")}
        placeholder="用逗号分隔食物"
        className="mt-2 w-full rounded-2xl border-kelp/15 bg-white/80"
      />
    </label>
  );
}
