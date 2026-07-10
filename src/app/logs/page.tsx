import Link from "next/link";
import { DailyLogForm } from "@/components/daily-log-form";
import { DEFAULT_SYMPTOM_TYPES } from "@/lib/constants";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { countSymptomsByType, groupSymptomsByDay } from "@/lib/stats";

export const dynamic = "force-dynamic";

type Props = {
  searchParams?: Promise<{ edit?: string }>;
};

export default async function LogsPage({ searchParams }: Props) {
  const editId = (await searchParams)?.edit;
  const user = await getCurrentUser().catch(() => null);
  const logs = user
    ? await prisma.dailyLog.findMany({
        where: { userId: user.id },
        include: { symptoms: { orderBy: { symptomType: "asc" } } },
        orderBy: { date: "desc" },
        take: 30,
      }).catch(() => [])
    : [];
  const symptomPreferences = user
    ? await prisma.symptomPreference.findMany({
        where: { userId: user.id },
        orderBy: { sortOrder: "asc" },
      }).catch(() => [])
    : [];
  const symptomTypes = symptomPreferences.length > 0
    ? symptomPreferences.map((item) => item.name)
    : user
      ? [...DEFAULT_SYMPTOM_TYPES]
      : [];
  const editingLog = logs.find((log) => log.id === editId);

  const symptoms = logs.flatMap((log) => log.symptoms);
  const symptomsForStats = logs.flatMap((log) =>
    log.symptoms.map((symptom) => ({
      symptomType: symptom.symptomType,
      severity: symptom.severity,
      occurredAt: log.date,
    })),
  );
  const byDay = groupSymptomsByDay(symptomsForStats);
  const byType = countSymptomsByType(symptomsForStats);

  return (
    <div className="space-y-5">
      <DailyLogForm
        key={editingLog?.id ?? "new-log"}
        disabled={!user}
        symptomTypes={symptomTypes}
        editingLog={
          editingLog
            ? {
                id: editingLog.id,
                date: editingLog.date.toISOString().slice(0, 10),
                breakfast: editingLog.breakfast,
                lunch: editingLog.lunch,
                dinner: editingLog.dinner,
                notes: editingLog.notes,
                symptoms: editingLog.symptoms.map((symptom) => ({
                  symptomType: symptom.symptomType,
                  severity: symptom.severity,
                })),
              }
            : null
        }
      />

      <section className="grid grid-cols-2 gap-3">
        <SummaryCard label="记录天数" value={logs.length} />
        <SummaryCard label="症状条目" value={symptoms.length} />
      </section>

      <section className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
        <h2 className="text-lg font-black">症状统计</h2>
        <div className="mt-4 space-y-3">
          {Object.entries(byType).length > 0 ? (
            Object.entries(byType).map(([type, stat]) => (
              <div key={type} className="flex items-center justify-between rounded-2xl bg-oat px-4 py-3 text-sm">
                <span className="font-bold">{type}</span>
                <span>{stat.count} 次 / 最高 {formatSeverity(stat.maxSeverity)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-kelp/65">暂无症状统计。</p>
          )}
        </div>
      </section>

      <section className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
        <h2 className="text-lg font-black">按日趋势</h2>
        <div className="mt-4 space-y-3">
          {Object.entries(byDay).length > 0 ? (
            Object.entries(byDay).map(([day, stat]) => (
              <div key={day} className="rounded-2xl bg-oat px-4 py-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-bold">{day}</span>
                  <span>平均严重度 {stat.avgSeverity}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-clay" style={{ width: `${Math.min(stat.avgSeverity * 10, 100)}%` }} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-kelp/65">保存带症状的记录后会显示趋势。</p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-black">最近记录</h2>
        {logs.length > 0 ? (
          logs.map((log) => (
            <article key={log.id} className="rounded-[1.75rem] bg-white/75 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold text-clay">{log.date.toLocaleDateString("zh-CN")}</p>
                <Link
                  href={`/logs?edit=${log.id}`}
                  className="rounded-full bg-kelp px-3 py-1 text-xs font-black text-oat"
                >
                  编辑
                </Link>
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                <MealLine label="早餐" foods={log.breakfast} />
                <MealLine label="午餐" foods={log.lunch} />
                <MealLine label="晚餐" foods={log.dinner} />
              </div>
              {log.notes && <p className="mt-2 text-sm leading-6 text-kelp/70">{log.notes}</p>}
              {log.symptoms.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {log.symptoms.map((symptom) => (
                    <span key={symptom.id} className="rounded-full bg-clay/15 px-3 py-1 text-xs font-bold text-kelp">
                      {symptom.symptomType} {formatSeverity(symptom.severity)} / 5
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))
        ) : (
          <p className="rounded-[2rem] bg-white/60 p-5 text-sm text-kelp/70">
            {user ? "暂无记录。" : "登录后可以创建个人饮食和症状记录。"}
          </p>
        )}
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.5rem] bg-white/75 p-4 text-center shadow-sm">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs text-kelp/60">{label}</p>
    </div>
  );
}

function MealLine({ label, foods }: { label: string; foods: string[] }) {
  return (
    <p className="rounded-2xl bg-oat px-3 py-2">
      <span className="font-black">{label}：</span>
      {foods.length > 0 ? foods.join("，") : "未填写"}
    </p>
  );
}

function formatSeverity(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
