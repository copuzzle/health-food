import Link from "next/link";
import { LogHistoryList, type LogHistoryItem } from "@/components/log-history-list";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getI18n } from "@/lib/i18n-server";
import { translate } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 14;

type Props = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function LogsHistoryPage({ searchParams }: Props) {
  const { dictionary } = await getI18n();
  const pageParam = Number((await searchParams)?.page ?? "1");
  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const user = await getCurrentUser().catch(() => null);
  let logs: LogHistoryItem[] = [];
  let totalCount = 0;

  if (user) {
    [logs, totalCount] = await Promise.all([
      prisma.dailyLog.findMany({
        where: { userId: user.id },
        include: { symptoms: { orderBy: { symptomType: "asc" } } },
        orderBy: { date: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.dailyLog.count({ where: { userId: user.id } }),
    ]).catch(() => [[], 0]);
  }
  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] bg-white/75 p-5 shadow-soft">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">All History</p>
            <h2 className="text-2xl font-black">{dictionary["history.all"]}</h2>
            <p className="mt-2 text-sm leading-6 text-kelp/65">
              {dictionary["history.description"]}
            </p>
          </div>
          <Link href="/logs" className="shrink-0 rounded-full bg-oat px-3 py-2 text-xs font-black text-kelp">
            {dictionary["common.back"]}
          </Link>
        </div>
        <p className="mt-4 rounded-2xl bg-oat px-4 py-3 text-sm font-bold text-kelp/70">
          {translate(dictionary, "history.summary", { count: totalCount, page, pages: totalPages, size: PAGE_SIZE })}
        </p>
      </section>

      {logs.length > 0 ? (
        <>
          <LogHistoryList logs={logs} />
          <Pagination currentPage={page} hasNext={hasNext} hasPrevious={hasPrevious} previousLabel={dictionary["history.previous"]} nextLabel={dictionary["history.next"]} />
        </>
      ) : (
        <p className="rounded-[2rem] bg-white/60 p-5 text-sm text-kelp/70">
          {user ? dictionary["history.empty"] : dictionary["history.loginHint"]}
        </p>
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  hasNext,
  hasPrevious,
  previousLabel,
  nextLabel,
}: {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  previousLabel: string;
  nextLabel: string;
}) {
  return (
    <nav className="grid grid-cols-2 gap-3">
      {hasPrevious ? (
        <a href={`/logs/history?page=${currentPage - 1}`} className="rounded-2xl bg-white/75 px-4 py-3 text-center text-sm font-black text-kelp shadow-sm">
          {previousLabel}
        </a>
      ) : (
        <span className="rounded-2xl bg-white/45 px-4 py-3 text-center text-sm font-black text-kelp/35">
          {previousLabel}
        </span>
      )}
      {hasNext ? (
        <a href={`/logs/history?page=${currentPage + 1}`} className="rounded-2xl bg-kelp px-4 py-3 text-center text-sm font-black text-oat shadow-sm">
          {nextLabel}
        </a>
      ) : (
        <span className="rounded-2xl bg-white/45 px-4 py-3 text-center text-sm font-black text-kelp/35">
          {nextLabel}
        </span>
      )}
    </nav>
  );
}
