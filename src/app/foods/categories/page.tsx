import Link from "next/link";
import { ScoreBars } from "@/components/sighi-food-browser";
import { getI18n } from "@/lib/i18n-server";
import { getSighiFoodData } from "@/lib/sighi-foods";

export default async function FoodCategoriesPage() {
  const { locale, dictionary } = await getI18n();
  const { categories } = getSighiFoodData();
  const languageIsZh = locale === "zh-CN";

  return (
    <div className="space-y-5">
      <section>
        <Link href="/foods" className="text-sm font-black text-clay">
          {dictionary["common.back"]}
        </Link>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.18em] text-clay">SIGHI</p>
        <h1 className="mt-1 text-2xl font-black">{dictionary["foods.categoriesTitle"]}</h1>
        <p className="mt-2 text-sm leading-6 text-kelp/65">{dictionary["foods.categoriesDescription"]}</p>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-xl font-black">{dictionary["foods.categoryOverviewTitle"]}</h2>
          <p className="text-xs font-bold text-kelp/55">
            {dictionary["foods.categoryCount"].replace("{count}", String(categories.length))}
          </p>
        </div>
        <div className="grid gap-3">
          {categories.map((category) => (
            <Link
              key={category.key}
              href={`/foods?category=${encodeURIComponent(category.key)}`}
              className="rounded-[1.5rem] bg-white/75 p-4 text-left text-kelp shadow-sm transition hover:bg-white"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-black">{languageIsZh ? category.zh : category.en}</p>
                  <p className="mt-1 text-xs text-kelp/55">{languageIsZh ? category.en : category.zh}</p>
                </div>
                <span className="rounded-full bg-citrus px-3 py-1 text-xs font-black text-kelp">{category.count}</span>
              </div>
              <ScoreBars category={category} active={false} dictionary={dictionary} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
