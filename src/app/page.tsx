import { AmapMap } from "@/components/amap-map";
import { RestaurantCard } from "@/components/restaurant-card";
import { RestaurantCreateForm } from "@/components/restaurant-create-form";
import { HealthDisclaimer } from "@/components/health-disclaimer";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { summarizeRestaurant } from "@/lib/ratings";
import type { RestaurantSummary } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function getRestaurants(): Promise<{ restaurants: RestaurantSummary[]; dbReady: boolean }> {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: { ratings: { select: { fodmapScore: true, symptomSafetyScore: true } } },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return {
      dbReady: true,
      restaurants: restaurants.map((restaurant) => ({
        id: restaurant.id,
        name: restaurant.name,
        address: restaurant.address,
        city: restaurant.city,
        lat: restaurant.lat,
        lng: restaurant.lng,
        tags: restaurant.tags,
        ...summarizeRestaurant(restaurant.ratings),
      })),
    };
  } catch {
    return { restaurants: [], dbReady: false };
  }
}

export default async function Home() {
  const [user, data] = await Promise.all([getCurrentUser().catch(() => null), getRestaurants()]);

  return (
    <div className="space-y-5">
      {!data.dbReady && <DatabaseSetupNotice />}
      <HealthDisclaimer />
      <section className="rounded-[2rem] bg-kelp p-5 text-oat shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-citrus">Community Map</p>
        <h2 className="mt-2 text-3xl font-black leading-tight">找到更容易沟通的低FODMAP餐馆</h2>
        <p className="mt-3 text-sm leading-6 text-oat/75">
          社区提交餐馆、可调整标签和体验评分。评分代表个人经验，不等同于医疗建议。
        </p>
      </section>

      <AmapMap restaurants={data.restaurants} />

      <RestaurantCreateForm disabled={!user || !data.dbReady} />

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">Restaurants</p>
            <h2 className="text-xl font-black">餐馆列表</h2>
          </div>
          <p className="text-sm text-kelp/60">{data.restaurants.length} 家</p>
        </div>
        {data.restaurants.length > 0 ? (
          data.restaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)
        ) : (
          <div className="rounded-[2rem] bg-white/60 p-6 text-sm leading-6 text-kelp/70">
            暂无餐馆。登录后可以提交第一家低FODMAP友好餐馆。
          </div>
        )}
      </section>
    </div>
  );
}

function DatabaseSetupNotice() {
  return (
    <section className="rounded-[2rem] border border-clay/30 bg-clay/10 p-4 text-sm leading-6 text-kelp">
      <strong className="font-black">数据库未就绪：</strong>
      配置 `.env` 中的 `DATABASE_URL` 后运行 `npm run prisma:migrate`，即可启用餐馆、登录和记录功能。
    </section>
  );
}
