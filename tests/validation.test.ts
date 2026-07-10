import { describe, expect, it } from "vitest";
import { dailyLogSchema, ratingSchema, restaurantSchema } from "@/lib/validation";

describe("input validation", () => {
  it("accepts valid restaurant payloads", () => {
    expect(
      restaurantSchema.safeParse({
        name: "低敏厨房",
        address: "上海市徐汇区示例路 1 号",
        city: "上海",
        lat: 31.2,
        lng: 121.4,
        tags: ["低FODMAP", "可无洋葱蒜"],
      }).success,
    ).toBe(true);
  });

  it("rejects duplicate-invalid score ranges", () => {
    expect(ratingSchema.safeParse({ fodmapScore: 6, symptomSafetyScore: 5 }).success).toBe(false);
  });

  it("requires at least one meal in daily logs", () => {
    expect(
      dailyLogSchema.safeParse({
        date: new Date(),
        breakfast: [],
        lunch: [],
        dinner: [],
        symptoms: [],
      }).success,
    ).toBe(false);
  });

  it("limits symptom severity to 1 through 5", () => {
    expect(
      dailyLogSchema.safeParse({
        date: new Date(),
        breakfast: ["米饭"],
        lunch: [],
        dinner: [],
        symptoms: [{ symptomType: "腹泻", severity: 6 }],
      }).success,
    ).toBe(false);
  });

  it("limits symptoms to three selected items", () => {
    expect(
      dailyLogSchema.safeParse({
        date: new Date(),
        breakfast: ["米饭"],
        lunch: [],
        dinner: [],
        symptoms: [
          { symptomType: "腹泻", severity: 1 },
          { symptomType: "腹痛", severity: 2 },
          { symptomType: "胀气", severity: 3 },
          { symptomType: "反酸", severity: 4 },
        ],
      }).success,
    ).toBe(false);
  });

  it("accepts daily logs with date and three meals", () => {
    expect(
      dailyLogSchema.safeParse({
        date: "2026-07-10",
        breakfast: ["鸡蛋"],
        lunch: ["米饭", "鸡胸肉"],
        dinner: [],
        symptoms: [{ symptomType: "腹痛", severity: 2 }],
      }).success,
    ).toBe(true);
  });
});
