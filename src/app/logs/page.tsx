import Link from "next/link";
import { DailyLogForm } from "@/components/daily-log-form";
import { LogHistoryList } from "@/components/log-history-list";
import { SymptomTrendChart } from "@/components/symptom-trend-chart";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { countSymptomsByType } from "@/lib/stats";

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
        take: 90,
      }).catch(() => [])
    : [];
  const symptomPreferences = user
    ? await prisma.symptomPreference.findMany({
        where: { userId: user.id },
        orderBy: { sortOrder: "asc" },
      }).catch(() => [])
    : [];
  const symptomTypes = symptomPreferences.map((item) => item.name);
  const editingLog = logs.find((log) => log.id === editId);

  const symptoms = logs.flatMap((log) => log.symptoms);
  const symptomsForStats = logs.flatMap((log) =>
    log.symptoms.map((symptom) => ({
      symptomType: symptom.symptomType,
      severity: symptom.severity,
      occurredAt: log.date,
    })),
  );
  const byType = countSymptomsByType(symptomsForStats);
  const recentLogs = logs.slice(0, 2);

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
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">History</p>
            <h2 className="text-xl font-black">历史记录</h2>
          </div>
          <Link href="/logs/history" className="rounded-full bg-kelp px-3 py-1 text-xs font-black text-oat">
            查看全部
          </Link>
        </div>
        {logs.length > 0 ? (
          <>
            <p className="mt-3 text-xs font-bold text-kelp/55">
              当前页只显示最近 {recentLogs.length} 天，更多记录进入完整历史页查看。
            </p>
            <div className="mt-4">
              <LogHistoryList logs={recentLogs} />
            </div>
          </>
        ) : (
          <p className="mt-4 rounded-[1.5rem] bg-oat p-5 text-sm text-kelp/70">
            {user ? "暂无历史记录。保存后会按日期显示在这里。" : "登录后可以查看过去多天的个人饮食和症状记录。"}
          </p>
        )}
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

      {symptomTypes.length > 0 && (
        <section className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
          <h2 className="text-lg font-black">按日趋势</h2>
          <p className="mt-1 text-xs text-kelp/55">展示你在“我的”中设置的症状指标，最多显示最近 7 天</p>
          <div className="mt-4">
            <SymptomTrendChart logs={logs} symptomTypes={symptomTypes} />
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-black">更多分析</h2>
        <p className="rounded-[2rem] bg-white/60 p-5 text-sm leading-6 text-kelp/70">
          后续可以在这里加入按食物和连续天数的筛选。当前先保证多天记录可浏览、可编辑。
        </p>
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

function formatSeverity(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}
