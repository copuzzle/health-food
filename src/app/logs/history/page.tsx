import Link from "next/link";
import { LogHistoryList, type LogHistoryItem } from "@/components/log-history-list";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 14;

type Props = {
  searchParams?: Promise<{ page?: string }>;
};

export default async function LogsHistoryPage({ searchParams }: Props) {
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
            <h2 className="text-2xl font-black">全部历史记录</h2>
            <p className="mt-2 text-sm leading-6 text-kelp/65">
              按日期倒序查看过往饮食和症状记录。编辑会回到登记页修改当天记录。
            </p>
          </div>
          <Link href="/logs" className="shrink-0 rounded-full bg-oat px-3 py-2 text-xs font-black text-kelp">
            返回
          </Link>
        </div>
        <p className="mt-4 rounded-2xl bg-oat px-4 py-3 text-sm font-bold text-kelp/70">
          共 {totalCount} 天记录 · 第 {page} / {totalPages} 页 · 每页最多 {PAGE_SIZE} 条
        </p>
      </section>

      {logs.length > 0 ? (
        <>
          <LogHistoryList logs={logs} />
          <Pagination currentPage={page} hasNext={hasNext} hasPrevious={hasPrevious} />
        </>
      ) : (
        <p className="rounded-[2rem] bg-white/60 p-5 text-sm text-kelp/70">
          {user ? "暂无历史记录。" : "登录后可以查看完整历史记录。"}
        </p>
      )}
    </div>
  );
}

function Pagination({
  currentPage,
  hasNext,
  hasPrevious,
}: {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}) {
  return (
    <nav className="grid grid-cols-2 gap-3">
      {hasPrevious ? (
        <a href={`/logs/history?page=${currentPage - 1}`} className="rounded-2xl bg-white/75 px-4 py-3 text-center text-sm font-black text-kelp shadow-sm">
          上一页
        </a>
      ) : (
        <span className="rounded-2xl bg-white/45 px-4 py-3 text-center text-sm font-black text-kelp/35">
          上一页
        </span>
      )}
      {hasNext ? (
        <a href={`/logs/history?page=${currentPage + 1}`} className="rounded-2xl bg-kelp px-4 py-3 text-center text-sm font-black text-oat shadow-sm">
          下一页
        </a>
      ) : (
        <span className="rounded-2xl bg-white/45 px-4 py-3 text-center text-sm font-black text-kelp/35">
          下一页
        </span>
      )}
    </nav>
  );
}
