import Link from "next/link";
import { notFound } from "next/navigation";
import { RatingForm } from "@/components/rating-form";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeRestaurant } from "@/lib/ratings";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function RestaurantDetailPage({ params }: Props) {
  const { id } = await params;
  const [user, restaurant] = await Promise.all([
    getCurrentUser().catch(() => null),
    prisma.restaurant.findUnique({
      where: { id },
      include: {
        ratings: {
          orderBy: { createdAt: "desc" },
          include: { user: { select: { email: true, name: true } } },
        },
      },
    }),
  ]);

  if (!restaurant) {
    notFound();
  }

  const summary = summarizeRestaurant(restaurant.ratings);

  return (
    <div className="space-y-5">
      <Link href="/" className="text-sm font-bold text-kelp/70">← 返回地图</Link>
      <section className="rounded-[2rem] bg-kelp p-5 text-oat shadow-soft">
        <p className="text-sm text-citrus">{restaurant.city}</p>
        <h2 className="mt-2 text-3xl font-black">{restaurant.name}</h2>
        <p className="mt-3 text-sm leading-6 text-oat/75">{restaurant.address}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {restaurant.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-oat/15 px-3 py-1 text-xs font-black">{tag}</span>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <Metric label="低FODMAP" value={summary.avgFodmapScore} />
        <Metric label="症状安全" value={summary.avgSymptomSafetyScore} />
        <Metric label="评分数" value={summary.ratingCount} />
      </section>

      <RatingForm restaurantId={restaurant.id} disabled={!user} />

      <section className="space-y-3">
        <h2 className="text-xl font-black">社区评价</h2>
        {restaurant.ratings.length > 0 ? (
          restaurant.ratings.map((rating) => (
            <article key={rating.id} className="rounded-[1.75rem] bg-white/75 p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="font-black">{rating.user.name ?? rating.user.email.split("@")[0]}</p>
                <p className="text-xs text-kelp/60">{rating.createdAt.toLocaleDateString("zh-CN")}</p>
              </div>
              <p className="mt-2 text-sm text-kelp/70">低FODMAP {rating.fodmapScore} / 症状安全 {rating.symptomSafetyScore}</p>
              {rating.comment && <p className="mt-3 text-sm leading-6 text-kelp">{rating.comment}</p>}
            </article>
          ))
        ) : (
          <p className="rounded-[2rem] bg-white/60 p-5 text-sm text-kelp/70">还没有评分。</p>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-[1.5rem] bg-white/75 p-4 text-center shadow-sm">
      <p className="text-xl font-black">{value ?? "-"}</p>
      <p className="mt-1 text-xs text-kelp/60">{label}</p>
    </div>
  );
}
