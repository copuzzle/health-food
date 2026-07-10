import { describe, expect, it } from "vitest";
import { dictionaries, localeFromAcceptLanguage, normalizeLocale, translate } from "@/lib/i18n";

describe("i18n", () => {
  it("normalizes supported and unsupported locales", () => {
    expect(normalizeLocale("en")).toBe("en");
    expect(normalizeLocale("zh-CN")).toBe("zh-CN");
    expect(normalizeLocale("fr")).toBe("zh-CN");
  });

  it("selects a supported locale from browser language preferences", () => {
    expect(localeFromAcceptLanguage("en-US,en;q=0.9,zh-CN;q=0.8")).toBe("en");
    expect(localeFromAcceptLanguage("fr-FR;q=0.9,zh-TW;q=0.8,en;q=0.7")).toBe("zh-CN");
    expect(localeFromAcceptLanguage("fr-FR,es;q=0.9")).toBe("zh-CN");
  });

  it("interpolates translated values", () => {
    expect(translate(dictionaries.en, "history.summary", { count: 12, page: 1, pages: 2, size: 14 }))
      .toBe("12 days · Page 1 of 2 · Up to 14 per page");
  });
});
