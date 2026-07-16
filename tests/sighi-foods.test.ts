import { describe, expect, it } from "vitest";
import { getSighiFoodData } from "@/lib/sighi-foods";

describe("SIGHI food data", () => {
  it("skips extraction residue and exposes usable food rows", () => {
    const data = getSighiFoodData();

    expect(data.quality.rawRows).toBe(931);
    expect(data.quality.rawItems).toBe(904);
    expect(data.quality.usableItems).toBe(903);
    expect(data.quality.skippedRows).toBe(1);
    expect(data.quality.sourceFile).toBe("data/sighi-foods.json");
    expect(data.items.some((item) => item.ingredientEn === "Ingredients")).toBe(false);
  });

  it("uses reviewed category labels instead of truncated PDF extraction labels", () => {
    const data = getSighiFoodData();

    expect(data.categories.map((category) => category.en)).toContain("Sea food");
    expect(data.categories.map((category) => category.en)).toContain("Starch suppliers");
    expect(data.categories.map((category) => category.en)).not.toContain("Sea fo");
    expect(data.categories.map((category) => category.en)).not.toContain("getab Starc");
  });

  it("keeps bilingual indicators for food lookup", () => {
    const data = getSighiFoodData();
    const eggWhite = data.items.find((item) => item.ingredientEn === "egg white");

    expect(eggWhite).toMatchObject({
      score: "2",
      l: "L",
      ingredientZh: "蛋清",
      categoryEn: "Eggs",
      categoryZh: "蛋类",
    });
  });
});
