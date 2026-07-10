import Link from "next/link";

export type LogHistoryItem = {
  id: string;
  date: Date;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  notes: string | null;
  symptoms: Array<{
    id: string;
    symptomType: string;
    severity: number;
  }>;
};

export function LogHistoryList({ logs }: { logs: LogHistoryItem[] }) {
  const logsByMonth = groupLogsByMonth(logs);

  return (
    <div className="space-y-5">
      {logsByMonth.map((group) => (
        <div key={group.month} className="space-y-3">
          <div className="sticky top-3 z-10 rounded-full bg-oat/95 px-4 py-2 text-xs font-black text-kelp shadow-sm backdrop-blur">
            {group.month}
          </div>
          {group.logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}
        </div>
      ))}
    </div>
  );
}

function groupLogsByMonth(logs: LogHistoryItem[]) {
  const groups = new Map<string, LogHistoryItem[]>();

  for (const log of logs) {
    const month = log.date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
    });
    groups.set(month, [...(groups.get(month) ?? []), log]);
  }

  return Array.from(groups.entries()).map(([month, groupedLogs]) => ({
    month,
    logs: groupedLogs,
  }));
}

function LogCard({ log }: { log: LogHistoryItem }) {
  return (
    <article className="rounded-[1.75rem] bg-oat/75 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-black text-kelp">{formatDateLabel(log.date)}</p>
          <p className="text-xs font-bold text-kelp/50">{formatWeekday(log.date)}</p>
        </div>
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
  );
}

function MealLine({ label, foods }: { label: string; foods: string[] }) {
  return (
    <p className="rounded-2xl bg-white/70 px-3 py-2">
      <span className="font-black">{label}：</span>
      {foods.length > 0 ? foods.join("，") : "未填写"}
    </p>
  );
}

function formatSeverity(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString("zh-CN", {
    month: "numeric",
    day: "numeric",
  });
}

function formatWeekday(date: Date) {
  return date.toLocaleDateString("zh-CN", {
    weekday: "long",
  });
}
