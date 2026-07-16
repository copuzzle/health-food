import { SighiFoodBrowser } from "@/components/sighi-food-browser";
import { getI18n } from "@/lib/i18n-server";
import type { SighiScore } from "@/lib/sighi-foods";
import { getSighiFoodData } from "@/lib/sighi-foods";

type Props = {
  searchParams?: Promise<{ category?: string; score?: string; q?: string }>;
};

const scores = new Set(["all", "0", "1", "2", "3", "?"]);

export default async function FoodsPage({ searchParams }: Props) {
  const { locale, dictionary } = await getI18n();
  const data = getSighiFoodData();
  const params = await searchParams;
  const initialScore = scores.has(params?.score ?? "") ? (params?.score as SighiScore | "all") : "all";

  return (
    <div className="space-y-5">
      <section>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">SIGHI</p>
        <h1 className="mt-1 text-2xl font-black">{dictionary["foods.title"]}</h1>
        <p className="mt-2 text-sm leading-6 text-kelp/65">{dictionary["foods.description"]}</p>
      </section>
      <SighiFoodBrowser
        items={data.items}
        categories={data.categories}
        quality={data.quality}
        locale={locale}
        dictionary={dictionary}
        initialCategoryKey={params?.category}
        initialScore={initialScore}
        initialQuery={params?.q ?? ""}
      />
    </div>
  );
}
