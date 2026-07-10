import Link from "next/link";
import { getI18n } from "@/lib/i18n-server";

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

export async function LogHistoryList({ logs }: { logs: LogHistoryItem[] }) {
  const { locale, dictionary } = await getI18n();
  const logsByMonth = groupLogsByMonth(logs, locale);

  return (
    <div className="space-y-5">
      {logsByMonth.map((group) => (
        <div key={group.month} className="space-y-3">
          <div className="sticky top-3 z-10 rounded-full bg-oat/95 px-4 py-2 text-xs font-black text-kelp shadow-sm backdrop-blur">
            {group.month}
          </div>
          {group.logs.map((log) => (
            <LogCard key={log.id} log={log} locale={locale} dictionary={dictionary} />
          ))}
        </div>
      ))}
    </div>
  );
}

function groupLogsByMonth(logs: LogHistoryItem[], locale: string) {
  const groups = new Map<string, LogHistoryItem[]>();

  for (const log of logs) {
    const month = log.date.toLocaleDateString(locale, {
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

function LogCard({ log, locale, dictionary }: { log: LogHistoryItem; locale: string; dictionary: Record<string, string> }) {
  return (
    <article className="rounded-[1.75rem] bg-oat/75 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-black text-kelp">{formatDateLabel(log.date, locale)}</p>
          <p className="text-xs font-bold text-kelp/50">{formatWeekday(log.date, locale)}</p>
        </div>
        <Link
          href={`/logs?edit=${log.id}`}
          className="rounded-full bg-kelp px-3 py-1 text-xs font-black text-oat"
        >
          {dictionary["common.edit"]}
        </Link>
      </div>
      <div className="mt-3 grid gap-2 text-sm">
        <MealLine label={dictionary["meal.breakfast"]} foods={log.breakfast} emptyLabel={dictionary["common.notFilled"]} locale={locale} />
        <MealLine label={dictionary["meal.lunch"]} foods={log.lunch} emptyLabel={dictionary["common.notFilled"]} locale={locale} />
        <MealLine label={dictionary["meal.dinner"]} foods={log.dinner} emptyLabel={dictionary["common.notFilled"]} locale={locale} />
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

function MealLine({ label, foods, emptyLabel, locale }: { label: string; foods: string[]; emptyLabel: string; locale: string }) {
  return (
    <p className="rounded-2xl bg-white/70 px-3 py-2">
      <span className="font-black">{label}：</span>
      {foods.length > 0 ? foods.join(locale === "en" ? ", " : "，") : emptyLabel}
    </p>
  );
}

function formatSeverity(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function formatDateLabel(date: Date, locale: string) {
  return date.toLocaleDateString(locale, {
    month: "numeric",
    day: "numeric",
  });
}

function formatWeekday(date: Date, locale: string) {
  return date.toLocaleDateString(locale, {
    weekday: "long",
  });
}
