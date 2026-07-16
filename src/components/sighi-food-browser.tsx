"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Dictionary, Locale } from "@/lib/i18n";
import { translate } from "@/lib/i18n";
import type { SighiCategory, SighiFoodItem, SighiQualityReport, SighiScore } from "@/lib/sighi-foods";

type Props = {
  items: SighiFoodItem[];
  categories: SighiCategory[];
  quality: SighiQualityReport;
  locale: Locale;
  dictionary: Dictionary;
  initialCategoryKey?: string;
  initialScore?: SighiScore | "all";
  initialQuery?: string;
};

const scoreOptions: Array<SighiScore | "all"> = ["all", "0", "1", "2", "3", "?"];
const maxVisibleResults = 80;

export function SighiFoodBrowser({
  items,
  categories,
  quality,
  locale,
  dictionary,
  initialCategoryKey = "all",
  initialScore = "all",
  initialQuery = "",
}: Props) {
  const validInitialCategory = categories.some((category) => category.key === initialCategoryKey) ? initialCategoryKey : "all";
  const validInitialScore = scoreOptions.includes(initialScore) ? initialScore : "all";
  const [draftQuery, setDraftQuery] = useState(initialQuery);
  const [query, setQuery] = useState(initialQuery);
  const [categoryKey, setCategoryKey] = useState(validInitialCategory);
  const [score, setScore] = useState<SighiScore | "all">(validInitialScore);
  const languageIsZh = locale === "zh-CN";

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesCategory = categoryKey === "all" || item.categoryKey === categoryKey;
      const matchesScore = score === "all" || item.score === score;
      const searchable = [
        item.ingredientEn,
        item.ingredientZh,
        item.remarksEn,
        item.remarksZh,
        item.categoryEn,
        item.categoryZh,
      ].join(" ").toLowerCase();
      return matchesCategory && matchesScore && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [categoryKey, items, query, score]);

  const visibleItems = filteredItems.slice(0, maxVisibleResults);
  const hasActiveLookup = query.trim().length > 0 || categoryKey !== "all" || score !== "all";

  return (
    <div className="space-y-5">
      <section className="rounded-[1.5rem] border border-citrus/30 bg-citrus/15 p-4 text-xs leading-5 text-kelp">
        <p className="font-black">{translate(dictionary, "foods.boundaryTitle")}</p>
        <p className="mt-1">{translate(dictionary, "foods.boundaryBody")}</p>
      </section>

      <section className="rounded-[1.5rem] bg-white/80 p-4 shadow-soft">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(draftQuery);
          }}
        >
          <label className="text-xs font-black uppercase tracking-[0.18em] text-clay" htmlFor="food-search">
            {translate(dictionary, "foods.searchLabel")}
          </label>
          <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
            <input
              id="food-search"
              value={draftQuery}
              onChange={(event) => setDraftQuery(event.target.value)}
              placeholder={translate(dictionary, "foods.searchPlaceholder")}
              className="min-w-0 rounded-2xl border-0 bg-oat px-4 py-3 text-base font-bold text-kelp shadow-inner placeholder:text-kelp/35 focus:ring-2 focus:ring-citrus"
            />
            <button type="submit" className="rounded-2xl bg-kelp px-4 py-3 text-sm font-black text-oat shadow-sm">
              {translate(dictionary, "foods.searchButton")}
            </button>
          </div>
        </form>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-bold text-kelp/60">{translate(dictionary, "foods.categoryLabel")}</span>
            <select
              value={categoryKey}
              onChange={(event) => setCategoryKey(event.target.value)}
              className="mt-1 w-full rounded-2xl border-0 bg-oat px-4 py-3 text-sm font-bold text-kelp focus:ring-2 focus:ring-citrus"
            >
              <option value="all">{translate(dictionary, "foods.allCategories")}</option>
              {categories.map((category) => (
                <option key={category.key} value={category.key}>
                  {languageIsZh ? category.zh : category.en} ({category.count})
                </option>
              ))}
            </select>
          </label>

          <div>
            <p className="text-xs font-bold text-kelp/60">{translate(dictionary, "foods.scoreLabel")}</p>
            <div className="mt-1 grid grid-cols-6 gap-1 rounded-2xl bg-oat p-1">
              {scoreOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setScore(option)}
                  className={`min-h-10 rounded-xl px-1 text-sm font-black ${
                    score === option ? "bg-kelp text-oat" : "text-kelp/70"
                  }`}
                  aria-pressed={score === option}
                >
                  {option === "all" ? translate(dictionary, "foods.allScores") : option}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-oat px-4 py-3">
          <p className="text-xs font-bold text-kelp/60">{translate(dictionary, "foods.categoryOverviewHint")}</p>
          <Link href="/foods/categories" className="shrink-0 rounded-full bg-white px-3 py-2 text-xs font-black text-kelp">
            {translate(dictionary, "foods.categoryOverviewLink")}
          </Link>
        </div>
      </section>

      {hasActiveLookup && (
        <section className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">{translate(dictionary, "foods.resultsEyebrow")}</p>
              <h2 className="text-xl font-black">{translate(dictionary, "foods.resultsTitle")}</h2>
            </div>
            <p className="text-xs font-bold text-kelp/55">
              {translate(dictionary, "foods.resultCount", { count: filteredItems.length })}
            </p>
          </div>

          {visibleItems.length > 0 ? (
            <div className="space-y-3">
              {visibleItems.map((item) => (
                <FoodCard key={item.id} item={item} languageIsZh={languageIsZh} />
              ))}
              {filteredItems.length > visibleItems.length && (
                <p className="rounded-[1.5rem] bg-white/60 p-4 text-center text-xs font-bold text-kelp/60">
                  {translate(dictionary, "foods.resultLimit", { count: visibleItems.length })}
                </p>
              )}
            </div>
          ) : (
            <p className="rounded-[1.5rem] bg-white/70 p-5 text-sm text-kelp/65">{translate(dictionary, "foods.noResults")}</p>
          )}
        </section>
      )}

      <section className="rounded-[1.5rem] bg-white/65 p-4 text-xs leading-5 text-kelp/65">
        <p className="font-black text-kelp">{translate(dictionary, "foods.validationTitle")}</p>
        <p className="mt-1">
          {translate(dictionary, "foods.validationBody", {
            raw: quality.rawRows,
            usable: quality.usableItems,
            skipped: quality.skippedRows,
            categories: quality.categories,
            sourceUpdated: quality.sourceUpdated,
          })}
        </p>
      </section>

      <IndicatorGuide dictionary={dictionary} />
    </div>
  );
}

function IndicatorGuide({ dictionary }: { dictionary: Dictionary }) {
  const scoreItems = [
    ["0", "foods.score0"],
    ["1", "foods.score1"],
    ["2", "foods.score2"],
    ["3", "foods.score3"],
    ["?", "foods.scoreUnknown"],
  ];
  const indicatorItems = [
    ["H!", "foods.indicatorHStrong"],
    ["H", "foods.indicatorH"],
    ["A", "foods.indicatorA"],
    ["L", "foods.indicatorL"],
    ["B", "foods.indicatorB"],
  ];

  return (
    <section className="rounded-[1.5rem] bg-white/75 p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-clay">{translate(dictionary, "foods.indicatorEyebrow")}</p>
      <h2 className="mt-1 text-lg font-black">{translate(dictionary, "foods.indicatorTitle")}</h2>
      <p className="mt-2 text-xs leading-5 text-kelp/65">{translate(dictionary, "foods.indicatorBody")}</p>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-black text-kelp/60">{translate(dictionary, "foods.scoreGuideTitle")}</p>
          <div className="mt-2 grid gap-2">
            {scoreItems.map(([label, key]) => (
              <div key={label} className="grid grid-cols-[2.25rem_1fr] items-start gap-3 rounded-2xl bg-oat px-3 py-2">
                <span className={`rounded-xl px-2 py-1 text-center text-sm font-black ${scoreClassName(label as SighiScore)}`}>
                  {label}
                </span>
                <span className="text-xs leading-5 text-kelp/75">{translate(dictionary, key)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-black text-kelp/60">{translate(dictionary, "foods.mechanismGuideTitle")}</p>
          <div className="mt-2 grid gap-2">
            {indicatorItems.map(([label, key]) => (
              <div key={label} className="grid grid-cols-[2.25rem_1fr] items-start gap-3 rounded-2xl bg-oat px-3 py-2">
                <span className="rounded-xl bg-sage/20 px-2 py-1 text-center text-sm font-black text-kelp">{label}</span>
                <span className="text-xs leading-5 text-kelp/75">{translate(dictionary, key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FoodCard({ item, languageIsZh }: { item: SighiFoodItem; languageIsZh: boolean }) {
  const indicators = [
    ["H", item.h],
    ["A", item.a],
    ["L", item.l],
    ["B", item.b],
  ].filter(([, value]) => value);

  return (
    <article className="rounded-[1.5rem] bg-white/80 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-black leading-6">{languageIsZh ? item.ingredientZh : item.ingredientEn}</p>
          <p className="mt-1 text-xs font-bold text-kelp/50">{languageIsZh ? item.ingredientEn : item.ingredientZh}</p>
        </div>
        <span className={`rounded-2xl px-3 py-2 text-base font-black ${scoreClassName(item.score)}`}>
          {item.score}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-oat px-3 py-1 text-xs font-bold text-kelp/70">
          {languageIsZh ? item.categoryZh : item.categoryEn}
        </span>
        {indicators.map(([label, value]) => (
          <span key={label} className="rounded-full bg-sage/20 px-3 py-1 text-xs font-black text-kelp">
            {label}: {value}
          </span>
        ))}
      </div>

      {(item.remarksEn || item.remarksZh) && (
        <div className="mt-3 space-y-1 rounded-2xl bg-oat p-3 text-xs leading-5 text-kelp/75">
          {item.remarksZh && <p>{item.remarksZh}</p>}
          {item.remarksEn && <p className="text-kelp/50">{item.remarksEn}</p>}
        </div>
      )}
    </article>
  );
}

export function ScoreBars({ category, active, dictionary }: { category: SighiCategory; active: boolean; dictionary: Dictionary }) {
  const total = Math.max(category.count, 1);
  return (
    <div className="mt-3 grid grid-cols-5 gap-1">
      {(["0", "1", "2", "3", "?"] as SighiScore[]).map((score) => (
        <div key={score}>
          <div className={`h-2 overflow-hidden rounded-full ${active ? "bg-oat/20" : "bg-oat"}`}>
            <div className="h-full bg-citrus" style={{ width: `${(category.scoreCounts[score] / total) * 100}%` }} />
          </div>
          <p className={`mt-1 text-[10px] font-black ${active ? "text-oat/70" : "text-kelp/45"}`}>
            {translate(dictionary, "foods.scoreShort", { score, count: category.scoreCounts[score] })}
          </p>
        </div>
      ))}
    </div>
  );
}

function scoreClassName(score: SighiScore) {
  if (score === "0") return "bg-sage/25 text-kelp";
  if (score === "1") return "bg-citrus/35 text-kelp";
  if (score === "2") return "bg-clay/25 text-kelp";
  if (score === "3") return "bg-clay text-white";
  return "bg-oat text-kelp";
}
