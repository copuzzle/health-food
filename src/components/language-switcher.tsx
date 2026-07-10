"use client";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import type { Locale } from "@/lib/i18n";

export function LanguageSwitcher() {
  const router = useRouter();
  const { locale, t } = useI18n();
  function changeLocale(next: Locale) {
    document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }
  return <label className="flex items-center gap-2 text-xs font-bold text-kelp/65">
    <span className="sr-only">{t("language.label")}</span>
    <select aria-label={t("language.label")} value={locale} onChange={(e) => changeLocale(e.target.value as Locale)} className="rounded-full border-kelp/15 bg-white/75 py-1.5 pl-3 pr-8 text-xs font-bold text-kelp">
      <option value="zh-CN">{t("language.zh")}</option><option value="en">{t("language.en")}</option>
    </select>
  </label>;
}
