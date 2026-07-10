import { describe, expect, it } from "vitest";
import { averageRating, summarizeRestaurant } from "@/lib/ratings";

describe("restaurant rating aggregation", () => {
  it("returns null for empty ratings", () => {
    expect(averageRating([], "fodmapScore")).toBeNull();
  });

  it("rounds averages to one decimal place", () => {
    const ratings = [
      { fodmapScore: 5, symptomSafetyScore: 4 },
      { fodmapScore: 4, symptomSafetyScore: 2 },
      { fodmapScore: 2, symptomSafetyScore: 3 },
    ];

    expect(summarizeRestaurant(ratings)).toEqual({
      avgFodmapScore: 3.7,
      avgSymptomSafetyScore: 3,
      ratingCount: 3,
    });
  });
});
