import Link from "next/link";
import type { RestaurantSummary } from "@/lib/constants";

export function RestaurantCard({ restaurant }: { restaurant: RestaurantSummary }) {
  return (
    <Link
      href={`/restaurants/${restaurant.id}`}
      className="block rounded-[1.75rem] border border-white/70 bg-white/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-kelp">{restaurant.name}</h3>
          <p className="mt-1 text-sm text-kelp/70">{restaurant.address}</p>
        </div>
        <span className="rounded-full bg-sage/20 px-3 py-1 text-xs font-black text-kelp">
          {restaurant.city}
        </span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {restaurant.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-oat px-3 py-1 text-xs font-bold text-kelp">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
        <Metric label="低FODMAP" value={restaurant.avgFodmapScore} />
        <Metric label="症状安全" value={restaurant.avgSymptomSafetyScore} />
        <Metric label="评分数" value={restaurant.ratingCount} />
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="rounded-2xl bg-kelp/5 px-2 py-2">
      <p className="font-black text-kelp">{value ?? "-"}</p>
      <p className="mt-0.5 text-kelp/60">{label}</p>
    </div>
  );
}
